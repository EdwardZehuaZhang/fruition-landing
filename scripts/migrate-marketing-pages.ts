import { writeClient } from './sanity-client'

const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'
const CAREERS_FORM = 'https://forms.monday.com/forms/embed/f607650db2b9c18ef8235817de24958a?r=apse2'

const imageCache = new Map<string, any>()

async function uploadImageFromUrl(url: string, filename: string) {
  if (imageCache.has(url)) return imageCache.get(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || undefined
  const asset = await writeClient.assets.upload('image', buffer, { filename, contentType })
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  imageCache.set(url, ref)
  console.log(`  uploaded ${filename}`)
  return ref
}

function ext(url: string): string {
  const m = url.match(/\.(png|jpe?g|webp|gif|avif|svg)(\?|~|$)/i)
  return m ? `.${m[1].toLowerCase()}` : '.png'
}

async function migrateAboutUs() {
  console.log('\n→ about-us')
  const heroImage = await uploadImageFromUrl(
    'https://static.wixstatic.com/media/00f73d_29018639f29f4a29bb823829414a20d4~mv2.png',
    `about-us-hero${ext('.png')}`,
  )

  const doc = {
    _id: 'page-about-us',
    _type: 'page',
    title: 'About Us',
    slug: { _type: 'slug', current: 'about-us' },
    pageType: 'about',
    seoTitle: "About Us | Fruition Services — Platinum monday.com Partner",
    seoDescription:
      "Fruition is a Platinum monday.com, Atlassian and Make consulting partner with 500+ implementations across Australia, the UK and US.",
    heroHeading: "500+ clients globally use Fruition's monday.com implementation consultants",
    heroSubheading:
      'Authorised monday.com, Atlassian and Make consulting, implementation and integration partner consultants across Australia, the UK and the US.',
    heroImage,
    primaryCtaLabel: '🚀 Schedule a Consultation',
    primaryCtaUrl: CALENDLY,

    // Capabilities — leadership challenges
    capabilitiesHeading: 'Top leadership challenges Fruition solves',
    capabilitiesCards: [
      { _key: 'cap-au-0', _type: 'capabilityCard', emoji: '📈', title: 'Market Volatility', description: 'Real-time project visibility and reporting capabilities enable quick pivots in strategy and resource allocation for data-driven decisions.' },
      { _key: 'cap-au-1', _type: 'capabilityCard', emoji: '🤖', title: 'AI & Automation', description: 'Implementation requires careful change management to boost efficiency while managing resistance through streamlined workflows and AI-powered insights.' },
      { _key: 'cap-au-2', _type: 'capabilityCard', emoji: '🏢', title: 'Hybrid Work Models', description: 'Balance in-office and remote dynamics with robust digital collaboration tools and standardised processes.' },
      { _key: 'cap-au-3', _type: 'capabilityCard', emoji: '👥', title: 'Talent Retention', description: 'Engaging work environments with clear growth paths, balanced workloads, and opportunities for skill development.' },
      { _key: 'cap-au-4', _type: 'capabilityCard', emoji: '🔒', title: 'Cybersecurity', description: 'Integrate security into project workflows through secure access controls, compliant data handling and protected collaboration tools.' },
    ],

    // Comparison tabs — leadership vs team challenges
    comparisonHeading: 'Why teams partner with Fruition',
    comparisonSubheading: 'How a Platinum monday.com partnership transforms day-to-day work for both leaders and teams.',
    comparisonTabs: [
      {
        _key: 'ct-au-0',
        _type: 'comparisonTab',
        label: 'For Leaders',
        items: [
          { _key: 'ct0-i-0', _type: 'comparisonItem', number: '01', title: '📊 Real-time Project Visibility', description: 'Pivot strategy and resource allocation faster with data-driven decisions.' },
          { _key: 'ct0-i-1', _type: 'comparisonItem', number: '02', title: '🤖 Change-Managed AI Adoption', description: 'Boost efficiency with AI-powered workflows while managing resistance through structured rollouts.' },
          { _key: 'ct0-i-2', _type: 'comparisonItem', number: '03', title: '🏢 Hybrid-Ready Operations', description: 'Standardise processes and digital collaboration so distributed teams stay aligned.' },
          { _key: 'ct0-i-3', _type: 'comparisonItem', number: '04', title: '🔒 Secure Collaboration', description: 'Compliant data handling, access controls and protected workflows built into every implementation.' },
        ],
      },
      {
        _key: 'ct-au-1',
        _type: 'comparisonTab',
        label: 'For Teams',
        items: [
          { _key: 'ct1-i-0', _type: 'comparisonItem', number: '01', title: '🤝 Hybrid Collaboration', description: 'Strategic tool selection that integrates remote and in-office workflows with clear communication and balanced workloads.' },
          { _key: 'ct1-i-1', _type: 'comparisonItem', number: '02', title: '🎓 Digital Adaptation', description: 'Comprehensive training programs minimise productivity dips, with expert guidance and practical approaches.' },
          { _key: 'ct1-i-2', _type: 'comparisonItem', number: '03', title: '⚖️ Work-Life Integration', description: 'Intelligent automation of routine tasks frees team members for high-value work.' },
          { _key: 'ct1-i-3', _type: 'comparisonItem', number: '04', title: '🚀 Personal Development', description: 'Process-optimisation skills empower team members to identify inefficiencies and implement improved systems.' },
          { _key: 'ct1-i-4', _type: 'comparisonItem', number: '05', title: '🔗 Team Cohesion', description: 'Unified communication platforms create transparency and maintain connections across locations.' },
        ],
      },
    ],

    // Methodology
    methodologyHeading: 'Our solution approach',
    methodologySteps: [
      { _key: 'meth-au-0', _type: 'methodologyStep', number: '01', title: 'Process Discovery → Business Process Audit', description: 'Map existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hinder scalability.' },
      { _key: 'meth-au-1', _type: 'methodologyStep', number: '02', title: 'Technical Architecture → System Integration Scope', description: 'Reveal hidden potential in your current tech stack and identify precise automated solution design for workflow transformation.' },
      { _key: 'meth-au-2', _type: 'methodologyStep', number: '03', title: 'Solution Design → Implementation', description: 'Build systems balancing automated sophistication with user adoption — for faster setup and team usage.' },
      { _key: 'meth-au-3', _type: 'methodologyStep', number: '04', title: 'Efficiency Impact → ROI Opportunity Analysis', description: 'Quantify potential efficiency gains across operations, pinpointing where automation delivers the highest return.' },
      { _key: 'meth-au-4', _type: 'methodologyStep', number: '05', title: 'Change Readiness → Adoption & Training', description: 'A change-impact framework measures organisational readiness and crafts a tailored adoption strategy that converts resistance into adoption.' },
    ],

    calendlyHeading: 'Schedule a 30-min consultation with one of our monday.com consultants',
    calendlySubheading:
      'Talk to our team about your monday.com, Atlassian or Make rollout — implementation, integration, automation or training.',

    faqTabs: [
      {
        _key: 'faq-au-0',
        _type: 'faqTab',
        label: 'About Fruition',
        items: [
          { _key: 'faq0-q-0', _type: 'faqPair', question: 'What does Fruition do?', answer: "Fruition is a Platinum monday.com partner that builds automated business solutions integrating seamlessly into existing systems — helping companies work faster, smarter and more affordably across CRM, project management, automations and integrations." },
          { _key: 'faq0-q-1', _type: 'faqPair', question: 'Where is Fruition located?', answer: 'We have offices in Sydney (head office), New York, London, Singapore and India — and serve clients across Australia, the UK, the US, Southeast Asia and beyond.' },
          { _key: 'faq0-q-2', _type: 'faqPair', question: 'Which platforms does Fruition implement?', answer: 'We are certified partners across monday.com (Platinum), Atlassian, Make, n8n, ClickUp, HubSpot, Guidde, Aircall and Hootsuite.' },
          { _key: 'faq0-q-3', _type: 'faqPair', question: 'How quickly can we get started?', answer: 'Standard implementations begin within days of our discovery call. Larger enterprise rollouts are scoped against a phased plan with clear milestones from day one.' },
        ],
      },
    ],

    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ organisations',
    joinHeadingPart2: ' that have maximised their workflows with Fruition',
    joinSubheading: 'A decade of monday.com delivery across five countries.',
    joinStats: [
      { _key: 'stat-au-0', _type: 'stat', value: '10+', label: 'years experience' },
      { _key: 'stat-au-1', _type: 'stat', value: '1,050+', label: 'projects completed' },
      { _key: 'stat-au-2', _type: 'stat', value: '500+', label: 'satisfied clients' },
    ],
  }

  await writeClient.createOrReplace(doc)
  console.log('  ✓ wrote page-about-us')
}

async function migrateCareers() {
  console.log('\n→ careers')
  const heroImage = await uploadImageFromUrl(
    'https://static.wixstatic.com/media/00f73d_29018639f29f4a29bb823829414a20d4~mv2.png',
    `careers-hero${ext('.png')}`,
  )

  const doc = {
    _id: 'page-careers',
    _type: 'page',
    title: 'Careers',
    slug: { _type: 'slug', current: 'careers' },
    pageType: 'careers',
    seoTitle: "Careers at Fruition | Build Solutions That Matter",
    seoDescription:
      'Join a 100% remote, global team of monday.com, Atlassian and Make consultants. Build automated workflows for 500+ companies worldwide.',
    heroHeading: 'Build Solutions That Matter',
    heroSubheading:
      'At Fruition, we design solutions that simplify, scale and transform the way teams operate. As a Platinum monday.com partner, we tailor workflows, automations and integrations that turn software into a growth engine.',
    heroImage,
    primaryCtaLabel: '🚀 Join Us',
    primaryCtaUrl: CAREERS_FORM,

    // Why join Fruition
    capabilitiesHeading: 'Why join Fruition',
    capabilitiesCards: [
      { _key: 'cap-c-0', _type: 'capabilityCard', emoji: '💡', title: 'Work That Makes an Impact', description: "Every solution you build directly transforms how our clients operate. You'll see real-world impact — faster processes, happier teams and measurable ROI." },
      { _key: 'cap-c-1', _type: 'capabilityCard', emoji: '📈', title: 'Flexibility & Growth', description: "Join a team that values smart work. We're building something special with room to grow your career as we scale." },
      { _key: 'cap-c-2', _type: 'capabilityCard', emoji: '🎯', title: 'Upskill and Learn', description: 'Work alongside expert consultants passionate about automation and workflow optimisation. Sharpen skills on cutting-edge platforms while solving diverse business challenges.' },
      { _key: 'cap-c-3', _type: 'capabilityCard', emoji: '🤝', title: 'Client-Focused Culture', description: 'Success is measured by client success. Empowered to recommend the right solutions with autonomy and support for seamless implementation.' },
    ],

    // What we're looking for
    comparisonHeading: "What we're looking for",
    comparisonSubheading: 'The kinds of people who thrive at Fruition.',
    comparisonTabs: [
      {
        _key: 'ct-c-0',
        _type: 'comparisonTab',
        label: 'The Profile',
        items: [
          {
            _key: 'ct0-i-0', _type: 'comparisonItem', number: '01', title: '🧠 Problem-Solvers with a Consultant Mindset',
            bullets: [
              { _key: 'ct0-i0-b0', _type: 'bullet', emoji: '🎯', text: 'Translate complex business needs into elegant automated workflows' },
              { _key: 'ct0-i0-b1', _type: 'bullet', emoji: '🔍', text: 'Conduct thorough process audits to identify optimisation opportunities' },
              { _key: 'ct0-i0-b2', _type: 'bullet', emoji: '❓', text: 'Ask the right questions to uncover root causes, not just symptoms' },
            ],
          },
          {
            _key: 'ct0-i-1', _type: 'comparisonItem', number: '02', title: '⚙️ Technical Experts with a Human Touch',
            bullets: [
              { _key: 'ct0-i1-b0', _type: 'bullet', emoji: '🔌', text: 'Build seamless integrations that eliminate manual work' },
              { _key: 'ct0-i1-b1', _type: 'bullet', emoji: '🎨', text: 'Design custom workflows that teams actually want to use' },
              { _key: 'ct0-i1-b2', _type: 'bullet', emoji: '🚀', text: "Leverage monday.com's flexibility for scalable, cost-effective solutions" },
            ],
          },
          {
            _key: 'ct0-i-2', _type: 'comparisonItem', number: '03', title: '📚 Growth-Minded Professionals Who Love Learning',
            bullets: [
              { _key: 'ct0-i2-b0', _type: 'bullet', emoji: '🆕', text: 'Stay ahead of monday.com feature releases and best practices' },
              { _key: 'ct0-i2-b1', _type: 'bullet', emoji: '🧪', text: 'Experiment with new automation ideas to unlock efficiencies' },
              { _key: 'ct0-i2-b2', _type: 'bullet', emoji: '🤝', text: 'Share knowledge with teams, empowering them to innovate' },
            ],
          },
        ],
      },
      {
        _key: 'ct-c-1',
        _type: 'comparisonTab',
        label: '100% Remote',
        items: [
          { _key: 'ct1-i-0', _type: 'comparisonItem', number: '01', title: '🌍 Work From Anywhere', description: 'Fruition is a 100% remote company. Our consultants, developers and strategists collaborate across five countries — work from home, a café or wherever you do your best thinking.' },
          {
            _key: 'ct1-i-1', _type: 'comparisonItem', number: '02', title: '🇦🇺 🇺🇸 🇬🇧 🇸🇬 🇮🇳 Global Footprint',
            bullets: [
              { _key: 'ct1-i1-b0', _type: 'bullet', emoji: '🇦🇺', text: 'Sydney (Head Office) — 64 York Street, NSW 2000' },
              { _key: 'ct1-i1-b1', _type: 'bullet', emoji: '🇺🇸', text: 'New York (North America) — 205 W 37th St, NY 10018' },
              { _key: 'ct1-i1-b2', _type: 'bullet', emoji: '🇬🇧', text: 'London (EMEA) — Medius House, 2 Sheraton St, W1F 8BH' },
              { _key: 'ct1-i1-b3', _type: 'bullet', emoji: '🇸🇬', text: 'Singapore (South-East Asia)' },
              { _key: 'ct1-i1-b4', _type: 'bullet', emoji: '🇮🇳', text: 'India (South Asia)' },
            ],
          },
          {
            _key: 'ct1-i-2', _type: 'comparisonItem', number: '03', title: '🏠 Remote Benefits',
            bullets: [
              { _key: 'ct1-i2-b0', _type: 'bullet', emoji: '🏠', text: 'Work from home (or anywhere)' },
              { _key: 'ct1-i2-b1', _type: 'bullet', emoji: '⏰', text: 'Flexible hours' },
              { _key: 'ct1-i2-b2', _type: 'bullet', emoji: '✈️', text: 'No relocation required' },
              { _key: 'ct1-i2-b3', _type: 'bullet', emoji: '🌐', text: 'Global team collaboration' },
              { _key: 'ct1-i2-b4', _type: 'bullet', emoji: '📅', text: 'Async-friendly culture' },
            ],
          },
        ],
      },
    ],

    calendlyHeading: 'Apply to join the Fruition team',
    calendlySubheading:
      "Open roles span monday.com implementation consultants, automation engineers, technical project managers and sales engineers. Don't see your role? Submit anyway — we hire continuously.",

    faqTabs: [
      {
        _key: 'faq-c-0',
        _type: 'faqTab',
        label: 'Careers FAQs',
        items: [
          { _key: 'faq0-q-0', _type: 'faqPair', question: 'How long does a monday.com implementation take?', answer: 'Timeline depends on workflow and integration complexity. Standard setups take 2–4 weeks; enterprise implementations with advanced automations, dashboards and integrations may take 6–12 weeks.' },
          { _key: 'faq0-q-1', _type: 'faqPair', question: 'What does a monday.com implementation consultant do?', answer: 'Consultants translate processes into scalable workflows, design custom automations, build third-party integrations, set up dashboards, train teams and ensure user adoption for measurable ROI.' },
          { _key: 'faq0-q-2', _type: 'faqPair', question: 'What is included in a monday.com implementation package?', answer: 'Typical packages include workflow design, automation setup, system integrations (CRM, ERP, HR tools), user training, change management planning and post-launch optimisation.' },
          { _key: 'faq0-q-3', _type: 'faqPair', question: 'Why hire a monday.com implementation partner?', answer: 'Certified partners ensure faster setup, fewer errors and customised workflows tailored to your industry — bringing expertise in process mapping, automation and adoption strategies.' },
          { _key: 'faq0-q-4', _type: 'faqPair', question: 'How do I become a monday.com consultant or certified expert?', answer: 'Complete monday.com certification programs, demonstrate hands-on experience building workflows and automations, and work with certified partners to gain implementation expertise.' },
          { _key: 'faq0-q-5', _type: 'faqPair', question: 'Which industries benefit most from monday.com consulting services?', answer: 'Construction, manufacturing, professional services, marketing, government and retail benefit most — consultants optimise workflows to reduce inefficiencies and centralise project management.' },
        ],
      },
    ],

    joinHeadingPart1: 'Join a ',
    joinHeadingAccent: '100% remote',
    joinHeadingPart2: ' team across 5 countries',
    joinSubheading: 'Trusted by 500+ companies worldwide to transform how they work.',
    joinStats: [
      { _key: 'stat-c-0', _type: 'stat', value: '500+', label: 'companies trust Fruition' },
      { _key: 'stat-c-1', _type: 'stat', value: '5', label: 'countries we work from' },
      { _key: 'stat-c-2', _type: 'stat', value: '7', label: 'platforms we are certified on' },
      { _key: 'stat-c-3', _type: 'stat', value: '100%', label: 'remote, async-friendly culture' },
    ],
  }

  await writeClient.createOrReplace(doc)
  console.log('  ✓ wrote page-careers')
}

async function main() {
  console.log('Migrating about-us and careers...')
  await migrateAboutUs()
  await migrateCareers()
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
