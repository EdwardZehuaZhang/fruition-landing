"use client"

import Link from "next/link"
import { urlFor } from "@/sanity/image"
import {
  LogoCloudMarquee,
  ComparisonTabsSection,
  TestimonialsGrid,
  CalendlySection,
  FaqAccordion,
  CapabilitiesGrid,
  SecurityBadgeSection,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, FaqTab } from "@/components/sections/types"

interface MondayCrmConsultingContentProps {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

type SanityImageRef = { asset?: { _ref?: string } } | null | undefined

function youtubeEmbedUrl(url?: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "")
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url
      const v = u.searchParams.get("v")
      return v ? `https://www.youtube.com/embed/${v}` : null
    }
  } catch {
    return null
  }
  return null
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).url()
  } catch {
    return null
  }
}

const CERTIFICATE_BADGES = [
  { src: "/images/partner-platinum.png", alt: "Monday.com Platinum Partner" },
  { src: "/images/partner-advanced-delivery.png", alt: "Advanced Delivery Partner" },
  { src: "/images/partner-gold-solution.png", alt: "Gold Solution Partner" },
]

export default function MondayCrmConsultingContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: MondayCrmConsultingContentProps) {
  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const heroImageSrc = safeImageUrl(page.heroImage)
  const heroVideoEmbedSrc = youtubeEmbedUrl(page.heroVideoUrl)
  const bottomVideoEmbedSrc = youtubeEmbedUrl(page.bottomVideoUrl)

  const comparisonTabs = page.comparisonTabs ?? []
  const methodologySteps = page.methodologySteps ?? []
  const shouldMergeMethodology =
    comparisonTabs.length >= 3 && methodologySteps.length > 0

  const mergedComparisonTabs = shouldMergeMethodology
    ? comparisonTabs.map((tab: any, idx: number) => {
        const label = tab.label ?? ""
        const isOurApproach =
          label.toLowerCase().includes("our approach") ||
          idx === comparisonTabs.length - 1
        if (!isOurApproach) return tab
        return {
          ...tab,
          items: methodologySteps.map((s: any) => ({
            _key: s._key,
            number: s.number,
            title: s.title,
            description: s.description,
          })),
        }
      })
    : comparisonTabs

  const capabilitiesColumns =
    page.capabilitiesColumns === 2 || page.capabilitiesColumns === 3
      ? page.capabilitiesColumns
      : undefined

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center"
          style={{
            paddingLeft: 273,
            paddingRight: 273,
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          {/* Three certificate badges */}
          <div className="flex items-center" style={{ gap: 22 }}>
            {CERTIFICATE_BADGES.map((badge, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={badge.src}
                alt={badge.alt}
                width={120}
                height={44}
                className="h-[44px] w-auto rounded-[5px]"
              />
            ))}
          </div>

          {/* Eyebrow */}
          {page.heroEyebrow && (
            <div
              style={{
                marginTop: 32,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--purple-primary)",
              }}
            >
              {page.heroEyebrow}
            </div>
          )}

          {/* Heading */}
          <h1
            className="text-display text-center"
            style={{ marginTop: page.heroEyebrow ? 16 : 42, maxWidth: 924 }}
          >
            <span className="text-black">
              {page.heroHeading || page.title || ""}
            </span>
          </h1>

          {/* Subheading */}
          {!page.hideHeroSubheading && page.heroSubheading && (
            <p
              className="text-body-lead text-center text-black"
              style={{
                marginTop: 31,
                maxWidth: 859,
                whiteSpace: "pre-line",
              }}
            >
              {page.heroSubheading}
            </p>
          )}

          {/* CTA buttons */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 20, marginTop: 40, width: 680 }}
          >
            {page.primaryCtaLabel && (
              <Link
                href={page.primaryCtaUrl || calendlyUrl}
                className="flex items-center justify-center font-bold"
                style={{
                  width: 330,
                  height: 53,
                  borderRadius: 100,
                  ...(page.secondaryCtaLabel
                    ? {
                        border: "1px solid #8015e8",
                        backgroundColor: "white",
                        color: "#8015e8",
                      }
                    : {
                        background:
                          "linear-gradient(to right, #8015e8, #ba83f0)",
                        color: "white",
                      }),
                  fontSize: 16,
                }}
              >
                {page.primaryCtaLabel}
              </Link>
            )}
            {page.secondaryCtaLabel && (
              <Link
                href={page.secondaryCtaUrl || calendlyUrl}
                className="flex items-center justify-center font-bold text-white"
                style={{
                  width: 330,
                  height: 53,
                  borderRadius: 100,
                  background: "linear-gradient(to right, #8015e8, #ba83f0)",
                  fontSize: 16,
                }}
              >
                {page.secondaryCtaLabel}
              </Link>
            )}
          </div>

          {/* Hero image - full height, no cropping */}
          {heroImageSrc && (
            <div style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt="Hero"
                className="rounded-card"
                style={{ width: 1042, height: "auto" }}
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={
          page.logoCloudHeadingPart1 || "Clients who have used our "
        }
        headingAccent={
          page.logoCloudHeadingAccent ?? "monday.com consulting services"
        }
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Video (underneath logo scroll) */}
      {heroVideoEmbedSrc && (
        <section className="bg-white" style={{ paddingBottom: 80 }}>
          <div className="mx-auto" style={{ maxWidth: 1042 }}>
            <div
              className="rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9" }}
            >
              <iframe
                src={heroVideoEmbedSrc}
                title={page.heroVideoTitle || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 4. Comparison Tabs (if populated) */}
      {mergedComparisonTabs.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={mergedComparisonTabs}
          theme={page.comparisonTheme || "light"}
        />
      )}

      {/* 5. Testimonials (above Calendly) */}
      <TestimonialsGrid caseStudies={caseStudies} />

      {/* 6. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 7. FAQ */}
      {!page.hideFaqSection &&
        (faqTabs && faqTabs.length > 0 ? (
          <FaqAccordion tabs={faqTabs} />
        ) : page.faqTabs?.length > 0 ? (
          <FaqAccordion tabs={page.faqTabs} />
        ) : null)}

      {/* 8. CRM Management Capabilities (bottom section) */}
      {!page.hideCapabilitiesSection &&
        page.capabilitiesCards?.length > 0 && (
          <CapabilitiesGrid
            eyebrow={page.capabilitiesEyebrow}
            heading={page.capabilitiesHeading}
            headingAccent={page.capabilitiesHeadingAccent}
            subheading={page.capabilitiesSubheading}
            theme={page.capabilitiesTheme || "light"}
            columns={capabilitiesColumns}
            cards={page.capabilitiesCards}
            ctaLabel={page.capabilitiesCtaLabel}
            ctaUrl={page.capabilitiesCtaUrl}
          />
        )}

      {/* 9. Bottom video (under capabilities) */}
      {bottomVideoEmbedSrc && (
        <section className="bg-white" style={{ paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1042 }}>
            <div
              className="rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9" }}
            >
              <iframe
                src={bottomVideoEmbedSrc}
                title={page.bottomVideoTitle || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 10. Security Badge */}
      {!page.hideSecurityBadgeSection && (
        <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
      )}
    </div>
  )
}
