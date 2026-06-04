"use client"

import Link from "next/link"
import { Rocket, Play } from "lucide-react"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  TestimonialsGrid,
} from "@/components/sections"
import TeamGridSection, { type TeamMember } from "@/components/TeamGridSection"
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
  teamMembers: TeamMember[]
}

type FeatureBlock = { title?: string; body?: string; ctaLabel?: string; ctaUrl?: string; image?: string }
type RoiStat = { value?: string; label?: string }

function FeatureBlocksSection({ blocks }: { blocks: FeatureBlock[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex flex-col" style={{ gap: 56 }}>
          {blocks.map((b, i) => (
            <div
              key={b.title}
              className="flex flex-col items-center"
              style={{ gap: 40, flexDirection: i % 2 === 0 ? "row" : "row-reverse" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="font-bold" style={{ color: "#10003a", fontSize: 26, lineHeight: "34px", marginBottom: 14 }}>{b.title}</h3>
                <p style={{ color: "#444", fontSize: 15, lineHeight: "24px", whiteSpace: "pre-line" }}>{b.body}</p>
                <Link
                  href={b.ctaUrl || "#"}
                  className="inline-flex items-center font-semibold"
                  style={{ marginTop: 18, color: "#8015e8", fontSize: 14 }}
                >
                  {b.ctaLabel} →
                </Link>
              </div>
              <div
                className="rounded-card overflow-hidden bg-white"
                style={{ flex: 1, aspectRatio: "16 / 10", border: "1px solid #ece7fb", boxShadow: "0 18px 36px -24px rgba(64,12,140,0.2)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image} alt={b.title || ""} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnerSectionCta({ calendlyUrl }: { calendlyUrl: string }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <div className="mx-auto text-center" style={{ maxWidth: 920 }}>
        <h2 className="font-bold" style={{ color: "#10003a", fontSize: 28, lineHeight: "36px", marginBottom: 22 }}>
          Work with a certified <span style={{ color: "#8015e8" }}>monday.com partner</span> today
        </h2>
        <div className="flex flex-wrap justify-center" style={{ gap: 14 }}>
          <Link
            href={calendlyUrl}
            className="inline-flex items-center justify-center font-semibold gap-2"
            style={{ height: 50, padding: "0 26px", borderRadius: 999, background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", fontSize: 14 }}
          >
            <Rocket size={16} aria-hidden /> Schedule a 30-minute Consultation
          </Link>
          <Link
            href="https://monday.com"
            className="inline-flex items-center justify-center font-semibold gap-2"
            style={{ height: 50, padding: "0 26px", borderRadius: 999, border: "1px solid #8015e8", color: "#8015e8", fontSize: 14, background: "white" }}
          >
            <Play size={16} aria-hidden /> Get Started with monday.com
          </Link>
        </div>
      </div>
    </section>
  )
}

function CrmTutorialCta({ calendlyUrl }: { calendlyUrl: string }) {
  return (
    <section className="px-4" style={{ paddingTop: 60, paddingBottom: 60, background: "linear-gradient(180deg, #faf6ff 0%, #ebd9ff 100%)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="text-center">
          <h2 className="font-bold" style={{ color: "#10003a", fontSize: 28, lineHeight: "36px", marginBottom: 14 }}>
            Everything You Need to Know to Get Started with <span style={{ color: "#8015e8" }}>monday CRM</span>
          </h2>
          <p style={{ color: "#444", fontSize: 15, lineHeight: "24px", maxWidth: 720, margin: "0 auto" }}>
            Our tutorial walks you through the entire process, from managing leads and pipeline tracking, to sending emails, automations, dashboards, and integrations.
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: 14, marginTop: 22 }}>
            <Link
              href={calendlyUrl}
              className="inline-flex items-center justify-center font-semibold gap-2"
              style={{ height: 50, padding: "0 26px", borderRadius: 999, background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", fontSize: 14 }}
            >
              <Rocket size={16} aria-hidden /> Book a Consultation
            </Link>
            <Link
              href="https://monday.com"
              className="inline-flex items-center justify-center font-semibold gap-2"
              style={{ height: 50, padding: "0 26px", borderRadius: 999, border: "1px solid #8015e8", color: "#8015e8", fontSize: 14, background: "white" }}
            >
              <Play size={16} aria-hidden /> Get Started with monday.com
            </Link>
          </div>
        </div>
        <div className="mx-auto rounded-card overflow-hidden" style={{ marginTop: 40, aspectRatio: "16 / 9", maxWidth: 980 }}>
          <YouTubeEmbed videoId="eoOCR6OjJhI" title="Everything you need to know to get started with monday CRM" />
        </div>
      </div>
    </section>
  )
}

function EconomicImpactSection({ stats }: { stats: RoiStat[] }) {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(160deg, #2b074d 0%, #10003a 100%)" }}>
      <div className="mx-auto text-center" style={{ maxWidth: 1100 }}>
        <h2 className="font-bold" style={{ color: "white", fontSize: 30, lineHeight: "38px", maxWidth: 820, margin: "0 auto 12px" }}>
          As <span style={{ color: "#b162fe" }}>monday partners</span>, we help you discover how efficient your team could be
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginBottom: 36 }}>The economic impact of</p>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 20 }}>
          {stats.map((s, i) => (
            <div key={s.label || i}>
              <p className="font-bold" style={{ color: "white", fontSize: 36, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, marginTop: 8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function MondayPartnerUkContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
  teamMembers,
}: Props) {
  if (!page) return null
  const calendlyUrl = siteSettings?.calendlyLink ?? ""

  const resolvedFaqTabs = faqTabs ?? []
  const partnerCaseStudies = caseStudies
  const resolvedComparisonTabs: ComparisonTab[] = page.comparisonTabs ?? []
  const resolvedFeatureBlocks: FeatureBlock[] = page.featureBlocks ?? []
  const resolvedRoiStats: RoiStat[] = page.roiStats ?? []

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

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3-tab comparison */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        subheading={page.comparisonSubheading}
        tabs={resolvedComparisonTabs}
        theme="light"
        withPurpleCircle={false}
      />

      {/* Meet the team — UK region */}
      <TeamGridSection
        heading={page.teamGridHeading}
        subheading={page.teamGridSubheading}
        ctaLabel={page.teamGridCtaLabel}
        ctaUrl={page.teamGridCtaUrl}
        members={teamMembers}
        region="UK"
      />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Book A 30-Min Consultation with A monday.com Expert"}
        subheading={
          page.calendlySubheading ||
          "Schedule a personalised monday.com demo with our certified monday.com consultants to discover how the platform can be customised for your specific business needs.\n\nExperience the full potential of monday.com with our exclusive 4-week extended free trial, giving you ample time to explore advanced features and see measurable results."
        }
        calendlyUrl={calendlyUrl}
      />

      {/* Customer testimonials carousel */}
      <TestimonialsGrid
        heading={page.testimonialsGridHeading}
        ctaLabel={page.testimonialsGridCtaLabel}
        ctaUrl={calendlyUrl}
        statCardValue={page.testimonialsGridStatValue}
        statCardSubtitle={page.testimonialsGridStatSubtitle}
        statCardCtaLabel={page.testimonialsGridStatCtaLabel}
        statCardCtaUrl={page.testimonialsGridStatCtaUrl}
        caseStudies={partnerCaseStudies}
      />

      {/* FAQ */}
      <FaqAccordion heading={page.faqHeading} tabs={resolvedFaqTabs} />

      {/* Feature blocks */}
      <FeatureBlocksSection blocks={resolvedFeatureBlocks} />

      {/* Work with partner CTA */}
      <PartnerSectionCta calendlyUrl={calendlyUrl} />

      {/* CRM tutorial cta + video */}
      <CrmTutorialCta calendlyUrl={calendlyUrl} />

      {/* Economic impact */}
      <EconomicImpactSection stats={resolvedRoiStats} />
    </div>
  )
}
