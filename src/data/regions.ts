/**
 * The six regional monday.com partner pages.
 *
 * One list, two consumers: the About › Locations column in nav-v2.ts, and the
 * RegionCrossLinks strip each regional page renders to point at its five
 * siblings. Before this list existed the pages were reachable only from the
 * nav and the sitemap - nothing linked them to each other, so /monday-partner-us
 * and /monday-partner-singapore in particular sat one click deep with no
 * internal links pointing at them.
 */

export interface PartnerRegion {
  /** Country name as it appears in navigation. */
  label: string
  href: string
  /** One-line delivery note, also used as the nav item description. */
  description: string
  flag: string
}

export const PARTNER_REGIONS: PartnerRegion[] = [
  {
    label: 'Australia',
    href: '/monday-partner-australia',
    description: 'Sydney HQ - APAC delivery',
    flag: '🇦🇺',
  },
  {
    label: 'United Kingdom',
    href: '/monday-partner-uk',
    description: 'London delivery centre',
    flag: '🇬🇧',
  },
  {
    label: 'United States',
    href: '/monday-partner-us',
    description: 'New York delivery centre',
    flag: '🇺🇸',
  },
  {
    label: 'Singapore',
    href: '/monday-partner-singapore',
    description: 'APAC delivery',
    flag: '🇸🇬',
  },
  {
    label: 'India',
    href: '/monday-partner-india',
    description: 'Delhi delivery centre',
    flag: '🇮🇳',
  },
  {
    label: 'Philippines',
    href: '/monday-partner-philippines',
    description: 'Manila delivery centre',
    flag: '🇵🇭',
  },
]

/** The other five regions, for the cross-link strip on a regional page. */
export function otherRegions(currentHref: string): PartnerRegion[] {
  return PARTNER_REGIONS.filter((r) => r.href !== currentHref)
}
