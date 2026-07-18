"use client"

import { useEffect, useState } from "react"
import CtaButton from "@/components/CtaButton"

interface StickyCtaBarProps {
  label?: string
  /** Shorter CTA label shown on mobile (below md) so the long CMS label can't
   *  wrap/overflow the button. Defaults to "Schedule a call". */
  mobileLabel?: string
  href?: string
  /** px scrolled before the bar appears */
  showAfter?: number
}

const DISMISS_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

/**
 * Floating bottom CTA that fades in once the visitor scrolls past the hero, so
 * a friction-free conversion path is always one click away (per PDF). Dismissible.
 */
export default function StickyCtaBar({
  label,
  mobileLabel = "Schedule a call",
  href,
  showAfter = 600,
}: StickyCtaBarProps) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [showAfter])

  if (!label || !href || dismissed) return null

  const dismiss = (placement: "compact" | "row") => (
    <button
      type="button"
      aria-label="Dismiss banner"
      onClick={() => setDismissed(true)}
      className={`sticky-cta-dismiss sticky-cta-dismiss-${placement}`}
    >
      {DISMISS_ICON}
    </button>
  )

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[env(safe-area-inset-bottom,0px)] transition-all duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div role="region" aria-label="Consultation banner" className="sticky-cta mx-auto mb-4">
        <div aria-hidden="true" className="sticky-cta-glow" />
        <div className="sticky-cta-top">
          <p className="sticky-cta-heading">Ready to scale your workflows?</p>
          {dismiss("compact")}
        </div>
        <div className="sticky-cta-actions">
          <CtaButton
            href={href}
            label={mobileLabel ?? label}
            variant="onDarkPrimary"
            className="sticky-cta-cta-mobile"
          />
          <CtaButton
            href={href}
            label={label}
            variant="onDarkPrimary"
            className="sticky-cta-cta-full"
          />
          {dismiss("row")}
        </div>
      </div>
    </div>
  )
}
