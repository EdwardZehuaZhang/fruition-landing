"use client"

import { usePathname } from "next/navigation"

/**
 * Wraps the marketing site chrome. The internal portal (/internal) renders its
 * own shell (shadcn sidebar), so we hide the external nav, footer, cookie
 * banner — and the marketing <main> wrapper — on those routes.
 */
export default function SiteFrame({
  header,
  footer,
  cookie,
  children,
}: {
  header: React.ReactNode
  footer: React.ReactNode
  cookie: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname?.startsWith("/internal")) {
    return <>{children}</>
  }

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
      {cookie}
    </>
  )
}
