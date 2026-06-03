const SLACK_API = "https://slack.com/api"

function getToken(): string {
  const t = process.env.SLACK_BOT_TOKEN
  if (!t) throw new Error("SLACK_BOT_TOKEN missing")
  return t
}

/**
 * Slack `search.messages` requires the `search:read` scope, which Slack only
 * grants to USER tokens (xoxp-...), not bot tokens (xoxb-...). To enable
 * cross-channel search the bot needs an additional user token created from
 * a low-privilege Slack user (recommended: the bot@fruitionservices.io
 * Google account, invited to the workspace as a regular member, scopes
 * limited to search:read). The token goes in env as SLACK_USER_TOKEN.
 * If not set, searchSlackMessages throws with an actionable message and the
 * search_slack tool reports the env var is missing.
 */
function getUserToken(): string {
  const t = process.env.SLACK_USER_TOKEN
  if (!t) {
    throw new Error(
      "SLACK_USER_TOKEN missing. Cross-channel search needs a Slack user token (xoxp-) with search:read scope. See docs/bot-permissions.md.",
    )
  }
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

export interface SlackSearchMatch {
  user?: string
  username?: string
  text?: string
  ts?: string
  channel?: { id?: string; name?: string }
  permalink?: string
}

export interface SlackSearchOptions {
  /** Optional Slack channel id (C...) or name (without #) to scope search. */
  channel?: string
  /** Lookback window in days. Translates to "after:YYYY-MM-DD" in the query. */
  daysBack?: number
  /** Max hits to return. Default 20, hard cap 50. */
  count?: number
  /** Sort order. "score" (relevance, default) or "timestamp" (newest first). */
  sort?: "score" | "timestamp"
}

/**
 * Search messages across all channels the SLACK_USER_TOKEN owner can see.
 * Uses Slack's search.messages API. Requires SLACK_USER_TOKEN env var to be
 * set with a user token bearing search:read scope. The user token's owner
 * acts as the visibility scope: they only see channels they are a member of
 * (public channels are searchable for any workspace member).
 */
export async function searchSlackMessages(
  query: string,
  opts: SlackSearchOptions = {},
): Promise<SlackSearchMatch[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const parts: string[] = [trimmed]
  if (opts.channel) {
    const ch = opts.channel.startsWith("#") ? opts.channel.slice(1) : opts.channel
    // search.messages accepts `in:#channel-name` and `in:<#CHANNELID>`.
    // We prefer the channel-id form when the input looks like an id.
    if (/^[CG][A-Z0-9]+$/.test(ch)) {
      parts.push(`in:<#${ch}>`)
    } else {
      parts.push(`in:#${ch}`)
    }
  }
  if (typeof opts.daysBack === "number" && opts.daysBack > 0) {
    const cutoff = new Date(Date.now() - opts.daysBack * 24 * 60 * 60 * 1000)
    const y = cutoff.getUTCFullYear()
    const m = String(cutoff.getUTCMonth() + 1).padStart(2, "0")
    const d = String(cutoff.getUTCDate()).padStart(2, "0")
    parts.push(`after:${y}-${m}-${d}`)
  }

  const count = Math.min(Math.max(opts.count ?? 20, 1), 50)
  const sort = opts.sort ?? "score"
  const params = new URLSearchParams({
    query: parts.join(" "),
    count: String(count),
    sort,
    sort_dir: "desc",
  })

  const r = await fetch(`${SLACK_API}/search.messages?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getUserToken()}` },
  })
  const j = (await r.json()) as {
    ok?: boolean
    error?: string
    messages?: { matches?: SlackSearchMatch[] }
  }
  if (!j.ok) {
    throw new Error(`slack search.messages failed: ${j.error ?? "unknown"}`)
  }
  return j.messages?.matches ?? []
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
