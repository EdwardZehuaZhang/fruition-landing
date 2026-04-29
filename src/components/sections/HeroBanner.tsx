"use client"

import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import type { SanityImageRef, PartnerBadge } from "./types"

interface HeroBannerProps {
  eyebrow?: string
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  subheading?: string
  heroImage?: SanityImageRef
  /** Local URL fallback for the hero image. Takes precedence over heroImage when both are set. */
  heroImageUrl?: string
  /** When true, the hero image renders contained (no crop) at natural aspect ratio. */
  heroImageContain?: boolean
  /** Override for the hero image height in px (used with heroImageContain to control vertical space). */
  heroImageMaxHeight?: number
  heroVideoSrc?: string
  certificationBadge?: SanityImageRef
  partnerBadges?: PartnerBadge[]
  /** When set, hides individual partner badges and shows this image below the hero media instead. */
  partnerImageSrc?: SanityImageRef | string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).url() } catch { return null }
}

/** Override specific partner badges with local dark variants */
const DARK_LOGO_OVERRIDES: Record<string, string> = {
  n8n: '/images/partner-n8n-dark.avif',
  aircall: '/images/partner-aircall-dark.avif',
}

function getDarkBadgeSrc(name: string | undefined, fallbackSrc: string | null): string | null {
  const n = (name || '').toLowerCase()
  for (const [key, darkSrc] of Object.entries(DARK_LOGO_OVERRIDES)) {
    if (n.includes(key)) return darkSrc
  }
  return fallbackSrc
}

export default function HeroBanner({
  eyebrow,
  headingPart1 = "",
  headingAccent = "",
  headingPart2 = "",
  subheading,
  heroImage,
  heroImageUrl,
  heroImageContain = false,
  heroImageMaxHeight,
  heroVideoSrc,
  certificationBadge,
  partnerBadges = [],
  partnerImageSrc,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
}: HeroBannerProps) {
  const heroImageSrc = heroImageUrl || safeImageUrl(heroImage)
  const certBadgeSrc = safeImageUrl(certificationBadge)
  const partnerImageUrl = typeof partnerImageSrc === "string"
    ? partnerImageSrc
    : safeImageUrl(partnerImageSrc as SanityImageRef)

  return (
    <section className="bg-white">
      <div
        className="mx-auto flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[120px] 2xl:px-[273px] max-w-[1588px] w-full"
        style={{ paddingTop: 80, paddingBottom: 80 }}
      >
        {/* Partner badges — hidden when a single partnerImageUrl is used */}
        {!partnerImageUrl && partnerBadges.length > 0 && (
          <div className="flex items-center" style={{ gap: 22 }}>
            {partnerBadges.map((badge, i) => {
              const cmsSrc = safeImageUrl(badge.image)
              const src = getDarkBadgeSrc(badge.name, cmsSrc)
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

        {/* Partner image — shown below hero text when partnerImageUrl is resolved */}
        {partnerImageUrl && (
          <div style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={partnerImageUrl}
              alt="monday.com partner certifications"
              style={{ maxWidth: 700, height: "auto" }}
            />
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-[680px]" style={{ gap: 20, marginTop: 40 }}>
          {primaryCtaLabel && primaryCtaUrl && (
            <CtaButton
              href={primaryCtaUrl}
              label={primaryCtaLabel}
              variant={secondaryCtaLabel ? "outline" : "primary"}
              className="w-full sm:flex-1 sm:max-w-[330px]"
            />
          )}
          {secondaryCtaLabel && secondaryCtaUrl && (
            <CtaButton
              href={secondaryCtaUrl}
              label={secondaryCtaLabel}
              variant="primary"
              className="w-full sm:flex-1 sm:max-w-[330px]"
            />
          )}
        </div>

        {/* Hero media — video takes precedence over image */}
        {heroVideoSrc ? (
          <div className="w-full max-w-[1042px]" style={{ marginTop: 40 }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="rounded-card object-contain bg-white w-full"
              style={{ height: "auto", aspectRatio: "1042 / 312" }}
            >
              <source src={heroVideoSrc} type="video/mp4" />
            </video>
          </div>
        ) : heroImageSrc ? (
          <div className="w-full max-w-[1042px]" style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageSrc}
              alt="Hero"
              className="rounded-card bg-white w-full"
              style={
                heroImageContain
                  ? {
                      maxHeight: heroImageMaxHeight ?? 520,
                      height: "auto",
                      objectFit: "contain",
                    }
                  : { height: "auto", aspectRatio: "1042 / 312", objectFit: "contain" }
              }
            />
          </div>
        ) : null}

      </div>
    </section>
  )
}
