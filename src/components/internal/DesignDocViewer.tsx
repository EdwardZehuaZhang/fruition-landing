"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, Download, Loader2, Pencil, Printer, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  id: string
  title: string
  html: string
  sourceFilename?: string | null
}

/** Preview a generated design document, export it (print → PDF), rename, delete. */
export default function DesignDocViewer({ id, title: initialTitle, html, sourceFilename }: Props) {
  const router = useRouter()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [title, setTitle] = React.useState(initialTitle)
  const [editing, setEditing] = React.useState(false)
  const [busy, setBusy] = React.useState<"rename" | "delete" | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  function exportPdf() {
    iframeRef.current?.contentWindow?.print()
  }

  function downloadHtml() {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/[^\w\- ]+/g, "").trim() || "fruition-document"}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function rename() {
    setBusy("rename")
    setError(null)
    try {
      const res = await fetch(`/api/internal/design/docs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) throw new Error(((await res.json()) as { error?: string }).error || "Rename failed.")
      setEditing(false)
      router.refresh()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  async function remove() {
    if (!window.confirm("Delete this design document? This cannot be undone.")) return
    setBusy("delete")
    setError(null)
    try {
      const res = await fetch(`/api/internal/design/docs/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(((await res.json()) as { error?: string }).error || "Delete failed.")
      router.push("/internal/design")
      router.refresh()
    } catch (e) {
      setError((e as Error).message)
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-surface p-4 sm:p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="min-w-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 w-72"
                autoFocus
              />
              <Button size="sm" onClick={rename} disabled={busy === "rename"}>
                {busy === "rename" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                Save
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="group flex items-center gap-2 text-left"
              onClick={() => setEditing(true)}
              title="Rename"
            >
              <h1 className="truncate text-xl font-semibold text-ink-heading">{title}</h1>
              <Pencil className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )}
          {sourceFilename && (
            <p className="mt-0.5 text-xs text-muted-foreground">From {sourceFilename}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportPdf}>
            <Printer className="size-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={downloadHtml}>
            <Download className="size-4" />
            HTML
          </Button>
          <Button variant="outline" onClick={remove} disabled={busy === "delete"}>
            {busy === "delete" ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div
        className="rounded-card bg-surface p-2 sm:p-3"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* same-origin needed so Export PDF can call contentWindow.print(); no scripts allowed */}
        <iframe
          ref={iframeRef}
          title={title}
          sandbox="allow-same-origin allow-modals"
          srcDoc={html}
          className="h-[80vh] w-full rounded-[calc(var(--radius-card)-8px)] border border-[var(--color-border)] bg-white"
        />
      </div>
    </div>
  )
}
