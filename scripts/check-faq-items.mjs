import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const forRetail = await client.fetch(
  `*[_type == "faqItem" && "monday-for-retail" in pages]{ _id, question, category, categoryOrder, order, pages }`,
)
console.log('faqItem docs targeting monday-for-retail:', forRetail.length)
for (const i of forRetail) console.log(' -', i.category, '|', i.question)

const fallback = await client.fetch(
  `*[_type == "faqItem" && "faqs" in pages]{ _id, question, category, categoryOrder, order }`,
)
console.log('\nfaqItem docs in faqs (fallback):', fallback.length)
const byCat = {}
for (const i of fallback) byCat[i.category || 'none'] = (byCat[i.category || 'none'] || 0) + 1
console.log('categories:', byCat)
