"use client"

import Link from "next/link"
import {
  HeroBanner,
  LogoCloudMarquee,
  CapabilitiesGrid,
  ComparisonTabsSection,
  CalendlySection,
  SolutionCardsSection,
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

// Hardcoded content scraped from
// https://www.fruitionservices.io/monday-consulting-solutions/solar-crm-solution

const KEY_FEATURES: Array<{ title: string; body: string }> = [
  {
    title: "Sales Acceleration",
    body: "Streamlined CPQ process with real-time inventory visibility and automated proposal generation",
  },
  {
    title: "Operational Efficiency",
    body: "Automated project board creation from accepted proposals with standardised installation workflows",
  },
  {
    title: "Resource Optimisation",
    body: "Integrated inventory management with supplier connections and automated reordering",
  },
  {
    title: "Portfolio Management",
    body: "Real-time visibility across all projects with performance tracking and resource allocation tools",
  },
  {
    title: "Customer Lifecycle",
    body: "Complete customer journey management from lead acquisition through installation and scheduled maintenance",
  },
]

const SERVICES = [
  "Solution design and implementation",
  "Workflow customisation and template configuration",
  "Integration with third-party applications",
  "User training and adoption support",
]

const SOLAR_TESTIMONIALS = [
  {
    quote:
      "We are now utilising monday.com to its full potential, from lead through design and production teams - everyone knows what stage our projects are in, what's next and what our process is.",
    name: "Jade Wood",
    role: "Managing Director",
    company: "Popology",
    photo: "/images/solar-testimonial-popology.avif",
  },
  {
    quote:
      "We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information—eliminating the need to email around for updates.",
    name: "Mairhead McKinley",
    role: "Delivery Manager",
    company: "Givergy",
    photo: "/images/solar-testimonial-givergy.avif",
  },
  {
    quote:
      "Process automation across campaign management, budget management and project approvals has saved significant amounts of time for staff globally and also improved collaboration across global teams.",
    name: "Emily Hill",
    role: "International Markets Manager, Tourism Northern Territory",
    company: "Tourism Northern Territory",
    photo: "/images/solar-testimonial-tnt.avif",
  },
]

const BEFORE_AFTER_TABS: ComparisonTab[] = [
  {
    _key: "before",
    label: "Before",
    items: [
      { _key: "b1", number: "❌", title: "No inventory visibility", description: "Sales team creates quotes with no visibility into inventory" },
      { _key: "b2", number: "❌", title: "Manual re-entry", description: "Info manually re-entered between sales and operations" },
      { _key: "b3", number: "❌", title: "Siloed project data", description: "Project data siloed within departments" },
      { _key: "b4", number: "❌", title: "Limited visibility", description: "Limited visibility into project status for management" },
    ],
  },
  {
    _key: "after",
    label: "After",
    items: [
      { _key: "a1", number: "✅", title: "Unified flow", description: "Unified flow from lead through installation and maintenance" },
      { _key: "a2", number: "✅", title: "Real-time visibility", description: "Real-time visibility across all project phases" },
      { _key: "a3", number: "✅", title: "Standardised templates", description: "Standardised templates ensuring consistent quality" },
      { _key: "a4", number: "✅", title: "Centralised data", description: "Centralised data for strategic decision-making" },
      { _key: "a5", number: "✅", title: "Automated handoffs", description: "Automated handoffs between teams" },
    ],
  },
]

const FINAL_STATS: Array<{ value: string; label: string }> = [
  { value: "50% reduction", label: "in repetitive admin tasks" },
  { value: "60% quicker", label: "quote-to-cash" },
  { value: "30% increase", label: "in on-time delivery" },
  { value: "20% reduction", label: "in carrying costs" },
]

/* -------- Key Features + Services -------- */
type SolarTestimonial = { quote?: string; name?: string; role?: string; company?: string; photo?: string }

function KeyFeaturesSection({ services }: { services: string[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2" style={{ maxWidth: 1100, gap: 48 }}>
        <div>
          <h2 className="font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 24 }}>
            Key <span style={{ color: "#8015e8" }}>Features</span>
          </h2>
          <ul className="flex flex-col" style={{ gap: 14 }}>
            {KEY_FEATURES.map((f) => (
              <li key={f.title} className="flex items-start" style={{ gap: 10 }}>
                <span style={{ color: "#8015e8", fontSize: 16, lineHeight: "24px", flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 15, lineHeight: "24px", color: "#222" }}>
                  <span className="font-bold">{f.title}:</span> {f.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 24 }}>
            Our <span style={{ color: "#8015e8" }}>Services</span>
          </h2>
          <ul className="flex flex-col" style={{ gap: 14 }}>
            {services.map((s, i) => (
              <li key={s || i} className="flex items-start" style={{ gap: 10 }}>
                <span style={{ color: "#8015e8", fontSize: 16, lineHeight: "24px", flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 15, lineHeight: "24px", color: "#222" }}>{s}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* -------- Stats banner with rotating testimonials -------- */
function ReturnsBannerSection({ calendlyUrl, testimonials }: { calendlyUrl: string; testimonials: SolarTestimonial[] }) {
  return (
    <section
      className="px-4 relative overflow-hidden"
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        background: "linear-gradient(160deg, #2b074d 0%, #10003a 100%)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2
          className="text-center font-bold"
          style={{ color: "white", fontSize: 44, lineHeight: "52px", marginBottom: 12 }}
        >
          We bring real returns on investment.
        </h2>
        <p className="text-center" style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginBottom: 48 }}>
          Join 300+ organisations that have implemented with us.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {testimonials.map((t, i) => (
            <figure
              key={t.name || i}
              className="bg-white"
              style={{ borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
            >
              <blockquote style={{ fontSize: 14, lineHeight: "22px", color: "#222" }}>
                “{t.quote}”
              </blockquote>
              <figcaption className="flex items-center" style={{ marginTop: "auto", gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.photo}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                  style={{ width: 56, height: 56, flexShrink: 0 }}
                />
                <div>
                  <p className="font-bold" style={{ color: "#10003a", fontSize: 14 }}>{t.name}</p>
                  <p style={{ color: "#666", fontSize: 12 }}>{t.role}</p>
                  <p style={{ color: "#8015e8", fontSize: 12, fontWeight: 700 }}>{t.company}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex flex-wrap justify-center" style={{ gap: 16, marginTop: 48 }}>
          <Link
            href={calendlyUrl}
            className="inline-flex items-center justify-center font-semibold"
            style={{
              height: 50,
              padding: "0 26px",
              borderRadius: 999,
              background: "linear-gradient(to right, #8015e8, #ba83f0)",
              color: "white",
              fontSize: 15,
            }}
          >
            🚀  Book a Consultation
          </Link>
          <Link
            href="https://monday.com"
            className="inline-flex items-center justify-center font-semibold"
            style={{
              height: 50,
              padding: "0 26px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.6)",
              color: "white",
              fontSize: 15,
            }}
          >
            ▶️  Get Started with monday.com
          </Link>
        </div>
      </div>
    </section>
  )
}

/* -------- Final 4-stat grid -------- */
function FinalStatsSection() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 60, paddingBottom: 100 }}>
      <div
        className="mx-auto grid grid-cols-2 md:grid-cols-4 text-center"
        style={{ maxWidth: 1100, gap: 24 }}
      >
        {FINAL_STATS.map((s) => (
          <div key={s.label}>
            <p className="font-bold" style={{ color: "#8015e8", fontSize: 28, lineHeight: "34px" }}>
              {s.value}
            </p>
            <p style={{ color: "#10003a", fontSize: 14, marginTop: 6 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function SolarCrmSolutionContent({ page, siteSettings }: Props) {
  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const secondaryCards = page.secondaryCapabilitiesCards ?? []
  const solutionCards = page.solutionCards ?? []
  const solutionTop = solutionCards.slice(0, 2)
  const solutionBottom = solutionCards.slice(2)

  return (
    <div>
      {/* 1. Hero */}
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
        primaryCtaLabel={page.primaryCtaLabel || "🚀  Book a Consultation"}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel || "▶️  Get Started with monday.com"}
        secondaryCtaUrl={page.secondaryCtaUrl || "https://monday.com"}
      />

      {/* "Trusted by 300+ businesses worldwide" caption */}
      <section className="bg-white px-4" style={{ paddingTop: 0, paddingBottom: 24 }}>
        <p className="text-center" style={{ color: "#10003a", fontSize: 14, fontWeight: 600 }}>
          Trusted by 300+ businesses worldwide
        </p>
      </section>

      {/* 2. Logo cloud — heading: "500+ clients globally use Fruition's monday.com expert consultants" */}
      <LogoCloudMarquee
        headingPart1="500+ clients globally use Fruition's "
        headingAccent="monday.com expert consultants"
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Facing these challenges? */}
      {secondaryCards.length > 0 && (
        <CapabilitiesGrid
          eyebrow={page.secondaryCapabilitiesEyebrow}
          heading={page.secondaryCapabilitiesHeading || "Facing these "}
          headingAccent={page.secondaryCapabilitiesHeadingAccent || "challenges?"}
          subheading={page.secondaryCapabilitiesSubheading}
          theme="light"
          columns={3}
          cards={secondaryCards}
        />
      )}

      {/* 4. Key Features + Services 2-column section */}
      <KeyFeaturesSection services={(page.servicesList && page.servicesList.length > 0) ? page.servicesList : SERVICES} />

      {/* 5. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule Your Personalised Demo with A monday.com Expert"}
        subheading={
          page.calendlySubheading ||
          "Book a time with one of our monday consultants to see how monday CRM can be tailored to your specific business needs and start your 4-week extended trial."
        }
        calendlyUrl={calendlyUrl}
      />

      {/* 6. Solution cards — top pair (FASTER INVOICING + PORTFOLIO MANAGEMENT) */}
      {solutionTop.length > 0 && <SolutionCardsSection cards={solutionTop} />}

      {/* 7. Returns banner with testimonials + CTAs */}
      <ReturnsBannerSection calendlyUrl={calendlyUrl} testimonials={(page.solarTestimonials && page.solarTestimonials.length > 0) ? page.solarTestimonials : SOLAR_TESTIMONIALS} />

      {/* 8. Solution cards — bottom pair (INVENTORY TRACKING + FINANCIAL FORECASTING) */}
      {solutionBottom.length > 0 && <SolutionCardsSection cards={solutionBottom} />}

      {/* 9. Before vs After comparison (sideBySide) — hardcoded both columns */}
      <ComparisonTabsSection
        heading="Before vs After"
        tabs={(page.beforeAfterTabs && page.beforeAfterTabs.length > 0) ? page.beforeAfterTabs : BEFORE_AFTER_TABS}
        theme="light"
        layout="sideBySide"
        withPurpleCircle={false}
      />

      {/* 10. Final 4-stat grid */}
      <FinalStatsSection />
    </div>
  )
}
