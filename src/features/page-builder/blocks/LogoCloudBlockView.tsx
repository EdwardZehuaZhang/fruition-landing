'use client'

import { urlFor } from '@/sanity/image'

interface Logo {
  _key?: string
  name?: string
  image?: { asset: { _ref: string } }
}

interface LogoCloudBlockProps {
  heading?: string
  logos?: Logo[]
}

function renderHeadingWithAccent(heading: string) {
  const accent = 'monday.com consulting services'
  const idx = heading.indexOf(accent)
  if (idx >= 0) {
    const before = heading.slice(0, idx)
    const after = heading.slice(idx + accent.length)
    return (
      <p className="text-[22px] leading-[30px] md:text-[28px] md:leading-[39.2px] font-medium text-center">
        <span className="text-body">{before}</span>

        <span className="text-[#8015e8]">{accent}</span>
        {after && <span className="text-body">{after}</span>}
      </p>
    )
  }
  return <p className="text-[22px] leading-[30px] md:text-[28px] md:leading-[39.2px] font-medium text-body text-center">{heading}</p>

}

export default function LogoCloudBlockView({ heading, logos }: LogoCloudBlockProps) {
  if (!logos || logos.length === 0) return null

  // Duplicate logos for seamless marquee loop
  const duplicatedLogos = [...logos, ...logos]

  return (
    <section className="bg-surface py-[80px] px-4">
      <div className="flex flex-col gap-[35px] items-center w-full max-w-[1348px] mx-auto">
        {/* Heading */}
        {heading && renderHeadingWithAccent(heading)}

        {/* Horizontal marquee logo strip - clip overflow to prevent page horizontal scroll */}
        <div className="w-full overflow-hidden">
          <div className="flex items-center gap-[65px] animate-marquee" style={{ width: 'max-content' }}>
            {duplicatedLogos.map((logo, i) => (
              <div key={`logo-${i}`} className="flex items-center justify-center shrink-0 h-[65px] overflow-hidden">
                {logo.image?.asset ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(logo.image).height(65).url()}
                    alt={logo.name ?? ''}
                    height={65}
                    className="h-full w-auto object-contain"
                  />
                ) : (
                  logo.name && (
                    <span className="text-sm font-medium text-muted whitespace-nowrap">{logo.name}</span>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
