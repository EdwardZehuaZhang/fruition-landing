/**
 * Mirrors the production n8n "Build draft prompt" + "Claude: write draft" nodes
 * so the eval harness generates drafts the same way production does:
 *   live Sanity voice guide  +  brief  +  brain (RAG) context  +  web search.
 *
 * Keep this in sync with n8n/marketa-draft-blog.json. The single biggest lever
 * is the voice guide (fetched live), so changing it in Sanity changes both.
 */
import Anthropic from "@anthropic-ai/sdk"
import { embedTexts } from "../../../src/lib/marketa/brain"

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DS = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const API = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

// Matches the n8n "Claude: write draft" node system prologue. The voice guide
// is appended after it. (n8n still says "industry-focused over product-pitchy";
// the v0.3 voice guide overrides that with an explicit proof+CTA requirement.)
const SYSTEM_PROLOGUE =
  "You are Marketa, Fruition's marketing agent. Write AEO-optimised long-form blogs (2000+ words). " +
  "Cite every external statistic as an INLINE markdown hyperlink at the exact point you use it, e.g. " +
  "\"[43% of teams](https://source.com)\" — NOT as [Source N] footnote markers and NOT only in a list. " +
  "Weave at least four cited stats into the body sections. Still end with a Sources list for QA. " +
  "Follow the Fruition voice guide and post template strictly. Output markdown."

export async function fetchLiveVoiceGuide(): Promise<{ body: string; version: string }> {
  const q = encodeURIComponent('*[_type=="voiceGuide"][0]{body,version}')
  const r = await fetch(`https://${PID}.api.sanity.io/v${API}/data/query/${DS}?query=${q}`)
  if (!r.ok) throw new Error(`voice guide fetch ${r.status}`)
  const res = (await r.json()).result || {}
  return { body: res.body || "(no voice guide)", version: res.version || "?" }
}

export interface BrainChunk {
  source_id: string
  source_path: string
  body: string
  similarity: number
}

/** Replicate the n8n Supabase retrieval (match_content_chunks RPC). Optional. */
export async function retrieveBrain(
  query: string,
  industry: string,
  matchCount = 8,
): Promise<BrainChunk[]> {
  const url = process.env.MARKETA_SUPABASE_URL
  const key = process.env.MARKETA_SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return []
  const [embedding] = await embedTexts([query], "query")
  // pgvector via PostgREST: pass the vector as its bracketed string form so
  // Postgres casts text -> vector(768).
  const body = {
    query_embedding: `[${embedding.join(",")}]`,
    match_count: matchCount,
    filter_industry: industry || null,
  }
  const r = await fetch(`${url}/rest/v1/rpc/match_content_chunks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    console.warn(`[eval] brain retrieval ${r.status}: ${(await r.text()).slice(0, 160)} (continuing without RAG)`)
    return []
  }
  return (await r.json()) as BrainChunk[]
}

export function buildContext(chunks: BrainChunk[]): string {
  if (!chunks.length) return ""
  return chunks
    .map((c, i) => `--- Source ${i + 1} (id: ${c.source_id}, path: ${c.source_path}) ---\n${c.body}`)
    .join("\n\n")
}

export interface StatItem {
  claim: string
  url: string
}

/**
 * Pre-fetch real, citable stats with a web-search call that returns JSON. The
 * main write then inline-links these from a menu (web search OFF), which is the
 * only reliable way to get inline markdown citations — with the web_search tool
 * active during the write, Claude footnotes citations as metadata instead.
 */
export async function fetchStatMenu(topic: string, industry: string, n = 6): Promise<StatItem[]> {
  const key = process.env.CLAUDE_API_KEY
  if (!key) return []
  const client = new Anthropic({ apiKey: key })
  try {
    const r = await client.messages.create({
      model: process.env.MARKETA_MODEL || "claude-opus-4-7",
      max_tokens: 1500,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }] as unknown as Anthropic.Tool[],
      system: "You research real, recent, citable statistics and return STRICT JSON only.",
      messages: [{
        role: "user",
        content:
          `Find ${n} recent (2023-2026) citable statistics relevant to a blog on "${topic}" ` +
          `(industry: ${industry}). Each must be a real number you verified from a reputable URL ` +
          `(industry report, vendor data, research firm, reputable publication). Respond with ONLY a ` +
          `JSON array, no prose: [{"claim":"one sentence containing the number","url":"https://..."}]`,
      }],
    })
    const text = (r.content || [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text?: string }) => b.text || "")
      .join("")
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return []
    const arr = JSON.parse(match[0]) as StatItem[]
    return Array.isArray(arr) ? arr.filter((s) => s.claim && /^https?:\/\//.test(s.url)) : []
  } catch (e) {
    console.warn(`[eval] stat menu failed: ${(e as Error).message}`)
    return []
  }
}

export interface GenInput {
  topicTitle: string
  brief: string
  targetKeyword: string
  industry: string
  voiceGuide: string
  context: string
  internalLinks?: { title: string; url: string }[]
  statMenu?: StatItem[]
  webSearch?: boolean
  model?: string
  maxTokens?: number
}

/** A menu of real, allowed internal URLs. The model must link ONLY from here. */
function buildLinkMenu(links?: { title: string; url: string }[]): string {
  if (!links || !links.length) return ""
  const lines = links.map((l) => `- ${l.title} -> ${l.url}`).join("\n")
  return (
    `\n\nINTERNAL LINK MENU (real published Fruition posts). When you link internally, ` +
    `use ONLY URLs from this list, matched to the most relevant anchor text. Do NOT invent ` +
    `or guess any fruitionservices.io slug. If nothing here fits a mention, leave it unlinked.\n${lines}`
  )
}

/** Generate one draft, mirroring the production Claude call. */
export async function generateDraft(input: GenInput): Promise<string> {
  const key = process.env.CLAUDE_API_KEY
  if (!key) throw new Error("CLAUDE_API_KEY missing")
  const client = new Anthropic({ apiKey: key })

  const system = `${SYSTEM_PROLOGUE}\n\nVOICE GUIDE:\n${input.voiceGuide}`
  const sources = input.context
    ? `\n\nRetrieved Fruition sources to draw from, cite, and INTERNAL-LINK to (use their fruitionservices.io paths):\n${input.context}`
    : "\n\n(No retrieved sources. Use web search to verify facts; do not invent statistics.)"
  const linkMenu = buildLinkMenu(input.internalLinks)
  const statBlock = input.statMenu && input.statMenu.length
    ? "\n\nSTAT MENU (real verified statistics). Weave at least 4 of these into the body, each as an " +
      "INLINE markdown link on the number, using its URL. Example: \"[268% more often](https://...)\".\n" +
      input.statMenu.map((s) => `- ${s.claim} -> ${s.url}`).join("\n")
    : ""
  const citationRule =
    "\n\nINLINE CITATION RULE (strict): every statistic, percentage, or dated fact in the body MUST be " +
    "written as an inline markdown link on the stat itself, at the point you use it. " +
    'Example: "Agile projects fail [268% more often](https://www.engprax.com/...) when requirements are unclear." ' +
    "Do NOT use [Source N] markers. Do NOT defer citations to a numbered reference style in the body. " +
    "At least 4 body statistics must be inline-linked this way. You may ALSO repeat the URLs in a final " +
    "Sources list, but the list alone does not satisfy this rule."
  const user =
    `Topic: ${input.topicTitle}\n\nBrief: ${input.brief}\n\n` +
    `Target keyword: ${input.targetKeyword}\n\nIndustry: ${input.industry}${sources}${linkMenu}${statBlock}${citationRule}\n\n` +
    `Write the full blog post now, following the post template (meta description, reframed H1, ` +
    `bold Q&A opener, body with INLINE-LINKED stats + internal links from the menu, a "How Fruition Helps" ` +
    `proof block, CTA, FAQs, Sources). Start with the Meta-Description line.`

  const tools = input.webSearch === false
    ? undefined
    : ([{ type: "web_search_20250305", name: "web_search", max_uses: 5 }] as unknown as Anthropic.Tool[])

  const r = await client.messages.create({
    model: input.model || process.env.MARKETA_MODEL || "claude-opus-4-7",
    max_tokens: input.maxTokens || 8000,
    system,
    ...(tools ? { tools } : {}),
    messages: [{ role: "user", content: user }],
  })
  // Concatenate every text block (web search returns multiple blocks).
  return (r.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text?: string }) => b.text || "")
    .join("")
    .trim()
}
