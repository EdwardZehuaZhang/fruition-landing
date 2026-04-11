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
  subheading?: string
  stats?: Stat[]
  ctaLabel?: string
  ctaUrl?: string
  footnote?: string
  siteSettings?: SiteSettings
}

// ROI icons — kept hardcoded because they're decorative/design icons (not content).
// Sanity stat.icon still wins when populated per-stat.
const fallbackIcons = [
  '/images/icon-roi-1.png',
  '/images/icon-roi-2.png',
  '/images/icon-roi-3.png',
  '/images/icon-roi-4.png',
]

function renderHeadingWithAccent(heading: string) {
  const accent = '500+ businesses'
  const idx = heading.indexOf(accent)
  if (idx >= 0) {
    return (
      <>
        <span className="text-black">{heading.slice(0, idx)}</span>
        <span className="text-[#8015e8]">{accent}</span>
        <span className="text-black">{heading.slice(idx + accent.length)}</span>
      </>
    )
  }
  return <span className="text-black">{heading}</span>
}

export default function StatsBlockView({
  heading,
  subheading,
  stats,
  ctaLabel,
  ctaUrl,
  footnote,
  siteSettings,
}: StatsBlockProps) {
  const mondayPartnersBadgeSrc = siteSettings?.badgeMondayPartners?.asset
    ? urlFor(siteSettings.badgeMondayPartners).width(148).height(23).url()
    : '/images/badge-monday-partners.png'
  const forresterBadgeSrc = siteSettings?.badgeForrester?.asset
    ? urlFor(siteSettings.badgeForrester).width(64).height(24).url()
    : '/images/badge-forrester.png'

  return (
    <section className="bg-white py-[80px] px-4">
      <div className="mx-auto max-w-[959px] flex flex-col items-center gap-[24px]">
        {/* Heading */}
        {heading && (
          <h2 className="text-center text-[28px] font-medium leading-[39.2px]">
            {renderHeadingWithAccent(heading)}
          </h2>
        )}

        {/* Subheading with monday.com partners badge */}
        {subheading && (
          <div className="flex items-start gap-[5px] text-[14px] text-[#242323]">
            <span>{subheading}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mondayPartnersBadgeSrc} alt="monday.com partners" width={148} height={23} className="h-[23px] w-auto" />
          </div>
        )}

        {/* Stats row — with real icon images */}
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-[40px]">
            {stats.map((stat, i) => (
              <div key={stat._key ?? i} className="flex flex-col items-center gap-[2px]">
                {stat.icon?.asset ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(stat.icon).width(64).height(64).url()}
                    alt=""
                    className="w-[64px] h-[64px] mb-2"
                  />
                ) : (
                  <Image
                    src={fallbackIcons[i] || fallbackIcons[0]}
                    alt=""
                    width={64}
                    height={64}
                    className="w-[64px] h-[64px] mb-2"
                  />
                )}
                <span className="text-[20px] font-semibold text-[#550e9b] leading-[28px] whitespace-nowrap">
                  {stat.value}
                </span>
                <span className="text-[14px] text-black leading-[28px] text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footnote with Forrester */}
        {footnote ? (
          <div className="flex items-center gap-[3px] text-[12px] text-[#242323]">
            <span>{footnote}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={forresterBadgeSrc} alt="Forrester" width={60} height={24} className="h-5 w-auto" />
          </div>
        ) : (
          <div className="flex items-center gap-[3px] text-[12px] text-[#242323]">
            <span>Data by</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={forresterBadgeSrc} alt="Forrester" width={64} height={14} className="h-[14px] w-auto" />
          </div>
        )}

        {/* CTA */}
        {ctaLabel && ctaUrl ? (
          <Link
            href={ctaUrl}
            className="flex items-center justify-center h-[53px] w-[275px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
          >
            {ctaLabel}
          </Link>
        ) : (
          <Link
            href="https://calendly.com/global-calendar-fruitionservices"
            className="flex items-center justify-center h-[53px] w-[275px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
          >
            🚀 Book a Time
          </Link>
        )}

        {/* Security bar moved to after blog section in BlockRenderer */}
      </div>
    </section>
  )
}
