/**
 * Delete faqItem documents that pre-date the central seed.
 *
 * The old headless-scrape.js (now superseded by scrape-faqs-full.js +
 * seed-faqs.ts) wrote faqItems with plain numeric ids like `faq-0`,
 * `faq-1`, … and no category/pages metadata. The new seed uses hashed
 * ids (`faq-<sha1>`). This script keeps only the new-format docs.
 *
 * Dry-run by default. Pass `--commit` to actually delete.
 */
import { writeClient } from './lib'

const COMMIT = process.argv.includes('--commit')

type StaleDoc = { _id: string; question?: string; category?: string }

async function main() {
  const all = await writeClient.fetch<StaleDoc[]>(
    `*[_type == "faqItem"]{ _id, question, category }`,
  )
  const stale = all.filter(
    (d) => !d._id.match(/^faq-[a-f0-9]{16}$/) || !d.category,
  )
  console.log(`Total faqItem docs: ${all.length}`)
  console.log(`Stale candidates (old id format or no category): ${stale.length}`)
  for (const doc of stale) {
    console.log(`  ${doc._id}  ${doc.question?.slice(0, 80) ?? '(no question)'}`)
  }

  if (!COMMIT) {
    console.log('\nDry run — pass --commit to delete.')
    return
  }

  for (const doc of stale) {
    await writeClient.delete(doc._id)
    console.log(`  ✗ deleted ${doc._id}`)
  }
  const after = await writeClient.fetch<number>('count(*[_type == "faqItem"])')
  console.log(`\nDone. faqItem count now: ${after}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
