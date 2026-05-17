// One-off: seed the partnershipPage doc for `certified-clickup-partner` with
// the hardcoded arrays currently living in CertifiedClickupPartnerContent.tsx.
// Mirrors the extract+patch pattern of seed-partner-pages.mjs / seed-small-batch.mjs.
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
  // Skip past the `=` so we don't match `[]` in a type annotation
  // like `const FOO: SomeType[] = [...]`.
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

const FILE = "src/app/partnerships/certified-clickup-partner/CertifiedClickupPartnerContent.tsx"
const src = fs.readFileSync(FILE, "utf8")

const everythingAppCards = extractArray(src, "EVERYTHING_APP_CARDS")
const servicesTabs = extractArray(src, "SERVICES_TABS")
const industryTabs = extractArray(src, "INDUSTRY_TABS")
const provenStats = extractArray(src, "PROVEN_STATS")
const everythingAppFeatures = extractArray(src, "EVERYTHING_APP_FEATURES")
const clickupFaqTabs = extractArray(src, "CLICKUP_FAQ_TABS")

const everythingAppCardsForSanity = everythingAppCards.map((c, i) => ({
  _key: `eac-${i}`,
  _type: "everythingAppCard",
  emoji: c.emoji,
  title: c.title,
  body: c.body,
}))

const servicesTabsForSanity = servicesTabs.map((t, i) => ({
  _key: t.key ? `st-${t.key}` : `st-${i}`,
  _type: "serviceTab",
  key: t.key,
  label: t.label,
  heading: t.heading,
  groups: (t.groups || []).map((g, gi) => ({
    _key: `st-${i}-g-${gi}`,
    _type: "serviceGroup",
    number: g.number,
    title: g.title,
    bullets: (g.bullets || []).map((b, bi) => ({
      _key: `st-${i}-g-${gi}-b-${bi}`,
      _type: "serviceBullet",
      emoji: b.emoji,
      text: b.text,
    })),
  })),
}))

const industryTabsForSanity = industryTabs.map((t, i) => ({
  _key: `it-${i}`,
  _type: "industryTab",
  label: t.label,
  description: t.description,
  features: (t.features || []).map((f, fi) => ({
    _key: `it-${i}-f-${fi}`,
    _type: "industryFeature",
    emoji: f.emoji,
    text: f.text,
  })),
}))

const provenStatsForSanity = provenStats.map((s, i) => ({
  _key: `ps-${i}`,
  _type: "provenStat",
  emoji: s.emoji,
  value: s.value,
  body: s.body,
}))

const everythingAppFeaturesForSanity = everythingAppFeatures.map((f, i) => ({
  _key: `eaf-${i}`,
  _type: "everythingAppFeature",
  number: f.number,
  title: f.title,
  body: f.body,
}))

const clickupFaqTabsForSanity = clickupFaqTabs.map((t, i) => ({
  _key: t._key || `cft-${i}`,
  _type: "faqTab",
  label: t.label,
  items: (t.items || []).map((it, j) => ({
    _key: it._key || `cft-${i}-i-${j}`,
    _type: "faqItem",
    question: it.question,
    answer: it.answer,
  })),
}))

const doc = await client.fetch(
  `*[_type == "partnershipPage" && slug.current == "certified-clickup-partner"][0]{_id}`,
)
if (!doc) {
  console.error("[clickup] partnershipPage doc not found for slug=certified-clickup-partner")
  process.exit(1)
}

const res = await client
  .patch(doc._id)
  .set({
    everythingAppCards: everythingAppCardsForSanity,
    servicesTabs: servicesTabsForSanity,
    industryTabsPartnership: industryTabsForSanity,
    provenStats: provenStatsForSanity,
    everythingAppFeatures: everythingAppFeaturesForSanity,
    clickupFaqTabs: clickupFaqTabsForSanity,
  })
  .commit()

console.log(
  `[clickup] patched ${doc._id} rev=${res._rev} (eac=${everythingAppCardsForSanity.length}, st=${servicesTabsForSanity.length}, it=${industryTabsForSanity.length}, ps=${provenStatsForSanity.length}, eaf=${everythingAppFeaturesForSanity.length}, cft=${clickupFaqTabsForSanity.length})`,
)
