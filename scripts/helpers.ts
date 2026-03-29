// Clean text - remove null bytes and other invalid unicode Sanity rejects
export function cleanText(text: string): string {
  return text
    .replace(/\u0000/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
}

// Convert array of paragraph strings to Sanity Portable Text blocks
export function textToPortableText(paragraphs: string[]) {
  return paragraphs
    .map(p => cleanText(p))
    .filter(p => p.length > 0)
    .map(text => ({
      _type: 'block',
      _key: Math.random().toString(36).slice(2),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }]
    }))
}

// Slugify string
export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Sleep helper
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
