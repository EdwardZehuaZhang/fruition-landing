// One-off seed for solutionPage `monday-product-management`.
// Migrates the hardcoded arrays in MondayProductManagementContent.tsx into
// Sanity. The FE already prefers the Sanity field (e.g. `whyProductTeamsCards`)
// over the hardcoded fallback, so once these fields are populated the page is
// fully CMS-driven.
//
// Idempotent guard: only fields that are currently empty in Sanity are
// patched. This avoids clobbering image asset refs that already live in
// `productDevelopmentTabs` (the hardcoded FE fallback only has string image
// paths, not Sanity image refs).
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

function extractArrayLiteral(src, name) {
  const marker = `const ${name}`
  const idx = src.indexOf(marker)
  if (idx === -1) throw new Error(`${name} not found`)
  // Skip past the `=` sign so we don't match `[]` in a type annotation
  // like `const FOO: BarType[] = [...]`.
  const eq = src.indexOf("=", idx)
  if (eq === -1) throw new Error(`= for ${name} not found`)
  const open = src.indexOf("[", eq)
  if (open === -1) throw new Error(`opening [ for ${name} not found`)
  let depth = 0
  let end = -1
  for (let i = open; i < src.length; i++) {
    const ch = src[i]
    if (ch === "[") depth++
    else if (ch === "]") {
      depth--
      if (depth === 0) { end = i + 1; break }
    }
  }
  if (end === -1) throw new Error(`closing ] for ${name} not found`)
  return src.slice(open, end)
}

function extractArray(src, name, deps = {}) {
  const literal = extractArrayLiteral(src, name)
  const depNames = Object.keys(deps)
  const depVals = Object.values(deps)
  // eslint-disable-next-line no-new-func
  return new Function(...depNames, `return (${literal});`)(...depVals)
}

const FILE = "src/app/monday-consulting-solutions/monday-product-management/MondayProductManagementContent.tsx"
const SLUG = "monday-product-management"

const src = fs.readFileSync(FILE, "utf8")

// Extract hardcoded arrays from the FE file (single source of truth).
// APPROACH_TABS and INDUSTRY_TABS compose other consts, so pass them as deps.
const WHY_PRODUCT_TEAMS_CARDS = extractArray(src, "WHY_PRODUCT_TEAMS_CARDS")
const STRATEGY_ITEMS = extractArray(src, "STRATEGY_ITEMS")
const BACKLOG_ITEMS = extractArray(src, "BACKLOG_ITEMS")
const COORDINATION_ITEMS = extractArray(src, "COORDINATION_ITEMS")
const APPROACH_TABS = extractArray(src, "APPROACH_TABS", {
  STRATEGY_ITEMS,
  BACKLOG_ITEMS,
  COORDINATION_ITEMS,
})
const SAAS_SECTIONS = extractArray(src, "SAAS_SECTIONS")
const MANUFACTURING_SECTIONS = extractArray(src, "MANUFACTURING_SECTIONS")
const RETAIL_SECTIONS = extractArray(src, "RETAIL_SECTIONS")
const INDUSTRY_TABS = extractArray(src, "INDUSTRY_TABS", {
  SAAS_SECTIONS,
  MANUFACTURING_SECTIONS,
  RETAIL_SECTIONS,
})
const PRODUCT_DEVELOPMENT_TABS = extractArray(src, "PRODUCT_DEVELOPMENT_TABS")

// Shape into Sanity payloads (matching the schema in
// src/sanity/schemas/solutionPage.ts).
const whyProductTeamsCards = WHY_PRODUCT_TEAMS_CARDS.map((c, i) => ({
  _key: `wpc-${i}`,
  _type: "whyProductTeamCard",
  emoji: c.emoji,
  title: c.title,
  description: c.description,
}))

const strategicApproachTabs = APPROACH_TABS.map((t, i) => ({
  _key: `sa-${i}`,
  _type: "strategicApproachTab",
  label: t.label,
  items: (t.items || []).map((it, j) => ({
    _key: `sa-${i}-${j}`,
    _type: "emojiItem",
    emoji: it.emoji,
    text: it.text,
  })),
}))

const industryProductSolutionsTabs = INDUSTRY_TABS.map((t, i) => ({
  _key: `ipt-${i}`,
  _type: "industryProductSolutionTab",
  label: t.label,
  description: t.description,
  sections: (t.sections || []).map((s, j) => ({
    _key: `ipt-${i}-s-${j}`,
    _type: "numberedSection",
    number: s.number,
    title: s.title,
    bullets: (s.bullets || []).map((b, k) => ({
      _key: `ipt-${i}-s-${j}-b-${k}`,
      _type: "emojiBullet",
      emoji: b.emoji,
      text: b.text,
    })),
  })),
}))

// productDevelopmentTabs: the hardcoded fallback uses string image paths
// (e.g. "/images/product-management/sprint-planning.avif") which are NOT
// valid Sanity image refs. We deliberately omit `image` here so existing
// asset refs in Sanity are preserved; `imageAlt` is still included.
const productDevelopmentTabs = PRODUCT_DEVELOPMENT_TABS.map((t, i) => ({
  _key: `pdt-${i}`,
  _type: "productDevelopmentTab",
  label: t.label,
  description: t.description,
  bullets: (t.bullets || []).map((b, j) => ({
    _key: `pdt-${i}-b-${j}`,
    _type: "emojiBullet",
    emoji: b.emoji,
    text: b.text,
  })),
  imageAlt: t.imageAlt,
}))

// Fetch existing doc — only patch fields that are currently empty so we
// don't clobber editorial overrides or image asset refs.
const existing = await client.fetch(
  `*[_type == "solutionPage" && slug.current == $slug][0]{
    _id,
    "whyProductTeamsCardsCount": count(whyProductTeamsCards),
    "strategicApproachTabsCount": count(strategicApproachTabs),
    "industryProductSolutionsTabsCount": count(industryProductSolutionsTabs),
    "productDevelopmentTabsCount": count(productDevelopmentTabs)
  }`,
  { slug: SLUG },
)

if (!existing?._id) {
  throw new Error(`solutionPage doc not found for slug=${SLUG}`)
}

const patch = {}
if (!existing.whyProductTeamsCardsCount) {
  patch.whyProductTeamsCards = whyProductTeamsCards
}
if (!existing.strategicApproachTabsCount) {
  patch.strategicApproachTabs = strategicApproachTabs
}
if (!existing.industryProductSolutionsTabsCount) {
  patch.industryProductSolutionsTabs = industryProductSolutionsTabs
}
if (!existing.productDevelopmentTabsCount) {
  // Only seed pdt when it's empty — re-running would otherwise wipe image
  // asset refs (we don't include `image` in the payload).
  patch.productDevelopmentTabs = productDevelopmentTabs
}

const summary = {
  whyProductTeamsCards: existing.whyProductTeamsCardsCount,
  strategicApproachTabs: existing.strategicApproachTabsCount,
  industryProductSolutionsTabs: existing.industryProductSolutionsTabsCount,
  productDevelopmentTabs: existing.productDevelopmentTabsCount,
}
console.log(`[${SLUG}] current state:`, summary)

if (Object.keys(patch).length === 0) {
  console.log(`[${SLUG}] all fields already populated — nothing to patch`)
} else {
  const res = await client.patch(existing._id).set(patch).commit()
  const patched = Object.entries(patch)
    .map(([k, v]) => `${k}=${v.length}`)
    .join(", ")
  console.log(`[${SLUG}] patched ${existing._id} rev=${res._rev} (${patched})`)
}
