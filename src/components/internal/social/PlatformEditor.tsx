"use client"

import { useId, useState } from "react"

/**
 * The editing surface for one platform's post: title, subreddit, caption,
 * image choice, live character count, and the platform's own limitations.
 *
 * Deliberately presentational — value in, patch out. Both surfaces that write
 * social posts (the blog's Social tab and the standalone composer) render this
 * so the fiddly part, counting characters and stating what each channel allows,
 * exists once and can't drift between them. Card chrome, status and actions
 * belong to the caller, because those genuinely differ.
 */

export interface PlatformEditorSpec {
  key: string
  label: string
  limit: number
  titleLimit?: number
  titleRequired?: boolean
  needsMedia: boolean
  supportsMedia: boolean
  notes: string[]
}

export interface PlatformEditorValue {
  content: string
  title?: string
  subreddit?: string
  /** "" = deliberately no image. */
  mediaUrl?: string
}

export default function PlatformEditor({
  spec,
  value,
  images,
  disabled = false,
  onChange,
}: {
  spec: PlatformEditorSpec
  value: PlatformEditorValue
  /** Selectable images (uploads, blog cover, body images). */
  images: string[]
  disabled?: boolean
  onChange: (patch: Partial<PlatformEditorValue>) => void
}) {
  const [showLimits, setShowLimits] = useState(false)
  const limitsId = useId()

  const content = value.content ?? ""
  const title = value.title ?? ""
  const media = value.mediaUrl ?? ""
  const over = content.length - spec.limit
  const titleOver = spec.titleLimit ? title.length - spec.titleLimit : 0
  const hasTitle = Boolean(spec.titleLimit)
  const isReddit = spec.key === "reddit"

  // Whatever is attached stays selectable even if it's no longer in the library.
  const choices = media && !images.includes(media) ? [media, ...images] : images

  return (
    <div className="space-y-2">
      {hasTitle && (
        <div>
          <input
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder={`${spec.label} title${spec.titleRequired ? " (required)" : ""}`}
            disabled={disabled}
            aria-invalid={titleOver > 0 || undefined}
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:opacity-60 aria-invalid:border-destructive"
          />
          {titleOver > 0 && (
            <p className="mt-1 text-xs text-destructive">
              Title is {titleOver} character{titleOver === 1 ? "" : "s"} over the {spec.titleLimit} limit.
            </p>
          )}
        </div>
      )}

      {isReddit && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">r/</span>
          <input
            value={value.subreddit ?? ""}
            onChange={(e) => onChange({ subreddit: e.target.value })}
            placeholder="account default"
            disabled={disabled}
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:opacity-60"
          />
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => onChange({ content: e.target.value })}
        rows={spec.key === "twitter" ? 4 : 6}
        placeholder={`What goes out on ${spec.label}`}
        disabled={disabled}
        aria-invalid={over > 0 || undefined}
        className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:opacity-60 aria-invalid:border-destructive"
      />

      {spec.supportsMedia && (
        <div>
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Image{spec.needsMedia ? " · required" : ""}
          </span>
          {choices.length === 0 && !spec.needsMedia && (
            <p className="text-xs text-muted-foreground">No images uploaded yet.</p>
          )}
          {choices.length === 0 && spec.needsMedia && (
            <p className="text-xs text-destructive">Upload an image above — {spec.label} won&apos;t publish without one.</p>
          )}
          {choices.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {choices.map((url) => {
                const active = media === url
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => onChange({ mediaUrl: url })}
                    disabled={disabled}
                    aria-pressed={active}
                    title="Use this image"
                    className={`shrink-0 rounded-md border-2 transition disabled:opacity-60 ${
                      active ? "border-primary" : "border-border hover:border-primary/40"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-14 w-14 rounded-[4px] object-cover" />
                  </button>
                )
              })}
              {!spec.needsMedia && (
                <button
                  type="button"
                  onClick={() => onChange({ mediaUrl: "" })}
                  disabled={disabled}
                  aria-pressed={media === ""}
                  className={`h-14 shrink-0 rounded-md border-2 px-3 text-xs font-medium transition disabled:opacity-60 ${
                    media === "" ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  No image
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={() => setShowLimits((v) => !v)}
          aria-expanded={showLimits}
          aria-controls={limitsId}
          className="text-xs font-medium text-muted-foreground underline-offset-2 transition hover:text-foreground hover:underline"
        >
          {showLimits ? "Hide" : "What"} {spec.label} allows
        </button>
        <span
          className={`font-mono text-xs tabular-nums ${over > 0 ? "text-destructive" : "text-muted-foreground"}`}
          aria-live="polite"
        >
          {content.length}/{spec.limit}
          {over > 0 ? ` · ${over} over` : ""}
        </span>
      </div>

      {showLimits && (
        <ul id={limitsId} className="space-y-1 rounded-md bg-muted px-3 py-2">
          {spec.notes.map((note) => (
            <li key={note} className="text-xs leading-relaxed text-muted-foreground">
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
