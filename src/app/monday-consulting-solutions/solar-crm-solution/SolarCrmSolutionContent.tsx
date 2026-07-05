"use client"

import Link from "next/link"
import { Check } from "lucide-react"
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
} from "@/components/sections/types"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

type KeyFeature = { title?: string; body?: string }
type SolarTestimonial = {
  quote?: string
  name?: string
  role?: string
  company?: string
  photo?: string
}
type JoinStat = { value?: string; label?: string }

/* -------- Key Features + Services -------- */
function KeyFeaturesSection({
  features,
  services,
  featuresHeadingPart1,
  featuresHeadingAccent,
  servicesHeadingPart1,
  servicesHeadingAccent,
}: {
  features: KeyFeature[]
  services: string[]
  featuresHeadingPart1?: string
  featuresHeadingAccent?: string
  servicesHeadingPart1?: string
  servicesHeadingAccent?: string
}) {
  if (features.length === 0 && services.length === 0) return null
  return (
    <section className="bg-surface px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2" style={{ maxWidth: 1100, gap: 48 }}>
        <div>
          <h2 className="font-bold" style={{ color: "var(--text-body)", fontSize: 36, lineHeight: "44px", marginBottom: 24 }}>
            {featuresHeadingPart1}
            {featuresHeadingAccent && (
              <span style={{ color: "#8015e8" }}>{featuresHeadingAccent}</span>
            )}
          </h2>
          <ul className="flex flex-col" style={{ gap: 14 }}>
            {features.map((f, i) => (
              <li key={f.title || i} className="flex items-start" style={{ gap: 10 }}>
                <Check size={16} color="#8015e8" style={{ flexShrink: 0 }} aria-hidden />
                <p style={{ fontSize: 15, lineHeight: "24px", color: "var(--text-body)" }}>
                  <span className="font-bold">{f.title}:</span> {f.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-bold" style={{ color: "var(--text-body)", fontSize: 36, lineHeight: "44px", marginBottom: 24 }}>
            {servicesHeadingPart1}
            {servicesHeadingAccent && (
              <span style={{ color: "#8015e8" }}>{servicesHeadingAccent}</span>
            )}
          </h2>
          <ul className="flex flex-col" style={{ gap: 14 }}>
            {services.map((s, i) => (
              <li key={s || i} className="flex items-start" style={{ gap: 10 }}>
                <Check size={16} color="#8015e8" style={{ flexShrink: 0 }} aria-hidden />
                <p style={{ fontSize: 15, lineHeight: "24px", color: "var(--text-body)" }}>{s}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* -------- Stats banner with rotating testimonials -------- */
function ReturnsBannerSection({
  heading,
  subheading,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
  testimonials,
}: {
  heading?: string
  subheading?: string
  primaryLabel?: string
  primaryUrl?: string
  secondaryLabel?: string
  secondaryUrl?: string
  testimonials: SolarTestimonial[]
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
        {heading && (
          <h2
            className="text-center font-bold"
            style={{ color: "white", fontSize: "clamp(28px, 7vw, 44px)", lineHeight: 1.2, marginBottom: 12 }}
          >
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-center" style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginBottom: 48 }}>
            {subheading}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {testimonials.map((t, i) => (
            <figure
              key={t.name || i}
              className="bg-surface"
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

        {(primaryLabel || secondaryLabel) && (
          <div className="flex flex-wrap justify-center" style={{ gap: 16, marginTop: 48 }}>
            {primaryLabel && primaryUrl && (
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
            )}
            {secondaryLabel && secondaryUrl && (
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
            )}
          </div>
        )}
      </div>
    </section>
  )
}

/* -------- Final 4-stat grid -------- */
function FinalStatsSection({ stats }: { stats: JoinStat[] }) {
  if (stats.length === 0) return null
  return (
    <section className="bg-surface px-4" style={{ paddingTop: 60, paddingBottom: 100 }}>
      <div
        className="mx-auto grid grid-cols-2 md:grid-cols-4 text-center"
        style={{ maxWidth: 1100, gap: 24 }}
      >
        {stats.map((s, i) => (
          <div key={s.label || i}>
            <p className="font-bold" style={{ color: "#8015e8", fontSize: 28, lineHeight: "34px" }}>
              {s.value}
            </p>
            <p style={{ color: "var(--text-body)", fontSize: 14, marginTop: 6 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function SolarCrmSolutionContent({ page, siteSettings }: Props) {
  if (!page) return null

  const calendlyUrl = siteSettings?.calendlyLink ?? ""

  const secondaryCards = page.secondaryCapabilitiesCards ?? []
  const solutionCards = page.solutionCards ?? []
  const solutionTop = solutionCards.slice(0, 2)
  const solutionBottom = solutionCards.slice(2)

  const keyFeatures: KeyFeature[] = page.keyFeatures ?? []
  const services: string[] = page.servicesList ?? []
  const testimonials: SolarTestimonial[] = page.solarTestimonials ?? []
  const joinStats: JoinStat[] = page.joinStats ?? []
  const beforeAfterTabs = page.beforeAfterTabs ?? []

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
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={page.primaryCtaUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl}
      />

      {/* "Trusted by 300+ businesses worldwide" caption */}
      {page.trustedByCaption && (
        <section className="bg-surface px-4" style={{ paddingTop: 0, paddingBottom: 24 }}>
          <p className="text-center" style={{ color: "var(--text-body)", fontSize: 14, fontWeight: 600 }}>
            {page.trustedByCaption}
          </p>
        </section>
      )}

      {/* 2. Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Facing these challenges? */}
      {secondaryCards.length > 0 && (
        <CapabilitiesGrid
          eyebrow={page.secondaryCapabilitiesEyebrow}
          heading={page.secondaryCapabilitiesHeading}
          headingAccent={page.secondaryCapabilitiesHeadingAccent}
          subheading={page.secondaryCapabilitiesSubheading}
          theme="light"
          columns={3}
          cards={secondaryCards}
        />
      )}

      {/* 4. Key Features + Services 2-column section */}
      <KeyFeaturesSection
        features={keyFeatures}
        services={services}
        featuresHeadingPart1={page.keyFeaturesHeadingPart1}
        featuresHeadingAccent={page.keyFeaturesHeadingAccent}
        servicesHeadingPart1={page.servicesListHeadingPart1}
        servicesHeadingAccent={page.servicesListHeadingAccent}
      />

      {/* 5. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 6. Solution cards — top pair */}
      {solutionTop.length > 0 && <SolutionCardsSection cards={solutionTop} />}

      {/* 7. Returns banner with testimonials + CTAs */}
      <ReturnsBannerSection
        heading={page.returnsBannerHeading}
        subheading={page.returnsBannerSubheading}
        primaryLabel={page.returnsBannerPrimaryLabel}
        primaryUrl={page.returnsBannerPrimaryUrl || calendlyUrl}
        secondaryLabel={page.returnsBannerSecondaryLabel}
        secondaryUrl={page.returnsBannerSecondaryUrl}
        testimonials={testimonials}
      />

      {/* 8. Solution cards — bottom pair */}
      {solutionBottom.length > 0 && <SolutionCardsSection cards={solutionBottom} />}

      {/* 9. Before vs After comparison */}
      {beforeAfterTabs.length > 0 && (
        <ComparisonTabsSection
          heading="Before vs After"
          tabs={beforeAfterTabs}
          theme="light"
          layout="sideBySide"
          withPurpleCircle={false}
        />
      )}

      {/* 10. Final 4-stat grid */}
      <FinalStatsSection stats={joinStats} />
    </div>
  )
}
