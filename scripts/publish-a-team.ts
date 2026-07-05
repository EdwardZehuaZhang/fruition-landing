/**
 * One-off: publish "The A Team by Fruition" from scripts/a-team-body.md,
 * exercising the same pipeline the portal uses (bodyToPortableText + upsertBlogPost).
 *
 *   npx tsx scripts/publish-a-team.ts --dry   # print parsed blocks, no write
 *   npx tsx scripts/publish-a-team.ts         # publish to Sanity
 *
 * Requires SANITY_WRITE_TOKEN (+ NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET) in
 * .env.local. The write token is a production secret and is NOT committed.
 */
import { config as loadEnv } from "dotenv"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

// Load env first, THEN dynamically import the Sanity client (it reads project
// id / dataset at module-eval time, so it must not be statically imported).
loadEnv({ path: ".env.local" })

const dry = process.argv.includes("--dry")
const BODY_PATH =
  process.env.A_TEAM_BODY_PATH || fileURLToPath(new URL("./a-team-body.md", import.meta.url))
const body = readFileSync(BODY_PATH, "utf8")

const title = "The A Team by Fruition: A 6-Agent Autonomous Sales Pipeline on monday.com"
const slug = "a-team-6-agent-autonomous-sales-pipeline-monday"
const excerpt =
  "The A Team is a 6-Agent AI system built by Fruition's monday consultants on the monday.com Agent Builder — automating the whole sales pipeline from lead intake to project kick-off."
const seoTitle = "The A Team by Fruition: 6-Agent Autonomous Sales Pipeline"
const seoDescription =
  "Can Fruition's 6-Agent AI team automate monday.com sales pipelines? Learn how it works, from lead scoring to project kick-off."

async function main() {
  const { bodyToPortableText, upsertBlogPost } = await import("../src/lib/sanityWriteClient")

  const blocks = bodyToPortableText(body)
  const count = (t: string) => blocks.filter((b) => (b as { _type: string })._type === t).length
  console.log(
    `Parsed ${blocks.length} blocks — ${count("table")} table(s), ${count("videoEmbed")} video(s).`,
  )

  if (dry) {
    console.log("--dry: not writing to Sanity.")
    return
  }

  const result = await upsertBlogPost({
    docId: `blog-portal-${slug}`,
    title,
    body,
    slug,
    excerpt,
    author: "Fruition Editorial",
    seoTitle,
    seoDescription,
    publishedAt: new Date().toISOString(),
  })
  console.log("Published:", result)
  console.log(`View: /post/${result.slug}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
