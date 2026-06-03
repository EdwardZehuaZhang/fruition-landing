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

/* ── CRO kit types ─────────────────────────────────────────────────────── */

export interface TrustBadge {
  _key?: string
  label?: string
  /** Optional sub-label / accreditation detail */
  detail?: string
}

export interface BeforeAfterRow {
  _key?: string
  before?: string
  after?: string
}

export interface MicroCaseStudy {
  _key?: string
  challenge?: string
  solution?: string
  impact?: string
  metric?: string
  metricLabel?: string
}

export interface ChecklistItem {
  _key?: string
  text?: string
}

export interface RoiCalcConfig {
  heading?: string
  subheading?: string
  /** Default slider positions */
  defaultTeamSize?: number
  defaultHoursPerWeek?: number
  /** Fully-loaded hourly cost assumption in dollars */
  hourlyRate?: number
  /** Fraction of manual hours automation reclaims (0–1) */
  reclaimRate?: number
  currencySymbol?: string
}

export interface StatMetric {
  _key?: string
  /** Bold highlighted figure, e.g. "500+" */
  value?: string
  /** Supporting statement */
  text?: string
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
