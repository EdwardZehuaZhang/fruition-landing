/**
 * Populate Sanity fields for the n8n-integration-partner partnershipPage doc
 * so the frontend can stop falling back to hardcoded constants and inline
 * JSX strings.
 *
 * Idempotent — re-running patches the existing doc; fields already set in
 * Sanity Studio are preserved (we use setIfMissing for "soft" defaults and
 * .set() only for things that need to match the current frontend exactly).
 *
 *   pnpm tsx scripts/sanity-migrate/n8n-integration-partner.ts
 */
import { writeClient, withKeys } from './lib'

const SLUG = 'n8n-integration-partner'
const TYPE = 'partnershipPage'

const PROVEN_STATS = [
  { emoji: '👤', value: '200k+', body: 'users trust n8n to handle their AI automations worldwide' },
  { emoji: '🔌', value: '1,000+', body: 'integration opportunities to enhance your operations' },
  { emoji: '⏱️', value: '85%', body: 'average time savings on manual tasks and workflows' },
]

const CHALLENGES_ITEMS = [
  {
    number: '01',
    title: 'Productivity & Efficiency',
    description:
      'Without automation tools, your organisation faces slower processing times and increased errors compared to AI-powered competitors. By connecting intelligent AI agents to n8n workflows, you can automate repetitive grunt work and empower employees to focus on strategic, creative initiatives.',
  },
  {
    number: '02',
    title: 'Costly Operations',
    description:
      'n8n workflow automation drastically reduces labor costs and operational inefficiencies. Automate complex processes like invoice processing, financial forecasting, and data analysis while reducing manual intervention requirements.',
  },
  {
    number: '03',
    title: 'Data Accuracy and Decision Making',
    description:
      "Ensure greater accuracy in your business workflows with n8n's enterprise automation platform. Advanced automations enable efficient data gathering and analysis, minimising risks associated with manual data processing and enabling more informed, data-driven decision-making.",
  },
  {
    number: '04',
    title: 'Adaptability and Scalability',
    description:
      'n8n automation systems scale effortlessly to handle growing workloads without requiring significant resource increases. The platform helps organisations adapt to changing business conditions while optimising processes and automating business logic without limitations.',
  },
]

const SOLUTIONS_ITEMS = [
  {
    number: '01',
    title: 'Visual Workflow Editor',
    description:
      'n8n uses a drag-and-drop interface to build workflows, making designing complex automation processes intuitive. Seeing your workflows visually enables your users to easily understand and debug their automation processes. You can create workflows with branching, merging, and iteration capabilities.',
  },
  {
    number: '02',
    title: 'Extensive Integration Options',
    description:
      "n8n supports over 500 integrations, including popular platforms like HubSpot and ClearBit. n8n offers a wide range of pre-built nodes for connecting to various services and APIs, facilitating seamless data exchange between different platforms. Users can also create custom nodes to extend n8n's functionality and integrate with any service that has an API.",
  },
  {
    number: '03',
    title: 'On-Premise Deployment and Security',
    description:
      'On n8n, you have the option to self-host the platform, giving you full control over your data and infrastructure. Self-hosting ensures data privacy and security, which is particularly important if you are in a regulated industry. n8n also provides features like SSO, encrypted credentials store, and role-based access control (RBAC) for enhanced security.',
  },
  {
    number: '04',
    title: 'AI-Native Features',
    description:
      'n8n integrates with AI tools, enabling intelligent workflows and advanced automation capabilities.',
  },
]

const COMPARISON_TABS_FULL = [
  {
    label: 'Top Challenges',
    items: withKeys(CHALLENGES_ITEMS),
  },
  {
    label: 'n8n Solutions',
    items: withKeys(SOLUTIONS_ITEMS),
  },
]

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  // .set() the things that need to match the existing frontend exactly
  // (comparison section copy + the 2-tab layout the component currently
  // renders), and setIfMissing for soft defaults.
  await writeClient
    .patch(existing._id)
    .set({
      comparisonHeading:
        'Streamline Operations & Maximise Efficiency on monday.com with n8n Solutions',
      comparisonSubheading:
        'We transform fragmented business processes into cohesive, automated systems that enhance team collaboration and deliver measurable ROI across your entire organisation.',
      comparisonTabs: withKeys(COMPARISON_TABS_FULL),
    })
    .setIfMissing({
      provenStats: withKeys(PROVEN_STATS),
      logoCloudHeadingPart1: 'Clients who have used our ',
      logoCloudHeadingAccent: 'monday.com consulting services',
      faqHeading: 'Frequently asked questions',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
