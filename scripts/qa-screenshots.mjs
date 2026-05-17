#!/usr/bin/env node
/**
 * Capture full-page screenshots of every page affected by the Sanity content
 * migration. Outputs PNGs to qa/<label>/<slug>.png.
 *
 *   node scripts/qa-screenshots.mjs <label> [--base http://localhost:3000]
 *
 *   label   subdir under qa/ — e.g. `baseline`, `after-marketing`
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROUTES = [
  'monday-for-marketing',
  'monday-for-real-estate',
  'monday-for-professional-services',
  'customer-testimonials',
  'implementation-packages',
  'about-us',
]

const label = process.argv[2]
if (!label) {
  console.error('usage: node scripts/qa-screenshots.mjs <label>')
  process.exit(2)
}
const baseIdx = process.argv.indexOf('--base')
const base = baseIdx > 0 ? process.argv[baseIdx + 1] : 'http://localhost:3000'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(repoRoot, 'qa', label)
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
})

for (const slug of ROUTES) {
  const url = `${base}/${slug}`
  const page = await ctx.newPage()
  console.log('→', url)
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 })
  } catch (err) {
    console.error('  goto failed:', err.message)
    await page.close()
    continue
  }
  // Wait for any next/image hydration + lazy assets
  await page.waitForTimeout(2500)
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0
      const step = () => {
        window.scrollTo(0, y)
        y += 600
        if (y > document.body.scrollHeight) res()
        else setTimeout(step, 90)
      }
      step()
    })
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1200)
  const file = path.join(outDir, `${slug}.png`)
  await page.screenshot({ path: file, fullPage: true })
  console.log('  saved', path.relative(repoRoot, file))
  await page.close()
}

await browser.close()
console.log('done →', path.relative(repoRoot, outDir))
