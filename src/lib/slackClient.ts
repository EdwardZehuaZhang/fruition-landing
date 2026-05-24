const SLACK_API = "https://slack.com/api"

function getToken(): string {
  const t = process.env.SLACK_BOT_TOKEN
  if (!t) throw new Error("SLACK_BOT_TOKEN missing")
  return t
}

export type SlackBlock = Record<string, unknown>

export interface PostOptions {
  unfurlLinks?: boolean
  unfurlMedia?: boolean
  threadTs?: string
}

export async function postSlackMessage(
  channel: string,
  blocks: SlackBlock[],
  text: string,
  opts: PostOptions = {},
): Promise<void> {
  const body: Record<string, unknown> = { channel, blocks, text }
  if (opts.unfurlLinks !== undefined) body.unfurl_links = opts.unfurlLinks
  if (opts.unfurlMedia !== undefined) body.unfurl_media = opts.unfurlMedia
  if (opts.threadTs) body.thread_ts = opts.threadTs
  const r = await fetch(`${SLACK_API}/chat.postMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  })
  const j = (await r.json()) as { ok?: boolean; error?: string }
  if (!j.ok) {
    throw new Error(`slack chat.postMessage failed: ${j.error ?? "unknown"}`)
  }
}

export async function postSlackText(
  channel: string,
  text: string,
  opts: PostOptions = {},
): Promise<void> {
  const body: Record<string, unknown> = { channel, text }
  if (opts.unfurlLinks !== undefined) body.unfurl_links = opts.unfurlLinks
  if (opts.unfurlMedia !== undefined) body.unfurl_media = opts.unfurlMedia
  if (opts.threadTs) body.thread_ts = opts.threadTs
  const r = await fetch(`${SLACK_API}/chat.postMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  })
  const j = (await r.json()) as { ok?: boolean; error?: string }
  if (!j.ok) {
    throw new Error(`slack chat.postMessage failed: ${j.error ?? "unknown"}`)
  }
}

export interface SlackThreadMessage {
  user?: string
  text?: string
  ts?: string
  bot_id?: string
  subtype?: string
}

export async function getSlackThreadReplies(
  channel: string,
  threadTs: string,
  limit = 30,
): Promise<SlackThreadMessage[]> {
  const params = new URLSearchParams({
    channel,
    ts: threadTs,
    limit: String(limit),
  })
  const r = await fetch(`${SLACK_API}/conversations.replies?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const j = (await r.json()) as {
    ok?: boolean
    error?: string
    messages?: SlackThreadMessage[]
  }
  if (!j.ok) {
    throw new Error(`slack conversations.replies failed: ${j.error ?? "unknown"}`)
  }
  return j.messages ?? []
}

export interface SlackChannelMessage {
  user?: string
  text?: string
  ts?: string
  thread_ts?: string
  bot_id?: string
  subtype?: string
}

export async function getRecentChannelMessages(
  channelId: string,
  limit = 30,
): Promise<SlackChannelMessage[]> {
  const params = new URLSearchParams({
    channel: channelId,
    limit: String(Math.min(Math.max(limit, 1), 100)),
  })
  const r = await fetch(`${SLACK_API}/conversations.history?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const j = (await r.json()) as {
    ok?: boolean
    error?: string
    messages?: SlackChannelMessage[]
  }
  if (!j.ok) {
    throw new Error(`slack conversations.history failed: ${j.error ?? "unknown"}`)
  }
  return j.messages ?? []
}

export async function lookupSlackUserName(userId: string): Promise<string | undefined> {
  const params = new URLSearchParams({ user: userId })
  const r = await fetch(`${SLACK_API}/users.info?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const j = (await r.json()) as {
    ok?: boolean
    error?: string
    user?: {
      real_name?: string
      profile?: { display_name?: string; real_name?: string }
    }
  }
  if (!j.ok || !j.user) return undefined
  const profile = j.user.profile
  return (
    profile?.display_name?.trim() ||
    profile?.real_name?.trim() ||
    j.user.real_name?.trim() ||
    undefined
  )
}
