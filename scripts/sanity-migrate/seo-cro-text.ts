/**
 * Push SEO + H1 text from the "CRO landing page" audit into Sanity.
 *
 * Updates seoTitle, seoDescription (read by every route's generateMetadata)
 * and the on-page H1 hero heading for 19 pages. Partial `.set()` patches only —
 * never replaces docs, so all other content is preserved.
 *
 * Dry run:  DRY=1 tsx scripts/sanity-migrate/seo-cro-text.ts
 * Live:     tsx scripts/sanity-migrate/seo-cro-text.ts   (npm run migrate:seo-cro)
 *
 * Hero shapes (verified against components):
 *   single   → set { heroHeading }
 *   split    → set { heroHeadingPart1, heroHeadingAccent, heroHeadingPart2? }
 *              (about-us page + the 4 singleton doc types)
 *   title    → blogPost: H1 is the post `title`
 */
import { writeClient } from './lib'

const DRY = !!process.env.DRY

type Locator =
  | { type: string } // singleton — first doc of type
  | { type: string; slug: string } // slug-keyed doc

interface PageSeo {
  name: string
  locator: Locator
  seoTitle: string
  seoDescription: string
  /** Hero heading patch. Exactly one shape per page. */
  hero:
    | { heroHeading: string }
    | { heroHeadingPart1: string; heroHeadingAccent: string; heroHeadingPart2?: string }
    | { title: string }
}

const PAGES: PageSeo[] = [
  // ── Group C: singletons with split hero headings ───────────────────────────
  {
    name: 'implementation-packages',
    locator: { type: 'implementationPackagesPage' },
    seoTitle: 'monday.com Implementation Packages & CRM Consulting | Fruition',
    seoDescription:
      'Scale faster with custom monday.com implementation packages. Get elite CRM consulting & workflow automation from Fruition—the top 1% Platinum Partner.',
    hero: {
      heroHeadingPart1: 'Scale Faster with Expert ',
      heroHeadingAccent: 'monday.com Implementation Services',
      heroHeadingPart2: '.',
    },
  },
  {
    name: 'monday-training',
    locator: { type: 'mondayTrainingPage' },
    seoTitle: 'Professional monday.com Training Services & Onboarding | Fruition',
    seoDescription:
      'Drive 100% user adoption with custom monday.com training services. Let a certified consultant lead your team onboarding and maximize your ROI.',
    hero: {
      heroHeadingPart1: 'Drive 100% User Adoption with Expert ',
      heroHeadingAccent: 'monday.com Training Services.',
    },
  },
  {
    name: 'monday-implementation-consultants',
    locator: { type: 'mondayImplementationConsultantsPage' },
    seoTitle: 'monday.com Implementation Consultants & Setup Services | Fruition',
    seoDescription:
      'Deploy your Work OS seamlessly with certified monday.com implementation consultants. Expert workflow setup services, data migration, and team training.',
    hero: {
      heroHeadingPart1: 'Scale Faster with Expert ',
      heroHeadingAccent: 'monday.com Implementation Services',
      heroHeadingPart2: '',
    },
  },
  {
    name: 'make-partners',
    locator: { type: 'makePartnersPage' },
    seoTitle: 'Certified make.com Integration Partner & Consultant | Fruition',
    seoDescription:
      'Connect your tech stack with a certified make.com integration partner. Our expert consultants design advanced make.com monday.com integrations.',
    hero: {
      heroHeadingPart1: 'Architect Flawless Workflows with a Certified ',
      heroHeadingAccent: 'make.com Integration Partner.',
    },
  },

  // ── Group A: `page` docs — about-us is split, the rest are single heroHeading ─
  {
    name: 'about-us',
    locator: { type: 'page', slug: 'about-us' },
    seoTitle: 'About Fruition | Elite monday.com Consulting Company & Partner',
    seoDescription:
      'Discover why top brands trust Fruition. As an elite certified monday.com integration agency and consulting company, we build custom systems that drive growth.',
    hero: {
      heroHeadingPart1: 'The Vision Behind a Leading Global ',
      heroHeadingAccent: 'monday.com Consulting Company',
      heroHeadingPart2: '.',
    },
  },
  {
    name: 'fruition-team',
    locator: { type: 'page', slug: 'fruition-team' },
    seoTitle: 'Meet Our Certified monday.com Implementation Team | Fruition',
    seoDescription:
      'Put your processes in the hands of a top-tier monday.com certified partner. Meet the workflow automation experts dedicated to scaling your business.',
    hero: { heroHeading: 'Drive Peak Performance with an Elite monday.com Certified Partner Team' },
  },
  {
    name: 'customer-testimonials',
    locator: { type: 'page', slug: 'customer-testimonials' },
    seoTitle: 'monday.com Partner Reviews & Success Stories | Fruition',
    seoDescription:
      'Read verified monday.com partner reviews and consultant case studies. See how Fruition engineers real implementation success stories for scaling brands.',
    hero: { heroHeading: 'Verifiable ROI: Real monday.com Implementation Success Stories.' },
  },
  {
    name: 'consulting-blog',
    locator: { type: 'page', slug: 'consulting-blog' },
    seoTitle: 'monday.com Workflow Best Practices & CRM Blog | Fruition',
    seoDescription:
      "Discover advanced monday.com tips and tutorials. Master the platform with step-by-step guides from Fruition's elite CRM automation blog.",
    hero: { heroHeading: 'Streamline Your Operations with Proven monday.com Workflow Best Practices.' },
  },
  {
    name: 'monday-consulting-solutions',
    locator: { type: 'page', slug: 'monday-consulting-solutions' },
    seoTitle: 'monday.com Consulting Solutions & Workflow Experts | Fruition',
    seoDescription:
      'Streamline your business with elite monday.com consulting solutions. Our certified workflow consultants and CRM implementation partners eliminate process bottlenecks.',
    hero: { heroHeading: 'Eliminate Operational Chaos with Proven monday.com Consulting Solutions' },
  },

  // ── Group B: single heroHeading slug docs ──────────────────────────────────
  {
    name: 'monday-crm-consulting',
    locator: { type: 'servicePage', slug: 'monday-crm-consulting' },
    seoTitle: 'Expert monday CRM Consulting & Sales Pipeline Setup | Fruition',
    seoDescription:
      'Close deals faster with our monday CRM consulting. As a top-tier monday.com CRM implementation partner, we build high-converting sales pipelines.',
    hero: { heroHeading: 'Accelerate Your Revenue with Proven monday CRM Consulting.' },
  },
  {
    name: 'monday-partner-us',
    locator: { type: 'locationPage', slug: 'monday-partner-us' },
    seoTitle: 'Top monday.com Partner USA | Workflow Automation Agency',
    seoDescription:
      'Scale your business with a certified monday.com partner USA. Our expert implementation consultants and automation agency build high-performing custom workflows.',
    hero: { heroHeading: 'Drive Localized Growth with an Elite monday.com Partner USA.' },
  },
  {
    name: 'monday-partner-uk',
    locator: { type: 'locationPage', slug: 'monday-partner-uk' },
    seoTitle: 'Top monday.com Partner UK | Workflow Automation Agency',
    seoDescription:
      'Scale your business with a certified monday.com partner UK. Our expert implementation consultants and automation agency build high-performing custom workflows.',
    hero: { heroHeading: 'Drive Peak Operational Performance with an Elite monday.com Partner UK.' },
  },
  {
    name: 'monday-partner-australia',
    locator: { type: 'locationPage', slug: 'monday-partner-australia' },
    seoTitle: 'Top monday.com Partner Australia | Sydney & Melbourne Consultants',
    seoDescription:
      'Scale operations with an elite certified monday.com partner Australia. Expert workflow implementation services across Sydney & Melbourne.',
    hero: { heroHeading: 'Drive Peak Efficiency with a Premier monday.com Partner Australia.' },
  },
  {
    name: 'monday-for-construction',
    locator: { type: 'industryPage', slug: 'monday-for-construction' },
    seoTitle: 'monday.com for Construction | Project Management Consulting',
    seoDescription:
      'Streamline builds with monday.com for construction. Get elite project management software consulting and custom templates setup to eliminate costly project delays.',
    hero: { heroHeading: 'Build On-Time and On-Budget with monday.com for Construction.' },
  },
  {
    name: 'n8n-integration-partner',
    locator: { type: 'partnershipPage', slug: 'n8n-integration-partner' },
    seoTitle: 'Certified n8n Integration Partner & Workflow Services | Fruition',
    seoDescription:
      'Scale your systems with a certified n8n integration partner. Maximize your operations with custom n8n monday.com automation and workflow consulting services.',
    hero: { heroHeading: 'Break Free from Automation Limits with an Expert n8n Integration Partner.' },
  },
  {
    name: 'monday-consulting-partner',
    locator: { type: 'partnershipPage', slug: 'monday-consulting-partner' },
    seoTitle: 'Official monday.com Consulting Partner | Fruition Services',
    seoDescription:
      'Partner with a certified monday.com consultant. Fruition delivers custom workflow optimization services to eliminate process bottlenecks and scale your business.',
    hero: { heroHeading: 'Unlock Peak Performance with an Elite monday.com Consulting Partner.' },
  },

  // ── Group D: blogPost — H1 is the post title ───────────────────────────────
  {
    name: 'post/monday-com-enterprise-pricing',
    locator: { type: 'blogPost', slug: 'monday-com-enterprise-pricing' },
    seoTitle: 'monday.com Enterprise Pricing & Features Review | Fruition',
    seoDescription:
      'Uncover the real costs in our deep monday.com enterprise plan review. Compare advanced features, scale limits, and custom tier cost factors.',
    hero: { title: 'Demystifying monday.com Enterprise Pricing: An Honest Review.' },
  },
  {
    name: 'post/make-com-use-cases',
    locator: { type: 'blogPost', slug: 'make-com-use-cases' },
    seoTitle: 'High-Impact make.com Use Cases & Workflow Examples | Fruition',
    seoDescription:
      'Explore advanced make.com use cases and workflow automation examples. Learn how a custom make.com monday.com integration unifies your tech stack.',
    hero: { title: 'Scale Your Operations with Advanced make.com Use Cases.' },
  },
  {
    name: 'post/monday-ai-agent-factory-review',
    locator: { type: 'blogPost', slug: 'monday-ai-agent-factory-review' },
    seoTitle: 'monday.com AI Agent Factory Review & Guide | Fruition',
    seoDescription:
      'Read our deep monday.com ai agent factory review. Discover how to build autonomous bots with our monday ai agents tutorial and scale your workflow automation.',
    hero: { title: 'Beyond Basic Bots: An Honest monday.com AI Agent Factory Review.' },
  },
]

async function resolveId(loc: Locator): Promise<string | null> {
  if ('slug' in loc) {
    return writeClient.fetch<string | null>(
      `*[_type == $type && slug.current == $slug][0]._id`,
      { type: loc.type, slug: loc.slug }
    )
  }
  return writeClient.fetch<string | null>(`*[_type == $type][0]._id`, { type: loc.type })
}

async function run() {
  console.log(`\n${DRY ? '🌵 DRY RUN — no writes' : '✍️  LIVE — patching Sanity'}\n`)
  let ok = 0
  let missing = 0

  for (const page of PAGES) {
    const id = await resolveId(page.locator)
    if (!id) {
      console.warn(`  ! ${page.name} — no ${page.locator.type} doc found — SKIPPING`)
      missing++
      continue
    }

    const patch: Record<string, unknown> = {
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      ...page.hero,
    }

    if (DRY) {
      const current = await writeClient.fetch(
        `*[_id == $id][0]{ seoTitle, seoDescription, title, heroHeading, heroHeadingPart1, heroHeadingAccent, heroHeadingPart2 }`,
        { id }
      )
      console.log(`  • ${page.name}  (${id})`)
      console.log(`      set: ${JSON.stringify(patch)}`)
      console.log(`      was: ${JSON.stringify(current)}`)
    } else {
      await writeClient.patch(id).set(patch).commit()
      console.log(`  ✎ ${page.name}  (${id})`)
    }
    ok++
  }

  console.log(`\nDone. ${ok}/${PAGES.length} resolved${missing ? `, ${missing} missing` : ''}.\n`)
  if (missing) process.exitCode = 1
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
