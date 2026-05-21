/* eslint-disable no-console */
// Backfill historical RB2B Companies-stream rows into #website-leads.
//
// Reads a custom-report CSV exported from app.rb2b.com/companies and posts
// one "Anonymous visit" Slack block per row, reusing the same formatter the
// live webhook uses. Filters out Fruition self-traffic. Skips Person rows
// (ProfileType=Person) since those land via the realtime webhook already.
//
// Usage:
//   pnpm tsx scripts/backfill-rb2b-companies.ts <path-to-csv> [--dry] [--no-slack]
//
// --dry         print intended actions without writing anything
// --no-slack    Monday-only re-run (skip Slack posts to avoid duplicate
//               #website-leads messages when backfilling historical CSV
//               data that's already been Slack-notified)
//
// Requires .env.local with MONDAY_API_TOKEN, SLACK_BOT_TOKEN, SLACK_LEADS_CHANNEL_ID.

import { readFileSync } from "node:fs"
import { config as loadEnv } from "dotenv"
import {
  buildCompanySlackBlocks,
  deriveIntent,
  isFruitionSelfTraffic,
  resolveCompanyLogo,
  type Intent,
} from "../src/lib/rb2bSlackBlocks"
import { upsertCompanyMondayItem } from "../src/lib/rb2bMondayCompany"
import { postSlackMessage } from "../src/lib/slackClient"

loadEnv({ path: ".env.local" })

const SLEEP_MS = 1100 // stay under Slack's 1 msg/sec channel-post limit

function parseCsv(text: string): Record<string, string>[] {
  // Minimal RFC4180-ish parser: handles quoted fields with commas and
  // doubled quotes. Good enough for RB2B's well-formed exports.
  const rows: string[][] = []
  let field = ""
  let row: string[] = []
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ",") {
        row.push(field)
        field = ""
      } else if (ch === "\n") {
        row.push(field)
        rows.push(row)
        row = []
        field = ""
      } else if (ch === "\r") {
        // skip CR; LF will terminate
      } else {
        field += ch
      }
    }
  }
  if (field.length || row.length) {
    row.push(field)
    rows.push(row)
  }
  if (!rows.length) return []
  const [header, ...data] = rows
  return data
    .filter((r) => r.some((c) => c.length))
    .map((r) => Object.fromEntries(header.map((h, idx) => [h.trim(), (r[idx] ?? "").trim()])))
}

function firstUrl(jsonArray: string): string {
  if (!jsonArray) return ""
  try {
    const parsed = JSON.parse(jsonArray) as unknown
    if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "string") {
      return parsed[0]
    }
  } catch {
    // fall through
  }
  return ""
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function main(): Promise<void> {
  const csvPath = process.argv[2]
  const dry = process.argv.includes("--dry")
  const skipSlack = process.argv.includes("--no-slack")
  if (!csvPath) {
    console.error("usage: tsx scripts/backfill-rb2b-companies.ts <csv> [--dry] [--no-slack]")
    process.exit(1)
  }
  const channel = process.env.SLACK_LEADS_CHANNEL_ID
  if (!channel && !dry && !skipSlack) {
    console.error("SLACK_LEADS_CHANNEL_ID missing in env")
    process.exit(1)
  }

  const text = readFileSync(csvPath, "utf8")
  const rows = parseCsv(text)
  console.log(`[backfill] parsed ${rows.length} rows from ${csvPath}`)

  let sent = 0
  let skipSelf = 0
  let skipPerson = 0
  let skipNoCompany = 0

  for (const row of rows) {
    const profileType = row["ProfileType"]?.toLowerCase() ?? ""
    if (profileType === "person") {
      skipPerson++
      continue
    }
    const companyName = row["CompanyName"]
    if (!companyName) {
      skipNoCompany++
      continue
    }
    const website = row["Website"] ?? ""
    const linkedin = row["LinkedInUrl"] ?? ""
    if (isFruitionSelfTraffic({ companyName, website, linkedin })) {
      skipSelf++
      console.log(`[backfill] skip self: ${companyName}`)
      continue
    }

    const capturedUrl = firstUrl(row["RecentPageUrls"] ?? "")
    const intent: Intent = deriveIntent([capturedUrl])
    const location = [row["City"], row["State"]].filter(Boolean).join(", ")
    const isRepeat = (row["NewProfile"] ?? "").toLowerCase() !== "true"
    const seenAt = row["LastSeenAt"] ?? ""
    const upsertArgs = {
      companyName,
      linkedin,
      website: website.trim(),
      industry: row["Industry"] ?? "",
      employees: row["EstimatedEmployeeCount"] ?? null,
      revenue: row["EstimateRevenue"] ?? "",
      location: [row["City"], row["State"], row["Zipcode"]].filter(Boolean).join(", "),
      referrer: row["MostRecentReferrer"] ?? "",
      tags: row["Tags"] ?? "",
      capturedUrl,
      seenAt,
      isRepeat,
    }
    const logoUrl = await resolveCompanyLogo(website.trim())
    const blocks = buildCompanySlackBlocks({
      companyName,
      capturedUrl,
      intent,
      website: website.trim(),
      industry: row["Industry"] ?? "",
      employees: row["EstimatedEmployeeCount"] ?? null,
      revenue: row["EstimateRevenue"] ?? "",
      location,
      linkedin,
      seenAt,
      isRepeat,
      logoUrl,
    })
    const text = `Anonymous company visit (backfill): ${companyName} → ${capturedUrl}`

    if (dry) {
      console.log(`[backfill] DRY would upsert+post: ${text}`)
    } else {
      try {
        const monday = await upsertCompanyMondayItem(upsertArgs)
        console.log(`[backfill] monday: ${companyName} -> ${monday.itemId ?? "skip"} (new=${monday.isNew})`)
      } catch (err) {
        console.error(`[backfill] monday failed: ${companyName}`, err)
      }
      if (!skipSlack) {
        try {
          await postSlackMessage(channel!, blocks, text, { unfurlLinks: false, unfurlMedia: false })
          sent++
          console.log(`[backfill] sent: ${companyName} (${intent})`)
        } catch (err) {
          console.error(`[backfill] failed: ${companyName}`, err)
        }
        await sleep(SLEEP_MS)
      }
    }
  }

  console.log(
    `[backfill] done — sent=${sent} skipSelf=${skipSelf} skipPerson=${skipPerson} skipNoCompany=${skipNoCompany}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
