"use client"

import Link from "next/link"
import { Rocket, Play, Check } from "lucide-react"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  TestimonialsGrid,
  CroSections,
  StickyCtaBar,
} from "@/components/sections"
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
}

// Content scraped from
// https://www.fruitionservices.io/partnerships/monday-consulting-partner

const LEADERSHIP_CHALLENGES: ComparisonTab = {
  _key: "leadership",
  label: "Top Leadership Challenges",
  items: [
    {
      _key: "lc1",
      number: "01",
      title: "Market volatility and uncertainty",
      description:
        "Demand real-time project visibility and reporting capabilities that enable quick pivots in strategy and resource allocation, helping organisations make data-driven decisions to maintain competitive advantage and adapt to changing conditions.",
    },
    {
      _key: "lc2",
      number: "02",
      title: "AI and automation in project management",
      description:
        "Requires careful implementation to boost team efficiency while managing change resistance, focusing on streamlined workflows, automated routine tasks, and AI-powered insights for better decision making.",
    },
    {
      _key: "lc3",
      number: "03",
      title: "Hybrid work models challenge project leaders",
      description:
        "To balance in-office and remote team dynamics, requiring robust digital collaboration tools, clear communication protocols, and standardised processes to maintain productivity across distributed teams.",
    },
    {
      _key: "lc4",
      number: "04",
      title: "Talent retention in project management",
      description:
        "Hinges on creating engaging work environments with clear growth paths, balanced workloads, and opportunities for skill development, while ensuring knowledge transfer and team cohesion amid turnover.",
    },
    {
      _key: "lc5",
      number: "05",
      title: "Cybersecurity and digital risk management",
      description:
        "Must be integrated into project workflows through secure access controls, compliant data handling, and protected collaboration tools, without compromising team efficiency or communication effectiveness.",
    },
  ],
}

const TEAM_CHALLENGES: ComparisonTab = {
  _key: "team",
  label: "Top Team Challenges",
  items: [
    {
      _key: "tc1",
      number: "01",
      title: "Hybrid Collaboration",
      description: "Adopting the right tools to maintain effective teamwork, communication, and workload capacity.",
    },
    {
      _key: "tc2",
      number: "02",
      title: "Digital Adaptation",
      description: "Get expert training support to rapidly learn new tools and technologies while maintaining productivity.",
    },
    {
      _key: "tc3",
      number: "03",
      title: "Work-Life Integration",
      description: "Giving team members time back with an automated system that cuts out manual work.",
    },
    {
      _key: "tc4",
      number: "04",
      title: "Personal Development",
      description: "Develop team members to learn how to optimise processes with better systems.",
    },
    {
      _key: "tc5",
      number: "05",
      title: "Team Cohesion",
      description: "Unify the team with communication and work management systems.",
    },
  ],
}

const HOW_WE_HELP: ComparisonTab = {
  _key: "how",
  label: "How We Can Help",
  items: [
    {
      _key: "hh1",
      number: "01",
      title: "Process Discovery → Business Process Audit",
      description:
        "We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.",
    },
    {
      _key: "hh2",
      number: "02",
      title: "Technical Architecture → System Integration Scope",
      description:
        "Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.",
    },
    {
      _key: "hh3",
      number: "03",
      title: "Solution Design → Implementation",
      description:
        "Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.",
    },
    {
      _key: "hh4",
      number: "04",
      title: "Efficiency Impact → ROI Opportunity Analysis",
      description:
        "By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.",
    },
    {
      _key: "hh5",
      number: "05",
      title: "Change Readiness → Adoption & Training Strategies",
      description:
        "Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.",
    },
  ],
}

type WhyFruitionItem = string
type TestimonialItem = { name: string; role: string; quote: string; photo?: string }
type ImplementationServiceItem = { emoji: string; title: string; body: string }
type IconLabelItem = { emoji: string; label: string }
type FruitionAdvantageItem = string

function CertifiedExcellenceSection({ calendlyUrl }: { calendlyUrl: string }) {
  return (
    <section
      className="px-4"
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        background: "linear-gradient(160deg, #2b074d 0%, #10003a 100%)",
      }}
    >
      <div className="mx-auto text-center" style={{ maxWidth: 920 }}>
        <h2 className="font-bold" style={{ color: "white", fontSize: 36, lineHeight: "44px", marginBottom: 16 }}>
          Certified monday.com Partners Delivering Global Excellence
        </h2>
        <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 16, lineHeight: "26px", marginBottom: 32 }}>
          Transform your business operations with Fruition. As trusted monday.com Partners, our certified consultants help organisations worldwide harness the full power of monday.com.
        </p>
        <div className="flex flex-wrap justify-center" style={{ gap: 16 }}>
          <Link
            href={calendlyUrl}
            className="inline-flex items-center justify-center gap-2 font-semibold"
            style={{ height: 50, padding: "0 26px", borderRadius: 999, background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", fontSize: 15 }}
          >
            <Rocket size={16} aria-hidden /> Book a Consultation
          </Link>
          <Link
            href="https://monday.com"
            className="inline-flex items-center justify-center gap-2 font-semibold"
            style={{ height: 50, padding: "0 26px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.6)", color: "white", fontSize: 15 }}
          >
            <Play size={16} aria-hidden /> Get Started with monday.com
          </Link>
        </div>
      </div>
    </section>
  )
}

function WhyFruitionSection({ items }: { items: WhyFruitionItem[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 32, lineHeight: "40px", marginBottom: 32 }}>
          Why Choose Fruition for <span style={{ color: "#8015e8" }}>monday.com?</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ gap: 16 }}>
          {items.map((reason: WhyFruitionItem, i: number) => (
            <div
              key={reason || i}
              className="flex items-center bg-white rounded-card"
              style={{ gap: 12, padding: 20, border: "1px solid #ece7fb" }}
            >
              <Check size={22} color="#8015e8" aria-hidden />
              <p className="font-semibold" style={{ color: "#10003a", fontSize: 14 }}>{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ImplementationServicesSection({ items }: { items: ImplementationServiceItem[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 64 }}>
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 30, lineHeight: "40px", marginBottom: 32 }}>
          Our monday.com Expert <span style={{ color: "#8015e8" }}>Implementation Services</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {items.map((s: ImplementationServiceItem, i: number) => (
            <div
              key={s.title || i}
              className="bg-white"
              style={{
                padding: 24,
                borderRadius: 16,
                border: "1px solid #ece7fb",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "0 8px 24px -20px rgba(64,12,140,0.18)",
              }}
            >
              <span style={{ fontSize: 28 }}>{s.emoji}</span>
              <p className="font-bold" style={{ color: "#10003a", fontSize: 16 }}>{s.title}</p>
              <p style={{ color: "#56516a", fontSize: 13, lineHeight: "20px" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Combined section: CRM eyebrow + Industry & Global 2-col + Fruition Advantage banner */
function PartnerWrapUpSection({
  calendlyUrl,
  industrySolutions,
  countries,
  fruitionAdvantages,
}: {
  calendlyUrl: string
  industrySolutions: IconLabelItem[]
  countries: IconLabelItem[]
  fruitionAdvantages: FruitionAdvantageItem[]
}) {
  return (
    <section
      className="px-4"
      style={{ paddingTop: 64, paddingBottom: 96, background: "linear-gradient(180deg, #faf6ff 0%, #ebd9ff 100%)" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        {/* CRM Expertise eyebrow header */}
        <div className="flex flex-col items-center text-center" style={{ marginBottom: 40 }}>
          <h2 className="font-bold" style={{ color: "#10003a", fontSize: 34, lineHeight: "44px", marginBottom: 12 }}>
            <span style={{ color: "#8015e8" }}>monday CRM</span> Consulting Expertise
          </h2>
          <p style={{ color: "#4a4a4a", fontSize: 15, lineHeight: "24px", maxWidth: 640 }}>
            Streamline your customer relationships with custom CRM implementations tailored to your business needs.
          </p>
        </div>

        {/* Industry Solutions + Global Reach side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20, marginBottom: 36 }}>
          {/* Industry Solutions card */}
          <div
            className="bg-white"
            style={{
              borderRadius: 18,
              padding: 24,
              border: "1px solid rgba(128,21,232,0.08)",
              boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)",
            }}
          >
            <p className="font-bold" style={{ color: "#8015e8", fontSize: 16, marginBottom: 14 }}>
              Industry Solutions
            </p>
            <ul className="flex flex-col" style={{ gap: 10 }}>
              {industrySolutions.map((s: IconLabelItem, i: number) => (
                <li key={s.label || i} className="flex items-center" style={{ gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{s.emoji}</span>
                  <span style={{ color: "#10003a", fontSize: 13 }}>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Reach card */}
          <div
            className="bg-white"
            style={{
              borderRadius: 18,
              padding: 24,
              border: "1px solid rgba(128,21,232,0.08)",
              boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)",
            }}
          >
            <p className="font-bold" style={{ color: "#8015e8", fontSize: 16, marginBottom: 4 }}>
              Global Reach, Local Expertise
            </p>
            <p style={{ color: "#666", fontSize: 12, marginBottom: 14 }}>Serving clients across:</p>
            <ul className="flex flex-col" style={{ gap: 10 }}>
              {countries.map((c: IconLabelItem, i: number) => (
                <li key={c.label || i} className="flex items-center" style={{ gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{c.emoji}</span>
                  <span style={{ color: "#10003a", fontSize: 13 }}>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fruition Advantage purple banner */}
        <div
          className="overflow-hidden relative"
          style={{
            borderRadius: 20,
            padding: 28,
            background: "linear-gradient(135deg, #2b074d 0%, #6a18c7 60%, #8015e8 100%)",
            boxShadow: "0 24px 40px -28px rgba(64,12,140,0.5)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 28 }}>
            <div>
              <p className="font-bold" style={{ color: "white", fontSize: 18, marginBottom: 14 }}>The Fruition Advantage</p>
              <ul className="flex flex-col" style={{ gap: 10 }}>
                {fruitionAdvantages.map((adv: FruitionAdvantageItem, i: number) => (
                  <li key={adv || i} className="flex items-start" style={{ gap: 10, color: "rgba(255,255,255,0.92)" }}>
                    <span
                      style={{
                        flexShrink: 0,
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.18)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 13, lineHeight: "20px" }}>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start md:items-end justify-between" style={{ gap: 20 }}>
              <p style={{ color: "white", fontSize: 14, lineHeight: "22px", textAlign: "right", maxWidth: 280 }}>
                Learn about how monday.com is the right fit for you
              </p>
              <Link
                href={calendlyUrl}
                className="inline-flex items-center justify-center gap-2 font-semibold"
                style={{
                  height: 46,
                  padding: "0 22px",
                  borderRadius: 999,
                  background: "white",
                  color: "#8015e8",
                  fontSize: 14,
                }}
              >
                <Rocket size={16} aria-hidden /> Schedule a Meeting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function MondayConsultingPartnerContent({ page, siteSettings, caseStudies = [], faqTabs }: Props) {
  if (!page) return null
  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const partnerTabs: ComparisonTab[] = [LEADERSHIP_CHALLENGES, TEAM_CHALLENGES, HOW_WE_HELP]
  const resolvedFaqTabs = faqTabs ?? []

  // Sanity-driven content (populated via scripts/sanity-migrate/monday-consulting-partner.ts).
  const resolvedWhyFruition: WhyFruitionItem[] = page.whyFruition ?? []
  const resolvedPartnerTestimonials: TestimonialItem[] = page.partnerTestimonials ?? []
  const resolvedImplementationServices: ImplementationServiceItem[] = page.implementationServices ?? []
  const resolvedIndustrySolutions: IconLabelItem[] = page.industrySolutions ?? []
  const resolvedCountries: IconLabelItem[] = page.countries ?? []
  const resolvedFruitionAdvantages: FruitionAdvantageItem[] = page.fruitionAdvantages ?? []

  // Build CaseStudy[] from resolved partner testimonials; fall back to Sanity
  // caseStudies when none are present.
  const partnerCaseStudies: CaseStudy[] = resolvedPartnerTestimonials.length > 0
    ? resolvedPartnerTestimonials.map((t: TestimonialItem, i: number) => ({
        _id: `partner-${i}`,
        clientName: t.name,
        clientRole: t.role.split(",")[0]?.trim() ?? t.role,
        clientCompany: t.role.split(",").slice(1).join(",").trim() || undefined,
        quote: t.quote,
      }))
    : caseStudies

  return (
    <div>
      <StickyCtaBar label={page.croSections?.stickyCtaLabel} href={page.croSections?.stickyCtaUrl || calendlyUrl} />
      {/* 1. Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow || "monday.com Expert Consultants"}
        headingPart1={page.heroHeading || "Top monday.com Expert Consultants"}
        headingAccent=""
        subheading={
          page.hideHeroSubheading
            ? undefined
            : page.heroSubheading || "Platinum monday.com Partner in Australia, UK and US"
        }
        heroImage={page.heroImage}
        heroImageUrl="/images/partner-hero.avif"
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel || "Book a Consultation"}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel || "Get Started with monday.com"}
        secondaryCtaUrl={page.secondaryCtaUrl || "https://monday.com"}
      />

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. 3-tab section */}
      <ComparisonTabsSection
        heading="Streamline Operations & Maximise Efficiency with Our monday.com Consultants"
        subheading="We streamline disconnected business processes into integrated, automated workflows that boost team collaboration and drive measurable ROI across your organization. Our expert consultants empower you to adopt workflow automation & AI systems."
        tabs={partnerTabs}
        theme="light"
        withPurpleCircle={false}
      />

      {/* 4. Certified Excellence dark banner */}
      <CertifiedExcellenceSection calendlyUrl={calendlyUrl} />

      {/* 5. Why Choose Fruition */}
      <WhyFruitionSection items={resolvedWhyFruition} />

      {/* 5b. CRO action items */}
      <CroSections
        data={page.croSections}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
      />

      {/* 6. FAQ */}
      <FaqAccordion heading="Frequently asked questions" tabs={resolvedFaqTabs} />

      {/* 6b. Video below FAQ */}
      <section className="bg-white px-4" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div className="mx-auto" style={{ maxWidth: 980 }}>
          <div className="rounded-card overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
            <YouTubeEmbed videoId="_0MhMjicbIM" title="monday.com consulting partner overview" />
          </div>
        </div>
      </section>

      {/* 7. Testimonials — use shared TestimonialsGrid */}
      <TestimonialsGrid
        heading="What our customers say about us"
        ctaLabel="Start Your Transformation"
        ctaUrl={calendlyUrl}
        statCardValue="500+"
        statCardSubtitle="have maximised their workflows with our monday.com expert support"
        statCardCtaLabel="Read our case studies"
        statCardCtaUrl="/customer-testimonials"
        caseStudies={partnerCaseStudies}
      />

      {/* 8. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule Your Personalised Demo With monday.com Expert Consultant"}
        subheading={
          page.calendlySubheading ||
          "Schedule a demo with our monday.com consultants to discover how monday.com can be customised for your business, and get a free 4-week extended trial to experience its full potential."
        }
        calendlyUrl={calendlyUrl}
      />

      {/* 9. Implementation Services (2×2) */}
      <ImplementationServicesSection items={resolvedImplementationServices} />

      {/* 10. Combined: CRM expertise + Industry/Global cards + Fruition Advantage banner */}
      <PartnerWrapUpSection
        calendlyUrl={calendlyUrl}
        industrySolutions={resolvedIndustrySolutions}
        countries={resolvedCountries}
        fruitionAdvantages={resolvedFruitionAdvantages}
      />
    </div>
  )
}
