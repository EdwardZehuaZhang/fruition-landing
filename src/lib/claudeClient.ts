import Anthropic from "@anthropic-ai/sdk"

// claude-haiku-4-5 is the default for Slack chat: cheapest tier, fastest
// time-to-first-token, and the response quality bar for one-to-three
// paragraph conversational replies is well within Haiku's reach. The
// Marketa harness stays on Opus because it's writing 2000-word drafts
// where quality > latency + cost. Set CLAUDE_BOT_MODEL to escalate.
const MODEL = process.env.CLAUDE_BOT_MODEL ?? "claude-haiku-4-5-20251001"

function getClient(): Anthropic {
  const key = process.env.CLAUDE_API_KEY
  if (!key) throw new Error("CLAUDE_API_KEY missing in production env (Vercel)")
  return new Anthropic({ apiKey: key })
}

export interface ChatTurn {
  role: "user" | "assistant"
  content: string
}

export async function generateBotReply(opts: {
  systemPrompt: string
  messages: ChatTurn[]
  maxTokens?: number
}): Promise<string> {
  if (opts.messages.length === 0) return ""
  const client = getClient()
  const r = await client.messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens ?? 600,
    system: opts.systemPrompt,
    messages: opts.messages,
  })
  const first = r.content[0]
  if (first && first.type === "text") return first.text.trim()
  return ""
}
