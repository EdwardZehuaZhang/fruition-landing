import Link from 'next/link'
import { urlFor } from '@/sanity/image'

interface HeroBlockProps {
  heading?: string
  subheading?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  image?: { asset: { _ref: string } }
}

export default function HeroBlockView({
  heading,
  subheading,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  image,
}: HeroBlockProps) {
  return (
    <section className="relative bg-[#1a1a2e] py-20 px-4 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row">
        <div className="flex-1 text-center md:text-left">
          {heading && (
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{heading}</h1>
          )}
          {subheading && (
            <p className="mb-8 text-lg text-gray-300">{subheading}</p>
          )}
          <div className="flex flex-wrap justify-center gap-4 md:justify-start">
            {primaryCtaLabel && primaryCtaUrl && (
              <Link
                href={primaryCtaUrl}
                className="inline-block rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                {primaryCtaLabel}
              </Link>
            )}
            {secondaryCtaLabel && secondaryCtaUrl && (
              <Link
                href={secondaryCtaUrl}
                className="inline-block rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                {secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>
        {image?.asset && (
          <div className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(image).width(600).url()}
              alt={heading ?? ''}
              className="rounded-lg"
              width={600}
            />
          </div>
        )}
      </div>
    </section>
  )
}
