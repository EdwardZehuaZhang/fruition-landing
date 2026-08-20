"use client"

import { usePathname } from "next/navigation"
import StickyCtaBar from "@/components/sections/StickyCtaBar"
import {
  useStickyCtaOverride,
  type StickyCtaValue,
} from "@/components/sections/StickyCtaContext"

/**
 * Path prefixes that never get the floating CTA:
 *
 * - `/internal` — the admin portal. <SiteFrame> already returns before this
 *   component renders; listed so the rule survives if that ever changes.
 * - `/studio`   — Sanity Studio. Also an internal tool, not a marketing page.
 * - `/contact-us` — the bar's own destination. It links to the booking form
 *   (`/contact-us#book`), and a fixed bar over that form would cover the very
 *   thing it's asking the visitor to fill in.
 */
const EXCLUDED_PREFIXES = ["/internal", "/studio", "/contact-us"]

export default function SiteStickyCta({
  heading,
  defaults,
}: {
  heading?: string
  defaults: StickyCtaValue
}) {
  const pathname = usePathname()
  const override = useStickyCtaOverride()

  const excluded = EXCLUDED_PREFIXES.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`),
  )
  if (excluded) return null

  // A page's own copy wins field by field, so a page can set just a label and
  // still inherit the site-wide booking link.
  return (
    <StickyCtaBar
      heading={heading}
      label={override?.label || defaults.label}
      mobileLabel={override?.mobileLabel || defaults.mobileLabel}
      href={override?.href || defaults.href}
    />
  )
}
