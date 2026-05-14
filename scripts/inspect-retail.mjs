import { chromium } from 'playwright'

const urls = [
  'https://www.fruitionservices.io/monday-for-retail',
  'http://localhost:3001/monday-for-retail',
]

const browser = await chromium.launch()
for (const url of urls) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  console.log('\n========', url, '========')
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
  } catch (e) {
    console.log('nav err, continuing')
  }
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0
      const step = () => {
        window.scrollTo(0, y)
        y += 600
        if (y > document.body.scrollHeight) resolve()
        else setTimeout(step, 80)
      }
      step()
    })
  })
  await page.waitForTimeout(800)
  const items = await page.evaluate(() => {
    const out = []
    const els = Array.from(document.querySelectorAll('h1, h2, h3'))
    for (const el of els) {
      const t = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 160)
      if (!t) continue
      const r = el.getBoundingClientRect()
      out.push({ y: Math.round(window.scrollY + r.top), tag: el.tagName, t })
    }
    out.sort((a, b) => a.y - b.y)
    return out
  })
  for (const s of items) console.log(String(s.y).padStart(5), s.tag, '|', s.t)
  await page.close()
}
await browser.close()
