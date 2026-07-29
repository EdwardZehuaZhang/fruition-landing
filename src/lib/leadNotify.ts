import { changeColumnValues, createItem, createUpdate, moveItemToGroupTop } from "@/lib/mondayClient"

/**
 * Shared lead-notification sinks used by the intake forms.
 *
 * monday.com is the primary sink: each lead is routed by region to the
 * matching Fruition CRM board (APAC / NA / UK) and lands as a structured item
 * in that board's New Leads group. Region detection uses Cloudflare's
 * cf-ipcountry header first, then the phone country code, then the email TLD,
 * and defaults to APAC.
 *
 * Failure ladder — a lead is never lost:
 *   regional CRM board → env-configured fallback board (Website Leads) →
 *   Slack (#website-leads-rb2b; routes post there only when monday failed).
 *
 * Env:
 *   SLACK_BOT_TOKEN          — bot with chat:write to the channel
 *   SLACK_LEADS_CHANNEL_ID   — fallback channel
 *   MONDAY_LEADS_BOARD_ID    (optional) — fallback board id (Website Leads)
 *   MONDAY_LEADS_GROUP_ID    (optional) — fallback group, defaults to "New Leads"
 *   MONDAY_LEADS_EMAIL_COLUMN(optional) — fallback email column, default "lead_email"
 *   MONDAY_LEADS_NOTES_COLUMN(optional) — fallback long_text column, default "long_text66rcx0qu"
 *   MONDAY_LEADS_COMPANY_COLUMN(optional) — fallback text column, default "company_name"
 */
export interface LeadPayload {
  name?: string
  email?: string
  company?: string
  /** Which form/page the lead came from */
  source?: string
  /** ISO 3166-1 alpha-2 visitor country (from Cloudflare's cf-ipcountry) */
  country?: string
  /** Free-form additional answers keyed by label */
  fields?: Record<string, string>
}

export type LeadRegion = "APAC" | "NA" | "UK"

interface RegionBoard {
  boardId: number
  groupId: string
  /**
   * Column ids on that board. Omitted keys mean the board has no such column;
   * anything that can't land in a column is posted as an item update instead.
   */
  cols: {
    email: string
    contactName?: string
    /** UK splits contact into first/last name columns */
    contactLastName?: string
    phone?: string
    company?: string
    status?: string
    source?: string
    utmSource?: string
    creationDate?: string
    country?: string
    notes?: string
  }
}

/**
 * The regional Fruition CRM boards. Status label "New Lead" and source label
 * "Website" exist on all three. Column ids verified 2026-07-29.
 */
const REGION_BOARDS: Record<LeadRegion, RegionBoard> = {
  APAC: {
    boardId: 1924922135,
    groupId: "emailed_items__1",
    cols: {
      email: "lead_email",
      contactName: "text3",
      phone: "lead_phone",
      company: "text_mkmkvqpj",
      status: "lead_status",
      source: "source",
      utmSource: "short_textqfwxowxd",
      creationDate: "mirror4",
      notes: "long_text66rcx0qu",
    },
  },
  NA: {
    boardId: 1925296156,
    groupId: "emailed_items_mkkpe7r4",
    cols: {
      email: "lead_email",
      contactName: "text3",
      phone: "lead_phone",
      company: "company_name",
      status: "lead_status",
      source: "source",
      creationDate: "mirror4",
      country: "country",
    },
  },
  UK: {
    boardId: 1924931935,
    groupId: "topics",
    cols: {
      email: "lead_email",
      contactName: "text3",
      contactLastName: "text_mkx7q4np",
      phone: "lead_phone",
      status: "lead_status",
      source: "source",
      creationDate: "mirror4",
    },
  },
}

// Region split: Americas → NA; Europe, Middle East, Africa → UK;
// Asia-Pacific and anything unknown → APAC (HQ).
const NA_COUNTRIES = new Set(
  "US CA MX BR AR CL CO PE VE EC UY PY BO CR PA GT HN SV NI DO CU JM TT BS BB HT GY SR BZ PR".split(" "),
)
const UK_COUNTRIES = new Set(
  (
    "GB IE FR DE ES IT PT NL BE LU CH AT SE NO DK FI IS PL CZ SK HU RO BG GR HR SI RS BA MK ME AL EE LV LT UA MD XK CY MT AD MC SM LI " +
    "AE SA QA KW BH OM IL JO LB IQ TR EG MA DZ TN LY ZA NG KE GH ET TZ UG ZW ZM MZ BW SN CI CM CD AO RW MW MU MG"
  ).split(" "),
)

// International dial prefixes that are unambiguous enough to route on.
const UK_PHONE_PREFIXES = [
  "+44", "+353", "+33", "+49", "+34", "+39", "+31", "+32", "+41", "+43", "+46", "+47", "+45",
  "+358", "+48", "+351", "+30", "+90", "+971", "+966", "+972", "+974", "+965", "+973", "+968",
  "+27", "+20", "+212", "+234", "+254",
]

const NA_TLDS = new Set(["us", "ca", "mx", "br", "ar", "cl", "co"])
const UK_TLDS = new Set([
  "uk", "ie", "fr", "de", "es", "it", "nl", "be", "ch", "at", "se", "no", "dk", "fi", "pl",
  "pt", "gr", "tr", "ae", "sa", "il", "za", "eg", "ng", "ke",
])

function regionFromPhone(phone: string): LeadRegion | null {
  const digits = phone.replace(/[^\d+]/g, "")
  // National formats (leading 0) are ambiguous — only route on +country codes.
  if (!digits.startsWith("+")) return null
  if (digits.startsWith("+1")) return "NA"
  if (UK_PHONE_PREFIXES.some((p) => digits.startsWith(p))) return "UK"
  return null
}

export function detectRegion(p: LeadPayload): LeadRegion {
  const country = p.country?.trim().toUpperCase()
  if (country && /^[A-Z]{2}$/.test(country) && country !== "XX" && country !== "T1") {
    if (NA_COUNTRIES.has(country)) return "NA"
    if (UK_COUNTRIES.has(country)) return "UK"
    return "APAC"
  }
  const phone = p.fields?.["Phone"]
  if (phone) {
    const byPhone = regionFromPhone(phone)
    if (byPhone) return byPhone
  }
  const tld = p.email?.split(".").pop()?.toLowerCase()
  if (tld) {
    if (NA_TLDS.has(tld)) return "NA"
    if (UK_TLDS.has(tld)) return "UK"
  }
  return "APAC"
}

export function fmtDetails(p: LeadPayload): string {
  const lines: string[] = []
  if (p.company) lines.push(`Company: ${p.company}`)
  if (p.source) lines.push(`Source: ${p.source}`)
  if (p.country) lines.push(`Country: ${p.country}`)
  for (const [k, v] of Object.entries(p.fields ?? {})) {
    if (v && String(v).trim()) lines.push(`${k}: ${v}`)
  }
  return lines.join("\n")
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
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
    console.warn("[leads] slack threw:", errMsg(err))
    return false
  }
}

async function pushToBoard(p: LeadPayload, rb: RegionBoard, label: string): Promise<string | null> {
  let itemId: string
  try {
    itemId = await createItem(rb.boardId, rb.groupId, p.name || p.email || "New lead")
  } catch (err) {
    console.warn(`[leads] monday ${label} create failed:`, errMsg(err))
    return null
  }

  // create_item appends to the bottom of the group; surface the lead at the
  // top instead. Position is cosmetic — never fail the lead over it.
  try {
    await moveItemToGroupTop(itemId, rb.groupId)
  } catch (err) {
    console.warn(`[leads] monday ${label} reposition failed:`, errMsg(err))
  }

  const c = rb.cols
  const cols: Record<string, unknown> = {}
  if (p.email) cols[c.email] = { email: p.email, text: p.email }
  if (p.name && c.contactName) {
    if (c.contactLastName) {
      const [first, ...rest] = p.name.split(/\s+/)
      cols[c.contactName] = first
      if (rest.length) cols[c.contactLastName] = rest.join(" ")
    } else {
      cols[c.contactName] = p.name
    }
  }
  const phone = p.fields?.["Phone"]?.trim()
  if (phone && c.phone) cols[c.phone] = { phone }
  if (p.company && c.company) cols[c.company] = p.company
  if (c.status) cols[c.status] = { label: "New Lead" }
  if (c.source) cols[c.source] = { labels: ["Website"] }
  if (p.source && c.utmSource) cols[c.utmSource] = p.source
  if (c.creationDate) cols[c.creationDate] = { date: new Date().toISOString().slice(0, 10) }
  if (p.country && c.country) cols[c.country] = p.country
  const detail = fmtDetails(p)
  if (detail && c.notes) cols[c.notes] = { text: detail }

  try {
    await changeColumnValues(rb.boardId, itemId, cols)
  } catch (err) {
    // Board schema drifted — retry with just email + notes so the lead still
    // lands with its full payload.
    console.warn(`[leads] monday ${label} columns failed, retrying minimal:`, errMsg(err))
    const minimal: Record<string, unknown> = {}
    if (p.email) minimal[c.email] = { email: p.email, text: p.email }
    if (detail && c.notes) minimal[c.notes] = { text: detail }
    try {
      await changeColumnValues(rb.boardId, itemId, minimal)
    } catch {
      // Item already exists with its name — better a bare item than no lead.
    }
  }

  // Boards without a notes column get the full payload as an item update, so
  // the enquiry text is the first thing sales sees on the item.
  if (detail && !c.notes) {
    try {
      await createUpdate(itemId, `Website form submission\n${detail}`)
    } catch (err) {
      console.warn(`[leads] monday ${label} update failed:`, errMsg(err))
    }
  }
  return itemId
}

function fallbackBoard(): RegionBoard | null {
  const boardId = Number(process.env.MONDAY_LEADS_BOARD_ID)
  if (!boardId) return null
  return {
    boardId,
    groupId: process.env.MONDAY_LEADS_GROUP_ID || "group_mm5pvztf",
    cols: {
      email: process.env.MONDAY_LEADS_EMAIL_COLUMN || "lead_email",
      contactName: "text3",
      phone: "lead_phone",
      company: process.env.MONDAY_LEADS_COMPANY_COLUMN || "company_name",
      status: "lead_status",
      source: "source",
      utmSource: "short_textqfwxowxd",
      creationDate: "mirror4",
      notes: process.env.MONDAY_LEADS_NOTES_COLUMN || "long_text66rcx0qu",
    },
  }
}

export async function pushToMonday(p: LeadPayload): Promise<string | null> {
  const region = detectRegion(p)
  const viaRegion = await pushToBoard(p, REGION_BOARDS[region], region)
  if (viaRegion) return viaRegion

  // Regional CRM unreachable — land the lead on the fallback intake board.
  const fallback = fallbackBoard()
  if (!fallback) return null
  return pushToBoard(p, fallback, "fallback")
}
