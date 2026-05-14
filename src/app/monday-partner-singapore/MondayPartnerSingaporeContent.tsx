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

const SG_TABS: ComparisonTab[] = [
  {
    _key: "leadership",
    label: "Top Leadership Challenges",
    items: [
      { _key: "l1", number: "01", title: "Hybrid Work & ASEAN Compliance", description: "Navigate diverse Southeast Asian employment regulations and hybrid work policies across Singapore, Malaysia, Thailand, Indonesia, Philippines, and Vietnam. Seamlessly integrate remote and office workflows while ensuring compliance with local labor laws and data localisation requirements." },
      { _key: "l2", number: "02", title: "Digital Transformation Training for ASEAN Teams", description: "Accelerate digital adoption with comprehensive training programs designed for Southeast Asian businesses. Our regional experts minimise productivity disruptions while ensuring teams master new technologies, while maintaining a competitive advantage in the workplace." },
      { _key: "l3", number: "03", title: "Work-Life Balance & Regional Wellness", description: "Enhance work-life integration through intelligent automation that supports Southeast Asian workplace wellness standards and cultural expectations. Automate routine administrative tasks, enabling focus on high-value strategic work while respecting regional work-life balance traditions." },
      { _key: "l4", number: "04", title: "Professional Development & Skills Enhancement", description: "Empower ASEAN teams with process optimisation skills that drive continuous improvement. Support regional upskilling initiatives by enabling employees to identify operational inefficiencies and implement enhanced systems that boost productivity across diverse cultural contexts." },
      { _key: "l5", number: "05", title: "Multi-Country Team Coordination", description: "Strengthen collaboration across ASEAN time zones and diverse cultural backgrounds from Singapore to Manila to Bangkok. Maintain transparency and foster strong connections regardless of location, supporting seamless operations across Southeast Asian markets." },
    ],
  },
  {
    _key: "features",
    label: "monday.com Features",
    items: [
      { _key: "f1", number: "01", title: "Save Time with Automations", description: "Automated workflows on monday.com function as your dedicated process manager, continuously operating behind the scenes to guarantee that your initiatives progress seamlessly and productively." },
      { _key: "f2", number: "02", title: "Centralised Documentation", description: "You can create rich documents directly within monday and embed real-time project information from any of your boards within those docs." },
      { _key: "f3", number: "03", title: "Business Intelligence for ASEAN Markets", description: "Transform operational data into actionable insights for Southeast Asian businesses. Present KPIs aligned with local accounting standards (Singapore FRS, Malaysian MFRS, Thai TFRS) and regional reporting requirements." },
      { _key: "f4", number: "04", title: "Agile Project Organisation", description: "Organise projects using methodologies popular across ASEAN innovation hubs including Singapore's fintech sector, Kuala Lumpur's digital economy, Bangkok's startup ecosystem, and Jakarta's e-commerce corridor." },
      { _key: "f5", number: "05", title: "Integrate with Other Tools", description: "Consolidate all your information within monday to boost team synchronisation and enhance organisational efficiency. Eliminate switching between isolated applications and ensure nothing gets overlooked." },
    ],
  },
  {
    _key: "how-help",
    label: "How We Can Help",
    items: [
      { _key: "h1", number: "01", title: "Process Discovery → Business Process Audit", description: "Our SEA-based certified consultants meticulously map existing workflows against Southeast Asian industry benchmarks. Analyse operational bottlenecks specific to ASEAN regulatory requirements and competitive pressures in Asia-Pacific markets." },
      { _key: "h2", number: "02", title: "Technical Architecture → System Integration Scope", description: "Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows." },
      { _key: "h3", number: "03", title: "Solution Design → Implementation", description: "Implement balanced automation systems optimised for Southeast Asian business practices and multicultural user adoption. Our solutions scale with your team's expertise while respecting diverse regional workplace cultures and communication styles." },
      { _key: "h4", number: "04", title: "Efficiency Impact → ROI Opportunity Analysis", description: "By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment." },
      { _key: "h5", number: "05", title: "Change Readiness → Adoption & Training Strategies", description: "Our proven framework measures organisational readiness within diverse ASEAN workplace cultures. Craft adoption strategies that work across different cultural contexts, transforming resistance into enthusiastic system adoption while respecting local business practices." },
    ],
  },
]

const SG_FAQ_TABS: FaqTab[] = [
  {
    _key: "professional",
    label: "Professional Services",
    items: [
      { _key: "p1", question: "Does monday com have a CRM?", answer: "Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes." },
      { _key: "p2", question: "Does monday com have task management?", answer: "Yes, monday.com has task management. Take a trial of monday work management and discover just how efficiently you can manage your teams' to-do list." },
      { _key: "p3", question: "Why is monday.com so successful?", answer: "Highly customizable, easy adoption, visual + agile + scalable. monday.com can be used to manage anything you want." },
      { _key: "p4", question: "What exactly does monday.com do?", answer: "monday.com is the most versatile project management software on the market. Manage projects, CRM, ad campaigns, bug tracking, video production, and more." },
    ],
  },
  { _key: "wm", label: "monday Work Management", items: [
    { _key: "wm1", question: "What is monday Work Management?", answer: "monday Work Management is the flexible Work OS that helps teams plan, run, and track projects in one shared workspace." },
  ] },
  { _key: "crm", label: "monday CRM", items: [
    { _key: "crm1", question: "How does monday CRM compare to other CRMs?", answer: "monday CRM is fully customisable, visual, and integrates with the rest of the monday Work OS — ideal for teams that want CRM + delivery in one place." },
  ] },
  { _key: "expert", label: "Expert Consultant Guide", items: [
    { _key: "ec1", question: "What does a monday.com consultant do?", answer: "A certified monday.com consultant scopes business processes, designs an automated solution, implements it, trains your team, and provides ongoing support." },
  ] },
  { _key: "general", label: "General Questions", items: [
    { _key: "g1", question: "Where is Fruition based?", answer: "Australia, Canada, Singapore, United States, and United Kingdom." },
  ] },
]

const PARTNER_CASE_STUDIES_FALLBACK: CaseStudy[] = [
  { _id: "p1", clientName: "Jade Wood", clientRole: "Managing Director", clientCompany: "Popology", quote: "We are now utilising monday.com to its full potential, from lead through design and production teams - everyone knows what stage our projects are in, what's next and what our process is." },
  { _id: "p2", clientName: "Mairhead McKinley", clientRole: "Delivery Manager", clientCompany: "Givergy", quote: "We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information—eliminating the need to email around for updates." },
  { _id: "p3", clientName: "Brandon-Lee Horridge", clientRole: "Managing Director", clientCompany: "BL Air Conditioning", quote: "This system will save hundreds of thousands of dollars a year guaranteed." },
  { _id: "p4", clientName: "Ron Amaram", clientRole: "General Manager", clientCompany: "Risk 2 Solutions", quote: "Fruition have been instrumental in moving us to a 'single source of truth' system for managing sales and projects." },
  { _id: "p5", clientName: "Lorenzo Tejada-Orrell", clientRole: "Chief Innovation Officer", clientCompany: "CLSQ", quote: "Since implementing monday.com, CLSQ has experienced a significant transformation in operational efficiency." },
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

function FeatureBlocksSection() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex flex-col" style={{ gap: 56 }}>
          {FEATURE_BLOCKS.map((b, i) => (
            <div
              key={b.title}
              className="flex flex-col items-center"
              style={{ gap: 40, flexDirection: i % 2 === 0 ? "row" : "row-reverse" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="font-bold" style={{ color: "#10003a", fontSize: 26, lineHeight: "34px", marginBottom: 14 }}>{b.title}</h3>
                <p style={{ color: "#444", fontSize: 15, lineHeight: "24px", whiteSpace: "pre-line" }}>{b.body}</p>
                <Link
                  href={b.ctaUrl}
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
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
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
          <div className="flex justify-center" style={{ marginTop: 22 }}>
            <Link
              href={calendlyUrl}
              className="inline-flex items-center justify-center font-semibold"
              style={{ height: 50, padding: "0 26px", borderRadius: 999, background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", fontSize: 14 }}
            >
              🚀 Book a Time
            </Link>
          </div>
        </div>
        <div className="mx-auto rounded-card overflow-hidden" style={{ marginTop: 32, aspectRatio: "16 / 9", maxWidth: 980 }}>
          <YouTubeEmbed videoId="eoOCR6OjJhI" title="Everything you need to know to get started with monday CRM" />
        </div>
      </div>
    </section>
  )
}

function EconomicImpactSection() {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(160deg, #2b074d 0%, #10003a 100%)" }}>
      <div className="mx-auto text-center" style={{ maxWidth: 1100 }}>
        <h2 className="font-bold" style={{ color: "white", fontSize: 30, lineHeight: "38px", maxWidth: 820, margin: "0 auto 12px" }}>
          As <span style={{ color: "#b162fe" }}>monday partners</span>, we help you discover how efficient your team could be
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginBottom: 36 }}>The economic impact of</p>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 20 }}>
          {ROI_STATS.map((s) => (
            <div key={s.label}>
              <p className="font-bold" style={{ color: "white", fontSize: 36, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, marginTop: 8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function MondayPartnerSingaporeContent({
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

  const resolvedFaqTabs = (faqTabs && faqTabs.length > 0) ? faqTabs : SG_FAQ_TABS
  const partnerCaseStudies = caseStudies.length > 0 ? caseStudies : PARTNER_CASE_STUDIES_FALLBACK

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || "monday.com Partner Singapore"}
        headingAccent=""
        subheading={
          page.hideHeroSubheading
            ? undefined
            : page.heroSubheading ||
              "Work with an accredited monday.com consultant to develop the essential systems and operational blueprint for your business. Based in Singapore, our monday.com specialists serve companies across Southeast Asia including Singapore, the Philippines, Thailand, Malaysia, Indonesia, and Vietnam. Begin working productively right away–without dedicating valuable time and effort to self-guided configuration."
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
        heading={page.comparisonHeading || "Streamline Operations & Maximise Efficiency with a monday.com Expert"}
        subheading={
          page.comparisonSubheading ||
          "We transform fragmented business processes into cohesive, automated systems that enhance team collaboration and deliver measurable ROI across your entire organisation."
        }
        tabs={SG_TABS}
        theme="light"
        withPurpleCircle={false}
      />

      {/* Meet the team — SG region */}
      <TeamGridSection
        heading="Meet the Fruition Singapore team"
        ctaLabel="Learn More About Us"
        ctaUrl="/fruition-team"
        members={teamMembers}
        region="SG"
      />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule a 30 minute Call With One of Our monday.com Consultants Today"}
        subheading={
          page.calendlySubheading ||
          "From initial process discovery to full system adoption, our proven methodology ensures seamless digital transformation that empowers your team and drives sustainable operational efficiency."
        }
        calendlyUrl={calendlyUrl}
      />

      {/* Customer testimonials */}
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
      <FeatureBlocksSection />

      {/* Work with partner CTA */}
      <PartnerSectionCta calendlyUrl={calendlyUrl} />

      {/* CRM tutorial + video */}
      <CrmTutorialCta calendlyUrl={calendlyUrl} />

      {/* Economic impact */}
      <EconomicImpactSection />
    </div>
  )
}
