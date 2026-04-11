"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { urlFor } from "@/sanity/image"

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

  servicesIntroHeading?: PortableTextBlock[]
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
  linkedinUrl?: string
}

interface Props {
  data?: ImplementationPackagesData | null
  carouselLogos?: CarouselLogo[]
  caseStudies?: CaseStudy[]
}

/* ------------------------------------------------------------------ */
/*  Fallback constants (used only if Sanity fields are missing)        */
/* ------------------------------------------------------------------ */

const CALENDLY_URL = "https://calendly.com/global-calendar-fruitionservices"

const FALLBACK_PACKAGE_TIERS: PackageTier[] = [
  {
    tabKey: "Guided",
    name: "Quick Start",
    badge: "7 Day Delivery Timeline / 10 Hours",
    description:
      "Get up and running fast with monday.com. We\u2019ll help you configure templates and train you on best practices for your team\u2019s workflows. Transform monday.com into your centralized hub for project management and collaboration in record time.",
    features: [
      { emoji: "\ud83d\udcc4", label: "Requirements" },
      { emoji: "\ud83d\udcc2", label: "Template Configuration" },
      { emoji: "\ud83d\udc65", label: "Best Practices Training" },
    ],
  },
  {
    tabKey: "Lock-step",
    name: "Growth",
    badge: "14 Day Delivery Timeline / 20 Hours",
    description:
      "Ideal for teams that need deeper customization and hands-on guidance. We\u2019ll work alongside your team to design workflows, automate processes, and ensure full adoption across departments.",
    features: [
      { emoji: "\ud83d\udcc4", label: "Requirements" },
      { emoji: "\ud83d\udcc2", label: "Template Configuration" },
      { emoji: "\ud83d\udc65", label: "Best Practices Training" },
      { emoji: "\u2699\ufe0f", label: "Workflow Automation" },
      { emoji: "\ud83d\udcca", label: "Dashboard Setup" },
    ],
  },
  {
    tabKey: "Bespoke",
    name: "Enterprise",
    badge: "Custom Delivery Timeline / 40+ Hours",
    description:
      "A fully tailored implementation for complex organizations. From integrations to change management, our consultants embed with your team to deliver a comprehensive monday.com rollout.",
    features: [
      { emoji: "\ud83d\udcc4", label: "Requirements" },
      { emoji: "\ud83d\udcc2", label: "Template Configuration" },
      { emoji: "\ud83d\udc65", label: "Best Practices Training" },
      { emoji: "\u2699\ufe0f", label: "Workflow Automation" },
      { emoji: "\ud83d\udcca", label: "Dashboard Setup" },
      { emoji: "\ud83d\udd17", label: "Integrations" },
    ],
  },
]

const FALLBACK_CAROUSEL_LOGOS: { src: string; alt: string }[] = Array.from(
  { length: 11 },
  (_, i) => ({
    src: `/images/carousel-logo-${i + 1}.png`,
    alt: `Client ${i + 1}`,
  })
)

const FALLBACK_TESTIMONIALS: { name: string; role: string; quote: string }[] = [
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

const FALLBACK_FAQ_TABS: FaqTab[] = [
  {
    label: "Professional Services",
    items: [
      {
        question: "Does monday com have a CRM?",
        answer:
          "Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes.",
      },
      {
        question: "Does monday com have task management?",
        answer:
          "Yes, monday.com excels at task management. It provides boards, timelines, Gantt charts, and Kanban views to help teams organize and track tasks efficiently.",
      },
      {
        question: "Why is monday.com so successful?",
        answer:
          "monday.com is successful because of its intuitive interface, powerful automations, flexible customization, and seamless integrations with hundreds of tools businesses already use.",
      },
      {
        question: "What exactly does monday.com do?",
        answer:
          "monday.com is a Work OS that powers teams to run projects, workflows, and everyday work. It centralizes all your work, processes, tools, and files into one platform.",
      },
    ],
  },
]

const FALLBACK_METHODOLOGY_STEPS: MethodologyStep[] = [
  {
    number: "01",
    title: "Discovery and Process Analysis \ud83c\udfaf",
    description:
      "The first step in any monday.com implementation package is understanding your current workflows. During the discovery processes phase, we help businesses analyse their:",
    bullets: [
      "Team structures and responsibilities",
      "Existing project management or task-tracking processes",
      "Automation opportunities and reporting needs",
    ],
    extraText:
      "This phase allows you to identify which boards, dashboards, and integrations are essential to streamline operations.",
  },
  {
    number: "02",
    title: "Platform Configuration & Customisation \u2699\ufe0f",
    description:
      "Based on the discovery findings, we configure monday.com to match your workflows. This includes setting up boards, automations, dashboards, and integrations.",
  },
  {
    number: "03",
    title: "Data Migration & Integration \ud83d\udd04",
    description:
      "We handle migrating your existing data and connecting monday.com with your current tech stack \u2014 email, CRM, accounting, project tools, and more.",
  },
  {
    number: "04",
    title: "Training & Onboarding \ud83d\udc65",
    description:
      "Every team member gets hands-on training tailored to their role. We make sure your team is confident using the platform from day one.",
  },
  {
    number: "05",
    title: "Go-Live & Ongoing Support \ud83d\ude80",
    description:
      "We monitor the rollout, gather feedback, and fine-tune the setup. Post-launch support ensures you get maximum value from your investment.",
  },
]

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
}: Props) {
  // Resolve all fields with fallbacks
  const heroHeadingPart1 = data?.heroHeadingPart1 ?? "monday.com "
  const heroHeadingAccent = data?.heroHeadingAccent ?? "Expert Consulting"
  const heroHeadingPart2 =
    data?.heroHeadingPart2 ?? " & Implementation Packages"
  const heroImageSrc =
    imgSrc(data?.heroImage) ?? "/images/implementation-packages-hero.png"
  const heroCertBadgeSrc =
    imgSrc(data?.heroCertificationBadge) ?? "/images/badge-certifications.png"
  const heroPrimaryCtaLabel =
    data?.heroPrimaryCtaLabel ?? "\ud83d\ude80 Book a Consultation"
  const heroPrimaryCtaUrl = data?.heroPrimaryCtaUrl ?? CALENDLY_URL
  const heroSecondaryCtaLabel =
    data?.heroSecondaryCtaLabel ?? "\u25b6\ufe0f Get Started with monday.com"
  const heroSecondaryCtaUrl = data?.heroSecondaryCtaUrl ?? CALENDLY_URL

  const logoCloudHeadingPart1 =
    data?.logoCloudHeadingPart1 ?? "Clients who have used our "
  const logoCloudHeadingAccent =
    data?.logoCloudHeadingAccent ?? "monday.com expert consulting services"

  const videoEmbedUrl =
    data?.videoEmbedUrl ?? "https://www.youtube.com/embed/7vtrtlfC1Zg"
  const videoTitle =
    data?.videoTitle ??
    "monday CRM Success Story - Star Aviation | Powered by Fruition"

  const servicesIntroHeading = data?.servicesIntroHeading
  const featureCards: FeatureCard[] = data?.featureCards?.length
    ? data.featureCards
    : [
        {
          emoji: "\ud83e\udd1d",
          title: "Flexible Support Options with our monday.com Consultants",
          description:
            "We cater to all support needs. Some of our clients need a quick hand to get started with best practices, others need an end to end solution and adoption plan. Your unique requirements can be achieved with the below three implementation packages.",
        },
        {
          emoji: "\ud83e\uddd1\u200d\ud83d\udcbb",
          title: "Get monday.com Expert Guidance in your time zone",
          description:
            "We cater to all support needs. Some of our clients need a quick hand to get started with best practices, others need an end to end solution and adoption plan. Your unique requirements can be achieved with the below three implementation packages.",
        },
      ]

  const socialProofBannerHtml = data?.socialProofBannerHtml
  const socialProofCtaLabel =
    data?.socialProofCtaLabel ?? "\ud83d\ude80 Schedule a Meeting"
  const socialProofCtaUrl = data?.socialProofCtaUrl ?? CALENDLY_URL

  const pricingHeading = data?.pricingHeading ?? "Pricing Packages"
  const packageTiers: PackageTier[] = data?.packageTiers?.length
    ? data.packageTiers
    : FALLBACK_PACKAGE_TIERS

  const tabKeys = packageTiers.map((t) => t.tabKey ?? "")
  const [activeTab, setActiveTab] = useState<string>(tabKeys[0] ?? "Guided")
  const pkg =
    packageTiers.find((t) => t.tabKey === activeTab) ?? packageTiers[0]

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
  const faqTabs: FaqTab[] = data?.faqTabs?.length
    ? data.faqTabs
    : FALLBACK_FAQ_TABS

  const [activeFaqTab, setActiveFaqTab] = useState<string>(
    faqTabs[0]?.label ?? ""
  )
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const activeFaqTabObj =
    faqTabs.find((t) => t.label === activeFaqTab) ?? faqTabs[0]
  const activeFaqItems: FaqPair[] = activeFaqTabObj?.items ?? []

  const discoverBadgeSrc =
    imgSrc(data?.discoverBadge) ?? "/images/badge-certifications.png"
  const discoverHeading =
    data?.discoverHeading ?? "Discover how much monday.com can do for your team."
  const discoverPrimaryCtaLabel =
    data?.discoverPrimaryCtaLabel ?? "\ud83d\ude80 Schedule a Consultation"
  const discoverPrimaryCtaUrl = data?.discoverPrimaryCtaUrl ?? CALENDLY_URL
  const discoverSecondaryCtaLabel =
    data?.discoverSecondaryCtaLabel ??
    "\u25b6\ufe0f Get Started with monday.com"
  const discoverSecondaryCtaUrl = data?.discoverSecondaryCtaUrl ?? CALENDLY_URL

  const methodologyHeading =
    data?.methodologyHeading ?? "monday.com Implementation Methodology:"
  const methodologyHeadingAccent =
    data?.methodologyHeadingAccent ?? "A Step-by-Step Guide"
  const methodologySteps: MethodologyStep[] = data?.methodologySteps?.length
    ? data.methodologySteps
    : FALLBACK_METHODOLOGY_STEPS

  const securityBadgeSrc =
    imgSrc(data?.securityBadge) ?? "/images/badge-security.png"

  /* -------- Logo carousel (from siteSettings.carouselLogos) -------- */
  const resolvedCarouselLogos: { src: string; alt: string }[] =
    carouselLogos && carouselLogos.length > 0
      ? carouselLogos
          .map((l, i) => {
            const src = imgSrc(l.image)
            if (!src) return null
            return { src, alt: l.alt ?? `Client ${i + 1}` }
          })
          .filter((x): x is { src: string; alt: string } => x !== null)
      : FALLBACK_CAROUSEL_LOGOS

  // Duplicate logos for seamless marquee loop
  const duplicatedLogos = [...resolvedCarouselLogos, ...resolvedCarouselLogos]

  /* -------- Testimonials (from case studies) -------- */
  const resolvedTestimonials: { name: string; role: string; quote: string }[] =
    caseStudies && caseStudies.length > 0
      ? caseStudies.map((cs) => ({
          name: cs.clientName ?? "",
          role: [cs.clientRole, cs.clientCompany].filter(Boolean).join(", "),
          quote: cs.quote ?? "",
        }))
      : FALLBACK_TESTIMONIALS

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
            <span className="text-black">{heroHeadingPart2}</span>
          </h1>

          {/* Certification banner */}
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

          {/* Dual CTA */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 20, marginTop: 40, width: 680 }}
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

          {/* Hero image */}
          <div style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageSrc}
              alt="monday.com dashboards — project planning and team OKRs"
              width={1042}
              height={312}
              className="rounded-[24px] object-cover"
              style={{ width: 1042, height: 312 }}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 -- Logo Cloud with Marquee Scroll                  */}
      {/* ============================================================ */}
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
            {servicesIntroHeading ? (
              <PortableText value={servicesIntroHeading} />
            ) : (
              <p>
                <span className="text-black">As official </span>
                <span style={{ color: "#8015e8" }}>monday.com Partners</span>
                <span style={{ color: "#550e9b" }}>,</span>
                <span className="text-black">
                  {" "}
                  let us help you get set up right, the first time.
                </span>
              </p>
            )}
          </div>

          {/* 4b: Two feature cards */}
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
                  borderRadius: 24,
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

          {/* 4c: Social proof banner */}
          <div
            className="flex items-center"
            style={{
              marginTop: 60,
              background:
                "linear-gradient(98.14deg, rgb(28, 2, 76) 0%, rgb(125, 20, 227) 100.01%)",
              borderRadius: 24,
              paddingLeft: 27,
              paddingRight: 44,
              paddingTop: 28,
              paddingBottom: 28,
              gap: 24,
              maxWidth: 1200,
              width: "100%",
            }}
          >
            <div
              className="flex-1"
              style={{ fontSize: 20, fontWeight: 500, color: "white" }}
            >
              {socialProofBannerHtml ? (
                <PortableText value={socialProofBannerHtml} />
              ) : (
                <p>
                  Over{" "}
                  <span style={{ color: "#d2acf7" }}>
                    500+ small-medium sized enterprises
                  </span>{" "}
                  choose Fruition&rsquo;s monday.com consultants for our clear
                  communication, timely delivery, and transparency on costs.
                </p>
              )}
            </div>
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
          </div>

          {/* 4d: Pricing Packages */}
          <div
            className="flex flex-col items-center"
            style={{ marginTop: 60 }}
          >
            <h2
              className="text-center"
              style={{ fontSize: 35, fontWeight: 500, color: "black" }}
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
                borderRadius: 24,
                padding: 28,
                marginTop: 28,
              }}
            >
              {/* Header row */}
              <div
                className="flex items-center flex-wrap"
                style={{ gap: 36 }}
              >
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: "#2b074d",
                  }}
                >
                  {pkg?.name}
                </h3>
                <span
                  className="flex items-center justify-center"
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
                  }}
                >
                  {pkg?.badge}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "22.4px",
                  color: "black",
                  marginTop: 24,
                }}
              >
                {pkg?.description}
              </p>

              {/* Support Included */}
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  color: "#8015e8",
                  marginTop: 24,
                }}
              >
                Support Included:
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
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 -- Testimonials                                    */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-4">
        <div className="mx-auto max-w-[1343px]">
          {/* Header row: heading + CTA side by side */}
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

          {/* Cards grid: stat card + testimonials in flex-wrap */}
          <div className="flex flex-wrap gap-x-[16px] gap-y-[18px]">
            {/* Stat card */}
            <div className="relative w-full max-w-[437px] bg-[#10003a] rounded-[24px] shadow-[0px_1px_17px_0px_rgba(0,0,0,0.2)] flex flex-col px-[38px]">
              <div className="pt-[23px] pb-[30px]">
                <p className="font-semibold text-[40px] text-[#ba83f0] leading-[60px]">
                  {statCardValue}
                </p>
                <p className="font-light text-[24px] text-white leading-[36px]">
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

            {/* Testimonial cards */}
            {resolvedTestimonials.map((t, ti) => (
              <div
                key={`${t.name}-${ti}`}
                className="relative flex flex-col bg-white rounded-[24px] border border-[#e8e6e6] w-full max-w-[437px] min-h-[300px]"
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
      {/* SECTION 6 -- Calendly Booking                                */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div
          className="mx-auto flex flex-col items-center"
          style={{ maxWidth: 1200 }}
        >
          <h2
            className="text-center"
            style={{
              fontSize: 35,
              fontWeight: 500,
              color: "black",
              maxWidth: 800,
            }}
          >
            {calendlyHeading}
          </h2>
          <div
            className="w-full"
            style={{
              marginTop: 40,
              borderRadius: 24,
              overflow: "hidden",
              height: 700,
            }}
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
      {/* SECTION 7 -- FAQ                                             */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <div className="mx-auto flex flex-col" style={{ width: 959, gap: 24 }}>
          {/* Heading */}
          <h2 className="font-bold" style={{ fontSize: 32, lineHeight: '38.4px', color: '#8015e8' }}>
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

      {/* ============================================================ */}
      {/* SECTION 8 -- Discover CTA                                    */}
      {/* ============================================================ */}
      <section
        style={{ backgroundColor: "#ece6fc", paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="mx-auto flex flex-col items-center">
          {/* Certifications badge */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={discoverBadgeSrc}
            alt="Certifications"
            width={325}
            height={73}
            className="h-[73px] w-[325px] object-contain"
          />

          {/* Heading */}
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

          {/* Dual CTA buttons */}
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
      {/* SECTION 9 -- Implementation Methodology                     */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex flex-col items-center" style={{ gap: 40, width: 959 }}>
          {/* Heading */}
          <h2 className="text-center font-medium" style={{ fontSize: 32, lineHeight: '49px' }}>
            <span style={{ color: 'black' }}>{methodologyHeading}</span>
            <br />
            <span style={{ color: '#8015e8' }}>{methodologyHeadingAccent}</span>
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

      {/* ============================================================ */}
      {/* SECTION 10 -- Security Badge                                 */}
      {/* ============================================================ */}
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
    </div>
  )
}
