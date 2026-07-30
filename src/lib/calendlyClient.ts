import type { LeadRegion } from "@/lib/leadNotify"

/**
 * Thin server-side wrapper around the Calendly v2 API for the custom
 * scheduling component. The PAT lives in CALENDLY_API_TOKEN — never expose
 * it (or these calls) client-side.
 */

const CALENDLY_API = "https://api.calendly.com"

/**
 * Regional 30-minute consultation event types on the
 * global-calendar-fruitionservices account. Verified 2026-07-29.
 */
export const REGION_EVENT_TYPES: Record<LeadRegion, string> = {
  APAC: "https://api.calendly.com/event_types/377b37e5-6cbc-4ed1-b27d-6865363e4534",
  SEA: "https://api.calendly.com/event_types/b46e38ae-b292-47f1-a348-45274bb7e64d",
  // No India calendar exists yet — South-East Asia is the nearest timezone
  // window. Point this at an India event type once one is created.
  IND: "https://api.calendly.com/event_types/b46e38ae-b292-47f1-a348-45274bb7e64d",
  UK: "https://api.calendly.com/event_types/7f6f81d8-585b-49b2-a73d-f1333bd59ab5",
  NA: "https://api.calendly.com/event_types/b9e04736-439e-4948-964c-6ce99b960665",
}

function getToken(): string {
  const t = process.env.CALENDLY_API_TOKEN
  if (!t) throw new Error("CALENDLY_API_TOKEN missing")
  return t
}

async function calendly<T>(path: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(`${CALENDLY_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  })
  const text = await r.text()
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    throw new Error(`calendly non-JSON ${r.status}: ${text.slice(0, 200)}`)
  }
  if (!r.ok) {
    const detail = (body as { message?: string; title?: string })?.message || (body as { title?: string })?.title || `HTTP ${r.status}`
    throw new Error(`calendly ${path.split("?")[0]} failed: ${detail}`)
  }
  return body as T
}

export interface CalendlySlot {
  /** UTC ISO start time */
  start: string
  /** Calendly's per-slot booking page (fallback when API booking fails) */
  url: string
}

/**
 * Available slots for a region's consultation event type. Calendly caps each
 * request at a 7-day window, so two windows are fetched for a 14-day view.
 */
export async function getAvailableSlots(region: LeadRegion): Promise<CalendlySlot[]> {
  const eventType = REGION_EVENT_TYPES[region]
  // Start an hour out so we never offer a slot that expires mid-booking.
  const from = new Date(Date.now() + 60 * 60 * 1000)
  const windows: [Date, Date][] = [
    [from, new Date(from.getTime() + 7 * 86400_000)],
    [new Date(from.getTime() + 7 * 86400_000), new Date(from.getTime() + 14 * 86400_000)],
  ]
  const results = await Promise.all(
    windows.map(async ([s, e]) => {
      try {
        const data = await calendly<{ collection: { start_time: string; scheduling_url: string; status: string }[] }>(
          `/event_type_available_times?event_type=${encodeURIComponent(eventType)}&start_time=${s.toISOString()}&end_time=${e.toISOString()}`,
        )
        return data.collection
      } catch (err) {
        console.warn("[scheduling] availability window failed:", err instanceof Error ? err.message : String(err))
        return []
      }
    }),
  )
  return results
    .flat()
    .filter((s) => s.status === "available")
    .map((s) => ({ start: s.start_time, url: s.scheduling_url }))
}

export interface BookingRequest {
  region: LeadRegion
  /** UTC ISO start time, must come from getAvailableSlots */
  start: string
  name: string
  email: string
  timezone: string
  phone?: string
  /** Site path the booking started from — carried as utm_content. */
  sourcePage?: string
}

/**
 * Book the slot via Calendly's create-invitee API. Marked with
 * utm_source=fruition-scheduler so the invitee.created webhook can tell
 * API-created bookings apart from ones made on calendly.com directly.
 * Throws when the API rejects (caller falls back to the slot URL).
 */
export async function createBooking(req: BookingRequest): Promise<{ inviteeUri: string }> {
  const data = await calendly<{ resource: { uri: string } }>("/invitees", {
    method: "POST",
    body: JSON.stringify({
      event_type: REGION_EVENT_TYPES[req.region],
      start_time: req.start,
      invitee: {
        name: req.name,
        email: req.email,
        timezone: req.timezone,
        ...(req.phone ? { text_reminder_number: req.phone } : {}),
      },
      tracking: {
        utm_source: "fruition-scheduler",
        utm_campaign: null,
        utm_medium: "website",
        utm_content: req.sourcePage ?? null,
        utm_term: null,
        salesforce_uuid: null,
      },
    }),
  })
  return { inviteeUri: data.resource.uri }
}
