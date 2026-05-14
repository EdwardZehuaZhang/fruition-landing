import { createClient } from '@sanity/client'
import { readFile } from 'node:fs/promises'

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const docId = 'industryPage-monday-for-retail'

const buf = await readFile('/Users/gel/Desktop/Group 2609485.png')
const asset = await client.assets.upload('image', buf, {
  filename: 'retail-hero-group-2609485.png',
  contentType: 'image/png',
})
console.log('uploaded asset', asset._id)

const doc = await client.fetch(`*[_id == $id][0]{ solutionCards, caseStudyCards }`, { id: docId })

const farfetch = (doc.solutionCards || []).find((c) =>
  (c?.heading || '').toLowerCase().includes('farfetch'),
)
const remainingSolutionCards = (doc.solutionCards || []).filter((c) => c !== farfetch)

const caseStudyCards = (doc.caseStudyCards || []).slice()
if (farfetch && !caseStudyCards.some((c) => (c?.title || '').toLowerCase().includes('farfetch'))) {
  caseStudyCards.push({
    _type: 'caseStudyCard',
    _key: farfetch._key || `cs-farfetch-${Date.now()}`,
    title: farfetch.heading,
    description: farfetch.body,
    ...(farfetch.image ? { image: farfetch.image } : {}),
    ...(farfetch.imageUrl ? { imageUrl: farfetch.imageUrl } : {}),
  })
}

const patch = client
  .patch(docId)
  .set({
    heroImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    solutionCards: remainingSolutionCards,
    caseStudyCards,
    caseStudySectionHeading: 'Retail Case Study',
    hideJoinStatsSection: false,
    hideTestimonialBanner: false,
    hideCaseStudyCardsSection: false,
  })

const result = await patch.commit()
console.log('patched', result._id, 'rev', result._rev)
console.log('solutionCards now:', remainingSolutionCards.length)
console.log('caseStudyCards now:', caseStudyCards.length)
