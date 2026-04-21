"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { urlFor } from "@/sanity/image"
import TestimonialsGrid from "@/components/sections/TestimonialsGrid"
import CalendlySection from "@/components/sections/CalendlySection"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// Sanity image reference (we take `any`-ish shape because the field is
// just `type: 'image'` on the schema)
type SanityImage = {
  asset?: { _ref?: string; _id?: string } | null
} | null | undefined

interface PackageFeature {
  _key?: string
  emoji?: string
  label?: string
}

interface PackageTier {
  _key?: string
  tabKey?: string
  name?: string
  badge?: string
  description?: string
  supportLabel?: string
  features?: PackageFeature[]
}

interface FeatureCard {
  _key?: string
  emoji?: string
  title?: string
  description?: string
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

interface MethodologyStep {
  _key?: string
  number?: string
  title?: string
  description?: string
  bullets?: string[]
  extraText?: string
}

export interface ImplementationPackagesData {
  title?: string
  seoTitle?: string
  seoDescription?: string

  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroHeadingPart2?: string
  heroPartnerBadges?: Array<{ _key?: string; image?: SanityImage; alt?: string }>
  heroMondayPartnersImage?: SanityImage
  heroImage?: SanityImage
  heroCertificationBadge?: SanityImage
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string

  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string

  videoEmbedUrl?: string
  videoTitle?: string

  servicesIntroHeadingPart1?: string
  servicesIntroHeadingAccent?: string
  servicesIntroHeadingPart2?: string
  servicesIntroImage?: SanityImage
  featureCards?: FeatureCard[]

  socialProofBannerHtml?: PortableTextBlock[]
  socialProofCtaLabel?: string
  socialProofCtaUrl?: string

  pricingHeading?: string
  packageTiers?: PackageTier[]

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

  discoverBadge?: SanityImage
  discoverHeading?: string
  discoverPrimaryCtaLabel?: string
  discoverPrimaryCtaUrl?: string
  discoverSecondaryCtaLabel?: string
  discoverSecondaryCtaUrl?: string

  methodologyHeading?: string
  methodologyHeadingAccent?: string
  methodologySteps?: MethodologyStep[]

  securityBadge?: SanityImage
}

interface CarouselLogo {
  alt?: string
  image?: SanityImage
}

interface CaseStudy {
  _id?: string
  clientName?: string
  clientRole?: string
  clientCompany?: string
  quote?: string
  logo?: SanityImage
  profilePhoto?: SanityImage
  linkedinUrl?: string
}

interface NavbarPartnerBadge {
  name?: string
  image?: SanityImage
  width?: number
  height?: number
}

interface Props {
  data?: ImplementationPackagesData | null
  carouselLogos?: CarouselLogo[]
  caseStudies?: CaseStudy[]
  /**
   * Central faqItem tabs fetched at the page.tsx level. When
   * non-empty, overrides the embedded `data.faqTabs` so FAQ content
   * is managed from the central faqItem document store.
   */
  faqTabs?: FaqTab[]
  navbarPartnerBadges?: NavbarPartnerBadge[]
}


/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function imgSrc(image: SanityImage): string | null {
  if (!image || !image.asset) return null
  try {
    return urlFor(image).url()
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ImplementationPackagesContent({
  data,
  carouselLogos,
  caseStudies,
  faqTabs: faqTabsOverride,
  navbarPartnerBadges,
}: Props) {
  // Resolve all fields from Sanity data (no local fallbacks)
  const heroHeadingPart1 = data?.heroHeadingPart1
  const heroHeadingAccent = data?.heroHeadingAccent
  const heroHeadingPart2 = data?.heroHeadingPart2
  const heroImageSrc = imgSrc(data?.heroImage)
  const heroCertBadgeSrc = imgSrc(data?.heroCertificationBadge)
  type ResolvedPartnerBadge = { _key: string | undefined; src: string; alt: string }
  const sanityBadges: ResolvedPartnerBadge[] = (data?.heroPartnerBadges ?? [])
    .map((b, i): ResolvedPartnerBadge | null => {
      const src = imgSrc(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Partner badge ${i + 1}` }
    })
    .filter((x): x is ResolvedPartnerBadge => x !== null)
  const heroPartnerBadges: ResolvedPartnerBadge[] = sanityBadges.length > 0
    ? sanityBadges
    : (navbarPartnerBadges ?? [])
        .map((b, i): ResolvedPartnerBadge | null => {
          const src = imgSrc(b.image)
          if (!src) return null
          return { _key: `nav-badge-${i}`, src, alt: b.name ?? `Partner badge ${i + 1}` }
        })
        .filter((x): x is ResolvedPartnerBadge => x !== null)
  const heroMondayPartnersImageSrc = imgSrc(data?.heroMondayPartnersImage)
  const heroPrimaryCtaLabel = data?.heroPrimaryCtaLabel
  const heroPrimaryCtaUrl = data?.heroPrimaryCtaUrl
  const heroSecondaryCtaLabel = data?.heroSecondaryCtaLabel
  const heroSecondaryCtaUrl = data?.heroSecondaryCtaUrl

  const logoCloudHeadingPart1 = data?.logoCloudHeadingPart1
  const logoCloudHeadingAccent = data?.logoCloudHeadingAccent

  const videoEmbedUrl = data?.videoEmbedUrl
  const videoTitle = data?.videoTitle

  const servicesIntroHeadingPart1 = data?.servicesIntroHeadingPart1
  const servicesIntroHeadingAccent = data?.servicesIntroHeadingAccent
  const servicesIntroHeadingPart2 = data?.servicesIntroHeadingPart2
  const servicesIntroImageSrc = imgSrc(data?.servicesIntroImage)
  const featureCards: FeatureCard[] = data?.featureCards ?? []

  const socialProofBannerHtml = data?.socialProofBannerHtml
  const socialProofCtaLabel = data?.socialProofCtaLabel
  const socialProofCtaUrl = data?.socialProofCtaUrl

  const pricingHeading = data?.pricingHeading
  const packageTiers: PackageTier[] = data?.packageTiers ?? []

  const tabKeys = packageTiers.map((t) => t.tabKey ?? "")
  const [activeTab, setActiveTab] = useState<string>(tabKeys[0] ?? "")
  const pkg =
    packageTiers.find((t) => t.tabKey === activeTab) ?? packageTiers[0]

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
  const faqTabs: FaqTab[] = faqTabsOverride?.length
    ? faqTabsOverride
    : data?.faqTabs ?? []

  const [activeFaqTab, setActiveFaqTab] = useState<string>(
    faqTabs[0]?.label ?? ""
  )
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const activeFaqTabObj =
    faqTabs.find((t) => t.label === activeFaqTab) ?? faqTabs[0]
  const activeFaqItems: FaqPair[] = activeFaqTabObj?.items ?? []

  const discoverBadgeSrc = imgSrc(data?.discoverBadge)
  const discoverHeading = data?.discoverHeading
  const discoverPrimaryCtaLabel = data?.discoverPrimaryCtaLabel
  const discoverPrimaryCtaUrl = data?.discoverPrimaryCtaUrl
  const discoverSecondaryCtaLabel = data?.discoverSecondaryCtaLabel
  const discoverSecondaryCtaUrl = data?.discoverSecondaryCtaUrl

  const methodologyHeading = data?.methodologyHeading
  const methodologyHeadingAccent = data?.methodologyHeadingAccent
  const methodologySteps: MethodologyStep[] = data?.methodologySteps ?? []

  const securityBadgeSrc = imgSrc(data?.securityBadge)

  /* -------- Logo carousel (from siteSettings.carouselLogos) -------- */
  const resolvedCarouselLogos: { src: string; alt: string }[] =
    (carouselLogos ?? [])
      .map((l, i) => {
        const src = imgSrc(l.image)
        if (!src) return null
        return { src, alt: l.alt ?? `Client ${i + 1}` }
      })
      .filter((x): x is { src: string; alt: string } => x !== null)

  // Duplicate logos for seamless marquee loop
  const duplicatedLogos = [...resolvedCarouselLogos, ...resolvedCarouselLogos]

  return (
    <div>
      {/* ============================================================ */}
      {/* SECTION 1 -- Hero                                            */}
      {/* ============================================================ */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingLeft: 273, paddingRight: 273, paddingTop: 80, paddingBottom: 80 }}
        >
          {/* Partner badges */}
          {heroPartnerBadges.length > 0 && (
            <div className="flex items-center" style={{ gap: 22 }}>
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
              marginTop: 42,
              maxWidth: 924,
            }}
          >
            <span className="text-black">{heroHeadingPart1}</span>
            <span style={{ color: "#8015e8" }}>{heroHeadingAccent}</span>
            <span className="text-black">{heroHeadingPart2}</span>
          </h1>

          {/* Monday Partners image */}
          <div style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/monday-partners.avif"
              alt="Monday.com Partners"
              width={924}
              height={0}
              className="w-full max-w-[924px] h-auto object-contain"
            />
          </div>

          {/* Certification banner (hidden) */}
          {/* <div style={{ marginTop: 40 }}>
            <img
              src={heroCertBadgeSrc}
              alt="Certifications"
              width={534}
              height={133}
              className="h-[133px] w-[534px] object-contain"
            />
          </div> */}

          {/* Dual CTA */}
          {(heroPrimaryCtaUrl || heroSecondaryCtaUrl) && (
            <div
              className="flex items-center justify-center"
              style={{ gap: 20, marginTop: 40, width: 680 }}
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

          {/* Hero image */}
          {heroImageSrc && (
            <div style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt="monday.com dashboards — project planning and team OKRs"
                width={1042}
                height={312}
                className="rounded-card object-cover"
                style={{ width: 1042, height: 312 }}
              />
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 -- Logo Cloud with Marquee Scroll                  */}
      {/* ============================================================ */}
      {resolvedCarouselLogos.length > 0 && (
        <section className="bg-white py-[80px] px-4">
          <div className="flex flex-col gap-[35px] items-center w-full max-w-[1348px] mx-auto">
            {/* Heading */}
            <p className="text-[28px] font-medium leading-[39.2px] text-center">
              <span className="text-black">{logoCloudHeadingPart1}</span>
              <span className="text-[#8015e8]">{logoCloudHeadingAccent}</span>
            </p>

            {/* Horizontal marquee logo strip */}
            <div className="w-full overflow-visible">
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
                      src={logo.src}
                      alt={logo.alt}
                      height={65}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 3 -- YouTube Video Embed                             */}
      {/* ============================================================ */}
      {videoEmbedUrl && (
        <section className="bg-white py-[80px] px-[10px]">
          <div className="mx-auto flex flex-col items-center justify-center">
            <div className="w-full max-w-[979px] aspect-video">
              <iframe
                src={videoEmbedUrl}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 4 -- Services Content (bg-[#f0ecfe])                 */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f0ecfe" }}>
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          {/* 4a: Intro heading */}
          <div
            className="text-center"
            style={{
              fontSize: 40,
              fontWeight: 400,
              lineHeight: "56px",
              maxWidth: 924,
            }}
          >
            <p>
              <span className="text-black">{servicesIntroHeadingPart1}</span>
              <span style={{ color: "#8015e8" }}>{servicesIntroHeadingAccent}</span>
              <span className="text-black">{servicesIntroHeadingPart2}</span>
            </p>
          </div>

          {/* Services intro image */}
          {servicesIntroImageSrc && (
            <div style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={servicesIntroImageSrc}
                alt="Monday.com Partners"
                width={924}
                height={0}
                className="w-full max-w-[924px] h-auto object-contain"
              />
            </div>
          )}

          {/* 4b: Two feature cards */}
          {featureCards.length > 0 && (
          <div
            className="flex justify-center"
            style={{ gap: 28, marginTop: 60, maxWidth: 1200, width: "100%" }}
          >
            {featureCards.map((card, i) => (
              <div
                key={card._key ?? i}
                className="flex-1"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e8e6e6",
                  borderRadius: "var(--radius-card)",
                  padding: 28,
                }}
              >
                <div className="flex items-start" style={{ gap: 29 }}>
                  <span style={{ fontSize: 60 }}>{card.emoji}</span>
                  <h3
                    style={{
                      fontSize: 24,
                      fontWeight: 500,
                      color: "#2b074d",
                    }}
                  >
                    {card.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "22.4px",
                    color: "black",
                    marginTop: 20,
                  }}
                >
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          )}

          {/* 4c: Social proof banner */}
          {(socialProofBannerHtml || socialProofCtaUrl) && (
            <div
              className="flex items-center"
              style={{
                marginTop: 60,
                background:
                  "linear-gradient(98.14deg, rgb(28, 2, 76) 0%, rgb(125, 20, 227) 100.01%)",
                borderRadius: "var(--radius-card)",
                paddingLeft: 27,
                paddingRight: 44,
                paddingTop: 28,
                paddingBottom: 28,
                gap: 24,
                maxWidth: 1200,
                width: "100%",
              }}
            >
              {socialProofBannerHtml && (
                <div
                  className="flex-1"
                  style={{ fontSize: 20, fontWeight: 500, color: "white" }}
                >
                  <PortableText
                    value={socialProofBannerHtml}
                    components={{
                      block: {
                        normal: ({ children }) => {
                          return (
                            <p>
                              {(Array.isArray(children) ? children : [children]).map((child, i) => {
                                if (typeof child !== "string") return child
                                const highlight = "500+ small-medium sized enterprises"
                                const idx = child.indexOf(highlight)
                                if (idx === -1) return child
                                return (
                                  <span key={i}>
                                    {child.slice(0, idx)}
                                    <span style={{ color: "#8015e8" }}>
                                      {highlight}
                                    </span>
                                    {child.slice(idx + highlight.length)}
                                  </span>
                                )
                              })}
                            </p>
                          )
                        },
                      },
                    }}
                  />
                </div>
              )}
              {socialProofCtaUrl && (
                <Link
                  href={socialProofCtaUrl}
                  className="flex shrink-0 items-center justify-center font-bold text-white"
                  style={{
                    width: 216,
                    height: 53,
                    border: "1px solid white",
                    borderRadius: 100,
                    fontSize: 16,
                  }}
                >
                  {socialProofCtaLabel}
                </Link>
              )}
            </div>
          )}

          {/* 4d: Pricing Packages */}
          {packageTiers.length > 0 && (
          <div
            className="flex flex-col items-center"
            style={{ marginTop: 60 }}
          >
            <h2
              className="text-section-h2 text-center text-black"
            >
              {pricingHeading}
            </h2>

            {/* Tabs */}
            <div
              className="flex items-center"
              style={{ gap: 12, marginTop: 28 }}
            >
              {tabKeys.map((tab) => {
                const isActive = tab === activeTab
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
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
                            background:
                              "linear-gradient(to right, #8015e8, #ba83f0)",
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
                    {tab}
                  </button>
                )
              })}
            </div>

            {/* Package card */}
            <div
              style={{
                width: 816,
                backgroundColor: "white",
                border: "1px solid #e8e6e6",
                borderRadius: "var(--radius-card)",
                padding: 28,
                marginTop: 28,
              }}
            >
              {/* Header row */}
              <div
                className="flex items-center"
                style={{ gap: 16 }}
              >
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: "#2b074d",
                    whiteSpace: "nowrap",
                  }}
                >
                  {pkg?.name}
                </h3>
                <span
                  className="flex items-center justify-center shrink-0"
                  style={{
                    border: "1px solid #8015e8",
                    borderRadius: 12,
                    paddingLeft: 25,
                    paddingRight: 25,
                    paddingTop: 6,
                    paddingBottom: 6,
                    color: "#8015e8",
                    fontSize: 16,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {pkg?.badge}
                </span>
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "22.4px",
                  color: "black",
                  marginTop: 24,
                }}
              >
                {pkg?.description?.split("\n").map((line, i) => (
                  <p key={i} style={{ marginTop: i > 0 ? 16 : 0 }}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Support label */}
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  color: "#8015e8",
                  marginTop: 24,
                }}
              >
                {pkg?.supportLabel}
              </p>

              {/* Features grid */}
              <div
                className="grid grid-cols-3"
                style={{ gap: 24, marginTop: 16 }}
              >
                {(pkg?.features ?? []).map((feat, fi) => (
                  <div
                    key={feat._key ?? `${feat.label}-${fi}`}
                    className="flex items-center"
                    style={{ gap: 12 }}
                  >
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 600,
                        color: "#7a14e1",
                      }}
                    >
                      {feat.emoji}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "black",
                      }}
                    >
                      {feat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 -- Testimonials (shared carousel component)        */}
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

      {/* ============================================================ */}
      {/* SECTION 6 -- Calendly Booking                                */}
      {/* ============================================================ */}
      {calendlyUrl && (
        <CalendlySection
          heading={calendlyHeading}
          calendlyUrl={calendlyUrl}
        />
      )}

      {/* ============================================================ */}
      {/* SECTION 7 -- FAQ                                             */}
      {/* ============================================================ */}
      {faqTabs.length > 0 && (
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <div className="mx-auto flex flex-col" style={{ width: 959, gap: 24 }}>
          {/* Heading */}
          <h2 className="text-section-h2" style={{ color: "var(--purple-primary)" }}>
            {faqHeading}
          </h2>

          {/* Tab navigation bar — underline style matching Figma */}
          <div className="flex items-start overflow-auto" style={{ width: 916, height: 52 }}>
            {faqTabs.map((tab) => {
              const label = tab.label ?? ""
              return (
                <button
                  key={tab._key ?? label}
                  onClick={() => {
                    setActiveFaqTab(label)
                    setOpenFaqIndex(0)
                  }}
                  className="h-full shrink-0 relative"
                  style={{
                    paddingTop: 14,
                    paddingBottom: 17,
                    paddingLeft: 27.469,
                    paddingRight: 27.469,
                    borderBottom:
                      activeFaqTab === label
                        ? '3px solid #8e5cbf'
                        : '3px solid transparent',
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      color: activeFaqTab === label ? '#8e5cbf' : 'black',
                      textAlign: 'center',
                    }}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* FAQ items for active tab */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            {activeFaqItems.map((item, i) => (
              <div key={item._key ?? i} style={{ paddingTop: i === 0 ? 20 : 24 }}>
                {/* Question row */}
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex items-center justify-between text-left"
                  style={{ height: 30 }}
                >
                  <span style={{ fontSize: 20, lineHeight: '24px', color: 'black' }}>
                    {item.question}
                  </span>
                  <div className="shrink-0" style={{ width: 30, height: 30 }}>
                    <svg
                      className={`transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`}
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

                {/* Answer (expanded) */}
                {openFaqIndex === i && (
                  <div
                    style={{
                      paddingBottom: 16,
                      paddingTop: 31,
                      fontSize: 16,
                      lineHeight: '24px',
                      color: 'black',
                    }}
                  >
                    {item.answer}
                  </div>
                )}

                {/* Bottom border */}
                <div
                  style={{
                    borderBottom: '1px solid #2b074d',
                    marginTop: openFaqIndex === i ? 0 : 36,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 8 -- Discover CTA                                    */}
      {/* ============================================================ */}
      <section
        style={{ backgroundColor: "#ece6fc", paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="mx-auto flex flex-col items-center">
          {/* Certifications badge */}
          {discoverBadgeSrc && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={discoverBadgeSrc}
                alt="Certifications"
                width={325}
                height={73}
                className="h-[73px] w-[325px] object-contain"
              />
            </>
          )}

          {/* Heading */}
          {discoverHeading && (
            <h2
              className="text-section-h2 text-center text-black"
              style={{ width: 694, marginTop: 28 }}
            >
              {discoverHeading}
            </h2>
          )}

          {/* Dual CTA buttons */}
          {(discoverPrimaryCtaUrl || discoverSecondaryCtaUrl) && (
            <div
              className="flex items-center justify-center"
              style={{ gap: 24, marginTop: 32, width: 694 }}
            >
              {discoverPrimaryCtaUrl && (
                <Link
                  href={discoverPrimaryCtaUrl}
                  className="flex flex-1 items-center justify-center font-bold"
                  style={{
                    height: 63,
                    borderRadius: 100,
                    backgroundColor: "white",
                    color: "#8015e8",
                    fontSize: 16,
                  }}
                >
                  {discoverPrimaryCtaLabel}
                </Link>
              )}
              {discoverSecondaryCtaUrl && (
                <Link
                  href={discoverSecondaryCtaUrl}
                  className="flex flex-1 items-center justify-center font-bold text-white"
                  style={{
                    height: 63,
                    borderRadius: 100,
                    background: "linear-gradient(to right, #8015e8, #ba83f0)",
                    fontSize: 16,
                  }}
                >
                  {discoverSecondaryCtaLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9 -- Implementation Methodology                     */}
      {/* ============================================================ */}
      {methodologySteps.length > 0 && (
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex flex-col items-center" style={{ gap: 40, width: 959 }}>
          {/* Heading */}
          <h2 className="text-section-h2 text-center">
            <span style={{ color: 'black' }}>{methodologyHeading}</span>
            <br />
            <span style={{ color: 'var(--purple-primary)' }}>{methodologyHeadingAccent}</span>
          </h2>

          {/* Steps grid — 2 columns, number above content in each cell */}
          {/* Row 1: steps 01 + 02 */}
          <div className="flex items-start w-full">
            {methodologySteps.slice(0, 2).map((step, si) => (
              <div
                key={step._key ?? step.number ?? si}
                className="flex flex-col items-start shrink-0"
                style={{ width: 417, paddingBottom: 48 }}
              >
                {/* Number */}
                <div style={{ width: 75, minHeight: 86, paddingTop: 6 }}>
                  <p
                    className="font-extralight text-center"
                    style={{ fontSize: 48, color: '#8015e8', lineHeight: 'normal' }}
                  >
                    {step.number}
                  </p>
                </div>
                {/* Content */}
                <div>
                  <p
                    className="font-bold"
                    style={{ fontSize: 14, color: '#2b074d', lineHeight: '22.4px' }}
                  >
                    {step.title}
                  </p>
                  <p style={{ fontSize: 14, color: '#2b074d', lineHeight: '19.6px', marginTop: 4 }}>
                    {step.description}
                  </p>
                  {step.bullets && step.bullets.length > 0 && (
                    <ul
                      className="list-disc"
                      style={{
                        paddingLeft: 18,
                        paddingTop: 20,
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                      }}
                    >
                      {step.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {step.extraText && (
                    <p
                      style={{
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                        marginTop: 20,
                      }}
                    >
                      {step.extraText}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: steps 03 + 04 */}
          <div className="flex items-start w-full">
            {methodologySteps.slice(2, 4).map((step, si) => (
              <div
                key={step._key ?? step.number ?? si}
                className="flex flex-col items-start shrink-0"
                style={{ width: 417, paddingBottom: 48 }}
              >
                <div style={{ width: 75, minHeight: 86, paddingTop: 6 }}>
                  <p
                    className="font-extralight text-center"
                    style={{ fontSize: 48, color: '#8015e8', lineHeight: 'normal' }}
                  >
                    {step.number}
                  </p>
                </div>
                <div>
                  <p
                    className="font-bold"
                    style={{ fontSize: 14, color: '#2b074d', lineHeight: '22.4px' }}
                  >
                    {step.title}
                  </p>
                  <p style={{ fontSize: 14, color: '#2b074d', lineHeight: '19.6px', marginTop: 4 }}>
                    {step.description}
                  </p>
                  {step.bullets && step.bullets.length > 0 && (
                    <ul
                      className="list-disc"
                      style={{
                        paddingLeft: 18,
                        paddingTop: 20,
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                      }}
                    >
                      {step.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {step.extraText && (
                    <p
                      style={{
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                        marginTop: 20,
                      }}
                    >
                      {step.extraText}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: step 05+ (single-row) */}
          <div className="flex items-start w-full">
            {methodologySteps.slice(4).map((step, si) => (
              <div
                key={step._key ?? step.number ?? si}
                className="flex flex-col items-start shrink-0"
                style={{ width: 417, paddingBottom: 48 }}
              >
                <div style={{ width: 75, minHeight: 86, paddingTop: 6 }}>
                  <p
                    className="font-extralight text-center"
                    style={{ fontSize: 48, color: '#8015e8', lineHeight: 'normal' }}
                  >
                    {step.number}
                  </p>
                </div>
                <div>
                  <p
                    className="font-bold"
                    style={{ fontSize: 14, color: '#2b074d', lineHeight: '22.4px' }}
                  >
                    {step.title}
                  </p>
                  <p style={{ fontSize: 14, color: '#2b074d', lineHeight: '19.6px', marginTop: 4 }}>
                    {step.description}
                  </p>
                  {step.bullets && step.bullets.length > 0 && (
                    <ul
                      className="list-disc"
                      style={{
                        paddingLeft: 18,
                        paddingTop: 20,
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                      }}
                    >
                      {step.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {step.extraText && (
                    <p
                      style={{
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                        marginTop: 20,
                      }}
                    >
                      {step.extraText}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 10 -- Security Badge                                 */}
      {/* ============================================================ */}
      {securityBadgeSrc && (
        <section className="bg-white" style={{ paddingBottom: 80 }}>
          <div className="mx-auto max-w-[976px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={securityBadgeSrc}
              alt="Security certifications"
              width={976}
              height={94}
              className="w-full h-auto"
            />
          </div>
        </section>
      )}
    </div>
  )
}
