"use client"

import Link from "next/link"
import { useState } from "react"
import { Rocket, Check } from "lucide-react"
import FramedMedia from "@/components/common/FramedMedia"
import {
  HeroBanner,
  LogoCloudMarquee,
  CalendlySection,
  FaqAccordion,
  JoinStatsSection,
} from "@/components/sections"
import type {
  CaseStudy,
  SiteSettingsData,
  FaqTab,
} from "@/components/sections/types"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

/* ----------------- Hardcoded content ----------------- */

type Item = { number: string; title: string; description?: string; bullets?: string[] }
type Tab = { key: string; label: string; items: Item[] }

const AIRCALL_TABS: Tab[] = [
  {
    key: "challenges",
    label: "Top Challenges",
    items: [
      {
        number: "01",
        title: "Call Abandonment Rate",
        description:
          "occurs when customers hang up before speaking to an agent, often due to long wait times or frustration. Aircall's smart call routing and call-back features ensure customers never feel stuck on hold. With real-time analytics and call volume insights, teams can forecast busy periods, optimise staffing, and deliver faster responses.",
      },
      {
        number: "02",
        title: "Repetitive Tasks",
        description:
          "can be automated so your team can save time on call reviews with Aircall's advanced AI features like call transcription, tags and summaries, and Call Scoring. Free up pre- and post-call admin time so your teams are free to focus on building and maintaining customer relationships.",
      },
      {
        number: "03",
        title: "Low First Call Resolution Rate",
        description:
          "can be improved by Aircall's call recordings, in-call coaching, and whispering, to help managers tackle challenging calls faster, with less disruption to your team and the customer. Make data-driven decisions with in-depth analytics. View key data like missed call rates and response time and use custom tags to track almost any metric.",
      },
      {
        number: "04",
        title: "Disconnected tech stack",
        description:
          "Deliver smarter, more personalised experiences as your CRM and Helpdesk data flows effortlessly into every customer interaction. Easily add new users, obtain local area code phone numbers, and even international numbers as your teams expand and your business grows.",
      },
    ],
  },
  {
    key: "why-aircall",
    label: "Why Choose Aircall",
    items: [
      {
        number: "01",
        title: "Advanced Communication Features",
        bullets: [
          "Real-time call monitoring and recording capabilities",
          "Advanced call analytics and reporting dashboards",
          "Smart call distribution and routing",
          "International number support across 100+ countries",
        ],
      },
      {
        number: "02",
        title: "Seamless Integration Capabilities",
        bullets: [
          "Native CRM platform connections",
          "Custom API integration options",
          "Workflow automation tools",
          "Help desk software compatibility",
        ],
      },
      {
        number: "03",
        title: "On-Premise Deployment and Security",
        bullets: [
          "End-to-end call encryption",
          "GDPR and HIPAA compliance",
          "24/7 security monitoring",
          "Secure data storage protocols",
        ],
      },
    ],
  },
  {
    key: "how-help",
    label: "How We Can Help",
    items: [
      {
        number: "01",
        title: "As your dedicated Aircall integration partner, we provide:",
        bullets: [
          "Complete CRM integration services: seamless connection of Aircall with leading platforms like Salesforce, HubSpot, and Zendesk",
          "Custom contact center solutions: end-to-end implementation for support teams and call centres",
          "Sales operations enhancement: advanced call routing, analytics, and performance monitoring tools",
          "Expert implementation support: dedicated technical assistance throughout your Aircall deployment",
        ],
      },
      {
        number: "02",
        title: "Working with Fruition as your Aircall partner ensures:",
        bullets: [
          "Rapid deployment and setup",
          "Custom integration development",
          "Comprehensive team training",
          "Ongoing technical support",
          "Performance optimisation services",
        ],
      },
      {
        number: "03",
        title: "Scale your communications infrastructure with our Aircall partnership:",
        bullets: [
          "Deploy cloud communications rapidly",
          "Reduce operational costs significantly",
          "Improve customer service metrics",
          "Enable remote team collaboration",
          "Access advanced analytics tools",
        ],
      },
    ],
  },
]


/* ----------------- Sections ----------------- */

function IntroSection() {
  return (
    <section className="bg-surface px-4" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div className="mx-auto text-center" style={{ maxWidth: 920 }}>
        <p style={{ fontSize: 16, lineHeight: "26px", color: "var(--text-muted-fg)" }}>
          Fruition is an <span className="font-bold" style={{ color: "#8015e8" }}>official Aircall Partner</span> specialising in
          <span className="font-bold" style={{ color: "#8015e8" }}> enterprise-grade cloud phone system implementations</span>. Our certified team delivers comprehensive Aircall integration services, connecting your business communications with CRM platforms, contact centre operations, and sales workflows.
        </p>
      </div>
    </section>
  )
}

type AircallTabShape = { _key?: string; key?: string; label?: string; items?: Array<{ _key?: string; number?: string; title?: string; description?: string; bullets?: string[] }> }

function AircallTabsSection({ tabs }: { tabs: AircallTabShape[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  return (
    <section className="bg-surface px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex flex-col items-center text-center" style={{ marginBottom: 32 }}>
          <h2 className="font-bold" style={{ color: "var(--text-body)", fontSize: 32, lineHeight: "40px", maxWidth: 860, marginBottom: 14 }}>
            Streamline Operations & Maximize Efficiency on monday.com with n8n Solutions
          </h2>
          <p style={{ color: "var(--text-muted-fg)", fontSize: 16, lineHeight: "26px", maxWidth: 820 }}>
            We transform fragmented business processes into cohesive, automated systems that enhance team collaboration and deliver measurable ROI across your entire organization.
          </p>
        </div>
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginBottom: 40 }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => setActiveIdx(i)}
              style={{
                padding: "10px 26px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                ...(i === activeIdx
                  ? { background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", border: "none", boxShadow: "0 10px 22px -12px rgba(128,21,232,0.55)" }
                  : { background: "var(--surface-raised)", color: "var(--text-body)", border: "1px solid var(--border-ui)" }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {(active.items ?? []).map((g, idx) => (
            <div key={g.number || idx} className="dark:shadow-none" style={{ padding: 24, borderRadius: 18, background: "var(--surface-raised)", border: "1px solid rgba(128,21,232,0.08)", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="flex items-center" style={{ gap: 14 }}>
                <span className="flex items-center justify-center font-bold" style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)", color: "white", fontSize: 13 }}>
                  {g.number}
                </span>
                <p className="font-bold" style={{ color: "var(--text-body)", fontSize: 15, lineHeight: "22px" }}>{g.title}</p>
              </div>
              {g.description && (
                <p style={{ color: "var(--text-muted-fg)", fontSize: 13, lineHeight: "20px" }}>{g.description}</p>
              )}
              {g.bullets && (
                <ul className="flex flex-col" style={{ gap: 8 }}>
                  {g.bullets.map((b: string) => (
                    <li key={b} className="flex items-start" style={{ gap: 8, color: "var(--text-muted-fg)", fontSize: 13, lineHeight: "20px" }}>
                      <Check size={16} color="#8015e8" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type AircallFeature = { title?: string; body?: string; image?: string; imageRight?: boolean }
const AIRCALL_FEATURES_FALLBACK: AircallFeature[] = [
  {
    title: "Set up in seconds",
    body: "Easily claim numbers, set up integrations, and manage your phone system with just a few clicks. Enhance every customer interaction with AI Voice Agents, instant insights, WhatsApp Messaging, and more.",
    image: "/images/aircall-reporting.avif",
    imageRight: true,
  },
  {
    title: "For Sales and Customer Support",
    body: "Achieve better resolution rates. Powerful shared inbox features keep cross-channel conversations under control, all in one place. Agents know exactly what to do next instead of asking customers to repeat themselves.",
    image: "/images/aircall-mobile-app.avif",
    imageRight: false,
  },
]

function AIConversationsSection({ calendlyUrl, features }: { calendlyUrl: string; features: AircallFeature[] }) {
  return (
    <section className="bg-surface px-4" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex flex-col items-center text-center" style={{ marginBottom: 48 }}>
          <h2 className="font-bold" style={{ color: "var(--text-body)", fontSize: 36, lineHeight: "44px", marginBottom: 24 }}>
            AI-powered customer conversations made easy
          </h2>
          <Link
            href={calendlyUrl}
            className="inline-flex items-center justify-center gap-2 font-semibold"
            style={{ height: 50, padding: "0 26px", borderRadius: 999, background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", fontSize: 15, boxShadow: "0 14px 28px -12px rgba(128,21,232,0.55)" }}
          >
            <Rocket size={16} aria-hidden /> Book a Meeting
          </Link>
        </div>

        <div className="flex flex-col" style={{ gap: 60 }}>
          {features.map((f, i) => (
            <div
              key={f.title || i}
              className="flex flex-col items-center"
              style={{ gap: 40, flexDirection: f.imageRight ? "row" : "row-reverse" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="font-bold" style={{ color: "var(--text-body)", fontSize: 26, lineHeight: "34px", marginBottom: 14 }}>
                  {f.title}
                </p>
                <p style={{ color: "var(--text-muted-fg)", fontSize: 15, lineHeight: "25px" }}>{f.body}</p>
              </div>
              <FramedMedia
                className="rounded-card overflow-hidden"
                style={{ flex: 1, aspectRatio: "16 / 10", border: "1px solid var(--border-ui)", boxShadow: "0 18px 36px -24px rgba(64,12,140,0.2)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
              </FramedMedia>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------- Page ----------------- */

export default function AircallPartnerContent({ page, siteSettings, faqTabs }: Props) {
  if (!page) return null
  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const resolvedFaqTabs = faqTabs ?? []
  const resolvedAircallFeatures: AircallFeature[] = (page.aircallFeatures && page.aircallFeatures.length > 0) ? page.aircallFeatures : AIRCALL_FEATURES_FALLBACK

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || "Aircall Certified Partner"}
        headingAccent=""
        subheading={
          page.hideHeroSubheading
            ? undefined
            : page.heroSubheading ||
              "Fruition's certified Aircall integration partner solutions. Telephone integration services for business communications."
        }
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel || "Book a Consultation"}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
      />

      <IntroSection />

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      <AircallTabsSection tabs={(page.aircallTabs && page.aircallTabs.length > 0) ? page.aircallTabs : AIRCALL_TABS} />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule A 30-Min Consultation"}
        subheading={page.calendlySubheading || "AI-powered customer conversations made easy."}
        calendlyUrl={calendlyUrl}
      />

      <AIConversationsSection calendlyUrl={calendlyUrl} features={resolvedAircallFeatures} />

      <FaqAccordion heading="Frequently asked questions" tabs={resolvedFaqTabs} />

      {/* Stats */}
      {page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel={page.joinCtaLabel || "BOOK A MEETING"}
          ctaUrl={page.joinCtaUrl || calendlyUrl}
          siteSettings={siteSettings || undefined}
        />
      )}
    </div>
  )
}
