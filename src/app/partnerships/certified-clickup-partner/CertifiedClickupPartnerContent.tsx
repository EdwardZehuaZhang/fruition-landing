"use client"

import { useState } from "react"
import {
  HeroBanner,
  LogoCloudMarquee,
  CalendlySection,
  FaqAccordion,
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

/* ----------------- Hardcoded data ----------------- */

const EVERYTHING_APP_CARDS = [
  { emoji: "🌐", title: "Unified Work Management", body: "Replace 10+ tools with one comprehensive platform. ClickUp consolidates project management, document collaboration, chat, goals, whiteboards, and more into a single workspace that eliminates context-switching and information silos." },
  { emoji: "⚙️", title: "Unmatched Flexibility", body: "Configure ClickUp to work exactly how your team wants to work. With 15+ views, 1000+ integrations, and unlimited customisation options, ClickUp adapts to your processes—not the other way around." },
  { emoji: "🧠", title: "AI-Powered Productivity", body: "Leverage ClickUp Brain, the AI that works across your entire workspace. Automate repetitive tasks, generate content, search across all your work, and get instant answers from your connected knowledge base." },
  { emoji: "🔒", title: "Enterprise-Grade Security", body: "Trust your data to a platform with SOC 2 Type II certification, SSO capabilities, advanced permissions, and 24/7 support. ClickUp scales securely from small teams to enterprise organizations." },
]

type FeatureGroup = { number: string; title: string; bullets: { emoji: string; text: string }[] }
type FeatureTab = { key: string; label: string; heading: string; groups: FeatureGroup[] }

const SERVICES_TABS: FeatureTab[] = [
  {
    key: "services",
    label: "Our Comprehensive ClickUp Services",
    heading: "Why choose monday.com for your project management needs?",
    groups: [
      { number: "01", title: "Discovery & Strategic Planning", bullets: [
        { emoji: "🔍", text: "Comprehensive tool audit and process mapping" },
        { emoji: "🏗️", text: "Workspace architecture design" },
        { emoji: "📋", text: "Custom workflow configuration planning" },
        { emoji: "🔬", text: "Integration requirements analysis" },
        { emoji: "📊", text: "ROI projections and implementation timeline" },
        { emoji: "🎯", text: "Change management strategy development" },
      ] },
      { number: "02", title: "Migration & Data Transfer", bullets: [
        { emoji: "📦", text: "Multi-platform data migration (tasks, projects, files, comments)" },
        { emoji: "🗺️", text: "Custom field mapping and preservation" },
        { emoji: "📚", text: "Historical data retention and archive" },
        { emoji: "🔄", text: "Integration migration planning" },
        { emoji: "✅", text: "Testing and validation protocols" },
        { emoji: "🔙", text: "Rollback procedures and contingency planning" },
      ] },
      { number: "03", title: "Workspace Configuration & Setup", bullets: [
        { emoji: "🏛️", text: "Workspace hierarchy design (Spaces, Folders, Lists)" },
        { emoji: "🎨", text: "Custom statuses and workflow creation" },
        { emoji: "🏷️", text: "Custom fields and properties setup" },
        { emoji: "👁️", text: "View configuration (Board, List, Gantt, Calendar, Timeline, etc.)" },
        { emoji: "📊", text: "Dashboard creation and reporting setup" },
        { emoji: "🔐", text: "Permission structure and access controls" },
      ] },
      { number: "04", title: "Integration & Automation", bullets: [
        { emoji: "🔌", text: "Native integration setup (1000+ apps)" },
        { emoji: "⚡", text: "API integration development, Zapier/Make automation workflows" },
        { emoji: "⚙️", text: "ClickUp automation configuration" },
        { emoji: "📧", text: "Email integration and routing" },
        { emoji: "⏱️", text: "Time tracking integration" },
        { emoji: "💾", text: "File storage connections (Google Drive, Dropbox, OneDrive)" },
      ] },
      { number: "05", title: "Training & Adoption", bullets: [
        { emoji: "💼", text: "Executive and leadership training" },
        { emoji: "🎓", text: "Admin and power user certification" },
        { emoji: "🚪", text: "End-user onboarding sessions" },
        { emoji: "🎯", text: "Department-specific use case training and best practices workshops" },
        { emoji: "📖", text: "Custom documentation and guides" },
        { emoji: "👨‍🏫", text: "Ongoing support and office hours" },
      ] },
      { number: "06", title: "ClickUp Brain & AI Implementation", bullets: [
        { emoji: "🔍", text: "AI search configuration across workspace" },
        { emoji: "✍️", text: "AI writing and content generation setup" },
        { emoji: "📝", text: "Automated standups and reports" },
        { emoji: "🧠", text: "Knowledge base AI integration" },
        { emoji: "💬", text: "Custom AI prompts and templates" },
        { emoji: "🎓", text: "Team AI adoption training" },
      ] },
      { number: "07", title: "Optimisation & Continuous Improvement", bullets: [
        { emoji: "🏥", text: "Workspace health audits" },
        { emoji: "📊", text: "Performance analytics and reporting" },
        { emoji: "🔧", text: "Workflow optimisation recommendations" },
        { emoji: "✨", text: "New feature implementation" },
        { emoji: "⚡", text: "Automation enhancement" },
        { emoji: "🎨", text: "Template refinement" },
      ] },
    ],
  },
  {
    key: "why-fruition",
    label: "Why Partner with Fruition",
    heading: "Why choose monday.com for your project management needs?",
    groups: [
      { number: "01", title: "Deep Platform Expertise", bullets: [
        { emoji: "🏆", text: "Certified ClickUp consultants" },
        { emoji: "✅", text: "Proven implementation methodology" },
        { emoji: "🏢", text: "Industry-specific best practices" },
        { emoji: "☁️", text: "Cross-platform migration experience" },
        { emoji: "🎨", text: "Complex workflow design capabilities" },
        { emoji: "🏗️", text: "Enterprise-scale deployments" },
      ] },
      { number: "02", title: "Accelerated Time-to-Value", bullets: [
        { emoji: "🚀", text: "Rapid onboarding" },
        { emoji: "📊", text: "Phased rollout strategies" },
        { emoji: "🎯", text: "Quick win identification" },
        { emoji: "📈", text: "Early adoption momentum building" },
        { emoji: "🛡️", text: "Risk mitigation planning" },
        { emoji: "📉", text: "Success metrics tracking" },
      ] },
      { number: "03", title: "Tailored Solutions, Not Templates", bullets: [
        { emoji: "🔧", text: "Custom workflow engineering" },
        { emoji: "🏭", text: "Industry-specific configurations" },
        { emoji: "👤", text: "Role-based training programs" },
        { emoji: "📐", text: "Scalable architecture design" },
        { emoji: "🔮", text: "Future-growth planning" },
        { emoji: "⏰", text: "Flexible implementation timelines" },
      ] },
      { number: "04", title: "Change Management Excellence", bullets: [
        { emoji: "🎯", text: "Executive alignment strategies" },
        { emoji: "⭐", text: "Champion identification and training" },
        { emoji: "📢", text: "Communication planning" },
        { emoji: "🛡️", text: "Resistance management" },
        { emoji: "📊", text: "Adoption tracking and intervention" },
        { emoji: "🎉", text: "Success celebration and reinforcement" },
      ] },
      { number: "05", title: "Global Service Delivery", bullets: [
        { emoji: "🕐", text: "Multi-timezone support coverage" },
        { emoji: "⚖️", text: "Local compliance expertise" },
        { emoji: "🗺️", text: "Regional best practices" },
        { emoji: "🌐", text: "Global workspace architecture" },
        { emoji: "🤝", text: "International team coordination" },
        { emoji: "📍", text: "Localised training delivery" },
      ] },
    ],
  },
]

type IndustryTab = { label: string; description: string; features: { emoji: string; text: string }[] }
const INDUSTRY_TABS: IndustryTab[] = [
  { label: "Marketing Teams", description: "Plan campaigns, manage content calendars, track deliverables, and collaborate on creative assets in one visual workspace.", features: [
    { emoji: "📅", text: "Campaign planning and calendars" },
    { emoji: "🎨", text: "Asset collaboration and approval" },
    { emoji: "📱", text: "Social media integration" },
    { emoji: "📝", text: "Content management workflows" },
    { emoji: "📊", text: "Marketing dashboards and analytics" },
    { emoji: "📧", text: "Email marketing automation" },
  ] },
  { label: "Product & Engineering Teams", description: "Build better products faster with agile workflows, sprint planning, roadmaps, and seamless development tool integration.", features: [
    { emoji: "🏃", text: "Sprint planning and backlogs" },
    { emoji: "🗺️", text: "Product roadmaps and timelines" },
    { emoji: "👨‍💻", text: "Code review workflows" },
    { emoji: "🐛", text: "Bug tracking and issue management" },
    { emoji: "🔄", text: "Git integration and 2-way sync" },
    { emoji: "🚀", text: "Release management" },
  ] },
  { label: "Operations & PMO Teams", description: "Streamline operations, manage resources, track portfolios, and ensure projects deliver on time and on budget.", features: [
    { emoji: "💼", text: "Portfolio management" },
    { emoji: "💰", text: "Budget tracking and reporting" },
    { emoji: "⚠️", text: "Risk and issue management" },
    { emoji: "👥", text: "Resource capacity planning" },
    { emoji: "🔗", text: "Cross-functional workflows" },
    { emoji: "📈", text: "Executive dashboards" },
  ] },
  { label: "Sales & CRM Teams", description: "Manage your sales pipeline, track deals, automate follow-ups, and integrate with your CRM for complete visibility.", features: [
    { emoji: "🔄", text: "Pipeline management" },
    { emoji: "📝", text: "Activity logging and follow-ups" },
    { emoji: "📄", text: "Proposal management" },
    { emoji: "🎯", text: "Deal tracking and forecasting" },
    { emoji: "🔌", text: "CRM integration (HubSpot, monday)" },
    { emoji: "📊", text: "Sales analytics" },
  ] },
  { label: "Creative Agencies", description: "Deliver client projects efficiently with time tracking, client portals, approval workflows, and profitability tracking.", features: [
    { emoji: "🏢", text: "Client workspaces and portals" },
    { emoji: "⚡", text: "Creative workflow automation" },
    { emoji: "📊", text: "Resource allocation" },
    { emoji: "⏱️", text: "Time tracking and profitability" },
    { emoji: "✅", text: "Proofing and approval processes" },
    { emoji: "📋", text: "Retainer tracking" },
  ] },
  { label: "HR & Operations", description: "Centralize employee onboarding, track hiring pipelines, manage facilities, and streamline internal operations.", features: [
    { emoji: "🎯", text: "Recruiting and onboarding" },
    { emoji: "📁", text: "Document management" },
    { emoji: "🏢", text: "Facility management" },
    { emoji: "👤", text: "Employee directories" },
    { emoji: "🎫", text: "Request intake and ticketing" },
    { emoji: "✅", text: "Compliance tracking" },
  ] },
]


const PROVEN_STATS = [
  { emoji: "📊", value: "1 day per week", body: "average time saved by teams after switching to ClickUp" },
  { emoji: "🔗", value: "1000+ integrations", body: "connect ClickUp with your entire tech stack for seamless workflows" },
  { emoji: "⭐", value: "4.6/5 stars", body: "average ClickUp rating from 180,000+ organizations worldwide" },
  { emoji: "💪", value: "89% productivity increase", body: "teams report significant productivity gains within first 90 days" },
]

const EVERYTHING_APP_FEATURES = [
  { number: "01", title: "Project & Task Management", body: "Organise work with unlimited hierarchies, custom statuses, dependencies, priorities, and 15+ view types including List, Board, Gantt, Calendar, Timeline, and more." },
  { number: "02", title: "ClickUp Docs & Wikis", body: "Create collaborative documents with nested pages, rich formatting, embeds, and real-time editing. Build searchable knowledge bases with automatic organisation." },
  { number: "03", title: "Goals & OKRs", body: "Set, track, and achieve organizational objectives with measurable targets, progress tracking, and automated updates from connected tasks." },
  { number: "04", title: "Dashboards & Reporting", body: "Build custom dashboards with 50+ widget types to visualize work, track KPIs, monitor team performance, and make data-driven decisions." },
  { number: "05", title: "Whiteboards & Mind Maps", body: "Brainstorm, plan, and strategise with infinite canvas collaboration tools that convert ideas directly into actionable tasks." },
  { number: "06", title: "Chat & Video Clips", body: "Keep team communication in context with threaded chat, @mentions, and async video messaging—all connected to your work." },
  { number: "07", title: "Time Tracking & Timesheets", body: "Track time across tasks, generate timesheets, analyse team capacity, and integrate with payroll systems for accurate billing." },
  { number: "08", title: "Automations", body: "Eliminate repetitive work with 100+ automation triggers, actions, and conditions. Create custom automations without code." },
  { number: "09", title: "Forms & Intake", body: "Collect information systematically with custom forms that can then automatically create tasks pre-filled with intake data." },
  { number: "10", title: "ClickUp Brain (AI)", body: "Your AI assistant that works across every app. Search everything, generate content, automate updates, and get instant answers." },
  { number: "11", title: "Mobile & Desktop Apps", body: "Access your work anywhere with native iOS, Android, Mac, Windows, and Linux apps with offline capabilities." },
  { number: "12", title: "Email Management", body: "Send and receive emails directly in ClickUp, convert emails to tasks, and keep correspondence connected to projects." },
]

/* ----------------- Sections ----------------- */

function PartnershipIntroSection() {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div className="mx-auto text-center" style={{ maxWidth: 880 }}>
        <p style={{ fontSize: 16, lineHeight: "26px", color: "#444" }}>
          Fruition certifies partnership with ClickUp, an all-in-one productivity platform that brings work together in one place.
        </p>
        <p style={{ fontSize: 16, lineHeight: "26px", color: "#444", marginTop: 14 }}>
          As a certified ClickUp Implementation Partners, we deliver comprehensive workspace solutions that transform how teams collaborate, eliminate app-switching, and save organisations a day of work every week.
        </p>
      </div>
    </section>
  )
}

type EverythingAppCard = { emoji?: string; title?: string; body?: string }
function EverythingAppSection({ cards }: { cards: EverythingAppCard[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="text-center" style={{ marginBottom: 40 }}>
          <h2 className="font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 14 }}>
            Transform Your Business with ClickUp&apos;s <span style={{ color: "#8015e8" }}>Everything App for Work</span>
          </h2>
          <p className="mx-auto" style={{ color: "#444", fontSize: 16, lineHeight: "26px", maxWidth: 820 }}>
            ClickUp replaces multiple tools with one unified platform, eliminating the app-switching that fragments work, steals time, and kills productivity.
          </p>
          <p className="mx-auto" style={{ color: "#444", fontSize: 16, lineHeight: "26px", maxWidth: 820, marginTop: 12 }}>
            As your certified ClickUp implementation partner, we help organisations across Australia, US, and UK unlock ClickUp&apos;s full potential through expert configuration, seamless migration, and comprehensive training.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {cards.map((c, i) => (
            <div key={c.title || i} className="bg-white" style={{ padding: 24, borderRadius: 18, border: "1px solid #ece7fb", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{c.emoji}</span>
              <p className="font-bold" style={{ color: "#10003a", fontSize: 18 }}>{c.title}</p>
              <p style={{ color: "#444", fontSize: 14, lineHeight: "22px" }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesTabsSection({ tabs }: { tabs: FeatureTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  if (!active) return null
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginBottom: 40 }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.key || tab.label || i}
              onClick={() => setActiveIdx(i)}
              style={{
                padding: "10px 26px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                ...(i === activeIdx
                  ? { background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", border: "none", boxShadow: "0 10px 22px -12px rgba(128,21,232,0.55)" }
                  : { background: "white", color: "#2b074d", border: "1px solid #e8e6e6" }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 32, lineHeight: "40px", marginBottom: 32 }}>
          {active.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {(active.groups || []).map((g: FeatureGroup, gi: number) => (
            <div key={g.number || gi} className="bg-white" style={{ padding: 24, borderRadius: 18, border: "1px solid rgba(128,21,232,0.08)", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="flex items-center" style={{ gap: 14 }}>
                <span className="flex items-center justify-center font-bold" style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)", color: "white", fontSize: 13 }}>
                  {g.number}
                </span>
                <p className="font-bold" style={{ color: "#10003a", fontSize: 15, lineHeight: "22px" }}>{g.title}</p>
              </div>
              <ul className="flex flex-col" style={{ gap: 10 }}>
                {(g.bullets || []).map((b: { emoji: string; text: string }, bi: number) => (
                  <li key={b.text || bi} className="flex items-start" style={{ gap: 10 }}>
                    <span style={{ fontSize: 18, lineHeight: "22px", flexShrink: 0 }}>{b.emoji}</span>
                    <span style={{ color: "#444", fontSize: 13, lineHeight: "20px" }}>{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function IndustryTabsSection({ tabs }: { tabs: IndustryTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  if (!active) return null
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "linear-gradient(180deg, #faf6ff 0%, #ebd9ff 100%)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 32 }}>
          Implement ClickUp for <span style={{ color: "#8015e8" }}>any team</span>
        </h2>
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginBottom: 32 }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.label || i}
              onClick={() => setActiveIdx(i)}
              style={{
                padding: "10px 22px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                ...(i === activeIdx
                  ? { background: "linear-gradient(to right, #8015e8, #ba83f0)", color: "white", border: "none" }
                  : { background: "white", color: "#2b074d", border: "1px solid #e8e6e6" }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-white" style={{ padding: 32, borderRadius: 20, border: "1px solid rgba(128,21,232,0.08)", boxShadow: "0 18px 36px -24px rgba(64,12,140,0.2)" }}>
          <h3 className="font-bold" style={{ color: "#10003a", fontSize: 22, marginBottom: 10 }}>{active.label}</h3>
          <p style={{ color: "#444", fontSize: 15, lineHeight: "24px", marginBottom: 22 }}>{active.description}</p>
          <p className="font-bold" style={{ color: "#8015e8", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Key Features</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 10 }}>
            {(active.features || []).map((f: { emoji: string; text: string }, fi: number) => (
              <li key={f.text || fi} className="flex items-start" style={{ gap: 10 }}>
                <span style={{ fontSize: 18, lineHeight: "22px", flexShrink: 0 }}>{f.emoji}</span>
                <span style={{ color: "#444", fontSize: 14, lineHeight: "22px" }}>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

type ProvenStat = { emoji?: string; value?: string; body?: string }
function ProvenResultsSection({ stats }: { stats: ProvenStat[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 40 }}>
          Proven <span style={{ color: "#8015e8" }}>ClickUp</span> Results
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 20 }}>
          {stats.map((s, i) => (
            <div key={s.value || i} className="text-center" style={{ padding: 28, borderRadius: 18, background: "linear-gradient(180deg, #f6efff 0%, #ebd9ff 100%)", border: "1px solid rgba(128,21,232,0.1)", boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <span className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: 999, background: "white", fontSize: 22, boxShadow: "0 4px 14px -8px rgba(64,12,140,0.25)" }}>{s.emoji}</span>
              <p className="font-bold" style={{ color: "#8015e8", fontSize: 22, lineHeight: 1.1 }}>{s.value}</p>
              <p style={{ color: "#444", fontSize: 13, lineHeight: "20px", maxWidth: 220 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type EverythingAppFeature = { number?: string; title?: string; body?: string }
function EverythingAppFeaturesSection({ features }: { features: EverythingAppFeature[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 40 }}>
          The Everything App for Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {features.map((f, i) => (
            <div key={f.number || i} className="bg-white" style={{ padding: 24, borderRadius: 16, border: "1px solid #ece7fb", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span className="flex items-center justify-center font-bold" style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)", color: "white", fontSize: 13, flexShrink: 0 }}>
                {f.number}
              </span>
              <div>
                <p className="font-bold" style={{ color: "#10003a", fontSize: 16, marginBottom: 6 }}>{f.title}</p>
                <p style={{ color: "#444", fontSize: 13, lineHeight: "20px" }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------- Page ----------------- */

export default function CertifiedClickupPartnerContent({ page, siteSettings, faqTabs }: Props) {
  if (!page) return null
  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const resolvedFaqTabs = faqTabs ?? []
  const resolvedEverythingAppCards = (page.everythingAppCards && page.everythingAppCards.length > 0) ? page.everythingAppCards : EVERYTHING_APP_CARDS
  const resolvedServicesTabs: FeatureTab[] = (page.servicesTabs && page.servicesTabs.length > 0) ? page.servicesTabs : SERVICES_TABS
  const resolvedIndustryTabs: IndustryTab[] = (page.industryTabsPartnership && page.industryTabsPartnership.length > 0) ? page.industryTabsPartnership : INDUSTRY_TABS
  const resolvedProvenStats = (page.provenStats && page.provenStats.length > 0) ? page.provenStats : PROVEN_STATS
  const resolvedEverythingAppFeatures = (page.everythingAppFeatures && page.everythingAppFeatures.length > 0) ? page.everythingAppFeatures : EVERYTHING_APP_FEATURES

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || "Certified ClickUp Implementation Partner"}
        headingAccent=""
        subheading={
          page.hideHeroSubheading
            ? undefined
            : page.heroSubheading ||
              "Transform your productivity with Fruition's certified ClickUp implementation services. Expert workspace setup, migration, automation, and training across Australia, US & UK. Get more done, faster."
        }
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel || "🚀  Book a Consultation"}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
      />

      <PartnershipIntroSection />

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      <EverythingAppSection cards={resolvedEverythingAppCards} />
      <ServicesTabsSection tabs={resolvedServicesTabs} />
      <IndustryTabsSection tabs={resolvedIndustryTabs} />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule a 30-min consultation"}
        subheading={
          page.calendlySubheading ||
          "Contact Fruition's ClickUp experts to begin your digital transformation journey. As a certified Solutions Partner, we deliver enterprise-grade project management and automation solutions that drive revenue growth and customer satisfaction."
        }
        calendlyUrl={calendlyUrl}
      />

      <FaqAccordion heading="Frequently asked questions" tabs={resolvedFaqTabs} />

      <ProvenResultsSection stats={resolvedProvenStats} />
      <EverythingAppFeaturesSection features={resolvedEverythingAppFeatures} />
    </div>
  )
}
