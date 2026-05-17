// Batch seed for: real-estate, professional-services, crm-consulting, n8n.
// Extracts hardcoded arrays from each Content/page file and patches Sanity.
import fs from "node:fs"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

function extractArray(src, name) {
  const idx = src.indexOf(`const ${name}`)
  if (idx === -1) throw new Error(`${name} not found`)
  const eq = src.indexOf("=", idx)
  const open = src.indexOf("[", eq)
  let depth = 0, end = -1
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++
    else if (src[i] === "]") { depth--; if (depth === 0) { end = i + 1; break } }
  }
  return new Function(`return (${src.slice(open, end)});`)()
}

function tabsShape(arr) {
  return (arr || []).map((t, i) => ({
    _key: t._key || `tab-${i}`,
    _type: "comparisonTab",
    label: t.label,
    items: (t.items || []).map((it, j) => ({
      _key: it._key || `it-${i}-${j}`,
      _type: "comparisonItem",
      number: it.number,
      title: it.title,
      description: it.description,
    })),
  }))
}

const TASKS = [
  {
    label: "marketing",
    file: "src/app/monday-for-marketing/page.tsx",
    docQuery: `*[_type == "industryPage" && slug.current == "monday-for-marketing"][0]{_id}`,
    extract: (src) => ({
      comparisonTabs: tabsShape(extractArray(src, "WHY_TABS")),
      whyBestCards: extractArray(src, "WHY_BEST_CARDS").map((c, i) => ({
        _key: c._key || `wb-${i}`,
        _type: "whyBestCard",
        emoji: c.emoji,
        title: c.title,
        description: c.description,
      })),
      marketingCaseStudyCards: extractArray(src, "MARKETING_CASE_STUDY_CARDS").map((c, i) => ({
        _key: c._key || `mcs-${i}`,
        _type: "marketingCaseStudyCard",
        title: c.title,
        description: c.description,
        videoUrl: c.videoUrl,
      })),
    }),
  },
  {
    label: "construction",
    file: "src/app/monday-for-construction/MondayForConstructionContent.tsx",
    docQuery: `*[_type == "industryPage" && slug.current == "monday-for-construction"][0]{_id}`,
    extract: (src) => ({
      comparisonTabs: tabsShape(extractArray(src, "COMPARISON_TABS")),
      lifecycleStages: extractArray(src, "LIFECYCLE_STAGES").map((s, i) => ({
        _key: `ls-${i}`,
        _type: "lifecycleStage",
        n: s.n,
        title: s.title,
        body: s.body,
      })),
      industryTestimonials: extractArray(src, "CONSTRUCTION_TESTIMONIALS").map((t, i) => ({
        _key: `it-${i}`,
        _type: "industryTestimonial",
        title: t.title,
        quote: t.quote,
        name: t.name,
        role: t.role,
        image: t.image,
      })),
    }),
  },
  {
    label: "real-estate",
    file: "src/app/monday-for-real-estate/page.tsx",
    docQuery: `*[_type == "industryPage" && slug.current == "monday-for-real-estate"][0]{_id}`,
    extract: (src) => ({
      comparisonTabs: extractArray(src, "RE_TABS").map((t, i) => ({
        _key: t._key || `tab-${i}`,
        _type: "comparisonTab",
        label: t.label,
        items: (t.items || []).map((it, j) => ({
          _key: it._key || `it-${i}-${j}`,
          _type: "comparisonItem",
          number: it.number,
          title: it.title,
          description: it.description,
        })),
      })),
      bottomStats: extractArray(src, "RE_STATS_BOTTOM").map((s, i) => ({
        _key: s._key || `bs-${i}`,
        _type: "bottomStat",
        value: s.value,
        label: s.label,
      })),
    }),
  },
  {
    label: "professional-services",
    file: "src/app/monday-for-professional-services/page.tsx",
    docQuery: `*[_type == "industryPage" && slug.current == "monday-for-professional-services"][0]{_id}`,
    extract: (src) => ({
      workflowTabs: extractArray(src, "WORKFLOW_TABS").map((t, i) => ({
        _key: `wf-${i}`,
        _type: "workflowTab",
        key: t.key,
        label: t.label,
        heading: t.heading,
        description: t.description,
        benefits: (t.benefits || []).map((b, j) => ({
          _key: `wfb-${i}-${j}`,
          _type: "workflowBenefit",
          emoji: b.emoji,
          label: b.label,
        })),
      })),
    }),
  },
  {
    label: "crm-consulting",
    file: "src/app/monday-crm-consulting/MondayCrmConsultingContent.tsx",
    docQuery: `*[_type == "servicePage" && slug.current == "monday-crm-consulting"][0]{_id}`,
    extract: (src) => ({
      certificateBadges: extractArray(src, "CERTIFICATE_BADGES").map((b, i) => ({
        _key: `cb-${i}`,
        _type: "certificateBadge",
        src: b.src,
        alt: b.alt,
      })),
    }),
  },
  {
    label: "hr",
    file: "src/app/monday-consulting-solutions/monday-for-hr/MondayForHrContent.tsx",
    docQuery: `*[_type == "solutionPage" && slug.current == "monday-for-hr"][0]{_id}`,
    extract: (src) => ({
      comparisonTabs: tabsShape(extractArray(src, "HR_COMPARISON_TABS")),
      lifecycleStages: extractArray(src, "HR_LIFECYCLE_STAGES").map((s, i) => ({
        _key: `ls-${i}`, _type: "lifecycleStage", n: s.n, title: s.title, body: s.body,
      })),
      fitReasons: extractArray(src, "HR_FIT_REASONS").map((r, i) => ({
        _key: `fr-${i}`, _type: "fitReason", title: r.title, body: r.body,
      })),
    }),
  },
  {
    label: "finance",
    file: "src/app/monday-consulting-solutions/monday-for-finance/MondayForFinanceContent.tsx",
    docQuery: `*[_type == "solutionPage" && slug.current == "monday-for-finance"][0]{_id}`,
    extract: (src) => {
      const whyItems = extractArray(src, "WHY_MONDAY_ITEMS")
      const featItems = extractArray(src, "FEATURES_ITEMS")
      const howItems = extractArray(src, "HOW_WE_HELP_ITEMS")
      const featCards = extractArray(src, "FINANCE_FEATURE_CARDS")
      return {
        // Finance-specific tabs (icon/title/description items — different from
        // the standard {number,title,description} comparisonItem shape, but Sanity
        // stores arbitrary JSON so the FE consumes whatever's set here).
        comparisonTabs: [
          { _key: "tab-why", _type: "comparisonTab", label: "Why monday.com for Finance & Accounting", items: whyItems.map((it, j) => ({ _key: `why-${j}`, _type: "comparisonItem", icon: it.icon, title: it.title, description: it.description })) },
          { _key: "tab-feat", _type: "comparisonTab", label: "Finance & Accounting Features", items: featItems.map((it, j) => ({ _key: `feat-${j}`, _type: "comparisonItem", icon: it.icon, title: it.title, description: it.description })) },
          { _key: "tab-how", _type: "comparisonTab", label: "How We Can Help", items: howItems.map((it, j) => ({ _key: `how-${j}`, _type: "comparisonItem", title: it.title, description: it.description })) },
        ],
        financeFeatureCards: featCards.map((c, i) => ({
          _key: `ff-${i}`, _type: "financeFeatureCard",
          emoji: c.emoji, title: c.title, description: c.description,
        })),
      }
    },
  },
  {
    label: "solar",
    file: "src/app/monday-consulting-solutions/solar-crm-solution/SolarCrmSolutionContent.tsx",
    docQuery: `*[_type == "solutionPage" && slug.current == "solar-crm-solution"][0]{_id}`,
    extract: (src) => ({
      servicesList: extractArray(src, "SERVICES"),
      solarTestimonials: extractArray(src, "SOLAR_TESTIMONIALS").map((t, i) => ({
        _key: `st-${i}`, _type: "solarTestimonial", quote: t.quote, name: t.name, role: t.role, company: t.company, photo: t.photo,
      })),
      beforeAfterTabs: tabsShape(extractArray(src, "BEFORE_AFTER_TABS")),
    }),
  },
  {
    label: "aircall",
    file: "src/app/partnerships/aircall-partner/AircallPartnerContent.tsx",
    docQuery: `*[_type == "partnershipPage" && slug.current == "aircall-partner"][0]{_id}`,
    extract: (src) => ({
      aircallTabs: extractArray(src, "AIRCALL_TABS").map((t, i) => ({
        _key: t._key || `at-${i}`,
        _type: "aircallTab",
        key: t.key,
        label: t.label,
        items: (t.items || []).map((it, j) => ({
          _key: it._key || `ati-${i}-${j}`,
          _type: "aircallTabItem",
          number: it.number,
          title: it.title,
          description: it.description,
        })),
      })),
      aircallFeatures: extractArray(src, "AIRCALL_FEATURES_FALLBACK").map((f, i) => ({
        _key: `af-${i}`,
        _type: "aircallFeature",
        title: f.title,
        body: f.body,
        image: f.image,
        imageRight: !!f.imageRight,
      })),
    }),
  },
  {
    label: "n8n",
    file: "src/app/partnerships/n8n-integration-partner/N8nIntegrationPartnerContent.tsx",
    docQuery: `*[_type == "partnershipPage" && slug.current == "n8n-integration-partner"][0]{_id}`,
    extract: (src) => ({
      provenStats: extractArray(src, "PROVEN_STATS").map((s, i) => ({
        _key: `ps-${i}`,
        _type: "provenStat",
        emoji: s.emoji,
        value: s.value,
        body: s.body,
      })),
    }),
  },
]

for (const t of TASKS) {
  const doc = await client.fetch(t.docQuery)
  if (!doc) { console.error(`[${t.label}] doc not found`); continue }
  const src = fs.readFileSync(t.file, "utf8")
  const set = t.extract(src)
  const res = await client.patch(doc._id).set(set).commit()
  const summary = Object.entries(set).map(([k, v]) => `${k}=${v.length}`).join(", ")
  console.log(`[${t.label}] patched ${doc._id} rev=${res._rev} (${summary})`)
}
