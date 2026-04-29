import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import type { SanityImageRef } from "./types"

interface DiscoverCtaSectionProps {
  badge?: SanityImageRef
  heading?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

export default function DiscoverCtaSection({
  badge,
  heading,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
}: DiscoverCtaSectionProps) {
  const badgeSrc = badge?.asset?._ref
    ? (() => {
        try { return urlFor(badge).width(325).height(73).url() } catch { return null }
      })()
    : null

  if (!heading && !primaryCtaLabel && !secondaryCtaLabel && !badgeSrc) return null

  return (
    <section style={{ backgroundColor: "#ece6fc" }} className="py-[80px] px-4">
      <div className="mx-auto flex max-w-[900px] flex-col items-center">
        {badgeSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={badgeSrc} alt="Certifications" width={325} height={73} className="h-[73px] w-[325px] object-contain" />
        )}
        {heading && (
          <h2 className="mt-7 text-section-h2 text-center text-black text-balance max-w-[720px]">
            {heading}
          </h2>
        )}
        {(primaryCtaLabel || secondaryCtaLabel) && (
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            {primaryCtaLabel && primaryCtaUrl && (
              <CtaButton
                href={primaryCtaUrl}
                label={primaryCtaLabel}
                variant="outline"
                className="w-full sm:flex-1"
              />
            )}
            {secondaryCtaLabel && secondaryCtaUrl && (
              <CtaButton
                href={secondaryCtaUrl}
                label={secondaryCtaLabel}
                variant="primary"
                className="w-full sm:flex-1"
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
