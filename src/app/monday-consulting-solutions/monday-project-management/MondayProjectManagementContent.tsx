"use client"

import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  CapabilitiesGrid,
  SolutionCardsSection,
  CaseStudyCardsSection,
  IndustryTabsSection,
  TestimonialsGrid,
  DiscoverCtaSection,
  JoinStatsSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, FaqTab } from "@/components/sections/types"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

const PM_FAQ_TABS: FaqTab[] = [
  {
    _key: "pm",
    label: "Project Management",
    items: [
      {
        _key: "q1",
        question: "Is monday.com used for project management?",
        answer:
          "Yes, monday.com is a project management software that helps teams plan, track, and deliver projects. With tools like Gantt charts, dashboards, automations, and workload tracking, it supports everything from simple task lists to complex project portfolios.",
      },
      {
        _key: "q2",
        question: "Is monday better than Trello for project management?",
        answer:
          "monday.com is often considered better for teams needing advanced features. While Trello is great for simple task management with its Kanban board, monday.com offers Gantt charts, workload tracking, dashboards, automations, and integrations that support complex project planning and project portfolio management. monday.com provides more flexibility, scalability, and reporting, making it the stronger choice for organizations managing multiple projects, resources, and deadlines.",
      },
      {
        _key: "q3",
        question: "Is monday better than Asana for project management?",
        answer:
          "While Asana is strong in task management and team collaboration, monday.com offers advanced features like Gantt charts, workload tracking, dashboards, automations, and robust integrations. monday.com also supports project portfolio management, resource allocation, and real-time reporting, making it a better fit for organizations managing multiple projects and complex workflows.",
      },
      {
        _key: "q4",
        question: "Does monday.com integrate with other tools?",
        answer:
          "Yes. Monday.com integrates with Slack, Microsoft Teams, Gmail, Outlook, Google Drive, Jira, Salesforce, HubSpot, and more—keeping all project data connected.",
      },
      {
        _key: "q5",
        question: "What project management features does monday.com offer?",
        answer:
          "Key features include Gantt charts, Kanban boards, task dependencies, workload management, dashboards, time tracking, and project reporting to ensure on-time and on-budget delivery.",
      },
      {
        _key: "q6",
        question: "Can monday.com handle both small and large projects?",
        answer:
          "Yes. monday.com is scalable for individuals, small teams, and enterprise organizations managing complex project portfolios. It works for everything from simple task lists to advanced project portfolio management.",
      },
      {
        _key: "q7",
        question: "Can monday.com support project portfolio management?",
        answer:
          "Yes. monday.com is built for project portfolio management. Teams can group projects under portfolios, monitor performance, allocate resources, and report progress with dashboards and high-level views.",
      },
    ],
  },
]

export default function MondayProjectManagementContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const comparisonTabs = page.comparisonTabs ?? []
  const capabilitiesColumns =
    page.capabilitiesColumns === 2 || page.capabilitiesColumns === 3
      ? page.capabilitiesColumns
      : undefined

  const featuredTestimonial = caseStudies[0]

  const calendlyHeading =
    "Book Your Personalised Demo With a monday.com Project Management Expert"
  const calendlySubheading =
    "Schedule a demo with our certified monday.com consultants to explore how Monday.com can streamline your project management workflows. Discover custom solutions for planning, tracking, and reporting projects, and receive a 4-week extended trial."

  const resolvedFaqTabs = (faqTabs && faqTabs.length > 0 ? faqTabs : PM_FAQ_TABS)

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
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

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 1. Three-tab comparison section */}
      {comparisonTabs.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={comparisonTabs}
          theme={page.comparisonTheme || "light"}
          layout={page.comparisonLayout === "sideBySide" ? "sideBySide" : "tabs"}
          withPurpleCircle={page.comparisonWithPurpleCircle ?? true}
        />
      )}

      {/* 2. Calendly */}
      <CalendlySection
        heading={calendlyHeading}
        subheading={calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 3. FAQ */}
      <FaqAccordion tabs={resolvedFaqTabs} />

      {/* 4. Case studies */}
      {page.caseStudyCards?.length > 0 && (
        <CaseStudyCardsSection
          heading={page.caseStudySectionHeading}
          cards={page.caseStudyCards}
        />
      )}

      {/* 5. monday.com PM Capabilities */}
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
          ctaSecondaryLabel={page.capabilitiesCtaSecondaryLabel}
          ctaSecondaryUrl={page.capabilitiesCtaSecondaryUrl}
        />
      )}

      {/* 6. Solution cards — "The project management solution for your biggest challenges" */}
      {page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 7. Implement monday.com for any industry */}
      {page.industryTabs?.length > 0 && (
        <IndustryTabsSection
          heading={page.industryHeading}
          tabs={page.industryTabs}
        />
      )}

      {/* Closing sections (testimonials / discover / stats / banner) — security badge omitted */}
      {!page.hideTestimonialsSection && <TestimonialsGrid caseStudies={caseStudies} />}
      {!page.hideDiscoverSection && (
        <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />
      )}
      {!page.hideJoinStatsSection && page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel={page.joinCtaLabel}
          ctaUrl={page.joinCtaUrl || calendlyUrl}
          siteSettings={siteSettings || undefined}
        />
      )}
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
          testimonials={caseStudies}
        />
      )}
    </div>
  )
}
