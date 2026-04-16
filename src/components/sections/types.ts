/* Shared types for section components */

export type SanityImageRef = { asset?: { _ref?: string } } | null | undefined

export interface CarouselLogo {
  _key?: string
  alt?: string
  image?: SanityImageRef
}

export interface CaseStudy {
  _id?: string
  clientName?: string
  clientRole?: string
  clientCompany?: string
  quote?: string
  logo?: SanityImageRef
  profilePhoto?: SanityImageRef
  linkedinUrl?: string
}

export interface FaqPair {
  _key?: string
  question?: string
  answer?: string
}

export interface FaqTab {
  _key?: string
  label?: string
  items?: FaqPair[]
}

export interface StatItem {
  _key?: string
  value?: string
  label?: string
}

export interface Bullet {
  _key?: string
  emoji?: string
  text?: string
}

export interface ComparisonTabItem {
  _key?: string
  number?: string
  title?: string
  description?: string
  bullets?: Bullet[]
}

export interface ComparisonTab {
  _key?: string
  label?: string
  items?: ComparisonTabItem[]
}

export interface CapabilityCard {
  _key?: string
  emoji?: string
  title?: string
  description?: string
  bullets?: Bullet[]
}

export interface FeatureNumberItem {
  _key?: string
  number?: string
  title?: string
  description?: string
}

export type SectionTheme = "light" | "dark"

export interface MethodologyStep {
  _key?: string
  number?: string
  title?: string
  description?: string
}

export interface PartnerBadge {
  _key?: string
  name?: string
  image?: SanityImageRef
  width?: number
  height?: number
}

export interface SiteSettingsData {
  calendlyLink?: string
  carouselLogos?: CarouselLogo[]
  navbarPartnerBadges?: PartnerBadge[]
  badgeCertifications?: SanityImageRef
  badgeSecurity?: SanityImageRef
  badgeForrester?: SanityImageRef
  badgeMondayPartners?: SanityImageRef
  [key: string]: unknown
}
