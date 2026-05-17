// Print key shape of hardcoded arrays so we know what Sanity fields to add.
import fs from "node:fs"

function extractArray(src, name) {
  const idx = src.indexOf(`const ${name}`)
  if (idx === -1) return null
  const eq = src.indexOf("=", idx)
  const open = src.indexOf("[", eq)
  let depth = 0, end = -1
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++
    else if (src[i] === "]") { depth--; if (depth === 0) { end = i + 1; break } }
  }
  try { return new Function(`return (${src.slice(open, end)});`)() } catch { return "PARSE_ERR" }
}

function shape(arr) {
  if (!Array.isArray(arr) || !arr.length) return "[]"
  const sample = arr[0]
  if (sample === null || typeof sample !== "object") return `Array<${typeof sample}>`
  const keys = Object.keys(sample).filter(k => !k.startsWith("_"))
  return `[${arr.length}] {${keys.join(", ")}}`
}

const TARGETS = [
  ["marketing", "src/app/monday-for-marketing/page.tsx", ["WHY_TABS","WHY_BEST_CARDS","MARKETING_CASE_STUDY_CARDS"]],
  ["construction", "src/app/monday-for-construction/MondayForConstructionContent.tsx", ["COMPARISON_TABS","CONSTRUCTION_FAQ_TABS","LIFECYCLE_STAGES","CONSTRUCTION_TESTIMONIALS","PARTNER_CASE_STUDIES_FALLBACK"]],
  ["impl-consultants", "src/app/monday-implementation-consultants/MondayImplementationConsultantsContent.tsx", []],
  ["finance", "src/app/monday-consulting-solutions/monday-for-finance/MondayForFinanceContent.tsx", ["WHY_MONDAY_ITEMS","FEATURES_ITEMS","HOW_WE_HELP_ITEMS","COMPARISON_TABS","GENERAL_FAQS","FINANCE_FAQS","HARDCODED_FAQ_TABS","FINANCE_FEATURE_CARDS"]],
  ["hr", "src/app/monday-consulting-solutions/monday-for-hr/MondayForHrContent.tsx", ["HR_COMPARISON_TABS","HR_LIFECYCLE_STAGES","HR_FIT_REASONS"]],
  ["solar", "src/app/monday-consulting-solutions/solar-crm-solution/SolarCrmSolutionContent.tsx", ["SERVICES","SOLAR_TESTIMONIALS","BEFORE_AFTER_TABS"]],
  ["cabinetry", "src/app/monday-consulting-solutions/monday-for-cabinetry-renovation/MondayForCabinetryRenovationContent.tsx", ["FALLBACK_SERVICES","FALLBACK_INLINE_TESTIMONIALS","FALLBACK_BEFORE_AFTER_TABS"]],
  ["clickup", "src/app/partnerships/certified-clickup-partner/CertifiedClickupPartnerContent.tsx", ["EVERYTHING_APP_CARDS","SERVICES_TABS","INDUSTRY_TABS","CLICKUP_FAQ_TABS","PROVEN_STATS","EVERYTHING_APP_FEATURES"]],
  ["consulting-partner", "src/app/partnerships/monday-consulting-partner/MondayConsultingPartnerContent.tsx", ["WHY_FRUITION","PARTNER_FAQ_TABS","PARTNER_TESTIMONIALS","IMPLEMENTATION_SERVICES","INDUSTRY_SOLUTIONS","COUNTRIES","FRUITION_ADVANTAGES"]],
  ["aircall", "src/app/partnerships/aircall-partner/AircallPartnerContent.tsx", ["AIRCALL_TABS","AIRCALL_FAQ_TABS"]],
  ["make", "src/app/partnerships/make-partners/MakePartnersContent.tsx", ["MAKE_FEATURE_TABS"]],
  ["atlassian", "src/app/partnerships/certified-atlassian-partner/CertifiedAtlassianPartnerContent.tsx", ["ATLASSIAN_TABS","ATLASSIAN_FAQ_TABS","PROVEN_STATS","SERVICE_CARDS","EXPERT_CARDS"]],
]

for (const [label, file, names] of TARGETS) {
  console.log(`\n=== ${label} (${file}) ===`)
  const src = fs.readFileSync(file, "utf8")
  for (const n of names) {
    const arr = extractArray(src, n)
    if (arr === null) console.log(`  ${n}: NOT FOUND`)
    else console.log(`  ${n}: ${shape(arr)}`)
  }
}
