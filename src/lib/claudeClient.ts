import Anthropic from "@anthropic-ai/sdk"

const MODEL = process.env.CLAUDE_BOT_MODEL ?? "claude-opus-4-7"

function getClient(): Anthropic {
  const key = process.env.CLAUDE_API_KEY
  if (!key) throw new Error("CLAUDE_API_KEY missing")
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
