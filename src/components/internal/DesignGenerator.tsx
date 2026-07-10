"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileUp, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MAX_PDF_BYTES = 10 * 1024 * 1024

type Phase = "idle" | "generating" | "saving" | "error"

/**
 * Upload a PDF → stream Claude's Fruition-branded HTML into a live preview →
 * save the finished document and route to its page.
 */
export default function DesignGenerator() {
  const router = useRouter()
  const [file, setFile] = React.useState<File | null>(null)
  const [title, setTitle] = React.useState("")
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [html, setHtml] = React.useState("")
  const [dragOver, setDragOver] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => () => abortRef.current?.abort(), [])

  function pickFile(f: File | undefined | null) {
    setError(null)
    if (!f) return
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported.")
      return
    }
    if (f.size > MAX_PDF_BYTES) {
      setError("PDF is too large (max 10 MB).")
      return
    }
    setFile(f)
  }

  async function generate() {
    if (!file || phase === "generating" || phase === "saving") return
    setError(null)
    setHtml("")
    setPhase("generating")
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const form = new FormData()
      form.set("file", file)
      if (title.trim()) form.set("title", title.trim())

      const res = await fetch("/api/internal/design/generate", {
        method: "POST",
        body: form,
        signal: controller.signal,
      })
      if (!res.ok || !res.body) {
        const msg = await res
          .json()
          .then((j: { error?: string }) => j.error)
          .catch(() => null)
        throw new Error(msg || `Generation failed (${res.status}).`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ""
      let lastPaint = 0
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        // Throttle iframe repaints — srcdoc replacement is expensive.
        const now = Date.now()
        if (now - lastPaint > 400) {
          lastPaint = now
          setHtml(acc)
        }
      }
      acc += decoder.decode()
      const finalHtml = cleanHtml(acc)
      if (!finalHtml) throw new Error("The model returned an empty document. Try again.")
      setHtml(finalHtml)

      setPhase("saving")
      const save = await fetch("/api/internal/design/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || file.name.replace(/\.pdf$/i, ""),
          html: finalHtml,
          source_filename: file.name,
        }),
      })
      const saved = (await save.json()) as { id?: string; error?: string }
      if (!save.ok || !saved.id) throw new Error(saved.error || "Failed to save the document.")
      router.push(`/internal/design/${saved.id}`)
    } catch (e) {
      if ((e as Error).name === "AbortError") return
      setError((e as Error).message)
      setPhase("error")
    }
  }

  const busy = phase === "generating" || phase === "saving"

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-card bg-surface p-6 sm:p-8"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <h1 className="text-2xl font-semibold text-ink-heading">New design document</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload any PDF and it will be redesigned in the Fruition document style — same content,
          new look. You can export the result as a PDF.
        </p>

        <div className="mt-6 grid gap-4 sm:max-w-xl">
          <label
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              pickFile(e.dataTransfer.files?.[0])
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed p-8 text-center transition-colors ${
              dragOver
                ? "border-[var(--purple-primary)] bg-[var(--light-section-bg,#ecf1fc)]"
                : "border-[var(--color-border)]"
            }`}
          >
            <FileUp className="size-6 text-[var(--purple-primary)]" />
            <span className="text-sm font-medium text-ink-heading">
              {file ? file.name : "Drop a PDF here or click to browse"}
            </span>
            <span className="text-xs text-muted-foreground">PDF only, up to 10 MB</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              disabled={busy}
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </label>

          <Input
            placeholder="Document title (optional — derived from the PDF if empty)"
            value={title}
            disabled={busy}
            onChange={(e) => setTitle(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <Button onClick={generate} disabled={!file || busy}>
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {phase === "saving" ? "Saving…" : "Designing…"}
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate design
                </>
              )}
            </Button>
            {phase === "generating" && (
              <p className="mt-2 text-xs text-muted-foreground">
                This usually takes one to a few minutes for longer documents — the preview below
                fills in as it&apos;s designed.
              </p>
            )}
          </div>
        </div>
      </div>

      {(html || busy) && (
        <div
          className="rounded-card bg-surface p-2 sm:p-3"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <iframe
            title="Design preview"
            sandbox=""
            srcDoc={html}
            className="h-[75vh] w-full rounded-[calc(var(--radius-card)-8px)] border border-[var(--color-border)] bg-white"
          />
        </div>
      )}
    </div>
  )
}

/** Strip stray markdown fences / prose around the HTML document, if any. */
function cleanHtml(raw: string): string {
  const text = raw.trim()
  const start = text.search(/<!doctype html/i)
  const startAlt = start === -1 ? text.search(/<html[\s>]/i) : start
  if (startAlt === -1) return ""
  const end = text.toLowerCase().lastIndexOf("</html>")
  return end === -1 ? text.slice(startAlt) : text.slice(startAlt, end + "</html>".length)
}
