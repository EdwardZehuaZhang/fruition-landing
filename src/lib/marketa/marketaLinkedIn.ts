/**
 * LinkedIn post generator for the Marketa auto-docs flow.
 *
 * Given a finished blog draft, produces a 150-250 word LinkedIn variant in
 * Fruition's voice: hook, 3-5 specific points (often emoji-bulleted), soft
 * CTA back to the blog post. No links inserted (the human reviewer adds the
 * published URL after the blog ships).
 *
 * Uses OpenRouter (same auth/transport as src/lib/claudeClient.ts, kept
 * separate so we can swap models for this task without affecting the bot).
 * See docs/marketa-auto-docs-plan.md (Phase 3b).
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
// Haiku handles LinkedIn-post transformations comfortably and at ~1/5 the
// OpenRouter cost of Sonnet, which matters when the long-form blog drafting
// is already burning tokens on every run. Override with MARKETA_LINKEDIN_MODEL
// if a richer model is needed.
const DEFAULT_MODEL =
  process.env.MARKETA_LINKEDIN_MODEL ?? "anthropic/claude-haiku-4.5"

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error("OPENROUTER_API_KEY missing in production env (Vercel)")
  return key
}

const SYSTEM_PROMPT = [
  "You are Marketa, Fruition's marketing agent, writing a LinkedIn post that promotes a finished blog draft.",
  "",
  "Goal: 150-250 word LinkedIn post that earns the read of the full blog.",
  "",
  "Structure:",
  "1. Hook line (one sentence, specific, no generic openers).",
  "2. 1-2 sentence setup of the problem the blog addresses.",
  "3. 3-5 emoji-bulleted points naming concrete takeaways from the blog (no abstractions, no fluff). Bullets stay under ~15 words each.",
  "4. Soft CTA inviting the reader to read the blog. Do NOT include a URL — the human posts the link separately.",
  "5. 3-5 lowercase hashtags on the final line.",
  "",
  "Voice (Fruition):",
  "- Plain-spoken, confident, technical without academic.",
  "- Talk to a senior operator (COO, ops director).",
  "- Show, don't tell. Specific verbs over marketing adjectives.",
  "- No em dashes anywhere. Use commas, parens, or two short sentences.",
  "- Banned words: leverage, synergise, best-in-class, unlock potential, drive transformation, seamlessly, robust, dive into, in today's world, fast-paced, game-changer.",
  "- No 'I hope this helps' / 'let's dive in' AI-tells.",
  "- It must read human-written: vary sentence length and rhythm, allow a casual aside, never mirror the same sentence shape twice in a row. A sharp reader should not clock it as AI.",
  "- Only reference facts actually present in the blog draft. Never add statistics or claims of your own.",
  "",
  "Format constraints:",
  "- Plain text only. No markdown headings or bold.",
  "- LinkedIn renders newlines literally, so use blank lines between sections.",
  "- Output the post body only. No preamble, no 'Here's your post:' framing.",
].join("\n")

export interface GenerateLinkedInPostInput {
  title: string
  draft: string
  industry?: string
  targetKeyword?: string
}

export async function generateLinkedInPost(
  input: GenerateLinkedInPostInput,
): Promise<string> {
  const { title, draft, industry, targetKeyword } = input
  if (!title?.trim()) throw new Error("generateLinkedInPost: title required")
  if (!draft?.trim()) throw new Error("generateLinkedInPost: draft required")

  const userPrompt = [
    `Blog title: ${title}`,
    industry ? `Industry: ${industry}` : "",
    targetKeyword ? `Target keyword (for tone alignment, do not stuff): ${targetKeyword}` : "",
    "",
    "Full blog draft below. Write the LinkedIn post promoting it.",
    "",
    "---",
    draft,
    "---",
  ]
    .filter(Boolean)
    .join("\n")

  const apiKey = getApiKey()
  const body = {
    // 500 is ~2x the actual output we need (a 250-word LinkedIn post is
    // ~350 tokens) which leaves headroom for hashtags without billing for
    // unused capacity on a thin OpenRouter balance.
    model: DEFAULT_MODEL,
    max_tokens: 500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  }

  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://fruitionservices.io",
      "X-Title": "Marketa LinkedIn",
    },
    body: JSON.stringify(body),
  })

  const text = await r.text()
  if (!r.ok) {
    throw new Error(
      `OpenRouter (${DEFAULT_MODEL}) LinkedIn request failed ${r.status}: ${text.slice(0, 300)}`,
    )
  }

  interface OpenRouterChoice {
    message?: { content?: string | null }
  }
  interface OpenRouterResponse {
    choices?: OpenRouterChoice[]
    error?: { message?: string }
  }
  let parsed: OpenRouterResponse
  try {
    parsed = JSON.parse(text) as OpenRouterResponse
  } catch {
    throw new Error(`OpenRouter returned non-JSON ${r.status}: ${text.slice(0, 200)}`)
  }
  if (parsed.error) {
    throw new Error(`OpenRouter LinkedIn error: ${parsed.error.message ?? "unknown"}`)
  }
  const content = parsed.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error("OpenRouter LinkedIn returned empty content")
  }
  return content
}
