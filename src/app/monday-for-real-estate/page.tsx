import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  SolutionCardsSection,
  TestimonialCtaBanner,
  JoinStatsSection,
  TextContentSection,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import CtaButton from "@/components/CtaButton"

const HERO_IMAGE_SRC = "/real-estate-hero.png"

const RE_TABS = [
  {
    _key: "re-tab-0",
    label: "Why monday.com for Manufacturing?",
    items: [
      {
        _key: "re0-1",
        number: "01",
        title: "Process Management",
        description:
          "📅 Production Planning: Streamline manufacturing logistics with efficient scheduling and management tools\n✅ Quality Control: Implement robust quality assurance workflows that ensure consistent product excellence\n📦 Inventory Management: Track stock levels precisely and automate replenishment to prevent stockouts",
      },
      {
        _key: "re0-2",
        number: "02",
        title: "Resource Optimisation",
        description:
          "🗂️ Resource Allocation: Maximise efficiency with smart resource distribution across production lines\n🔄 Supplier Coordination: Manage vendor relationships and track material deliveries and procurement seamlessly\n✏️ Health & Safety: Maintain compliance with built-in OHS regulation tracking features",
      },
      {
        _key: "re0-3",
        number: "03",
        title: "Technology Integration",
        description:
          "✅ System Integration: Connect smoothly with your existing ERP and MES software ecosystem\n📋 Automation Capabilities: Reduce manual tasks through intelligent process automation\n📁 Custom Analytics: Generate insightful reports with manufacturing-specific metrics",
      },
      {
        _key: "re0-4",
        number: "04",
        title: "Team Collaboration",
        description:
          "⚖️ Intuitive Interface: Enable quick team adoption through monday.com's user-friendly design\n🔧 Real-time Communication: Keep all stakeholders and vendors connected and informed throughout production cycles\n📍 Visual Dashboards: Monitor key performance indicators through customizable visual displays",
      },
    ],
  },
  {
    _key: "re-tab-1",
    label: "Key Management Features",
    items: [
      {
        _key: "re1-1",
        number: "01",
        title: "Production Management",
        description:
          "📅 Visual production scheduling with drag-and-drop timeline views\n🔄 Real-time work order tracking and status updates\n⚡ Automated workflow triggers for production milestones\n👩🏽‍💼 Capacity planning with resource availability dashboards",
      },
      {
        _key: "re1-2",
        number: "02",
        title: "Quality & Compliance",
        description:
          "✅ Digital quality inspection checklists and approval workflows\n📋 Non-conformance tracking with corrective action assignments\n🦺 Safety incident reporting and compliance documentation\n📈 Quality metrics tracking with trend analysis",
      },
      {
        _key: "re1-3",
        number: "03",
        title: "Inventory & Supply Chain",
        description:
          "📦 Real-time inventory levels with automated reorder alerts\n🚚 Supplier delivery tracking and performance monitoring\n🔍 Material traceability throughout the production process\n💰 Purchase order management with approval workflows",
      },
      {
        _key: "re1-4",
        number: "04",
        title: "Analytics & Reporting",
        description:
          "📊 Manufacturing KPI dashboards with real-time data\n🗂️ Production efficiency reports and bottleneck identification\n🎯 OEE tracking with downtime analysis capabilities\n📱 Mobile-friendly reports for shop floor managers",
      },
    ],
  },
  {
    _key: "re-tab-2",
    label: "How We Can Help",
    items: [
      {
        _key: "re2-1",
        number: "01",
        title: "Needs Assessment",
        description:
          "Assess your real estate needs and goals to understand what you want to achieve with a CRM system. By clearly understanding your requirements, we can align monday.com's features with your specific needs.",
      },
      {
        _key: "re2-2",
        number: "02",
        title: "Thorough Research",
        description:
          "Conduct comprehensive research to compare different CRM systems, including monday.com. Consider factors like pricing, features, and integrations, ensuring that monday.com is the ideal fit for your real estate needs.",
      },
      {
        _key: "re2-3",
        number: "03",
        title: "Seamless Configuration",
        description:
          "Once monday.com is selected, configure the system to match your unique requirements. Set up custom workflows, automations, and permissions to ensure monday.com aligns perfectly with your real estate processes.",
      },
      {
        _key: "re2-4",
        number: "04",
        title: "Smooth Data Migration",
        description:
          "If you have existing customer data, your valuable data must be accurately transferred, ensuring a seamless continuity of your real estate activities.",
      },
      {
        _key: "re2-5",
        number: "05",
        title: "Expert Training",
        description:
          "It is important to provide training to your team, equipping them with the knowledge and skills they need to use monday.com effectively.",
      },
      {
        _key: "re2-6",
        number: "06",
        title: "System Rollout",
        description:
          "Once configured and trained, it's time to roll out monday.com to your team.",
      },
      {
        _key: "re2-7",
        number: "07",
        title: "Ongoing Monitoring and Evaluation",
        description:
          "Remember to continuously monitor its performance and evaluate its effectiveness in meeting your real estate goals.",
      },
    ],
  },
]

const RE_STATS_BOTTOM = [
  { _key: "stat-bot-0", value: "10+", label: "Years Experience" },
  { _key: "stat-bot-1", value: "1050+", label: "Projects Completed" },
  { _key: "stat-bot-2", value: "290", label: "Satisfied Clients" },
]

const ADDITIONAL_TIPS_BODY = `At Fruition Services, we have a tailored approach to help you implement monday.com as your purpose-built CRM for real estate.

**Additional Tips for Successful CRM Implementation:**

**Stakeholder Engagement:** Getting buy-in from all stakeholders, including your team members, is essential before starting the implementation process. This ensures that everyone is on board and committed to the project's success.

**Start Small, Scale Up:** If you're new to CRM, we recommend starting with a smaller scope and gradually expanding the implementation. This approach prevents overwhelming your team and allows for better management of the implementation process.

**Consultant Support:** If you require additional guidance or expertise, consider getting help from a consultant. They bring their experience and knowledge to help you navigate the implementation process effectively and avoid common pitfalls.`

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-real-estate")
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getIndustryPageBySlug("monday-for-real-estate"),
    getSiteSettings(),
    getCaseStudies(),
  ])

  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"

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
        heroImageUrl={HERO_IMAGE_SRC}
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

      {/* 3. Three-tab section */}
      <ComparisonTabsSection
        heading="Local monday.com consultants for Real Estate in Australia, United States, and United Kingdom"
        tabs={RE_TABS}
        theme="light"
        layout="tabs"
        withPurpleCircle={false}
      />

      {/* 4. Real Estate Case Studies — video + Ray White stats + quote + CTA */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
          <h2
            className="text-section-h2 text-center"
            style={{ color: "#000", marginBottom: 40 }}
          >
            Real Estate Case Studies
          </h2>
          <div
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{ gap: 40, alignItems: "center" }}
          >
            <div className="w-full rounded-card overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
              <YouTubeEmbed
                url="https://www.youtube.com/watch?v=TX4kk4OlQfY"
                title="Ray White customer story"
              />
            </div>
            <div className="flex flex-col" style={{ gap: 20 }}>
              <div className="grid grid-cols-2" style={{ gap: 24 }}>
                <div>
                  <div style={{ fontSize: 40, fontWeight: 800, color: "#8015e8", lineHeight: 1.1 }}>
                    1,250-3,000
                  </div>
                  <div style={{ fontSize: 14, color: "#4a4a4a", marginTop: 6 }}>
                    automations and integrations
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 40, fontWeight: 800, color: "#8015e8", lineHeight: 1.1 }}>
                    70%
                  </div>
                  <div style={{ fontSize: 14, color: "#4a4a4a", marginTop: 6 }}>
                    increase in efficiency
                  </div>
                </div>
              </div>
              <blockquote
                style={{
                  fontSize: 18,
                  lineHeight: "28px",
                  color: "#111",
                  fontStyle: "italic",
                  borderLeft: "3px solid #8015e8",
                  paddingLeft: 16,
                }}
              >
                "We were able to customise the CRM on top of the monday.com Work OS to fit the needs of our day-to-day activities."
              </blockquote>
              <div style={{ fontSize: 14, color: "#4a4a4a" }}>
                Kyle Dorman | Department Manager – Operations, Ray White
              </div>
              <div style={{ marginTop: 8 }}>
                <CtaButton href={calendlyUrl} label="🚀 Book a Consultation" variant="primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Solution Cards — left/right */}
      {page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 6. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 7. Why the best use monday.com — 9 capability cards (real estate) */}
      {page.capabilitiesCards?.length > 0 && (
        <section style={{ backgroundColor: "#f7f5ff", paddingTop: 80, paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
            <h2
              className="text-section-h2 text-center"
              style={{ color: "#000000", marginBottom: 48 }}
            >
              Why the best use monday.com to manage their Real Estate operations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
              {page.capabilitiesCards.map((card: { _key?: string; emoji?: string; title?: string; description?: string }) => (
                <div
                  key={card._key}
                  className="bg-white rounded-card border border-[#e8e6e6]"
                  style={{ padding: 28 }}
                >
                  <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 12 }}>{card.emoji}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 8 }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: "22px", color: "#4a4a4a" }}>
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Join 500+ CTA */}
      <TestimonialCtaBanner
        headingPart1="Join "
        headingAccent="500+ organisations"
        headingPart2=" that have maximised their workflows with our monday.com expert support"
        primaryCtaLabel="🚀 Start Your Transformation"
        primaryCtaUrl={calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
        testimonial={featuredTestimonial}
        testimonials={caseStudies}
      />

      {/* 9. Text section — Additional tips */}
      <TextContentSection body={ADDITIONAL_TIPS_BODY} theme="light" />

      {/* 10. Stats — Years / Projects / Clients */}
      <JoinStatsSection
        headingPart1=""
        headingAccent=""
        headingPart2=""
        stats={RE_STATS_BOTTOM}
        siteSettings={siteSettings || undefined}
      />
    </div>
  )
}
