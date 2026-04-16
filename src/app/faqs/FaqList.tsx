"use client"

import { useMemo, useState } from "react"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export interface FaqItem {
  _id: string
  question: string
  answer: PortableTextBlock[]
  order?: number
}

function cleanQuestion(q: string): string {
  return q.replace(/^#+\s*/, "").trim()
}

function answerToPlainText(answer: PortableTextBlock[] | undefined): string {
  if (!Array.isArray(answer)) return ""
  return answer
    .map((block) => {
      if (block?._type !== "block" || !Array.isArray((block as { children?: unknown }).children)) return ""
      const children = (block as { children: Array<{ text?: string }> }).children
      return children.map((c) => c.text ?? "").join(" ")
    })
    .join(" ")
}

export default function FaqList({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState("")
  const [openId, setOpenId] = useState<string | null>(items[0]?._id ?? null)

  const normalized = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        question: cleanQuestion(item.question || ""),
        _searchText: `${cleanQuestion(item.question || "")} ${answerToPlainText(item.answer)}`.toLowerCase(),
      })),
    [items],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return normalized
    return normalized.filter((item) => item._searchText.includes(q))
  }, [normalized, query])

  if (items.length === 0) {
    return <p className="text-center text-[color:var(--color-text-secondary)]">FAQs coming soon.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <svg
          aria-hidden
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-secondary)]"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions..."
          className="w-full rounded-pill border border-[color:var(--color-border)] bg-white py-4 pl-12 pr-5 text-body text-black placeholder:text-[color:var(--color-text-secondary)] outline-none transition-colors focus:border-[color:var(--purple-primary)]"
          style={{ boxShadow: "var(--shadow-whisper)" }}
        />
      </div>

      <div className="flex items-center justify-between text-caption text-[color:var(--color-text-secondary)]">
        <span>
          {filtered.length} {filtered.length === 1 ? "question" : "questions"}
          {query ? ` matching "${query}"` : ""}
        </span>
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-[color:var(--purple-primary)] hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="ui-surface-panel px-6 py-10 text-center">
          <p className="text-body text-black">No questions match your search.</p>
          <p className="mt-2 text-body-sm text-[color:var(--color-text-secondary)]">
            Try a different keyword, or reach out and we&rsquo;ll answer it for you.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((item) => {
            const isOpen = openId === item._id
            return (
              <li
                key={item._id}
                className="ui-surface-panel overflow-hidden transition-shadow"
                style={isOpen ? { boxShadow: "var(--shadow-card)", borderColor: "var(--purple-light)" } : undefined}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item._id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                >
                  <span className="text-card-title text-black">{item.question}</span>
                  <span
                    className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all"
                    style={{
                      backgroundColor: isOpen ? "var(--purple-primary)" : "var(--light-section-bg)",
                      color: isOpen ? "white" : "var(--purple-primary)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="h-px w-full bg-[color:var(--color-border)]" />
                    <div className="pt-5 text-body text-[color:var(--color-text-secondary)] [&_p]:text-[color:var(--color-text-secondary)] [&_p]:mb-3 last:[&_p]:mb-0 [&_a]:text-[color:var(--purple-primary)] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1">
                      <PortableText value={item.answer} components={portableTextComponents} />
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
