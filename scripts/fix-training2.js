require('dotenv').config({ path: '.env.local' })
const { chromium } = require('playwright')
const { createClient } = require('@sanity/client')
const client = createClient({ projectId: 'bt6nb58h', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false })

async function fix() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36' })
  const page = await ctx.newPage()
  await page.goto('https://www.fruitionservices.io/monday-training', { waitUntil: 'load', timeout: 30000 })
  await new Promise(r => setTimeout(r, 4000))

  let imageUrl = await page.evaluate(() => {
    const meta = document.querySelector('meta[property="og:image"]')
    return meta ? meta.getAttribute('content') : null
  })
  if (!imageUrl) {
    imageUrl = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')]
      for (const img of imgs) {
        const src = img.src || img.getAttribute('data-src') || ''
        if (!src || src.includes('logo') || src.includes('icon')) continue
        if (img.naturalWidth > 300 || src.includes('wixstatic')) return src
      }
      return null
    })
  }
  await browser.close()
  if (!imageUrl) { console.log('No image found'); return }
  console.log('Image:', imageUrl)

  const r = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) })
  const buf = Buffer.from(await r.arrayBuffer())
  console.log('Downloaded', buf.length, 'bytes')

  const doc = await client.fetch('*[_type == "servicePage" && slug.current == "monday-training"][0]{ _id }')
  const asset = await client.assets.upload('image', buf, { filename: 'monday-training-hero.png' })
  await client.patch(doc._id).set({ heroImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } }).commit()
  console.log('Done')
}
fix().catch(e => { console.error(e.message); process.exit(1) })
