/**
 * On-site booking anchor — the BookingSection on the contact page.
 * bookingHref routes any legacy Calendly link (hardcoded or from Sanity)
 * there instead, so every "book a call" CTA lands on our own scheduler.
 * Non-Calendly URLs pass through untouched. Keep raw Calendly URLs only
 * for BookingSection's own availability-failure escape hatch.
 */
export const BOOKING_ANCHOR = "/contact-us#book"

export function bookingHref(url?: string | null): string {
  if (!url || /calendly\.com/i.test(url)) return BOOKING_ANCHOR
  return url
}

/**
 * The one Sanity field that must keep its raw Calendly URL: BookingSection
 * falls back to it when live availability can't load, and pointing that at
 * ourselves would strand the visitor.
 */
const RAW_LINK_KEYS = new Set(["calendlyLink"])

/**
 * Matches a string that IS a Calendly URL, not prose that merely mentions
 * calendly.com — rewriting body copy would destroy the sentence around it.
 */
const CALENDLY_URL_RE = /^\s*https?:\/\/(www\.)?calendly\.com\b\S*\s*$/i

/**
 * Deep-rewrites Calendly URLs in a CMS payload. Applied to every Sanity read
 * (see sanity/client.ts) so a Calendly link saved in any field — hero CTA,
 * sticky bar, page-builder block, a link inside a blog body — resolves to the
 * booking section. Editors don't have to know, and new CMS content can't
 * reintroduce a raw Calendly link.
 */
export function rewriteBookingLinks<T>(value: T): T {
  if (typeof value === "string") {
    return (CALENDLY_URL_RE.test(value) ? BOOKING_ANCHOR : value) as T
  }
  if (Array.isArray(value)) {
    return value.map((v) => rewriteBookingLinks(v)) as T
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = RAW_LINK_KEYS.has(k) ? v : rewriteBookingLinks(v)
    }
    return out as T
  }
  return value
}
