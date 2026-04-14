"use client"

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
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData } from "@/components/sections/types"

interface UniversalPageTemplateProps {
  page: any // the Sanity page document
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
}

export default function UniversalPageTemplate({
  page,
  siteSettings,
  caseStudies = [],
}: UniversalPageTemplateProps) {
  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.heroSubheading}
        heroImage={page.heroImage}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={siteSettings?.navbarPartnerBadges || []}
        primaryCtaLabel={page.primaryCtaLabel || "🚀 Book a Consultation"}
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

      {/* 3. Comparison Tabs (if populated) */}
      {page.comparisonTabs?.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={page.comparisonTabs}
        />
      )}

      {/* 4. Methodology (if populated) */}
      {page.methodologySteps?.length > 0 && (
        <MethodologySection
          heading={page.methodologyHeading}
          steps={page.methodologySteps}
        />
      )}

      {/* 5. Testimonials */}
      <TestimonialsGrid caseStudies={caseStudies} />

      {/* 6. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 7. FAQ */}
      {page.faqTabs?.length > 0 && <FaqAccordion tabs={page.faqTabs} />}

      {/* 8. Discover CTA */}
      <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />

      {/* 9. Join Stats */}
      {page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel="🚀 Book a Time"
          ctaUrl={calendlyUrl}
          siteSettings={siteSettings || undefined}
        />
      )}

      {/* 10. Security Badge */}
      <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
    </div>
  )
}
