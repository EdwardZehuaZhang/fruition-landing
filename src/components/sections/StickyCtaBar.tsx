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

function DismissIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

/**
 * Floating bottom CTA that fades in once the visitor scrolls past the hero, so
 * a friction-free conversion path is always one click away (per PDF). Dismissible.
 *
 * Visuals follow the Claude Design "CTA Banner" spec: full-width gradient card
 * (max 1348px), soft lilac glow, circular dismiss button, three layouts
 * (base / md / lg).
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

  const closeButton = (extraClass: string, iconSize: number, small = false) => (
    <button
      type="button"
      aria-label="Dismiss banner"
      onClick={() => setDismissed(true)}
      className={`flex shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/40 bg-transparent p-0 text-white transition-colors duration-150 hover:border-[var(--blue-press)] hover:bg-[var(--blue-press)] ${
        small ? "h-10 w-10" : "h-11 w-11"
      } ${extraClass}`}
    >
      <DismissIcon size={iconSize} />
    </button>
  )

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[env(safe-area-inset-bottom,0px)] transition-all duration-300 md:px-6 lg:px-12"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        role="region"
        aria-label="Consultation banner"
        className="relative mx-auto mb-4 flex max-w-[1348px] flex-col gap-4 overflow-hidden rounded-[18px] bg-[linear-gradient(160deg,#10003a_0%,#2b074d_48%,#8015e8_110%)] p-[20px_16px_16px_20px] shadow-[0_12px_32px_-14px_rgba(16,0,58,0.4)] md:gap-[18px] md:rounded-[24px] md:bg-[linear-gradient(120deg,#10003a_0%,#2b074d_46%,#8015e8_105%)] md:p-[24px_24px_24px_28px] md:shadow-[0_16px_40px_-16px_rgba(16,0,58,0.4)] lg:flex-row lg:items-center lg:gap-7 lg:bg-[linear-gradient(99deg,#10003a_0%,#2b074d_44%,#8015e8_100%)] lg:p-[28px_28px_28px_40px]"
      >
        {/* Lilac glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[100px] -bottom-[140px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(186,131,240,0.5),transparent_70%)] mix-blend-screen md:top-[-150px] md:right-[-110px] md:bottom-auto md:h-[380px] md:w-[380px] lg:top-[-160px] lg:right-[-120px] lg:h-[420px] lg:w-[420px]"
        />

        {/* Title row (close button rides along on base/md, moves to CTA row on lg) */}
        <div className="relative flex items-start gap-2.5 md:gap-3 lg:min-w-0 lg:flex-1">
          <h2 className="m-0 min-w-0 flex-1 pt-2 text-[19px] leading-[1.35] font-semibold tracking-[-0.01em] text-pretty text-white md:pt-[5px] md:text-[23px] md:leading-[1.3] lg:pt-0 lg:text-[clamp(21px,1.9vw,26px)]">
            Ready to scale your workflows?
          </h2>
          {closeButton("md:h-11 md:w-11 lg:hidden", 16, true)}
        </div>

        <div className="relative flex items-center gap-4 lg:flex-none">
          {/* Mobile: short label, full width */}
          <span className="w-full md:hidden">
            <CtaButton
              href={href}
              label={mobileLabel ?? label}
              variant="onDarkPrimary"
              className="w-full justify-center"
              style={{ height: 48, fontSize: 15, padding: "0 22px" }}
            />
          </span>
          {/* md and up: full label */}
          <span className="hidden md:block">
            <CtaButton
              href={href}
              label={label}
              mobileLabel={mobileLabel}
              variant="onDarkPrimary"
            />
          </span>
          {closeButton("hidden lg:flex", 16)}
        </div>
      </div>
    </div>
  )
}
