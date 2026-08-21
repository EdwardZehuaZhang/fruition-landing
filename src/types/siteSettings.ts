// Shared site-settings types, read from the Sanity `siteSettings` document.

type SanityImage = { asset?: { _ref?: string } }

export interface PartnerBadge {
  _key?: string
  name?: string
  image?: SanityImage
  width?: number
  height?: number
}

export interface CarouselLogo {
  _key?: string
  alt?: string
  image?: SanityImage
}

/**
 * Subset of the siteSettings document consumed by marketing page components.
 * Matches the shape returned by getSiteSettings() in src/features/content/loaders.ts
 * and the schema in src/sanity/schemas/siteSettings.ts.
 */
export interface SiteSettings {
  navbarPartnerBadges?: PartnerBadge[]
  footerPartnerLogos?: PartnerBadge[]
  carouselLogos?: CarouselLogo[]
  badgeCertifications?: SanityImage
  badgeSecurity?: SanityImage
  badgeForrester?: SanityImage
  badgeMondayPartners?: SanityImage
  logoWhite?: SanityImage
  logoRound?: SanityImage
}
