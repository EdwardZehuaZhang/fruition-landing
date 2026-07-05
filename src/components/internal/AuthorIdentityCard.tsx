"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export interface MemberOption {
  _id: string
  name: string
}

const inputClass =
  "block w-full rounded-chip border border-[var(--color-border)] bg-surface px-4 py-3 text-sm text-ink-heading outline-none transition hover:border-[var(--purple-light)] focus:border-[var(--purple-primary)] focus:ring-2 focus:ring-[rgba(128,21,232,0.18)]"

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
  const [selected, setSelected] = useState(currentMemberId ?? "")
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const dirty = selected !== (currentMemberId ?? "")

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
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={`${inputClass} sm:max-w-xs`}
          aria-label="Team member"
        >
          <option value="">— not linked —</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="rounded-pill px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
          style={{ backgroundColor: "var(--purple-primary)" }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
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
