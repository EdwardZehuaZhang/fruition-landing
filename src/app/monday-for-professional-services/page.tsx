import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CapabilitiesGrid,
  CalendlySection,
  FaqAccordion,
  SolutionCardsSection,
  TestimonialCtaBanner,
  ServicesWorkflowTabs,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import type { ServicesWorkflowTab } from "@/components/sections/ServicesWorkflowTabs"

const WORKFLOW_TABS: ServicesWorkflowTab[] = [
  {
    key: "crm",
    label: "CRM Sales Process",
    heading: "CRM Sales Process for Professional Services Businesses",
    description:
      "Transform your agency's pipeline into a revenue-generating engine with monday.com's CRM. Track leads, opportunities, and client relationships in one intuitive platform. Customisable workflows match your unique sales process, while automation eliminates manual data entry, giving your team more time to build valuable client relationships.",
    benefits: [
      { emoji: "📊", label: "Visual pipeline management" },
      { emoji: "📋", label: "Custom deal stages" },
      { emoji: "📧", label: "Email integration" },
      { emoji: "🤝", label: "Client relationship tracking" },
      { emoji: "⚡", label: "Automated lead scoring" },
      { emoji: "📈", label: "Sales forecasting" },
      { emoji: "🎯", label: "Performance analytics" },
    ],
  },
  {
    key: "quoting",
    label: "Quoting & Ticketing",
    heading: "Quoting & Ticketing",
    description:
      "Speed up your quote-to-cash cycle with automated quoting and ticketing. Generate professional proposals instantly while managing client requests efficiently. monday.com ensures consistent response times and seamless communication tracking, helping you win more business and maintain strong client relationships.",
    benefits: [
      { emoji: "🤖", label: "Quote automation" },
      { emoji: "⏱️", label: "SLA tracking" },
      { emoji: "⬆️", label: "Request prioritization" },
      { emoji: "🔐", label: "Client portal access" },
      { emoji: "📚", label: "Template library" },
      { emoji: "📧", label: "Email integration" },
      { emoji: "💬", label: "Communication history" },
    ],
  },
  {
    key: "finance",
    label: "Finance Workflows",
    heading: "Finance Workflows",
    description:
      "Streamline your agency's financial operations with end-to-end automation. From contract generation to payment tracking, monday.com transforms complex financial processes into smooth, error-free workflows. Connect with your accounting tools for complete financial visibility and control.",
    benefits: [
      { emoji: "📝", label: "Contract automation" },
      { emoji: "💳", label: "Payment tracking" },
      { emoji: "💼", label: "Budget management" },
      { emoji: "📈", label: "Profitability analysis" },
      { emoji: "🧾", label: "Invoice generation" },
      { emoji: "📊", label: "Finance reporting" },
      { emoji: "🧮", label: "Expense tracking" },
    ],
  },
  {
    key: "project",
    label: "Project Management",
    heading: "Project Management",
    description:
      "Deliver exceptional client projects on time and within budget. monday.com's visual project management tools give you complete control over timelines, resources, and deliverables. Keep clients informed while ensuring your team stays focused on high-priority tasks.",
    benefits: [
      { emoji: "📅", label: "Timeline visualisation" },
      { emoji: "🔗", label: "Task dependencies" },
      { emoji: "📊", label: "Project tracking" },
      { emoji: "🤝", label: "Collaboration tools" },
      { emoji: "⚖️", label: "Resource allocation" },
      { emoji: "🏁", label: "Client milestones" },
      { emoji: "📁", label: "File sharing" },
    ],
  },
  {
    key: "time",
    label: "Time & Resources",
    heading: "Time & Resources",
    description:
      "Optimise your team's productivity with intelligent resource management. Track billable hours, monitor utilisation rates, and ensure optimal resource distribution across client projects. Real-time insights help you maximise profitability while preventing burnout.",
    benefits: [
      { emoji: "⏱️", label: "Time tracking" },
      { emoji: "📊", label: "Capacity management" },
      { emoji: "📌", label: "Project allocation" },
      { emoji: "⚖️", label: "Workload balance" },
      { emoji: "📋", label: "Resource planning" },
      { emoji: "📈", label: "Utilisation reports" },
      { emoji: "🎯", label: "Skills matching" },
    ],
  },
  {
    key: "analytics",
    label: "Analytics & Reports",
    heading: "Analytics & Reports",
    description:
      "Make data-driven decisions with powerful analytics and reporting tools. Create custom dashboards to track KPIs, monitor service delivery metrics, and generate professional client reports. Get real-time insights into business performance and client satisfaction.",
    benefits: [
      { emoji: "📊", label: "Custom dashboards" },
      { emoji: "📋", label: "Client reporting" },
      { emoji: "📈", label: "Revenue analytics" },
      { emoji: "💹", label: "ROI measurement" },
      { emoji: "⚡", label: "Real-time metrics" },
      { emoji: "🎯", label: "Performance tracking" },
      { emoji: "🔍", label: "Trend analysis" },
    ],
  },
]

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-professional-services")
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getIndustryPageBySlug("monday-for-professional-services"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-professional-services"),
  ])

  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"

  const faqTabs = groupFaqsIntoTabs(centralFaqs)
  const effectiveFaqTabs = faqTabs.length > 0 ? faqTabs : page.faqTabs || []

  const featuredTestimonial =
    caseStudies?.find(
      (c: { clientCompany?: string; clientName?: string }) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies?.[0]

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        headingPart1={page.heroHeading || page.title || ""}
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
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

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || ""}
        headingAccent={page.logoCloudHeadingAccent ?? ""}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Capabilities — "Run your services business on one platform" */}
      {page.capabilitiesCards?.length > 0 && (
        <CapabilitiesGrid
          heading={page.capabilitiesHeading}
          subheading={page.capabilitiesSubheading}
          theme="light"
          columns={3}
          cards={page.capabilitiesCards}
        />
      )}

      {/* 4. NEW — Six-tab services workflow section */}
      <ServicesWorkflowTabs
        heading="Capabilities for every services workflow"
        tabs={WORKFLOW_TABS}
      />

      {/* 5. Existing comparison tabs (Sanity) */}
      {page.comparisonTabs?.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={page.comparisonTabs}
          theme={page.comparisonTheme || "light"}
          layout="tabs"
        />
      )}

      {/* 6. Solution Cards */}
      {page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 7. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 8. FAQ */}
      {effectiveFaqTabs.length > 0 && <FaqAccordion tabs={effectiveFaqTabs} />}

      {/* 9. Bottom YouTube video */}
      {page.bottomVideoUrl && (
        <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1042 }}>
            <div
              className="rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9" }}
            >
              <YouTubeEmbed
                url={page.bottomVideoUrl}
                title={page.bottomVideoTitle || "monday.com for Professional Services"}
              />
            </div>
          </div>
        </section>
      )}

      {/* 10. Join 500+ banner (replaces removed "What our customers say" grid) */}
      <TestimonialCtaBanner
        headingPart1={page.joinHeadingPart1 || "Join "}
        headingAccent={page.joinHeadingAccent || "500+ organisations"}
        headingPart2={
          page.joinHeadingPart2 ||
          " that have maximised their workflows with our monday.com expert support"
        }
        primaryCtaLabel="🚀 Start Your Transformation"
        primaryCtaUrl={calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
        testimonial={featuredTestimonial}
        testimonials={caseStudies}
      />
    </div>
  )
}
