import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const docId = 'industryPage-monday-for-retail'

const r = await client
  .patch(docId)
  .set({
    hideTestimonialsSection: true,
  })
  .commit()
console.log('patched', r._id, 'rev', r._rev)
