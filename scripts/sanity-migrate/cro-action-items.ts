/**
 * Seed the `croSections` field (CRO action items) for the 4 pilot pages from the
 * "CRO landing page" audit. Patch-only `.set()` — never replaces docs, so all
 * other content is preserved. Copy is drafted on-brand for review in Studio.
 *
 * Dry run:  DRY=1 tsx scripts/sanity-migrate/cro-action-items.ts
 * Live:     tsx scripts/sanity-migrate/cro-action-items.ts
 */
import { writeClient } from './lib'

const DRY = !!process.env.DRY
const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'
const CRM_TOUR = 'https://www.youtube.com/watch?v=_0MhMjicbIM'

type Locator = { type: string } | { type: string; slug: string }

interface PageCro {
  name: string
  locator: Locator
  croSections: Record<string, unknown>
}

const PAGES: PageCro[] = [
  // ── implementation-packages (singleton) ──────────────────────────────────
  {
    name: 'implementation-packages',
    locator: { type: 'implementationPackagesPage' },
    croSections: {
      trustBadges: [
        { label: 'monday.com Platinum Partner', detail: 'Top 1% global tier' },
        { label: 'Advanced Delivery Accredited', detail: 'Certified delivery agency' },
        { label: '5.0 CSAT', detail: 'Flawless client satisfaction' },
        { label: '35+ monday.com Experts', detail: 'Certified consultants worldwide' },
      ],
      trustBadgesTheme: 'light',
      roiCalc: {
        enabled: true,
        heading: 'Calculate your monday.com automation savings',
        subheading: 'See how much time and money the right implementation reclaims for your team.',
        defaultTeamSize: 12,
        defaultHoursPerWeek: 6,
        hourlyRate: 50,
        reclaimRate: 0.7,
        currencySymbol: '$',
      },
      statBanner: {
        statement: 'Verifiable execution, not marketing fluff.',
        theme: 'dark',
        metrics: [
          { value: '250+', text: 'Projects completed' },
          { value: '5.0', text: 'Flawless CSAT score' },
          { value: '35+', text: 'Global monday.com experts' },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Book your free 15-minute workflow audit',
        subheading: 'Tell us where the drag is and we will map the highest-leverage automation for your team.',
        source: 'implementation-packages',
        submitLabel: 'Book our Free 15-Minute Workflow Audit',
        successMessage: "Thanks — we'll reach out within one business day to schedule your audit.",
        fields: [
          { label: 'Team size', type: 'text', required: false },
          { label: 'Biggest operational bottleneck', type: 'textarea', required: false },
        ],
      },
      stickyCtaLabel: 'Book a Free Workflow Audit',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── monday-crm-consulting (servicePage) ──────────────────────────────────
  {
    name: 'monday-crm-consulting',
    locator: { type: 'servicePage', slug: 'monday-crm-consulting' },
    croSections: {
      trustBadges: [
        { label: 'monday.com Certified Platinum Partner' },
        { label: 'Advanced Delivery Accredited' },
        { label: 'SOC 2 Type II', detail: 'Compliant' },
        { label: 'GDPR Ready' },
        { label: '5/5 Rated Implementation Agency' },
      ],
      trustBadgesTheme: 'light',
      dualCtaSecondaryLabel: 'Watch the 2-min CRM tour',
      dualCtaSecondaryUrl: CRM_TOUR,
      beforeAfter: {
        heading: 'From messy spreadsheets to a real-time CRM',
        beforeLabel: 'Before',
        afterLabel: 'After',
        rows: [
          { before: 'Manual data entry and copy-paste between tools', after: 'Automatic lead scoring and data capture' },
          { before: 'Blind forecasting from stale spreadsheets', after: 'Real-time executive dashboards' },
          { before: 'Siloed, scattered client communication', after: 'Unified client history in one Work OS' },
        ],
      },
      microCaseStudies: {
        heading: 'Results our CRM clients see',
        cases: [
          {
            challenge: 'Fragmented lead tracking across disconnected teams.',
            solution: 'Custom monday CRM setup with automated lead scoring and reporting.',
            impact: 'Reduced sales-cycle duration and automated thousands of monthly tasks.',
            metric: '32%',
            metricLabel: 'shorter sales cycle',
          },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Book a free CRM discovery call',
        subheading: 'Response within 1 business day · NDAs available on request · Speak directly with a Senior Solutions Architect.',
        source: 'monday-crm-consulting',
        submitLabel: 'Book a Free Discovery Call',
        successMessage: "Thanks — a Senior Solutions Architect will reach out within one business day.",
        fields: [
          { label: 'Primary CRM bottleneck', type: 'select', options: ['Lead Routing', 'Forecasting', 'ERP Integration', 'Other'], required: false },
        ],
      },
      stickyCtaLabel: 'Book a Free Discovery Call',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── monday-consulting-partner (partnershipPage) ──────────────────────────
  {
    name: 'monday-consulting-partner',
    locator: { type: 'partnershipPage', slug: 'monday-consulting-partner' },
    croSections: {
      trustBadges: [
        { label: 'monday.com Certified Platinum Partner' },
        { label: 'Advanced Delivery Accredited Agency' },
        { label: '100% Certified Consultants' },
        { label: '5/5 Rated' },
      ],
      trustBadgesTheme: 'light',
      symptomsChecklist: {
        heading: 'Symptoms of an unoptimized workspace',
        subheading: 'If any of these sound familiar, your team is ready for a workflow optimization engagement.',
        items: [
          { text: 'Your teams are still drowning in manual status updates' },
          { text: 'Your data is scattered across duplicate, disconnected boards' },
          { text: 'You are hitting native automation limits and breaking workflows' },
        ],
      },
      threeStep: {
        heading: 'Your consulting ROI blueprint',
        steps: [
          { number: '01', title: 'Diagnostic & Audit', description: 'Mapping out data bottlenecks and tool overlaps.' },
          { number: '02', title: 'Custom Architecture', description: 'Building master dashboards and deep integrations.' },
          { number: '03', title: 'Change Management', description: 'Interactive team training to ensure full system adoption.' },
        ],
      },
      statBanner: {
        statement: "Stop overpaying for fragmented software ecosystems. We don't just organize boards — we centralize your CRM, project management, and tech stack into a single Work OS, slashing tool redundancies by up to 40%.",
        theme: 'dark',
      },
      microCaseStudies: {
        heading: 'Enterprise trust snapshot',
        cases: [
          {
            challenge: 'A mid-market enterprise losing 20+ hours per week to administrative work.',
            solution: "Fruition's consulting services plus a scalable, multi-board executive dashboard system.",
            impact: 'Eliminated administrative drag and unified reporting across business units.',
            metric: '20+ hrs',
            metricLabel: 'saved per week',
          },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Audit my workspace',
        subheading: 'Tell us about your current setup and we will return a costed workflow audit.',
        source: 'monday-consulting-partner',
        submitLabel: 'Request a Comprehensive Workflow Audit',
        successMessage: "Thanks — we'll be in touch within one business day with next steps.",
        fields: [
          { label: 'Current user seat count', type: 'text', required: false },
          { label: 'Primary operational bottleneck', type: 'select', options: ['Scaling boards', 'Integrations', 'Training', 'Other'], required: false },
        ],
      },
      stickyCtaLabel: 'Book a Consultation',
      stickyCtaUrl: CALENDLY,
    },
  },

  // ── monday-partner-us (locationPage) ─────────────────────────────────────
  {
    name: 'monday-partner-us',
    locator: { type: 'locationPage', slug: 'monday-partner-us' },
    croSections: {
      trustBadges: [
        { label: 'monday.com Platinum Partner' },
        { label: 'Advanced Delivery Accredited Agency' },
        { label: 'Founded by ex-monday.com experts' },
        { label: 'US-based solutions architects' },
      ],
      trustBadgesTheme: 'light',
      threeStep: {
        heading: 'Our 3-step implementation framework',
        steps: [
          { number: '01', title: 'Discovery & Process Mapping', description: 'Audit current workflows and identify the highest-leverage opportunities.' },
          { number: '02', title: 'Architecture & Solution Design', description: 'Build bespoke boards, automations, and integrations tailored to your stack.' },
          { number: '03', title: 'Change Management & Team Adoption', description: 'Hands-on, role-based onboarding to guarantee day-one adoption.' },
        ],
      },
      statBanner: {
        statement: 'Our clients achieve over 10x ROI and save an average of 500+ hours of manual data tracking yearly through custom automations.',
        theme: 'dark',
        metrics: [
          { value: '500+ hrs', text: 'saved per year' },
          { value: '10x', text: 'average ROI' },
        ],
      },
      leadForm: {
        enabled: true,
        heading: 'Schedule a 30-minute scope assessment with a US solutions architect',
        subheading: 'Localized support in your time zone. No high-pressure sales — just a clear roadmap.',
        source: 'monday-partner-us',
        submitLabel: 'Schedule a Scope Assessment',
        successMessage: "Thanks — a US-based solutions architect will reach out within one business day.",
        fields: [
          { label: 'Primary project type', type: 'select', options: ['Construction Project Management', 'Manufacturing Workflows', 'Professional Services CRM', 'Other'], required: false },
        ],
      },
      stickyCtaLabel: 'Book a US Consultation',
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
