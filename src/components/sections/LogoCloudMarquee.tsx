"use client"

import { urlFor } from "@/sanity/image"
import FramedMedia from "@/components/common/FramedMedia"
import type { CarouselLogo } from "./types"

interface LogoCloudMarqueeProps {
  headingPart1?: string
  headingAccent?: string
  description?: string
  logos?: CarouselLogo[]
}

export default function LogoCloudMarquee({
  headingPart1 = "Clients who have used our ",
  headingAccent = "monday.com consulting services",
  description,
  logos = [],
}: LogoCloudMarqueeProps) {
  const normalizedLogos = logos
    .map((logo, i) => {
      const src = logo.image?.asset?._ref ? (() => { try { return urlFor(logo.image).height(130).dpr(2).auto("format").url() } catch { return null } })() : null
      return { key: logo._key || `logo-${i}`, src, alt: logo.alt || `Client ${i + 1}` }
    })
    .filter((l) => l.src)
  const duplicatedLogos = [...normalizedLogos, ...normalizedLogos]

  if (normalizedLogos.length === 0) return null

  return (
    <section className="bg-surface py-[80px] overflow-hidden">
      <div className="flex flex-col gap-[35px] items-center w-full">
        <div className="w-full flex flex-col gap-[35px] items-center max-w-[1348px] mx-auto px-4">
          <p className="text-section-h3 text-center">
            <span className="text-body">{headingPart1}</span>
            <span className="text-brand">{headingAccent}</span>
          </p>
          {description && (
            <p className="text-center text-base leading-[1.6] text-muted max-w-[860px] whitespace-pre-line">
              {description}
            </p>
          )}
        </div>
        <div className="relative left-1/2 -translate-x-1/2 w-screen">
          <div className="flex items-center gap-[65px] animate-marquee w-max">
            {duplicatedLogos.map((logo, i) => (
              <FramedMedia key={`${logo.key}-${i}`} className="flex items-center justify-center shrink-0 h-[65px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src!} alt={logo.alt} height={65} className="h-full w-auto object-contain" />
              </FramedMedia>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
