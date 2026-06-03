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
  CroSections,
  StickyCtaBar,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, FaqTab } from "@/components/sections/types"
import YouTubeEmbed from "@/components/YouTubeEmbed"

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
      <StickyCtaBar label={page.croSections?.stickyCtaLabel} href={page.croSections?.stickyCtaUrl || calendlyUrl} />
      {/* 1. Hero */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[120px] 2xl:px-[273px] max-w-[1588px] w-full"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          {/* Three certificate badges */}
          {page.certificateBadges?.length > 0 && (
            <div className="flex items-center" style={{ gap: 22 }}>
              {page.certificateBadges.map(
                (badge: { src?: string; alt?: string; _key?: string }, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={badge._key || i}
                    src={badge.src}
                    alt={badge.alt}
                    width={120}
                    height={44}
                    className="h-[44px] w-auto rounded-[5px]"
                  />
                ),
              )}
            </div>
          )}

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
            className="flex flex-col sm:flex-row items-center justify-center w-full max-w-[680px]"
            style={{ gap: 20, marginTop: 40 }}
          >
            {page.primaryCtaLabel && (
              <Link
                href={page.primaryCtaUrl || calendlyUrl}
                className="flex items-center justify-center font-bold w-full sm:flex-1 sm:max-w-[330px]"
                style={{
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
                className="flex items-center justify-center font-bold text-white w-full sm:flex-1 sm:max-w-[330px]"
                style={{
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
            <div className="w-full max-w-[1042px]" style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt="Hero"
                className="rounded-card w-full"
                style={{ height: "auto" }}
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
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
              <YouTubeEmbed url={heroVideoEmbedSrc} title={page.heroVideoTitle || "Video"} />
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
          withPurpleCircle
        />
      )}

      {/* 5. Testimonials (above Calendly) */}
      <TestimonialsGrid caseStudies={caseStudies} />

      {/* 5b. CRO action items */}
      <CroSections
        data={page.croSections}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
      />

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
      {!page.hideCapabilitiesSection && page.capabilitiesCards?.length > 0 && (
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
              <YouTubeEmbed url={bottomVideoEmbedSrc} title={page.bottomVideoTitle || "Video"} />
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
