"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export interface FaqItem {
  _id: string
  question: string
  answer: PortableTextBlock[]
  category?: string
  order?: number
}

/* ------------------------------------------------------------------ */
/* Top-level topic groups                                              */
/* The Sanity `category` field is granular (21 values). Visitors meet  */
/* a handful of generic topics first, then drill into one to see every */
/* question it contains. Map raw categories → generic groups here.     */
/* Any category not listed falls into the final group, so nothing is   */
/* ever dropped from the page.                                         */
/* ------------------------------------------------------------------ */
type GroupKey =
  | "products"
  | "industries"
  | "departments"
  | "integrations"
  | "consulting"
  | "training"
  | "general"

interface GroupDef {
  key: GroupKey
  label: string
  blurb: string
  categories: string[]
}

const GROUPS: GroupDef[] = [
  {
    key: "products",
    label: "monday.com Products",
    blurb: "Work Management, CRM, Dev, and Service — what each product does and who it fits.",
    categories: ["monday Work Management", "monday CRM", "monday Dev", "monday Service"],
  },
  {
    key: "industries",
    label: "Solutions by Industry",
    blurb: "How we tailor monday.com for your sector, from professional services to construction.",
    categories: ["Professional Services", "Retail", "Public Sector", "Manufacturing", "Construction"],
  },
  {
    key: "departments",
    label: "Teams & Departments",
    blurb: "Setups for finance, project management, marketing, and HR teams.",
    categories: ["Finance & Accounting", "Project Management", "Marketing & Creative", "HR"],
  },
  {
    key: "integrations",
    label: "Integrations & Tools",
    blurb: "Connecting Aircall, Atlassian, n8n, ClickUp, and AI tooling into your stack.",
    categories: ["Aircall FAQs", "Atlassian FAQs", "n8n FAQs", "ClickUp FAQs", "AI FAQs"],
  },
  {
    key: "consulting",
    label: "Working With a Consultant",
    blurb: "Our experts, engagement model, and what to expect when you hire us.",
    categories: ["Expert Consultant Guide"],
  },
  {
    key: "training",
    label: "Training & Enablement",
    blurb: "Onboarding your team and building monday.com skills in-house.",
    categories: ["Training"],
  },
  {
    key: "general",
    label: "General Questions",
    blurb: "Everything else — pricing, partnership, and getting started.",
    categories: ["General Questions"],
  },
]

const FALLBACK_GROUP: GroupKey = "general"

function GroupIcon({ group, className }: { group: GroupKey; className?: string }) {
  const common = {
    className,
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }
  switch (group) {
    case "products":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.6" />
          <rect x="14" y="3" width="7" height="7" rx="1.6" />
          <rect x="3" y="14" width="7" height="7" rx="1.6" />
          <rect x="14" y="14" width="7" height="7" rx="1.6" />
        </svg>
      )
    case "industries":
      return (
        <svg {...common}>
          <path d="M3 21h18" />
          <path d="M5 21V8l5-4 5 4v13" />
          <path d="M15 21V11l4 2v8" />
          <path d="M9 9h2M9 13h2M9 17h2" />
        </svg>
      )
    case "departments":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
        </svg>
      )
    case "integrations":
      return (
        <svg {...common}>
          <path d="M9 17H7A5 5 0 0 1 7 7h2" />
          <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      )
    case "consulting":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="m16 11 2 2 4-4" />
        </svg>
      )
    case "training":
      return (
        <svg {...common}>
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5" />
        </svg>
      )
    case "general":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.2 9a3 3 0 0 1 5.6 1c0 2-3 2.5-3 4" />
          <line x1="12" y1="17" x2="12" y2="17.01" />
        </svg>
      )
  }
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

interface NormItem extends FaqItem {
  _searchText: string
}

/* Accordion row, shared by drill-down and search results. */
function FaqRow({
  item,
  isOpen,
  onToggle,
  categoryTag,
}: {
  item: NormItem
  isOpen: boolean
  onToggle: () => void
  categoryTag?: string
}) {
  return (
    <li
      className="ui-surface-panel overflow-hidden transition-shadow"
      style={isOpen ? { boxShadow: "var(--shadow-card)", borderColor: "var(--purple-light)" } : undefined}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left cursor-pointer"
      >
        <span className="flex flex-col gap-1.5">
          {categoryTag && (
            <span
              className="text-micro w-fit rounded-pill px-2.5 py-1"
              style={{ backgroundColor: "var(--light-section-bg)", color: "var(--purple-dark)" }}
            >
              {categoryTag}
            </span>
          )}
          <span className="text-card-title text-ink">{item.question}</span>
        </span>
        <span
          className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all"
          style={{
            backgroundColor: isOpen ? "var(--purple-primary)" : "var(--light-section-bg)",
            color: isOpen ? "var(--white)" : "var(--purple-primary)",
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
            aria-hidden
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
}

export default function FaqList({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState("")
  const [activeGroup, setActiveGroup] = useState<GroupKey | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const normalized = useMemo<NormItem[]>(
    () =>
      items.map((item) => ({
        ...item,
        question: cleanQuestion(item.question || ""),
        category: item.category || "General Questions",
        _searchText: `${cleanQuestion(item.question || "")} ${answerToPlainText(item.answer)} ${item.category || ""}`.toLowerCase(),
      })),
    [items],
  )

  // Bucket every item into one of the generic groups.
  const groups = useMemo(() => {
    const catToGroup = new Map<string, GroupKey>()
    for (const g of GROUPS) for (const c of g.categories) catToGroup.set(c.toLowerCase(), g.key)

    const buckets = new Map<GroupKey, NormItem[]>()
    for (const item of normalized) {
      const gk = catToGroup.get((item.category || "").toLowerCase()) ?? FALLBACK_GROUP
      if (!buckets.has(gk)) buckets.set(gk, [])
      buckets.get(gk)!.push(item)
    }

    return GROUPS.map((g) => {
      const groupItems = buckets.get(g.key) ?? []
      // Order sub-categories: declared order first, then any stragglers.
      const order = new Map(g.categories.map((c, i) => [c.toLowerCase(), i]))
      const subMap = new Map<string, NormItem[]>()
      for (const it of groupItems) {
        const c = it.category || "General Questions"
        if (!subMap.has(c)) subMap.set(c, [])
        subMap.get(c)!.push(it)
      }
      const subCategories = Array.from(subMap.entries())
        .sort(([a], [b]) => (order.get(a.toLowerCase()) ?? 99) - (order.get(b.toLowerCase()) ?? 99))
        .map(([label, list]) => ({ label, items: list }))

      return { ...g, items: groupItems, subCategories, count: groupItems.length }
    }).filter((g) => g.count > 0)
  }, [normalized])

  const groupByKey = useMemo(() => new Map(groups.map((g) => [g.key, g])), [groups])

  // URL ↔ state sync so categories are deep-linkable and the browser back
  // button returns to the grid (history API only — no server round-trip).
  const syncFromUrl = useCallback(() => {
    if (typeof window === "undefined") return
    const c = new URLSearchParams(window.location.search).get("c") as GroupKey | null
    setActiveGroup(c && groupByKey.has(c) ? c : null)
  }, [groupByKey])

  useEffect(() => {
    syncFromUrl()
    window.addEventListener("popstate", syncFromUrl)
    return () => window.removeEventListener("popstate", syncFromUrl)
  }, [syncFromUrl])

  const navTo = useCallback((key: GroupKey | null) => {
    if (typeof window !== "undefined") {
      const url = key ? `?c=${key}` : window.location.pathname
      window.history.pushState({}, "", url)
    }
    setActiveGroup(key)
    setOpenId(null)
    setQuery("")
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }, [])

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return normalized.filter((item) => item._searchText.includes(q))
  }, [normalized, query])

  if (items.length === 0) {
    return <p className="text-center text-[color:var(--color-text-secondary)]">FAQs coming soon.</p>
  }

  const activeData = activeGroup ? groupByKey.get(activeGroup) : null
  const view = searchResults ? "search" : activeData ? "detail" : "grid"
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id))

  return (
    <div ref={topRef} className="flex flex-col gap-8 scroll-mt-24">
      {/* Search — persistent across every view */}
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
          placeholder="Search every question..."
          aria-label="Search FAQs"
          className="w-full rounded-pill border border-[color:var(--color-border)] bg-surface py-4 pl-12 pr-5 text-body text-ink placeholder:text-[color:var(--color-text-secondary)] outline-none transition-colors focus:border-[color:var(--purple-primary)]"
          style={{ boxShadow: "var(--shadow-whisper)" }}
        />
      </div>

      {/* ---------------- SEARCH RESULTS ---------------- */}
      {view === "search" && (
        <div key="search" className="animate-fade-in flex flex-col gap-5">
          <div className="flex items-center justify-between text-caption text-[color:var(--color-text-secondary)]">
            <span>
              {searchResults!.length} {searchResults!.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
            </span>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[color:var(--purple-primary)] hover:underline"
            >
              Clear
            </button>
          </div>
          {searchResults!.length === 0 ? (
            <div className="ui-surface-panel px-6 py-10 text-center">
              <p className="text-body text-ink">No questions match your search.</p>
              <p className="mt-2 text-body-sm text-[color:var(--color-text-secondary)]">
                Try a different keyword, or reach out and we&rsquo;ll answer it for you.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {searchResults!.map((item) => (
                <FaqRow
                  key={item._id}
                  item={item}
                  isOpen={openId === item._id}
                  onToggle={() => toggle(item._id)}
                  categoryTag={item.category}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ---------------- CATEGORY GRID ---------------- */}
      {view === "grid" && (
        <div key="grid" className="animate-fade-in flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-section-h3 text-ink">Browse by topic</h2>
            <span className="text-caption text-[color:var(--color-text-secondary)]">
              {normalized.length} questions
            </span>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {groups.map((g, i) => (
              <li key={g.key} className="animate-fade-in" style={{ animationDelay: `${i * 70}ms` }}>
                <button
                  type="button"
                  onClick={() => navTo(g.key)}
                  className="ui-surface-panel ui-hover-card group flex h-full w-full flex-col items-start gap-4 p-6 text-left cursor-pointer"
                >
                  <span className="flex w-full items-start justify-between gap-3">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-chip transition-colors"
                      style={{ backgroundColor: "var(--light-section-bg)", color: "var(--purple-primary)" }}
                    >
                      <GroupIcon group={g.key} />
                    </span>
                    <span
                      className="text-caption rounded-pill px-3 py-1"
                      style={{ backgroundColor: "var(--light-section-bg)", color: "var(--purple-dark)" }}
                    >
                      {g.count}
                    </span>
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-card-title text-ink">{g.label}</span>
                    <span className="text-body-sm text-[color:var(--color-text-secondary)]">{g.blurb}</span>
                  </span>
                  <span
                    className="mt-auto inline-flex items-center gap-1.5 text-caption pt-1"
                    style={{ color: "var(--purple-primary)" }}
                  >
                    View questions
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------- CATEGORY DETAIL ---------------- */}
      {view === "detail" && activeData && (
        <div key={activeData.key} className="animate-fade-in flex flex-col gap-6">
          <button
            type="button"
            onClick={() => navTo(null)}
            className="inline-flex w-fit items-center gap-1.5 text-caption text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--purple-primary)] cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            All topics
          </button>

          <div className="flex items-start gap-4">
            <span
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-chip"
              style={{ backgroundColor: "var(--light-section-bg)", color: "var(--purple-primary)" }}
            >
              <GroupIcon group={activeData.key} />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-section-h3 text-ink">{activeData.label}</h2>
              <p className="text-body-sm text-[color:var(--color-text-secondary)]">
                {activeData.count} {activeData.count === 1 ? "question" : "questions"} · {activeData.blurb}
              </p>
            </div>
          </div>

          {activeData.subCategories.map((sub) => (
            <div key={sub.label} className="flex flex-col gap-3">
              {activeData.subCategories.length > 1 && (
                <h3 className="text-caption font-semibold text-ink pt-2">
                  {sub.label}
                  <span className="ml-2 font-normal text-[color:var(--color-text-secondary)]">{sub.items.length}</span>
                </h3>
              )}
              <ul className="flex flex-col gap-3">
                {sub.items.map((item) => (
                  <FaqRow
                    key={item._id}
                    item={item}
                    isOpen={openId === item._id}
                    onToggle={() => toggle(item._id)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
