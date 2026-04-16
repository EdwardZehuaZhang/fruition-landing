import { writeClient } from './sanity-client'

const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'
const MONDAY_CRM = 'https://monday.com/lang/en-au/crm'

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

function extensionOf(url: string): string {
  const m = url.match(/\.(png|jpe?g|webp|gif|avif|svg)(\?|~|$)/i)
  return m ? `.${m[1].toLowerCase()}` : '.png'
}

type CapabilityCard = { emoji: string; title: string; description: string }
type Bullet = { emoji: string; text: string }
type ComparisonItem = { number: string; title: string; description?: string; bullets?: Bullet[] }
type ComparisonTab = { label: string; items: ComparisonItem[] }
type MethodologyStep = { number: string; title: string; description: string }
type FaqPair = { question: string; answer: string }
type FaqTab = { label: string; items: FaqPair[] }
type Stat = { value: string; label: string }

interface LocationPage {
  slug: string
  title: string
  country: string
  region: string
  heroImageUrl?: string
  heroHeading: string
  heroSubheading: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  seoTitle: string
  seoDescription: string
  capabilitiesHeading?: string
  capabilitiesCards?: CapabilityCard[]
  comparisonHeading?: string
  comparisonSubheading?: string
  comparisonTabs?: ComparisonTab[]
  methodologyHeading?: string
  methodologySteps?: MethodologyStep[]
  calendlyHeading?: string
  calendlySubheading?: string
  faqTabs?: FaqTab[]
  joinHeadingPart1?: string
  joinHeadingAccent?: string
  joinHeadingPart2?: string
  joinSubheading?: string
  joinStats?: Stat[]
  joinFootnote?: string
}

// ────────────────────────────────────────────────────────────────────
// Shared content (identical across all 5 location pages on the live site)
// ────────────────────────────────────────────────────────────────────

const SHARED_METHODOLOGY: MethodologyStep[] = [
  {
    number: '01',
    title: 'Process Discovery → Business Process Audit',
    description:
      'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
  },
  {
    number: '02',
    title: 'Technical Architecture → System Integration Scope',
    description:
      'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
  },
  {
    number: '03',
    title: 'Solution Design → Implementation',
    description:
      'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.',
  },
  {
    number: '04',
    title: 'Efficiency Impact → ROI Opportunity Analysis',
    description:
      'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
  },
  {
    number: '05',
    title: 'Change Readiness → Adoption & Training Strategies',
    description:
      'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.',
  },
]

const SHARED_FAQ: FaqTab[] = [
  {
    label: 'monday.com FAQs',
    items: [
      {
        question: 'Does monday.com have a CRM?',
        answer:
          'Yes — monday.com CRM is a flexible and highly customisable cloud-based CRM platform suitable for businesses of all sizes.',
      },
      {
        question: 'Does monday.com have task management?',
        answer:
          "Yes. Trial monday Work Management and discover how efficiently you can manage your teams' to-do list, deadlines and dependencies.",
      },
      {
        question: 'Why is monday.com so successful?',
        answer:
          "Highly customisable workflows and automations, an extremely user-friendly interface, a visual/agile/scalable design, and versatility — projects, CRM, ad campaigns, bug tracking and video production all in one tool.",
      },
      {
        question: 'What exactly does monday.com do?',
        answer:
          "monday.com is one of the most versatile work platforms on the market. Use it to manage projects, run a CRM, manage ad campaigns, track bugs, and manage video production — all on a single platform.",
      },
    ],
  },
]

const SHARED_FORRESTER_STATS: Stat[] = [
  { value: '288%', label: 'ROI (Forrester)' },
  { value: '15,600', label: 'hours saved' },
  { value: '50%', label: 'meeting reduction' },
  { value: '$489,794', label: 'net value' },
]

const SHARED_CALENDLY_HEADING = 'Book a 30-min consultation with a monday.com expert'
const SHARED_CALENDLY_SUBHEADING =
  'Schedule a personalised monday.com demo with our certified consultants to discover how the platform can be customised for your specific business needs.'

// ────────────────────────────────────────────────────────────────────
// Per-page content
// ────────────────────────────────────────────────────────────────────

const pages: LocationPage[] = [
  // ── Australia ─────────────────────────────────────────────────────
  {
    slug: 'monday-partner-australia',
    title: 'monday.com Partner Australia',
    country: 'Australia',
    region: 'APAC',
    heroImageUrl: 'https://static.wixstatic.com/media/d6e205_c99f695447c04c9680ec4f77f91cc35e~mv2.png',
    heroHeading: 'monday.com Consultants & Implementation Experts Australia',
    heroSubheading:
      'Get a Certified monday.com Platinum Partner and expert consultant to handle your entire monday CRM implementation and integration. Servicing 500+ clients across Sydney, Brisbane, Melbourne, Adelaide and Perth — get running in days, not months.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com Partner Australia | Platinum Implementation Experts | Fruition',
    seoDescription:
      'Fruition is a Platinum monday.com partner in Australia. Expert consultants across Sydney, Melbourne, Brisbane, Adelaide and Perth.',
    capabilitiesHeading: 'Top leadership challenges across Australian businesses',
    capabilitiesCards: [
      { emoji: '🏢', title: 'Hybrid Work Compliance', description: 'Integrate remote and office workflows while meeting Fair Work Act requirements and maintaining team coordination across Australian locations.' },
      { emoji: '🎓', title: 'Digital Training Excellence', description: 'Accelerate technology adoption with expert-led programmes that minimise productivity disruptions for Australian teams.' },
      { emoji: '⚖️', title: 'Work-Life Balance Automation', description: 'Automate routine tasks to support Australian workplace wellness standards and enable focus on strategic work.' },
      { emoji: '🛠️', title: 'Process Optimisation Skills', description: 'Empower teams to identify inefficiencies and implement improvements that boost individual and organisational performance.' },
      { emoji: '🌏', title: 'Cross-Timezone Collaboration', description: "Maintain team cohesion and transparency across Australia's diverse geographic regions through unified platforms." },
    ],
    comparisonHeading: 'monday.com features built for Australian teams',
    comparisonSubheading: 'How monday.com transforms day-to-day work for businesses across Sydney, Melbourne, Brisbane and beyond.',
    comparisonTabs: [
      {
        label: 'monday.com Features',
        items: [
          { number: '01', title: '⚡ Save Time with Automations', description: 'Automated workflows on monday.com act as your dedicated process manager, continuously running in the background to keep initiatives moving seamlessly and productively.' },
          { number: '02', title: '📄 Centralised Documentation', description: 'Create rich documents directly within monday and embed real-time project information from any of your boards within those docs.' },
          { number: '03', title: '📊 Visualise with Dashboards & Charts', description: 'Turn project data into visually engaging, easily digestible information — simplifying analysis and improving decision-making with clear, actionable views.' },
          { number: '04', title: '🧩 Flexible Organisation', description: 'Organise projects using Agile or traditional methodologies popular across Melbourne, Sydney, and regional Australian business hubs.' },
          { number: '05', title: '🔌 Integrate with Other Tools', description: 'Keep all your data in monday.com and integrate with Xero, MYOB and Aircall to increase team alignment and improve business organisation.' },
        ],
      },
    ],
    methodologyHeading: 'Our expert consulting methodology',
    methodologySteps: SHARED_METHODOLOGY,
    calendlyHeading: SHARED_CALENDLY_HEADING,
    calendlySubheading: SHARED_CALENDLY_SUBHEADING,
    faqTabs: SHARED_FAQ,
    joinHeadingPart1: 'The economic impact of ',
    joinHeadingAccent: 'monday.com in Australia',
    joinHeadingPart2: '',
    joinSubheading: 'Independent Forrester research on the platform powering 500+ Australian teams.',
    joinStats: SHARED_FORRESTER_STATS,
    joinFootnote: 'Source: Forrester TEI study of monday.com.',
  },

  // ── United Kingdom ────────────────────────────────────────────────
  {
    slug: 'monday-partner-uk',
    title: 'monday.com Partner UK',
    country: 'United Kingdom',
    region: 'EMEA',
    heroImageUrl: 'https://static.wixstatic.com/media/d6e205_c99f695447c04c9680ec4f77f91cc35e~mv2.png',
    heroHeading: 'monday.com Certified Partner UK',
    heroSubheading:
      'Partner with certified monday.com consultants to build robust infrastructure and architecture for your business account. Our expert implementation services get your team operational immediately, eliminating the time and resources typically spent on trial-and-error setup.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com Certified Partner UK | London Implementation Experts | Fruition',
    seoDescription:
      'Fruition is a certified monday.com partner in the UK with consultants in London serving teams across England, Scotland, Wales and Northern Ireland.',
    capabilitiesHeading: 'Top leadership challenges across UK businesses',
    capabilitiesCards: [
      { emoji: '🏢', title: 'Hybrid Working Rights Compliance', description: 'Navigate UK Employment Rights Act and hybrid working legislation across London, Manchester, Birmingham and regional UK offices.' },
      { emoji: '🎓', title: 'Digital Skills Training for UK Teams', description: 'Accelerate digital transformation with comprehensive training programmes for UK businesses.' },
      { emoji: '⚖️', title: 'Work-Life Balance & Right to Disconnect', description: 'Enhance work-life integration through intelligent automation supporting UK workplace wellness regulations.' },
      { emoji: '📈', title: 'Professional Development & Upskilling', description: "Support the government's Lifetime Skills Guarantee by enabling staff to identify inefficiencies and implement enhanced systems." },
      { emoji: '🇬🇧', title: 'Cross-Regional Team Cohesion', description: 'Strengthen collaboration across England, Scotland, Wales, and Northern Ireland through unified platforms.' },
    ],
    comparisonHeading: 'monday.com features built for UK teams',
    comparisonSubheading: 'How monday.com powers work for businesses from the City of London to regional UK hubs.',
    comparisonTabs: [
      {
        label: 'monday.com Features',
        items: [
          { number: '01', title: '⚡ Save Time with Automations', description: 'Automated workflows on monday.com act as your dedicated process manager, continuously running in the background to keep initiatives moving seamlessly and productively.' },
          { number: '02', title: '🗂️ Document Management & Data Sovereignty', description: 'Create comprehensive business documents with real-time project data integration. Maintain UK data residency requirements and support Companies House filing obligations.' },
          { number: '03', title: '📊 Business Intelligence Dashboards', description: 'Transform operational data into insights supporting strategic decision-making, with KPIs aligned with UK GAAP accounting standards.' },
          { number: '04', title: '🧩 Agile Project Organisation', description: "Customise views for UK business frameworks across London's Silicon Roundabout, Manchester's digital corridor and Edinburgh's fintech sector." },
          { number: '05', title: '🔌 UK Software Integration', description: 'Integrate with Sage and Xero. Connect UK accounting software to maintain centralised workflows.' },
        ],
      },
    ],
    methodologyHeading: 'Our expert consulting methodology',
    methodologySteps: SHARED_METHODOLOGY,
    calendlyHeading: SHARED_CALENDLY_HEADING,
    calendlySubheading: SHARED_CALENDLY_SUBHEADING,
    faqTabs: SHARED_FAQ,
    joinHeadingPart1: 'The economic impact of ',
    joinHeadingAccent: 'monday.com in the UK',
    joinHeadingPart2: '',
    joinSubheading: 'Independent Forrester research on the platform behind UK teams choosing monday.com.',
    joinStats: SHARED_FORRESTER_STATS,
    joinFootnote: 'Source: Forrester TEI study of monday.com.',
  },

  // ── United States ─────────────────────────────────────────────────
  {
    slug: 'monday-partner-us',
    title: 'monday.com Partner US',
    country: 'United States',
    region: 'North America',
    heroImageUrl: 'https://static.wixstatic.com/media/a280a5_83aa7b006f4d4457bf93a43ed1350dd6~mv2.png',
    heroHeading: 'monday.com Partner Consultants & Implementation Experts USA',
    heroSubheading:
      'Get a certified monday.com expert consultant to build the essential infrastructure and architecture for your account. Get up and running right away — without spending valuable resources figuring it out yourself.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com Partner US | New York & Nationwide Implementation | Fruition',
    seoDescription:
      'Fruition is a certified monday.com partner in the US, with consultants in New York and across all 50 states delivering CRM and work management implementations.',
    capabilitiesHeading: 'Top leadership challenges across US businesses',
    capabilitiesCards: [
      { emoji: '🏢', title: 'Remote Work & Hybrid Compliance', description: 'Navigate evolving US remote work legislation and state-specific employment laws. Integrate remote and office workflows while ensuring FLSA compliance across all 50 states.' },
      { emoji: '🎓', title: 'Digital Transformation Training for US Teams', description: 'Accelerate digital adoption with comprehensive training programs designed for American businesses, minimising productivity disruption.' },
      { emoji: '⚖️', title: 'Work-Life Balance & Employee Wellness', description: 'Enhance work-life integration through intelligent automation that supports US workplace wellness initiatives and the emerging "right to disconnect" discussion.' },
      { emoji: '📈', title: 'Professional Development & Skills Training', description: 'Empower US teams with process optimisation skills that drive continuous improvement and support workforce development initiatives.' },
      { emoji: '🇺🇸', title: 'Cross-Timezone Team Collaboration', description: 'Strengthen collaboration across US time zones — Pacific to Eastern, plus Hawaii and Alaska — from Silicon Valley to New York City.' },
    ],
    comparisonHeading: 'monday.com features built for US teams',
    comparisonSubheading: 'How monday.com powers work for US teams in tech, finance, healthcare and beyond.',
    comparisonTabs: [
      {
        label: 'monday.com Features',
        items: [
          { number: '01', title: '⚡ Save Time with Automations', description: 'Automated workflows on monday.com act as your dedicated process manager, continuously running in the background to keep initiatives moving seamlessly and productively.' },
          { number: '02', title: '📄 Centralised Document Management', description: 'Create comprehensive business documents with real-time project data integration from any board in your monday.com workspace.' },
          { number: '03', title: '📊 Business Intelligence & Analytics', description: 'Transform operational data into actionable insights that support strategic decision-making, with KPIs aligned with your accounting standards and reporting requirements.' },
          { number: '04', title: '🧩 Agile Project Organisation', description: "Organise projects using methodologies popular across US innovation hubs — Silicon Valley, Austin's tech corridor, Boston's biotech sector and New York's fintech industry." },
          { number: '05', title: '🔌 US Software Integration', description: 'Integrate seamlessly with QuickBooks US, Salesforce, Microsoft 365 and enterprise CRM systems.' },
        ],
      },
    ],
    methodologyHeading: 'Our expert consulting methodology',
    methodologySteps: SHARED_METHODOLOGY,
    calendlyHeading: SHARED_CALENDLY_HEADING,
    calendlySubheading:
      "Schedule a personalised monday.com demo with our certified consultants. Unlock monday.com's complete potential with our exclusive 4-week extended free trial period.",
    faqTabs: SHARED_FAQ,
    joinHeadingPart1: 'The economic impact of ',
    joinHeadingAccent: 'monday.com in the US',
    joinHeadingPart2: '',
    joinSubheading: 'Independent Forrester research on the platform powering teams from coast to coast.',
    joinStats: SHARED_FORRESTER_STATS,
    joinFootnote: 'Source: Forrester TEI study of monday.com.',
  },

  // ── Singapore ─────────────────────────────────────────────────────
  {
    slug: 'monday-partner-singapore',
    title: 'monday.com Partner Singapore',
    country: 'Singapore',
    region: 'ASEAN',
    heroImageUrl: 'https://static.wixstatic.com/media/a280a5_83aa7b006f4d4457bf93a43ed1350dd6~mv2.png',
    heroHeading: 'monday.com Partner Singapore',
    heroSubheading:
      'Work with an accredited monday.com consultant to develop the essential systems and operational blueprint for your business. Based in Singapore, our specialists serve companies across Southeast Asia — Singapore, the Philippines, Thailand, Malaysia, Indonesia and Vietnam.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com Partner Singapore | ASEAN Implementation Experts | Fruition',
    seoDescription:
      'Fruition delivers monday.com implementations across Singapore and ASEAN — Philippines, Thailand, Malaysia, Indonesia and Vietnam.',
    capabilitiesHeading: 'Top leadership challenges across ASEAN businesses',
    capabilitiesCards: [
      { emoji: '🏢', title: 'Hybrid Work & ASEAN Compliance', description: 'Navigate diverse Southeast Asian employment regulations and hybrid work policies across Singapore, Malaysia, Thailand, Indonesia, Philippines and Vietnam.' },
      { emoji: '🎓', title: 'Digital Transformation Training for ASEAN Teams', description: 'Accelerate digital adoption with training programs designed for Southeast Asian businesses, minimising productivity disruption.' },
      { emoji: '⚖️', title: 'Work-Life Balance & Regional Wellness', description: 'Enhance work-life integration through intelligent automation that supports Southeast Asian workplace wellness standards and cultural expectations.' },
      { emoji: '📈', title: 'Professional Development & Skills Enhancement', description: 'Empower ASEAN teams with process optimisation skills that drive continuous improvement across diverse cultural contexts.' },
      { emoji: '🌏', title: 'Multi-Country Team Coordination', description: 'Strengthen collaboration across ASEAN time zones and cultural backgrounds, from Singapore to Manila to Bangkok.' },
    ],
    comparisonHeading: 'monday.com features built for ASEAN teams',
    comparisonSubheading: 'How monday.com powers work across Singapore, KL, Bangkok, Jakarta, Manila and Ho Chi Minh City.',
    comparisonTabs: [
      {
        label: 'monday.com Features',
        items: [
          { number: '01', title: '⚡ Save Time with Automations', description: 'Automated workflows on monday.com act as your dedicated process manager, continuously running in the background to keep initiatives moving seamlessly and productively.' },
          { number: '02', title: '📄 Centralised Documentation', description: 'Create rich documents directly within monday and embed real-time project information from any of your boards within those docs.' },
          { number: '03', title: '📊 Business Intelligence for ASEAN Markets', description: 'Transform operational data into actionable insights aligned with Singapore FRS, Malaysian MFRS, Thai TFRS and other regional reporting requirements.' },
          { number: '04', title: '🧩 Agile Project Organisation', description: "Organise projects using methodologies popular across ASEAN innovation hubs — Singapore's fintech sector, KL's digital economy, Bangkok's startup ecosystem and Jakarta's e-commerce corridor." },
          { number: '05', title: '🔌 Integrate with Other Tools', description: 'Consolidate all your information within monday to boost team synchronisation and eliminate switching between isolated applications.' },
        ],
      },
    ],
    methodologyHeading: 'Our SEA-based consulting methodology',
    methodologySteps: SHARED_METHODOLOGY,
    calendlyHeading: 'Schedule a 30-min call with one of our monday.com consultants today',
    calendlySubheading:
      'From initial process discovery to full system adoption, our proven methodology ensures seamless digital transformation that empowers your team and drives sustainable operational efficiency.',
    faqTabs: SHARED_FAQ,
    joinHeadingPart1: 'The economic impact of ',
    joinHeadingAccent: 'monday.com in ASEAN',
    joinHeadingPart2: '',
    joinSubheading: 'Independent Forrester research on the platform powering teams across Southeast Asia.',
    joinStats: SHARED_FORRESTER_STATS,
    joinFootnote: 'Source: Forrester TEI study of monday.com.',
  },

  // ── India ─────────────────────────────────────────────────────────
  {
    slug: 'monday-partner-india',
    title: 'monday.com Partner India',
    country: 'India',
    region: 'APAC',
    heroImageUrl: 'https://static.wixstatic.com/media/a280a5_83aa7b006f4d4457bf93a43ed1350dd6~mv2.png',
    heroHeading: 'monday.com Partner Consultants & Implementation Experts India',
    heroSubheading:
      'Get certified monday.com partner consultants and implementation experts to build robust infrastructure and architecture for your business. Our expert services get your team operational immediately, eliminating the time and resources spent on trial-and-error setup.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com Partner India | Certified Implementation Consultants | Fruition',
    seoDescription:
      'Fruition is a certified monday.com partner in India delivering CRM and work management implementations with India-based consultants.',
    capabilitiesHeading: 'Top leadership challenges across Indian businesses',
    capabilitiesCards: [
      { emoji: '💰', title: 'Financial Uncertainty', description: 'Improve reporting visibility into business performance to make better decisions and quickly correct course on strategic initiatives.' },
      { emoji: '🤖', title: 'AI & Automation', description: 'Team enablement and implementation of AI and automation technologies to improve workforce efficiency and unlock hidden inefficiencies.' },
      { emoji: '🏢', title: 'Hybrid Work Management', description: 'Optimise productivity and culture across distributed teams while maintaining operational excellence.' },
      { emoji: '👥', title: 'Talent Retention & Personal Development', description: 'Attract and keep key talent in a competitive market while upskilling for future needs.' },
      { emoji: '🔐', title: 'Cybersecurity & Digital Risk', description: 'Protect against evolving threats while ensuring data privacy and regulatory compliance.' },
    ],
    comparisonHeading: 'monday.com features built for Indian teams',
    comparisonSubheading: 'How monday.com transforms work for Indian businesses across Bengaluru, Mumbai, Delhi NCR, Hyderabad and beyond.',
    comparisonTabs: [
      {
        label: 'monday.com Features',
        items: [
          { number: '01', title: '⚡ Save Time with Automations', description: 'Automated workflows on monday.com act as your dedicated process manager, continuously running in the background to keep initiatives moving seamlessly and productively.' },
          { number: '02', title: '📄 Centralised Documentation', description: 'Create rich documents directly within monday and embed real-time project information from any of your boards within those docs.' },
          { number: '03', title: '📊 Visualise with Dashboards & Charts', description: 'Turn project data into visually engaging, easily digestible information — simplifying analysis and improving decision-making with clear, actionable views.' },
          { number: '04', title: '🧩 Flexible Organisation', description: 'Organise projects using Agile or traditional methodologies — adaptable to startup, enterprise and services-team workflows alike.' },
          { number: '05', title: '🔌 Integrate with Other Tools', description: 'Keep all your data in monday.com and integrate with your accounting, CRM and communication tools — Aircall, Gmail, Outlook, Slack, Teams and more.' },
        ],
      },
    ],
    methodologyHeading: "Fruition's consulting methodology",
    methodologySteps: SHARED_METHODOLOGY,
    calendlyHeading: SHARED_CALENDLY_HEADING,
    calendlySubheading: SHARED_CALENDLY_SUBHEADING,
    faqTabs: SHARED_FAQ,
    joinHeadingPart1: 'The economic impact of ',
    joinHeadingAccent: 'monday.com in India',
    joinHeadingPart2: '',
    joinSubheading: 'Independent Forrester research on the platform behind 500+ businesses choosing monday.com.',
    joinStats: SHARED_FORRESTER_STATS,
    joinFootnote: 'Source: Forrester TEI study of monday.com.',
  },
]

function key(slug: string, prefix: string, idx: number, sub?: number) {
  const base = `${prefix}-${slug}-${idx}`
  return sub === undefined ? base : `${base}-${sub}`
}

async function buildDocument(p: LocationPage) {
  const heroImage = p.heroImageUrl
    ? await uploadImageFromUrl(p.heroImageUrl, `${p.slug}-hero${extensionOf(p.heroImageUrl)}`)
    : undefined

  const capabilitiesCards = p.capabilitiesCards?.map((c, i) => ({
    _key: key(p.slug, 'cap', i),
    _type: 'capabilityCard',
    emoji: c.emoji,
    title: c.title,
    description: c.description,
  }))

  const comparisonTabs = p.comparisonTabs?.map((tab, ti) => ({
    _key: key(p.slug, 'ct', ti),
    _type: 'comparisonTab',
    label: tab.label,
    items: tab.items.map((item, ii) => ({
      _key: key(p.slug, `ct${ti}-i`, ii),
      _type: 'comparisonItem',
      number: item.number,
      title: item.title,
      description: item.description,
      bullets: item.bullets?.map((b, bi) => ({
        _key: key(p.slug, `ct${ti}-i${ii}-b`, bi),
        _type: 'bullet',
        emoji: b.emoji,
        text: b.text,
      })),
    })),
  }))

  const methodologySteps = p.methodologySteps?.map((s, i) => ({
    _key: key(p.slug, 'meth', i),
    _type: 'methodologyStep',
    number: s.number,
    title: s.title,
    description: s.description,
  }))

  const faqTabs = p.faqTabs?.map((tab, ti) => ({
    _key: key(p.slug, 'faq', ti),
    _type: 'faqTab',
    label: tab.label,
    items: tab.items.map((q, qi) => ({
      _key: key(p.slug, `faq${ti}-q`, qi),
      _type: 'faqPair',
      question: q.question,
      answer: q.answer,
    })),
  }))

  const joinStats = p.joinStats?.map((s, i) => ({
    _key: key(p.slug, 'stat', i),
    _type: 'stat',
    value: s.value,
    label: s.label,
  }))

  return {
    _id: `locationPage-${p.slug}`,
    _type: 'locationPage',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    country: p.country,
    region: p.region,
    heroHeading: p.heroHeading,
    heroSubheading: p.heroSubheading,
    ...(heroImage ? { heroImage } : {}),
    primaryCtaLabel: p.primaryCtaLabel,
    primaryCtaUrl: p.primaryCtaUrl,
    secondaryCtaLabel: p.secondaryCtaLabel,
    secondaryCtaUrl: p.secondaryCtaUrl,
    capabilitiesHeading: p.capabilitiesHeading,
    capabilitiesCards,
    comparisonHeading: p.comparisonHeading,
    comparisonSubheading: p.comparisonSubheading,
    comparisonTabs,
    methodologyHeading: p.methodologyHeading,
    methodologySteps,
    calendlyHeading: p.calendlyHeading,
    calendlySubheading: p.calendlySubheading,
    faqTabs,
    joinHeadingPart1: p.joinHeadingPart1,
    joinHeadingAccent: p.joinHeadingAccent,
    joinHeadingPart2: p.joinHeadingPart2,
    joinSubheading: p.joinSubheading,
    joinStats,
    joinFootnote: p.joinFootnote,
  }
}

async function main() {
  console.log(`Migrating ${pages.length} location pages...`)
  for (const p of pages) {
    console.log(`\n→ ${p.slug}`)
    const doc = await buildDocument(p)
    await writeClient.createOrReplace(doc)
    console.log(`  ✓ wrote locationPage-${p.slug}`)
  }
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
