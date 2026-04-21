import { writeClient } from './sanity-client'

async function main() {
  const pageId = 'servicePage-ai-strategy-and-execution'

  const existing = await writeClient.getDocument(pageId)
  if (!existing) throw new Error(`Document ${pageId} not found`)

  await writeClient
    .patch(pageId)
    .set({
      comparisonHeading: 'Artificial Intelligence at Scale',
    })
    .commit()

  console.log(`Patched ${pageId}: set comparisonHeading.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
