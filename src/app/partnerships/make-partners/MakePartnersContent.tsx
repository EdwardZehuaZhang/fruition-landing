"use client"

import Link from "next/link"
import {
  LogoCloudMarquee,
  ComparisonTabsSection,
  TestimonialsGrid,
  CalendlySection,
  DiscoverCtaSection,
  JoinStatsSection,
  SecurityBadgeSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, ComparisonTab } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"

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
  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string
  comparisonHeading?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparisonTabs?: any[]
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
}

interface Props {
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  pageData?: MakePartnersPageData | null
}

/* ------------------------------------------------------------------ */
/*  Fallback content from production site                               */
/* ------------------------------------------------------------------ */

const FALLBACK_COMPARISON_TABS: ComparisonTab[] = [
  {
    _key: "tab-transform",
    label: "Transform Your Business",
    items: [
      {
        _key: "t1",
        number: "01",
        title: "As a Gold Partner, we leverage make's features to transform your operations:",
        bullets: [
          { _key: "b1", emoji: "\u{1F517}", text: "Unlimited Integration Possibilities: Connect seamlessly with 1000+ apps and services" },
          { _key: "b2", emoji: "\u{26A1}", text: "Real-Time Execution: Experience immediate process automation that responds instantly to triggers" },
          { _key: "b3", emoji: "\u{1F512}", text: "Enterprise-Grade Security: Trust in our SOC 2 Type II certified platform for maximum protection" },
          { _key: "b4", emoji: "\u{1F4C8}", text: "Scalable Architecture: Effortlessly handle millions of operations as your business grows" },
        ],
      },
      {
        _key: "t2",
        number: "02",
        title: "Streamline operations and eliminate workflow friction:",
        bullets: [
          { _key: "b1", emoji: "\u{1F916}", text: "Automate repetitive tasks that drain your team's productivity and consume valuable working hours" },
          { _key: "b2", emoji: "\u{270B}", text: "Reduce manual data entry errors while saving time and improving overall operational accuracy" },
          { _key: "b3", emoji: "\u{1F3AF}", text: "Enhance process accuracy with consistent, reliable automation that delivers predictable results every time" },
          { _key: "b4", emoji: "\u{1F680}", text: "Accelerate workflow execution across all departments to boost team performance and output" },
        ],
      },
      {
        _key: "t3",
        number: "03",
        title: "Improve efficiency and maximise your operational potential:",
        bullets: [
          { _key: "b1", emoji: "\u{1F504}", text: "Connect disparate systems into one cohesive ecosystem that works harmoniously across platforms" },
          { _key: "b2", emoji: "\u{1F4CA}", text: "Synchronise data in real-time across all platforms to ensure information consistency and accessibility" },
          { _key: "b3", emoji: "\u{1F6A7}", text: "Eliminate process bottlenecks that slow down your business and create operational inefficiencies" },
          { _key: "b4", emoji: "\u{1F4CF}", text: "Scale operations seamlessly without adding complexity or requiring additional manual oversight" },
        ],
      },
      {
        _key: "t4",
        number: "04",
        title: "Drive innovation and stay ahead of the competition:",
        bullets: [
          { _key: "b1", emoji: "\u{1F6E0}\u{FE0F}", text: "Create custom automation solutions tailored to your unique business needs and specific requirements" },
          { _key: "b2", emoji: "\u{1F527}", text: "Implement advanced integrations that unlock new possibilities and enhance your existing systems" },
          { _key: "b3", emoji: "\u{1F9E0}", text: "Deploy intelligent workflows that adapt to your business requirements and evolving operational demands" },
          { _key: "b4", emoji: "\u{2699}\u{FE0F}", text: "Optimise business processes for maximum efficiency, growth, and long-term competitive advantage" },
        ],
      },
    ],
  },
  {
    _key: "tab-why-partner",
    label: "Why Partner with Fruition",
    items: [
      {
        _key: "w1",
        number: "01",
        title: "Our Gold Partner status demonstrates our expertise in:",
        bullets: [
          { _key: "b1", emoji: "\u{1F527}", text: "Advanced automation capabilities to handle complex business requirements" },
          { _key: "b2", emoji: "\u{1F3AF}", text: "Complex multi-step workflow design for sophisticated process automation" },
          { _key: "b3", emoji: "\u{1F504}", text: "Real-time data synchronisation across all your connected systems" },
          { _key: "b4", emoji: "\u{1F6E1}\u{FE0F}", text: "Error handling and monitoring systems for reliable operation" },
          { _key: "b5", emoji: "\u{1F517}", text: "Custom API integration development tailored to your needs" },
        ],
      },
      {
        _key: "w2",
        number: "02",
        title: "Enterprise integration solutions that connect your entire business ecosystem:",
        bullets: [
          { _key: "b1", emoji: "\u{1F4CA}", text: "Cross-platform data management for seamless information flow" },
          { _key: "b2", emoji: "\u{1F3E2}", text: "Legacy system connectivity to modernise existing infrastructure" },
          { _key: "b3", emoji: "\u{2601}\u{FE0F}", text: "Cloud service orchestration for optimal performance" },
          { _key: "b4", emoji: "\u{1F512}", text: "Secure data transfer protocols ensuring complete protection" },
          { _key: "b5", emoji: "\u{2699}\u{FE0F}", text: "Scalable architecture design that grows with your business" },
        ],
      },
      {
        _key: "w3",
        number: "03",
        title: "Professional services that guide you from concept to completion:",
        bullets: [
          { _key: "b1", emoji: "\u{1F468}\u{200D}\u{1F4BC}", text: "Expert implementation guidance throughout your automation journey" },
          { _key: "b2", emoji: "\u{1F6E0}\u{FE0F}", text: "Custom scenario development aligned with your business goals" },
          { _key: "b3", emoji: "\u{1F393}", text: "Team training and enablement for long-term success" },
          { _key: "b4", emoji: "\u{1F91D}", text: "Ongoing support and optimisation for continuous improvement" },
          { _key: "b5", emoji: "\u{1F4C8}", text: "Strategic consulting to maximize your automation ROI" },
        ],
      },
      {
        _key: "w4",
        number: "04",
        title: "Drive Innovation and transform your operational capabilities:",
        bullets: [
          { _key: "b1", emoji: "\u{1F4A1}", text: "Create custom automation solutions that solve unique challenges" },
          { _key: "b2", emoji: "\u{1F527}", text: "Implement advanced integrations for enhanced functionality" },
          { _key: "b3", emoji: "\u{1F9E0}", text: "Deploy intelligent workflows that adapt to changing needs" },
          { _key: "b4", emoji: "\u{2699}\u{FE0F}", text: "Optimise business processes for maximum efficiency" },
          { _key: "b5", emoji: "\u{1F680}", text: "Future-proof your operations with cutting-edge technology" },
        ],
      },
      {
        _key: "w5",
        number: "05",
        title: "Partner-Led Implementation Advantages that ensure your success:",
        bullets: [
          { _key: "b1", emoji: "\u{1F3AF}", text: "Expert scenario development from certified make specialists" },
          { _key: "b2", emoji: "\u{1F4CB}", text: "Best practices implementation based on proven methodologies" },
          { _key: "b3", emoji: "\u{26A1}", text: "Performance optimisation for maximum speed and reliability" },
          { _key: "b4", emoji: "\u{1F6DF}", text: "Comprehensive support throughout implementation and beyond" },
          { _key: "b5", emoji: "\u{1F52E}", text: "Future-proof solutions designed to evolve with your business" },
        ],
      },
    ],
  },
]

const FALLBACK_SHOWCASE_CARDS = [
  {
    heading: "Automation you can see, flex, and scale",
    body: "Realise your business's full potential with make's intuitive no-code development platform.",
    imageRight: true,
    mediaType: "image" as const,
    mediaSrc: "https://static.wixstatic.com/media/a280a5_5c429db4ef644bf8b4b2ce055d306baaf000.png",
  },
  {
    heading: "Keep operations running smoothly",
    body: "Run operations smoothly, even across siloed systems, by connecting your teams and the key project management and data synchronisation tools that your business relies on.",
    imageRight: false,
    mediaType: "image" as const,
    mediaSrc: "https://static.wixstatic.com/media/a280a5_c0436169100c4a09b52d59a8e2549190~mv2.png",
  },
  {
    heading: "Solve finance complexities",
    body: "Integrate multiple apps and systems into one platform and automate time-consuming processes such as quote-to-cash and procure-to-pay.",
    imageRight: true,
    mediaType: "image" as const,
    mediaSrc: "https://static.wixstatic.com/media/39b8ef_6bfa6513a044479cbdd3279c452dcbf0~mv2.png",
  },
]

const FALLBACK_JOIN_STATS = [
  { _key: "s1", value: "10+", label: "Years Experience" },
  { _key: "s2", value: "1050+", label: "Projects Completed" },
  { _key: "s3", value: "290", label: "Satisfied Clients" },
]

const FEATURE_LIST_LEFT = [
  { emoji: "\u{1F4CB}", text: "Automation strategy development" },
  { emoji: "\u{1F3A8}", text: "Workflow design and implementation" },
  { emoji: "\u{1F517}", text: "System integration and testing" },
  { emoji: "\u{1F527}", text: "Ongoing optimisation and support" },
]

const FEATURE_LIST_RIGHT = [
  { emoji: "\u{2699}\u{FE0F}", text: "Advanced Workflow Design" },
  { emoji: "\u{1F50C}", text: "System Integration Development" },
  { emoji: "\u{1F6E0}\u{FE0F}", text: "Custom Automation Solutions" },
  { emoji: "\u{1F4C8}", text: "Enterprise Scaling Support" },
]

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
  const calendlyUrl = siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"
  const partnerBadges = siteSettings?.navbarPartnerBadges || []

  const featuredTestimonial =
    caseStudies.find(
      (c) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies[0]

  // Hero
  const heroHeadingPart1 = pageData?.heroHeadingPart1 || "make.com "
  const heroHeadingAccent = pageData?.heroHeadingAccent || "Gold Partner"
  const heroSubheading = pageData?.heroSubheading || "Consulting and Automation Solutions\n\nCertified Make.com Platform Integration & Automation Services across Australia, US & the UK"
  const heroPrimaryCtaLabel = pageData?.heroPrimaryCtaLabel || "\u{1F680} Book a Consultation"
  const heroPrimaryCtaUrl = pageData?.heroPrimaryCtaUrl || calendlyUrl
  const heroSecondaryCtaLabel = (pageData as any)?.heroSecondaryCtaLabel || "\u{25B6}\u{FE0F} Get Started with make.com"
  const heroSecondaryCtaUrl = (pageData as any)?.heroSecondaryCtaUrl || "https://www.make.com/en/register?pc=fruition2023"
  const heroImageSrc = safeSrc(pageData?.heroImage) || "/images/make-partners-hero.png"

  // Logo cloud
  const logoCloudPart1 = pageData?.logoCloudHeadingPart1 || "Trusted by "
  const logoCloudAccent = pageData?.logoCloudHeadingAccent || "leading organisations"

  // Feature tabs
  const comparisonHeading = pageData?.comparisonHeading || "Transform Your Business with make Automations"
  const featureTabs = (pageData?.comparisonTabs && pageData.comparisonTabs.length > 0)
    ? pageData.comparisonTabs
    : FALLBACK_COMPARISON_TABS

  // Showcase
  const showcaseHeading = pageData?.showcaseHeading || "Enterprise Automation Solutions"
  const showcaseSubheading = pageData?.showcaseSubheading || "See how make.com transforms your business operations"

  // Resolve showcase cards from Sanity or use fallbacks
  type ResolvedCard = {
    heading: string
    body: string
    imageRight: boolean
    mediaType: "video" | "image"
    mediaSrc: string
  }

  let resolvedShowcaseCards: ResolvedCard[] = (pageData?.showcaseCards ?? [])
    .map((card): ResolvedCard | null => {
      const heading = card.heading ?? ""
      const body = card.body ?? ""
      const imageRight = card.imageRight ?? true
      const mediaType = card.mediaType ?? "image"
      let mediaSrc = ""
      if (mediaType === "video") {
        mediaSrc = card.videoUrl ?? ""
      } else {
        mediaSrc = safeSrc(card.image) ?? ""
      }
      if (!mediaSrc) return null
      return { heading, body, imageRight, mediaType, mediaSrc }
    })
    .filter((c): c is ResolvedCard => c !== null)

  if (resolvedShowcaseCards.length === 0) {
    resolvedShowcaseCards = FALLBACK_SHOWCASE_CARDS
  }

  // Calendly
  const calendlyHeading = pageData?.calendlyHeading || "Schedule a 30-min consultation with one of our make.com consultants to learn how the platform can streamline your processes by 4x-6x"
  const calendlySubheading = pageData?.calendlySubheading

  // Join stats
  const joinPart1 = pageData?.joinHeadingPart1 || "Join "
  const joinAccent = pageData?.joinHeadingAccent || "500+ businesses"
  const joinPart2 = pageData?.joinHeadingPart2 || " that have leveraged our make.com automation expertise."
  const joinStats = (pageData?.joinStats && pageData.joinStats.length > 0) ? pageData.joinStats : FALLBACK_JOIN_STATS
  const joinCtaLabel = pageData?.joinCtaLabel || "Start Your Transformation"
  const joinCtaUrl = pageData?.joinCtaUrl || calendlyUrl

  // Testimonial banner
  const bannerPart1 = pageData?.testimonialBannerHeadingPart1 || "Join "
  const bannerAccent = pageData?.testimonialBannerHeadingAccent || "500+ organisations"
  const bannerPart2 = pageData?.testimonialBannerHeadingPart2 || " that have maximised their workflows with our make.com automation expertise"

  // Testimonials
  const testimonialsHeading = pageData?.testimonialsHeading || "What our clients say"
  const testimonialsCtaLabel = pageData?.testimonialsCtaLabel || "View All Case Studies"
  const testimonialsCtaUrl = pageData?.testimonialsCtaUrl || "/about/case-studies"
  const statCardValue = pageData?.statCardValue || "290+"
  const statCardSubtitle = pageData?.statCardSubtitle || "Satisfied clients across Australia, US & UK"
  const statCardCtaLabel = pageData?.statCardCtaLabel || "Join Them"
  const statCardCtaUrl = pageData?.statCardCtaUrl || calendlyUrl

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

          <h1
            className="text-center font-bold"
            style={{ fontSize: 48, lineHeight: "67.2px", marginTop: 42, maxWidth: 924 }}
          >
            <span className="text-black">{heroHeadingPart1}</span>
            <span style={{ color: "#8015e8" }}>{heroHeadingAccent}</span>
          </h1>

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
            {heroSubheading}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: 20, marginTop: 40 }}>
            <CtaButton
              href={heroPrimaryCtaUrl}
              label={heroPrimaryCtaLabel}
              variant="outline"
              style={{ width: 330 }}
            />
            <CtaButton
              href={heroSecondaryCtaUrl}
              label={heroSecondaryCtaLabel}
              variant="primary"
              style={{ width: 330 }}
            />
          </div>

          {/* Hero image */}
          {heroImageSrc && (
            <div style={{ marginTop: 40, width: "100%", maxWidth: 1042 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt="Make.com Gold Partner badge with workflow automation visuals"
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Partnership Announcement */}
      <section className="bg-[#f7f7f7] py-[80px] px-4">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-center gap-12" style={{ maxWidth: 1100 }}>
          <div style={{ flex: 1, maxWidth: 650 }}>
            <h2 className="text-section-h2 text-black" style={{ marginBottom: 20 }}>
              Fruition proudly announces our Gold Partner status with Make, the leading enterprise automation and integration platform formerly known as Integromat.
            </h2>
            <p style={{ fontSize: 18, lineHeight: "28.8px", color: "black" }}>
              As a certified Gold Partner, we deliver advanced workflow automation solutions that transform business operations and drive digital efficiency.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://static.wixstatic.com/media/39b8ef_cc8a5989783a401792a67b8649b7f28c~mv2.webp"
            alt="make.com Gold Partner certification badge"
            width={233}
            height={233}
            className="rounded-[16px] shrink-0"
          />
        </div>
      </section>

      {/* 3. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={logoCloudPart1}
        headingAccent={logoCloudAccent}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 4. Feature Tabs (Transform Your Business / Why Partner) */}
      <ComparisonTabsSection
        heading={comparisonHeading}
        tabs={featureTabs}
      />

      {/* 5. Feature Lists - Transform your business operations */}
      <section className="py-[80px] px-4" style={{ backgroundColor: "#2b074d" }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="flex flex-col items-center text-center" style={{ marginBottom: 48 }}>
            <h2 className="text-section-h2 text-white" style={{ maxWidth: 900 }}>
              Transform your business operations with Fruition&apos;s make Gold Partner expertise.
            </h2>
            <p style={{ fontSize: 18, lineHeight: "28.8px", color: "rgba(255,255,255,0.85)", marginTop: 16, maxWidth: 760 }}>
              Our certified team will guide you through:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto" style={{ maxWidth: 900 }}>
            <div className="flex flex-col gap-5">
              {FEATURE_LIST_LEFT.map((item, i) => (
                <div key={`fl1-${i}`} className="flex items-start gap-3">
                  <span className="text-[1.25rem] shrink-0">{item.emoji}</span>
                  <span style={{ fontSize: 16, lineHeight: "25.6px", color: "white" }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-5">
              <p style={{ fontSize: 14, lineHeight: "22px", color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                As your dedicated make Gold Partner, we specialise in:
              </p>
              {FEATURE_LIST_RIGHT.map((item, i) => (
                <div key={`fl2-${i}`} className="flex items-start gap-3">
                  <span className="text-[1.25rem] shrink-0">{item.emoji}</span>
                  <span className="font-semibold" style={{ fontSize: 16, lineHeight: "25.6px", color: "white" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center mx-auto" style={{ fontSize: 16, lineHeight: "25.6px", color: "rgba(255,255,255,0.85)", marginTop: 48, maxWidth: 760 }}>
            Contact Fruition&apos;s Make automation experts to begin your digital transformation journey. As a certified Gold Partner, we deliver enterprise-grade automation solutions that drive efficiency and growth. Transform your business operations and bring your workflows to Fruition.
          </p>
        </div>
      </section>

      {/* 6. Calendly */}
      <CalendlySection
        heading={calendlyHeading}
        subheading={calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 7. Alternating media + text showcase */}
      {resolvedShowcaseCards.length > 0 && (
        <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
            <div className="flex flex-col items-center text-center" style={{ marginBottom: 60 }}>
              {showcaseHeading && (
                <h2 className="text-section-h2 text-black" style={{ maxWidth: 900 }}>
                  {showcaseHeading}
                </h2>
              )}
              {showcaseSubheading && (
                <p className="text-black" style={{ fontSize: 20, marginTop: 12, maxWidth: 760 }}>
                  {showcaseSubheading}
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
                    style={{ flex: 1, aspectRatio: "16 / 10", background: "#ffffff" }}
                  >
                    {card.mediaType === "video" ? (
                      <video
                        src={card.mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
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
        headingPart1={joinPart1}
        headingAccent={joinAccent}
        headingPart2={joinPart2}
        stats={joinStats as Array<{ _key?: string; value?: string; label?: string }>}
        ctaLabel={joinCtaLabel}
        ctaUrl={joinCtaUrl}
        siteSettings={siteSettings || undefined}
      />

      {/* 9. Testimonials */}
      <TestimonialsGrid
        caseStudies={caseStudies}
        heading={testimonialsHeading}
        ctaLabel={testimonialsCtaLabel}
        ctaUrl={testimonialsCtaUrl}
        statCardValue={statCardValue}
        statCardSubtitle={statCardSubtitle}
        statCardCtaLabel={statCardCtaLabel}
        statCardCtaUrl={statCardCtaUrl}
      />

      {/* 10. Discover CTA */}
      <DiscoverCtaSection
        badge={siteSettings?.badgeCertifications}
        heading="Discover how much make.com can do for your team."
      />

      {/* 11. Testimonial CTA Banner */}
      <TestimonialCtaBanner
        headingPart1={bannerPart1}
        headingAccent={bannerAccent}
        headingPart2={bannerPart2}
        primaryCtaLabel="Start Your Transformation"
        primaryCtaUrl={calendlyUrl}
        secondaryCtaLabel="Get Started with make.com"
        secondaryCtaUrl="https://www.make.com/en/register?pc=fruition2023"
        testimonial={featuredTestimonial}
      />

      {/* 12. Security */}
      <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
    </div>
  )
}
