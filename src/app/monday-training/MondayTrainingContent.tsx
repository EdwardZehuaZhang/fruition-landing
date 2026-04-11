"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SanityImageRef = { asset?: { _ref?: string } } | null | undefined

interface TrainingItem {
  number?: string
  title?: string
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
  ctaLabel?: string
  ctaUrl?: string
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

  trainingSectionHeading?: string
  trainingTabs?: TrainingTab[]

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
  calendlyUrl?: string

  faqHeading?: string
  faqTabs?: FaqTab[]

  discoverBadge?: SanityImageRef
  discoverHeading?: string
  discoverPrimaryCtaLabel?: string
  discoverPrimaryCtaUrl?: string
  discoverSecondaryCtaLabel?: string
  discoverSecondaryCtaUrl?: string

  securityBadge?: SanityImageRef
}

interface MondayTrainingContentProps {
  data?: MondayTrainingData | null
  carouselLogos?: CarouselLogo[]
  caseStudies?: CaseStudy[]
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MondayTrainingContent({
  data,
  carouselLogos = [],
  caseStudies = [],
}: MondayTrainingContentProps) {
  const trainingTabs = data?.trainingTabs ?? []
  const faqTabs = data?.faqTabs ?? []
  const trainingServices = data?.trainingServices ?? []

  const [activeTrainingTab, setActiveTrainingTab] = useState<number>(0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [activeFaqTab, setActiveFaqTab] = useState<number>(0)

  // Carousel logos — duplicate for the marquee effect
  const normalizedLogos = carouselLogos
    .map((logo, i) => ({
      key: logo._key || `logo-${i}`,
      src: imageUrl(logo.image),
      alt: logo.alt || `Client ${i + 1}`,
    }))
    .filter((l) => l.src)
  const duplicatedLogos = [...normalizedLogos, ...normalizedLogos]

  // Hero image with fallback
  const heroImageSrc = imageUrl(data?.heroImage)
  const heroCertBadgeSrc = imageUrl(data?.heroCertificationBadge)
  const discoverBadgeSrc = imageUrl(data?.discoverBadge)
  const securityBadgeSrc = imageUrl(data?.securityBadge)

  const heroHeadingPart1 =
    data?.heroHeadingPart1 ?? "Get your team official monday.com "
  const heroHeadingAccent = data?.heroHeadingAccent ?? "workflow training"
  const heroSubheading =
    data?.heroSubheading ??
    "Expert Workflow Training delivered by a certified monday partner.\nOur training and adoption programs helps you onboard and adopt monday.com up to 10x faster."

  const primaryCtaLabel =
    data?.heroPrimaryCtaLabel ?? "\ud83d\ude80 Book a Consultation"
  const primaryCtaUrl = data?.heroPrimaryCtaUrl ?? CALENDLY_URL
  const secondaryCtaLabel =
    data?.heroSecondaryCtaLabel ?? "\u25b6\ufe0f Get Started with monday.com"
  const secondaryCtaUrl = data?.heroSecondaryCtaUrl ?? CALENDLY_URL

  const logoCloudPart1 =
    data?.logoCloudHeadingPart1 ?? "Clients who have used our "
  const logoCloudAccent =
    data?.logoCloudHeadingAccent ?? "monday.com expert consulting services"

  const videoEmbedUrl =
    data?.videoEmbedUrl ?? "https://www.youtube.com/embed/7vtrtlfC1Zg"
  const videoTitle =
    data?.videoTitle ??
    "monday CRM Success Story - Star Aviation | Powered by Fruition"

  const trainingSectionHeading =
    data?.trainingSectionHeading ??
    "Our consultants help drive adoption and ensure long term success with monday.com"

  const servicesHeading =
    data?.servicesHeading ??
    "\ud83d\udc69\ud83c\udffd\u200d\ud83d\udcbc\ud83d\udc68\ud83c\udffb\u200d\ud83d\udcbc Our Training Services"

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
    "Schedule A 30-Min Consultation With One of Our monday.com Consultants"
  const calendlyUrl = data?.calendlyUrl ?? CALENDLY_URL

  const faqHeading = data?.faqHeading ?? "Frequently asked questions"

  const discoverHeading =
    data?.discoverHeading ?? "Discover how much monday.com can do for your team."
  const discoverPrimaryCtaLabel =
    data?.discoverPrimaryCtaLabel ?? "\ud83d\ude80 Schedule a Consultation"
  const discoverPrimaryCtaUrl = data?.discoverPrimaryCtaUrl ?? CALENDLY_URL
  const discoverSecondaryCtaLabel =
    data?.discoverSecondaryCtaLabel ?? "\u25b6\ufe0f Get Started with monday.com"
  const discoverSecondaryCtaUrl = data?.discoverSecondaryCtaUrl ?? CALENDLY_URL

  const currentTrainingItems =
    trainingTabs[activeTrainingTab]?.items ?? []
  const currentFaqItems = faqTabs[activeFaqTab]?.items ?? []

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
          <div className="flex items-center" style={{ gap: 22 }}>
            {[
              { src: "/images/partner-platinum.png", alt: "monday.com Platinum Partner" },
              { src: "/images/partner-advanced-delivery.png", alt: "Advanced Delivery Partner" },
              { src: "/images/partner-make.png", alt: "Make Partner" },
            ].map((badge) => (
              <Image
                key={badge.src}
                src={badge.src}
                alt={badge.alt}
                width={120}
                height={44}
                className="h-[44px] w-auto rounded-[5px]"
                style={{ boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.5)" }}
              />
            ))}
          </div>

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

          {/* Certification banner */}
          {heroCertBadgeSrc && (
            <div style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroCertBadgeSrc}
                alt="Certifications"
                width={534}
                height={133}
                className="h-[133px] w-[534px] object-contain"
              />
            </div>
          )}

          {/* Dual CTA */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 20, marginTop: 40, width: 680 }}
          >
            <Link
              href={primaryCtaUrl}
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
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaUrl}
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 330,
                height: 53,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {secondaryCtaLabel}
            </Link>
          </div>

          {/* Hero image */}
          <div
            className="rounded-[24px] overflow-hidden"
            style={{
              width: 1042,
              height: 312,
              backgroundColor: "#d9d9d9",
              marginTop: 40,
            }}
          >
            {heroImageSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroImageSrc}
                alt="monday.com training"
                className="w-full h-full object-cover"
              />
            )}
          </div>
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
      {/* SECTION 3 -- YouTube Video Embed                             */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* SECTION 4 -- Training Intro + Tabbed Content                 */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f0ecfe" }}>
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          {/* Intro heading */}
          <p
            className="text-center"
            style={{
              fontSize: 40,
              fontWeight: 400,
              lineHeight: "56px",
              maxWidth: 924,
            }}
          >
            <span className="text-black">{trainingSectionHeading}</span>
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
            We transform fragmented business processes into cohesive, automated systems that enhance team collaboration and deliver measurable ROI across your entire organisation.
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
                borderRadius: 24,
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
                    <ul className="list-disc" style={{ paddingLeft: 18, marginTop: 8, fontSize: 14, color: '#2b074d', lineHeight: '22.4px' }}>
                      {(item.bullets ?? []).map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 -- monday.com Training Australia (two-column)      */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex items-start" style={{ maxWidth: 1200, gap: 60 }}>
          {/* Left: Text */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#8015e8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              monday.com Training Australia
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 600, color: 'black', lineHeight: '44.8px', marginTop: 12 }}>
              Empower with <span style={{ color: '#8015e8' }}>monday.com training</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: '24px', color: 'black', marginTop: 20 }}>
              Make sure all key stakeholders get the onboarding they need to feel comfortable using and building on the platform day in and day out.
            </p>
            <p style={{ fontSize: 16, lineHeight: '24px', color: 'black', marginTop: 16 }}>
              So no one is so overwhelmed they decide not to touch it&ndash;or worse, revert to a combination of spreadsheets.
            </p>
            <Link
              href={calendlyUrl}
              className="inline-flex items-center justify-center font-bold text-white"
              style={{
                height: 53,
                paddingLeft: 32,
                paddingRight: 32,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
                marginTop: 32,
              }}
            >
              {"\ud83d\ude80"} Book a Training Session
            </Link>
          </div>

          {/* Right: Image */}
          <div style={{ flex: 1 }}>
            <Image
              src="/images/service-monday-users.png"
              alt="monday.com users training"
              width={540}
              height={380}
              className="rounded-[24px] object-cover w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 -- Our Training Services                           */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f0ecfe", paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <h2 className="text-center" style={{ fontSize: 35, fontWeight: 500, color: 'black' }}>
            {servicesHeading}
          </h2>

          <div className="grid grid-cols-2" style={{ gap: 28, marginTop: 40 }}>
            {trainingServices.map((service, i) => (
              <div
                key={service._key || `${service.title}-${i}`}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e8e6e6",
                  borderRadius: 24,
                  padding: 28,
                }}
              >
                <div className="flex items-start" style={{ gap: 16 }}>
                  <span style={{ fontSize: 40 }}>{service.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: '#2b074d' }}>
                      {service.title}
                    </h3>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#8015e8', marginTop: 4 }}>
                      {service.subtitle}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: '22.4px', color: 'black', marginTop: 16, whiteSpace: 'pre-line' }}>
                  {service.description}
                </p>
                {service.ctaLabel && (
                  <Link
                    href={service.ctaUrl || '#'}
                    className="inline-flex items-center font-semibold"
                    style={{ fontSize: 14, color: '#8015e8', marginTop: 16 }}
                  >
                    {service.ctaLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 -- 500+ CTA Banner                                 */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <div
            className="flex items-center"
            style={{
              background: "linear-gradient(98.14deg, rgb(28, 2, 76) 0%, rgb(125, 20, 227) 100.01%)",
              borderRadius: 24,
              paddingLeft: 27,
              paddingRight: 44,
              paddingTop: 28,
              paddingBottom: 28,
              gap: 24,
            }}
          >
            <p className="flex-1" style={{ fontSize: 20, fontWeight: 500, color: "white" }}>
              Join{" "}
              <span style={{ color: "#d2acf7" }}>500+ businesses</span>
              {" "}that have leveraged our monday.com expert consultants.
            </p>
            <Link
              href={calendlyUrl}
              className="flex shrink-0 items-center justify-center font-bold text-white"
              style={{
                width: 216,
                height: 53,
                border: "1px solid white",
                borderRadius: 100,
                fontSize: 16,
              }}
            >
              {"\ud83d\ude80"} Schedule a Meeting
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8 -- Testimonials                                    */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-4">
        <div className="mx-auto max-w-[1343px]">
          <div className="flex items-center justify-center gap-[89px] mb-[58px] w-full">
            <h2 className="text-[48px] text-black leading-[67.2px] w-[919px] shrink-0">
              {testimonialsHeading}
            </h2>
            <Link
              href={testimonialsCtaUrl}
              className="shrink-0 flex items-center justify-center h-[53px] w-[330px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
            >
              {testimonialsCtaLabel}
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-[16px] gap-y-[18px]">
            {/* Stat card */}
            <div className="relative w-full max-w-[437px] bg-[#10003a] rounded-[24px] shadow-[0px_1px_17px_0px_rgba(0,0,0,0.2)] flex flex-col px-[38px]">
              <div className="pt-[23px] pb-[30px]">
                <p className="font-semibold text-[40px] text-[#ba83f0] leading-[60px]">{statCardValue}</p>
                <p className="font-light text-[24px] text-white leading-[36px]" style={{ whiteSpace: 'pre-line' }}>
                  {statCardSubtitle}
                </p>
              </div>
              <div className="pb-[30px]">
                <Link
                  href={statCardCtaUrl}
                  className="inline-flex items-center justify-center rounded-[100px] border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  {statCardCtaLabel}
                </Link>
              </div>
            </div>
            {caseStudies.map((t, i) => {
              const name = t.clientName ?? ""
              const role =
                t.clientRole && t.clientCompany
                  ? `${t.clientRole}, ${t.clientCompany}`
                  : t.clientRole || t.clientCompany || ""
              const logoSrc = imageUrl(t.logo)
              return (
                <div
                  key={t._id || `${name}-${i}`}
                  className="relative flex flex-col bg-white rounded-[24px] border border-[#e8e6e6] w-full max-w-[437px] min-h-[300px]"
                >
                  <div className="flex items-start justify-between px-[38px] pt-[29px] pb-[18px]">
                    <div>
                      <p className="font-semibold text-[20px] text-[#2b074d] leading-[30px]">{name}</p>
                      <p className="font-light text-[14px] text-[#595959] leading-[21px]">{role}</p>
                    </div>
                    {logoSrc ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={logoSrc}
                        alt={`${name} logo`}
                        className="w-[57px] h-[53px] rounded-full object-contain shrink-0 ml-4"
                      />
                    ) : (
                      <div className="w-[57px] h-[53px] rounded-full bg-[#e8e6e6] shrink-0 ml-4" />
                    )}
                  </div>
                  <div className="px-[38px] flex-1">
                    <p className="text-[15px] text-black leading-[22.5px]">{t.quote}</p>
                  </div>
                  <div className="flex gap-[2px] px-[38px] pb-[35px] pt-4">
                    {[...Array(5)].map((_, si) => (
                      <svg key={si} className="w-[23px] h-[21px]" viewBox="0 0 23 21" fill="#8015E8">
                        <path d="M11.5 0L14.09 7.36H22.06L15.49 11.92L18.08 19.28L11.5 14.72L4.92 19.28L7.51 11.92L0.94 7.36H8.91L11.5 0Z" />
                      </svg>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9 -- Calendly Booking                                */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1200 }}>
          <h2
            className="text-center"
            style={{ fontSize: 35, fontWeight: 500, color: "black", maxWidth: 800 }}
          >
            {calendlyHeading}
          </h2>
          <div
            className="w-full"
            style={{ marginTop: 40, borderRadius: 24, overflow: "hidden", height: 700 }}
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
      {/* SECTION 10 -- FAQ                                            */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <div className="mx-auto flex flex-col" style={{ width: 959, gap: 24 }}>
          <h2 className="font-bold" style={{ fontSize: 32, lineHeight: '38.4px', color: '#8015e8' }}>
            {faqHeading}
          </h2>

          {/* Tab navigation bar */}
          {faqTabs.length > 0 && (
            <div className="flex items-start overflow-auto" style={{ width: 916, height: 52 }}>
              {faqTabs.map((tab, idx) => (
                <button
                  key={tab._key || idx}
                  onClick={() => { setActiveFaqTab(idx); setOpenFaqIndex(0) }}
                  className="h-full shrink-0 relative"
                  style={{
                    paddingTop: 14,
                    paddingBottom: 17,
                    paddingLeft: 27.469,
                    paddingRight: 27.469,
                    borderBottom: activeFaqTab === idx ? '3px solid #8e5cbf' : '3px solid transparent',
                  }}
                >
                  <span style={{ fontSize: 16, color: activeFaqTab === idx ? '#8e5cbf' : 'black', textAlign: 'center' }}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* FAQ items for active tab */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            {currentFaqItems.map((item, i) => (
              <div key={i} style={{ paddingTop: i === 0 ? 20 : 24 }}>
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
                      width="30" height="30" viewBox="0 0 30 30" fill="none"
                    >
                      <path d="M8 12L15 19L22 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
                {openFaqIndex === i && (
                  <div style={{ paddingBottom: 16, paddingTop: 31, fontSize: 16, lineHeight: '24px', color: 'black', whiteSpace: 'pre-line' }}>
                    {item.answer}
                  </div>
                )}
                <div style={{ borderBottom: '1px solid #2b074d', marginTop: openFaqIndex === i ? 0 : 36 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

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
            className="text-center font-medium"
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 35,
              color: "black",
              width: 694,
              marginTop: 28,
            }}
          >
            {discoverHeading}
          </h2>
          <div
            className="flex items-center justify-center"
            style={{ gap: 24, marginTop: 32, width: 694 }}
          >
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
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 12 -- Security Badge                                 */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingBottom: 80 }}>
        <div className="mx-auto max-w-[976px]">
          {securityBadgeSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={securityBadgeSrc}
              alt="Security certifications"
              width={976}
              height={94}
              className="w-full h-auto"
            />
          )}
        </div>
      </section>
    </div>
  )
}
