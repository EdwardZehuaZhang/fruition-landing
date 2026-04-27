"use client"

import type { ProductType } from "../data/solutions"

export type IndustryFilter =
  | "all"
  | "construction"
  | "manufacturing"
  | "real-estate"
  | "financial"
  | "healthcare"
  | "agency"
  | "field-service"
  | "people-ops"
  | "retail"
  | "logistics"
  | "nonprofit"
  | "energy"
  | "platform"
  | "australia"
  | "apac"
  | "uk"

export type TypeFilter = "all" | ProductType
export type DepthFilter = "all" | "enriched" | "standard"

export interface FilterState {
  industry: IndustryFilter
  type: TypeFilter
  depth: DepthFilter
}

export interface FilterCounts {
  industry: Record<IndustryFilter, number>
  type: Record<TypeFilter, number>
  depth: Record<DepthFilter, number>
}

interface FilterBarProps {
  state: FilterState
  counts: FilterCounts
  onChange: (next: FilterState) => void
  totalVisible: number
  total: number
}

const INDUSTRY_PILLS: { value: IndustryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "construction", label: "Construction" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "real-estate", label: "Real Estate & Property" },
  { value: "financial", label: "Financial Services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "agency", label: "Agency & Marketing" },
  { value: "field-service", label: "Field Service" },
  { value: "people-ops", label: "People Ops" },
  { value: "retail", label: "Retail & Commerce" },
  { value: "logistics", label: "Logistics" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "energy", label: "Energy & Solar" },
  { value: "platform", label: "Platform" },
  { value: "australia", label: "Australia" },
  { value: "apac", label: "APAC" },
  { value: "uk", label: "UK" },
]

const TYPE_PILLS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "wm", label: "Work Management" },
  { value: "crm", label: "CRM" },
  { value: "ops", label: "Operations & ERP" },
  { value: "svc", label: "Service" },
  { value: "new", label: "New in 2026" },
]

const DEPTH_PILLS: { value: DepthFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "enriched", label: "Full Detail" },
  { value: "standard", label: "Standard" },
]

interface PillRowProps<T extends string> {
  label: string
  pills: { value: T; label: string }[]
  active: T
  counts: Record<T, number>
  onSelect: (v: T) => void
}

function PillRow<T extends string>({
  label,
  pills,
  active,
  counts,
  onSelect,
}: PillRowProps<T>) {
  return (
    <div className="flex items-center gap-2 flex-nowrap overflow-x-auto py-1 -mx-1 px-1 scrollbar-thin">
      <span className="text-caption text-[var(--color-text-secondary)] font-semibold whitespace-nowrap pr-1 sticky left-0 bg-white">
        {label}
      </span>
      {pills.map((p) => {
        const isActive = p.value === active
        const count = counts[p.value] ?? 0
        return (
          <button
            key={p.value}
            type="button"
            onClick={() => onSelect(p.value)}
            className={`shrink-0 inline-flex items-center gap-1.5 text-caption px-3 py-1.5 rounded-full border transition-colors ${
              isActive
                ? "bg-[var(--purple-primary)] text-white border-[var(--purple-primary)]"
                : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--purple-light)] hover:text-[var(--purple-primary)]"
            }`}
          >
            <span>{p.label}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive
                  ? "bg-white/25 text-white"
                  : "bg-[rgba(128,21,232,0.08)] text-[var(--purple-primary)]"
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function FilterBar({
  state,
  counts,
  onChange,
  totalVisible,
  total,
}: FilterBarProps) {
  return (
    <div className="space-y-2">
      <PillRow
        label="Industry"
        pills={INDUSTRY_PILLS}
        active={state.industry}
        counts={counts.industry}
        onSelect={(v) => onChange({ ...state, industry: v })}
      />
      <PillRow
        label="Product Type"
        pills={TYPE_PILLS}
        active={state.type}
        counts={counts.type}
        onSelect={(v) => onChange({ ...state, type: v })}
      />
      <PillRow
        label="Depth"
        pills={DEPTH_PILLS}
        active={state.depth}
        counts={counts.depth}
        onSelect={(v) => onChange({ ...state, depth: v })}
      />
      <div className="text-body-sm text-[var(--color-text-secondary)] pt-2">
        Showing{" "}
        <strong className="text-[var(--text-dark)]">
          {totalVisible === total ? `all ${total}` : `${totalVisible} of ${total}`}
        </strong>{" "}
        solutions.
      </div>
    </div>
  )
}
