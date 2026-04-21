"use client"

import { useState } from "react"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import {
  LogoCloudMarquee,
  CalendlySection,
  FaqAccordion,
  SecurityBadgeSection,
  TestimonialCtaBanner,
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

interface EmojiItem {
  emoji?: string
  text?: string
  _key?: string
}

interface EmojiCard {
  emoji?: string
  title?: string
  description?: string
  _key?: string
}

interface ApproachTab {
  label?: string
  items?: EmojiItem[]
  _key?: string
}

interface NumberedSection {
  number?: string
  title?: string
  bullets?: EmojiItem[]
  _key?: string
}

interface IndustryTab {
  label?: string
  description?: string
  sections?: NumberedSection[]
  _key?: string
}

interface ProductDevTab {
  label?: string
  description?: string
  bullets?: EmojiItem[]
  image?: SanityImageRef
  imageAlt?: string
  _key?: string
}

function youtubeEmbedUrl(url?: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "")
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url
      const v = u.searchParams.get("v")
      return v ? `https://www.youtube.com/embed/${v}` : null
    }
  } catch {
    return null
  }
  return null
}

/* ------------------------------------------------------------------ */
/*  Why Product Teams Choose monday.com                                */
/* ------------------------------------------------------------------ */

const WHY_PRODUCT_TEAMS_CARDS = [
  {
    emoji: "\uD83D\uDDFA\uFE0F",
    title: "Visual Product Roadmaps",
    description:
      "Aligning stakeholders and communicate product vision.",
  },
  {
    emoji: "\uD83C\uDFAF",
    title: "Milestone Tracking",
    description:
      "Milestone tracking with automated progress updates and notifications.",
  },
  {
    emoji: "\uD83D\uDC69\u200D\uD83D\uDCBB\uD83D\uDC68\u200D\uD83D\uDCBB",
    title: "Cross-functional Collaboration",
    description:
      "Enhancing communication between product, engineering, and marketing teams.",
  },
  {
    emoji: "\uD83D\uDCCA",
    title: "Real-time Reporting",
    description:
      "Real-time reporting and updates regarding product development progress and bottlenecks.",
  },
]

/* ------------------------------------------------------------------ */
/*  How to Manage Products — strategic approach tabs                   */
/* ------------------------------------------------------------------ */

const STRATEGY_ITEMS = [
  { emoji: "\uD83D\uDCCA", text: "Define product goals and key performance indicators" },
  { emoji: "\uD83E\uDD1D", text: "Create stakeholder alignment through shared monday.com dashboards" },
  { emoji: "\u2705", text: "Establish product metrics and success criteria" },
]

const BACKLOG_ITEMS = [
  { emoji: "\uD83D\uDD04", text: "Manage sprint planning and backlog grooming" },
  { emoji: "\u2B50", text: "Prioritise features using monday.com's ranking and scoring capabilities" },
  { emoji: "\uD83D\uDCDD", text: "Track user stories and acceptance criteria" },
]

const COORDINATION_ITEMS = [
  { emoji: "\uD83D\uDD17", text: "Integrate development, design, and marketing workflows" },
  { emoji: "\uD83D\uDCAC", text: "Ensure consistent communication across all product stakeholders" },
  { emoji: "\u26A1", text: "Automate handoffs between teams" },
]

const APPROACH_TABS = [
  { label: "Product Strategy & Vision Setting", items: STRATEGY_ITEMS },
  { label: "Product Backlog Management", items: BACKLOG_ITEMS },
  { label: "Cross-Team Coordination", items: COORDINATION_ITEMS },
]

/* ------------------------------------------------------------------ */
/*  Industry-Specific Product Management Solutions                     */
/* ------------------------------------------------------------------ */

const SAAS_SECTIONS = [
  {
    number: "01",
    title: "Feature Development Tracking",
    bullets: [
      { emoji: "\uD83C\uDFC3\u200D\u2642\uFE0F", text: "Manage development sprints across multiple product areas" },
      { emoji: "\u2705", text: "Track feature completion rates and deployment schedules" },
      { emoji: "\uD83D\uDC65", text: "Monitor customer feedback and feature adoption metrics" },
      { emoji: "\uD83D\uDE80", text: "Coordinate product launches with marketing and sales teams" },
    ],
  },
  {
    number: "02",
    title: "Product-Market Fit Analysis",
    bullets: [
      { emoji: "\uD83D\uDCC8", text: "Collect and analyse customer usage data" },
      { emoji: "\uD83D\uDCCA", text: "Track product metrics and key performance indicators" },
      { emoji: "\uD83D\uDCA1", text: "Identify improvement opportunities through customer feedback" },
      { emoji: "\uD83D\uDD0D", text: "Optimise product features based on user behaviour analytics" },
    ],
  },
  {
    number: "03",
    title: "SaaS Product Launch Coordination",
    bullets: [
      { emoji: "\uD83D\uDC69\u200D\uD83D\uDCBB", text: "Orchestrate cross-functional product launches" },
      { emoji: "\uD83E\uDEB2", text: "Manage beta testing programs and user feedback collection" },
      { emoji: "\uD83D\uDCE2", text: "Coordinate marketing campaigns with product releases" },
      { emoji: "\uD83D\uDCC8", text: "Track go-to-market success metrics" },
    ],
  },
]

const MANUFACTURING_SECTIONS = [
  {
    number: "01",
    title: "New Product Development (NPD)",
    bullets: [
      { emoji: "\uD83D\uDCD0", text: "Manage product design and engineering workflows" },
      { emoji: "\u2705", text: "Track regulatory compliance and certification requirements" },
      { emoji: "\uD83E\uDD1D", text: "Coordinate with suppliers and manufacturing partners" },
      { emoji: "\uD83D\uDCB0", text: "Monitor product cost and margin analysis" },
    ],
  },
  {
    number: "02",
    title: "Quality Management Integration",
    bullets: [
      { emoji: "\uD83D\uDD17", text: "Link product specifications with quality control processes" },
      { emoji: "\uD83D\uDCC9", text: "Track defect rates and improvement initiatives" },
      { emoji: "\uD83D\uDD04", text: "Manage corrective and preventive action (CAPA) processes" },
      { emoji: "\uD83D\uDD0D", text: "Ensure traceability from design to production" },
    ],
  },
  {
    number: "03",
    title: "Supply Chain Coordination",
    bullets: [
      { emoji: "\uD83D\uDCCB", text: "Manage bill of materials (BOM) and component sourcing" },
      { emoji: "\uD83D\uDCC5", text: "Incident reporting and tracking" },
      { emoji: "\u2696\uFE0F", text: "Coordinate product launches with production capacity" },
      { emoji: "\uD83D\uDCCA", text: "Monitor inventory levels and demand forecasting" },
    ],
  },
]

const RETAIL_SECTIONS = [
  {
    number: "01",
    title: "Merchandise Planning and Buying",
    bullets: [
      { emoji: "\uD83D\uDECD\uFE0F", text: "Plan seasonal product collections and inventory purchases" },
      { emoji: "\uD83D\uDCCA", text: "Track product performance and sales analytics" },
      { emoji: "\uD83E\uDD1D", text: "Manage vendor relationships and procurement processes" },
      { emoji: "\uD83D\uDCDD", text: "Coordinate pricing strategies and promotional campaigns" },
    ],
  },
  {
    number: "02",
    title: "Private Label Product Development",
    bullets: [
      { emoji: "\uD83D\uDCCB", text: "Manage product specifications and quality requirements" },
      { emoji: "\u23F0", text: "Track sample approvals and production timelines" },
      { emoji: "\uD83E\uDD1D", text: "Coordinate with manufacturers and quality control teams" },
      { emoji: "\uD83D\uDCC8", text: "Monitor product launch success and market performance" },
    ],
  },
  {
    number: "03",
    title: "Omnichannel Product Management",
    bullets: [
      { emoji: "\uD83D\uDD04", text: "Synchronise product information across all sales channels" },
      { emoji: "\uD83D\uDCC1", text: "Manage product content and digital asset workflows" },
      { emoji: "\uD83D\uDCCD", text: "Track inventory levels and availability across locations" },
      { emoji: "\uD83C\uDFAF", text: "Coordinate marketing campaigns with product launches" },
    ],
  },
]

const INDUSTRY_TABS = [
  { label: "SaaS Product Management", description: "SaaS companies leverage Monday.com\u2019s product management capabilities for:", sections: SAAS_SECTIONS },
  { label: "Manufacturing Product Management", description: "Manufacturing companies use Monday.com to streamline complex product development processes:", sections: MANUFACTURING_SECTIONS },
  { label: "Retail Product Management", description: "Retail organisations leverage monday.com for comprehensive product lifecycle management:", sections: RETAIL_SECTIONS },
]

/* ------------------------------------------------------------------ */
/*  Local consultants — Product Development tabs                       */
/* ------------------------------------------------------------------ */

const PRODUCT_DEVELOPMENT_TABS = [
  {
    label: "Epic & Feature Management",
    description:
      "monday.com's hierarchical board structure enables sophisticated product planning. Teams can break down product initiatives into manageable components:",
    bullets: [
      { emoji: "\uD83C\uDFAF", text: "High-level epics linked to strategic objectives" },
      { emoji: "\uD83D\uDDFA\uFE0F", text: "User story mapping with acceptance criteria" },
      { emoji: "\uD83D\uDCCB", text: "Feature specifications with detailed requirements" },
      { emoji: "\uD83D\uDD17", text: "Dependency tracking across multiple product areas" },
    ],
    image: "/images/product-management/sprint-planning.avif",
    imageAlt: "Sprint planning board in monday.com",
  },
  {
    label: "Roadmap Visualisation",
    description:
      "The platform's timeline and Gantt chart views provide powerful roadmap visualisation:",
    bullets: [
      { emoji: "\uD83C\uDFC1", text: "Multi-quarter product planning with milestone markers" },
      { emoji: "\uD83D\uDCAC", text: "Stakeholder communication through automated roadmap updates" },
      { emoji: "\u2696\uFE0F", text: "Resource allocation and capacity planning" },
      { emoji: "\uD83D\uDD2E", text: "Scenario planning for different product launch timelines" },
    ],
    image: "/images/product-management/regular-board.avif",
    imageAlt: "Roadmap board in monday.com",
  },
  {
    label: "Agile Approach",
    description: "monday.com seamlessly supports agile methodologies with:",
    bullets: [
      { emoji: "\uD83D\uDCC5", text: "Sprint planning and backlog management" },
      { emoji: "\uD83D\uDD04", text: "Daily standup automation and progress reports" },
      { emoji: "\uD83D\uDCCA", text: "Burndown charts and velocity tracking" },
      { emoji: "\uD83D\uDD0D", text: "Retrospective planning and action item tracking" },
    ],
    image: "/images/product-management/sprint-retrospective.avif",
    imageAlt: "Sprint retrospective board in monday.com",
  },
  {
    label: "Feature Request Management",
    description: "Centralise and prioritise feature requests with:",
    bullets: [
      { emoji: "\uD83D\uDCE5", text: "Customer feedback integration from multiple channels" },
      { emoji: "\uD83D\uDDF3\uFE0F", text: "Stakeholder voting and prioritisation" },
      { emoji: "\uD83D\uDCCA", text: "Impact vs. effort scoring matrices" },
      { emoji: "\uD83D\uDE80", text: "Automated feature request routing to product teams" },
    ],
    image: "/images/product-management/bugs-queue.avif",
    imageAlt: "Bugs queue board in monday.com",
  },
]

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MondayProductManagementContent({
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
  const heroVideoEmbedSrc = youtubeEmbedUrl(page.heroVideoUrl)

  const featuredTestimonial =
    caseStudies.find(
      (c) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies[0]

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center px-4"
          style={{
            maxWidth: 1200,
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
            style={{ gap: 20, marginTop: 40, maxWidth: 680, width: "100%" }}
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
          {(() => {
            const heroSrc =
              safeImageUrl(page.heroImage) || "/images/product-management/hero.png"
            return (
              <div style={{ marginTop: 40, width: "100%", maxWidth: 1042 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroSrc}
                  alt="monday.com product management boards"
                  className="rounded-card"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            )
          })()}
        </div>
      </section>

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={
          page.logoCloudHeadingAccent ?? "monday.com consulting services"
        }
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Video (underneath logo scroll) */}
      {heroVideoEmbedSrc && (
        <section className="bg-white" style={{ paddingBottom: 80 }}>
          <div className="mx-auto" style={{ maxWidth: 1042 }}>
            <div
              className="rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9" }}
            >
              <iframe
                src={heroVideoEmbedSrc}
                title={page.heroVideoTitle || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 4. Why Product Teams Choose monday.com */}
      <WhyProductTeamsSection
        headingPart1={page.whyProductTeamsHeadingPart1}
        headingAccent={page.whyProductTeamsHeadingAccent}
        subheading={page.whyProductTeamsSubheading}
        cards={page.whyProductTeamsCards}
      />

      {/* 5. How to Manage Products — Strategic Approach */}
      <StrategicApproachSection
        headingPart1={page.strategicApproachHeadingPart1}
        headingAccent={page.strategicApproachHeadingAccent}
        subheading={page.strategicApproachSubheading}
        tabs={page.strategicApproachTabs}
      />

      {/* 5b. Local Consultants — Product Development */}
      <ProductDevelopmentSection
        headingPart1={page.productDevelopmentHeadingPart1}
        headingAccent={page.productDevelopmentHeadingAccent}
        headingPart2={page.productDevelopmentHeadingPart2}
        tabs={page.productDevelopmentTabs}
      />

      {/* 6. Calendly */}
      <CalendlySection
        heading={
          page.calendlyHeading ||
          "Schedule A 30-Min Consultation With One of Our monday.com Consultants"
        }
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 7. Industry-Specific Product Management Solutions */}
      <IndustrySpecificSection
        heading={page.industryProductSolutionsHeading}
        tabs={page.industryProductSolutionsTabs}
      />

      {/* 8. FAQ */}
      {!page.hideFaqSection &&
        ((faqTabs && faqTabs.length > 0) ? (
          <FaqAccordion tabs={faqTabs} />
        ) : page.faqTabs?.length > 0 ? (
          <FaqAccordion tabs={page.faqTabs} />
        ) : null)}

      {/* 10. Testimonial CTA Banner */}
      {!page.hideTestimonialBanner && (
        <TestimonialCtaBanner
          headingPart1={page.joinHeadingPart1 || "Join "}
          headingAccent={page.joinHeadingAccent || "500+ organisations"}
          headingPart2={
            page.joinHeadingPart2 ||
            " that have maximised their workflows with our monday.com expert support"
          }
          primaryCtaUrl={calendlyUrl}
          secondaryCtaUrl={calendlyUrl}
          testimonial={featuredTestimonial}
        />
      )}

      {/* 11. Security Badge */}
      {!page.hideSecurityBadgeSection && (
        <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Why Product Teams Choose monday.com                                */
/* ------------------------------------------------------------------ */

interface WhyProductTeamsSectionProps {
  headingPart1?: string
  headingAccent?: string
  subheading?: string
  cards?: EmojiCard[]
}

function WhyProductTeamsSection({
  headingPart1,
  headingAccent,
  subheading,
  cards,
}: WhyProductTeamsSectionProps) {
  const resolvedHeadingPart1 =
    headingPart1 ?? "Why Product Teams Choose monday.com for "
  const resolvedHeadingAccent = headingAccent ?? "Product Management"
  const resolvedSubheading =
    subheading ??
    "monday.com's product roadmap software capabilities transform how teams plan, track, and execute product strategies. Unlike traditional product management tools, monday.com provides:"
  const resolvedCards: EmojiCard[] =
    cards && cards.length > 0
      ? cards
      : (WHY_PRODUCT_TEAMS_CARDS as EmojiCard[])

  return (
    <section
      style={{
        backgroundColor: "#f7f5ff",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        <h2
          className="text-section-h2 text-center"
          style={{ color: "#000", marginBottom: 16 }}
        >
          {resolvedHeadingPart1}
          <span style={{ color: "#8015e8" }}>{resolvedHeadingAccent}</span>
        </h2>
        <p
          className="text-body text-center mx-auto"
          style={{
            color: "#4a4a4a",
            maxWidth: 820,
            marginBottom: 48,
          }}
        >
          {resolvedSubheading}
        </p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: 24 }}
        >
          {resolvedCards.map((card, i) => (
            <div
              key={card._key || card.title || `why-card-${i}`}
              className="flex flex-col items-center text-center bg-white rounded-card border border-[#ece7fb]"
              style={{ padding: 28, boxShadow: "var(--shadow-whisper)" }}
            >
              <span
                style={{ fontSize: 36, lineHeight: 1, marginBottom: 12 }}
              >
                {card.emoji}
              </span>
              <h3
                className="font-bold"
                style={{ fontSize: 20, color: "#8015e8", marginBottom: 10 }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  color: "#111",
                }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  How to Manage Products — Strategic Approach Tabs                   */
/* ------------------------------------------------------------------ */

interface StrategicApproachSectionProps {
  headingPart1?: string
  headingAccent?: string
  subheading?: string
  tabs?: ApproachTab[]
}

function StrategicApproachSection({
  headingPart1,
  headingAccent,
  subheading,
  tabs,
}: StrategicApproachSectionProps) {
  const resolvedHeadingPart1 =
    headingPart1 ?? "How to Manage Products with monday.com: "
  const resolvedHeadingAccent = headingAccent ?? "A Strategic Approach"
  const resolvedSubheading =
    subheading ??
    "Managing products effectively with monday.com requires understanding both the platform's capabilities and proven product management methodologies. Our monday.com expert consultants guide teams through:"
  const resolvedTabs: ApproachTab[] =
    tabs && tabs.length > 0 ? tabs : (APPROACH_TABS as unknown as ApproachTab[])

  const [activeTab, setActiveTab] = useState(0)
  const active = resolvedTabs[activeTab] ?? resolvedTabs[0]

  return (
    <section
      className="bg-white px-4"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
      <div
        className="mx-auto flex flex-col items-center"
        style={{ maxWidth: 959 }}
      >
        <h2
          className="text-section-h2 text-center text-black"
          style={{ maxWidth: 900 }}
        >
          {resolvedHeadingPart1}
          <span style={{ color: "#8015e8" }}>{resolvedHeadingAccent}</span>
        </h2>
        <p
          className="text-body text-center mx-auto"
          style={{
            color: "#4a4a4a",
            maxWidth: 820,
            marginTop: 16,
            marginBottom: 40,
          }}
        >
          {resolvedSubheading}
        </p>

        {/* Tab buttons */}
        <div
          className="flex justify-center flex-wrap"
          style={{ gap: 12, width: "100%" }}
        >
          {resolvedTabs.map((tab, i) => (
            <button
              key={tab._key || tab.label || `approach-tab-${i}`}
              onClick={() => setActiveTab(i)}
              className="cursor-pointer transition-all"
              style={{
                padding: "10px 32px",
                borderRadius: 99,
                fontSize: 16,
                fontWeight: 600,
                ...(i === activeTab
                  ? {
                      background:
                        "linear-gradient(to right, #8015e8, #ba83f0)",
                      color: "white",
                      boxShadow:
                        "2.83px 2.83px 15px 3px rgba(0,0,0,0.18)",
                      border: "none",
                    }
                  : {
                      backgroundColor: "white",
                      color: "#2b074d",
                      border: "1px solid #e8e6e6",
                    }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className="w-full rounded-card border border-[#e8e6e6]"
          style={{ marginTop: 32, padding: "32px 40px" }}
        >
          <h3
            className="font-semibold"
            style={{ fontSize: 22, color: "#8015e8", marginBottom: 24 }}
          >
            {active?.label}
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {(active?.items ?? []).map((item, i) => (
              <div
                key={item._key || `approach-item-${i}`}
                className="flex items-start"
                style={{ gap: 12 }}
              >
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>
                  {item.emoji}
                </span>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#2b074d",
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Industry-Specific Product Management Solutions                     */
/* ------------------------------------------------------------------ */

interface IndustrySpecificSectionProps {
  heading?: string
  tabs?: IndustryTab[]
}

function IndustrySpecificSection({
  heading,
  tabs,
}: IndustrySpecificSectionProps) {
  const resolvedHeading = heading ?? "Industry-Specific Product Management Solutions"
  const resolvedTabs: IndustryTab[] =
    tabs && tabs.length > 0
      ? tabs
      : (INDUSTRY_TABS as unknown as IndustryTab[])

  const [activeTab, setActiveTab] = useState(0)
  const active = resolvedTabs[activeTab] ?? resolvedTabs[0]

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1c024c 0%, #7d14e3 100%)",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        <h2
          className="text-section-h2 text-center text-white"
          style={{ marginBottom: 40 }}
        >
          {resolvedHeading}
        </h2>

        {/* Tab pills */}
        <div
          className="flex items-center justify-center flex-wrap"
          style={{ gap: 12, marginBottom: 40 }}
        >
          {resolvedTabs.map((tab, idx) => {
            const isActive = idx === activeTab
            return (
              <button
                key={tab._key || tab.label || `industry-tab-${idx}`}
                onClick={() => setActiveTab(idx)}
                className="flex items-center justify-center font-bold"
                style={{
                  height: 39,
                  paddingLeft: 24,
                  paddingRight: 24,
                  borderRadius: 99,
                  fontSize: 14,
                  cursor: "pointer",
                  ...(isActive
                    ? {
                        backgroundColor: "white",
                        color: "#8015e8",
                        boxShadow: "0px 2px 8px rgba(128,21,232,0.35)",
                      }
                    : {
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }),
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab description */}
        <p
          className="text-center mx-auto"
          style={{
            fontSize: 16,
            lineHeight: "25.6px",
            color: "#e8dcfb",
            maxWidth: 800,
            marginBottom: 32,
          }}
        >
          {active?.description}
        </p>

        {/* Numbered sub-sections */}
        <div
          className="mx-auto"
          style={{ maxWidth: 900, display: "flex", flexDirection: "column", gap: 24 }}
        >
          {(active?.sections ?? []).map((section, si) => (
            <div
              key={section._key || section.number || `industry-section-${si}`}
              className="rounded-card"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "32px 40px",
              }}
            >
              <div className="flex items-center" style={{ gap: 16, marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 200,
                    color: "#ba83f0",
                    lineHeight: 1,
                  }}
                >
                  {section.number}
                </span>
                <h3
                  className="font-semibold text-white"
                  style={{ fontSize: 22 }}
                >
                  {section.title}
                </h3>
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ gap: 12 }}
              >
                {(section.bullets ?? []).map((bullet, bi) => (
                  <div
                    key={bullet._key || `industry-bullet-${si}-${bi}`}
                    className="flex items-start"
                    style={{ gap: 10 }}
                  >
                    <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>
                      {bullet.emoji}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: "20px",
                        color: "white",
                      }}
                    >
                      {bullet.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Local Consultants — Product Development                            */
/* ------------------------------------------------------------------ */

interface ProductDevelopmentSectionProps {
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  tabs?: ProductDevTab[]
}

function ProductDevelopmentSection({
  headingPart1,
  headingAccent,
  headingPart2,
  tabs,
}: ProductDevelopmentSectionProps) {
  const resolvedHeadingPart1 = headingPart1 ?? "Local monday.com consultants for "
  const resolvedHeadingAccent = headingAccent ?? "Product Development"
  const resolvedHeadingPart2 =
    headingPart2 ?? " in Australia, United States, and United Kingdom"
  const resolvedTabs: ProductDevTab[] =
    tabs && tabs.length > 0
      ? tabs
      : (PRODUCT_DEVELOPMENT_TABS as unknown as ProductDevTab[])

  const [activeTab, setActiveTab] = useState(0)
  const active = resolvedTabs[activeTab] ?? resolvedTabs[0]
  const activeImageSrc =
    typeof active?.image === "string"
      ? active.image
      : safeImageUrl(active?.image as SanityImageRef | undefined)

  return (
    <section
      style={{
        backgroundColor: "#f7f5ff",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        <h2
          className="text-section-h2 text-center"
          style={{ color: "#000", marginBottom: 40, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}
        >
          {resolvedHeadingPart1}
          <span style={{ color: "#8015e8" }}>{resolvedHeadingAccent}</span>
          {resolvedHeadingPart2}
        </h2>

        {/* Tab pills */}
        <div
          className="flex items-center justify-center flex-wrap"
          style={{ gap: 12, marginBottom: 40 }}
        >
          {resolvedTabs.map((tab, i) => {
            const isActive = i === activeTab
            return (
              <button
                key={tab._key || tab.label || `prod-dev-tab-${i}`}
                onClick={() => setActiveTab(i)}
                className="cursor-pointer transition-all font-semibold"
                style={{
                  padding: "10px 24px",
                  borderRadius: 99,
                  fontSize: 15,
                  ...(isActive
                    ? {
                        background:
                          "linear-gradient(to right, #8015e8, #ba83f0)",
                        color: "white",
                        boxShadow:
                          "2.83px 2.83px 15px 3px rgba(0,0,0,0.18)",
                        border: "none",
                      }
                    : {
                        backgroundColor: "white",
                        color: "#2b074d",
                        border: "1px solid #e8e6e6",
                      }),
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div
          className="w-full rounded-card border border-[#ece7fb] bg-white"
          style={{ padding: "40px" }}
        >
          <div
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{ gap: 40, alignItems: "center" }}
          >
            {/* Text column */}
            <div>
              <h3
                className="font-semibold"
                style={{ fontSize: 24, color: "#8015e8", marginBottom: 16 }}
              >
                {active?.label}
              </h3>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#2b074d",
                  marginBottom: 24,
                }}
              >
                {active?.description}
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {(active?.bullets ?? []).map((bullet, i) => (
                  <div
                    key={bullet._key || `prod-dev-bullet-${i}`}
                    className="flex items-start"
                    style={{ gap: 12 }}
                  >
                    <span
                      style={{
                        fontSize: 22,
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      {bullet.emoji}
                    </span>
                    <p
                      style={{
                        fontSize: 16,
                        lineHeight: "24px",
                        color: "#2b074d",
                      }}
                    >
                      {bullet.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image column */}
            <div
              className="rounded-card overflow-hidden"
              style={{
                border: "1px solid #ece7fb",
                backgroundColor: "#fff",
              }}
            >
              {activeImageSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImageSrc}
                  alt={active?.imageAlt || ""}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
