// Migrate hardcoded *_FAQ_TABS fallback arrays into central `faqItem` docs
// in Sanity. After this runs successfully, the hardcoded fallbacks in the
// FE can be deleted — `getFaqItemsForPage(<slug>)` will return the seeded
// items and `groupFaqsIntoTabs(...)` will produce the same FAQ render.
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

function answerToPortableText(answer, key) {
  return [{
    _key: `${key}-block`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: `${key}-span`, _type: "span", marks: [], text: answer ?? "" }],
  }]
}

const TARGETS = [
  { name: "UK_FAQ_TABS",        file: "src/app/monday-partner-uk/MondayPartnerUkContent.tsx",                                         pageSlug: "monday-partner-uk",         keyPrefix: "uk" },
  { name: "SG_FAQ_TABS",        file: "src/app/monday-partner-singapore/MondayPartnerSingaporeContent.tsx",                          pageSlug: "monday-partner-singapore",  keyPrefix: "sg" },
  { name: "AU_FAQ_TABS",        file: "src/app/monday-partner-australia/MondayPartnerAustraliaContent.tsx",                          pageSlug: "monday-partner-australia",  keyPrefix: "au" },
  { name: "US_FAQ_TABS",        file: "src/app/monday-partner-us/MondayPartnerUsContent.tsx",                                        pageSlug: "monday-partner-us",         keyPrefix: "us" },
  // India partner page reuses central FAQs via groupFaqsIntoTabs but file
  // has no IN_FAQ_TABS constant — confirm by grep before adding here.
  { name: "AIRCALL_FAQ_TABS",   file: "src/app/partnerships/aircall-partner/AircallPartnerContent.tsx",                              pageSlug: "aircall-partner",           keyPrefix: "aircall" },
  { name: "CLICKUP_FAQ_TABS",   file: "src/app/partnerships/certified-clickup-partner/CertifiedClickupPartnerContent.tsx",           pageSlug: "certified-clickup-partner", keyPrefix: "clickup" },
  { name: "PARTNER_FAQ_TABS",   file: "src/app/partnerships/monday-consulting-partner/MondayConsultingPartnerContent.tsx",           pageSlug: "monday-consulting-partner", keyPrefix: "consulting-partner" },
  { name: "ATLASSIAN_FAQ_TABS", file: "src/app/partnerships/certified-atlassian-partner/CertifiedAtlassianPartnerContent.tsx",       pageSlug: "certified-atlassian-partner", keyPrefix: "atlassian" },
  // finance: HARDCODED_FAQ_TABS composes from sub-arrays — handled below
  // outside this loop via a one-off path.
  { name: "PM_FAQ_TABS",        file: "src/app/monday-consulting-solutions/monday-product-management/MondayProductManagementContent.tsx", pageSlug: "monday-product-management", keyPrefix: "product-mgmt" },
  { name: "PM_FAQ_TABS",        file: "src/app/monday-consulting-solutions/monday-project-management/MondayProjectManagementContent.tsx", pageSlug: "monday-project-management", keyPrefix: "project-mgmt" },
]

for (const t of TARGETS) {
  const src = fs.readFileSync(t.file, "utf8")
  let tabs
  try { tabs = extractArray(src, t.name) }
  catch (e) { console.warn(`[${t.pageSlug}] skip: ${e.message}`); continue }
  if (!Array.isArray(tabs) || tabs.length === 0) {
    console.warn(`[${t.pageSlug}] no items in ${t.name}`)
    continue
  }

  // Idempotency guard: skip if pageSlug already has faqItems.
  const existing = await client.fetch(`count(*[_type == "faqItem" && $slug in pages])`, { slug: t.pageSlug })
  if (existing > 0) {
    console.log(`[${t.pageSlug}] already has ${existing} faqItems — skip`)
    continue
  }

  const txn = client.transaction()
  let docCount = 0
  tabs.forEach((tab, ti) => {
    (tab.items || []).forEach((it, ii) => {
      const docKey = `${t.keyPrefix}-${ti}-${ii}`
      const doc = {
        _id: `faq-${t.pageSlug}-${docKey}`,
        _type: "faqItem",
        question: it.question,
        answer: answerToPortableText(it.answer, docKey),
        category: tab.label || "General Questions",
        pages: [t.pageSlug],
        categoryOrder: ti,
        order: ii,
      }
      txn.createOrReplace(doc)
      docCount++
    })
  })
  const r = await txn.commit()
  console.log(`[${t.pageSlug}] seeded ${docCount} faqItems (txn rev=${r.transactionId})`)
}

// -------------- Finance (composed FAQ tabs) -----------------
{
  const slug = "monday-for-finance"
  const existing = await client.fetch(`count(*[_type == "faqItem" && $slug in pages])`, { slug })
  if (existing > 0) {
    console.log(`[${slug}] already has ${existing} faqItems — skip`)
  } else {
    const src = fs.readFileSync("src/app/monday-consulting-solutions/monday-for-finance/MondayForFinanceContent.tsx", "utf8")
    const general = extractArray(src, "GENERAL_FAQS")
    const finance = extractArray(src, "FINANCE_FAQS")
    const composed = [
      { label: "Professional Services", items: general },
      { label: "Finance & Accounting", items: finance },
      { label: "Project Management", items: general },
      { label: "monday CRM", items: general },
    ]
    const txn = client.transaction()
    let n = 0
    composed.forEach((tab, ti) => {
      tab.items.forEach((it, ii) => {
        const docKey = `fin-${ti}-${ii}`
        txn.createOrReplace({
          _id: `faq-${slug}-${docKey}`,
          _type: "faqItem",
          question: it.question,
          answer: answerToPortableText(it.answer, docKey),
          category: tab.label,
          pages: [slug],
          categoryOrder: ti,
          order: ii,
        })
        n++
      })
    })
    const r = await txn.commit()
    console.log(`[${slug}] seeded ${n} faqItems (txn rev=${r.transactionId})`)
  }
}
