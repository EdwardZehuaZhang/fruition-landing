import { chromium } from 'playwright'

const OUT = '/private/tmp/claude-502/-Users-edward-Github-Fruition-Service/3d5a03da-cf4c-4f06-907a-b9d001d205d4/scratchpad'
const BASE = 'http://localhost:3005'

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(BASE, { waitUntil: 'networkidle' })

// Dismiss the RB2B visitor-consent popup if it shows
try {
  await page.getByRole('button', { name: 'Decline' }).click({ timeout: 4000 })
} catch {}
await page.waitForTimeout(500)

const tabs = ['Services', 'Partnerships', 'Industries', 'Insights', 'About']
for (const tab of tabs) {
  await page.hover(`nav button:has-text("${tab}")`)
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/nav-${tab.toLowerCase()}.png` })
}

// Mobile: hamburger → expand Services
await page.setViewportSize({ width: 375, height: 812 })
await page.waitForTimeout(400)
await page.click('nav button:has(span.sr-only)')
await page.waitForTimeout(300)
await page.locator('nav button:visible', { hasText: 'Services' }).first().click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/nav-mobile-services.png` })

await browser.close()
console.log('done')
