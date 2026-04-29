"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import StatsBlockView from "@/features/page-builder/blocks/StatsBlockView"
import TestimonialsGrid from "@/components/sections/TestimonialsGrid"
import CalendlySection from "@/components/sections/CalendlySection"
import PaperPlaneIcon from "@/components/common/icons/PaperPlaneIcon"
import FaqAccordion from "@/components/sections/FaqAccordion"
import LeftRightSection from "@/components/sections/LeftRightSection"
import type { FaqTab as SharedFaqTab } from "@/components/sections/types"
import type { SiteSettings } from "@/features/page-builder/types"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SanityImageRef = { asset?: { _ref?: string } } | null | undefined

interface TrainingItem {
  number?: string
  title?: string
  description?: string
  bullets?: string[]
}

interface TrainingTab {
  _key?: string
  label?: string
  items?: TrainingItem[]
}

interface TrainingService {
  _key?: string
  emoji?: string
  title?: string
  subtitle?: string
  description?: string
  image?: SanityImageRef
  ctaLabel?: string
  ctaUrl?: string
}

interface JoinSectionStat {
  _key?: string
  value?: string
  label?: string
}

interface FaqPair {
  question?: string
  answer?: string
}

interface FaqTab {
  _key?: string
  label?: string
  items?: FaqPair[]
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

interface MondayTrainingData {
  title?: string
  seoTitle?: string
  seoDescription?: string

  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroSubheading?: string
  heroPartnerBadges?: Array<{ _key?: string; image?: SanityImageRef; alt?: string }>
  heroMondayPartnersImage?: SanityImageRef
  heroImage?: SanityImageRef
  heroCertificationBadge?: SanityImageRef
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string

  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string

  videoEmbedUrl?: string
  videoTitle?: string

  trainingIntroHeading?: string
  trainingIntroSubheading?: string

  trainingSectionHeading?: string
  trainingTabs?: TrainingTab[]

  empowerEyebrow?: string
  empowerHeading?: string
  empowerBody?: string
  empowerImage?: SanityImageRef
  empowerCtaLabel?: string
  empowerCtaUrl?: string

  servicesHeading?: string
  trainingServices?: TrainingService[]

  testimonialsHeading?: string
  testimonialsCtaLabel?: string
  testimonialsCtaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string

  calendlyHeading?: string
  calendlySubheading?: string
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
  joinSectionStats?: JoinSectionStat[]
  joinSectionFootnote?: string
  joinSectionBadge?: SanityImageRef

  securityBadge?: SanityImageRef
}

interface NavbarPartnerBadge {
  name?: string
  image?: SanityImageRef
  width?: number
  height?: number
}

interface MondayTrainingContentProps {
  data?: MondayTrainingData | null
  carouselLogos?: CarouselLogo[]
  caseStudies?: CaseStudy[]
  siteSettings?: SiteSettings | null
  /** Central faqItem tabs — overrides `data.faqTabs` when non-empty. */
  faqTabs?: FaqTab[]
  navbarPartnerBadges?: NavbarPartnerBadge[]
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MondayTrainingContent({
  data,
  carouselLogos = [],
  caseStudies = [],
  siteSettings = null,
  faqTabs: faqTabsOverride,
  navbarPartnerBadges,
}: MondayTrainingContentProps) {
  const trainingTabs = data?.trainingTabs ?? []
  const faqTabs = faqTabsOverride?.length ? faqTabsOverride : (data?.faqTabs ?? [])
  const trainingServices = data?.trainingServices ?? []

  const [activeTrainingTab, setActiveTrainingTab] = useState<number>(0)

  // Carousel logos — duplicate for the marquee effect
  const normalizedLogos = carouselLogos
    .map((logo, i) => ({
      key: logo._key || `logo-${i}`,
      src: imageUrl(logo.image),
      alt: logo.alt || `Client ${i + 1}`,
    }))
    .filter((l) => l.src)
  const duplicatedLogos = [...normalizedLogos, ...normalizedLogos]

  const heroImageSrc = imageUrl(data?.heroImage)
  const heroCertBadgeSrc = imageUrl(data?.heroCertificationBadge)
  const discoverBadgeSrc = imageUrl(data?.discoverBadge)
  const securityBadgeSrc = imageUrl(data?.securityBadge)

  type ResolvedPartnerBadge = { _key: string | undefined; src: string; alt: string }
  const sanityBadges: ResolvedPartnerBadge[] = (data?.heroPartnerBadges ?? [])
    .map((b, i): ResolvedPartnerBadge | null => {
      const src = imageUrl(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Partner badge ${i + 1}` }
    })
    .filter((x): x is ResolvedPartnerBadge => x !== null)
  const heroPartnerBadges: ResolvedPartnerBadge[] = sanityBadges.length > 0
    ? sanityBadges
    : (navbarPartnerBadges ?? [])
        .map((b, i): ResolvedPartnerBadge | null => {
          const src = imageUrl(b.image)
          if (!src) return null
          return { _key: `nav-badge-${i}`, src, alt: b.name ?? `Partner badge ${i + 1}` }
        })
        .filter((x): x is ResolvedPartnerBadge => x !== null)
  const heroMondayPartnersImageSrc = imageUrl(data?.heroMondayPartnersImage)
  const empowerImageSrc = imageUrl(data?.empowerImage)

  const heroHeadingPart1 = data?.heroHeadingPart1
  const heroHeadingAccent = data?.heroHeadingAccent
  const heroSubheading = data?.heroSubheading

  const primaryCtaLabel = data?.heroPrimaryCtaLabel
  const primaryCtaUrl = data?.heroPrimaryCtaUrl
  // Secondary CTA is optional — only render when both label and URL are set
  const showSecondaryCta = Boolean(data?.heroSecondaryCtaLabel && data?.heroSecondaryCtaUrl)
  const secondaryCtaLabel = data?.heroSecondaryCtaLabel
  const secondaryCtaUrl = data?.heroSecondaryCtaUrl

  const logoCloudPart1 = data?.logoCloudHeadingPart1
  const logoCloudAccent = data?.logoCloudHeadingAccent

  const videoEmbedUrl = data?.videoEmbedUrl
  const videoTitle = data?.videoTitle

  const trainingIntroHeading = data?.trainingIntroHeading
  const trainingIntroSubheading = data?.trainingIntroSubheading
  const trainingSectionHeading = data?.trainingSectionHeading

  const empowerEyebrow = data?.empowerEyebrow
  const empowerHeading = data?.empowerHeading
  const empowerBody = data?.empowerBody

  const testimonialsHeading = data?.testimonialsHeading
  const testimonialsCtaLabel = data?.testimonialsCtaLabel
  const testimonialsCtaUrl = data?.testimonialsCtaUrl
  const statCardValue = data?.statCardValue
  const statCardSubtitle = data?.statCardSubtitle
  const statCardCtaLabel = data?.statCardCtaLabel
  const statCardCtaUrl = data?.statCardCtaUrl

  const calendlyHeading = data?.calendlyHeading
  const calendlySubheading = data?.calendlySubheading
  const calendlyUrl = data?.calendlyUrl

  const joinSectionHeadingPart1 = data?.joinSectionHeadingPart1
  const joinSectionHeadingAccent = data?.joinSectionHeadingAccent
  const joinSectionHeadingPart2 = data?.joinSectionHeadingPart2
  const joinSectionSubheading = data?.joinSectionSubheading
  const joinSectionStats = data?.joinSectionStats ?? []
  const joinSectionFootnote = data?.joinSectionFootnote
  const joinSectionBadgeSrc = imageUrl(data?.joinSectionBadge)

  const faqHeading = data?.faqHeading

  const discoverHeading = data?.discoverHeading
  const discoverPrimaryCtaLabel = data?.discoverPrimaryCtaLabel
  const discoverPrimaryCtaUrl = data?.discoverPrimaryCtaUrl
  const discoverSecondaryCtaLabel = data?.discoverSecondaryCtaLabel
  const discoverSecondaryCtaUrl = data?.discoverSecondaryCtaUrl

  const currentTrainingItems =
    trainingTabs[activeTrainingTab]?.items ?? []

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

          {/* Certification badge */}
          {heroCertBadgeSrc && (
            <div style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroCertBadgeSrc}
                alt="Certifications"
                width={534}
                height={133}
                className="h-[133px] w-auto object-contain"
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

          {/* CTA(s) — secondary is optional */}
          {(primaryCtaUrl || showSecondaryCta) && (
            <div
              className="flex items-center justify-center flex-wrap"
              style={{ gap: 20, marginTop: 40 }}
            >
              {primaryCtaUrl && (
                <Link
                  href={primaryCtaUrl}
                  className="flex items-center justify-center font-bold text-white"
                  style={{
                    minWidth: 330,
                    paddingLeft: 28,
                    paddingRight: 28,
                    height: 53,
                    borderRadius: 100,
                    background: "linear-gradient(to right, #8015e8, #ba83f0)",
                    fontSize: 16,
                  }}
                >
                  {primaryCtaLabel}
                </Link>
              )}
              {showSecondaryCta && secondaryCtaUrl && (
                <Link
                  href={secondaryCtaUrl}
                  className="flex items-center justify-center font-bold"
                  style={{
                    minWidth: 330,
                    paddingLeft: 28,
                    paddingRight: 28,
                    height: 53,
                    borderRadius: 100,
                    border: "1px solid #8015e8",
                    backgroundColor: "white",
                    color: "#8015e8",
                    fontSize: 16,
                  }}
                >
                  {secondaryCtaLabel}
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
                alt="monday.com training dashboards"
                width={1042}
                height={312}
                className="rounded-card object-contain bg-white"
                style={{ width: 1042, height: 312 }}
              />
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 -- Logo Cloud with Marquee Scroll                  */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-4">
        <div className="flex flex-col gap-[35px] items-center w-full max-w-[1348px] mx-auto">
          <p className="text-[28px] font-medium leading-[39.2px] text-center">
            <span className="text-black">{logoCloudPart1}</span>
            <span className="text-[#8015e8]">{logoCloudAccent}</span>
          </p>
          {duplicatedLogos.length > 0 && (
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
      {/* SECTION 2b -- Video Embed                                    */}
      {/* ============================================================ */}
      {videoEmbedUrl && (
        <section className="bg-white" style={{ paddingBottom: 80 }}>
          <div className="mx-auto" style={{ maxWidth: 1042 }}>
            <div
              className="rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9" }}
            >
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
      {/* SECTION 3 -- Training Intro + Tabbed Content                 */}
      {/* ============================================================ */}
      <section className="relative overflow-visible" style={{ backgroundColor: "#f0ecfe" }}>
        {/* Decorative purple circle bg */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] max-w-none"
          style={{
            backgroundImage: "url(/images/purple-circle-background.avif)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
        <div
          className="relative mx-auto flex flex-col items-center"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          {/* Intro heading (above tabs) */}
          <p
            className="text-center"
            style={{
              fontSize: 40,
              fontWeight: 400,
              lineHeight: "56px",
              maxWidth: 924,
            }}
          >
            <span className="text-black">{trainingIntroHeading}</span>
          </p>

          <p
            className="text-center"
            style={{
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "22.4px",
              color: "black",
              marginTop: 20,
              maxWidth: 924,
            }}
          >
            {trainingIntroSubheading}
          </p>

          {/* Training Tabs */}
          {trainingTabs.length > 0 && (
            <div
              className="flex items-center"
              style={{ gap: 12, marginTop: 40 }}
            >
              {trainingTabs.map((tab, idx) => {
                const isActive = idx === activeTrainingTab
                return (
                  <button
                    key={tab._key || idx}
                    onClick={() => setActiveTrainingTab(idx)}
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

          {/* Tab content card */}
          {currentTrainingItems.length > 0 && (
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
              {currentTrainingItems.map((item, i) => (
                <div key={`${item.number}-${i}`} className="flex items-start" style={{ gap: 20, marginBottom: 28 }}>
                  {/* Number */}
                  <p className="font-extralight shrink-0" style={{ fontSize: 48, color: '#8015e8', lineHeight: 'normal', width: 60, textAlign: 'center' }}>
                    {item.number}
                  </p>
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <p className="font-bold" style={{ fontSize: 16, color: '#2b074d', lineHeight: '22.4px' }}>
                      {item.title}
                    </p>
                    {item.description ? (
                      <p style={{ marginTop: 8, fontSize: 14, color: '#2b074d', lineHeight: '22.4px', whiteSpace: 'pre-line' }}>
                        {item.description}
                      </p>
                    ) : (
                      <ul className="list-disc" style={{ paddingLeft: 18, marginTop: 8, fontSize: 14, color: '#2b074d', lineHeight: '22.4px' }}>
                        {(item.bullets ?? []).map((b, j) => (
                          <li key={j}>{b}</li>
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
      {/* SECTION 4 -- Testimonials (shared carousel component)        */}
      {/* ============================================================ */}
      <TestimonialsGrid
        heading={testimonialsHeading}
        ctaLabel={testimonialsCtaLabel}
        ctaUrl={testimonialsCtaUrl}
        statCardValue={statCardValue}
        statCardSubtitle={statCardSubtitle}
        statCardCtaLabel={statCardCtaLabel}
        statCardCtaUrl={statCardCtaUrl}
        caseStudies={caseStudies}
      />

      {/* ============================================================ */}
      {/* SECTION 5 -- Empower (image left, text right)                */}
      {/* Reuses homepage LeftRightSection layout shell.               */}
      {/* ============================================================ */}
      <LeftRightSection
        imageOnLeft
        image={
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={empowerImageSrc || "/images/empower-monday-training.avif"}
            alt="monday.com users training"
            width={490}
            className="w-full h-auto"
          />
        }
      >
        {empowerEyebrow && (
          <p className="text-[14px] font-medium text-[#8015e8]">
            {empowerEyebrow}
          </p>
        )}
        <h2 className="text-[30px] font-medium text-[#8015e8] leading-[42px]">
          {empowerHeading}
        </h2>
        <div className="text-[16px] text-black leading-[22.4px]" style={{ whiteSpace: "pre-line" }}>
          {empowerBody}
        </div>
        {data?.empowerCtaLabel && data?.empowerCtaUrl && (
          <Link
            href={data.empowerCtaUrl}
            className="group flex items-center justify-center gap-2 h-[53px] w-[326px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] hover:bg-[#579bfc] hover:bg-none text-white text-[16px] font-bold tracking-[0.32px] transition-colors"
          >
            <PaperPlaneIcon />
            {data.empowerCtaLabel}
          </Link>
        )}
      </LeftRightSection>

      {/* ============================================================ */}
      {/* SECTION 5b -- First training service (text left, image right) */}
      {/* ============================================================ */}
      {trainingServices.length > 0 && (() => {
        const service = trainingServices[0]
        const serviceImageSrc =
          imageUrl(service.image) || "/images/monday-training-customization.avif"
        return (
          <LeftRightSection
            beforeRow={
              <div className="flex justify-center mb-[60px]">
                <span
                  className="inline-flex items-center"
                  style={{
                    gap: 8,
                    paddingLeft: 20,
                    paddingRight: 20,
                    height: 39,
                    borderRadius: 99,
                    backgroundColor: "#f0ecfe",
                    color: "#8015e8",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: 18 }}>👩🏽‍💼👨🏻‍💼</span>
                  Our Training Services
                </span>
              </div>
            }
            image={
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={serviceImageSrc}
                alt={service.title ?? ""}
                width={490}
                className="w-full h-auto"
              />
            }
          >
            {service.title && (
              <p className="text-[14px] font-medium text-[#8015e8] flex items-center gap-2">
                {service.emoji && <span>{service.emoji}</span>}
                {service.title}
              </p>
            )}
            {service.subtitle && (
              <h2
                className="text-[30px] font-medium text-black leading-[42px]"
                style={{ whiteSpace: "pre-line" }}
              >
                {service.subtitle}
              </h2>
            )}
            <p
              className="text-[16px] text-black leading-[22.4px]"
              style={{ whiteSpace: "pre-line" }}
            >
              {service.description}
            </p>
            {service.ctaLabel && service.ctaUrl && (
              <Link
                href={service.ctaUrl}
                className="inline-flex items-center font-semibold text-[16px] text-[#8015e8]"
              >
                {service.ctaLabel}
              </Link>
            )}
          </LeftRightSection>
        )
      })()}

      {/* ============================================================ */}
      {/* SECTION 9 -- Calendly Booking                                */}
      {/* ============================================================ */}
      {calendlyUrl && (
        <CalendlySection
          heading={calendlyHeading}
          subheading={calendlySubheading}
          calendlyUrl={calendlyUrl}
        />
      )}

      {/* ============================================================ */}
      {/* SECTION 10 -- FAQ                                            */}
      {/* ============================================================ */}
      <FaqAccordion heading={faqHeading} tabs={faqTabs as SharedFaqTab[]} />

      {/* ============================================================ */}
      {/* SECTION 11 -- Discover CTA                                   */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#ece6fc", paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex flex-col items-center">
          {discoverBadgeSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={discoverBadgeSrc}
              alt="Certifications"
              width={325}
              height={73}
              className="h-[73px] w-[325px] object-contain"
            />
          )}
          <h2
            className="text-section-h2 text-center text-black"
            style={{ width: 694, marginTop: 28 }}
          >
            {discoverHeading}
          </h2>
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
      {/* SECTION 6 -- Remaining Training Services (left-right)         */}
      {/* (Bird's-Eye View, IT Support, Handover Documentation)         */}
      {/* ============================================================ */}
      {trainingServices.length > 1 && (
        <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1200 }}>
            <div className="flex flex-col" style={{ gap: 80 }}>
              {trainingServices.slice(1).map((service, i) => {
                const serviceImageSrc = imageUrl(service.image)
                const isEven = i % 2 === 0
                return (
                  <div
                    key={service._key || `${service.title}-${i + 1}`}
                    className={`flex flex-col items-center gap-[60px] md:items-center md:justify-center ${isEven ? "md:flex-row-reverse" : "md:flex-row"}`}
                  >
                    <div className="w-full max-w-[490px] flex flex-col gap-[23px] items-start">
                      <span
                        className="inline-flex items-center"
                        style={{
                          gap: 8,
                          paddingLeft: 16,
                          paddingRight: 16,
                          height: 32,
                          borderRadius: 99,
                          backgroundColor: "#f0ecfe",
                          color: "#8015e8",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {service.emoji && <span style={{ fontSize: 16 }}>{service.emoji}</span>}
                        {service.title}
                      </span>
                      {service.subtitle && (
                        <h2 className="text-[30px] font-bold text-black leading-[42px]" style={{ whiteSpace: "pre-line" }}>
                          {service.subtitle}
                        </h2>
                      )}
                      <p style={{ fontSize: 16, lineHeight: "24px", color: "black", whiteSpace: "pre-line" }}>
                        {service.description}
                      </p>
                      {service.ctaLabel && service.ctaUrl && (
                        <Link
                          href={service.ctaUrl}
                          className="inline-flex items-center font-semibold"
                          style={{ fontSize: 16, color: "#8015e8" }}
                        >
                          {service.ctaLabel}
                        </Link>
                      )}
                    </div>
                    {serviceImageSrc && (
                      <div className="w-full max-w-[490px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={serviceImageSrc}
                          alt={service.title ?? ""}
                          width={540}
                          height={380}
                          className="rounded-card object-cover w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 11c -- Join 500+ Stats (shared StatsBlockView)       */}
      {/* ============================================================ */}
      <StatsBlockView
        heading={`${joinSectionHeadingPart1 ?? ""}${joinSectionHeadingAccent ?? ""}${joinSectionHeadingPart2 ?? ""}`}
        subheading={joinSectionSubheading}
        stats={joinSectionStats.map((s) => ({ _key: s._key, value: s.value, label: s.label }))}
        footnote={joinSectionFootnote}
        siteSettings={siteSettings || undefined}
        showMondayPartnersBadge={false}
      />

      {/* Security badge removed */}
    </div>
  )
}
