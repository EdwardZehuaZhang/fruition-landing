/**
 * Populate Sanity fields for the monday-for-finance solutionPage doc
 * so the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — re-running patches the existing doc; fields already set in
 * Sanity Studio are preserved (we use setIfMissing for everything).
 *
 *   pnpm tsx scripts/sanity-migrate/monday-for-finance.ts
 */
import { writeClient, withKeys } from './lib'

const SLUG = 'monday-for-finance'
const TYPE = 'solutionPage'

const WHY_MONDAY_ITEMS = [
  {
    icon: '🎨',
    title: 'User-friendly UI',
    description:
      'The user-friendly, drag-and-drop interface ensures a smooth learning curve, enabling teams to quickly adapt and manage projects effectively.',
  },
  {
    icon: '🔧',
    title: 'Versatile Capabilities',
    description:
      'Highly customisable dashboards provide a comprehensive overview of project metrics, including KPIs, timelines, and budget tracking, ensuring critical information is readily accessible.',
  },
  {
    icon: '⚙️',
    title: 'Process Optimisation',
    description:
      'Maximise efficiency, minimise roadblocks, and empower your team to do their best work.',
  },
  {
    icon: '🤖',
    title: 'Automation Tools',
    description:
      'Routine tasks such as status updates, notifications, and task assignments can be automated, freeing up valuable time for strategic planning and problem-solving.',
  },
  {
    icon: '💰',
    title: 'Cost Reduction',
    description:
      'If you want to reduce costs and perform cost benefit analyses without a certified genius on your team, you need a reliable platform like monday work management to help you out.',
  },
  {
    icon: '🚀',
    title: 'Efficient Team Systems',
    description:
      'With integration capabilities for tools like Slack, Zoom, and Microsoft Teams, Monday fosters a collaborative environment where team members can communicate, share files, and provide real-time updates, enhancing remote work efficiency.',
  },
]

const FEATURES_ITEMS = [
  {
    icon: '📄',
    title: 'Invoice Generation and Management',
    description:
      'Generate custom financial documents to manage client transactions more efficiently with monday.com. monday allows accounting firms to automate and manage invoicing processes efficiently, ensuring timely billing and payment tracking.',
  },
  {
    icon: '📊',
    title: 'Spreadsheet and Timesheet Functionality',
    description:
      'The platform’s spreadsheet-like interface allows users to create detailed financial spreadsheets, facilitating seamless expense tracking and budget management. And with monday.com’s timesheet functionality, you can reduce redundancy in payroll processing and ensure consistent invoice and paycheck automations.',
  },
  {
    icon: '🏢',
    title: 'Multi-Account Accessibility',
    description:
      'monday.com supports the management of several accounts, allowing firms to maintain distinct workspaces for different client types or projects. This feature ensures organised and compartmentalised handling of client data and tasks.',
  },
  {
    icon: '🔗',
    title: 'App Integrations',
    description:
      'Can monday integrate with Xero? Yes. Save time by automating your CRM and sales invoicing process with a monday.com and Xero integration.\n\nIs monday.com compatible with Excel? Yes. Import and export data to and from Excel for easier data management.',
  },
]

const HOW_WE_HELP_ITEMS = [
  {
    title: 'Finance Process Mapping',
    description:
      'Assess your financial needs and goals to understand what you want to achieve with a CRM system. By clearly understanding your requirements, we can align monday.com’s features with your specific needs.',
  },
  {
    title: 'Finance Solution Design',
    description:
      'Conduct comprehensive research to compare different Finance systems, including monday.com. Consider factors like pricing, features, and integrations, ensuring that monday.com is the ideal fit for your finance needs.',
  },
  {
    title: 'Seamless Implementation',
    description:
      'Once monday.com is selected, configure the system to match your unique requirements. Set up custom workflows, automations, and permissions to ensure monday.com aligns perfectly with your financial processes.\n\nSmooth Data Migration: If you have existing data, your valuable data must be accurately transferred, ensuring a seamless continuity of your financial activities.\n\nExpert Training: It is important to provide training to your team, equipping them with the knowledge and skills they need to use monday.com effectively.',
  },
  {
    title: 'Adoption & Training',
    description:
      'Once configured and trained, it’s time to roll out monday.com to your team.',
  },
  {
    title: 'Ongoing Support',
    description:
      'Remember to continuously monitor its performance and evaluate its effectiveness in meeting your financial goals.',
  },
]

const COMPARISON_TABS_FULL = [
  {
    label: 'Why monday.com for Finance & Accounting',
    subheading: 'Why Choose monday.com for Finance & Accounting?',
    items: withKeys(WHY_MONDAY_ITEMS),
  },
  {
    label: 'Finance & Accounting Features',
    subheading: 'Key monday.com Finance & Accounting Features',
    items: withKeys(FEATURES_ITEMS),
  },
  {
    label: 'How We Can Help',
    subheading: 'How We Can Help',
    items: withKeys(HOW_WE_HELP_ITEMS),
  },
]

const FINANCE_FEATURE_CARDS = [
  { emoji: '📊', title: 'Budget Planning and Tracking', description: 'Create budget boards and automate recurring financial tasks. Track expenses in real-time, monitor department budgets, and ensure accurate goal achievement through comprehensive budget management.' },
  { emoji: '💳', title: 'Expense Management', description: 'Streamline expense tracking with automated workflows and digital receipt management. Control business spending, categorise expenses efficiently, and maintain detailed records for better financial oversight across departments.' },
  { emoji: '📈', title: 'Financial Reporting', description: 'Generate comprehensive financial reports with visual dashboards and customisable templates. Present complex data in digestible formats and deliver actionable insights for informed decision-making and stakeholder communication.' },
  { emoji: '🧾', title: 'Invoicing & Billing', description: 'Simplify invoice creation with automated billing workflows and customisable templates. Track payment statuses, manage client billing cycles, and reduce manual errors while ensuring timely payment collection.' },
  { emoji: '💰', title: 'Cashflow Management', description: 'Monitor cash inflows and outflows with real-time tracking and predictive analytics. Anticipate cash flow gaps, manage payment schedules, and maintain optimal liquidity for sustained business operations.' },
  { emoji: '✅', title: 'Financial Compliance', description: 'Ensure adherence to financial regulations through automated compliance tracking. Maintain audit trails, monitor regulatory requirements, and implement standardised processes for risk mitigation and compliance management.' },
  { emoji: '🔮', title: 'Financial Forecasting', description: 'Create accurate financial projections using historical data and scenario modeling. Assess potential outcomes, plan strategic investments, and make data-driven decisions while minimising risks and maximising opportunities.' },
  { emoji: '⚙️', title: 'Integrations & Automations', description: 'Sync financial data across platforms with seamless integrations and automated workflows. Eliminate manual data entry, connect accounting systems, and streamline processes for improved accuracy.' },
  { emoji: '💬', title: 'Collaboration & Communication', description: 'Enhance team collaboration with shared financial dashboards and real-time updates. Facilitate cross-department communication and maintain alignment on financial goals and objectives across your organisation.' },
]

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  // Replace comparisonTabs with the full version that includes per-tab
  // subheadings + icons on items. Existing tabs lack those fields.
  await writeClient
    .patch(existing._id)
    .set({
      comparisonTabs: withKeys(COMPARISON_TABS_FULL),
      financeFeatureCards: withKeys(FINANCE_FEATURE_CARDS),
    })
    .setIfMissing({
      comparisonHeading: 'monday.com for',
      comparisonHeadingAccent: 'Finance & Accounting',
      heroVideoUrl: 'https://www.youtube.com/watch?v=7vtrtlfC1Zg',
      heroVideoTitle: 'monday for Finance & Accounting',
      logoCloudHeadingPart1: 'Clients who have used our ',
      logoCloudHeadingAccent: 'monday.com consulting services',
      calendlyHeading:
        'Schedule A 30-Min Consultation With One of Our monday.com Consultants',
      faqHeading: 'Frequently asked questions',
      bottomVideoUrl: 'https://www.youtube.com/watch?v=g83dt0bCG4I',
      bottomVideoTitle: 'Why monday.com is loved by Finance Teams',
      bottomFeatureSectionHeadingPart1: 'Reasons Why Monday.com is Loved by',
      bottomFeatureSectionHeadingAccent: 'Finance Teams',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
