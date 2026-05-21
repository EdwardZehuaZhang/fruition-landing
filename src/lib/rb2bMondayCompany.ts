// Upsert helper for the "Companies (anonymous)" half of the RB2B → Monday
// pipeline. Shared between the realtime webhook (src/app/api/webhooks/rb2b/route.ts)
// and the CSV backfill script (scripts/backfill-rb2b-companies.ts), so both
// flows produce identical Monday rows.
//
// Dedupes by the company LinkedIn URL when available (most stable per-company
// identifier) and falls back to the company website. Skips the write
// entirely if neither identifier is present.

import {
  changeColumnValues,
  createItem,
  findItemByColumnValue,
} from "./mondayClient"
import { RB2B_BOARD_ID, RB2B_COLUMNS } from "./rb2bColumns"
import { deriveIntent, pathOf } from "./rb2bSlackBlocks"

export interface UpsertCompanyArgs {
  companyName: string
  linkedin: string
  website: string
  industry: string
  employees: number | string | null
  revenue: string
  location: string
  referrer: string
  tags: string
  capturedUrl: string
  seenAt: string
  isRepeat: boolean
}

export interface UpsertCompanyResult {
  itemId: string | undefined
  isNew: boolean
}

function isoDate(seenAt: string): string {
  if (!seenAt) return new Date().toISOString().slice(0, 10)
  const d = new Date(seenAt)
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10)
  return d.toISOString().slice(0, 10)
}

function appendPage(existing: string | null, capturedUrl: string, seenAt: string): string {
  const line = `${capturedUrl} (${seenAt})`
  if (!existing) return line
  const lines = existing.split("\n")
  if (lines[lines.length - 1] === line) return existing
  return `${existing}\n${line}`
}

// RB2B sends Employee Count as a range string ("1-10", "501-1000", "10000+")
// which Monday's numeric column rejects. Take the upper bound for sane sorting.
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

export async function upsertCompanyMondayItem(
  args: UpsertCompanyArgs,
): Promise<UpsertCompanyResult> {
  if (!args.companyName) return { itemId: undefined, isNew: false }

  const dedupeColumn = args.linkedin ? RB2B_COLUMNS.linkedin : RB2B_COLUMNS.website
  const dedupeValue = args.linkedin || args.website
  if (!dedupeValue) return { itemId: undefined, isNew: false }

  const capturedPath = pathOf(args.capturedUrl)
  const seenIso = isoDate(args.seenAt)
  const existing = await findItemByColumnValue(RB2B_BOARD_ID, dedupeColumn, dedupeValue)

  if (existing) {
    const itemId = existing.id
    const existingPages = (existing.columns[RB2B_COLUMNS.pagesViewed]?.text ?? null) as
      | string
      | null
    const pagesViewedAfter = appendPage(existingPages, capturedPath, seenIso)
    await changeColumnValues(RB2B_BOARD_ID, itemId, {
      [RB2B_COLUMNS.pagesViewed]: pagesViewedAfter,
      [RB2B_COLUMNS.lastSeen]: { date: seenIso },
      [RB2B_COLUMNS.intent]: {
        label: deriveIntent(pagesViewedAfter.split("\n").map((l) => l.split(" ")[0])),
      },
      [RB2B_COLUMNS.repeatVisitor]: args.isRepeat ? { checked: "true" } : { checked: "false" },
    })
    return { itemId, isNew: false }
  }

  const itemId = await createItem(RB2B_BOARD_ID, "topics", args.companyName)
  const pagesViewedAfter = `${capturedPath} (${seenIso})`
  const values: Record<string, unknown> = {
    [RB2B_COLUMNS.pagesViewed]: pagesViewedAfter,
    [RB2B_COLUMNS.lastSeen]: { date: seenIso },
    [RB2B_COLUMNS.intent]: { label: deriveIntent([capturedPath]) },
    [RB2B_COLUMNS.repeatVisitor]: args.isRepeat ? { checked: "true" } : { checked: "false" },
    [RB2B_COLUMNS.company]: args.companyName,
  }
  if (args.linkedin) values[RB2B_COLUMNS.linkedin] = { url: args.linkedin, text: args.linkedin }
  if (args.website) values[RB2B_COLUMNS.website] = { url: args.website, text: args.website }
  if (args.industry) values[RB2B_COLUMNS.industry] = args.industry
  const employees = parseEmployeeCount(args.employees)
  if (employees != null) values[RB2B_COLUMNS.employees] = employees
  if (args.revenue) values[RB2B_COLUMNS.revenue] = args.revenue
  if (args.location) values[RB2B_COLUMNS.location] = args.location
  if (args.referrer) values[RB2B_COLUMNS.referrer] = { url: args.referrer, text: args.referrer }
  if (args.tags) values[RB2B_COLUMNS.rb2bTags] = args.tags

  await changeColumnValues(RB2B_BOARD_ID, itemId, values)
  return { itemId, isNew: true }
}
