import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

await mkdir('/tmp/retail-shots', { recursive: true })
const browser = await chromium.launch()
for (const [name, url] of [
  ['prod', 'https://www.fruitionservices.io/monday-for-retail'],
  ['local', 'http://localhost:3001/monday-for-retail'],
]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
  } catch {}
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0
      const step = () => {
        window.scrollTo(0, y)
        y += 600
        if (y > document.body.scrollHeight) res()
        else setTimeout(step, 80)
      }
      step()
    })
  })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `/tmp/retail-shots/${name}-full.png`, fullPage: true })
  console.log(name, 'done')
  await page.close()
}
await browser.close()
