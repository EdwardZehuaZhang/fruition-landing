"use client"

import Link from "next/link"
import { urlFor } from "@/sanity/image"
import {
  LogoCloudMarquee,
  CalendlySection,
  FaqAccordion,
  SecurityBadgeSection,
  TestimonialCtaBanner,
  TestimonialsGrid,
  DiscoverCtaSection,
} from "@/components/sections"
import type {
  CaseStudy,
  SiteSettingsData,
  FaqTab,
  PartnerBadge,
  SanityImageRef,
} from "@/components/sections/types"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).url()
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/*  Challenges data                                                    */
/* ------------------------------------------------------------------ */

const CHALLENGES = [
  {
    emoji: "\u23F0",
    title: "Project Scheduling Delays",
    description:
      "Use monday.com\u2019s timeline & calendar views with automations to keep schedules aligned and notify teams instantly of changes.",
  },
  {
    emoji: "\uD83D\uDCDE",
    title: "Communication Gaps",
    description:
      "Centralize communication, share project updates, and integrate email or Slack so all stakeholders stay in sync.",
  },
  {
    emoji: "\uD83D\uDD04",
    title: "Scope Creep",
    description:
      "Track changes in real time with status updates, approval workflows, and cost-tracking dashboards to stay in control.",
  },
  {
    emoji: "\uD83D\uDCB8",
    title: "Profit Leakage",
    description:
      "Use time-tracking, budget dashboards, and reporting to monitor profitability in real time.",
  },
  {
    emoji: "\uD83D\uDCE6",
    title: "Inventory Management",
    description:
      "Manage inventory levels, link suppliers, and set low-stock alerts with connected boards and automations.",
  },
  {
    emoji: "\uD83D\uDD0D",
    title: "Quality Control Issues",
    description:
      "Build quality checklists, assign accountability, and automate approvals to catch issues before they escalate.",
  },
]

/* ------------------------------------------------------------------ */
/*  Solution cards data (left-right image-text section)                */
/* ------------------------------------------------------------------ */

const SOLUTION_CARDS = [
  {
    eyebrow: "INSTALLATION SCHEDULING",
    heading:
      "Plan installations with timelines and automations.",
    body: "monday.com helps cabinetry renovation companies align delivery dates, installer schedules, and client expectations with visual Gantt and calendar views to keep projects on track.",
    image: "/images/cabinetry/installation-scheduling.avif",
  },
  {
    eyebrow: "INVENTORY TRACKING",
    heading:
      "Track materials and supplies with real-time visibility.",
    body: "From cabinets to hardware, monday.com centralizes inventory management, automates reorder alerts, and connects supplier data to prevent stock shortages and project delays.",
    image: "/images/cabinetry/inventory-tracking.avif",
  },
  {
    eyebrow: "CLIENT COMMUNICATION",
    heading:
      "Centralize approvals and updates for every project.",
    body: "Designers, installers, and clients stay aligned in one platform. Share project updates, collect approvals, and streamline communication to reduce errors and rework.",
    image: "/images/cabinetry/client-communication.avif",
  },
  {
    eyebrow: "CHANGE ORDER MANAGEMENT",
    heading:
      "Control scope changes and avoid costly overruns.",
    body: "Track client requests, approvals, and updated costs in real time. monday.com makes change orders transparent and easy to manage, reducing disputes and delays.",
    image: "/images/cabinetry/change-order-management.avif",
  },
]

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MondayForCabinetryRenovationContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const partnerBadges: PartnerBadge[] = siteSettings?.navbarPartnerBadges || []

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center"
          style={{
            paddingLeft: 273,
            paddingRight: 273,
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          {/* Partner badges */}
          {partnerBadges.length > 0 && (
            <div className="flex items-center" style={{ gap: 22 }}>
              {partnerBadges.map((badge, i) => {
                const src = safeImageUrl(badge.image)
                if (!src) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={badge._key || `badge-${i}`}
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

          {/* Eyebrow */}
          {page.heroEyebrow && (
            <div
              style={{
                marginTop: 32,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--purple-primary)",
              }}
            >
              {page.heroEyebrow}
            </div>
          )}

          {/* Heading */}
          <h1
            className="text-display text-center"
            style={{
              marginTop: page.heroEyebrow ? 16 : 42,
              maxWidth: 924,
            }}
          >
            <span className="text-black">
              {page.heroHeading || page.title || ""}
            </span>
          </h1>

          {/* Subheading */}
          {!page.hideHeroSubheading && page.heroSubheading && (
            <p
              className="text-body-lead text-center text-black"
              style={{
                marginTop: 31,
                maxWidth: 859,
                whiteSpace: "pre-line",
              }}
            >
              {page.heroSubheading}
            </p>
          )}

          {/* CTA buttons */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 20, marginTop: 40, width: 680 }}
          >
            {page.primaryCtaLabel && (
              <Link
                href={page.primaryCtaUrl || calendlyUrl}
                className="flex items-center justify-center font-bold"
                style={{
                  width: 330,
                  height: 53,
                  borderRadius: 100,
                  ...(page.secondaryCtaLabel
                    ? {
                        border: "1px solid #8015e8",
                        backgroundColor: "white",
                        color: "#8015e8",
                      }
                    : {
                        background:
                          "linear-gradient(to right, #8015e8, #ba83f0)",
                        color: "white",
                      }),
                  fontSize: 16,
                }}
              >
                {page.primaryCtaLabel}
              </Link>
            )}
            {page.secondaryCtaLabel && (
              <Link
                href={page.secondaryCtaUrl || calendlyUrl}
                className="flex items-center justify-center font-bold text-white"
                style={{
                  width: 330,
                  height: 53,
                  borderRadius: 100,
                  background: "linear-gradient(to right, #8015e8, #ba83f0)",
                  fontSize: 16,
                }}
              >
                {page.secondaryCtaLabel}
              </Link>
            )}
          </div>

          {/* Hero image */}
          <div style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/cabinetry/hero-cabinetry.avif"
              alt="monday.com for cabinetry renovation project management"
              className="rounded-card"
              style={{ width: 1042, height: "auto" }}
            />
          </div>
        </div>
      </section>

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={
          page.logoCloudHeadingPart1 || "Clients who have used our "
        }
        headingAccent={
          page.logoCloudHeadingAccent ?? "monday.com consulting services"
        }
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Facing these challenges? */}
      <ChallengesSection />

      {/* 4. Left-right image-text solution cards */}
      <SolutionCardsSection />

      {/* 5. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 6. FAQ */}
      {faqTabs && faqTabs.length > 0 ? (
        <FaqAccordion tabs={faqTabs} />
      ) : page.faqTabs?.length > 0 ? (
        <FaqAccordion tabs={page.faqTabs} />
      ) : null}

      {/* 7. Testimonials */}
      <TestimonialsGrid caseStudies={caseStudies} />

      {/* 8. Discover CTA */}
      <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />

      {/* 9. Join 500+ CTA */}
      <TestimonialCtaBanner testimonial={caseStudies?.[0]} />

      {/* 10. Security Badge */}
      {!page.hideSecurityBadgeSection && (
        <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Challenges Section                                                 */
/* ------------------------------------------------------------------ */

function ChallengesSection() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2
          className="text-section-h2 text-center"
          style={{ color: "#2b074d", maxWidth: 700, margin: "0 auto" }}
        >
          Facing these{" "}
          <span style={{ color: "#8015e8" }}>challenges?</span>
        </h2>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 24, marginTop: 48 }}
        >
          {CHALLENGES.map((item) => (
            <div
              key={item.title}
              className="flex flex-col bg-white rounded-card border border-[#ece7fb]"
              style={{
                padding: 28,
                boxShadow: "var(--shadow-whisper)",
              }}
            >
              <span
                style={{ fontSize: 32, lineHeight: 1, marginBottom: 16 }}
              >
                {item.emoji}
              </span>
              <h4
                className="font-bold"
                style={{ fontSize: 18, color: "#2b074d" }}
              >
                {item.title}
              </h4>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  color: "#444",
                  marginTop: 10,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Solution Cards Section (left-right image-text)                     */
/* ------------------------------------------------------------------ */

function SolutionCardsSection() {
  return (
    <section
      className="bg-white"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        <div className="flex flex-col" style={{ gap: 60 }}>
          {SOLUTION_CARDS.map((card, i) => {
            const isEven = i % 2 === 0
            return (
              <div
                key={card.eyebrow}
                className="flex items-start"
                style={{
                  gap: 48,
                  flexDirection: isEven ? "row" : "row-reverse",
                }}
              >
                <div style={{ flex: 1 }}>
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
                  <h3
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: "#2b074d",
                      marginTop: 8,
                    }}
                  >
                    {card.heading}
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: "25.6px",
                      color: "black",
                      marginTop: 20,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {card.body}
                  </p>
                </div>
                <div
                  className="rounded-card overflow-hidden shadow-whisper"
                  style={{ flex: 1, aspectRatio: "16 / 10" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.heading}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
