"use client"

import type { ReactNode } from "react"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  MethodologySection,
  TestimonialsGrid,
  CalendlySection,
  FaqAccordion,
  DiscoverCtaSection,
  JoinStatsSection,
  SecurityBadgeSection,
  CapabilitiesGrid,
  ServicesCardsGrid,
  FeatureNumberList,
  SolutionCardsSection,
  CaseStudyCardsSection,
  IndustryTabsSection,
  TestimonialCtaBanner,
  RemoteTeamSection,
  ApplicationFormSection,
  TextContentSection,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData } from "@/components/sections/types"

import type { FaqTab } from "@/components/sections/types"

interface UniversalPageTemplateProps {
  page: any // the Sanity page document
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  /**
   * Central FAQs (faqItem docs) already grouped into tabs for this
   * page. When provided and non-empty, takes precedence over the
   * legacy embedded `page.faqTabs`. See src/sanity/groupFaqs.ts.
   */
  faqTabs?: FaqTab[]
  /** Local mp4 src — when set, replaces the Sanity heroImage in the hero. */
  heroVideoSrc?: string
  /** Custom JSX injected directly after the FAQ section. */
  afterFaq?: ReactNode
}

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

export default function UniversalPageTemplate({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
  heroVideoSrc,
  afterFaq,
}: UniversalPageTemplateProps) {
  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

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

  const heroVideoEmbedSrc = youtubeEmbedUrl(page.heroVideoUrl)
  const bottomVideoEmbedSrc = youtubeEmbedUrl(page.bottomVideoUrl)

  const featuredTestimonial =
    caseStudies.find(
      (c) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies[0]

  const capabilitiesColumns =
    page.capabilitiesColumns === 2 || page.capabilitiesColumns === 3
      ? page.capabilitiesColumns
      : undefined

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.heroSubheading}
        heroImage={page.heroImage}
        heroVideoSrc={heroVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel || "\uD83D\uDE80 Book a Consultation"}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl}
      />

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={
          page.logoCloudHeadingPart1 || "Clients who have used our "
        }
        headingAccent={
          page.logoCloudHeadingAccent || "monday.com consulting services"
        }
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 2b. Hero video (only when heroVideoUrl is set on the page doc) */}
      {heroVideoEmbedSrc && (
        <section className="bg-white" style={{ paddingBottom: 80 }}>
          <div className="mx-auto" style={{ maxWidth: 1042 }}>
            <div className="rounded-card overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
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

      {/* 7. Capabilities Grid (if populated) - moved earlier to match design flow */}
      {page.capabilitiesCards?.length > 0 && (
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

      {/* 7b. Secondary Capabilities Grid (e.g. "What We're Looking For") */}
      {page.secondaryCapabilitiesCards?.length > 0 && (
        <CapabilitiesGrid
          eyebrow={page.secondaryCapabilitiesEyebrow}
          heading={page.secondaryCapabilitiesHeading}
          headingAccent={page.secondaryCapabilitiesHeadingAccent}
          subheading={page.secondaryCapabilitiesSubheading}
          theme="light"
          columns={
            page.secondaryCapabilitiesColumns === 2 ||
            page.secondaryCapabilitiesColumns === 3
              ? page.secondaryCapabilitiesColumns
              : undefined
          }
          cards={page.secondaryCapabilitiesCards}
          ctaLabel={page.secondaryCapabilitiesCtaLabel}
          ctaUrl={page.secondaryCapabilitiesCtaUrl}
        />
      )}

      {/* 7c. Remote Team / Global Offices section */}
      {(page.officeLocations?.length > 0 || page.remoteTeamHeading) && (
        <RemoteTeamSection
          eyebrow={page.remoteTeamEyebrow}
          heading={page.remoteTeamHeading}
          headingAccent={page.remoteTeamHeadingAccent}
          subheading={page.remoteTeamSubheading}
          offices={page.officeLocations || []}
          features={page.remoteFeatures || []}
          ctaLabel={page.remoteTeamCtaLabel}
          ctaUrl={page.remoteTeamCtaUrl}
        />
      )}

      {/* Feature Number List (e.g. "The Everything App for Work") */}
      {page.featureListItems?.length > 0 && (
        <FeatureNumberList
          heading={page.featureListHeading}
          headingAccent={page.featureListHeadingAccent}
          subheading={page.featureListSubheading}
          theme={page.featureListTheme || "dark"}
          columns={page.featureListColumns === 3 ? 3 : 2}
          items={page.featureListItems}
        />
      )}

      {/* Services Cards Grid (e.g. "Our Comprehensive n8n Services" as cards) */}
      {page.servicesCards?.length > 0 && (
        <ServicesCardsGrid
          heading={page.servicesHeading}
          headingAccent={page.servicesHeadingAccent}
          subheading={page.servicesSubheading}
          theme={page.servicesTheme || "dark"}
          cards={page.servicesCards}
        />
      )}

      {/* 3. Comparison Tabs (if populated) */}
      {mergedComparisonTabs.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={mergedComparisonTabs}
          theme={page.comparisonTheme || "light"}
        />
      )}

      {/* 4. Calendly (Book Your Personalised Demo) */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 4a. Long-form text content sections (e.g. About Us narrative) */}
      {page.textContentSections?.length > 0 &&
        page.textContentSections.map((section: { _key?: string; heading?: string; headingAccent?: string; body?: string; theme?: "light" | "tint" }, i: number) => (
          <TextContentSection
            key={section._key || `text-${i}`}
            heading={section.heading}
            headingAccent={section.headingAccent}
            body={section.body}
            theme={section.theme}
          />
        ))}

      {/* 5. FAQ — prefer central faqItem docs (single source of truth); fall
          back to the page's embedded faqTabs when the page hasn't been
          migrated yet. */}
      {(faqTabs && faqTabs.length > 0) ? (
        <FaqAccordion tabs={faqTabs} />
      ) : page.faqTabs?.length > 0 ? (
        <FaqAccordion tabs={page.faqTabs} />
      ) : null}

      {/* Slot: custom sections immediately after the FAQ */}
      {afterFaq}

      {/* 6. Case Study Cards (if populated) */}
      {page.caseStudyCards?.length > 0 && (
        <CaseStudyCardsSection
          heading={page.caseStudySectionHeading}
          cards={page.caseStudyCards}
        />
      )}

      {/* 8. Solution Cards - left/right (if populated) */}
      {page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 9. Industry Tabs (if populated) */}
      {page.industryTabs?.length > 0 && (
        <IndustryTabsSection
          heading={page.industryHeading}
          tabs={page.industryTabs}
        />
      )}

      {/* 10. Methodology (if populated and not merged into comparison tabs) */}
      {!shouldMergeMethodology && methodologySteps.length > 0 && (
        <MethodologySection
          heading={page.methodologyHeading}
          steps={methodologySteps}
        />
      )}

      {/* 11. Bottom video embed (if populated) */}
      {bottomVideoEmbedSrc && (
        <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
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

      {/* 11b. Application form embed (monday.com WorkForms) */}
      {page.applicationFormEmbedUrl && (
        <ApplicationFormSection
          heading={page.applicationFormHeading}
          embedUrl={page.applicationFormEmbedUrl}
        />
      )}

      {/* 12. Testimonials */}
      <TestimonialsGrid caseStudies={caseStudies} />

      {/* 13. Discover CTA */}
      {!page.hideDiscoverSection && (
        <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />
      )}

      {/* 14. Join Stats */}
      {!page.hideJoinStatsSection && page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel="\uD83D\uDE80 Book a Time"
          ctaUrl={calendlyUrl}
          siteSettings={siteSettings || undefined}
        />
      )}

      {/* 15. Testimonial CTA Banner (bottom) */}
      {!page.hideTestimonialBanner && (
        <TestimonialCtaBanner
          headingPart1={page.joinHeadingPart1 || "Join "}
          headingAccent={page.joinHeadingAccent || "500+ organisations"}
          headingPart2={
            page.joinHeadingPart2 ||
            " that have maximised their workflows with our monday.com expert support"
          }
          primaryCtaUrl={calendlyUrl}
          secondaryCtaUrl={calendlyUrl}
          testimonial={featuredTestimonial}
        />
      )}

      {/* 16. Security Badge */}
      <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
    </div>
  )
}
