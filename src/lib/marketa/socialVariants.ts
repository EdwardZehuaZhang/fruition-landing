/**
 * Per-channel social variant generators for Marketa social distribution.
 *
 * Generalizes the existing LinkedIn generator (marketaLinkedIn.ts) to the rest
 * of the Phase 1/2 channel set. Same transport (OpenRouter), same Fruition
 * voice rules, channel-specific structure + length caps. LinkedIn keeps using
 * the dedicated generateLinkedInPost() so the blog flow is untouched; this
 * module re-exports it as the `linkedin` channel for a single entry point.
 *
 * Each generator returns plain text ready to hand to Ayrshare. Media is NOT
 * sourced here (see the publish route / Phase 2 media step) — these produce the
 * text only, plus, for visual channels, the caption/description.
 */

import { generateLinkedInPost } from "@/lib/marketa/marketaLinkedIn"
import type { SocialChannel } from "@/lib/marketa/ayrshare"

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const DEFAULT_MODEL =
  process.env.MARKETA_SOCIAL_MODEL ?? "anthropic/claude-haiku-4.5"

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error("OPENROUTER_API_KEY missing in production env (Vercel)")
  return key
}

// Shared Fruition voice rules — kept identical in spirit to marketaLinkedIn.ts
// so every channel sounds like the same brand.
const VOICE_RULES = [
  "Voice (Fruition):",
  "- Plain-spoken, confident, technical without academic.",
  "- Talk to a senior operator (COO, ops director).",
  "- Show, don't tell. Specific verbs over marketing adjectives.",
  "- No em dashes anywhere. Use commas, parens, or two short sentences.",
  "- Banned words: leverage, synergise, best-in-class, unlock potential, drive transformation, seamlessly, robust, dive into, in today's world, fast-paced, game-changer.",
  "- No 'I hope this helps' / 'let's dive in' AI-tells.",
  "- Output the post body only. No preamble, no 'Here's your post:' framing.",
].join("\n")

// Per-channel system prompts. The {{LINK_RULE}} token is swapped for a link
// instruction depending on whether a published blog URL is available.
const CHANNEL_PROMPTS: Record<Exclude<SocialChannel, "linkedin">, string> = {
  x: [
    "You are Marketa, Fruition's marketing agent, writing a single X (Twitter) post promoting a piece of content.",
    "",
    "Goal: one punchy post under 280 characters that earns the click.",
    "Structure: a specific hook (no generic openers), one concrete takeaway, a soft CTA. {{LINK_RULE}}",
    "Use at most 2 lowercase hashtags. No threads, no numbering.",
    "",
    VOICE_RULES,
  ].join("\n"),
  instagram: [
    "You are Marketa, Fruition's marketing agent, writing an Instagram caption promoting a piece of content.",
    "",
    "Goal: a caption that stops the scroll and explains the value in plain terms.",
    "Structure:",
    "1. One-line hook.",
    "2. 2-4 short lines of concrete value (blank line between each for readability).",
    "3. A soft CTA. {{LINK_RULE}}",
    "4. A final line of 5-10 lowercase hashtags relevant to monday.com / ops / automation.",
    "",
    VOICE_RULES,
  ].join("\n"),
  youtube: [
    "You are Marketa, Fruition's marketing agent, writing the TITLE and DESCRIPTION for a YouTube video repurposed from a piece of content.",
    "",
    "Output exactly two sections separated by a line containing only '---':",
    "First line: a YouTube title under 100 characters (specific, no clickbait, no ALL CAPS).",
    "Then '---' on its own line.",
    "Then a 100-200 word description: what the video covers in 2-3 sentences, a short bulleted list (use '- ') of what the viewer learns, then a soft CTA. {{LINK_RULE}}",
    "End the description with 3-5 lowercase hashtags.",
    "",
    VOICE_RULES,
  ].join("\n"),
  pinterest: [
    "You are Marketa, Fruition's marketing agent, writing a Pinterest pin promoting a piece of content.",
    "",
    "Output exactly two sections separated by a line containing only '---':",
    "First line: a pin title under 100 characters (keyword-aware, descriptive).",
    "Then '---' on its own line.",
    "Then a pin description of 2-4 sentences describing the value, ending with 3-5 lowercase hashtags. {{LINK_RULE}}",
    "",
    VOICE_RULES,
  ].join("\n"),
}

export interface GenerateVariantInput {
  channel: SocialChannel
  title: string
  /** The source blog draft / article body (used as grounding). */
  draft: string
  industry?: string
  targetKeyword?: string
  /** Published blog URL, if the source blog is live. Enables the blog-link CTA. */
  blogUrl?: string
}

export interface GeneratedVariant {
  channel: SocialChannel
  /** Body text to send to Ayrshare as `post`. */
  text: string
  /** YouTube/Pinterest carry a separate title field for Ayrshare options. */
  title?: string
}

const MAX_DRAFT_CHARS = 5000

function linkRule(blogUrl?: string): string {
  return blogUrl
    ? `Include this URL once, on its own line, as the destination: ${blogUrl}`
    : "Do NOT include a URL — the human adds the link at approval time."
}

/**
 * Generate one channel's variant. LinkedIn delegates to the existing dedicated
 * generator (which already omits the URL by design — the human pastes it). All
 * other channels use the channel-specific prompt here.
 */
export async function generateVariant(
  input: GenerateVariantInput,
): Promise<GeneratedVariant> {
  const { channel, title, draft } = input
  if (!title?.trim()) throw new Error("generateVariant: title required")
  if (!draft?.trim()) throw new Error("generateVariant: draft required")

  if (channel === "linkedin") {
    const text = await generateLinkedInPost({
      title,
      draft,
      industry: input.industry,
      targetKeyword: input.targetKeyword,
    })
    return { channel, text }
  }

  const draftForPrompt =
    draft.length > MAX_DRAFT_CHARS
      ? `${draft.slice(0, MAX_DRAFT_CHARS)}\n\n[...draft truncated for length; summarise from the above...]`
      : draft

  const system = CHANNEL_PROMPTS[channel].replace("{{LINK_RULE}}", linkRule(input.blogUrl))
  const userPrompt = [
    `Content title: ${title}`,
    input.industry ? `Industry: ${input.industry}` : "",
    input.targetKeyword ? `Target keyword (tone only, do not stuff): ${input.targetKeyword}` : "",
    "",
    "Source draft below (may be truncated). Write the post.",
    "",
    "---",
    draftForPrompt,
    "---",
  ]
    .filter(Boolean)
    .join("\n")

  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://fruitionservices.io",
      "X-Title": `Marketa Social ${channel}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: 600,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
    }),
  })

  const text = await r.text()
  if (!r.ok) {
    throw new Error(
      `OpenRouter (${DEFAULT_MODEL}) ${channel} request failed ${r.status}: ${text.slice(0, 300)}`,
    )
  }
  interface OpenRouterResponse {
    choices?: Array<{ message?: { content?: string | null } }>
    error?: { message?: string }
  }
  let parsed: OpenRouterResponse
  try {
    parsed = JSON.parse(text) as OpenRouterResponse
  } catch {
    throw new Error(`OpenRouter returned non-JSON ${r.status}: ${text.slice(0, 200)}`)
  }
  if (parsed.error) {
    throw new Error(`OpenRouter ${channel} error: ${parsed.error.message ?? "unknown"}`)
  }
  const content = parsed.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error(`OpenRouter ${channel} returned empty content`)

  // YouTube + Pinterest return "title --- body"; split into title + text.
  if (channel === "youtube" || channel === "pinterest") {
    const [rawTitle, ...rest] = content.split(/\n-{3,}\n/)
    if (rest.length) {
      return {
        channel,
        title: rawTitle.trim().slice(0, 100),
        text: rest.join("\n---\n").trim(),
      }
    }
    // Model didn't use the separator — fall back to first line as title.
    const lines = content.split("\n")
    return {
      channel,
      title: lines[0].trim().slice(0, 100),
      text: lines.slice(1).join("\n").trim() || content,
    }
  }

  return { channel, text: content }
}

/** Generate all requested channels in parallel, isolating per-channel failures. */
export async function generateVariants(
  channels: SocialChannel[],
  base: Omit<GenerateVariantInput, "channel">,
): Promise<Array<{ channel: SocialChannel; variant?: GeneratedVariant; error?: string }>> {
  return Promise.all(
    channels.map(async (channel) => {
      try {
        const variant = await generateVariant({ ...base, channel })
        return { channel, variant }
      } catch (err) {
        return { channel, error: err instanceof Error ? err.message : String(err) }
      }
    }),
  )
}
