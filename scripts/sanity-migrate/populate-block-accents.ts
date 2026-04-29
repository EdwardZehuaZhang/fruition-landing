/**
 * Patch heroBlock and featureListBlock instances embedded in homePage / page
 * docs to provide the new `headingAccents` (heroBlock) and `headingAccent` +
 * `variant: 'challenges'` (featureListBlock) fields.
 *
 * Heuristics:
 *  - heroBlock: if heading contains "Consulting" or "Integration Services",
 *    add those words to headingAccents.
 *  - featureListBlock: if heading contains "Teams Transformed" or
 *    "Efficiency Gains", set variant=challenges. If heading contains
 *    "With You For You", set headingAccent="With You For You".
 *
 *   npx tsx scripts/sanity-migrate/populate-block-accents.ts
 */
import { writeClient } from './lib'

interface ContentBlock {
  _key?: string
  _type?: string
  heading?: string
  headingAccents?: string[]
  headingAccent?: string
  variant?: string
  [key: string]: unknown
}

interface DocWithBlocks {
  _id: string
  _type: string
  contentBlocks?: ContentBlock[]
  body?: ContentBlock[]
}

const HERO_PURPLE_WORDS = ['Consulting', 'Integration Services']

function patchHeroBlock(block: ContentBlock): ContentBlock {
  if (block._type !== 'heroBlock') return block
  if (block.headingAccents && block.headingAccents.length > 0) return block
  const heading = block.heading || ''
  const accents = HERO_PURPLE_WORDS.filter((w) => heading.includes(w))
  if (accents.length === 0) return block
  return { ...block, headingAccents: accents }
}

function patchFeatureListBlock(block: ContentBlock): ContentBlock {
  if (block._type !== 'featureListBlock') return block
  const heading = block.heading || ''
  let updated = block

  if (
    !updated.variant &&
    (heading.includes('Teams Transformed') || heading.includes('Efficiency Gains'))
  ) {
    updated = { ...updated, variant: 'challenges' }
  }

  if (!updated.headingAccent && heading.includes('With You For You')) {
    updated = { ...updated, headingAccent: 'With You For You' }
  }

  return updated
}

function patchBlocks(blocks?: ContentBlock[]): { changed: boolean; blocks: ContentBlock[] } {
  if (!blocks) return { changed: false, blocks: [] }
  let changed = false
  const out = blocks.map((b) => {
    const a = patchHeroBlock(b)
    const c = patchFeatureListBlock(a)
    if (c !== b) changed = true
    return c
  })
  return { changed, blocks: out }
}

async function main() {
  // Patch homePage.contentBlocks
  const homePages = await writeClient.fetch<DocWithBlocks[]>(
    `*[_type == "homePage"]{_id, _type, contentBlocks}`
  )
  for (const doc of homePages) {
    const { changed, blocks } = patchBlocks(doc.contentBlocks)
    if (changed) {
      console.log(`Patching ${doc._type} ${doc._id}…`)
      await writeClient.patch(doc._id).set({ contentBlocks: blocks }).commit()
    }
  }

  // Patch page.body (if any of those use these block types)
  const pageDocs = await writeClient.fetch<DocWithBlocks[]>(
    `*[_type == "page"]{_id, _type, "contentBlocks": body}`
  )
  for (const doc of pageDocs) {
    const { changed, blocks } = patchBlocks(doc.contentBlocks)
    if (changed) {
      console.log(`Patching page ${doc._id} body…`)
      await writeClient.patch(doc._id).set({ body: blocks }).commit()
    }
  }

  console.log('✓ Block accents populated')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
