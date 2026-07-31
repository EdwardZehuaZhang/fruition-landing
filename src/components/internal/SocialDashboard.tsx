"use client"

import { useEffect, useMemo, useState } from "react"
import type { SocialRow } from "@/app/api/internal/social/posts/route"
import { PlatformNameIcon } from "@/components/internal/SocialIcons"

/**
 * /internal/social — every Zernio post across all channels. Search box +
 * platform/status filters up top; per-row actions: view live post, open the
 * source blog, unpublish (published, non-Instagram), delete record (drafts /
 * failed / unpublished — never touches live posts).
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

const inputClass =
  "block w-full rounded-chip border border-[var(--color-border)] bg-surface px-4 py-3 text-sm text-ink-heading placeholder:text-ink-faint outline-none transition hover:border-[var(--purple-light)] focus:border-[var(--purple-primary)] focus:ring-2 focus:ring-[rgba(128,21,232,0.18)]"

function statusStyle(status: string): { bg: string; color: string; label: string } {
  switch (status) {
    case "published":
      return { bg: "var(--success-surface)", color: "var(--success-strong)", label: "published" }
    case "failed":
      return { bg: "var(--danger-surface)", color: "var(--danger-strong)", label: "failed" }
    case "cancelled":
      return { bg: "var(--surface)", color: "var(--color-text-secondary)", label: "unpublished" }
    case "publishing":
    case "scheduled":
      return { bg: "rgba(128,21,232,0.10)", color: "var(--purple-primary)", label: status }
    default:
      return { bg: "var(--surface)", color: "var(--color-text-secondary)", label: status }
  }
}

export default function SocialDashboard() {
  const [rows, setRows] = useState<SocialRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [platform, setPlatform] = useState<string | null>(null)
  const [status, setStatus] = useState<StatusFilter>("all")
  const [busyId, setBusyId] = useState<string | null>(null)

  async function load() {
    try {
      const r = await fetch("/api/internal/social/posts")
      const data = (await r.json()) as { rows?: SocialRow[]; error?: string }
      if (!r.ok || !data.rows) setError(data.error ?? "Failed to load posts.")
      else {
        setRows(data.rows)
        setError(null)
      }
    } catch {
      setError("Failed to load posts.")
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    if (!rows) return []
    const q = search.trim().toLowerCase()
    return rows.filter((row) => {
      if (platform && !row.platforms.some((p) => p.platform === platform)) return false
      if (status !== "all" && row.status !== status) return false
      if (!q) return true
      const haystack = [row.content, row.title, row.source?.slug, ...row.platforms.map((p) => p.account)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [rows, search, platform, status])

  async function unpublish(row: SocialRow) {
    const target = row.platforms.find((p) => p.platform !== "instagram")
    if (!target) return
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
    <div className="rounded-card bg-surface p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold text-ink-heading">Social posts</h1>
        {rows && (
          <span className="text-sm text-[var(--color-text-secondary)]">
            {filtered.length}/{rows.length}
          </span>
        )}
      </div>
      <p className="mb-5 text-sm text-[var(--color-text-secondary)]">
        Everything managed through Zernio. Posts made directly on the platforms don&apos;t appear here.
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search captions, titles, blogs, accounts…"
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
              className="flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-xs font-medium transition"
              style={{
                borderColor: on ? "var(--purple-primary)" : "var(--color-border)",
                backgroundColor: on ? "rgba(128,21,232,0.10)" : "var(--surface)",
                color: on ? "var(--purple-primary)" : "var(--ink-heading)",
              }}
            >
              <PlatformNameIcon name={p.key} size={13} />
              {p.label}
            </button>
          )
        })}
        <span className="mx-1 h-4 w-px" style={{ backgroundColor: "var(--color-border)" }} />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="rounded-pill border bg-surface px-3 py-1.5 text-xs font-medium text-ink-heading outline-none"
          style={{ borderColor: "var(--color-border)" }}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s === "cancelled" ? "unpublished" : s}
            </option>
          ))}
        </select>
      </div>

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

      {!rows && !error && <p className="text-sm text-[var(--color-text-secondary)]">Loading posts…</p>}
      {rows && filtered.length === 0 && (
        <p className="text-sm text-[var(--color-text-secondary)]">No posts match.</p>
      )}

      <ul className="space-y-3">
        {filtered.map((row) => {
          const s = statusStyle(row.status)
          const liveUrl = row.platforms.find((p) => p.url)?.url
          const blogHref = row.source?.docId
            ? `/internal/blog/post/${encodeURIComponent(row.source.docId)}/edit`
            : row.source?.draftId
              ? `/internal/blog/${row.source.draftId}/edit`
              : undefined
          const canUnpublish = row.status === "published" && row.platforms.some((p) => p.platform !== "instagram")
          const canDelete = row.status !== "published"
          const busy = busyId === row.id
          return (
            <li key={row.id} className="flex gap-3 rounded-card border p-4" style={{ borderColor: "var(--color-border)" }}>
              {row.mediaUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.mediaUrl} alt="" className="h-16 w-16 shrink-0 rounded-chip object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  {row.platforms.map((p, i) => (
                    <span
                      key={`${p.platform}-${i}`}
                      className="flex items-center gap-1.5 text-xs font-medium text-ink-heading"
                      title={p.account}
                    >
                      <span style={{ color: "var(--purple-primary)" }}>
                        <PlatformNameIcon name={p.platform} size={14} />
                      </span>
                      @{p.account.replace(/^@/, "")}
                    </span>
                  ))}
                  <span className="rounded-pill border px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: s.bg, color: s.color, borderColor: "var(--color-border)" }}>
                    {s.label}
                  </span>
                  {row.createdAt && (
                    <span className="text-[11px] text-[var(--color-text-secondary)]">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-ink-heading">{row.title || row.content.split("\n")[0]}</p>
                <p className="truncate text-xs text-[var(--color-text-secondary)]">{row.content.replace(/\n+/g, " ")}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end justify-center gap-1.5">
                <div className="flex gap-3 text-xs font-medium">
                  {liveUrl && (
                    <a href={liveUrl} target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--purple-primary)" }}>
                      View
                    </a>
                  )}
                  {blogHref && (
                    <a href={blogHref} className="underline" style={{ color: "var(--purple-primary)" }}>
                      Blog
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  {canUnpublish && (
                    <button
                      type="button"
                      onClick={() => unpublish(row)}
                      disabled={busy}
                      className="rounded-pill border px-3 py-1 text-xs font-semibold transition disabled:opacity-60"
                      style={{ borderColor: "var(--danger-strong)", color: "var(--danger-strong)" }}
                    >
                      {busy ? "Removing…" : "Unpublish"}
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => deleteRecord(row)}
                      disabled={busy}
                      className="rounded-pill border px-3 py-1 text-xs font-semibold transition disabled:opacity-60"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
                    >
                      {busy ? "…" : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
