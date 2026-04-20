/**
 * Update the "Implement monday.com for any team" tabSectionBlock on the homePage
 * with full content for all 7 tabs.
 *
 * Run: node scripts/update-implement-tabs.js
 */
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const updatedTabs = [
  {
    _key: 'tab-crm',
    label: 'CRM Sales Process',
    heading: 'Streamline your sales & CRM processes',
    body: "Have a monday.com partner build a CRM for your business that can still adapt with you as your requirements change. So, instead of spinning your wheels trying to figure it out for six months, you can start inputting data in 2-3 weeks.",
    ctaLabel: 'Show me more',
    ctaUrl: '/monday-crm-consulting',
    features: [
      { _key: 'f-01', icon: '\u{1F4CA}', label: 'Pipeline visualisation' },
      { _key: 'f-02', icon: '\u{1F4C8}', label: 'Sales forecasting' },
      { _key: 'f-03', icon: '\u26A1', label: 'Automated lead scoring' },
      { _key: 'f-04', icon: '\u{1F4E7}', label: 'Email integration' },
      { _key: 'f-05', icon: '\u{1F4CB}', label: 'Custom deal stages' },
      { _key: 'f-06', icon: '\u{1F3AF}', label: 'Performance analytics' },
    ],
  },
  {
    _key: 'tab-pm',
    label: 'Project Management',
    heading: 'Project management & client delivery',
    body: "monday.com's work management product provides comprehensive organisational alignment through goals and strategy tracking, portfolio oversight, and resource management, while streamlining daily operations with robust project management and business process automation.\n\nThe platform further enhances productivity through requests and approvals workflows, client project coordination, and intuitive task management with to-do functionality that keeps teams focused and organised.",
    ctaLabel: 'Show me more',
    ctaUrl: '/monday-consulting-solutions/monday-project-management',
    features: [
      { _key: 'f-07', icon: '\u{1F4C5}', label: 'Timeline visualisation' },
      { _key: 'f-08', icon: '\u{1F3C1}', label: 'Client milestones' },
      { _key: 'f-09', icon: '\u2696\uFE0F', label: 'Resource allocation' },
      { _key: 'f-10', icon: '\u{1F4CA}', label: 'Project tracking' },
      { _key: 'f-11', icon: '\u{1F517}', label: 'Task dependencies' },
      { _key: 'f-12', icon: '\u{1F91D}', label: 'Team collaboration' },
    ],
  },
  {
    _key: 'tab-marketing',
    label: 'Marketing & Creative',
    heading: 'Build out a hierarchy of boards for your marketing team',
    body: "Build a board for big website projects, recurring campaigns, ABM, social media, events, and all your one-off requests. Plus one high-level overview, so you have the project scope, subtasks, and approval workflows all in one place. That way, it\u2019s easy to see what was completed\u2014and what\u2019s still stuck.",
    ctaLabel: 'Show me more',
    ctaUrl: '/monday-for-marketing',
    features: [
      { _key: 'f-13', icon: '\u{1F680}', label: 'Streamlined campaign management' },
      { _key: 'f-14', icon: '\u{1F4C5}', label: 'Visual content planning' },
      { _key: 'f-15', icon: '\u{1F3A8}', label: 'Enhanced creative collaboration' },
      { _key: 'f-16', icon: '\u{1F5C2}\uFE0F', label: 'Centralised asset management' },
      { _key: 'f-17', icon: '\u26A1', label: 'Automated approval workflows' },
      { _key: 'f-18', icon: '\u{1F4C8}', label: 'Data-driven performance insights' },
    ],
  },
  {
    _key: 'tab-hr',
    label: 'HR Operations',
    heading: 'Take control of your HR workflows',
    body: 'Create structure in your HR team by creating processes and workflows for recruitment, onboarding, team events, requests, and email management.',
    ctaLabel: 'Show me more',
    ctaUrl: '/monday-consulting-solutions/monday-for-hr',
    features: [
      { _key: 'f-19', icon: '\u{1F680}', label: 'Streamlined employee onboarding' },
      { _key: 'f-20', icon: '\u{1F4C1}', label: 'Centralised document management' },
      { _key: 'f-21', icon: '\u{1F465}', label: 'Enhanced talent management' },
      { _key: 'f-22', icon: '\u{1F4CA}', label: 'Real-time performance tracking' },
      { _key: 'f-23', icon: '\u26A1', label: 'Automated workflow processes' },
      { _key: 'f-24', icon: '\u{1F517}', label: 'Seamless system integration' },
    ],
  },
  {
    _key: 'tab-finance',
    label: 'Finance Workflows',
    heading: 'Optimise your finance workflows',
    body: 'Build out monday.com Finance workflows that help you manage requests, budgets, expense management and invoicing, and create financial projections. Better yet? Connect your General Ledger. We support integrations with Xero, MYOB, Quickbooks, Netsuite + many more.',
    ctaLabel: 'Show me more',
    ctaUrl: '/monday-consulting-solutions/monday-for-finance',
    features: [
      { _key: 'f-25', icon: '\u{1F4DD}', label: 'Contract automation' },
      { _key: 'f-26', icon: '\u{1F4CA}', label: 'Finance reporting' },
      { _key: 'f-27', icon: '\u{1F9FE}', label: 'Invoice generation' },
      { _key: 'f-28', icon: '\u{1F4BC}', label: 'Budget management' },
      { _key: 'f-29', icon: '\u{1F4B3}', label: 'Payment tracking' },
      { _key: 'f-30', icon: '\u{1F4C8}', label: 'Profitability analysis' },
    ],
  },
  {
    _key: 'tab-it',
    label: 'IT Operations',
    heading: 'Manage your IT operations',
    body: "monday.com transforms IT operations by centralising incident management, asset tracking, and service requests into automated workflows that reduce response times and eliminate manual handoffs between teams.\n\nThe platform provides real-time visibility into system performance, automates routine maintenance tasks, and creates seamless collaboration between IT support, infrastructure, and security teams to ensure optimal service delivery.",
    ctaLabel: 'Show me more',
    ctaUrl: '/monday-consulting-solutions',
    features: [
      { _key: 'f-31', icon: '\u{1F5FA}\uFE0F', label: 'Dynamic product roadmaps' },
      { _key: 'f-32', icon: '\u{1F680}', label: 'Accelerated release management' },
      { _key: 'f-33', icon: '\u{1F3A8}', label: 'Streamlined design workflows' },
      { _key: 'f-34', icon: '\u{1F4AC}', label: 'Enhanced stakeholder communication' },
      { _key: 'f-35', icon: '\u26A1', label: 'Automated sprint cycles' },
      { _key: 'f-36', icon: '\u{1F517}', label: 'Integrated development tools' },
    ],
  },
  {
    _key: 'tab-service',
    label: 'Customer Service',
    heading: 'Customer service that works for you',
    body: "Transform customer support and IT service management with centralised ticketing, email integration, and stakeholder collaboration in one unified platform that eliminates scattered communication channels.\n\nmonday.com Service automates ticket routing, SLA tracking, and resolution processes while providing AI-powered classification and knowledge base assistance to deliver exceptional customer experiences at scale.",
    ctaLabel: 'Show me more',
    ctaUrl: '/monday-consulting-solutions/monday-service',
    features: [
      { _key: 'f-37', icon: '\u26A1', label: 'Automated ticket routing' },
      { _key: 'f-38', icon: '\u{1F3AF}', label: 'AI-powered ticket classification' },
      { _key: 'f-39', icon: '\u{1F4AC}', label: 'Unified communication hub' },
      { _key: 'f-40', icon: '\u{1F91D}', label: 'Enhanced team collaboration' },
      { _key: 'f-41', icon: '\u23F1\uFE0F', label: 'Smart and adjustable SLA tracking' },
      { _key: 'f-42', icon: '\u{1F4CA}', label: 'Comprehensive analytics dashboard' },
    ],
  },
]

async function run() {
  console.log('=== Updating "Implement monday.com" tabs on homePage ===\n')

  // Fetch the home page document
  const doc = await client.fetch('*[_type == "homePage"][0]{ _id, contentBlocks }')
  if (!doc) {
    console.error('ERROR: homePage document not found')
    process.exit(1)
  }

  const blocks = doc.contentBlocks || []

  // Find the tabSectionBlock with key "tabs-01"
  const tabBlockIndex = blocks.findIndex(
    (b) => b._key === 'tabs-01' || (b._type === 'tabSectionBlock' && (b.heading || '').includes('Implement monday'))
  )

  if (tabBlockIndex === -1) {
    console.error('ERROR: tabSectionBlock not found in contentBlocks')
    process.exit(1)
  }

  console.log(`Found tabSectionBlock at index ${tabBlockIndex} (key: ${blocks[tabBlockIndex]._key})`)

  // Update the tabs
  blocks[tabBlockIndex].tabs = updatedTabs

  await client.patch(doc._id).set({ contentBlocks: blocks }).commit()

  console.log('Done! Updated all 7 tabs with full content.')
  console.log('Tabs:')
  updatedTabs.forEach((t, i) => console.log(`  ${i + 1}. ${t.label} — "${t.heading}"`))
}

run().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
