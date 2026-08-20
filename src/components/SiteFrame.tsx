"use client"

import { usePathname } from "next/navigation"
import Breadcrumbs from "./Breadcrumbs"
import SiteStickyCta from "./SiteStickyCta"
import { StickyCtaProvider } from "./sections/StickyCtaContext"
import type { StickyCtaValue } from "./sections/StickyCtaContext"

/**
 * Wraps the marketing site chrome. The internal portal (/internal) renders its
 * own shell (shadcn sidebar), so we hide the external nav, footer, cookie
 * banner — and the marketing <main> wrapper — on those routes.
 *
 * The floating sticky CTA is rendered here, once, so every marketing page gets
 * it without opting in. Pages that want their own copy declare it with
 * <StickyCtaConfig>; <SiteStickyCta> merges that over the Site Settings
 * default and owns the remaining route exclusions.
 */
export default function SiteFrame({
  header,
  footer,
  cookie,
  stickyCtaHeading,
  stickyCtaDefaults,
  children,
}: {
  header: React.ReactNode
  footer: React.ReactNode
  cookie: React.ReactNode
  stickyCtaHeading?: string
  stickyCtaDefaults: StickyCtaValue
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname?.startsWith("/internal")) {
    return <>{children}</>
  }

  return (
    <StickyCtaProvider>
      {header}
      <Breadcrumbs />
      <main>{children}</main>
      {footer}
      {cookie}
      <SiteStickyCta heading={stickyCtaHeading} defaults={stickyCtaDefaults} />
    </StickyCtaProvider>
  )
}
