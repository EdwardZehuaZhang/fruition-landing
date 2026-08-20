/**
 * The office list is owned by the CMS (`siteSettings.offices`) — that one
 * entry drives the map pins, the footer, the office cards and the booking
 * section's location strap. Everything here exists so the strap can follow
 * that same entry instead of repeating the cities in code.
 *
 * `OFFICE_STRAP_FALLBACK` is only reached if the CMS never loads.
 */

export interface OfficeCity {
  city?: string
}

/** Cities in the order they should read, mirroring the CMS office list. */
export const OFFICE_CITIES = [
  "Sydney",
  "New York",
  "London",
  "Singapore",
  "New Delhi",
  "Manila",
] as const

export const OFFICE_STRAP_FALLBACK = OFFICE_CITIES.join(" · ")

/**
 * Turn the CMS office list into the one-line strap. CMS city values carry a
 * country suffix ("Sydney, Australia", "New York, US Office"), so keep the
 * segment before the first comma — the same rule the world map matches on.
 */
export function officeStrap(offices?: OfficeCity[] | null): string {
  const cities = (offices ?? [])
    .map((o) => (o.city || "").split(",")[0].trim())
    .filter(Boolean)
  return cities.length ? cities.join(" · ") : OFFICE_STRAP_FALLBACK
}
