"use client"

import { useState } from "react"
import {
  HeroBanner,
  LogoCloudMarquee,
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

type LifecycleStage = { n?: string; title?: string; body?: string }
type ConstructionTestimonial = { title?: string; quote?: string; name?: string; role?: string; image?: string }

function LifecycleSection({ stages }: { stages: LifecycleStage[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 32, lineHeight: "42px", marginBottom: 40 }}>
          Support Each Stage of Your Project Life Cycle with a <span style={{ color: "#8015e8" }}>monday.com Expert</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 28 }}>
          {stages.map((s, i) => (
            <div key={s.n || i} className="flex flex-col" style={{ gap: 10, padding: 24, borderRadius: 16, border: "1px solid #ece7fb", background: "white", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)" }}>
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

function ConstructionTestimonialsSection({ testimonials }: { testimonials: ConstructionTestimonial[] }) {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(180deg, #faf6ff 0%, #ebd9ff 100%)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 32, lineHeight: "42px", marginBottom: 40 }}>
          Construction <span style={{ color: "#8015e8" }}>Testimonials</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          {testimonials.map((t, i) => (
            <figure key={t.title || i} className="bg-white overflow-hidden flex flex-col" style={{ borderRadius: 20, border: "1px solid rgba(128,21,232,0.08)", boxShadow: "0 18px 36px -24px rgba(64,12,140,0.22)" }}>
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
function ConstructionTabs({ tabs }: { tabs: ComparisonTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
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
          {tabs.map((tab, i) => (
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

  const resolvedFaqTabs = faqTabs ?? []
  const resolvedComparisonTabs: ComparisonTab[] = page.comparisonTabs ?? []
  const resolvedLifecycleStages: LifecycleStage[] = page.lifecycleStages ?? []
  const resolvedConstructionTestimonials: ConstructionTestimonial[] = page.industryTestimonials ?? []
  const partnerCaseStudies = caseStudies

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
        secondaryCtaUrl={page.secondaryCtaUrl}
      />

      {/* Intro strip */}
      <ConstructionIntroStrip />

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Tab section — heading rotates with active tab */}
      <ConstructionTabs tabs={resolvedComparisonTabs} />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* FAQ */}
      <FaqAccordion heading={page.faqHeading} tabs={resolvedFaqTabs} />

      {/* Project Life Cycle stages */}
      <LifecycleSection stages={resolvedLifecycleStages} />

      {/* Construction-specific testimonials */}
      <ConstructionTestimonialsSection testimonials={resolvedConstructionTestimonials} />

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
