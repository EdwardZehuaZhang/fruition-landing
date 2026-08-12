/**
 * UTM tagging for outbound monday.com links.
 *
 * Every "Get started with monday.com" CTA sends a visitor to monday.com's own
 * signup, where the referral is invisible to us unless the URL carries UTM
 * parameters. Tagging them lets monday.com's partner reporting attribute the
 * signup back to Fruition and to the specific page that sent it.
 *
 * Only monday.com hosts are touched, so this is safe to run over a whole CMS
 * payload: booking anchors, image URLs and body copy pass through untouched.
 */

/** monday.com and any subdomain of it (try., auth., view., …). */
const MONDAY_HOST = /(^|\.)monday\.com$/i

export const UTM_SOURCE = "fruition"
export const UTM_MEDIUM = "referral"

/** Campaign for the UK partner page (backlog #9 / Monday #2817806806). */
export const UK_PARTNER_CAMPAIGN = "uk_partner_page"

/**
 * Appends the Fruition UTM triplet to a monday.com URL.
 *
 * Non-monday.com URLs, relative hrefs and unparseable strings are returned
 * unchanged. A parameter already present on the URL wins, so an editor can
 * override the campaign per-link from Sanity without it being stamped over.
 */
export function withMondayUtm(url: string, campaign: string): string {
  if (!/^https?:\/\//i.test(url)) return url

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }
  if (!MONDAY_HOST.test(parsed.hostname)) return url

  const params: Array<[string, string]> = [
    ["utm_source", UTM_SOURCE],
    ["utm_medium", UTM_MEDIUM],
    ["utm_campaign", campaign],
  ]
  for (const [key, value] of params) {
    if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value)
  }
  return parsed.toString()
}

/**
 * Deep-tags every monday.com URL in a CMS payload, mirroring the shape of
 * rewriteBookingLinks in bookingLink.ts.
 *
 * The regional partner pages drive most of their CTAs from Sanity - hero
 * secondary CTA, sticky bar, CRO blocks, feature-block links, team-grid CTA -
 * so an editor can point any of them at monday.com. Walking the payload tags
 * whichever ones do, instead of tagging a fixed list of fields that goes stale
 * the moment a new CTA field is added to the schema.
 */
export function addMondayUtm<T>(value: T, campaign: string): T {
  if (typeof value === "string") {
    return withMondayUtm(value, campaign) as T
  }
  if (Array.isArray(value)) {
    return value.map((v) => addMondayUtm(v, campaign)) as T
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = addMondayUtm(v, campaign)
    return out as T
  }
  return value
}
