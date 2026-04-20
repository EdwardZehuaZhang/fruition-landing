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
import type { CaseStudy, SiteSettingsData, FaqTab, PartnerBadge, SanityImageRef } from "@/components/sections/types"

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
/*  Tab selector data                                                  */
/* ------------------------------------------------------------------ */

const WHY_MONDAY_ITEMS = [
  {
    icon: "\uD83C\uDFA8",
    title: "User-friendly UI",
    description:
      "The user-friendly, drag-and-drop interface ensures a smooth learning curve, enabling teams to quickly adapt and manage projects effectively.",
  },
  {
    icon: "\uD83D\uDD27",
    title: "Versatile Capabilities",
    description:
      "Highly customisable dashboards provide a comprehensive overview of project metrics, including KPIs, timelines, and budget tracking, ensuring critical information is readily accessible.",
  },
  {
    icon: "\u2699\uFE0F",
    title: "Process Optimisation",
    description:
      "Maximise efficiency, minimise roadblocks, and empower your team to do their best work.",
  },
  {
    icon: "\uD83E\uDD16",
    title: "Automation Tools",
    description:
      "Routine tasks such as status updates, notifications, and task assignments can be automated, freeing up valuable time for strategic planning and problem-solving.",
  },
  {
    icon: "\uD83D\uDCB0",
    title: "Cost Reduction",
    description:
      "If you want to reduce costs and perform cost benefit analyses without a certified genius on your team, you need a reliable platform like monday work management to help you out.",
  },
  {
    icon: "\uD83D\uDE80",
    title: "Efficient Team Systems",
    description:
      "With integration capabilities for tools like Slack, Zoom, and Microsoft Teams, Monday fosters a collaborative environment where team members can communicate, share files, and provide real-time updates, enhancing remote work efficiency.",
  },
]

const FEATURES_ITEMS = [
  {
    icon: "\uD83D\uDCC4",
    title: "Invoice Generation and Management",
    description:
      "Generate custom financial documents to manage client transactions more efficiently with monday.com. monday allows accounting firms to automate and manage invoicing processes efficiently, ensuring timely billing and payment tracking.",
  },
  {
    icon: "\uD83D\uDCCA",
    title: "Spreadsheet and Timesheet Functionality",
    description:
      "The platform\u2019s spreadsheet-like interface allows users to create detailed financial spreadsheets, facilitating seamless expense tracking and budget management. And with monday.com\u2019s timesheet functionality, you can reduce redundancy in payroll processing and ensure consistent invoice and paycheck automations.",
  },
  {
    icon: "\uD83C\uDFE2",
    title: "Multi-Account Accessibility",
    description:
      "monday.com supports the management of several accounts, allowing firms to maintain distinct workspaces for different client types or projects. This feature ensures organised and compartmentalised handling of client data and tasks.",
  },
  {
    icon: "\uD83D\uDD17",
    title: "App Integrations",
    description:
      "Can monday integrate with Xero? Yes. Save time by automating your CRM and sales invoicing process with a monday.com and Xero integration.\n\nIs monday.com compatible with Excel? Yes. Import and export data to and from Excel for easier data management.",
  },
]

const HOW_WE_HELP_ITEMS = [
  {
    title: "Finance Process Mapping",
    description:
      "Assess your financial needs and goals to understand what you want to achieve with a CRM system. By clearly understanding your requirements, we can align monday.com\u2019s features with your specific needs.",
  },
  {
    title: "Finance Solution Design",
    description:
      "Conduct comprehensive research to compare different Finance systems, including monday.com. Consider factors like pricing, features, and integrations, ensuring that monday.com is the ideal fit for your finance needs.",
  },
  {
    title: "Seamless Implementation",
    description:
      "Once monday.com is selected, configure the system to match your unique requirements. Set up custom workflows, automations, and permissions to ensure monday.com aligns perfectly with your financial processes.\n\nSmooth Data Migration: If you have existing data, your valuable data must be accurately transferred, ensuring a seamless continuity of your financial activities.\n\nExpert Training: It is important to provide training to your team, equipping them with the knowledge and skills they need to use monday.com effectively.",
  },
  {
    title: "Adoption & Training",
    description:
      "Once configured and trained, it\u2019s time to roll out monday.com to your team.",
  },
  {
    title: "Ongoing Support",
    description:
      "Remember to continuously monitor its performance and evaluate its effectiveness in meeting your financial goals.",
  },
]

const COMPARISON_TABS = [
  { label: "Why monday.com for Finance & Accounting", items: WHY_MONDAY_ITEMS },
  { label: "Finance & Accounting Features", items: FEATURES_ITEMS },
  { label: "How We Can Help", items: HOW_WE_HELP_ITEMS },
]

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */

const GENERAL_FAQS = [
  {
    question: "Does monday com have a CRM?",
    answer:
      "Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes.",
  },
  {
    question: "Does monday com have task management?",
    answer:
      "Yes, monday.com has task management. Take a trial of monday work management and discover just how efficiently you can manage your teams\u2019 to-do list.",
  },
  {
    question: "Why is monday.com so successful?",
    answer:
      "Here are key factors that make monday.com so successful:\n\nOne of Monday.com\u2019s key selling points is its highly customizable nature, allowing users to tailor workflows, add automations, and integrate third-party apps.\n\nExtremely use-friendly, making adoption easy\n\nHighly visual, agile, and, most importantly, scalable\n\nmonday.com can be used to manage anything you want. It\u2019s a veritable Swiss Army knife for managers around the world",
  },
  {
    question: "What exactly does monday.com do?",
    answer:
      "monday.com is the most versatile project management software you\u2019ll find on the market. You can use the platform to manage all of your projects, and also use it as a CRM, to manage your ad campaigns, track bugs, and manage video production.",
  },
]

const FINANCE_FAQS = [
  {
    question: "How can monday.com help finance teams manage budgets and expenses?",
    answer:
      "monday.com allows finance teams to track budgets, categorize expenses, and visualize spending with dashboards. You can set up automations to flag overspending and generate real-time financial reports without spreadsheets.",
  },
  {
    question: "Can monday.com be used for accounts payable and receivable tracking?",
    answer:
      "Yes. Finance teams can create custom boards to track invoices, due dates, and payments. With automations, reminders can be sent for upcoming due dates, while integrations with QuickBooks or Xero keep records in sync.",
  },
  {
    question: "How do accounting teams use monday.com for approvals and workflows?",
    answer:
      "monday.com supports approval automations, making it easy to route requests for expense approvals, purchase orders, or reimbursements. Managers receive instant notifications, reducing bottlenecks and manual follow-ups.",
  },
  {
    question: "Does monday.com integrate with accounting software like QuickBooks or Xero?",
    answer:
      "Absolutely. monday.com integrates with QuickBooks, Xero, and other accounting tools, so financial data flows seamlessly. This reduces double entry and ensures accuracy across systems.",
  },
  {
    question: "Can monday.com generate financial reports and dashboards?",
    answer:
      "Yes. With reporting dashboards, you can track KPIs like cash flow, revenue, and expense trends. Widgets and custom charts allow you to share financial performance insights with stakeholders in real time.",
  },
  {
    question: "Is monday.com secure enough for financial data?",
    answer:
      "monday.com complies with SOC 2 Type II, GDPR, HIPAA (enterprise plan), and offers enterprise-grade security. Finance teams can safely manage sensitive financial data while controlling user access.",
  },
  {
    question: "How do CFOs and controllers benefit from monday.com?",
    answer:
      "CFOs gain full visibility into financial pipelines, approvals, and reporting in one platform. They can standardize workflows, reduce manual errors, and make faster, data-driven decisions.",
  },
  {
    question: "Can monday.com automate recurring financial tasks?",
    answer:
      "Yes. Automations can handle repetitive tasks like monthly reconciliations, invoice follow-ups, and budget updates\u2014saving time and improving accuracy.",
  },
  {
    question: "How can finance teams use monday.com for audit readiness?",
    answer:
      "monday.com makes audits easier by centralizing financial documentation, tracking approvals, and maintaining a clear activity log. This ensures compliance and transparency during audit cycles.",
  },
  {
    question: "Is there a monday.com template for finance and accounting teams?",
    answer:
      "Yes. monday.com offers pre-built templates for finance teams covering budgeting, expense tracking, invoicing, and more. These templates can be customised to fit your specific accounting workflows.",
  },
]

const HARDCODED_FAQ_TABS: FaqTab[] = [
  { _key: "professional-services", label: "Professional Services", items: GENERAL_FAQS },
  { _key: "finance-accounting", label: "Finance & Accounting", items: FINANCE_FAQS },
  { _key: "project-management", label: "Project Management", items: GENERAL_FAQS },
  { _key: "monday-crm", label: "monday CRM", items: GENERAL_FAQS },
]

/* ------------------------------------------------------------------ */
/*  Bottom section: video + feature cards (from screenshot)            */
/* ------------------------------------------------------------------ */

const FINANCE_FEATURE_CARDS = [
  { emoji: "\uD83D\uDCCA", title: "Budget Planning and Tracking", description: "Create budget boards and automate recurring financial tasks. Track expenses in real-time, monitor department budgets, and ensure accurate goal achievement through comprehensive budget management." },
  { emoji: "\uD83D\uDCB3", title: "Expense Management", description: "Streamline expense tracking with automated workflows and digital receipt management. Control business spending, categorise expenses efficiently, and maintain detailed records for better financial oversight across departments." },
  { emoji: "\uD83D\uDCC8", title: "Financial Reporting", description: "Generate comprehensive financial reports with visual dashboards and customisable templates. Present complex data in digestible formats and deliver actionable insights for informed decision-making and stakeholder communication." },
  { emoji: "\uD83E\uDDFE", title: "Invoicing & Billing", description: "Simplify invoice creation with automated billing workflows and customisable templates. Track payment statuses, manage client billing cycles, and reduce manual errors while ensuring timely payment collection." },
  { emoji: "\uD83D\uDCB0", title: "Cashflow Management", description: "Monitor cash inflows and outflows with real-time tracking and predictive analytics. Anticipate cash flow gaps, manage payment schedules, and maintain optimal liquidity for sustained business operations." },
  { emoji: "\u2705", title: "Financial Compliance", description: "Ensure adherence to financial regulations through automated compliance tracking. Maintain audit trails, monitor regulatory requirements, and implement standardised processes for risk mitigation and compliance management." },
  { emoji: "\uD83D\uDD2E", title: "Financial Forecasting", description: "Create accurate financial projections using historical data and scenario modeling. Assess potential outcomes, plan strategic investments, and make data-driven decisions while minimising risks and maximising opportunities." },
  { emoji: "\u2699\uFE0F", title: "Integrations & Automations", description: "Sync financial data across platforms with seamless integrations and automated workflows. Eliminate manual data entry, connect accounting systems, and streamline processes for improved accuracy." },
  { emoji: "\uD83D\uDCAC", title: "Collaboration & Communication", description: "Enhance team collaboration with shared financial dashboards and real-time updates. Facilitate cross-department communication and maintain alignment on financial goals and objectives across your organisation." },
]

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MondayForFinanceContent({
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

  return (
    <div>
      {/* 1. Hero — certificates on top, no small image */}
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
          {/* Three certificate badges */}
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

          {/* Hero image — only show if NOT the small 179x28 monday text logo */}
          {(() => {
            const src = safeImageUrl(page.heroImage)
            if (!src) return null
            if (src.includes("e69b4156af7ede871484c1ee217c99c87bd289e7")) return null
            return (
              <div style={{ marginTop: 40 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Hero"
                  className="rounded-card"
                  style={{ width: 1042, height: "auto" }}
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

      {/* 4. Tab selector section */}
      <FinanceTabsSection />

      {/* 5. Calendly */}
      <CalendlySection
        heading={
          page.calendlyHeading ||
          "Schedule A 30-Min Consultation With One of Our monday.com Consultants"
        }
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 6. FAQ */}
      <FaqAccordion tabs={faqTabs && faqTabs.length > 0 ? faqTabs : HARDCODED_FAQ_TABS} />

      {/* 7. Feature cards section */}
      <BottomFeatureSection />

      {/* 8. Join 500+ CTA */}
      <TestimonialCtaBanner
        testimonial={caseStudies?.[0]}
      />

      {/* 9. Security Badge */}
      {!page.hideSecurityBadgeSection && (
        <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Finance Tabs Section                                               */
/* ------------------------------------------------------------------ */

function FinanceTabsSection() {
  const [activeTab, setActiveTab] = useState(0)
  const active = COMPARISON_TABS[activeTab]

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
          monday.com for{" "}
          <span style={{ color: "#8015e8" }}>Finance & Accounting</span>
        </h2>

        {/* Tab buttons */}
        <div
          className="flex justify-center flex-wrap"
          style={{ gap: 12, marginTop: 40, width: "100%" }}
        >
          {COMPARISON_TABS.map((tab, i) => (
            <button
              key={tab.label}
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

        {/* Tab heading */}
        <h3
          className="text-center font-semibold"
          style={{ fontSize: 22, color: "#8015e8", marginTop: 40 }}
        >
          {activeTab === 0
            ? "Why Choose monday.com for Finance & Accounting?"
            : activeTab === 1
              ? "Key monday.com Finance & Accounting Features"
              : "How We Can Help"}
        </h3>

        {/* Numbered items */}
        <div
          className="w-full rounded-card border border-[#e8e6e6]"
          style={{ marginTop: 24, padding: "12px 0" }}
        >
          {active.items.map((item, i) => (
            <div
              key={item.title}
              className="flex items-start"
              style={{
                padding: "24px 40px",
                borderBottom:
                  i < active.items.length - 1
                    ? "1px solid #f0f0f0"
                    : "none",
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 200,
                  color: "#8015e8",
                  lineHeight: 1,
                  minWidth: 56,
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div style={{ flex: 1 }}>
                <p
                  className="font-bold"
                  style={{ fontSize: 18, color: "#2b074d" }}
                >
                  {"icon" in item && (item as { icon?: string }).icon
                    ? `${(item as { icon?: string }).icon} `
                    : ""}
                  {item.title}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: "22px",
                    color: "#444",
                    marginTop: 8,
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Bottom Feature Cards Section                                       */
/* ------------------------------------------------------------------ */

function BottomFeatureSection() {
  return (
    <section style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(180deg, #f5f0ff 0%, #ffffff 100%)" }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1100 }}>
        {/* Title */}
        <h2
          className="text-section-h2 text-center"
          style={{ color: "#2b074d", maxWidth: 900, margin: "0 auto" }}
        >
          Reasons Why Monday.com is Loved by{" "}
          <span style={{ color: "#8015e8" }}>Finance Teams</span>
        </h2>

        {/* 3x3 feature grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 24, marginTop: 40 }}
        >
          {FINANCE_FEATURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center text-center bg-white rounded-card border border-[#ece7fb]"
              style={{
                padding: 28,
                boxShadow: "var(--shadow-whisper)",
              }}
            >
              <span style={{ fontSize: 36, lineHeight: 1, marginBottom: 12 }}>
                {card.emoji}
              </span>
              <h4
                className="font-bold"
                style={{ fontSize: 18, color: "#8015e8" }}
              >
                {card.title}
              </h4>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  color: "#444",
                  marginTop: 10,
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
