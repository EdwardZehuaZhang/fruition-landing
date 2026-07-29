import { changeColumnValues, createItem } from "@/lib/mondayClient"

/**
 * Shared lead-notification sinks used by the intake forms.
 *
 * monday.com is the primary sink: leads land as structured items on the
 * Website Leads board (5030259940), which mirrors the Fruition CRM (APAC)
 * board 1924922135 so items can later be migrated 1:1. Slack is the fallback
 * sink — routes post there only when the monday push fails, so a lead is
 * never lost but #website-leads-rb2b isn't double-fed.
 *
 * Env:
 *   SLACK_BOT_TOKEN          — bot with chat:write to the channel
 *   SLACK_LEADS_CHANNEL_ID   — fallback channel
 *   MONDAY_LEADS_BOARD_ID    (optional) — numeric board id; enables monday item
 *   MONDAY_LEADS_GROUP_ID    (optional) — group id, defaults to "New Leads"
 *   MONDAY_LEADS_EMAIL_COLUMN(optional) — email column id, default "lead_email"
 *   MONDAY_LEADS_NOTES_COLUMN(optional) — long_text column id, default "long_text66rcx0qu"
 *   MONDAY_LEADS_COMPANY_COLUMN(optional) — text column id, default "company_name"
 *
 * To point directly at the Fruition CRM (APAC) board instead of the Website
 * Leads mimic, only env changes are needed: BOARD_ID=1924922135,
 * GROUP_ID=emailed_items__1, COMPANY_COLUMN=text_mkmkvqpj (all other column
 * ids are identical on both boards).
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

/**
 * Column ids on the Website Leads board (5030259940). The board reuses the
 * CRM board's column ids wherever monday allows a user-specified id, so a
 * later item migration into the CRM maps 1:1. If the structured write fails
 * (e.g. the board moved), we retry with just email + notes so the lead still
 * lands with its full payload.
 */
const CRM_COLS = {
  contactName: "text3",
  company: "company_name",
  phone: "lead_phone",
  status: "lead_status",
  sourceDropdown: "source",
  utmSource: "short_textqfwxowxd",
  creationDate: "mirror4",
} as const

export async function pushToMonday(p: LeadPayload): Promise<string | null> {
  const boardId = Number(process.env.MONDAY_LEADS_BOARD_ID)
  if (!boardId) return null
  const groupId = process.env.MONDAY_LEADS_GROUP_ID || "group_mm5pvztf"
  const emailCol = process.env.MONDAY_LEADS_EMAIL_COLUMN || "lead_email"
  const notesCol = process.env.MONDAY_LEADS_NOTES_COLUMN || "long_text66rcx0qu"
  const companyCol = process.env.MONDAY_LEADS_COMPANY_COLUMN || CRM_COLS.company

  let itemId: string
  try {
    itemId = await createItem(boardId, groupId, p.name || p.email || "New lead")
  } catch (err) {
    console.warn("[leads] monday push failed:", err instanceof Error ? err.message : String(err))
    return null
  }

  const minimal: Record<string, unknown> = {}
  if (p.email) minimal[emailCol] = { email: p.email, text: p.email }
  const detail = fmtDetails(p)
  if (detail) minimal[notesCol] = { text: detail }

  const structured: Record<string, unknown> = {
    ...minimal,
    [CRM_COLS.status]: { label: "New Lead" },
    [CRM_COLS.sourceDropdown]: { labels: ["Website"] },
    [CRM_COLS.creationDate]: { date: new Date().toISOString().slice(0, 10) },
  }
  if (p.name) structured[CRM_COLS.contactName] = p.name
  if (p.company) structured[companyCol] = p.company
  const phone = p.fields?.["Phone"]?.trim()
  if (phone) structured[CRM_COLS.phone] = { phone }
  if (p.source) structured[CRM_COLS.utmSource] = p.source

  try {
    await changeColumnValues(boardId, itemId, structured)
  } catch (err) {
    console.warn(
      "[leads] monday structured columns failed, retrying minimal:",
      err instanceof Error ? err.message : String(err),
    )
    try {
      await changeColumnValues(boardId, itemId, minimal)
    } catch {
      // Item already exists with its name — better a bare item than no lead.
    }
  }
  return itemId
}
