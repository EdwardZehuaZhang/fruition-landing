// Seed Sanity servicePage(ai-strategy-and-execution) with the
// logo-cloud heading copy previously hardcoded in AiStrategyContent.tsx.
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

const FILE = "src/app/ai-strategy-and-execution/AiStrategyContent.tsx"
const src = fs.readFileSync(FILE, "utf8")

const logoCloudPart1 = extractStringConst(src, "AI_LOGO_CLOUD_PART1")
const logoCloudAccent = extractStringConst(src, "AI_LOGO_CLOUD_ACCENT")

const doc = await client.fetch(
  `*[_type == "servicePage" && slug.current == "ai-strategy-and-execution"][0]{_id}`
)
if (!doc) {
  console.error("[ai-strategy-and-execution] doc not found")
  process.exit(1)
}

const set = {
  logoCloudHeadingPart1: logoCloudPart1,
  logoCloudHeadingAccent: logoCloudAccent,
}

const res = await client.patch(doc._id).set(set).commit()
console.log(
  `[ai-strategy-and-execution] patched ${doc._id} rev=${res._rev} (${Object.keys(set).join(", ")})`
)
