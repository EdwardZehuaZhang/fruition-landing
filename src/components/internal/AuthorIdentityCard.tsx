"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface MemberOption {
  _id: string
  name: string
}

/**
 * Lets the signed-in user link their Google login to a team member ("this is
 * me"). The selected member's name becomes their blog byline. Saving refreshes
 * the server component so the "linked as" text updates in place.
 */
export default function AuthorIdentityCard({
  email,
  members,
  currentMemberId,
  currentByline,
}: {
  email?: string
  members: MemberOption[]
  currentMemberId?: string | null
  currentByline?: string | null
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(currentMemberId ?? null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const dirty = (selected ?? "") !== (currentMemberId ?? "")

  async function save() {
    setSaving(true)
    setError(null)
    setStatus(null)
    try {
      const r = await fetch("/api/internal/author", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sanityTeamMemberId: selected || null }),
      })
      const data = (await r.json().catch(() => ({}))) as { byline?: string | null; error?: string }
      if (!r.ok) {
        setError(data.error ?? "Save failed.")
        return
      }
      setStatus(data.byline ? `Linked — you'll publish as "${data.byline}".` : "Link cleared.")
      router.refresh()
    } catch {
      setError("Network error.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="mb-6 rounded-card border p-5"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--surface)" }}
    >
      <h2 className="text-sm font-semibold text-ink-heading">Your blog identity</h2>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
        Link {email ? <strong>{email}</strong> : "your login"} to a team member so your posts are
        bylined as that person.
        {currentByline ? (
          <>
            {" "}
            Currently: <strong>{currentByline}</strong>.
          </>
        ) : (
          <> Not linked yet.</>
        )}
      </p>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={selected} onValueChange={(v) => setSelected(v)}>
          <SelectTrigger className="w-full sm:max-w-xs" aria-label="Team member">
            <SelectValue placeholder="— not linked —">
              {selected ? members.find((m) => m._id === selected)?.name ?? selected : "— not linked —"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>— not linked —</SelectItem>
            {members.map((m) => (
              <SelectItem key={m._id} value={m._id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={save} disabled={saving || !dirty}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-xs" style={{ color: "var(--danger-strong)" }}>
          {error}
        </p>
      )}
      {status && (
        <p className="mt-2 text-xs" style={{ color: "var(--success-strong)" }}>
          {status}
        </p>
      )}
    </div>
  )
}
