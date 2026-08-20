"use client"

import { useEffect, useState } from "react"
import { AtSign, Loader2 } from "lucide-react"
import {
  TAG_SUGGESTIONS,
  normaliseXHandle,
  type TagSuggestion,
} from "@/lib/social/mentions"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

/**
 * Tag another account from inside the caption.
 *
 * The two channels differ in a way the writer shouldn't have to know about,
 * so this hides it: on X the handle IS the mention and goes straight in, while
 * LinkedIn needs the account resolved to a URN first — one round trip, then
 * markup the editor renders as "@monday.com" and only the wire carries in full.
 *
 * Anything resolved is remembered in this browser, so the second time you tag
 * a partner it's one click and no network.
 */

type TagKey = "linkedin" | "twitter"

interface RecentTag {
  label: string
  /** Exactly what gets inserted into the caption. */
  text: string
}

const RECENTS_CAP = 12

function recentsKey(key: TagKey): string {
  return `fruition:social-tags:${key}`
}

function readRecents(key: TagKey): RecentTag[] {
  try {
    const raw = window.localStorage.getItem(recentsKey(key))
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (t): t is RecentTag =>
        Boolean(t) && typeof (t as RecentTag).label === "string" && typeof (t as RecentTag).text === "string",
    )
  } catch {
    return [] // a corrupt or blocked localStorage must never break the editor
  }
}

function rememberTag(key: TagKey, tag: RecentTag): RecentTag[] {
  const next = [tag, ...readRecents(key).filter((t) => t.text !== tag.text)].slice(0, RECENTS_CAP)
  try {
    window.localStorage.setItem(recentsKey(key), JSON.stringify(next))
  } catch {
    // Private browsing, quota, whatever — the tag still goes into the caption.
  }
  return next
}

/** Suggestions this channel can actually use. */
function suggestionsFor(key: TagKey): Array<TagSuggestion & { target: string }> {
  return TAG_SUGGESTIONS.flatMap((s) => {
    const target = key === "linkedin" ? s.linkedin : s.x
    return target ? [{ ...s, target }] : []
  })
}

export default function TagPicker({
  platformKey,
  onPick,
  onClose,
  disabled = false,
}: {
  platformKey: TagKey
  /** The text to splice into the caption at the cursor. */
  onPick: (text: string) => void
  /** Hand the cursor back to the caption once the panel is done. */
  onClose?: () => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [recents, setRecents] = useState<RecentTag[]>([])

  const isLinkedIn = platformKey === "linkedin"
  const suggestions = suggestionsFor(platformKey)

  // localStorage isn't available during render on the server.
  useEffect(() => {
    if (open) setRecents(readRecents(platformKey))
  }, [open, platformKey])

  function insert(text: string, label: string) {
    onPick(text)
    setRecents(rememberTag(platformKey, { label, text }))
    setQuery("")
    setError(null)
  }

  /** X: build it here. LinkedIn: ask the server, which asks LinkedIn. */
  async function resolve(target: string, fallbackLabel?: string) {
    if (!target.trim()) return
    setError(null)
    setNotice(null)

    if (!isLinkedIn) {
      const handle = normaliseXHandle(target)
      if (!handle) {
        setError("That isn't a usable X handle.")
        return
      }
      insert(`@${handle}`, `@${handle}`)
      return
    }

    setBusy(true)
    try {
      const r = await fetch("/api/internal/social/mention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, displayName: fallbackLabel }),
      })
      const data = (await r.json().catch(() => ({}))) as {
        text?: string
        displayName?: string
        type?: string
        notice?: string
        error?: string
      }
      if (!r.ok || !data.text) {
        setError(data.error ?? "Couldn't resolve that account.")
        return
      }
      insert(data.text, data.displayName ?? target)
      if (data.type === "person") {
        setNotice("Person tags only link when the name matches their profile exactly.")
      }
    } catch {
      setError("Couldn't reach LinkedIn. Try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setQuery("")
          setError(null)
          setNotice(null)
          onClose?.()
        }
      }}
    >
      <PopoverTrigger
        render={
          <Button variant="ghost" size="xs" disabled={disabled} nativeButton title="Tag an account">
            <AtSign />
            Tag
          </Button>
        }
      />
      <PopoverContent align="end" className="w-[20rem] gap-2 p-2.5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void resolve(query)
          }}
          className="flex items-center gap-1.5"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isLinkedIn ? "Company page URL or name" : "@handle"}
            aria-label={isLinkedIn ? "LinkedIn company page URL or name" : "X handle"}
            autoFocus
            className="h-8 w-full min-w-0 rounded-md border border-border bg-background px-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
          />
          <Button type="submit" size="xs" disabled={busy || !query.trim()}>
            {busy ? <Loader2 className="animate-spin" /> : null}
            Add
          </Button>
        </form>

        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
        {notice && !error && <p className="text-xs text-muted-foreground">{notice}</p>}

        {recents.length > 0 && (
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Recent</p>
            <div className="flex flex-wrap gap-1">
              {recents.map((tag) => (
                <button
                  key={tag.text}
                  type="button"
                  onClick={() => insert(tag.text, tag.label)}
                  className="rounded-full border border-border px-2 py-0.5 text-xs text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Suggested</p>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  disabled={busy}
                  onClick={() => void resolve(s.target, s.name)}
                  className="rounded-full border border-border px-2 py-0.5 text-xs text-foreground transition hover:border-primary/40 hover:text-primary disabled:opacity-50"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="border-t border-border pt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          {isLinkedIn
            ? "LinkedIn tags carry a hidden account id — the editor shows the name, and it links when the post goes out."
            : "Typed straight into the post. Check the spelling: X tags whoever owns that handle."}
        </p>
      </PopoverContent>
    </Popover>
  )
}
