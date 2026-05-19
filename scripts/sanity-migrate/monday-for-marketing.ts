/**
 * Populate Sanity fields for the monday-for-marketing industryPage doc
 * so the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — re-running patches the existing doc; fields already set in
 * Sanity Studio are preserved (we use setIfMissing for everything).
 *
 *   pnpm tsx scripts/sanity-migrate/monday-for-marketing.ts
 */
import { writeClient, withKeys } from './lib'

const SLUG = 'monday-for-marketing'
const TYPE = 'industryPage'

const WHY_TABS = [
  {
    label: 'Why monday.com for Marketing & Creative?',
    items: withKeys([
      {
        number: '01',
        title: 'Streamline Your Process from Idea to Delivery',
        description:
          '🎯 Set goals and strategy\n📋 Plan project goals, tasks, and resources\n⏰ Oversee due dates, assign tasks, and more\n🚀 Deliver on time and within budget\n📊 Measure marketing impact',
      },
      {
        number: '02',
        title: 'Run Efficient Campaigns',
        description:
          '🤝 Keep every stakeholder aligned on campaign progress\n💰 Ensure all campaigns are on budget and on time\n👁️ Maintain full visibility of campaign performance metrics\n🔍 Get a clear overview of every stage of the campaign process\n🔗 Connect and report from your ads sources and other essential marketing data',
      },
      {
        number: '03',
        title: 'Simplify Approval Processes',
        description:
          '⚡ Automate key parts of the approval process\n🔄 Keep the entire team up to date\n✂️ Eliminate the need for frequent checkups, emails, and update meetings\n⏳ Save valuable time, so you can focus on the creative work itself',
      },
    ]),
  },
  {
    label: 'Marketing & Creative Features',
    items: withKeys([
      { number: '01', title: '📝 Proofing and Approval', description: 'Streamline the content review and approval process directly inside monday.com with the PageProof app, no matter the file type.' },
      { number: '02', title: '💬 Annotations and Live Feedback', description: 'Shorten feedback loops with contextual annotations directly on your files, and communicate with stakeholders with updates and notifications.' },
      { number: '03', title: '📁 File Versioning', description: 'Stay updated on the latest version. Track files connected to tasks and projects from latest to oldest. Add and delete versions, preview, download, and add annotations directly on file for quick feedback.' },
      { number: '04', title: '📊 Robust Gantt for Campaign Planning', description: 'Plan and monitor marketing work, from campaigns to complex projects, with robust Gantt charts.' },
      { number: '05', title: '⚙️ Marketing Automations', description: 'Automate repetitive marketing work with customisable automations to improve efficiency, allowing teams to free up time to focus on the work that matters.' },
      { number: '06', title: '🗂️ Asset Management', description: 'Store, organize, and share all marketing digital assets in one centralised location.' },
    ]),
  },
  {
    label: 'How We Can Help',
    items: withKeys([
      { number: '01', title: 'Assess Your Needs', description: '🎯 Identify your marketing goals\n📝 List your specific requirements\n🔍 Analyse current workflow challenges' },
      { number: '02', title: 'Design Your Process', description: '⚙️ Create workflows tailored to your marketing tasks\n🗺️ Map out how information will flow in the system\n📋 Define roles and responsibilities' },
      { number: '03', title: 'Set Up monday.com', description: '🔧 Configure custom workflows\n🤖 Set up automations and permissions\n📤 Transfer existing data (if any)' },
      { number: '04', title: 'Train Your Team', description: '🎓 Teach staff how to use monday.com\n🖐️ Provide hands-on practice sessions\n📚 Create user documentation and guides' },
      { number: '05', title: 'Launch the System', description: '📊 Roll out monday.com to your organisation\n💬 Offer on-going support during the transition\n🎉 Celebrate successful implementation milestones' },
      { number: '06', title: 'Keep Improving', description: '👁️ Monitor how well monday.com is working\n🔄 Make adjustments as needed\n🤝 Get ongoing support to optimise your marketing operations.' },
    ]),
  },
]

const WHY_BEST_CARDS = [
  { emoji: '📋', title: 'Campaign Management', description: 'Keep all your marketing campaigns organised and on track with centralised project visibility.' },
  { emoji: '✏️', title: 'Content Planning & Creation', description: 'A centralised space to brainstorm ideas, plan content calendars, and collaborate seamlessly on content creation.' },
  { emoji: '📱', title: 'Social Media Management', description: 'Schedule posts, track engagement metrics, and monitor social media campaigns across all platforms.' },
  { emoji: '🎯', title: 'Lead Generation & Tracking', description: 'Create custom forms and integrate them with your website to ensure smooth lead generation processes.' },
  { emoji: '📊', title: 'Analytics & Reporting', description: 'Gain valuable insights into your marketing performance with comprehensive data tracking and visualisation.' },
  { emoji: '🤝', title: 'Collaboration & Communication', description: 'Enable seamless communication and foster effective teamwork for successful marketing campaign execution.' },
  { emoji: '💰', title: 'Budget Tracking', description: 'Track expenses, monitor costs, and maintain financial visibility to maximise your return on investment.' },
  { emoji: '🔗', title: 'Integration Power', description: 'Sync data, automate workflows, and streamline marketing operations by connecting all your essential tools.' },
  { emoji: '⚡', title: 'Agile Marketing Workflows', description: 'Adapt quickly to changing market trends and customer needs with flexible, agile marketing workflows.' },
]

const MARKETING_CASE_STUDY_CARDS = [
  {
    title: 'Proofing & Approval Workflow',
    description:
      "Reviewing and approving work shouldn't slow you down. With this use case, promote better teamwork by managing and tracking all proofs in one place. Results: 22% faster proofing & approval time · 15% fewer errors · 49% increase in deliverables.",
    videoUrl: 'https://www.youtube.com/watch?v=Nw-0h8OkO1A',
  },
  {
    title: 'Multi-Platform Campaign Management',
    description:
      'Managing campaigns on multiple platforms causes critical delays. With this use case, launch, manage, and track all marketing campaigns in one place. Results: 19% reduction in budget overspend · 14% faster launch time · 3× more campaigns launched.',
    videoUrl: 'https://www.youtube.com/watch?v=RXI2hNxZAIQ',
  },
]

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    .setIfMissing({
      // Hero / partner badge
      heroPartnerImagePath: '/monday-marketing-partner.avif',

      // Comparison tabs section
      comparisonHeading: 'Why monday.com for Marketing & Creative?',
      comparisonTabs: withKeys(WHY_TABS),

      // Marketing case studies
      caseStudySectionHeading: 'Marketing Case Studies',
      marketingCaseStudyCards: withKeys(MARKETING_CASE_STUDY_CARDS),

      // Why-best cards
      whyBestCards: withKeys(WHY_BEST_CARDS),

      // Testimonial CTA banner CTA label
      testimonialBannerPrimaryCtaLabel: '🚀 Start Your Transformation',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
