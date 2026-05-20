import Anthropic from "@anthropic-ai/sdk"

const MODEL = "claude-opus-4-7"

function getClient(): Anthropic {
  const key = process.env.CLAUDE_API_KEY
  if (!key) throw new Error("CLAUDE_API_KEY missing in env")
  return new Anthropic({ apiKey: key })
}

export interface Idea {
  title: string
  brief: string
  target_keyword: string
  industry: string
}

const VALID_INDUSTRIES = [
  "Construction",
  "HR",
  "Real Estate",
  "Marketing",
  "SaaS",
  "Professional Services",
  "Manufacturing",
  "Product",
] as const

export async function generateIdeas(recentContext: string, count = 5): Promise<Idea[]> {
  const client = getClient()
  const r = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: `You are Marketa, Fruition's marketing agent. Generate ${count} blog ideas. 80% industry-focused (workflows, pains, decision frameworks), 20% product (monday.com, HubSpot, Atlassian). AEO-first: each idea should be a query someone asks Google AI Overviews or ChatGPT. Avoid topics already covered in recent_context. Respond ONLY with a valid JSON array. No prose, no markdown fence.`,
    messages: [
      {
        role: "user",
        content: `Recent published topics to avoid duplicating:\n${recentContext || "(none)"}\n\nReturn a JSON array of ${count} items. Each item: {"title": string, "brief": string (2-3 sentence angle), "target_keyword": string, "industry": one of [${VALID_INDUSTRIES.map((i) => `"${i}"`).join(", ")}]}.`,
      },
    ],
  })
  const text = (r.content[0] as { type: string; text?: string }).text || "[]"
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "")
  const ideas = JSON.parse(cleaned) as Idea[]
  if (!Array.isArray(ideas)) throw new Error("Claude did not return an array")
  return ideas
}

export async function writeDraft(opts: {
  title: string
  brief: string
  targetKeyword: string
  industry: string
  voiceGuide: string
  retrievedContext?: string
}): Promise<string> {
  const client = getClient()
  const sourcesBlock = opts.retrievedContext
    ? `\n\nRetrieved sources to draw from and cite with [Source N] markers:\n${opts.retrievedContext}`
    : "\n\n(No retrieved sources — write from brief and general knowledge. Do not invent statistics or case studies.)"

  const r = await client.messages.create({
    model: MODEL,
    max_tokens: 6000,
    system: `You are Marketa, Fruition's marketing agent. Write AEO-optimised long-form blogs (1800-2500 words). Industry-focused over product-pitchy. Markdown format with H2/H3 headings, short paragraphs. No horizontal separators. No em-dash overuse. No AI-sounding boilerplate (no "in today's fast-paced world", no "let's dive in"). Follow the Fruition voice guide strictly.\n\nVOICE GUIDE:\n${opts.voiceGuide}`,
    messages: [
      {
        role: "user",
        content: `Title: ${opts.title}\n\nBrief: ${opts.brief}\n\nTarget keyword: ${opts.targetKeyword}\n\nIndustry: ${opts.industry}${sourcesBlock}\n\nWrite the full blog post now. Start with the H1 then body.`,
      },
    ],
  })
  return (r.content[0] as { type: string; text?: string }).text || ""
}

export async function reviseDraft(opts: {
  title: string
  draft: string
  notes: string
  voiceGuide: string
}): Promise<string> {
  const client = getClient()
  const r = await client.messages.create({
    model: MODEL,
    max_tokens: 6000,
    system: `You are Marketa revising a draft per reviewer feedback. Apply the requested changes precisely without rewriting unaffected sections. Preserve voice and structure. Follow voice guide.\n\nVOICE GUIDE:\n${opts.voiceGuide}`,
    messages: [
      {
        role: "user",
        content: `Title: ${opts.title}\n\nCurrent draft:\n${opts.draft}\n\nReviewer edit notes:\n${opts.notes}\n\nReturn the full revised draft in markdown. No preamble.`,
      },
    ],
  })
  return (r.content[0] as { type: string; text?: string }).text || ""
}
