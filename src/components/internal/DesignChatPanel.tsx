"use client"

import * as React from "react"
import { ArrowUp, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { parseEditResponse } from "@/lib/design/docEdit"

const HEARTBEAT_LINE = /<!-- fruition:working -->\n?/g

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  /** Outcome note shown under an assistant message (e.g. "2 changes applied"). */
  note?: string | null
}

interface Props {
  docId: string
  /**
   * Called with the raw completed assistant response. The parent parses and
   * applies any edits, saves the document, and returns a short outcome note
   * (or null when the reply changed nothing).
   */
  onAssistantResponse: (raw: string) => Promise<string | null>
}

/** Prose part of a (possibly partial) assistant response, for display. */
function displayText(raw: string): { text: string; editing: boolean } {
  const clean = raw.replace(HEARTBEAT_LINE, "")
  const cut = clean.search(/<{7} SEARCH|<!doctype html|```/i)
  if (cut === -1) return { text: clean.trim(), editing: false }
  return { text: clean.slice(0, cut).trim(), editing: true }
}

/** Chat with Claude about the open design document; requested edits apply live. */
export default function DesignChatPanel({ docId, onAssistantResponse }: Props) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState("")
  const [streamText, setStreamText] = React.useState<string | null>(null)
  const [applying, setApplying] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => () => abortRef.current?.abort(), [])

  const busy = streamText !== null || applying

  React.useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, streamText])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    setError(null)
    setInput("")
    const history = [...messages, { role: "user" as const, content: text }]
    setMessages(history)
    setStreamText("")
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(`/api/internal/design/docs/${docId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      })
      if (!res.ok || !res.body) {
        const msg = await res
          .json()
          .then((j: { error?: string }) => j.error)
          .catch(() => null)
        throw new Error(msg || `Edit request failed (${res.status}).`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ""
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setStreamText(acc)
      }
      acc += decoder.decode()
      const raw = acc.replace(HEARTBEAT_LINE, "")
      if (!raw.trim()) throw new Error("The model returned an empty reply. Try again.")

      setStreamText(null)
      setApplying(true)
      const note = await onAssistantResponse(raw)
      const reply = parseEditResponse(raw).reply || "Done."
      setMessages((m) => [...m, { role: "assistant", content: reply, note }])
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message)
      // Put the user's message back in the box so it isn't lost.
      setMessages((m) => (m[m.length - 1]?.role === "user" ? m.slice(0, -1) : m))
      setInput(text)
      setStreamText(null)
    } finally {
      setApplying(false)
    }
  }

  const partial = streamText !== null ? displayText(streamText) : null

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <Sparkles className="size-4 text-[var(--purple-primary)]" />
        <h2 className="text-sm font-semibold text-ink-heading">Edit with Claude</h2>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && streamText === null && (
          <p className="text-sm text-muted-foreground">
            Describe a change and it will be applied to the document — e.g. &ldquo;change the
            cover date to 20 July 2026&rdquo;, &ldquo;add an assumptions section after the
            overview&rdquo;, or &ldquo;make the tables more compact&rdquo;.
          </p>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[var(--purple-primary)] px-4 py-2.5 text-sm text-white">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col items-start gap-1">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-[var(--light-section-bg,#ecf1fc)] px-4 py-2.5 text-sm text-ink-heading">
                {m.content}
              </div>
              {m.note && (
                <p className="px-1 text-xs font-medium text-[var(--purple-primary)]">{m.note}</p>
              )}
            </div>
          ),
        )}
        {partial && (
          <div className="flex flex-col items-start gap-1">
            {partial.text && (
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-[var(--light-section-bg,#ecf1fc)] px-4 py-2.5 text-sm text-ink-heading">
                {partial.text}
              </div>
            )}
            <p className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              {partial.editing ? "Drafting document changes…" : "Thinking…"}
            </p>
          </div>
        )}
        {applying && (
          <p className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Applying changes…
          </p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="border-t border-[var(--color-border)] p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void send()
              }
            }}
            placeholder="Ask for a change…"
            rows={2}
            disabled={busy}
            className="min-h-9 flex-1 resize-none rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button size="icon" onClick={send} disabled={!input.trim() || busy} aria-label="Send">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
