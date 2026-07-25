/**
 * Zernio social-posting integration for the Marketa blog pipeline.
 *
 * One Zernio DRAFT post is created PER PLATFORM (X, Google Business AU + SG,
 * Instagram, LinkedIn, Pinterest, Reddit — YouTube deliberately excluded) so
 * each platform's caption can be edited and published independently, either
 * from the Zernio dashboard or from the portal's social drafts panel
 * (/internal/blog/... on the website).
 *
 * Captions are generated per platform in a single OpenRouter call and clamped
 * to hard per-platform limits in code (Zernio's X counter is RAW characters,
 * so the X caption must fit 280 raw chars INCLUDING any URL).
 *
 * Each Zernio post carries `metadata` (marketaSlug / marketaDraftId /
 * marketaDocId / marketaPlatform) so the portal can find a blog's social posts
 * without any local persistence. Verified to round-trip on the live API.
 *
 * Activated only when ZERNIO_API_KEY is set; every call is best-effort in the
 * pipeline and must never break blog generation.
 *
 * API: https://docs.zernio.com — POST/PUT/GET https://zernio.com/api/v1/posts
 */

const ZERNIO_BASE = "https://zernio.com/api/v1"
const DASHBOARD_URL = process.env.ZERNIO_DASHBOARD_URL || "https://zernio.com/dashboard"
const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.fruitionservices.io").replace(/\/+$/, "")

/* ------------------------------------------------------------------ */
/*  Platform registry                                                  */
/* ------------------------------------------------------------------ */

/** Stable keys for every target platform (gbp has two locations). */
export type PlatformKey =
  | "twitter"
  | "gbp-au"
  | "gbp-sg"
  | "instagram"
  | "linkedin"
  | "pinterest"
  | "reddit"

export interface PlatformSpec {
  key: PlatformKey
  /** Zernio `platform` identifier. */
  platform: string
  /** Connected Zernio account id (overridable via env if reconnected). */
  accountId: string
  /** Human label for portal UI / logs. */
  label: string
  /** Hard character cap enforced on the caption body. */
  limit: number
  /** Platform refuses to publish without an image. */
  needsMedia: boolean
  /** Whether to attach blog images at all (Reddit stays a text post). */
  supportsMedia: boolean
  /** Which generated caption this platform uses (gbp-au + gbp-sg share one). */
  captionKey: "twitter" | "googlebusiness" | "instagram" | "linkedin" | "pinterest" | "reddit"
}

const PINTEREST_BOARD_ID = process.env.ZERNIO_PINTEREST_BOARD_ID || "1009369403924050337"
/** Optional subreddit override; empty = the account's default subreddit. */
const REDDIT_SUBREDDIT = process.env.ZERNIO_REDDIT_SUBREDDIT || ""

export const PLATFORMS: PlatformSpec[] = [
  {
    key: "twitter",
    platform: "twitter",
    accountId: process.env.ZERNIO_X_ACCOUNT_ID || "6a4f402e3ecd8aa344702cec",
    label: "X (Twitter)",
    limit: 280,
    needsMedia: false,
    supportsMedia: true,
    captionKey: "twitter",
  },
  {
    key: "gbp-au",
    platform: "googlebusiness",
    accountId: process.env.ZERNIO_GBP_AU_ACCOUNT_ID || "6a606dc7542d8bc5a6a2d3c7",
    label: "Google Business — Australia",
    limit: 1500,
    needsMedia: false,
    supportsMedia: true,
    captionKey: "googlebusiness",
  },
  {
    key: "gbp-sg",
    platform: "googlebusiness",
    accountId: process.env.ZERNIO_GBP_ACCOUNT_ID || "6a4f41573ecd8aa3447039c0",
    label: "Google Business — Singapore",
    limit: 1500,
    needsMedia: false,
    supportsMedia: true,
    captionKey: "googlebusiness",
  },
  {
    key: "instagram",
    platform: "instagram",
    accountId: process.env.ZERNIO_INSTAGRAM_ACCOUNT_ID || "6a6072be542d8bc5a6a322b7",
    label: "Instagram",
    limit: 2200,
    needsMedia: true,
    supportsMedia: true,
    captionKey: "instagram",
  },
  {
    key: "linkedin",
    platform: "linkedin",
    accountId: process.env.ZERNIO_LINKEDIN_ACCOUNT_ID || "6a606c8f542d8bc5a6a2c6ae",
    label: "LinkedIn (Fruition)",
    limit: 3000,
    needsMedia: false,
    supportsMedia: true,
    captionKey: "linkedin",
  },
  {
    key: "pinterest",
    platform: "pinterest",
    accountId: process.env.ZERNIO_PINTEREST_ACCOUNT_ID || "6a6072db542d8bc5a6a323bd",
    label: "Pinterest",
    limit: 500,
    needsMedia: true,
    supportsMedia: true,
    captionKey: "pinterest",
  },
  {
    key: "reddit",
    platform: "reddit",
    accountId: process.env.ZERNIO_REDDIT_ACCOUNT_ID || "6a6070d4542d8bc5a6a30d3e",
    label: "Reddit",
    limit: 10000,
    needsMedia: false,
    supportsMedia: false,
    captionKey: "reddit",
  },
]

export function platformSpec(key: PlatformKey): PlatformSpec {
  const spec = PLATFORMS.find((p) => p.key === key)
  if (!spec) throw new Error(`Unknown platform key: ${key}`)
  return spec
}

/** Same slug algorithm as the portal editor, used as a stable source key. */
export function slugifyTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
}

/* ------------------------------------------------------------------ */
/*  Zernio API client                                                  */
/* ------------------------------------------------------------------ */

function apiKey(): string | null {
  return process.env.ZERNIO_API_KEY || null
}

async function zernioFetch(path: string, init?: RequestInit): Promise<Response> {
  const key = apiKey()
  if (!key) throw new Error("ZERNIO_API_KEY is not set")
  return fetch(`${ZERNIO_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
}

async function zernioJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await zernioFetch(path, init)
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Zernio ${init?.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`)
  }
  return JSON.parse(text) as T
}

export interface ZernioPlatformEntry {
  platform: string
  accountId: string | { _id: string }
  status?: string
  platformPostUrl?: string
  error?: string
  platformSpecificData?: Record<string, unknown>
}

export interface ZernioPost {
  _id: string
  title?: string
  content: string
  status: string
  scheduledFor?: string
  metadata?: Record<string, unknown>
  mediaItems?: Array<{ type: string; url: string; title?: string }>
  platforms: ZernioPlatformEntry[]
  createdAt?: string
}

export async function getZernioPost(postId: string): Promise<ZernioPost> {
  const data = await zernioJson<{ post: ZernioPost }>(`/posts/${postId}`)
  return data.post
}

export async function listZernioPosts(limit = 100): Promise<ZernioPost[]> {
  const data = await zernioJson<{ posts: ZernioPost[] }>(`/posts?limit=${limit}`)
  return data.posts ?? []
}

export async function deleteZernioPost(postId: string): Promise<void> {
  await zernioJson<{ message: string }>(`/posts/${postId}`, { method: "DELETE" })
}

/** Source identifiers linking a Zernio post back to a blog. */
export interface SocialSource {
  slug: string
  draftId?: string
  docId?: string
  pulseId?: string
}

function sourceMetadata(source: SocialSource, key: PlatformKey): Record<string, unknown> {
  return {
    marketaSlug: source.slug,
    ...(source.draftId ? { marketaDraftId: source.draftId } : {}),
    ...(source.docId ? { marketaDocId: source.docId } : {}),
    ...(source.pulseId ? { marketaPulseId: source.pulseId } : {}),
    marketaPlatform: key,
  }
}

function matchesSource(post: ZernioPost, source: SocialSource): boolean {
  const m = post.metadata
  if (!m) return false
  return (
    (typeof m.marketaSlug === "string" && m.marketaSlug === source.slug) ||
    (typeof m.marketaDraftId === "string" && Boolean(source.draftId) && m.marketaDraftId === source.draftId) ||
    (typeof m.marketaDocId === "string" && Boolean(source.docId) && m.marketaDocId === source.docId) ||
    (typeof m.marketaPulseId === "string" && Boolean(source.pulseId) && m.marketaPulseId === source.pulseId)
  )
}

/**
 * Find the existing Zernio posts for a blog, newest first, keyed by platform.
 * Scans the most recent posts (the dashboard holds drafts, so 200 is plenty).
 */
export async function findSocialPosts(source: SocialSource): Promise<Partial<Record<PlatformKey, ZernioPost>>> {
  const posts = await listZernioPosts(200)
  const byPlatform: Partial<Record<PlatformKey, ZernioPost>> = {}
  for (const post of posts) {
    if (!matchesSource(post, source)) continue
    const key = post.metadata?.marketaPlatform as PlatformKey | undefined
    if (!key || byPlatform[key]) continue // newest wins; list is newest-first
    byPlatform[key] = post
  }
  return byPlatform
}

/* ------------------------------------------------------------------ */
/*  Caption limits                                                     */
/* ------------------------------------------------------------------ */

/** Trim to a hard cap, breaking on a word and appending an ellipsis. */
export function clampText(text: string, max: number): string {
  const t = text.trim()
  if (t.length <= max) return t
  const cut = t.slice(0, Math.max(0, max - 1))
  const lastSpace = cut.lastIndexOf(" ")
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/**
 * Clamp an X caption to 280 RAW characters including any trailing URL line
 * (Zernio's composer counts raw characters, not t.co-weighted ones).
 * The URL line is preserved; only the leading copy is trimmed.
 */
export function clampTwitter(text: string): string {
  const t = text.trim()
  if (t.length <= 280) return t
  const lines = t.split("\n")
  const last = lines[lines.length - 1]?.trim() ?? ""
  const isUrlLine = /^https?:\/\/\S+$/.test(last)
  if (isUrlLine && lines.length > 1) {
    const budget = 280 - last.length - 1
    return `${clampText(lines.slice(0, -1).join("\n"), budget)}\n${last}`
  }
  return clampText(t, 280)
}

/* ------------------------------------------------------------------ */
/*  Caption generation (one OpenRouter call for every platform)        */
/* ------------------------------------------------------------------ */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const CAPTION_MODEL = process.env.MARKETA_SOCIAL_MODEL ?? "anthropic/claude-haiku-4.5"

const VOICE_RULES = [
  "Voice (Fruition):",
  "- Plain-spoken, confident, technical without academic.",
  "- Talk to a senior operator (COO, ops director).",
  "- Show, don't tell. Specific verbs over marketing adjectives.",
  "- No em dashes anywhere. Use commas, parens, or two short sentences.",
  "- Banned words: leverage, synergise, best-in-class, unlock potential, drive transformation, seamlessly, robust, dive into, in today's world, fast-paced, game-changer.",
  "- No 'I hope this helps' / 'let's dive in' AI-tells.",
].join("\n")

export interface SocialCaptions {
  twitter: string
  googlebusiness: string
  instagram: string
  linkedin: string
  /** Pinterest pin: separate title (≤100) + description (≤500). */
  pinterest: { title: string; description: string }
  /** Reddit: separate title (≤300) + body. */
  reddit: { title: string; body: string }
}

export interface GenerateCaptionsInput {
  title: string
  excerpt?: string
  /** Blog draft/article markdown for grounding (truncated internally). */
  body?: string
  industry?: string
  targetKeyword?: string
  /** Live blog URL, when the post is already published. */
  blogUrl?: string
  /** Restrict generation to these caption keys (regenerate one platform). */
  only?: Array<PlatformSpec["captionKey"]>
}

const MAX_BODY_CHARS = 5000

function captionsPrompt(input: GenerateCaptionsInput): { system: string; user: string } {
  const urlRule = input.blogUrl
    ? `The blog post is live at ${input.blogUrl} — include that URL where each platform's spec says so.`
    : "The blog post is NOT live yet, so do NOT include any URL anywhere. The link is appended automatically at publish time — leave headroom for it on X."
  const xBudget = input.blogUrl ? 280 - (input.blogUrl.length + 1) : 200
  const system = [
    "You are Marketa, Fruition's marketing agent. Fruition is a Platinum monday.com consulting partner (500+ implementations across Australia, US, UK, Singapore).",
    "Write social captions promoting one blog post, for several platforms at once.",
    "",
    urlRule,
    "",
    "Return ONLY a JSON object (no markdown fences, no commentary) with exactly these keys:",
    "{",
    `  "twitter": "one punchy post, HARD MAX ${xBudget} characters. Specific hook, one concrete takeaway, soft CTA${input.blogUrl ? ", then the URL on its own final line" : ""}. At most 2 lowercase hashtags.",`,
    '  "googlebusiness": "a Google Business Profile update, 400-900 characters. Local-SEO aware: name the service plainly (monday.com consulting / implementation), one concrete benefit or example from the post, end with a clear call to action' +
      (input.blogUrl ? " and the URL." : '."') +
      ' No hashtags.",',
    '  "instagram": "a caption: one-line hook, then 2-4 short lines of concrete value (blank line between each), a soft CTA, then a final line of 5-8 lowercase hashtags relevant to monday.com / ops / automation. Max 1800 characters.",',
    '  "linkedin": "a post for the Fruition company page: strong first line (it gets truncated in feed), 3-6 short paragraphs or a tight list with concrete takeaways from the post, soft CTA' +
      (input.blogUrl ? ", URL at the end." : '."') +
      ' Max 2500 characters. At most 3 hashtags.",',
    '  "pinterest": {"title": "keyword-aware pin title, max 90 characters", "description": "2-3 sentences of value ending with 3-5 lowercase hashtags, max 450 characters"},',
    '  "reddit": {"title": "a plain, non-clickbait title a human would post, max 280 characters", "body": "2-4 conversational paragraphs sharing the core insight like a practitioner, not an ad. No hashtags' +
      (input.blogUrl ? ", link the post once, plainly." : '."') +
      '"}',
    "}",
    "",
    VOICE_RULES,
  ].join("\n")

  const body = (input.body ?? "").slice(0, MAX_BODY_CHARS)
  const user = [
    `Blog title: ${input.title}`,
    input.excerpt ? `Excerpt: ${input.excerpt}` : "",
    input.industry && input.industry.toLowerCase() !== "general" ? `Industry: ${input.industry}` : "",
    input.targetKeyword ? `Target keyword (tone only, do not stuff): ${input.targetKeyword}` : "",
    input.only?.length ? `Only these keys are needed (fill the rest with empty strings): ${input.only.join(", ")}` : "",
    "",
    body ? `Source draft below (may be truncated):\n---\n${body}\n---` : "No draft body available — write from the title and excerpt.",
  ]
    .filter(Boolean)
    .join("\n")

  return { system, user }
}

function extractJson(raw: string): unknown {
  const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "")
  const start = stripped.indexOf("{")
  const end = stripped.lastIndexOf("}")
  if (start === -1 || end === -1) throw new Error(`No JSON object in caption response: ${raw.slice(0, 120)}`)
  return JSON.parse(stripped.slice(start, end + 1))
}

/** Generate captions for every platform in one LLM call, clamped to limits. */
export async function generateSocialCaptions(input: GenerateCaptionsInput): Promise<SocialCaptions> {
  const orKey = process.env.OPENROUTER_API_KEY
  if (!orKey) throw new Error("OPENROUTER_API_KEY is not set")
  const { system, user } = captionsPrompt(input)

  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${orKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://fruitionservices.io",
      "X-Title": "Marketa Social Captions",
    },
    body: JSON.stringify({
      model: CAPTION_MODEL,
      max_tokens: 4000,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  })
  const text = await r.text()
  if (!r.ok) throw new Error(`OpenRouter captions request failed ${r.status}: ${text.slice(0, 300)}`)
  const parsed = JSON.parse(text) as { choices?: Array<{ message?: { content?: string | null } }>; error?: { message?: string } }
  if (parsed.error) throw new Error(`OpenRouter captions error: ${parsed.error.message ?? "unknown"}`)
  const content = parsed.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error("OpenRouter captions returned empty content")

  const j = extractJson(content) as Record<string, unknown>
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "")
  const pin = (j.pinterest ?? {}) as Record<string, unknown>
  const red = (j.reddit ?? {}) as Record<string, unknown>

  return {
    twitter: clampTwitter(str(j.twitter)),
    googlebusiness: clampText(str(j.googlebusiness), 1500),
    instagram: clampText(str(j.instagram), 2200),
    linkedin: clampText(str(j.linkedin), 3000),
    pinterest: {
      title: clampText(str(pin.title) || input.title, 100),
      description: clampText(str(pin.description), 500),
    },
    reddit: {
      title: clampText(str(red.title) || input.title, 300),
      body: str(red.body),
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Draft creation / update / publish                                  */
/* ------------------------------------------------------------------ */

export interface PlatformDraftInput {
  key: PlatformKey
  /** Caption body (post content). */
  content: string
  /** Pinterest pin title / Reddit post title. */
  title?: string
}

function platformEntry(
  spec: PlatformSpec,
  args: { title?: string; link?: string; subreddit?: string },
): ZernioPlatformEntry {
  const psd: Record<string, unknown> = {}
  if (spec.key === "pinterest") {
    if (PINTEREST_BOARD_ID) psd.boardId = PINTEREST_BOARD_ID
    if (args.title) psd.title = clampText(args.title, 100)
    if (args.link) psd.link = args.link
  }
  if (spec.key === "reddit") {
    if (args.title) psd.title = clampText(args.title, 300)
    const subreddit = (args.subreddit ?? REDDIT_SUBREDDIT).trim().replace(/^\/?r\//, "")
    if (subreddit) psd.subreddit = subreddit
  }
  return {
    platform: spec.platform,
    accountId: spec.accountId,
    ...(Object.keys(psd).length ? { platformSpecificData: psd } : {}),
  }
}

export interface SocialDraftResult {
  key: PlatformKey
  postId?: string
  error?: string
}

/**
 * Create one Zernio DRAFT per platform. Skips platforms that already have a
 * post for this source (pass `existing` from findSocialPosts to make this
 * idempotent). Per-platform failures are isolated.
 */
export async function createSocialDrafts(args: {
  source: SocialSource
  blogTitle: string
  captions: SocialCaptions
  /** Cover image URL — attached to every platform that benefits from media. */
  imageUrl?: string
  /** Blog URL for Pinterest's destination link (falls back to site base). */
  blogUrl?: string
  keys?: PlatformKey[]
  existing?: Partial<Record<PlatformKey, ZernioPost>>
}): Promise<SocialDraftResult[]> {
  const targets = PLATFORMS.filter((p) => !args.keys || args.keys.includes(p.key))
  const results: SocialDraftResult[] = []

  for (const spec of targets) {
    if (args.existing?.[spec.key]) {
      results.push({ key: spec.key, postId: args.existing[spec.key]!._id })
      continue
    }
    try {
      const { content, title } = captionFor(spec, args.captions)
      const link = args.blogUrl || SITE_BASE
      const body: Record<string, unknown> = {
        title: args.blogTitle.slice(0, 120),
        content: clampText(content, spec.limit),
        isDraft: true,
        platforms: [platformEntry(spec, { title, link })],
        metadata: sourceMetadata(args.source, spec.key),
      }
      if (args.imageUrl && spec.supportsMedia) {
        body.mediaItems = [{ type: "image", url: args.imageUrl, title: args.blogTitle.slice(0, 90) }]
      }
      const data = await zernioJson<{ post?: { _id?: string } }>("/posts", {
        method: "POST",
        body: JSON.stringify(body),
      })
      if (!data.post?._id) throw new Error("Zernio returned no post id")
      results.push({ key: spec.key, postId: data.post._id })
    } catch (err) {
      results.push({ key: spec.key, error: err instanceof Error ? err.message : String(err) })
    }
  }
  return results
}

/** Map the generated caption set onto one platform's content/title. */
export function captionFor(spec: PlatformSpec, captions: SocialCaptions): { content: string; title?: string } {
  switch (spec.captionKey) {
    case "twitter":
      return { content: clampTwitter(captions.twitter) }
    case "googlebusiness":
      return { content: captions.googlebusiness }
    case "instagram":
      return { content: captions.instagram }
    case "linkedin":
      return { content: captions.linkedin }
    case "pinterest":
      return { content: captions.pinterest.description, title: captions.pinterest.title }
    case "reddit":
      return { content: captions.reddit.body, title: captions.reddit.title }
  }
}

/** Update a draft's caption (and Pinterest/Reddit title, Reddit subreddit) in place. */
export async function updateSocialDraft(args: {
  postId: string
  key: PlatformKey
  content: string
  title?: string
  blogUrl?: string
  imageUrl?: string
  subreddit?: string
}): Promise<void> {
  const spec = platformSpec(args.key)
  const body: Record<string, unknown> = {
    content: clampText(args.key === "twitter" ? clampTwitter(args.content) : args.content, spec.limit),
    platforms: [
      platformEntry(spec, { title: args.title, link: args.blogUrl || SITE_BASE, subreddit: args.subreddit }),
    ],
  }
  // imageUrl semantics: undefined = leave media as-is, "" = remove, url = set.
  if (args.imageUrl !== undefined && spec.supportsMedia) {
    body.mediaItems = args.imageUrl ? [{ type: "image", url: args.imageUrl }] : []
  }
  await zernioJson(`/posts/${args.postId}`, { method: "PUT", body: JSON.stringify(body) })
}

/**
 * Publish a draft NOW. Ensures the blog URL is present in the caption for
 * link-friendly platforms (appended if missing, X re-clamped to fit raw 280),
 * and attaches the cover image where the platform requires media.
 */
export async function publishSocialDraft(args: {
  postId: string
  key: PlatformKey
  content: string
  title?: string
  blogUrl: string
  imageUrl?: string
  subreddit?: string
}): Promise<{ status: string }> {
  const spec = platformSpec(args.key)
  if (spec.needsMedia && !args.imageUrl) {
    throw new Error(`${spec.label} requires an image — publish the blog with a cover image first`)
  }

  let content = args.content.trim()
  const wantsUrlInBody = spec.key !== "pinterest" && spec.key !== "instagram"
  if (wantsUrlInBody && args.blogUrl && !content.includes(args.blogUrl)) {
    content = `${content}\n\n${args.blogUrl}`
  }
  if (spec.key === "twitter") content = clampTwitter(content.replace(/\n\n(https?:\/\/\S+)$/, "\n$1"))
  content = clampText(content, spec.limit)

  const body: Record<string, unknown> = {
    content,
    platforms: [platformEntry(spec, { title: args.title, link: args.blogUrl, subreddit: args.subreddit })],
    isDraft: false,
    publishNow: true,
  }
  if (args.imageUrl && spec.supportsMedia) body.mediaItems = [{ type: "image", url: args.imageUrl }]
  const data = await zernioJson<{ post?: { status?: string } }>(`/posts/${args.postId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
  return { status: data.post?.status ?? "publishing" }
}

/* ------------------------------------------------------------------ */
/*  Pipeline entry point (best-effort, used by generate + webhooks)    */
/* ------------------------------------------------------------------ */

export interface SocialDraft {
  postId: string
  reviewUrl: string
}

/**
 * Generate captions and create one Zernio draft per platform for a freshly
 * generated blog. Returns the dashboard URL for Slack buttons, or null when
 * the integration isn't configured. Never throws for per-platform failures —
 * only when nothing could be created at all.
 */
export async function createSocialDraftsForBlog(args: {
  source: SocialSource
  title: string
  excerpt?: string
  body?: string
  industry?: string
  targetKeyword?: string
  blogUrl?: string
  imageUrl?: string
}): Promise<SocialDraft | null> {
  if (!apiKey()) return null

  const captions = await generateSocialCaptions({
    title: args.title,
    excerpt: args.excerpt,
    body: args.body,
    industry: args.industry,
    targetKeyword: args.targetKeyword,
    blogUrl: args.blogUrl,
  })
  const results = await createSocialDrafts({
    source: args.source,
    blogTitle: args.title,
    captions,
    imageUrl: args.imageUrl,
    blogUrl: args.blogUrl,
  })
  const failures = results.filter((r) => r.error)
  for (const f of failures) console.error(`[zernio] ${f.key} draft failed:`, f.error)
  const firstOk = results.find((r) => r.postId)
  if (!firstOk) throw new Error(`Zernio drafts failed for every platform: ${failures[0]?.error ?? "unknown"}`)
  return { postId: firstOk.postId!, reviewUrl: DASHBOARD_URL }
}
