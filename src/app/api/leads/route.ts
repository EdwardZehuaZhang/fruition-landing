import { NextResponse } from "next/server"
import { changeColumnValues, createItem } from "@/lib/mondayClient"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Lead-capture endpoint for the CRO intake/discovery forms.
 *
 * Primary sink is Slack (#leads — guaranteed by SLACK_LEADS_CHANNEL_ID), with a
 * best-effort monday.com item when MONDAY_LEADS_BOARD_ID is configured. We avoid
 * hardcoding a board/column schema so the form never breaks if the board moves;
 * Slack always receives the full payload.
 *
 * Env:
 *   SLACK_BOT_TOKEN          (existing) — bot with chat:write to the channel
 *   SLACK_LEADS_CHANNEL_ID   (existing) — destination channel
 *   MONDAY_LEADS_BOARD_ID    (optional) — numeric board id; enables monday item
 *   MONDAY_LEADS_GROUP_ID    (optional) — group id, defaults to "topics"
 *   MONDAY_LEADS_EMAIL_COLUMN(optional) — column id to store email
 *   MONDAY_LEADS_NOTES_COLUMN(optional) — long_text column id to store details
 */

interface LeadPayload {
  name?: string
  email?: string
  company?: string
  /** Which form/page the lead came from */
  source?: string
  /** Free-form additional answers keyed by label */
  fields?: Record<string, string>
  /** Spam honeypot — must be empty */
  website?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function fmtDetails(p: LeadPayload): string {
  const lines: string[] = []
  if (p.company) lines.push(`Company: ${p.company}`)
  if (p.source) lines.push(`Source: ${p.source}`)
  for (const [k, v] of Object.entries(p.fields ?? {})) {
    if (v && String(v).trim()) lines.push(`${k}: ${v}`)
  }
  return lines.join("\n")
}

async function notifySlack(p: LeadPayload): Promise<boolean> {
  const token = process.env.SLACK_BOT_TOKEN
  const channel = process.env.SLACK_LEADS_CHANNEL_ID
  if (!token || !channel) {
    console.warn("[leads] SLACK_BOT_TOKEN or SLACK_LEADS_CHANNEL_ID missing, skipping Slack")
    return false
  }
  const detail = fmtDetails(p)
  const text = `:tada: *New lead${p.source ? ` — ${p.source}` : ""}*\n*${p.name}* <${p.email}>${detail ? `\n${detail}` : ""}`
  try {
    const r = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ channel, text }),
    })
    const body = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (!body.ok) console.warn(`[leads] slack not ok: ${body.error ?? "unknown"} http=${r.status}`)
    return !!body.ok
  } catch (err) {
    console.warn("[leads] slack threw:", err instanceof Error ? err.message : String(err))
    return false
  }
}

async function pushToMonday(p: LeadPayload): Promise<string | null> {
  const boardId = Number(process.env.MONDAY_LEADS_BOARD_ID)
  if (!boardId) return null
  const groupId = process.env.MONDAY_LEADS_GROUP_ID || "topics"
  try {
    const itemId = await createItem(boardId, groupId, p.name || p.email || "New lead")
    const cols: Record<string, unknown> = {}
    const emailCol = process.env.MONDAY_LEADS_EMAIL_COLUMN
    const notesCol = process.env.MONDAY_LEADS_NOTES_COLUMN
    if (emailCol && p.email) cols[emailCol] = { email: p.email, text: p.email }
    if (notesCol) {
      const detail = fmtDetails(p)
      if (detail) cols[notesCol] = { text: detail }
    }
    if (Object.keys(cols).length > 0) await changeColumnValues(boardId, itemId, cols)
    return itemId
  } catch (err) {
    console.warn("[leads] monday push failed:", err instanceof Error ? err.message : String(err))
    return null
  }
}

export async function POST(req: Request) {
  let p: LeadPayload
  try {
    p = (await req.json()) as LeadPayload
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

  const clean: LeadPayload = { ...p, name, email }
  const [slackOk, mondayItemId] = await Promise.all([notifySlack(clean), pushToMonday(clean)])

  if (!slackOk && !mondayItemId) {
    return NextResponse.json(
      { ok: false, error: "Lead could not be recorded. Please email us directly." },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true, mondayItemId: mondayItemId ?? undefined })
}
