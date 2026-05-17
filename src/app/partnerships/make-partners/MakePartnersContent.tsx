"use client"

import { useState } from "react"
import {
  LogoCloudMarquee,
  CalendlySection,
  JoinStatsSection,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, ComparisonTab } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"

/* ------------------------------------------------------------------ */
/*  Make Feature Tabs — hardcoded content                              */
/* ------------------------------------------------------------------ */

type MakeFeatureGroup = {
  number: string
  title?: string
  bullets: { emoji: string; text: string }[]
}

type MakeFeatureTab = {
  key: string
  label: string
  heading: string
  intro?: string
  groups: MakeFeatureGroup[]
  outro?: string
}

const MAKE_FEATURE_TABS: MakeFeatureTab[] = [
  {
    key: "features",
    label: "make.com Features",
    heading: "Transform Your Business with make Automations",
    groups: [
      {
        number: "01",
        title: "As a Gold Partner, we leverage make's features to transform your operations:",
        bullets: [
          { emoji: "🔗", text: "Unlimited Integration Possibilities: Connect seamlessly with 1000+ apps and services" },
          { emoji: "⚡", text: "Real-Time Execution: Experience immediate process automation that responds instantly to triggers" },
          { emoji: "🔒", text: "Enterprise-Grade Security: Trust in our SOC 2 Type II certified platform for maximum protection" },
          { emoji: "📈", text: "Scalable Architecture: Effortlessly handle millions of operations as your business grows" },
        ],
      },
      {
        number: "02",
        title: "Streamline operations and eliminate workflow friction:",
        bullets: [
          { emoji: "🤖", text: "Automate repetitive tasks that drain your team's productivity and consume valuable working hours" },
          { emoji: "✋", text: "Reduce manual data entry errors while saving time and improving overall operational accuracy" },
          { emoji: "🎯", text: "Enhance process accuracy with consistent, reliable automation that delivers predictable results every time" },
          { emoji: "🚀", text: "Accelerate workflow execution across all departments to boost team performance and output" },
        ],
      },
      {
        number: "03",
        title: "Improve efficiency and maximise your operational potential:",
        bullets: [
          { emoji: "🔄", text: "Connect disparate systems into one cohesive ecosystem that works harmoniously across platforms" },
          { emoji: "📊", text: "Synchronise data in real-time across all platforms to ensure information consistency and accessibility" },
          { emoji: "🚧", text: "Eliminate process bottlenecks that slow down your business and create operational inefficiencies" },
          { emoji: "📏", text: "Scale operations seamlessly without adding complexity or requiring additional manual oversight" },
        ],
      },
      {
        number: "04",
        title: "Drive innovation and stay ahead of the competition:",
        bullets: [
          { emoji: "🛠️", text: "Create custom automation solutions tailored to your unique business needs and specific requirements" },
          { emoji: "🔧", text: "Implement advanced integrations that unlock new possibilities and enhance your existing systems" },
          { emoji: "🧠", text: "Deploy intelligent workflows that adapt to your business requirements and evolving operational demands" },
          { emoji: "⚙️", text: "Optimise business processes for maximum efficiency, growth, and long-term competitive advantage" },
        ],
      },
    ],
  },
  {
    key: "why-fruition",
    label: "Why Choose Fruition?",
    heading: "Why Partner with Fruition for make Automations?",
    groups: [
      {
        number: "01",
        title: "Our Gold Partner status demonstrates our expertise in:",
        bullets: [
          { emoji: "🔧", text: "Advanced automation capabilities to handle complex business requirements" },
          { emoji: "🎯", text: "Complex multi-step workflow design for sophisticated process automation" },
          { emoji: "🔄", text: "Real-time data synchronisation across all your connected systems" },
          { emoji: "🛡️", text: "Error handling and monitoring systems for reliable operation" },
          { emoji: "🔗", text: "Custom API integration development tailored to your needs" },
        ],
      },
      {
        number: "02",
        title: "Enterprise integration solutions that connect your entire business ecosystem:",
        bullets: [
          { emoji: "📊", text: "Cross-platform data management for seamless information flow" },
          { emoji: "🏢", text: "Legacy system connectivity to modernise existing infrastructure" },
          { emoji: "☁️", text: "Cloud service orchestration for optimal performance" },
          { emoji: "🔒", text: "Secure data transfer protocols ensuring complete protection" },
          { emoji: "⚙️", text: "Scalable architecture design that grows with your business" },
        ],
      },
      {
        number: "03",
        title: "Professional services that guide you from concept to completion:",
        bullets: [
          { emoji: "👨‍💼", text: "Expert implementation guidance throughout your automation journey" },
          { emoji: "🛠️", text: "Custom scenario development aligned with your business goals" },
          { emoji: "🎓", text: "Team training and enablement for long-term success" },
          { emoji: "🤝", text: "Ongoing support and optimisation for continuous improvement" },
          { emoji: "📈", text: "Strategic consulting to maximize your automation ROI" },
        ],
      },
      {
        number: "04",
        title: "Drive Innovation and transform your operational capabilities:",
        bullets: [
          { emoji: "💡", text: "Create custom automation solutions that solve unique challenges" },
          { emoji: "🔧", text: "Implement advanced integrations for enhanced functionality" },
          { emoji: "🧠", text: "Deploy intelligent workflows that adapt to changing needs" },
          { emoji: "⚙️", text: "Optimise business processes for maximum efficiency" },
          { emoji: "🚀", text: "Future-proof your operations with cutting-edge technology" },
        ],
      },
      {
        number: "05",
        title: "Partner-Led Implementation Advantages that ensure your success:",
        bullets: [
          { emoji: "🎯", text: "Expert scenario development from certified make specialists" },
          { emoji: "📋", text: "Best practices implementation based on proven methodologies" },
          { emoji: "⚡", text: "Performance optimisation for maximum speed and reliability" },
          { emoji: "🛟", text: "Comprehensive support throughout implementation and beyond" },
          { emoji: "🔮", text: "Future-proof solutions designed to evolve with your business" },
        ],
      },
    ],
  },
  {
    key: "how-we-help",
    label: "How We Can Help",
    heading: "Transform your business operations with Fruition's make Gold Partner expertise.",
    groups: [
      {
        number: "01",
        title: "Our certified team will guide you through:",
        bullets: [
          { emoji: "📋", text: "Automation strategy development" },
          { emoji: "🎨", text: "Workflow design and implementation" },
          { emoji: "🔗", text: "System integration and testing" },
          { emoji: "🔧", text: "Ongoing optimisation and support" },
        ],
      },
      {
        number: "02",
        title: "As your dedicated make Gold Partner, we specialise in:",
        bullets: [
          { emoji: "⚙️", text: "Advanced Workflow Design" },
          { emoji: "🔌", text: "System Integration Development" },
          { emoji: "🛠️", text: "Custom Automation Solutions" },
          { emoji: "📈", text: "Enterprise Scaling Support" },
        ],
      },
    ],
    outro:
      "Contact Fruition's Make automation experts to begin your digital transformation journey. As a certified Gold Partner, we deliver enterprise-grade automation solutions that drive efficiency and growth. Transform your business operations and bring your workflows to Fruition.",
  },
]

function MakeFeatureTabsSection({ tabs }: { tabs: MakeFeatureTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  if (!active) return null
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 32, lineHeight: "40px", marginBottom: 32 }}>
          {active.heading}
        </h2>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginBottom: 40 }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => setActiveIdx(i)}
              className="cursor-pointer transition-all whitespace-nowrap"
              style={{
                padding: "10px 26px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                ...(i === activeIdx
                  ? { background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", border: "none", boxShadow: "0 10px 22px -12px rgba(128,21,232,0.55)" }
                  : { background: "white", color: "#2b074d", border: "1px solid #e8e6e6" }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          {active.groups.map((g: MakeFeatureGroup) => (
            <div
              key={g.number}
              className="bg-white"
              style={{
                padding: 24,
                borderRadius: 18,
                border: "1px solid rgba(128,21,232,0.08)",
                boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div className="flex items-center" style={{ gap: 14 }}>
                <span
                  className="flex items-center justify-center font-bold"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)",
                    color: "white",
                    fontSize: 13,
                  }}
                >
                  {g.number}
                </span>
                {g.title && (
                  <p className="font-bold" style={{ color: "#10003a", fontSize: 15, lineHeight: "22px" }}>
                    {g.title}
                  </p>
                )}
              </div>
              <ul className="flex flex-col" style={{ gap: 10 }}>
                {g.bullets.map((b: { emoji: string; text: string }) => (
                  <li key={b.text} className="flex items-start" style={{ gap: 10 }}>
                    <span style={{ fontSize: 18, lineHeight: "22px", flexShrink: 0 }}>{b.emoji}</span>
                    <span style={{ color: "#444", fontSize: 13, lineHeight: "20px" }}>{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {active.outro && (
          <p className="text-center mx-auto" style={{ color: "#444", fontSize: 14, lineHeight: "24px", maxWidth: 880, marginTop: 36 }}>
            {active.outro}
          </p>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageRef = any

interface ShowcaseCard {
  heading?: string
  body?: string
  imageRight?: boolean
  mediaType?: "image" | "video"
  image?: SanityImageRef
  videoUrl?: string
}

interface FeatureListItem {
  _key?: string
  emoji?: string
  text?: string
}

interface MakePartnersPageData {
  seoTitle?: string
  seoDescription?: string
  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroSubheading?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string
  heroImage?: SanityImageRef
  announcementHeading?: string
  announcementBody?: string
  announcementImage?: SanityImageRef
  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string
  comparisonHeading?: string
  comparisonTabs?: ComparisonTab[]
  featureListsHeading?: string
  featureListsSubheading?: string
  featureListsRightEyebrow?: string
  featureListsFooter?: string
  featureListLeft?: FeatureListItem[]
  featureListRight?: FeatureListItem[]
  showcaseHeading?: string
  showcaseSubheading?: string
  showcaseCards?: ShowcaseCard[]
  calendlyHeading?: string
  calendlySubheading?: string
  testimonialsHeading?: string
  testimonialsCtaLabel?: string
  testimonialsCtaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string
  joinHeadingPart1?: string
  joinHeadingAccent?: string
  joinHeadingPart2?: string
  joinStats?: Array<{ _key?: string; value?: string; label?: string }>
  joinCtaLabel?: string
  joinCtaUrl?: string
  testimonialBannerHeadingPart1?: string
  testimonialBannerHeadingAccent?: string
  testimonialBannerHeadingPart2?: string
  testimonialBannerPrimaryCtaLabel?: string
  testimonialBannerPrimaryCtaUrl?: string
  testimonialBannerSecondaryCtaLabel?: string
  testimonialBannerSecondaryCtaUrl?: string
  discoverHeading?: string
  makeFeatureTabs?: MakeFeatureTab[]
  // Sanity stores this as an array of `{ key, mediaType, mediaSrc }` objects
  // (Sanity attribute names can't contain spaces, and the keys are
  // showcase headings). The FE normalises this back to a Record before
  // merging with the hardcoded fallback. A plain Record is also accepted.
  showcaseOverrides?:
    | Record<string, { mediaType: "video" | "image"; mediaSrc: string }>
    | Array<{ _key?: string; key?: string; mediaType?: "video" | "image"; mediaSrc?: string }>
}

interface Props {
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  pageData?: MakePartnersPageData | null
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function safeSrc(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).url() } catch { return null }
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function MakePartnersContent({
  siteSettings,
  caseStudies = [],
  pageData,
}: Props) {
  const calendlyUrl = siteSettings?.calendlyLink || ""
  const partnerBadges = siteSettings?.navbarPartnerBadges || []

  void caseStudies

  const heroImageSrc = safeSrc(pageData?.heroImage)
  const announcementImageSrc = safeSrc(pageData?.announcementImage)

  type ResolvedCard = {
    heading: string
    body: string
    imageRight: boolean
    mediaType: "video" | "image"
    mediaSrc: string
  }

  const SHOWCASE_OVERRIDES: Record<string, { mediaType: "video" | "image"; mediaSrc: string }> = {
    "solve finance complexities": { mediaType: "image", mediaSrc: "/images/make-finance.avif" },
    "automation you can see, flex, and scale": { mediaType: "video", mediaSrc: "/videos/make-automation.mp4" },
  }

  // Normalise Sanity's array shape (or Record shape) into a Record keyed by
  // the lowercased heading, then merge with the hardcoded fallback so
  // Sanity-supplied keys win and untouched keys fall back.
  const sanityOverrides = pageData?.showcaseOverrides
  const sanityOverridesAsRecord: Record<string, { mediaType: "video" | "image"; mediaSrc: string }> =
    Array.isArray(sanityOverrides)
      ? sanityOverrides.reduce<Record<string, { mediaType: "video" | "image"; mediaSrc: string }>>(
          (acc, item) => {
            if (item?.key && item.mediaSrc) {
              acc[item.key.toLowerCase().trim()] = {
                mediaType: item.mediaType ?? "image",
                mediaSrc: item.mediaSrc,
              }
            }
            return acc
          },
          {}
        )
      : (sanityOverrides ?? {})
  const mergedShowcaseOverrides: Record<string, { mediaType: "video" | "image"; mediaSrc: string }> = {
    ...SHOWCASE_OVERRIDES,
    ...sanityOverridesAsRecord,
  }

  const resolvedShowcaseCards: ResolvedCard[] = (pageData?.showcaseCards ?? [])
    .map((card): ResolvedCard | null => {
      const heading = card.heading ?? ""
      const body = card.body ?? ""
      const imageRight = card.imageRight ?? true
      const override = mergedShowcaseOverrides[heading.toLowerCase().trim()]
      const mediaType = override?.mediaType ?? card.mediaType ?? "image"
      let mediaSrc = ""
      if (override) {
        mediaSrc = override.mediaSrc
      } else if (mediaType === "video") {
        mediaSrc = card.videoUrl ?? ""
      } else {
        mediaSrc = safeSrc(card.image) ?? ""
      }
      if (!mediaSrc) return null
      return { heading, body, imageRight, mediaType, mediaSrc }
    })
    .filter((c): c is ResolvedCard => c !== null)

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-white">
        <div className="mx-auto flex flex-col items-center px-6 md:px-16 lg:px-[273px] py-[80px]">
          {partnerBadges.length > 0 && (
            <div className="flex items-center flex-wrap justify-center" style={{ gap: 22 }}>
              {partnerBadges.map((badge, i) => {
                const src = safeSrc(badge.image)
                if (!src) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    key={(badge as any)._key || `badge-${i}`}
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

          {(pageData?.heroHeadingPart1 || pageData?.heroHeadingAccent) && (
            <h1
              className="text-center font-bold"
              style={{ fontSize: 48, lineHeight: "67.2px", marginTop: 42, maxWidth: 924 }}
            >
              {pageData?.heroHeadingPart1 && <span className="text-black">{pageData.heroHeadingPart1}</span>}
              {pageData?.heroHeadingAccent && <span style={{ color: "#8015e8" }}>{pageData.heroHeadingAccent}</span>}
            </h1>
          )}

          {pageData?.heroSubheading && (
            <p
              style={{
                fontSize: 18,
                lineHeight: "25.2px",
                color: "black",
                marginTop: 31,
                textAlign: "center",
                maxWidth: 859,
                whiteSpace: "pre-line",
              }}
            >
              {pageData.heroSubheading}
            </p>
          )}

          {(pageData?.heroPrimaryCtaLabel || pageData?.heroSecondaryCtaLabel) && (
            <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: 20, marginTop: 40 }}>
              {pageData?.heroPrimaryCtaLabel && (pageData.heroPrimaryCtaUrl || calendlyUrl) && (
                <CtaButton
                  href={pageData.heroPrimaryCtaUrl || calendlyUrl}
                  label={pageData.heroPrimaryCtaLabel}
                  variant="outline"
                  style={{ width: 330 }}
                />
              )}
              {pageData?.heroSecondaryCtaLabel && (pageData.heroSecondaryCtaUrl || calendlyUrl) && (
                <CtaButton
                  href={pageData.heroSecondaryCtaUrl || calendlyUrl}
                  label={pageData.heroSecondaryCtaLabel}
                  variant="primary"
                  style={{ width: 330 }}
                />
              )}
            </div>
          )}

          {heroImageSrc && (
            <div style={{ marginTop: 40, width: "100%", maxWidth: 1042 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt={pageData?.heroHeadingAccent || "Hero"}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Partnership Announcement */}
      {(pageData?.announcementHeading || pageData?.announcementBody || announcementImageSrc) && (
        <section className="bg-[#f7f7f7] py-[80px] px-4">
          <div className="mx-auto flex flex-col md:flex-row items-center justify-center gap-12" style={{ maxWidth: 1100 }}>
            <div style={{ flex: 1, maxWidth: 650 }}>
              {pageData?.announcementHeading && (
                <h2 className="text-section-h2 text-black" style={{ marginBottom: 20 }}>
                  {pageData.announcementHeading}
                </h2>
              )}
              {pageData?.announcementBody && (
                <p style={{ fontSize: 18, lineHeight: "28.8px", color: "black" }}>
                  {pageData.announcementBody}
                </p>
              )}
            </div>
            {announcementImageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={announcementImageSrc}
                alt={pageData?.announcementHeading || "Partnership"}
                width={233}
                height={233}
                className="rounded-[16px] shrink-0"
              />
            )}
          </div>
        </section>
      )}

      {/* 3. Logo Cloud */}
      {(pageData?.logoCloudHeadingPart1 || pageData?.logoCloudHeadingAccent) && (
        <LogoCloudMarquee
          headingPart1={pageData?.logoCloudHeadingPart1}
          headingAccent={pageData?.logoCloudHeadingAccent}
          logos={siteSettings?.carouselLogos || []}
        />
      )}

      {/* 4. Make Feature Tabs — Sanity-driven with hardcoded fallback */}
      <MakeFeatureTabsSection
        tabs={(pageData?.makeFeatureTabs && pageData.makeFeatureTabs.length > 0) ? pageData.makeFeatureTabs : MAKE_FEATURE_TABS}
      />


      {/* 6. Calendly */}
      {(pageData?.calendlyHeading || pageData?.calendlySubheading) && (
        <CalendlySection
          heading={pageData?.calendlyHeading}
          subheading={pageData?.calendlySubheading}
          calendlyUrl={calendlyUrl}
        />
      )}

      {/* 7. Showcase */}
      {resolvedShowcaseCards.length > 0 && (
        <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
            <div className="flex flex-col items-center text-center" style={{ marginBottom: 60 }}>
              {pageData?.showcaseHeading && (
                <h2 className="text-section-h2 text-black" style={{ maxWidth: 900 }}>
                  {pageData.showcaseHeading}
                </h2>
              )}
              {pageData?.showcaseSubheading && (
                <p className="text-black" style={{ fontSize: 20, marginTop: 12, maxWidth: 760 }}>
                  {pageData.showcaseSubheading}
                </p>
              )}
            </div>

            <div className="flex flex-col" style={{ gap: 60 }}>
              {resolvedShowcaseCards.map((card, i) => (
                <div
                  key={`showcase-${i}`}
                  className={`flex flex-col items-center gap-10 ${card.imageRight ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 600, color: "#2b074d", lineHeight: "36px" }}>
                      {card.heading}
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: "25.6px", color: "black", marginTop: 20 }}>
                      {card.body}
                    </p>
                  </div>
                  <div
                    className="rounded-card overflow-hidden w-full"
                    style={{ flex: 1, aspectRatio: "16 / 10" }}
                  >
                    {card.mediaType === "video" ? (
                      <video
                        src={card.mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.mediaSrc}
                        alt={card.heading}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Join Stats */}
      <JoinStatsSection
        headingPart1={pageData?.joinHeadingPart1}
        headingAccent={pageData?.joinHeadingAccent}
        headingPart2={pageData?.joinHeadingPart2}
        stats={pageData?.joinStats}
        ctaLabel={pageData?.joinCtaLabel}
        ctaUrl={pageData?.joinCtaUrl || calendlyUrl}
        siteSettings={siteSettings || undefined}
      />

    </div>
  )
}
