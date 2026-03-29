import { parse } from 'node-html-parser'
import type { HTMLElement } from 'node-html-parser'
import { textToPortableText, cleanText } from './helpers.js'
import { sleep } from './helpers.js'

export const BASE_URL = 'https://www.fruitionservices.io'

export async function fetchPage(url: string): Promise<HTMLElement> {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`
  const resp = await fetch(fullUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${fullUrl}`)
  const html = await resp.text()
  return parse(html) as unknown as HTMLElement
}

export function extractTitle(root: HTMLElement): string {
  const og = root.querySelector('meta[property="og:title"]')
  if (og) {
    const t = og.getAttribute('content') || ''
    return cleanText(cleanTitleSuffix(t))
  }
  const title = root.querySelector('title')
  if (title) return cleanText(cleanTitleSuffix(title.text))
  const h1 = root.querySelector('h1')
  if (h1) return cleanText(h1.text.trim())
  return ''
}

export function cleanTitleSuffix(t: string): string {
  return t.replace(/\s*\|\s*Fruition\s*Services.*$/i, '').trim()
}

export function extractHero(root: HTMLElement): { heading: string; subheading: string } {
  const h1 = root.querySelector('h1')
  const heading = cleanText(h1 ? h1.text.trim() : extractTitle(root))

  let subheading = ''
  const metaDesc = root.querySelector('meta[name="description"]')
  if (metaDesc) subheading = cleanText(metaDesc.getAttribute('content') || '')

  if (!subheading) {
    const paras = root.querySelectorAll('p')
    for (const p of paras) {
      const t = cleanText(p.text.trim())
      if (t.length > 30) {
        subheading = t
        break
      }
    }
  }

  return { heading, subheading }
}

export function extractSeoDescription(root: HTMLElement): string {
  const meta = root.querySelector('meta[name="description"]')
  return cleanText(meta ? (meta.getAttribute('content') || '') : '')
}

export function extractOgImage(root: HTMLElement): string {
  const og = root.querySelector('meta[property="og:image"]')
  return og ? (og.getAttribute('content') || '') : ''
}

export function extractBodyText(root: HTMLElement): string[] {
  const results: string[] = []

  const container = root.querySelector('article') || root.querySelector('main') || root.querySelector('body')
  if (!container) return results

  const elements = container.querySelectorAll('p, h2, h3, h4, li')
  for (const el of elements) {
    const text = cleanText(el.text.trim())
    if (text.length > 0) results.push(text)
  }

  return results
}

export { textToPortableText, sleep }
