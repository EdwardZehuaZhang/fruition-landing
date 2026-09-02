/**
 * Social insights from Zernio, shaped for the same panel the blog tab uses.
 *
 * Two things to keep in mind about this data, both surfaced as notes in the UI
 * rather than hidden:
 *
 *  1. Zernio's analytics feed is capped at 100 posts (asking for more is a known
 *     way to break it — see the social integration notes), so a long window can
 *     be truncated. `truncated` reports when that happened.
 *  2. The per-post metrics are lifetime-to-date, not per-day. Bucketing them by
 *     publish date gives "how the posts published that day have performed since",
 *     which is the useful read for content, but it is NOT a daily activity chart.
 */
import { fetchAnalytics, type AnalyticsRow } from "@/lib/social/zernio"
import type { InsightMetric, InsightsView, RankedItem, SeriesPoint } from "./types"

const FEED_LIMIT = 100

function engagements(row: AnalyticsRow): number {
  const m = row.metrics
  return m.likes + m.comments + m.shares + m.saves
}

function isoDay(value?: string): string | null {
  if (!value) return null
  const t = Date.parse(value)
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10)
}

function dayString(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 86_400_000).toISOString().slice(0, 10)
}

function toSeries(byDay: Map<string, number>): SeriesPoint[] {
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }))
}

/**
 * LinkedIn stores mentions as `@[Display Name](urn:li:organization:123)`. Left
 * raw, a top-posts list is mostly URNs. Keep the display name and drop the urn.
 */
export function readableContent(raw: string): string {
  return raw
    .replace(/@\[([^\]]+)\]\((?:urn:li:[^)]+)\)/g, "@$1")
    .replace(/\s+/g, " ")
    .trim()
}

function platformLabel(platform: string): string {
  const known: Record<string, string> = {
    linkedin: "LinkedIn",
    facebook: "Facebook",
    instagram: "Instagram",
    x: "X",
    twitter: "X",
    threads: "Threads",
    tiktok: "TikTok",
    youtube: "YouTube",
    pinterest: "Pinterest",
    gbp: "Google Business",
    google: "Google Business",
  }
  return known[platform.toLowerCase()] ?? platform
}

export async function getSocialInsights(days: number): Promise<InsightsView> {
  if (!process.env.ZERNIO_API_KEY) {
    return {
      metrics: [],
      sections: [],
      notes: [],
      available: false,
      unavailableReason: "Zernio is not configured (ZERNIO_API_KEY missing).",
    }
  }

  let rows: AnalyticsRow[]
  try {
    rows = (await fetchAnalytics(FEED_LIMIT)).rows
  } catch (err) {
    return {
      metrics: [],
      sections: [],
      notes: [],
      available: false,
      unavailableReason: `Could not load Zernio analytics: ${err instanceof Error ? err.message : String(err)}`,
    }
  }

  // Both windows end yesterday and are exactly `days` long, so the comparison
  // is like for like and today's partial day never drags the current one down.
  const endExclusive = dayString(0)
  const currentFrom = dayString(days)
  const previousFrom = dayString(days * 2)

  const current: AnalyticsRow[] = []
  const previous: AnalyticsRow[] = []
  let undated = 0
  for (const row of rows) {
    const day = isoDay(row.publishedAt)
    if (!day) {
      undated += 1
      continue
    }
    if (day >= endExclusive) continue
    if (day >= currentFrom) current.push(row)
    else if (day >= previousFrom) previous.push(row)
  }

  const sum = (list: AnalyticsRow[], pick: (r: AnalyticsRow) => number) =>
    list.reduce((total, row) => total + pick(row), 0)

  const bucket = (list: AnalyticsRow[], pick: (r: AnalyticsRow) => number) => {
    const byDay = new Map<string, number>()
    for (const row of list) {
      const day = isoDay(row.publishedAt)
      if (!day) continue
      byDay.set(day, (byDay.get(day) ?? 0) + pick(row))
    }
    return toSeries(byDay)
  }

  const impressions = sum(current, (r) => r.metrics.impressions)
  const prevImpressions = sum(previous, (r) => r.metrics.impressions)
  const engaged = sum(current, engagements)
  const prevEngaged = sum(previous, engagements)

  const rate = (e: number, i: number) => (i > 0 ? (e / i) * 100 : 0)

  const metrics: InsightMetric[] = [
    {
      key: "posts",
      label: "Posts published",
      value: current.length,
      previous: previous.length,
      format: "number",
      caption: "By publish date",
      series: bucket(current, () => 1),
    },
    {
      key: "impressions",
      label: "Impressions",
      value: impressions,
      previous: prevImpressions,
      format: "number",
      caption: "Lifetime, by publish date",
      series: bucket(current, (r) => r.metrics.impressions),
    },
    {
      key: "engagements",
      label: "Engagements",
      value: engaged,
      previous: prevEngaged,
      format: "number",
      caption: "Likes, comments, shares, saves",
      series: bucket(current, engagements),
    },
    {
      key: "clicks",
      label: "Link clicks",
      value: sum(current, (r) => r.metrics.clicks),
      previous: sum(previous, (r) => r.metrics.clicks),
      format: "number",
      caption: "Reported by the platform",
      series: bucket(current, (r) => r.metrics.clicks),
    },
    {
      key: "engagementRate",
      label: "Engagement rate",
      value: rate(engaged, impressions),
      previous: previous.length > 0 ? rate(prevEngaged, prevImpressions) : null,
      format: "percent",
      caption: "Engagements ÷ impressions",
      series: [],
    },
  ]

  // Per-platform totals.
  const byPlatform = new Map<string, { impressions: number; engagements: number; posts: number }>()
  for (const row of current) {
    const key = platformLabel(row.platform)
    const entry = byPlatform.get(key) ?? { impressions: 0, engagements: 0, posts: 0 }
    entry.impressions += row.metrics.impressions
    entry.engagements += engagements(row)
    entry.posts += 1
    byPlatform.set(key, entry)
  }

  const platformItems: RankedItem[] = [...byPlatform.entries()]
    .map(([label, v]) => ({
      label,
      value: v.impressions,
      secondary: `${v.posts} ${v.posts === 1 ? "post" : "posts"} · ${rate(v.engagements, v.impressions).toFixed(1)}% eng`,
    }))
    .sort((a, b) => b.value - a.value)

  const topPosts: RankedItem[] = [...current]
    .sort((a, b) => b.metrics.impressions - a.metrics.impressions)
    .slice(0, 10)
    .map((row) => ({
      label: readableContent(row.content).slice(0, 110) || "(no text)",
      sublabel: `${platformLabel(row.platform)}${row.external ? " · published outside Zernio" : ""}`,
      href: row.platformPostUrl,
      value: row.metrics.impressions,
      secondary: `${engagements(row).toLocaleString()} eng · ${row.metrics.engagementRate.toFixed(1)}%`,
    }))

  const notes: string[] = [
    "Windows end yesterday — today is excluded so the current period is never a partial day.",
    "Per-post numbers are lifetime totals grouped by publish date, so the chart reads as “how the posts published that day have performed since”, not daily activity.",
  ]
  if (rows.length >= FEED_LIMIT) {
    notes.push(
      `Zernio returns at most ${FEED_LIMIT} posts, so windows longer than the last ${FEED_LIMIT} posts are truncated.`,
    )
  }
  if (undated > 0) {
    notes.push(`${undated} post${undated === 1 ? "" : "s"} had no publish date and were left out.`)
  }

  return {
    metrics,
    sections: [
      {
        title: "By platform",
        unit: "impressions",
        items: platformItems,
        emptyLabel: "No posts published in this window.",
      },
      {
        title: "Top posts",
        unit: "impressions",
        items: topPosts,
        emptyLabel: "No posts published in this window.",
      },
    ],
    notes,
    available: true,
  }
}
