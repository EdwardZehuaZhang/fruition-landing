"use client"

import Link from "next/link"
import { Check } from "lucide-react"
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
    <section className="bg-surface px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2" style={{ maxWidth: 1100, gap: 48 }}>
        <div>
          <h2 className="font-bold" style={{ color: "var(--ink-heading)", fontSize: 36, lineHeight: "44px", marginBottom: 24 }}>
            {keyFeaturesPart1} <span style={{ color: "var(--brand)" }}>{keyFeaturesAccent}</span>
          </h2>
          <ul className="flex flex-col" style={{ gap: 14 }}>
            {keyFeatures.map((f) => (
              <li key={f.title} className="flex items-start" style={{ gap: 10 }}>
                <Check size={16} color="var(--brand)" style={{ flexShrink: 0 }} aria-hidden />
                <p style={{ fontSize: 15, lineHeight: "24px", color: "var(--ink)" }}>
                  <span className="font-bold">{f.title}:</span> {f.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-bold" style={{ color: "var(--ink-heading)", fontSize: 36, lineHeight: "44px", marginBottom: 24 }}>
            {servicesPart1} <span style={{ color: "var(--brand)" }}>{servicesAccent}</span>
          </h2>
          <ul className="flex flex-col" style={{ gap: 14 }}>
            {services.map((s) => (
              <li key={s} className="flex items-start" style={{ gap: 10 }}>
                <Check size={16} color="var(--brand)" style={{ flexShrink: 0 }} aria-hidden />
                <p style={{ fontSize: 15, lineHeight: "24px", color: "var(--ink)" }}>{s}</p>
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
        background: "linear-gradient(160deg, var(--navy-700) 0%, var(--navy-900) 100%)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2
          className="text-center font-bold"
          style={{ color: "var(--white)", fontSize: "clamp(28px, 7vw, 44px)", lineHeight: 1.2, marginBottom: 12 }}
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
              <blockquote style={{ fontSize: 14, lineHeight: "22px", color: "var(--ink)" }}>
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
                  <p className="font-bold" style={{ color: "var(--ink-heading)", fontSize: 14 }}>{t.name}</p>
                  <p style={{ color: "var(--ink-soft)", fontSize: 12 }}>{t.role}</p>
                  <p style={{ color: "var(--brand)", fontSize: 12, fontWeight: 700 }}>{t.company}</p>
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
              background: "linear-gradient(to right, var(--purple-primary), var(--purple-light))",
              color: "var(--white)",
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
              color: "var(--white)",
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
  const solutionCards = (page.solutionCards ?? []).map((card: any) => {
    const sanityImg = safeImageUrl(card.image)
    if (sanityImg) return { ...card, imageSrc: sanityImg }
    return card
  })
  const solutionTop = solutionCards.slice(0, 2)
  const solutionBottom = solutionCards.slice(2)

  // Sanity-driven values with hardcoded fallbacks (preserves current visual output).
  const keyFeatures =
    page.keyFeatures ?? []
  const servicesList =
    page.servicesListItems ?? []
  const inlineTestimonials: InlineTestimonial[] =
    page.inlineTestimonials?.length > 0
      ? page.inlineTestimonials.map((t: any) => ({
          quote: t.quote ?? "",
          name: t.name ?? "",
          role: t.role ?? "",
          company: t.company ?? "",
          photo: safeImageUrl(t.photo) ?? "",
        }))
      : []
  const beforeAfterTabs: ComparisonTab[] =
    page.beforeAfterTabs ?? []

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
        primaryCtaLabel={page.primaryCtaLabel || "Book a Consultation"}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel || "Get Started with monday.com"}
        secondaryCtaUrl={page.secondaryCtaUrl || "https://monday.com"}
      />

      {/* Trusted-by caption */}
      <section className="bg-surface px-4" style={{ paddingTop: 0, paddingBottom: 24 }}>
        <p className="text-center" style={{ color: "var(--ink-heading)", fontSize: 14, fontWeight: 600 }}>
          {page.trustedByCaption || "Trusted by 500+ businesses worldwide"}
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
        primaryLabel={page.returnsBannerPrimaryLabel || "Book a Consultation"}
        primaryUrl={page.returnsBannerPrimaryUrl || calendlyUrl}
        secondaryLabel={page.returnsBannerSecondaryLabel || "Get Started with monday.com"}
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
