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
import type {
  CaseStudy,
  SiteSettingsData,
  FaqTab,
  PartnerBadge,
  SanityImageRef,
} from "@/components/sections/types"
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

interface EmojiItem {
  emoji?: string
  text?: string
  _key?: string
}

interface EmojiCard {
  emoji?: string
  title?: string
  description?: string
  _key?: string
}

interface ApproachTab {
  label?: string
  items?: EmojiItem[]
  _key?: string
}

interface NumberedSection {
  number?: string
  title?: string
  bullets?: EmojiItem[]
  _key?: string
}

interface IndustryTab {
  label?: string
  description?: string
  sections?: NumberedSection[]
  _key?: string
}

interface ProductDevTab {
  label?: string
  description?: string
  bullets?: EmojiItem[]
  image?: SanityImageRef
  imageAlt?: string
  _key?: string
}

function youtubeEmbedUrl(url?: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "")
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url
      const v = u.searchParams.get("v")
      return v ? `https://www.youtube.com/embed/${v}` : null
    }
  } catch {
    return null
  }
  return null
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MondayProductManagementContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const partnerBadges: PartnerBadge[] = siteSettings?.navbarPartnerBadges || []
  const heroVideoEmbedSrc = youtubeEmbedUrl(page.heroVideoUrl)

  const featuredTestimonial =
    caseStudies.find(
      (c) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies[0]

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center px-4"
          style={{
            maxWidth: 1200,
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          {/* Partner badges */}
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
            <span className="text-black">
              {page.heroHeading || page.title || ""}
            </span>
          </h1>

          {/* Subheading */}
          {!page.hideHeroSubheading && page.heroSubheading && (
            <p
              className="text-body-lead text-center text-black"
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
            style={{ gap: 20, marginTop: 40, maxWidth: 680, width: "100%" }}
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
                        border: "1px solid #8015e8",
                        backgroundColor: "white",
                        color: "#8015e8",
                      }
                    : {
                        background:
                          "linear-gradient(to right, #8015e8, #ba83f0)",
                        color: "white",
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
                  background: "linear-gradient(to right, #8015e8, #ba83f0)",
                  fontSize: 16,
                }}
              >
                {page.secondaryCtaLabel}
              </Link>
            )}
          </div>

          {/* Hero image */}
          {(() => {
            const heroSrc = safeImageUrl(page.heroImage)
            if (!heroSrc) return null
            return (
              <div style={{ marginTop: 40, width: "100%", maxWidth: 1042 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroSrc}
                  alt={page.heroHeading || "monday.com product management boards"}
                  className="rounded-card"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            )
          })()}
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
      {heroVideoEmbedSrc && (
        <section className="bg-white" style={{ paddingBottom: 80 }}>
          <div className="mx-auto" style={{ maxWidth: 1042 }}>
            <div
              className="rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9" }}
            >
              <YouTubeEmbed url={heroVideoEmbedSrc} title={page.heroVideoTitle || "Video"} />
            </div>
          </div>
        </section>
      )}

      {/* 4. Why Product Teams Choose monday.com */}
      <WhyProductTeamsSection
        headingPart1={page.whyProductTeamsHeadingPart1}
        headingAccent={page.whyProductTeamsHeadingAccent}
        subheading={page.whyProductTeamsSubheading}
        cards={page.whyProductTeamsCards}
      />

      {/* 5. How to Manage Products — Strategic Approach */}
      <StrategicApproachSection
        headingPart1={page.strategicApproachHeadingPart1}
        headingAccent={page.strategicApproachHeadingAccent}
        subheading={page.strategicApproachSubheading}
        tabs={page.strategicApproachTabs}
      />

      {/* 5b. Local Consultants — Product Development */}
      <ProductDevelopmentSection
        headingPart1={page.productDevelopmentHeadingPart1}
        headingAccent={page.productDevelopmentHeadingAccent}
        headingPart2={page.productDevelopmentHeadingPart2}
        tabs={page.productDevelopmentTabs}
      />

      {/* 6. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 7. Industry-Specific Product Management Solutions */}
      <IndustrySpecificSection
        heading={page.industryProductSolutionsHeading}
        tabs={page.industryProductSolutionsTabs}
      />

      {/* 8. FAQ */}
      {!page.hideFaqSection && (
        <FaqAccordion
          heading="Frequently asked questions"
          tabs={
            faqTabs && faqTabs.length > 0
              ? faqTabs
              : page.faqTabs ?? []
          }
        />
      )}

      {/* 9. How to Manage Products — 3-card strategic approach */}
      <StrategicApproachCardsSection
        headingPart1={page.strategicApproachHeadingPart1}
        headingAccent={page.strategicApproachHeadingAccent}
        subheading={page.strategicApproachSubheading}
        tabs={page.strategicApproachTabs}
      />

      {/* 10. Testimonial CTA Banner */}
      {!page.hideTestimonialBanner && (
        <TestimonialCtaBanner
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          primaryCtaUrl={calendlyUrl}
          secondaryCtaUrl={calendlyUrl}
          testimonial={featuredTestimonial}
          testimonials={caseStudies}
        />
      )}

    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  How to Manage Products — Strategic Approach Cards                  */
/* ------------------------------------------------------------------ */

interface StrategicApproachCardsSectionProps {
  headingPart1?: string
  headingAccent?: string
  subheading?: string
  tabs?: ApproachTab[]
}

function StrategicApproachCardsSection({
  headingPart1,
  headingAccent,
  subheading,
  tabs,
}: StrategicApproachCardsSectionProps) {
  if (!tabs || tabs.length === 0) return null

  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1100 }}>
        <h2 className="text-section-h2 text-center text-black" style={{ maxWidth: 900 }}>
          {headingPart1}
          <span style={{ color: "#8015e8" }}>{headingAccent}</span>
        </h2>
        {subheading && (
          <p
            className="text-body text-center mx-auto"
            style={{ color: "#4a4a4a", maxWidth: 820, marginTop: 16 }}
          >
            {subheading}
          </p>
        )}

        <div
          className="grid grid-cols-1 md:grid-cols-3 w-full"
          style={{ gap: 24, marginTop: 48 }}
        >
          {tabs.map((card, i) => (
            <div
              key={card._key || card.label || `strat-card-${i}`}
              className="flex flex-col bg-[#f7f5fc] rounded-card border border-[#ece7fb]"
              style={{ padding: 28 }}
            >
              <h3 className="font-bold" style={{ fontSize: 18, color: "#8015e8", marginBottom: 16 }}>
                {card.label}
              </h3>
              <ul className="flex flex-col" style={{ gap: 12 }}>
                {(card.items ?? []).map((item, ii) => (
                  <li
                    key={item._key || item.text || `strat-item-${i}-${ii}`}
                    className="flex items-start"
                    style={{ fontSize: 14, lineHeight: "22px", color: "#444", gap: 10 }}
                  >
                    <span style={{ fontSize: 20, lineHeight: "22px", flexShrink: 0 }}>{item.emoji}</span>
                    <span>{item.text}</span>
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

/* ------------------------------------------------------------------ */
/*  Why Product Teams Choose monday.com                                */
/* ------------------------------------------------------------------ */

interface WhyProductTeamsSectionProps {
  headingPart1?: string
  headingAccent?: string
  subheading?: string
  cards?: EmojiCard[]
}

function WhyProductTeamsSection({
  headingPart1,
  headingAccent,
  subheading,
  cards,
}: WhyProductTeamsSectionProps) {
  if (!cards || cards.length === 0) return null

  return (
    <section
      style={{
        backgroundColor: "#f7f5ff",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        <h2
          className="text-section-h2 text-center"
          style={{ color: "#000", marginBottom: 16 }}
        >
          {headingPart1}
          <span style={{ color: "#8015e8", display: "block" }}>{headingAccent}</span>
        </h2>
        {subheading && (
          <p
            className="text-body text-center mx-auto"
            style={{
              color: "#4a4a4a",
              maxWidth: 820,
              marginBottom: 48,
            }}
          >
            {subheading}
          </p>
        )}

        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: 24 }}
        >
          {cards.map((card, i) => (
            <div
              key={card._key || card.title || `why-card-${i}`}
              className="flex flex-col items-center text-center bg-white rounded-card border border-[#ece7fb] ui-hover-card"
              style={{ padding: 28, boxShadow: "var(--shadow-whisper)" }}
            >
              <span
                style={{ fontSize: 36, lineHeight: 1, marginBottom: 12 }}
              >
                {card.emoji}
              </span>
              <h3
                className="font-bold"
                style={{ fontSize: 20, color: "#8015e8", marginBottom: 10 }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  color: "#111",
                }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  How to Manage Products — Strategic Approach Tabs                   */
/* ------------------------------------------------------------------ */

interface StrategicApproachSectionProps {
  headingPart1?: string
  headingAccent?: string
  subheading?: string
  tabs?: ApproachTab[]
}

function StrategicApproachSection({
  headingPart1,
  headingAccent,
  subheading,
  tabs,
}: StrategicApproachSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  if (!tabs || tabs.length === 0) return null
  const active = tabs[activeTab] ?? tabs[0]

  return (
    <section
      className="bg-white px-4"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
      <div
        className="mx-auto flex flex-col items-center"
        style={{ maxWidth: 959 }}
      >
        <h2
          className="text-section-h2 text-center text-black"
          style={{ maxWidth: 900 }}
        >
          {headingPart1}
          <span style={{ color: "#8015e8" }}>{headingAccent}</span>
        </h2>
        {subheading && (
          <p
            className="text-body text-center mx-auto"
            style={{
              color: "#4a4a4a",
              maxWidth: 820,
              marginTop: 16,
              marginBottom: 40,
            }}
          >
            {subheading}
          </p>
        )}

        {/* Tab buttons */}
        <div
          className="flex justify-center flex-wrap"
          style={{ gap: 12 }}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab._key || tab.label || `approach-tab-${i}`}
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
                        "linear-gradient(to right, #8015e8, #ba83f0)",
                      color: "white",
                      boxShadow:
                        "2.83px 2.83px 15px 3px rgba(0,0,0,0.18)",
                      border: "none",
                    }
                  : {
                      backgroundColor: "white",
                      color: "#2b074d",
                      border: "1px solid #e8e6e6",
                    }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className="w-full rounded-card border border-[#e8e6e6]"
          style={{ marginTop: 32, padding: "32px 40px" }}
        >
          <h3
            className="font-semibold"
            style={{ fontSize: 22, color: "#8015e8", marginBottom: 24 }}
          >
            {active?.label}
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {(active?.items ?? []).map((item, i) => (
              <div
                key={item._key || `approach-item-${i}`}
                className="flex items-start"
                style={{ gap: 12 }}
              >
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>
                  {item.emoji}
                </span>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#2b074d",
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Industry-Specific Product Management Solutions                     */
/* ------------------------------------------------------------------ */

interface IndustrySpecificSectionProps {
  heading?: string
  tabs?: IndustryTab[]
}

function IndustrySpecificSection({
  heading,
  tabs,
}: IndustrySpecificSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  if (!tabs || tabs.length === 0) return null
  const active = tabs[activeTab] ?? tabs[0]

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1c024c 0%, #7d14e3 100%)",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        {heading && (
          <h2
            className="text-section-h2 text-center text-white"
            style={{ marginBottom: 40 }}
          >
            {heading}
          </h2>
        )}

        {/* Tab pills */}
        <div
          className="flex items-center justify-center flex-wrap"
          style={{ gap: 12, marginBottom: 40 }}
        >
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTab
            return (
              <button
                key={tab._key || tab.label || `industry-tab-${idx}`}
                onClick={() => setActiveTab(idx)}
                className="flex items-center justify-center font-bold"
                style={{
                  height: 39,
                  paddingLeft: 24,
                  paddingRight: 24,
                  borderRadius: 99,
                  fontSize: 14,
                  cursor: "pointer",
                  ...(isActive
                    ? {
                        backgroundColor: "white",
                        color: "#8015e8",
                        boxShadow: "0px 2px 8px rgba(128,21,232,0.35)",
                      }
                    : {
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }),
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab description */}
        {active?.description && (
          <p
            className="text-center mx-auto"
            style={{
              fontSize: 16,
              lineHeight: "25.6px",
              color: "#e8dcfb",
              maxWidth: 800,
              marginBottom: 32,
            }}
          >
            {active.description}
          </p>
        )}

        {/* Numbered sub-sections */}
        <div
          className="mx-auto"
          style={{ maxWidth: 900, display: "flex", flexDirection: "column", gap: 24 }}
        >
          {(active?.sections ?? []).map((section, si) => (
            <div
              key={section._key || section.number || `industry-section-${si}`}
              className="rounded-card ui-hover-card"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "32px 40px",
              }}
            >
              <div className="flex items-center" style={{ gap: 16, marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 200,
                    color: "#ba83f0",
                    lineHeight: 1,
                  }}
                >
                  {section.number}
                </span>
                <h3
                  className="font-semibold text-white"
                  style={{ fontSize: 22 }}
                >
                  {section.title}
                </h3>
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ gap: 12 }}
              >
                {(section.bullets ?? []).map((bullet, bi) => (
                  <div
                    key={bullet._key || `industry-bullet-${si}-${bi}`}
                    className="flex items-start"
                    style={{ gap: 10 }}
                  >
                    <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>
                      {bullet.emoji}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: "20px",
                        color: "white",
                      }}
                    >
                      {bullet.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Local Consultants — Product Development                            */
/* ------------------------------------------------------------------ */

interface ProductDevelopmentSectionProps {
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  tabs?: ProductDevTab[]
}

function ProductDevelopmentSection({
  headingPart1,
  headingAccent,
  headingPart2,
  tabs,
}: ProductDevelopmentSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  if (!tabs || tabs.length === 0) return null
  const active = tabs[activeTab] ?? tabs[0]
  const activeImageSrc =
    typeof active?.image === "string"
      ? active.image
      : safeImageUrl(active?.image as SanityImageRef | undefined)

  return (
    <section
      style={{
        backgroundColor: "#f7f5ff",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        <h2
          className="text-section-h2 text-center"
          style={{ color: "#000", marginBottom: 40, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}
        >
          {headingPart1}
          <span style={{ color: "#8015e8" }}>{headingAccent}</span>
          {headingPart2}
        </h2>

        {/* Tab pills */}
        <div
          className="flex items-center justify-center flex-wrap"
          style={{ gap: 12, marginBottom: 40 }}
        >
          {tabs.map((tab, i) => {
            const isActive = i === activeTab
            return (
              <button
                key={tab._key || tab.label || `prod-dev-tab-${i}`}
                onClick={() => setActiveTab(i)}
                className="cursor-pointer transition-all font-semibold"
                style={{
                  padding: "10px 24px",
                  borderRadius: 99,
                  fontSize: 15,
                  ...(isActive
                    ? {
                        background:
                          "linear-gradient(to right, #8015e8, #ba83f0)",
                        color: "white",
                        boxShadow:
                          "2.83px 2.83px 15px 3px rgba(0,0,0,0.18)",
                        border: "none",
                      }
                    : {
                        backgroundColor: "white",
                        color: "#2b074d",
                        border: "1px solid #e8e6e6",
                      }),
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div
          className="w-full rounded-card border border-[#ece7fb] bg-white"
          style={{ padding: "40px" }}
        >
          <div
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{ gap: 40, alignItems: "center" }}
          >
            {/* Text column */}
            <div>
              <h3
                className="font-semibold"
                style={{ fontSize: 24, color: "#8015e8", marginBottom: 16 }}
              >
                {active?.label}
              </h3>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#2b074d",
                  marginBottom: 24,
                }}
              >
                {active?.description}
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {(active?.bullets ?? []).map((bullet, i) => (
                  <div
                    key={bullet._key || `prod-dev-bullet-${i}`}
                    className="flex items-start"
                    style={{ gap: 12 }}
                  >
                    <span
                      style={{
                        fontSize: 22,
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      {bullet.emoji}
                    </span>
                    <p
                      style={{
                        fontSize: 16,
                        lineHeight: "24px",
                        color: "#2b074d",
                      }}
                    >
                      {bullet.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image column */}
            <div
              className="rounded-card overflow-hidden"
              style={{
                border: "1px solid #ece7fb",
                backgroundColor: "#fff",
              }}
            >
              {activeImageSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImageSrc}
                  alt={active?.imageAlt || ""}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
