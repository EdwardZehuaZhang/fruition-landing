/**
 * One-shot backfill: embed all published Sanity content into the Marketa
 * brain (Supabase `content_chunks`). Run once after the schema migration is
 * applied and env vars are set. Ongoing updates flow through the
 * /api/sanity-ingest webhook.
 *
 *   npm run brain:backfill            # ingest everything
 *   npm run brain:backfill -- --dry   # list what would be ingested, no writes
 *
 * Required env (.env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN
 *   GEMINI_API_KEY  (+ optional EMBEDDING_MODEL, EMBEDDING_DIM)
 *   MARKETA_SUPABASE_URL, MARKETA_SUPABASE_SERVICE_ROLE_KEY  (the brain project,
 *   separate from the site's own SUPABASE_* vars)
 */
import * as path from "path"
import * as dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

async function main() {
  // Imported dynamically AFTER dotenv.config() runs. A static `import` is
  // hoisted above the dotenv call, so src/sanity/env.ts (which throws if
  // NEXT_PUBLIC_SANITY_* is unset) would evaluate before .env.local loads.
  const { fetchAllIndexableDocs, ingestDoc } = await import(
    "../src/lib/marketa/sanityIngest"
  )

  const dry = process.argv.includes("--dry")
  const docs = await fetchAllIndexableDocs()
  console.log(`Found ${docs.length} indexable published documents.`)

  if (dry) {
    for (const d of docs) {
      console.log(`  • ${d._type}\t${d._id}\t${d.slug?.current ?? "(no slug)"}`)
    }
    console.log("\nDry run — no embeddings created, no rows written.")
    return
  }

  let indexed = 0
  let chunks = 0
  let skipped = 0
  const failures: Array<{ id: string; error: string }> = []

  // Pace requests to respect the embedding API's rate limit. Gemini's free
  // tier is ~1,500 RPM, so a brisk default is fine; embedTexts also retries on
  // 429. Lower EMBED_RPM if you ever hit throttling.
  const rpm = Math.max(1, Number(process.env.EMBED_RPM || "90"))
  const perDocDelayMs = Math.ceil(60000 / rpm)
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
  if (perDocDelayMs > 2000) {
    const mins = Math.ceil((docs.length * perDocDelayMs) / 60000)
    console.log(
      `Pacing at ${rpm} req/min (~${perDocDelayMs / 1000}s/doc) — est. ~${mins} min for ${docs.length} docs.\n`,
    )
  }

  // Sequential to stay polite to the Voyage rate limit. Bump to a small
  // concurrency pool if the corpus grows large.
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i]
    if (i > 0) await sleep(perDocDelayMs)
    try {
      const res = await ingestDoc(doc)
      if (res.action === "indexed") {
        indexed += 1
        chunks += res.chunks ?? 0
        console.log(`  ✓ ${res.sourceId} (${res.chunks} chunks)`)
      } else {
        skipped += 1
        console.log(`  – ${res.sourceId} skipped: ${res.reason}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      failures.push({ id: doc._id, error: message })
      console.error(`  ✗ ${doc._id} failed: ${message}`)
    }
  }

  console.log(
    `\nDone. Indexed ${indexed} docs (${chunks} chunks), skipped ${skipped}, failed ${failures.length}.`,
  )
  if (failures.length > 0) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
