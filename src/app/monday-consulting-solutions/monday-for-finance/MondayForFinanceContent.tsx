"use client"

import { useState } from "react"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import {
  LogoCloudMarquee,
  CalendlySection,
  FaqAccordion,
  TestimonialCtaBanner,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, FaqTab, PartnerBadge, SanityImageRef } from "@/components/sections/types"
import YouTubeEmbed from "@/components/YouTubeEmbed"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).url()
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MondayForFinanceContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null

  const calendlyUrl = siteSettings?.calendlyLink ?? ""
  const partnerBadges: PartnerBadge[] = siteSettings?.navbarPartnerBadges || []
  const heroImageSrc = safeImageUrl(page.heroImage as SanityImageRef)
  const tabs: FinanceComparisonTab[] = page.comparisonTabs ?? []
  const featureCards: FinanceFeatureCard[] = page.financeFeatureCards ?? []

  return (
    <div>
      {/* 1. Hero — certificates on top, no small image */}
      <section className="bg-surface">
        <div
          className="mx-auto flex flex-col items-center"
          style={{
            paddingLeft: 273,
            paddingRight: 273,
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          {/* Three certificate badges */}
          {partnerBadges.length > 0 && (
            <div className="flex items-center" style={{ gap: 22 }}>
              {partnerBadges.map((badge, i) => {
                const src = safeImageUrl(badge.image)
                if (!src) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={badge._key || `badge-${i}`}
                    src={src}
                    alt={badge.name || "Partner badge"}
                    width={120}
                    height={44}
                    className="h-[44px] w-auto rounded-[5px]"
                  />
                )
              })}
            </div>
          )}

          {/* Eyebrow */}
          {page.heroEyebrow && (
            <div
              style={{
                marginTop: 32,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--purple-primary)",
              }}
            >
              {page.heroEyebrow}
            </div>
          )}

          {/* Heading */}
          <h1
            className="text-display text-center"
            style={{
              marginTop: page.heroEyebrow ? 16 : 42,
              maxWidth: 924,
            }}
          >
            <span className="text-ink">
              {page.heroHeading || page.title || ""}
            </span>
          </h1>

          {/* Subheading */}
          {!page.hideHeroSubheading && page.heroSubheading && (
            <p
              className="text-body-lead text-center text-ink"
              style={{
                marginTop: 31,
                maxWidth: 859,
                whiteSpace: "pre-line",
              }}
            >
              {page.heroSubheading}
            </p>
          )}

          {/* CTA buttons */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 20, marginTop: 40, width: 680 }}
          >
            {page.primaryCtaLabel && (
              <Link
                href={page.primaryCtaUrl || calendlyUrl}
                className="flex items-center justify-center font-bold"
                style={{
                  width: 330,
                  height: 53,
                  borderRadius: 100,
                  ...(page.secondaryCtaLabel
                    ? {
                        border: "1px solid var(--brand)",
                        backgroundColor: "var(--surface)",
                        color: "var(--brand)",
                      }
                    : {
                        background:
                          "linear-gradient(to right, var(--purple-primary), var(--purple-light))",
                        color: "var(--white)",
                      }),
                  fontSize: 16,
                }}
              >
                {page.primaryCtaLabel}
              </Link>
            )}
            {page.secondaryCtaLabel && (
              <Link
                href={page.secondaryCtaUrl || calendlyUrl}
                className="flex items-center justify-center font-bold text-white"
                style={{
                  width: 330,
                  height: 53,
                  borderRadius: 100,
                  background: "linear-gradient(to right, var(--purple-primary), var(--purple-light))",
                  fontSize: 16,
                }}
              >
                {page.secondaryCtaLabel}
              </Link>
            )}
          </div>

          {/* Hero image */}
          {heroImageSrc && (
            <div style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt={page.heroHeading || "Hero"}
                className="rounded-card"
                style={{ width: "100%", maxWidth: 1042, height: "auto" }}
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Video (underneath logo scroll) */}
      {page.heroVideoUrl && (
        <section className="bg-surface" style={{ paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1042 }}>
            <div
              className="rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9" }}
            >
              <YouTubeEmbed url={page.heroVideoUrl} title={page.heroVideoTitle} />
            </div>
          </div>
        </section>
      )}

      {/* 4. Tab selector section */}
      <FinanceTabsSection
        tabs={tabs}
        headingPart1={page.comparisonHeading}
        headingAccent={page.comparisonHeadingAccent}
      />

      {/* 5. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 6. FAQ */}
      {(faqTabs ?? []).length > 0 && (
        <FaqAccordion heading={page.faqHeading} tabs={faqTabs ?? []} />
      )}

      {/* 7. Feature cards section */}
      <BottomFeatureSection
        cards={featureCards}
        headingPart1={page.bottomFeatureSectionHeadingPart1}
        headingAccent={page.bottomFeatureSectionHeadingAccent}
        videoUrl={page.bottomVideoUrl}
        videoTitle={page.bottomVideoTitle}
      />

      {/* 8. Join 500+ CTA */}
      <TestimonialCtaBanner
        testimonial={caseStudies?.[0]}
        testimonials={caseStudies}
      />

    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Finance Tabs Section                                               */
/* ------------------------------------------------------------------ */

type FinanceComparisonTab = { label?: string; subheading?: string; items?: Array<{ icon?: string; title?: string; description?: string }> }
type FinanceFeatureCard = { emoji?: string; title?: string; description?: string }

function FinanceTabsSection({
  tabs,
  headingPart1,
  headingAccent,
}: {
  tabs: FinanceComparisonTab[]
  headingPart1?: string
  headingAccent?: string
}) {
  const [activeTab, setActiveTab] = useState(0)
  const active = tabs[activeTab]
  if (tabs.length === 0) return null

  return (
    <section
      className="px-4"
      style={{
        paddingTop: 80,
        paddingBottom: 80,
        background: "linear-gradient(180deg,var(--surface-tint-2) 0%,var(--surface) 60%)",
      }}
    >
      <div
        className="mx-auto flex flex-col items-center"
        style={{ maxWidth: 959 }}
      >
        {(headingPart1 || headingAccent) && (
          <h2
            className="text-section-h2 text-center text-ink"
            style={{ maxWidth: 900 }}
          >
            {headingPart1}
            {headingPart1 && headingAccent ? " " : ""}
            {headingAccent && (
              <span style={{ color: "var(--brand)" }}>{headingAccent}</span>
            )}
          </h2>
        )}

        {/* Tab buttons */}
        <div
          className="flex justify-center flex-wrap"
          style={{ gap: 12, marginTop: 40, width: "max-content", maxWidth: "100vw", overflow: "visible" }}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className="cursor-pointer transition-all whitespace-nowrap shrink-0"
              style={{
                padding: "10px 32px",
                borderRadius: 99,
                fontSize: 16,
                fontWeight: 600,
                ...(i === activeTab
                  ? {
                      background:
                        "linear-gradient(to right, var(--purple-primary), var(--purple-light))",
                      color: "var(--white)",
                      boxShadow:
                        "2.83px 2.83px 15px 3px rgba(0,0,0,0.18)",
                      border: "none",
                    }
                  : {
                      backgroundColor: "var(--surface)",
                      color: "var(--navy-700)",
                      border: "1px solid var(--line)",
                    }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab heading */}
        {active?.subheading && (
          <h3
            className="text-center font-semibold"
            style={{ fontSize: 22, color: "var(--brand)", marginTop: 40 }}
          >
            {active.subheading}
          </h3>
        )}

        {/* Numbered items */}
        <div
          className="w-full rounded-card border border-line"
          style={{ marginTop: 24, padding: "12px 0" }}
        >
          {(active.items ?? []).map((item, i) => (
            <div
              key={item.title || i}
              className="ui-step-row"
              style={{
                padding: "24px 40px",
                borderBottom:
                  i < (active.items?.length ?? 0) - 1
                    ? "1px solid var(--line-soft)"
                    : "none",
              }}
            >
              <span
                className="ui-step-number"
                style={{
                  fontSize: 40,
                  fontWeight: 200,
                  lineHeight: 1,
                  minWidth: 56,
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div style={{ flex: 1 }}>
                <p
                  className="font-bold"
                  style={{ fontSize: 18, color: "var(--navy-700)" }}
                >
                  {"icon" in item && (item as { icon?: string }).icon
                    ? `${(item as { icon?: string }).icon} `
                    : ""}
                  {item.title}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: "22px",
                    color: "var(--ink-soft)",
                    marginTop: 8,
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Bottom Feature Cards Section                                       */
/* ------------------------------------------------------------------ */

function BottomFeatureSection({
  cards,
  headingPart1,
  headingAccent,
  videoUrl,
  videoTitle,
}: {
  cards: FinanceFeatureCard[]
  headingPart1?: string
  headingAccent?: string
  videoUrl?: string
  videoTitle?: string
}) {
  if (cards.length === 0 && !videoUrl) return null
  return (
    <section style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(180deg, var(--surface-tint-2) 0%, var(--surface) 100%)" }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1100 }}>
        {/* Title */}
        {(headingPart1 || headingAccent) && (
          <h2
            className="text-section-h2 text-center"
            style={{ color: "var(--navy-700)", maxWidth: 900, margin: "0 auto" }}
          >
            {headingPart1}
            {headingPart1 && headingAccent ? " " : ""}
            {headingAccent && (
              <span style={{ color: "var(--brand)" }}>{headingAccent}</span>
            )}
          </h2>
        )}

        {/* 3x3 feature grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 24, marginTop: 40 }}
        >
          {cards.map((card, i) => (
            <div
              key={card.title || i}
              className="flex flex-col items-center text-center bg-surface rounded-card border border-line-tint"
              style={{
                padding: 28,
                boxShadow: "var(--shadow-whisper)",
              }}
            >
              <span style={{ fontSize: 36, lineHeight: 1, marginBottom: 12 }}>
                {card.emoji}
              </span>
              <h4
                className="font-bold"
                style={{ fontSize: 18, color: "var(--brand)" }}
              >
                {card.title}
              </h4>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  color: "var(--ink-soft)",
                  marginTop: 10,
                }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* YouTube video below the feature grid */}
        {videoUrl && (
          <div
            className="w-full rounded-card overflow-hidden"
            style={{ marginTop: 56, aspectRatio: "16 / 9" }}
          >
            <YouTubeEmbed url={videoUrl} title={videoTitle} />
          </div>
        )}
      </div>
    </section>
  )
}
