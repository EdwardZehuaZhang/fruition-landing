// One-off: seed the partnershipPage doc for `monday-consulting-partner` with
// the hardcoded arrays from MondayConsultingPartnerContent.tsx. Mirrors the
// pattern in seed-partner-pages.mjs / seed-small-batch.mjs — extracts each
// `const NAME = [...]` literal via a balanced-bracket scan, evaluates it, and
// patches Sanity. PARTNER_FAQ_TABS is intentionally NOT migrated (phase 2).
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
  // Skip past the `=` so we don't match `[]` in a type annotation like
  // `const PARTNER_FAQ_TABS: FaqTab[] = [...]`.
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

const FILE = "src/app/partnerships/monday-consulting-partner/MondayConsultingPartnerContent.tsx"
const SLUG = "monday-consulting-partner"

const src = fs.readFileSync(FILE, "utf8")

const whyFruition = extractArray(src, "WHY_FRUITION")
const partnerTestimonials = extractArray(src, "PARTNER_TESTIMONIALS")
const implementationServices = extractArray(src, "IMPLEMENTATION_SERVICES")
const industrySolutions = extractArray(src, "INDUSTRY_SOLUTIONS")
const countries = extractArray(src, "COUNTRIES")
const fruitionAdvantages = extractArray(src, "FRUITION_ADVANTAGES")

const partnerTestimonialsForSanity = partnerTestimonials.map((t, i) => ({
  _key: `pt-${i}`,
  _type: "partnerTestimonial",
  name: t.name,
  role: t.role,
  quote: t.quote,
  photo: t.photo,
}))

const implementationServicesForSanity = implementationServices.map((s, i) => ({
  _key: `is-${i}`,
  _type: "implementationService",
  emoji: s.emoji,
  title: s.title,
  body: s.body,
}))

const industrySolutionsForSanity = industrySolutions.map((s, i) => ({
  _key: `ids-${i}`,
  _type: "industrySolution",
  emoji: s.emoji,
  label: s.label,
}))

const countriesForSanity = countries.map((c, i) => ({
  _key: `co-${i}`,
  _type: "country",
  emoji: c.emoji,
  label: c.label,
}))

const doc = await client.fetch(
  `*[_type == "partnershipPage" && slug.current == $slug][0]{_id}`,
  { slug: SLUG }
)
if (!doc) {
  console.error(`[${SLUG}] partnershipPage doc not found`)
  process.exit(1)
}

const set = {
  whyFruition,
  partnerTestimonials: partnerTestimonialsForSanity,
  implementationServices: implementationServicesForSanity,
  industrySolutions: industrySolutionsForSanity,
  countries: countriesForSanity,
  fruitionAdvantages,
}

const res = await client.patch(doc._id).set(set).commit()

const summary = Object.entries(set)
  .map(([k, v]) => `${k}=${Array.isArray(v) ? v.length : "?"}`)
  .join(", ")
console.log(`[${SLUG}] patched ${doc._id} rev=${res._rev} (${summary})`)
