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

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[env(safe-area-inset-bottom,0px)] transition-all duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Single row at every width: label (wraps within its box) · CTA · dismiss */}
      <div className="mx-auto mb-4 flex max-w-[720px] items-center gap-3 rounded-2xl bg-[linear-gradient(-38deg,var(--purple-primary)_0%,var(--dark-bg)_100%)] px-4 py-2.5 shadow-[0_18px_40px_-16px_rgba(64,12,140,0.55)] md:gap-4 md:px-5 md:py-3">
        {/* Label is desktop-only; on phones the pill carries the message */}
        <span className="hidden min-w-0 flex-1 font-semibold leading-tight text-white md:block md:text-sm">
          Ready to scale your workflows?
        </span>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 md:flex-none md:justify-end md:gap-2">
          {/* Mobile: short label; hidden on desktop */}
          <CtaButton
            href={href}
            label={mobileLabel ?? label}
            variant="onDarkPrimary"
            className="md:hidden !min-h-0 !h-10 whitespace-nowrap"
            style={{ fontSize: 13, padding: "0 16px" }}
          />
          {/* Desktop: full label; hidden on mobile */}
          <CtaButton
            href={href}
            label={label}
            mobileLabel={mobileLabel}
            variant="onDarkPrimary"
            className="hidden md:inline-flex"
            style={{ fontSize: 13, padding: "0 18px" }}
          />
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setDismissed(true)}
            className="flex min-h-10 min-w-8 shrink-0 items-center justify-center text-[22px] leading-none text-white/70 hover:text-white md:min-h-11 md:min-w-11"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
