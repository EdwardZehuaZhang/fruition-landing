import CtaButton, { type CtaVariant } from "@/components/CtaButton"

interface DualCtaRowProps {
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Use the on-dark variants when placed over a gradient hero */
  onDark?: boolean
  className?: string
}

/**
 * Primary + secondary CTA pair (e.g. "Book a Free Discovery Call" / "Watch the
 * 2-Min CRM Tour"). Captures buyers at different stages of readiness (per PDF).
 */
export default function DualCtaRow({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  onDark = false,
  className = "",
}: DualCtaRowProps) {
  if (!primaryLabel && !secondaryLabel) return null
  const primaryVariant: CtaVariant = onDark ? "onDarkPrimary" : "primary"
  const secondaryVariant: CtaVariant = onDark ? "onDarkOutline" : "outline"

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`.trim()}>
      {primaryLabel && primaryHref && (
        <CtaButton href={primaryHref} label={primaryLabel} variant={primaryVariant} />
      )}
      {secondaryLabel && secondaryHref && (
        <CtaButton href={secondaryHref} label={secondaryLabel} variant={secondaryVariant} />
      )}
    </div>
  )
}
