"use client"

import { useEffect, useState } from "react"
import CtaButton from "@/components/CtaButton"

interface StickyCtaBarProps {
  label?: string
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
      className="fixed inset-x-0 bottom-0 z-50 transition-all duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        className="mx-auto mb-4 flex items-center justify-between gap-4 px-5 py-3"
        style={{
          maxWidth: 720,
          borderRadius: 16,
          background: "linear-gradient(-38deg, rgb(128,21,232) 0%, rgb(16,0,58) 100%)",
          boxShadow: "0 18px 40px -16px rgba(64,12,140,0.55)",
        }}
      >
        <span className="font-semibold text-white" style={{ fontSize: 14 }}>
          Ready to scale your workflows?
        </span>
        <div className="flex items-center gap-2">
          <CtaButton href={href} label={label} variant="onDarkPrimary" style={{ height: 40, fontSize: 13, padding: "0 18px" }} />
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setDismissed(true)}
            className="shrink-0 text-white/70 hover:text-white"
            style={{ fontSize: 20, lineHeight: 1, padding: "0 4px" }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
