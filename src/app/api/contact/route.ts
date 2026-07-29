import { NextResponse } from "next/server"
import { Resend } from "resend"
import { notifySlack, pushToMonday } from "@/lib/leadNotify"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Contact-form endpoint. Primary action is an email to contact@fruitionservices.io
 * via Resend (the send must succeed). The lead also lands as a structured item
 * on the monday Website Leads board, with Slack as the fallback sink.
 *
 * Env:
 *   RESEND_API_KEY   — Resend API key
 *   CONTACT_TO       (optional) — recipient, defaults to contact@fruitionservices.io
 *   CONTACT_FROM     (optional) — verified Resend sender, defaults to website@fruitionservices.io
 *   plus SLACK_* / MONDAY_* used by @/lib/leadNotify
 */

interface ContactRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  message?: string
  service?: string
  /** Spam honeypot — must be empty */
  website?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TO = process.env.CONTACT_TO || "contact@fruitionservices.io"
const FROM = process.env.CONTACT_FROM || "Fruition Website <website@fruitionservices.io>"

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export async function POST(req: Request) {
  let p: ContactRequest
  try {
    p = (await req.json()) as ContactRequest
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 })
  }

  // Honeypot — silently accept bots.
  if (p.website && p.website.trim()) {
    return NextResponse.json({ ok: true })
  }

  const firstName = (p.firstName ?? "").trim()
  const lastName = (p.lastName ?? "").trim()
  const email = (p.email ?? "").trim()
  const phone = (p.phone ?? "").trim()
  const message = (p.message ?? "").trim()
  const service = (p.service ?? "").trim()
  const name = [firstName, lastName].filter(Boolean).join(" ")

  if (!firstName) return NextResponse.json({ ok: false, error: "First name is required." }, { status: 400 })
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 })
  }
  if (!message) return NextResponse.json({ ok: false, error: "A message is required." }, { status: 400 })

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Service", service],
  ]
  const text =
    rows
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n") + `\n\nMessage:\n${message}`
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#10003a;line-height:1.5">
      <h2 style="margin:0 0 16px;font-size:18px">New contact form submission</h2>
      <table style="border-collapse:collapse;font-size:14px">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#686b82">${esc(k)}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:16px 0 4px;color:#686b82;font-size:14px">Message</p>
      <p style="margin:0;font-size:15px;white-space:pre-wrap">${esc(message)}</p>
    </div>`

  // Email via Resend is best-effort: it only works once the sending domain is
  // verified. The lead is also mirrored to Slack + monday, and the submission
  // counts as delivered if ANY sink succeeds — so a lead is never lost just
  // because the email domain isn't verified yet.
  const apiKey = process.env.RESEND_API_KEY
  let emailed = false
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — skipping email, relying on Slack/monday.")
  } else {
    const resend = new Resend(apiKey)
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: TO,
        replyTo: email,
        subject: `New contact${service ? ` — ${service}` : ""} from ${name || email}`,
        text,
        html,
      })
      if (error) {
        console.error("[contact] resend error:", error)
      } else {
        emailed = true
      }
    } catch (err) {
      console.error("[contact] resend threw:", err instanceof Error ? err.message : String(err))
    }
  }

  // Mirror into the lead pipeline: monday is the primary structured sink;
  // Slack only fires when the monday push fails, so a lead is never lost but
  // the channel isn't double-fed.
  const fields: Record<string, string> = {}
  if (phone) fields["Phone"] = phone
  if (service) fields["Service"] = service
  if (message) fields["Message"] = message
  const lead = {
    name: name || email,
    email,
    source: "contact-us",
    // Cloudflare's edge geolocation drives the regional CRM routing.
    country: req.headers.get("cf-ipcountry") ?? undefined,
    fields,
  }
  const mondayId = await pushToMonday(lead)
  const slackOk = mondayId ? false : await notifySlack(lead)

  if (emailed || slackOk || mondayId) {
    return NextResponse.json({ ok: true })
  }

  console.error("[contact] all delivery channels failed (email, slack, monday).")
  return NextResponse.json(
    { ok: false, error: "We couldn't send your message. Please email us directly." },
    { status: 500 },
  )
}
