import Link from "next/link"
import { Award, BadgeCheck, TrendingUp } from "lucide-react"
import type { RegionContent } from "./types"

const ICONS = {
  award: Award,
  badge: BadgeCheck,
  trend: TrendingUp,
} as const

interface Props {
  hero: RegionContent["hero"]
  flag: string
  /** Defaults to the monday.com Platinum Partner lockup in /public. */
  partnerBadgeSrc?: string | null
  primaryCtaLabel?: string
  primaryCtaUrl: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

/**
 * Region hero — copy on the left, a stack of credential cards on the right.
 *
 * Deliberately not `HeroBanner`: that component centres a headline over a hero
 * image, while the region pages lead with proof (partner tier, delivery tier,
 * volume) because "which partner do I trust here" is the question the page has
 * to answer above the fold.
 */
export default function RegionHero({
  hero,
  flag,
  partnerBadgeSrc = "/monday-marketing-partner.avif",
  primaryCtaLabel = "Book a Free Consultation",
  primaryCtaUrl,
  secondaryCtaLabel = "Explore Services",
  secondaryCtaUrl = "#services",
}: Props) {
  return (
    <section className="relative overflow-hidden bg-surface">
      {/* Soft brand wash behind the credential column. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 460px at 82% 30%, var(--purple-tint) 0%, rgba(247,245,255,0) 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4">
        <div className="grid grid-cols-1 items-center gap-12 pt-10 pb-14 md:pt-14 md:pb-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          {/* Left: positioning + CTAs */}
          <div className="flex flex-col items-start">
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-pill border border-lilac-strong bg-tint px-4 py-[7px] pr-[18px] text-[13px] font-semibold text-brand">
              <span aria-hidden className="text-[15px] leading-none">
                {flag}
              </span>
              {hero.eyebrow}
            </p>

            <h1 className="text-[36px] font-semibold leading-[1.16] tracking-[-0.02em] text-balance text-foreground md:text-[44px] lg:text-[52px]">
              {hero.heading}{" "}
              <span className="text-brand">{hero.headingAccent}</span>
            </h1>

            <p className="mt-6 max-w-[580px] text-body-lead text-muted text-pretty">
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

            <div className="mt-11 flex items-center gap-4">
              {partnerBadgeSrc && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partnerBadgeSrc}
                    alt="monday.com Platinum Partner"
                    className="h-[42px] w-auto"
                  />
                  <span aria-hidden className="h-[30px] w-px bg-ui" />
                </>
              )}
              <span className="text-caption text-muted">{hero.badgeStrap}</span>
            </div>
          </div>

          {/* Right: the credentials the copy is claiming */}
          <div className="flex w-full max-w-[520px] flex-col gap-3.5 lg:justify-self-end">
            {hero.credentials.map((c) => {
              const Icon = ICONS[c.icon]
              return (
                <div
                  key={c.label}
                  className="flex items-center gap-3.5 rounded-[18px] border border-lilac bg-surface-raised px-5 py-4 shadow-whisper"
                >
                  <span className="flex size-[34px] flex-none items-center justify-center rounded-chip bg-tint">
                    <Icon size={18} className="text-brand" aria-hidden />
                  </span>
                  <span className="text-[15.5px] font-semibold text-foreground">
                    {c.label}
                  </span>
                </div>
              )
            })}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {hero.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-[14px] border border-lilac-quiet bg-mist px-4 py-3.5 text-[13.5px] leading-[1.45] text-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
