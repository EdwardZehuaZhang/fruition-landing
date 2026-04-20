"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import TestimonialsGrid from "@/components/sections/TestimonialsGrid"
import CalendlySection from "@/components/sections/CalendlySection"
import StatsBlockView from "@/features/page-builder/blocks/StatsBlockView"
import ComparisonTabsSection from "@/components/sections/ComparisonTabsSection"
import type { ComparisonTab as SharedComparisonTab } from "@/components/sections/types"

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

  const heroEyebrow = data?.heroEyebrow
  const heroHeadingPart1 = data?.heroHeadingPart1
  const heroHeadingAccent = data?.heroHeadingAccent
  const heroHeadingPart2 = data?.heroHeadingPart2
  const heroSubheading = data?.heroSubheading

  const heroCertBadgeSrc = imageUrl(data?.heroCertificationBadge) || imageUrl(siteSettings?.badgeCertifications)
  const discoverBadgeSrc = imageUrl(data?.discoverBadge)
  const securityBadgeSrc = imageUrl(data?.securityBadge)
  const joinBadgeSrc = imageUrl(data?.joinSectionBadge)

  type ResolvedImage = { _key: string | undefined; src: string; alt: string }
  const sanityPartnerBadges: ResolvedImage[] = (data?.heroPartnerBadges ?? [])
    .map((b, i): ResolvedImage | null => {
      const src = imageUrl(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Partner badge ${i + 1}` }
    })
    .filter((x): x is ResolvedImage => x !== null)
  const navPartnerBadges: ResolvedImage[] = (siteSettings?.navbarPartnerBadges ?? [])
    .map((b: { _key?: string; name?: string; image?: SanityImageRef }, i: number): ResolvedImage | null => {
      const src = imageUrl(b.image)
      if (!src) return null
      return { _key: b._key ?? `nav-badge-${i}`, src, alt: b.name ?? `Partner badge ${i + 1}` }
    })
    .filter((x: ResolvedImage | null): x is ResolvedImage => x !== null)
  const heroPartnerBadges = sanityPartnerBadges.length > 0 ? sanityPartnerBadges : navPartnerBadges
  const heroMondayPartnersImageSrc = imageUrl(data?.heroMondayPartnersImage)
  const heroDashboardImageSrc = imageUrl(data?.heroImage) || "/images/hero-monday-dashboards.avif"
  const heroProductImages: ResolvedImage[] = (data?.heroProductImages ?? [])
    .map((b, i): ResolvedImage | null => {
      const src = imageUrl(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Product ${i + 1}` }
    })
    .filter((x): x is ResolvedImage => x !== null)
  const videoEmbedUrl = data?.videoEmbedUrl
  const videoTitle = data?.videoTitle

  const heroPrimaryCtaLabel = data?.heroPrimaryCtaLabel
  const heroPrimaryCtaUrl = data?.heroPrimaryCtaUrl
  const heroSecondaryCtaLabel = data?.heroSecondaryCtaLabel
  const heroSecondaryCtaUrl = data?.heroSecondaryCtaUrl

  const logoCloudPart1 = data?.logoCloudHeadingPart1
  const logoCloudAccent = data?.logoCloudHeadingAccent

  const teamsHeading = data?.teamsTransformedHeading
  const teamsBody = portableTextToString(data?.teamsTransformedBody)

  const comparisonHeading = data?.comparisonSectionHeading

  const methodologyHeading = data?.methodologyHeading

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

  const solutionsPart1 = data?.solutionsHeadingPart1
  const solutionsAccent = data?.solutionsHeadingAccent
  const solutionsPart2 = data?.solutionsHeadingPart2
  const solutionsIntro = data?.solutionsIntro

  const testimonialsHeading = data?.testimonialsHeading
  const testimonialsCtaLabel = data?.testimonialsCtaLabel
  const testimonialsCtaUrl = data?.testimonialsCtaUrl
  const statCardValue = data?.statCardValue
  const statCardSubtitle = data?.statCardSubtitle
  const statCardCtaLabel = data?.statCardCtaLabel
  const statCardCtaUrl = data?.statCardCtaUrl

  const calendlyHeading = data?.calendlyHeading
  const calendlyUrl = data?.calendlyUrl

  const faqHeading = data?.faqHeading
  const currentFaqItems = faqTabs[activeFaqTab]?.items ?? []

  const discoverHeading = data?.discoverHeading
  const discoverPrimaryCtaLabel = data?.discoverPrimaryCtaLabel
  const discoverPrimaryCtaUrl = data?.discoverPrimaryCtaUrl
  const discoverSecondaryCtaLabel = data?.discoverSecondaryCtaLabel
  const discoverSecondaryCtaUrl = data?.discoverSecondaryCtaUrl

  const joinPart1 = data?.joinSectionHeadingPart1
  const joinAccent = data?.joinSectionHeadingAccent
  const joinPart2 = data?.joinSectionHeadingPart2
  const joinSubheading = data?.joinSectionSubheading
  const joinFootnote = data?.joinSectionFootnote

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
          {heroSubheading && (
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
          )}

          {/* Certification badge */}
          {heroCertBadgeSrc && (
            <div style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroCertBadgeSrc}
                alt="monday.com Certifications"
                className="h-auto object-contain"
                style={{ maxWidth: 534 }}
              />
            </div>
          )}

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
          {(heroPrimaryCtaUrl || heroSecondaryCtaUrl) && (
            <div
              className="flex items-center justify-center flex-wrap"
              style={{ gap: 20, marginTop: 40, maxWidth: 680 }}
            >
              {heroPrimaryCtaUrl && (
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
              )}
              {heroSecondaryCtaUrl && (
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
              )}
            </div>
          )}

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
      {videoEmbedUrl && (
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
      )}

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
      <ComparisonTabsSection
        heading={comparisonHeading}
        tabs={resolvedComparisonTabs as SharedComparisonTab[]}
      />

      {/* ============================================================ */}
      {/* SECTION 5 — Calendly                                         */}
      {/* ============================================================ */}
      {calendlyUrl && (
        <CalendlySection
          heading={calendlyHeading}
          calendlyUrl={calendlyUrl}
        />
      )}

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
                    {card.ctaLabel && card.ctaUrl && (
                      <Link
                        href={card.ctaUrl}
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
                        alt={card.heading ?? ""}
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
        heading={`${joinPart1 ?? ""}${joinAccent ?? ""}${joinPart2 ?? ""}`}
        subheading={joinSubheading}
        stats={stats.map((s) => ({ _key: s._key, value: s.value, label: s.label }))}
        footnote={joinFootnote}
        siteSettings={siteSettings || undefined}
        showMondayPartnersBadge={false}
      />
    </div>
  )
}
