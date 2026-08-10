"use client"

import { useMemo, useState, useTransition } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RichTextEditor from "@/components/internal/RichTextEditor"

export interface CategoryOption {
  _id: string
  title: string
}

export interface BlogEditorInitial {
  draftId?: string
  /** Sanity doc id — editing a published post updates it in place on publish. */
  docId?: string
  title?: string
  slug?: string
  excerpt?: string
  industry?: string
  categoryIds?: string[]
  seoKeyword?: string
  seoTitle?: string
  seoDescription?: string
  publishedAt?: string
  body?: string
  author?: string
  /**
   * The draft's full metadata row, passed through so saving from the editor
   * preserves pipeline keys it doesn't edit (status, monday_item_id,
   * google_doc_url, …) instead of overwriting the whole object.
   */
  metadata?: Record<string, unknown>
}

const INDUSTRIES = [
  { value: "", label: "— none —" },
  { value: "ai", label: "AI" },
  { value: "construction", label: "Construction" },
  { value: "hr", label: "HR" },
  { value: "real-estate", label: "Real Estate" },
  { value: "marketing", label: "Marketing" },
  { value: "saas", label: "SaaS" },
  { value: "professional-services", label: "Professional Services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "product", label: "Product" },
]

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

/** Radix Select has no empty-string value, so "use my byline" needs a sentinel. */
const AUTHOR_DEFAULT = "__default__"

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
}

const inputClass =
  "block w-full rounded-chip border border-[var(--color-border)] bg-surface px-4 py-3 text-sm text-ink-heading placeholder:text-ink-faint outline-none transition hover:border-[var(--purple-light)] focus:border-[var(--purple-primary)] focus:ring-2 focus:ring-[rgba(128,21,232,0.18)]"

export default function BlogEditor({
  categories,
  authors = [],
  currentAuthorName,
  initial,
}: {
  categories: CategoryOption[]
  authors?: string[]
  /** The signed-in user's resolved byline, shown as the default author. */
  currentAuthorName?: string
  initial?: BlogEditorInitial
}) {
  const [draftId, setDraftId] = useState(initial?.draftId)
  const [title, setTitle] = useState(initial?.title ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug))
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "")
  const [industry, setIndustry] = useState(initial?.industry ?? "")
  const [categoryIds, setCategoryIds] = useState<string[]>(initial?.categoryIds ?? [])
  const [seoKeyword, setSeoKeyword] = useState(initial?.seoKeyword ?? "")
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "")
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "")
  const [publishedAt, setPublishedAt] = useState(initial?.publishedAt ?? "")
  const [body, setBody] = useState(initial?.body ?? "")
  const [author, setAuthor] = useState(initial?.author ?? "")
  const [cover, setCover] = useState<File | null>(null)

  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null)
  const [savingDraft, startDraft] = useTransition()
  const [publishing, startPublish] = useTransition()
  const [unpublishing, startUnpublish] = useTransition()

  // Editing a live Sanity doc: the primary action updates it in place, and
  // Unpublish becomes available.
  const isPublished = Boolean(initial?.docId)

  const effectiveSlug = useMemo(
    () => (slugTouched && slug ? slugify(slug) : slugify(title)),
    [slug, slugTouched, title],
  )

  function toggleCategory(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function metadata() {
    return {
      // Preserve pipeline keys (status, monday_item_id, google_doc_url, …)
      // the editor doesn't manage — the draft save replaces the whole object.
      ...(initial?.metadata ?? {}),
      excerpt,
      industry,
      categoryIds,
      seoKeyword,
      seoTitle,
      seoDescription,
      publishedAt,
      author,
      slug: effectiveSlug,
    }
  }

  function onSaveDraft() {
    setError(null)
    setStatus(null)
    if (!title.trim()) {
      setError("Add a title before saving a draft.")
      return
    }
    startDraft(async () => {
      const r = await fetch("/api/internal/blog/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draftId, title, body_markdown: body, metadata: metadata() }),
      })
      const data = (await r.json().catch(() => ({}))) as { id?: string; error?: string }
      if (!r.ok || !data.id) {
        setError(data.error ?? "Failed to save draft.")
        return
      }
      setDraftId(data.id)
      setStatus("Draft saved.")
    })
  }

  function onPublish() {
    setError(null)
    setStatus(null)
    setPublishedSlug(null)
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required to publish.")
      return
    }
    if (cover && cover.size > MAX_IMAGE_BYTES) {
      setError("Cover image exceeds 8 MB.")
      return
    }
    const fd = new FormData()
    fd.set("title", title.trim())
    fd.set("body", body)
    fd.set("slug", effectiveSlug)
    fd.set("excerpt", excerpt.trim())
    fd.set("industry", industry)
    fd.set("author", author)
    fd.set("seoKeyword", seoKeyword.trim())
    fd.set("seoTitle", seoTitle.trim())
    fd.set("seoDescription", seoDescription.trim())
    if (publishedAt) fd.set("publishedAt", new Date(publishedAt).toISOString())
    if (initial?.docId) fd.set("docId", initial.docId)
    categoryIds.forEach((id) => fd.append("categoryIds", id))
    if (cover) fd.set("coverImage", cover)

    startPublish(async () => {
      const r = await fetch("/api/internal/blog", { method: "POST", body: fd })
      const data = (await r.json().catch(() => ({}))) as { slug?: string; error?: string }
      if (!r.ok || !data.slug) {
        setError(data.error ?? "Publish failed.")
        return
      }
      setPublishedSlug(data.slug)
      setStatus(isPublished ? "Updated — changes are live." : "Published to Sanity.")
    })
  }

  /**
   * Take a live post off the site: save its content as a portal draft first
   * (so nothing is lost and it can be re-published), then delete the Sanity
   * doc and jump to the new draft.
   */
  function onUnpublish() {
    const docId = initial?.docId
    if (!docId) return
    if (
      !window.confirm(
        "Unpublish this post? It comes off the live site immediately. A copy is kept in portal drafts so you can re-publish it later.",
      )
    ) {
      return
    }
    setError(null)
    setStatus(null)
    startUnpublish(async () => {
      const draftRes = await fetch("/api/internal/blog/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draftId,
          title,
          body_markdown: body,
          metadata: { ...metadata(), status: "unpublished", unpublished_doc_id: docId },
        }),
      })
      const draftData = (await draftRes.json().catch(() => ({}))) as { id?: string; error?: string }
      if (!draftRes.ok || !draftData.id) {
        setError(draftData.error ?? "Could not save a draft copy — the post was NOT unpublished.")
        return
      }
      const delRes = await fetch(`/api/internal/blog?docId=${encodeURIComponent(docId)}`, {
        method: "DELETE",
      })
      const delData = (await delRes.json().catch(() => ({}))) as { error?: string }
      if (!delRes.ok) {
        setError(delData.error ?? "Unpublish failed — the post is still live.")
        return
      }
      window.location.href = `/internal/blog/${draftData.id}/edit`
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main column: title + markdown body */}
      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className={`${inputClass} text-lg font-semibold`}
        />
        <RichTextEditor value={body} onChange={setBody} />
      </div>

      {/* Sidebar: metadata */}
      <aside className="space-y-4">
        <Field label="Slug">
          <input
            value={slugTouched ? slug : effectiveSlug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugTouched(true)
            }}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">/post/{effectiveSlug || "…"}</p>
        </Field>
        <Field label="Excerpt">
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label="Cover image" hint="Max 8 MB">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
        </Field>
        <Field label="Author" hint="From the team page">
          <Select value={author || AUTHOR_DEFAULT} onValueChange={(v) => setAuthor(v === AUTHOR_DEFAULT || !v ? "" : v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AUTHOR_DEFAULT}>{currentAuthorName || "You (default)"}</SelectItem>
              {authors
                .filter((name) => name !== currentAuthorName)
                .map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Industry">
          <Select value={industry || INDUSTRIES[0]?.value} onValueChange={(v) => setIndustry(v ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        {categories.length > 0 && (
          <Field label="Categories">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const on = categoryIds.includes(c._id)
                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => toggleCategory(c._id)}
                    className="rounded-pill border px-3 py-1 text-xs transition"
                    style={{
                      borderColor: on ? "var(--purple-primary)" : "var(--color-border)",
                      backgroundColor: on ? "rgba(128,21,232,0.10)" : "var(--surface)",
                      color: on ? "var(--purple-primary)" : "var(--ink-heading)",
                    }}
                  >
                    {c.title}
                  </button>
                )
              })}
            </div>
          </Field>
        )}
        <Field label="SEO keyword" hint="Primary keyword this post targets">
          <input
            value={seoKeyword}
            onChange={(e) => setSeoKeyword(e.target.value)}
            placeholder="e.g. monday.com automations"
            className={inputClass}
          />
        </Field>
        <Field label="SEO title" hint={`${seoTitle.length}/60`}>
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Meta description" hint={`${seoDescription.length}/160`}>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label="Publish date" hint="Defaults to now">
          <input
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className={inputClass}
          />
        </Field>

        {error && (
          <div
            className="rounded-chip px-3 py-2 text-sm"
            style={{ backgroundColor: "var(--danger-surface)", color: "var(--danger-strong)" }}
            role="alert"
          >
            {error}
          </div>
        )}
        {status && (
          <div
            className="rounded-chip px-3 py-2 text-sm"
            style={{ backgroundColor: "var(--success-surface)", color: "var(--success-strong)" }}
          >
            {status}{" "}
            {publishedSlug && (
              <a
                href={`/post/${publishedSlug}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline"
              >
                View post →
              </a>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={savingDraft || unpublishing}
            className="flex-1 rounded-pill border px-4 py-3 text-sm font-semibold transition disabled:opacity-60"
            style={{ borderColor: "var(--color-border)", color: "var(--ink-heading)" }}
          >
            {savingDraft ? "Saving…" : "Save draft"}
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={publishing || unpublishing}
            className="flex-1 rounded-pill px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ backgroundColor: "var(--purple-primary)" }}
          >
            {publishing ? (isPublished ? "Updating…" : "Publishing…") : isPublished ? "Update post" : "Publish"}
          </button>
        </div>
        {isPublished && (
          <button
            type="button"
            onClick={onUnpublish}
            disabled={publishing || unpublishing || savingDraft}
            className="w-full rounded-pill border px-4 py-3 text-sm font-semibold transition disabled:opacity-60"
            style={{ borderColor: "var(--danger-strong)", color: "var(--danger-strong)" }}
          >
            {unpublishing ? "Unpublishing…" : "Unpublish"}
          </button>
        )}
      </aside>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium text-ink-heading">
        <span>{label}</span>
        {hint && <span className="text-xs font-normal text-[var(--color-text-secondary)]">{hint}</span>}
      </label>
      {children}
    </div>
  )
}
