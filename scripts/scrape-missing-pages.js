require('dotenv').config({ path: '.env.local' })
const { chromium } = require('playwright')
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function textToPortableText(paragraphs) {
  return paragraphs
    .filter(p => p && p.trim().length > 10)
    .slice(0, 100)
    .map(text => ({
      _type: 'block',
      _key: Math.random().toString(36).slice(2),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text: text.trim(), marks: [] }]
    }))
}

async function loadPage(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 45000 })
  await sleep(4000)
}

// ── 1. Generic pages ──
const GENERIC_PAGES = [
  { url: 'https://www.fruitionservices.io/about-us', slug: 'about-us', title: 'About Us' },
  { url: 'https://www.fruitionservices.io/careers', slug: 'careers', title: 'Careers' },
  { url: 'https://www.fruitionservices.io/data-privacy', slug: 'data-privacy', title: 'Data Privacy' },
  { url: 'https://www.fruitionservices.io/terms-and-conditions', slug: 'terms-and-conditions', title: 'Terms and Conditions' },
]

async function scrapeGenericPage(page, { url, slug, title }) {
  console.log(`\n[page] ${slug}`)
  await loadPage(page, url)

  const bodyTexts = await page.evaluate(() => {
    const texts = []
    const seen = new Set()
    const skipPatterns = ['Book a Time', 'Book a Consultation', 'Copyright', 'Phone', 'What We Offer', 'Partnerships', 'Schedule a demo']
    const els = document.querySelectorAll('p, h2, h3, h4, li')
    for (const el of els) {
      const text = el.innerText?.trim()
      if (!text || text.length < 15 || text.length > 2000) continue
      if (seen.has(text)) continue
      if (skipPatterns.some(p => text.startsWith(p))) continue
      // Skip nav items
      const rect = el.getBoundingClientRect()
      if (rect.top < 100 && rect.width < 200) continue
      seen.add(text)
      texts.push(text)
    }
    return texts
  })

  const body = textToPortableText(bodyTexts)
  console.log(`  Body blocks: ${body.length}`)

  const doc = {
    _id: 'page-' + slug,
    _type: 'page',
    title,
    slug: { _type: 'slug', current: slug },
    body,
  }

  await client.createOrReplace(doc)
  console.log(`  Saved to Sanity`)
  await sleep(500)
  return { slug, type: 'page', blocks: body.length }
}

// ── 2. FAQ items ──
async function scrapeFaqs(page) {
  console.log(`\n[faqItem] Scraping FAQs...')`)
  await loadPage(page, 'https://www.fruitionservices.io/faqs')

  const allFaqs = []

  // The FAQ page has tabs: "monday.com FAQs", "Industry FAQs", "Partnership FAQs"
  // And within each tab, sub-categories with accordion items
  // Questions are in h3.sum_lkg, answers in next div[role="region"]

  // First, click all accordion items to expand them on current tab
  async function expandAndScrape() {
    // Click all collapsed accordion headers to expand answers
    const headers = await page.$$('h3.sum_lkg')
    for (const h of headers) {
      try {
        // Click the parent accordion trigger
        const parent = await h.evaluateHandle(el => {
          let p = el.parentElement
          while (p && !p.getAttribute('role')?.includes('button') && !p.classList.contains('sdFo7rg')) {
            p = p.parentElement
          }
          return p || el
        })
        await parent.click()
        await sleep(300)
      } catch {}
    }
    await sleep(1000)

    // Now scrape all Q/A pairs
    return page.evaluate(() => {
      const items = []
      const questions = document.querySelectorAll('h3.sum_lkg')
      for (const q of questions) {
        const qText = q.innerText?.trim()
        if (!qText || qText.length < 10) continue

        // Find the answer region - look for role="region" in the same accordion item
        let container = q.closest('.s__7arzZi') || q.closest('[class*="accordion"]') || q.parentElement?.parentElement?.parentElement
        if (!container) continue

        const region = container.querySelector('[role="region"]')
        let answer = ''
        if (region) {
          answer = region.innerText?.trim() || ''
        }

        if (answer) {
          items.push({ question: qText, answer })
        }
      }
      return items
    })
  }

  // Click through sub-category tabs on the left sidebar
  async function scrapeSubCategories() {
    const catTabs = await page.$$('.s__0SSV6s')
    const catCount = catTabs.length

    for (let i = 0; i < catCount; i++) {
      try {
        // Re-query tabs since DOM may have changed
        const tabs = await page.$$('.s__0SSV6s')
        if (i >= tabs.length) break
        const tabText = await tabs[i].innerText()
        console.log(`    Sub-category: ${tabText}`)
        await tabs[i].click()
        await sleep(1500)

        const faqs = await expandAndScrape()
        console.log(`      Found ${faqs.length} items`)
        allFaqs.push(...faqs)
      } catch (err) {
        console.log(`    Error on sub-category ${i}: ${err.message.split('\n')[0]}`)
      }
    }
  }

  // Click through main tabs: monday.com FAQs, Industry FAQs, Partnership FAQs
  const mainTabs = await page.$$('[role="tab"]')
  console.log(`  Found ${mainTabs.length} main tabs`)

  for (let t = 0; t < mainTabs.length; t++) {
    try {
      const tabs = await page.$$('[role="tab"]')
      if (t >= tabs.length) break
      const tabName = await tabs[t].innerText()
      console.log(`  Main tab: ${tabName}`)
      await tabs[t].click()
      await sleep(2000)

      await scrapeSubCategories()
    } catch (err) {
      console.log(`  Error on main tab ${t}: ${err.message.split('\n')[0]}`)
    }
  }

  // Deduplicate
  const seen = new Set()
  const uniqueFaqs = allFaqs.filter(f => {
    if (seen.has(f.question)) return false
    seen.add(f.question)
    return true
  })

  console.log(`  Total unique FAQ items: ${uniqueFaqs.length}`)

  const results = []
  for (let i = 0; i < uniqueFaqs.length; i++) {
    const { question, answer } = uniqueFaqs[i]
    const answerBlocks = textToPortableText(answer.split('\n').filter(l => l.trim()))
    // If the answer is a single block, just use the whole text
    const finalAnswer = answerBlocks.length > 0 ? answerBlocks : textToPortableText([answer])

    const doc = {
      _id: `faq-${i}`,
      _type: 'faqItem',
      question,
      answer: finalAnswer,
      order: i,
    }
    await client.createOrReplace(doc)
    console.log(`  [${i}] "${question.substring(0, 60)}..."`)
    await sleep(500)
    results.push(doc._id)
  }
  return results
}

// ── 3. Team members ──
async function scrapeTeam(page) {
  console.log(`\n[teamMember] Scraping team...`)
  await loadPage(page, 'https://www.fruitionservices.io/fruition-team')

  const allMembers = []

  // Team page has tabs: "Meet the Australia Team", "Meet the UK Team", "Meet the US Team"
  // Each member has: role in p.font_8 with color_28, name in p.font_5 with color_19, bio in p.font_8 with color_15
  // We need to scroll to load all members and click through tabs

  async function scrapeCurrentTab() {
    // Scroll down to load lazy content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await sleep(2000)
    await page.evaluate(() => window.scrollTo(0, 0))
    await sleep(500)

    return page.evaluate(() => {
      const members = []
      // Names are in p.font_5 or h5 with color_19 class in a span
      const nameEls = document.querySelectorAll('p.font_5')

      for (const nameEl of nameEls) {
        const name = nameEl.innerText?.trim()
        if (!name || name.length < 3 || name.length > 80) continue
        // Skip page headings
        if (name.toLowerCase().includes('meet the') || name.toLowerCase().includes('our team')) continue

        const rect = nameEl.getBoundingClientRect()
        if (rect.width === 0) continue

        // Look for role ABOVE the name (in the DOM flow, role comes before name)
        // Role is in p.font_8 with color_28 span, positioned just above name
        let role = ''
        let bio = ''

        // Walk backwards from name to find the role
        const parent = nameEl.parentElement
        if (parent) {
          const siblings = Array.from(parent.children)
          const idx = siblings.indexOf(nameEl)

          // Check previous sibling for role
          for (let i = idx - 1; i >= 0; i--) {
            const sib = siblings[i]
            const t = sib.innerText?.trim()
            if (t && t.length < 80 && sib.querySelector('.color_28')) {
              role = t
              break
            }
          }

          // Check next sibling for bio
          for (let j = idx + 1; j < siblings.length; j++) {
            const sib = siblings[j]
            const t = sib.innerText?.trim()
            if (t && t.length > 30 && sib.querySelector('.color_15')) {
              bio = t
              break
            }
          }
        }

        // Clean emoji from name
        const cleanName = name.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()
        if (cleanName.length < 3) continue

        members.push({ name: cleanName, role, bio })
      }
      return members
    })
  }

  // First scrape the default tab (Australia)
  const members1 = await scrapeCurrentTab()
  console.log(`  Default tab: ${members1.length} members`)
  allMembers.push(...members1)

  // Click through other team tabs
  const teamTabs = await page.$$('.TabsList2027980309__label')
  console.log(`  Found ${teamTabs.length} team tabs`)

  for (let t = 1; t < teamTabs.length; t++) {
    try {
      const tabs = await page.$$('.TabsList2027980309__tab')
      if (t >= tabs.length) break
      const tabName = await tabs[t].innerText()
      console.log(`  Clicking tab: ${tabName}`)
      await tabs[t].click()
      await sleep(2000)

      const members = await scrapeCurrentTab()
      console.log(`    Found ${members.length} members`)
      allMembers.push(...members)
    } catch (err) {
      console.log(`    Tab error: ${err.message.split('\n')[0]}`)
    }
  }

  // Deduplicate by name
  const seen = new Set()
  const unique = allMembers.filter(m => {
    if (seen.has(m.name)) return false
    seen.add(m.name)
    return true
  })

  console.log(`  Total unique members: ${unique.length}`)

  const results = []
  for (const m of unique) {
    const id = 'team-' + slugify(m.name)
    const doc = {
      _id: id,
      _type: 'teamMember',
      name: m.name,
      role: m.role || '',
      bio: m.bio || '',
      image: null,
    }
    await client.createOrReplace(doc)
    console.log(`  ${m.name} - ${m.role}`)
    await sleep(500)
    results.push(id)
  }
  return results
}

// ── 4. Case studies / testimonials ──
async function scrapeCaseStudies(page) {
  console.log(`\n[caseStudy] Scraping testimonials...`)
  await loadPage(page, 'https://www.fruitionservices.io/customer-testimonials')

  // Scroll to load all content
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await sleep(2000)

  // Case studies have: title in p.font_2, product/services info in p.font_8
  // Pattern: "X Case Study" title, then "Product: ...", "Services: ...\nTimeline: ..."
  const testimonials = await page.evaluate(() => {
    const items = []
    // Find all case study title elements
    const titleEls = document.querySelectorAll('p.font_2, h2.font_2')

    for (const titleEl of titleEls) {
      const title = titleEl.innerText?.trim()
      if (!title || !title.toLowerCase().includes('case study')) continue

      const rect = titleEl.getBoundingClientRect()
      if (rect.width === 0 || rect.top < 300) continue

      // Find sibling paragraphs containing product/services info
      const container = titleEl.closest('[class*="comp-"]') || titleEl.parentElement?.parentElement
      if (!container) continue

      // Look in the next few sibling rich-text components
      let product = ''
      let services = ''
      let quote = ''

      // Get the parent section and find all font_8 paragraphs nearby
      const section = container.parentElement
      if (section) {
        const paras = section.querySelectorAll('p.font_8')
        for (const p of paras) {
          const t = p.innerText?.trim()
          if (!t) continue
          if (t.startsWith('Product:')) product = t.replace('Product:', '').trim()
          else if (t.startsWith('Services:')) {
            const lines = t.split('\n')
            services = lines[0].replace('Services:', '').trim()
          }
        }
      }

      const clientName = title.replace(/\s*Case Study\s*/i, '').trim()
      items.push({
        title,
        clientName: clientName || title,
        quote: services || product || title,
        product,
        services,
      })
    }

    return items
  })

  console.log(`  Found ${testimonials.length} case studies`)

  // If structured approach didn't work well, also look for the repeater/card pattern
  if (testimonials.length === 0) {
    console.log('  Trying alternate approach...')
    // Fall back to grabbing all substantial content blocks below the hero
    const fallback = await page.evaluate(() => {
      const items = []
      const allP = document.querySelectorAll('p.font_8, p.font_7')
      const seen = new Set()
      for (const p of allP) {
        const text = p.innerText?.trim()
        if (!text || text.length < 30 || seen.has(text)) continue
        const rect = p.getBoundingClientRect()
        if (rect.top < 500 || rect.width === 0) continue
        seen.add(text)
        items.push({ title: '', clientName: '', quote: text, product: '', services: '' })
      }
      return items
    })
    testimonials.push(...fallback)
    console.log(`  Fallback found ${fallback.length} items`)
  }

  const results = []
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]
    const doc = {
      _id: `casestudy-${i}`,
      _type: 'caseStudy',
      clientName: t.clientName || `Client ${i + 1}`,
      clientCompany: t.clientName || '',
      quote: t.quote || t.services || t.title,
    }
    await client.createOrReplace(doc)
    console.log(`  [${i}] ${t.clientName}: "${(t.quote || '').substring(0, 60)}..."`)
    await sleep(500)
    results.push(doc._id)
  }
  return results
}

// ── Main ──
async function run() {
  console.log('Launching headless browser...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  })
  const page = await context.newPage()

  const summary = { pages: [], faqs: [], team: [], caseStudies: [] }

  // 1. Generic pages
  for (const p of GENERIC_PAGES) {
    try {
      const result = await scrapeGenericPage(page, p)
      summary.pages.push(result)
    } catch (err) {
      console.error(`  FAILED ${p.slug}: ${err.message.split('\n')[0]}`)
      summary.pages.push({ slug: p.slug, type: 'page', blocks: 0, error: err.message.split('\n')[0] })
    }
  }

  // 2. FAQs
  try {
    summary.faqs = await scrapeFaqs(page)
  } catch (err) {
    console.error(`  FAILED FAQs: ${err.message.split('\n')[0]}`)
  }

  // 3. Team
  try {
    summary.team = await scrapeTeam(page)
  } catch (err) {
    console.error(`  FAILED Team: ${err.message.split('\n')[0]}`)
  }

  // 4. Case studies
  try {
    summary.caseStudies = await scrapeCaseStudies(page)
  } catch (err) {
    console.error(`  FAILED Case Studies: ${err.message.split('\n')[0]}`)
  }

  await browser.close()

  // ── Verification ──
  console.log('\n=== VERIFICATION ===')
  const counts = await Promise.all([
    client.fetch(`count(*[_type == "page"])`),
    client.fetch(`count(*[_type == "faqItem"])`),
    client.fetch(`count(*[_type == "teamMember"])`),
    client.fetch(`count(*[_type == "caseStudy"])`),
  ])
  console.log(`  page documents:       ${counts[0]}`)
  console.log(`  faqItem documents:     ${counts[1]}`)
  console.log(`  teamMember documents:  ${counts[2]}`)
  console.log(`  caseStudy documents:   ${counts[3]}`)

  console.log('\n=== SUMMARY ===')
  console.log(`Pages scraped: ${summary.pages.length} (${summary.pages.filter(p => p.blocks > 0).length} with content)`)
  console.log(`FAQ items: ${summary.faqs.length}`)
  console.log(`Team members: ${summary.team.length}`)
  console.log(`Case studies: ${summary.caseStudies.length}`)
}

run().catch(e => { console.error(e); process.exit(1) })
