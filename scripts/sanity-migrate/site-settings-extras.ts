/**
 * Seed siteSettings fields that previously lived as hardcoded fallbacks
 * in code: default SEO copy + excluded team-member names.
 *
 *   npx tsx scripts/sanity-migrate/site-settings-extras.ts
 */
import { writeClient } from './lib'

async function main() {
  const doc = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "siteSettings"][0]{ _id }`,
  )
  if (!doc?._id) throw new Error('No siteSettings doc found')

  await writeClient
    .patch(doc._id)
    .setIfMissing({
      defaultSeoTitle: 'Fruition Services | monday.com Platinum Partners',
      defaultSeoDescription:
        'Expert monday.com implementation, consulting, and training. Fruition is your trusted monday.com Platinum Partner.',
      excludedTeamMemberNames: ['Aquib Zafar', 'Natalia Mishenina'],
    })
    .commit()
  console.log(`✅ patched siteSettings:${doc._id}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
