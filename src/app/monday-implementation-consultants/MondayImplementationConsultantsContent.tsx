"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import TestimonialsGrid from "@/components/sections/TestimonialsGrid"
import StatsBlockView from "@/features/page-builder/blocks/StatsBlockView"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SanityImageRef = { asset?: { _ref?: string } } | null | undefined

interface PortableTextChild {
  _type?: string
  text?: string
}
interface PortableTextBlock {
  _type?: string
  _key?: string
  style?: string
  children?: PortableTextChild[]
}

interface Bullet {
  _key?: string
  emoji?: string
  text?: string
}
interface ComparisonItem {
  _key?: string
  number?: string
  title?: string
  description?: string
  bullets?: Bullet[]
}
interface ComparisonTab {
  _key?: string
  label?: string
  items?: ComparisonItem[]
}

interface MethodologyStep {
  _key?: string
  number?: string
  title?: string
  description?: string
}

interface SolutionCard {
  _key?: string
  eyebrow?: string
  heading?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  image?: SanityImageRef
}

interface FaqPair {
  _key?: string
  question?: string
  answer?: string
}
interface FaqTab {
  _key?: string
  label?: string
  items?: FaqPair[]
}

interface Stat {
  _key?: string
  value?: string
  label?: string
}

interface CarouselLogo {
  _key?: string
  alt?: string
  image?: SanityImageRef
}

interface CaseStudy {
  _id?: string
  clientName?: string
  clientRole?: string
  clientCompany?: string
  quote?: string
  logo?: SanityImageRef
  linkedinUrl?: string
}

export interface MicPageData {
  title?: string
  seoTitle?: string
  seoDescription?: string

  heroEyebrow?: string
  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroHeadingPart2?: string
  heroSubheading?: string
  heroPartnerBadges?: Array<{ _key?: string; image?: SanityImageRef; alt?: string }>
  heroMondayPartnersImage?: SanityImageRef
  heroProductImages?: Array<{ _key?: string; image?: SanityImageRef; alt?: string }>
  heroCertificationBadge?: SanityImageRef
  heroImage?: SanityImageRef
  videoEmbedUrl?: string
  videoTitle?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string

  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string

  teamsTransformedHeading?: string
  teamsTransformedBody?: PortableTextBlock[]

  comparisonSectionHeading?: string
  comparisonTabs?: ComparisonTab[]

  methodologyHeading?: string
  methodologySteps?: MethodologyStep[]

  solutionsHeadingPart1?: string
  solutionsHeadingAccent?: string
  solutionsHeadingPart2?: string
  solutionsIntro?: string
  solutionCards?: SolutionCard[]

  testimonialsHeading?: string
  testimonialsCtaLabel?: string
  testimonialsCtaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string

  calendlyHeading?: string
  calendlyUrl?: string

  faqHeading?: string
  faqTabs?: FaqTab[]

  discoverBadge?: SanityImageRef
  discoverHeading?: string
  discoverPrimaryCtaLabel?: string
  discoverPrimaryCtaUrl?: string
  discoverSecondaryCtaLabel?: string
  discoverSecondaryCtaUrl?: string

  joinSectionHeadingPart1?: string
  joinSectionHeadingAccent?: string
  joinSectionHeadingPart2?: string
  joinSectionSubheading?: string
  joinSectionStats?: Stat[]
  joinSectionFootnote?: string
  joinSectionBadge?: SanityImageRef

  securityBadge?: SanityImageRef
}

interface Props {
  data: MicPageData | null
  carouselLogos: CarouselLogo[]
  caseStudies: CaseStudy[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  siteSettings?: any
  /** Central faqItem tabs — overrides `data.faqTabs` when non-empty. */
  faqTabs?: FaqTab[]
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CALENDLY_URL = "https://calendly.com/global-calendar-fruitionservices"

function imageUrl(ref: SanityImageRef): string | null {
  if (!ref || !ref.asset?._ref) return null
  try {
    return urlFor(ref).url()
  } catch {
    return null
  }
}

function portableTextToString(blocks?: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return ""
  return blocks
    .map((block) =>
      (block.children || [])
        .map((child) => child.text || "")
        .join("")
    )
    .filter(Boolean)
    .join("\n\n")
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MondayImplementationConsultantsContent({
  data,
  carouselLogos = [],
  caseStudies = [],
  siteSettings,
  faqTabs: faqTabsOverride,
}: Props) {
  const comparisonTabs = data?.comparisonTabs ?? []
  const methodologySteps = data?.methodologySteps ?? []
  const solutionCards = data?.solutionCards ?? []
  const faqTabs = faqTabsOverride?.length ? faqTabsOverride : (data?.faqTabs ?? [])
  const stats = data?.joinSectionStats ?? []

  const [activeComparisonTab, setActiveComparisonTab] = useState<number>(0)
  const [activeFaqTab, setActiveFaqTab] = useState<number>(0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Carousel logos — duplicate for the marquee loop
  const normalizedLogos = carouselLogos
    .map((logo, i) => ({
      key: logo._key || `logo-${i}`,
      src: imageUrl(logo.image),
      alt: logo.alt || `Client ${i + 1}`,
    }))
    .filter((l) => l.src)
  const duplicatedLogos = [...normalizedLogos, ...normalizedLogos]

  const heroEyebrow = data?.heroEyebrow ?? "monday.com"
  const heroHeadingPart1 = data?.heroHeadingPart1 ?? ""
  const heroHeadingAccent = data?.heroHeadingAccent ?? "Implementation Consultants"
  const heroHeadingPart2 = data?.heroHeadingPart2 ?? "\nCertified monday.com Experts"
  const heroSubheading =
    data?.heroSubheading ??
    "Get set up the right way, without spending valuable hours figuring it out yourself. Make monday.com work for you and the architecture of your business with a monday.com implementation expert."

  const heroCertBadgeSrc = imageUrl(data?.heroCertificationBadge)
  const discoverBadgeSrc = imageUrl(data?.discoverBadge)
  const securityBadgeSrc = imageUrl(data?.securityBadge)
  const joinBadgeSrc = imageUrl(data?.joinSectionBadge)

  type ResolvedImage = { _key: string | undefined; src: string; alt: string }
  const heroPartnerBadges: ResolvedImage[] = (data?.heroPartnerBadges ?? [])
    .map((b, i): ResolvedImage | null => {
      const src = imageUrl(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Partner badge ${i + 1}` }
    })
    .filter((x): x is ResolvedImage => x !== null)
  const heroMondayPartnersImageSrc = imageUrl(data?.heroMondayPartnersImage)
  const heroDashboardImageSrc = imageUrl(data?.heroImage)
  const heroProductImages: ResolvedImage[] = (data?.heroProductImages ?? [])
    .map((b, i): ResolvedImage | null => {
      const src = imageUrl(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Product ${i + 1}` }
    })
    .filter((x): x is ResolvedImage => x !== null)
  const videoEmbedUrl = data?.videoEmbedUrl ?? "https://www.youtube.com/embed/7vtrtlfC1Zg"
  const videoTitle = data?.videoTitle ?? "monday CRM Success Story"

  const heroPrimaryCtaLabel = data?.heroPrimaryCtaLabel ?? "\ud83d\ude80 Book a Consultation"
  const heroPrimaryCtaUrl = data?.heroPrimaryCtaUrl ?? CALENDLY_URL
  const heroSecondaryCtaLabel =
    data?.heroSecondaryCtaLabel ?? "\u25b6\ufe0f Get Started with monday.com"
  const heroSecondaryCtaUrl = data?.heroSecondaryCtaUrl ?? CALENDLY_URL

  const logoCloudPart1 = data?.logoCloudHeadingPart1 ?? "Clients who have used our "
  const logoCloudAccent = data?.logoCloudHeadingAccent ?? "monday.com consulting services"

  const teamsHeading =
    data?.teamsTransformedHeading ?? "Teams Transformed with Proven Efficiency Gains."
  const teamsBody = portableTextToString(data?.teamsTransformedBody)

  const comparisonHeading =
    data?.comparisonSectionHeading ?? "DIY implementation vs expert monday.com support"

  const methodologyHeading =
    data?.methodologyHeading ??
    "Our expert consultants empower you to adopt workflow automation & AI systems"

  // Build the resolved tab list. The third tab ("Our Approach") has stale items in
  // the CMS, so we override it with methodologySteps which contain the correct
  // Process Discovery → ... Change Readiness content. We also attach per-tab
  // section headings so they swap with the active tab.
  const resolvedComparisonTabs = comparisonTabs.map((tab, idx) => {
    const label = tab.label ?? ""
    const isOurApproach =
      label.toLowerCase().includes("our approach") ||
      (idx === comparisonTabs.length - 1 && comparisonTabs.length >= 3)

    if (isOurApproach && methodologySteps.length > 0) {
      return {
        ...tab,
        heading: methodologyHeading,
        items: methodologySteps.map((s) => ({
          _key: s._key,
          number: s.number,
          title: s.title,
          description: s.description,
        })) as ComparisonItem[],
      }
    }

    if (idx === 0) {
      return { ...tab, heading: comparisonHeading }
    }

    return { ...tab, heading: undefined as string | undefined }
  })

  const activeTab = resolvedComparisonTabs[activeComparisonTab]
  const currentComparisonItems = activeTab?.items ?? []
  const currentTabHeading = activeTab?.heading

  const solutionsPart1 = data?.solutionsHeadingPart1 ?? "Create a CRM or project management tool that "
  const solutionsAccent = data?.solutionsHeadingAccent ?? "fits you"
  const solutionsPart2 = data?.solutionsHeadingPart2 ?? "."
  const solutionsIntro = data?.solutionsIntro ?? ""

  const testimonialsHeading =
    data?.testimonialsHeading ?? "What our customers say about us \ud83d\ude4c"
  const testimonialsCtaLabel =
    data?.testimonialsCtaLabel ?? "\ud83d\ude80 Start Your Transformation"
  const testimonialsCtaUrl = data?.testimonialsCtaUrl ?? CALENDLY_URL
  const statCardValue = data?.statCardValue ?? "500+"
  const statCardSubtitle =
    data?.statCardSubtitle ??
    "have maximised their workflows with our monday.com expert support"
  const statCardCtaLabel = data?.statCardCtaLabel ?? "Read our case studies"
  const statCardCtaUrl = data?.statCardCtaUrl ?? "/customer-testimonials"

  const calendlyHeading =
    data?.calendlyHeading ??
    "Schedule A 30-Min Consultation With One of Our Expert monday.com Consultants"
  const calendlyUrl = data?.calendlyUrl ?? CALENDLY_URL

  const faqHeading = data?.faqHeading ?? "Frequently asked questions"
  const currentFaqItems = faqTabs[activeFaqTab]?.items ?? []

  const discoverHeading =
    data?.discoverHeading ?? "Discover how much monday.com can do for your team."
  const discoverPrimaryCtaLabel =
    data?.discoverPrimaryCtaLabel ?? "\ud83d\ude80 Schedule a Consultation"
  const discoverPrimaryCtaUrl = data?.discoverPrimaryCtaUrl ?? CALENDLY_URL
  const discoverSecondaryCtaLabel =
    data?.discoverSecondaryCtaLabel ?? "\u25b6\ufe0f Get Started with monday.com"
  const discoverSecondaryCtaUrl = data?.discoverSecondaryCtaUrl ?? CALENDLY_URL

  const joinPart1 = data?.joinSectionHeadingPart1 ?? "Join "
  const joinAccent = data?.joinSectionHeadingAccent ?? "500+ businesses"
  const joinPart2 =
    data?.joinSectionHeadingPart2 ?? " that have leveraged our monday.com implementation experts."
  const joinSubheading = data?.joinSectionSubheading ?? "The economic impact of"
  const joinFootnote = data?.joinSectionFootnote ?? "Data by"

  return (
    <div>
      {/* ============================================================ */}
      {/* SECTION 1 — Hero                                             */}
      {/* ============================================================ */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center px-4 lg:px-[120px]"
          style={{ paddingTop: 80, paddingBottom: 80, maxWidth: 1600 }}
        >
          {/* Partner badges */}
          {heroPartnerBadges.length > 0 && (
            <div className="flex items-center flex-wrap justify-center" style={{ gap: 22 }}>
              {heroPartnerBadges.map((badge) => (
                <Image
                  key={badge._key ?? badge.src}
                  src={badge.src}
                  alt={badge.alt}
                  width={120}
                  height={44}
                  className="h-[44px] w-auto rounded-[5px]"
                />
              ))}
            </div>
          )}

          {/* Eyebrow */}
          <p
            className="text-center"
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#8015e8",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginTop: 32,
            }}
          >
            {heroEyebrow}
          </p>

          {/* Heading */}
          <h1
            className="text-center font-bold"
            style={{
              fontSize: 48,
              lineHeight: "67.2px",
              marginTop: 14,
              maxWidth: 924,
              whiteSpace: "pre-line",
            }}
          >
            {heroHeadingPart1 && <span className="text-black">{heroHeadingPart1}</span>}
            <span style={{ color: "#8015e8" }}>{heroHeadingAccent}</span>
            {heroHeadingPart2 && <span className="text-black">{heroHeadingPart2}</span>}
          </h1>

          {/* Subheading */}
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

          {/* Monday Partners image */}
          {heroMondayPartnersImageSrc && (
            <div style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroMondayPartnersImageSrc}
                alt="Monday.com Partners"
                width={924}
                height={0}
                className="w-full max-w-[924px] h-auto object-contain"
              />
            </div>
          )}

          {/* Dual CTA */}
          <div
            className="flex items-center justify-center flex-wrap"
            style={{ gap: 20, marginTop: 40, maxWidth: 680 }}
          >
            <Link
              href={heroPrimaryCtaUrl}
              className="flex items-center justify-center font-bold"
              style={{
                width: 330,
                height: 53,
                borderRadius: 100,
                border: "1px solid #8015e8",
                backgroundColor: "white",
                color: "#8015e8",
                fontSize: 16,
              }}
            >
              {heroPrimaryCtaLabel}
            </Link>
            <Link
              href={heroSecondaryCtaUrl}
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 330,
                height: 53,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {heroSecondaryCtaLabel}
            </Link>
          </div>

          {/* Hero dashboard image */}
          {heroDashboardImageSrc && (
            <div style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroDashboardImageSrc}
                alt="monday.com dashboards"
                width={1042}
                height={312}
                className="rounded-card object-cover"
                style={{ width: 1042, height: 312 }}
              />
            </div>
          )}

          {/* Product images row */}
          {heroProductImages.length > 0 && (
            <div className="flex items-center justify-center" style={{ gap: 24, marginTop: 40 }}>
              {heroProductImages.map((img) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={img._key ?? img.src}
                  src={img.src}
                  alt={img.alt}
                  className="h-auto object-contain"
                  style={{ width: 220 }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — Logo cloud marquee                               */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-4">
        <div className="flex flex-col gap-[35px] items-center w-full max-w-[1348px] mx-auto">
          <p className="text-[28px] font-medium leading-[39.2px] text-center">
            <span className="text-black">{logoCloudPart1}</span>
            <span className="text-[#8015e8]">{logoCloudAccent}</span>
          </p>
          {duplicatedLogos.length > 0 && (
            <div className="w-full overflow-hidden">
              <div
                className="flex items-center gap-[65px] animate-marquee"
                style={{ width: "max-content" }}
              >
                {duplicatedLogos.map((logo, i) => (
                  <div
                    key={`logo-${i}`}
                    className="flex items-center justify-center shrink-0 h-[65px] overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src!}
                      alt={logo.alt}
                      height={65}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2b — Video Embed                                     */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingBottom: 80 }}>
        <div className="mx-auto" style={{ maxWidth: 1042 }}>
          <div className="rounded-card overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              src={videoEmbedUrl}
              title={videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — Teams Transformed banner                         */}
      {/* ============================================================ */}
      <section
        style={{
          background:
            "linear-gradient(98.14deg, rgb(28, 2, 76) 0%, rgb(125, 20, 227) 100.01%)",
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="mx-auto flex flex-col items-center px-4" style={{ maxWidth: 1080 }}>
          <h2
            className="text-center font-bold text-white"
            style={{ fontSize: 40, lineHeight: "56px", maxWidth: 900 }}
          >
            {teamsHeading}
          </h2>
          {teamsBody && (
            <p
              className="text-center"
              style={{
                fontSize: 18,
                lineHeight: "28px",
                color: "#e8dcfb",
                marginTop: 24,
                maxWidth: 900,
                whiteSpace: "pre-line",
              }}
            >
              {teamsBody}
            </p>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — Comparison tabs (DIY / Benefits / Our Approach)  */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f0ecfe", paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex flex-col items-center px-4" style={{ maxWidth: 1200 }}>
          {/* Tab buttons */}
          {resolvedComparisonTabs.length > 0 && (
            <div className="flex items-center flex-wrap justify-center" style={{ gap: 12 }}>
              {resolvedComparisonTabs.map((tab, idx) => {
                const isActive = idx === activeComparisonTab
                return (
                  <button
                    key={tab._key || idx}
                    onClick={() => setActiveComparisonTab(idx)}
                    className="flex items-center justify-center font-bold"
                    style={{
                      height: 39,
                      paddingLeft: 28,
                      paddingRight: 28,
                      borderRadius: 99,
                      fontSize: 16,
                      cursor: "pointer",
                      ...(isActive
                        ? {
                            background: "linear-gradient(to right, #8015e8, #ba83f0)",
                            color: "white",
                            boxShadow: "0px 2px 8px rgba(128,21,232,0.35)",
                          }
                        : {
                            backgroundColor: "white",
                            border: "1px solid #e8e6e6",
                            color: "black",
                          }),
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Per-tab heading */}
          {currentTabHeading && (
            <h2
              className="text-center font-bold"
              style={{
                fontSize: 40,
                lineHeight: "56px",
                color: "black",
                maxWidth: 1000,
                marginTop: 40,
              }}
            >
              {currentTabHeading}
            </h2>
          )}

          {/* Tab content card */}
          {currentComparisonItems.length > 0 && (
            <div
              className="w-full"
              style={{
                maxWidth: 900,
                backgroundColor: "white",
                border: "1px solid #e8e6e6",
                borderRadius: "var(--radius-card)",
                padding: 36,
                marginTop: 32,
              }}
            >
              {currentComparisonItems.map((item, i) => (
                <div
                  key={item._key || `${item.number}-${i}`}
                  className="flex items-start"
                  style={{
                    gap: 24,
                    marginBottom: i === currentComparisonItems.length - 1 ? 0 : 32,
                  }}
                >
                  {/* Number */}
                  <p
                    className="font-extralight shrink-0"
                    style={{
                      fontSize: 56,
                      color: "#8015e8",
                      lineHeight: 1,
                      width: 70,
                      textAlign: "center",
                    }}
                  >
                    {item.number}
                  </p>
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <p
                      className="font-bold"
                      style={{ fontSize: 20, color: "#2b074d", lineHeight: "28px" }}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p
                        style={{
                          fontSize: 15,
                          color: "#2b074d",
                          lineHeight: "22.5px",
                          marginTop: 10,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="flex flex-col" style={{ gap: 10, marginTop: 14 }}>
                        {item.bullets.map((b, j) => (
                          <li
                            key={b._key || j}
                            className="flex items-start"
                            style={{ gap: 12 }}
                          >
                            <span style={{ fontSize: 18, lineHeight: "22.5px" }}>
                              {b.emoji}
                            </span>
                            <span
                              style={{
                                fontSize: 15,
                                color: "#2b074d",
                                lineHeight: "22.5px",
                              }}
                            >
                              {b.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — Calendly                                         */}
      {/* ============================================================ */}
      <section className="bg-[#f7f7f7]" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex flex-col items-center px-4" style={{ maxWidth: 1200 }}>
          <h2
            className="text-section-h2 text-center text-black"
            style={{ maxWidth: 820 }}
          >
            {calendlyHeading}
          </h2>
          <div
            className="w-full rounded-card overflow-hidden"
            style={{ marginTop: 40, height: 700 }}
          >
            <iframe
              src={calendlyUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Schedule a consultation"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 — FAQ                                              */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <div className="mx-auto flex flex-col px-4" style={{ maxWidth: 959, gap: 24 }}>
          <h2
            className="text-section-h2"
            style={{ color: "var(--purple-primary)" }}
          >
            {faqHeading}
          </h2>

          {/* Tab navigation */}
          {faqTabs.length > 0 && (
            <div
              className="flex items-start overflow-auto"
              style={{ width: "100%", height: 52 }}
            >
              {faqTabs.map((tab, idx) => (
                <button
                  key={tab._key || idx}
                  onClick={() => {
                    setActiveFaqTab(idx)
                    setOpenFaqIndex(0)
                  }}
                  className="h-full shrink-0 relative"
                  style={{
                    paddingTop: 14,
                    paddingBottom: 17,
                    paddingLeft: 27.469,
                    paddingRight: 27.469,
                    borderBottom:
                      activeFaqTab === idx
                        ? "3px solid #8e5cbf"
                        : "3px solid transparent",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      color: activeFaqTab === idx ? "#8e5cbf" : "black",
                      textAlign: "center",
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* FAQ items */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            {currentFaqItems.map((item, i) => (
              <div key={item._key || i} style={{ paddingTop: i === 0 ? 20 : 24 }}>
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex items-center justify-between text-left"
                  style={{ minHeight: 30 }}
                >
                  <span style={{ fontSize: 20, lineHeight: "24px", color: "black" }}>
                    {item.question}
                  </span>
                  <div className="shrink-0" style={{ width: 30, height: 30 }}>
                    <svg
                      className={`transition-transform ${
                        openFaqIndex === i ? "rotate-180" : ""
                      }`}
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                    >
                      <path
                        d="M8 12L15 19L22 12"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {openFaqIndex === i && (
                  <div
                    style={{
                      paddingBottom: 16,
                      paddingTop: 31,
                      fontSize: 16,
                      lineHeight: "24px",
                      color: "black",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.answer}
                  </div>
                )}
                <div
                  style={{
                    borderBottom: "1px solid #2b074d",
                    marginTop: openFaqIndex === i ? 0 : 36,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8 — Create a CRM that fits you (solution cards)      */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f0ecfe", paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
          <h2
            className="text-center font-bold"
            style={{
              fontSize: 44,
              lineHeight: "58px",
              color: "black",
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <span className="text-black">{solutionsPart1}</span>
            <span style={{ color: "#8015e8" }}>{solutionsAccent}</span>
            <span className="text-black">{solutionsPart2}</span>
          </h2>
          {solutionsIntro && (
            <p
              className="text-center"
              style={{
                fontSize: 16,
                lineHeight: "24px",
                color: "black",
                marginTop: 20,
                maxWidth: 860,
                margin: "20px auto 0",
                whiteSpace: "pre-line",
              }}
            >
              {solutionsIntro}
            </p>
          )}

          {/* Solution cards — alternating sides */}
          <div className="flex flex-col" style={{ gap: 40, marginTop: 56 }}>
            {solutionCards.map((card, i) => {
              const imgSrc = imageUrl(card.image)
              const reverse = i % 2 === 1
              return (
                <div
                  key={card._key || i}
                  className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center`}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #e8e6e6",
                    borderRadius: "var(--radius-card)",
                    overflow: "hidden",
                    gap: 0,
                  }}
                >
                  {/* Text column */}
                  <div className="flex-1 w-full" style={{ padding: 40 }}>
                    {card.eyebrow && (
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#8015e8",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                        }}
                      >
                        {card.eyebrow}
                      </p>
                    )}
                    <h3
                      className="font-bold"
                      style={{
                        fontSize: 28,
                        color: "#2b074d",
                        lineHeight: "36px",
                        marginTop: 12,
                      }}
                    >
                      {card.heading}
                    </h3>
                    {card.body && (
                      <p
                        style={{
                          fontSize: 15,
                          lineHeight: "22.5px",
                          color: "black",
                          marginTop: 16,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {card.body}
                      </p>
                    )}
                    {card.ctaLabel && (
                      <Link
                        href={card.ctaUrl || "#"}
                        className="inline-flex items-center justify-center font-bold"
                        style={{
                          height: 48,
                          paddingLeft: 28,
                          paddingRight: 28,
                          borderRadius: 100,
                          background: "linear-gradient(to right, #8015e8, #ba83f0)",
                          color: "white",
                          fontSize: 14,
                          marginTop: 24,
                        }}
                      >
                        {card.ctaLabel}
                      </Link>
                    )}
                  </div>

                  {/* Image column */}
                  <div
                    className="flex-1 w-full"
                    style={{
                      minHeight: 320,
                      backgroundColor: "#f0ecfe",
                    }}
                  >
                    {imgSrc && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={imgSrc}
                        alt={card.heading || "solution"}
                        className="w-full h-full object-cover"
                        style={{ minHeight: 320 }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9 — Testimonials (shared carousel component)         */}
      {/* ============================================================ */}
      <TestimonialsGrid
        heading={testimonialsHeading}
        ctaLabel={testimonialsCtaLabel}
        ctaUrl={testimonialsCtaUrl}
        statCardValue={statCardValue}
        statCardSubtitle={statCardSubtitle}
        statCardCtaLabel={statCardCtaLabel}
        statCardCtaUrl={statCardCtaUrl}
        caseStudies={caseStudies as import("@/components/sections/types").CaseStudy[]}
      />

      {/* Discover CTA removed from this page */}

      {/* ============================================================ */}
      {/* SECTION 11 — Join 500+ stats (shared StatsBlockView)         */}
      {/* ============================================================ */}
      <StatsBlockView
        heading={`${joinPart1}${joinAccent}${joinPart2}`}
        subheading={joinSubheading}
        stats={stats.map((s) => ({ _key: s._key, value: s.value, label: s.label }))}
        footnote={joinFootnote}
        siteSettings={siteSettings || undefined}
        showMondayPartnersBadge={false}
      />
    </div>
  )
}
