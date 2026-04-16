import { writeClient } from './sanity-client'

const industryTabs = [
  {
    _key: 'ind-1', _type: 'industryTab',
    label: 'Construction',
    title: 'Construction Projects',
    description: 'Have a monday.com partner set up a project management system for your construction projects that adapts as timelines and resources shift. Instead of juggling spreadsheets and missed deadlines, you\u2019ll keep every contractor, supplier, and milestone on track from day one.',
    benefits: [
      { _key: 'b1', _type: 'benefit', emoji: '\uD83D\uDCCA', text: 'Gantt charts with task dependencies' },
      { _key: 'b2', _type: 'benefit', emoji: '\uD83D\uDC77', text: 'Real-time resource allocation' },
      { _key: 'b3', _type: 'benefit', emoji: '\uD83D\uDCF1', text: 'On-site progress tracking (mobile app)' },
      { _key: 'b4', _type: 'benefit', emoji: '\uD83D\uDCC2', text: 'Document and blueprint version control' },
      { _key: 'b5', _type: 'benefit', emoji: '\uD83E\uDD1D', text: 'Contractor and vendor collaboration' },
      { _key: 'b6', _type: 'benefit', emoji: '\u23F0', text: 'Automated milestone reminders' },
      { _key: 'b7', _type: 'benefit', emoji: '\uD83D\uDCB0', text: 'Budget and expense tracking dashboards' },
    ],
  },
  {
    _key: 'ind-2', _type: 'industryTab',
    label: 'Manufacturing',
    title: 'Manufacturing Operations',
    description: 'Use monday.com for project management to streamline production planning, resource allocation, and quality control. Instead of struggling with disconnected tools, your team can monitor workflows, track progress, and resolve bottlenecks in real time.',
    benefits: [
      { _key: 'b1', _type: 'benefit', emoji: '\uD83D\uDDD3\uFE0F', text: 'Production scheduling boards' },
      { _key: 'b2', _type: 'benefit', emoji: '\uD83D\uDCE6', text: 'Automated inventory management' },
      { _key: 'b3', _type: 'benefit', emoji: '\u2705', text: 'Quality control workflows' },
      { _key: 'b4', _type: 'benefit', emoji: '\uD83D\uDD0E', text: 'Supply chain visibility dashboards' },
      { _key: 'b5', _type: 'benefit', emoji: '\uD83D\uDEE0\uFE0F', text: 'Equipment maintenance tracking' },
      { _key: 'b6', _type: 'benefit', emoji: '\uD83D\uDCC9', text: 'Real-time capacity planning' },
      { _key: 'b7', _type: 'benefit', emoji: '\uD83D\uDD17', text: 'Integration with ERP systems' },
    ],
  },
  {
    _key: 'ind-3', _type: 'industryTab',
    label: 'Retail',
    title: 'Retail Management',
    description: 'Manage retail operations and store rollouts with monday.com project management workflows that scale with seasonal demand. Rather than wasting weeks coordinating promotions and supply chains, you\u2019ll launch campaigns and restocks faster, with full visibility.',
    benefits: [
      { _key: 'b1', _type: 'benefit', emoji: '\uD83C\uDFEC', text: 'Store launch and rollout tracking' },
      { _key: 'b2', _type: 'benefit', emoji: '\uD83C\uDFAF', text: 'Seasonal campaign management' },
      { _key: 'b3', _type: 'benefit', emoji: '\uD83D\uDD14', text: 'Automated reorder alerts' },
      { _key: 'b4', _type: 'benefit', emoji: '\uD83D\uDCCA', text: 'Unified supply chain dashboards' },
      { _key: 'b5', _type: 'benefit', emoji: '\uD83D\uDCC5', text: 'Shift and staff scheduling boards' },
      { _key: 'b6', _type: 'benefit', emoji: '\uD83D\uDECD\uFE0F', text: 'Vendor and supplier coordination' },
      { _key: 'b7', _type: 'benefit', emoji: '\uD83D\uDDD3\uFE0F', text: 'Sales and promotions calendar' },
    ],
  },
  {
    _key: 'ind-4', _type: 'industryTab',
    label: 'Professional Services',
    title: 'Professional Services',
    description: 'Deliver projects on time and on budget with monday.com for professional services. Instead of chasing updates across emails and spreadsheets, you\u2019ll centralize client communication, resource planning, and task tracking in one place.',
    benefits: [
      { _key: 'b1', _type: 'benefit', emoji: '\uD83D\uDC4B', text: 'Client onboarding workflows' },
      { _key: 'b2', _type: 'benefit', emoji: '\u23F1\uFE0F', text: 'Billable time tracking' },
      { _key: 'b3', _type: 'benefit', emoji: '\u2696\uFE0F', text: 'Resource and workload balancing' },
      { _key: 'b4', _type: 'benefit', emoji: '\uD83D\uDCAC', text: 'Centralized client communication hub' },
      { _key: 'b5', _type: 'benefit', emoji: '\uD83E\uDDFE', text: 'Automated invoice generation' },
      { _key: 'b6', _type: 'benefit', emoji: '\uD83D\uDCC8', text: 'Project profitability dashboards' },
      { _key: 'b7', _type: 'benefit', emoji: '\uD83D\uDD14', text: 'Task and deadline reminders' },
    ],
  },
  {
    _key: 'ind-5', _type: 'industryTab',
    label: 'Government',
    title: 'Public Sector',
    description: 'Adopt monday.com project management to improve transparency and accountability across government initiatives. Rather than battling siloed systems, your teams will coordinate projects, track compliance, and share real-time progress with stakeholders.',
    benefits: [
      { _key: 'b1', _type: 'benefit', emoji: '\uD83D\uDD8A\uFE0F', text: 'Compliance tracking workflows' },
      { _key: 'b2', _type: 'benefit', emoji: '\uD83D\uDC65', text: 'Multi-stakeholder collaboration hub' },
      { _key: 'b3', _type: 'benefit', emoji: '\uD83D\uDD10', text: 'Secure document management' },
      { _key: 'b4', _type: 'benefit', emoji: '\uD83D\uDCB5', text: 'Grant and budget allocation tracking' },
      { _key: 'b5', _type: 'benefit', emoji: '\uD83D\uDCCA', text: 'Public reporting dashboards' },
      { _key: 'b6', _type: 'benefit', emoji: '\u2705', text: 'Automated approval workflows' },
      { _key: 'b7', _type: 'benefit', emoji: '\u26A0\uFE0F', text: 'Risk and issue tracking system' },
    ],
  },
  {
    _key: 'ind-6', _type: 'industryTab',
    label: 'Marketing & Creative',
    title: 'Marketing & Creative Teams',
    description: 'Use monday.com for marketing project management to manage campaigns, content production, and creative workflows. Instead of weeks lost to approvals and version control, you\u2019ll launch projects on time while keeping clients and teams aligned.',
    benefits: [
      { _key: 'b1', _type: 'benefit', emoji: '\uD83D\uDDD3\uFE0F', text: 'Campaign planning boards' },
      { _key: 'b2', _type: 'benefit', emoji: '\uD83D\uDD8A\uFE0F', text: 'Content production calendars' },
      { _key: 'b3', _type: 'benefit', emoji: '\u2705', text: 'Automated approval workflows' },
      { _key: 'b4', _type: 'benefit', emoji: '\uD83C\uDFA8', text: 'Asset management and version control' },
      { _key: 'b5', _type: 'benefit', emoji: '\uD83E\uDD1D', text: 'Cross-team collaboration hub' },
      { _key: 'b6', _type: 'benefit', emoji: '\uD83D\uDCCA', text: 'Performance tracking dashboards' },
      { _key: 'b7', _type: 'benefit', emoji: '\uD83D\uDCA1', text: 'Client feedback and revisions tracker' },
    ],
  },
  {
    _key: 'ind-7', _type: 'industryTab',
    label: 'Real Estate',
    title: 'Real Estate Management',
    description: 'Streamline real estate development and property management with monday.com project management tools. Instead of piecing together documents and deadlines, you\u2019ll track listings, renovations, and deals in one centralized system.',
    benefits: [
      { _key: 'b1', _type: 'benefit', emoji: '\uD83C\uDFD7\uFE0F', text: 'Property development timelines' },
      { _key: 'b2', _type: 'benefit', emoji: '\uD83C\uDFE1', text: 'Automated deal and listing tracking' },
      { _key: 'b3', _type: 'benefit', emoji: '\uD83D\uDCC4', text: 'Lease and contract management' },
      { _key: 'b4', _type: 'benefit', emoji: '\uD83D\uDCCA', text: 'Client and stakeholder dashboards' },
      { _key: 'b5', _type: 'benefit', emoji: '\uD83D\uDEE0\uFE0F', text: 'Renovation project scheduling' },
      { _key: 'b6', _type: 'benefit', emoji: '\uD83E\uDD1D', text: 'Vendor and contractor coordination' },
      { _key: 'b7', _type: 'benefit', emoji: '\uD83D\uDCF1', text: 'Mobile-friendly site updates' },
    ],
  },
]

async function main() {
  const pageId = 'solutionPage-monday-project-management'

  await writeClient.patch(pageId).set({
    industryHeading: 'Implement monday.com for any industry',
    industryTabs,
  }).commit()

  console.log(`Updated PM page with industry tabs: ${industryTabs.length} industries`)
}

main().catch((err) => { console.error(err); process.exit(1) })
