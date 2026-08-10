"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { PenSquare } from "lucide-react"
import type { SocialRow } from "@/app/api/internal/social/posts/route"
import type { Composition } from "@/lib/social/composition"
import type { AnalyticsOverview, AnalyticsRow, PostAnalytics } from "@/lib/social/zernio"
import { rollupStatus } from "@/lib/social/status"
import { PlatformNameIcon } from "@/components/internal/SocialIcons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * /internal/social — two jobs, kept apart on purpose.
 *
 * "Posts" manages what we sent through Zernio: search, filter, open the source,
 * unpublish, delete. "Performance" measures what actually happened, and that
 * feed also covers posts published straight to the platforms, so the numbers
 * reflect the channel rather than just our own share of it.
 */

const PLATFORM_FILTERS = [
  { key: "twitter", label: "X" },
  { key: "googlebusiness", label: "Google Business" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "pinterest", label: "Pinterest" },
  { key: "reddit", label: "Reddit" },
] as const

const STATUS_FILTERS = ["all", "published", "draft", "scheduled", "publishing", "failed", "cancelled"] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

const SOURCE_FILTERS = [
  { key: "all", label: "All sources" },
  { key: "standalone", label: "Written here" },
  { key: "blog", label: "From a blog" },
] as const
type SourceFilter = (typeof SOURCE_FILTERS)[number]["key"]

const inputClass =
  "h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"

function statusBadge(status: string): { label: string; variant: "default" | "secondary" | "outline" | "destructive" } {
  switch (status) {
    case "published":
      return { label: "live", variant: "default" }
    case "failed":
      return { label: "failed", variant: "destructive" }
    case "cancelled":
      return { label: "unpublished", variant: "outline" }
    case "publishing":
    case "scheduled":
      return { label: status, variant: "secondary" }
    case "mixed":
      return { label: "partly live", variant: "secondary" }
    case "not sent":
      return { label: "not sent", variant: "outline" }
    default:
      return { label: status, variant: "outline" }
  }
}

/** Our platform keys → Zernio's platform string (gbp-au → googlebusiness). */
function zernioPlatformOf(key: string): string {
  return key.startsWith("gbp-") ? "googlebusiness" : key
}

interface CompositionChannel {
  key: string
  platform: string
  account?: string
  status: string
  url?: string
  metrics?: PostAnalytics
}

type FeedRow =
  | {
      kind: "composition"
      id: string
      createdAt?: string
      status: string
      composition: Composition
      channels: CompositionChannel[]
      preview: string
    }
  | { kind: "post"; id: string; createdAt?: string; status: string; post: SocialRow }

const nf = new Intl.NumberFormat()

/** Only the numbers worth reading at a glance; zero-only rows say nothing. */
function metricLine(m: PostAnalytics): string | null {
  const parts: string[] = []
  if (m.impressions) parts.push(`${nf.format(m.impressions)} impressions`)
  if (m.reach) parts.push(`${nf.format(m.reach)} reach`)
  if (m.likes) parts.push(`${nf.format(m.likes)} likes`)
  if (m.comments) parts.push(`${nf.format(m.comments)} comments`)
  if (m.shares) parts.push(`${nf.format(m.shares)} shares`)
  if (m.clicks) parts.push(`${nf.format(m.clicks)} clicks`)
  return parts.length ? parts.join(" · ") : null
}

export default function SocialDashboard() {
  const [tab, setTab] = useState<"posts" | "performance">("posts")
  const [rows, setRows] = useState<SocialRow[] | null>(null)
  const [compositions, setCompositions] = useState<Composition[]>([])
  const [analytics, setAnalytics] = useState<{ overview: AnalyticsOverview; rows: AnalyticsRow[] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [platform, setPlatform] = useState<string | null>(null)
  const [status, setStatus] = useState<StatusFilter>("all")
  const [source, setSource] = useState<SourceFilter>("all")
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [postsRes, compRes, statsRes] = await Promise.all([
        fetch("/api/internal/social/posts"),
        fetch("/api/internal/social/compose"),
        fetch("/api/internal/social/analytics"),
      ])
      const posts = (await postsRes.json()) as { rows?: SocialRow[]; error?: string }
      if (!postsRes.ok || !posts.rows) {
        setError(posts.error ?? "Failed to load posts.")
      } else {
        setRows(posts.rows)
        setError(null)
      }
      // Compositions and analytics are enrichment: a failure there costs a link
      // or a number, and must not blank the list.
      const comps = (await compRes.json().catch(() => ({}))) as { compositions?: Composition[] }
      if (compRes.ok && comps.compositions) setCompositions(comps.compositions)
      const stats = (await statsRes.json().catch(() => ({}))) as { overview?: AnalyticsOverview; rows?: AnalyticsRow[] }
      if (statsRes.ok && stats.rows) setAnalytics({ overview: stats.overview ?? {}, rows: stats.rows })
    } catch {
      setError("Failed to load posts.")
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  /** Zernio post id → the composition it belongs to. */
  const compositionByPost = useMemo(() => {
    const map = new Map<string, Composition>()
    for (const c of compositions) for (const postId of c.postIds) map.set(postId, c)
    return map
  }, [compositions])

  const metricsByPost = useMemo(() => {
    const map = new Map<string, PostAnalytics>()
    for (const row of analytics?.rows ?? []) if (row.postId) map.set(row.postId, row.metrics)
    return map
  }, [analytics])

  /**
   * One list, two kinds of row. A composition owns its channels, so its Zernio
   * posts are folded into a single row rather than repeating the same post
   * seven times — and a composition that hasn't been sent yet has no Zernio
   * posts at all, which is exactly why it has to be a row in its own right.
   */
  const feed = useMemo((): FeedRow[] => {
    const owned = new Set(compositions.flatMap((c) => c.postIds))
    const postById = new Map((rows ?? []).map((r) => [r.id, r]))

    const compositionRows: FeedRow[] = compositions.map((c) => {
      const channels: CompositionChannel[] = Object.entries(c.platforms).map(([key, value]) => {
        const post = value?.zernioPostId ? postById.get(value.zernioPostId) : undefined
        return {
          key,
          platform: post?.platforms[0]?.platform ?? zernioPlatformOf(key),
          account: post?.platforms[0]?.account,
          status: post?.status ?? "not sent",
          url: post?.platforms.find((p) => p.url)?.url,
          metrics: value?.zernioPostId ? metricsByPost.get(value.zernioPostId) : undefined,
        }
      })
      // Live channel statuses beat the status cached on the row, which is only
      // refreshed when someone opens the composer.
      const sent = channels.filter((ch) => ch.status !== "not sent").map((ch) => ch.status)
      return {
        kind: "composition",
        id: c.id,
        createdAt: c.createdAt,
        status: sent.length ? rollupStatus(sent) : c.status,
        composition: c,
        channels,
        preview: c.masterContent || Object.values(c.platforms)[0]?.content || "",
      }
    })

    const postRows: FeedRow[] = (rows ?? [])
      .filter((r) => !owned.has(r.id))
      .map((r) => ({ kind: "post", id: r.id, createdAt: r.createdAt, status: r.status, post: r }))

    const q = search.trim().toLowerCase()
    return [...compositionRows, ...postRows]
      .filter((row) => {
        if (source === "standalone" && row.kind !== "composition") return false
        if (source === "blog" && row.kind !== "post") return false
        if (status !== "all" && row.status !== status) return false
        if (platform) {
          const platforms =
            row.kind === "composition"
              ? row.channels.map((c) => c.platform)
              : row.post.platforms.map((p) => p.platform)
          if (!platforms.includes(platform)) return false
        }
        if (!q) return true
        const haystack =
          row.kind === "composition"
            ? [row.composition.title, row.preview, row.composition.brief]
            : [row.post.content, row.post.title, row.post.source?.slug, ...row.post.platforms.map((p) => p.account)]
        return haystack.filter(Boolean).join(" ").toLowerCase().includes(q)
      })
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
  }, [rows, compositions, metricsByPost, search, platform, status, source])

  const performance = useMemo(() => {
    const list = [...(analytics?.rows ?? [])]
    const q = search.trim().toLowerCase()
    return list
      .filter((r) => (platform ? r.platform === platform : true))
      .filter((r) => (q ? r.content.toLowerCase().includes(q) : true))
      .sort((a, b) => b.metrics.impressions - a.metrics.impressions)
  }, [analytics, platform, search])

  async function unpublish(row: SocialRow) {
    const label = row.platforms.map((p) => p.account).join(", ")
    if (!window.confirm(`Delete this post from ${label}? It comes off the platform immediately.`)) return
    setBusyId(row.id)
    setError(null)
    setNotice(null)
    try {
      // Legacy posts can span several platforms — unpublish each (IG excluded).
      const targets = row.platforms.filter((p) => p.platform !== "instagram")
      const failures: string[] = []
      for (const t of targets) {
        const r = await fetch("/api/internal/social/unpublish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: row.id, platform: t.platform }),
        })
        if (!r.ok) {
          const data = (await r.json().catch(() => ({}))) as { error?: string }
          failures.push(data.error ?? `${t.platform} failed`)
        }
      }
      if (failures.length) setError(failures.join(" · "))
      else setNotice("Post removed from the platform. The record stays here as “unpublished”.")
      await load()
    } finally {
      setBusyId(null)
    }
  }

  async function duplicate(composition: Composition) {
    setBusyId(composition.id)
    setError(null)
    setNotice(null)
    try {
      const r = await fetch("/api/internal/social/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duplicateOf: composition.id }),
      })
      const data = (await r.json().catch(() => ({}))) as { composition?: Composition; error?: string }
      if (!r.ok || !data.composition) {
        setError(data.error ?? "Duplicate failed.")
        return
      }
      window.location.href = `/internal/social/${data.composition.id}`
    } finally {
      setBusyId(null)
    }
  }

  async function deleteComposition(composition: Composition) {
    if (!window.confirm(`Delete “${composition.title}” and its drafts? This can't be undone.`)) return
    setBusyId(composition.id)
    setError(null)
    setNotice(null)
    try {
      const r = await fetch(`/api/internal/social/compose?id=${encodeURIComponent(composition.id)}`, {
        method: "DELETE",
      })
      const data = (await r.json().catch(() => ({}))) as { error?: string }
      if (!r.ok) setError(data.error ?? "Delete failed.")
      else setNotice("Post deleted.")
      await load()
    } finally {
      setBusyId(null)
    }
  }

  async function deleteRecord(row: SocialRow) {
    if (!window.confirm("Delete this Zernio record? (Does not touch any live platform post.)")) return
    setBusyId(row.id)
    setError(null)
    setNotice(null)
    try {
      const r = await fetch(`/api/internal/social/posts?id=${encodeURIComponent(row.id)}`, { method: "DELETE" })
      const data = (await r.json().catch(() => ({}))) as { error?: string }
      if (!r.ok) setError(data.error ?? "Delete failed.")
      else setNotice("Record deleted.")
      await load()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-foreground">Social posts</h1>
        <Button size="sm" render={<Link href="/internal/social/new" />}>
          <PenSquare />
          New post
        </Button>
      </div>

      <div className="mb-4 flex gap-1 border-b border-border">
        {(["posts", "performance"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
              tab === t
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "posts" ? "Posts" : "Performance"}
          </button>
        ))}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={tab === "posts" ? "Search captions, titles, blogs, accounts…" : "Search published captions…"}
        className={`${inputClass} mb-3`}
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {PLATFORM_FILTERS.map((p) => {
          const on = platform === p.key
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setPlatform(on ? null : p.key)}
              aria-pressed={on}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                on ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"
              }`}
            >
              <PlatformNameIcon name={p.key} size={13} />
              {p.label}
            </button>
          )
        })}
        {tab === "posts" && (
          <>
            <span className="mx-1 h-4 w-px bg-border" />
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as SourceFilter)}
              aria-label="Filter by source"
              className="h-8 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground outline-none"
            >
              {SOURCE_FILTERS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              aria-label="Filter by status"
              className="h-8 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground outline-none"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s === "cancelled" ? "unpublished" : s}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {notice && <p className="mb-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{notice}</p>}

      {tab === "posts" ? (
        <PostsList
          loaded={rows !== null}
          feed={feed}
          busyId={busyId}
          compositionByPost={compositionByPost}
          metricsByPost={metricsByPost}
          onUnpublish={unpublish}
          onDelete={deleteRecord}
          onDuplicate={duplicate}
          onDeleteComposition={deleteComposition}
        />
      ) : (
        <PerformanceList rows={performance} loaded={analytics !== null} overview={analytics?.overview} />
      )}
    </div>
  )
}

function PostsList({
  loaded,
  feed,
  busyId,
  compositionByPost,
  metricsByPost,
  onUnpublish,
  onDelete,
  onDuplicate,
  onDeleteComposition,
}: {
  loaded: boolean
  feed: FeedRow[]
  busyId: string | null
  compositionByPost: Map<string, Composition>
  metricsByPost: Map<string, PostAnalytics>
  onUnpublish: (row: SocialRow) => void
  onDelete: (row: SocialRow) => void
  onDuplicate: (composition: Composition) => void
  onDeleteComposition: (composition: Composition) => void
}) {
  if (!loaded) {
    return (
      <ul className="space-y-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-24 animate-pulse rounded-lg border border-border bg-muted/50" />
        ))}
      </ul>
    )
  }
  if (!feed.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm font-medium text-foreground">Nothing here yet</p>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
          Write one with <span className="font-medium text-foreground">New post</span>, or generate them from a blog on
          its Social tab. Posts made directly on the platforms aren&apos;t managed here — check Performance for those.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {feed.map((entry) =>
        entry.kind === "composition" ? (
          <CompositionRow
            key={entry.id}
            entry={entry}
            busy={busyId === entry.id}
            onDuplicate={onDuplicate}
            onDelete={onDeleteComposition}
          />
        ) : (
          <PostRow
            key={entry.id}
            row={entry.post}
            busy={busyId === entry.id}
            composition={compositionByPost.get(entry.id)}
            metrics={metricsByPost.get(entry.id)}
            onUnpublish={onUnpublish}
            onDelete={onDelete}
          />
        ),
      )}
    </ul>
  )
}

/** A post written in the composer: one row, its channels listed inside it. */
function CompositionRow({
  entry,
  busy,
  onDuplicate,
  onDelete,
}: {
  entry: Extract<FeedRow, { kind: "composition" }>
  busy: boolean
  onDuplicate: (composition: Composition) => void
  onDelete: (composition: Composition) => void
}) {
  const c = entry.composition
  // entry.status, not c.status: the row-level cache lags behind the channels.
  const s = statusBadge(entry.status)
  const totals = entry.channels.reduce<PostAnalytics | null>((acc, ch) => {
    if (!ch.metrics) return acc
    if (!acc) return { ...ch.metrics }
    return {
      ...acc,
      impressions: acc.impressions + ch.metrics.impressions,
      reach: acc.reach + ch.metrics.reach,
      likes: acc.likes + ch.metrics.likes,
      comments: acc.comments + ch.metrics.comments,
      shares: acc.shares + ch.metrics.shares,
      clicks: acc.clicks + ch.metrics.clicks,
    }
  }, null)
  const line = totals ? metricLine(totals) : null

  return (
    <li className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Link
              href={`/internal/social/${c.id}`}
              className="text-sm font-semibold text-foreground underline-offset-2 hover:underline"
            >
              {c.title}
            </Link>
            <Badge variant={s.variant}>{s.label}</Badge>
            {c.scheduledFor && (
              <span className="text-[11px] text-muted-foreground">
                for {new Date(c.scheduledFor).toLocaleString()}
              </span>
            )}
            {c.createdAt && !c.scheduledFor && (
              <span className="text-[11px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">{entry.preview.replace(/\n+/g, " ") || "No copy yet"}</p>
          {line && <p className="mt-1 font-mono text-[11px] tabular-nums text-primary">{line}</p>}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="xs" onClick={() => onDuplicate(c)} disabled={busy}>
            Duplicate
          </Button>
          <Button variant="destructive" size="xs" onClick={() => onDelete(c)} disabled={busy}>
            {busy ? "…" : "Delete"}
          </Button>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
        {entry.channels.map((ch) => (
          <li
            key={ch.key}
            className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
            title={ch.account ? `@${ch.account}` : undefined}
          >
            <span className="text-primary">
              <PlatformNameIcon name={ch.platform} size={12} />
            </span>
            <span className={ch.status === "published" ? "font-medium text-foreground" : ""}>
              {ch.status === "cancelled" ? "unpublished" : ch.status}
            </span>
            {ch.url && (
              <a
                href={ch.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                view
              </a>
            )}
          </li>
        ))}
      </ul>
    </li>
  )
}

/** A Zernio record we didn't write in the composer: blog-generated or legacy. */
function PostRow({
  row,
  busy,
  composition,
  metrics,
  onUnpublish,
  onDelete,
}: {
  row: SocialRow
  busy: boolean
  composition?: Composition
  metrics?: PostAnalytics
  onUnpublish: (row: SocialRow) => void
  onDelete: (row: SocialRow) => void
}) {
  {
    const s = statusBadge(row.status)
        const liveUrl = row.platforms.find((p) => p.url)?.url
        const blogHref = row.source?.docId
          ? `/internal/blog/post/${encodeURIComponent(row.source.docId)}/edit`
          : row.source?.draftId
            ? `/internal/blog/${row.source.draftId}/edit`
            : undefined
        const canUnpublish = row.status === "published" && row.platforms.some((p) => p.platform !== "instagram")
        const canDelete = row.status !== "published"
        const line = metrics ? metricLine(metrics) : null

        return (
          <li className="flex gap-3 rounded-lg border border-border p-4">
            {row.mediaUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.mediaUrl} alt="" className="size-16 shrink-0 rounded-md object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {row.platforms.map((p, i) => (
                  <span
                    key={`${p.platform}-${i}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-foreground"
                    title={p.account}
                  >
                    <span className="text-primary">
                      <PlatformNameIcon name={p.platform} size={14} />
                    </span>
                    @{p.account.replace(/^@/, "")}
                  </span>
                ))}
                <Badge variant={s.variant}>{s.label}</Badge>
                {row.createdAt && (
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="truncate text-sm text-foreground">{row.title || row.content.split("\n")[0]}</p>
              <p className="truncate text-xs text-muted-foreground">{row.content.replace(/\n+/g, " ")}</p>
              {line && <p className="mt-1 font-mono text-[11px] tabular-nums text-primary">{line}</p>}
            </div>
            <div className="flex shrink-0 flex-col items-end justify-center gap-1.5">
              <div className="flex gap-3 text-xs font-medium">
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    View
                  </a>
                )}
                {composition ? (
                  <Link
                    href={`/internal/social/${composition.id}`}
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    Edit
                  </Link>
                ) : blogHref ? (
                  <Link href={blogHref} className="text-primary underline-offset-2 hover:underline">
                    Blog
                  </Link>
                ) : null}
              </div>
              <div className="flex gap-2">
                {canUnpublish && (
                  <Button variant="destructive" size="xs" onClick={() => onUnpublish(row)} disabled={busy}>
                    {busy ? "Removing…" : "Unpublish"}
                  </Button>
                )}
                {canDelete && (
                  <Button variant="outline" size="xs" onClick={() => onDelete(row)} disabled={busy}>
                    {busy ? "…" : "Delete"}
                  </Button>
                )}
              </div>
            </div>
          </li>
    )
  }
}

function PerformanceList({
  rows,
  loaded,
  overview,
}: {
  rows: AnalyticsRow[]
  loaded: boolean
  overview?: AnalyticsOverview
}) {
  if (!loaded) {
    return (
      <ul className="space-y-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-20 animate-pulse rounded-lg border border-border bg-muted/50" />
        ))}
      </ul>
    )
  }
  if (!rows.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm font-medium text-foreground">No published posts to measure yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Numbers appear once a post has been live long enough to sync.</p>
      </div>
    )
  }

  return (
    <>
      {overview?.lastSync && (
        <p className="mb-3 text-xs text-muted-foreground">
          {rows.length} published posts · synced {new Date(overview.lastSync).toLocaleString()}
        </p>
      )}
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.analyticsId} className="flex items-start gap-3 rounded-lg border border-border p-3">
            <span className="mt-0.5 text-primary">
              <PlatformNameIcon name={row.platform} size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{row.content.split("\n")[0] || "(no caption)"}</p>
              <p className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                {metricLine(row.metrics) ?? "no engagement recorded yet"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {row.external && (
                <span className="text-[11px] text-muted-foreground" title="Published outside this portal">
                  posted elsewhere
                </span>
              )}
              {row.publishedAt && (
                <span className="text-[11px] text-muted-foreground">
                  {new Date(row.publishedAt).toLocaleDateString()}
                </span>
              )}
              {row.platformPostUrl && (
                <a
                  href={row.platformPostUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                >
                  View
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
