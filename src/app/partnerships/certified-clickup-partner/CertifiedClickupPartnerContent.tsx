"use client"

import { useState } from "react"
import {
  HeroBanner,
  LogoCloudMarquee,
  CalendlySection,
  FaqAccordion,
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

type FeatureGroup = { number: string; title: string; bullets: { emoji: string; text: string }[] }
type FeatureTab = { key?: string; label: string; heading?: string; groups: FeatureGroup[] }
type IndustryTab = { label: string; description: string; features: { emoji: string; text: string }[] }
type EverythingAppCard = { emoji?: string; title?: string; body?: string }
type ProvenStat = { emoji?: string; value?: string; body?: string }
type EverythingAppFeature = { number?: string; title?: string; body?: string }

/* ----------------- Sections ----------------- */

function PartnershipIntroSection() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div className="mx-auto text-center" style={{ maxWidth: 880 }}>
        <p style={{ fontSize: 16, lineHeight: "26px", color: "#444" }}>
          Fruition certifies partnership with ClickUp, an all-in-one productivity platform that brings work together in one place.
        </p>
        <p style={{ fontSize: 16, lineHeight: "26px", color: "#444", marginTop: 14 }}>
          As a certified ClickUp Implementation Partners, we deliver comprehensive workspace solutions that transform how teams collaborate, eliminate app-switching, and save organisations a day of work every week.
        </p>
      </div>
    </section>
  )
}

function EverythingAppSection({ cards }: { cards: EverythingAppCard[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="text-center" style={{ marginBottom: 40 }}>
          <h2 className="font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 14 }}>
            Transform Your Business with ClickUp&apos;s <span style={{ color: "#8015e8" }}>Everything App for Work</span>
          </h2>
          <p className="mx-auto" style={{ color: "#444", fontSize: 16, lineHeight: "26px", maxWidth: 820 }}>
            ClickUp replaces multiple tools with one unified platform, eliminating the app-switching that fragments work, steals time, and kills productivity.
          </p>
          <p className="mx-auto" style={{ color: "#444", fontSize: 16, lineHeight: "26px", maxWidth: 820, marginTop: 12 }}>
            As your certified ClickUp implementation partner, we help organisations across Australia, US, and UK unlock ClickUp&apos;s full potential through expert configuration, seamless migration, and comprehensive training.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {cards.map((c, i) => (
            <div key={c.title || i} className="bg-white" style={{ padding: 24, borderRadius: 18, border: "1px solid #ece7fb", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{c.emoji}</span>
              <p className="font-bold" style={{ color: "#10003a", fontSize: 18 }}>{c.title}</p>
              <p style={{ color: "#444", fontSize: 14, lineHeight: "22px" }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesTabsSection({ tabs }: { tabs: FeatureTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  if (!active) return null
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginBottom: 40 }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.key || tab.label || i}
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
        {active.heading && (
          <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 32, lineHeight: "40px", marginBottom: 32 }}>
            {active.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {(active.groups || []).map((g: FeatureGroup, gi: number) => (
            <div key={g.number || gi} className="bg-white" style={{ padding: 24, borderRadius: 18, border: "1px solid rgba(128,21,232,0.08)", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="flex items-center" style={{ gap: 14 }}>
                <span className="flex items-center justify-center font-bold" style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)", color: "white", fontSize: 13 }}>
                  {g.number}
                </span>
                <p className="font-bold" style={{ color: "#10003a", fontSize: 15, lineHeight: "22px" }}>{g.title}</p>
              </div>
              <ul className="flex flex-col" style={{ gap: 10 }}>
                {(g.bullets || []).map((b: { emoji: string; text: string }, bi: number) => (
                  <li key={b.text || bi} className="flex items-start" style={{ gap: 10 }}>
                    <span style={{ fontSize: 18, lineHeight: "22px", flexShrink: 0 }}>{b.emoji}</span>
                    <span style={{ color: "#444", fontSize: 13, lineHeight: "20px" }}>{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function IndustryTabsSection({ tabs }: { tabs: IndustryTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  if (!active) return null
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(180deg, #faf6ff 0%, #ebd9ff 100%)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 32 }}>
          Implement ClickUp for <span style={{ color: "#8015e8" }}>any team</span>
        </h2>
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginBottom: 32 }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.label || i}
              onClick={() => setActiveIdx(i)}
              style={{
                padding: "10px 22px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                ...(i === activeIdx
                  ? { background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", border: "none" }
                  : { background: "white", color: "#2b074d", border: "1px solid #e8e6e6" }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-white" style={{ padding: 32, borderRadius: 20, border: "1px solid rgba(128,21,232,0.08)", boxShadow: "0 18px 36px -24px rgba(64,12,140,0.2)" }}>
          <h3 className="font-bold" style={{ color: "#10003a", fontSize: 22, marginBottom: 10 }}>{active.label}</h3>
          <p style={{ color: "#444", fontSize: 15, lineHeight: "24px", marginBottom: 22 }}>{active.description}</p>
          <p className="font-bold" style={{ color: "#8015e8", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Key Features</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 10 }}>
            {(active.features || []).map((f: { emoji: string; text: string }, fi: number) => (
              <li key={f.text || fi} className="flex items-start" style={{ gap: 10 }}>
                <span style={{ fontSize: 18, lineHeight: "22px", flexShrink: 0 }}>{f.emoji}</span>
                <span style={{ color: "#444", fontSize: 14, lineHeight: "22px" }}>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function ProvenResultsSection({ stats }: { stats: ProvenStat[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 40 }}>
          Proven <span style={{ color: "#8015e8" }}>ClickUp</span> Results
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 20 }}>
          {stats.map((s, i) => (
            <div key={s.value || i} className="text-center" style={{ padding: 28, borderRadius: 18, background: "linear-gradient(180deg, #f6efff 0%, #ebd9ff 100%)", border: "1px solid rgba(128,21,232,0.1)", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <span className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: 999, background: "white", fontSize: 22, boxShadow: "0 4px 14px -8px rgba(64,12,140,0.25)" }}>{s.emoji}</span>
              <p className="font-bold" style={{ color: "#8015e8", fontSize: 22, lineHeight: 1.1 }}>{s.value}</p>
              <p style={{ color: "#444", fontSize: 13, lineHeight: "20px", maxWidth: 220 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EverythingAppFeaturesSection({ features }: { features: EverythingAppFeature[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 40 }}>
          The Everything App for Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {features.map((f, i) => (
            <div key={f.number || i} className="bg-white" style={{ padding: 24, borderRadius: 16, border: "1px solid #ece7fb", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span className="flex items-center justify-center font-bold" style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)", color: "white", fontSize: 13, flexShrink: 0 }}>
                {f.number}
              </span>
              <div>
                <p className="font-bold" style={{ color: "#10003a", fontSize: 16, marginBottom: 6 }}>{f.title}</p>
                <p style={{ color: "#444", fontSize: 13, lineHeight: "20px" }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------- Page ----------------- */

export default function CertifiedClickupPartnerContent({ page, siteSettings, faqTabs }: Props) {
  if (!page) return null
  const calendlyUrl = siteSettings?.calendlyLink ?? ""

  const resolvedFaqTabs = faqTabs ?? []
  const everythingAppCards: EverythingAppCard[] = page.everythingAppCards ?? []
  const servicesTabs: FeatureTab[] = page.servicesTabs ?? []
  const industryTabs: IndustryTab[] = page.industryTabsPartnership ?? []
  const provenStats: ProvenStat[] = page.provenStats ?? []
  const everythingAppFeatures: EverythingAppFeature[] = page.everythingAppFeatures ?? []

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
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
      />

      <PartnershipIntroSection />

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      <EverythingAppSection cards={everythingAppCards} />
      <ServicesTabsSection tabs={servicesTabs} />
      <IndustryTabsSection tabs={industryTabs} />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      <FaqAccordion heading={page.faqHeading || "Frequently asked questions"} tabs={resolvedFaqTabs} />

      <ProvenResultsSection stats={provenStats} />
      <EverythingAppFeaturesSection features={everythingAppFeatures} />
    </div>
  )
}
