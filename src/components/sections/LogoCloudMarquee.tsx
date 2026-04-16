"use client"

import { urlFor } from "@/sanity/image"
import type { CarouselLogo } from "./types"

interface LogoCloudMarqueeProps {
  headingPart1?: string
  headingAccent?: string
  logos?: CarouselLogo[]
}

export default function LogoCloudMarquee({
  headingPart1 = "Clients who have used our ",
  headingAccent = "monday.com consulting services",
  logos = [],
}: LogoCloudMarqueeProps) {
  const normalizedLogos = logos
    .map((logo, i) => {
      const src = logo.image?.asset?._ref ? (() => { try { return urlFor(logo.image).url() } catch { return null } })() : null
      return { key: logo._key || `logo-${i}`, src, alt: logo.alt || `Client ${i + 1}` }
    })
    .filter((l) => l.src)
  const duplicatedLogos = [...normalizedLogos, ...normalizedLogos]

  if (normalizedLogos.length === 0) return null

  return (
    <section className="bg-white py-[80px] px-4">
      <div className="flex flex-col gap-[35px] items-center w-full max-w-[1348px] mx-auto">
        <p className="text-section-h3 text-center">
          <span className="text-black">{headingPart1}</span>
          <span style={{ color: "var(--purple-primary)" }}>{headingAccent}</span>
        </p>
        <div className="w-full overflow-visible">
          <div className="flex items-center gap-[65px] animate-marquee" style={{ width: "max-content" }}>
            {duplicatedLogos.map((logo, i) => (
              <div key={`${logo.key}-${i}`} className="flex items-center justify-center shrink-0 h-[65px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src!} alt={logo.alt} height={65} className="h-full w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
