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

export function buildCompanySlackBlocks(args: {
  companyName: string
  capturedUrl: string
  intent: Intent
  website: string
  industry: string
  employees: number | string | null
  location: string
  isRepeat: boolean
}): Record<string, unknown>[] {
  const intentEmoji =
    args.intent === "High" ? ":fire:" : args.intent === "Medium" ? ":warning:" : ":eyes:"
  const lines: string[] = []
  const meta: string[] = []
  if (args.industry) meta.push(args.industry)
  if (args.employees != null && String(args.employees).trim()) meta.push(`${args.employees} employees`)
  if (args.location) meta.push(args.location)
  if (meta.length) lines.push(meta.join(" • "))
  // Company website gets a normal mrkdwn link so Slack auto-unfurls it
  // (gives an embed preview of the visitor's company). The captured URL is
  // wrapped in backticks so Slack treats it as inline code and does NOT
  // unfurl — every captured URL is on our own site, and we don't want our
  // own homepage previewing on every lead alert.
  if (args.website) lines.push(`:globe_with_meridians: <${args.website}|${args.website}>`)
  if (args.capturedUrl) lines.push(`:link: \`${args.capturedUrl}\``)
  lines.push(
    `${intentEmoji} *${args.intent}* intent • _anonymous (company-only)_${args.isRepeat ? " • returning" : ""}`,
  )
  return [
    {
      type: "header",
      text: { type: "plain_text", text: `Anonymous visit — ${args.companyName}` },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: lines.join("\n") },
    },
  ]
}
