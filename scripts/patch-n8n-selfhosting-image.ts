/**
 * One-off script: upload the self-hosting image and attach it to the
 * "Complete Self-Hosting Control" solution card on the n8n-integration-partner page.
 *
 * Usage:  npx tsx scripts/patch-n8n-selfhosting-image.ts
 */
import { writeClient, uploadLocalImage } from './sanity-migrate/lib'

const SLUG = 'n8n-integration-partner'
const PAGE_TYPE = 'partnershipPage'

async function main() {
  // 1. Upload the image
  const imageRef = await uploadLocalImage('images/n8n-self-hosting.avif')
  console.log('Image uploaded:', imageRef.asset._ref)

  // 2. Fetch the existing document
  const doc = await writeClient.fetch<{ _id: string; solutionCards?: any[] } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id, solutionCards }`,
    { type: PAGE_TYPE, slug: SLUG },
  )

  if (!doc) {
    console.error(`Document not found: ${PAGE_TYPE} with slug "${SLUG}"`)
    process.exit(1)
  }

  console.log(`Found document ${doc._id} with ${doc.solutionCards?.length ?? 0} solution cards`)

  // 3. Find the Self-Hosting card by heading
  const cards = doc.solutionCards ?? []
  const idx = cards.findIndex(
    (c: any) => c.heading === 'Complete Self-Hosting Control',
  )

  if (idx === -1) {
    console.error('Could not find "Complete Self-Hosting Control" solution card')
    process.exit(1)
  }

  console.log(`Patching solutionCards[${idx}] with image`)

  // 4. Patch just that card's image
  await writeClient
    .patch(doc._id)
    .set({ [`solutionCards[${idx}].image`]: imageRef })
    .commit()

  console.log('Done ✓')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
