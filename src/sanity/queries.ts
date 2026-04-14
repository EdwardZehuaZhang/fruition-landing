import { client } from './client'

/* ================================================================== */
/*  Blog                                                                */
/* ================================================================== */

export async function getBlogPosts(limit = 12, offset = 0) {
  return client.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc) [$offset...$end] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      author,
      excerpt,
      coverImage,
      categories[]->{ _id, title, "slug": slug.current }
    }`,
    { offset, end: offset + limit }
  )
}

export async function getBlogPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      author,
      excerpt,
      coverImage,
      body,
      seoTitle,
      seoDescription,
      videoUrls,
      categories[]->{ _id, title, "slug": slug.current }
    }`,
    { slug }
  )
}

export async function getRelatedBlogPosts(excludeSlug: string, limit = 2) {
  return client.fetch(
    `*[_type == "blogPost" && slug.current != $excludeSlug] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      coverImage
    }`,
    { excludeSlug, limit }
  )
}

export async function getBlogCategories() {
  return client.fetch(
    `*[_type == "blogCategory"] | order(title asc) { _id, title, "slug": slug.current, description }`
  )
}

/* ================================================================== */
/*  Page docs (industry / location / partnership / service / solution) */
/* ================================================================== */

const PAGE_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  seoTitle,
  seoDescription,
  heroHeading,
  heroSubheading,
  heroImage,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  body,
  comparisonHeading,
  comparisonSubheading,
  comparisonTabs,
  methodologyHeading,
  methodologySteps,
  calendlyHeading,
  calendlySubheading,
  faqTabs,
  joinHeadingPart1,
  joinHeadingAccent,
  joinHeadingPart2,
  joinSubheading,
  joinStats,
  joinFootnote,
  logoCloudHeadingPart1,
  logoCloudHeadingAccent
`

export async function getSolutionPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "solutionPage" && slug.current == $slug][0]{${PAGE_FIELDS}}`,
    { slug }
  )
}

export async function getPartnershipPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "partnershipPage" && slug.current == $slug][0]{${PAGE_FIELDS}, partnerName, partnerLogo}`,
    { slug }
  )
}

export async function getLocationPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "locationPage" && slug.current == $slug][0]{${PAGE_FIELDS}, country, region}`,
    { slug }
  )
}

export async function getIndustryPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "industryPage" && slug.current == $slug][0]{${PAGE_FIELDS}, industryName}`,
    { slug }
  )
}

export async function getServicePageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "servicePage" && slug.current == $slug][0]{${PAGE_FIELDS}}`,
    { slug }
  )
}

/* ================================================================== */
/*  Listing queries                                                     */
/* ================================================================== */

export async function getAllSolutionPages() {
  return client.fetch(
    `*[_type == "solutionPage"] | order(title asc) {
      _id, title, "slug": slug.current, heroSubheading
    }`
  )
}

export async function getAllPartnershipPages() {
  return client.fetch(
    `*[_type == "partnershipPage"] | order(title asc) {
      _id, title, "slug": slug.current, partnerName, partnerLogo, heroSubheading
    }`
  )
}

export async function getAllIndustryPages() {
  return client.fetch(
    `*[_type == "industryPage"] | order(title asc) {
      _id, title, "slug": slug.current, industryName, heroSubheading
    }`
  )
}

export async function getAllLocationPages() {
  return client.fetch(
    `*[_type == "locationPage"] | order(title asc) {
      _id, title, "slug": slug.current, country, region, heroSubheading
    }`
  )
}

export async function getAllServicePages() {
  return client.fetch(
    `*[_type == "servicePage"] | order(title asc) {
      _id, title, "slug": slug.current, heroSubheading
    }`
  )
}

/* ================================================================== */
/*  Site-wide docs                                                      */
/* ================================================================== */

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{
    phone,
    calendlyLink,
    mondayAffiliateLink,
    logo,
    logoWhite,
    logoRound,
    footerText,
    navigation,
    navbarPartnerBadges[]{ name, image, width, height },
    footerPartnerLogos[]{ name, image, width, height },
    socialLinks[]{ label, href, icon },
    offices,
    footerServicesLinks,
    footerDepartmentLinks,
    footerIndustryLinks,
    carouselLogos[]{ alt, image },
    badgeCertifications,
    badgeSecurity,
    badgeForrester,
    badgeMondayPartners
  }`)
}

export async function getTeamMembers() {
  return client.fetch(
    `*[_type == "teamMember"] | order(order asc) { _id, name, role, photo, bio, linkedinUrl, order }`
  )
}

export async function getCaseStudies() {
  return client.fetch(
    `*[_type == "caseStudy"] { _id, clientName, clientRole, clientCompany, quote, logo, linkedinUrl }`
  )
}

export async function getFaqItems() {
  return client.fetch(
    `*[_type == "faqItem"] | order(order asc) { _id, question, answer, order }`
  )
}

export async function getPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, seoTitle, seoDescription,
      heroHeading, heroSubheading, heroImage,
      primaryCtaLabel, primaryCtaUrl,
      body, pageType,
      comparisonHeading, comparisonSubheading, comparisonTabs,
      methodologyHeading, methodologySteps,
      calendlyHeading, calendlySubheading,
      faqTabs,
      joinHeadingPart1, joinHeadingAccent, joinHeadingPart2,
      joinSubheading, joinStats, joinFootnote,
      logoCloudHeadingPart1, logoCloudHeadingAccent
    }`,
    { slug }
  )
}

/* ================================================================== */
/*  Full-page singletons (big structured docs)                          */
/* ================================================================== */

export async function getImplementationPackagesPage() {
  return client.fetch(`*[_type == "implementationPackagesPage"][0]{
    title, seoTitle, seoDescription,
    heroHeadingPart1, heroHeadingAccent, heroHeadingPart2,
    heroCertificationBadge, heroImage,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    logoCloudHeadingPart1, logoCloudHeadingAccent,
    videoEmbedUrl, videoTitle,
    servicesIntroHeading,
    featureCards,
    socialProofBannerHtml, socialProofCtaLabel, socialProofCtaUrl,
    pricingHeading,
    packageTiers,
    testimonialsHeading, testimonialsCtaLabel, testimonialsCtaUrl,
    statCardValue, statCardSubtitle, statCardCtaLabel, statCardCtaUrl,
    calendlyHeading, calendlyUrl,
    faqHeading, faqTabs,
    discoverBadge, discoverHeading,
    discoverPrimaryCtaLabel, discoverPrimaryCtaUrl,
    discoverSecondaryCtaLabel, discoverSecondaryCtaUrl,
    methodologyHeading, methodologyHeadingAccent, methodologySteps,
    securityBadge
  }`)
}

export async function getMondayTrainingPage() {
  return client.fetch(`*[_type == "mondayTrainingPage"][0]{
    title, seoTitle, seoDescription,
    heroHeadingPart1, heroHeadingAccent, heroSubheading,
    heroCertificationBadge, heroImage,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    logoCloudHeadingPart1, logoCloudHeadingAccent,
    trainingIntroHeading, trainingIntroSubheading,
    trainingSectionHeading, trainingTabs,
    empowerEyebrow, empowerHeading, empowerBody,
    servicesHeading, trainingServices,
    testimonialsHeading, testimonialsCtaLabel, testimonialsCtaUrl,
    statCardValue, statCardSubtitle, statCardCtaLabel, statCardCtaUrl,
    calendlyHeading, calendlySubheading, calendlyUrl,
    faqHeading, faqTabs,
    discoverBadge, discoverHeading,
    discoverPrimaryCtaLabel, discoverPrimaryCtaUrl,
    discoverSecondaryCtaLabel, discoverSecondaryCtaUrl,
    joinSectionHeadingPart1, joinSectionHeadingAccent, joinSectionHeadingPart2,
    joinSectionSubheading, joinSectionStats, joinSectionFootnote, joinSectionBadge,
    securityBadge
  }`)
}

export async function getMondayImplementationConsultantsPage() {
  return client.fetch(`*[_type == "mondayImplementationConsultantsPage"][0]{
    title, seoTitle, seoDescription,
    heroEyebrow, heroHeadingPart1, heroHeadingAccent, heroHeadingPart2,
    heroSubheading, heroCertificationBadge, heroImage,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    logoCloudHeadingPart1, logoCloudHeadingAccent,
    teamsTransformedHeading, teamsTransformedBody,
    comparisonSectionHeading, comparisonTabs,
    methodologyHeading, methodologySteps,
    solutionsHeadingPart1, solutionsHeadingAccent, solutionsHeadingPart2,
    solutionsIntro, solutionCards,
    testimonialsHeading, testimonialsCtaLabel, testimonialsCtaUrl,
    statCardValue, statCardSubtitle, statCardCtaLabel, statCardCtaUrl,
    calendlyHeading, calendlySubheading, calendlyUrl,
    faqHeading, faqTabs,
    discoverBadge, discoverHeading,
    discoverPrimaryCtaLabel, discoverPrimaryCtaUrl,
    discoverSecondaryCtaLabel, discoverSecondaryCtaUrl,
    joinSectionHeadingPart1, joinSectionHeadingAccent, joinSectionHeadingPart2,
    joinSectionSubheading, joinSectionStats, joinSectionFootnote, joinSectionBadge,
    securityBadge
  }`)
}

export async function getHomePage() {
  return client.fetch(`*[_type == "homePage"][0]{
    title, seoTitle, seoDescription, contentBlocks
  }`)
}
