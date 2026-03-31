require('dotenv').config({ path: '.env.local' })
const { chromium } = require('playwright')
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'bt6nb58h', dataset: 'production',
  apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false,
})

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const PAGE_TYPES = [
  { type: 'solutionPage', urlPrefix: '/monday-consulting-solutions/' },
  { type: 'partnershipPage', urlPrefix: '/partnerships/' },
  { type: 'locationPage', urlPrefix: '/' },
  { type: 'industryPage', urlPrefix: '/' },
  { type: 'servicePage', urlPrefix: '/' },
]

async function run() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  })

  let total = 0, migrated = 0, errors = 0, skipped = 0

  for (const { type, urlPrefix } of PAGE_TYPES) {
    const docs = await client.fetch(`*[_type == "${type}"]{ _id, title, "slug": slug.current, heroImage }`)
    console.log(`\n=== ${type}: ${docs.length} docs ===`)

    for (const doc of docs) {
      total++
      if (doc.heroImage && doc.heroImage.asset) { skipped++; continue }

      const url = `https://www.fruitionservices.io${urlPrefix}${doc.slug}`
      console.log(`[${total}] ${doc.title} -> ${url}`)

      const page = await context.newPage()
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 30000 })
        await sleep(4000)

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
              if (img.naturalWidth > 300 || img.width > 300 || src.includes('wixstatic')) return src
            }
            return null
          })
        }

        if (!imageUrl) { errors++; await page.close(); continue }
        console.log(`  Image: ${imageUrl.substring(0,70)}`)

        const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) })
        if (!imgRes.ok) throw new Error('Image fetch ' + imgRes.status)
        const buffer = Buffer.from(await imgRes.arrayBuffer())
        await sleep(500)
        const asset = await client.assets.upload('image', buffer, { filename: doc.slug.substring(0,100)+'-hero.jpg', contentType: 'image/jpeg' })
        await sleep(500)
        await client.patch(doc._id).set({ heroImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } }).commit()
        migrated++
        console.log('  Done')
      } catch (err) { console.error(`  ERROR: ${err.message}`); errors++ }
      await page.close()
      await sleep(1000)
    }
  }
  await browser.close()
  console.log(`\nPhase 2: ${migrated} migrated, ${skipped} skipped, ${errors} errors (${total} total)`)
}
run().catch(e => { console.error(e.stack); process.exit(1) })
