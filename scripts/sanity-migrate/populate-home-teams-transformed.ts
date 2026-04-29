/**
 * Append the "Teams Transformed" tabbed block to the homePage.contentBlocks
 * array (or insert after the testimonialBlock group).
 *
 * Idempotent: if a teamsTransformedBlock already exists, replaces it.
 *
 *   npx tsx scripts/sanity-migrate/populate-home-teams-transformed.ts
 */
import { writeClient, withKeys } from './lib'

const HEADING = 'Teams Transformed with Proven Efficiency Gains.'
const SUBHEADING =
  'Authorised monday.com, Atlassian and make Consulting, implementation and integration partner consultants across Australia, UK, and US.'

const TABS = [
  {
    label: 'Top Leadership Challenges',
    items: [
      { title: 'Financial Uncertainty', description: 'Improving reporting visibility of business performance to make better decisions and to quickly correct course on strategic initiatives.' },
      { title: 'AI & Automation', description: 'Team enablement and implementation of AI & Automation technologies to improve workforce efficiency and unlock hidden inefficiencies' },
      { title: 'Hybrid Work Management', description: 'Optimising productivity and culture across distributed teams while maintaining operational excellence' },
      { title: 'Talent Retention & Personal Development', description: 'Attracting and keeping key talent in a competitive market while upskilling for future needs' },
      { title: 'Cybersecurity & Digital Risk', description: 'Protecting against evolving threats while ensuring data privacy and regulatory compliance' },
    ],
  },
  {
    label: 'Top Team Challenges',
    items: [
      { title: 'Hybrid Collaboration', description: 'Adopting the right tools to maintain effective teamwork, communication, and workload capacity' },
      { title: 'Digital Adaptation', description: 'Get expert training support to rapidly learn new tools and technologies while maintaining productivity' },
      { title: 'Work-Life Integration', description: 'Giving team members time back with an automated system that cuts out manual work' },
      { title: 'Personal Development', description: 'Develop team members to learn how to optimise processes with better systems' },
      { title: 'Team Cohesion', description: 'Unify the team with communication and work management systems' },
    ],
  },
  {
    label: 'How We Can Help',
    subheading: 'Our expert consultants empower you to adopt workflow automation & AI systems',
    items: [
      { title: 'Process Discovery → Business Process Audit', description: 'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.' },
      { title: 'Technical Architecture → System Integration Scope', description: 'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.' },
      { title: 'Solution Design → Implementation', description: 'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.' },
      { title: 'Efficiency Impact → ROI Opportunity Analysis', description: 'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.' },
      { title: 'Change Readiness → Adoption & Training Strategies', description: 'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.' },
    ],
  },
]

interface ContentBlock {
  _key: string
  _type: string
  [key: string]: unknown
}

async function main() {
  const homePage = await writeClient.fetch<{ _id: string; contentBlocks?: ContentBlock[] } | null>(
    `*[_type == "homePage"][0]{_id, contentBlocks}`
  )
  if (!homePage?._id) {
    console.error('homePage not found in Sanity. Aborting.')
    process.exit(1)
  }

  const blocks = (homePage.contentBlocks || []).slice()

  const newBlock = {
    _type: 'teamsTransformedBlock',
    _key: `teamsTransformed-${Math.random().toString(36).slice(2, 8)}`,
    heading: HEADING,
    subheading: SUBHEADING,
    tabs: withKeys(
      TABS.map((tab) => ({
        label: tab.label,
        ...(tab.subheading ? { subheading: tab.subheading } : {}),
        items: withKeys(tab.items),
      }))
    ),
  }

  // Replace existing teamsTransformedBlock or insert after last testimonialBlock
  const existingIdx = blocks.findIndex((b) => b._type === 'teamsTransformedBlock')
  if (existingIdx >= 0) {
    blocks[existingIdx] = { ...newBlock, _key: blocks[existingIdx]._key }
    console.log(`Replacing existing teamsTransformedBlock at index ${existingIdx}`)
  } else {
    let insertAt = blocks.length
    for (let i = blocks.length - 1; i >= 0; i--) {
      if (blocks[i]._type === 'testimonialBlock') {
        insertAt = i + 1
        break
      }
    }
    blocks.splice(insertAt, 0, newBlock)
    console.log(`Inserted teamsTransformedBlock at index ${insertAt} of ${blocks.length}`)
  }

  await writeClient.patch(homePage._id).set({ contentBlocks: blocks }).commit()
  console.log('✓ homePage.contentBlocks updated')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
