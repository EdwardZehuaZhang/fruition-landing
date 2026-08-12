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
 * Read client for all CMS content.
 *
 * Every result is passed through rewriteBookingLinks, so a Calendly URL saved
 * in any Sanity field - hero CTA, sticky bar, page-builder block, a link in a
 * blog body - resolves to the on-site booking section. Doing it here rather
 * than at each render site means new CMS content can't reintroduce a raw
 * Calendly link. `siteSettings.calendlyLink` is deliberately exempt: the
 * booking card needs the real URL as its availability-failure escape hatch.
 */
export const client = {
  // Generic defaults to `any` to match next-sanity's own fetch signature -
  // call sites rely on that inference.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: async <T = any>(query: string, params?: Record<string, unknown>): Promise<T> =>
    rewriteBookingLinks(await base.fetch<T>(query, params ?? {})),
}
