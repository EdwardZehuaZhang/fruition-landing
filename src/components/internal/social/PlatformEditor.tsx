"use client"

import { useId, useRef, useState } from "react"
import { FileText, Loader2, Upload, X } from "lucide-react"
import { useCaretInsert } from "@/lib/social/caret"
import { parseMentions, renderedLength, supportsTagging } from "@/lib/social/mentions"
import { shorteningSaving } from "@/lib/social/shortLinkText"
import EmojiPicker from "@/components/internal/social/EmojiPicker"
import TagPicker from "@/components/internal/social/TagPicker"
import { Button } from "@/components/ui/button"

/**
 * The editing surface for one platform's post: title, subreddit, caption,
 * emoji, tags, image choice, an optional PDF, live character count, and the
 * platform's own limitations.
 *
 * Deliberately presentational — value in, patch out. Both surfaces that write
 * social posts (the blog's Social tab and the standalone composer) render this
 * so the fiddly part, counting characters and stating what each channel allows,
 * exists once and can't drift between them. Card chrome, status and actions
 * belong to the caller, because those genuinely differ.
 *
 * Capabilities the caller can't support are opted into rather than assumed:
 * a blog's social drafts take their images from the article, so they pass no
 * upload or remove handler and those controls simply don't appear.
 */

export interface PlatformEditorSpec {
  key: string
  label: string
  limit: number
  titleLimit?: number
  titleRequired?: boolean
  needsMedia: boolean
  supportsMedia: boolean
  /** LinkedIn: a PDF posts as a swipeable carousel, in place of an image. */
  supportsDocument?: boolean
  notes: string[]
}

export interface PlatformEditorValue {
  content: string
  title?: string
  subreddit?: string
  /** "" = deliberately no image. */
  mediaUrl?: string
  /** "" = deliberately no PDF. */
  documentUrl?: string
  documentName?: string
}

export default function PlatformEditor({
  spec,
  value,
  images,
  disabled = false,
  uploading = false,
  uploadingDocument = false,
  shortenLinks = false,
  onChange,
  onUpload,
  onUploadDocument,
  onRemoveImage,
}: {
  spec: PlatformEditorSpec
  value: PlatformEditorValue
  /** Selectable images (uploads, blog cover, body images). */
  images: string[]
  disabled?: boolean
  /** An upload for THIS channel is in flight. */
  uploading?: boolean
  uploadingDocument?: boolean
  /** Links will be swapped for short ones at send time — affects the count. */
  shortenLinks?: boolean
  onChange: (patch: Partial<PlatformEditorValue>) => void
  /** Upload straight into this channel. Omitted where the caller has no store. */
  onUpload?: (file: File) => void
  /** Attach a PDF to this channel. Omitted where the caller has no store. */
  onUploadDocument?: (file: File) => void
  /** Drop an image from the post entirely, not just from this channel. */
  onRemoveImage?: (url: string) => void
}) {
  const [showLimits, setShowLimits] = useState(false)
  const limitsId = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const docInput = useRef<HTMLInputElement>(null)
  const body = useRef<HTMLTextAreaElement>(null)

  const content = value.content ?? ""
  const title = value.title ?? ""
  const media = value.mediaUrl ?? ""
  const documentUrl = value.documentUrl ?? ""
  const titleOver = spec.titleLimit ? title.length - spec.titleLimit : 0
  const hasTitle = Boolean(spec.titleLimit)
  const isReddit = spec.key === "reddit"
  // Narrowed here rather than inline so the picker gets a literal key type.
  const tagKey = supportsTagging(spec.key) ? spec.key : null

  /**
   * Three lengths, and they matter for different reasons. What's in the box is
   * neither of the useful ones: a LinkedIn tag is markup carrying the account's
   * id (longer than it reads), and a link is swapped for a short one on the way
   * out (shorter than it reads). `sent` is what the platform's limit applies
   * to; `reads` is what a person will see, so that's the number on the meter.
   */
  const saved = shortenLinks ? shorteningSaving(content) : 0
  const sent = content.length - saved
  const reads = renderedLength(content) - saved
  const over = sent - spec.limit
  const mentions = parseMentions(content)

  // A PDF displaces the image: LinkedIn posts one or the other, never both.
  const showImages = spec.supportsMedia && !documentUrl
  // Whatever is attached stays selectable even if it's no longer in the library.
  const choices = media && !images.includes(media) ? [media, ...images] : images

  const caret = useCaretInsert(body, (next) => onChange({ content: next }))

  /** Cut one tag's markup out of the caption, leaving the rest untouched. */
  function dropMention(start: number, end: number) {
    const before = content.slice(0, start)
    const after = content.slice(end)
    // Tidy only the gap the tag left behind. Collapsing every double space in
    // the caption would quietly reformat deliberate spacing somewhere else.
    const seam = /\s$/.test(before) && /^[ \t]/.test(after) ? after.replace(/^[ \t]+/, "") : after
    onChange({ content: before + seam })
  }

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

      {/* Writing tools sit above the box they act on, so it's obvious what they act on. */}
      <div className="flex items-center justify-end gap-1">
        {tagKey && (
          <TagPicker
            platformKey={tagKey}
            onPick={caret.insert}
            onClose={caret.restore}
            disabled={disabled}
          />
        )}
        <EmojiPicker onPick={caret.insert} onClose={caret.restore} disabled={disabled} />
      </div>

      <textarea
        ref={body}
        value={content}
        onChange={(e) => onChange({ content: e.target.value })}
        onSelect={caret.remember}
        onKeyUp={caret.remember}
        onClick={caret.remember}
        rows={spec.key === "twitter" ? 4 : 6}
        placeholder={`What goes out on ${spec.label}`}
        disabled={disabled}
        aria-invalid={over > 0 || undefined}
        className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:opacity-60 aria-invalid:border-destructive"
      />

      {mentions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Tagged</span>
          {mentions.map((m) => (
            <span
              key={`${m.urn}-${m.start}`}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-0.5 pl-2 pr-1 text-xs text-primary"
            >
              @{m.displayName}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => dropMention(m.start, m.end)}
                  aria-label={`Remove the tag for ${m.displayName}`}
                  className="rounded-full p-0.5 transition hover:bg-primary/20"
                >
                  <X className="size-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {spec.supportsDocument && onUploadDocument && (
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">PDF carousel</span>
            <input
              ref={docInput}
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,application/pdf"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onUploadDocument(file)
                e.target.value = ""
              }}
            />
            {!documentUrl && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                disabled={disabled || uploadingDocument}
                onClick={() => docInput.current?.click()}
              >
                {uploadingDocument ? <Loader2 className="animate-spin" /> : <FileText />}
                Attach PDF
              </Button>
            )}
          </div>
          {documentUrl ? (
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <a
                href={documentUrl}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1 truncate text-xs font-medium text-foreground underline-offset-2 hover:underline"
              >
                {value.documentName || "Attached document"}
              </a>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onChange({ documentUrl: "", documentName: "" })}
                >
                  <X />
                  Remove
                </Button>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              A PDF posts as a swipeable carousel — and replaces the image on this channel.
            </p>
          )}
        </div>
      )}

      {showImages && (
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Image{spec.needsMedia ? " · required" : ""}
            </span>
            {onUpload && (
              <>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onUpload(file)
                    e.target.value = ""
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  disabled={disabled || uploading}
                  onClick={() => fileInput.current?.click()}
                >
                  {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                  Upload
                </Button>
              </>
            )}
          </div>
          {choices.length === 0 && !spec.needsMedia && (
            <p className="text-xs text-muted-foreground">No image. Upload one for this channel.</p>
          )}
          {choices.length === 0 && spec.needsMedia && (
            <p className="text-xs text-destructive">{spec.label} won&apos;t publish without an image — upload one.</p>
          )}
          {choices.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {choices.map((url) => {
                const active = media === url
                return (
                  <span key={url} className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => onChange({ mediaUrl: url })}
                      disabled={disabled}
                      aria-pressed={active}
                      title="Use this image"
                      className={`block rounded-md border-2 transition disabled:opacity-60 ${
                        active ? "border-primary" : "border-border hover:border-primary/40"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-14 w-14 rounded-[4px] object-cover" />
                    </button>
                    {onRemoveImage && !disabled && (
                      <button
                        type="button"
                        onClick={() => onRemoveImage(url)}
                        aria-label="Delete this image from the post"
                        title="Delete from the post"
                        className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:border-destructive hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </span>
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
          title={
            reads === sent
              ? undefined
              : `${sent} characters actually sent — tag ids add, shortened links subtract`
          }
        >
          {reads}/{spec.limit}
          {reads === sent ? "" : ` · ${sent} sent`}
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
