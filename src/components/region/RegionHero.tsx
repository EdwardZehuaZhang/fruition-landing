import Link from "next/link"
import FramedMedia from "@/components/common/FramedMedia"
import type { RegionContent } from "./types"

interface Props {
  hero: RegionContent["hero"]
  flag: string
  /** Defaults to the monday.com Platinum Partner lockup in /public. */
  partnerBadgeSrc?: string | null
  /** Wide product banner from Sanity (`locationPage.heroImage`). */
  heroImageUrl?: string | null
  primaryCtaLabel?: string
  primaryCtaUrl: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

/**
 * Region hero — positioning and CTAs over the region's product banner.
 *
 * The banner is the ~3.3:1 monday.com collage each region already had in
 * Sanity, so it runs the full container width rather than sitting in a side
 * column, where it would be too short to read.
 */
export default function RegionHero({
  hero,
  flag,
  partnerBadgeSrc = "/images/partner-platinum.png",
  heroImageUrl,
  primaryCtaLabel = "Book a Free Consultation",
  primaryCtaUrl,
  secondaryCtaLabel = "Explore Services",
  secondaryCtaUrl = "#services",
}: Props) {
  return (
    <section className="relative overflow-hidden bg-surface">
      {/* Soft brand wash behind the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 460px at 75% 25%, var(--purple-tint) 0%, rgba(247,245,255,0) 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="flex flex-col items-start">
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-pill border border-lilac-strong bg-tint px-4 py-[7px] pr-[18px] text-[13px] font-semibold text-brand">
            <span aria-hidden className="text-[15px] leading-none">
              {flag}
            </span>
            {hero.eyebrow}
          </p>

          <h1 className="max-w-[900px] text-[36px] font-semibold leading-[1.16] tracking-[-0.02em] text-balance text-foreground md:text-[44px] lg:text-[52px]">
            {hero.heading} <span className="text-brand">{hero.headingAccent}</span>
          </h1>

          <p className="mt-6 max-w-[720px] text-body-lead text-muted text-pretty">
            {hero.subheading}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={primaryCtaUrl} className="cta-btn cta-btn-primary">
              {primaryCtaLabel}
            </Link>
            <Link href={secondaryCtaUrl} className="cta-btn cta-btn-outline">
              {secondaryCtaLabel}
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {partnerBadgeSrc && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partnerBadgeSrc}
                  alt="monday.com Platinum Partner"
                  className="h-[44px] w-auto rounded-[6px]"
                />
                <span aria-hidden className="hidden h-[30px] w-px bg-ui sm:block" />
              </>
            )}
            <span className="text-caption text-muted">{hero.badgeStrap}</span>
          </div>
        </div>

        {heroImageUrl && (
          <FramedMedia className="mt-12 w-full md:mt-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageUrl}
              alt=""
              className="h-auto w-full rounded-card bg-surface object-contain"
              // Above the fold on every region page — never lazy-load it.
              fetchPriority="high"
            />
          </FramedMedia>
        )}
      </div>
    </section>
  )
}
