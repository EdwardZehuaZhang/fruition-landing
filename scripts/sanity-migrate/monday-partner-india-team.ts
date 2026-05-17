/**
 * Push the India team roster onto the monday-partner-india locationPage doc
 * so the frontend can stop hardcoding INDIA_TEAM_NAMES.
 *
 *   npx tsx scripts/sanity-migrate/monday-partner-india-team.ts
 */
import { writeClient } from './lib'

const SLUG = 'monday-partner-india'
const TEAM_MEMBER_NAMES = [
  'Josh Jebathilak',
  'Prakriti Chaubey',
  'Aquib Zafar',
  'Nikhil Tiwari',
  'Yuzia Haque',
  'Tejas Singh',
]

async function main() {
  const doc = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "locationPage" && slug.current == $slug][0]{ _id }`,
    { slug: SLUG },
  )
  if (!doc?._id) throw new Error(`No locationPage with slug ${SLUG}`)

  await writeClient
    .patch(doc._id)
    .set({ teamMemberNames: TEAM_MEMBER_NAMES })
    .commit()
  console.log(`✅ patched locationPage:${SLUG} teamMemberNames`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
