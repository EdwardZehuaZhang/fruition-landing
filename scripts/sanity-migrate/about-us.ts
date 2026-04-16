/**
 * Migration: update About Us page heading, logo cloud, 3-tab comparison
 * section, narrative text sections, and extended hero partner badges.
 *
 * Idempotent — re-run safe.
 *
 * Run: npx tsx scripts/sanity-migrate/about-us.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { writeClient } from './lib'

async function uploadAbsolute(filePath: string) {
  const buffer = fs.readFileSync(filePath)
  const filename = path.basename(filePath)
  console.log(`  ↑ uploading ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`)
  const asset = await writeClient.assets.upload('image', buffer, { filename })
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: asset._id },
  }
}

const COMPARISON_TABS = [
  {
    _key: 'tab-leadership',
    _type: 'comparisonTab',
    label: 'Top Leadership Challenges',
    items: [
      {
        _key: 'l1',
        _type: 'comparisonItem',
        number: '01',
        title: 'Real-time visibility for fast pivots',
        description:
          'Market volatility and uncertainty demand real-time project visibility and reporting capabilities that enable quick pivots in strategy and resource allocation, helping organisations make data-driven decisions to maintain competitive advantage and adapt to changing conditions.',
      },
      {
        _key: 'l2',
        _type: 'comparisonItem',
        number: '02',
        title: 'AI & automation rolled out without resistance',
        description:
          'AI and automation in project management requires careful implementation to boost team efficiency while managing change resistance, focusing on streamlined workflows, automated routine tasks, and AI-powered insights for better decision making.',
      },
      {
        _key: 'l3',
        _type: 'comparisonItem',
        number: '03',
        title: 'Hybrid work that stays productive',
        description:
          'Hybrid work models challenge project leaders to balance in-office and remote team dynamics, requiring robust digital collaboration tools, clear communication protocols, and standardised processes to maintain productivity across distributed teams.',
      },
      {
        _key: 'l4',
        _type: 'comparisonItem',
        number: '04',
        title: 'Retention through clarity and growth',
        description:
          'Talent retention in project management hinges on creating engaging work environments with clear growth paths, balanced workloads, and opportunities for skill development, while ensuring knowledge transfer and team cohesion amid turnover.',
      },
      {
        _key: 'l5',
        _type: 'comparisonItem',
        number: '05',
        title: 'Security baked into every workflow',
        description:
          'Cybersecurity and digital risk management must be integrated into project workflows through secure access controls, compliant data handling, and protected collaboration tools, without compromising team efficiency or communication effectiveness.',
      },
    ],
  },
  {
    _key: 'tab-teams',
    _type: 'comparisonTab',
    label: 'Top Team Challenges',
    items: [
      {
        _key: 't1',
        _type: 'comparisonItem',
        number: '01',
        title: 'Hybrid collaboration that just works',
        description:
          'Hybrid collaboration demands strategic tool selection that seamlessly integrates remote and in-office workflows, ensuring clear communication channels, balanced workload distribution, and effective team coordination across all work environments.',
      },
      {
        _key: 't2',
        _type: 'comparisonItem',
        number: '02',
        title: 'Digital adaptation without the productivity dip',
        description:
          'Digital adaptation success relies on comprehensive training programs that quickly bring teams up to speed on new technologies while minimising productivity dips, supported by expert guidance and practical learning approaches.',
      },
      {
        _key: 't3',
        _type: 'comparisonItem',
        number: '03',
        title: 'Automation that protects work-life balance',
        description:
          'Work-life integration improves through intelligent automation of routine tasks, freeing team members from manual processes and allowing them to focus on high-value work while maintaining better personal boundaries.',
      },
      {
        _key: 't4',
        _type: 'comparisonItem',
        number: '04',
        title: 'Personal development through process ownership',
        description:
          'Personal development focuses on empowering team members with process optimisation skills, enabling them to identify inefficiencies and implement improved systems that enhance both individual and team performance.',
      },
      {
        _key: 't5',
        _type: 'comparisonItem',
        number: '05',
        title: 'Team cohesion across every location',
        description:
          'Team cohesion strengthens through unified communication and work management platforms that create transparency, foster collaboration, and maintain strong team connections regardless of physical location.',
      },
    ],
  },
  {
    _key: 'tab-help',
    _type: 'comparisonTab',
    label: 'How We Can Help',
    items: [
      {
        _key: 'h1',
        _type: 'comparisonItem',
        number: '01',
        title: 'Process Discovery → Business Process Audit',
        description:
          'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
      },
      {
        _key: 'h2',
        _type: 'comparisonItem',
        number: '02',
        title: 'Technical Architecture → System Integration Scope',
        description:
          'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
      },
      {
        _key: 'h3',
        _type: 'comparisonItem',
        number: '03',
        title: 'Solution Design → Implementation',
        description:
          'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.',
      },
      {
        _key: 'h4',
        _type: 'comparisonItem',
        number: '04',
        title: 'Efficiency Impact → ROI Opportunity Analysis',
        description:
          'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
      },
      {
        _key: 'h5',
        _type: 'comparisonItem',
        number: '05',
        title: 'Change Readiness → Adoption & Training Strategies',
        description:
          'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.',
      },
    ],
  },
]

const TEXT_CONTENT_SECTIONS = [
  {
    _key: 'tcs-scalability',
    _type: 'textContentSection',
    heading: "Fruition's monday.com Automations Drive ",
    headingAccent: 'Scalability and Cost Savings',
    theme: 'light',
    body:
      'As a Platinum monday.com partner, Fruition builds automated business solutions that integrate seamlessly into existing systems to help companies work faster, smarter, and more affordably.\n\n' +
      'Our expert monday.com implementation consultants focus on custom workflows with ease, seamless CRM and Project Management implementation, integrations, change management, and user adoption strategies.\n\n' +
      'We pride ourselves on delivering world-class solutions that are scalable and cost-effective to ensure our clients see faster time to value and return on their software investment.',
  },
  {
    _key: 'tcs-flexibility',
    _type: 'textContentSection',
    heading: "By leveraging monday.com's flexibility, ",
    headingAccent: 'Fruition streamlines manual processes through automation and integrations.',
    theme: 'tint',
    body:
      'This enables accelerated growth, instant visibility into operations, and rapid return on investment.\n\n' +
      'Trust Fruition, a leader in monday.com integration, to drive maximum efficiency and scalability across your organisation while optimising costs.\n\n' +
      'Our tailored monday.com solutions easily adapt as operational needs change to future-proof workflow optimisation.\n\n' +
      'Contact Fruition to learn more about our monday.com expertise and automation capabilities. Our solutions deliver the scalability and cost savings your business needs to operate efficiently.',
  },
]

// Existing 3 partner badge image refs (already in Sanity siteSettings) — reused so
// we don't re-upload duplicates.
const EXISTING_BADGE_REFS = {
  mondayPlatinum: 'image-cc5d87d3582a52e304edea3c096fcd600ebe6670-90x32-png',
  advancedDelivery: 'image-3f4ae9a9a3858df3077ff962208546582927b40d-105x32-png',
  makePartners: 'image-fe6a0b1788691e0b92f5de6ede1aad5ef76b9741-128x32-png',
}

const NEW_BADGES_FROM_DESKTOP = [
  { name: 'guidde Partner', file: '/Users/gel/Desktop/a280a5_94fccfa03fe249a5aa33741a4e37622e~mv2.avif', width: 80, height: 32 },
  { name: 'Aircall Partner', file: '/Users/gel/Desktop/aircall.avif', width: 80, height: 32 },
  { name: 'Hootsuite Partner', file: '/Users/gel/Desktop/Hootsuite-saffron-cmyk.avif', width: 80, height: 32 },
  { name: 'Atlassian Gold Solution Partner', file: '/Users/gel/Desktop/00f73d_a2f7b885f21d48e987c7cc577763a3f4~mv2.avif', width: 80, height: 32 },
]

async function buildHeroPartnerBadges() {
  const uploaded = []
  for (const b of NEW_BADGES_FROM_DESKTOP) {
    const image = await uploadAbsolute(b.file)
    uploaded.push({
      _key: `hpb-${b.name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
      _type: 'partnerBadge',
      name: b.name,
      image,
      width: b.width,
      height: b.height,
    })
  }
  return [
    {
      _key: 'hpb-monday-platinum',
      _type: 'partnerBadge',
      name: 'monday.com Platinum Partner',
      image: { _type: 'image', asset: { _type: 'reference', _ref: EXISTING_BADGE_REFS.mondayPlatinum } },
      width: 80,
      height: 32,
    },
    {
      _key: 'hpb-advanced-delivery',
      _type: 'partnerBadge',
      name: 'Advanced Delivery Partner',
      image: { _type: 'image', asset: { _type: 'reference', _ref: EXISTING_BADGE_REFS.advancedDelivery } },
      width: 80,
      height: 32,
    },
    {
      _key: 'hpb-make-partners',
      _type: 'partnerBadge',
      name: 'Make Partners',
      image: { _type: 'image', asset: { _type: 'reference', _ref: EXISTING_BADGE_REFS.makePartners } },
      width: 60,
      height: 32,
    },
    ...uploaded,
  ]
}

async function run() {
  console.log('Updating about-us page…')
  const heroPartnerBadges = await buildHeroPartnerBadges()
  await writeClient
    .patch('page-about-us')
    .set({
      title: 'About Us',
      heroHeading: 'About Us',
      logoCloudHeadingPart1: '500+ clients globally use ',
      logoCloudHeadingAccent: "Fruition's monday.com implementation consultants",
      comparisonHeading: '500+ Teams Transformed. Proven Efficiency Gains.',
      comparisonSubheading:
        'Authorised monday.com, Atlassian and Make Consulting, implementation and integration partner consultants across Australia, UK, and US.',
      comparisonTabs: COMPARISON_TABS,
      textContentSections: TEXT_CONTENT_SECTIONS,
      heroPartnerBadges,
    })
    .commit()
    .then(() => console.log('  ✎ page-about-us patched'))
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
