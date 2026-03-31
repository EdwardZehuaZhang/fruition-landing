require('dotenv').config({ path: '.env.local' })
const { chromium } = require('playwright')
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'bt6nb58h', dataset: 'production',
  apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false,
})

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function run() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  })
  const page = await ctx.newPage()
  console.log('Loading team page...')
  await page.goto('https://www.fruitionservices.io/fruition-team', { waitUntil: 'load', timeout: 30000 })
  await sleep(5000)

  // Get all team member images
  const teamData = await page.evaluate(() => {
    const results = []
    const imgs = document.querySelectorAll('img')
    for (const img of imgs) {
      const src = img.src || ''
      if (!src || src.includes('logo') || src.includes('icon') || src.includes('favicon') || src.includes('svg')) continue
      if (img.naturalWidth < 80) continue
      // Try to find a name near the image
      const parent = img.closest('div') || img.parentElement
      const nameEl = parent?.querySelector('h2, h3, p, span')
      const name = nameEl?.textContent?.trim() || ''
      if (src.includes('wixstatic') && name) {
        results.push({ name, imageUrl: src })
      }
    }
    return results
  })

  console.log(`Found ${teamData.length} team images`)
  await browser.close()

  const members = await client.fetch('*[_type == "teamMember"]{ _id, name, photo }')
  console.log(`Sanity team members: ${members.length}`)

  let migrated = 0
  for (const member of members) {
    if (member.photo && member.photo.asset) { console.log(`Skip ${member.name}`); continue }

    // Match by name
    const match = teamData.find(t =>
      t.name.toLowerCase().includes(member.name.split(' ')[0].toLowerCase()) ||
      member.name.toLowerCase().includes(t.name.split(' ')[0].toLowerCase())
    )

    if (!match) { console.log(`No image match for ${member.name}`); continue }
    console.log(`${member.name} -> ${match.imageUrl.substring(0,60)}`)

    try {
      const imgRes = await fetch(match.imageUrl, { signal: AbortSignal.timeout(30000) })
      if (!imgRes.ok) throw new Error('HTTP ' + imgRes.status)
      const buffer = Buffer.from(await imgRes.arrayBuffer())
      await sleep(500)
      const asset = await client.assets.upload('image', buffer, { filename: member.name.toLowerCase().replace(/\s+/g,'-')+'.jpg' })
      await sleep(500)
      await client.patch(member._id).set({ photo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } }).commit()
      migrated++
      console.log('  Done')
    } catch(err) { console.error(`  ERROR: ${err.message}`) }
    await sleep(800)
  }

  console.log(`\nPhase 3: ${migrated} team photos migrated`)
}
run().catch(e => { console.error(e.stack); process.exit(1) })
