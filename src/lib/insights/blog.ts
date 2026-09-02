/**
 * Blog insights: GA4 traffic, GA4 `cta_click` events and Search Console, shaped
 * for the insights panel.
 *
 * Every query asks for twice the requested window and splits it at the midpoint,
 * so the previous-period comparison costs no extra round trips.
 */
import { ga4Report, gscQuery, ga4Date, normalisePath } from "@/lib/googleAnalytics"
import type { InsightMetric, InsightsView, RankedSection, SeriesPoint } from "./types"

const POST_PREFIX = "/post/"

/** GA4 returns dates as YYYYMMDD. */
function ga4DateToIso(raw: string): string {
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
}

/**
 * Both windows end yesterday. Today is deliberately excluded: a partial day
 * makes the current period look worse than it is, and including it would also
 * make the current window one day longer than the one it is compared against.
 */
function splitAtMidpoint(
  daily: Map<string, number>,
  days: number,
): { current: SeriesPoint[]; currentTotal: number; previousTotal: number } {
  const cutoff = ga4Date(days)
  const current: SeriesPoint[] = []
  let currentTotal = 0
  let previousTotal = 0
  for (const [date, value] of [...daily.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (date >= cutoff) {
      current.push({ date, value })
      currentTotal += value
    } else {
      previousTotal += value
    }
  }
  return { current, currentTotal, previousTotal }
}

/**
 * GA4 reports sessions identically to page views once the report is filtered to
 * a path prefix, so the tiles show visitors (totalUsers) instead — two tiles
 * carrying the same number tell a reader nothing.
 */
async function ga4DailyPostMetrics(days: number): Promise<{
  views: Map<string, number>
  users: Map<string, number>
}> {
  const report = await ga4Report({
    dateRanges: [{ startDate: ga4Date(days * 2), endDate: ga4Date(1) }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: { matchType: "BEGINS_WITH", value: POST_PREFIX },
      },
    },
    limit: 400,
  })
  const views = new Map<string, number>()
  const users = new Map<string, number>()
  for (const row of report.rows ?? []) {
    const date = ga4DateToIso(row.dimensionValues[0]?.value ?? "")
    views.set(date, Number(row.metricValues[0]?.value ?? 0))
    users.set(date, Number(row.metricValues[1]?.value ?? 0))
  }
  return { views, users }
}

async function ga4DailyCtaClicks(days: number): Promise<Map<string, number>> {
  const report = await ga4Report({
    dateRanges: [{ startDate: ga4Date(days * 2), endDate: ga4Date(1) }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: "eventName",
              stringFilter: { matchType: "EXACT", value: "cta_click" },
            },
          },
          {
            filter: {
              fieldName: "pagePath",
              stringFilter: { matchType: "BEGINS_WITH", value: POST_PREFIX },
            },
          },
        ],
      },
    },
    limit: 400,
  })
  const daily = new Map<string, number>()
  for (const row of report.rows ?? []) {
    daily.set(ga4DateToIso(row.dimensionValues[0]?.value ?? ""), Number(row.metricValues[0]?.value ?? 0))
  }
  return daily
}

/** Restricts a Search Console query to blog URLs. */
const POST_PAGE_FILTER = {
  dimensionFilterGroups: [
    {
      filters: [{ dimension: "page", operator: "contains", expression: POST_PREFIX }],
    },
  ],
}

async function gscDaily(days: number): Promise<{ clicks: Map<string, number>; impressions: Map<string, number> }> {
  const rows = await gscQuery({
    startDate: ga4Date(days * 2),
    endDate: ga4Date(1),
    dimensions: ["date"],
    rowLimit: 500,
    ...POST_PAGE_FILTER,
  })
  const clicks = new Map<string, number>()
  const impressions = new Map<string, number>()
  for (const row of rows) {
    clicks.set(row.keys[0], row.clicks)
    impressions.set(row.keys[0], row.impressions)
  }
  return { clicks, impressions }
}

async function gscTopQueries(days: number, limit = 10): Promise<RankedSection> {
  const rows = await gscQuery({
    startDate: ga4Date(days),
    endDate: ga4Date(1),
    dimensions: ["query"],
    rowLimit: limit,
    ...POST_PAGE_FILTER,
  })
  return {
    title: "Search queries bringing people to the blog",
    unit: "clicks",
    items: rows.map((row) => ({
      label: row.keys[0],
      value: row.clicks,
      secondary: `pos ${row.position.toFixed(1)} · ${row.impressions.toLocaleString()} impr`,
    })),
    emptyLabel: "No search queries recorded for blog pages in this window.",
  }
}

async function gscTopCountries(days: number, limit = 8): Promise<RankedSection> {
  const rows = await gscQuery({
    startDate: ga4Date(days),
    endDate: ga4Date(1),
    dimensions: ["country"],
    rowLimit: limit,
    ...POST_PAGE_FILTER,
  })
  return {
    title: "Where blog search traffic comes from",
    unit: "clicks",
    items: rows.map((row) => ({
      label: row.keys[0].toUpperCase(),
      value: row.clicks,
      secondary: `${row.impressions.toLocaleString()} impr`,
    })),
    emptyLabel: "No country data for blog pages in this window.",
  }
}

export async function getBlogInsights(days: number): Promise<InsightsView> {
  const [ga4, cta, gsc, queries, countries] = await Promise.all([
    ga4DailyPostMetrics(days).catch(() => null),
    ga4DailyCtaClicks(days).catch(() => null),
    gscDaily(days).catch(() => null),
    gscTopQueries(days).catch(() => null),
    gscTopCountries(days).catch(() => null),
  ])

  if (!ga4 && !gsc) {
    return {
      metrics: [],
      sections: [],
      notes: [],
      available: false,
      unavailableReason:
        "Google Analytics is not reachable. Check GOOGLE_SA_KEY_B64 and GA4_PROPERTY_ID.",
    }
  }

  const views = splitAtMidpoint(ga4?.views ?? new Map(), days)
  const visitors = splitAtMidpoint(ga4?.users ?? new Map(), days)
  const ctaClicks = splitAtMidpoint(cta ?? new Map(), days)
  const searchClicks = splitAtMidpoint(gsc?.clicks ?? new Map(), days)
  const impressions = splitAtMidpoint(gsc?.impressions ?? new Map(), days)

  const metrics: InsightMetric[] = [
    {
      key: "views",
      label: "Blog views",
      value: views.currentTotal,
      previous: ga4 ? views.previousTotal : null,
      format: "number",
      caption: "GA4 page views on /post/",
      series: views.current,
    },
    {
      key: "visitors",
      label: "Visitors",
      value: visitors.currentTotal,
      previous: ga4 ? visitors.previousTotal : null,
      format: "number",
      caption: "GA4 unique users",
      series: visitors.current,
    },
    {
      key: "searchClicks",
      label: "Search clicks",
      value: searchClicks.currentTotal,
      previous: gsc ? searchClicks.previousTotal : null,
      format: "number",
      caption: "Search Console",
      series: searchClicks.current,
    },
    {
      key: "impressions",
      label: "Search impressions",
      value: impressions.currentTotal,
      previous: gsc ? impressions.previousTotal : null,
      format: "number",
      caption: "Search Console",
      series: impressions.current,
    },
    {
      key: "ctaClicks",
      label: "CTA clicks",
      value: ctaClicks.currentTotal,
      previous: cta ? ctaClicks.previousTotal : null,
      format: "number",
      caption: "GA4 cta_click on /post/",
      series: ctaClicks.current,
    },
  ]

  const notes: string[] = []
  if (cta && ctaClicks.currentTotal === 0 && ctaClicks.previousTotal === 0) {
    notes.push(
      "CTA clicks are being pushed to the GTM data layer as cta_click, but GA4 has not recorded any yet. Add a Custom Event trigger on cta_click in container GTM-PF6XWTL6 and forward it to GA4.",
    )
  }
  notes.push(
    "Windows end yesterday — today is excluded so the current period is never a partial day.",
  )
  if (gsc) {
    notes.push("Search Console reports with a two to three day lag, so the last days read low.")
  }

  return {
    metrics,
    sections: [queries, countries].filter((s): s is RankedSection => s !== null),
    notes,
    available: true,
  }
}

export { normalisePath }
