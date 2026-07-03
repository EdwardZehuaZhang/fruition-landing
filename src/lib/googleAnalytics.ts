/**
 * Read-only GA4 (Data API) + Google Search Console (Search Analytics) clients.
 * Auth via the shared service account (see googleServiceAuth.ts). All functions
 * return null / empty on missing config so callers can render a graceful
 * "not connected yet" state instead of throwing.
 *
 * Env:
 *   GOOGLE_SA_KEY_B64  — base64 of the service-account JSON (server-only)
 *   GA4_PROPERTY_ID    — numeric GA4 property id (e.g. 542191003)
 *   GSC_SITE_URL       — optional; the exact Search Console property
 *                        (`sc-domain:fruitionservices.io` or
 *                        `https://www.fruitionservices.io/`). Auto-detected if unset.
 */
import { getGoogleAccessToken } from "./googleServiceAuth"

const SCOPE_GA4 = "https://www.googleapis.com/auth/analytics.readonly"
const SCOPE_GSC = "https://www.googleapis.com/auth/webmasters.readonly"

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10)
}

/* ----------------------------- GA4 ----------------------------- */

export interface Ga4Overview {
  totalUsers: number
  sessions: number
  pageViews: number
  conversions: number
  daily: { date: string; users: number }[]
  topCountries: { country: string; users: number }[]
}

interface Ga4Row {
  dimensionValues: { value: string }[]
  metricValues: { value: string }[]
}

async function ga4RunReport(
  property: string,
  token: string,
  body: Record<string, unknown>,
): Promise<{ rows?: Ga4Row[] }> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
  if (!res.ok) throw new Error(`GA4 runReport ${res.status}: ${await res.text()}`)
  return res.json() as Promise<{ rows?: Ga4Row[] }>
}

export async function getGa4Overview(days = 28): Promise<Ga4Overview | null> {
  const property = process.env.GA4_PROPERTY_ID
  if (!property) return null

  const token = await getGoogleAccessToken([SCOPE_GA4])
  const dateRanges = [{ startDate: isoDaysAgo(days), endDate: "today" }]

  // Daily totals. "keyEvents" is GA4's current name for conversions; if the
  // property rejects it, retry without so the core metrics still resolve.
  const baseMetrics = [{ name: "totalUsers" }, { name: "sessions" }, { name: "screenPageViews" }]
  let rows: Ga4Row[] = []
  let hasConversions = false
  try {
    const r = await ga4RunReport(property, token, {
      dateRanges,
      dimensions: [{ name: "date" }],
      metrics: [...baseMetrics, { name: "keyEvents" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 400,
    })
    rows = r.rows ?? []
    hasConversions = true
  } catch {
    const r = await ga4RunReport(property, token, {
      dateRanges,
      dimensions: [{ name: "date" }],
      metrics: baseMetrics,
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 400,
    })
    rows = r.rows ?? []
  }

  let totalUsers = 0
  let sessions = 0
  let pageViews = 0
  let conversions = 0
  const daily: { date: string; users: number }[] = []
  for (const row of rows) {
    const d = row.dimensionValues[0]?.value ?? ""
    const users = Number(row.metricValues[0]?.value ?? 0)
    totalUsers += users
    sessions += Number(row.metricValues[1]?.value ?? 0)
    pageViews += Number(row.metricValues[2]?.value ?? 0)
    if (hasConversions) conversions += Number(row.metricValues[3]?.value ?? 0)
    daily.push({ date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, users })
  }

  let topCountries: { country: string; users: number }[] = []
  try {
    const geo = await ga4RunReport(property, token, {
      dateRanges,
      dimensions: [{ name: "country" }],
      metrics: [{ name: "totalUsers" }],
      orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
      limit: 6,
    })
    topCountries = (geo.rows ?? []).map((r) => ({
      country: r.dimensionValues[0]?.value ?? "—",
      users: Number(r.metricValues[0]?.value ?? 0),
    }))
  } catch {
    // countries are a nice-to-have; ignore failures
  }

  return { totalUsers, sessions, pageViews, conversions, daily, topCountries }
}

/* ----------------------------- GSC ----------------------------- */

export interface GscClicks {
  siteUrl: string
  /** pathname (e.g. "/post/foo") → total clicks over the window */
  byPath: Map<string, number>
  totalClicks: number
  totalImpressions: number
}

async function resolveGscSite(token: string): Promise<string | null> {
  const override = process.env.GSC_SITE_URL
  if (override) return override
  const res = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  const data = (await res.json()) as { siteEntry?: { siteUrl: string }[] }
  const sites = data.siteEntry ?? []
  // Prefer a domain property, then any URL-prefix on the domain.
  const domain = sites.find((s) => s.siteUrl.startsWith("sc-domain:") && /fruitionservices\.io/i.test(s.siteUrl))
  const prefix = sites.find((s) => /fruitionservices\.io/i.test(s.siteUrl))
  return (domain ?? prefix)?.siteUrl ?? null
}

export async function getGscClicksByPage(days = 28): Promise<GscClicks | null> {
  const token = await getGoogleAccessToken([SCOPE_GSC])
  const siteUrl = await resolveGscSite(token)
  if (!siteUrl) return null

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: isoDaysAgo(days),
        endDate: isoDaysAgo(0),
        dimensions: ["page"],
        rowLimit: 1000,
      }),
    },
  )
  if (!res.ok) throw new Error(`GSC searchAnalytics ${res.status}: ${await res.text()}`)
  const data = (await res.json()) as {
    rows?: { keys: string[]; clicks: number; impressions: number }[]
  }

  const byPath = new Map<string, number>()
  let totalClicks = 0
  let totalImpressions = 0
  for (const row of data.rows ?? []) {
    let path: string
    try {
      path = new URL(row.keys[0]).pathname.replace(/\/$/, "") || "/"
    } catch {
      continue
    }
    byPath.set(path, (byPath.get(path) ?? 0) + row.clicks)
    totalClicks += row.clicks
    totalImpressions += row.impressions
  }
  return { siteUrl, byPath, totalClicks, totalImpressions }
}
