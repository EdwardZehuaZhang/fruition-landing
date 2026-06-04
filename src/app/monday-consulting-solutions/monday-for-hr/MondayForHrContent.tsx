"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  FileText,
  Check,
  Users,
  Mail,
  AlertTriangle,
  Wallet,
  ClipboardList,
  Umbrella,
  Calendar,
  Building2,
} from "lucide-react"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  TestimonialsGrid,
  DiscoverCtaSection,
  JoinStatsSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import type { CaseStudy, SiteSettingsData, FaqTab } from "@/components/sections/types"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

const HR_HIRING_ITEMS: Array<{ icon: LucideIcon; text: string }> = [
  { icon: FileText, text: "ATS recruitment workflows including Forms" },
  { icon: Check, text: "Onboarding checklists" },
  { icon: FileText, text: "Contracting document creation" },
  { icon: Users, text: "Talent Pool / Contractor Management" },
]

const HR_OPERATIONS_ITEMS: Array<{ icon: LucideIcon; text: string }> = [
  { icon: Mail, text: "Email/inbox ticketing" },
  { icon: AlertTriangle, text: "OHS Policy and Operations" },
  { icon: Wallet, text: "Budgeting & Headcount Planning" },
  { icon: ClipboardList, text: "HR Project Management" },
  { icon: Umbrella, text: "Leave Management" },
  { icon: Calendar, text: "Scheduling" },
  { icon: Building2, text: "Organisational Charts" },
]

function HrLifecycleSection({ stages: resolvedLifecycleStages }: { stages: { n?: string; title?: string; body?: string }[] }) {
  return (
    <section
      className="bg-white px-4 relative overflow-hidden"
      style={{ paddingTop: 96, paddingBottom: 96 }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2
          className="text-center font-bold"
          style={{ color: "#10003a", fontSize: "clamp(26px, 6.5vw, 40px)", lineHeight: 1.2, marginBottom: 56 }}
        >
          Supporting Each Stage of Your HR Life Cycle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 32, columnGap: 56 }}>
          {resolvedLifecycleStages.map((stage: { n?: string; title?: string; body?: string }, i: number) => (
            <div key={stage.n || i} className="flex flex-col" style={{ gap: 12 }}>
              <p style={{ color: "#8015e8", fontSize: 40, fontWeight: 300, lineHeight: 1 }}>{stage.n}</p>
              <p style={{ color: "#10003a", fontSize: 18, fontWeight: 700 }}>{stage.title}</p>
              <p style={{ color: "#4a4a4a", fontSize: 14, lineHeight: "22px" }}>{stage.body}</p>
              {stage.n === "04" && (
                <div className="rounded-card overflow-hidden" style={{ marginTop: 8, maxWidth: 460 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hr-lifecycle-stage-04.gif"
                    alt="System rollout"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HrExpertiseSection() {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, backgroundColor: "#ebd9ff" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2
          className="text-center font-bold"
          style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 16 }}
        >
          Our monday CRM consulting expertise
        </h2>
        <p
          className="text-center mx-auto"
          style={{ color: "#4a4a4a", fontSize: 15, lineHeight: "24px", maxWidth: 820, marginBottom: 48 }}
        >
          Streamline your HR operations and strategic management systems with monday.com,
          through intelligent automation and data tracking; you can enhance your entire
          employee lifecycle from strategic recruitment workflow planning through to
          comprehensive HR project management. From hiring, engagement surveys, and
          collaboration portals. Seamlessly connect strategy to execution by managing
          company projects, contract administration, and performance initiatives across
          all phases of your employee&apos;s journey from hire to retire.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          <div
            className="rounded-card"
            style={{ padding: 28, border: "1px solid #ece7fb", backgroundColor: "#f9f7ff" }}
          >
            <h3 className="font-bold" style={{ fontSize: 20, color: "#8015e8", marginBottom: 16 }}>
              Hiring
            </h3>
            <ul className="flex flex-col" style={{ gap: 10 }}>
              {HR_HIRING_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.text}
                    className="flex items-start"
                    style={{ gap: 10, fontSize: 14, lineHeight: "22px", color: "#444" }}
                  >
                    <Icon size={18} aria-hidden style={{ flexShrink: 0, marginTop: 2, color: "#8015e8" }} />
                    <span>{item.text}</span>
                  </li>
                )
              })}
            </ul>
          </div>
          <div
            className="rounded-card"
            style={{ padding: 28, border: "1px solid #ece7fb", backgroundColor: "#f9f7ff" }}
          >
            <h3 className="font-bold" style={{ fontSize: 20, color: "#8015e8", marginBottom: 16 }}>
              HR Operations
            </h3>
            <ul className="flex flex-col" style={{ gap: 10 }}>
              {HR_OPERATIONS_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.text}
                    className="flex items-start"
                    style={{ gap: 10, fontSize: 14, lineHeight: "22px", color: "#444" }}
                  >
                    <Icon size={18} aria-hidden style={{ flexShrink: 0, marginTop: 2, color: "#8015e8" }} />
                    <span>{item.text}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function HrFitSection({ calendlyUrl, reasons: resolvedFitReasons }: { calendlyUrl: string; reasons: { title?: string; body?: string }[] }) {
  return (
    <section className="px-4 relative overflow-hidden" style={{ paddingTop: 96, paddingBottom: 96, backgroundColor: "#ebd9ff" }}>
      {/* Decorative orbs */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: -120,
          right: -120,
          width: 360,
          height: 360,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(128,21,232,0.18), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: -120,
          left: -120,
          width: 320,
          height: 320,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(186,131,240,0.22), transparent 70%)",
        }}
      />

      <div className="relative mx-auto" style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div className="flex flex-col items-center text-center" style={{ marginBottom: 56 }}>
          <span
            className="uppercase font-bold tracking-[0.18em]"
            style={{ color: "#8015e8", fontSize: 12, marginBottom: 14 }}
          >
            Built for People &amp; Culture
          </span>
          <h2
            className="font-bold"
            style={{ color: "#10003a", fontSize: 38, lineHeight: "46px", maxWidth: 820 }}
          >
            Why monday.com is the perfect fit for People and Culture Teams
          </h2>
          <Link
            href={calendlyUrl}
            className="inline-flex items-center justify-center font-semibold transition-transform hover:-translate-y-[1px]"
            style={{
              marginTop: 28,
              height: 50,
              padding: "0 28px",
              borderRadius: 999,
              background: "linear-gradient(to right, #8015e8, #ba83f0)",
              color: "white",
              fontSize: 15,
              boxShadow: "0 12px 28px -10px rgba(128,21,232,0.55)",
            }}
          >
            Schedule a Meeting
            <svg width="10" height="14" viewBox="0 0 8 14" fill="none" style={{ marginLeft: 10 }}>
              <path d="M1 1L7 7L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {resolvedFitReasons.map((r: { title?: string; body?: string }, i: number) => (
            <div
              key={r.title || i}
              className="relative bg-white transition-transform hover:-translate-y-[2px]"
              style={{
                borderRadius: 20,
                padding: "24px 26px",
                boxShadow: "0 1px 0 rgba(16,0,58,0.04), 0 18px 32px -22px rgba(64,12,140,0.25)",
                border: "1px solid rgba(128,21,232,0.08)",
              }}
            >
              <div className="flex items-center" style={{ gap: 14, marginBottom: 10 }}>
                <span
                  className="flex items-center justify-center font-bold"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)",
                    color: "white",
                    fontSize: 13,
                    letterSpacing: "0.04em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-bold" style={{ color: "#10003a", fontSize: 17, lineHeight: "22px" }}>
                  {r.title}
                </p>
              </div>
              <p style={{ fontSize: 14, lineHeight: "22px", color: "#56516a", paddingLeft: 52 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HrVideoSection() {
  return (
    <section className="px-4" style={{ paddingTop: 40, paddingBottom: 80, backgroundColor: "#ebd9ff" }}>
      <div className="mx-auto w-full" style={{ maxWidth: 1100 }}>
        <div className="rounded-card overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
          <YouTubeEmbed videoId="g83dt0bCG4I" title="Improve your HR processes" />
        </div>
      </div>
    </section>
  )
}

export default function MondayForHrContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null

  const calendlyUrl = siteSettings?.calendlyLink ?? ""

  const featuredTestimonial = caseStudies[0]

  return (
    <div>
      {/* Hero */}
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
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
      />

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3-tab section */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        subheading={page.comparisonSubheading}
        tabs={page.comparisonTabs ?? []}
        theme={page.comparisonTheme || "light"}
        withPurpleCircle={page.comparisonWithPurpleCircle ?? true}
      />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* FAQ */}
      {!page.hideFaqSection && ((faqTabs && faqTabs.length > 0) ? (
        <FaqAccordion heading="Frequently asked questions" tabs={faqTabs} />
      ) : page.faqTabs?.length > 0 ? (
        <FaqAccordion heading="Frequently asked questions" tabs={page.faqTabs} />
      ) : null)}

      {/* Sections below FAQ (per screenshot) */}
      <HrLifecycleSection stages={page.lifecycleStages ?? []} />
      <HrExpertiseSection />
      <HrFitSection calendlyUrl={calendlyUrl} reasons={page.fitReasons ?? []} />
      <HrVideoSection />

      {/* Closing sections */}
      {!page.hideTestimonialsSection && <TestimonialsGrid caseStudies={caseStudies} />}
      {!page.hideDiscoverSection && (
        <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />
      )}
      {!page.hideJoinStatsSection && page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel={page.joinCtaLabel}
          ctaUrl={page.joinCtaUrl || calendlyUrl}
          siteSettings={siteSettings || undefined}
        />
      )}
      <TestimonialCtaBanner
        headingPart1="Join "
        headingAccent="500+ organisations"
        headingPart2=" that have maximised their workflows with our monday.com expert support"
        primaryCtaUrl={calendlyUrl}
        secondaryCtaUrl={calendlyUrl}
        testimonial={featuredTestimonial}
        testimonials={caseStudies}
      />
    </div>
  )
}
