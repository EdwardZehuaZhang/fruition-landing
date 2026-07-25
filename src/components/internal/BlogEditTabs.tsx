"use client"

import { useState, type ReactNode } from "react"

/**
 * Two-tab shell for the blog edit pages: the blog editor and the social
 * drafts panel. Both panes stay MOUNTED (hidden, not unmounted) so unsaved
 * editor state and loaded social drafts survive tab switches.
 */
export default function BlogEditTabs({ blog, social }: { blog: ReactNode; social: ReactNode }) {
  const [tab, setTab] = useState<"blog" | "social">("blog")

  const tabButton = (key: "blog" | "social", label: string) => {
    const active = tab === key
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={() => setTab(key)}
        className="rounded-pill px-5 py-2.5 text-sm font-semibold transition"
        style={
          active
            ? { backgroundColor: "var(--purple-primary)", color: "#fff" }
            : { backgroundColor: "var(--surface)", color: "var(--ink-heading)", border: "1px solid var(--color-border)" }
        }
      >
        {label}
      </button>
    )
  }

  return (
    <div>
      <div role="tablist" aria-label="Blog editor sections" className="mb-4 flex gap-2">
        {tabButton("blog", "Blog post")}
        {tabButton("social", "Social media")}
      </div>
      <div hidden={tab !== "blog"}>{blog}</div>
      <div hidden={tab !== "social"}>{social}</div>
    </div>
  )
}
