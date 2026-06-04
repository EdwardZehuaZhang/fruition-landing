import { NextResponse } from "next/server"
import { notifySlack, pushToMonday, type LeadPayload } from "@/lib/leadNotify"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Lead-capture endpoint for the CRO intake/discovery forms.
 *
 * Sinks (Slack guaranteed, monday best-effort) live in @/lib/leadNotify so the
 * contact form can reuse them. Slack always receives the full payload.
 */

interface LeadRequest extends LeadPayload {
  /** Spam honeypot — must be empty */
  website?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let p: LeadRequest
  try {
    p = (await req.json()) as LeadRequest
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 })
  }

  // Honeypot — silently accept bots without doing anything.
  if (p.website && p.website.trim()) {
    return NextResponse.json({ ok: true })
  }

  const name = (p.name ?? "").trim()
  const email = (p.email ?? "").trim()
  if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 })
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 })
  }

  const clean: LeadPayload = { name, email, company: p.company, source: p.source, fields: p.fields }
  const [slackOk, mondayItemId] = await Promise.all([notifySlack(clean), pushToMonday(clean)])

  if (!slackOk && !mondayItemId) {
    return NextResponse.json(
      { ok: false, error: "Lead could not be recorded. Please email us directly." },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true, mondayItemId: mondayItemId ?? undefined })
}
