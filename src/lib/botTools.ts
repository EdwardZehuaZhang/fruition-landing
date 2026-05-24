import { parse as parseHtml } from "node-html-parser"
import type { ToolExecutor, ToolSpec } from "@/lib/claudeClient"
import { listBoardItems } from "@/lib/mondayClient"
import { getRecentChannelMessages, lookupSlackUserName } from "@/lib/slackClient"

/**
 * SECURITY INVARIANT — READ ONLY.
 *
 * The slack-blog @-mention bot is read-only by design. The four tools below
 * are the entire surface. Do NOT add any tool that performs a write,
 * delete, modify, send, archive, move, or assign action without explicit
 * sign-off from Edward. The executor below uses a literal switch on tool
 * name, so any tool the LLM tries to call that is not in this file will
 * return "Unknown tool" and not execute.
 *
 * If a write tool is ever genuinely needed, it MUST be added behind an
 * additional confirmation gate (e.g. require an allowed-user check inside
 * the executor itself, like the blog idea queue path already does), and
 * the prompt's "I am read-only" rule must be relaxed in lockstep.
 */
const ALLOWED_TOOL_NAMES = [
  "find_monday_items",
  "read_channel_history",
  "fetch_url_content",
  "web_search",
] as const
type AllowedToolName = (typeof ALLOWED_TOOL_NAMES)[number]

function isAllowedToolName(name: string): name is AllowedToolName {
  return (ALLOWED_TOOL_NAMES as readonly string[]).includes(name)
}

const BLOG_BOARD_ID = 5028637584
const STAGE_COLUMN_ID = "dropdown_mm3jh58b"
const INDUSTRY_COLUMN_ID = "dropdown_mm3gb7wm"
const TARGET_KEYWORD_COLUMN_ID = "text_mm3gzj88"

const WEB_SEARCH_MODEL = process.env.BOT_WEB_SEARCH_MODEL ?? "perplexity/sonar"
const URL_FETCH_CHAR_LIMIT = 10000

/**
 * Tool specs handed to OpenRouter. Descriptions are written for the model,
 * not humans, so keep them concise + tactical + include hints about when
 * to use each.
 */
export const BOT_TOOLS: ToolSpec[] = [
  {
    type: "function",
    function: {
      name: "find_monday_items",
      description:
        "List items on a Fruition monday.com board. Use this when someone asks about blog ideas, drafts, the content queue, or anything stored on a known board. The blog topics board is board_id 5028637584 (group_id 'topics'). Returns up to 20 items by default with name, stage, industry, and a link.",
      parameters: {
        type: "object",
        properties: {
          board_id: {
            type: "number",
            description: "monday.com board ID. The blog topics board is 5028637584.",
          },
          group_id: {
            type: "string",
            description: "Optional group ID inside the board. For the blog board use 'topics'.",
          },
          stage: {
            type: "string",
            description:
              "Optional case-insensitive substring match against the Stage column. Examples: 'Drafting', 'Published', 'Idea approved', 'Stuck'.",
          },
          limit: {
            type: "number",
            description: "Max items to return. Default 20, hard cap 100.",
          },
        },
        required: ["board_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_channel_history",
      description:
        "Read recent messages from a Slack channel the bot is in. Use when someone asks 'what happened in #X', 'summarize today's #Y', or wants context from a different channel than the one they are mentioning the bot in. The bot must be a member of the channel; if not, this errors. Channel IDs start with C (public) or G (private).",
      parameters: {
        type: "object",
        properties: {
          channel_id: {
            type: "string",
            description:
              "Slack channel ID (C-prefixed for public, G-prefixed for private). Example: 'C08VD9R6SGP' for #fruition-digital.",
          },
          limit: {
            type: "number",
            description: "Max messages to return. Default 30, hard cap 100.",
          },
        },
        required: ["channel_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fetch_url_content",
      description:
        "Fetch a web page and return its readable text content. Use when the user pastes a URL and wants it summarized, or asks about a specific external article. Returns up to 10,000 characters of extracted body text.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "Fully-qualified URL including the https:// scheme.",
          },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "web_search",
      description:
        "Search the live web for current information. Use only when the answer depends on facts that change over time (current pricing, recent news, product releases) or facts the bot does not have in context. Returns a concise researched answer with source links. Do not use this for questions about Fruition itself, monday items, or channel content; use the other tools or your context instead.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query in plain English. Be specific.",
          },
        },
        required: ["query"],
      },
    },
  },
]

export const botToolExecutor: ToolExecutor = async (name, args) => {
  // Hard whitelist. If the model ever hallucinates a tool name (e.g.
  // "delete_monday_item"), this returns without executing. See the
  // SECURITY INVARIANT comment at the top of the file.
  if (!isAllowedToolName(name)) {
    console.warn(`[botTools] rejected non-whitelisted tool call: ${name}`)
    return `Tool '${name}' is not available. The bot only has read-only tools: ${ALLOWED_TOOL_NAMES.join(", ")}.`
  }
  try {
    switch (name) {
      case "find_monday_items":
        return await execFindMondayItems(args)
      case "read_channel_history":
        return await execReadChannelHistory(args)
      case "fetch_url_content":
        return await execFetchUrlContent(args)
      case "web_search":
        return await execWebSearch(args)
    }
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    console.error(`[botTools] ${name} failed`, err)
    return `Tool '${name}' failed: ${detail}`
  }
}

async function execFindMondayItems(args: Record<string, unknown>): Promise<string> {
  const boardId = Number(args.board_id ?? BLOG_BOARD_ID)
  if (!Number.isFinite(boardId) || boardId <= 0) {
    return "Invalid board_id."
  }
  const groupId = typeof args.group_id === "string" && args.group_id ? args.group_id : undefined
  const stage = typeof args.stage === "string" && args.stage ? args.stage : undefined
  const limit = typeof args.limit === "number" ? args.limit : 20

  const items = await listBoardItems(boardId, { groupId, limit })

  let filtered = items
  if (stage) {
    const want = stage.toLowerCase()
    filtered = items.filter((it) =>
      (it.columns[STAGE_COLUMN_ID]?.text ?? "").toLowerCase().includes(want),
    )
  }

  if (filtered.length === 0) {
    return `No items found on board ${boardId}${groupId ? ` in group ${groupId}` : ""}${stage ? ` at stage ~ '${stage}'` : ""}.`
  }

  const lines = filtered.map((it) => {
    const stageVal = it.columns[STAGE_COLUMN_ID]?.text ?? "?"
    const industry = it.columns[INDUSTRY_COLUMN_ID]?.text ?? ""
    const keyword = it.columns[TARGET_KEYWORD_COLUMN_ID]?.text ?? ""
    const meta = [
      `stage: ${stageVal}`,
      industry ? `industry: ${industry}` : "",
      keyword ? `kw: ${keyword}` : "",
    ]
      .filter(Boolean)
      .join(" | ")
    const url = `https://fruitionservices.monday.com/boards/${boardId}/pulses/${it.id}`
    return `- ${it.name} (${meta}) ${url}`
  })

  return `Found ${filtered.length} item${filtered.length === 1 ? "" : "s"}:\n${lines.join("\n")}`
}

async function execReadChannelHistory(args: Record<string, unknown>): Promise<string> {
  const channelId = String(args.channel_id ?? "").trim()
  if (!channelId || !/^[CG][A-Z0-9]+$/.test(channelId)) {
    return "channel_id must be a Slack channel ID like 'C08VD9R6SGP'."
  }
  const limit = typeof args.limit === "number" ? args.limit : 30

  const messages = await getRecentChannelMessages(channelId, limit)
  if (messages.length === 0) {
    return "No messages found. The bot may not be a member of this channel."
  }

  // Resolve user IDs to names where we can, in parallel, with a small cap.
  const userIds = Array.from(
    new Set(messages.map((m) => m.user).filter((u): u is string => Boolean(u))),
  ).slice(0, 25)
  const nameMap = new Map<string, string | undefined>()
  await Promise.all(
    userIds.map(async (id) => {
      try {
        nameMap.set(id, await lookupSlackUserName(id))
      } catch {
        nameMap.set(id, undefined)
      }
    }),
  )

  const lines = messages.map((m) => {
    const speaker = m.user
      ? nameMap.get(m.user) || m.user
      : m.bot_id
        ? `bot:${m.bot_id}`
        : "?"
    const text = (m.text ?? "").replace(/\s+/g, " ").slice(0, 500)
    return `[${speaker}] ${text}`
  })

  return `Last ${messages.length} messages from ${channelId} (newest first):\n${lines.join("\n")}`
}

async function execFetchUrlContent(args: Record<string, unknown>): Promise<string> {
  const url = String(args.url ?? "").trim()
  if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url)) {
    return "url must be a fully-qualified http(s) URL."
  }

  let res: Response
  try {
    res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "FruitionBot/1.0 (+https://fruitionservices.io)" },
      redirect: "follow",
    })
  } catch (err) {
    return `Fetch failed: ${err instanceof Error ? err.message : String(err)}`
  }

  if (!res.ok) {
    return `Fetch failed: HTTP ${res.status} ${res.statusText}`
  }

  const contentType = res.headers.get("content-type") ?? ""
  const raw = await res.text()

  if (contentType.includes("html")) {
    try {
      const root = parseHtml(raw)
      root
        .querySelectorAll("script, style, nav, footer, header, noscript, aside, form")
        .forEach((n) => n.remove())
      const main =
        root.querySelector("main")?.text ||
        root.querySelector("article")?.text ||
        root.querySelector("body")?.text ||
        root.text
      const cleaned = (main ?? "").replace(/\s+/g, " ").trim()
      return cleaned.slice(0, URL_FETCH_CHAR_LIMIT)
    } catch {
      return raw.slice(0, URL_FETCH_CHAR_LIMIT)
    }
  }

  if (contentType.includes("json") || contentType.includes("text")) {
    return raw.slice(0, URL_FETCH_CHAR_LIMIT)
  }

  return `Unsupported content-type for text extraction: ${contentType || "unknown"}. Returned ${raw.length} bytes of raw content (not shown).`
}

async function execWebSearch(args: Record<string, unknown>): Promise<string> {
  const query = String(args.query ?? "").trim()
  if (!query) return "query is required."

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return "OPENROUTER_API_KEY missing in env; web search disabled."

  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://fruitionservices.io",
      "X-Title": "Fruition Bot",
    },
    body: JSON.stringify({
      model: WEB_SEARCH_MODEL,
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content:
            "You are a search tool. Give a concise factual answer (under 200 words). Include 1 to 3 source URLs at the end on their own lines, prefixed with 'Source: '. No fluff.",
        },
        { role: "user", content: query },
      ],
    }),
  })

  if (!r.ok) {
    const t = await r.text().catch(() => "")
    return `Web search failed: HTTP ${r.status}: ${t.slice(0, 200)}`
  }

  const j = (await r.json()) as { choices?: Array<{ message?: { content?: string } }> }
  return j.choices?.[0]?.message?.content?.trim() || "(no search result)"
}
