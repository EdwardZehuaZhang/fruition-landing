"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LogoCloudMarquee,
  TestimonialsGrid,
  CalendlySection,
  DiscoverCtaSection,
  SecurityBadgeSection,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, PartnerBadge, SanityImageRef } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).url()
  } catch {
    return null
  }
}

const CS_FEATURES = [
  {
    title: "Ticketing system integration",
    description: "Seamlessly integrate your email ticketing system with Monday.com",
  },
  {
    title: "Unified data source",
    description: "Centralise your customer service management for optimal efficiency",
  },
  {
    title: "Shared inboxes",
    description: "Leverage shared inbox solutions for collaborative customer support",
  },
  {
    title: "Turn service needs into action",
    description:
      "Bridge the gap between tickets and larger scale service initiatives by managing them in one place.",
  },
  {
    title: "Solve tickets with full context",
    description:
      "Connect service management with organisational resources like assets, knowledge base, directories, inventory, and more.",
  },
  {
    title: "Accelerate stakeholder collaboration",
    description:
      "Replace messy email threads with in-platform communication to connect internal and external stakeholders.",
  },
]

const AI_FEATURES = [
  {
    title: "Self-service customer experiences",
    description:
      "Enable customers to solve common issues on their own so agents can focus on critical issues.",
  },
  {
    title: "Automatic ticket classification",
    description:
      "Let AI automatically tag tickets by type, urgency, sentiment, department, and more to accurately prioritise incoming tickets.",
  },
  {
    title: "Smart ticket routing",
    description:
      "Speed up ticket handling and reduce manual work with automatic assignment to relevant agent or team.",
  },
  {
    title: "Knowledge base assistance for agents",
    description:
      "Solve a wider range of issues with AI assistance that pulls relevant knowledge and minimises unnecessary escalations and delays.",
  },
  {
    title: "Streamlined communication",
    description:
      "Automate replies, follow-ups, and more to speed up communication between agents, customers, and all of your stakeholders.",
  },
]

const FOUR_CARDS = [
  {
    image: "/images/monday-service-card-1.avif",
    title: "Email Ticketing with monday.com",
    description:
      "Integrate your email ticketing system, including Outlook and Gmail, with monday.com's service desk software for unparalleled efficiency and enhanced customer satisfaction.",
  },
  {
    image: "/images/monday-service-card-2.avif",
    title: "Outlook and Gmail Integration Made Easy",
    description:
      "Fruition specialises in integrating monday.com with your existing email ticketing system, including Outlook and Gmail.",
  },
  {
    image: "/images/monday-service-card-3.avif",
    title: "Stay Ahead of Service Trends and Issues",
    description:
      "Monitor your entire service operations performance to detect issues before they escalate and identify areas for improvement.",
  },
  {
    image: "/images/monday-service-card-4.avif",
    title: "Streamline Your Customer Service Workflow",
    description:
      "With the monday.com helpdesk and shared inbox solution, your team can collaborate effortlessly on customer inquiries. Assign tickets, track progress, and resolve issues faster than ever before.",
  },
]

const FAQ_ITEMS = [
  {
    question: "How much does monday service cost?",
    answer:
      "On the Basic Plan, the monthly cost per user is $12 while the annual cost per user is $108. On the Standard Plan, the monthly cost becomes $14 per user while the annual cost per user is $144. On the Pro plan, it is $79.99 per user monthly and $228 per user annually.",
  },
  {
    question: "What is monday Service?",
    answer:
      "monday service is an intuitive, fully customizable service platform where help desk teams manage and automate their service operations and processes to resolve incidents and requests within SLAs, and deliver great customer experiences at scale.\n\nmonday service connects ticketing, projects, and cross-department teams in one centralized support platform.",
  },
  {
    question: "Can you use Monday as a ticketing system?",
    answer:
      "Yes, with monday.com, you can build a functional ticket-tracking system that helps your team's needs. You can track all incoming, open, and closed tickets with one comprehensive board. Connect channels to your monday Service \"Tickets\" board to receive all tickets in your board, and track correspondence within the ticket's item.\n\nLearn more about using monday Service as a ticketing system here.",
  },
  {
    question: "What is the best customer service ticketing system?",
    answer:
      "The best customer service ticketing system will have all of the following:\n\n• User-Friendly Interface\n• Seamless Collaboration\n• Integration with Other Systems\n• Multi-channel support\n• Reliable and Robust Reporting\n• Scalability\n• Exceptional Customer Support",
  },
  {
    question: "Is monday Service secure?",
    answer:
      "Yes. It offers enterprise-grade security including SOC 2 compliance, GDPR, HIPAA (Enterprise), SSO, 2FA, and audit logs.",
  },
  {
    question: "What can I use Monday Service for?",
    answer:
      "• Handling IT tickets and service requests\n• Automating incident management and approvals\n• Tracking IT assets and change requests\n• Providing employees with a self-service portal for quick support",
  },
  {
    question: "Does monday Service include automations?",
    answer:
      "Yes. You can automate ticket routing, priority settings, status changes, SLA tracking, and escalations to reduce manual work and resolve issues faster.",
  },
  {
    question: "Can monday Service integrate with other tools?",
    answer:
      "Yes. It connects with Slack, Microsoft Teams, Gmail, Outlook, Jira, and more. You can also use the API, Zapier, or Make for advanced integrations.",
  },
  {
    question: "Is monday Service secure enough for IT operations?",
    answer:
      "Yes. It includes enterprise-grade security features like SSO, 2FA, SOC 2 compliance, GDPR alignment, audit logs, and role-based permissions to keep IT data safe.",
  },
]

const STRATEGIC_COLUMNS = [
  {
    title: "Licenses, product consultancy, and implementation",
    items: [
      { emoji: "📋", text: "Analyse your operations and recommend the optimal monday.com plan" },
      { emoji: "🔧", text: "Deliver customised implementation with detailed project roadmap" },
      { emoji: "✅", text: "Configure your workspace to match your specific business requirements" },
    ],
  },
  {
    title: "Onboarding, training, and business-wide adoption",
    items: [
      { emoji: "🚀", text: "Accelerate team productivity through comprehensive onboarding programs" },
      { emoji: "👥", text: "Drive adoption across all departments with expert-led training sessions" },
      { emoji: "📝", text: "Ensure immediate value delivery and measurable ROI from implementation" },
    ],
  },
  {
    title: "Optimisations, automations and integrations",
    items: [
      { emoji: "⚙️", text: "Design intelligent automations and ongoing workflow optimisations and improvements" },
      { emoji: "🔗", text: "Build seamless integrations with your existing business tools" },
      { emoji: "🎯", text: "Create tailored dashboards, templates, and reporting solutions" },
    ],
  },
]

export default function MondayServicePage({
  page,
  siteSettings,
  caseStudies = [],
}: Props) {
  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const partnerBadges: PartnerBadge[] = siteSettings?.navbarPartnerBadges || []

  const heroTitle = page?.heroHeading || page?.title || "monday Service"
  const heroSubheading =
    page?.heroSubheading ||
    "Transform your customer service operations with monday Service — unified ticketing, shared inboxes, automations, and AI-powered workflows on one platform."

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingLeft: 273, paddingRight: 273, paddingTop: 80, paddingBottom: 80 }}
        >
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

          <h1
            className="text-center font-bold"
            style={{ fontSize: 48, lineHeight: "67.2px", marginTop: 42, maxWidth: 924 }}
          >
            <span className="text-black">{heroTitle}</span>
          </h1>

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

          <div className="flex items-center justify-center" style={{ gap: 20, marginTop: 40, width: 680 }}>
            <Link
              href={calendlyUrl}
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
              {"\uD83D\uDE80 Book a Consultation"}
            </Link>
            <Link
              href={calendlyUrl}
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 330,
                height: 53,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {"\u25B6\uFE0F Get Started with monday.com"}
            </Link>
          </div>

          <div style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/monday-service-hero.avif"
              alt="monday Service"
              width={1042}
              height={312}
              className="rounded-card object-cover"
              style={{ width: 1042, height: "auto", maxHeight: 520 }}
            />
          </div>
        </div>
      </section>

      {/* 2. Logo Cloud (no video under it) */}
      <LogoCloudMarquee
        headingPart1={page?.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page?.logoCloudHeadingAccent || "monday.com consulting services"}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Feature Tabs */}
      <FeatureTabsSection />

      {/* 4. Four image cards side-by-side */}
      <FourCardSection calendlyUrl={calendlyUrl} />

      {/* 5. Calendly */}
      <CalendlySection
        heading={page?.calendlyHeading}
        subheading={page?.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 6. FAQ */}
      <MondayServiceFaq />

      {/* 7. Strategic approach section */}
      <StrategicApproachSection />

      {/* 8. Testimonials */}
      <TestimonialsGrid caseStudies={caseStudies} />

      {/* 9. Discover CTA */}
      <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />

      {/* 10. Security Badge */}
      <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
    </div>
  )
}

/* -------------------------- Custom sections -------------------------- */

function FeatureTabsSection() {
  const [tab, setTab] = useState(0)
  const tabs = [
    { label: "Customer Service Features", items: CS_FEATURES },
    { label: "AI-Powered Service", items: AI_FEATURES },
  ]
  const active = tabs[tab]

  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1042 }}>
        <h2
          className="text-section-h2 text-center text-black"
          style={{ maxWidth: 900 }}
        >
          Easily shape every aspect of service to your business needs with{" "}
          <span style={{ color: "#8015e8" }}>monday Service</span>
        </h2>
        <p
          className="text-center text-black"
          style={{ fontSize: 18, lineHeight: "28px", marginTop: 20, maxWidth: 860 }}
        >
          We transform fragmented service systems into cohesive, automated operations that enhance
          team collaboration and deliver measurable ROI across your entire organisation.
        </p>
        <p
          className="text-center font-semibold"
          style={{ fontSize: 22, color: "#8015e8", marginTop: 32 }}
        >
          Why monday.com for customer service?
        </p>

        {/* Tabs */}
        <div
          className="flex justify-center flex-wrap"
          style={{ gap: 12, marginTop: 40, width: "100%" }}
        >
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTab(i)}
              className="cursor-pointer transition-all"
              style={{
                padding: "10px 32px",
                borderRadius: 99,
                fontSize: 16,
                fontWeight: 600,
                ...(i === tab
                  ? {
                      background: "linear-gradient(to right, #8015e8, #ba83f0)",
                      color: "white",
                      boxShadow: "2.83px 2.83px 15px 3px rgba(0,0,0,0.18)",
                      border: "none",
                    }
                  : {
                      backgroundColor: "white",
                      color: "#2b074d",
                      border: "1px solid #e8e6e6",
                    }),
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Feature grid */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginTop: 40,
          }}
        >
          {active.items.map((item, i) => (
            <div
              key={item.title}
              className="flex flex-col"
              style={{
                padding: 24,
                borderRadius: 16,
                border: "1px solid #e8e6e6",
                backgroundColor: "#fafafa",
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 200,
                  color: "#8015e8",
                  lineHeight: 1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className="font-bold"
                style={{ fontSize: 18, marginTop: 16, color: "#2b074d" }}
              >
                {item.title}
              </p>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  color: "#444",
                  marginTop: 10,
                  whiteSpace: "pre-line",
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

function FourCardSection({ calendlyUrl }: { calendlyUrl: string }) {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, backgroundColor: "#f7f7f7" }}>
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1342 }}>
        <h2
          className="text-center font-bold"
          style={{ fontSize: 40, lineHeight: "52px", color: "#2b074d", maxWidth: 900 }}
        >
          Holistic service management.
          <br />
          <span style={{ color: "#8015e8" }}>One shared platform.</span>
        </h2>
        <Link
          href={calendlyUrl}
          className="flex items-center justify-center font-bold text-white"
          style={{
            marginTop: 32,
            height: 53,
            width: 260,
            borderRadius: 100,
            background: "linear-gradient(to right, #8015e8, #ba83f0)",
            fontSize: 16,
          }}
        >
          {"\uD83D\uDE80 Book a Meeting"}
        </Link>

        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            marginTop: 56,
          }}
        >
          {FOUR_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col"
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 1px 10px rgba(0,0,0,0.06)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={card.title}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: 24 }}>
                <p
                  className="font-bold"
                  style={{ fontSize: 18, color: "#2b074d", lineHeight: "24px" }}
                >
                  {card.title}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: "22px",
                    color: "#444",
                    marginTop: 12,
                  }}
                >
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MondayServiceFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 120 }}>
      <div className="mx-auto flex flex-col px-4" style={{ maxWidth: 959, gap: 24 }}>
        <h2
          className="text-section-h2"
          style={{ color: "var(--purple-primary)" }}
        >
          Frequently asked questions
        </h2>
        <p style={{ fontSize: 18, color: "#2b074d", marginTop: -8 }}>monday Service</p>

        <div className="flex flex-col" style={{ gap: 12, marginTop: 12 }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.question} style={{ paddingTop: i === 0 ? 20 : 24 }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                  style={{ minHeight: 30 }}
                >
                  <span style={{ fontSize: 20, lineHeight: "24px", color: "black" }}>
                    {item.question}
                  </span>
                  <div className="shrink-0" style={{ width: 30, height: 30 }}>
                    <svg
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
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
                {isOpen && (
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
                    marginTop: isOpen ? 0 : 36,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StrategicApproachSection() {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, backgroundColor: "#f5f0ff" }}>
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1200 }}>
        <h2
          className="text-section-h2 text-center text-black"
          style={{ maxWidth: 900 }}
        >
          How to Manage Service with monday.com:{" "}
          <span style={{ color: "#8015e8" }}>A Strategic Approach</span>
        </h2>
        <p
          className="text-center"
          style={{ fontSize: 16, lineHeight: "24px", color: "#333", marginTop: 20, maxWidth: 860 }}
        >
          Managing products effectively with monday.com requires understanding both the platform&apos;s
          capabilities and proven service management methodologies. Our monday.com service
          management consultants guide teams through:
        </p>

        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginTop: 48,
          }}
        >
          {STRATEGIC_COLUMNS.map((col) => (
            <div
              key={col.title}
              className="flex flex-col"
              style={{
                padding: 32,
                borderRadius: 20,
                backgroundColor: "white",
                boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
              }}
            >
              <h3
                className="font-bold"
                style={{ fontSize: 20, lineHeight: "28px", color: "#8015e8" }}
              >
                {col.title}
              </h3>
              <div className="flex flex-col" style={{ gap: 20, marginTop: 24 }}>
                {col.items.map((it, i) => (
                  <div key={i} className="flex items-start" style={{ gap: 12 }}>
                    <span style={{ fontSize: 20, lineHeight: "24px", flexShrink: 0 }}>{it.emoji}</span>
                    <p style={{ fontSize: 14, lineHeight: "22px", color: "#333" }}>{it.text}</p>
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
