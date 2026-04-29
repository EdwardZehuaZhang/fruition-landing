/**
 * Populate solutionPage:monday-service with content previously hardcoded
 * in MondayServicePage.tsx (CS_FEATURES, AI_FEATURES, FOUR_CARDS, FAQ_ITEMS,
 * STRATEGIC_COLUMNS) plus heading/eyebrow strings.
 *
 *   npx tsx scripts/sanity-migrate/populate-monday-service.ts
 */
import { writeClient, uploadLocalImage, withKeys } from './lib'

const SLUG = 'monday-service'

const CS_FEATURES = [
  { title: 'Ticketing system integration', description: 'Seamlessly integrate your email ticketing system with Monday.com' },
  { title: 'Unified data source', description: 'Centralise your customer service management for optimal efficiency' },
  { title: 'Shared inboxes', description: 'Leverage shared inbox solutions for collaborative customer support' },
  { title: 'Turn service needs into action', description: 'Bridge the gap between tickets and larger scale service initiatives by managing them in one place.' },
  { title: 'Solve tickets with full context', description: 'Connect service management with organisational resources like assets, knowledge base, directories, inventory, and more.' },
  { title: 'Accelerate stakeholder collaboration', description: 'Replace messy email threads with in-platform communication to connect internal and external stakeholders.' },
]

const AI_FEATURES = [
  { title: 'Self-service customer experiences', description: 'Enable customers to solve common issues on their own so agents can focus on critical issues.' },
  { title: 'Automatic ticket classification', description: 'Let AI automatically tag tickets by type, urgency, sentiment, department, and more to accurately prioritise incoming tickets.' },
  { title: 'Smart ticket routing', description: 'Speed up ticket handling and reduce manual work with automatic assignment to relevant agent or team.' },
  { title: 'Knowledge base assistance for agents', description: 'Solve a wider range of issues with AI assistance that pulls relevant knowledge and minimises unnecessary escalations and delays.' },
  { title: 'Streamlined communication', description: 'Automate replies, follow-ups, and more to speed up communication between agents, customers, and all of your stakeholders.' },
]

const FOUR_CARDS = [
  { image: '/images/monday-service-card-1.avif', title: 'Email Ticketing with monday.com', description: "Integrate your email ticketing system, including Outlook and Gmail, with monday.com's service desk software for unparalleled efficiency and enhanced customer satisfaction." },
  { image: '/images/monday-service-card-2.avif', title: 'Outlook and Gmail Integration Made Easy', description: 'Fruition specialises in integrating monday.com with your existing email ticketing system, including Outlook and Gmail.' },
  { image: '/images/monday-service-card-3.avif', title: 'Stay Ahead of Service Trends and Issues', description: 'Monitor your entire service operations performance to detect issues before they escalate and identify areas for improvement.' },
  { image: '/images/monday-service-card-4.avif', title: 'Streamline Your Customer Service Workflow', description: 'With the monday.com helpdesk and shared inbox solution, your team can collaborate effortlessly on customer inquiries. Assign tickets, track progress, and resolve issues faster than ever before.' },
]

const FAQ_ITEMS = [
  { question: 'How much does monday service cost?', answer: 'On the Basic Plan, the monthly cost per user is $12 while the annual cost per user is $108. On the Standard Plan, the monthly cost becomes $14 per user while the annual cost per user is $144. On the Pro plan, it is $79.99 per user monthly and $228 per user annually.' },
  { question: 'What is monday Service?', answer: 'monday service is an intuitive, fully customizable service platform where help desk teams manage and automate their service operations and processes to resolve incidents and requests within SLAs, and deliver great customer experiences at scale.\n\nmonday service connects ticketing, projects, and cross-department teams in one centralized support platform.' },
  { question: 'Can you use Monday as a ticketing system?', answer: 'Yes, with monday.com, you can build a functional ticket-tracking system that helps your team’s needs. You can track all incoming, open, and closed tickets with one comprehensive board. Connect channels to your monday Service "Tickets" board to receive all tickets in your board, and track correspondence within the ticket’s item.\n\nLearn more about using monday Service as a ticketing system here.' },
  { question: 'What is the best customer service ticketing system?', answer: 'The best customer service ticketing system will have all of the following:\n\n• User-Friendly Interface\n• Seamless Collaboration\n• Integration with Other Systems\n• Multi-channel support\n• Reliable and Robust Reporting\n• Scalability\n• Exceptional Customer Support' },
  { question: 'Is monday Service secure?', answer: 'Yes. It offers enterprise-grade security including SOC 2 compliance, GDPR, HIPAA (Enterprise), SSO, 2FA, and audit logs.' },
  { question: 'What can I use Monday Service for?', answer: '• Handling IT tickets and service requests\n• Automating incident management and approvals\n• Tracking IT assets and change requests\n• Providing employees with a self-service portal for quick support' },
  { question: 'Does monday Service include automations?', answer: 'Yes. You can automate ticket routing, priority settings, status changes, SLA tracking, and escalations to reduce manual work and resolve issues faster.' },
  { question: 'Can monday Service integrate with other tools?', answer: 'Yes. It connects with Slack, Microsoft Teams, Gmail, Outlook, Jira, and more. You can also use the API, Zapier, or Make for advanced integrations.' },
  { question: 'Is monday Service secure enough for IT operations?', answer: 'Yes. It includes enterprise-grade security features like SSO, 2FA, SOC 2 compliance, GDPR alignment, audit logs, and role-based permissions to keep IT data safe.' },
]

const STRATEGIC_COLUMNS = [
  {
    title: 'Licenses, product consultancy, and implementation',
    items: [
      { emoji: '📋', text: 'Analyse your operations and recommend the optimal monday.com plan' },
      { emoji: '🔧', text: 'Deliver customised implementation with detailed project roadmap' },
      { emoji: '✅', text: 'Configure your workspace to match your specific business requirements' },
    ],
  },
  {
    title: 'Onboarding, training, and business-wide adoption',
    items: [
      { emoji: '🚀', text: 'Accelerate team productivity through comprehensive onboarding programs' },
      { emoji: '👥', text: 'Drive adoption across all departments with expert-led training sessions' },
      { emoji: '📝', text: 'Ensure immediate value delivery and measurable ROI from implementation' },
    ],
  },
  {
    title: 'Optimisations, automations and integrations',
    items: [
      { emoji: '⚙️', text: 'Design intelligent automations and ongoing workflow optimisations and improvements' },
      { emoji: '🔗', text: 'Build seamless integrations with your existing business tools' },
      { emoji: '🎯', text: 'Create tailored dashboards, templates, and reporting solutions' },
    ],
  },
]

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "solutionPage" && slug.current == $slug][0]{_id}`,
    { slug: SLUG }
  )
  if (!existing?._id) {
    console.error(`solutionPage:${SLUG} not found in Sanity. Aborting.`)
    process.exit(1)
  }

  console.log('Uploading service hero + four-card images…')
  const heroImage = await uploadLocalImage('/images/monday-service-hero.avif')
  const card1 = await uploadLocalImage(FOUR_CARDS[0].image)
  const card2 = await uploadLocalImage(FOUR_CARDS[1].image)
  const card3 = await uploadLocalImage(FOUR_CARDS[2].image)
  const card4 = await uploadLocalImage(FOUR_CARDS[3].image)

  const patch: Record<string, unknown> = {
    heroHeading: 'monday Service',
    heroSubheading:
      'Transform your customer service operations with monday Service — unified ticketing, shared inboxes, automations, and AI-powered workflows on one platform.',
    serviceHeroImage: heroImage,
    primaryCtaLabel: 'Book a Consultation',
    secondaryCtaLabel: 'Get Started with monday.com',

    logoCloudHeadingPart1: 'Clients who have used our ',
    logoCloudHeadingAccent: 'monday.com consulting services',

    comparisonHeading: 'Easily shape every aspect of service to your business needs with ',
    comparisonHeadingAccent: 'monday Service',
    featureTabsIntroSubheading:
      'We transform fragmented service systems into cohesive, automated operations that enhance team collaboration and deliver measurable ROI across your entire organisation.',
    comparisonEyebrow: 'Why monday.com for customer service?',
    comparisonTabs: withKeys([
      {
        label: 'Customer Service Features',
        items: withKeys(
          CS_FEATURES.map((f, i) => ({
            number: String(i + 1).padStart(2, '0'),
            title: f.title,
            description: f.description,
          }))
        ),
      },
      {
        label: 'AI-Powered Service',
        items: withKeys(
          AI_FEATURES.map((f, i) => ({
            number: String(i + 1).padStart(2, '0'),
            title: f.title,
            description: f.description,
          }))
        ),
      },
    ]),

    fourCardsHeadingPart1: 'Holistic service management.',
    fourCardsHeadingAccent: 'One shared platform.',
    fourCardsCtaLabel: '🚀 Book a Meeting',
    fourCards: withKeys([
      { image: card1, title: FOUR_CARDS[0].title, description: FOUR_CARDS[0].description },
      { image: card2, title: FOUR_CARDS[1].title, description: FOUR_CARDS[1].description },
      { image: card3, title: FOUR_CARDS[2].title, description: FOUR_CARDS[2].description },
      { image: card4, title: FOUR_CARDS[3].title, description: FOUR_CARDS[3].description },
    ]),

    faqHeading: 'Frequently asked questions',
    faqEyebrow: 'monday Service',
    faqFlatItems: withKeys(FAQ_ITEMS),

    strategicColumnsHeadingPart1: 'How to Manage Service with monday.com: ',
    strategicColumnsHeadingAccent: 'A Strategic Approach',
    strategicColumnsSubheading:
      "Managing products effectively with monday.com requires understanding both the platform's capabilities and proven service management methodologies. Our monday.com service management consultants guide teams through:",
    strategicColumns: withKeys(
      STRATEGIC_COLUMNS.map((col) => ({
        title: col.title,
        items: withKeys(col.items),
      }))
    ),
  }

  console.log(`Patching solutionPage:${SLUG} (${existing._id})…`)
  await writeClient.patch(existing._id).set(patch).commit()
  console.log('✓ monday-service populated')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
