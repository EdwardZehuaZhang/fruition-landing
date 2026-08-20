import Link from "next/link"
import { bookingHref } from "@/lib/bookingLink"

/**
 * Site-wide mid-content conversion banner. Started life as the bottom-of-article
 * CTA on blog posts; the copy is deliberately generic about Fruition so the same
 * banner reads correctly on a practice page, an industry page, a partnership
 * page or an article. Drop it roughly halfway down a page's sections.
 *
 * `contained` (default) adds the standard section padding + 1200px container.
 * Pass `contained={false}` when the banner already sits inside a content
 * column — e.g. the blog article body.
 */

const DEFAULT_HEADING = "Ready to build systems that scale with your team?"
const DEFAULT_BODY =
  "Book a complimentary 30-minute audit with a Fruition consultant — we will map your workflows, spot the automation wins and show you what the build looks like."
const DEFAULT_CTA_LABEL = "Book a 30-Min System Audit"

interface AuditCtaBannerProps {
  /** Booking destination. Calendly URLs are rewritten to our own scheduler. */
  bookingUrl?: string | null
  heading?: string
  body?: string
  ctaLabel?: string
  /** Wrap in a padded full-width section (default) or render the bare card. */
  contained?: boolean
  /** Container width — match the host page's section container. */
  containerClassName?: string
  /** Extra classes on the outer element (section, or the card when bare). */
  className?: string
}

export default function AuditCtaBanner({
  bookingUrl,
  heading = DEFAULT_HEADING,
  body = DEFAULT_BODY,
  ctaLabel = DEFAULT_CTA_LABEL,
  contained = true,
  containerClassName = "max-w-[1200px]",
  className = "",
}: AuditCtaBannerProps) {
  const card = (
    <aside
      className={`relative w-full overflow-hidden rounded-card p-[32px] md:p-[40px] bg-gradient-to-br from-surface-dark-2 to-surface-dark${
        contained ? "" : ` ${className}`
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[120px] -right-[100px] size-[300px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-brand)_40%,transparent)_0%,transparent_70%)]"
      />
      <div className="relative flex flex-col gap-[18px] md:flex-row md:items-center md:justify-between">
        <div className="max-w-[540px]">
          <h2 className="font-bold text-white text-[22px] leading-[30px] text-balance">
            {heading}
          </h2>
          <p className="mt-[8px] text-[15px] leading-[24px] text-white/[0.78]">
            {body}
          </p>
        </div>
        <Link
          href={bookingHref(bookingUrl)}
          className="flex-none cta-btn cta-btn-on-dark-primary"
        >
          {ctaLabel}
        </Link>
      </div>
    </aside>
  )

  if (!contained) return card

  return (
    <section className={`px-4 py-14 md:py-20 ${className}`}>
      <div className={`mx-auto ${containerClassName}`}>{card}</div>
    </section>
  )
}
