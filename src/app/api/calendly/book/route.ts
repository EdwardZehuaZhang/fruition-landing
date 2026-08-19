import { NextResponse } from "next/server"

import {
  CalendlyError,
  createInvitee,
  firstLocation,
  getCalendlyConfig,
  getEventType,
  type CreateInviteePayload,
} from "@/lib/calendly"
import type { BookRequest, BookResponse } from "@/components/sections/calendly/types"

export const runtime = "nodejs"
export const maxDuration = 30

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function reply(body: BookResponse, status = 200) {
  return NextResponse.json(body, { status })
}

/**
 * Create a Calendly booking on behalf of an invitee.
 *   POST /api/calendly/book
 * Body: { startTime, name, email, timezone, answers?, guests? }
 */
export async function POST(request: Request) {
  const config = getCalendlyConfig()
  if (!config) {
    return reply({ ok: false, code: "not_configured", error: "Booking is not available right now." }, 503)
  }

  let body: BookRequest
  try {
    body = (await request.json()) as BookRequest
  } catch {
    return reply({ ok: false, code: "invalid", error: "Invalid request." }, 400)
  }

  const name = (body.name ?? "").trim()
  const email = (body.email ?? "").trim()
  const timezone = (body.timezone ?? "").trim()
  const startTime = (body.startTime ?? "").trim()

  if (!name) return reply({ ok: false, code: "invalid", error: "Please enter your name." }, 400)
  if (!EMAIL_RE.test(email))
    return reply({ ok: false, code: "invalid", error: "Please enter a valid email address." }, 400)
  if (!timezone) return reply({ ok: false, code: "invalid", error: "Missing timezone." }, 400)
  if (Number.isNaN(Date.parse(startTime)))
    return reply({ ok: false, code: "invalid", error: "Please pick a time." }, 400)

  const guests = (body.guests ?? [])
    .map((g) => g.trim())
    .filter((g) => EMAIL_RE.test(g))
    .slice(0, 10)

  const answers = (body.answers ?? [])
    .filter((a) => a && typeof a.question === "string" && typeof a.answer === "string" && a.answer.trim())
    .map((a) => ({ question: a.question, answer: a.answer.trim(), position: a.position }))

  try {
    const eventType = await getEventType(config.token, config.eventTypeUri)
    const loc = firstLocation(eventType)

    const payload: CreateInviteePayload = {
      event_type: config.eventTypeUri,
      start_time: new Date(startTime).toISOString(),
      invitee: { name, email, timezone },
      ...(answers.length ? { questions_and_answers: answers } : {}),
      ...(guests.length ? { event_guests: guests } : {}),
    }

    // Calendly requires the invitee's location to match the event type's
    // configured location (e.g. a Google Meet event rejects a booking that
    // doesn't echo `kind: "google_conference"`). Round-robin / collective
    // events must NOT receive a location object.
    if (loc && eventType.pooling_type == null) {
      payload.location = { kind: loc.kind, ...(loc.location ? { location: loc.location } : {}) }
    }

    const invitee = await createInvitee(config.token, payload)

    return reply({
      ok: true,
      invitee: {
        name: invitee.name,
        email: invitee.email,
        startTime,
        rescheduleUrl: invitee.reschedule_url,
        cancelUrl: invitee.cancel_url,
      },
    })
  } catch (err) {
    if (err instanceof CalendlyError) {
      // 403: endpoint gated to paid plans. 409/422: slot no longer bookable.
      if (err.status === 403) {
        return reply(
          { ok: false, code: "plan", error: "Online booking isn’t enabled for this calendar yet." },
          403,
        )
      }
      if (err.status === 409 || err.status === 422) {
        return reply(
          { ok: false, code: "taken", error: "That time was just booked. Please choose another." },
          409,
        )
      }
      if (err.status === 400) {
        return reply(
          { ok: false, code: "invalid", error: "Please check your details and try again." },
          400,
        )
      }
    }
    console.error("[calendly/book]", err)
    return reply(
      { ok: false, code: "error", error: "Something went wrong booking your time. Please try again." },
      502,
    )
  }
}
