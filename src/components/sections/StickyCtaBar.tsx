"use client"

import { useEffect, useState } from "react"
import CtaButton from "@/components/CtaButton"

interface StickyCtaBarProps {
  label?: string
  /** Shorter CTA label shown on mobile (below md). Falls back to `label`. */
  mobileLabel?: string
  href?: string
  /** Shorter label for mobile screens. Falls back to `label` when omitted. */
  mobileLabel?: string
  /** px scrolled before the bar appears */
  showAfter?: number
}

/**
 * Floating bottom CTA that fades in once the visitor scrolls past the hero, so
 * a friction-free conversion path is always one click away (per PDF). Dismissible.
 */
export default function StickyCtaBar({
  label,
  mobileLabel,
  href,
  showAfter = 600,
  mobileLabel,
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
      <div
        className="mx-auto mb-4 flex flex-col items-stretch gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:px-5"
        style={{
          maxWidth: 720,
          borderRadius: 16,
          background: "linear-gradient(-38deg, rgb(128,21,232) 0%, rgb(16,0,58) 100%)",
          boxShadow: "0 18px 40px -16px rgba(64,12,140,0.55)",
        }}
      >
        <span className="font-semibold text-white text-[13px] md:text-sm">
          Ready to scale your workflows?
        </span>
        <div className="flex items-center justify-between gap-2 md:justify-end">
          {/* Mobile: short label; hidden on desktop */}
          <CtaButton
            href={href}
            label={mobileLabel ?? label}
            variant="onDarkPrimary"
            className="md:hidden"
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
            className="flex shrink-0 items-center justify-center text-white/70 hover:text-white"
            style={{ minWidth: 44, minHeight: 44, fontSize: 22, lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
