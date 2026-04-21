/**
 * Seed / update the monday-for-hr solution page in Sanity.
 *
 * - Uploads a local hero image (absolute path, outside /public)
 * - Sets hero + bottom YouTube embeds
 * - Hides testimonials / discover / join-stats / testimonial-banner
 * - Replaces comparison tabs with Hiring + HR Operations
 * - Adds Supporting-Each-Stage-of-Your-HR-Life-Cycle methodology steps
 * - Replaces capabilities grid with "Why monday.com is the perfect fit for
 *   People and Culture Teams" (10 cards)
 */
import * as fs from 'fs'
import * as path from 'path'
import { writeClient, withKeys } from './lib'

const HERO_IMAGE_ABS = '/Users/gel/Desktop/a280a5_a0a65ea1608d481a87adf666cbd18798~mv2.avif'

async function uploadAbsoluteImage(absPath: string) {
  if (!fs.existsSync(absPath)) {
    throw new Error(`Image not found: ${absPath}`)
  }
  const filename = path.basename(absPath)
  const buffer = fs.readFileSync(absPath)
  console.log(`  ↑ uploading ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`)
  const asset = await writeClient.assets.upload('image', buffer, { filename })
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: asset._id },
  }
}

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "solutionPage" && slug.current == "monday-for-hr"][0]{_id}`
  )
  if (!existing?._id) {
    throw new Error('solutionPage with slug "monday-for-hr" not found')
  }

  const heroImage = await uploadAbsoluteImage(HERO_IMAGE_ABS)

  /* ----------------------------- Comparison tabs ---------------------- */
  const hiringItems = withKeys([
    { _type: 'comparisonItem', number: '01', title: 'ATS recruitment workflows including Forms', description: 'Capture candidates in branded monday forms, auto-route applications into pipeline boards, and keep hiring managers aligned on every requisition.' },
    { _type: 'comparisonItem', number: '02', title: 'Onboarding checklists', description: 'Trigger role-specific onboarding plans the moment an offer is accepted — equipment, training, and first-week milestones all tracked in one place.' },
    { _type: 'comparisonItem', number: '03', title: 'Contracting document creation', description: 'Generate offer letters and contracts with merged candidate data, approvals, and e-sign integrations baked into the workflow.' },
    { _type: 'comparisonItem', number: '04', title: 'Talent Pool / Contractor Management', description: 'Keep silver-medallists, alumni, and contractors warm with segmented talent pools, availability tracking, and re-engagement automations.' },
    { _type: 'comparisonItem', number: '05', title: '“monday.com is voted Best Drag-and-Drop Solution by Forbes”', description: 'Give your people team a platform recognised for how fast it bends to how you actually hire.' },
  ])

  const hrOpsItems = withKeys([
    { _type: 'comparisonItem', number: '01', title: 'Email / inbox ticketing', description: 'Turn people@ and hr@ inboxes into structured tickets with owners, SLAs, and status visibility for every employee request.' },
    { _type: 'comparisonItem', number: '02', title: 'OHS Policy and Operations', description: 'Centralise WHS/OHS incident logs, policy acknowledgements, and corrective-action workflows with built-in audit trails.' },
    { _type: 'comparisonItem', number: '03', title: 'Budgeting & Headcount Planning', description: 'Model headcount and people-cost budgets alongside actuals, with roll-ups from department boards into a single source of truth.' },
    { _type: 'comparisonItem', number: '04', title: 'HR Project Management', description: 'Run engagement, compliance, and transformation initiatives like real programs — dependencies, owners, and portfolio-level dashboards.' },
    { _type: 'comparisonItem', number: '05', title: 'Leave Management', description: 'Self-service leave requests with approval chains, balances, and calendar views so managers see coverage at a glance.' },
    { _type: 'comparisonItem', number: '06', title: 'Scheduling', description: 'Roster shifts, interviews, and training sessions with conflict detection and automated calendar invites for every stakeholder.' },
    { _type: 'comparisonItem', number: '07', title: 'Organisational Charts', description: 'Auto-generated org charts that update as reporting lines change, with drill-downs into roles, tenure, and team structure.' },
  ])

  const comparisonTabs = withKeys([
    { _type: 'comparisonTab', label: 'Hiring', items: hiringItems },
    { _type: 'comparisonTab', label: 'HR Operations', items: hrOpsItems },
  ])

  /* ---------------------- HR lifecycle methodology -------------------- */
  const methodologySteps = withKeys([
    {
      _type: 'methodologyStep',
      number: '01',
      title: 'Needs Assessment 🎯',
      description:
        'Assess your HR needs and goals to understand what you want to achieve with an HRIS. By clearly understanding your requirements, we can align the system’s features with your specific needs.',
    },
    {
      _type: 'methodologyStep',
      number: '02',
      title: 'Thorough Research 🔍',
      description:
        'Conduct comprehensive research to compare different HRIS options. Consider factors like pricing, features, and integrations, ensuring that the chosen system is the ideal fit for your HR needs.',
    },
    {
      _type: 'methodologyStep',
      number: '03',
      title: 'Seamless Configuration ⚙️',
      description:
        "Once the HRIS is selected, configure the system to match your unique requirements. Set up custom workflows, automations, and permissions to ensure the HRIS aligns perfectly with your HR processes.",
    },
    {
      _type: 'methodologyStep',
      number: '04',
      title: 'System Rollout 🚀',
      description: "Once configured and trained, it’s time to roll out the HRIS to your team.",
    },
    {
      _type: 'methodologyStep',
      number: '05',
      title: 'Post-Implementation Support 📈',
      description:
        'Ongoing enablement, change management, and optimisation keep the platform delivering value long after go-live — historical data continuously improves future HR initiatives.',
    },
  ])

  /* ------------------- Why monday.com fits P&C (10 cards) ------------- */
  const capabilitiesCards = withKeys([
    { _type: 'capabilityCard', emoji: '🚀', title: 'Streamlined Employee Onboarding', description: 'Create customised workflows to ensure a smooth transition for new hires, track tasks, and monitor progress.' },
    { _type: 'capabilityCard', emoji: '📂', title: 'HR Document Management', description: 'Securely store, access, and share important HR information across your organisation.' },
    { _type: 'capabilityCard', emoji: '🏖️', title: 'Vacation and Leave Tracking', description: 'Keep track of employee vacations, leaves, and time off effortlessly.' },
    { _type: 'capabilityCard', emoji: '🎯', title: 'Performance Management', description: 'Set objectives, monitor progress, and facilitate constructive conversations to support employee growth and development.' },
    { _type: 'capabilityCard', emoji: '👥', title: 'Employee Database', description: 'Consolidate all employee information in one place.' },
    { _type: 'capabilityCard', emoji: '📚', title: 'Training and Development', description: 'Manage employee training programs and professional development initiatives.' },
    { _type: 'capabilityCard', emoji: '📝', title: 'Employee Surveys and Feedback', description: 'Utilise custom forms and surveys to collect valuable insights and improve the employee experience.' },
    { _type: 'capabilityCard', emoji: '🏆', title: 'Employee Recognition and Rewards', description: 'Create a culture of appreciation and recognition within your organisation.' },
    { _type: 'capabilityCard', emoji: '📋', title: 'Compliance and Policy Management', description: 'Stay organised, track policy updates, and ensure adherence to regulations.' },
    { _type: 'capabilityCard', emoji: '🔌', title: 'Integration Power', description: 'Seamlessly integrate your HR tools and software to sync data and streamline HR processes.' },
  ])

  /* ------------------------------ Patch doc --------------------------- */
  console.log(`  ✎ patching solutionPage:${existing._id}`)
  await writeClient
    .patch(existing._id)
    .set({
      // Hero
      heroImage,
      heroVideoUrl: 'https://www.youtube.com/watch?v=7vtrtlfC1Zg',
      heroVideoTitle: 'monday.com for HR',

      // Hide sections
      hideTestimonialsSection: true,
      hideDiscoverSection: true,
      hideJoinStatsSection: true,
      hideTestimonialBanner: true,

      // Comparison tabs
      comparisonHeading: 'Our monday consulting expertise',
      comparisonSubheading:
        'Streamline your HR operations and strategic management systems with monday.com; through intelligent automation and OKRs tracking, you can enhance your entire employee lifecycle — from strategic workforce planning and onboarding to day-to-day operations like request management through forms, engagement surveys, and collaborative portals. Seamlessly connect strategy to execution across contract administration, performance initiatives, and every phase of your employees’ journey from hire to retire.',
      comparisonTheme: 'light',
      comparisonTabs,

      // Methodology
      methodologyHeading: 'Supporting Each Stage of Your HR Life Cycle',
      methodologySteps,

      // Capabilities grid
      capabilitiesEyebrow: 'PEOPLE & CULTURE',
      capabilitiesHeading: 'Why monday.com is the perfect fit for ',
      capabilitiesHeadingAccent: 'People and Culture Teams',
      capabilitiesSubheading:
        'Ten ways monday.com gives HR leaders one connected platform for every stage of the employee journey.',
      capabilitiesTheme: 'light',
      capabilitiesColumns: 3,
      capabilitiesCards,
      capabilitiesCtaLabel: 'Schedule a Meeting',
      capabilitiesCtaUrl: 'https://calendly.com/global-calendar-fruitionservices',

      // Bottom video
      bottomVideoUrl: 'https://www.youtube.com/watch?v=1-A68Tub_k8',
      bottomVideoTitle: 'monday.com for People & Culture Teams',
    })
    .commit()

  console.log('✓ monday-for-hr seeded')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
