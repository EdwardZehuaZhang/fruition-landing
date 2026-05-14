#!/usr/bin/env node
/**
 * Fill any teamMember docs in Sanity whose `bio` is currently empty using
 * the bios pasted verbatim from prod /fruition-team.
 *
 * Idempotent — skips any doc that already has a non-empty bio.
 */

import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
const TOKEN = process.env.SANITY_WRITE_TOKEN
const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`

const BIOS = {
  "Josh Jebathilak":
    "Ex-monday.com, Josh leads the Fruition global team. Josh is directly involved in validating key requirements and operationalising your project through to its success.",
  "Ishani Dhar Chowdhury":
    "Content and blog writer. Ishani specialises in search engine optimisation, creating content related to B2B SaaS, and writes all of our Fruition blogs.",
  "Ishani Chowdhury":
    "Content and blog writer. Ishani specialises in search engine optimisation, creating content related to B2B SaaS, and writes all of our Fruition blogs.",
  "Swapna Singh":
    "Project manager and business consultant. Swapna's focus lies in optimising operations and enhancing customer success, leveraging her experience with various SaaS platforms. Her expertise shines in coordinating complex business projects, with a particular focus on social operations and workflows for global enterprises.",
  "Prakriti Chaubey": "AI and monday.com consultant.",
  "Nikki Glucksman":
    "With a background in UX-driven product strategy, Nikki brings her human-centered design expertise to translate complex business requirements into streamlined workflows and intuitive system implementations.",
  "Yuzia Haque":
    "With a background in AI, data, and process design, Yuzia helps clients simplify complexity and build workflows that actually work. Brings curiosity and problem-solving to every project, so work feels less like a process and more like real progress.",
  "Julia Maningas":
    "Psychology graduate turned implementation consultant, Julia brings a people-first lens to every monday.com build. At Fruition, she helps teams across Australia, the US, and the UK get their tools, workflows, and tech stacks working in sync, because the best system is one people actually want to use.",
  "Chloe Jebathilak":
    "Operation leader with key responsibilities in finance, marketing, and administration. Chloe comes from 10 years of banking experience (CBA) and helps ensure the Fruition team stays efficient and focused on key initiatives.",
  "Suzzane Castro":
    "Expert implementation lead and business automation specialist. Suzzane works with clients across different industries to streamline operations and improve efficiency. Skilled operator of platforms like monday.com, Make.com, and Zapier, and connecting them with essential tools like Xero, PandaDocs, Google Workspace, Slack, and calendar booking systems she is able to build cohesive and efficient workflows.",
  "Ronelyn Tabuena":
    "monday.com and Make consultant. Ronelyn has an excellent eye for detail and is genuinely passionate about creating workflows that meet client needs.",
  "Nikhil Tiwari":
    "Certified monday.com and Make.com partner and consultant. With a robust background in Machine Learning and Generative AI (GenAI), Nikhil is passionate about merging AI with project management, driving innovation and solving complex challenges.",
  "Pierre Santos":
    "Pierre is a dedicated member of the Fruition team, bringing a strong sense of purpose and creativity to every project. With a passion for thoughtful work and meaningful impact, he contributes to building a culture rooted in collaboration, intention, and growth. At Fruition, Pierre brings structure to ideas — making sure great plans don't just stay on paper, but actually happen.",
  "Yash":
    "With a background spanning AI engineering, cloud infrastructure, and full-stack development, Yash turns complex technical challenges into scalable, production-ready systems — from LLM pipelines to agentic workflows. Driven by curiosity and a researcher's mindset, he's the kind of engineer who doesn't just ship solutions but understands them deeply.",
  "Yash Khowal":
    "With a background spanning AI engineering, cloud infrastructure, and full-stack development, Yash turns complex technical challenges into scalable, production-ready systems — from LLM pipelines to agentic workflows. Driven by curiosity and a researcher's mindset, he's the kind of engineer who doesn't just ship solutions but understands them deeply.",
  "Benjie Belotindos":
    "With 15+ years in digital marketing, Benjie has seen the industry evolve from the ground up and grown with every shift. He covers the full spectrum, from SEO and paid ads to ecommerce, social, and email, bringing both the technical depth and team leadership to turn strategy into results. Guided by a kaizen mindset, he treats experience as a foundation, not a ceiling.",
  "Annica Galang":
    "Hootsuite and monday.com certified partner working in client-facing and operational roles within international environments.",
  "Branson McMahon":
    "Fruition Sales Engineer certified in monday.com with a background in Mechanical Engineering and a keen ability to translate the technical to tangible. Branson guides prospects through the discovery process to meet client needs using the platform's endless capabilities.",
  "Tejas Singh":
    "Tejas is an implementation consultant at Fruition. Make level 3 certified and specialised in AI automations, he is keen on streamlining workflow processes to enhance operational efficiency.",
  "Nishkarsh Hela":
    "With a background in B2B SaaS sales and solution design, Nishkarsh helps businesses across India, SE Asia, and the UAE unlock the full potential of monday.com — from uncovering operational pain points to building workflows that actually fit how teams work. Equal parts salesperson and problem-solver, he makes complex implementations feel straightforward.",
  "Prince Posadas":
    "With a background in industrial engineering and process optimisation, Prince brings an analytical eye to every implementation. At Fruition, he helps businesses streamline operations and build workflows that scale, combining systems thinking with a genuine passion for making things work better.",
  "Prince Ericson Posadas":
    "With a background in industrial engineering and process optimisation, Prince brings an analytical eye to every implementation. At Fruition, he helps businesses streamline operations and build workflows that scale, combining systems thinking with a genuine passion for making things work better.",
  "Yana Asenova":
    "monday.com and Make partner based in Bulgaria. Yana has led project-based initiatives that fuelled business expansion and facilitated the digital transformation of small and medium-sized enterprises (SMEs) worldwide, leveraging project management tools like monday.com, Airtable, Slack, Trello, and Miro.",
  "Prosper (Joe) Chimombe":
    "With 5+ years in B2B SaaS customer success, Prosper combines systems thinking with a genuine drive to help people get the most out of their tools. From enterprise onboarding to automation and cross-functional enablement, he turns complex implementations into smooth experiences — backed by a track record at monday.com that speaks for itself.",
  "Kevin Zhao":
    "Ex-monday.com employee that brings a wealth of experience to implementing monday.com best practices.",
  "Bruna Alves":
    "Certified monday.com and Make.com partner and consultant based in Portugal with a background in sales & communication. Bruna fell in love with monday while building processes for hiring and partnerships management, and is passionate about helping companies across different industries set up their systems and streamline operations.",
  "Joshua Ainsbury":
    "With a background in implementation, project management, and frontend development, Joshua brings curiosity and a drive to keep improving to everything he touches. He works closely with clients from kickoff to completion, builds in monday.com, and isn't afraid to dig into the technical side when the work calls for it.",
  "Sam Karaca": "Implementation consultant at Fruition.",
  "Sara Pereira":
    "Certified monday.com partner based in Portugal with a background in HR and startup operations. Sara loves helping teams grow and run smoothly — supporting people in reaching their goals and building simple, effective systems that make work feel a little easier.",
  "Kevin Vega": "Implementation consultant at Fruition.",
  "Zach Weller":
    "Translating strategy into action and positive outcomes, Zach leads Fruition's US & EMEA growing operations.",
  "Clarice Borges":
    "Based in São Paulo, Clarice turns complex operations into clear, connected monday.com workflows. She maps processes, automates routine work, and delivers executive-ready dashboards so your teams move faster with confidence.",
  "Clarice Sousa":
    "Based in São Paulo, Clarice turns complex operations into clear, connected monday.com workflows. She maps processes, automates routine work, and delivers executive-ready dashboards so your teams move faster with confidence.",
  "Valeria Marín":
    "Part of the North America team, Valeria implements the solutions that optimise your business processes. She ensures seamless project transitions and delivers strategic implementations that drive measurable results for your organisation.",
  "Valeria Marin":
    "Part of the North America team, Valeria implements the solutions that optimise your business processes. She ensures seamless project transitions and delivers strategic implementations that drive measurable results for your organisation.",
  "Eduardo de Souza Gregianin":
    "With a background in digital process architecture and automation, Eduardo connects people, data, and technology to make operations smarter. From AI-powered workflows to end-to-end platform implementations, he translates what businesses actually need into solutions that scale and stick.",
  "Eduardo Gregianin":
    "With a background in digital process architecture and automation, Eduardo connects people, data, and technology to make operations smarter. From AI-powered workflows to end-to-end platform implementations, he translates what businesses actually need into solutions that scale and stick.",
}

function normName(s) {
  return (s ?? "")
    .replace(/[^A-Za-z\s'.\-()]/g, " ")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
}

const BIO_INDEX = new Map(Object.entries(BIOS).map(([k, v]) => [normName(k), v]))

async function sanityQuery(query) {
  const url = `${BASE}/data/query/${DATASET}?query=${encodeURIComponent(query)}`
  const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
  if (!r.ok) throw new Error(`fetch ${r.status} ${await r.text()}`)
  return (await r.json()).result
}

async function mutate(mutations) {
  const r = await fetch(`${BASE}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  })
  if (!r.ok) throw new Error(`mutate ${r.status} ${await r.text()}`)
  return r.json()
}

async function main() {
  const docs = await sanityQuery(`*[_type=="teamMember"]{_id,name,bio}`)
  const muts = []
  let filled = 0
  let skipped = 0
  let unknown = 0
  for (const d of docs) {
    if (typeof d.bio === "string" && d.bio.trim().length > 0) {
      skipped += 1
      continue
    }
    const bio = BIO_INDEX.get(normName(d.name))
    if (!bio) {
      console.log(`  no bio in dump: ${d.name}`)
      unknown += 1
      continue
    }
    muts.push({ patch: { id: d._id, set: { bio } } })
    console.log(`  filled: ${d.name} (${bio.length} chars)`)
    filled += 1
  }
  for (let i = 0; i < muts.length; i += 10) {
    if (muts.length) await mutate(muts.slice(i, i + 10))
  }
  console.log(`done. filled=${filled} alreadySet=${skipped} unknown=${unknown}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
