// One-off: seed locationPage docs for monday-partner-* with the
// comparisonTabs / featureBlocks / roiStats arrays currently hardcoded
// in each Content.tsx file. Extracts the arrays in-place via a balanced
// bracket scan (regex too brittle), evals them, and patches Sanity.
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
  const marker = `const ${name}`
  const idx = src.indexOf(marker)
  if (idx === -1) throw new Error(`${name} not found`)
  // Skip past the `=` sign so we don't match `[]` in a type annotation
  // like `const UK_TABS: ComparisonTab[] = [...]`.
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
  const literal = src.slice(open, end)
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal});`)()
}

function withKeys(arr, prefix) {
  return arr.map((x, i) => ({ _key: `${prefix}-${i}`, ...x }))
}

const TARGETS = [
  { slug: "monday-partner-uk", docId: "locationPage-monday-partner-uk", file: "src/app/monday-partner-uk/MondayPartnerUkContent.tsx", tabsName: "UK_TABS" },
  { slug: "monday-partner-singapore", docId: "locationPage-monday-partner-singapore", file: "src/app/monday-partner-singapore/MondayPartnerSingaporeContent.tsx", tabsName: "SG_TABS" },
  { slug: "monday-partner-australia", docId: "locationPage-monday-partner-australia", file: "src/app/monday-partner-australia/MondayPartnerAustraliaContent.tsx", tabsName: "AU_TABS" },
  { slug: "monday-partner-us", docId: "locationPage-monday-partner-us", file: "src/app/monday-partner-us/MondayPartnerUsContent.tsx", tabsName: "US_TABS" },
  { slug: "monday-partner-india", docId: "locationPage-monday-partner-india", file: "src/app/monday-partner-india/MondayPartnerIndiaContent.tsx", tabsName: "IN_TABS" },
]

for (const t of TARGETS) {
  const src = fs.readFileSync(t.file, "utf8")
  const tabs = extractArray(src, t.tabsName)
  const featureBlocks = extractArray(src, "FEATURE_BLOCKS")
  const roiStats = extractArray(src, "ROI_STATS")

  // Normalise to Sanity object shape with _type + _key.
  const tabsForSanity = tabs.map((tab, i) => ({
    _key: tab._key || `tab-${i}`,
    _type: "comparisonTab",
    label: tab.label,
    items: (tab.items || []).map((it, j) => ({
      _key: it._key || `item-${i}-${j}`,
      _type: "comparisonItem",
      number: it.number,
      title: it.title,
      description: it.description,
    })),
  }))
  const featureBlocksForSanity = featureBlocks.map((b, i) => ({
    _key: `fb-${i}`,
    _type: "featureBlock",
    title: b.title,
    body: b.body,
    ctaLabel: b.ctaLabel,
    ctaUrl: b.ctaUrl,
    image: b.image,
  }))
  const roiStatsForSanity = roiStats.map((s, i) => ({
    _key: `roi-${i}`,
    _type: "roiStat",
    value: s.value,
    label: s.label,
  }))

  const res = await client
    .patch(t.docId)
    .set({
      comparisonTabs: tabsForSanity,
      featureBlocks: featureBlocksForSanity,
      roiStats: roiStatsForSanity,
    })
    .commit()
  console.log(`[${t.slug}] patched rev=${res._rev} (tabs=${tabsForSanity.length}, fb=${featureBlocksForSanity.length}, roi=${roiStatsForSanity.length})`)
}
