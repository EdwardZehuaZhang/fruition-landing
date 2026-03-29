require('dotenv').config({ path: '.env.local' })
const { chromium } = require('playwright')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function run() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  })
  const page = await context.newPage()

  // Debug FAQs
  console.log('=== FAQs PAGE ===')
  await page.goto('https://www.fruitionservices.io/faqs', { waitUntil: 'load', timeout: 45000 })
  await sleep(5000)

  let html = await page.evaluate(() => {
    // Get all text content with tag info
    const results = []
    const els = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, div, summary, details, [role="button"], [role="heading"]')
    for (const el of els) {
      const text = el.innerText?.trim()
      if (!text || text.length < 5 || text.length > 300) continue
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) continue
      results.push({
        tag: el.tagName,
        role: el.getAttribute('role'),
        className: el.className?.substring(0, 80),
        text: text.substring(0, 150),
        y: Math.round(rect.top)
      })
    }
    return results.slice(0, 80)
  })
  console.log(JSON.stringify(html, null, 2))

  // Debug Team
  console.log('\n=== TEAM PAGE ===')
  await page.goto('https://www.fruitionservices.io/fruition-team', { waitUntil: 'load', timeout: 45000 })
  await sleep(5000)

  html = await page.evaluate(() => {
    const results = []
    const els = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, [class*="name"], [class*="role"], [class*="title"]')
    for (const el of els) {
      const text = el.innerText?.trim()
      if (!text || text.length < 3 || text.length > 200) continue
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) continue
      results.push({
        tag: el.tagName,
        className: el.className?.substring(0, 80),
        text: text.substring(0, 150),
        y: Math.round(rect.top)
      })
    }
    return results.slice(0, 80)
  })
  console.log(JSON.stringify(html, null, 2))

  // Debug Testimonials
  console.log('\n=== TESTIMONIALS PAGE ===')
  await page.goto('https://www.fruitionservices.io/customer-testimonials', { waitUntil: 'load', timeout: 45000 })
  await sleep(5000)

  html = await page.evaluate(() => {
    const results = []
    const els = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, blockquote, span')
    for (const el of els) {
      const text = el.innerText?.trim()
      if (!text || text.length < 5 || text.length > 500) continue
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) continue
      results.push({
        tag: el.tagName,
        className: el.className?.substring(0, 80),
        text: text.substring(0, 200),
        y: Math.round(rect.top),
        parent: el.parentElement?.className?.substring(0, 60)
      })
    }
    return results.slice(0, 100)
  })
  console.log(JSON.stringify(html, null, 2))

  await browser.close()
}

run().catch(e => { console.error(e); process.exit(1) })
