"use client"

import { useState } from "react"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  TestimonialsGrid,
} from "@/components/sections"
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
}

/* ----------------- Data ----------------- */

const COMPARISON_TABS: ComparisonTab[] = [
  {
    _key: "why-construction",
    label: "Why monday.com for Construction?",
    items: [
      { _key: "w1", number: "01", title: "Pre-construction CRM & Estimating", description: "Streamline lead management, contact tracking, and tender bids in one centralised platform. Our monday.com consultants help you build efficient pre-construction workflows that increase win rates and improve project planning." },
      { _key: "w2", number: "02", title: "Advanced Project Management", description: "Take control of your construction projects with powerful scheduling tools, resource allocation, and progress tracking. monday.com's construction and subcontract management features ensure projects stay on track and within budget." },
      { _key: "w3", number: "03", title: "Mobile-First Construction Management", description: "Keep your on-site teams connected with real-time access to project details, documents, and checklists through the monday.com mobile app. Enable seamless collaboration between office and field teams." },
    ],
  },
  {
    _key: "features",
    label: "Construction Management Features",
    items: [
      { _key: "f1", number: "01", title: "Finance Control & Integration", description: "🔗 Seamless integration with popular accounting software\n📊 Real-time budget tracking and cost management\n⚡ Automated invoice processing and payment tracking\n📈 Custom financial reporting dashboards" },
      { _key: "f2", number: "02", title: "Document & Drawing Management", description: "🗂️ Centralised storage for all construction documents\n🔄 Version control for drawings and specifications\n✏️ Collaborative annotation tools\n📱 Mobile access to all project files" },
      { _key: "f3", number: "03", title: "Safety & Compliance", description: "✅ Digital safety inspection checklists\n📋 Incident reporting and tracking\n📁 Compliance documentation management\n👷🏼 Automated safety report generation" },
      { _key: "f4", number: "04", title: "Resource & Equipment Management", description: "⚖️ Optimise resource allocation across projects\n🔧 Track equipment maintenance schedules\n📍 Monitor asset utilization and location\n🤝 Manage subcontractor relationships effectively" },
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

const CONSTRUCTION_FAQ_TABS: FaqTab[] = [
  {
    _key: "construction",
    label: "Construction",
    items: [
      { _key: "c1", question: "Can Monday com be used for construction projects?", answer: "Absolutely! No matter the size of your build or project, construction project management requires a lot of coordination, usually best handled with construction project management software like monday.com — which can serve you on-the-go with a simple to use but sophisticated mobile app." },
      { _key: "c2", question: "Does Monday com have project templates?", answer: "Yes. There are a number of monday.com project templates for construction project management in the Template Center. They allow you to:\n\nKeep your construction projects on track and manage budget, timelines, ownership, and view project progress.\nStay on top of your teammates' workloads and deliverables, and keep all stakeholders, and clients in the loop to make sure that each construction project and task is scheduled and completed on time.\nUnderstand your project scope better.\nDocument and determine your different project goals, deliverables, and tasks." },
    ],
  },
  { _key: "professional", label: "Professional Services", items: [
    { _key: "p1", question: "Does monday com have a CRM?", answer: "Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes." },
  ] },
  { _key: "wm", label: "monday Work Management", items: [
    { _key: "wm1", question: "What is monday Work Management?", answer: "monday Work Management is the flexible Work OS that helps teams plan, run, and track projects in one shared workspace." },
  ] },
  { _key: "general", label: "General Questions", items: [
    { _key: "g1", question: "Where is Fruition based?", answer: "Australia, Canada, Singapore, United States, and United Kingdom." },
  ] },
]

const LIFECYCLE_STAGES = [
  { n: "01", title: "Bidding & Pre-Construction 🎯", body: "Centralise bid documents and RFPs in collaborative workspaces. Track deadlines, assign team members to proposals, and maintain databases of past bids with automated notifications." },
  { n: "02", title: "Planning & Design 📋", body: "Transform schedules into visual timelines with dependencies and critical path tracking. Coordinate stakeholders with shared boards that automatically update on design changes and milestone achievements." },
  { n: "03", title: "Execution & Construction 🏗️", body: "Monitor progress, track labor hours, and manage deliveries through mobile dashboards. Field teams update tasks and upload photos while managers maintain oversight through automated progress and budget reports." },
  { n: "04", title: "Handover & Closeout 📁", body: "Organise punch lists, warranties, and inspections in structured workflows. Track outstanding items and coordinate final walkthroughs with automated reminders for efficient project closeout." },
  { n: "05", title: "Post-Construction Support 🔧", body: "Maintain client relationships with warranty tracking and maintenance scheduling. Historical project data improves future estimates and business processes." },
]

const CONSTRUCTION_TESTIMONIALS = [
  {
    title: "HOLT CAT Case Study",
    quote: "monday.com has given us the visibility we need to get everyone on the same page and keep track of all the moving parts.",
    name: "Jason Doan",
    role: "VP of Heavy Rental & Sales, HOLT CAT",
    image: "https://static.wixstatic.com/media/a280a5_b5814c3ff80d4a0abe055653e3d85006~mv2.png/v1/fill/w_720,h_557,al_c,lg_1,q_90,enc_avif,quality_auto/a280a5_b5814c3ff80d4a0abe055653e3d85006~mv2.png",
  },
  {
    title: "Falkbuilt Case Study",
    quote: "The monday.com mobile app gives our technicians on raw construction sites instant access to the project information they need and makes connecting with the team at HQ easy.",
    name: "Allie Swindlehurst",
    role: "Operations Manager, Falkbuilt",
    image: "https://static.wixstatic.com/media/a280a5_255d68b57fbb41e887966dff78f71019~mv2.png/v1/fill/w_720,h_282,al_c,lg_1,q_85,enc_avif,quality_auto/a280a5_255d68b57fbb41e887966dff78f71019~mv2.png",
  },
]

const PARTNER_CASE_STUDIES_FALLBACK: CaseStudy[] = [
  { _id: "p1", clientName: "Jade Wood", clientRole: "Managing Director", clientCompany: "Popology", quote: "We are now utilising monday.com to its full potential, from lead through design and production teams - everyone knows what stage our projects are in, what's next and what our process is." },
  { _id: "p2", clientName: "Mairhead McKinley", clientRole: "Delivery Manager", clientCompany: "Givergy", quote: "We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information—eliminating the need to email around for updates." },
  { _id: "p3", clientName: "Brandon-Lee Horridge", clientRole: "Managing Director", clientCompany: "BL Air Conditioning", quote: "This system will save hundreds of thousands of dollars a year guaranteed." },
  { _id: "p4", clientName: "Ron Amaram", clientRole: "General Manager", clientCompany: "Risk 2 Solutions", quote: "Fruition have been instrumental in moving us to a 'single source of truth' system for managing sales and projects." },
  { _id: "p5", clientName: "Lorenzo Tejada-Orrell", clientRole: "Chief Innovation Officer", clientCompany: "CLSQ", quote: "Since implementing monday.com, CLSQ has experienced a significant transformation in operational efficiency." },
]

/* ----------------- Sections ----------------- */

function ConstructionIntroStrip() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div className="mx-auto text-center" style={{ maxWidth: 920 }}>
        <p style={{ color: "#444", fontSize: 16, lineHeight: "26px" }}>
          With monday.com <span className="font-bold" style={{ color: "#8015e8" }}>CRM</span> and{" "}
          <span className="font-bold" style={{ color: "#8015e8" }}>Work Management</span> as your Construction software, your teams will experience simplified and streamlined communication with mobile access and improved automated workflow efficiency.
        </p>
      </div>
    </section>
  )
}

function ConstructionLeadersHeader() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 60, paddingBottom: 0 }}>
      <div className="mx-auto text-center" style={{ maxWidth: 920 }}>
        <h2 className="font-bold" style={{ color: "#10003a", fontSize: 32, lineHeight: "42px", marginBottom: 0 }}>
          Why Construction Leaders Choose <span style={{ color: "#8015e8" }}>monday.com</span>
        </h2>
      </div>
    </section>
  )
}

function KeyFeaturesHeader() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 60, paddingBottom: 0 }}>
      <div className="mx-auto text-center" style={{ maxWidth: 920 }}>
        <h2 className="font-bold" style={{ color: "#10003a", fontSize: 32, lineHeight: "42px" }}>
          Key Construction Management <span style={{ color: "#8015e8" }}>Features</span>
        </h2>
      </div>
    </section>
  )
}

function LifecycleSection() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 32, lineHeight: "42px", marginBottom: 40 }}>
          Support Each Stage of Your Project Life Cycle with a <span style={{ color: "#8015e8" }}>monday.com Expert</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 28 }}>
          {LIFECYCLE_STAGES.map((s) => (
            <div key={s.n} className="flex flex-col" style={{ gap: 10, padding: 24, borderRadius: 16, border: "1px solid #ece7fb", background: "white", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)" }}>
              <p style={{ color: "#8015e8", fontSize: 36, fontWeight: 300, lineHeight: 1 }}>{s.n}</p>
              <p className="font-bold" style={{ color: "#10003a", fontSize: 18 }}>{s.title}</p>
              <p style={{ color: "#444", fontSize: 14, lineHeight: "22px" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ConstructionTestimonialsSection() {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(180deg, #faf6ff 0%, #ebd9ff 100%)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 32, lineHeight: "42px", marginBottom: 40 }}>
          Construction <span style={{ color: "#8015e8" }}>Testimonials</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          {CONSTRUCTION_TESTIMONIALS.map((t) => (
            <figure key={t.title} className="bg-white overflow-hidden flex flex-col" style={{ borderRadius: 20, border: "1px solid rgba(128,21,232,0.08)", boxShadow: "0 18px 36px -24px rgba(64,12,140,0.22)" }}>
              <div style={{ aspectRatio: "16 / 10", overflow: "hidden", background: "#f5f0ff" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
              </div>
              <div style={{ padding: 28 }}>
                <p className="font-bold" style={{ color: "#8015e8", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>{t.title}</p>
                <blockquote style={{ color: "#222", fontSize: 15, lineHeight: "24px" }}>“{t.quote}”</blockquote>
                <figcaption style={{ marginTop: 18 }}>
                  <p className="font-bold" style={{ color: "#10003a", fontSize: 14 }}>{t.name}</p>
                  <p style={{ color: "#666", fontSize: 12 }}>{t.role}</p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Custom split tabs: first 3 tabs use "Why Construction Leaders Choose" header; second tab swaps to "Key Construction Management Features" header. */
function ConstructionTabs() {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = COMPARISON_TABS[activeIdx]
  const heading =
    activeIdx === 0
      ? "Why Construction Leaders Choose monday.com"
      : activeIdx === 1
        ? "Key Construction Management Features"
        : "Our expert consultants empower you to adopt workflow automation & AI systems"

  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginBottom: 32 }}>
          {COMPARISON_TABS.map((tab, i) => (
            <button
              key={tab._key}
              onClick={() => setActiveIdx(i)}
              style={{
                padding: "10px 26px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                ...(i === activeIdx
                  ? { background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", border: "none", boxShadow: "0 10px 22px -12px rgba(128,21,232,0.55)" }
                  : { background: "white", color: "#2b074d", border: "1px solid #e8e6e6" }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Heading swaps with active tab */}
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 30, lineHeight: "40px", marginBottom: 32 }}>
          {heading}
        </h2>
        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {active.items?.map((it) => (
            <div key={it._key} className="bg-white" style={{ padding: 24, borderRadius: 18, border: "1px solid rgba(128,21,232,0.08)", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="flex items-center" style={{ gap: 14 }}>
                <span className="flex items-center justify-center font-bold" style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)", color: "white", fontSize: 13 }}>
                  {it.number}
                </span>
                <p className="font-bold" style={{ color: "#10003a", fontSize: 15, lineHeight: "22px" }}>{it.title}</p>
              </div>
              <p style={{ color: "#444", fontSize: 13, lineHeight: "20px", whiteSpace: "pre-line" }}>{it.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------- Page ----------------- */

export default function MondayForConstructionContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null
  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const resolvedFaqTabs = (faqTabs && faqTabs.length > 0) ? faqTabs : CONSTRUCTION_FAQ_TABS
  const partnerCaseStudies = caseStudies.length > 0 ? caseStudies : PARTNER_CASE_STUDIES_FALLBACK
  // Reference helpers so unused-var lint doesn't fire when we expose more granular
  // headers via separate small components.
  void ConstructionLeadersHeader
  void KeyFeaturesHeader

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || "monday.com Construction Implementation Partner"}
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
        primaryCtaLabel={page.primaryCtaLabel || "🚀  Book a Consultation"}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel || "▶️  Get Started with monday.com"}
        secondaryCtaUrl={page.secondaryCtaUrl || "https://monday.com"}
      />

      {/* Intro strip */}
      <ConstructionIntroStrip />

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Tab section — heading rotates with active tab */}
      <ConstructionTabs />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule a 30-minute call with one of our monday.com consultants today"}
        subheading={
          page.calendlySubheading ||
          "From initial process discovery to full system adoption for your monday.com construction solution, our proven methodology ensures seamless digital transformation that empowers your team and drives sustainable operational efficiency."
        }
        calendlyUrl={calendlyUrl}
      />

      {/* FAQ */}
      <FaqAccordion heading="Frequently asked questions" tabs={resolvedFaqTabs} />

      {/* Project Life Cycle stages */}
      <LifecycleSection />

      {/* Construction-specific testimonials */}
      <ConstructionTestimonialsSection />

      {/* General customers say testimonials */}
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
    </div>
  )
}
