"use client"

import Link from "next/link"
import { urlFor } from "@/sanity/image"
import type { SanityImageRef, PartnerBadge } from "./types"

interface HeroBannerProps {
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  subheading?: string
  heroImage?: SanityImageRef
  certificationBadge?: SanityImageRef
  partnerBadges?: PartnerBadge[]
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).url() } catch { return null }
}

export default function HeroBanner({
  headingPart1 = "",
  headingAccent = "",
  headingPart2 = "",
  subheading,
  heroImage,
  certificationBadge,
  partnerBadges = [],
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
}: HeroBannerProps) {
  const heroImageSrc = safeImageUrl(heroImage)
  const certBadgeSrc = safeImageUrl(certificationBadge)

  return (
    <section className="bg-white">
      <div
        className="mx-auto flex flex-col items-center"
        style={{ paddingLeft: 273, paddingRight: 273, paddingTop: 80, paddingBottom: 80 }}
      >
        {/* Partner badges */}
        {partnerBadges.length > 0 && (
          <div className="flex items-center" style={{ gap: 22 }}>
            {partnerBadges.map((badge, i) => {
              const src = safeImageUrl(badge.image)
              if (!src) return null
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={badge._key || `badge-${i}`}
                  src={src}
                  alt={badge.name || "Partner badge"}
                  width={120}
                  height={44}
                  className="h-[44px] w-auto rounded-[5px]"
                  style={{ boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.5)" }}
                />
              )
            })}
          </div>
        )}

        {/* Heading */}
        <h1
          className="text-center font-bold"
          style={{ fontSize: 48, lineHeight: "67.2px", marginTop: 42, maxWidth: 924 }}
        >
          <span className="text-black">{headingPart1}</span>
          {headingAccent && <span style={{ color: "#8015e8" }}>{headingAccent}</span>}
          {headingPart2 && <span className="text-black">{headingPart2}</span>}
        </h1>

        {/* Subheading */}
        {subheading && (
          <p style={{ fontSize: 18, lineHeight: "25.2px", color: "black", marginTop: 31, textAlign: "center", maxWidth: 859, whiteSpace: "pre-line" }}>
            {subheading}
          </p>
        )}

        {/* Certification banner */}
        {certBadgeSrc && (
          <div style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={certBadgeSrc} alt="Certifications" width={534} height={133} className="h-[133px] w-[534px] object-contain" />
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex items-center justify-center" style={{ gap: 20, marginTop: 40, width: 680 }}>
          {primaryCtaLabel && primaryCtaUrl && (
            <Link
              href={primaryCtaUrl}
              className="flex items-center justify-center font-bold"
              style={{
                width: 330, height: 53, borderRadius: 100,
                ...(secondaryCtaLabel
                  ? { border: "1px solid #8015e8", backgroundColor: "white", color: "#8015e8" }
                  : { background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white" }),
                fontSize: 16,
              }}
            >
              {primaryCtaLabel}
            </Link>
          )}
          {secondaryCtaLabel && secondaryCtaUrl && (
            <Link
              href={secondaryCtaUrl}
              className="flex items-center justify-center font-bold text-white"
              style={{ width: 330, height: 53, borderRadius: 100, background: "linear-gradient(to right, #8015e8, #ba83f0)", fontSize: 16 }}
            >
              {secondaryCtaLabel}
            </Link>
          )}
        </div>

        {/* Hero image */}
        {heroImageSrc && (
          <div style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImageSrc} alt="Hero" width={1042} height={312} className="rounded-[24px] object-cover" style={{ width: 1042, height: 312 }} />
          </div>
        )}
      </div>
    </section>
  )
}
