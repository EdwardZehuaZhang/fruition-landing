// Seed Sanity bottomVideoUrl/bottomVideoTitle for the Hootsuite Delivery
// Partner page. The FE hardcoded a YouTube id ("7zC5uxk0lc8" / "Hootsuite
// overview") below the comparison tabs; this script migrates that into
// Sanity so the FE renders identically once the doc is populated.
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

const SLUG = "hootsuite-delivery-partner"

const doc = await client.fetch(
  `*[_type == "partnershipPage" && slug.current == $slug][0]{_id}`,
  { slug: SLUG },
)
if (!doc) {
  console.error(`[${SLUG}] partnershipPage doc not found`)
  process.exit(1)
}

const res = await client
  .patch(doc._id)
  .set({
    bottomVideoUrl: "https://www.youtube.com/watch?v=7zC5uxk0lc8",
    bottomVideoTitle: "Hootsuite overview",
  })
  .commit()

console.log(`[${SLUG}] patched ${doc._id} rev=${res._rev}`)
