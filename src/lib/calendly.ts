/**
 * Server-side Calendly API client.
 *
 * Powers the custom, on-brand booking widget (see components/sections/calendly)
 * so we never render Calendly's iframe. All calls are server-only — the token
 * never reaches the browser.
 *
 * Env:
 *   CALENDLY_API_TOKEN      — Personal Access Token for the Fruition Calendly
 *                             account that owns the consult event type.
 *   CALENDLY_EVENT_TYPE_URI — Canonical event-type URI to book against, e.g.
 *                             https://api.calendly.com/event_types/<uuid>
 *
 * If either is unset, isConfigured() returns false and the widget falls back to
 * the legacy Calendly embed so nothing breaks before the env is provisioned.
 *
 * API contract (Calendly v2, host https://api.calendly.com):
 *   GET  /event_types/{uuid}                 → event-type meta
 *   GET  /users/{uuid}                        → host name / avatar / timezone
 *   GET  /event_type_available_times          → bookable slots (future-only, ≤7d window)
 *   POST /invitees                            → create a booking (201; 403 on free plans)
 */

const API_BASE = "https://api.calendly.com"

/** Max span the availability route will fetch, to bound the number of ≤7-day calls. */
export const MAX_AVAILABILITY_DAYS = 42
const WINDOW_MS = 7 * 24 * 60 * 60 * 1000
/** Small buffer so the "future-only" start bound is never rejected as past. */
const FUTURE_BUFFER_MS = 60 * 1000

export interface CalendlyConfig {
  token: string
  eventTypeUri: string
}

export function getCalendlyConfig(): CalendlyConfig | null {
  const token = process.env.CALENDLY_API_TOKEN
  const eventTypeUri = process.env.CALENDLY_EVENT_TYPE_URI
  if (!token || !eventTypeUri) return null
  return { token, eventTypeUri }
}

export function isConfigured(): boolean {
  return getCalendlyConfig() !== null
}

class CalendlyError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message)
    this.name = "CalendlyError"
  }
}
export { CalendlyError }

async function calendlyFetch<T>(
  path: string,
  token: string,
  init?: RequestInit & { next?: { revalidate?: number } },
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    let body: unknown
    try {
      body = await res.json()
    } catch {
      body = await res.text().catch(() => undefined)
    }
    const detail =
      body && typeof body === "object" && "message" in body
        ? String((body as { message?: unknown }).message)
        : res.statusText
    throw new CalendlyError(`Calendly ${path} → ${res.status}: ${detail}`, res.status, body)
  }
  return (await res.json()) as T
}

/* ------------------------------------------------------------------ *
 * Raw Calendly resource shapes (only the fields we use)
 * ------------------------------------------------------------------ */

export interface CalendlyCustomQuestion {
  name: string
  type: string
  position: number
  enabled: boolean
  required: boolean
  answer_choices: string[]
  include_other: boolean
}

interface CalendlyLocation {
  kind: string
  location?: string | null
  additional_info?: string | null
}

interface EventTypeResource {
  uri: string
  name: string
  duration: number
  scheduling_url: string
  active: boolean
  /** null for solo event types; "round_robin" / "collective" for pooled ones. */
  pooling_type: string | null
  locations: CalendlyLocation[] | null
  custom_questions: CalendlyCustomQuestion[]
  profile?: { name?: string; owner?: string }
}

interface UserResource {
  uri: string
  name: string
  avatar_url: string | null
  timezone: string
  scheduling_url: string
}

interface AvailableTimeSlot {
  status: string
  invitees_remaining: number
  start_time: string
  scheduling_url: string
}

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */

export async function getEventType(token: string, uri: string): Promise<EventTypeResource> {
  const { resource } = await calendlyFetch<{ resource: EventTypeResource }>(uri, token, {
    method: "GET",
    next: { revalidate: 300 },
  })
  return resource
}

export async function getUser(token: string, uri: string): Promise<UserResource> {
  const { resource } = await calendlyFetch<{ resource: UserResource }>(uri, token, {
    method: "GET",
    next: { revalidate: 3600 },
  })
  return resource
}

/**
 * Fetch bookable slots across an arbitrary range by splitting into ≤7-day
 * windows (Calendly's per-request cap) and merging. Start is clamped to the
 * near future because Calendly rejects past start times. Windows are fetched in
 * parallel; a single failing window degrades to "no slots" rather than failing
 * the whole range.
 */
export async function getAvailableTimes(
  token: string,
  eventTypeUri: string,
  startMs: number,
  endMs: number,
): Promise<AvailableTimeSlot[]> {
  const now = Date.now()
  let start = Math.max(startMs, now + FUTURE_BUFFER_MS)
  const end = Math.min(endMs, start + MAX_AVAILABILITY_DAYS * 24 * 60 * 60 * 1000)
  if (end <= start) return []

  const windows: Array<{ start: string; end: string }> = []
  while (start < end) {
    const windowEnd = Math.min(start + WINDOW_MS, end)
    windows.push({ start: new Date(start).toISOString(), end: new Date(windowEnd).toISOString() })
    start = windowEnd
  }

  const results = await Promise.all(
    windows.map(async (w) => {
      const params = new URLSearchParams({
        event_type: eventTypeUri,
        start_time: w.start,
        end_time: w.end,
      })
      try {
        const data = await calendlyFetch<{ collection: AvailableTimeSlot[] }>(
          `/event_type_available_times?${params.toString()}`,
          token,
          { method: "GET", next: { revalidate: 45 } },
        )
        return data.collection ?? []
      } catch {
        return []
      }
    }),
  )

  return results
    .flat()
    .filter((s) => s.status === "available")
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
}

/* ------------------------------------------------------------------ *
 * Write (booking)
 * ------------------------------------------------------------------ */

export interface CreateInviteePayload {
  event_type: string
  start_time: string
  invitee: {
    name?: string
    first_name?: string
    last_name?: string
    email: string
    timezone: string
    text_reminder_number?: string
  }
  questions_and_answers?: Array<{ question: string; answer: string; position: number }>
  event_guests?: string[]
  location?: Record<string, unknown>
}

export interface CreatedInvitee {
  uri: string
  name: string
  email: string
  status: string
  timezone: string
  event?: string
  reschedule_url?: string
  cancel_url?: string
}

export async function createInvitee(
  token: string,
  payload: CreateInviteePayload,
): Promise<CreatedInvitee> {
  const { resource } = await calendlyFetch<{ resource: CreatedInvitee }>("/invitees", token, {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  return resource
}

/* ------------------------------------------------------------------ *
 * View-model helpers
 * ------------------------------------------------------------------ */

const LOCATION_LABELS: Record<string, string> = {
  google_conference: "Google Meet",
  zoom_conference: "Zoom",
  gotomeeting_conference: "GoToMeeting",
  microsoft_teams_conference: "Microsoft Teams",
  webex_conference: "Webex",
  physical: "In person",
  inbound_call: "Phone call",
  outbound_call: "Phone call",
  custom: "Custom",
  ask_invitee: "Invitee chooses",
}

export function locationLabel(loc: CalendlyLocation | undefined): { kind: string; label: string } | null {
  if (!loc) return null
  const label = LOCATION_LABELS[loc.kind] ?? loc.location ?? "Online meeting"
  return { kind: loc.kind, label }
}

export function firstLocation(et: EventTypeResource): CalendlyLocation | undefined {
  return et.locations?.[0]
}
