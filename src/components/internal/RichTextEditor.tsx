"use client"

import { useEffect, useRef, useState } from "react"
import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react"
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
  Undo2,
  Redo2,
} from "lucide-react"
import { parseVideoUrl, providerLabel } from "@/lib/videoEmbed"
import { blogEditorExtensions, MAX_BODY_IMAGE_BYTES } from "@/lib/blogEditorExtensions"

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

function Toolbar({ editor }: { editor: Editor }) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

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
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })

  async function onImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      window.alert("Choose an image file.")
      return
    }
    if (file.size > MAX_BODY_IMAGE_BYTES) {
      window.alert("Image exceeds 8 MB.")
      return
    }
    const defaultAlt = file.name
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[-_]+/g, " ")
      .trim()
    const alt = window.prompt("Image alt text (helps SEO)", defaultAlt)
    if (alt === null) return
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.set("image", file)
      const r = await fetch("/api/internal/blog/image", { method: "POST", body: fd })
      const data = (await r.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!r.ok || !data.url) {
        window.alert(data.error ?? "Image upload failed.")
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(editor.chain().focus() as any).setBlogImage({ src: data.url, alt: alt.trim() }).run()
    } catch {
      window.alert("Image upload failed.")
    } finally {
      setUploadingImage(false)
    }
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
        label={uploadingImage ? "Uploading image…" : "Insert image"}
        disabled={uploadingImage}
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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: blogEditorExtensions(),
    content: value || "",
    editorProps: {
      attributes: {
        class: "blog-tiptap focus:outline-none",
        "aria-label": "Post body",
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

  return (
    <div
      className="overflow-hidden rounded-chip border bg-surface"
      style={{ borderColor: "var(--color-border)" }}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent
        editor={editor}
        data-placeholder={placeholder}
        className="min-h-[640px] px-4 py-3 text-sm"
      />
    </div>
  )
}

export { providerLabel }
