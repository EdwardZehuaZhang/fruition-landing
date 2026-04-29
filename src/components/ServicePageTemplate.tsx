"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// Loose Sanity image ref (accept any shape; urlFor handles resolution)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageRef = any

interface CarouselLogoEntry {
  alt?: string
  image?: SanityImageRef
}

interface PartnerBadgeEntry {
  name?: string
  image?: SanityImageRef
  width?: number
  height?: number
}

interface SiteSettingsShape {
  carouselLogos?: CarouselLogoEntry[]
  navbarPartnerBadges?: PartnerBadgeEntry[]
  badgeCertifications?: SanityImageRef
  badgeSecurity?: SanityImageRef
  calendlyLink?: string
}

interface CaseStudyShape {
  _id?: string
  clientName?: string
  clientRole?: string
  clientCompany?: string
  quote?: string
  logo?: SanityImageRef
  linkedinUrl?: string
}

interface FaqItemShape {
  question: string
  answer: string
}

interface ServicePageTemplateProps {
  heroHeading: string
  heroSubheading?: string
  heroPurpleAccent?: string
  // Accept either a string URL (legacy) or a Sanity image ref object
  heroImage?: string | SanityImageRef
  certificationBanner?: boolean
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  // New data-driven props
  siteSettings?: SiteSettingsShape | null
  caseStudies?: CaseStudyShape[] | null
  faqItems?: Record<string, FaqItemShape[]>
}

/* ------------------------------------------------------------------ */
/*  Fallback data (used when Sanity data isn't available)              */
/* ------------------------------------------------------------------ */

const FALLBACK_LOGOS = [
  { src: "/images/carousel-logo-1.png", alt: "Client 1" },
  { src: "/images/carousel-logo-2.png", alt: "Client 2" },
  { src: "/images/carousel-logo-3.png", alt: "Client 3" },
  { src: "/images/carousel-logo-4.png", alt: "Client 4" },
  { src: "/images/carousel-logo-5.png", alt: "Client 5" },
  { src: "/images/carousel-logo-6.png", alt: "Client 6" },
  { src: "/images/carousel-logo-7.png", alt: "Client 7" },
  { src: "/images/carousel-logo-8.png", alt: "Client 8" },
  { src: "/images/carousel-logo-9.png", alt: "Client 9" },
  { src: "/images/carousel-logo-10.png", alt: "Client 10" },
  { src: "/images/carousel-logo-11.png", alt: "Client 11" },
]

const FALLBACK_BADGES = [
  { src: "/images/partner-platinum.png", alt: "monday.com Platinum Partner" },
  { src: "/images/partner-advanced-delivery.png", alt: "Advanced Delivery Partner" },
  { src: "/images/partner-make.png", alt: "Make Partner" },
]

const FALLBACK_TESTIMONIALS = [
  {
    name: "Jade Wood",
    role: "Managing Director, Popology",
    quote:
      "We are now utilising monday.com to its full potential, from lead through design and production teams - everyone knows what stage our projects are in, what's next and what our process is.",
  },
  {
    name: "Mairhead McKinley",
    role: "Delivery Manager, Givergy",
    quote:
      "We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information\u2014eliminating the need to email around for updates.",
  },
  {
    name: "Brandon-Lee Horridge",
    role: "Managing Director, BL Air Conditioning",
    quote:
      "This system will save hundreds of thousands of dollars a year guaranteed.",
  },
  {
    name: "Ron Amaram",
    role: "General Manager, Risk 2 Solutions",
    quote:
      "Fruition have been instrumental in moving us to a \u2018single source of truth\u2019 system for managing sales and projects.",
  },
  {
    name: "Lorenzo Tejada-Orrell",
    role: "Chief Innovation Officer, CLSQ",
    quote:
      "Since implementing monday.com, CLSQ has experienced a significant transformation in operational efficiency.",
  },
]

const FAQ_TABS = [
  'Professional Services',
  'monday Work Management',
  'monday CRM',
  'Expert Consultant Guide',
  'General Questions',
] as const

type FaqTab = typeof FAQ_TABS[number]

const FALLBACK_FAQ_ITEMS: Record<FaqTab, { question: string; answer: string }[]> = {
  'Professional Services': [
    {
      question: 'Does monday com have a CRM?',
      answer: 'Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes.',
    },
    {
      question: 'Does monday com have task management?',
      answer: 'Yes, monday.com excels at task management. It provides boards, timelines, Gantt charts, and Kanban views to help teams organize and track tasks efficiently.',
    },
    {
      question: 'Why is monday.com so successful?',
      answer: 'monday.com is successful because of its intuitive interface, powerful automations, flexible customization, and seamless integrations with hundreds of tools businesses already use.',
    },
    {
      question: 'What exactly does monday.com do?',
      answer: 'monday.com is a Work OS that powers teams to run projects, workflows, and everyday work. It centralizes all your work, processes, tools, and files into one platform.',
    },
  ],
  'monday Work Management': [
    {
      question: 'What is monday Work Management?',
      answer: 'monday Work Management is a product built on the monday.com platform specifically designed for project and portfolio management, resource planning, and team collaboration.',
    },
  ],
  'monday CRM': [
    {
      question: 'How does monday CRM compare to other CRMs?',
      answer: 'monday CRM offers unmatched flexibility and customization compared to traditional CRMs. It adapts to your sales process rather than forcing you into rigid workflows.',
    },
  ],
  'Expert Consultant Guide': [
    {
      question: 'What does a monday.com consultant do?',
      answer: 'A monday.com consultant helps businesses plan, implement, and optimize their monday.com setup. They bring best practices, technical expertise, and industry knowledge to ensure maximum ROI.',
    },
  ],
  'General Questions': [
    {
      question: 'How much does monday.com cost?',
      answer: 'monday.com pricing varies by plan and team size. Contact us for a consultation to determine the best plan for your organization.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function renderHeading(heading: string, accent?: string) {
  if (!accent) {
    return <span className="text-black">{heading}</span>
  }

  const idx = heading.indexOf(accent)
  if (idx === -1) {
    return <span className="text-black">{heading}</span>
  }

  const before = heading.slice(0, idx)
  const after = heading.slice(idx + accent.length)

  return (
    <>
      {before && <span className="text-black">{before}</span>}
      <span style={{ color: "#8015e8" }}>{accent}</span>
      {after && <span className="text-black">{after}</span>}
    </>
  )
}

// Resolve a value that may be a string URL or a Sanity image ref to a URL
function resolveImageUrl(
  source: string | SanityImageRef | undefined | null,
  width?: number,
  height?: number,
): string | null {
  if (!source) return null
  if (typeof source === "string") return source
  try {
    let builder = urlFor(source)
    if (width) builder = builder.width(width)
    if (height) builder = builder.height(height)
    if (width && height) builder = builder.fit("crop")
    return builder.url()
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ServicePageTemplate({
  heroHeading,
  heroSubheading,
  heroPurpleAccent,
  heroImage,
  certificationBanner = true,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  siteSettings,
  caseStudies,
  faqItems,
}: ServicePageTemplateProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [activeFaqTab, setActiveFaqTab] = useState<FaqTab>('Professional Services')

  /* -------------------- Derived data -------------------- */

  // Carousel logos: Sanity first, fallback to static PNGs
  const carouselLogos: { src: string; alt: string }[] =
    siteSettings?.carouselLogos && siteSettings.carouselLogos.length > 0
      ? siteSettings.carouselLogos
          .map((logo, i) => {
            const src = resolveImageUrl(logo.image)
            return src ? { src, alt: logo.alt || `Client ${i + 1}` } : null
          })
          .filter((l): l is { src: string; alt: string } => l !== null)
      : FALLBACK_LOGOS

  // Duplicate logos for seamless marquee loop
  const duplicatedLogos = [...carouselLogos, ...carouselLogos]

  // Partner badges
  const partnerBadges: { src: string; alt: string; width: number; height: number }[] =
    siteSettings?.navbarPartnerBadges && siteSettings.navbarPartnerBadges.length > 0
      ? siteSettings.navbarPartnerBadges
          .map((badge) => {
            const src = resolveImageUrl(badge.image)
            return src
              ? {
                  src,
                  alt: badge.name || "Partner badge",
                  width: badge.width || 120,
                  height: badge.height || 44,
                }
              : null
          })
          .filter(
            (b): b is { src: string; alt: string; width: number; height: number } =>
              b !== null,
          )
      : FALLBACK_BADGES.map((b) => ({ ...b, width: 120, height: 44 }))

  // Certification banner: Sanity first, fallback to static
  const certificationBannerUrl =
    resolveImageUrl(siteSettings?.badgeCertifications) || "/images/badge-certifications.png"

  // Security badge: Sanity first, fallback to static
  const securityBadgeUrl =
    resolveImageUrl(siteSettings?.badgeSecurity) || "/images/badge-security.png"

  // Calendly link
  const calendlyLink =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"

  // Testimonials from Sanity caseStudies, or fall back
  const testimonials: { name: string; role: string; quote: string }[] =
    caseStudies && caseStudies.length > 0
      ? caseStudies
          .map((cs) => {
            const name = cs.clientName || ""
            const rolePart = cs.clientRole || ""
            const companyPart = cs.clientCompany || ""
            const role = [rolePart, companyPart].filter(Boolean).join(", ")
            const quote = cs.quote || ""
            if (!name && !quote) return null
            return { name, role, quote }
          })
          .filter((t): t is { name: string; role: string; quote: string } => t !== null)
      : FALLBACK_TESTIMONIALS

  // Hero image URL (accept both string and sanity ref)
  const heroImageUrl = resolveImageUrl(heroImage, 1042, 312)

  // FAQ items — accept prop override, otherwise fall back to hardcoded
  const effectiveFaqItems: Record<string, FaqItemShape[]> = faqItems || FALLBACK_FAQ_ITEMS
  const faqTabs: string[] =
    faqItems && Object.keys(faqItems).length > 0 ? Object.keys(faqItems) : (FAQ_TABS as readonly string[]).slice()
  const currentFaqList: FaqItemShape[] =
    effectiveFaqItems[activeFaqTab] || effectiveFaqItems[faqTabs[0]] || []

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
            {partnerBadges.map((badge) => (
              <Image
                key={badge.src}
                src={badge.src}
                alt={badge.alt}
                width={badge.width}
                height={badge.height}
                className="h-[44px] w-auto rounded-[5px]"
              />
            ))}
          </div>

          {/* Heading */}
          <h1
            className="text-display text-center"
            style={{ marginTop: 42, maxWidth: 924 }}
          >
            {renderHeading(heroHeading, heroPurpleAccent)}
          </h1>

          {/* Subheading */}
          {heroSubheading && (
            <p className="text-body-lead text-center text-black" style={{ marginTop: 31, maxWidth: 859 }}>
              {heroSubheading}
            </p>
          )}

          {/* Certification banner */}
          {certificationBanner && (
            <div style={{ marginTop: 40 }}>
              <Image
                src={certificationBannerUrl}
                alt="Certifications"
                width={534}
                height={133}
                className="h-[133px] w-[534px] object-contain"
                unoptimized={certificationBannerUrl.startsWith("http")}
              />
            </div>
          )}

          {/* Dual CTA */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 20, marginTop: 40, width: 680 }}
          >
            <Link
              href={primaryCtaUrl || calendlyLink}
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
              {primaryCtaLabel || "\ud83d\ude80 Book a Consultation"}
            </Link>
            <Link
              href={secondaryCtaUrl || calendlyLink}
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 330,
                height: 53,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {secondaryCtaLabel || "\u25b6\ufe0f Get Started with monday.com"}
            </Link>
          </div>

          {/* Hero image */}
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={heroHeading}
              width={1042}
              height={312}
              className="rounded-card object-contain bg-white"
              style={{ width: 1042, height: 312, marginTop: 40 }}
              unoptimized={heroImageUrl.startsWith("http")}
            />
          ) : (
            <div
              className="rounded-card"
              style={{
                width: 1042,
                height: 312,
                backgroundColor: "#d9d9d9",
                marginTop: 40,
              }}
            />
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 -- Logo Cloud with Marquee Scroll                  */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-4">
        <div className="flex flex-col gap-[35px] items-center w-full max-w-[1348px] mx-auto">
          {/* Heading */}
          <p className="text-section-h3 text-center">
            <span className="text-black">Clients who have used our </span>
            <span className="text-[#8015e8]">monday.com expert consulting services</span>
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

      {/* ============================================================ */}
      {/* SECTION 3 -- YouTube Video Embed                             */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-[10px]">
        <div className="mx-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-[979px] aspect-video rounded-card overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/7vtrtlfC1Zg"
              title="monday CRM Success Story - Star Aviation | Powered by Fruition"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 -- Testimonials                                    */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-4">
        <div className="mx-auto max-w-[1343px]">
          {/* Header row: heading + CTA side by side */}
          <div className="flex items-center justify-center gap-[89px] mb-[58px] w-full">
            <h2 className="text-section-h2 text-black w-[919px] shrink-0">
              What our customers say about us 🙌
            </h2>
            <Link
              href={calendlyLink}
              className="shrink-0 flex items-center justify-center h-[53px] w-[330px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
            >
              {"\ud83d\ude80"} Start Your Transformation
            </Link>
          </div>

          {/* Cards grid: stat card + testimonials in flex-wrap */}
          <div className="flex flex-wrap gap-x-[16px] gap-y-[18px]">
            {/* Stat card */}
            <div className="relative w-full max-w-[437px] bg-[#10003a] rounded-card shadow-card flex flex-col px-[38px]">
              <div className="pt-[23px] pb-[30px]">
                <p className="font-semibold text-[40px] text-[#ba83f0] leading-[60px]">
                  500+
                </p>
                <p className="font-light text-[24px] text-white leading-[36px]">
                  have maximised their
                  <br />
                  workflows with our
                  <br />
                  monday.com expert support
                </p>
              </div>
              <div className="pb-[30px]">
                <Link
                  href="/customer-testimonials"
                  className="inline-flex items-center justify-center rounded-[100px] border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Read our case studies
                </Link>
              </div>
            </div>

            {/* Testimonial cards */}
            {testimonials.map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                className="relative flex flex-col bg-white rounded-card border border-[#e8e6e6] w-full max-w-[437px] min-h-[300px] shadow-whisper"
              >
                {/* Top: Name + Title */}
                <div className="flex items-start justify-between px-[38px] pt-[29px] pb-[18px]">
                  <div>
                    <p className="font-semibold text-[20px] text-[#2b074d] leading-[30px]">
                      {t.name}
                    </p>
                    <p className="font-light text-[14px] text-[#595959] leading-[21px]">
                      {t.role}
                    </p>
                  </div>
                  {/* Avatar circle */}
                  <div className="w-[57px] h-[53px] rounded-full bg-[#e8e6e6] shrink-0 ml-4" />
                </div>

                {/* Quote */}
                <div className="px-[38px] flex-1">
                  <p className="text-[15px] text-black leading-[22.5px]">
                    {t.quote}
                  </p>
                </div>

                {/* Stars */}
                <div className="flex gap-[2px] px-[38px] pb-[35px] pt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-[23px] h-[21px]"
                      viewBox="0 0 23 21"
                      fill="#8015E8"
                    >
                      <path d="M11.5 0L14.09 7.36H22.06L15.49 11.92L18.08 19.28L11.5 14.72L4.92 19.28L7.51 11.92L0.94 7.36H8.91L11.5 0Z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 -- Calendly Booking                                */}
      {/* ============================================================ */}
      <section className="bg-[#f7f7f7]" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div
          className="mx-auto flex flex-col items-center"
          style={{ maxWidth: 1200 }}
        >
          <h2
            className="text-section-h2 text-center text-black"
            style={{ maxWidth: 800 }}
          >
            Schedule A 30-Min Consultation With One of Our monday.com
            Consultants
          </h2>
          <div
            className="w-full rounded-card overflow-hidden"
            style={{ marginTop: 40, height: 700 }}
          >
            <iframe
              src={calendlyLink}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Schedule a consultation"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 -- FAQ                                             */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <div className="mx-auto flex flex-col" style={{ width: 959, gap: 24 }}>
          {/* Heading */}
          <h2 className="text-section-h2" style={{ color: "var(--purple-primary)" }}>
            Frequently asked questions
          </h2>

          {/* Tab navigation bar */}
          <div className="flex items-start overflow-auto" style={{ width: 916, height: 52 }}>
            {faqTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveFaqTab(tab as FaqTab); setOpenFaqIndex(0) }}
                className="h-full shrink-0 relative"
                style={{
                  paddingTop: 14,
                  paddingBottom: 17,
                  paddingLeft: 27.469,
                  paddingRight: 27.469,
                  borderBottom: activeFaqTab === tab ? '3px solid #8e5cbf' : '3px solid transparent',
                }}
              >
                <span style={{ fontSize: 16, color: activeFaqTab === tab ? '#8e5cbf' : 'black', textAlign: 'center' }}>
                  {tab}
                </span>
              </button>
            ))}
          </div>

          {/* FAQ items for active tab */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            {currentFaqList.map((item, i) => (
              <div key={i} style={{ paddingTop: i === 0 ? 20 : 24 }}>
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
                      width="30" height="30" viewBox="0 0 30 30" fill="none"
                    >
                      <path d="M8 12L15 19L22 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* Answer (expanded) */}
                {openFaqIndex === i && (
                  <div style={{ paddingBottom: 16, paddingTop: 31, fontSize: 16, lineHeight: '24px', color: 'black' }}>
                    {item.answer}
                  </div>
                )}

                {/* Bottom border */}
                <div style={{ borderBottom: '1px solid #2b074d', marginTop: openFaqIndex === i ? 0 : 36 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 -- Discover CTA                                    */}
      {/* ============================================================ */}
      <section
        style={{ backgroundColor: "#ece6fc", paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="mx-auto flex flex-col items-center">
          {/* Certifications badge */}
          <Image
            src={certificationBannerUrl}
            alt="Certifications"
            width={325}
            height={73}
            className="h-[73px] w-[325px] object-contain"
            unoptimized={certificationBannerUrl.startsWith("http")}
          />

          {/* Heading */}
          <h2
            className="text-section-h2 text-center text-black"
            style={{ width: 694, marginTop: 28 }}
          >
            Discover how much monday.com can do for your team.
          </h2>

          {/* Dual CTA buttons */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 24, marginTop: 32, width: 694 }}
          >
            <Link
              href={calendlyLink}
              className="flex flex-1 items-center justify-center font-bold"
              style={{
                height: 63,
                borderRadius: 100,
                backgroundColor: "white",
                color: "#8015e8",
                fontSize: 16,
              }}
            >
              {"\ud83d\ude80"} Schedule a Consultation
            </Link>
            <Link
              href={calendlyLink}
              className="flex flex-1 items-center justify-center font-bold text-white"
              style={{
                height: 63,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {"\u25b6\ufe0f"} Get Started with monday.com
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8 -- Security Badge                                  */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingBottom: 80 }}>
        <div className="mx-auto max-w-[976px]">
          <Image
            src={securityBadgeUrl}
            alt="Security certifications"
            width={976}
            height={94}
            className="w-full h-auto"
            unoptimized={securityBadgeUrl.startsWith("http")}
          />
        </div>
      </section>
    </div>
  )
}
