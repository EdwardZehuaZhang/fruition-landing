// One-off: seed the `makePartnersPage` Sanity doc with the
// `MAKE_FEATURE_TABS` and `SHOWCASE_OVERRIDES` constants that are currently
// hardcoded in MakePartnersContent.tsx. Mirrors scripts/seed-partner-pages.mjs
// and scripts/seed-small-batch.mjs patterns. Extracts via balanced
// bracket/brace scan and evals via `new Function`.
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
  // Skip past `=` so we don't match `[]` in `: MakeFeatureTab[] = [...]`.
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

function extractObject(src, name) {
  const marker = `const ${name}`
  const idx = src.indexOf(marker)
  if (idx === -1) throw new Error(`${name} not found`)
  const eq = src.indexOf("=", idx)
  if (eq === -1) throw new Error(`= for ${name} not found`)
  const open = src.indexOf("{", eq)
  if (open === -1) throw new Error(`opening { for ${name} not found`)
  let depth = 0
  let end = -1
  for (let i = open; i < src.length; i++) {
    const ch = src[i]
    if (ch === "{") depth++
    else if (ch === "}") {
      depth--
      if (depth === 0) { end = i + 1; break }
    }
  }
  if (end === -1) throw new Error(`closing } for ${name} not found`)
  const literal = src.slice(open, end)
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal});`)()
}

const FILE = "src/app/partnerships/make-partners/MakePartnersContent.tsx"
const src = fs.readFileSync(FILE, "utf8")

const tabsRaw = extractArray(src, "MAKE_FEATURE_TABS")
const overridesRaw = extractObject(src, "SHOWCASE_OVERRIDES")

// Normalise tabs into the Sanity object shape: add _key + _type to each tab,
// each group, and each bullet.
const makeFeatureTabs = tabsRaw.map((tab, i) => ({
  _key: tab._key || `mft-${i}`,
  _type: "makeFeatureTab",
  key: tab.key,
  label: tab.label,
  heading: tab.heading,
  intro: tab.intro,
  outro: tab.outro,
  groups: (tab.groups || []).map((g, j) => ({
    _key: `mfg-${i}-${j}`,
    _type: "makeFeatureGroup",
    number: g.number,
    title: g.title,
    bullets: (g.bullets || []).map((b, k) => ({
      _key: `mfb-${i}-${j}-${k}`,
      _type: "makeFeatureBullet",
      emoji: b.emoji,
      text: b.text,
    })),
  })),
}))

// SHOWCASE_OVERRIDES is a Record<string, {mediaType, mediaSrc}> in source.
// Sanity object attribute names can't contain spaces (the Record keys are
// human-readable showcase headings, e.g. "solve finance complexities"), so
// we serialise as an array of `{ key, mediaType, mediaSrc }` objects. The
// FE reduces this array back to a Record before merging with the hardcoded
// fallback.
const showcaseOverrides = Object.entries(overridesRaw).map(([k, v], i) => ({
  _key: `so-${i}`,
  _type: "showcaseOverride",
  key: k,
  mediaType: v.mediaType,
  mediaSrc: v.mediaSrc,
}))

const doc = await client.fetch(`*[_type == "makePartnersPage"][0]{_id}`)
if (!doc) {
  console.error("[make-partners] doc not found — create a makePartnersPage in Sanity first.")
  process.exit(1)
}

const res = await client
  .patch(doc._id)
  .set({
    makeFeatureTabs,
    showcaseOverrides,
  })
  .commit()

console.log(
  `[make-partners] patched ${doc._id} rev=${res._rev} ` +
    `(makeFeatureTabs=${makeFeatureTabs.length}, ` +
    `showcaseOverrides=${showcaseOverrides.length})`
)
