require('dotenv').config({ path: '.env.local' })
const { chromium } = require('playwright')
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function textToPortableText(paragraphs) {
  return paragraphs
    .filter(p => p && p.trim().length > 15)
    .slice(0, 80)
    .map(text => ({
      _type: 'block',
      _key: Math.random().toString(36).slice(2),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text: text.trim(), marks: [] }]
    }))
}

const PAGES = [
  { url: 'https://www.fruitionservices.io/monday-consulting-solutions/monday-project-management', type: 'solutionPage', slug: 'monday-project-management' },
  { url: 'https://www.fruitionservices.io/monday-consulting-solutions/monday-service', type: 'solutionPage', slug: 'monday-service' },
  { url: 'https://www.fruitionservices.io/monday-consulting-solutions/monday-for-finance', type: 'solutionPage', slug: 'monday-for-finance' },
  { url: 'https://www.fruitionservices.io/monday-consulting-solutions/monday-product-management', type: 'solutionPage', slug: 'monday-product-management' },
  { url: 'https://www.fruitionservices.io/monday-consulting-solutions/monday-for-hr', type: 'solutionPage', slug: 'monday-for-hr' },
  { url: 'https://www.fruitionservices.io/monday-consulting-solutions/solar-crm-solution', type: 'solutionPage', slug: 'solar-crm-solution' },
  { url: 'https://www.fruitionservices.io/monday-consulting-solutions/monday-for-cabinetry-renovation', type: 'solutionPage', slug: 'monday-for-cabinetry-renovation' },
  { url: 'https://www.fruitionservices.io/partnerships/monday-consulting-partner', type: 'partnershipPage', slug: 'monday-consulting-partner' },
  { url: 'https://www.fruitionservices.io/partnerships/make-partners', type: 'partnershipPage', slug: 'make-partners' },
  { url: 'https://www.fruitionservices.io/partnerships/n8n-integration-partner', type: 'partnershipPage', slug: 'n8n-integration-partner' },
  { url: 'https://www.fruitionservices.io/partnerships/certified-clickup-partner', type: 'partnershipPage', slug: 'certified-clickup-partner' },
  { url: 'https://www.fruitionservices.io/partnerships/certified-guidde-partner', type: 'partnershipPage', slug: 'certified-guidde-partner' },
  { url: 'https://www.fruitionservices.io/partnerships/certified-hubspot-partner', type: 'partnershipPage', slug: 'certified-hubspot-partner' },
  { url: 'https://www.fruitionservices.io/partnerships/hootsuite-delivery-partner', type: 'partnershipPage', slug: 'hootsuite-delivery-partner' },
  { url: 'https://www.fruitionservices.io/partnerships/aircall-partner', type: 'partnershipPage', slug: 'aircall-partner' },
  { url: 'https://www.fruitionservices.io/partnerships/certified-atlassian-partner', type: 'partnershipPage', slug: 'certified-atlassian-partner' },
  { url: 'https://www.fruitionservices.io/monday-partner-australia', type: 'locationPage', slug: 'monday-partner-australia' },
  { url: 'https://www.fruitionservices.io/monday-partner-uk', type: 'locationPage', slug: 'monday-partner-uk' },
  { url: 'https://www.fruitionservices.io/monday-partner-us', type: 'locationPage', slug: 'monday-partner-us' },
  { url: 'https://www.fruitionservices.io/monday-partner-singapore', type: 'locationPage', slug: 'monday-partner-singapore' },
  { url: 'https://www.fruitionservices.io/monday-partner-india', type: 'locationPage', slug: 'monday-partner-india' },
  { url: 'https://www.fruitionservices.io/monday-for-construction', type: 'industryPage', slug: 'monday-for-construction' },
  { url: 'https://www.fruitionservices.io/monday-for-manufacturing', type: 'industryPage', slug: 'monday-for-manufacturing' },
  { url: 'https://www.fruitionservices.io/monday-for-retail', type: 'industryPage', slug: 'monday-for-retail' },
  { url: 'https://www.fruitionservices.io/monday-for-professional-services', type: 'industryPage', slug: 'monday-for-professional-services' },
  { url: 'https://www.fruitionservices.io/monday-for-government', type: 'industryPage', slug: 'monday-for-government' },
  { url: 'https://www.fruitionservices.io/monday-for-marketing', type: 'industryPage', slug: 'monday-for-marketing' },
  { url: 'https://www.fruitionservices.io/monday-for-real-estate', type: 'industryPage', slug: 'monday-for-real-estate' },
  { url: 'https://www.fruitionservices.io/implementation-packages', type: 'servicePage', slug: 'implementation-packages' },
  { url: 'https://www.fruitionservices.io/monday-training', type: 'servicePage', slug: 'monday-training' },
  { url: 'https://www.fruitionservices.io/monday-implementation-consultants', type: 'servicePage', slug: 'monday-implementation-consultants' },
  { url: 'https://www.fruitionservices.io/monday-crm-consulting', type: 'servicePage', slug: 'monday-crm-consulting' },
  { url: 'https://www.fruitionservices.io/ai-strategy-and-execution', type: 'servicePage', slug: 'ai-strategy-and-execution' },
]

async function scrapePage(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 45000 })
  // Give JS time to render content
  await sleep(4000)

  const data = await page.evaluate(() => {
    const seoTitle = document.title || ''
    const seoDescription = document.querySelector('meta[name="description"]')?.content || ''

    // H1 鈥?skip nav/header elements, find the real page H1
    const h1s = Array.from(document.querySelectorAll('h1'))
    let h1 = ''
    for (const el of h1s) {
      const text = el.innerText?.trim()
      const rect = el.getBoundingClientRect()
      // Must be visible and have reasonable text
      if (text && text.length > 5 && text.length < 250 && rect.width > 0) {
        h1 = text
        break
      }
    }

    // Hero subheading 鈥?look for paragraph near the top of the page
    let heroSubheading = ''
    const allParas = Array.from(document.querySelectorAll('p'))
    for (const p of allParas) {
      const text = p.innerText?.trim()
      const rect = p.getBoundingClientRect()
      if (text && text.length > 30 && text.length < 500 && rect.top < 900 && rect.width > 100) {
        heroSubheading = text
        break
      }
    }

    // Body 鈥?collect all meaningful text elements
    const bodyTexts = []
    const seen = new Set()
    const skipPatterns = ['Book a Time', 'Book a Consultation', 'Implementation Packages', 'monday.com Training', 'What We Offer', 'Partnerships', 'Industries', 'About', 'Phone', 'Copyright']
    
    const els = document.querySelectorAll('p, h2, h3, h4, li')
    for (const el of els) {
      const text = el.innerText?.trim()
      if (!text || text.length < 20 || text.length > 800) continue
      if (seen.has(text)) continue
      if (skipPatterns.some(p => text.startsWith(p))) continue
      seen.add(text)
      bodyTexts.push(text)
    }

    return { seoTitle, seoDescription, h1, heroSubheading, bodyTexts }
  })

  return data
}

async function run() {
  console.log('Launching headless browser...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  })
  const page = await context.newPage()

  let success = 0
  let failed = 0
  const results = []

  for (let i = 0; i < PAGES.length; i++) {
    const { url, type, slug } = PAGES[i]
    console.log(`\n[${i+1}/${PAGES.length}] ${type}/${slug}`)
    try {
      const data = await scrapePage(page, url)

      const cleanTitle = data.seoTitle
        .replace(/\s*[\|\-]\s*Fruition.*$/i, '')
        .replace(/\s*[\|\-]\s*monday\.com Certified.*$/i, '')
        .trim() || slug.replace(/-/g, ' ')

      const heroHeading = (data.h1 && data.h1.length > 5 && data.h1 !== 'Partnerships' && data.h1 !== 'Solutions')
        ? data.h1
        : cleanTitle

      const portableBody = textToPortableText(data.bodyTexts)

      console.log(`  H1: "${heroHeading}"`)
      console.log(`  Sub: "${(data.heroSubheading || '').substring(0, 80)}"`)
      console.log(`  Body blocks: ${portableBody.length}`)

      const existing = await client.fetch(
        `*[_type == $type && slug.current == $slug][0]{ _id }`,
        { type, slug }
      )

      if (existing) {
        await client.patch(existing._id).set({
          title: heroHeading,
          heroHeading,
          heroSubheading: data.heroSubheading || '',
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          body: portableBody,
          primaryCtaLabel: 'Book a Consultation',
          primaryCtaUrl: 'https://calendly.com/global-calendar-fruitionservices',
        }).commit()
        console.log(`  Saved to Sanity`)
        success++
        results.push({ slug, type, heroHeading, bodyBlocks: portableBody.length, status: 'ok' })
      } else {
        console.log(`  SKIP: no doc found`)
        failed++
        results.push({ slug, type, status: 'not_found' })
      }
    } catch (err) {
      console.error(`  FAILED: ${err.message.split('\n')[0]}`)
      failed++
      results.push({ slug, type, status: 'error', error: err.message.split('\n')[0] })
    }

    await sleep(1000)
  }

  await browser.close()

  console.log('\n=== DONE ===')
  console.log(`Success: ${success} / ${PAGES.length}`)
  console.log(`Failed:  ${failed}`)
  results.filter(r => r.status !== 'ok').forEach(r => console.log(`  [${r.status}] ${r.slug}: ${r.error || ''}`))
}

run().catch(e => { console.error(e.message); process.exit(1) })
