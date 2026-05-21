import { NextResponse } from "next/server"
import {
  changeColumnValues,
  createItem,
  findItemByColumnValue,
  type MondayColumnValue,
} from "@/lib/mondayClient"
import { RB2B_BOARD_ID, RB2B_COLUMNS } from "@/lib/rb2bColumns"
import { postSlackMessage } from "@/lib/slackClient"
import {
  buildCompanySlackBlocks,
  deriveIntent,
  isCompanyLinkedin,
  isFruitionSelfTraffic,
  pathOf,
  type Intent,
} from "@/lib/rb2bSlackBlocks"

export const runtime = "nodejs"
export const maxDuration = 30

// RB2B webhook payload is a fixed schema. Field names are literal per
// https://support.rb2b.com/en/articles/8976614-setup-guide-webhook.
interface Rb2bPayload {
  "LinkedIn URL"?: string | null
  "First Name"?: string | null
  "Last Name"?: string | null
  Title?: string | null
  "Company Name"?: string | null
  "Business Email"?: string | null
  Website?: string | null
  Industry?: string | null
  "Employee Count"?: number | string | null
  "Estimate Revenue"?: string | null
  City?: string | null
  State?: string | null
  Zipcode?: string | null
  "Seen At"?: string | null
  Referrer?: string | null
  "Captured URL"?: string | null
  Tags?: string | null
  is_repeat_visit?: boolean | null
}

function appendPage(existing: string | null, capturedUrl: string, seenAt: string): string {
  const line = `${capturedUrl} (${seenAt})`
  if (!existing) return line
  // Skip if last line already matches (RB2B can fire dupes).
  const lines = existing.split("\n")
  if (lines[lines.length - 1] === line) return existing
  return `${existing}\n${line}`
}

function isoDate(seenAt: string | null | undefined): string {
  if (!seenAt) return new Date().toISOString().slice(0, 10)
  const d = new Date(seenAt)
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10)
  return d.toISOString().slice(0, 10)
}

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function POST(req: Request) {
  const expected = process.env.RB2B_WEBHOOK_SECRET
  if (!expected) {
    console.error("[rb2b-webhook] RB2B_WEBHOOK_SECRET missing")
    return unauthorized()
  }
  const url = new URL(req.url)
  if (url.searchParams.get("key") !== expected) return unauthorized()

  let payload: Rb2bPayload
  try {
    payload = (await req.json()) as Rb2bPayload
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const email = (payload["Business Email"] ?? "").trim().toLowerCase()
  const firstName = (payload["First Name"] ?? "").trim()
  const lastName = (payload["Last Name"] ?? "").trim()
  const companyName = (payload["Company Name"] ?? "").trim()
  const rawLinkedin = (payload["LinkedIn URL"] ?? "").trim()
  const website = (payload.Website ?? "").trim()

  // Skip our own staff/test traffic — RB2B picks up Fruition team members
  // browsing the site, which would otherwise spam #website-leads.
  if (isFruitionSelfTraffic({ companyName, website, linkedin: rawLinkedin })) {
    return NextResponse.json({ ok: true, skipped: "self-traffic" })
  }

  // RB2B Companies stream uses `linkedin.com/company/*` URLs; that's not a
  // person identity, so don't use it as a dedupe key (would create bogus
  // person rows in Monday). Treat as company-only.
  const linkedin = isCompanyLinkedin(rawLinkedin) ? "" : rawLinkedin
  const capturedUrl = (payload["Captured URL"] ?? "").trim()
  const seenAt = (payload["Seen At"] ?? "").trim() || new Date().toISOString()
  const intentKey = RB2B_COLUMNS.intent

  // RB2B always sends LinkedIn URL; Business Email is optional. Fall back to
  // LinkedIn URL for the dedupe key when email is absent.
  const dedupeColumn = email ? RB2B_COLUMNS.email : RB2B_COLUMNS.linkedin
  const dedupeValue = email || linkedin
  if (!dedupeValue) {
    // Company-only event (anonymous visitor — RB2B Companies stream). No
    // person identity, so we skip Monday (no dedupe key) and just post Slack.
    if (companyName && process.env.SLACK_LEADS_CHANNEL_ID) {
      const intentNow = deriveIntent([pathOf(capturedUrl)])
      try {
        await postSlackMessage(
          process.env.SLACK_LEADS_CHANNEL_ID,
          buildCompanySlackBlocks({
            companyName,
            capturedUrl,
            intent: intentNow,
            website,
            industry: (payload.Industry ?? "").trim(),
            employees: payload["Employee Count"] ?? null,
            revenue: (payload["Estimate Revenue"] ?? "").trim(),
            location: [payload.City, payload.State]
              .map((s) => (s ?? "").trim())
              .filter(Boolean)
              .join(", "),
            linkedin: rawLinkedin,
            seenAt: seenAt,
            isRepeat: Boolean(payload.is_repeat_visit),
          }),
          `Anonymous company visit: ${companyName} → ${capturedUrl}`,
          { unfurlLinks: false, unfurlMedia: false },
        )
      } catch (err) {
        console.error("[rb2b-webhook] company slack post failed", errMsg(err))
      }
      return NextResponse.json({ ok: true, companyOnly: true, intent: intentNow })
    }
    console.warn("[rb2b-webhook] missing identity and company; skipping")
    return NextResponse.json({ ok: true, skipped: "no identity" })
  }

  try {
    const existing = await findItemByColumnValue(RB2B_BOARD_ID, dedupeColumn, dedupeValue)
    const fullName =
      [firstName, lastName].filter(Boolean).join(" ").trim() || "Unknown visitor"
    const itemName = companyName ? `${fullName} — ${companyName}` : fullName
    const capturedPath = pathOf(capturedUrl)

    let itemId: string
    let pagesViewedAfter: string
    let isNew = false

    if (existing) {
      itemId = existing.id
      const existingPages = textOf(existing.columns[RB2B_COLUMNS.pagesViewed])
      pagesViewedAfter = appendPage(existingPages, capturedPath, isoDate(seenAt))
      await changeColumnValues(RB2B_BOARD_ID, itemId, {
        [RB2B_COLUMNS.pagesViewed]: pagesViewedAfter,
        [RB2B_COLUMNS.lastSeen]: { date: isoDate(seenAt) },
        [intentKey]: { label: deriveIntent(pagesViewedAfter.split("\n").map((l) => l.split(" ")[0])) },
        [RB2B_COLUMNS.repeatVisitor]: payload.is_repeat_visit ? { checked: "true" } : { checked: "false" },
      })
    } else {
      isNew = true
      itemId = await createItem(RB2B_BOARD_ID, "topics", itemName)
      pagesViewedAfter = `${capturedPath} (${isoDate(seenAt)})`
      const values: Record<string, unknown> = {
        [RB2B_COLUMNS.pagesViewed]: pagesViewedAfter,
        [RB2B_COLUMNS.lastSeen]: { date: isoDate(seenAt) },
        [intentKey]: { label: deriveIntent([capturedPath]) },
        [RB2B_COLUMNS.repeatVisitor]: payload.is_repeat_visit ? { checked: "true" } : { checked: "false" },
      }
      if (email) values[RB2B_COLUMNS.email] = { email, text: email }
      if (linkedin) values[RB2B_COLUMNS.linkedin] = { url: linkedin, text: linkedin }
      const title = (payload.Title ?? "").trim()
      if (title) values[RB2B_COLUMNS.title] = title
      if (companyName) values[RB2B_COLUMNS.company] = companyName
      if (website) values[RB2B_COLUMNS.website] = { url: website, text: website }
      const industry = (payload.Industry ?? "").trim()
      if (industry) values[RB2B_COLUMNS.industry] = industry
      const empCount = parseEmployeeCount(payload["Employee Count"])
      if (empCount != null) values[RB2B_COLUMNS.employees] = empCount
      const revenue = (payload["Estimate Revenue"] ?? "").trim()
      if (revenue) values[RB2B_COLUMNS.revenue] = revenue
      const loc = [payload.City, payload.State, payload.Zipcode]
        .map((s) => (s ?? "").trim())
        .filter(Boolean)
        .join(", ")
      if (loc) values[RB2B_COLUMNS.location] = loc
      const referrer = (payload.Referrer ?? "").trim()
      if (referrer) values[RB2B_COLUMNS.referrer] = { url: referrer, text: referrer }
      const tags = (payload.Tags ?? "").trim()
      if (tags) values[RB2B_COLUMNS.rb2bTags] = tags

      await changeColumnValues(RB2B_BOARD_ID, itemId, values)
    }

    const intentNow = deriveIntent(
      pagesViewedAfter.split("\n").map((l) => l.split(" ")[0]),
    )

    // Slack — only notify on first sighting OR when intent escalates to High.
    const previousIntent = existing
      ? (textOf(existing.columns[intentKey]) as Intent | "" | null) || null
      : null
    const shouldNotify = isNew || (intentNow === "High" && previousIntent !== "High")
    if (shouldNotify && process.env.SLACK_LEADS_CHANNEL_ID) {
      try {
        await postSlackMessage(
          process.env.SLACK_LEADS_CHANNEL_ID,
          buildSlackBlocks({
            itemId,
            itemName,
            title: (payload.Title ?? "").trim(),
            email,
            linkedin,
            company: companyName,
            capturedUrl,
            intent: intentNow,
            isNew,
          }),
          `${isNew ? "New" : "Hot"} lead: ${itemName} → ${capturedUrl}`,
        )
      } catch (err) {
        console.error("[rb2b-webhook] slack post failed", errMsg(err))
      }
    }

    // Reachly — TODO. Reachly does not publish a self-service add-lead API at
    // time of writing; configure outreach manually from Monday for now, or
    // swap in Smartlead / Instantly here once an endpoint is confirmed.
    if (isNew && process.env.REACHLY_API_KEY) {
      console.log("[rb2b-webhook] reachly push not yet implemented")
    }

    return NextResponse.json({ ok: true, itemId, isNew, intent: intentNow })
  } catch (err) {
    console.error("[rb2b-webhook] processing failed", errMsg(err))
    // Swallow to 200 so RB2B doesn't retry-storm; surface in Vercel logs.
    return NextResponse.json({ ok: false, error: errMsg(err) })
  }
}

function textOf(c: MondayColumnValue | undefined): string | null {
  if (!c) return null
  return c.text ?? null
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

// RB2B sends Employee Count as a number, numeric string, OR a range like
// "1-10" / "501-1000" / "10000+". Take the upper bound for sorting/filtering
// (lets "≥50 employees" views work). Returns null if unparseable.
function parseEmployeeCount(raw: number | string | null | undefined): number | null {
  if (raw == null || raw === "") return null
  if (typeof raw === "number" && Number.isFinite(raw)) return raw
  const s = String(raw).trim()
  if (!s) return null
  const matches = s.match(/\d[\d,]*/g)
  if (!matches?.length) return null
  const nums = matches.map((m) => Number(m.replace(/,/g, "")))
  const upper = Math.max(...nums.filter((n) => Number.isFinite(n)))
  return Number.isFinite(upper) ? upper : null
}

function buildSlackBlocks(args: {
  itemId: string
  itemName: string
  title: string
  email: string
  linkedin: string
  company: string
  capturedUrl: string
  intent: Intent
  isNew: boolean
}): Record<string, unknown>[] {
  const intentEmoji = args.intent === "High" ? ":fire:" : args.intent === "Medium" ? ":warning:" : ":eyes:"
  const lines: string[] = []
  if (args.title || args.company) {
    lines.push(`${args.title || "—"}${args.company ? ` @ *${args.company}*` : ""}`)
  }
  if (args.email) lines.push(`:email: <mailto:${args.email}|${args.email}>`)
  if (args.linkedin) lines.push(`:linkedin: <${args.linkedin}|LinkedIn>`)
  // Backticks suppress Slack auto-unfurl. The captured URL is always one of
  // our own pages, and we don't want our homepage previewing on every alert.
  if (args.capturedUrl) lines.push(`:link: \`${args.capturedUrl}\``)
  lines.push(
    `${intentEmoji} *${args.intent}* intent • <https://fruitionservices.monday.com/boards/${RB2B_BOARD_ID}/pulses/${args.itemId}|Open in Monday>`,
  )
  return [
    {
      type: "header",
      text: { type: "plain_text", text: `${args.isNew ? "New" : "Returning"} lead — ${args.itemName}` },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: lines.join("\n") },
    },
  ]
}
