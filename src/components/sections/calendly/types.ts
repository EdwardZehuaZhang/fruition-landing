/**
 * Shared view-model types for the custom Calendly booking widget.
 * Imported by both the API route handlers (server) and the widget (client),
 * so this file must stay free of server-only imports.
 */

export interface BookingQuestion {
  /** Exact question text — must be echoed verbatim when booking. */
  name: string
  type: string
  required: boolean
  position: number
  answerChoices: string[]
  includeOther: boolean
}

export interface EventMeta {
  name: string
  durationMinutes: number
  schedulingUrl: string
  location: { kind: string; label: string } | null
  host: { name: string; avatarUrl: string | null }
  /** Host's own timezone — informational, shown as a fallback default. */
  timezone: string
  questions: BookingQuestion[]
}

export interface Slot {
  /** UTC ISO start instant, passed back verbatim when booking. */
  startTime: string
  schedulingUrl: string
  inviteesRemaining: number
}

export type AvailabilityResponse =
  | { configured: false }
  | {
      configured: true
      event: EventMeta
      slots: Slot[]
      range: { start: string; end: string }
    }

export interface BookRequest {
  startTime: string
  name: string
  email: string
  timezone: string
  answers?: Array<{ question: string; answer: string; position: number }>
  guests?: string[]
}

export type BookResponse =
  | {
      ok: true
      invitee: {
        name: string
        email: string
        startTime: string
        rescheduleUrl?: string
        cancelUrl?: string
      }
    }
  | { ok: false; code: BookErrorCode; error: string }

export type BookErrorCode = "not_configured" | "plan" | "taken" | "invalid" | "error"
