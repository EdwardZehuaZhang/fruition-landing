'use client'

import Link from 'next/link'

interface Stat {
  _key?: string
  value?: string
  label?: string
}

interface StatsBlockProps {
  heading?: string
  subheading?: string
  stats?: Stat[]
  ctaLabel?: string
  ctaUrl?: string
  footnote?: string
}

export default function StatsBlockView({
  heading,
  subheading,
  stats,
  ctaLabel,
  ctaUrl,
  footnote,
}: StatsBlockProps) {
  return (
    <section className="bg-[#1a1a2e] py-16 px-4 text-white">
      <div className="mx-auto max-w-6xl text-center">
        {heading && (
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{heading}</h2>
        )}
        {subheading && (
          <p className="mx-auto mb-12 max-w-2xl text-gray-300">{subheading}</p>
        )}
        {stats && stats.length > 0 && (
          <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat._key ?? i} className="flex flex-col items-center">
                <span className="text-4xl font-bold text-purple-400 md:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm text-gray-300">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
        {footnote && <p className="mb-6 text-sm text-gray-400">{footnote}</p>}
        {ctaLabel && ctaUrl && (
          <Link
            href={ctaUrl}
            className="inline-block rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
