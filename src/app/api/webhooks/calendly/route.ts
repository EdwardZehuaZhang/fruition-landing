import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "node:crypto"
import { pushMeetingToMonday } from "@/lib/leadNotify"

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
    tracking?: { utm_source?: string | null }
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
  if ((p.tracking?.utm_source ?? "") === "fruition-scheduler") {
    return NextResponse.json({ ok: true, skipped: "already recorded" })
  }
  const email = (p.email ?? "").trim()
  const name = (p.name ?? "").trim()
  if (!email && !name) return NextResponse.json({ ok: true, skipped: "no identity" })

  const fields: Record<string, string> = {}
  if (p.scheduled_event?.start_time) {
    fields["Meeting time"] = `${p.scheduled_event.start_time}${p.timezone ? ` (${p.timezone})` : ""}`
  }
  if (p.scheduled_event?.name) fields["Event"] = p.scheduled_event.name
  if (p.text_reminder_number) fields["Phone"] = p.text_reminder_number
  for (const qa of p.questions_and_answers ?? []) {
    if (qa.answer?.trim()) fields[qa.question] = qa.answer
  }

  const mondayId = await pushMeetingToMonday({
    name: name || email,
    email,
    source: "calendly",
    fields,
  })
  return NextResponse.json({ ok: true, mondayId: mondayId ?? undefined })
}
