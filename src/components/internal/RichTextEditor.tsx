"use client"

import { useEffect, useRef } from "react"
import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Youtube from "@tiptap/extension-youtube"
import { TableKit } from "@tiptap/extension-table"
import { Markdown } from "tiptap-markdown"
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Video,
  Table as TableIcon,
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

// Global paste matchers, one per non-YouTube provider.
const VIMEO_PASTE = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:video\/)?\d+\S*/gi
const TWITCH_PASTE = /(?:https?:\/\/)?(?:www\.|clips\.)?twitch\.tv\/\S+/gi
const LOOM_PASTE = /(?:https?:\/\/)?(?:www\.)?loom\.com\/(?:share|embed)\/[\w-]+\S*/gi

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

function Toolbar({ editor }: { editor: Editor }) {
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
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px" style={{ backgroundColor: "var(--color-border)" }} />
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px" style={{ backgroundColor: "var(--color-border)" }} />
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px" style={{ backgroundColor: "var(--color-border)" }} />
      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={addLink}>
        <LinkIcon size={16} />
      </ToolbarButton>
      <ToolbarButton label="Embed video" onClick={addVideo}>
        <Video size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Insert table"
        active={editor.isActive("table")}
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <TableIcon size={16} />
      </ToolbarButton>

      {editor.isActive("table") && (
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
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
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
          autolink: true,
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
      TableKit.configure({
        table: { resizable: true, HTMLAttributes: { class: "blog-tiptap-table" } },
      }),
      Markdown.configure({
        html: false,
        linkify: true,
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
