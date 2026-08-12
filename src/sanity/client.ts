import { createClient } from 'next-sanity'
import { rewriteBookingLinks } from '@/lib/bookingLink'
import { apiVersion, dataset, projectId } from './env'

const base = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/**
 * Same project/dataset, but reads go straight to the Sanity API instead of
 * apicdn.sanity.io. The CDN holds a published document for up to ~60s after a
 * publish, which stacks on top of the route's own ISR window and Cloudflare's
 * - so an editor who published, hard-refreshed and saw the old content
 * concluded the change had not saved at all.
 *
 * Reserve this for content editors change and expect to verify immediately.
 * It costs an API request per fetch (no CDN hit), so it is not a default.
 */
const freshBase = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

// Generic defaults to `any` to match next-sanity's own fetch signature -
// call sites rely on that inference.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fetcher = <T = any>(query: string, params?: Record<string, unknown>) => Promise<T>

/**
 * Every result is passed through rewriteBookingLinks, so a Calendly URL saved
 * in any Sanity field - hero CTA, sticky bar, page-builder block, a link in a
 * blog body - resolves to the on-site booking section. Doing it here rather
 * than at each render site means new CMS content can't reintroduce a raw
 * Calendly link. `siteSettings.calendlyLink` is deliberately exempt: the
 * booking card needs the real URL as its availability-failure escape hatch.
 */
function wrap(c: typeof base): { fetch: Fetcher } {
  return {
    fetch: async (query, params) => rewriteBookingLinks(await c.fetch(query, params ?? {})),
  }
}

/** Read client for all CMS content. */
export const client = wrap(base)

/** Read client that bypasses the Sanity CDN. See freshBase above. */
export const freshClient = wrap(freshBase)
