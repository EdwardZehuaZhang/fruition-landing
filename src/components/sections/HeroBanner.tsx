"use client"

import Link from "next/link"
import { urlFor } from "@/sanity/image"
import type { SanityImageRef, PartnerBadge } from "./types"

interface HeroBannerProps {
  eyebrow?: string
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  subheading?: string
  heroImage?: SanityImageRef
  heroVideoSrc?: string
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
  eyebrow,
  headingPart1 = "",
  headingAccent = "",
  headingPart2 = "",
  subheading,
  heroImage,
  heroVideoSrc,
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
                />
              )
            })}
          </div>
        )}

        {/* Eyebrow */}
        {eyebrow && (
          <div
            style={{
              marginTop: partnerBadges.length > 0 ? 32 : 0,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--purple-primary)",
            }}
          >
            {eyebrow}
          </div>
        )}

        {/* Heading */}
        <h1
          className="text-display text-center"
          style={{ marginTop: eyebrow ? 16 : 42, maxWidth: 924 }}
        >
          <span className="text-black">{headingPart1}</span>
          {headingAccent && <span style={{ color: "var(--purple-primary)" }}>{headingAccent}</span>}
          {headingPart2 && <span className="text-black">{headingPart2}</span>}
        </h1>

        {/* Subheading */}
        {subheading && (
          <p className="text-body-lead text-center text-black" style={{ marginTop: 31, maxWidth: 859, whiteSpace: "pre-line" }}>
            {subheading}
          </p>
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

        {/* Hero media — video takes precedence over image */}
        {heroVideoSrc ? (
          <div style={{ marginTop: 40 }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="rounded-card object-cover"
              style={{ width: 1042, height: 312 }}
            >
              <source src={heroVideoSrc} type="video/mp4" />
            </video>
          </div>
        ) : heroImageSrc ? (
          <div style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImageSrc} alt="Hero" width={1042} height={312} className="rounded-card object-cover" style={{ width: 1042, height: 312 }} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
