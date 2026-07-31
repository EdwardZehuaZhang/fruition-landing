/**
 * One-off: per-page GA4 pageviews + GSC clicks/impressions, last 30 days.
 * Usage: npx tsx --env-file=.env.local scripts/_traffic-audit.ts
 */
import { getGoogleAccessToken } from '../src/lib/googleServiceAuth'
import { getGscClicksByPage } from '../src/lib/googleAnalytics'

const SCOPE_GA4 = 'https://www.googleapis.com/auth/analytics.readonly'

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10)
}

async function main() {
  const property = process.env.GA4_PROPERTY_ID
  if (!property) throw new Error('GA4_PROPERTY_ID not set')
  const token = await getGoogleAccessToken([SCOPE_GA4])

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [{ startDate: isoDaysAgo(30), endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
        limit: 500,
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      }),
    },
  )
  if (!res.ok) throw new Error(`GA4 ${res.status}: ${await res.text()}`)
  const data = (await res.json()) as {
    rows?: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }[]
  }

  const pages = (data.rows ?? []).map((r) => ({
    path: r.dimensionValues[0].value,
    views: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
  }))

  console.log('== GA4 pageviews, last 30 days (all tracked paths) ==')
  for (const p of pages) console.log(`${String(p.views).padStart(6)}  ${String(p.users).padStart(6)}  ${p.path}`)

  const gsc = await getGscClicksByPage(30)
  if (gsc) {
    console.log('\n== GSC clicks/impressions by page, last 30 days ==')
    const rows = (gsc as unknown as { pages?: { page: string; clicks: number; impressions: number }[] }).pages
    if (rows) for (const r of rows) console.log(`${String(r.clicks).padStart(5)}  ${String(r.impressions).padStart(7)}  ${r.page}`)
    else console.log(JSON.stringify(gsc).slice(0, 3000))
  } else {
    console.log('\nGSC: not configured')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
