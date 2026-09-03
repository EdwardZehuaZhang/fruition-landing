/**
 * Umami analytics, shaped for the insights panel.
 *
 * Umami covers the one thing GA4 and Search Console do not give us in a usable
 * form here: where visitors actually come from (channels and referrers), plus
 * custom events — which is how CTA clicks can be counted without waiting on a
 * GTM tag.
 *
 * Cloud API, verified against the live endpoint: base `https://api.umami.is/v1`
 * with an `x-umami-api-key` header (no key → 400, bad key → 401). A self-hosted
 * instance uses the same paths under `<host>/api`, so UMAMI_API_URL overrides
 * the base.
 *
 * Everything here is inert until UMAMI_API_KEY and UMAMI_WEBSITE_ID are set:
 * `isUmamiConfigured()` is false and the callers render nothing.
 */
import type { InsightMetric, InsightsView, RankedSection, SeriesPoint } from "./types"

const DEFAULT_API_URL = "https://api.umami.is/v1"

export function isUmamiConfigured(): boolean {
  return Boolean(process.env.UMAMI_API_KEY && process.env.UMAMI_WEBSITE_ID)
}

function apiBase(): string {
  return (process.env.UMAMI_API_URL || DEFAULT_API_URL).replace(/\/+$/, "")
}

async function umami<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const key = process.env.UMAMI_API_KEY
  const websiteId = process.env.UMAMI_WEBSITE_ID
  if (!key || !websiteId) throw new Error("Umami is not configured")

  const url = new URL(`${apiBase()}/websites/${websiteId}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v))

  const res = await fetch(url, {
    headers: { "x-umami-api-key": key, accept: "application/json" },
    // Live analytics: never let Next's fetch cache pin a stale window.
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Umami ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return (await res.json()) as T
}

/** Umami takes millisecond timestamps. Windows end at midnight today, matching the other tabs. */
function windowMs(days: number): { startAt: number; endAt: number } {
  const endAt = new Date()
  endAt.setUTCHours(0, 0, 0, 0)
  const startAt = endAt.getTime() - days * 86_400_000
  return { startAt, endAt: endAt.getTime() }
}

interface UmamiStat {
  value: number
  prev?: number
}

interface UmamiStats {
  pageviews: UmamiStat
  visitors: UmamiStat
  visits: UmamiStat
  bounces: UmamiStat
  totaltime: UmamiStat
}

interface UmamiSeries {
  pageviews: { x: string; y: number }[]
  sessions: { x: string; y: number }[]
}

interface UmamiMetric {
  x: string | null
  y: number
}

/** Umami returns `{value, prev}` on newer builds and a bare number on older ones. */
function stat(raw: UmamiStat | number | undefined): { value: number; previous: number | null } {
  if (typeof raw === "number") return { value: raw, previous: null }
  return { value: raw?.value ?? 0, previous: raw?.prev ?? null }
}

function toSeries(points: { x: string; y: number }[] | undefined): SeriesPoint[] {
  return (points ?? []).map((p) => ({ date: String(p.x).slice(0, 10), value: p.y }))
}

async function metricSection(
  type: string,
  title: string,
  unit: string,
  window: { startAt: number; endAt: number },
  opts: { limit?: number; pathPrefix?: string; emptyLabel?: string } = {},
): Promise<RankedSection | null> {
  try {
    const params: Record<string, string | number> = {
      startAt: window.startAt,
      endAt: window.endAt,
      type,
      limit: opts.limit ?? 10,
    }
    // Umami's filters are exact-match, so a prefix is expressed as a wildcard.
    if (opts.pathPrefix) params.path = `${opts.pathPrefix}*`

    const rows = await umami<UmamiMetric[]>("/metrics", params)
    return {
      title,
      unit,
      items: rows
        .filter((r) => r.y > 0)
        .map((r) => ({ label: r.x?.trim() || "(direct / none)", value: r.y })),
      emptyLabel: opts.emptyLabel,
    }
  } catch {
    return null
  }
}

/**
 * Site-wide traffic: the numbers Umami is actually authoritative for.
 * `pathPrefix` scopes it (e.g. "/post/") when the caller wants blog-only.
 */
export async function getUmamiInsights(days: number, pathPrefix?: string): Promise<InsightsView> {
  if (!isUmamiConfigured()) {
    return {
      metrics: [],
      sections: [],
      notes: [],
      available: false,
      unavailableReason:
        "Umami is not connected. Set UMAMI_API_KEY and UMAMI_WEBSITE_ID (and NEXT_PUBLIC_UMAMI_WEBSITE_ID for the tracking script).",
    }
  }

  const window = windowMs(days)
  const scoped: Record<string, string | number> = pathPrefix ? { path: `${pathPrefix}*` } : {}

  const [stats, series, channels, referrers, paths, events, countries] = await Promise.all([
    umami<UmamiStats>("/stats", { ...window, ...scoped, compare: "prev" }).catch(() => null),
    umami<UmamiSeries>("/pageviews", { ...window, ...scoped, unit: "day" }).catch(() => null),
    metricSection("channel", "Channels", "visitors", window, { pathPrefix }),
    metricSection("referrer", "Referrers", "visitors", window, {
      pathPrefix,
      emptyLabel: "No external referrers recorded yet.",
    }),
    metricSection("path", pathPrefix ? "Top blog pages" : "Top pages", "views", window, { pathPrefix }),
    metricSection("event", "Custom events", "events", window, {
      emptyLabel: "No custom events recorded yet — cta_click appears here once the script is live.",
    }),
    metricSection("country", "Countries", "visitors", window, { pathPrefix, limit: 8 }),
  ])

  if (!stats && !series) {
    return {
      metrics: [],
      sections: [],
      notes: [],
      available: false,
      unavailableReason: "Umami is configured but its API could not be reached.",
    }
  }

  const visitors = stat(stats?.visitors)
  const pageviews = stat(stats?.pageviews)
  const visits = stat(stats?.visits)
  const bounces = stat(stats?.bounces)
  const totaltime = stat(stats?.totaltime)

  // Umami reports bounces and total time as raw counts/seconds against visits.
  const bounceRate = visits.value > 0 ? (bounces.value / visits.value) * 100 : 0
  const prevBounceRate =
    visits.previous && visits.previous > 0 && bounces.previous != null
      ? (bounces.previous / visits.previous) * 100
      : null
  const avgSeconds = visits.value > 0 ? totaltime.value / visits.value : 0
  const prevAvgSeconds =
    visits.previous && visits.previous > 0 && totaltime.previous != null
      ? totaltime.previous / visits.previous
      : null

  const metrics: InsightMetric[] = [
    {
      key: "visitors",
      label: "Visitors",
      value: visitors.value,
      previous: visitors.previous,
      format: "number",
      caption: "Umami unique visitors",
      series: toSeries(series?.sessions),
    },
    {
      key: "pageviews",
      label: "Page views",
      value: pageviews.value,
      previous: pageviews.previous,
      format: "number",
      caption: "Umami",
      series: toSeries(series?.pageviews),
    },
    {
      key: "visits",
      label: "Visits",
      value: visits.value,
      previous: visits.previous,
      format: "number",
      caption: "Sessions",
      series: [],
    },
    {
      key: "bounceRate",
      label: "Bounce rate",
      value: bounceRate,
      previous: prevBounceRate,
      format: "percent",
      caption: "Single-page visits",
      series: [],
      lowerIsBetter: true,
    },
    {
      key: "avgVisit",
      label: "Avg visit",
      value: avgSeconds / 60,
      previous: prevAvgSeconds == null ? null : prevAvgSeconds / 60,
      format: "decimal",
      caption: "Minutes per visit",
      series: [],
    },
  ]

  return {
    metrics,
    sections: [channels, referrers, paths, events, countries].filter(
      (s): s is RankedSection => s !== null,
    ),
    notes: [
      "Umami only sees traffic recorded by its own script, so it starts from the day it was switched on — it has no history before that.",
    ],
    available: true,
  }
}
