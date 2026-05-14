"use client"

import Link from "next/link"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
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

const ATLASSIAN_TABS: ComparisonTab[] = [
  {
    _key: "services",
    label: "Atlassian Services",
    items: [
      {
        _key: "s1",
        number: "01",
        title: "#1 in ROVO",
        description:
          "As former Atlassian team members, we're on the edge of what customers are doing & we'll help build out ROVO Atlassian AI agents that save you time and have a clear ROI. Get in touch to explore how Rovo brings AI-driven simplicity to your workflows—creating virtual agents for service management, chat support for Jira issues, and automating search across Confluence and Jira.",
      },
      {
        _key: "s2",
        number: "02",
        title: "Service Management",
        description:
          "Transform customer and employee support and elevate your service with intelligent service management solutions. Return on your investment of 277% and eliminate disconnects between development and operations. Jira Service Management offers seamless integration on a unified platform.",
      },
      {
        _key: "s3",
        number: "03",
        title: "Cloud Migration",
        description:
          "Future-proof your Atlassian investment with secure and optimised expert cloud migration services. Our certified partnership delivers seamless Monday Atlassian integration, Jira Monday connector solutions, and comprehensive API integration with workflow automation for optimised tool connectivity.",
      },
    ],
  },
  {
    _key: "why-senzo",
    label: "Why Partner with Senzo",
    items: [
      {
        _key: "w1",
        number: "01",
        title: "Direct Atlassian Expertise",
        description: "Our close ties with Atlassian give you direct access to experts for insider advice and best practices.",
      },
      {
        _key: "w2",
        number: "02",
        title: "Optimised Licensing for Savings",
        description: "Leverage our sales expertise to reduce costs and maximise efficiency.",
      },
      {
        _key: "w3",
        number: "03",
        title: "Driving Value Year-Round",
        description: "We solve business challenges proactively, not just at renewal time.",
      },
      {
        _key: "w4",
        number: "04",
        title: "Proudly Australian Owned",
        description: "A refreshing change to an old-school way of working — that's our promise.",
      },
    ],
  },
]

const ATLASSIAN_FAQ_TABS: FaqTab[] = [
  {
    _key: "atlassian",
    label: "Atlassian FAQs",
    items: [
      { _key: "f1", question: "What is Atlassian used for?", answer: "Atlassian Cloud is a suite of cloud-based software and collaboration tools. It includes a range of products designed to help teams and organizations with software development, project management, and team collaboration tasks." },
      { _key: "f2", question: "What does the company Atlassian do?", answer: "Atlassian Corporation is an Australian-American proprietary software company that specializes in collaboration tools designed primarily for software development and project management." },
      { _key: "f3", question: "What is Atlassian best known for?", answer: "Atlassian's most popular products include Jira, Confluence, Trello, and Bitbucket. Jira is a project management tool, Confluence is a collaboration and knowledge base platform, Trello is a visual project management tool, and Bitbucket is a code hosting and collaboration platform." },
      { _key: "f4", question: "Who uses Atlassian?", answer: "Atlassian products are used by a wide variety of teams and organizations across many industries. Notable companies using Atlassian include Citigroup, eBay, Netflix, NASA, Coca-Cola, and United Airlines. In fact, 80% of Fortune 500 companies are Atlassian customers." },
    ],
  },
]

const PROVEN_STATS = [
  { emoji: "📈", value: "20%", body: "ticket deflection with Jira Service Management" },
  { emoji: "🔗", value: "358%", body: "return on investment for companies using Atlassian Cloud" },
  { emoji: "🕙", value: "3-4 hrs", body: "saved per employee per day when customers replace intranets with Confluence AI" },
]

const SERVICE_CARDS = [
  { emoji: "🗺️", title: "Process Discovery & Strategic Planning", body: "Map existing processes against industry benchmarks, define automation goals, analyse operational bottlenecks, and identify high-ROI automation opportunities that remove scaling barriers.", bullets: ["Comprehensive process audit", "Automation opportunity assessment", "ROI projections and timelines", "Custom integration planning"] },
  { emoji: "👥", title: "Tailored Training", body: "Transfer complete technical knowledge, deliver comprehensive documentation, and conduct hands-on team workshops. We develop tailored adoption strategies that transform potential resistance into enthusiastic system adoption.", bullets: ["Personalised training sessions", "Day-to-day Atlassian usage walkthrough"] },
  { emoji: "⚡", title: "Custom Configuration", body: "Develop sophisticated workflows with automated testing and validation. We configure Atlassian products and services to support your team, your processes and your systems.", bullets: ["User-centered design methodology", "Comprehensive testing protocols", "Performance optimisation"] },
  { emoji: "🕙", title: "Production Deployment & Monitoring", body: "Deploy enterprise-ready automations with comprehensive dashboards, intelligent alerts, and insightful performance metrics. We quantify efficiency gains and pinpoint exactly where automations can deliver the highest ROI.", bullets: ["Real-time performance dashboards", "Proactive alert systems", "Detailed analytics and reporting", "Cost tracking and optimization"] },
  { emoji: "☁️", title: "Cloud Migration", body: "Take the guesswork out of your migration with recommendations, resources, and tools for every stage of the process, and ensure a smooth migration to the cloud.", bullets: [] },
  { emoji: "📈", title: "Continuous Improvement", body: "Benefit from our ad hoc support to ensure best practices. Refine workflows based on KPIs, implement performance enhancements, and add new automation use cases as your business evolves.", bullets: [] },
]

const EXPERT_CARDS = [
  { title: "Pick the right tools", body: "With our deep experience inside Atlassian, we'll guide you to the tools that fit your needs. You'll even get the chance to chat with the Atlassian Product team directly, ensuring your decisions are solid.", image: "/images/atlassian-pick-tools.avif" },
  { title: "Implement with ease", body: "Our experts lead the way, turning ideas into action with seamless implementation. Instead of bottlenecking knowledge, we use a \"train the trainer\" model to build centres of excellence within your teams—so expertise stays with you.", image: "/images/atlassian-implement.avif" },
  { title: "Boost Adoption and Team Engagement", body: "We stick with you, offering proactive online training (leveraging free Atlassian University resources) and personalised support for your admins and power users. Need help with the details? We've got you covered.", image: "/images/atlassian-adoption.gif" },
]

/* ----------------- Sections ----------------- */

function ProvenResultsSection() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 40 }}>
          Proven <span style={{ color: "#8015e8" }}>Atlassian Cloud</span> Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {PROVEN_STATS.map((s) => (
            <div key={s.value} className="text-center" style={{ padding: 32, borderRadius: 18, background: "linear-gradient(180deg, #f6efff 0%, #ebd9ff 100%)", border: "1px solid rgba(128,21,232,0.10)", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <span className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 999, background: "white", fontSize: 26, boxShadow: "0 4px 14px -8px rgba(64,12,140,0.25)" }}>{s.emoji}</span>
              <p className="font-bold" style={{ color: "#8015e8", fontSize: 32, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: "#444", fontSize: 13, lineHeight: "20px", maxWidth: 240 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComprehensiveServicesSection() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 40 }}>
          Our Comprehensive <span style={{ color: "#8015e8" }}>Atlassian</span> Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
          {SERVICE_CARDS.map((c) => (
            <div key={c.title} className="bg-white" style={{ padding: 24, borderRadius: 16, border: "1px solid #ece7fb", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{c.emoji}</span>
              <p className="font-bold" style={{ color: "#10003a", fontSize: 16 }}>{c.title}</p>
              <p style={{ color: "#444", fontSize: 13, lineHeight: "20px" }}>{c.body}</p>
              {c.bullets.length > 0 && (
                <ul className="flex flex-col" style={{ gap: 6, marginTop: 4 }}>
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-start" style={{ gap: 8, color: "#444", fontSize: 12, lineHeight: "18px" }}>
                      <span style={{ color: "#8015e8" }}>✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AtlassianExpertsSection({ calendlyUrl }: { calendlyUrl: string }) {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(180deg, #faf6ff 0%, #ebd9ff 100%)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex flex-col items-center text-center" style={{ marginBottom: 56 }}>
          <h2 className="font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 22 }}>
            Your <span style={{ color: "#8015e8" }}>Atlassian</span> Experts
          </h2>
          <Link
            href={calendlyUrl}
            className="inline-flex items-center justify-center font-semibold"
            style={{ height: 50, padding: "0 26px", borderRadius: 999, background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", fontSize: 15, boxShadow: "0 14px 28px -12px rgba(128,21,232,0.55)" }}
          >
            🚀 Book a Meeting
          </Link>
        </div>

        <div className="flex flex-col" style={{ gap: 60 }}>
          {EXPERT_CARDS.map((c, i) => (
            <div
              key={c.title}
              className="flex flex-col items-center"
              style={{ gap: 40, flexDirection: i % 2 === 0 ? "row" : "row-reverse" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="font-bold" style={{ color: "#10003a", fontSize: 26, lineHeight: "34px", marginBottom: 14 }}>
                  {c.title}
                </p>
                <p style={{ color: "#444", fontSize: 15, lineHeight: "25px" }}>{c.body}</p>
              </div>
              <div
                className="rounded-card overflow-hidden bg-white"
                style={{ flex: 1, aspectRatio: "16 / 10", border: "1px solid rgba(128,21,232,0.10)", boxShadow: "0 18px 36px -24px rgba(64,12,140,0.2)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------- Page ----------------- */

export default function CertifiedAtlassianPartnerContent({ page, siteSettings, faqTabs }: Props) {
  if (!page) return null
  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const resolvedFaqTabs = (faqTabs && faqTabs.length > 0) ? faqTabs : ATLASSIAN_FAQ_TABS

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || "Atlassian Certified Partner"}
        headingAccent=""
        subheading={
          page.hideHeroSubheading
            ? undefined
            : page.heroSubheading ||
              "Transform Your Business with Seamless Atlassian Integration Solutions. Automate enterprise workflows and implement powerful API integrations with our certified Atlassian partner solutions in collaboration with Senzo. We help organisations maximise Atlassian to drive agility, efficiency, and digital transformation with our ready-to-go solutions."
        }
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel || "🚀 Book a Meeting"}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel || "📑 See Our Process"}
        secondaryCtaUrl={page.secondaryCtaUrl || "#atlassian-process"}
      />

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients we've worked with: "}
        headingAccent={page.logoCloudHeadingAccent ?? ""}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Tab section */}
      <ComparisonTabsSection
        heading={page.comparisonHeading || "Accelerate Your Enterprise & Maximise Efficiency with Atlassian"}
        subheading={
          page.comparisonSubheading ||
          "We modernise your business with intelligent Atlassian solutions, streamlined services, and expert migration that deliver measurable ROI across your entire organization."
        }
        tabs={ATLASSIAN_TABS}
        theme="light"
        withPurpleCircle={false}
      />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule a Personalised Consult"}
        subheading={
          page.calendlySubheading ||
          "Book a time with our product specialists to see how an Atlassian solution can be tailored to your specific business needs."
        }
        calendlyUrl={calendlyUrl}
      />

      {/* FAQ */}
      <FaqAccordion heading="Frequently asked questions" tabs={resolvedFaqTabs} />

      {/* Proven Atlassian Cloud Results */}
      <ProvenResultsSection />

      {/* Our Comprehensive Atlassian Services */}
      <div id="atlassian-process" />
      <ComprehensiveServicesSection />

      {/* Your Atlassian Experts */}
      <AtlassianExpertsSection calendlyUrl={calendlyUrl} />
    </div>
  )
}
