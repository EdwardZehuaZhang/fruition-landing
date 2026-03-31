require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')
const client = createClient({ projectId: 'bt6nb58h', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false })
async function fix() {
  const doc = await client.fetch('*[_type == "servicePage" && slug.current == "monday-training"][0]{ _id, title, heroImage }')
  console.log('Doc:', doc._id, doc.title, 'has hero?', !!(doc.heroImage && doc.heroImage.asset))
  if (doc.heroImage && doc.heroImage.asset) { console.log('Already has image'); return }
  const url = 'https://static.wixstatic.com/media/39b8ef_36d6cc5331cf4963b20908bfb52ab9b0~mv2.png'
  const r = await fetch(url, { signal: AbortSignal.timeout(30000) })
  const buf = Buffer.from(await r.arrayBuffer())
  console.log('Downloaded', buf.length, 'bytes')
  const asset = await client.assets.upload('image', buf, { filename: 'monday-training-hero.jpg' })
  await client.patch(doc._id).set({ heroImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } }).commit()
  console.log('Done')
}
fix().catch(e => { console.error(e); process.exit(1) })
