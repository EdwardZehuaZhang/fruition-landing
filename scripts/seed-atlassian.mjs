// One-off: seed the certified-atlassian-partner partnershipPage doc
// with the atlassianTabs / provenStats / serviceCards / expertCards
// arrays currently hardcoded in CertifiedAtlassianPartnerContent.tsx.
// Extracts arrays in-place via a balanced bracket scan, evals them,
// and patches Sanity.
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
  // like `const ATLASSIAN_TABS: ComparisonTab[] = [...]`.
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

const FILE = "src/app/partnerships/certified-atlassian-partner/CertifiedAtlassianPartnerContent.tsx"
const DOC_QUERY = `*[_type == "partnershipPage" && slug.current == "certified-atlassian-partner"][0]{_id}`

const doc = await client.fetch(DOC_QUERY)
if (!doc) {
  console.error(`partnershipPage with slug "certified-atlassian-partner" not found`)
  process.exit(1)
}

const src = fs.readFileSync(FILE, "utf8")

const tabs = extractArray(src, "ATLASSIAN_TABS")
const provenStats = extractArray(src, "PROVEN_STATS")
const serviceCards = extractArray(src, "SERVICE_CARDS")
const expertCards = extractArray(src, "EXPERT_CARDS")

const atlassianTabsForSanity = tabs.map((tab, i) => ({
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

const provenStatsForSanity = provenStats.map((s, i) => ({
  _key: `ps-${i}`,
  _type: "provenStat",
  emoji: s.emoji,
  value: s.value,
  body: s.body,
}))

const serviceCardsForSanity = serviceCards.map((c, i) => ({
  _key: `sc-${i}`,
  _type: "atlassianServiceCard",
  emoji: c.emoji,
  title: c.title,
  body: c.body,
  bullets: c.bullets || [],
}))

const expertCardsForSanity = expertCards.map((c, i) => ({
  _key: `ec-${i}`,
  _type: "atlassianExpertCard",
  title: c.title,
  body: c.body,
  image: c.image,
}))

const res = await client
  .patch(doc._id)
  .set({
    atlassianTabs: atlassianTabsForSanity,
    provenStats: provenStatsForSanity,
    serviceCards: serviceCardsForSanity,
    expertCards: expertCardsForSanity,
  })
  .commit()

console.log(
  `[certified-atlassian-partner] patched ${doc._id} rev=${res._rev} ` +
  `(atlassianTabs=${atlassianTabsForSanity.length}, ` +
  `provenStats=${provenStatsForSanity.length}, ` +
  `serviceCards=${serviceCardsForSanity.length}, ` +
  `expertCards=${expertCardsForSanity.length})`
)
