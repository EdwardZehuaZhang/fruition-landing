"use client"

import { useEffect, useRef, useState } from "react"

export interface CallOffice {
  _key?: string
  flag?: string
  city?: string
  label?: string
  phone?: string
  phoneTel?: string
}

/** Display country per flag — `siteSettings.offices` has no country field.
 *  Mirrors the map in `components/home/WhereWeWork.tsx`. */
const COUNTRY: Record<string, string> = {
  "🇦🇺": "Australia",
  "🇸🇬": "Singapore",
  "🇵🇭": "Philippines",
  "🇮🇳": "India",
  "🇬🇧": "United Kingdom",
  "🇺🇸": "United States",
}

/** West-to-east from the Sydney HQ, matching the "Where we work" row. */
const ORDER = ["🇦🇺", "🇸🇬", "🇵🇭", "🇮🇳", "🇬🇧", "🇺🇸"]

interface Props {
  offices: CallOffice[]
  /** Last-resort number when no office has one — the existing site phone. */
  fallbackPhone?: string
}

/**
 * The nav phone icon opens this instead of dialling one hardcoded number:
 * a visitor in London should not be calling the Sydney office by default.
 * Offices without a number are omitted rather than shown as dead rows.
 */
export default function RegionalCallPopover({ offices, fallbackPhone }: Props) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const rows = offices
    .filter((o) => o.flag && COUNTRY[o.flag] && (o.phone || o.phoneTel))
    .sort((a, b) => ORDER.indexOf(a.flag!) - ORDER.indexOf(b.flag!))
    .map((o) => ({
      key: o._key ?? o.flag!,
      flag: o.flag!,
      country: COUNTRY[o.flag!],
      city: (o.city ?? "").split(",")[0].trim(),
      phone: o.phone ?? o.phoneTel!,
      tel: (o.phoneTel ?? o.phone!).replace(/[^\d+]/g, ""),
    }))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [open])

  useEffect(() => {
    if (open) panelRef.current?.querySelector("a")?.focus()
  }, [open])

  // Nothing to offer a popover for — fall back to the old single-number link.
  if (rows.length === 0) {
    if (!fallbackPhone) return null
    return (
      <a
        href={`tel:${fallbackPhone.replace(/\s/g, "")}`}
        className="flex h-11 w-11 items-center justify-center rounded-[7px] transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Call us"
      >
        <PhoneGlyph />
      </a>
    )
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-[7px] transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Call one of our offices"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <PhoneGlyph />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          className="motion-safe:animate-in motion-safe:fade-in absolute right-0 top-[calc(100%+10px)] z-50 w-[330px] rounded-card border border-ui bg-surface p-5 shadow-card"
        >
          <p className="text-micro mb-3.5 font-bold tracking-[0.12em] uppercase text-brand">
            Call an office
          </p>

          <ul className="flex flex-col">
            {rows.map((row, i) => (
              <li key={row.key}>
                <a
                  href={`tel:${row.tel}`}
                  role="menuitem"
                  className={`flex items-center justify-between gap-3 py-3 transition-colors hover:text-brand ${
                    i > 0 ? "border-t border-dashed border-ui" : ""
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span aria-hidden className="text-lg leading-none">
                      {row.flag}
                    </span>
                    <span className="min-w-0">
                      <span className="block whitespace-nowrap text-body-sm font-medium text-foreground">
                        {row.country}
                      </span>
                      {row.city && row.city !== row.country && (
                        <span className="block text-micro text-muted">{row.city}</span>
                      )}
                    </span>
                  </span>
                  <span className="font-mono text-micro whitespace-nowrap text-muted">
                    {row.phone}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PhoneGlyph() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-brand"
      aria-hidden
    >
      <path
        d="M17.22 22.167h-.047a15.633 15.633 0 0 1-6.803-2.987 15.388 15.388 0 0 1-4.678-5.133A15.517 15.517 0 0 1 3.85 7.583a3.395 3.395 0 0 1 .77-2.753A4.667 4.667 0 0 1 6.44 3.5h1.633c.98-.01 1.84.647 2.1 1.587.18.72.432 1.42.747 2.093a2.333 2.333 0 0 1-.525 2.567l-.688.688a11.667 11.667 0 0 0 5.858 5.858l.688-.688a2.333 2.333 0 0 1 2.567-.525c.673.316 1.373.567 2.093.747a2.18 2.18 0 0 1 1.587 2.147v1.633a2.333 2.333 0 0 1-2.333 2.333 3.267 3.267 0 0 1-.467.035l-.48-.007Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The same regional numbers for the mobile sheet, where the desktop phone icon
 * does not exist and tapping to call is the likelier action.
 */
export function MobileCallList({
  offices,
  fallbackPhone,
  onNavigate,
}: Props & { onNavigate?: () => void }) {
  const rows = offices
    .filter((o) => o.flag && COUNTRY[o.flag] && (o.phone || o.phoneTel))
    .sort((a, b) => ORDER.indexOf(a.flag!) - ORDER.indexOf(b.flag!))

  if (rows.length === 0) {
    if (!fallbackPhone) return null
    return (
      <a
        href={`tel:${fallbackPhone.replace(/\s/g, "")}`}
        onClick={onNavigate}
        className="mt-5 mx-2 flex min-h-11 items-center gap-2.5 text-body-sm font-medium text-foreground"
      >
        <PhoneGlyph /> {fallbackPhone}
      </a>
    )
  }

  return (
    <div className="mt-6 mx-2 border-t border-ui pt-4">
      <p className="text-micro mb-1 font-bold tracking-[0.12em] uppercase text-brand">
        Call an office
      </p>
      <ul className="flex flex-col">
        {rows.map((o) => {
          const country = COUNTRY[o.flag!]
          const place = (o.city ?? "").split(",")[0].trim()
          return (
            <li key={o._key ?? o.flag!}>
              <a
                href={`tel:${(o.phoneTel ?? o.phone!).replace(/[^\d+]/g, "")}`}
                onClick={onNavigate}
                className="flex min-h-11 items-center justify-between gap-3 py-2.5"
              >
                <span className="flex items-center gap-2.5">
                  <span aria-hidden className="text-base leading-none">{o.flag}</span>
                  <span className="text-body-sm font-medium text-foreground">
                    {place && place !== country ? `${country} · ${place}` : country}
                  </span>
                </span>
                <span className="font-mono text-micro whitespace-nowrap text-muted">
                  {o.phone ?? o.phoneTel}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
