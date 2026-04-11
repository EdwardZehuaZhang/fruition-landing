import Link from 'next/link'
import { urlFor } from '@/sanity/image'
import type { SiteSettings } from '../types'

interface HeroBlockProps {
  heading?: string
  subheading?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  image?: { asset: { _ref: string } }
  siteSettings?: SiteSettings
}

// Fallback partner badges used when siteSettings doesn't yet have navbarPartnerBadges
const FALLBACK_PARTNER_BADGES = [
  { src: '/images/partner-platinum.png', alt: 'monday.com Platinum Partner', width: 146, height: 44 },
  { src: '/images/partner-advanced-delivery.png', alt: 'Advanced Delivery Partner', width: 157, height: 44 },
  { src: '/images/partner-make.png', alt: 'Make Partners', width: 178, height: 44 },
]

// Render heading with "Consulting" and "Integration Services" in purple
function renderHeading(heading: string) {
  const purpleWords = ['Consulting', 'Integration Services']
  const parts: { text: string; purple: boolean }[] = []
  let remaining = heading

  while (remaining.length > 0) {
    let earliest = -1
    let earliestWord = ''
    for (const word of purpleWords) {
      const idx = remaining.indexOf(word)
      if (idx >= 0 && (earliest < 0 || idx < earliest)) {
        earliest = idx
        earliestWord = word
      }
    }
    if (earliest >= 0) {
      if (earliest > 0) parts.push({ text: remaining.slice(0, earliest), purple: false })
      parts.push({ text: earliestWord, purple: true })
      remaining = remaining.slice(earliest + earliestWord.length)
    } else {
      parts.push({ text: remaining, purple: false })
      break
    }
  }

  return (
    <>
      {parts.map((p, i) =>
        p.purple ? <span key={i} className="text-[#8015e8]">{p.text}</span> : <span key={i}>{p.text}</span>
      )}
    </>
  )
}

// Split subheading into paragraphs at natural break points
function renderSubheading(text: string) {
  // Split on patterns that suggest paragraph breaks
  // The Figma shows two separate paragraphs separated by line break
  const breakPoints = [
    'Australia, US and the UK.',
    'Australia, US and UK.',
  ]

  for (const bp of breakPoints) {
    const idx = text.indexOf(bp)
    if (idx >= 0) {
      const p1 = text.slice(0, idx + bp.length).trim()
      const p2 = text.slice(idx + bp.length).trim()
      if (p2) {
        return (
          <div className="flex flex-col gap-[12px] w-full max-w-[859px]">
            <p className="text-[18px] text-black leading-[25.2px]">{p1}</p>
            <p className="text-[18px] text-black leading-[25.2px]">{p2}</p>
          </div>
        )
      }
    }
  }

  return <p className="text-[18px] text-black leading-[25.2px] max-w-[859px]">{text}</p>
}

export default function HeroBlockView({
  heading,
  subheading,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  image,
  siteSettings,
}: HeroBlockProps) {
  // Use Sanity navbar partner badges (first 3) when available, else hardcoded fallbacks
  const sanityBadges = siteSettings?.navbarPartnerBadges?.slice(0, 3) ?? []
  const partnerBadges = sanityBadges.length >= 3
    ? sanityBadges.map((b, i) => {
        const fallback = FALLBACK_PARTNER_BADGES[i]
        return {
          src: b.image?.asset ? urlFor(b.image).height(88).url() : fallback.src,
          alt: b.name ?? fallback.alt,
          width: b.width ?? fallback.width,
          height: b.height ?? fallback.height,
        }
      })
    : FALLBACK_PARTNER_BADGES

  return (
    <section className="bg-white w-full">
      <div className="mx-auto max-w-[1348px] flex items-start gap-[10px] py-[80px] px-4 xl:px-0">
        {/* Left column */}
        <div className="flex flex-col gap-[109px] w-full max-w-[924px]">
          <div className="flex flex-col gap-[31px] w-full">
            {/* Partner badges */}
            <div className="flex flex-col gap-[42px]">
              <div className="flex items-center gap-[22px]">
                {partnerBadges.map((badge, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={badge.src}
                    alt={badge.alt}
                    width={badge.width}
                    height={badge.height}
                    className="h-[44px] w-auto rounded-[5px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.5)]"
                  />
                ))}
              </div>

              {/* Heading */}
              {heading && (
                <h1 className="text-[48px] font-bold text-black leading-[67.2px]">
                  {renderHeading(heading)}
                </h1>
              )}
            </div>

            {/* Subheading */}
            {subheading && renderSubheading(subheading)}
          </div>

          {/* Buttons */}
          <div className="flex gap-[20px] items-start w-full max-w-[680px]">
            {primaryCtaLabel && primaryCtaUrl && (
              <Link
                href={primaryCtaUrl}
                className="flex items-center justify-center h-[53px] w-[330px] rounded-[100px] border border-[#8015e8] bg-white text-[#8015e8] text-[16px] font-bold tracking-[0.32px] hover:bg-[#8015e8] hover:text-white transition"
              >
                {primaryCtaLabel}
              </Link>
            )}
            {secondaryCtaLabel && secondaryCtaUrl && (
              <Link
                href={secondaryCtaUrl}
                className="flex items-center justify-center h-[53px] w-[330px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
              >
                {secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Right column — image or placeholder */}
        <div className="flex-1 min-w-0 hidden md:block">
          {image?.asset ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlFor(image).width(600).url()}
              alt={heading ?? ''}
              className="w-full h-[550px] object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-[550px] bg-[#d9d9d9]" />
          )}
        </div>
      </div>
    </section>
  )
}
