import { writeClient } from './sanity-client'

async function main() {
  const pageId = 'solutionPage-monday-project-management'

  const capabilitiesCards = [
    { _key: 'cap-1', _type: 'capabilityCard', emoji: '\uD83D\uDCBC', title: 'CRM, Commerce & Finance', description: 'Manage sales pipelines, customer relationships, invoicing, and financial workflows in one unified platform.' },
    { _key: 'cap-2', _type: 'capabilityCard', emoji: '\u2705', title: 'Task management & Collaboration', description: 'Assign tasks, set deadlines, collaborate in real-time, and keep everyone aligned on priorities.' },
    { _key: 'cap-3', _type: 'capabilityCard', emoji: '\u2699\uFE0F', title: 'Resource management & Operations', description: 'Optimise resource allocation, track capacity, and streamline operational workflows across teams.' },
    { _key: 'cap-4', _type: 'capabilityCard', emoji: '\uD83D\uDCCA', title: 'Product & Portfolio Management', description: 'Plan product roadmaps, manage portfolios, track milestones, and align teams on strategic goals.' },
    { _key: 'cap-5', _type: 'capabilityCard', emoji: '\uD83D\uDD12', title: 'IT, Security & Compliance', description: 'Manage IT projects, track security protocols, ensure compliance, and automate governance workflows.' },
    { _key: 'cap-6', _type: 'capabilityCard', emoji: '\uD83C\uDFA8', title: 'Marketing & Creative', description: 'Plan campaigns, manage creative assets, track deliverables, and coordinate cross-functional marketing efforts.' },
  ]

  const solutionCards = [
    {
      _key: 'sol-1',
      _type: 'solutionCard',
      eyebrow: 'Team planning',
      heading: 'The project management solution for your biggest challenges',
      body: 'Whether you\'re managing a small team or coordinating enterprise-level programs, monday.com adapts to your unique workflows. Centralise task tracking, automate repetitive processes, and gain full visibility across every project stage.',
    },
    {
      _key: 'sol-2',
      _type: 'solutionCard',
      eyebrow: 'Resource management',
      heading: 'Resource management done right',
      body: 'Gain real-time visibility into team capacity and workload distribution. Allocate resources efficiently, prevent burnout, and ensure every project has the right people assigned at the right time.',
    },
    {
      _key: 'sol-3',
      _type: 'solutionCard',
      eyebrow: 'Dashboards & reporting',
      heading: 'Clarity at every stage',
      body: 'Build custom dashboards that consolidate data from multiple boards into a single high-level view. Track KPIs, monitor project health, and make data-driven decisions with real-time reporting.',
    },
    {
      _key: 'sol-4',
      _type: 'solutionCard',
      eyebrow: 'Industry solutions',
      heading: 'Implement monday.com for any industry',
      body: 'From construction and manufacturing to marketing agencies and professional services, our consultants have delivered successful monday.com implementations across every industry. We tailor the platform to fit your specific business processes and compliance requirements.',
      ctaLabel: '\uD83D\uDE80 Book a Consultation',
      ctaUrl: 'https://calendly.com/global-calendar-fruitionservices',
    },
  ]

  const caseStudyCards = [
    {
      _key: 'cs-1',
      _type: 'caseStudyCard',
      title: 'Oscar Case Study',
      description: '"monday.com Work OS saves us about USD 50k in staff hours. For us, the benefits of moving to monday.com are massive."',
      personName: 'Stefanus Muller',
      personRole: 'General Director, CTO Product and Program Office, Oscar',
    },
    {
      _key: 'cs-2',
      _type: 'caseStudyCard',
      title: 'Flight Centre Case Study',
      description: '"It is now SO easy to see where projects are and what\'s our workload, process, and it\'s given back to us weeks, in our velocity and in our delivery"',
      personName: 'Andrew Currey',
      personRole: 'CTO Corporate ANZ, Flight Centre',
      videoUrl: 'https://www.youtube.com/watch?v=EPxa_uYJy3w',
    },
  ]

  await writeClient.patch(pageId).set({
    capabilitiesHeading: 'monday.com PM Capabilities',
    capabilitiesCards,
    solutionCards,
    caseStudySectionHeading: 'Project Management Case Studies',
    caseStudyCards,
    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ organisations',
    joinHeadingPart2: ' that have maximised their workflows with our monday.com expert support',
    joinSubheading: 'The economic impact of',
    joinStats: [
      { _key: 's1', _type: 'stat', value: '288%', label: 'ROI' },
      { _key: 's2', _type: 'stat', value: '15,600', label: 'Hours Saved' },
      { _key: 's3', _type: 'stat', value: '50%', label: 'Meeting reduction' },
      { _key: 's4', _type: 'stat', value: '489,794', label: 'Net Value' },
    ],
    joinFootnote: 'Data by',
  }).commit()

  console.log('Updated PM page with capabilities grid (6 cards), solution cards (4), case study cards (2), and join stats')
}

main().catch((err) => { console.error(err); process.exit(1) })
