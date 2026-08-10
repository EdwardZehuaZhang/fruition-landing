"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { PanelPlatform, PanelState } from "@/lib/social/panelState"
import type { PlatformKey } from "@/lib/social/zernio"
import PlatformIcon from "@/components/internal/SocialIcons"
import PlatformEditor from "@/components/internal/social/PlatformEditor"

/**
 * Per-platform social drafts for a blog (the "Social media" tab). Each
 * platform is one Zernio draft post: edit the caption, pick the image (taken
 * from the blog's cover/body images), tick the platforms to include, publish
 * one platform or everything selected. Publishing needs the blog live in
 * Sanity (captions link to it; Instagram/Pinterest require an image).
 */

export interface SocialPanelSource {
  slug: string
  draftId?: string
  docId?: string
}

export interface SocialPanelBlog {
  title: string
  excerpt?: string
  bodyMarkdown?: string
  industry?: string
  targetKeyword?: string
}

interface DraftEdit {
  content: string
  title?: string
  /** Chosen image: url = set, "" = none, undefined = keep the draft's. */
  mediaUrl?: string
  subreddit?: string
  dirty: boolean
}

function StatusChip({ post, connected }: { post?: PanelPlatform["post"]; connected: boolean }) {
  let label = post ? post.status : "no draft"
  let bg = "var(--surface)"
  let color = "var(--color-text-secondary)"
  if (!connected) {
    label = "disconnected"
    bg = "var(--danger-surface)"
    color = "var(--danger-strong)"
  } else if (post?.status === "published") {
    bg = "var(--success-surface)"
    color = "var(--success-strong)"
  } else if (post?.status === "failed") {
    bg = "var(--danger-surface)"
    color = "var(--danger-strong)"
  } else if (post?.status === "cancelled") {
    label = "unpublished"
  } else if (post && (post.status === "publishing" || post.status === "scheduled")) {
    bg = "rgba(128,21,232,0.10)"
    color = "var(--purple-primary)"
  }
  return (
    <span
      className="rounded-pill border px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: bg, color, borderColor: "var(--color-border)" }}
    >
      {label}
    </span>
  )
}

/** The image a card would publish with right now. "" = none. */
function effectiveMedia(p: PanelPlatform, edit: DraftEdit | undefined, coverImageUrl?: string): string {
  if (edit?.mediaUrl !== undefined) return edit.mediaUrl
  return p.post?.mediaUrl ?? coverImageUrl ?? ""
}

export default function SocialDraftsPanel({
  source,
  blog,
}: {
  source: SocialPanelSource
  blog: SocialPanelBlog
}) {
  const [state, setState] = useState<PanelState | null>(null)
  const [edits, setEdits] = useState<Partial<Record<PlatformKey, DraftEdit>>>({})
  const [selected, setSelected] = useState<Set<PlatformKey>>(new Set())
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null) // "generate" | "generate:key" | "save" | "publish" | "publish:key"
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const query = useMemo(() => {
    const p = new URLSearchParams({ slug: source.slug })
    if (source.draftId) p.set("draftId", source.draftId)
    if (source.docId) p.set("docId", source.docId)
    return p.toString()
  }, [source.slug, source.draftId, source.docId])

  const applyState = useCallback((next: PanelState) => {
    setState(next)
    // Local edits only track unsaved changes; clean cards read from the server state.
    setEdits((prev) => {
      const kept: Partial<Record<PlatformKey, DraftEdit>> = {}
      for (const [k, v] of Object.entries(prev)) {
        if (v?.dirty) kept[k as PlatformKey] = v
      }
      return kept
    })
    setSelected((prev) => {
      if (prev.size) return prev
      return new Set(next.platforms.filter((p) => p.connected && p.post).map((p) => p.key))
    })
  }, [])

  const loadState = useCallback(async (): Promise<boolean> => {
    try {
      const r = await fetch(`/api/internal/blog/social?${query}`)
      const data = (await r.json()) as PanelState & { error?: string }
      if (!r.ok) {
        setError(data.error ?? "Failed to load social drafts.")
        return false
      }
      applyState(data)
      return true
    } catch {
      setError("Failed to load social drafts.")
      return false
    }
  }, [query, applyState])

  useEffect(() => {
    let cancelled = false
    loadState().finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [loadState])

  async function unpublish(p: PanelPlatform) {
    if (!p.post) return
    if (
      !window.confirm(
        `Delete this post from ${p.label}? It comes off the platform immediately — the caption stays here so you can edit and republish.`,
      )
    ) {
      return
    }
    setBusy(`unpublish:${p.key}`)
    setError(null)
    setNotice(null)
    try {
      const r = await fetch("/api/internal/social/unpublish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: p.post.id, key: p.key }),
      })
      const data = (await r.json()) as { ok?: boolean; error?: string }
      if (!r.ok) {
        setError(data.error ?? "Unpublish failed.")
        return
      }
      // Deselect so "Publish selected" doesn't immediately repost it.
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(p.key)
        return next
      })
      await loadState()
      setNotice(`Removed from ${p.label}. Edit the caption below and hit Republish whenever.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unpublish failed.")
    } finally {
      setBusy(null)
    }
  }

  function patchEdit(p: PanelPlatform, partial: Partial<Omit<DraftEdit, "dirty">>) {
    setEdits((prev) => {
      const base: DraftEdit = prev[p.key] ?? {
        content: p.post?.content ?? "",
        title: p.post?.title,
        subreddit: p.post?.subreddit,
        dirty: false,
      }
      return { ...prev, [p.key]: { ...base, ...partial, dirty: true } }
    })
  }

  const itemFor = useCallback(
    (p: PanelPlatform) => {
      const edit = edits[p.key]
      return {
        key: p.key,
        postId: p.post!.id,
        content: edit?.content ?? p.post!.content,
        title: edit?.title ?? p.post!.title,
        // undefined = leave the draft's media untouched (server falls back to
        // the cover at publish time); "" = explicitly no image.
        mediaUrl: edit?.mediaUrl,
        subreddit: edit?.subreddit ?? p.post!.subreddit,
      }
    },
    [edits],
  )

  async function generate(keys?: PlatformKey[]) {
    setBusy(keys?.length === 1 ? `generate:${keys[0]}` : "generate")
    setError(null)
    setNotice(null)
    try {
      const r = await fetch("/api/internal/blog/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...source, ...blog, keys }),
      })
      const data = (await r.json()) as PanelState & { error?: string; warning?: string }
      if (!r.ok) {
        setError(data.error ?? "Generate failed.")
        return
      }
      if (keys) {
        // Regenerated platforms must show the fresh caption, not stale edits.
        setEdits((prev) => {
          const next = { ...prev }
          for (const k of keys) delete next[k]
          return next
        })
      }
      applyState(data)
      setNotice(data.warning ? `Drafts updated with warnings: ${data.warning}` : "Drafts ready — review and publish below.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generate failed.")
    } finally {
      setBusy(null)
    }
  }

  async function saveCaptions() {
    if (!state) return
    const items = state.platforms.filter((p) => p.post && edits[p.key]?.dirty).map(itemFor)
    if (!items.length) {
      setNotice("Nothing to save.")
      return
    }
    setBusy("save")
    setError(null)
    setNotice(null)
    try {
      const r = await fetch("/api/internal/blog/social", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: source.slug, items }),
      })
      const data = (await r.json()) as { ok?: boolean; error?: string }
      if (!r.ok) {
        setError(data.error ?? "Save failed.")
        return
      }
      setEdits((prev) => {
        const next: typeof prev = {}
        for (const [k, v] of Object.entries(prev)) next[k as PlatformKey] = { ...v!, dirty: false }
        return next
      })
      setNotice("Saved to Zernio.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.")
    } finally {
      setBusy(null)
    }
  }

  async function publish(keys: PlatformKey[]) {
    if (!state) return
    const items = state.platforms.filter((p) => p.post && keys.includes(p.key)).map(itemFor)
    if (!items.length) return
    setBusy(keys.length === 1 ? `publish:${keys[0]}` : "publish")
    setError(null)
    setNotice(null)
    try {
      const r = await fetch("/api/internal/blog/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...source, items }),
      })
      const data = (await r.json()) as {
        error?: string
        results?: Array<{ key: PlatformKey; status?: string; error?: string }>
        state?: PanelState | null
      }
      if (!r.ok) {
        setError(data.error ?? "Publish failed.")
        return
      }
      if (data.state) applyState(data.state)
      const failed = (data.results ?? []).filter((x) => x.error)
      const ok = (data.results ?? []).filter((x) => !x.error)
      if (failed.length) {
        setError(failed.map((f) => `${f.key}: ${f.error}`).join(" · "))
      }
      if (ok.length) {
        setNotice(`Publishing on ${ok.length} platform${ok.length > 1 ? "s" : ""} — Zernio pushes them out now.`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed.")
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return (
      <Section>
        <p className="text-sm text-[var(--color-text-secondary)]">Loading social drafts…</p>
      </Section>
    )
  }
  if (!state) {
    return (
      <Section>
        <p className="text-sm" style={{ color: "var(--danger-strong)" }}>
          {error ?? "Social drafts unavailable."}
        </p>
      </Section>
    )
  }

  const withPosts = state.platforms.filter((p) => p.post)
  const missing = state.platforms.filter((p) => !p.post)
  const publishableKeys = state.platforms
    .filter(
      (p) =>
        p.post &&
        p.connected &&
        selected.has(p.key) &&
        p.post.status !== "published" &&
        !overLimit(p, edits) &&
        (!p.needsMedia || effectiveMedia(p, edits[p.key], state.coverImageUrl)),
    )
    .map((p) => p.key)
  const blogLive = Boolean(state.blogUrl)

  return (
    <Section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink-heading">Social drafts</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            One draft per platform via Zernio — edit, tick, publish.{" "}
            <a href={state.dashboardUrl} target="_blank" rel="noreferrer" className="underline">
              Open Zernio
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {withPosts.length > 0 && (
            <button
              type="button"
              onClick={saveCaptions}
              disabled={busy !== null}
              className="rounded-pill border px-4 py-2 text-sm font-semibold transition disabled:opacity-60"
              style={{ borderColor: "var(--color-border)", color: "var(--ink-heading)" }}
            >
              {busy === "save" ? "Saving…" : "Save changes"}
            </button>
          )}
          {missing.length > 0 && (
            <button
              type="button"
              onClick={() => generate()}
              disabled={busy !== null}
              className="rounded-pill border px-4 py-2 text-sm font-semibold transition disabled:opacity-60"
              style={{ borderColor: "var(--purple-primary)", color: "var(--purple-primary)" }}
            >
              {busy === "generate" ? "Generating…" : withPosts.length ? `Generate missing (${missing.length})` : "Generate drafts"}
            </button>
          )}
          {withPosts.length > 0 && (
            <button
              type="button"
              onClick={() => publish(publishableKeys)}
              disabled={busy !== null || !blogLive || publishableKeys.length === 0}
              title={!blogLive ? "Publish the blog post first — social posts link to it." : undefined}
              className="rounded-pill px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
              style={{ backgroundColor: "var(--purple-primary)" }}
            >
              {busy === "publish" ? "Publishing…" : `Publish selected (${publishableKeys.length})`}
            </button>
          )}
        </div>
      </div>

      {!blogLive && withPosts.length > 0 && (
        <p className="mb-4 rounded-chip px-3 py-2 text-sm" style={{ backgroundColor: "rgba(128,21,232,0.08)", color: "var(--purple-primary)" }}>
          The blog post isn&apos;t live yet. You can edit captions now; publishing unlocks once the blog is published (links + images come from the live post).
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-chip px-3 py-2 text-sm" role="alert" style={{ backgroundColor: "var(--danger-surface)", color: "var(--danger-strong)" }}>
          {error}
        </p>
      )}
      {notice && (
        <p className="mb-4 rounded-chip px-3 py-2 text-sm" style={{ backgroundColor: "var(--success-surface)", color: "var(--success-strong)" }}>
          {notice}
        </p>
      )}

      {state.platforms.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {state.platforms.map((p) => (
            <PlatformCard
              key={p.key}
              platform={p}
              edit={edits[p.key]}
              selected={selected.has(p.key)}
              blogLive={blogLive}
              availableImages={state.availableImages}
              coverImageUrl={state.coverImageUrl}
              busy={busy}
              onToggle={() =>
                setSelected((prev) => {
                  const next = new Set(prev)
                  if (next.has(p.key)) next.delete(p.key)
                  else next.add(p.key)
                  return next
                })
              }
              onPatch={(partial) => patchEdit(p, partial)}
              onRegenerate={() => generate([p.key])}
              onPublish={() => publish([p.key])}
              onUnpublish={() => unpublish(p)}
            />
          ))}
        </div>
      )}
    </Section>
  )
}

function overLimit(p: PanelPlatform, edits: Partial<Record<PlatformKey, DraftEdit>>): boolean {
  const content = edits[p.key]?.content ?? p.post?.content ?? ""
  return content.length > p.limit
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-xl border border-border p-5 sm:p-6">
      {children}
    </section>
  )
}

function PlatformCard({
  platform: p,
  edit,
  selected,
  blogLive,
  availableImages,
  coverImageUrl,
  busy,
  onToggle,
  onPatch,
  onRegenerate,
  onPublish,
  onUnpublish,
}: {
  platform: PanelPlatform
  edit?: DraftEdit
  selected: boolean
  blogLive: boolean
  availableImages: string[]
  coverImageUrl?: string
  busy: string | null
  onToggle: () => void
  onPatch: (partial: Partial<Omit<DraftEdit, "dirty">>) => void
  onRegenerate: () => void
  onPublish: () => void
  onUnpublish: () => void
}) {
  const content = edit?.content ?? p.post?.content ?? ""
  const title = edit?.title ?? p.post?.title ?? ""
  const subreddit = edit?.subreddit ?? p.post?.subreddit ?? ""
  const media = effectiveMedia(p, edit, coverImageUrl)
  const over = content.length > p.limit
  const published = p.post?.status === "published"
  const cancelled = p.post?.status === "cancelled"
  const canUnpublish = published && p.key !== "instagram"
  const mediaBlocked = p.needsMedia && !media
  const canPublish = Boolean(p.post) && p.connected && blogLive && !over && !mediaBlocked && !published

  // Every selectable image: the blog's images plus whatever is already
  // attached (e.g. attached before the blog images changed).
  const imageChoices = [...availableImages]
  if (media && !imageChoices.includes(media)) imageChoices.unshift(media)

  return (
    <div className="rounded-card border p-4" style={{ borderColor: "var(--color-border)" }}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            disabled={!p.post || published}
            className="h-4 w-4 accent-[var(--purple-primary)]"
          />
          <span className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-chip"
              style={{ backgroundColor: "rgba(128,21,232,0.08)", color: "var(--purple-primary)" }}
            >
              <PlatformIcon platform={p.key} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink-heading">{p.label}</span>
              <span className="block text-xs text-[var(--color-text-secondary)]">@{p.account.replace(/^@/, "")}</span>
            </span>
          </span>
        </label>
        <div className="flex items-center gap-2">
          {p.post?.platformUrl && (
            <a href={p.post.platformUrl} target="_blank" rel="noreferrer" className="text-xs font-medium underline" style={{ color: "var(--purple-primary)" }}>
              View post
            </a>
          )}
          <StatusChip post={p.post} connected={p.connected} />
        </div>
      </div>

      {p.post ? (
        <>
          <PlatformEditor
            spec={p}
            value={{ content, title, subreddit, mediaUrl: media }}
            images={imageChoices}
            disabled={published}
            onChange={onPatch}
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {edit?.dirty ? "unsaved" : ""}
              {mediaBlocked ? " · needs an image (add a cover to the blog)" : ""}
            </span>
            <div className="flex gap-2">
              {canUnpublish && (
                <button
                  type="button"
                  onClick={onUnpublish}
                  disabled={busy !== null}
                  className="rounded-pill border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60"
                  style={{ borderColor: "var(--danger-strong)", color: "var(--danger-strong)" }}
                >
                  {busy === `unpublish:${p.key}` ? "Removing…" : "Unpublish"}
                </button>
              )}
              {published && p.key === "instagram" && (
                <span className="self-center text-xs text-[var(--color-text-secondary)]">
                  Delete via the Instagram app
                </span>
              )}
              {!published && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  disabled={busy !== null}
                  className="rounded-pill border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60"
                  style={{ borderColor: "var(--color-border)", color: "var(--ink-heading)" }}
                >
                  {busy === `generate:${p.key}` ? "Rewriting…" : "Regenerate"}
                </button>
              )}
              {!published && (
                <button
                  type="button"
                  onClick={onPublish}
                  disabled={busy !== null || !canPublish}
                  title={!blogLive ? "Publish the blog post first." : mediaBlocked ? "This platform needs an image." : undefined}
                  className="rounded-pill px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-60"
                  style={{ backgroundColor: "var(--purple-primary)" }}
                >
                  {busy === `publish:${p.key}` ? "Publishing…" : cancelled ? "Republish" : "Publish"}
                </button>
              )}
            </div>
          </div>
          {p.post.status === "failed" && p.post.error && (
            <p className="mt-2 text-xs" style={{ color: "var(--danger-strong)" }}>
              {p.post.error}
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">
          No draft yet — use “Generate drafts” above.
        </p>
      )}
    </div>
  )
}
