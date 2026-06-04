import { changeColumnValues, createItem } from "@/lib/mondayClient"

/**
 * Shared lead-notification sinks used by the intake forms.
 *
 * Slack is the guaranteed sink (#leads via SLACK_LEADS_CHANNEL_ID); monday.com
 * is best-effort when MONDAY_LEADS_BOARD_ID is configured. Kept schema-light so
 * a moved board never breaks a form — Slack always receives the full payload.
 *
 * Env:
 *   SLACK_BOT_TOKEN          — bot with chat:write to the channel
 *   SLACK_LEADS_CHANNEL_ID   — destination channel
 *   MONDAY_LEADS_BOARD_ID    (optional) — numeric board id; enables monday item
 *   MONDAY_LEADS_GROUP_ID    (optional) — group id, defaults to "topics"
 *   MONDAY_LEADS_EMAIL_COLUMN(optional) — column id to store email
 *   MONDAY_LEADS_NOTES_COLUMN(optional) — long_text column id to store details
 */
export interface LeadPayload {
  name?: string
  email?: string
  company?: string
  /** Which form/page the lead came from */
  source?: string
  /** Free-form additional answers keyed by label */
  fields?: Record<string, string>
}

export function fmtDetails(p: LeadPayload): string {
  const lines: string[] = []
  if (p.company) lines.push(`Company: ${p.company}`)
  if (p.source) lines.push(`Source: ${p.source}`)
  for (const [k, v] of Object.entries(p.fields ?? {})) {
    if (v && String(v).trim()) lines.push(`${k}: ${v}`)
  }
  return lines.join("\n")
}

export async function notifySlack(p: LeadPayload): Promise<boolean> {
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

export async function pushToMonday(p: LeadPayload): Promise<string | null> {
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
