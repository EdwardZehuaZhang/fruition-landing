// Seed Sanity solutionPage(monday-service) with fields that were
// previously hardcoded in MondayServicePage.tsx: calendly heading/sub
// and the closing TestimonialCtaBanner heading parts.
//
// The FE keeps the same string constants as fallbacks, so this script
// only needs to set the corresponding Sanity fields.
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

function extractStringConst(src, name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*`, "m")
  const m = re.exec(src)
  if (!m) throw new Error(`${name} not found`)
  // Find the start of the value just after the `=`
  const start = m.index + m[0].length
  // The value may be a template/string literal, possibly spanning multiple
  // lines if it uses string concatenation/template strings. Use a Function
  // eval over the substring up to the next blank-line/`const ` boundary.
  // Simpler: feed everything until the next top-level `const ` / `function `
  // / closing brace into Function.
  const tailRe = /\n(?:const\s+|function\s+|export\s+|interface\s+|\})/m
  const tail = src.slice(start)
  const tm = tailRe.exec(tail)
  const literal = (tm ? tail.slice(0, tm.index) : tail).trim()
  // Strip trailing comma / semicolon
  const cleaned = literal.replace(/[;,]\s*$/, "")
  // eslint-disable-next-line no-new-func
  return new Function(`return (${cleaned});`)()
}

const FILE =
  "src/app/monday-consulting-solutions/monday-service/MondayServicePage.tsx"
const src = fs.readFileSync(FILE, "utf8")

const calendlyHeading = extractStringConst(src, "MS_CALENDLY_HEADING")
const calendlySubheading = extractStringConst(src, "MS_CALENDLY_SUBHEADING")
const tbPart1 = extractStringConst(src, "MS_TB_HEADING_PART1")
const tbAccent = extractStringConst(src, "MS_TB_HEADING_ACCENT")
const tbPart2 = extractStringConst(src, "MS_TB_HEADING_PART2")

const doc = await client.fetch(
  `*[_type == "solutionPage" && slug.current == "monday-service"][0]{_id}`
)
if (!doc) {
  console.error("[monday-service] doc not found")
  process.exit(1)
}

const set = {
  calendlyHeading,
  calendlySubheading,
  testimonialBannerHeadingPart1: tbPart1,
  testimonialBannerHeadingAccent: tbAccent,
  testimonialBannerHeadingPart2: tbPart2,
}

const res = await client.patch(doc._id).set(set).commit()
console.log(
  `[monday-service] patched ${doc._id} rev=${res._rev} (${Object.keys(set).join(", ")})`
)
