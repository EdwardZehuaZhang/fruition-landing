/**
 * Phase-2 seed of the `croSections` field (CRO action items) for the remaining
 * pages from the "CRO landing page" audit. Patch-only `.set()` — never replaces
 * docs, so all other content is preserved. Copy is drafted on-brand from the
 * audit spec for review in Studio.
 *
 * Covers: monday-partner-uk, monday-partner-australia, monday-for-construction,
 * monday-implementation-consultants, monday-training, make-partners,
 * n8n-integration-partner, about-us, customer-testimonials,
 * monday-consulting-solutions, fruition-team.
 *
 * Dry run:  DRY=1 tsx scripts/sanity-migrate/cro-action-items-2.ts
 * Live:     tsx scripts/sanity-migrate/cro-action-items-2.ts
 */
import { writeClient } from './lib'

const DRY = !!process.env.DRY
const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'

type Locator = { type: string } | { type: string; slug: string }

interface PageCro {
  name: string
  locator: Locator
  croSections: Record<string, unknown>
}

const PLATINUM = { label: 'monday.com Certified Platinum Partner' }
const ADV_DELIVERY = { label: 'Advanced Delivery Accredited Agency' }
const FIVE_STAR = { label: '5/5 Rated Implementation Agency' }

const PAGES: PageCro[] = [
  // ── monday-partner-uk (locationPage) ─────────────────────────────────────
  {
    name: 'monday-partner-uk',
    locator: { type: 'locationPage', slug: 'monday-partner-uk' },
    croSections: {
      trustBadges: [
        { label: 'UK GDPR Compliant', detail: 'ICO Registered' },
        PLATINUM,
        ADV_DELIVERY,
      ],
      trustBadgesTheme: 'light',
      beforeAfter: {
        heading: 'Spreadsheet & legacy tool migration',
        beforeLabel: 'Before',
        afterLabel: 'After',
        rows: [
          { before: 'Excel & SharePoint trackers scattered across teams', after: 'Dynamic, automated monday boards' },
          { before: 'Legacy Asana / Jira / ClickUp workspaces', after: 'Consolidated single Work OS' },
          { before: 'Disconnected UK ERPs and Xero data', after: 'Custom integrations with one source of truth' },
        ],
      },
      threeStep: {
        heading: 'Our 3-stage local engagement',
        steps: [
          { number: '01', title: 'Discovery & UK Process Audit', description: 'Requirements gathering and gap analysis with London-time consultants.' },
          { number: '02', title: 'Bespoke Architecture Design', description: 'Building custom templates and deep integrations.' },
          { number: '03', title: 'Change Management & Adoption', description: 'Hands-on training to guarantee high internal team adoption.' },
        ],
      },
      statBanner: {
        statement: 'Stop losing billable hours to administrative drag. Our bespoke automation architectures reduce manual status tracking by up to 85%, freeing your delivery teams to focus on client outcomes.',
        theme: 'dark',
        metrics: [
          { value: '85%', text: 'less manual status tracking' },
          { value: 'GMT', text: 'London-time consultants' },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Book a 30-minute technical scope call with a UK-based solutions consultant',
        subheading: 'London-time support · UK GDPR compliant · No high-pressure sales — just a clear roadmap.',
        source: 'monday-partner-uk',
        submitLabel: 'Book a UK Scope Call',
        successMessage: "Thanks — a UK-based solutions consultant will reach out within one business day.",
        fields: [
          { label: 'Primary operational bottleneck', type: 'select', options: ['Spreadsheet migration', 'Legacy tool consolidation', 'Integrations', 'Training', 'Other'], required: false },
        ],
      },
      stickyCtaLabel: 'Book a UK Consultation',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── monday-partner-australia (locationPage) ──────────────────────────────
  {
    name: 'monday-partner-australia',
    locator: { type: 'locationPage', slug: 'monday-partner-australia' },
    croSections: {
      trustBadges: [PLATINUM, ADV_DELIVERY, { label: '5/5 Star Rated Global Implementation Partner' }],
      trustBadgesTheme: 'light',
      symptomsChecklist: {
        heading: 'Siloed tool consolidation',
        subheading: 'Stop paying for fragmented software subscriptions across Sydney, Melbourne and Brisbane.',
        items: [
          { text: 'Your CRM, project management and reporting live in separate tools' },
          { text: 'You are paying for overlapping software licences' },
          { text: 'Data integrity breaks across remote or multi-city workforces' },
        ],
      },
      threeStep: {
        heading: 'Our 3-phase risk-free delivery',
        steps: [
          { number: '01', title: 'Discovery & Process Mapping', description: 'Deep audit of your current workflows across AEST/AEDT teams.' },
          { number: '02', title: 'Bespoke Architecture Setup', description: 'Tailoring advanced boards and automations.' },
          { number: '03', title: 'Change Management & Adoption', description: 'Hands-on training to guarantee 100% team adoption.' },
        ],
      },
      statBanner: {
        statement: 'We design automated, single-source-of-truth workspaces that unify your CRM, project management and reporting into a single platform — cutting administrative drag and saving team hours.',
        theme: 'dark',
        metrics: [
          { value: 'AEST', text: 'Sydney & Melbourne consultants' },
          { value: '500+', text: 'Aussie clients serviced' },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Book a scope assessment with a local Australian consultant',
        subheading: 'AEST/AEDT support · Tailored to mining, property, construction and professional services.',
        source: 'monday-partner-australia',
        submitLabel: 'Schedule a Scope Assessment',
        successMessage: "Thanks — a local Australian consultant will reach out within one business day.",
        fields: [
          { label: 'Primary industry', type: 'select', options: ['Mining & Resources Logistics', 'Property Development & Construction', 'Professional Services & Agencies', 'Other'], required: false },
        ],
      },
      stickyCtaLabel: 'Book an AU Consultation',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── monday-for-construction (industryPage) ───────────────────────────────
  {
    name: 'monday-for-construction',
    locator: { type: 'industryPage', slug: 'monday-for-construction' },
    croSections: {
      trustBadges: [PLATINUM, ADV_DELIVERY, FIVE_STAR],
      trustBadgesTheme: 'light',
      threeStep: {
        heading: 'Core construction modules blueprint',
        steps: [
          { number: '01', title: 'Subcontractor & RFI Tracker', description: 'Centralize files, structural permits, and communications.' },
          { number: '02', title: 'Material Procurement & Purchase Orders', description: 'Monitor supplier delivery dates and quantities.' },
          { number: '03', title: 'Daily Logs & Progress Tracking', description: 'Track project milestones across active job sites.' },
        ],
      },
      statBanner: {
        statement: 'Stop guessing your margins. We design automated financial dashboards that tie your material orders directly to active project budgets, giving you real-time visibility into actual vs. forecasted spend.',
        theme: 'dark',
        metrics: [
          { value: 'On-Time', text: 'Gantt dependency management' },
          { value: 'On-Budget', text: 'real-time spend visibility' },
        ],
      },
      microCaseStudies: {
        heading: 'Field-to-office results',
        cases: [
          {
            challenge: 'A structural permit or material order delayed by 5 days cascading into schedule overruns.',
            solution: 'Custom dependency mapping that instantly shifts all downstream contractor schedules automatically.',
            impact: 'Prevented planning gaps and protected project profit margins.',
            metric: '35%',
            metricLabel: 'fewer kickoff delays',
          },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Audit my construction workflow',
        subheading: 'Tell us your project type and biggest pain point — we will return a custom construction blueprint.',
        source: 'monday-for-construction',
        submitLabel: 'Request a Custom Construction Blueprint',
        successMessage: "Thanks — a construction solutions consultant will reach out within one business day.",
        fields: [
          { label: 'Project type', type: 'select', options: ['Residential', 'Commercial', 'Civil'], required: false },
          { label: 'Primary pain point', type: 'select', options: ['Subcontractor tracking', 'Budget overruns', 'Scheduling', 'Other'], required: false },
        ],
      },
      stickyCtaLabel: 'Audit My Construction Workflow',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── monday-implementation-consultants (singleton) ────────────────────────
  {
    name: 'monday-implementation-consultants',
    locator: { type: 'mondayImplementationConsultantsPage' },
    croSections: {
      trustBadges: [
        { label: 'monday.com Certified Platinum Partner' },
        { label: 'Advanced Delivery Accredited Implementation Team' },
        { label: '5/5 Star Rated Consulting Agency' },
      ],
      trustBadgesTheme: 'light',
      beforeAfter: {
        heading: 'Siloed data & spreadsheet migration',
        beforeLabel: 'Before',
        afterLabel: 'After',
        rows: [
          { before: 'Complex Excel legacy spreadsheets', after: 'Beautifully structured, automated workspaces' },
          { before: 'Scattered Asana tasks and Jira boards', after: 'Unified single source of truth' },
          { before: 'Manual data drops during migration', after: 'Zero-loss managed data migration' },
        ],
      },
      threeStep: {
        heading: 'Our 3-phase implementation blueprint',
        steps: [
          { number: '01', title: 'Discovery & Process Architecture', description: 'Auditing your operational loops.' },
          { number: '02', title: 'Bespoke Workspace Build', description: 'Configuring advanced boards, custom permissions, and cross-tool automations.' },
          { number: '03', title: 'User Adoption & Training', description: 'Hands-on training to guarantee day-one team compliance.' },
        ],
      },
      statBanner: {
        statement: 'We look beyond basic templates. As advanced workflow setup experts, we build complex multi-board dependencies and use platforms like Make and n8n to bypass native recipe limitations — saving your company thousands in task overhead as you scale.',
        theme: 'dark',
      },
      leadForm: {
        enabled: true,
        heading: 'Scope your workplace setup',
        subheading: '100% Secure · NDAs available on request · Direct strategy call with a Senior Solutions Consultant · Customized implementation scope proposal delivered post-call.',
        source: 'monday-implementation-consultants',
        submitLabel: 'Request an Implementation Scope Estimate',
        successMessage: "Thanks — a Senior Solutions Consultant will reach out within one business day.",
        fields: [
          { label: 'Target timeline for launch', type: 'select', options: ['Immediate', '1-3 Months', 'Exploring'], required: false },
          { label: 'Estimated user seats required', type: 'text', required: false },
        ],
      },
      stickyCtaLabel: 'Request an Implementation Scope',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── monday-training (singleton) ──────────────────────────────────────────
  {
    name: 'monday-training',
    locator: { type: 'mondayTrainingPage' },
    croSections: {
      trustBadges: [PLATINUM, { label: 'Certified Training Consultants' }, FIVE_STAR],
      trustBadgesTheme: 'light',
      beforeAfter: {
        heading: 'Self-taught vs expert-led training',
        beforeLabel: 'Unstructured self-taught',
        afterLabel: 'Expert-led training',
        rows: [
          { before: 'Slower workflows and missed deadlines', after: 'Standardized processes' },
          { before: 'Board clutter and confusion', after: 'Instant team alignment' },
          { before: 'Inconsistent reporting', after: 'Clear, reliable reporting' },
        ],
      },
      threeStep: {
        heading: 'Tailored team onboarding for every layer of your organization',
        steps: [
          { number: '01', title: 'Leadership & Executive Dashboards', description: 'High-level data views for decision makers.' },
          { number: '02', title: 'Project Managers & Workflow Architects', description: 'Hands-on workflow and automation design.' },
          { number: '03', title: 'Daily End-Users & Team Members', description: 'Practical execution training for adoption.' },
        ],
      },
      microCaseStudies: {
        heading: 'Training that delivers ROI',
        cases: [
          {
            challenge: 'A 60-person agency rolling out monday.com with no structured framework.',
            solution: 'Expert-led, role-based onboarding across leadership, PMs and end-users in two weeks.',
            impact: 'Reduced initial project kickoff delays and drove fast adoption.',
            metric: '35%',
            metricLabel: 'fewer kickoff delays',
          },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Book a FREE training consultation',
        subheading: 'Tell us your team size and current workflows — we will recommend the right training track.',
        source: 'monday-training',
        submitLabel: 'Book a FREE Training Consultation',
        successMessage: "Thanks — a certified training consultant will reach out within one business day.",
        fields: [
          { label: 'Team size', type: 'text', required: false },
          { label: 'Preferred format', type: 'select', options: ['Self-Paced Hybrid', 'Live Bootcamp', 'Custom Enterprise Track'], required: false },
        ],
      },
      stickyCtaLabel: 'Book a FREE Training Consultation',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── make-partners (singleton) ────────────────────────────────────────────
  {
    name: 'make-partners',
    locator: { type: 'makePartnersPage' },
    croSections: {
      trustBadges: [
        { label: 'Certified Make.com Consulting Partner' },
        { label: 'monday.com Advanced Delivery Partner' },
        { label: '5/5 Star Rated Implementation Agency' },
      ],
      trustBadgesTheme: 'light',
      beforeAfter: {
        heading: 'Native limits vs Make.com capability',
        beforeLabel: 'Rigid native blocks',
        afterLabel: 'Make.com scenarios',
        rows: [
          { before: 'Single-trigger actions, locked data payloads', after: 'Multi-branch routers and custom data formatting' },
          { before: 'No custom scripting', after: 'Custom JavaScript functions for precise data parsing' },
          { before: 'Delayed polling cycles', after: 'Advanced webhooks for instant board updates' },
        ],
      },
      statBanner: {
        statement: 'Stop paying for every single step. Make.com bundles actions into multi-step scenarios, slashing monthly software middleware expenses by up to 70% as your operations scale. We build automated fallback scenarios and custom error logs into every Make script — if an external API goes down, your data is securely queued, never dropped.',
        theme: 'dark',
        metrics: [
          { value: '70%', text: 'lower middleware spend' },
          { value: '2,000+', text: 'apps connected' },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Scope your automation architecture',
        subheading: 'Tell us what systems you need to bridge and your monthly data volume.',
        source: 'make-partners',
        submitLabel: 'Request a System Integration Blueprint',
        successMessage: "Thanks — an automation architect will reach out within one business day.",
        fields: [
          { label: 'What systems do you need to bridge?', type: 'text', required: false },
          { label: 'Estimated monthly data sync volume', type: 'text', required: false },
        ],
      },
      stickyCtaLabel: 'Request an Integration Blueprint',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── n8n-integration-partner (partnershipPage) ────────────────────────────
  {
    name: 'n8n-integration-partner',
    locator: { type: 'partnershipPage', slug: 'n8n-integration-partner' },
    croSections: {
      trustBadges: [
        { label: 'Certified n8n Integration Partner' },
        { label: 'monday.com Advanced Delivery Partner' },
        { label: '5/5 Star Rated Implementation Agency' },
      ],
      trustBadgesTheme: 'light',
      beforeAfter: {
        heading: 'Native limits vs n8n capabilities',
        beforeLabel: 'Native limits',
        afterLabel: 'n8n capabilities',
        rows: [
          { before: 'Basic recipes, single-trigger actions', after: 'Advanced cross-board logic and conditional branching' },
          { before: 'Locked data payloads', after: 'Custom JavaScript data transformation' },
          { before: 'No multi-app syncing', after: 'Multi-app syncing across your entire stack' },
        ],
      },
      threeStep: {
        heading: 'Technical automation blueprint',
        steps: [
          { number: '01', title: 'Work OS & Process Audit', description: 'Map current workflows and integration gaps.' },
          { number: '02', title: 'Custom n8n Workflow Development', description: 'Build advanced webhooks, JSON transforms and cross-board sync.' },
          { number: '03', title: 'Deployment & Continuous Optimization', description: 'End-to-end validation, sync testing and team empowerment.' },
        ],
      },
      statBanner: {
        statement: 'Reclaim 10+ hours per week. Eliminate manual board maintenance and build an intelligent, real-time single source of truth for your teams. Unlike alternative integration tools that meter every task, n8n charges only for full workflow executions — saving you thousands as you scale.',
        theme: 'dark',
        metrics: [
          { value: '10+ hrs', text: 'reclaimed per week' },
          { value: 'Cloud / Self-Hosted', text: 'flexible hosting' },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Scope your integration',
        subheading: 'Tell us what you need to sync with monday.com and your current automation volume.',
        source: 'n8n-integration-partner',
        submitLabel: 'Request a Technical Architecture Assessment',
        successMessage: "Thanks — a technical architect will reach out within one business day.",
        fields: [
          { label: 'What apps do you need to sync with monday.com?', type: 'text', required: false },
          { label: 'Current monthly automation volume', type: 'text', required: false },
          { label: 'Hosting preference', type: 'select', options: ['n8n Cloud', 'Self-Hosted', 'Not sure'], required: false },
        ],
      },
      stickyCtaLabel: 'Request a Technical Assessment',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── about-us (page) ──────────────────────────────────────────────────────
  {
    name: 'about-us',
    locator: { type: 'page', slug: 'about-us' },
    croSections: {
      trustBadges: [
        { label: 'monday.com Platinum Partner' },
        { label: 'Advanced Delivery Accredited Agency' },
        { label: 'Founded by ex-monday.com experts' },
      ],
      trustBadgesTheme: 'light',
      statBanner: {
        statement: "We don't just configure software; we build custom engines for growth. As a premier monday.com Platinum Partner, Fruition bridges the gap between chaotic workflows and streamlined, automated scale.",
        theme: 'dark',
      },
      leadForm: {
        enabled: true,
        heading: "Let's build your workspace engine",
        subheading: 'Tell us about your current tech stack and team size — we will map the next step.',
        source: 'about-us',
        submitLabel: 'Partner with a Certified Platinum Team',
        successMessage: "Thanks — we'll reach out within one business day.",
        fields: [
          { label: 'Current tech stack', type: 'text', required: false },
          { label: 'Team size', type: 'text', required: false },
        ],
      },
      stickyCtaLabel: 'Partner with a Certified Platinum Team',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── customer-testimonials (page) ─────────────────────────────────────────
  {
    name: 'customer-testimonials',
    locator: { type: 'page', slug: 'customer-testimonials' },
    croSections: {
      trustBadges: [
        { label: 'Verified monday.com Marketplace Review' },
        { label: 'G2 Crowd Verified' },
        { label: 'Clutch.co Partner Review' },
      ],
      trustBadgesTheme: 'light',
      statBanner: {
        statement: 'Over 10,000+ hours of manual data entry eliminated and 150+ custom workspaces successfully deployed worldwide.',
        theme: 'dark',
        metrics: [
          { value: '10,000+', text: 'hours of manual data entry eliminated' },
          { value: '150+', text: 'custom workspaces deployed' },
        ],
      },
      microCaseStudies: {
        heading: 'Verifiable ROI',
        cases: [
          {
            challenge: 'Fragmented lead tracking across teams.',
            solution: 'Custom monday CRM setup + automated reporting.',
            impact: 'Reduced sales cycle time.',
            metric: '32%',
            metricLabel: 'shorter sales cycle',
          },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Ready to build your own success story?',
        subheading: "Let's map out a custom monday.com blueprint for your team.",
        source: 'customer-testimonials',
        submitLabel: 'Book Your Free Strategy Session',
        successMessage: "Thanks — we'll reach out within one business day to map your blueprint.",
        fields: [
          { label: 'Industry', type: 'select', options: ['Construction', 'Real Estate', 'Agency', 'IT/Software', 'Other'], required: false },
        ],
      },
      stickyCtaLabel: 'Book Your Free Strategy Session',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── monday-consulting-solutions (page) ───────────────────────────────────
  {
    name: 'monday-consulting-solutions',
    locator: { type: 'page', slug: 'monday-consulting-solutions' },
    croSections: {
      trustBadges: [PLATINUM, ADV_DELIVERY, { label: '35+ Global monday.com Experts' }],
      trustBadgesTheme: 'light',
      statBanner: {
        statement: 'Verifiable execution, not marketing fluff. Founded by ex-monday.com staff.',
        theme: 'dark',
        metrics: [
          { value: '250+', text: 'Projects completed' },
          { value: '5.0', text: 'Flawless CSAT score' },
          { value: '35+', text: 'Global monday.com experts' },
        ],
      },
      beforeAfter: {
        heading: 'Migrating from HubSpot, Salesforce, or Excel?',
        beforeLabel: 'Before',
        afterLabel: 'After',
        rows: [
          { before: 'Legacy HubSpot / Salesforce CRM silos', after: 'Unified monday Work OS' },
          { before: 'Excel data scattered across teams', after: 'End-to-end data mapping with zero downtime' },
          { before: 'Manual cross-tool busywork', after: 'Agentic pipeline automation' },
        ],
      },
      microCaseStudies: {
        heading: 'Strategic results',
        cases: [
          {
            challenge: 'A professional services firm drowning in manual sales-pipeline admin.',
            solution: 'AI-powered sales pipeline engineered on monday.com.',
            impact: 'Cut manual admin and accelerated deal flow.',
            metric: '40%',
            metricLabel: 'less manual admin',
          },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Book a time with a monday.com consultant',
        subheading: 'Tell us where the operational chaos is and we will map the fix.',
        source: 'monday-consulting-solutions',
        submitLabel: 'Book a Time',
        successMessage: "Thanks — a consultant will reach out within one business day.",
        fields: [
          { label: 'Primary focus', type: 'select', options: ['Enterprise Workflow Optimization', 'Agentic Pipeline Engineering', 'Legacy Migration', 'Other'], required: false },
        ],
      },
      stickyCtaLabel: 'Book a Time',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── fruition-team (page) ─────────────────────────────────────────────────
  {
    name: 'fruition-team',
    locator: { type: 'page', slug: 'fruition-team' },
    croSections: {
      trustBadges: [
        { label: '500+ Ecosystem Workspaces Built' },
        { label: '10,000+ Hours of Saved Manual Work' },
        { label: '100% Core Certified Team' },
      ],
      trustBadgesTheme: 'light',
      statBanner: {
        statement: 'Why top brands choose our monday workflow automation experts over generalist agencies — Fruition is a vetted, tier-one monday.com certified partner built by industry insiders.',
        theme: 'dark',
        metrics: [
          { value: '500+', text: 'Ecosystem workspaces built' },
          { value: '10,000+', text: 'Hours of saved manual work' },
          { value: '100%', text: 'Core certified team' },
        ],
      },
      leadForm: {
        enabled: true,
        heading: "Tell us your workflow bottleneck",
        subheading: "We'll pair you with the right monday.com certified partner specialist within 24 hours.",
        source: 'fruition-team',
        submitLabel: 'Pair Me With a Specialist',
        successMessage: "Thanks — we'll pair you with the right specialist within 24 hours.",
        fields: [
          { label: 'Primary focus', type: 'select', options: ['CRM Migration', 'Custom API', 'HR Workflows', 'Other'], required: false },
        ],
      },
      stickyCtaLabel: 'Book 15 Mins With a Specialist',
      stickyCtaUrl: CALENDLY,
    },
  },
]

async function resolveId(loc: Locator): Promise<string | null> {
  if ('slug' in loc) {
    return writeClient.fetch<string | null>(
      `*[_type == $type && slug.current == $slug][0]._id`,
      { type: loc.type, slug: loc.slug },
    )
  }
  return writeClient.fetch<string | null>(`*[_type == $type][0]._id`, { type: loc.type })
}

async function run() {
  console.log(`\n${DRY ? '🌵 DRY RUN — no writes' : '✍️  LIVE — patching Sanity'}\n`)
  let ok = 0
  let missing = 0

  for (const page of PAGES) {
    const id = await resolveId(page.locator)
    if (!id) {
      console.warn(`  ! ${page.name} — no ${page.locator.type} doc found — SKIPPING`)
      missing++
      continue
    }

    if (DRY) {
      console.log(`  • ${page.name}  (${id})`)
      console.log(`      croSections keys: ${Object.keys(page.croSections).join(', ')}`)
    } else {
      await writeClient.patch(id).set({ croSections: page.croSections }).commit({ autoGenerateArrayKeys: true })
      console.log(`  ✎ ${page.name}  (${id})`)
    }
    ok++
  }

  console.log(`\nDone. ${ok}/${PAGES.length} resolved${missing ? `, ${missing} missing` : ''}.\n`)
  if (missing) process.exitCode = 1
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
