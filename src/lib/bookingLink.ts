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
