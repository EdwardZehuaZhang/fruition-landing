import { chromium } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await page.goto('http://localhost:3001/about-us', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(800)
const total = await page.evaluate(() => document.documentElement.scrollHeight)
const step = 900
let i = 0
for (let y = 0; y < total; y += step, i++) {
  await page.evaluate((y) => window.scrollTo(0, y), y)
  await page.waitForTimeout(300)
  await page.screenshot({ path: `/tmp/about-slice-${String(i).padStart(2,'0')}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } })
}
await browser.close()
console.log('total', total, 'slices', i)
