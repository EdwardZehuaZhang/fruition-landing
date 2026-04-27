"use client"

import { useMemo, useState } from "react"
import { CLIENTS, type Region } from "../data/clients"

const REGIONS: { key: Region; label: string; flag: string }[] = [
  { key: "us", label: "United States", flag: "US" },
  { key: "apac", label: "Australia & APAC", flag: "AU" },
  { key: "uk", label: "United Kingdom", flag: "UK" },
]

export default function ProjectBuildsIndex() {
  const [open, setOpen] = useState(false)

  const grouped = useMemo(() => {
    return REGIONS.map((r) => ({
      ...r,
      items: CLIENTS.filter((c) => c.region === r.key),
    }))
  }, [])

  const total = CLIENTS.length

  return (
    <section id="builds" className="bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-7 py-16 lg:py-20">
        <div className="max-w-[820px] mb-10">
          <div className="text-micro font-semibold tracking-[0.16em] uppercase text-[var(--purple-primary)]">
            Project Builds Index
          </div>
          <h2 className="text-section-h2 mt-2 mb-3">
            289 client engagements across the US, Australia, APAC, and the UK.
          </h2>
          <p className="text-body-lead text-[var(--color-text-secondary)]">
            Every build below has been delivered and is in active support across our three
            regional books of business.
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white shadow-whisper overflow-hidden">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="builds-folder-body"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#faf7ff] transition-colors"
          >
            <span
              className={`inline-block transition-transform duration-200 text-[var(--purple-primary)] ${
                open ? "rotate-0" : "-rotate-90"
              }`}
              aria-hidden
            >
              ▾
            </span>
            <span className="text-card-title text-[var(--text-dark)]">Fruition Clients</span>
            <span className="text-body-sm text-[var(--color-text-secondary)] hidden sm:inline">
              <strong>{total}</strong> delivered implementations across US, APAC &amp; UK
            </span>
            <span className="ml-auto text-caption text-[var(--purple-primary)]">
              {open ? "Hide" : "Click to expand"}
            </span>
          </button>

          {open && (
            <div id="builds-folder-body" className="px-6 pb-8 pt-2">
              {grouped.map((g) => (
                <div key={g.key} className="mt-6">
                  <h3 className="flex items-center gap-3 text-card-title text-[var(--text-dark)] mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-6 rounded text-[10px] font-bold tracking-wider bg-[var(--purple-primary)] text-white">
                      {g.flag}
                    </span>
                    {g.label}
                    <span className="text-caption text-[var(--color-text-secondary)] font-normal">
                      {g.items.length} delivered
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {g.items.map((c, idx) => (
                      <div
                        key={`${g.key}-${c.name}-${idx}`}
                        className="rounded-xl border border-[var(--color-border)] bg-white p-3 hover:border-[var(--purple-light)] hover:shadow-whisper transition-all"
                      >
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#16a34a] font-semibold mb-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                          Delivered
                        </div>
                        <h4 className="text-sm font-semibold text-[var(--text-dark)] leading-tight">
                          {c.name}
                        </h4>
                        <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                          {c.meta}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <p className="mt-8 text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-[760px]">
                Note: the US, APAC, and UK client rosters shown here are curated from Fireflies
                meeting transcripts, Gmail threads, Google Drive artifacts, and monday.com CRM,
                Client Projects, and Work Order workspace activity between 2024 and 2026.
                Additional smaller engagements, support retainers, Hootsuite HSE line items, and
                partner-referred opportunities across all three regions are tracked separately in
                our internal CRM and total an additional 150+ accounts.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
