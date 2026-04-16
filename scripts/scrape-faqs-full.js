/* eslint-disable */
/**
 * Exhaustive FAQ scraper for fruitionservices.io.
 *
 * Visits /faqs plus every page that embeds a FAQ accordion, walks
 * the top-level tab bar, then for each top-level tab walks the
 * sub-tab bar that becomes visible, expands accordion items, and
 * captures each Q&A with its tab path.
 *
 * Output: /tmp/fruition-faqs-full.json
 *
 * Run:  node scripts/scrape-faqs-full.js
 */
const { chromium } = require('playwright')
const fs = require('fs')

const PAGES = [
  { slug: 'faqs', url: 'https://www.fruitionservices.io/faqs' },
  { slug: 'monday-training', url: 'https://www.fruitionservices.io/monday-training' },
  { slug: 'monday-implementation-consultants', url: 'https://www.fruitionservices.io/monday-implementation-consultants' },
  { slug: 'implementation-packages', url: 'https://www.fruitionservices.io/implementation-packages' },
  { slug: 'monday-for-construction', url: 'https://www.fruitionservices.io/monday-for-construction' },
  { slug: 'monday-for-manufacturing', url: 'https://www.fruitionservices.io/monday-for-manufacturing' },
  { slug: 'monday-for-retail', url: 'https://www.fruitionservices.io/monday-for-retail' },
  { slug: 'monday-for-professional-services', url: 'https://www.fruitionservices.io/monday-for-professional-services' },
  { slug: 'monday-for-government', url: 'https://www.fruitionservices.io/monday-for-government' },
  { slug: 'monday-for-marketing', url: 'https://www.fruitionservices.io/monday-for-marketing' },
  { slug: 'monday-for-real-estate', url: 'https://www.fruitionservices.io/monday-for-real-estate' },
  { slug: 'monday-consulting-solutions', url: 'https://www.fruitionservices.io/monday-consulting-solutions' },
  { slug: 'monday-crm-consulting', url: 'https://www.fruitionservices.io/monday-crm-consulting' },
  { slug: 'ai-strategy-and-execution', url: 'https://www.fruitionservices.io/ai-strategy-and-execution' },
  { slug: 'partnerships', url: 'https://www.fruitionservices.io/partnerships' },
  { slug: 'partnerships-make-partners', url: 'https://www.fruitionservices.io/partnerships/make-partners' },
  { slug: 'partnerships-n8n', url: 'https://www.fruitionservices.io/partnerships/n8n-integration-partner' },
  { slug: 'partnerships-aircall', url: 'https://www.fruitionservices.io/partnerships/aircall-partner' },
  { slug: 'partnerships-atlassian', url: 'https://www.fruitionservices.io/partnerships/certified-atlassian-partner' },
  { slug: 'partnerships-monday', url: 'https://www.fruitionservices.io/partnerships/monday-consulting-partner' },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function expandAndCollect(page) {
  await page.evaluate(() => {
    const triggers = Array.from(
      document.querySelectorAll('button, [role="button"]'),
    ).filter((el) => el.querySelector('h3[data-hook="title"]'))
    for (const btn of triggers) {
      if (btn.getAttribute('aria-expanded') !== 'true') {
        try { btn.click() } catch (_) {}
      }
    }
  })
  await sleep(400)
  return await page.evaluate(() => {
    const items = []
    const titles = document.querySelectorAll('h3[data-hook="title"]')
    for (const h3 of titles) {
      const question = (h3.textContent || '').trim()
      if (!question) continue
      let container = h3
      for (let depth = 0; depth < 8 && container; depth++) {
        container = container.parentElement
        if (!container) break
        const region = container.querySelector('[data-hook="accordion-item-content"], [role="region"]')
        if (region) {
          const answer = (region.innerText || '').trim()
          if (answer) {
            items.push({ question, answer })
            break
          }
        }
      }
    }
    return items
  })
}

/**
 * Return all visible tab bars — each bar is {labels, barIndex} where
 * labels is an array of unique tab text. Tab bars are ordered by
 * DOM position so the top-level bar comes first.
 */
async function snapshotTabBars(page) {
  return await page.evaluate(() => {
    const tabEls = Array.from(document.querySelectorAll('[role="tab"]'))
    const barSet = new Map()
    let order = 0
    for (const tab of tabEls) {
      let parent = tab.parentElement
      while (parent && parent.querySelectorAll('[role="tab"]').length < 2) {
        parent = parent.parentElement
      }
      if (!parent) continue
      if (!barSet.has(parent)) {
        barSet.set(parent, { order: order++, labels: [] })
      }
      const entry = barSet.get(parent)
      const text = (tab.textContent || '').trim().replace(/\s+/g, ' ')
      if (text && !entry.labels.includes(text)) entry.labels.push(text)
    }
    return Array.from(barSet.values()).sort((a, b) => a.order - b.order).map((e) => e.labels)
  })
}

async function clickTab(page, label) {
  const ok = await page.evaluate((wanted) => {
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'))
    const target = tabs.find(
      (t) => (t.textContent || '').trim().replace(/\s+/g, ' ') === wanted,
    )
    if (!target) return false
    try {
      target.scrollIntoView({ block: 'center', behavior: 'instant' })
      target.click()
      return true
    } catch (_) {
      return false
    }
  }, label)
  if (ok) await sleep(650)
  return ok
}

async function scrapeOne(browserPage, entry) {
  console.log(`\n[${entry.slug}] ${entry.url}`)
  try {
    await browserPage.goto(entry.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  } catch (err) {
    console.log(`  nav failed: ${err.message.split('\n')[0]}`)
    return { slug: entry.slug, url: entry.url, records: [] }
  }
  await sleep(5000)
  await browserPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await sleep(1500)
  await browserPage.evaluate(() => window.scrollTo(0, 0))
  await sleep(500)

  const seen = new Set()
  const records = []
  const pushRecords = (path, items) => {
    for (const item of items) {
      const key = `${path.join(' > ')}::${item.question}`
      if (seen.has(key)) continue
      seen.add(key)
      records.push({ tabPath: [...path], ...item })
    }
  }

  // 1. Capture anything already visible (single-accordion pages or
  //    default active tab on tabbed pages).
  pushRecords(['(default)'], await expandAndCollect(browserPage))

  // 2. Walk the first tab bar (top level). For each top-level tab,
  //    click it, then walk the now-visible tab bars (sub-tabs).
  const initialBars = await snapshotTabBars(browserPage)
  if (initialBars.length === 0) {
    console.log(`  no tabs, collected ${records.length}`)
    return { slug: entry.slug, url: entry.url, records }
  }

  const topLabels = initialBars[0]
  console.log(`  top tabs: ${topLabels.join(' | ')}`)

  for (const topLabel of topLabels) {
    if (!(await clickTab(browserPage, topLabel))) continue

    // Capture at top-level tab.
    pushRecords([topLabel], await expandAndCollect(browserPage))

    // Re-snapshot to pick up any tab bar that appeared below this tab.
    const nestedBars = await snapshotTabBars(browserPage)
    for (const bar of nestedBars) {
      // Skip the top-level bar itself.
      if (bar.length === topLabels.length && bar.every((l) => topLabels.includes(l))) continue
      for (const subLabel of bar) {
        if (subLabel === topLabel) continue
        if (!(await clickTab(browserPage, subLabel))) continue
        pushRecords([topLabel, subLabel], await expandAndCollect(browserPage))
      }
    }
  }

  console.log(`  captured ${records.length} Q&A pairs`)
  return { slug: entry.slug, url: entry.url, records }
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 1000 },
  })
  const page = await ctx.newPage()

  const results = []
  for (const entry of PAGES) {
    try {
      const res = await scrapeOne(page, entry)
      results.push(res)
    } catch (err) {
      console.log(`  FAILED ${entry.slug}: ${err.message.split('\n')[0]}`)
      results.push({ slug: entry.slug, url: entry.url, records: [], error: err.message.split('\n')[0] })
    }
    fs.writeFileSync('/tmp/fruition-faqs-full.json', JSON.stringify(results, null, 2))
  }

  await browser.close()

  const total = results.reduce((sum, r) => sum + r.records.length, 0)
  console.log(`\n=== DONE ===`)
  console.log(`Pages: ${results.length}   Total Q&A: ${total}`)
  console.log(`Saved: /tmp/fruition-faqs-full.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
