"use client"

import Link from "next/link"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  TestimonialsGrid,
} from "@/components/sections"
import TeamGridSection, { type TeamMember } from "@/components/TeamGridSection"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import type {
  CaseStudy,
  SiteSettingsData,
  FaqTab,
  ComparisonTab,
} from "@/components/sections/types"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
  teamMembers: TeamMember[]
}

const UK_TABS: ComparisonTab[] = [
  {
    _key: "leadership",
    label: "Top Leadership Challenges",
    items: [
      { _key: "l1", number: "01", title: "Hybrid Working Rights Compliance", description: "Navigate UK Employment Rights Act and hybrid working legislation with strategic technology solutions. Seamlessly integrate remote and office workflows while ensuring compliance with statutory flexible working rights across London, Manchester, Birmingham, and regional UK offices." },
      { _key: "l2", number: "02", title: "Digital Skills Training for UK Teams", description: "Accelerate digital transformation with comprehensive training programmes for UK businesses. Our local experts minimise productivity disruptions while ensuring teams master new technologies, supporting your digital strategy objectives." },
      { _key: "l3", number: "03", title: "Work-Life Balance & Right to Disconnect", description: "Enhance work-life integration through intelligent automation supporting UK workplace wellness regulations. Automate routine administrative tasks, enabling focus on high-value work while maintaining healthy boundaries." },
      { _key: "l4", number: "04", title: "Professional Development & Upskilling", description: "Empower UK teams with process optimisation skills that drive continuous improvement. Support the government's Lifetime Skills Guarantee by enabling staff to identify inefficiencies and implement enhanced systems." },
      { _key: "l5", number: "05", title: "Cross-Regional Team Cohesion", description: "Strengthen collaboration across England, Scotland, Wales, and Northern Ireland through unified communication platforms, maintaining transparency regardless of location." },
    ],
  },
  {
    _key: "features",
    label: "monday.com Features",
    items: [
      { _key: "f1", number: "01", title: "Save Time with Automations", description: "Automated workflows on monday.com function as your dedicated process manager, continuously operating behind the scenes to guarantee that your initiatives progress seamlessly and productively." },
      { _key: "f2", number: "02", title: "Document Management & Data Sovereignty", description: "Create comprehensive business documents with real-time project data integration. Maintain UK data residency requirements and support Companies House filing obligations with organised digital documentation." },
      { _key: "f3", number: "03", title: "Business Intelligence Dashboards", description: "Transform operational data into insights that support strategic decision-making for UK businesses. Present KPIs aligned with UK GAAP accounting standards and regulatory reporting requirements." },
      { _key: "f4", number: "04", title: "Agile Project Organisation", description: "Organise projects using methodologies popular across UK tech hubs including London's Silicon Roundabout, Manchester's digital corridor, and Edinburgh's fintech sector. Customise views according to preferred UK business frameworks." },
      { _key: "f5", number: "05", title: "UK Software Integration", description: "Integrate seamlessly with popular UK business tools including Sage and Xero. Connect with UK accounting software to maintain centralised workflows that support your business operations." },
    ],
  },
  {
    _key: "how-help",
    label: "How We Can Help",
    items: [
      { _key: "h1", number: "01", title: "Process Discovery → Business Process Audit", description: "We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling." },
      { _key: "h2", number: "02", title: "Technical Architecture → System Integration Scope", description: "Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows." },
      { _key: "h3", number: "03", title: "Solution Design → Implementation", description: "Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage." },
      { _key: "h4", number: "04", title: "Efficiency Impact → ROI Opportunity Analysis", description: "By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment." },
      { _key: "h5", number: "05", title: "Change Readiness → Adoption & Training Strategies", description: "Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption." },
    ],
  },
]


const FEATURE_BLOCKS = [
  { title: "Build a high-level roll-up of all your boards", body: "Give directors a general overview of the team's progress with calendars, Gantt charts, and dashboards. So, even if you have 10+ boards, senior management can see what someone is working on, how projects are doing, and why tasks are delayed–all with just a few clicks.", ctaLabel: "📊 Our Project Management Solutions", ctaUrl: "/monday-consulting-solutions/monday-project-management", image: "/images/au-rollup.avif" },
  { title: "Create a CRM or project management tool that fits you", body: "Have a monday.com partner build a system designed to support the way you want your business to run. That means you start with the \"meat and potatoes\" of your platform in place. So later, if you need to adapt to new requirements, you can easily piggyback off of the original set-up.", ctaLabel: "📈 Our CRM Solutions", ctaUrl: "/monday-crm-consulting", image: "/images/au-create-crm.avif" },
  { title: "Training & managed services", body: "Get the entire team monday.com training. Make sure all of your team members get the onboarding they need to feel comfortable using the platform day in and day out. So when you actually start using the platform, it becomes your single source of truth.", ctaLabel: "👩🏽‍💼👨🏻‍💼 Our Training Services", ctaUrl: "/monday-training", image: "/images/au-training.avif" },
  { title: "Integrate your email and all external tools", body: "Eliminate manual work with automation. Seamlessly integrate Gmail, Outlook, Sharepoint, Teams, accounting software, ChatGPT, and dozens of other tools with the software's open API.", ctaLabel: "⚡️ See Our Solutions", ctaUrl: "/monday-consulting-solutions", image: "/images/au-integrate.avif" },
]

const ROI_STATS = [
  { value: "288%", label: "ROI" },
  { value: "15,600", label: "Hours Saved" },
  { value: "50%", label: "Meeting reduction" },
  { value: "489,794", label: "Net Value" },
]

type FeatureBlock = { title?: string; body?: string; ctaLabel?: string; ctaUrl?: string; image?: string }
type RoiStat = { value?: string; label?: string }

function FeatureBlocksSection({ blocks }: { blocks: FeatureBlock[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex flex-col" style={{ gap: 56 }}>
          {blocks.map((b, i) => (
            <div
              key={b.title}
              className="flex flex-col items-center"
              style={{ gap: 40, flexDirection: i % 2 === 0 ? "row" : "row-reverse" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="font-bold" style={{ color: "#10003a", fontSize: 26, lineHeight: "34px", marginBottom: 14 }}>{b.title}</h3>
                <p style={{ color: "#444", fontSize: 15, lineHeight: "24px", whiteSpace: "pre-line" }}>{b.body}</p>
                <Link
                  href={b.ctaUrl || "#"}
                  className="inline-flex items-center font-semibold"
                  style={{ marginTop: 18, color: "#8015e8", fontSize: 14 }}
                >
                  {b.ctaLabel} →
                </Link>
              </div>
              <div
                className="rounded-card overflow-hidden bg-white"
                style={{ flex: 1, aspectRatio: "16 / 10", border: "1px solid #ece7fb", boxShadow: "0 18px 36px -24px rgba(64,12,140,0.2)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image} alt={b.title || ""} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnerSectionCta({ calendlyUrl }: { calendlyUrl: string }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <div className="mx-auto text-center" style={{ maxWidth: 920 }}>
        <h2 className="font-bold" style={{ color: "#10003a", fontSize: 28, lineHeight: "36px", marginBottom: 22 }}>
          Work with a certified <span style={{ color: "#8015e8" }}>monday.com partner</span> today
        </h2>
        <div className="flex flex-wrap justify-center" style={{ gap: 14 }}>
          <Link
            href={calendlyUrl}
            className="inline-flex items-center justify-center font-semibold"
            style={{ height: 50, padding: "0 26px", borderRadius: 999, background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", fontSize: 14 }}
          >
            🚀  Schedule a 30-minute Consultation
          </Link>
          <Link
            href="https://monday.com"
            className="inline-flex items-center justify-center font-semibold"
            style={{ height: 50, padding: "0 26px", borderRadius: 999, border: "1px solid #8015e8", color: "#8015e8", fontSize: 14, background: "white" }}
          >
            ▶️  Get Started with monday.com
          </Link>
        </div>
      </div>
    </section>
  )
}

function CrmTutorialCta({ calendlyUrl }: { calendlyUrl: string }) {
  return (
    <section className="px-4" style={{ paddingTop: 60, paddingBottom: 60, background: "linear-gradient(180deg, #faf6ff 0%, #ebd9ff 100%)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="text-center">
          <h2 className="font-bold" style={{ color: "#10003a", fontSize: 28, lineHeight: "36px", marginBottom: 14 }}>
            Everything You Need to Know to Get Started with <span style={{ color: "#8015e8" }}>monday CRM</span>
          </h2>
          <p style={{ color: "#444", fontSize: 15, lineHeight: "24px", maxWidth: 720, margin: "0 auto" }}>
            Our tutorial walks you through the entire process, from managing leads and pipeline tracking, to sending emails, automations, dashboards, and integrations.
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: 14, marginTop: 22 }}>
            <Link
              href={calendlyUrl}
              className="inline-flex items-center justify-center font-semibold"
              style={{ height: 50, padding: "0 26px", borderRadius: 999, background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", fontSize: 14 }}
            >
              🚀  Book a Consultation
            </Link>
            <Link
              href="https://monday.com"
              className="inline-flex items-center justify-center font-semibold"
              style={{ height: 50, padding: "0 26px", borderRadius: 999, border: "1px solid #8015e8", color: "#8015e8", fontSize: 14, background: "white" }}
            >
              ▶️  Get Started with monday.com
            </Link>
          </div>
        </div>
        <div className="mx-auto rounded-card overflow-hidden" style={{ marginTop: 40, aspectRatio: "16 / 9", maxWidth: 980 }}>
          <YouTubeEmbed videoId="eoOCR6OjJhI" title="Everything you need to know to get started with monday CRM" />
        </div>
      </div>
    </section>
  )
}

function EconomicImpactSection({ stats }: { stats: RoiStat[] }) {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(160deg, #2b074d 0%, #10003a 100%)" }}>
      <div className="mx-auto text-center" style={{ maxWidth: 1100 }}>
        <h2 className="font-bold" style={{ color: "white", fontSize: 30, lineHeight: "38px", maxWidth: 820, margin: "0 auto 12px" }}>
          As <span style={{ color: "#b162fe" }}>monday partners</span>, we help you discover how efficient your team could be
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginBottom: 36 }}>The economic impact of</p>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 20 }}>
          {stats.map((s, i) => (
            <div key={s.label || i}>
              <p className="font-bold" style={{ color: "white", fontSize: 36, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, marginTop: 8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function MondayPartnerUkContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
  teamMembers,
}: Props) {
  if (!page) return null
  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const resolvedFaqTabs = faqTabs ?? []
  const partnerCaseStudies = caseStudies
  const resolvedComparisonTabs: ComparisonTab[] = (page.comparisonTabs && page.comparisonTabs.length > 0) ? page.comparisonTabs : UK_TABS
  const resolvedFeatureBlocks: FeatureBlock[] = (page.featureBlocks && page.featureBlocks.length > 0) ? page.featureBlocks : FEATURE_BLOCKS
  const resolvedRoiStats: RoiStat[] = (page.roiStats && page.roiStats.length > 0) ? page.roiStats : ROI_STATS

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || "monday.com Certified Partner UK"}
        headingAccent=""
        subheading={
          page.hideHeroSubheading
            ? undefined
            : page.heroSubheading ||
              "Partner with certified monday.com Partner consultants to build robust infrastructure and architecture for your business account. Our expert implementation services get your team operational immediately, eliminating the time and resources typically spent on trial-and-error setup."
        }
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel || "🚀  Book a Consultation"}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel || "▶️  Get Started with monday.com"}
        secondaryCtaUrl={page.secondaryCtaUrl || "https://monday.com"}
      />

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3-tab comparison */}
      <ComparisonTabsSection
        heading={page.comparisonHeading || "Streamline Operations & Maximise Efficiency with Our monday.com Consultants"}
        subheading="Our expert consultants empower you to adopt workflow automation & AI systems"
        tabs={resolvedComparisonTabs}
        theme="light"
        withPurpleCircle={false}
      />

      {/* Meet the team — UK region */}
      <TeamGridSection
        heading="Meet the Fruition UK team"
        ctaLabel="Learn More About Us"
        ctaUrl="/fruition-team"
        members={teamMembers}
        region="UK"
      />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Book A 30-Min Consultation with A monday.com Expert"}
        subheading={
          page.calendlySubheading ||
          "Schedule a personalised monday.com demo with our certified monday.com consultants to discover how the platform can be customised for your specific business needs.\n\nExperience the full potential of monday.com with our exclusive 4-week extended free trial, giving you ample time to explore advanced features and see measurable results."
        }
        calendlyUrl={calendlyUrl}
      />

      {/* Customer testimonials carousel */}
      <TestimonialsGrid
        heading="What our customers say about us 🙌"
        ctaLabel="🚀  Start Your Transformation"
        ctaUrl={calendlyUrl}
        statCardValue="500+"
        statCardSubtitle="have maximised their workflows with our monday.com expert support"
        statCardCtaLabel="Read our case studies"
        statCardCtaUrl="/customer-testimonials"
        caseStudies={partnerCaseStudies}
      />

      {/* FAQ */}
      <FaqAccordion heading="Frequently asked questions" tabs={resolvedFaqTabs} />

      {/* Feature blocks */}
      <FeatureBlocksSection blocks={resolvedFeatureBlocks} />

      {/* Work with partner CTA */}
      <PartnerSectionCta calendlyUrl={calendlyUrl} />

      {/* CRM tutorial cta + video */}
      <CrmTutorialCta calendlyUrl={calendlyUrl} />

      {/* Economic impact */}
      <EconomicImpactSection stats={resolvedRoiStats} />
    </div>
  )
}
