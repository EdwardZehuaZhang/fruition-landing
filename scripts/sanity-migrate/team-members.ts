/**
 * Migration: enrich existing team members with regions, emoji, bio, and LinkedIn URL.
 *
 * Idempotent — re-run safe. Does not touch photo/role/name/order.
 *
 * Run: npx tsx scripts/sanity-migrate/team-members.ts
 */
import { writeClient } from './lib'

interface TeamPatch {
  id: string
  emoji: string
  regions: ('AU' | 'UK' | 'US')[]
  bio: string
  linkedinUrl?: string
}

const PATCHES: TeamPatch[] = [
  {
    id: 'team-josh',
    emoji: '🥭',
    regions: ['AU', 'UK', 'US'],
    bio:
      'Ex-monday.com, Josh leads the Fruition global team. Josh is directly involved in validating key requirements and operationalising your project through to its success.',
  },
  {
    id: 'team-ishani',
    emoji: '🍐',
    regions: ['AU'],
    bio:
      'Content and blog writer. Ishani specialises in search engine optimisation, creating content related to B2B SaaS, and writes all of our Fruition blogs.',
  },
  {
    id: 'team-swapna',
    emoji: '🍈',
    regions: ['AU'],
    bio:
      "Project manager and business consultant. Swapna's focus lies in optimising operations and enhancing customer success, leveraging her experience with various SaaS platforms. Her expertise shines in coordinating complex business projects, with a particular focus on social operations and workflows for global enterprises.",
  },
  {
    id: 'team-prakriti',
    emoji: '🍒',
    regions: ['AU', 'UK'],
    bio: 'AI and monday.com consultant.',
  },
  {
    id: 'team-nikki',
    emoji: '🫐',
    regions: ['AU'],
    bio:
      'With a background in UX-driven product strategy, Nikki brings her human-centered design expertise to translate complex business requirements into streamlined workflows and intuitive system implementations.',
  },
  {
    id: 'team-yuzia',
    emoji: '🍊',
    regions: ['AU'],
    bio:
      'With a background in AI, data, and process design, Yuzia helps clients simplify complexity and build workflows that actually work. Brings curiosity and problem-solving to every project, so work feels less like a process and more like real progress.',
  },
  {
    id: 'team-julia',
    emoji: '🍌',
    regions: ['AU'],
    bio:
      'Psychology graduate turned implementation consultant, Julia brings a people-first lens to every monday.com build. At Fruition, she helps teams across Australia, the US, and the UK get their tools, workflows, and tech stacks working in sync, because the best system is one people actually want to use.',
  },
  {
    id: 'team-chloe',
    emoji: '🍇',
    regions: ['AU'],
    bio:
      'Operation leader with key responsibilities in finance, marketing, and administration. Chloe comes from 10 years of banking experience (CBA) experience and helps ensure the Fruition team stays efficient and focused on key initiatives.',
  },
  {
    id: 'team-suzzane',
    emoji: '🍓',
    regions: ['AU'],
    bio:
      'Expert implementation lead and business automation specialist. Suzzane works with clients across different industries to streamline operations and improve efficiency. Skilled operator of platforms like monday.com, Make.com, and Zapier, and connecting them with essential tools like Xero, PandaDocs, Google Workspace, Slack, and calendar booking systems she is able to build cohesive and efficient workflows.',
  },
  {
    id: 'team-ronelyn',
    emoji: '🍍',
    regions: ['AU'],
    bio:
      'monday.com and Make consultant. Ronelyn has an excellent eye for detail and is genuinely passionate about creating workflows that meet client needs.',
  },
  {
    id: 'team-nikhil',
    emoji: '🍐',
    regions: ['AU', 'UK'],
    bio:
      'Certified monday.com and Make.com partner and consultant. With a robust background in Machine Learning and Generative AI (GenAI), Nikhil is passionate about merging AI with project management, driving innovation and solving complex challenges.',
  },
  {
    id: 'team-pierre',
    emoji: '🍋',
    regions: ['AU'],
    bio:
      "Pierre is a dedicated member of the Fruition team, bringing a strong sense of purpose and creativity to every project. With a passion for thoughtful work and meaningful impact, he contributes to building a culture rooted in collaboration, intention, and growth. At Fruition, Pierre brings structure to ideas—making sure great plans don't just stay on paper, but actually happen.",
  },
  {
    id: 'team-yash',
    emoji: '🍓',
    regions: ['AU'],
    bio:
      "With a background spanning AI engineering, cloud infrastructure, and full-stack development, he turns complex technical challenges into scalable, production-ready systems, from LLM pipelines to agentic workflows. Driven by curiosity and a researcher's mindset, he's the kind of engineer who doesn't just ship solutions, but understands them deeply.",
  },
  {
    id: 'team-benjie',
    emoji: '🥭',
    regions: ['AU'],
    bio:
      'With 15+ years in digital marketing, Benjie has seen the industry evolve from the ground up and grown with every shift. He covers the full spectrum, from SEO and paid ads to ecommerce, social, and email, bringing both the technical depth and team leadership to turn strategy into results. Guided by a kaizen mindset, he treats experience as a foundation, not a ceiling.',
  },
  {
    id: 'team-aquib',
    emoji: '🍎',
    regions: ['AU', 'UK'],
    bio:
      'The technical mastermind behind Fruition, Aquib possesses gifted abilities to translate complex use cases into ready-to-use software solutions through his consultative approach and technical capabilities across GraphQL, PHP, Python and genuine love for monday.com.',
  },
  {
    id: 'team-natalia',
    emoji: '🥝',
    regions: ['AU'],
    bio:
      'CRM implementation consultant and business analyst. Natalia leads stakeholder workshops to identify process improvements and pain points, translating these insights into effective CRM configurations, with a strong ability to translate business needs into effective technical solutions.',
  },
  {
    id: 'team-annica',
    emoji: '🍏',
    regions: ['AU'],
    bio:
      'Hootsuite and monday.com certified partner working in client-facing and operational roles within international environments.',
  },
  {
    id: 'team-branson',
    emoji: '🍈',
    regions: ['AU'],
    bio:
      'Fruition Sales Engineer certified in monday.com with a background in Mechanical Engineering and a keen ability to translate the technical to tangible. Branson guides prospects through the discovery process to meet client needs using the platforms endless capabilities.',
  },
  {
    id: 'team-tejas',
    emoji: '🍎',
    regions: ['AU'],
    bio:
      'Tejas is an implementation consultant at Frution. Make level 3 certified and specialised in AI automations, he is keen on streamlining workflow processes to enhance operational efficiency.',
  },
  {
    id: 'team-nishkarsh',
    emoji: '🥭',
    regions: ['AU'],
    bio:
      'With a background in B2B SaaS sales and solution design, he helps businesses across India, SE Asia, and the UAE unlock the full potential of monday.com, from uncovering operational pain points to building workflows that actually fit how teams work. Equal parts salesperson and problem-solver, he makes complex implementations feel straightforward.',
  },
  {
    id: 'team-prince',
    emoji: '🍌',
    regions: ['AU'],
    bio:
      'With a background in industrial engineering and process optimization, Prince brings an analytical eye to every implementation. At Fruition, he helps businesses streamline operations and build workflows that scale, combining systems thinking with a genuine passion for making things work better.',
  },
  {
    id: 'team-ognyana',
    emoji: '🥝',
    regions: ['UK'],
    bio:
      'monday.com and Make partner based in Bulgaria. Yana has led project-based initiatives that fueled business expansion and facilitated the digital transformation of small and medium-sized enterprises (SMEs) worldwide, leveraging project management tools like monday.com, Airtable, Slack, Trello, Miro, among others.',
  },
  {
    id: 'team-kevin-zhao',
    emoji: '🫐',
    regions: ['UK'],
    bio:
      'Ex-monday.com employee that brings a wealth of experience to implementing monday.com best practices.',
  },
  {
    id: 'team-bruna',
    emoji: '🍓',
    regions: ['UK'],
    bio:
      'Certified monday.com and Make.com partner and consultant based in Portugal with a background in sales & communication, who fell in love with monday in the process of building processes for hiring and partnerships management. Passionate about helping companies across different industries set up their systems and streamline their operations using monday.',
  },
  {
    id: 'team-joshua-ainsbury',
    emoji: '🍊',
    regions: ['UK'],
    bio:
      "With a background in implementation, project management, and frontend development, Joshua brings curiosity and a drive to keep improving to everything he touches. He works closely with clients from kickoff to completion, builds in monday.com, and isn't afraid to dig into the technical side when the work calls for it.",
  },
  {
    id: 'team-sam',
    emoji: '🍊',
    regions: ['UK'],
    bio: 'Implementation consultant at Fruition.',
  },
  {
    id: 'team-sara',
    emoji: '🍇',
    regions: ['UK'],
    bio:
      "Certified monday.com partner based in Portugal with a a background in HR and startup operations. I've loved helping teams grow and run smoothly. I'm passionate about supporting people in reaching their goals and enjoy building simple, effective systems that make work feel a little easier.",
  },
  {
    id: 'team-kevin-vega',
    emoji: '🍓',
    regions: ['US'],
    bio: 'Implementation consultant at Fruition.',
  },
  {
    id: 'team-zach',
    emoji: '🍏',
    regions: ['US'],
    bio:
      "Translating strategy into action and positive outcomes, Zach leads Fruition's US & EMEA growing operations.",
  },
  {
    id: 'team-valeria',
    emoji: '🍇',
    regions: ['US'],
    bio:
      'Part of the North America team, Valeria will implement the solutions that optimise your business processes. She ensures seamless project transitions and delivers strategic implementations that drive measurable results for your organisation.',
  },
]

async function run() {
  console.log(`Patching ${PATCHES.length} team members…`)
  for (const p of PATCHES) {
    await writeClient
      .patch(p.id)
      .set({
        emoji: p.emoji,
        regions: p.regions,
        bio: p.bio,
        ...(p.linkedinUrl ? { linkedinUrl: p.linkedinUrl } : {}),
      })
      .commit()
      .then(() => console.log(`  ✎ ${p.id}`))
      .catch((err) => console.error(`  ✗ ${p.id}: ${err.message}`))
  }
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
