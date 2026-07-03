/**
 * Deterministic scorer for the Fruition blog style rubric.
 * See docs/marketa-blog-style-spec.md for the dimensions and weights.
 * Returns 0-100. Drives iteration on the voice guide: tune, regenerate, re-score.
 */

export interface DimScore {
  key: string
  label: string
  weight: number
  score: number // 0..weight
  detail: string
}
export interface ScoreResult {
  total: number
  breakdown: DimScore[]
  structuralZeros: string[] // structural dims (2-7) that scored 0
}

const AUTHORITY = [
  "gartner.com", "forbes.com", "ibm.com", "mckinsey.com", "salesforce.com",
  "businesswire.com", "statista.com", "deloitte.com", "pwc.com", "harvard",
  "hbr.org", "monday.com", "techcrunch.com", "reuters.com", "bloomberg.com",
  "ey.com", "idc.com", "forrester.com", "siliconangle.com",
]
const CRED_PATTERNS = [
  /platinum\s+(monday\.?com\s+)?partner/i,
  /\b500\+?\s*implementations?/i,
  /\b4\.7\s*\/\s*5|\b4\.7\b.*csat/i,
  /\b9[,.]?000\+?\s*(billable\s*)?hours/i,
  /\b700\+?\s*(satisfied\s*)?clients?/i,
  /\b(27|37)\+?\s*(certified\s*)?(monday\.?com\s*)?(experts?|consultants?)/i,
]
const BANNED = [
  "in today's fast-paced world", "let's dive in", "the bottom line is",
  "at the end of the day", "i hope this helps", "let me know if you need",
]

function mdLinks(text: string): { label: string; url: string }[] {
  const out: { label: string; url: string }[] = []
  const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) out.push({ label: m[1], url: m[2] })
  return out
}

function sentences(text: string): string[] {
  const prose = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#.*$/gm, " ") // drop headings
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // unwrap links
  return prose.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length > 2)
}

function median(nums: number[]): number {
  if (!nums.length) return 0
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export function scoreDraft(
  draft: string,
  opts: { topicTitle: string; targetKeyword?: string },
): ScoreResult {
  const lower = draft.toLowerCase()
  const links = mdLinks(draft)
  const h1 = (draft.match(/^#\s+(.+)$/m)?.[1] || draft.split("\n").find((l) => l.trim() && !/^meta/i.test(l)) || "").trim()
  const firstChunk = draft.slice(0, 700)
  // Split off the trailing "Sources" list so it does not count as inline
  // citation and does not hide the CTA (which sits before it).
  const srcIdx = draft.search(/^#{1,3}\s*sources\b/im)
  const body = srcIdx >= 0 ? draft.slice(0, srcIdx) : draft
  const lastChunk = body.slice(-1800)

  const dims: DimScore[] = []
  const add = (key: string, label: string, weight: number, score: number, detail: string) =>
    dims.push({ key, label, weight, score: Math.max(0, Math.min(weight, score)), detail })

  // 1. Title reframed (10)
  {
    const seed = opts.topicTitle.toLowerCase()
    const hasYear = /20\d\d/.test(h1)
    const hasSuffix = /(guide|deep dive|everything you need to know|explained|complete|ultimate|how to|what is)/i.test(h1)
    const identical = h1.toLowerCase().replace(/[^a-z0-9]/g, "") === seed.replace(/[^a-z0-9]/g, "")
    const s = identical ? 0 : (hasYear ? 5 : 0) + (hasSuffix ? 5 : 0)
    add("title", "Title reframed", 10, s, `H1="${h1.slice(0, 60)}" year=${hasYear} suffix=${hasSuffix} identical=${identical}`)
  }
  // 2. Q&A snippet opener (12)
  {
    const m = /\*\*[^*\n]+\?\*\*/.test(firstChunk)
    add("qa", "Q&A snippet opener", 12, m ? 12 : 0, m ? "bold question near top" : "no bold question opener")
  }
  // 3. Inline cited stats (14): external links woven into the BODY (not the
  // Sources list) whose anchor text or preceding context carries a number.
  {
    const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g
    let m: RegExpExecArray | null
    let n = 0
    let authority = 0
    while ((m = re.exec(body))) {
      const [, label, url] = m
      if (url.includes("fruitionservices.io")) continue
      const after = body.slice(m.index + m[0].length, m.index + m[0].length + 50)
      const ctx = body.slice(Math.max(0, m.index - 90), m.index) + label + after
      if (/\d|percent|%|\bbillion\b|\bmillion\b/i.test(ctx)) {
        n++
        if (AUTHORITY.some((d) => url.includes(d))) authority++
      }
    }
    const s = n >= 4 ? 14 : n * 3.5
    add("stats", "Inline cited stats (in body)", 14, s, `${n} inline stat links (${authority} top-authority)`)
  }
  // 4. Internal links (14)
  {
    const internal = links.filter((l) => l.url.includes("fruitionservices.io"))
    const n = internal.length
    const s = n >= 3 ? 14 : n * 4.67
    add("internal", "fruitionservices.io internal links", 14, s, `${n} internal links`)
  }
  // 5. Credentials / proof block (12)
  {
    const credHits = CRED_PATTERNS.filter((p) => p.test(draft)).length
    // Any heading that names Fruition, or the common proof-block phrasings.
    const hasSection =
      /^#{1,3}.*\bfruition\b/im.test(draft) ||
      /how fruition helps|where fruition|why fruition|how can fruition|fruition can help|work(ing)? with fruition|partner with fruition|how we help|why work with|engage fruition|fruition (fits|approach)/i.test(draft)
    const s = (hasSection ? 4 : 0) + Math.min(8, credHits * 4)
    add("creds", "Credentials / proof block", 12, s, `section=${hasSection} credStats=${credHits}`)
  }
  // 6. CTA close (8)
  {
    const cta = /(free quote|contact fruition|book a|get in touch|talk to|reach out|schedule a|get a quote|let's talk)/i.test(lastChunk)
    add("cta", "CTA close", 8, cta ? 8 : 0, cta ? "explicit ask in close" : "no explicit CTA")
  }
  // 7. FAQ section (10)
  {
    const idx = draft.search(/^#{1,3}\s*(faqs?|frequently asked)/im)
    let qs = 0
    if (idx >= 0) qs = (draft.slice(idx).match(/\?/g) || []).length
    const s = idx < 0 ? 0 : qs >= 3 ? 10 : qs * 3
    add("faq", "FAQ section", 10, s, idx < 0 ? "no FAQ section" : `${qs} questions in FAQ`)
  }
  // 8. Meta description (5)
  {
    const line = draft.split("\n").find((l) => /meta-?description/i.test(l)) || ""
    const val = line.replace(/.*meta-?description[:\s-]*/i, "").trim()
    const ok = val.length >= 120 && val.length <= 175
    add("meta", "Meta description", 5, ok ? 5 : val ? 2 : 0, val ? `len=${val.length}` : "missing")
  }
  // 9. Readability (8)
  {
    const lens = sentences(draft).map((s) => s.split(/\s+/).length)
    const med = median(lens)
    const s = med > 0 && med < 20 ? 8 : med < 25 ? 4 : 0
    add("read", "Readability (median sentence len)", 8, s, `median=${med} words`)
  }
  // 10. Keyword usage (4)
  {
    const kw = (opts.targetKeyword || "").toLowerCase().trim()
    if (!kw) {
      add("kw", "Keyword usage", 4, 4, "no keyword supplied (n/a)")
    } else {
      const inH1 = h1.toLowerCase().includes(kw)
      const inFirst = firstChunk.toLowerCase().includes(kw)
      const inH2 = new RegExp(`^#{2,3}.*${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "im").test(draft)
      const s = (inH1 ? 1.5 : 0) + (inFirst ? 1.5 : 0) + (inH2 ? 1 : 0)
      add("kw", "Keyword usage", 4, s, `h1=${inH1} firstPara=${inFirst} h2=${inH2}`)
    }
  }
  // 11. No AI-tells (3)
  {
    const hits = BANNED.filter((b) => lower.includes(b))
    add("aitells", "No AI-tell phrases", 3, hits.length ? 0 : 3, hits.length ? `banned: ${hits.join(", ")}` : "clean")
  }

  const total = Math.round(dims.reduce((a, d) => a + d.score, 0))
  const structuralKeys = ["qa", "stats", "internal", "creds", "cta", "faq"]
  const structuralZeros = dims.filter((d) => structuralKeys.includes(d.key) && d.score === 0).map((d) => d.label)
  return { total, breakdown: dims, structuralZeros }
}

export function formatScorecard(title: string, r: ScoreResult): string {
  const lines = [`### ${title} — ${r.total}/100`]
  for (const d of r.breakdown) {
    const bar = d.score === d.weight ? "PASS" : d.score === 0 ? "FAIL" : "part"
    lines.push(`- [${bar}] ${d.label}: ${Math.round(d.score)}/${d.weight} — ${d.detail}`)
  }
  if (r.structuralZeros.length) lines.push(`> structural gaps: ${r.structuralZeros.join("; ")}`)
  return lines.join("\n")
}
