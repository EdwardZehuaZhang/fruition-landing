"use client"

import { useMemo, useState } from "react"
import { SOLUTIONS, type IndustryKey, type Solution } from "../data/solutions"
import FilterBar, {
  type DepthFilter,
  type FilterCounts,
  type FilterState,
  type IndustryFilter,
  type TypeFilter,
} from "./FilterBar"

export type FolderKey = "wm" | "crm" | "rnd"

// Canonical folder assignment lifted from the mock HTML's data-folder attrs.
// Inferring from productType alone would misplace wealth-crm (productType:new)
// which the mock treats as a CRM product; this map keeps display in sync.
const FOLDER_BY_KEY: Record<string, FolderKey> = {
  "c-commercial-ppm": "wm",
  "c-residential-hv": "wm",
  "mfg-build-tracker": "wm",
  "erp-production": "wm",
  "ppm-general": "wm",
  trades: "wm",
  "cs-ticketing": "wm",
  "pool-construction": "wm",
  "c-commercial-lv": "wm",
  "eng-ppm": "wm",
  hr: "wm",
  ats: "wm",
  assets: "wm",
  estimating: "wm",
  agency: "wm",
  integrations: "wm",
  "property-os": "wm",
  nonprofit: "wm",
  claims: "wm",
  training: "wm",
  migration: "wm",
  "ai-agents": "wm",
  "proposal-auto": "wm",
  healthcare: "wm",
  fleet: "wm",
  signage: "wm",
  "dream-crm": "crm",
  "re-resi": "crm",
  "sales-am": "crm",
  "re-comm": "crm",
  "fs-crm": "crm",
  "ag-crm": "crm",
  "retail-crm": "crm",
  "solar-crm": "crm",
  "wealth-crm": "crm",
  proploy: "rnd",
  reachly: "rnd",
  "content-system": "rnd",
  "fruition-security": "rnd",
  "marketing-agent": "rnd",
  "kb-chatbot": "rnd",
  "fireflies-pipeline": "rnd",
  "workload-dash": "rnd",
  "crm-demo-env": "rnd",
  "handover-auto": "rnd",
}

function folderOf(s: Solution): FolderKey {
  return FOLDER_BY_KEY[s.key] || "wm"
}

const FOLDER_META: Record<
  FolderKey,
  { title: string; sub: string; total: number }
> = {
  wm: {
    title: "Work Management",
    sub: "Core operating boards, services PMOs, trades, manufacturing, and ERP overlays.",
    total: 0,
  },
  crm: {
    title: "CRM",
    sub: "Sales-first CRM patterns across verticals — residential, commercial, financial, retail, solar, and more.",
    total: 0,
  },
  rnd: {
    title: "Fruition R&D Platform",
    sub: "Productized tools shipped from our internal R&D pipeline.",
    total: 0,
  },
}

const TYPE_LEGEND: { value: TypeFilter; label: string; dotClass: string }[] = [
  { value: "wm", label: "Work Management", dotClass: "bg-[var(--purple-primary)]" },
  { value: "crm", label: "CRM", dotClass: "bg-[#a855f7]" },
  { value: "svc", label: "Service", dotClass: "bg-[#22c55e]" },
  { value: "ops", label: "Operations & ERP", dotClass: "bg-[#0ea5e9]" },
  { value: "new", label: "New in 2026", dotClass: "bg-[#f97316]" },
]

interface SolutionsGridProps {
  onOpen: (key: string) => void
}

export default function SolutionsGrid({ onOpen }: SolutionsGridProps) {
  const [filters, setFilters] = useState<FilterState>({
    industry: "all",
    type: "all",
    depth: "all",
  })
  const [openFolders, setOpenFolders] = useState<Record<FolderKey, boolean>>({
    wm: false,
    crm: false,
    rnd: false,
  })

  const visible = useMemo(
    () =>
      SOLUTIONS.filter((s) => {
        if (
          filters.industry !== "all" &&
          !s.industries.includes(filters.industry as IndustryKey)
        )
          return false
        if (filters.type !== "all" && s.productType !== filters.type) return false
        if (filters.depth === "enriched" && !s.enriched) return false
        if (filters.depth === "standard" && s.enriched) return false
        return true
      }),
    [filters]
  )

  const counts: FilterCounts = useMemo(() => {
    // Compute industry counts under current type+depth filters
    const baseIndustry = SOLUTIONS.filter((s) => {
      if (filters.type !== "all" && s.productType !== filters.type) return false
      if (filters.depth === "enriched" && !s.enriched) return false
      if (filters.depth === "standard" && s.enriched) return false
      return true
    })
    const industryCounts = {} as Record<IndustryFilter, number>
    industryCounts.all = baseIndustry.length
    for (const ind of [
      "construction",
      "manufacturing",
      "real-estate",
      "financial",
      "healthcare",
      "agency",
      "field-service",
      "people-ops",
      "retail",
      "logistics",
      "nonprofit",
      "energy",
      "platform",
      "australia",
      "apac",
      "uk",
    ] as IndustryKey[]) {
      industryCounts[ind] = baseIndustry.filter((s) => s.industries.includes(ind)).length
    }

    // Compute type counts under current industry+depth filters
    const baseType = SOLUTIONS.filter((s) => {
      if (
        filters.industry !== "all" &&
        !s.industries.includes(filters.industry as IndustryKey)
      )
        return false
      if (filters.depth === "enriched" && !s.enriched) return false
      if (filters.depth === "standard" && s.enriched) return false
      return true
    })
    const typeCounts: Record<TypeFilter, number> = {
      all: baseType.length,
      wm: baseType.filter((s) => s.productType === "wm").length,
      crm: baseType.filter((s) => s.productType === "crm").length,
      ops: baseType.filter((s) => s.productType === "ops").length,
      svc: baseType.filter((s) => s.productType === "svc").length,
      new: baseType.filter((s) => s.productType === "new").length,
    }

    // Compute depth counts under current industry+type filters
    const baseDepth = SOLUTIONS.filter((s) => {
      if (
        filters.industry !== "all" &&
        !s.industries.includes(filters.industry as IndustryKey)
      )
        return false
      if (filters.type !== "all" && s.productType !== filters.type) return false
      return true
    })
    const depthCounts: Record<DepthFilter, number> = {
      all: baseDepth.length,
      enriched: baseDepth.filter((s) => s.enriched).length,
      standard: baseDepth.filter((s) => !s.enriched).length,
    }

    return { industry: industryCounts, type: typeCounts, depth: depthCounts }
  }, [filters])

  const grouped = useMemo(() => {
    const out: Record<FolderKey, Solution[]> = { wm: [], crm: [], rnd: [] }
    for (const s of visible) out[folderOf(s)].push(s)
    return out
  }, [visible])

  // Auto-expand folders when filters narrow them down (mock behavior)
  const isFiltered =
    filters.industry !== "all" || filters.type !== "all" || filters.depth !== "all"

  const totals = useMemo(() => {
    const out: Record<FolderKey, number> = { wm: 0, crm: 0, rnd: 0 }
    for (const s of SOLUTIONS) out[folderOf(s)] += 1
    return out
  }, [])

  const toggle = (folder: FolderKey) =>
    setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }))

  return (
    <section id="solutions" className="bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-7 py-16 lg:py-20">
        <div className="max-w-[820px] mb-8">
          <div className="text-micro font-semibold tracking-[0.16em] uppercase text-[var(--purple-primary)]">
            Solutions Catalog
          </div>
          <h2 className="text-section-h2 mt-2 mb-3">
            Every solution in one filterable atlas.
          </h2>
          <p className="text-body-lead text-[var(--color-text-secondary)]">
            45 productized monday.com builds, organized by category and tagged by industry,
            product type, and depth. Tap any card to see workflow, modules, and similar client
            implementations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          {TYPE_LEGEND.map((cat) => (
            <span
              key={cat.value}
              className="inline-flex items-center gap-2 text-caption text-[var(--color-text-secondary)]"
            >
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${cat.dotClass}`} />
              {cat.label}
            </span>
          ))}
        </div>

        <div className="ui-surface-panel p-5 lg:p-6 mb-8">
          <FilterBar
            state={filters}
            counts={counts}
            onChange={setFilters}
            totalVisible={visible.length}
            total={SOLUTIONS.length}
          />
        </div>

        <div className="space-y-5">
          {(["wm", "crm", "rnd"] as FolderKey[]).map((folder) => {
            const items = grouped[folder]
            const total = totals[folder]
            // Auto-expand when filters are active and visible items are small
            const expanded = isFiltered ? items.length > 0 && items.length <= 12 || openFolders[folder] : openFolders[folder]
            const meta = FOLDER_META[folder]
            return (
              <div
                key={folder}
                className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white shadow-whisper overflow-hidden"
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => toggle(folder)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#faf7ff] transition-colors"
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 transition-transform duration-200 text-[var(--purple-primary)] ${
                      expanded ? "rotate-0" : "-rotate-90"
                    }`}
                    aria-hidden
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                  <span className="text-card-title text-[var(--text-dark)]">{meta.title}</span>
                  <span className="text-caption text-[var(--color-text-secondary)] hidden sm:inline">
                    <strong className="text-[var(--text-dark)]">{items.length}</strong> of{" "}
                    {total} solutions
                  </span>
                  <span className="ml-auto text-caption text-[var(--purple-primary)]">
                    {expanded ? "Hide" : "Click to expand"}
                  </span>
                </button>

                {expanded && (
                  <div className="px-6 pb-6 pt-1">
                    {meta.sub && (
                      <p className="text-body-sm text-[var(--color-text-secondary)] mb-5 max-w-[760px]">
                        {meta.sub}
                      </p>
                    )}
                    {items.length === 0 ? (
                      <p className="text-body-sm text-[var(--color-text-secondary)] py-6">
                        No solutions match your current filters in this category.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((s) => (
                          <SolutionCard key={s.key} solution={s} onOpen={onOpen} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SolutionCard({
  solution,
  onOpen,
}: {
  solution: Solution
  onOpen: (key: string) => void
}) {
  const isNew = solution.productType === "new"
  return (
    <button
      type="button"
      onClick={() => onOpen(solution.key)}
      className="group relative text-left rounded-2xl border border-[var(--color-border)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-card hover:border-[var(--purple-light)]"
    >
      {isNew && (
        <span className="absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase bg-[#fff1e6] text-[#c2410c] px-2 py-0.5 rounded">
          New 2026
        </span>
      )}
      <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--purple-primary)] mb-2">
        {solution.tag}
      </div>
      <h3 className="text-card-title text-[var(--text-dark)] leading-tight pr-12">
        {solution.title}
      </h3>
      <p className="text-body-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
        {solution.desc}
      </p>
      {solution.highlights?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {solution.highlights.map((h, i) => (
            <span
              key={i}
              className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                isNew
                  ? "bg-[#fff1e6] text-[#c2410c]"
                  : "bg-[rgba(128,21,232,0.08)] text-[var(--purple-primary)]"
              }`}
              title={h[0]}
            >
              {h[1]}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 text-caption text-[var(--purple-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
        Open detail →
      </div>
    </button>
  )
}
