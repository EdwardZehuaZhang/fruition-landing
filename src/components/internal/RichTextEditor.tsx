"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core"
import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react"
import { TextSelection } from "@tiptap/pm/state"
import type { EditorView } from "@tiptap/pm/view"
import StarterKit from "@tiptap/starter-kit"
import Youtube from "@tiptap/extension-youtube"
import { TableKit } from "@tiptap/extension-table"
import { Markdown } from "tiptap-markdown"
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Video,
  Table as TableIcon,
  Type,
  Undo2,
  Redo2,
} from "lucide-react"
import { parseVideoUrl, videoEmbedSrc, providerLabel } from "@/lib/videoEmbed"

/* ------------------------------------------------------------------ */
/*  Custom inline video node (Vimeo / Twitch / Loom)                   */
/*  YouTube is handled by the official @tiptap/extension-youtube.      */
/*  All video nodes serialise to a bare canonical URL on its own line, */
/*  which the publish pipeline turns into a Sanity `videoEmbed` block. */
/* ------------------------------------------------------------------ */

// Mirror of the server-side limit in /api/internal/blog/image.
const MAX_BODY_IMAGE_BYTES = 8 * 1024 * 1024

// Global paste matchers, one per non-YouTube provider.
const VIMEO_PASTE = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:video\/)?\d+\S*/gi
const TWITCH_PASTE = /(?:https?:\/\/)?(?:www\.|clips\.)?twitch\.tv\/\S+/gi
const LOOM_PASTE = /(?:https?:\/\/)?(?:www\.)?loom\.com\/(?:share|embed)\/[\w-]+\S*/gi

/* ------------------------------------------------------------------ */
/*  Image ingestion                                                    */
/*  Three ways in — the toolbar button, a drag from the desktop or      */
/*  another tab, and a paste. All of them end at the same endpoint, so  */
/*  the body only ever references Sanity-hosted images: a remote URL    */
/*  left in the markdown publishes as a stray `!` plus a link rather    */
/*  than a picture (see sideloadBodyImages).                            */
/* ------------------------------------------------------------------ */

/** URLs worth handing to the server as an image, when all we have is a link. */
const IMAGE_URL_HINT = /\.(?:png|jpe?g|gif|webp|avif|bmp|svg)(?:[?#]|$)/i
/** monday keeps item images behind `…/resources/<assetId>/…`, extension-free. */
const IMAGE_HOST_HINT = /(?:cdn\.sanity\.io|cloudinary\.com|\/resources\/\d+\/)/i

/** One image waiting to be uploaded — either local bytes or a remote URL. */
interface PendingImage {
  file?: File
  url?: string
  alt: string
}

function altFromFilename(name: string): string {
  return name
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim()
}

async function postImage(init: RequestInit): Promise<string> {
  const r = await fetch("/api/internal/blog/image", init)
  const data = (await r.json().catch(() => ({}))) as { url?: string; error?: string }
  if (!r.ok || !data.url) throw new Error(data.error ?? "Image upload failed.")
  return data.url
}

/** Upload local bytes and get back the Sanity CDN URL. */
async function uploadImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("That file isn't an image.")
  if (file.size > MAX_BODY_IMAGE_BYTES) throw new Error("Image exceeds 8 MB.")
  const fd = new FormData()
  fd.set("image", file)
  return postImage({ method: "POST", body: fd })
}

/** Ask the server to fetch an image hosted elsewhere and re-host it in Sanity. */
async function uploadImageUrl(url: string): Promise<string> {
  return postImage({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })
}

function looksLikeImageUrl(raw: string): boolean {
  if (!/^https?:\/\/\S+$/i.test(raw)) return false
  return IMAGE_URL_HINT.test(raw) || IMAGE_HOST_HINT.test(raw)
}

/** Every image file on a clipboard or drag payload (screenshots, Finder drags). */
function imageFilesFrom(dt: DataTransfer): PendingImage[] {
  return Array.from(dt.files ?? [])
    .filter((f) => f.type.startsWith("image/"))
    .map((f) => ({ file: f, alt: altFromFilename(f.name) }))
}

/**
 * A payload that is *only* a reference to one image — a lone `<img>`, a
 * uri-list, or a bare image URL. Mixed rich text (an excerpt with pictures in
 * it) returns null so the normal paste keeps the words.
 */
function loneImageRefFrom(dt: DataTransfer): PendingImage | null {
  const html = dt.getData("text/html")
  if (html) {
    const doc = new DOMParser().parseFromString(html, "text/html")
    const imgs = doc.querySelectorAll("img[src]")
    if (imgs.length !== 1 || doc.body.textContent?.trim()) return null
    const src = imgs[0].getAttribute("src") ?? ""
    if (!/^https?:\/\//i.test(src)) return null
    return { url: src, alt: (imgs[0].getAttribute("alt") ?? "").trim() }
  }
  const text = (dt.getData("text/uri-list") || dt.getData("text/plain") || "").trim()
  // uri-list can hold several lines; the first non-comment one is the target.
  const first = text.split(/\r?\n/).find((l) => l && !l.startsWith("#"))?.trim() ?? ""
  return looksLikeImageUrl(first) ? { url: first, alt: "" } : null
}

/** What a paste or drop carries, if it carries an image at all. */
function imagesFrom(dt: DataTransfer | null): PendingImage[] {
  if (!dt) return []
  const files = imageFilesFrom(dt)
  if (files.length > 0) return files
  const ref = loneImageRefFrom(dt)
  return ref ? [ref] : []
}

/**
 * True while a drag carries something we would ingest — used only to light up
 * the editor border, so a false positive costs nothing.
 */
function dragHasImage(dt: DataTransfer | null): boolean {
  if (!dt) return false
  return Array.from(dt.types).some((t) => t === "Files" || t === "text/uri-list")
}

/**
 * Drop the image into the document at `pos`, splitting the block if the
 * cursor sits mid-paragraph. Returns the position just after it so a
 * multi-image paste stacks in order.
 */
function insertImageAt(view: EditorView, pos: number, src: string, alt: string): number {
  const type = view.state.schema.nodes.image
  if (!type) return pos
  const at = Math.min(Math.max(pos, 0), view.state.doc.content.size)
  const tr = view.state.tr
  tr.setSelection(TextSelection.near(tr.doc.resolve(at)))
  tr.replaceSelectionWith(type.create({ src, alt: alt || null }))
  view.dispatch(tr.scrollIntoView())
  return view.state.selection.to
}

/** Host allowed to embed players in the editor (Twitch needs it). */
function browserParents(): string[] | undefined {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return [window.location.hostname]
  }
  return undefined
}

const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return { HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      src: { default: null as string | null },
      provider: { default: null as string | null },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video-embed]",
        getAttrs: (el) => ({
          src: (el as HTMLElement).getAttribute("data-src"),
          provider: (el as HTMLElement).getAttribute("data-provider"),
        }),
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const src: string = node.attrs.src || ""
    const parsed = parseVideoUrl(src)
    const iframeSrc = parsed ? videoEmbedSrc(parsed, { parents: browserParents() }) : ""
    return [
      "div",
      mergeAttributes(
        {
          "data-video-embed": "",
          "data-src": src,
          "data-provider": node.attrs.provider ?? parsed?.provider ?? "",
          class: "blog-video-embed",
        },
        HTMLAttributes,
      ),
      [
        "iframe",
        {
          src: iframeSrc,
          frameborder: "0",
          allowfullscreen: "true",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        },
      ],
    ]
  },

  addCommands() {
    return {
      setVideoEmbed:
        (attrs: { src: string; provider?: string }) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ commands }: any) =>
          commands.insertContent({ type: this.name, attrs }),
    } as never
  },

  addPasteRules() {
    const rule = (find: RegExp) =>
      nodePasteRule({
        find,
        type: this.type,
        getAttributes: (match) => {
          const parsed = parseVideoUrl(match[0])
          return parsed ? { src: parsed.canonicalUrl, provider: parsed.provider } : null
        },
      })
    return [rule(VIMEO_PASTE), rule(TWITCH_PASTE), rule(LOOM_PASTE)]
  },

  addStorage() {
    return {
      markdown: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serialize(state: any, node: any) {
          state.write(node.attrs.src || "")
          state.closeBlock(node)
        },
        parse: {},
      },
    }
  },
})

/* ------------------------------------------------------------------ */
/*  Body image node                                                    */
/*  Serialises to a lone `![alt](url)` line; the publish pipeline      */
/*  (bodyToPortableText) turns Sanity-CDN image lines into `image`     */
/*  blocks, and portableTextToMarkdown round-trips them back.          */
/* ------------------------------------------------------------------ */
const BlogImage = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null as string | null },
      alt: { default: null as string | null },
    }
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (el) => ({
          src: (el as HTMLElement).getAttribute("src"),
          alt: (el as HTMLElement).getAttribute("alt"),
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes, { class: "blog-body-image" })]
  },

  addCommands() {
    return {
      setBlogImage:
        (attrs: { src: string; alt?: string }) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ commands }: any) =>
          commands.insertContent({ type: this.name, attrs }),
    } as never
  },

  addStorage() {
    return {
      markdown: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serialize(state: any, node: any) {
          // Keep alt text safe for the `![alt](url)` form (and for the
          // publish pipeline's lone-image regex, which stops at `]`).
          const alt = String(node.attrs.alt ?? "")
            .replace(/[[\]\n]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
          state.write(`![${alt}](${node.attrs.src ?? ""})`)
          state.closeBlock(node)
        },
        parse: {},
      },
    }
  },
})

// YouTube node + markdown serialisation (bare URL on its own line).
const YoutubeWithMarkdown = Youtube.extend({
  addStorage() {
    return {
      ...this.parent?.(),
      markdown: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serialize(state: any, node: any) {
          state.write(node.attrs.src || "")
          state.closeBlock(node)
        },
        parse: {},
      },
    }
  },
})

/* ------------------------------------------------------------------ */
/*  Load-time normalisation                                            */
/*  A saved draft is markdown, so a video lives as a bare URL line.    */
/*  tiptap-markdown parses that into a paragraph (or autolink), not a  */
/*  player. Convert those paragraphs back into video nodes on load.    */
/* ------------------------------------------------------------------ */
function normalizeVideoNodes(editor: Editor) {
  const { state } = editor
  const { doc, schema } = state
  const hits: { from: number; to: number; provider: string; src: string; embed: string }[] = []

  doc.descendants((node, pos) => {
    if (node.type.name !== "paragraph") return
    const text = node.textContent.trim()
    // Mirror the backend's "URL alone on a line" rule.
    if (!text || /\s/.test(text)) return
    const parsed = parseVideoUrl(text)
    if (!parsed) return
    hits.push({
      from: pos,
      to: pos + node.nodeSize,
      provider: parsed.provider,
      src: parsed.canonicalUrl,
      embed: parsed.canonicalUrl,
    })
  })

  if (hits.length === 0) return

  let tr = state.tr
  // Apply back-to-front so earlier positions stay valid.
  for (const hit of hits.reverse()) {
    const vnode =
      hit.provider === "youtube" && schema.nodes.youtube
        ? schema.nodes.youtube.create({ src: hit.src })
        : schema.nodes.videoEmbed?.create({ src: hit.src, provider: hit.provider })
    if (vnode) tr = tr.replaceWith(hit.from, hit.to, vnode)
  }
  if (tr.docChanged) editor.view.dispatch(tr.setMeta("addToHistory", false))
}

/* ------------------------------------------------------------------ */
/*  Toolbar                                                            */
/* ------------------------------------------------------------------ */
function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className="flex size-8 items-center justify-center rounded-chip border text-ink-heading transition disabled:opacity-40"
      style={{
        borderColor: active ? "var(--purple-primary)" : "var(--color-border)",
        backgroundColor: active ? "rgba(128,21,232,0.10)" : "transparent",
        color: active ? "var(--purple-primary)" : "var(--ink-heading)",
      }}
    >
      {children}
    </button>
  )
}

function TableTextButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="rounded px-1.5 py-0.5 text-xs font-medium text-ink-heading transition hover:bg-[rgba(128,21,232,0.10)]"
    >
      {children}
    </button>
  )
}

function Toolbar({
  editor,
  onImageFile,
  uploading,
}: {
  editor: Editor
  onImageFile: (file: File) => void | Promise<void>
  uploading: boolean
}) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Tiptap v3 doesn't re-render React on selection changes by default, so
  // reading editor.isActive() during render goes stale: the table strip (and
  // active highlights) lingered until the next content edit — e.g. clicking
  // Bold — made them vanish mid-action. useEditorState subscribes to every
  // transaction, keeping the toolbar in sync with the actual cursor position.
  const ui = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      h4: e.isActive("heading", { level: 4 }),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      blockquote: e.isActive("blockquote"),
      link: e.isActive("link"),
      table: e.isActive("table"),
      image: e.isActive("image"),
      imageAlt: (e.getAttributes("image").alt as string | null) ?? "",
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })

  // Pasted and dropped images land with a guessed alt (filename, or whatever
  // the source `<img>` carried), so the selected image needs a way to fix it.
  function editAlt() {
    const next = window.prompt("Image alt text (helps SEO)", ui.imageAlt)
    if (next === null) return
    editor.chain().focus().updateAttributes("image", { alt: next.trim() || null }).run()
  }

  function addLink() {
    const prev = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("Link URL", prev ?? "https://")
    if (url === null) return
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run()
  }

  function addVideo() {
    const url = window.prompt("Video URL (YouTube, Vimeo, Twitch, or Loom)")
    if (!url) return
    const parsed = parseVideoUrl(url)
    if (!parsed) {
      window.alert("Unrecognised video URL. Supported: YouTube, Vimeo, Twitch, Loom.")
      return
    }
    if (parsed.provider === "youtube") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(editor.chain().focus() as any).setYoutubeVideo({ src: parsed.canonicalUrl }).run()
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(editor.chain().focus() as any)
        .setVideoEmbed({ src: parsed.canonicalUrl, provider: parsed.provider })
        .run()
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 border-b p-2"
      style={{ borderColor: "var(--color-border)" }}
    >
      <ToolbarButton
        label="Bold"
        active={ui.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={ui.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px" style={{ backgroundColor: "var(--color-border)" }} />
      <ToolbarButton
        label="Heading 2"
        active={ui.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={ui.h3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 4"
        active={ui.h4}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading4 size={16} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px" style={{ backgroundColor: "var(--color-border)" }} />
      <ToolbarButton
        label="Bullet list"
        active={ui.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={ui.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={ui.blockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px" style={{ backgroundColor: "var(--color-border)" }} />
      <ToolbarButton label="Link" active={ui.link} onClick={addLink}>
        <LinkIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label={uploading ? "Uploading image…" : "Insert image (or paste / drag one in)"}
        disabled={uploading}
        onClick={() => imageInputRef.current?.click()}
      >
        <ImagePlus size={16} />
      </ToolbarButton>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          // Reset so choosing the same file twice re-fires onChange.
          e.target.value = ""
          if (file) void onImageFile(file)
        }}
      />
      <ToolbarButton label="Embed video" onClick={addVideo}>
        <Video size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Insert table"
        active={ui.table}
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <TableIcon size={16} />
      </ToolbarButton>

      {ui.image && (
        <span
          className="ml-1 flex items-center gap-1 rounded-chip border px-1.5 py-1"
          style={{ borderColor: "var(--purple-primary)" }}
        >
          <Type size={14} style={{ color: "var(--purple-primary)" }} aria-hidden />
          <TableTextButton onClick={editAlt}>
            {ui.imageAlt ? `Alt: ${ui.imageAlt.slice(0, 24)}` : "Add alt text"}
          </TableTextButton>
        </span>
      )}

      {ui.table && (
        <span
          className="ml-1 flex flex-wrap items-center gap-1 rounded-chip border px-1.5 py-1"
          style={{ borderColor: "var(--purple-primary)" }}
        >
          <TableTextButton onClick={() => editor.chain().focus().addColumnAfter().run()}>
            +Col
          </TableTextButton>
          <TableTextButton onClick={() => editor.chain().focus().addRowAfter().run()}>
            +Row
          </TableTextButton>
          <TableTextButton onClick={() => editor.chain().focus().deleteColumn().run()}>
            −Col
          </TableTextButton>
          <TableTextButton onClick={() => editor.chain().focus().deleteRow().run()}>
            −Row
          </TableTextButton>
          <TableTextButton onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
            Header
          </TableTextButton>
          <TableTextButton onClick={() => editor.chain().focus().deleteTable().run()}>
            Delete
          </TableTextButton>
        </span>
      )}

      <span className="mx-1 h-5 w-px" style={{ backgroundColor: "var(--color-border)" }} />
      <ToolbarButton
        label="Undo"
        disabled={!ui.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!ui.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={16} />
      </ToolbarButton>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Editor                                                             */
/* ------------------------------------------------------------------ */
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  /** Markdown string. */
  value: string
  /** Called with the serialised markdown on every change. */
  onChange: (markdown: string) => void
  placeholder?: string
}) {
  // Last markdown this editor emitted, so the controlled-`value` effect can
  // tell an external replacement (load a draft) from its own round-trip and
  // avoid needless setContent() calls that would jump the cursor.
  const lastEmitted = useRef(value)
  // Uploads in flight, so several pasted images share one "Uploading…" state.
  const [uploads, setUploads] = useState(0)
  const [imageError, setImageError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  /**
   * Upload each image and insert it at `pos`, in order. One failure reports
   * itself and the rest of the batch carries on.
   */
  const ingestImages = useCallback(
    async (view: EditorView, pos: number, items: PendingImage[]) => {
      setImageError(null)
      setUploads((n) => n + items.length)
      let at = pos
      for (const item of items) {
        try {
          const url = item.file
            ? await uploadImageFile(item.file)
            : await uploadImageUrl(item.url ?? "")
          at = insertImageAt(view, at, url, item.alt)
        } catch (err) {
          setImageError(err instanceof Error ? err.message : "Image upload failed.")
        } finally {
          setUploads((n) => n - 1)
        }
      }
    },
    [],
  )

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        // Keep the mark/style set aligned with the publish pipeline
        // (bodyToPortableText) — no strike / code / rule.
        strike: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          // No automatic links. Bare text like "monday.com" or a pasted URL
          // stays plain text; a hyperlink is only ever created deliberately
          // via the toolbar Link button (addLink -> setLink), which goes
          // through setLink and is unaffected by these three flags.
          // All three matter: `autolink` covers typing, `linkOnPaste` the
          // paste handler, and `shouldAutoLink` the extension's paste *rule*,
          // which linkifies URLs in any pasted text on its own.
          autolink: false,
          linkOnPaste: false,
          shouldAutoLink: () => false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      YoutubeWithMarkdown.configure({
        width: 640,
        height: 360,
        nocookie: false,
        modestBranding: true,
        rel: 0,
      }),
      VideoEmbed,
      BlogImage,
      TableKit.configure({
        table: { resizable: true, HTMLAttributes: { class: "blog-tiptap-table" } },
      }),
      Markdown.configure({
        html: false,
        // markdown-it's linkify would turn bare domains/URLs in a loaded draft
        // into links on parse, which then serialise back out as real
        // `[text](url)` markdown and publish as link markDefs. Only explicit
        // markdown links become links.
        linkify: false,
        breaks: false,
        transformPastedText: false,
        transformCopiedText: false,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "blog-tiptap focus:outline-none",
        "aria-label": "Post body",
      },
      // Paste an image — a screenshot, a copied picture, or a copied image
      // address. Anything else (text, a link, mixed rich text) falls through
      // to the normal paste.
      handlePaste(view, event) {
        const items = imagesFrom(event.clipboardData)
        if (items.length === 0) return false
        event.preventDefault()
        void ingestImages(view, view.state.selection.from, items)
        return true
      },
      // Drag a file off the desktop, or an image out of another tab, and drop
      // it where the cursor is. `moved` means an image already in the document
      // is being re-ordered — that is ProseMirror's job, not ours.
      handleDrop(view, event, _slice, moved) {
        if (moved) return false
        const items = imagesFrom(event.dataTransfer)
        if (items.length === 0) return false
        event.preventDefault()
        setDragActive(false)
        const at =
          view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ??
          view.state.selection.from
        void ingestImages(view, at, items)
        return true
      },
    },
    onCreate({ editor }) {
      normalizeVideoNodes(editor as Editor)
    },
    onUpdate({ editor }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const md = (editor.storage as any).markdown.getMarkdown() as string
      lastEmitted.current = md
      onChange(md)
    },
  })

  // Sync only when the parent replaces `value` from the outside (e.g. loading a
  // different draft into an already-mounted editor). Our own edits set
  // `lastEmitted` first, so those never re-enter setContent.
  useEffect(() => {
    if (!editor) return
    if (value !== lastEmitted.current) {
      lastEmitted.current = value
      editor.commands.setContent(value || "")
      normalizeVideoNodes(editor)
    }
  }, [value, editor])

  /** Toolbar button: same pipeline as a paste, but alt text is asked for up front. */
  async function insertImageFromToolbar(file: File) {
    if (!editor) return
    const alt = window.prompt("Image alt text (helps SEO)", altFromFilename(file.name))
    if (alt === null) return
    await ingestImages(editor.view, editor.state.selection.from, [{ file, alt: alt.trim() }])
  }

  return (
    <div
      className="overflow-hidden rounded-chip border bg-surface"
      style={{ borderColor: dragActive ? "var(--purple-primary)" : "var(--color-border)" }}
      onDragOver={(e) => {
        if (dragHasImage(e.dataTransfer)) setDragActive(true)
      }}
      onDragLeave={(e) => {
        // Ignore the dragleave fired when crossing between child elements.
        const next = e.relatedTarget
        if (!(next instanceof HTMLElement) || !e.currentTarget.contains(next)) setDragActive(false)
      }}
      onDrop={() => setDragActive(false)}
    >
      {editor && (
        <Toolbar editor={editor} onImageFile={insertImageFromToolbar} uploading={uploads > 0} />
      )}
      <EditorContent
        editor={editor}
        data-placeholder={placeholder}
        className="min-h-[640px] px-4 py-3 text-sm"
      />
      {(uploads > 0 || imageError || dragActive) && (
        <p
          className="border-t px-4 py-2 text-xs"
          style={{
            borderColor: "var(--color-border)",
            color: imageError ? "var(--danger-strong)" : "var(--color-text-secondary)",
          }}
          role="status"
        >
          {uploads > 0
            ? `Uploading ${uploads} image${uploads > 1 ? "s" : ""}…`
            : imageError
              ? imageError
              : "Drop to add the image here."}
        </p>
      )}
    </div>
  )
}

export { providerLabel }
