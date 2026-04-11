// Convert a node-html-parser HTMLElement tree into Sanity Portable Text.
// Preserves headings, paragraphs, bullet + numbered lists (with nesting),
// blockquotes, bold, italic, underline, code, and links.

import type { HTMLElement as NHPElement, Node as NHPNode } from 'node-html-parser'

// Strip control chars without trimming — trimming at the text-node level
// would destroy the whitespace that sits between inline elements
// (e.g. the space between `</strong>` and `saved` in `<strong>x</strong> saved`).
function stripControl(text: string): string {
  return text
    .replace(/\u0000/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}

interface PTSpan {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

interface PTMarkDef {
  _type: string
  _key: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any
}

export interface PTBlock {
  _type: 'block'
  _key: string
  style: string
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs: PTMarkDef[]
  children: PTSpan[]
}

const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'svg', 'button', 'input', 'select', 'textarea'])

const rk = () => Math.random().toString(36).slice(2, 10)

function normWs(s: string): string {
  // Collapse all whitespace (including \u00a0) into single spaces
  return s.replace(/[\s\u00a0]+/g, ' ')
}

/* ------------------------------------------------------------------ */
/*  Inline walker — produces spans + markDefs for a block's children  */
/* ------------------------------------------------------------------ */

function walkInline(
  node: NHPNode,
  activeMarks: string[],
  markDefs: PTMarkDef[],
  spans: PTSpan[],
): void {
  // Text node — use `.text` which decodes HTML entities (&#x27; -> ', &quot; -> ", etc.)
  if (node.nodeType === 3) {
    const raw = normWs(stripControl((node as unknown as { text: string }).text || ''))
    if (raw) {
      spans.push({ _type: 'span', _key: rk(), text: raw, marks: [...activeMarks] })
    }
    return
  }
  if (node.nodeType !== 1) return

  const el = node as NHPElement
  const tag = el.tagName?.toLowerCase()
  if (!tag) return

  // Don't descend into scripts, nested lists, or other non-inline content
  if (SKIP_TAGS.has(tag)) return
  if (tag === 'ul' || tag === 'ol') return // handled separately as sibling blocks

  // <br> → newline inside current block
  if (tag === 'br') {
    spans.push({ _type: 'span', _key: rk(), text: '\n', marks: [...activeMarks] })
    return
  }

  let nextMarks = activeMarks
  switch (tag) {
    case 'strong':
    case 'b':
      if (!activeMarks.includes('strong')) nextMarks = [...activeMarks, 'strong']
      break
    case 'em':
    case 'i':
      if (!activeMarks.includes('em')) nextMarks = [...activeMarks, 'em']
      break
    case 'u':
      if (!activeMarks.includes('underline')) nextMarks = [...activeMarks, 'underline']
      break
    case 'code':
      if (!activeMarks.includes('code')) nextMarks = [...activeMarks, 'code']
      break
    case 'a': {
      const href = el.getAttribute('href')
      if (href && href.trim()) {
        const key = rk()
        markDefs.push({ _type: 'link', _key: key, href: href.trim() })
        nextMarks = [...activeMarks, key]
      }
      break
    }
  }

  for (const child of el.childNodes) {
    walkInline(child, nextMarks, markDefs, spans)
  }
}

/* ------------------------------------------------------------------ */
/*  Merge consecutive spans with identical marks, then trim ends       */
/* ------------------------------------------------------------------ */

function compactSpans(spans: PTSpan[]): PTSpan[] {
  const merged: PTSpan[] = []
  for (const s of spans) {
    const last = merged[merged.length - 1]
    if (
      last &&
      last.marks.length === s.marks.length &&
      last.marks.every((m, i) => m === s.marks[i])
    ) {
      last.text += s.text
    } else {
      merged.push({ ...s, marks: [...s.marks] })
    }
  }
  // Trim leading/trailing whitespace from the overall block
  if (merged.length > 0) {
    merged[0].text = merged[0].text.replace(/^\s+/, '')
    merged[merged.length - 1].text = merged[merged.length - 1].text.replace(/\s+$/, '')
  }
  return merged.filter((s) => s.text.length > 0)
}

function buildBlock(
  style: string,
  el: NHPElement,
  listItem?: 'bullet' | 'number',
  level?: number,
): PTBlock | null {
  const markDefs: PTMarkDef[] = []
  const rawSpans: PTSpan[] = []
  for (const child of el.childNodes) {
    walkInline(child, [], markDefs, rawSpans)
  }
  const children = compactSpans(rawSpans)
  if (children.length === 0) return null

  // Prune unused markDefs (only keep those referenced by a span)
  const usedKeys = new Set<string>()
  for (const s of children) for (const m of s.marks) usedKeys.add(m)
  const prunedDefs = markDefs.filter((d) => usedKeys.has(d._key))

  const block: PTBlock = {
    _type: 'block',
    _key: rk(),
    style,
    markDefs: prunedDefs,
    children,
  }
  if (listItem) {
    block.listItem = listItem
    block.level = level ?? 1
  }
  return block
}

/* ------------------------------------------------------------------ */
/*  List walker — emits one block per <li> and handles nested lists    */
/* ------------------------------------------------------------------ */

function emitListBlocks(
  listEl: NHPElement,
  kind: 'bullet' | 'number',
  level: number,
  out: PTBlock[],
): void {
  for (const child of listEl.childNodes) {
    if (child.nodeType !== 1) continue
    const el = child as NHPElement
    if (el.tagName?.toLowerCase() !== 'li') continue
    const block = buildBlock('normal', el, kind, level)
    if (block) out.push(block)
    // Nested lists inside this li
    for (const inner of el.childNodes) {
      if (inner.nodeType !== 1) continue
      const innerEl = inner as NHPElement
      const innerTag = innerEl.tagName?.toLowerCase()
      if (innerTag === 'ul') emitListBlocks(innerEl, 'bullet', level + 1, out)
      else if (innerTag === 'ol') emitListBlocks(innerEl, 'number', level + 1, out)
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Top-level walker — finds block-level elements and emits PTBlocks   */
/* ------------------------------------------------------------------ */

const HEADING_STYLES: Record<string, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h4',
  h6: 'h4',
}

function walkBlock(container: NHPElement, out: PTBlock[]): void {
  for (const child of container.childNodes) {
    if (child.nodeType !== 1) continue
    const el = child as NHPElement
    const tag = el.tagName?.toLowerCase()
    if (!tag || SKIP_TAGS.has(tag)) continue

    if (tag in HEADING_STYLES) {
      const b = buildBlock(HEADING_STYLES[tag], el)
      if (b) out.push(b)
      continue
    }

    if (tag === 'p') {
      const b = buildBlock('normal', el)
      if (b) out.push(b)
      continue
    }

    if (tag === 'blockquote') {
      const b = buildBlock('blockquote', el)
      if (b) out.push(b)
      continue
    }

    if (tag === 'ul') {
      emitListBlocks(el, 'bullet', 1, out)
      continue
    }

    if (tag === 'ol') {
      emitListBlocks(el, 'number', 1, out)
      continue
    }

    // Structural wrappers — recurse
    if (
      tag === 'div' ||
      tag === 'section' ||
      tag === 'article' ||
      tag === 'main' ||
      tag === 'figure' ||
      tag === 'header' ||
      tag === 'footer' ||
      tag === 'aside'
    ) {
      walkBlock(el, out)
      continue
    }

    // Anything else: if it has element children, recurse; otherwise treat as a paragraph
    const hasElementChildren = el.childNodes.some((c) => c.nodeType === 1)
    if (hasElementChildren) {
      walkBlock(el, out)
    } else {
      const b = buildBlock('normal', el)
      if (b) out.push(b)
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Post-processing: deduplicate consecutive identical blocks          */
/* ------------------------------------------------------------------ */
/*  Wix pages sometimes render the same body content twice in the     */
/*  DOM (desktop + mobile variants). Drop adjacent duplicates.         */
/* ------------------------------------------------------------------ */

function textOf(b: PTBlock): string {
  return b.children.map((c) => c.text).join('')
}

function dedupeAdjacent(blocks: PTBlock[]): PTBlock[] {
  const out: PTBlock[] = []
  for (const b of blocks) {
    const last = out[out.length - 1]
    if (
      last &&
      last.style === b.style &&
      last.listItem === b.listItem &&
      textOf(last) === textOf(b)
    ) {
      continue
    }
    out.push(b)
  }
  return out
}

/* ------------------------------------------------------------------ */
/*  Public entry point                                                 */
/* ------------------------------------------------------------------ */

export function htmlElementToPortableText(container: NHPElement): PTBlock[] {
  const out: PTBlock[] = []
  walkBlock(container, out)
  return dedupeAdjacent(out)
}

/* ------------------------------------------------------------------ */
/*  Container selection — pick the Wix post body                       */
/* ------------------------------------------------------------------ */

export function findPostBodyContainer(root: NHPElement): NHPElement | null {
  const selectors = [
    '[data-hook="post-description"]',
    '.post-description',
    '[class*="post-description"]',
    '[data-hook="post-content"]',
    'article',
    'main',
  ]
  for (const sel of selectors) {
    const found = root.querySelector(sel)
    if (found) return found as unknown as NHPElement
  }
  return null
}
