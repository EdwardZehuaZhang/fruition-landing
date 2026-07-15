"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { urlFor } from "@/sanity/image"
import TestimonialsGrid from "@/components/sections/TestimonialsGrid"
import CalendlySection from "@/components/sections/CalendlySection"
import FaqAccordion from "@/components/sections/FaqAccordion"
import CroSections, { type CroSectionsData } from "@/components/sections/CroSections"
import StickyCtaBar from "@/components/sections/StickyCtaBar"
import CtaLabel from "@/components/CtaLabel"
import FramedMedia from "@/components/common/FramedMedia"
import type { FaqTab as SharedFaqTab } from "@/components/sections/types"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// Sanity image reference (we take `any`-ish shape because the field is
// just `type: 'image'` on the schema)
type SanityImage = {
  asset?: { _ref?: string; _id?: string } | null
} | null | undefined

interface PackageTier {
  _key?: string
  name?: string
  hours?: string
  basePrice?: number
  pricePrefix?: string
  featured?: boolean
  features?: string[]
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
  pricingSubheading?: string
  pricingFootnote?: string
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

  croSections?: CroSectionsData
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

  /* ------------- Pricing cards (new) ------------- */
  type CurrencyCode = "USD" | "SGD" | "GBP" | "AUD" | "EUR"
  type RegionCode = "US" | "UK" | "APAC"

  const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number; locale: string; label: string }> = {
    USD: { symbol: "$", rate: 1, locale: "en-US", label: "USD" },
    SGD: { symbol: "S$", rate: 1.34, locale: "en-SG", label: "SGD" },
    GBP: { symbol: "£", rate: 0.79, locale: "en-GB", label: "GBP" },
    AUD: { symbol: "A$", rate: 1.52, locale: "en-AU", label: "AUD" },
    EUR: { symbol: "€", rate: 0.92, locale: "de-DE", label: "EUR" },
  }
  const REGIONS: Record<RegionCode, { label: string; multiplier: number }> = {
    US: { label: "US", multiplier: 1.0 },
    UK: { label: "UK", multiplier: 0.95 },
    APAC: { label: "APAC", multiplier: 0.85 },
  }
  type PricingTier = {
    name: string
    hours: string
    basePrice: number
    pricePrefix?: string
    features: string[]
    featured?: boolean
  }
  const PRICING_TIERS: PricingTier[] = (data?.packageTiers ?? [])
    .filter((t): t is PackageTier => !!t && typeof t.name === "string" && typeof t.basePrice === "number")
    .map((t) => ({
      name: t.name as string,
      hours: t.hours ?? "",
      basePrice: t.basePrice as number,
      pricePrefix: t.pricePrefix,
      features: (t.features ?? []).filter((f): f is string => typeof f === "string"),
      featured: !!t.featured,
    }))
  const [currency, setCurrency] = useState<CurrencyCode>("USD")
  const [region, setRegion] = useState<RegionCode>("US")
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [hoveredTier, setHoveredTier] = useState<string | null>(null)
  const [currencyHover, setCurrencyHover] = useState(false)
  const [regionHover, setRegionHover] = useState(false)
  const currencyRef = useRef<HTMLDivElement | null>(null)
  const regionRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node
      if (currencyRef.current && !currencyRef.current.contains(t)) setCurrencyOpen(false)
      if (regionRef.current && !regionRef.current.contains(t)) setRegionOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const formatPrice = (base: number): string => {
    const { rate, locale, symbol } = CURRENCIES[currency]
    const adjusted = base * REGIONS[region].multiplier * rate
    const rounded = Math.round(adjusted / 100) * 100
    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(rounded)
    return `${symbol}${formatted}`
  }

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
      <StickyCtaBar mobileLabel="Book a call" label={data?.croSections?.stickyCtaLabel} href={data?.croSections?.stickyCtaUrl || calendlyUrl || ""} />
      {/* ============================================================ */}
      {/* SECTION 1 -- Hero                                            */}
      {/* ============================================================ */}
      <section className="bg-surface">
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingLeft: 273, paddingRight: 273, paddingTop: 80, paddingBottom: 80 }}
        >
          {/* Partner badges */}
          {heroPartnerBadges.length > 0 && (
            <div className="flex items-center" style={{ gap: 22 }}>
              {heroPartnerBadges.map((badge) => (
                <FramedMedia key={badge._key ?? badge.src} className="dark:!p-1">
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    width={120}
                    height={44}
                    className="h-[44px] w-auto rounded-[5px]"
                    unoptimized
                  />
                </FramedMedia>
              ))}
            </div>
          )}

          {/* Heading */}
          <h1
            className="text-center font-bold"
            style={{
              fontSize: "clamp(32px, 8vw, 48px)",
              lineHeight: "1.2",
              marginTop: 42,
              maxWidth: 924,
            }}
          >
            <span className="text-body">{heroHeadingPart1}</span>
            <span style={{ color: "#8015e8" }}>{heroHeadingAccent}</span>
            <span className="text-body">{heroHeadingPart2}</span>
          </h1>

          {/* Monday Partners image */}
          <FramedMedia style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/monday-partners.avif"
              alt="Monday.com Partners"
              width={924}
              height={0}
              className="w-full max-w-[924px] h-auto object-contain"
            />
          </FramedMedia>

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
                  <CtaLabel label={heroPrimaryCtaLabel} />
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
                  <CtaLabel label={heroSecondaryCtaLabel} />
                </Link>
              )}
            </div>
          )}

          {/* Hero image */}
          {heroImageSrc && (
            <FramedMedia style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt="monday.com dashboards — project planning and team OKRs"
                width={1042}
                height={312}
                className="rounded-card object-contain bg-white"
                style={{ width: 1042, height: 312 }}
              />
            </FramedMedia>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 -- Logo Cloud with Marquee Scroll                  */}
      {/* ============================================================ */}
      {resolvedCarouselLogos.length > 0 && (
        <section className="bg-surface py-[80px] px-4">
          <div className="flex flex-col gap-[35px] items-center w-full max-w-[1348px] mx-auto">
            {/* Heading */}
            <p className="text-[28px] font-medium leading-[39.2px] text-center">
              <span className="text-body">{logoCloudHeadingPart1}</span>
              <span className="text-[#8015e8]">{logoCloudHeadingAccent}</span>
            </p>

            {/* Horizontal marquee logo strip */}
            <div className="w-full overflow-hidden">
              <div
                className="flex items-center gap-[65px] animate-marquee"
                style={{ width: "max-content" }}
              >
                {duplicatedLogos.map((logo, i) => (
                  <FramedMedia
                    key={`logo-${i}`}
                    className="flex items-center justify-center shrink-0 h-[65px] dark:!p-1.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      height={65}
                      className="h-full w-auto object-contain"
                    />
                  </FramedMedia>
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
        <section className="bg-surface py-[80px] px-[10px]">
          <div className="mx-auto flex flex-col items-center justify-center">
            <div className="w-full max-w-[979px] aspect-video rounded-card overflow-hidden">
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
      {/* SECTION 4 -- Services Content (bg-[#f0ecfe])                 */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "var(--surface-subtle)" }}>
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          {/* 4a: Intro heading */}
          <div
            className="text-center"
            style={{
              fontSize: "clamp(24px, 6vw, 40px)",
              fontWeight: 400,
              lineHeight: 1.3,
              maxWidth: 924,
            }}
          >
            <p>
              <span className="text-body">{servicesIntroHeadingPart1}</span>
              <span style={{ color: "#8015e8" }}>{servicesIntroHeadingAccent}</span>
              <span className="text-body">{servicesIntroHeadingPart2}</span>
            </p>
          </div>

          {/* 4b: Two feature cards */}
          {featureCards.length > 0 && (
          <div
            className="flex justify-center"
            style={{ gap: 28, marginTop: 60, maxWidth: 1200, width: "100%" }}
          >
            {featureCards.map((card, i) => (
              <div
                key={card._key ?? i}
                className="flex-1 dark:shadow-none"
                style={{
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--border-ui)",
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
                      color: "var(--text-body)",
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
                    color: "var(--text-body)",
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
                                    <span style={{ color: "#ba83f0" }}>
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
                  className="flex shrink-0 items-center justify-center gap-2 font-bold text-white transition-colors hover:bg-[#579bfc] hover:border-[#579bfc]"
                  style={{
                    width: 216,
                    height: 53,
                    border: "1px solid white",
                    borderRadius: 100,
                    fontSize: 16,
                  }}
                >
                  <CtaLabel label={socialProofCtaLabel} />
                </Link>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4.5 -- Pricing Packages                              */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "var(--surface)" }}>
        <div
          className="mx-auto flex flex-col w-full"
          style={{ paddingTop: 80, paddingBottom: 80, maxWidth: 1200, paddingLeft: 16, paddingRight: 16 }}
        >
          {/* Header row: heading left, dropdowns right */}
          <div
            className="flex flex-col md:flex-row md:items-end md:justify-between w-full"
            style={{ gap: 24 }}
          >
            <div className="flex flex-col" style={{ maxWidth: 640 }}>
              <h2 className="text-section-h2 text-body" style={{ textAlign: "left" }}>
                {pricingHeading || "Pricing Packages"}
              </h2>
              <p
                style={{
                  marginTop: 14,
                  fontSize: 18,
                  color: "var(--text-muted-fg)",
                  lineHeight: 1.5,
                  textAlign: "left",
                }}
              >
                {data?.pricingSubheading || "Hit the ground running and drive lasting impact with hands-on support"}
              </p>
            </div>

            {/* Toggles */}
            <div
              className="flex flex-wrap items-center"
              style={{ gap: 16 }}
            >
              {/* Currency dropdown */}
              <div ref={currencyRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyOpen((o) => !o)
                    setRegionOpen(false)
                  }}
                  onMouseEnter={() => setCurrencyHover(true)}
                  onMouseLeave={() => setCurrencyHover(false)}
                  className="flex items-center font-semibold"
                  style={{
                    height: 44,
                    paddingLeft: 18,
                    paddingRight: 14,
                    borderRadius: 99,
                    backgroundColor: "var(--surface-raised)",
                    border: `1px solid ${currencyHover || currencyOpen ? "#8015e8" : "var(--border-ui)"}`,
                    color: "var(--text-body)",
                    fontSize: 14,
                    gap: 10,
                    boxShadow: currencyHover
                      ? "0px 4px 12px rgba(128,21,232,0.12)"
                      : "0px 1px 2px rgba(43,7,77,0.04)",
                    transform: currencyHover ? "translateY(-1px)" : "translateY(0)",
                    transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: "#8015e8", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>
                    CURRENCY
                  </span>
                  <span>{CURRENCIES[currency].symbol} {CURRENCIES[currency].label}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: currencyOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                    <path d="M2 4l4 4 4-4" stroke="#8015e8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {currencyOpen && (
                  <div
                    className="dark:shadow-none"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      minWidth: 180,
                      backgroundColor: "var(--surface-raised)",
                      border: "1px solid var(--border-ui)",
                      borderRadius: 16,
                      padding: 6,
                      boxShadow: "0px 12px 32px rgba(43,7,77,0.12)",
                      zIndex: 20,
                    }}
                  >
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                      const active = code === currency
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setCurrency(code)
                            setCurrencyOpen(false)
                          }}
                          className="flex items-center justify-between w-full"
                          style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: active ? 600 : 500,
                            color: active ? "#8015e8" : "var(--text-body)",
                            backgroundColor: active ? "rgba(128,21,232,0.08)" : "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <span>{CURRENCIES[code].label}</span>
                          <span style={{ color: "var(--text-muted-fg)", fontWeight: 400 }}>{CURRENCIES[code].symbol}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Region dropdown */}
              <div ref={regionRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => {
                    setRegionOpen((o) => !o)
                    setCurrencyOpen(false)
                  }}
                  onMouseEnter={() => setRegionHover(true)}
                  onMouseLeave={() => setRegionHover(false)}
                  className="flex items-center font-semibold"
                  style={{
                    height: 44,
                    paddingLeft: 18,
                    paddingRight: 14,
                    borderRadius: 99,
                    backgroundColor: "var(--surface-raised)",
                    border: `1px solid ${regionHover || regionOpen ? "#8015e8" : "var(--border-ui)"}`,
                    color: "var(--text-body)",
                    fontSize: 14,
                    gap: 10,
                    boxShadow: regionHover
                      ? "0px 4px 12px rgba(128,21,232,0.12)"
                      : "0px 1px 2px rgba(43,7,77,0.04)",
                    transform: regionHover ? "translateY(-1px)" : "translateY(0)",
                    transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: "#8015e8", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>
                    TEAM
                  </span>
                  <span>{REGIONS[region].label}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: regionOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                    <path d="M2 4l4 4 4-4" stroke="#8015e8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {regionOpen && (
                  <div
                    className="dark:shadow-none"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      minWidth: 180,
                      backgroundColor: "var(--surface-raised)",
                      border: "1px solid var(--border-ui)",
                      borderRadius: 16,
                      padding: 6,
                      boxShadow: "0px 12px 32px rgba(43,7,77,0.12)",
                      zIndex: 20,
                    }}
                  >
                    {(Object.keys(REGIONS) as RegionCode[]).map((code) => {
                      const active = code === region
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setRegion(code)
                            setRegionOpen(false)
                          }}
                          className="flex items-center justify-between w-full"
                          style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: active ? 600 : 500,
                            color: active ? "#8015e8" : "var(--text-body)",
                            backgroundColor: active ? "rgba(128,21,232,0.08)" : "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <span>{REGIONS[code].label}</span>
                          <span style={{ color: "var(--text-muted-fg)", fontWeight: 400, fontSize: 12 }}>
                            {code === "US" ? "Americas" : code === "UK" ? "EMEA" : "Asia-Pacific"}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* Cards */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 w-full"
              style={{ gap: 24, marginTop: 44 }}
            >
              {PRICING_TIERS.map((tier) => {
                const featured = !!tier.featured
                const hovered = hoveredTier === tier.name
                const baseTranslate = featured ? -12 : 0
                const hoverLift = hovered ? -4 : 0
                return (
                  <div
                    key={tier.name}
                    className={`flex flex-col${featured ? "" : " dark:shadow-none"}`}
                    onMouseEnter={() => setHoveredTier(tier.name)}
                    onMouseLeave={() => setHoveredTier(null)}
                    style={{
                      borderRadius: 28,
                      padding: 32,
                      position: "relative",
                      transition: "transform 200ms ease, box-shadow 200ms ease",
                      transform: `translateY(${baseTranslate + hoverLift}px)`,
                      ...(featured
                        ? {
                            background: "linear-gradient(160deg, #7d14e3 0%, #5a0eb0 100%)",
                            color: "white",
                            boxShadow: hovered
                              ? "0px 32px 72px rgba(125,20,227,0.45), 0px 0px 0px 1px rgba(125,20,227,0.4)"
                              : "0px 24px 60px rgba(125,20,227,0.35), 0px 0px 0px 1px rgba(125,20,227,0.4)",
                          }
                        : {
                            backgroundColor: "var(--surface-raised)",
                            border: "1px solid var(--border-ui)",
                            color: "var(--text-body)",
                            boxShadow: hovered
                              ? "0px 16px 36px rgba(43,7,77,0.12)"
                              : "0px 8px 24px rgba(43,7,77,0.06)",
                          }),
                    }}
                  >
                    {/* Name */}
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: featured ? "white" : "var(--text-body)",
                      }}
                    >
                      {tier.name}
                    </h3>

                    {/* Hours */}
                    <p
                      style={{
                        fontSize: 14,
                        marginTop: 4,
                        color: featured ? "rgba(255,255,255,0.78)" : "var(--text-muted-fg)",
                        fontWeight: 500,
                      }}
                    >
                      {tier.hours}
                    </p>

                    {/* Price */}
                    <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
                      {tier.pricePrefix && (
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 500,
                            color: featured ? "rgba(255,255,255,0.85)" : "var(--text-muted-fg)",
                          }}
                        >
                          {tier.pricePrefix}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 40,
                          fontWeight: 600,
                          lineHeight: 1,
                          color: featured ? "white" : "var(--text-body)",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {formatPrice(tier.basePrice)}
                      </span>
                    </div>
                    <p
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: featured ? "rgba(255,255,255,0.7)" : "var(--text-muted-fg)",
                      }}
                    >
                      {CURRENCIES[currency].label} · {REGIONS[region].label} team rate
                    </p>

                    {/* Divider */}
                    <div
                      style={{
                        marginTop: 24,
                        marginBottom: 20,
                        height: 1,
                        backgroundColor: featured ? "rgba(255,255,255,0.18)" : "var(--border-ui)",
                      }}
                    />

                    {/* Features */}
                    <ul className="flex flex-col" style={{ gap: 12 }}>
                      {tier.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start"
                          style={{ gap: 10, fontSize: 14, lineHeight: 1.5 }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 11 11"
                            fill="none"
                            className="shrink-0"
                            style={{ marginTop: 4 }}
                          >
                            <path
                              d="M1.5 5.6l2.6 2.6L9.5 2.8"
                              stroke={featured ? "white" : "#8015e8"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span style={{ color: featured ? "rgba(255,255,255,0.95)" : "var(--text-body)" }}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href={heroPrimaryCtaUrl || "#"}
                      className="flex items-center justify-center font-bold"
                      style={{
                        marginTop: 28,
                        height: 48,
                        borderRadius: 100,
                        fontSize: 14,
                        ...(featured
                          ? {
                              backgroundColor: "white",
                              color: "#8015e8",
                            }
                          : {
                              background: "linear-gradient(to right, #8015e8, #ba83f0)",
                              color: "white",
                            }),
                      }}
                    >
                      Get started
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Footnote */}
            <p
              className="text-center"
              style={{
                marginTop: 28,
                fontSize: 12,
                color: "var(--text-muted-fg)",
                fontStyle: "italic",
              }}
            >
              {data?.pricingFootnote || "*Please note: you must purchase one package per product. Prices shown are estimates and may vary by scope."}
            </p>
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
      {/* SECTION 5b -- CRO action items                               */}
      {/* ============================================================ */}
      <CroSections
        data={data?.croSections}
        primaryCtaLabel={data?.heroPrimaryCtaLabel}
        primaryCtaUrl={data?.heroPrimaryCtaUrl || calendlyUrl}
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
        <FaqAccordion heading={faqHeading} tabs={faqTabs as SharedFaqTab[]} />
      )}

      {/* ============================================================ */}
      {/* SECTION 8 -- Discover CTA                                    */}
      {/* ============================================================ */}
      <section
        style={{ backgroundColor: "var(--surface-subtle)", paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="mx-auto flex flex-col items-center">
          {/* Certifications badge */}
          {discoverBadgeSrc && (
            <FramedMedia>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={discoverBadgeSrc}
                alt="Certifications"
                width={325}
                height={73}
                className="h-[73px] w-[325px] object-contain"
              />
            </FramedMedia>
          )}

          {/* Heading */}
          {discoverHeading && (
            <h2
              className="text-section-h2 text-center text-body"
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
                  <CtaLabel label={discoverPrimaryCtaLabel} />
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
                  <CtaLabel label={discoverSecondaryCtaLabel} />
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
      <section className="bg-surface" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8" style={{ gap: 56, maxWidth: 1040 }}>
          {/* Heading */}
          <h2 className="text-section-h2 text-center">
            <span style={{ color: 'var(--text-body)' }}>{methodologyHeading}</span>
            <br />
            <span style={{ color: 'var(--purple-primary)' }}>{methodologyHeadingAccent}</span>
          </h2>

          {/* Steps grid — 2 columns on md+, 1 column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full" style={{ gap: "48px 64px" }}>
            {methodologySteps.map((step, si) => (
              <div
                key={step._key ?? step.number ?? si}
                className="flex flex-col items-start"
              >
                {/* Number */}
                <p
                  className="font-extralight"
                  style={{ fontSize: 56, color: '#8015e8', lineHeight: 1, marginBottom: 16 }}
                >
                  {step.number}
                </p>
                {/* Content */}
                <h3
                  className="font-bold"
                  style={{ fontSize: 18, color: 'var(--text-body)', lineHeight: 1.4, marginBottom: 8 }}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p style={{ fontSize: 15, color: 'var(--text-muted-fg)', lineHeight: 1.6 }}>
                    {step.description}
                  </p>
                )}
                {step.bullets && step.bullets.length > 0 && (
                  <ul
                    className="list-disc"
                    style={{
                      paddingLeft: 20,
                      marginTop: 16,
                      fontSize: 15,
                      color: 'var(--text-muted-fg)',
                      lineHeight: 1.6,
                    }}
                  >
                    {step.bullets.map((b, bi) => (
                      <li key={bi} style={{ marginBottom: 4 }}>{b}</li>
                    ))}
                  </ul>
                )}
                {step.extraText && (
                  <p
                    style={{
                      fontSize: 15,
                      color: 'var(--text-muted-fg)',
                      lineHeight: 1.6,
                      marginTop: 16,
                    }}
                  >
                    {step.extraText}
                  </p>
                )}
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
        <section className="bg-surface" style={{ paddingBottom: 80 }}>
          <FramedMedia className="mx-auto max-w-[976px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={securityBadgeSrc}
              alt="Security certifications"
              width={976}
              height={94}
              className="w-full h-auto"
            />
          </FramedMedia>
        </section>
      )}
    </div>
  )
}
