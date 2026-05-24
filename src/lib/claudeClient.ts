// The slack-blog mention bot routes through OpenRouter rather than the
// Anthropic SDK directly, so we can swap models (or providers) without
// touching code and so billing rolls up under one OpenRouter account.
// The Marketa harness in scripts/marketa-harness/ still uses the Anthropic
// SDK directly because it runs from a laptop with a personal key.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const DEFAULT_MODEL = process.env.CLAUDE_BOT_MODEL ?? "anthropic/claude-haiku-4.5"

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error("OPENROUTER_API_KEY missing in production env (Vercel)")
  return key
}

export interface ChatTurn {
  role: "user" | "assistant"
  content: string
}

interface OpenRouterResponse {
  choices?: Array<{ message?: { content?: string }; finish_reason?: string }>
  error?: { message?: string; type?: string; code?: string | number }
}

export async function generateBotReply(opts: {
  systemPrompt: string
  messages: ChatTurn[]
  maxTokens?: number
}): Promise<string> {
  if (opts.messages.length === 0) return ""
  const apiKey = getApiKey()

  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // OpenRouter recommends these for analytics + their public leaderboard.
      "HTTP-Referer": "https://fruitionservices.io",
      "X-Title": "Fruition Bot",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: opts.maxTokens ?? 600,
      messages: [
        { role: "system", content: opts.systemPrompt },
        ...opts.messages,
      ],
    }),
  })

  const text = await r.text()
  let body: OpenRouterResponse
  try {
    body = JSON.parse(text) as OpenRouterResponse
  } catch {
    throw new Error(`OpenRouter returned non-JSON ${r.status}: ${text.slice(0, 200)}`)
  }

  if (!r.ok || body.error) {
    const detail = body.error?.message || `HTTP ${r.status}: ${text.slice(0, 200)}`
    throw new Error(`OpenRouter (${DEFAULT_MODEL}) request failed: ${detail}`)
  }

  const content = body.choices?.[0]?.message?.content
  return content?.trim() || ""
}
