// Seed Sanity solutionPage(monday-project-management) with copy that
// was previously hardcoded in MondayProjectManagementContent.tsx:
// calendly heading/sub, logo cloud heading parts, and the closing
// TestimonialCtaBanner heading parts.
//
// The FE keeps the same string constants as fallbacks, so this script
// only needs to populate the corresponding Sanity fields.
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
  const start = m.index + m[0].length
  const tailRe = /\n(?:const\s+|function\s+|export\s+|interface\s+|\})/m
  const tail = src.slice(start)
  const tm = tailRe.exec(tail)
  const literal = (tm ? tail.slice(0, tm.index) : tail).trim()
  const cleaned = literal.replace(/[;,]\s*$/, "")
  // eslint-disable-next-line no-new-func
  return new Function(`return (${cleaned});`)()
}

const FILE =
  "src/app/monday-consulting-solutions/monday-project-management/MondayProjectManagementContent.tsx"
const src = fs.readFileSync(FILE, "utf8")

const calendlyHeading = extractStringConst(src, "PM_CALENDLY_HEADING")
const calendlySubheading = extractStringConst(src, "PM_CALENDLY_SUBHEADING")
const logoCloudPart1 = extractStringConst(src, "PM_LOGO_CLOUD_PART1")
const logoCloudAccent = extractStringConst(src, "PM_LOGO_CLOUD_ACCENT")
const tbPart1 = extractStringConst(src, "PM_TB_HEADING_PART1")
const tbAccent = extractStringConst(src, "PM_TB_HEADING_ACCENT")
const tbPart2 = extractStringConst(src, "PM_TB_HEADING_PART2")

const doc = await client.fetch(
  `*[_type == "solutionPage" && slug.current == "monday-project-management"][0]{_id}`
)
if (!doc) {
  console.error("[monday-project-management] doc not found")
  process.exit(1)
}

const set = {
  calendlyHeading,
  calendlySubheading,
  logoCloudHeadingPart1: logoCloudPart1,
  logoCloudHeadingAccent: logoCloudAccent,
  testimonialBannerHeadingPart1: tbPart1,
  testimonialBannerHeadingAccent: tbAccent,
  testimonialBannerHeadingPart2: tbPart2,
}

const res = await client.patch(doc._id).set(set).commit()
console.log(
  `[monday-project-management] patched ${doc._id} rev=${res._rev} (${Object.keys(set).join(", ")})`
)
