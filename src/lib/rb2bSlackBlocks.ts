// Shared helpers for RB2B Slack formatting + self-traffic filtering.
// Used by /api/webhooks/rb2b (realtime) and scripts/backfill-rb2b-companies.ts.

export type Intent = "Low" | "Medium" | "High"

export function deriveIntent(urls: string[]): Intent {
  const list = urls.map((u) => u.toLowerCase())
  if (list.some((u) => /\/service/.test(u))) return "High"
  if (list.some((u) => /\/(contact|pricing)/.test(u))) return "Medium"
  return "Low"
}

export function pathOf(url: string): string {
  try {
    return new URL(url).pathname || url
  } catch {
    return url
  }
}

// Filter our own staff/test traffic. Fruition's RB2B account picks up
// any team member browsing the site, which would otherwise spam Slack.
export function isFruitionSelfTraffic(input: {
  companyName?: string | null
  website?: string | null
  linkedin?: string | null
}): boolean {
  const company = (input.companyName ?? "").trim().toLowerCase()
  const site = (input.website ?? "").trim().toLowerCase()
  const linkedin = (input.linkedin ?? "").trim().toLowerCase()
  if (/fruitionservices\.(io|com)/.test(site)) return true
  if (/linkedin\.com\/company\/fruitionservices/.test(linkedin)) return true
  if (company === "fruition") return true
  return false
}

export function isCompanyLinkedin(url: string): boolean {
  return /linkedin\.com\/company\//i.test(url)
}

// Strip protocol/path so we can hit Clearbit's logo service (which keys on
// the bare domain). Falls back to empty when the URL is unparseable.
function bareDomain(url: string): string {
  if (!url) return ""
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

function formatVisitDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  // "May 21, 2026 at 02:16 AM EDT" — matches RB2B's native Slack format.
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
    timeZoneName: "short",
  })
  // Intl emits "May 21, 2026, 02:16 AM EDT"; swap the middle comma for "at".
  return fmt.format(d).replace(/,\s*(\d{2}:)/, " at $1")
}

export function buildCompanySlackBlocks(args: {
  companyName: string
  capturedUrl: string
  intent: Intent
  website: string
  industry: string
  employees: number | string | null
  revenue?: string
  location: string
  linkedin?: string
  seenAt?: string
  isRepeat: boolean
}): Record<string, unknown>[] {
  const blocks: Record<string, unknown>[] = []
  const intentEmoji =
    args.intent === "High" ? ":fire:" : args.intent === "Medium" ? ":warning:" : ":eyes:"

  blocks.push({
    type: "header",
    text: { type: "plain_text", text: args.companyName, emoji: true },
  })

  // Company info block. Logo accessory pulls from Clearbit's free logo
  // service, keyed on the company's bare domain. If we have no website we
  // skip the accessory (Slack rejects image blocks with empty URLs).
  const infoLines: string[] = []
  infoLines.push(`*Company:* ${args.companyName}`)
  if (args.linkedin) infoLines.push(`*LinkedIn:* <${args.linkedin}|${args.linkedin}>`)
  if (args.location) infoLines.push(`*Location:* ${args.location}`)
  const domain = bareDomain(args.website)
  const infoBlock: Record<string, unknown> = {
    type: "section",
    text: { type: "mrkdwn", text: infoLines.join("\n") },
  }
  if (domain) {
    infoBlock.accessory = {
      type: "image",
      image_url: `https://logo.clearbit.com/${domain}`,
      alt_text: `${args.companyName} logo`,
    }
  }
  blocks.push(infoBlock)

  if (args.capturedUrl) {
    const when = args.seenAt ? ` on ${formatVisitDate(args.seenAt)}` : ""
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `First identified visiting *<${args.capturedUrl}|${args.capturedUrl}>*${when}`,
      },
    })
  }

  const buttons: Record<string, unknown>[] = []
  if (args.linkedin) {
    buttons.push({
      type: "button",
      text: { type: "plain_text", text: "Connect on LinkedIn :linkedin:", emoji: true },
      url: args.linkedin,
    })
  }
  if (args.website) {
    buttons.push({
      type: "button",
      text: { type: "plain_text", text: "More Details :globe_with_meridians:", emoji: true },
      url: args.website,
    })
  }
  if (buttons.length) {
    blocks.push({ type: "actions", elements: buttons })
  }

  blocks.push({ type: "divider" })

  const aboutTitle = args.website
    ? `*About <${args.website}|${args.companyName}>*`
    : `*About ${args.companyName}*`
  blocks.push({
    type: "section",
    text: { type: "mrkdwn", text: aboutTitle },
  })

  const fields: Record<string, unknown>[] = []
  if (args.website) fields.push({ type: "mrkdwn", text: `*Website:*\n<${args.website}|${args.website}>` })
  if (args.employees != null && String(args.employees).trim()) {
    fields.push({ type: "mrkdwn", text: `*Est. Employees:*\n${args.employees}` })
  }
  if (args.industry) fields.push({ type: "mrkdwn", text: `*Industry:*\n${args.industry}` })
  if (args.revenue) fields.push({ type: "mrkdwn", text: `*Est. Revenue:*\n${args.revenue}` })
  if (fields.length) {
    blocks.push({ type: "section", fields })
  }

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `${intentEmoji} *${args.intent}* intent${args.isRepeat ? " • returning visit" : ""}`,
      },
    ],
  })

  return blocks
}
