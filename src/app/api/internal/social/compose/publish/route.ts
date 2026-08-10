import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import {
  buildComposerState,
  constraintsOf,
  getComposition,
  knownKeys,
  statusFrom,
  updateComposition,
  type Composition,
  type CompositionPlatform,
} from "@/lib/social/composition"
import { problemsFor } from "@/lib/social/validate"
import {
  createDraftPost,
  getZernioPost,
  platformSpec,
  publishSocialDraft,
  republishCancelledPost,
  scheduleSocialPost,
  unscheduleSocialPost,
  type PlatformKey,
} from "@/lib/social/zernio"

export const runtime = "nodejs"
export const maxDuration = 180

/**
 * Publish or schedule a standalone composition.
 *
 * Body: { id, keys[], mode: "now" | "schedule" | "cancel", scheduledFor?, timezone? }
 *
 * This is where a composition first reaches Zernio: drafts are created lazily
 * here (and their ids written back), then published or handed to the scheduler.
 * Validation runs server-side too — the composer disables the button, but the
 * API must not be talkable into an over-limit or image-less post.
 *
 * Per-platform failures are isolated: one bad channel never blocks the rest.
 */

interface PublishResult {
  key: PlatformKey
  status?: string
  error?: string
}

export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (!process.env.ZERNIO_API_KEY) {
    return NextResponse.json({ error: "Zernio is not configured (ZERNIO_API_KEY missing)." }, { status: 501 })
  }

  let body: {
    id?: string
    keys?: unknown
    mode?: string
    scheduledFor?: string
    timezone?: string
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const id = typeof body.id === "string" ? body.id : ""
  const mode = body.mode === "schedule" ? "schedule" : body.mode === "cancel" ? "cancel" : "now"
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })

  const composition = await getComposition(id).catch(() => null)
  if (!composition) return NextResponse.json({ error: "Post not found." }, { status: 404 })

  const requested = knownKeys(body.keys)
  const keys = (requested.length ? requested : (Object.keys(composition.platforms) as PlatformKey[])).filter(
    (k) => composition.platforms[k],
  )
  if (!keys.length) return NextResponse.json({ error: "No channels selected." }, { status: 400 })

  if (mode === "cancel") return cancelSchedule(composition, keys)

  if (mode === "schedule") {
    const when = Date.parse(body.scheduledFor ?? "")
    if (!Number.isFinite(when)) {
      return NextResponse.json({ error: "Pick a valid date and time to schedule." }, { status: 400 })
    }
    if (when <= Date.now()) {
      return NextResponse.json({ error: "That time has already passed — pick a future time." }, { status: 400 })
    }
  }

  // Validate everything BEFORE creating any Zernio draft, so a rejected publish
  // leaves nothing half-created behind.
  const problems = keys.flatMap((key) => {
    const draft = composition.platforms[key] as CompositionPlatform
    const spec = platformSpec(key)
    return problemsFor(constraintsOf(spec), {
      content: draft.content,
      title: draft.title,
      mediaUrl: spec.supportsMedia ? draft.mediaUrl || composition.mediaUrls[0] : undefined,
    })
  })
  if (problems.length) return NextResponse.json({ error: problems.join(" · ") }, { status: 400 })

  const results: PublishResult[] = []
  const platforms = { ...composition.platforms }

  for (const key of keys) {
    const draft = platforms[key] as CompositionPlatform
    const imageUrl = draft.mediaUrl !== undefined ? draft.mediaUrl || undefined : composition.mediaUrls[0]
    try {
      // Lazily create the Zernio draft the first time this channel is used.
      let postId = draft.zernioPostId
      if (!postId) {
        postId = await createDraftPost({
          target: { kind: "composition", compositionId: composition.id },
          key,
          name: composition.title,
          content: draft.content,
          title: draft.title,
          imageUrl,
          link: composition.link,
          subreddit: draft.subreddit,
          boardId: draft.boardId,
        })
        platforms[key] = { ...draft, zernioPostId: postId }
      }

      const args = {
        postId,
        key,
        content: draft.content,
        title: draft.title,
        imageUrl,
        subreddit: draft.subreddit,
        boardId: draft.boardId,
      }

      if (mode === "schedule") {
        const { status } = await scheduleSocialPost({
          ...args,
          link: composition.link,
          scheduledFor: body.scheduledFor!,
          timezone: body.timezone,
        })
        results.push({ key, status })
        continue
      }

      const current = await getZernioPost(postId)
      if (current.status === "published") {
        results.push({ key, error: "Already live — unpublish it first to repost." })
        continue
      }
      // Zernio won't re-run a cancelled record; recreate it carrying the metadata.
      const { status, postId: newId } =
        current.status === "cancelled"
          ? await republishCancelledPost({ ...args, blogUrl: composition.link ?? "", oldPost: current })
          : { ...(await publishSocialDraft({ ...args, blogUrl: composition.link ?? "" })), postId }
      if (newId !== postId) platforms[key] = { ...platforms[key]!, zernioPostId: newId }
      results.push({ key, status })
    } catch (err) {
      results.push({ key, error: err instanceof Error ? err.message : String(err) })
    }
  }

  const saved = await updateComposition(composition.id, {
    platforms,
    scheduledFor: mode === "schedule" ? body.scheduledFor : null,
    timezone: mode === "schedule" ? (body.timezone ?? null) : null,
  })
  const state = await buildComposerState(saved)
  const status = statusFrom(state)
  if (status !== saved.status) {
    state.composition = await updateComposition(saved.id, { status }).catch(() => state.composition)
  }

  return NextResponse.json({ results, ...state })
}

/** Pull scheduled posts back to drafts so they won't fire. */
async function cancelSchedule(composition: Composition, keys: PlatformKey[]) {
  const results: PublishResult[] = []
  for (const key of keys) {
    const postId = composition.platforms[key]?.zernioPostId
    if (!postId) continue
    try {
      await unscheduleSocialPost(postId)
      results.push({ key, status: "draft" })
    } catch (err) {
      results.push({ key, error: err instanceof Error ? err.message : String(err) })
    }
  }
  const saved = await updateComposition(composition.id, {
    scheduledFor: null,
    timezone: null,
    status: "draft",
  })
  return NextResponse.json({ results, ...(await buildComposerState(saved)) })
}
