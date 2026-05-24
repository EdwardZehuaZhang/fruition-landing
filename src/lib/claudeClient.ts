// The slack-blog mention bot routes through OpenRouter rather than the
// Anthropic SDK directly, so we can swap models (or providers) without
// touching code and so billing rolls up under one OpenRouter account.
// The Marketa harness in scripts/marketa-harness/ still uses the Anthropic
// SDK directly because it runs from a laptop with a personal key.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const DEFAULT_MODEL = process.env.CLAUDE_BOT_MODEL ?? "anthropic/claude-haiku-4.5"
const MAX_TOOL_ITERATIONS = 5

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error("OPENROUTER_API_KEY missing in production env (Vercel)")
  return key
}

export interface ChatTurn {
  role: "user" | "assistant"
  content: string
}

// OpenAI function-tool spec. OpenRouter accepts the OpenAI shape verbatim.
export interface ToolSpec {
  type: "function"
  function: {
    name: string
    description: string
    parameters: Record<string, unknown> // JSON Schema
  }
}

export type ToolExecutor = (name: string, args: Record<string, unknown>) => Promise<string>

interface OpenRouterToolCall {
  id: string
  type: "function"
  function: { name: string; arguments: string }
}

interface OpenRouterAssistantMessage {
  role: "assistant"
  content: string | null
  tool_calls?: OpenRouterToolCall[]
}

interface OpenRouterChoice {
  message?: OpenRouterAssistantMessage
  finish_reason?: string
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[]
  error?: { message?: string; type?: string; code?: string | number }
}

// OpenRouter accepts standard OpenAI chat-completions message shapes,
// including the role: 'tool' messages we need to feed back tool results.
type OpenRouterMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: OpenRouterToolCall[] }
  | { role: "tool"; content: string; tool_call_id: string }

async function callOpenRouter(messages: OpenRouterMessage[], opts: {
  maxTokens: number
  tools?: ToolSpec[]
}): Promise<OpenRouterAssistantMessage> {
  const apiKey = getApiKey()
  const body: Record<string, unknown> = {
    model: DEFAULT_MODEL,
    max_tokens: opts.maxTokens,
    messages,
  }
  if (opts.tools && opts.tools.length > 0) body.tools = opts.tools

  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://fruitionservices.io",
      "X-Title": "Fruition Bot",
    },
    body: JSON.stringify(body),
  })

  const text = await r.text()
  let parsed: OpenRouterResponse
  try {
    parsed = JSON.parse(text) as OpenRouterResponse
  } catch {
    throw new Error(`OpenRouter returned non-JSON ${r.status}: ${text.slice(0, 200)}`)
  }

  if (!r.ok || parsed.error) {
    const detail = parsed.error?.message || `HTTP ${r.status}: ${text.slice(0, 200)}`
    throw new Error(`OpenRouter (${DEFAULT_MODEL}) request failed: ${detail}`)
  }

  const msg = parsed.choices?.[0]?.message
  if (!msg) throw new Error("OpenRouter returned no assistant message")
  return msg
}

export async function generateBotReply(opts: {
  systemPrompt: string
  messages: ChatTurn[]
  maxTokens?: number
  tools?: ToolSpec[]
  executor?: ToolExecutor
}): Promise<string> {
  if (opts.messages.length === 0) return ""

  const maxTokens = opts.maxTokens ?? 600
  const conversation: OpenRouterMessage[] = [
    { role: "system", content: opts.systemPrompt },
    ...opts.messages.map(
      (m): OpenRouterMessage => ({ role: m.role, content: m.content }),
    ),
  ]

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const assistant = await callOpenRouter(conversation, { maxTokens, tools: opts.tools })

    // If there are no tool calls, we're done.
    if (!assistant.tool_calls || assistant.tool_calls.length === 0) {
      return (assistant.content ?? "").trim()
    }

    // Otherwise, we need to execute the tools and continue the loop.
    if (!opts.executor) {
      console.warn("[claudeClient] model requested tool calls but no executor was provided")
      return (assistant.content ?? "").trim()
    }

    // Append the assistant message (with tool_calls) so the next turn can
    // reference the call IDs.
    conversation.push({
      role: "assistant",
      content: assistant.content ?? "",
      tool_calls: assistant.tool_calls,
    })

    for (const call of assistant.tool_calls) {
      let args: Record<string, unknown> = {}
      try {
        args = call.function.arguments ? (JSON.parse(call.function.arguments) as Record<string, unknown>) : {}
      } catch (parseErr) {
        const detail = parseErr instanceof Error ? parseErr.message : String(parseErr)
        conversation.push({
          role: "tool",
          tool_call_id: call.id,
          content: `Tool argument JSON parse error: ${detail}. Arguments received: ${call.function.arguments.slice(0, 200)}`,
        })
        continue
      }

      let result: string
      try {
        result = await opts.executor(call.function.name, args)
      } catch (execErr) {
        const detail = execErr instanceof Error ? execErr.message : String(execErr)
        result = `Tool error: ${detail}`
      }

      conversation.push({
        role: "tool",
        tool_call_id: call.id,
        content: result,
      })
    }
  }

  // Hit the iteration cap without a final answer — return whatever the last
  // assistant content was, or a neutral message.
  console.warn(`[claudeClient] hit MAX_TOOL_ITERATIONS=${MAX_TOOL_ITERATIONS} without final answer`)
  return "I tried a few tools but couldn't pull together a clean answer. Mind narrowing the question?"
}
