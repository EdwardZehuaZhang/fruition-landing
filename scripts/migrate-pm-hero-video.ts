import { writeClient } from './sanity-client'

async function main() {
  const pageId = 'solutionPage-monday-project-management'
  const heroVideoUrl = 'https://www.youtube.com/watch?v=7vtrtlfC1Zg'

  const existing = await writeClient.getDocument(pageId)
  if (!existing) {
    throw new Error(`Document ${pageId} not found`)
  }

  await writeClient
    .patch(pageId)
    .set({ heroVideoUrl, hideTestimonialsSection: true })
    .commit()
  console.log(
    `Set heroVideoUrl on ${pageId} -> ${heroVideoUrl}; hideTestimonialsSection -> true`,
  )
}

main().catch((err) => { console.error(err); process.exit(1) })
