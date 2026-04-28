/**
 * Update monday-crm-consulting comparisonTabs with new structured content
 * (per-item bulleted lists with emoji prefixes for tabs 1 & 2).
 *
 * Run with:  pnpm tsx scripts/sanity-migrate/update-monday-crm-tabs.ts
 */
import { writeClient, withKeys } from './lib'

const SLUG = 'monday-crm-consulting'

const comparisonHeading = 'Implement monday CRM for any team'

const comparisonTabs = withKeys([
  {
    _type: 'comparisonTab',
    label: 'Why monday.com for Your CRM Needs',
    items: withKeys([
      {
        _type: 'comparisonItem',
        number: '01',
        title: 'Customized to Your Sales Cycle',
        description: '',
        bullets: withKeys([
          { _type: 'bullet', emoji: '⚙️', text: "Easily tailor your CRM to work for you, without any development help" },
          { _type: 'bullet', emoji: '✏️', text: "Edit deal stages and add as many columns as you'd like" },
          { _type: 'bullet', emoji: '🔄', text: 'Manage multiple pipelines at once' },
          { _type: 'bullet', emoji: '📊', text: 'Gain insights through advanced reporting' },
          { _type: 'bullet', emoji: '🎯', text: 'Set up automated workflows that trigger based on your unique deal progression' },
        ]),
      },
      {
        _type: 'comparisonItem',
        number: '02',
        title: 'Maximize Engagement with Every Contact',
        description: '',
        bullets: withKeys([
          { _type: 'bullet', emoji: '🏢', text: 'Centralise customer data for a holistic view' },
          { _type: 'bullet', emoji: '📧', text: 'Efficiently reach contacts at every stage of your pipeline with the right message' },
          { _type: 'bullet', emoji: '🤖', text: 'Personalised sequences, mass emailing & tracking, and AI email writing' },
          { _type: 'bullet', emoji: '📝', text: 'Keep record of your contact and account information, log activities, and send emails — all from one place' },
          { _type: 'bullet', emoji: '🤝', text: 'Enhanced team collaboration' },
        ]),
      },
      {
        _type: 'comparisonItem',
        number: '03',
        title: 'Pre-Sales to Post-Sales All in One Place',
        description: '',
        bullets: withKeys([
          { _type: 'bullet', emoji: '🔧', text: 'Customisable CRM workflows and dashboards' },
          { _type: 'bullet', emoji: '👥', text: 'User-friendly interface for quick adoption' },
          { _type: 'bullet', emoji: '🔗', text: 'Robust CRM integrations with popular tools' },
          { _type: 'bullet', emoji: '📈', text: 'Scalable CRM solution for growing businesses' },
          { _type: 'bullet', emoji: '☁️', text: 'Secure and reliable cloud-based CRM infrastructure' },
        ]),
      },
    ]),
  },
  {
    _type: 'comparisonTab',
    label: 'monday.com CRM Features',
    items: withKeys([
      {
        _type: 'comparisonItem',
        number: '01',
        title: 'Lead Management Solutions',
        description: '',
        bullets: withKeys([
          { _type: 'bullet', emoji: '📝', text: 'Add leads with item creation forms to improve efficiency' },
          { _type: 'bullet', emoji: '🌐', text: 'Collect leads from any source' },
          { _type: 'bullet', emoji: '🎯', text: 'Centralise and qualify every lead in one place' },
          { _type: 'bullet', emoji: '⭐', text: 'Automatically score leads based on custom criteria' },
        ]),
      },
      {
        _type: 'comparisonItem',
        number: '02',
        title: 'Deal Management',
        description: '',
        bullets: withKeys([
          { _type: 'bullet', emoji: '⚙️', text: 'Customise your pipeline without the need for a developer' },
          { _type: 'bullet', emoji: '🖱️', text: 'Drag and drop deals between stages' },
          { _type: 'bullet', emoji: '🤖', text: 'Automate manual work' },
          { _type: 'bullet', emoji: '👁️', text: 'Easily track all contact interactions' },
        ]),
      },
      {
        _type: 'comparisonItem',
        number: '03',
        title: 'Post-Sales Management',
        description: '',
        bullets: withKeys([
          { _type: 'bullet', emoji: '🏠', text: 'Manage your post-sale activities in one place' },
          { _type: 'bullet', emoji: '📋', text: 'Stay on top of client projects' },
          { _type: 'bullet', emoji: '💰', text: 'Collection tracking' },
          { _type: 'bullet', emoji: '📞', text: 'Monitor customer satisfaction and retention metrics' },
        ]),
      },
      {
        _type: 'comparisonItem',
        number: '04',
        title: 'Sales Operations',
        description: '',
        bullets: withKeys([
          { _type: 'bullet', emoji: '👥', text: 'Plan and fast-track your sales hiring process' },
          { _type: 'bullet', emoji: '🛠️', text: 'Equip your sales team with the tools and resources they need to close more deals' },
          { _type: 'bullet', emoji: '📊', text: 'Track sales performance and team productivity metrics' },
          { _type: 'bullet', emoji: '⚡', text: 'Optimise sales processes through data-driven insights' },
        ]),
      },
    ]),
  },
  {
    _type: 'comparisonTab',
    label: 'Our Approach',
    items: withKeys([
      {
        _type: 'comparisonItem',
        number: '01',
        title: 'Process Discovery → Business Process Audit',
        description:
          'Our certified monday.com consultants meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
      },
      {
        _type: 'comparisonItem',
        number: '02',
        title: 'Technical Architecture → System Integration Scope',
        description:
          'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
      },
      {
        _type: 'comparisonItem',
        number: '03',
        title: 'Solution design → Workflow and Integration Implementation',
        description:
          "Through in-depth solution design analysis, we implement the perfect balance between automated system sophistication and user adoption, ensuring your solution is scalable and grows with your team's expertise.",
      },
      {
        _type: 'comparisonItem',
        number: '04',
        title: 'Efficiency Impact → ROI Opportunity Analysis',
        description:
          'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
      },
      {
        _type: 'comparisonItem',
        number: '05',
        title: 'Change Readiness → Adoption Strategy Planning',
        description:
          'Our proven change impact framework measures organisational readiness and crafts a tailored adoption strategy, turning potential resistance into enthusiastic system adoption.',
      },
    ]),
  },
])

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "servicePage" && slug.current == $slug][0]{_id}`,
    { slug: SLUG }
  )

  if (!existing?._id) {
    throw new Error(`servicePage with slug "${SLUG}" not found`)
  }

  console.log(`✎ patching servicePage:${SLUG} (${existing._id})`)
  await writeClient
    .patch(existing._id)
    .set({ comparisonHeading, comparisonTabs })
    .commit()

  console.log('✓ done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
