import Link from 'next/link'

interface CtaBlockProps {
  heading?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

export default function CtaBlockView({ heading, body, ctaLabel, ctaUrl, secondaryCtaLabel, secondaryCtaUrl }: CtaBlockProps) {
  return (
    <section className="bg-[#1a1a2e] py-16 px-4 text-white">
      <div className="mx-auto max-w-4xl text-center">
        {heading && (
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{heading}</h2>
        )}
        {body && (
          <p className="mb-8 text-gray-300 max-w-2xl mx-auto">{body}</p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {ctaLabel && ctaUrl && (
            <Link
              href={ctaUrl}
              className="inline-block rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              {ctaLabel}
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
    </section>
  )
}
