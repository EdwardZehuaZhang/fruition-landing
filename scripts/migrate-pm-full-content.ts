/**
 * Migrate all hardcoded content on the Monday Product Management page
 * into Sanity so the page is fully CMS-driven.
 *
 * Uploads: hero + 4 product development board screenshots.
 * Patches: heroImage, whyProductTeams*, strategicApproach*, industryProductSolutions*,
 *          productDevelopment*.
 */
import * as fs from 'fs'
import * as path from 'path'
import { writeClient } from './sanity-client'

async function uploadImage(filePath: string, filename: string) {
  const buffer = fs.readFileSync(filePath)
  const asset = await writeClient.assets.upload('image', buffer, { filename })
  return asset._id
}

function imageRef(assetId: string) {
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
  }
}

const WHY_CARDS = [
  {
    _key: 'why-1',
    _type: 'whyProductTeamCard',
    emoji: '\uD83D\uDDFA\uFE0F',
    title: 'Visual Product Roadmaps',
    description: 'Aligning stakeholders and communicate product vision.',
  },
  {
    _key: 'why-2',
    _type: 'whyProductTeamCard',
    emoji: '\uD83C\uDFAF',
    title: 'Milestone Tracking',
    description:
      'Milestone tracking with automated progress updates and notifications.',
  },
  {
    _key: 'why-3',
    _type: 'whyProductTeamCard',
    emoji: '\uD83D\uDC69\u200D\uD83D\uDCBB\uD83D\uDC68\u200D\uD83D\uDCBB',
    title: 'Cross-functional Collaboration',
    description:
      'Enhancing communication between product, engineering, and marketing teams.',
  },
  {
    _key: 'why-4',
    _type: 'whyProductTeamCard',
    emoji: '\uD83D\uDCCA',
    title: 'Real-time Reporting',
    description:
      'Real-time reporting and updates regarding product development progress and bottlenecks.',
  },
]

const STRATEGIC_APPROACH_TABS = [
  {
    _key: 'sa-1',
    _type: 'strategicApproachTab',
    label: 'Product Strategy & Vision Setting',
    items: [
      {
        _key: 'sa-1-a',
        _type: 'emojiItem',
        emoji: '\uD83D\uDCCA',
        text: 'Define product goals and key performance indicators',
      },
      {
        _key: 'sa-1-b',
        _type: 'emojiItem',
        emoji: '\uD83E\uDD1D',
        text: 'Create stakeholder alignment through shared monday.com dashboards',
      },
      {
        _key: 'sa-1-c',
        _type: 'emojiItem',
        emoji: '\u2705',
        text: 'Establish product metrics and success criteria',
      },
    ],
  },
  {
    _key: 'sa-2',
    _type: 'strategicApproachTab',
    label: 'Product Backlog Management',
    items: [
      {
        _key: 'sa-2-a',
        _type: 'emojiItem',
        emoji: '\uD83D\uDD04',
        text: 'Manage sprint planning and backlog grooming',
      },
      {
        _key: 'sa-2-b',
        _type: 'emojiItem',
        emoji: '\u2B50',
        text: "Prioritise features using monday.com's ranking and scoring capabilities",
      },
      {
        _key: 'sa-2-c',
        _type: 'emojiItem',
        emoji: '\uD83D\uDCDD',
        text: 'Track user stories and acceptance criteria',
      },
    ],
  },
  {
    _key: 'sa-3',
    _type: 'strategicApproachTab',
    label: 'Cross-Team Coordination',
    items: [
      {
        _key: 'sa-3-a',
        _type: 'emojiItem',
        emoji: '\uD83D\uDD17',
        text: 'Integrate development, design, and marketing workflows',
      },
      {
        _key: 'sa-3-b',
        _type: 'emojiItem',
        emoji: '\uD83D\uDCAC',
        text: 'Ensure consistent communication across all product stakeholders',
      },
      {
        _key: 'sa-3-c',
        _type: 'emojiItem',
        emoji: '\u26A1',
        text: 'Automate handoffs between teams',
      },
    ],
  },
]

const INDUSTRY_TABS = [
  {
    _key: 'ind-1',
    _type: 'industryProductSolutionTab',
    label: 'SaaS Product Management',
    description:
      'SaaS companies leverage Monday.com\u2019s product management capabilities for:',
    sections: [
      {
        _key: 'ind-1-01',
        _type: 'numberedSection',
        number: '01',
        title: 'Feature Development Tracking',
        bullets: [
          { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83C\uDFC3\u200D\u2642\uFE0F', text: 'Manage development sprints across multiple product areas' },
          { _key: 'b2', _type: 'emojiBullet', emoji: '\u2705', text: 'Track feature completion rates and deployment schedules' },
          { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83D\uDC65', text: 'Monitor customer feedback and feature adoption metrics' },
          { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDE80', text: 'Coordinate product launches with marketing and sales teams' },
        ],
      },
      {
        _key: 'ind-1-02',
        _type: 'numberedSection',
        number: '02',
        title: 'Product-Market Fit Analysis',
        bullets: [
          { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83D\uDCC8', text: 'Collect and analyse customer usage data' },
          { _key: 'b2', _type: 'emojiBullet', emoji: '\uD83D\uDCCA', text: 'Track product metrics and key performance indicators' },
          { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83D\uDCA1', text: 'Identify improvement opportunities through customer feedback' },
          { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDD0D', text: 'Optimise product features based on user behaviour analytics' },
        ],
      },
      {
        _key: 'ind-1-03',
        _type: 'numberedSection',
        number: '03',
        title: 'SaaS Product Launch Coordination',
        bullets: [
          { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83D\uDC69\u200D\uD83D\uDCBB', text: 'Orchestrate cross-functional product launches' },
          { _key: 'b2', _type: 'emojiBullet', emoji: '\uD83E\uDEB2', text: 'Manage beta testing programs and user feedback collection' },
          { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83D\uDCE2', text: 'Coordinate marketing campaigns with product releases' },
          { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDCC8', text: 'Track go-to-market success metrics' },
        ],
      },
    ],
  },
  {
    _key: 'ind-2',
    _type: 'industryProductSolutionTab',
    label: 'Manufacturing Product Management',
    description:
      'Manufacturing companies use Monday.com to streamline complex product development processes:',
    sections: [
      {
        _key: 'ind-2-01',
        _type: 'numberedSection',
        number: '01',
        title: 'New Product Development (NPD)',
        bullets: [
          { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83D\uDCD0', text: 'Manage product design and engineering workflows' },
          { _key: 'b2', _type: 'emojiBullet', emoji: '\u2705', text: 'Track regulatory compliance and certification requirements' },
          { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83E\uDD1D', text: 'Coordinate with suppliers and manufacturing partners' },
          { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDCB0', text: 'Monitor product cost and margin analysis' },
        ],
      },
      {
        _key: 'ind-2-02',
        _type: 'numberedSection',
        number: '02',
        title: 'Quality Management Integration',
        bullets: [
          { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83D\uDD17', text: 'Link product specifications with quality control processes' },
          { _key: 'b2', _type: 'emojiBullet', emoji: '\uD83D\uDCC9', text: 'Track defect rates and improvement initiatives' },
          { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83D\uDD04', text: 'Manage corrective and preventive action (CAPA) processes' },
          { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDD0D', text: 'Ensure traceability from design to production' },
        ],
      },
      {
        _key: 'ind-2-03',
        _type: 'numberedSection',
        number: '03',
        title: 'Supply Chain Coordination',
        bullets: [
          { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83D\uDCCB', text: 'Manage bill of materials (BOM) and component sourcing' },
          { _key: 'b2', _type: 'emojiBullet', emoji: '\uD83D\uDCC5', text: 'Incident reporting and tracking' },
          { _key: 'b3', _type: 'emojiBullet', emoji: '\u2696\uFE0F', text: 'Coordinate product launches with production capacity' },
          { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDCCA', text: 'Monitor inventory levels and demand forecasting' },
        ],
      },
    ],
  },
  {
    _key: 'ind-3',
    _type: 'industryProductSolutionTab',
    label: 'Retail Product Management',
    description:
      'Retail organisations leverage monday.com for comprehensive product lifecycle management:',
    sections: [
      {
        _key: 'ind-3-01',
        _type: 'numberedSection',
        number: '01',
        title: 'Merchandise Planning and Buying',
        bullets: [
          { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83D\uDECD\uFE0F', text: 'Plan seasonal product collections and inventory purchases' },
          { _key: 'b2', _type: 'emojiBullet', emoji: '\uD83D\uDCCA', text: 'Track product performance and sales analytics' },
          { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83E\uDD1D', text: 'Manage vendor relationships and procurement processes' },
          { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDCDD', text: 'Coordinate pricing strategies and promotional campaigns' },
        ],
      },
      {
        _key: 'ind-3-02',
        _type: 'numberedSection',
        number: '02',
        title: 'Private Label Product Development',
        bullets: [
          { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83D\uDCCB', text: 'Manage product specifications and quality requirements' },
          { _key: 'b2', _type: 'emojiBullet', emoji: '\u23F0', text: 'Track sample approvals and production timelines' },
          { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83E\uDD1D', text: 'Coordinate with manufacturers and quality control teams' },
          { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDCC8', text: 'Monitor product launch success and market performance' },
        ],
      },
      {
        _key: 'ind-3-03',
        _type: 'numberedSection',
        number: '03',
        title: 'Omnichannel Product Management',
        bullets: [
          { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83D\uDD04', text: 'Synchronise product information across all sales channels' },
          { _key: 'b2', _type: 'emojiBullet', emoji: '\uD83D\uDCC1', text: 'Manage product content and digital asset workflows' },
          { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83D\uDCCD', text: 'Track inventory levels and availability across locations' },
          { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83C\uDFAF', text: 'Coordinate marketing campaigns with product launches' },
        ],
      },
    ],
  },
]

async function main() {
  const pageId = 'solutionPage-monday-product-management'
  const existing = await writeClient.getDocument(pageId)
  if (!existing) throw new Error(`Document ${pageId} not found`)

  const imageDir = path.join(__dirname, '..', 'public', 'images', 'product-management')
  console.log('Uploading images to Sanity...')
  const [heroId, sprintPlanningId, regularBoardId, sprintRetroId, bugsQueueId] =
    await Promise.all([
      uploadImage(path.join(imageDir, 'hero.png'), 'pm-hero.png'),
      uploadImage(path.join(imageDir, 'sprint-planning.avif'), 'pm-sprint-planning.avif'),
      uploadImage(path.join(imageDir, 'regular-board.avif'), 'pm-regular-board.avif'),
      uploadImage(path.join(imageDir, 'sprint-retrospective.avif'), 'pm-sprint-retrospective.avif'),
      uploadImage(path.join(imageDir, 'bugs-queue.avif'), 'pm-bugs-queue.avif'),
    ])
  console.log('Uploaded:', { heroId, sprintPlanningId, regularBoardId, sprintRetroId, bugsQueueId })

  const productDevelopmentTabs = [
    {
      _key: 'pd-1',
      _type: 'productDevelopmentTab',
      label: 'Epic & Feature Management',
      description:
        "monday.com's hierarchical board structure enables sophisticated product planning. Teams can break down product initiatives into manageable components:",
      bullets: [
        { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83C\uDFAF', text: 'High-level epics linked to strategic objectives' },
        { _key: 'b2', _type: 'emojiBullet', emoji: '\uD83D\uDDFA\uFE0F', text: 'User story mapping with acceptance criteria' },
        { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83D\uDCCB', text: 'Feature specifications with detailed requirements' },
        { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDD17', text: 'Dependency tracking across multiple product areas' },
      ],
      image: imageRef(sprintPlanningId),
      imageAlt: 'Sprint planning board in monday.com',
    },
    {
      _key: 'pd-2',
      _type: 'productDevelopmentTab',
      label: 'Roadmap Visualisation',
      description:
        "The platform's timeline and Gantt chart views provide powerful roadmap visualisation:",
      bullets: [
        { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83C\uDFC1', text: 'Multi-quarter product planning with milestone markers' },
        { _key: 'b2', _type: 'emojiBullet', emoji: '\uD83D\uDCAC', text: 'Stakeholder communication through automated roadmap updates' },
        { _key: 'b3', _type: 'emojiBullet', emoji: '\u2696\uFE0F', text: 'Resource allocation and capacity planning' },
        { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDD2E', text: 'Scenario planning for different product launch timelines' },
      ],
      image: imageRef(regularBoardId),
      imageAlt: 'Roadmap board in monday.com',
    },
    {
      _key: 'pd-3',
      _type: 'productDevelopmentTab',
      label: 'Agile Approach',
      description: 'monday.com seamlessly supports agile methodologies with:',
      bullets: [
        { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83D\uDCC5', text: 'Sprint planning and backlog management' },
        { _key: 'b2', _type: 'emojiBullet', emoji: '\uD83D\uDD04', text: 'Daily standup automation and progress reports' },
        { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83D\uDCCA', text: 'Burndown charts and velocity tracking' },
        { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDD0D', text: 'Retrospective planning and action item tracking' },
      ],
      image: imageRef(sprintRetroId),
      imageAlt: 'Sprint retrospective board in monday.com',
    },
    {
      _key: 'pd-4',
      _type: 'productDevelopmentTab',
      label: 'Feature Request Management',
      description: 'Centralise and prioritise feature requests with:',
      bullets: [
        { _key: 'b1', _type: 'emojiBullet', emoji: '\uD83D\uDCE5', text: 'Customer feedback integration from multiple channels' },
        { _key: 'b2', _type: 'emojiBullet', emoji: '\uD83D\uDDF3\uFE0F', text: 'Stakeholder voting and prioritisation' },
        { _key: 'b3', _type: 'emojiBullet', emoji: '\uD83D\uDCCA', text: 'Impact vs. effort scoring matrices' },
        { _key: 'b4', _type: 'emojiBullet', emoji: '\uD83D\uDE80', text: 'Automated feature request routing to product teams' },
      ],
      image: imageRef(bugsQueueId),
      imageAlt: 'Bugs queue board in monday.com',
    },
  ]

  await writeClient
    .patch(pageId)
    .set({
      heroImage: imageRef(heroId),

      whyProductTeamsHeadingPart1: 'Why Product Teams Choose monday.com for ',
      whyProductTeamsHeadingAccent: 'Product Management',
      whyProductTeamsSubheading:
        "monday.com's product roadmap software capabilities transform how teams plan, track, and execute product strategies. Unlike traditional product management tools, monday.com provides:",
      whyProductTeamsCards: WHY_CARDS,

      strategicApproachHeadingPart1: 'How to Manage Products with monday.com: ',
      strategicApproachHeadingAccent: 'A Strategic Approach',
      strategicApproachSubheading:
        "Managing products effectively with monday.com requires understanding both the platform's capabilities and proven product management methodologies. Our monday.com expert consultants guide teams through:",
      strategicApproachTabs: STRATEGIC_APPROACH_TABS,

      industryProductSolutionsHeading:
        'Industry-Specific Product Management Solutions',
      industryProductSolutionsTabs: INDUSTRY_TABS,

      productDevelopmentHeadingPart1: 'Local monday.com consultants for ',
      productDevelopmentHeadingAccent: 'Product Development',
      productDevelopmentHeadingPart2:
        ' in Australia, United States, and United Kingdom',
      productDevelopmentTabs,
    })
    .commit()

  console.log(`\u2705 Patched ${pageId} with fully CMS-driven PM content`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
