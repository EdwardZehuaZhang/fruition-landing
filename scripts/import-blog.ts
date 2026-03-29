import { writeClient } from './sanity-client.js'
import { fetchPage, extractSeoDescription, extractOgImage, extractBodyText, sleep } from './scrape.js'
import { textToPortableText } from './helpers.js'

const BASE_URL = 'https://www.fruitionservices.io'

// Pre-defined categories from the sitemap
const BLOG_CATEGORIES = [
  'mondaydb', 'monday-crm', 'api', 'guidde', 'integration', 'fruition-uk',
  'automation', 'ai', 'monday-ai', 'finance-accounting', 'fruition-us',
  'monday-campaigns', 'fruition-australia', 'monday-service', 'n8n', 'make-com',
  'crm', 'monday-com', 'monday-dev', 'monday-com-consultant-partner', 'construction'
]

interface SitemapEntry {
  url: string
  lastmod?: string
}

async function parseSitemap(url: string): Promise<SitemapEntry[]> {
  console.log(`Fetching sitemap: ${url}`)
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' }
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`)
  const xml = await resp.text()

  const entries: SitemapEntry[] = []
  const urlMatches = xml.matchAll(/<url>([\s\S]*?)<\/url>/g)
  for (const match of urlMatches) {
    const block = match[1]
    const locMatch = block.match(/<loc>(.*?)<\/loc>/)
    const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/)
    if (locMatch) {
      entries.push({ url: locMatch[1].trim(), lastmod: lastmodMatch?.[1].trim() })
    }
  }

  console.log(`  Found ${entries.length} entries in sitemap`)
  return entries
}

async function importCategories() {
  console.log('\nImporting blog categories...')
  for (const slug of BLOG_CATEGORIES) {
    const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const doc = {
      _type: 'blogCategory',
      _id: `blogCategory-${slug}`,
      title,
      slug: { _type: 'slug', current: slug },
    }
    await writeClient.createOrReplace(doc)
    console.log(`  Created blogCategory: ${slug}`)
    await sleep(300)
  }
}

function extractBlogTitle(root: any): string {
  // Try og:title first
  const og = root.querySelector('meta[property="og:title"]')
  if (og) {
    const t = og.getAttribute('content') || ''
    return t.replace(/\s*\|\s*Fruition\s*Services.*$/i, '').replace(/\s*\|\s*[A-Z][^|]*$/i, '').trim()
  }
  // Try h1
  const h1 = root.querySelector('h1')
  if (h1) return h1.text.trim()
  // Try title tag
  const title = root.querySelector('title')
  if (title) return title.text.replace(/\s*\|\s*Fruition\s*Services.*$/i, '').replace(/\s*\|\s*[A-Z][^|]*$/i, '').trim()
  return ''
}

function extractAuthor(root: any): string {
  // Try byline selectors
  const byline = root.querySelector('[data-hook="byline"]') || root.querySelector('.byline') || root.querySelector('[class*="author"]')
  if (byline) return byline.text.trim()

  // Try title tag - often "Title | Fruition Services | Author Name"
  const title = root.querySelector('title')
  if (title) {
    const parts = title.text.split('|')
    if (parts.length >= 3) return parts[parts.length - 1].trim()
  }
  return 'Fruition Services'
}

function extractPublishedDate(root: any, lastmod?: string): string {
  // Try time element
  const time = root.querySelector('time')
  if (time) {
    const dt = time.getAttribute('datetime') || time.text
    if (dt) return dt
  }

  // Try meta
  const metaDate = root.querySelector('meta[property="article:published_time"]') ||
                   root.querySelector('meta[name="date"]')
  if (metaDate) return metaDate.getAttribute('content') || ''

  return lastmod || new Date().toISOString()
}

function extractCategoriesFromPage(root: any): string[] {
  const cats: string[] = []
  // Look for category links
  const links = root.querySelectorAll('a[href*="/consulting-blog/categories/"]')
  for (const link of links) {
    const href = link.getAttribute('href') || ''
    const match = href.match(/\/consulting-blog\/categories\/([^/?#]+)/)
    if (match) cats.push(match[1])
  }
  return [...new Set(cats)]
}

async function importBlogPost(entry: SitemapEntry): Promise<boolean> {
  try {
    const urlPath = new URL(entry.url).pathname
    const slugMatch = urlPath.match(/\/post\/([^/?#]+)/)
    if (!slugMatch) {
      console.log(`  Skipping (no /post/ segment): ${entry.url}`)
      return false
    }
    const slug = slugMatch[1]

    console.log(`  Scraping blog post: ${slug}`)
    const root = await fetchPage(entry.url)
    await sleep(1000)

    const title = extractBlogTitle(root)
    const author = extractAuthor(root)
    const publishedAt = extractPublishedDate(root, entry.lastmod)
    const coverImageUrl = extractOgImage(root)
    const excerpt = extractSeoDescription(root)
    const bodyTexts = extractBodyText(root)
    const categorySlags = extractCategoriesFromPage(root)

    // Build category references
    const categories = categorySlags
      .filter(s => BLOG_CATEGORIES.includes(s))
      .map(s => ({
        _type: 'reference',
        _key: Math.random().toString(36).slice(2),
        _ref: `blogCategory-${s}`
      }))

    const doc: any = {
      _type: 'blogPost',
      _id: `blogPost-${slug}`,
      title: title || slug,
      slug: { _type: 'slug', current: slug },
      publishedAt: publishedAt || entry.lastmod || new Date().toISOString(),
      author,
      excerpt,
      body: textToPortableText(bodyTexts),
      seoTitle: title,
      seoDescription: excerpt,
    }

    if (coverImageUrl) {
      // Store as external URL field - not uploading to avoid rate limits
      doc.coverImageUrl = coverImageUrl
    }

    if (categories.length > 0) {
      doc.categories = categories
    }

    await writeClient.createOrReplace(doc)
    console.log(`  Created blogPost: ${title || slug}`)
    return true
  } catch (err) {
    console.error(`  ERROR importing ${entry.url}:`, (err as Error).message)
    return false
  }
}

async function main() {
  const start = Date.now()
  console.log('Starting blog import...')

  // Import categories first
  await importCategories()

  // Get all blog post URLs from sitemap
  let entries: SitemapEntry[] = []
  try {
    entries = await parseSitemap(`${BASE_URL}/blog-posts-sitemap.xml`)
  } catch (err) {
    console.error('Failed to fetch blog-posts-sitemap.xml:', (err as Error).message)
    console.log('Trying fallback sitemap...')
    try {
      const mainSitemap = await fetch(`${BASE_URL}/sitemap.xml`, {
        headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' }
      })
      const xml = await mainSitemap.text()
      // Look for sub-sitemaps
      const sitemapMatches = xml.matchAll(/<loc>(.*sitemap.*)<\/loc>/g)
      for (const m of sitemapMatches) {
        if (m[1].includes('blog') || m[1].includes('post')) {
          try {
            const subEntries = await parseSitemap(m[1])
            entries.push(...subEntries)
          } catch {}
        }
      }
    } catch {}
  }

  // Filter to blog post URLs only
  const postEntries = entries.filter(e => e.url.includes('/post/'))
  console.log(`\nFound ${postEntries.length} blog posts to import`)

  // Process in batches of 10
  const BATCH_SIZE = 10
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < postEntries.length; i += BATCH_SIZE) {
    const batch = postEntries.slice(i, i + BATCH_SIZE)
    console.log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(postEntries.length / BATCH_SIZE)} (posts ${i + 1}-${Math.min(i + BATCH_SIZE, postEntries.length)})`)

    for (const entry of batch) {
      const ok = await importBlogPost(entry)
      if (ok) successCount++
      else failCount++
    }

    // 500ms delay between batches
    if (i + BATCH_SIZE < postEntries.length) {
      console.log('  Pausing between batches...')
      await sleep(500)
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\nBlog import complete in ${elapsed}s`)
  console.log(`  Success: ${successCount} posts`)
  console.log(`  Failed:  ${failCount} posts`)
  console.log(`  Categories: ${BLOG_CATEGORIES.length}`)
}

main().catch(console.error)
