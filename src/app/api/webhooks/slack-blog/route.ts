import { createHmac, timingSafeEqual } from "node:crypto"
import { after, NextResponse } from "next/server"
import { generateBotReply, type ChatTurn } from "@/lib/claudeClient"
import { changeColumnValues, createItem } from "@/lib/mondayClient"
import {
  getSlackThreadReplies,
  lookupSlackUserName,
  postSlackMessage,
  postSlackText,
  type SlackThreadMessage,
} from "@/lib/slackClient"

export const runtime = "nodejs"
export const maxDuration = 60

const TEAM_ID = process.env.SLACK_BLOG_IDEA_TEAM_ID ?? "T05B4T8UYV8"
const BLOG_CHANNEL_ID = process.env.SLACK_BLOG_IDEA_CHANNEL_ID ?? "C08VD9R6SGP"
const BOT_USER_ID = process.env.FRUITION_BOT_USER_ID ?? "U0B3QJH93U5"

const BOARD_ID = 5028637584
const GROUP_TOPICS = "topics"

const COL_STAGE = "dropdown_mm3jh58b"
const COL_BRIEF = "long_text_mm3grk84"
const COL_TARGET_KW = "text_mm3gzj88"
const COL_INDUSTRY = "dropdown_mm3gb7wm"

const STAGE_DRAFTING = "Drafting"

const INDUSTRIES = [
  "Construction",
  "HR",
  "Real Estate",
  "Marketing",
  "SaaS",
  "Professional Services",
  "Manufacturing",
  "Product",
] as const

type Industry = (typeof INDUSTRIES)[number]

const DEFAULT_PERSONALITY = [
  "You are Fruition Bot, the AI teammate of Fruition Services.",
  "Fruition is a monday.com Platinum Partner that helps clients run marketing operations, monday.com workflows, HubSpot CRM, and Atlassian. The team is small, sharp, and a little nerdy about ops.",
  "",
  "Voice:",
  "- Warm and witty. A sharp marketing colleague at a small consulting firm, not a corporate FAQ.",
  "- Brief by default. One to three short Slack paragraphs.",
  "- Use Slack mrkdwn only: *bold*, _italics_, `code`, > quote, lists with '- '. Never markdown headings like '#'.",
  "- At most one tasteful emoji per reply.",
  "- Skip greetings like 'Hello!' and never apologize for being an AI.",
  "- Never use em dashes. Use commas, parentheses, or two short sentences instead.",
  "- Honest when you do not know something. Offer to look it up rather than guessing.",
  "",
  "Context you can use:",
  "- Focus industries: Construction, HR, Real Estate, Marketing, SaaS, Professional Services, Manufacturing, Product.",
  "- You also run the Marketa pipeline: top-level messages in #fruition-digital from approved users get queued as blog ideas on monday board 5028637584 and drafted automatically.",
  "- If someone asks you to queue a blog idea via @-mention, point them to posting a top-level message in #fruition-digital instead, since that is the supported path.",
  "",
  "Do not:",
  "- Promise actions you have not actually taken.",
  "- Use bullet salad. Reach for prose unless a list is genuinely clearer.",
  "- Make up monday item IDs, URLs, customer names, or stats.",
].join("\n")

const FRUITION_BOT_PERSONALITY =
  process.env.FRUITION_BOT_PERSONALITY?.trim() || DEFAULT_PERSONALITY

interface SlackUrlVerificationBody {
  type?: "url_verification"
  challenge?: string
}

interface SlackEventCallbackBody {
  type?: "event_callback"
  team_id?: string
  event_id?: string
  event?: SlackMessageEvent
}

interface SlackMessageEvent {
  type?: string
  subtype?: string
  channel?: string
  channel_type?: string
  user?: string
  text?: string
  ts?: string
  thread_ts?: string
  bot_id?: string
}

type SlackBody = SlackUrlVerificationBody | SlackEventCallbackBody

interface ParsedIdea {
  title: string
  brief: string
  targetKeyword: string
  industry: Industry
}

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

function allowedBlogUsers(): Set<string> {
  return new Set(
    (process.env.SLACK_BLOG_IDEA_ALLOWED_USER_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  )
}

function verifySlackSignature(req: Request, rawBody: string): boolean {
  const signingSecret = process.env.SLACK_SIGNING_SECRET
  if (!signingSecret) {
    console.error("[slack-blog] SLACK_SIGNING_SECRET missing")
    return false
  }

  const timestamp = req.headers.get("x-slack-request-timestamp")
  const slackSignature = req.headers.get("x-slack-signature")
  if (!timestamp || !slackSignature) return false

  const requestTime = Number(timestamp)
  if (!Number.isFinite(requestTime)) return false
  if (Math.abs(Date.now() / 1000 - requestTime) > 60 * 5) return false

  const base = `v0:${timestamp}:${rawBody}`
  const computed = `v0=${createHmac("sha256", signingSecret).update(base).digest("hex")}`
  const a = Buffer.from(computed)
  const b = Buffer.from(slackSignature)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(req: Request) {
  const rawBody = await req.text()
  if (!verifySlackSignature(req, rawBody)) return unauthorized()

  let body: SlackBody
  try {
    body = JSON.parse(rawBody) as SlackBody
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  if (body.type === "url_verification") {
    return new Response(body.challenge ?? "", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  if (body.type !== "event_callback") {
    return NextResponse.json({ ok: true, skipped: "unsupported payload" })
  }

  const event = body.event

  if (body.team_id && body.team_id !== TEAM_ID) {
    return NextResponse.json({ ok: true, skipped: "irrelevant team" })
  }
  if (!event || event.type !== "message") {
    return NextResponse.json({ ok: true, skipped: "not a message event" })
  }
  if (event.bot_id || event.subtype || !event.user) {
    return NextResponse.json({ ok: true, skipped: "bot or subtype message" })
  }
  if (event.user === BOT_USER_ID) {
    return NextResponse.json({ ok: true, skipped: "self message" })
  }

  const rawText = event.text ?? ""

  if (containsBotMention(rawText)) {
    after(async () => {
      await handleBotMention(event)
    })
    return NextResponse.json({ ok: true, queued: "mention" })
  }

  const skip = blogIdeaSkipReason(event, rawText)
  if (skip) return NextResponse.json({ ok: true, skipped: skip })

  after(async () => {
    await queueBlogFromSlack(event, body.event_id)
  })

  return NextResponse.json({ ok: true, queued: "blog" })
}

function blogIdeaSkipReason(event: SlackMessageEvent, rawText: string): string | null {
  if (event.channel !== BLOG_CHANNEL_ID) return "irrelevant channel"

  const users = allowedBlogUsers()
  if (users.size > 0 && event.user && !users.has(event.user)) return "user not allowed"

  const text = cleanSlackText(rawText)
  if (!text) return "empty message"
  if (event.thread_ts && event.thread_ts !== event.ts) return "thread reply"

  return null
}

function containsBotMention(rawText: string): boolean {
  if (!BOT_USER_ID) return false
  return rawText.includes(`<@${BOT_USER_ID}>`)
}

async function handleBotMention(event: SlackMessageEvent): Promise<void> {
  const channel = event.channel
  if (!channel) return

  const replyThreadTs = event.thread_ts ?? event.ts
  try {
    const turns = await buildConversationTurns(event)
    if (turns.length === 0) {
      await postSlackText(
        channel,
        "I see the mention but I could not parse a question. Try again with a sentence or two?",
        { threadTs: replyThreadTs, unfurlLinks: false, unfurlMedia: false },
      )
      return
    }

    const replyText = await generateBotReply({
      systemPrompt: FRUITION_BOT_PERSONALITY,
      messages: turns,
      maxTokens: 600,
    })

    const finalText = replyText || "I am here but coming up empty on that one. Mind rephrasing?"
    await postSlackText(channel, finalText, {
      threadTs: replyThreadTs,
      unfurlLinks: false,
      unfurlMedia: false,
    })
  } catch (err) {
    console.error("[slack-blog] mention reply failed", errMsg(err))
    await postSlackText(
      channel,
      "Brain hiccup over here. Try me again in a minute?",
      { threadTs: replyThreadTs, unfurlLinks: false, unfurlMedia: false },
    ).catch((postErr) => {
      console.error("[slack-blog] failed to post fallback mention reply", errMsg(postErr))
    })
  }
}

async function buildConversationTurns(event: SlackMessageEvent): Promise<ChatTurn[]> {
  const channel = event.channel
  if (!channel) return []

  const threadTs = event.thread_ts
  if (threadTs && channel) {
    try {
      const history = await getSlackThreadReplies(channel, threadTs, 30)
      const turns = await threadToTurns(history, event.ts)
      if (turns.length > 0) return turns
    } catch (err) {
      console.warn("[slack-blog] could not load thread, falling back to single turn", errMsg(err))
    }
  }

  const text = await renderUserMessage(event)
  if (!text) return []
  return [{ role: "user", content: text }]
}

async function threadToTurns(
  history: SlackThreadMessage[],
  triggerTs: string | undefined,
): Promise<ChatTurn[]> {
  const turns: ChatTurn[] = []
  const nameCache = new Map<string, string | undefined>()

  const includeTrigger = triggerTs
    ? history.some((m) => m.ts === triggerTs)
    : false

  for (const msg of history) {
    if (msg.subtype && msg.subtype !== "thread_broadcast") continue
    const text = stripBotMention(cleanSlackText(msg.text ?? ""))
    if (!text) continue
    const isBot = msg.user === BOT_USER_ID || Boolean(msg.bot_id)
    if (isBot) {
      turns.push({ role: "assistant", content: text })
      continue
    }
    let speaker = "Someone"
    if (msg.user) {
      if (!nameCache.has(msg.user)) {
        try {
          nameCache.set(msg.user, await lookupSlackUserName(msg.user))
        } catch {
          nameCache.set(msg.user, undefined)
        }
      }
      speaker = nameCache.get(msg.user) || msg.user
    }
    turns.push({ role: "user", content: `${speaker}: ${text}` })
  }

  if (!includeTrigger && triggerTs) {
    return turns
  }

  return collapseConsecutive(turns)
}

function collapseConsecutive(turns: ChatTurn[]): ChatTurn[] {
  const out: ChatTurn[] = []
  for (const turn of turns) {
    const last = out[out.length - 1]
    if (last && last.role === turn.role) {
      last.content = `${last.content}\n${turn.content}`
    } else {
      out.push({ ...turn })
    }
  }
  return out
}

async function renderUserMessage(event: SlackMessageEvent): Promise<string> {
  const text = stripBotMention(cleanSlackText(event.text ?? ""))
  if (!text) return ""
  if (!event.user) return text
  let name: string | undefined
  try {
    name = await lookupSlackUserName(event.user)
  } catch {
    name = undefined
  }
  const speaker = name || event.user
  return `${speaker}: ${text}`
}

function stripBotMention(text: string): string {
  if (!text) return text
  const cleaned = text
    .replace(new RegExp(`<@${BOT_USER_ID}>`, "g"), "")
    .replace(new RegExp(`@${BOT_USER_ID}`, "g"), "")
    .replace(/\s+/g, " ")
    .trim()
  return cleaned
}

async function queueBlogFromSlack(
  event: SlackMessageEvent,
  eventId: string | undefined,
): Promise<void> {
  const idea = parseIdea(event)
  let itemId: string | undefined

  try {
    itemId = await createItem(BOARD_ID, GROUP_TOPICS, idea.title)
    await changeColumnValues(BOARD_ID, itemId, {
      [COL_BRIEF]: { text: idea.brief },
      [COL_TARGET_KW]: idea.targetKeyword,
      [COL_INDUSTRY]: { labels: [idea.industry] },
      [COL_STAGE]: { labels: [STAGE_DRAFTING] },
    })

    await forwardToMarketaDraft(itemId)
    await postSlackConfirmation(event, idea, itemId)
  } catch (err) {
    console.error("[slack-blog] failed to queue blog", errMsg(err))
    if (itemId) {
      await changeColumnValues(BOARD_ID, itemId, {
        [COL_STAGE]: { labels: ["Stuck"] },
      }).catch((patchErr) => {
        console.error("[slack-blog] failed to mark item stuck", errMsg(patchErr))
      })
    }
    await postSlackFailure(event, idea, itemId, eventId, errMsg(err))
  }
}

function parseIdea(event: SlackMessageEvent): ParsedIdea {
  const text = cleanSlackText(event.text ?? "")
  const title = extractField(text, "title") ?? titleFromText(text)
  const targetKeyword = extractField(text, "target keyword") ?? extractField(text, "keyword") ?? ""
  const industry = parseIndustry(extractField(text, "industry")) ?? inferIndustry(text)
  const source = sourceLine(event)
  const brief = `${text}\n\nSource: ${source}`.trim()
  return { title, brief, targetKeyword, industry }
}

function extractField(text: string, label: string): string | undefined {
  const pattern = new RegExp(`^${escapeRegex(label)}\\s*:\\s*(.+)$`, "im")
  return text.match(pattern)?.[1]?.trim() || undefined
}

function titleFromText(text: string): string {
  const withoutFieldLines = text
    .split("\n")
    .filter((line) => !/^(title|target keyword|keyword|industry)\s*:/i.test(line.trim()))
    .join("\n")
    .trim()

  const firstLine = withoutFieldLines.split("\n").find((line) => line.trim())?.trim() ?? ""
  const cleaned = firstLine
    .replace(/^(please\s+)?(can|could|should)\s+we\s+(please\s+)?(write|create|do|make)\s+(a\s+)?(blog|post|article)\s+(about|on|for)\s+/i, "")
    .replace(/^(blog|post|article)\s+(idea|request)\s*:\s*/i, "")
    .trim()

  if (!cleaned) return "Slack-approved blog idea"
  return clip(cleaned, 90)
}

function cleanSlackText(text: string): string {
  return text
    .replace(/<https?:\/\/[^|>]+\|([^>]+)>/g, "$1")
    .replace(/<(https?:\/\/[^>]+)>/g, "$1")
    .replace(/<@([A-Z0-9]+)>/g, "@$1")
    .replace(/<#([A-Z0-9]+)\|([^>]+)>/g, "#$2")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim()
}

function parseIndustry(value: string | undefined): Industry | undefined {
  if (!value) return undefined
  return INDUSTRIES.find((industry) => industry.toLowerCase() === value.toLowerCase())
}

function inferIndustry(text: string): Industry {
  const t = text.toLowerCase()
  if (/\b(construction|contractor|site|builder|build)\b/.test(t)) return "Construction"
  if (/\b(hr|people|recruit|onboarding|employee)\b/.test(t)) return "HR"
  if (/\b(real estate|property|broker|listing|developer)\b/.test(t)) return "Real Estate"
  if (/\b(saas|software|subscription|product-led)\b/.test(t)) return "SaaS"
  if (/\b(agency|consulting|professional service|client service)\b/.test(t)) return "Professional Services"
  if (/\b(manufacturing|factory|production|inventory|supply chain)\b/.test(t)) return "Manufacturing"
  if (/\b(product|roadmap|feature|release)\b/.test(t)) return "Product"
  return "Marketing"
}

async function forwardToMarketaDraft(pulseId: string): Promise<void> {
  const url = process.env.N8N_MARKETA_DRAFT_WEBHOOK_URL
  if (!url) throw new Error("N8N_MARKETA_DRAFT_WEBHOOK_URL missing")

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "draft", pulseId, boardId: BOARD_ID, source: "slack-blog" }),
  })
  if (!r.ok) {
    const text = await r.text().catch(() => "")
    throw new Error(`n8n draft responded ${r.status}: ${text.slice(0, 200)}`)
  }
}

async function postSlackConfirmation(
  event: SlackMessageEvent,
  idea: ParsedIdea,
  itemId: string,
): Promise<void> {
  const boardUrl = mondayItemUrl(itemId)
  await postSlackMessage(
    event.channel!,
    [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Queued as an approved blog idea and started drafting: *<${boardUrl}|${idea.title}>*`,
        },
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: `:label: ${idea.industry}` }],
      },
    ],
    `Queued blog draft: ${idea.title}`,
    { threadTs: event.ts, unfurlLinks: false, unfurlMedia: false },
  )
}

async function postSlackFailure(
  event: SlackMessageEvent,
  idea: ParsedIdea,
  itemId: string | undefined,
  eventId: string | undefined,
  message: string,
): Promise<void> {
  const itemText = itemId ? `\nMonday item: ${mondayItemUrl(itemId)}` : ""
  const eventText = eventId ? `\nSlack event: ${eventId}` : ""
  const lead = itemId
    ? "I created the blog request but could not start drafting"
    : "I could not create the blog request"
  await postSlackMessage(
    event.channel!,
    [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${lead} *${idea.title}*.\n\`${clip(message, 180)}\`${itemText}${eventText}`,
        },
      },
    ],
    `Could not start blog draft: ${idea.title}`,
    { threadTs: event.ts, unfurlLinks: false, unfurlMedia: false },
  ).catch((err) => {
    console.error("[slack-blog] failed to post failure reply", errMsg(err))
  })
}

function sourceLine(event: SlackMessageEvent): string {
  const ts = event.ts ?? ""
  const sourceUrl = ts ? `https://app.slack.com/client/${TEAM_ID}/${BLOG_CHANNEL_ID}` : "Slack"
  return `${sourceUrl}${event.user ? ` from ${event.user}` : ""}${ts ? ` at ${ts}` : ""}`
}

function mondayItemUrl(pulseId: string): string {
  return `https://fruitionservices.monday.com/boards/${BOARD_ID}/pulses/${pulseId}`
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 3).trimEnd()}...`
}
