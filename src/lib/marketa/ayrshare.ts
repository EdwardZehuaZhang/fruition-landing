/**
 * Ayrshare publishing client for Marketa social distribution (Phase 1).
 *
 * One API call fans a post out to up to 13 social networks. We only call the
 * `/post` endpoint here; analytics/history live behind separate endpoints we
 * add in Phase 3.
 *
 * Auth: a single Premium-plan API key (Fruition posts on its own channels, so
 * there is one profile, no Profile-Key needed). Store it as AYRSHARE_API_KEY
 * in Vercel env (and n8n, if the publish node runs there).
 *
 * X/Twitter note: since 2026-03-31 Ayrshare requires bring-your-own X API
 * credentials, passed as two extra request headers. Set AYRSHARE_X_API_KEY and
 * AYRSHARE_X_API_SECRET to post to X; without them, `twitter` targets error.
 *
 * Docs: https://www.ayrshare.com/docs/apis/post/post
 *
 * The client is DORMANT until AYRSHARE_API_KEY is set: `isAyrshareConfigured()`
 * returns false and `publishToAyrshare` throws a clear "not configured" error
 * rather than silently no-oping, so an approval click surfaces the gap loudly.
 */

const AYRSHARE_POST_URL = "https://api.ayrshare.com/api/post"

/** Marketa's internal channel keys → Ayrshare platform strings. */
export type SocialChannel =
  | "linkedin"
  | "x"
  | "instagram"
  | "youtube"
  | "pinterest"

const CHANNEL_TO_PLATFORM: Record<SocialChannel, string> = {
  linkedin: "linkedin",
  x: "twitter",
  instagram: "instagram",
  youtube: "youtube",
  pinterest: "pinterest",
}

export function channelToPlatform(channel: SocialChannel): string {
  return CHANNEL_TO_PLATFORM[channel]
}

export function isAyrshareConfigured(): boolean {
  return Boolean(process.env.AYRSHARE_API_KEY?.trim())
}

export interface AyrsharePostInput {
  /** Post body text. Pass "" to publish media-only. */
  post: string
  /** One or more Marketa channels to fan out to. */
  channels: SocialChannel[]
  /** https:// image/video URLs. Required for instagram/pinterest, optional elsewhere. */
  mediaUrls?: string[]
  /** UTC ISO `YYYY-MM-DDThh:mm:ssZ`. Omit to publish immediately. */
  scheduleDate?: string
  /** YouTube requires a title; Pinterest takes a destination link + title. */
  youTubeTitle?: string
  pinterestTitle?: string
  pinterestLink?: string
  /** Dedup guard — Ayrshare rejects duplicate idempotency keys. */
  idempotencyKey?: string
  /** Free-form note retrievable via /history (e.g. monday pulse id). */
  notes?: string
}

export interface AyrsharePostId {
  status?: string
  platform?: string
  id?: string
  postUrl?: string
}

export interface AyrshareError {
  action?: string
  status?: string
  code?: number
  message?: string
  platform?: string
}

export interface AyrsharePostResult {
  status?: string
  errors?: AyrshareError[]
  postIds?: AyrsharePostId[]
  /** Ayrshare post id, used later for delete/analytics. */
  id?: string
  scheduleDate?: string
}

/**
 * Publish (or schedule) a post across the given channels. Throws on transport
 * failure or when the API key is missing. Per-platform failures come back in
 * `result.errors` with `status: "error"` while other platforms still succeed —
 * callers should inspect both `errors` and `postIds`.
 */
export async function publishToAyrshare(
  input: AyrsharePostInput,
): Promise<AyrsharePostResult> {
  const apiKey = process.env.AYRSHARE_API_KEY?.trim()
  if (!apiKey) {
    throw new Error(
      "AYRSHARE_API_KEY missing — add it to Vercel env after creating the Ayrshare account (see docs/social-publishing-setup.md).",
    )
  }
  if (!input.channels?.length) {
    throw new Error("publishToAyrshare: at least one channel required")
  }

  const platforms = input.channels.map(channelToPlatform)

  const body: Record<string, unknown> = {
    post: input.post ?? "",
    platforms,
  }
  if (input.mediaUrls?.length) body.mediaUrls = input.mediaUrls
  if (input.scheduleDate) body.scheduleDate = input.scheduleDate
  if (input.idempotencyKey) body.idempotencyKey = input.idempotencyKey
  if (input.notes) body.notes = input.notes

  if (input.channels.includes("youtube")) {
    body.youTubeOptions = {
      title: (input.youTubeTitle ?? "").slice(0, 100) || "Untitled",
    }
  }
  if (input.channels.includes("pinterest")) {
    body.pinterestOptions = {
      ...(input.pinterestTitle ? { title: input.pinterestTitle.slice(0, 100) } : {}),
      ...(input.pinterestLink ? { link: input.pinterestLink } : {}),
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  }
  // Bring-your-own X credentials (required by Ayrshare since 2026-03-31).
  if (input.channels.includes("x")) {
    const xKey = process.env.AYRSHARE_X_API_KEY?.trim()
    const xSecret = process.env.AYRSHARE_X_API_SECRET?.trim()
    if (xKey && xSecret) {
      headers["X-Twitter-OAuth1-Api-Key"] = xKey
      headers["X-Twitter-OAuth1-Api-Secret"] = xSecret
    }
    // If absent, Ayrshare returns a per-platform error for twitter; other
    // channels still publish. We surface that in result.errors.
  }

  const r = await fetch(AYRSHARE_POST_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  const text = await r.text()
  let parsed: AyrsharePostResult
  try {
    parsed = JSON.parse(text) as AyrsharePostResult
  } catch {
    throw new Error(`Ayrshare returned non-JSON ${r.status}: ${text.slice(0, 200)}`)
  }
  // Ayrshare uses 200 for full success, 400/500 for partial/total failure but
  // still returns a structured body. Only throw on a totally unparseable/empty
  // response; let callers read parsed.errors for per-platform problems.
  if (!parsed.status) {
    throw new Error(`Ayrshare request failed ${r.status}: ${text.slice(0, 200)}`)
  }
  return parsed
}

/** Convenience: did every targeted platform publish without error? */
export function ayrshareFullySucceeded(result: AyrsharePostResult): boolean {
  return result.status === "success" && (result.errors?.length ?? 0) === 0
}

/** Human-readable one-line summary for Slack/monday status writeback. */
export function summarizeAyrshareResult(result: AyrsharePostResult): string {
  const ok = (result.postIds ?? [])
    .filter((p) => p.status !== "error")
    .map((p) => p.platform)
    .filter(Boolean)
  const failed = (result.errors ?? []).map(
    (e) => `${e.platform ?? "?"} (${e.message?.slice(0, 80) ?? "error"})`,
  )
  const parts: string[] = []
  if (ok.length) parts.push(`published: ${ok.join(", ")}`)
  if (failed.length) parts.push(`failed: ${failed.join("; ")}`)
  if (result.status === "scheduled") {
    parts.unshift(`scheduled for ${result.scheduleDate ?? "?"}`)
  }
  return parts.join(" · ") || result.status || "unknown"
}
