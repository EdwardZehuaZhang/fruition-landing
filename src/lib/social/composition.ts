/**
 * Standalone social posts ("compositions") — the non-blog half of the portal's
 * social publishing.
 *
 * A composition is one idea written in /internal/social/new and fanned out to
 * one Zernio draft per selected platform, exactly like the blog flow. The
 * difference is where it comes from: there's no article behind it, so the row
 * in `social_compositions` holds the copy, the media and the schedule intent.
 *
 * Division of truth, deliberately:
 *   - Supabase owns identity + intent (what we meant to post, who wrote it).
 *   - Zernio owns reality (status, live URLs, engagement).
 * `buildComposerState` merges the two on every read, so a post deleted or
 * published in the Zernio dashboard is reflected here without a sync job. The
 * cached `status` column exists only so the list view can sort and filter.
 */

import {
  PLATFORMS,
  fetchPostsById,
  listZernioAccounts,
  type PlatformKey,
  type PlatformSpec,
  type ZernioPost,
} from "@/lib/social/zernio"
import { problemsFor, type PlatformConstraints } from "@/lib/social/validate"
import { rollupStatus } from "@/lib/social/status"
import { getPortalAdmin } from "@/lib/portalAuth"

const DASHBOARD_URL = process.env.ZERNIO_DASHBOARD_URL || "https://zernio.com/dashboard"

/* ------------------------------------------------------------------ */
/*  Row shape                                                          */
/* ------------------------------------------------------------------ */

/** One platform's copy within a composition. */
export interface CompositionPlatform {
  /** The Zernio draft backing it, once one has been created. */
  zernioPostId?: string
  content: string
  /** Pinterest pin title / Reddit post title. */
  title?: string
  /** Reddit target subreddit, without the r/. */
  subreddit?: string
  /** Pinterest board id (defaults to the account's board). */
  boardId?: string
  /** Chosen image; "" means deliberately no image. */
  mediaUrl?: string
  /** Set once the copy is edited away from the master caption. */
  customised?: boolean
}

export interface Composition {
  id: string
  title: string
  brief?: string
  link?: string
  masterContent?: string
  mediaUrls: string[]
  platforms: Partial<Record<PlatformKey, CompositionPlatform>>
  postIds: string[]
  scheduledFor?: string
  timezone?: string
  status: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}

/** Fields a caller may write. Everything else is derived server-side. */
export interface CompositionInput {
  title?: string
  brief?: string
  link?: string
  masterContent?: string
  mediaUrls?: string[]
  platforms?: Partial<Record<PlatformKey, CompositionPlatform>>
  scheduledFor?: string | null
  timezone?: string | null
  status?: string
}

const TABLE = "social_compositions"

interface CompositionRow {
  id: string
  title: string
  brief: string | null
  link: string | null
  master_content: string | null
  media_urls: string[] | null
  platforms: Record<string, CompositionPlatform> | null
  post_ids: string[] | null
  scheduled_for: string | null
  timezone: string | null
  status: string
  created_by: string | null
  created_at: string
  updated_at: string
}

function fromRow(row: CompositionRow): Composition {
  return {
    id: row.id,
    title: row.title,
    brief: row.brief ?? undefined,
    link: row.link ?? undefined,
    masterContent: row.master_content ?? undefined,
    mediaUrls: Array.isArray(row.media_urls) ? row.media_urls : [],
    platforms: (row.platforms ?? {}) as Partial<Record<PlatformKey, CompositionPlatform>>,
    postIds: Array.isArray(row.post_ids) ? row.post_ids : [],
    scheduledFor: row.scheduled_for ?? undefined,
    timezone: row.timezone ?? undefined,
    status: row.status,
    createdBy: row.created_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** Only keys we know about, so a stale client can't write junk platforms. */
function cleanPlatforms(
  platforms: Partial<Record<PlatformKey, CompositionPlatform>> | undefined,
): Record<string, CompositionPlatform> {
  const out: Record<string, CompositionPlatform> = {}
  for (const [key, value] of Object.entries(platforms ?? {})) {
    if (!PLATFORMS.some((p) => p.key === key) || !value) continue
    out[key] = {
      ...(value.zernioPostId ? { zernioPostId: value.zernioPostId } : {}),
      content: typeof value.content === "string" ? value.content : "",
      ...(value.title ? { title: value.title } : {}),
      ...(value.subreddit ? { subreddit: value.subreddit } : {}),
      ...(value.boardId ? { boardId: value.boardId } : {}),
      ...(value.mediaUrl !== undefined ? { mediaUrl: value.mediaUrl } : {}),
      ...(value.customised ? { customised: true } : {}),
    }
  }
  return out
}

function postIdsOf(platforms: Record<string, CompositionPlatform>): string[] {
  return Object.values(platforms)
    .map((p) => p.zernioPostId)
    .filter((id): id is string => Boolean(id))
}

/* ------------------------------------------------------------------ */
/*  CRUD                                                               */
/* ------------------------------------------------------------------ */

/** Newest first. `limit` keeps the dashboard's first paint cheap. */
export async function listCompositions(limit = 100): Promise<Composition[]> {
  const { data, error } = await getPortalAdmin()
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return (data as CompositionRow[]).map(fromRow)
}

export async function getComposition(id: string): Promise<Composition | null> {
  const { data, error } = await getPortalAdmin().from(TABLE).select("*").eq("id", id).maybeSingle()
  if (error) throw new Error(error.message)
  return data ? fromRow(data as CompositionRow) : null
}

/** Find the composition a Zernio post belongs to (dashboard row → composer). */
export async function compositionForPost(postId: string): Promise<Composition | null> {
  const { data, error } = await getPortalAdmin()
    .from(TABLE)
    .select("*")
    .contains("post_ids", [postId])
    .limit(1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? fromRow(data as CompositionRow) : null
}

export async function createComposition(input: CompositionInput & { createdBy?: string }): Promise<Composition> {
  const platforms = cleanPlatforms(input.platforms)
  const { data, error } = await getPortalAdmin()
    .from(TABLE)
    .insert({
      title: input.title?.trim() || "Untitled post",
      brief: input.brief ?? null,
      link: input.link ?? null,
      master_content: input.masterContent ?? null,
      media_urls: input.mediaUrls ?? [],
      platforms,
      post_ids: postIdsOf(platforms),
      scheduled_for: input.scheduledFor ?? null,
      timezone: input.timezone ?? null,
      status: input.status ?? "draft",
      created_by: input.createdBy ?? null,
    })
    .select("*")
    .single()
  if (error) throw new Error(error.message)
  return fromRow(data as CompositionRow)
}

/** Patch a composition. Only the fields present in `input` are written. */
export async function updateComposition(id: string, input: CompositionInput): Promise<Composition> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.title !== undefined) patch.title = input.title.trim() || "Untitled post"
  if (input.brief !== undefined) patch.brief = input.brief
  if (input.link !== undefined) patch.link = input.link
  if (input.masterContent !== undefined) patch.master_content = input.masterContent
  if (input.mediaUrls !== undefined) patch.media_urls = input.mediaUrls
  if (input.scheduledFor !== undefined) patch.scheduled_for = input.scheduledFor
  if (input.timezone !== undefined) patch.timezone = input.timezone
  if (input.status !== undefined) patch.status = input.status
  if (input.platforms !== undefined) {
    const platforms = cleanPlatforms(input.platforms)
    patch.platforms = platforms
    patch.post_ids = postIdsOf(platforms)
  }

  const { data, error } = await getPortalAdmin().from(TABLE).update(patch).eq("id", id).select("*").single()
  if (error) throw new Error(error.message)
  return fromRow(data as CompositionRow)
}

/** Delete the row only — Zernio drafts are removed separately by the route. */
export async function deleteComposition(id: string): Promise<void> {
  const { error } = await getPortalAdmin().from(TABLE).delete().eq("id", id)
  if (error) throw new Error(error.message)
}

/* ------------------------------------------------------------------ */
/*  Composer state (row + live Zernio truth)                           */
/* ------------------------------------------------------------------ */

/** The live Zernio side of one platform, when a draft exists for it. */
export interface ComposerLive {
  postId: string
  status: string
  platformUrl?: string
  error?: string
  /** Image currently attached to the Zernio draft. */
  mediaUrl?: string
  scheduledFor?: string
}

export interface ComposerPlatform {
  key: PlatformKey
  label: string
  /** Every constraint the editor needs, straight from the platform registry. */
  limit: number
  titleLimit?: number
  titleRequired?: boolean
  needsMedia: boolean
  supportsMedia: boolean
  maxMedia: number
  aspect?: { min: number; max: number }
  linkInBody: boolean
  notes: string[]
  /** Account handle shown under the label. */
  account: string
  connected: boolean
  /** Whether this platform is part of the composition. */
  selected: boolean
  draft: CompositionPlatform
  live?: ComposerLive
  /** Blocking problems, same rules the publish route enforces. */
  problems: string[]
}

export interface ComposerState {
  composition: Composition
  platforms: ComposerPlatform[]
  dashboardUrl: string
}

function liveOf(post: ZernioPost | undefined): ComposerLive | undefined {
  if (!post) return undefined
  const entry = post.platforms?.[0]
  return {
    postId: post._id,
    status: entry?.status === "failed" ? "failed" : post.status,
    platformUrl: entry?.platformPostUrl,
    error: entry?.error,
    mediaUrl: post.mediaItems?.find((m) => m.type === "image")?.url,
    scheduledFor: post.scheduledFor,
  }
}

/** The publishability rules for a platform, in the shape validate.ts wants. */
export function constraintsOf(spec: PlatformSpec): PlatformConstraints {
  return {
    label: spec.label,
    limit: spec.limit,
    titleLimit: spec.titleLimit,
    titleRequired: spec.titleRequired,
    needsMedia: spec.needsMedia,
    supportsMedia: spec.supportsMedia,
  }
}

/** The image a platform would publish with right now. "" = deliberately none. */
export function effectiveMedia(
  draft: CompositionPlatform | undefined,
  live: ComposerLive | undefined,
  fallback: string | undefined,
  spec: PlatformSpec,
): string {
  if (!spec.supportsMedia) return ""
  if (draft?.mediaUrl !== undefined) return draft.mediaUrl
  return live?.mediaUrl ?? fallback ?? ""
}

/**
 * Merge the stored composition with live Zernio state. Accounts and drafts are
 * fetched in parallel; a Zernio outage degrades to "not connected" rather than
 * failing the page, so a half-written composition is never lost behind an error.
 */
export async function buildComposerState(composition: Composition): Promise<ComposerState> {
  const ids: Partial<Record<PlatformKey, string>> = {}
  for (const [key, value] of Object.entries(composition.platforms)) {
    if (value?.zernioPostId) ids[key as PlatformKey] = value.zernioPostId
  }

  const [accounts, posts] = await Promise.all([
    listZernioAccounts(),
    fetchPostsById(ids).catch(() => ({}) as Partial<Record<PlatformKey, ZernioPost>>),
  ])
  const accountById = new Map(accounts.map((a) => [a._id, a]))
  const fallbackImage = composition.mediaUrls[0]

  const platforms: ComposerPlatform[] = PLATFORMS.map((spec) => {
    const account = accountById.get(spec.accountId)
    const draft = composition.platforms[spec.key]
    const live = liveOf(posts[spec.key])
    const selected = Boolean(draft)
    const media = effectiveMedia(draft, live, fallbackImage, spec)
    return {
      key: spec.key,
      label: spec.label,
      limit: spec.limit,
      titleLimit: spec.titleLimit,
      titleRequired: spec.titleRequired,
      needsMedia: spec.needsMedia,
      supportsMedia: spec.supportsMedia,
      maxMedia: spec.maxMedia,
      aspect: spec.aspect,
      linkInBody: spec.linkInBody,
      notes: spec.notes,
      account: account?.username || account?.displayName || spec.label,
      connected: Boolean(account && account.isActive !== false && account.enabled !== false),
      selected,
      draft: draft ?? { content: "" },
      live,
      problems: selected
        ? problemsFor(constraintsOf(spec), {
            content: draft?.content ?? "",
            title: draft?.title,
            mediaUrl: media || undefined,
          })
        : [],
    }
  })

  return { composition, platforms, dashboardUrl: DASHBOARD_URL }
}

/* ------------------------------------------------------------------ */
/*  Status rollup                                                      */
/* ------------------------------------------------------------------ */

/** Re-derive a composition's cached status from live Zernio state. */
export function statusFrom(state: ComposerState): string {
  return rollupStatus(
    state.platforms.filter((p) => p.selected && p.live).map((p) => p.live!.status),
  )
}

/** Convenience for routes: fetch, merge, and refresh the cached status. */
export async function loadComposer(id: string): Promise<ComposerState | null> {
  const composition = await getComposition(id)
  if (!composition) return null
  const state = await buildComposerState(composition)
  const status = statusFrom(state)
  if (status !== composition.status) {
    // Best-effort: a stale cached status must never break the read path.
    await updateComposition(id, { status }).catch(() => {})
    state.composition = { ...state.composition, status }
  }
  return state
}

/** Platform keys that exist in the registry, filtered from untrusted input. */
export function knownKeys(keys: unknown): PlatformKey[] {
  if (!Array.isArray(keys)) return []
  return keys.filter((k): k is PlatformKey => typeof k === "string" && PLATFORMS.some((p) => p.key === k))
}
