import { urlFor } from '@/sanity/image'
import CtaButton from '@/components/CtaButton'
import type { SiteSettings } from '../types'

interface HeroBlockProps {
  heading?: string
  headingAccents?: string[]
  subheading?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  image?: { asset: { _ref: string } }
  heroLocalVideoSrc?: string
  siteSettings?: SiteSettings
}

// Render heading with words listed in `accents` highlighted purple
function renderHeading(heading: string, accents: string[]) {
  if (!accents || accents.length === 0) {
    return <span>{heading}</span>
  }

  const parts: { text: string; purple: boolean }[] = []
  let remaining = heading

  while (remaining.length > 0) {
    let earliest = -1
    let earliestWord = ''
    for (const word of accents) {
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

// Render subheading — supports newlines for paragraph breaks
function renderSubheading(text: string) {
  const paragraphs = text.split(/\n{2,}|\r\n\r\n/).map((p) => p.trim()).filter(Boolean)
  if (paragraphs.length > 1) {
    return (
      <div className="flex flex-col gap-[12px] w-full max-w-[859px]">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[18px] text-black leading-[25.2px]">{p}</p>
        ))}
      </div>
    )
  }
  return <p className="text-[18px] text-black leading-[25.2px] max-w-[859px]">{text}</p>
}

export default function HeroBlockView({
  heading,
  headingAccents,
  subheading,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  image,
  heroLocalVideoSrc,
  siteSettings,
}: HeroBlockProps) {
  const heroVideoSrc = heroLocalVideoSrc

  const sanityBadges = siteSettings?.navbarPartnerBadges?.slice(0, 3) ?? []
  const partnerBadges = sanityBadges
    .map((b) => {
      const src = b.image?.asset ? urlFor(b.image).height(88).url() : null
      if (!src) return null
      return {
        src,
        alt: b.name ?? 'Partner badge',
        width: b.width ?? 146,
        height: b.height ?? 44,
      }
    })
    .filter((b): b is { src: string; alt: string; width: number; height: number } => b !== null)

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
                    className="h-[44px] w-auto rounded-[5px]"
                  />
                ))}
              </div>

              {/* Heading */}
              {heading && (
                <h1 className="text-[48px] font-bold text-black leading-[67.2px]">
                  {renderHeading(heading, headingAccents ?? [])}
                </h1>
              )}
            </div>

            {/* Subheading */}
            {subheading && renderSubheading(subheading)}
          </div>

          {/* Buttons */}
          <div className="flex gap-[20px] items-start w-full max-w-[680px]">
            {primaryCtaLabel && primaryCtaUrl && (
              <CtaButton
                href={primaryCtaUrl}
                label={primaryCtaLabel}
                variant="outline"
                className="w-[330px]"
              />
            )}
            {secondaryCtaLabel && secondaryCtaUrl && (
              <CtaButton
                href={secondaryCtaUrl}
                label={secondaryCtaLabel}
                variant="primary"
                className="w-[330px]"
              />
            )}
          </div>
        </div>

        {/* Hero media */}
        {heroVideoSrc ? (
          <video
            className="hidden md:block flex-1 min-w-0 w-full h-[550px] object-contain"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={image?.asset ? urlFor(image).width(600).url() : undefined}
            aria-label={heading ?? 'Hero video'}
          >
            <source src={heroVideoSrc} type="video/mp4" />
          </video>
        ) : (
          <div className="hidden md:block flex-1 min-w-0 w-full h-[550px] bg-[#d9d9d9]" />
        )}
      </div>
    </section>
  )
}
