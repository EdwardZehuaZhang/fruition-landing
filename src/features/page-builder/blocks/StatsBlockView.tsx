'use client'

import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'
import type { SiteSettings } from '../types'

interface Stat {
  _key?: string
  value?: string
  label?: string
  icon?: { asset: { _ref: string } }
}

interface StatsBlockProps {
  heading?: string
  /** When provided, this substring within `heading` is rendered in accent color. */
  headingAccent?: string
  subheading?: string
  stats?: Stat[]
  ctaLabel?: string
  ctaUrl?: string
  footnote?: string
  siteSettings?: SiteSettings
  /** Render the monday.com partners badge inline with the subheading (homepage style). Default: true. */
  showMondayPartnersBadge?: boolean
}

// ROI icons — kept hardcoded because they're decorative/design icons (not content).
// Sanity stat.icon still wins when populated per-stat.
const fallbackIcons = [
  '/images/icon-roi-1.png',
  '/images/icon-roi-2.png',
  '/images/icon-roi-3.png',
  '/images/icon-roi-4.png',
]

function renderHeadingWithAccent(heading: string, accent?: string) {
  const target = accent || '500+ businesses'
  const idx = heading.indexOf(target)
  if (idx >= 0) {
    return (
      <>
        <span className="text-black">{heading.slice(0, idx)}</span>
        <span className="text-[#8015e8]">{target}</span>
        <span className="text-black">{heading.slice(idx + target.length)}</span>
      </>
    )
  }
  return <span className="text-black">{heading}</span>
}

export default function StatsBlockView({
  heading,
  headingAccent,
  subheading,
  stats,
  ctaLabel,
  ctaUrl,
  footnote,
  siteSettings,
  showMondayPartnersBadge = true,
}: StatsBlockProps) {
  const mondayPartnersBadgeSrc = siteSettings?.badgeMondayPartners?.asset
    ? urlFor(siteSettings.badgeMondayPartners).width(148).height(23).url()
    : '/images/badge-monday-partners.png'
  const forresterBadgeSrc = siteSettings?.badgeForrester?.asset
    ? urlFor(siteSettings.badgeForrester).width(64).height(24).url()
    : '/images/badge-forrester.png'

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 px-4">
      <div className="mx-auto max-w-[1040px] flex flex-col items-center gap-8">
        {/* Heading */}
        {heading && (
          <h2 className="text-center text-2xl sm:text-3xl lg:text-[36px] font-semibold leading-snug max-w-[720px]">
            {renderHeadingWithAccent(heading, headingAccent)}
          </h2>
        )}

        {/* Subheading with optional inline monday.com partners badge */}
        {subheading && (
          showMondayPartnersBadge ? (
            <div className="flex items-start gap-[5px] text-[14px] text-[#242323]">
              <span>{subheading}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mondayPartnersBadgeSrc} alt="monday.com partners" width={148} height={23} className="h-[23px] w-auto" />
            </div>
          ) : (
            <p className="text-base sm:text-lg text-center text-[#4a4a4a] max-w-[600px]">{subheading}</p>
          )
        )}

        {/* Stats row */}
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16 mt-4">
            {stats.map((stat, i) => (
              <div key={stat._key ?? i} className="flex flex-col items-center gap-1 min-w-[120px]">
                {stat.icon?.asset ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(stat.icon).width(64).height(64).url()}
                    alt=""
                    className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] mb-2"
                  />
                ) : (
                  <Image
                    src={fallbackIcons[i] || fallbackIcons[0]}
                    alt=""
                    width={64}
                    height={64}
                    className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] mb-2"
                  />
                )}
                <span className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#6b16c1] leading-tight whitespace-nowrap">
                  {stat.value}
                </span>
                <span className="text-sm sm:text-[15px] text-[#333] leading-snug text-center mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footnote with Forrester */}
        {footnote ? (
          <div className="flex items-center gap-1.5 text-xs text-[#666] mt-2">
            <span>{footnote}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={forresterBadgeSrc} alt="Forrester" width={60} height={24} className="h-5 w-auto" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-[#666] mt-2">
            <span>Data by</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={forresterBadgeSrc} alt="Forrester" width={64} height={14} className="h-[14px] w-auto" />
          </div>
        )}

        {/* CTA */}
        {ctaLabel && ctaUrl && (
          <Link
            href={ctaUrl}
            className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-lg sm:text-xl font-bold tracking-wide hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-500/20 mt-2"
          >
            {ctaLabel}
          </Link>
        )}

        {/* Security bar moved to after blog section in BlockRenderer */}
      </div>
    </section>
  )
}
