"use client"

import { createContext, useContext, type ReactNode } from "react"
import { OFFICE_STRAP_FALLBACK } from "@/data/offices"

/**
 * Carries the office strap ("Sydney · New York · …") from the root layout —
 * the one place that already loads `siteSettings` — down to BookingSection,
 * which renders on ~30 pages as a client component and so can't fetch it.
 * Editing the office list in the CMS is therefore the only switch needed.
 */
const OfficeStrapContext = createContext<string>(OFFICE_STRAP_FALLBACK)

export function OfficeStrapProvider({ value, children }: { value: string; children: ReactNode }) {
  return <OfficeStrapContext.Provider value={value}>{children}</OfficeStrapContext.Provider>
}

export function useOfficeStrap(): string {
  return useContext(OfficeStrapContext)
}
