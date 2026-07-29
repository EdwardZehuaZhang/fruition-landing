import { NextResponse } from "next/server"
import { createBooking } from "@/lib/calendlyClient"
import { detectRegion, pushMeetingToMonday, type LeadRegion } from "@/lib/leadNotify"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Books a consultation slot via the Calendly API and records the lead on the
 * ILE board with status "Meeting Booked". When Calendly rejects the API
 * booking (plan/eligibility edge cases), the client falls back to opening the
 * slot's own Calendly booking page — `fallbackUrl` — with details prefilled.
 */

interface BookRequest {
  start?: string
  slotUrl?: string
  firstName?: string
  lastName?: string
  /** Legacy single-field name — kept for back-compat with older clients */
  name?: string
  email?: string
  company?: string
  phone?: string
  /** "What can we help with?" selection — ILE Service Interest dropdown */
  service?: string
  notes?: string
  timezone?: string
  region?: LeadRegion
  /** Spam honeypot — must be empty */
  website?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let p: BookRequest
  try {
    p = (await req.json()) as BookRequest
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 })
  }
  if (p.website && p.website.trim()) return NextResponse.json({ ok: true })

  const firstName = (p.firstName ?? "").trim()
  const lastName = (p.lastName ?? "").trim()
  const name = [firstName, lastName].filter(Boolean).join(" ").trim() || (p.name ?? "").trim()
  const email = (p.email ?? "").trim()
  const start = (p.start ?? "").trim()
  const timezone = (p.timezone ?? "").trim() || "UTC"
  if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 })
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 })
  if (!start || Number.isNaN(Date.parse(start))) {
    return NextResponse.json({ ok: false, error: "Pick a time slot first." }, { status: 400 })
  }

  const country = req.headers.get("cf-ipcountry") ?? undefined
  const region = p.region ?? detectRegion({ country })

  const fields: Record<string, string> = {
    "Meeting time": `${start} (${timezone})`,
  }
  if (p.phone?.trim()) fields["Phone"] = p.phone.trim()
  if (p.service?.trim()) fields["Service"] = p.service.trim()
  if (p.notes?.trim()) fields["Message"] = p.notes.trim()

  let booked = false
  try {
    await createBooking({ region, start, name, email, timezone, phone: p.phone?.trim() })
    booked = true
  } catch (err) {
    console.warn("[scheduling] api booking failed:", err instanceof Error ? err.message : String(err))
  }

  if (!booked) {
    // Client opens the Calendly slot page with details prefilled; the
    // invitee.created webhook will record the lead once they confirm there.
    const fallbackUrl = p.slotUrl
      ? `${p.slotUrl}${p.slotUrl.includes("?") ? "&" : "?"}name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
      : null
    return NextResponse.json({ ok: false, fallbackUrl, error: "booking_api_failed" }, { status: 502 })
  }

  // Best-effort lead record — the meeting exists in Calendly regardless.
  const mondayId = await pushMeetingToMonday({
    name,
    email,
    company: p.company?.trim() || undefined,
    source: "scheduler",
    country,
    fields,
  })

  return NextResponse.json({ ok: true, mondayId: mondayId ?? undefined })
}
