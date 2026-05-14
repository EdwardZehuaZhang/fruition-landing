"use client"

import { useState, useTransition } from "react"

interface Props {
  next: string
  initialError?: string
}

export default function LoginForm({ next, initialError }: Props) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | undefined>(initialError)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(undefined)
    startTransition(async () => {
      const r = await fetch("/api/internal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, next }),
      })
      if (r.ok) {
        const data = (await r.json()) as { redirect?: string }
        window.location.href = data.redirect ?? next
        return
      }
      const data = (await r.json().catch(() => ({}))) as { error?: string }
      setError(data.error ?? "Login failed.")
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="pw" className="mb-1 block text-sm font-medium text-[#10003a]">
          Password
        </label>
        <input
          id="pw"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded-chip border bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--purple-primary)] focus:ring-2 focus:ring-[rgba(128,21,232,0.18)]"
          style={{ borderColor: "var(--color-border)" }}
        />
      </div>
      {error && (
        <div
          className="rounded-chip px-3 py-2 text-sm"
          style={{ backgroundColor: "#fff1f2", color: "#9f1239" }}
          role="alert"
        >
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={pending || password.length === 0}
        className="block w-full rounded-pill px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
        style={{ backgroundColor: "var(--purple-primary)" }}
      >
        {pending ? "Checking…" : "Continue"}
      </button>
    </form>
  )
}
