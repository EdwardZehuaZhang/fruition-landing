require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')
const { chromium } = require('playwright')

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Map document types to their URL prefix on the Wix site
const typeUrlMap = {
  servicePage: '',          // root-level slugs
  solutionPage: '/monday-consulting-solutions',
  partnershipPage: '',      // root-level
  industryPage: '',         // root-level
  locationPage: '',         // root-level
}

function textToPortableText(paragraphs) {
  return paragraphs.map((text, i) => ({
    _key: `p-${String(i).padStart(3, '0')}`,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{
      _key: `c-${String(i).padStart(3, '0')}`,
      _type: 'span',
      marks: [],
      text: text.trim(),
    }],
  })).filter(b => b.children[0].text.length > 0)
}

async function scrapePageBody(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await sleep(6000)

    // Scroll to load content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await sleep(2000)

    // Extract main body text, excluding nav and footer
    const bodyText = await page.evaluate(() => {
      // Remove nav and footer
      const nav = document.querySelector('header, nav, [data-testid="header"]')
      const footer = document.querySelector('footer, [data-testid="footer"]')
      if (nav) nav.remove()
      if (footer) footer.remove()

      // Get all text paragraphs from main content
      const elements = document.querySelectorAll('p, h2, h3, h4, li')
      const texts = []
      const seen = new Set()

      for (const el of elements) {
        const text = el.textContent.trim()
        if (text.length > 20 && !seen.has(text)) {
          seen.add(text)
          texts.push(text)
        }
      }

      return texts
    })

    return bodyText
  } catch (err) {
    console.log(`    Scrape error: ${err.message}`)
    return []
  }
}

async function run() {
  console.log('=== Page Content Audit ===\n')

  const types = ['servicePage', 'solutionPage', 'partnershipPage', 'industryPage', 'locationPage']

  // Query all pages
  const allPages = []
  for (const type of types) {
    const pages = await client.fetch(
      `*[_type == "${type}"]{ _id, _type, title, "slug": slug.current, body }`
    )
    allPages.push(...pages)
    console.log(`${type}: ${pages.length} documents`)
  }

  console.log(`\nTotal pages to audit: ${allPages.length}\n`)

  // Filter to only pages with empty body
  const emptyPages = allPages.filter(p => !p.body || p.body.length === 0)
  console.log(`Pages with empty body: ${emptyPages.length}\n`)

  if (emptyPages.length === 0) {
    console.log('All pages already have body content. Nothing to patch.')
    return
  }

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  let patched = 0
  let skipped = 0
  let errors = 0

  for (const doc of emptyPages) {
    const slug = doc.slug
    if (!slug) {
      console.log(`  [SKIP] ${doc.title} 鈥?no slug`)
      skipped++
      continue
    }

    // Try different URL patterns
    const urlCandidates = [
      `https://www.fruitionservices.io/${slug}`,
      `https://www.fruitionservices.io/monday-consulting-solutions/${slug}`,
    ]

    console.log(`[${doc._type}] ${doc.title} (${slug})`)

    let bodyParagraphs = []
    for (const url of urlCandidates) {
      console.log(`  Trying: ${url}`)
      bodyParagraphs = await scrapePageBody(page, url)
      if (bodyParagraphs.length > 0) {
        console.log(`  Found ${bodyParagraphs.length} paragraphs`)
        break
      }
      await sleep(1000)
    }

    if (bodyParagraphs.length === 0) {
      console.log(`  [EMPTY] No body content found`)
      errors++
      continue
    }

    // Convert to PortableText and patch
    const portableText = textToPortableText(bodyParagraphs)

    try {
      await client
        .patch(doc._id)
        .set({ body: portableText })
        .commit()
      console.log(`  [PATCHED] ${portableText.length} blocks`)
      patched++
    } catch (err) {
      console.log(`  [ERROR] Patch failed: ${err.message}`)
      errors++
    }

    await sleep(1500)
  }

  await browser.close()

  console.log(`\n=== Audit Complete ===`)
  console.log(`  Patched: ${patched}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  Errors: ${errors}`)
  console.log(`  Already had body: ${allPages.length - emptyPages.length}`)
}

run().catch(err => {
  console.error('Audit failed:', err)
  process.exit(1)
})
