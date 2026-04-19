"use client"

import Link from "next/link"
import {
  LogoCloudMarquee,
  ComparisonTabsSection,
  TestimonialsGrid,
  CalendlySection,
  DiscoverCtaSection,
  JoinStatsSection,
  SecurityBadgeSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageRef = any

interface ShowcaseCard {
  heading?: string
  body?: string
  imageRight?: boolean
  mediaType?: "image" | "video"
  image?: SanityImageRef
  videoUrl?: string
}

interface MakePartnersPageData {
  seoTitle?: string
  seoDescription?: string
  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroSubheading?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroImage?: SanityImageRef
  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string
  comparisonHeading?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparisonTabs?: any[]
  showcaseHeading?: string
  showcaseSubheading?: string
  showcaseCards?: ShowcaseCard[]
  calendlyHeading?: string
  calendlySubheading?: string
  testimonialsHeading?: string
  testimonialsCtaLabel?: string
  testimonialsCtaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string
  joinHeadingPart1?: string
  joinHeadingAccent?: string
  joinHeadingPart2?: string
  joinStats?: Array<{ _key?: string; value?: string; label?: string }>
  joinCtaLabel?: string
  joinCtaUrl?: string
  testimonialBannerHeadingPart1?: string
  testimonialBannerHeadingAccent?: string
  testimonialBannerHeadingPart2?: string
}

interface Props {
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  pageData?: MakePartnersPageData | null
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function safeSrc(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).url() } catch { return null }
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function MakePartnersContent({
  siteSettings,
  caseStudies = [],
  pageData,
}: Props) {
  const calendlyUrl = siteSettings?.calendlyLink

  const partnerBadges = siteSettings?.navbarPartnerBadges || []

  const featuredTestimonial =
    caseStudies.find(
      (c) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies[0]

  // Hero
  const heroHeadingPart1 = pageData?.heroHeadingPart1
  const heroHeadingAccent = pageData?.heroHeadingAccent
  const heroSubheading = pageData?.heroSubheading
  const heroPrimaryCtaLabel = pageData?.heroPrimaryCtaLabel
  const heroPrimaryCtaUrl = pageData?.heroPrimaryCtaUrl || calendlyUrl || "#"
  const heroImageSrc = safeSrc(pageData?.heroImage)

  // Logo cloud
  const logoCloudPart1 = pageData?.logoCloudHeadingPart1
  const logoCloudAccent = pageData?.logoCloudHeadingAccent

  // Feature tabs
  const comparisonHeading = pageData?.comparisonHeading
  const featureTabs = pageData?.comparisonTabs

  // Showcase
  const showcaseHeading = pageData?.showcaseHeading
  const showcaseSubheading = pageData?.showcaseSubheading

  // Resolve showcase cards from Sanity
  type ResolvedCard = {
    heading: string
    body: string
    imageRight: boolean
    mediaType: "video" | "image"
    mediaSrc: string
  }

  const resolvedShowcaseCards: ResolvedCard[] = (pageData?.showcaseCards ?? [])
    .map((card): ResolvedCard | null => {
      const heading = card.heading ?? ""
      const body = card.body ?? ""
      const imageRight = card.imageRight ?? true
      const mediaType = card.mediaType ?? "image"
      let mediaSrc = ""
      if (mediaType === "video") {
        mediaSrc = card.videoUrl ?? ""
      } else {
        mediaSrc = safeSrc(card.image) ?? ""
      }
      if (!mediaSrc) return null
      return { heading, body, imageRight, mediaType, mediaSrc }
    })
    .filter((c): c is ResolvedCard => c !== null)

  // Calendly
  const calendlyHeading = pageData?.calendlyHeading
  const calendlySubheading = pageData?.calendlySubheading

  // Join stats
  const joinPart1 = pageData?.joinHeadingPart1
  const joinAccent = pageData?.joinHeadingAccent
  const joinPart2 = pageData?.joinHeadingPart2
  const joinStats = pageData?.joinStats
  const joinCtaLabel = pageData?.joinCtaLabel
  const joinCtaUrl = pageData?.joinCtaUrl || calendlyUrl || "#"

  // Testimonial banner
  const bannerPart1 = pageData?.testimonialBannerHeadingPart1
  const bannerAccent = pageData?.testimonialBannerHeadingAccent
  const bannerPart2 = pageData?.testimonialBannerHeadingPart2

  // Testimonials
  const testimonialsHeading = pageData?.testimonialsHeading
  const testimonialsCtaLabel = pageData?.testimonialsCtaLabel
  const testimonialsCtaUrl = pageData?.testimonialsCtaUrl
  const statCardValue = pageData?.statCardValue
  const statCardSubtitle = pageData?.statCardSubtitle
  const statCardCtaLabel = pageData?.statCardCtaLabel
  const statCardCtaUrl = pageData?.statCardCtaUrl

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingLeft: 273, paddingRight: 273, paddingTop: 80, paddingBottom: 80 }}
        >
          {partnerBadges.length > 0 && (
            <div className="flex items-center" style={{ gap: 22 }}>
              {partnerBadges.map((badge, i) => {
                const src = safeSrc(badge.image)
                if (!src) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={(badge as any)._key || `badge-${i}`}
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

          <h1
            className="text-center font-bold"
            style={{ fontSize: 48, lineHeight: "67.2px", marginTop: 42, maxWidth: 924 }}
          >
            <span className="text-black">{heroHeadingPart1}</span>
            <span style={{ color: "#8015e8" }}>{heroHeadingAccent}</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: "25.2px",
              color: "black",
              marginTop: 31,
              textAlign: "center",
              maxWidth: 859,
              whiteSpace: "pre-line",
            }}
          >
            {heroSubheading}
          </p>

          <div className="flex items-center justify-center" style={{ gap: 20, marginTop: 40, width: 680 }}>
            <Link
              href={heroPrimaryCtaUrl}
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 330,
                height: 53,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {heroPrimaryCtaLabel}
            </Link>
          </div>

          {/* Hero image */}
          {heroImageSrc && (
            <div style={{ marginTop: 40, width: "100%", maxWidth: 1042 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt="Make.com Gold Partner badge with workflow automation visuals"
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={logoCloudPart1}
        headingAccent={logoCloudAccent}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Three-tab section */}
      {featureTabs && featureTabs.length > 0 && (
        <ComparisonTabsSection
          heading={comparisonHeading}
          tabs={featureTabs}
        />
      )}

      {/* 4. Alternating media + text showcase */}
      {resolvedShowcaseCards.length > 0 && (
        <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
            <div className="flex flex-col items-center text-center" style={{ marginBottom: 60 }}>
              {showcaseHeading && (
                <h2
                  className="text-section-h2 text-black"
                  style={{ maxWidth: 900 }}
                >
                  {showcaseHeading}
                </h2>
              )}
              {showcaseSubheading && (
                <p
                  className="text-black"
                  style={{ fontSize: 20, marginTop: 12, maxWidth: 760 }}
                >
                  {showcaseSubheading}
                </p>
              )}
            </div>

            <div className="flex flex-col" style={{ gap: 60 }}>
              {resolvedShowcaseCards.map((card, i) => (
                <div
                  key={`showcase-${i}`}
                  className="flex items-center"
                  style={{
                    gap: 48,
                    flexDirection: card.imageRight ? "row" : "row-reverse",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 600, color: "#2b074d", lineHeight: "36px" }}>
                      {card.heading}
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: "25.6px", color: "black", marginTop: 20 }}>
                      {card.body}
                    </p>
                  </div>
                  <div
                    className="rounded-card overflow-hidden"
                    style={{ flex: 1, aspectRatio: "16 / 10", background: "#f5f3f7" }}
                  >
                    {card.mediaType === "video" ? (
                      <video
                        src={card.mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.mediaSrc}
                        alt={card.heading}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Calendly */}
      <CalendlySection
        heading={calendlyHeading}
        subheading={calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 6. Testimonials */}
      <TestimonialsGrid
        caseStudies={caseStudies}
        heading={testimonialsHeading}
        ctaLabel={testimonialsCtaLabel}
        ctaUrl={testimonialsCtaUrl}
        statCardValue={statCardValue}
        statCardSubtitle={statCardSubtitle}
        statCardCtaLabel={statCardCtaLabel}
        statCardCtaUrl={statCardCtaUrl}
      />

      {/* 7. Discover CTA */}
      <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />

      {/* 8. Join Stats */}
      <JoinStatsSection
        headingPart1={joinPart1}
        headingAccent={joinAccent}
        headingPart2={joinPart2}
        stats={joinStats as Array<{ _key?: string; value?: string; label?: string }>}
        ctaLabel={joinCtaLabel}
        ctaUrl={joinCtaUrl}
        siteSettings={siteSettings || undefined}
      />

      {/* 9. Testimonial CTA Banner */}
      <TestimonialCtaBanner
        headingPart1={bannerPart1}
        headingAccent={bannerAccent}
        headingPart2={bannerPart2}
        primaryCtaUrl={calendlyUrl}
        secondaryCtaUrl={calendlyUrl}
        testimonial={featuredTestimonial}
      />

      {/* 10. Security */}
      <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
    </div>
  )
}
