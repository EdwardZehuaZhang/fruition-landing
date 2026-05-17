// Cabinetry seed: uploads card images + patches solutionCards.image, then
// seeds servicesListItems + inlineTestimonials + beforeAfterTabs from the
// FALLBACK_* arrays in the Content.tsx file.
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

const CARD_IMAGE_MAP = {
  "PROJECT SCHEDULING": "public/images/cabinetry-project-scheduling.avif",
  "INVENTORY TRACKING": "public/images/cabinetry-inventory-tracking.avif",
  "CLIENT COMMUNICATION": "public/images/cabinetry-client-communication.avif",
  "CHANGE ORDER MANAGEMENT": "public/images/cabinetry-change-order.avif",
}

const doc = await client.fetch(`*[_type == "solutionPage" && slug.current == "monday-for-cabinetry-renovation"][0]{_id, solutionCards}`)
if (!doc) { console.error("doc not found"); process.exit(1) }

// 1. Upload images + build asset ref map per eyebrow key.
const assetRefByKey = {}
for (const [key, filePath] of Object.entries(CARD_IMAGE_MAP)) {
  const buf = fs.readFileSync(filePath)
  const asset = await client.assets.upload("image", buf, {
    filename: filePath.split("/").pop(),
    contentType: "image/avif",
  })
  assetRefByKey[key] = asset._id
  console.log(`  uploaded ${filePath} -> ${asset._id}`)
}

// 2. Patch solutionCards to include image asset ref.
const patchedCards = (doc.solutionCards || []).map((card) => {
  const key = (card.eyebrow ?? "").toUpperCase().trim()
  const assetRef = assetRefByKey[key]
  if (!assetRef) return card
  return { ...card, image: { _type: "image", asset: { _type: "reference", _ref: assetRef } } }
})

// 3. Seed FALLBACK_* arrays.
const src = fs.readFileSync("src/app/monday-consulting-solutions/monday-for-cabinetry-renovation/MondayForCabinetryRenovationContent.tsx", "utf8")
const servicesListItems = extractArray(src, "FALLBACK_SERVICES")
const inlineTestimonials = extractArray(src, "FALLBACK_INLINE_TESTIMONIALS").map((t, i) => ({
  _key: `it-${i}`, _type: "inlineTestimonial",
  quote: t.quote, name: t.name, role: t.role, company: t.company,
  // photo is a string path in fallback; keep as plain string since the FE supports both
  // and Sanity field accepts image refs. To match schema, skip if it's a string.
}))
const beforeAfterTabs = extractArray(src, "FALLBACK_BEFORE_AFTER_TABS").map((tab, i) => ({
  _key: tab._key || `tab-${i}`,
  _type: "comparisonTab",
  label: tab.label,
  items: (tab.items || []).map((it, j) => ({
    _key: it._key || `it-${i}-${j}`,
    _type: "comparisonItem",
    number: it.number, title: it.title, description: it.description,
  })),
}))

const res = await client.patch(doc._id).set({
  solutionCards: patchedCards,
  servicesListItems,
  inlineTestimonials,
  beforeAfterTabs,
}).commit()
console.log(`patched ${doc._id} rev=${res._rev}`)
