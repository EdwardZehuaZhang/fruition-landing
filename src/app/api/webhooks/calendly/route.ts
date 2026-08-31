import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "node:crypto"
import { LEAD_FIRST_UTM_SOURCE } from "@/lib/consultants"
import { CALENDLY_DIRECT_SOURCE, promoteLeadToBooked, pushMeetingToMonday } from "@/lib/leadNotify"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Calendly invitee.created webhook → ILE board. Catches consultations booked
 * on calendly.com directly (or via the scheduler's fallback flow). Bookings
 * made through /api/scheduling/book are tagged utm_source=fruition-scheduler
 * and skipped here — that route already recorded them.
 *
 * Env: CALENDLY_WEBHOOK_SECRET — signing key returned when the webhook
 * subscription was created. Requests are rejected until it is set.
 */

interface CalendlyWebhook {
  event?: string
  payload?: {
    name?: string
    email?: string
    timezone?: string
    text_reminder_number?: string | null
    tracking?: { utm_source?: string | null; utm_content?: string | null }
    scheduled_event?: {
      start_time?: string
      name?: string
    }
    questions_and_answers?: { question: string; answer: string }[]
  }
}

function validSignature(header: string | null, body: string, secret: string): boolean {
  if (!header) return false
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=", 2) as [string, string]))
  const t = parts["t"]
  const v1 = parts["v1"]
  if (!t || !v1) return false
  const expected = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"))
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const secret = process.env.CALENDLY_WEBHOOK_SECRET
  const raw = await req.text()
  if (!secret || !validSignature(req.headers.get("Calendly-Webhook-Signature"), raw, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let hook: CalendlyWebhook
  try {
    hook = JSON.parse(raw) as CalendlyWebhook
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }
  if (hook.event !== "invitee.created") return NextResponse.json({ ok: true, skipped: "event" })

  const p = hook.payload ?? {}
  // Only widget bookings the book route already recorded are skipped.
  // "fruition-fallback" bookings were NOT recorded there — they must land here.
  if ((p.tracking?.utm_source ?? "") === "fruition-scheduler") {
    return NextResponse.json({ ok: true, skipped: "already recorded" })
  }
  const email = (p.email ?? "").trim()
  const name = (p.name ?? "").trim()
  if (!email && !name) return NextResponse.json({ ok: true, skipped: "no identity" })

  const fields: Record<string, string> = {}
  // Raw instant only — leadNotify renders it once it knows the owning desk.
  const meetingStart = p.scheduled_event?.start_time
  if (p.scheduled_event?.name) fields["Event"] = p.scheduled_event.name
  if (p.text_reminder_number) fields["Phone"] = p.text_reminder_number
  // Calendly booking pages ask their own questions. Route the ones that map
  // to a CRM column there; the rest stay as Q&A and land in Message.
  for (const qa of p.questions_and_answers ?? []) {
    const answer = qa.answer?.trim()
    if (!answer) continue
    if (!fields["Phone"] && /phone|mobile|cell|whatsapp|contact number/i.test(qa.question)) {
      fields["Phone"] = answer
    } else if (!fields["Company"] && /company|organisation|organization|employer|business name/i.test(qa.question)) {
      fields["Company"] = answer
    } else if (!fields["Title"] && /^\s*(job )?title\s*$/i.test(qa.question)) {
      fields["Title"] = answer
    } else {
      fields[qa.question] = answer
    }
  }

  // The booking flow stamps the page path into utm_content, so a booking that
  // finished on Calendly is still attributed to the page it started from.
  const utmContent = p.tracking?.utm_content?.trim()
  const source = utmContent?.startsWith("/") ? utmContent : CALENDLY_DIRECT_SOURCE

  // A booking that started on our own form already has a lead on the board —
  // promote that one to "Meeting Booked" instead of adding a second item.
  const leadFirst = (p.tracking?.utm_source ?? "") === LEAD_FIRST_UTM_SOURCE
  const record = leadFirst ? promoteLeadToBooked : pushMeetingToMonday
  const mondayId = await record({
    name: name || email,
    email,
    source,
    timezone: p.timezone,
    meetingStart,
    meetingTz: p.timezone,
    fields,
  })
  return NextResponse.json({ ok: true, mondayId: mondayId ?? undefined, promoted: leadFirst })
}
