/**
 * fruitionservices.io/s/<code> — our own link shortener.
 *
 * Built rather than bought because the two things we wanted from ow.ly aren't
 * available to us: Zernio has no shortener of its own, and ow.ly needs a
 * Hootsuite account. Owning it buys the thing that actually matters — a
 * SEPARATE code per channel, so "who clicked" is answerable per platform
 * instead of being a single number for the whole post.
 *
 * Rows outlive their composition on purpose: a link that has been published to
 * LinkedIn must keep resolving long after the draft behind it is deleted, so
 * `composition_id` is nulled rather than cascaded.
 *
 * Pinterest is deliberately never shortened — its destination-link field
 * rejects shortened URLs outright.
 */

import { getPortalAdmin } from "@/lib/portalAuth"
import { CODE_LENGTH, isShortenable, shortLinkUrl, urlsIn } from "@/lib/social/shortLinkText"

export * from "@/lib/social/shortLinkText"

const TABLE = "short_links"

/**
 * No 0/O/1/l/I: these codes get read aloud, retyped off a phone screen and
 * pasted out of screenshots, and a shortener that turns "l" into "1" wastes
 * everyone's afternoon.
 */
const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz"

export interface ShortLink {
  code: string
  url: string
  targetUrl: string
  clicks: number
  platform?: string
  lastClickedAt?: string
}

interface ShortLinkRow {
  code: string
  target_url: string
  platform: string | null
  clicks: number
  last_clicked_at: string | null
}

function fromRow(row: ShortLinkRow): ShortLink {
  return {
    code: row.code,
    url: shortLinkUrl(row.code),
    targetUrl: row.target_url,
    clicks: row.clicks ?? 0,
    platform: row.platform ?? undefined,
    lastClickedAt: row.last_clicked_at ?? undefined,
  }
}


function newCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH)
  crypto.getRandomValues(bytes)
  let out = ""
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length]
  return out
}


export interface ShortenInput {
  target: string
  /** Ties the code to one post, so clicks can be reported per composition. */
  compositionId?: string
  /** Ties it to one channel, so clicks can be split by platform. */
  platform?: string
  label?: string
  createdBy?: string
}

/**
 * Get the short link for a target, creating one if this (composition, platform,
 * target) hasn't been shortened before.
 *
 * Idempotent by that triple, so re-publishing or rescheduling a post reuses the
 * same code and keeps its click history rather than resetting it.
 */
export async function shortenUrl(input: ShortenInput): Promise<ShortLink> {
  const admin = getPortalAdmin()
  const target = input.target.trim()
  const compositionId = input.compositionId ?? null
  // Stored as "" rather than NULL so the scope lookup is a plain equality —
  // NULL = NULL is never true, and this key has to match the unique index.
  const platform = input.platform ?? ""

  const existing = await findScoped(target, compositionId, platform)
  if (existing) return existing

  // Three attempts is plenty: 31^6 is ~887 million codes, so a collision means
  // the random source is broken, not that the space is full.
  let lastError = "could not allocate a short code"
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = newCode()
    const { data, error } = await admin
      .from(TABLE)
      .insert({
        code,
        target_url: target,
        composition_id: compositionId,
        platform,
        label: input.label ?? null,
        created_by: input.createdBy ?? null,
      })
      .select("code, target_url, platform, clicks, last_clicked_at")
      .single()
    if (data) return fromRow(data as ShortLinkRow)
    lastError = error?.message ?? lastError

    // Either the code collided or another request shortened the same target
    // first. If it's the latter, take theirs; otherwise draw a new code.
    const raced = await findScoped(target, compositionId, platform)
    if (raced) return raced
  }
  throw new Error(lastError)
}

/** The existing code for one (composition, platform, target), if there is one. */
async function findScoped(
  target: string,
  compositionId: string | null,
  platform: string,
): Promise<ShortLink | null> {
  const base = getPortalAdmin()
    .from(TABLE)
    .select("code, target_url, platform, clicks, last_clicked_at")
    .eq("target_url", target)
    .eq("platform", platform)
  const { data } = await (compositionId
    ? base.eq("composition_id", compositionId)
    : base.is("composition_id", null)
  ).maybeSingle()
  return data ? fromRow(data as ShortLinkRow) : null
}

/**
 * Replace every shortenable URL in a caption with its short link.
 *
 * Longest-first so a URL that is a prefix of another (a page and its own
 * sub-path) can't have the shorter one substituted inside the longer.
 * Failures are swallowed per URL: a shortener hiccup must never stop a post
 * going out with the real link in it.
 */
export async function shortenLinksIn(
  text: string,
  opts: Omit<ShortenInput, "target">,
): Promise<{ text: string; links: ShortLink[] }> {
  const targets = urlsIn(text).filter(isShortenable).sort((a, b) => b.length - a.length)
  if (!targets.length) return { text, links: [] }

  let out = text
  const links: ShortLink[] = []
  for (const target of targets) {
    try {
      const link = await shortenUrl({ ...opts, target })
      out = out.split(target).join(link.url)
      links.push(link)
    } catch {
      // Leave this URL as it was written.
    }
  }
  return { text: out, links }
}

/** Resolve a code for the public redirect. */
export async function resolveShortLink(code: string): Promise<string | null> {
  const { data } = await getPortalAdmin()
    .from(TABLE)
    .select("target_url")
    .eq("code", code)
    .maybeSingle()
  return (data as { target_url?: string } | null)?.target_url ?? null
}

/** Count a click. Atomic, and best-effort — never block the redirect on it. */
export async function registerClick(code: string): Promise<void> {
  await getPortalAdmin().rpc("register_short_link_click", { p_code: code })
}

/** Every short link belonging to a composition, for the click read-out. */
export async function shortLinksForComposition(compositionId: string): Promise<ShortLink[]> {
  const { data } = await getPortalAdmin()
    .from(TABLE)
    .select("code, target_url, platform, clicks, last_clicked_at")
    .eq("composition_id", compositionId)
  return ((data ?? []) as ShortLinkRow[]).map(fromRow)
}

/**
 * Swap this channel's links for fruitionservices.io/s/<code>.
 *
 * Per channel, deliberately: each gets its own code for the same destination,
 * so the click counts answer "which channel worked", not just "how many".
 *
 * Two exceptions. Pinterest's destination-link FIELD is left alone because
 * Pinterest rejects shortened URLs there (its caption is still shortened). And
 * a failure anywhere here returns the copy untouched — a shortener wobble must
 * never stop a post going out with the real link in it.
 */
export async function shortenForChannel({
  composition,
  key,
  content,
  createdBy,
}: {
  /** Structural, not the Composition type — that module imports this one. */
  composition: { id: string; title: string; link?: string; shortenLinks: boolean }
  key: string
  content: string
  createdBy?: string
}): Promise<{ content: string; link?: string }> {
  if (!composition.shortenLinks) return { content, link: composition.link }

  const scope = {
    compositionId: composition.id,
    platform: key,
    label: composition.title,
    createdBy,
  }
  try {
    const { text } = await shortenLinksIn(content, scope)
    let link = composition.link
    if (link && key !== "pinterest" && isShortenable(link)) {
      // Same scope as the body, so a link written into the caption AND carried
      // in the link field resolves to one code — and publishSocialDraft's
      // "already in the body?" check still sees them as the same URL.
      link = (await shortenUrl({ ...scope, target: link })).url
    }
    return { content: text, link }
  } catch {
    return { content, link: composition.link }
  }
}
