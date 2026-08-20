"use client"

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"

export interface StickyCtaValue {
  label?: string
  mobileLabel?: string
  href?: string
}

interface Registration extends StickyCtaValue {
  /**
   * Identity of the <StickyCtaConfig> that wrote this. On a client-side
   * navigation the outgoing page's cleanup can run after the incoming page has
   * already registered; comparing owners stops the old page from clearing the
   * new page's copy and leaving the bar on the site-wide default.
   */
  owner: string
}

const StickyCtaContext = createContext<{
  registration: Registration | null
  setRegistration: Dispatch<SetStateAction<Registration | null>>
} | null>(null)

/**
 * Holds the current page's sticky-CTA copy, if it declares any.
 *
 * The bar is rendered ONCE by <SiteFrame> so every page gets one; this context
 * is only how a page overrides the site-wide default copy with its own.
 */
export function StickyCtaProvider({ children }: { children: React.ReactNode }) {
  const [registration, setRegistration] = useState<Registration | null>(null)
  const value = useMemo(
    () => ({ registration, setRegistration }),
    [registration],
  )
  return (
    <StickyCtaContext.Provider value={value}>
      {children}
    </StickyCtaContext.Provider>
  )
}

/** The current page's override, or null when it declares none. */
export function useStickyCtaOverride(): StickyCtaValue | null {
  return useContext(StickyCtaContext)?.registration ?? null
}

/**
 * Declares this page's sticky-CTA copy (from its Sanity `croSections`).
 *
 * Renders nothing — the bar lives in <SiteFrame>, so a page cannot
 * accidentally produce a second one. A page that renders no config keeps the
 * site-wide default from Site Settings.
 */
export default function StickyCtaConfig({
  label,
  mobileLabel,
  href,
}: StickyCtaValue) {
  const setRegistration = useContext(StickyCtaContext)?.setRegistration
  const owner = useId()

  useEffect(() => {
    if (!setRegistration) return
    setRegistration({ owner, label, mobileLabel, href })
    return () =>
      setRegistration((prev) => (prev?.owner === owner ? null : prev))
  }, [setRegistration, owner, label, mobileLabel, href])

  return null
}
