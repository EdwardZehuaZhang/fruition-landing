"use client"

import Link from "next/link"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  TestimonialsGrid,
  DiscoverCtaSection,
  JoinStatsSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import type { CaseStudy, SiteSettingsData, FaqTab, ComparisonTab } from "@/components/sections/types"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

const HR_COMPARISON_TABS: ComparisonTab[] = [
  {
    _key: "hr-leadership",
    label: "HR Leadership Challenges",
    items: [
      {
        _key: "lead-1",
        number: "01",
        title: "Streamlined Talent Management",
        description:
          "Track entire employee lifecycle through customised boards — from recruitment pipelines and automated interview scheduling to onboarding journeys, skills development, and retention metrics. Integrate performance reviews and career development plans in one visible platform.",
      },
      {
        _key: "lead-2",
        number: "02",
        title: "Employee Experience & Wellbeing",
        description:
          "Monitor workplace satisfaction through automated pulse surveys, manage flexible work arrangements, and track wellbeing initiatives. Create dashboards for workload distribution, time-off management, and anonymous feedback collection, ensuring no team member gets overwhelmed.",
      },
      {
        _key: "lead-3",
        number: "03",
        title: "Strategic HR Operations",
        description:
          "Transform compliance, budget tracking, and resource allocation with automated reminders for certifications, policy reviews, and training deadlines. Create approval workflows for expenses and monitor ROI of HR initiatives through integrated financial dashboards.",
      },
      {
        _key: "lead-4",
        number: "04",
        title: "Data-Driven Decision Making",
        description:
          "Leverage real-time analytics dashboards to track key HR metrics across recruitment, retention, engagement, and DEI initiatives. Consolidate data from various HR systems to identify trends and make informed decisions about workforce planning and program effectiveness.",
      },
      {
        _key: "lead-5",
        number: "05",
        title: "Change Management & Communication",
        description:
          "Design structured project boards for organisational changes, breaking initiatives into clear phases with stakeholder mapping and progress tracking. Create centralised communication hubs for policies, announcements, and feedback collection, ensuring transparency across hybrid teams.",
      },
    ],
  },
  {
    _key: "hr-team",
    label: "HR Team Challenges",
    items: [
      {
        _key: "team-1",
        number: "01",
        title: "HR Technology & Employee Experience Management",
        description:
          "Hybrid workforce management requires strategic HRIS integration and digital workplace solutions that support remote work policies, employee engagement platforms, and inclusive team dynamics while ensuring compliance and equitable experiences across all work arrangements and employment classifications.",
      },
      {
        _key: "team-2",
        number: "02",
        title: "HR Digital Transformation & Training Solutions",
        description:
          "Successful workforce digitisation depends on comprehensive change management consulting, employee training programs, and learning management systems (LMS) that include skills gap analysis, personalised development pathways, and continuous learning support to maintain productivity during technology adoption and organisational change.",
      },
      {
        _key: "team-3",
        number: "03",
        title: "Employee Wellbeing Programs & HR Automation",
        description:
          "Work-life balance initiatives improve through intelligent HR process automation, employee self-service portals, and streamlined administrative workflows that reduce burnout, support mental health programs, and enable focus on strategic talent management while enhancing employee satisfaction and retention rates.",
      },
      {
        _key: "team-4",
        number: "04",
        title: "Talent Development & Performance Management",
        description:
          "Professional growth strategies emphasise leadership development programs, performance optimisation training, and succession planning initiatives that build analytical capabilities, empower employees to drive continuous improvement, and prepare high-potential talent for career advancement opportunities.",
      },
      {
        _key: "team-5",
        number: "05",
        title: "Organisational Culture & Internal Communications",
        description:
          "Team collaboration strengthens through unified HR communication platforms, employee feedback systems, and transparent performance management tools that build organisational trust, facilitate knowledge management, support diversity and inclusion initiatives, and maintain strong company culture across distributed teams and remote work environments.",
      },
    ],
  },
  {
    _key: "how-we-help",
    label: "How We Can Help",
    items: [
      {
        _key: "help-1",
        number: "01",
        title: "HR Process Assessment → Workforce Operations Audit",
        description:
          "We comprehensively map your existing HR workflows and talent management processes against industry best practices, analysing bottlenecks in recruitment, onboarding, performance management, and employee lifecycle stages that prevent your organisation from scaling effectively and maintaining competitive talent acquisition.",
      },
      {
        _key: "help-2",
        number: "02",
        title: "HRIS Evaluation → HR Technology Integration Analysis",
        description:
          "Our technical assessment uncovers optimisation opportunities within your current HR technology stack, identifying precise automation solutions and system integrations that transform disconnected HR processes into unified employee experience platforms while ensuring data security and compliance requirements.",
      },
      {
        _key: "help-3",
        number: "03",
        title: "HR Solution Design → Workflow Automation Implementation",
        description:
          "Through comprehensive HR systems analysis, we implement the optimal balance between sophisticated automation capabilities and user-friendly interfaces, ensuring your HRIS solution scales with organisational growth while supporting employee self-service, manager effectiveness, and HR team productivity.",
      },
      {
        _key: "help-4",
        number: "04",
        title: "Productivity Impact → HR ROI Measurement Analysis",
        description:
          "By quantifying potential efficiency gains across talent acquisition, employee engagement, performance management, and administrative processes, we identify where HR automation and workforce optimisation deliver measurable returns on investment through reduced time-to-hire, improved retention rates, and enhanced employee satisfaction scores.",
      },
      {
        _key: "help-5",
        number: "05",
        title: "Change Management → HR Adoption Strategy Development",
        description:
          "Our proven organisational change framework assesses workforce readiness for new HR technologies and develops tailored employee training programs, communication strategies, and support systems that transform potential resistance into enthusiastic adoption of new people management processes and digital workplace tools.",
      },
    ],
  },
]

const HR_LIFECYCLE_STAGES = [
  {
    n: "01",
    title: "Needs Assessment 🎯",
    body: "Assess your HR needs and goals to understand what you want to achieve with an HRIS. By clearly understanding your requirements, we can align the system's features with your specific needs.",
  },
  {
    n: "02",
    title: "Thorough Research 🔍",
    body: "Conduct comprehensive research to compare different HRIS options. Consider factors like pricing, features, and integrations, ensuring that the chosen system is the ideal fit for your HR needs.",
  },
  {
    n: "03",
    title: "Seamless Configuration ⚙️",
    body: "Once the HRIS is selected, configure the system to match your unique requirements. Set up custom workflows, automations, and permissions to ensure the HRIS aligns perfectly with your HR processes.",
  },
  {
    n: "04",
    title: "System Rollout 🚀",
    body: "Once configured and tested, it's time to roll out the HRIS to your team.",
  },
  {
    n: "05",
    title: "Post-Construction Support 🤝",
    body: "Maintain client relationships with warranty tracking and maintenance scheduling. Material project status improves, future estimates and business processes.",
  },
]

const HR_HIRING_ITEMS: Array<{ emoji: string; text: string }> = [
  { emoji: "📝", text: "ATS recruitment workflows including Forms" },
  { emoji: "✅", text: "Onboarding checklists" },
  { emoji: "📄", text: "Contracting document creation" },
  { emoji: "👥", text: "Talent Pool / Contractor Management" },
]

const HR_OPERATIONS_ITEMS: Array<{ emoji: string; text: string }> = [
  { emoji: "📧", text: "Email/inbox ticketing" },
  { emoji: "⚠️", text: "OHS Policy and Operations" },
  { emoji: "💰", text: "Budgeting & Headcount Planning" },
  { emoji: "📋", text: "HR Project Management" },
  { emoji: "🏖️", text: "Leave Management" },
  { emoji: "📅", text: "Scheduling" },
  { emoji: "🏢", text: "Organisational Charts" },
]

const HR_FIT_REASONS = [
  {
    title: "Streamlined Employee Onboarding",
    body: "Create a centralised workflow to ensure a smooth transition for new hires, track tasks, and monitor progress.",
  },
  {
    title: "HR Document Management",
    body: "Securely store, access, and share important HR documents.",
  },
  {
    title: "Vacation and Leave Tracking",
    body: "Keep track of employee vacations, leaves, and time off effortlessly.",
  },
  {
    title: "Performance Management",
    body: "Set objectives, monitor progress, and facilitate constructive conversations to support employee growth and development.",
  },
  {
    title: "Employee Database",
    body: "Consolidate all employee information in one place.",
  },
  {
    title: "Training and Development",
    body: "Manage employee training programs and professional development initiatives.",
  },
  {
    title: "Employee Surveys and Feedback",
    body: "Utilise custom forms and surveys to collect valuable insights and improve the employee experience.",
  },
  {
    title: "Employee Recognition and Rewards",
    body: "Create a culture of appreciation and recognition within your organisation.",
  },
  {
    title: "Compliance and Policy Management",
    body: "Stay organised, track policy updates, and ensure adherence to regulations.",
  },
  {
    title: "Integration Power",
    body: "Seamlessly integrate your HR tools and software to sync data and streamline HR processes.",
  },
]

function HrLifecycleSection({ stages: resolvedLifecycleStages }: { stages: { n?: string; title?: string; body?: string }[] }) {
  return (
    <section
      className="bg-white px-4 relative overflow-hidden"
      style={{ paddingTop: 96, paddingBottom: 96 }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2
          className="text-center font-bold"
          style={{ color: "#10003a", fontSize: 40, lineHeight: "48px", marginBottom: 56 }}
        >
          Supporting Each Stage of Your HR Life Cycle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 32, columnGap: 56 }}>
          {resolvedLifecycleStages.map((stage: { n?: string; title?: string; body?: string }, i: number) => (
            <div key={stage.n || i} className="flex flex-col" style={{ gap: 12 }}>
              <p style={{ color: "#8015e8", fontSize: 40, fontWeight: 300, lineHeight: 1 }}>{stage.n}</p>
              <p style={{ color: "#10003a", fontSize: 18, fontWeight: 700 }}>{stage.title}</p>
              <p style={{ color: "#4a4a4a", fontSize: 14, lineHeight: "22px" }}>{stage.body}</p>
              {stage.n === "04" && (
                <div className="rounded-card overflow-hidden" style={{ marginTop: 8, maxWidth: 460 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hr-lifecycle-stage-04.gif"
                    alt="System rollout"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HrExpertiseSection() {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, backgroundColor: "#ebd9ff" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2
          className="text-center font-bold"
          style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 16 }}
        >
          Our monday CRM consulting expertise
        </h2>
        <p
          className="text-center mx-auto"
          style={{ color: "#4a4a4a", fontSize: 15, lineHeight: "24px", maxWidth: 820, marginBottom: 48 }}
        >
          Streamline your HR operations and strategic management systems with monday.com,
          through intelligent automation and data tracking; you can enhance your entire
          employee lifecycle from strategic recruitment workflow planning through to
          comprehensive HR project management. From hiring, engagement surveys, and
          collaboration portals. Seamlessly connect strategy to execution by managing
          company projects, contract administration, and performance initiatives across
          all phases of your employee&apos;s journey from hire to retire.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          <div
            className="rounded-card"
            style={{ padding: 28, border: "1px solid #ece7fb", backgroundColor: "#f9f7ff" }}
          >
            <h3 className="font-bold" style={{ fontSize: 20, color: "#8015e8", marginBottom: 16 }}>
              Hiring
            </h3>
            <ul className="flex flex-col" style={{ gap: 10 }}>
              {HR_HIRING_ITEMS.map((item) => (
                <li
                  key={item.text}
                  className="flex items-start"
                  style={{ gap: 10, fontSize: 14, lineHeight: "22px", color: "#444" }}
                >
                  <span style={{ fontSize: 18, lineHeight: "22px", flexShrink: 0 }}>{item.emoji}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-card"
            style={{ padding: 28, border: "1px solid #ece7fb", backgroundColor: "#f9f7ff" }}
          >
            <h3 className="font-bold" style={{ fontSize: 20, color: "#8015e8", marginBottom: 16 }}>
              HR Operations
            </h3>
            <ul className="flex flex-col" style={{ gap: 10 }}>
              {HR_OPERATIONS_ITEMS.map((item) => (
                <li
                  key={item.text}
                  className="flex items-start"
                  style={{ gap: 10, fontSize: 14, lineHeight: "22px", color: "#444" }}
                >
                  <span style={{ fontSize: 18, lineHeight: "22px", flexShrink: 0 }}>{item.emoji}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function HrFitSection({ calendlyUrl, reasons: resolvedFitReasons }: { calendlyUrl: string; reasons: { title?: string; body?: string }[] }) {
  return (
    <section className="px-4 relative overflow-hidden" style={{ paddingTop: 96, paddingBottom: 96, backgroundColor: "#ebd9ff" }}>
      {/* Decorative orbs */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: -120,
          right: -120,
          width: 360,
          height: 360,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(128,21,232,0.18), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: -120,
          left: -120,
          width: 320,
          height: 320,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(186,131,240,0.22), transparent 70%)",
        }}
      />

      <div className="relative mx-auto" style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div className="flex flex-col items-center text-center" style={{ marginBottom: 56 }}>
          <span
            className="uppercase font-bold tracking-[0.18em]"
            style={{ color: "#8015e8", fontSize: 12, marginBottom: 14 }}
          >
            Built for People &amp; Culture
          </span>
          <h2
            className="font-bold"
            style={{ color: "#10003a", fontSize: 38, lineHeight: "46px", maxWidth: 820 }}
          >
            Why monday.com is the perfect fit for People and Culture Teams
          </h2>
          <Link
            href={calendlyUrl}
            className="inline-flex items-center justify-center font-semibold transition-transform hover:-translate-y-[1px]"
            style={{
              marginTop: 28,
              height: 50,
              padding: "0 28px",
              borderRadius: 999,
              background: "linear-gradient(to right, #8015e8, #ba83f0)",
              color: "white",
              fontSize: 15,
              boxShadow: "0 12px 28px -10px rgba(128,21,232,0.55)",
            }}
          >
            Schedule a Meeting
            <svg width="10" height="14" viewBox="0 0 8 14" fill="none" style={{ marginLeft: 10 }}>
              <path d="M1 1L7 7L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {resolvedFitReasons.map((r: { title?: string; body?: string }, i: number) => (
            <div
              key={r.title || i}
              className="relative bg-white transition-transform hover:-translate-y-[2px]"
              style={{
                borderRadius: 20,
                padding: "24px 26px",
                boxShadow: "0 1px 0 rgba(16,0,58,0.04), 0 18px 32px -22px rgba(64,12,140,0.25)",
                border: "1px solid rgba(128,21,232,0.08)",
              }}
            >
              <div className="flex items-center" style={{ gap: 14, marginBottom: 10 }}>
                <span
                  className="flex items-center justify-center font-bold"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)",
                    color: "white",
                    fontSize: 13,
                    letterSpacing: "0.04em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-bold" style={{ color: "#10003a", fontSize: 17, lineHeight: "22px" }}>
                  {r.title}
                </p>
              </div>
              <p style={{ fontSize: 14, lineHeight: "22px", color: "#56516a", paddingLeft: 52 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HrVideoSection() {
  return (
    <section className="px-4" style={{ paddingTop: 40, paddingBottom: 80, backgroundColor: "#ebd9ff" }}>
      <div className="mx-auto w-full" style={{ maxWidth: 1100 }}>
        <div className="rounded-card overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
          <YouTubeEmbed videoId="g83dt0bCG4I" title="Improve your HR processes" />
        </div>
      </div>
    </section>
  )
}

export default function MondayForHrContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const comparisonTabs: ComparisonTab[] =
    (page.comparisonTabs && page.comparisonTabs.length > 0 && page.comparisonTabs[0]?.items?.length > 0)
      ? page.comparisonTabs
      : HR_COMPARISON_TABS

  const featuredTestimonial = caseStudies[0]
  const resolvedLifecycleStages = (page.lifecycleStages && page.lifecycleStages.length > 0) ? page.lifecycleStages : HR_LIFECYCLE_STAGES
  const resolvedFitReasons = (page.fitReasons && page.fitReasons.length > 0) ? page.fitReasons : HR_FIT_REASONS

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
      />

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3-tab section */}
      <ComparisonTabsSection
        heading={page.comparisonHeading || "Streamline HR Operations with a monday.com Expert"}
        subheading={
          page.comparisonSubheading ||
          "We transform fragmented HR processes into seamless, automated workflows that enhance cross-functional collaboration and deliver quantifiable value to your people operations. Our specialised consultants partner with HR leaders to implement workflow automation and AI solutions that streamline talent management, improve employee experience, and drive strategic workforce outcomes."
        }
        tabs={comparisonTabs}
        theme={page.comparisonTheme || "light"}
        withPurpleCircle={page.comparisonWithPurpleCircle ?? true}
      />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* FAQ */}
      {!page.hideFaqSection && ((faqTabs && faqTabs.length > 0) ? (
        <FaqAccordion heading="Frequently asked questions" tabs={faqTabs} />
      ) : page.faqTabs?.length > 0 ? (
        <FaqAccordion heading="Frequently asked questions" tabs={page.faqTabs} />
      ) : null)}

      {/* Sections below FAQ (per screenshot) */}
      <HrLifecycleSection stages={resolvedLifecycleStages} />
      <HrExpertiseSection />
      <HrFitSection calendlyUrl={calendlyUrl} reasons={resolvedFitReasons} />
      <HrVideoSection />

      {/* Closing sections */}
      {!page.hideTestimonialsSection && <TestimonialsGrid caseStudies={caseStudies} />}
      {!page.hideDiscoverSection && (
        <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />
      )}
      {!page.hideJoinStatsSection && page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel={page.joinCtaLabel}
          ctaUrl={page.joinCtaUrl || calendlyUrl}
          siteSettings={siteSettings || undefined}
        />
      )}
      <TestimonialCtaBanner
        headingPart1="Join "
        headingAccent="500+ organisations"
        headingPart2=" that have maximised their workflows with our monday.com expert support"
        primaryCtaUrl={calendlyUrl}
        secondaryCtaUrl={calendlyUrl}
        testimonial={featuredTestimonial}
        testimonials={caseStudies}
      />
    </div>
  )
}
