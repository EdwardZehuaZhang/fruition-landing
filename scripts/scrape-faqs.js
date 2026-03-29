require('dotenv').config({ path: '.env.local' })
const { chromium } = require('playwright')
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'bt6nb58h', dataset: 'production',
  apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false,
})
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
function mkKey() { return Math.random().toString(36).slice(2,10) }
function toBlocks(text) {
  return (text||'').split('\n').map(t=>t.trim()).filter(t=>t.length>5).slice(0,30).map(t=>({
    _type:'block',_key:mkKey(),style:'normal',markDefs:[],
    children:[{_type:'span',_key:mkKey(),text:t,marks:[]}]
  }))
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
    viewport:{width:1280,height:900}
  })
  const page = await ctx.newPage()
  console.log('Loading FAQ page...')
  await page.goto('https://www.fruitionservices.io/faqs', { waitUntil:'load', timeout:45000 })
  await sleep(5000)

  // Scroll to load all lazy content
  for (let i = 0; i < 5; i++) {
    await page.evaluate(n => window.scrollTo(0, n * document.body.scrollHeight / 5), i+1)
    await sleep(500)
  }
  await page.evaluate(() => window.scrollTo(0,0))
  await sleep(1000)

  // Get all h3 question elements (Wix FAQ questions are in h3)
  const allFaqs = []
  
  // Strategy: find all h3 that contain '?' and click them to expand, then grab answer
  const questionCount = await page.evaluate(() =>
    document.querySelectorAll('h3').length
  )
  console.log(`Found ${questionCount} h3 elements`)

  for (let i = 0; i < questionCount; i++) {
    try {
      const q = await page.evaluate(idx => {
        const h3s = document.querySelectorAll('h3')
        return h3s[idx]?.textContent?.trim() || ''
      }, i)
      
      if (!q || !q.includes('?') || q.length < 15 || q.length > 300) continue
      if (/^(monday\.com FAQs|Industry FAQs|Partnership FAQs)$/i.test(q)) continue
      
      // Click the h3 or its parent to expand
      try {
        await page.evaluate(idx => {
          const h3s = document.querySelectorAll('h3')
          const h3 = h3s[idx]
          if (!h3) return
          // Click the accordion trigger (parent button or h3 itself)
          const btn = h3.closest('button') || h3.closest('[role="button"]') ||
                      h3.closest('[class*="trigger"]') || h3.closest('[class*="header"]') ||
                      h3.parentElement
          if (btn) btn.click()
          else h3.click()
        }, i)
        await sleep(400)
      } catch {}

      // Try to find the answer - look for a region near this h3
      const answer = await page.evaluate(idx => {
        const h3s = document.querySelectorAll('h3')
        const h3 = h3s[idx]
        if (!h3) return ''
        
        // Walk up to accordion container and find the region
        let container = h3.parentElement
        for (let depth = 0; depth < 6; depth++) {
          if (!container) break
          const region = container.querySelector('[role="region"]')
          if (region && region.textContent?.trim().length > 10) {
            return region.textContent?.trim()
          }
          container = container.parentElement
        }
        
        // Try next sibling approach
        let next = h3.nextElementSibling
        for (let j = 0; j < 4; j++) {
          if (!next) break
          const text = next.textContent?.trim()
          if (text && text.length > 20 && !text.includes('?')) return text
          next = next.nextElementSibling
        }
        return ''
      }, i)
      
      if (q && answer && answer.length > 10) {
        console.log(`  Q: ${q.substring(0,60)}`)
        allFaqs.push({ question: q, answer })
      } else if (q) {
        // Store question-only with placeholder if no answer found
        console.log(`  Q (no answer): ${q.substring(0,60)}`)
        allFaqs.push({ question: q, answer: '' })
      }
    } catch (err) {
      console.log(`  Skip h3[${i}]: ${err.message.split('\n')[0]}`)
    }
  }

  console.log(`\nTotal FAQs: ${allFaqs.length}`)
  await browser.close()

  let saved = 0
  for (let i = 0; i < allFaqs.length; i++) {
    const { question, answer } = allFaqs[i]
    try {
      await client.createOrReplace({
        _id: `faq-${i}`, _type: 'faqItem',
        question, answer: toBlocks(answer), order: i
      })
      saved++
      await sleep(500)
    } catch(err) { console.error(`ERROR faq-${i}: ${err.message}`) }
  }

  const count = await client.fetch('count(*[_type == "faqItem"])')
  console.log(`Saved: ${saved}/${allFaqs.length} | Sanity faqItem: ${count}`)
}
run().catch(e=>{console.error(e);process.exit(1)})
