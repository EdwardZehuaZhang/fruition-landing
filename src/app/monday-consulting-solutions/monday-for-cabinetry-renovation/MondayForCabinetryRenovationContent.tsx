"use client"

import Link from "next/link"
import { urlFor } from "@/sanity/image"
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

type SanityImageRef = { asset?: { _ref?: string } } | null | undefined
function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).url()
  } catch {
    return null
  }
}

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

// Fallback content (used only when Sanity fields empty). Sourced originally from
// https://www.fruitionservices.io/monday-consulting-solutions/monday-for-cabinetry-renovation

const FALLBACK_KEY_FEATURES: Array<{ title: string; body: string }> = [
  {
    title: "Project Scheduling",
    body: "Visual timelines and automated task assignments keep cabinetry projects on track from design through final installation.",
  },
  {
    title: "Inventory Management",
    body: "Real-time material tracking with low-stock alerts and supplier coordination prevents costly shortages or delays.",
  },
  {
    title: "Client Communication",
    body: "Centralized approvals, automated updates, and shared dashboards simplify collaboration and reduce miscommunication.",
  },
  {
    title: "Cost & Profitability Tracking",
    body: "Budget dashboards, time-tracking, and change order management ensure projects stay profitable and on budget.",
  },
  {
    title: "Quality Control",
    body: "Standardized checklists, inspection workflows, and escalation automations improve project consistency and client satisfaction.",
  },
]

const FALLBACK_SERVICES = [
  "Solution design and implementation",
  "Workflow customisation and template configuration",
  "Integration with third-party applications",
  "User training and adoption support",
]

const FALLBACK_INLINE_TESTIMONIALS = [
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

const FALLBACK_BEFORE_AFTER_TABS: ComparisonTab[] = [
  {
    _key: "before",
    label: "Before",
    items: [
      { _key: "b1", number: "❌", title: "No inventory link", description: "Cabinet quotes created with no link to inventory" },
      { _key: "b2", number: "❌", title: "Manual re-entry", description: "Job details manually re-entered between sales, design, and installation teams" },
      { _key: "b3", number: "❌", title: "Siloed data", description: "Project data siloed across spreadsheets, emails, and paper files" },
      { _key: "b4", number: "❌", title: "Limited visibility", description: "Limited visibility into project timelines and delays" },
      { _key: "b5", number: "❌", title: "Miscommunication", description: "Frequent miscommunication during handoffs between design, fabrication, and installers" },
      { _key: "b6", number: "❌", title: "Admin overload", description: "Overwhelming admin time spent tracking orders, invoices, and schedules" },
      { _key: "b7", number: "❌", title: "Slow revenue", description: "Long quote-to-cash cycles slowing revenue" },
    ],
  },
  {
    _key: "after",
    label: "After",
    items: [
      { _key: "a1", number: "✅", title: "Unified workflow", description: "Unified workflow from client inquiry to final installation" },
      { _key: "a2", number: "✅", title: "Real-time visibility", description: "Real-time visibility across design, fabrication, and installation phases" },
      { _key: "a3", number: "✅", title: "Standardized templates", description: "Standardized templates ensuring consistent project delivery and quality control" },
      { _key: "a4", number: "✅", title: "Centralized dashboards", description: "Centralized dashboards for accurate scheduling and proactive decision-making" },
      { _key: "a5", number: "✅", title: "Automated handoffs", description: "Automated task assignments and seamless handoffs between departments" },
      { _key: "a6", number: "✅", title: "50% admin reduction", description: "50% reduction in admin work and faster project turnaround times" },
      { _key: "a7", number: "✅", title: "60% quicker quote-to-cash", description: "60% quicker quote-to-cash with connected workflows" },
    ],
  },
]

/* -------- Key Features + Services -------- */
function KeyFeaturesSection({
  keyFeaturesPart1,
  keyFeaturesAccent,
  keyFeatures,
  servicesPart1,
  servicesAccent,
  services,
}: {
  keyFeaturesPart1: string
  keyFeaturesAccent: string
  keyFeatures: { title: string; body: string }[]
  servicesPart1: string
  servicesAccent: string
  services: string[]
}) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2" style={{ maxWidth: 1100, gap: 48 }}>
        <div>
          <h2 className="font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 24 }}>
            {keyFeaturesPart1} <span style={{ color: "#8015e8" }}>{keyFeaturesAccent}</span>
          </h2>
          <ul className="flex flex-col" style={{ gap: 14 }}>
            {keyFeatures.map((f) => (
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
            {servicesPart1} <span style={{ color: "#8015e8" }}>{servicesAccent}</span>
          </h2>
          <ul className="flex flex-col" style={{ gap: 14 }}>
            {services.map((s) => (
              <li key={s} className="flex items-start" style={{ gap: 10 }}>
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
type InlineTestimonial = {
  quote: string
  name: string
  role: string
  company: string
  photo: string
}

function ReturnsBannerSection({
  heading,
  subheading,
  testimonials,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
}: {
  heading: string
  subheading: string
  testimonials: InlineTestimonial[]
  primaryLabel: string
  primaryUrl: string
  secondaryLabel: string
  secondaryUrl: string
}) {
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
          {heading}
        </h2>
        <p className="text-center" style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginBottom: 48 }}>
          {subheading}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {testimonials.map((t) => (
            <figure
              key={t.name}
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
            href={primaryUrl}
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
            {primaryLabel}
          </Link>
          <Link
            href={secondaryUrl}
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
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function MondayForCabinetryRenovationContent({ page, siteSettings }: Props) {
  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  // CapabilitiesCards holds the challenges set for this page.
  const challengeCards = page.capabilitiesCards ?? []
  const CARD_IMAGE_MAP: Record<string, string> = {
    "PROJECT SCHEDULING": "/images/cabinetry-project-scheduling.avif",
    "INVENTORY TRACKING": "/images/cabinetry-inventory-tracking.avif",
    "CLIENT COMMUNICATION": "/images/cabinetry-client-communication.avif",
    "CHANGE ORDER MANAGEMENT": "/images/cabinetry-change-order.avif",
  }
  const solutionCards = (page.solutionCards ?? []).map((card: any) => {
    const sanityImg = safeImageUrl(card.image)
    if (sanityImg) return { ...card, imageSrc: sanityImg }
    const key = (card.eyebrow ?? "").toUpperCase().trim()
    const imageSrc = CARD_IMAGE_MAP[key]
    return imageSrc ? { ...card, imageSrc } : card
  })
  const solutionTop = solutionCards.slice(0, 2)
  const solutionBottom = solutionCards.slice(2)

  // Sanity-driven values with hardcoded fallbacks (preserves current visual output).
  const keyFeatures =
    page.keyFeatures?.length > 0 ? page.keyFeatures : FALLBACK_KEY_FEATURES
  const servicesList =
    page.servicesListItems?.length > 0 ? page.servicesListItems : FALLBACK_SERVICES
  const inlineTestimonials: InlineTestimonial[] =
    page.inlineTestimonials?.length > 0
      ? page.inlineTestimonials.map((t: any) => ({
          quote: t.quote ?? "",
          name: t.name ?? "",
          role: t.role ?? "",
          company: t.company ?? "",
          photo: safeImageUrl(t.photo) ?? "",
        }))
      : FALLBACK_INLINE_TESTIMONIALS
  const beforeAfterTabs: ComparisonTab[] =
    page.beforeAfterTabs?.length > 0 ? page.beforeAfterTabs : FALLBACK_BEFORE_AFTER_TABS

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroImageUrl={page.heroImageUrl || "/images/cabinetry-hero.png"}
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

      {/* Trusted-by caption */}
      <section className="bg-white px-4" style={{ paddingTop: 0, paddingBottom: 24 }}>
        <p className="text-center" style={{ color: "#10003a", fontSize: 14, fontWeight: 600 }}>
          {page.trustedByCaption || "🔨  Trusted by 500+ businesses worldwide"}
        </p>
      </section>

      {/* 2. Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "500+ clients globally use Fruition's "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consultants"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Facing these challenges? */}
      {challengeCards.length > 0 && (
        <CapabilitiesGrid
          heading={page.capabilitiesHeading || "Facing these "}
          headingAccent={page.capabilitiesHeadingAccent ?? "challenges?"}
          theme="light"
          columns={3}
          cards={challengeCards}
        />
      )}

      {/* 4. Key Features + Services */}
      <KeyFeaturesSection
        keyFeaturesPart1={page.keyFeaturesHeadingPart1 || "Key"}
        keyFeaturesAccent={page.keyFeaturesHeadingAccent || "Features"}
        keyFeatures={keyFeatures}
        servicesPart1={page.servicesListHeadingPart1 || "Our"}
        servicesAccent={page.servicesListHeadingAccent || "Services"}
        services={servicesList}
      />

      {/* 5. Solution cards — top pair (PROJECT SCHEDULING + INVENTORY TRACKING) */}
      {solutionTop.length > 0 && <SolutionCardsSection cards={solutionTop} />}

      {/* 6. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule Your Personalised Demo with A monday.com Expert"}
        subheading={
          page.calendlySubheading ||
          "Book a time with one of our certified monday.com consultants to see how monday.com can be customized for your cabinetry renovation and installation business and start your free 4-week extended trial."
        }
        calendlyUrl={calendlyUrl}
      />

      {/* 7. Solution cards — bottom pair (CLIENT COMMUNICATION + CHANGE ORDER MANAGEMENT) */}
      {solutionBottom.length > 0 && <SolutionCardsSection cards={solutionBottom} />}

      {/* 8. Returns banner + testimonials carousel */}
      <ReturnsBannerSection
        heading={page.returnsBannerHeading || "We bring real returns on investment."}
        subheading={
          page.returnsBannerSubheading ||
          "Join 500+ organisations that have implemented with us."
        }
        testimonials={inlineTestimonials}
        primaryLabel={page.returnsBannerPrimaryLabel || "🚀  Book a Consultation"}
        primaryUrl={page.returnsBannerPrimaryUrl || calendlyUrl}
        secondaryLabel={page.returnsBannerSecondaryLabel || "▶️  Get Started with monday.com"}
        secondaryUrl={page.returnsBannerSecondaryUrl || "https://monday.com"}
      />

      {/* 9. Before vs After (sideBySide, both columns) */}
      <ComparisonTabsSection
        heading={page.comparisonHeading || "Before vs After"}
        tabs={beforeAfterTabs}
        theme="light"
        layout="sideBySide"
        withPurpleCircle={false}
      />
    </div>
  )
}
