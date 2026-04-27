import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import PaperPlaneIcon from '@/components/common/icons/PaperPlaneIcon'
import { urlFor } from '@/sanity/image'

interface RichTextBlockProps {
  _key?: string
  heading?: string
  subheading?: string
  content?: PortableTextBlock[]
  ctaLabel?: string
  ctaUrl?: string
  image?: { asset: { _ref: string } }
  imagePosition?: string
}

/*
 * Figma has 3 specific richtext sections with exact styling.
 * Sanity heading = Figma subheading. The Figma purple eyebrow heading
 * and accent-colored words are hardcoded per-section.
 */
const SECTION_MAP: Record<string, {
  eyebrow: string
  subheadingJSX: React.ReactNode
  fallbackImage: string | null
  fallbackVideo: string | null
  figmaImagePosition: 'left' | 'right'
}> = {
  'setting up': {
    eyebrow: 'Implementation  & optimisation',
    subheadingJSX: (
      <p className="text-[20px] font-semibold text-black leading-[28px]">
        <span>Get help </span>
        <span className="text-[#ba83f0]">setting up</span>
        <span> or </span>
        <span className="text-[#ba83f0]">fine-tuning</span>
        <span>{'\n'}your monday workflows.</span>
      </p>
    ),
    fallbackImage: null,
    fallbackVideo: '/videos/implementation-optimisation.mp4',
    figmaImagePosition: 'right',
  },
  'training': {
    eyebrow: 'Training & managed services',
    subheadingJSX: (
      <p className="text-[20px] font-semibold text-black leading-[28px]">
        <span>Get the entire team monday.com </span>
        <span className="text-[#ba83f0]">training</span>
        <span>.</span>
      </p>
    ),
    fallbackImage: '/images/service-monday-users.png',
    fallbackVideo: null,
    figmaImagePosition: 'left',
  },
  'automation': {
    eyebrow: 'Integration & API development',
    subheadingJSX: (
      <p className="text-[20px] font-semibold text-black leading-[28px]">
        <span>Eliminate manual work with{'\n'}</span>
        <span className="text-[#ba83f0]">automation</span>
        <span>.</span>
      </p>
    ),
    fallbackImage: '/images/service-gmail-automation.png',
    fallbackVideo: null,
    figmaImagePosition: 'right',
  },
}

function isCorruptedWixDump(content?: PortableTextBlock[]): boolean {
  if (!content?.length) return false

  const flatText = content
    .map((block) => (block.children ?? []).map((child) => child.text ?? '').join(' '))
    .join(' ')
    .toLowerCase()

  const hasMarkers = [
    'skip to main content',
    'what we offer',
    'static.wixstatic.com',
    'implementation packages',
    'monday.com training',
  ].filter((marker) => flatText.includes(marker)).length

  return hasMarkers >= 3
}

function detectSection(heading?: string): typeof SECTION_MAP[string] | null {
  if (!heading) return null
  const lower = heading.toLowerCase()
  if (lower.includes('setting up') || lower.includes('fine-tuning')) return SECTION_MAP['setting up']
  if (lower.includes('training')) return SECTION_MAP['training']
  if (lower.includes('automation') || lower.includes('eliminate')) return SECTION_MAP['automation']
  return null
}

export default function RichTextBlockView({
  heading,
  subheading,
  content,
  ctaLabel,
  ctaUrl,
  image,
  imagePosition = 'right',
}: RichTextBlockProps) {
  const hasImage = !!image?.asset
  const section = detectSection(heading)
  // Use Figma image position if this is a known section, otherwise use Sanity field
  const imageOnLeft = section ? section.figmaImagePosition === 'left' : imagePosition === 'left'
  // Use Figma fallback image if Sanity doesn't have one
  const fallbackSrc = section?.fallbackImage ?? null
  const fallbackVideoSrc = section?.fallbackVideo ?? null
  const hideCorruptedBodyContent = isCorruptedWixDump(content)

  const textContent = (
    <div className="flex flex-col gap-[23px] items-start w-full max-w-[490px]">
      {/* Purple eyebrow heading */}
      {section ? (
        <h2 className="text-[30px] font-medium text-[#8015e8] leading-[42px]">
          {section.eyebrow}
        </h2>
      ) : heading && (
        <h2 className="text-[30px] font-medium text-[#8015e8] leading-[42px]">{heading}</h2>
      )}

      {/* Subheading with purple accent words */}
      {section ? section.subheadingJSX : subheading && (
        <p className="text-[20px] font-semibold text-black leading-[28px]">{subheading}</p>
      )}

      {/* Body content from Sanity */}
      {content && !hideCorruptedBodyContent && (
        <div className="text-[16px] text-black leading-[22.4px]">
          <PortableText value={content} components={portableTextComponents} />
        </div>
      )}

      {/* CTA button */}
      {ctaLabel && ctaUrl && (
        <Link
          href={ctaUrl}
          className="group flex items-center justify-center gap-2 h-[53px] w-[326px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] hover:bg-[#579bfc] hover:bg-none text-white text-[16px] font-bold tracking-[0.32px] transition-colors"
        >
          <PaperPlaneIcon />
          {ctaLabel}
        </Link>
      )}
    </div>
  )

  // Always show image column — Sanity image > Figma fallback > gray placeholder
  const imageContent = (
    <div className="w-full max-w-[490px]">
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlFor(image).width(540).url()}
          alt={heading ?? ''}
          className="w-full h-auto"
          width={490}
        />
      ) : fallbackVideoSrc ? (
        <video
          src={fallbackVideoSrc}
          className="w-full h-[413px] object-contain bg-white"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : fallbackSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fallbackSrc}
          alt={section?.eyebrow ?? ''}
          className="w-full h-[413px] object-contain"
          width={490}
          height={413}
        />
      ) : (
        <div className="w-full h-[413px] bg-[#d9d9d9]" />
      )}
    </div>
  )

  return (
    <section className="bg-white py-[80px] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[120px] 2xl:px-[273px]">
      <div className="mx-auto flex flex-col items-center gap-[60px] md:flex-row md:items-center md:justify-center max-w-[1440px]">
        {imageOnLeft && imageContent}
        {textContent}
        {!imageOnLeft && imageContent}
      </div>
    </section>
  )
}
