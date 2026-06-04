"use client"

import Link from "next/link"
import { Rocket, Check } from "lucide-react"
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

/* ----------------- Sections ----------------- */

type ProvenStat = { _key?: string; emoji?: string; value?: string; body?: string }
type ServiceCard = { _key?: string; emoji?: string; title?: string; body?: string; bullets?: string[] }
type ExpertCard = { _key?: string; title?: string; body?: string; image?: string }

function ProvenResultsSection({ stats }: { stats: ProvenStat[] }) {
  if (!stats || stats.length === 0) return null
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 40 }}>
          Proven <span style={{ color: "#8015e8" }}>Atlassian Cloud</span> Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {stats.map((s: ProvenStat, i: number) => (
            <div key={s._key || s.value || i} className="text-center" style={{ padding: 32, borderRadius: 18, background: "linear-gradient(180deg, #f6efff 0%, #ebd9ff 100%)", border: "1px solid rgba(128,21,232,0.10)", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
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

function ComprehensiveServicesSection({ cards }: { cards: ServiceCard[] }) {
  if (!cards || cards.length === 0) return null
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 40 }}>
          Our Comprehensive <span style={{ color: "#8015e8" }}>Atlassian</span> Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
          {cards.map((c: ServiceCard, i: number) => (
            <div key={c._key || c.title || i} className="bg-white" style={{ padding: 24, borderRadius: 16, border: "1px solid #ece7fb", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{c.emoji}</span>
              <p className="font-bold" style={{ color: "#10003a", fontSize: 16 }}>{c.title}</p>
              <p style={{ color: "#444", fontSize: 13, lineHeight: "20px" }}>{c.body}</p>
              {c.bullets && c.bullets.length > 0 && (
                <ul className="flex flex-col" style={{ gap: 6, marginTop: 4 }}>
                  {c.bullets.map((b: string, j: number) => (
                    <li key={b || j} className="flex items-start" style={{ gap: 8, color: "#444", fontSize: 12, lineHeight: "18px" }}>
                      <Check size={16} color="#8015e8" aria-hidden />
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

function AtlassianExpertsSection({ calendlyUrl, cards }: { calendlyUrl: string; cards: ExpertCard[] }) {
  if (!cards || cards.length === 0) return null
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(180deg, #faf6ff 0%, #ebd9ff 100%)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex flex-col items-center text-center" style={{ marginBottom: 56 }}>
          <h2 className="font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 22 }}>
            Your <span style={{ color: "#8015e8" }}>Atlassian</span> Experts
          </h2>
          <Link
            href={calendlyUrl}
            className="inline-flex items-center justify-center gap-2 font-semibold"
            style={{ height: 50, padding: "0 26px", borderRadius: 999, background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", fontSize: 15, boxShadow: "0 14px 28px -12px rgba(128,21,232,0.55)" }}
          >
            <Rocket size={16} aria-hidden /> Book a Meeting
          </Link>
        </div>

        <div className="flex flex-col" style={{ gap: 60 }}>
          {cards.map((c: ExpertCard, i: number) => (
            <div
              key={c._key || c.title || i}
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
                {c.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                )}
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
  const calendlyUrl = siteSettings?.calendlyLink ?? ""

  const resolvedFaqTabs = faqTabs ?? []
  const atlassianTabs: ComparisonTab[] = page.atlassianTabs ?? []
  const provenStats: ProvenStat[] = page.provenStats ?? []
  const serviceCards: ServiceCard[] = page.serviceCards ?? []
  const expertCards: ExpertCard[] = page.expertCards ?? []

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading}
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

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Tab section */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        subheading={page.comparisonSubheading}
        tabs={atlassianTabs}
        theme="light"
        withPurpleCircle={false}
      />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* FAQ */}
      <FaqAccordion heading="Frequently asked questions" tabs={resolvedFaqTabs} />

      {/* Proven Atlassian Cloud Results */}
      <ProvenResultsSection stats={provenStats} />

      {/* Our Comprehensive Atlassian Services */}
      <div id="atlassian-process" />
      <ComprehensiveServicesSection cards={serviceCards} />

      {/* Your Atlassian Experts */}
      <AtlassianExpertsSection calendlyUrl={calendlyUrl} cards={expertCards} />
    </div>
  )
}
