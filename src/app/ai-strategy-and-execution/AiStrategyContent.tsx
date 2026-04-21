"use client"

import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  ServicesCardsGrid,
  CapabilitiesGrid,
  SecurityBadgeSection,
} from "@/components/sections"
import type { CaseStudy, FaqTab, SiteSettingsData } from "@/components/sections/types"

interface AiStrategyContentProps {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

export default function AiStrategyContent({
  page,
  siteSettings,
  faqTabs,
}: AiStrategyContentProps) {
  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const resolvedFaqTabs =
    faqTabs && faqTabs.length > 0 ? faqTabs : page.faqTabs ?? []

  return (
    <div>
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroImageContain
        heroImageMaxHeight={520}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
      />

      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={
          page.logoCloudHeadingAccent ?? "monday.com consulting services"
        }
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {page.capabilitiesCards?.length > 0 && (
        <CapabilitiesGrid
          eyebrow={page.capabilitiesEyebrow}
          heading={page.capabilitiesHeading}
          headingAccent={page.capabilitiesHeadingAccent}
          subheading={page.capabilitiesSubheading}
          theme={page.capabilitiesTheme || "light"}
          columns={
            page.capabilitiesColumns === 2 || page.capabilitiesColumns === 3
              ? page.capabilitiesColumns
              : undefined
          }
          cards={page.capabilitiesCards}
          ctaLabel={page.capabilitiesCtaLabel}
          ctaUrl={page.capabilitiesCtaUrl}
        />
      )}

      {page.comparisonTabs?.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={page.comparisonTabs}
          theme={page.comparisonTheme || "light"}
        />
      )}

      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {resolvedFaqTabs.length > 0 && <FaqAccordion tabs={resolvedFaqTabs} />}

      {page.servicesCards?.length > 0 && (
        <ServicesCardsGrid
          heading={page.servicesHeading}
          headingAccent={page.servicesHeadingAccent}
          subheading={page.servicesSubheading}
          theme={page.servicesTheme || "dark"}
          cards={page.servicesCards}
        />
      )}

      <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
    </div>
  )
}
