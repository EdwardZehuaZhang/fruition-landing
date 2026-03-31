require("dotenv").config({ path: ".env.local" })
const { chromium } = require("playwright")
const { createClient } = require("@sanity/client")
const client = createClient({ projectId: "bt6nb58h", dataset: "production", apiVersion: "2024-01-01", token: process.env.SANITY_WRITE_TOKEN, useCdn: false })

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function run() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36", viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()

  console.log("Loading team page...")
  await page.goto("https://www.fruitionservices.io/fruition-team", { waitUntil: "load", timeout: 30000 })
  await sleep(6000)

  // Dump all text + images to understand structure
  const data = await page.evaluate(() => {
    const results = []
    // Look for name+role+image combos
    const allText = document.querySelectorAll("h1, h2, h3, h4, h5, p, span")
    for (const el of allText) {
      const text = el.textContent?.trim()
      if (!text || text.length < 2 || text.length > 80) continue
      // Look for elements near images
      const rect = el.getBoundingClientRect()
      if (rect.top < 100) continue // skip nav
      const nearbyImg = el.closest("div")?.querySelector("img")
      if (nearbyImg) {
        results.push({ tag: el.tagName, text, imgSrc: nearbyImg.src, rect: { top: Math.round(rect.top), left: Math.round(rect.left) } })
      }
    }
    return results
  })

  console.log("Elements near images:", JSON.stringify(data.slice(0, 30), null, 2))
  await browser.close()
}
run().catch(e => { console.error(e.message); process.exit(1) })