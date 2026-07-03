// Screenshot given routes in light + dark for dark-mode QA.
// Usage: node scripts/qa-darkmode.mjs / /about-us /contact-us
// Requires the dev server running (default http://localhost:3007).
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.QA_BASE || 'http://localhost:3007'
const paths = process.argv.slice(2)
if (!paths.length) {
  console.error('usage: node scripts/qa-darkmode.mjs /path [/path …]')
  process.exit(1)
}
mkdirSync('qa/darkmode', { recursive: true })

const browser = await chromium.launch()
for (const scheme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    colorScheme: scheme,
    viewport: { width: 1440, height: 900 },
  })
  const page = await ctx.newPage()
  for (const p of paths) {
    const slug = p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '-')
    try {
      await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 60000 })
    } catch {
      // networkidle can hang on marketing pages with long-poll scripts; fall back
      await page.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForTimeout(2500)
    }
    await page.screenshot({ path: `qa/darkmode/${slug}-${scheme}.png`, fullPage: true })
    console.log(`shot ${slug} ${scheme}`)
  }
  await ctx.close()
}
await browser.close()
