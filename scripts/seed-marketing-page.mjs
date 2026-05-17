#!/usr/bin/env node
/**
 * Seed monday-for-marketing industryPage with the values currently
 * hardcoded in src/app/monday-for-marketing/page.tsx.
 *
 *   SANITY_WRITE_TOKEN=... node scripts/seed-marketing-page.mjs
 *
 * Idempotent: re-running overwrites the same fields with the same content.
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bt6nb58h'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
  console.error('SANITY_WRITE_TOKEN required')
  process.exit(2)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

const SLUG = 'monday-for-marketing'

/* ----- Source-of-truth content (mirrors current page.tsx) ----- */

const comparisonHeading = 'Why monday.com for Marketing & Creative?'

const comparisonTabs = [
  {
    _key: 'why-tab-0',
    _type: 'comparisonTab',
    label: 'Why monday.com for Marketing & Creative?',
    items: [
      {
        _key: 'wt0-1',
        _type: 'comparisonItem',
        number: '01',
        title: 'Streamline Your Process from Idea to Delivery',
        description:
          '🎯 Set goals and strategy\n📋 Plan project goals, tasks, and resources\n⏰ Oversee due dates, assign tasks, and more\n🚀 Deliver on time and within budget\n📊 Measure marketing impact',
      },
      {
        _key: 'wt0-2',
        _type: 'comparisonItem',
        number: '02',
        title: 'Run Efficient Campaigns',
        description:
          '🤝 Keep every stakeholder aligned on campaign progress\n💰 Ensure all campaigns are on budget and on time\n👁️ Maintain full visibility of campaign performance metrics\n🔍 Get a clear overview of every stage of the campaign process\n🔗 Connect and report from your ads sources and other essential marketing data',
      },
      {
        _key: 'wt0-3',
        _type: 'comparisonItem',
        number: '03',
        title: 'Simplify Approval Processes',
        description:
          '⚡ Automate key parts of the approval process\n🔄 Keep the entire team up to date\n✂️ Eliminate the need for frequent checkups, emails, and update meetings\n⏳ Save valuable time, so you can focus on the creative work itself',
      },
    ],
  },
  {
    _key: 'why-tab-1',
    _type: 'comparisonTab',
    label: 'Marketing & Creative Features',
    items: [
      {
        _key: 'wt1-1',
        _type: 'comparisonItem',
        number: '01',
        title: '📝 Proofing and Approval',
        description:
          'Streamline the content review and approval process directly inside monday.com with the PageProof app, no matter the file type.',
      },
      {
        _key: 'wt1-2',
        _type: 'comparisonItem',
        number: '02',
        title: '💬 Annotations and Live Feedback',
        description:
          'Shorten feedback loops with contextual annotations directly on your files, and communicate with stakeholders with updates and notifications.',
      },
      {
        _key: 'wt1-3',
        _type: 'comparisonItem',
        number: '03',
        title: '📁 File Versioning',
        description:
          'Stay updated on the latest version. Track files connected to tasks and projects from latest to oldest. Add and delete versions, preview, download, and add annotations directly on file for quick feedback.',
      },
      {
        _key: 'wt1-4',
        _type: 'comparisonItem',
        number: '04',
        title: '📊 Robust Gantt for Campaign Planning',
        description:
          'Plan and monitor marketing work, from campaigns to complex projects, with robust Gantt charts.',
      },
      {
        _key: 'wt1-5',
        _type: 'comparisonItem',
        number: '05',
        title: '⚙️ Marketing Automations',
        description:
          'Automate repetitive marketing work with customisable automations to improve efficiency, allowing teams to free up time to focus on the work that matters.',
      },
      {
        _key: 'wt1-6',
        _type: 'comparisonItem',
        number: '06',
        title: '🗂️ Asset Management',
        description:
          'Store, organize, and share all marketing digital assets in one centralised location.',
      },
    ],
  },
  {
    _key: 'why-tab-2',
    _type: 'comparisonTab',
    label: 'How We Can Help',
    items: [
      {
        _key: 'wt2-1',
        _type: 'comparisonItem',
        number: '01',
        title: 'Assess Your Needs',
        description:
          '🎯 Identify your marketing goals\n📝 List your specific requirements\n🔍 Analyse current workflow challenges',
      },
      {
        _key: 'wt2-2',
        _type: 'comparisonItem',
        number: '02',
        title: 'Design Your Process',
        description:
          '⚙️ Create workflows tailored to your marketing tasks\n🗺️ Map out how information will flow in the system\n📋 Define roles and responsibilities',
      },
      {
        _key: 'wt2-3',
        _type: 'comparisonItem',
        number: '03',
        title: 'Set Up monday.com',
        description:
          '🔧 Configure custom workflows\n🤖 Set up automations and permissions\n📤 Transfer existing data (if any)',
      },
      {
        _key: 'wt2-4',
        _type: 'comparisonItem',
        number: '04',
        title: 'Train Your Team',
        description:
          '🎓 Teach staff how to use monday.com\n🖐️ Provide hands-on practice sessions\n📚 Create user documentation and guides',
      },
      {
        _key: 'wt2-5',
        _type: 'comparisonItem',
        number: '05',
        title: 'Launch the System',
        description:
          '📊 Roll out monday.com to your organisation\n💬 Offer on-going support during the transition\n🎉 Celebrate successful implementation milestones',
      },
      {
        _key: 'wt2-6',
        _type: 'comparisonItem',
        number: '06',
        title: 'Keep Improving',
        description:
          '👁️ Monitor how well monday.com is working\n🔄 Make adjustments as needed\n🤝 Get ongoing support to optimise your marketing operations.',
      },
    ],
  },
]

const capabilitiesHeading =
  'Why the best use monday.com to manage their Marketing & Creative teams'

const capabilitiesCards = [
  { _key: 'wb-0', _type: 'capabilityCard', emoji: '📋', title: 'Campaign Management', description: 'Keep all your marketing campaigns organised and on track with centralised project visibility.' },
  { _key: 'wb-1', _type: 'capabilityCard', emoji: '✏️', title: 'Content Planning & Creation', description: 'A centralised space to brainstorm ideas, plan content calendars, and collaborate seamlessly on content creation.' },
  { _key: 'wb-2', _type: 'capabilityCard', emoji: '📱', title: 'Social Media Management', description: 'Schedule posts, track engagement metrics, and monitor social media campaigns across all platforms.' },
  { _key: 'wb-3', _type: 'capabilityCard', emoji: '🎯', title: 'Lead Generation & Tracking', description: 'Create custom forms and integrate them with your website to ensure smooth lead generation processes.' },
  { _key: 'wb-4', _type: 'capabilityCard', emoji: '📊', title: 'Analytics & Reporting', description: 'Gain valuable insights into your marketing performance with comprehensive data tracking and visualisation.' },
  { _key: 'wb-5', _type: 'capabilityCard', emoji: '🤝', title: 'Collaboration & Communication', description: 'Enable seamless communication and foster effective teamwork for successful marketing campaign execution.' },
  { _key: 'wb-6', _type: 'capabilityCard', emoji: '💰', title: 'Budget Tracking', description: 'Track expenses, monitor costs, and maintain financial visibility to maximise your return on investment.' },
  { _key: 'wb-7', _type: 'capabilityCard', emoji: '🔗', title: 'Integration Power', description: 'Sync data, automate workflows, and streamline marketing operations by connecting all your essential tools.' },
  { _key: 'wb-8', _type: 'capabilityCard', emoji: '⚡', title: 'Agile Marketing Workflows', description: 'Adapt quickly to changing market trends and customer needs with flexible, agile marketing workflows.' },
]

const caseStudySectionHeading = 'Marketing Case Studies'

const caseStudyCards = [
  {
    _key: 'mcs-0',
    _type: 'caseStudyCard',
    title: 'Proofing & Approval Workflow',
    description:
      "Reviewing and approving work shouldn't slow you down. With this use case, promote better teamwork by managing and tracking all proofs in one place. Results: 22% faster proofing & approval time · 15% fewer errors · 49% increase in deliverables.",
    videoUrl: 'https://www.youtube.com/watch?v=Nw-0h8OkO1A',
  },
  {
    _key: 'mcs-1',
    _type: 'caseStudyCard',
    title: 'Multi-Platform Campaign Management',
    description:
      'Managing campaigns on multiple platforms causes critical delays. With this use case, launch, manage, and track all marketing campaigns in one place. Results: 19% reduction in budget overspend · 14% faster launch time · 3× more campaigns launched.',
    videoUrl: 'https://www.youtube.com/watch?v=RXI2hNxZAIQ',
  },
]

const heroPartnerImagePath = '/monday-marketing-partner.avif'
const testimonialBannerPrimaryCtaLabel = '🚀 Start Your Transformation'
const joinHeadingPart1 = 'Join '
const joinHeadingAccent = '500+ organisations'
const joinHeadingPart2 =
  ' that have maximised their workflows with our monday.com expert support'

/* ----- Patch ----- */

const doc = await client.fetch(
  `*[_type=="industryPage" && slug.current==$slug][0]{_id}`,
  { slug: SLUG },
)

if (!doc?._id) {
  console.error(`industryPage with slug "${SLUG}" not found`)
  process.exit(1)
}

const patch = {
  comparisonHeading,
  comparisonTabs,
  capabilitiesHeading,
  capabilitiesCards,
  caseStudySectionHeading,
  caseStudyCards,
  heroPartnerImagePath,
  testimonialBannerPrimaryCtaLabel,
  joinHeadingPart1,
  joinHeadingAccent,
  joinHeadingPart2,
}

await client.patch(doc._id).set(patch).commit()
console.log(`✓ patched ${doc._id} with ${Object.keys(patch).length} fields`)
