import { writeClient } from './sanity-client'

async function main() {
  const pageId = 'solutionPage-monday-project-management'

  console.log('Patching monday-project-management to hide Discover CTA and Join Stats sections...')

  await writeClient
    .patch(pageId)
    .set({
      hideDiscoverSection: true,
      hideJoinStatsSection: true,
    })
    .commit()

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
