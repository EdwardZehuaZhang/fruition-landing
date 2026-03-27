export interface SanitySlug {
  current: string
}

export interface SanityImage {
  asset: {
    _ref: string
    _type: string
  }
}

export interface SiteSettings {
  _id: string
  phone?: string
  calendlyLink?: string
  mondayAffiliateLink?: string
  logo?: SanityImage
  footerText?: string
}

export interface BlogCategory {
  _id: string
  title: string
  slug: SanitySlug
  description?: string
}

export interface BlogPost {
  _id: string
  title: string
  slug: SanitySlug
  publishedAt?: string
  author?: string
  coverImage?: SanityImage
  categories?: BlogCategory[]
  excerpt?: string
  body?: any[]
  seoTitle?: string
  seoDescription?: string
}

interface BasePage {
  _id: string
  title: string
  slug: SanitySlug
  seoTitle?: string
  seoDescription?: string
  heroHeading?: string
  heroSubheading?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  body?: any[]
}

export interface SolutionPage extends BasePage {
  _type: 'solutionPage'
}

export interface PartnershipPage extends BasePage {
  _type: 'partnershipPage'
  partnerName?: string
  partnerLogo?: SanityImage
}

export interface LocationPage extends BasePage {
  _type: 'locationPage'
  country?: string
  region?: string
}

export interface IndustryPage extends BasePage {
  _type: 'industryPage'
  industryName?: string
}

export interface ServicePage extends BasePage {
  _type: 'servicePage'
}

export interface TeamMember {
  _id: string
  name: string
  role?: string
  photo?: SanityImage
  bio?: string
  linkedinUrl?: string
  order?: number
}

export interface CaseStudy {
  _id: string
  clientName: string
  clientRole?: string
  clientCompany?: string
  quote?: string
  logo?: SanityImage
  linkedinUrl?: string
}

export interface FaqItem {
  _id: string
  question: string
  answer?: any[]
  order?: number
}

export interface Page {
  _id: string
  title: string
  slug: SanitySlug
  seoTitle?: string
  seoDescription?: string
  body?: any[]
  pageType?: 'homepage' | 'about' | 'careers' | 'blog-listing' | 'thank-you' | 'terms' | 'privacy'
}
