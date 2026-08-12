/** An office entry as stored on siteSettings.offices in Sanity. */
export interface Office {
  flag?: string
  city?: string
  label?: string
  href?: string
  address?: string
  addressUrl?: string
  phone?: string
  phoneTel?: string
}

/** Placeholder numbers seeded as all zeros (e.g. "+91 00000 00000") are never rendered. */
export function isRealPhone(phone?: string): boolean {
  if (!phone) return false
  return !/0{6,}/.test(phone.replace(/\D/g, ''))
}

/** Prefer the explicit dial string; otherwise strip spaces from the display number. */
export function telHref(phone?: string, phoneTel?: string): string {
  return `tel:${phoneTel || (phone || '').replace(/\s/g, '')}`
}

/** Offices with a callable number, in CMS order. */
export function officesWithPhone(offices: Office[]): Office[] {
  return offices.filter((o) => isRealPhone(o.phone))
}
