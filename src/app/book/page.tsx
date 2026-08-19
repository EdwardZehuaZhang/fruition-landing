import BookingSection from "@/components/sections/BookingSection"
import { buildOgMetadata } from "@/lib/metadata"

/**
 * Standalone booking page — the same BookingSection that sits on /contact-us,
 * with nothing above it.
 *
 * It exists for cold outreach. /contact-us#book works, but the anchor lands
 * ~2000px down a page whose hero, world map and six office cards all load
 * first; on mobile the jump is jarring and the scroll position is fragile
 * while the section is still measuring. A recipient who clicked "book a time"
 * should see a calendar, not a scroll animation.
 *
 * Deliberately not indexed: it duplicates the booking band on /contact-us and
 * every other page, so letting it compete in search would split the signal for
 * no gain. Campaign traffic arrives by direct link, which noindex doesn't
 * affect.
 */

export async function generateMetadata() {
  const title = "Book a meeting | Fruition"
  const description =
    "Pick a time with a monday.com specialist in your region. 30 minutes, live availability from a real consultant's calendar."
  return {
    alternates: { canonical: "/book" },
    title,
    description,
    robots: { index: false, follow: true },
    ...buildOgMetadata({ title, description, path: "/book" }),
  }
}

export default function BookPage() {
  return (
    <BookingSection
      eyebrow="Book a meeting"
      heading="Grab 30 minutes with a specialist."
      sub="Pick a time that suits you and we'll spend it on your workflow — your stages, your handoffs, your reporting. No slides, no pitch deck."
      email="contact@fruitionservices.io"
    />
  )
}
