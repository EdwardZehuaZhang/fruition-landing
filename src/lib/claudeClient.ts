import Anthropic from "@anthropic-ai/sdk"

// claude-sonnet-4-6 is the right default for Slack chat: ~3x faster than
// Opus and ~5x cheaper, with quality more than fine for short conversational
// replies. The Marketa harness uses Opus because it's writing 2000-word
// drafts where quality > latency. Override via CLAUDE_BOT_MODEL env if you
// want to escalate a specific bot to Opus.
const MODEL = process.env.CLAUDE_BOT_MODEL ?? "claude-sonnet-4-6"

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
