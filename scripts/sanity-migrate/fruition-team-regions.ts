/**
 * Populate Sanity fields for the `page` doc with slug `fruition-team`:
 *   - teamRegions (region filter chips)
 *   - heroDescriptionBlocks (paragraphs under hero CTA)
 *
 * Idempotent — uses setIfMissing so values an editor changes in Studio
 * are preserved on re-run.
 *
 *   npx tsx scripts/sanity-migrate/fruition-team-regions.ts
 */
import { writeClient, withKeys } from './lib'

const SLUG = 'fruition-team'
const TYPE = 'page'

const TEAM_REGIONS = [
  { code: 'APAC', label: 'Meet the APAC Team', emoji: '🌏' },
  { code: 'UK', label: 'Meet the UK Team', emoji: '🇬🇧' },
  { code: 'US', label: 'Meet the US Team', emoji: '🇺🇸' },
  { code: 'IN', label: 'Meet the India Team', emoji: '🇮🇳' },
]

const HERO_DESCRIPTION_BLOCKS = [
  {
    style: 'paragraph',
    text: 'The Fruition team consists of 37 highly talented consultants that are fully certified in disciplines such as monday.com, Atlassian, Make, n8n, and Hootsuite.',
  },
  {
    style: 'paragraph',
    text: 'We are globally certified and insured in all regions with the tools we partner proudly partner and understand the importance of IP and data security as our core.',
  },
  {
    style: 'paragraph',
    text: 'The Fruition team comes from all walks of life. Our managing director, Josh is an ex-monday.com employee with 15 years of experience in software transformation and change management, bringing over four years of direct experience from monday.com.',
  },
  {
    style: 'bold',
    text: "The Fruition team's vision is simple",
  },
  {
    style: 'paragraph',
    text: 'Implement software differently by making the process enjoyable, fast, and transparent. We thrive on understanding how your business ticks and finding ways to help you streamline and thrive in any business climate.',
  },
]

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    .setIfMissing({
      teamRegions: withKeys(TEAM_REGIONS),
      heroDescriptionBlocks: withKeys(HERO_DESCRIPTION_BLOCKS),
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG} (teamRegions + heroDescriptionBlocks)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
