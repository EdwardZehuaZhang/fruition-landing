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
      "coverImage": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0]),
      "charCount": length(pt::text(body)),
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
      "coverImage": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0]),
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
      "coverImage": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0])
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

  // Hero
  heroEyebrow,
  heroHeading,
  heroSubheading,
  heroBody,
  heroImage,
  heroLocalVideoSrc,
  heroVideoUrl,
  heroVideoTitle,
  heroPartnerBadges[]{ name, image, width, height },
  heroStats,
  hideHeroSubheading,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,

  body,

  // Logo cloud
  logoCloudHeadingPart1,
  logoCloudHeadingAccent,
  logoCloudDescription,

  // Comparison tabs
  comparisonHeading,
  comparisonSubheading,
  comparisonTheme,
  comparisonLayout,
  comparisonTabs,

  // Methodology
  methodologyHeading,
  methodologySteps,

  // Calendly
  calendlyHeading,
  calendlySubheading,

  // FAQ
  faqTabs,

  // Capabilities
  capabilitiesEyebrow,
  capabilitiesHeading,
  capabilitiesHeadingAccent,
  capabilitiesSubheading,
  capabilitiesTheme,
  capabilitiesColumns,
  capabilitiesCards,
  capabilitiesCtaLabel,
  capabilitiesCtaUrl,
  capabilitiesCtaSecondaryLabel,
  capabilitiesCtaSecondaryUrl,

  // Secondary capabilities
  secondaryCapabilitiesEyebrow,
  secondaryCapabilitiesHeading,
  secondaryCapabilitiesHeadingAccent,
  secondaryCapabilitiesSubheading,
  secondaryCapabilitiesCards,
  secondaryCapabilitiesColumns,
  secondaryCapabilitiesCtaLabel,
  secondaryCapabilitiesCtaUrl,

  // Remote team / offices
  remoteTeamEyebrow,
  remoteTeamHeading,
  remoteTeamHeadingAccent,
  remoteTeamSubheading,
  officeLocations,
  remoteFeatures,
  remoteTeamCtaLabel,
  remoteTeamCtaUrl,

  // Feature list
  featureListHeading,
  featureListHeadingAccent,
  featureListSubheading,
  featureListTheme,
  featureListColumns,
  featureListItems,

  // Services cards
  servicesHeading,
  servicesHeadingAccent,
  servicesSubheading,
  servicesTheme,
  servicesCards,

  // Industry tabs
  industryHeading,
  industryTabs,

  // Why Product Teams (Monday PM)
  whyProductTeamsHeadingPart1,
  whyProductTeamsHeadingAccent,
  whyProductTeamsSubheading,
  whyProductTeamsCards,

  // Strategic Approach (Monday PM)
  strategicApproachHeadingPart1,
  strategicApproachHeadingAccent,
  strategicApproachSubheading,
  strategicApproachTabs,

  // Industry Product Solutions (Monday PM)
  industryProductSolutionsHeading,
  industryProductSolutionsTabs,

  // Product Development (Monday PM)
  productDevelopmentHeadingPart1,
  productDevelopmentHeadingAccent,
  productDevelopmentHeadingPart2,
  productDevelopmentTabs,

  // Solution cards
  solutionCards,

  // Case study cards
  caseStudySectionHeading,
  caseStudyCards,

  // Bottom video
  bottomVideoUrl,
  bottomVideoTitle,

  // Text content
  textContentSections,

  // Application form
  applicationFormHeading,
  applicationFormEmbedUrl,

  // Join stats
  joinHeadingPart1,
  joinHeadingAccent,
  joinHeadingPart2,
  joinSubheading,
  joinStats,
  joinFootnote,

  // monday Service specific
  serviceHeroImage,
  comparisonHeadingAccent,
  comparisonEyebrow,
  featureTabsIntroSubheading,
  fourCardsHeadingPart1,
  fourCardsHeadingAccent,
  fourCardsCtaLabel,
  fourCardsCtaUrl,
  fourCards,
  faqHeading,
  faqEyebrow,
  faqFlatItems,
  strategicColumnsHeadingPart1,
  strategicColumnsHeadingAccent,
  strategicColumnsSubheading,
  strategicColumns,

  // Section visibility toggles
  hideDiscoverSection,
  hideJoinStatsSection,
  hideTestimonialBanner,
  hideSecurityBadgeSection,
  hideTestimonialsSection,
  hideFaqSection,
  hideCapabilitiesSection,
  hideCaseStudyCardsSection,
  hideSolutionCardsSection
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
    contactEmail,
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
    badgeMondayPartners,
    navbarCtaLabel,
    footerCtaLabel,
    footerPartnerExpertiseHeading,
    footerServicesHeading,
    footerDepartmentSolutionsHeading,
    footerIndustrySolutionsHeading,
    footerOurLocationsHeading,
    footerLegalLinks,
    footerCopyrightText
  }`)
}

export async function getTeamMembers() {
  return client.fetch(
    `*[_type == "teamMember"] | order(order asc) { _id, name, role, emoji, photo, bio, linkedinUrl, regions, order }`
  )
}

export async function getCaseStudies() {
  return client.fetch(
    `*[_type == "caseStudy"] { _id, clientName, clientRole, clientCompany, quote, logo, profilePhoto, linkedinUrl }`
  )
}

export async function getFaqItems() {
  return client.fetch(
    `*[_type == "faqItem"] | order(coalesce(categoryOrder, 99) asc, order asc) {
      _id, question, answer, category, categoryOrder, order, pages
    }`
  )
}

/**
 * Return every faqItem that should render on the given page, already
 * sorted so items within each category are in the right order and
 * categories follow the curated tab order.
 *
 * Pass the page key that matches an entry in faqItem.pages (see the
 * schema's `pages` dropdown). The /faqs page uses `"faqs"`.
 */
export async function getFaqItemsForPage(pageKey: string) {
  return client.fetch(
    `*[_type == "faqItem" && $pageKey in pages] | order(coalesce(categoryOrder, 99) asc, order asc) {
      _id, question, answer, category, categoryOrder, order
    }`,
    { pageKey }
  )
}

export async function getPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, seoTitle, seoDescription,
      heroEyebrow, heroHeading, heroHeadingAccent, heroSubheading, heroBody, heroImage,
      heroLocalVideoSrc,
      heroStats,
      primaryCtaLabel, primaryCtaUrl,
      secondaryCtaLabel, secondaryCtaUrl,
      heroVideoUrl, heroVideoTitle,
      body, pageType,

      // Capabilities grid
      capabilitiesEyebrow, capabilitiesHeading, capabilitiesHeadingAccent,
      capabilitiesSubheading, capabilitiesTheme, capabilitiesColumns,
      capabilitiesCards, capabilitiesCtaLabel, capabilitiesCtaUrl,

      // Secondary capabilities
      secondaryCapabilitiesEyebrow, secondaryCapabilitiesHeading,
      secondaryCapabilitiesHeadingAccent, secondaryCapabilitiesSubheading,
      secondaryCapabilitiesCards, secondaryCapabilitiesColumns,
      secondaryCapabilitiesCtaLabel, secondaryCapabilitiesCtaUrl,

      // Partner ecosystem
      partnerEcosystemEyebrow, partnerEcosystemHeading,
      partnerEcosystemHeadingAccent, partnerEcosystemSubheading,
      partnerEcosystemCards[]{ _key, name, tier, description, logo, tint },

      // Remote team / offices
      remoteTeamEyebrow, remoteTeamHeading, remoteTeamHeadingAccent,
      remoteTeamSubheading, officeLocations, remoteFeatures,
      remoteTeamCtaLabel, remoteTeamCtaUrl,

      // Application form
      applicationFormHeading, applicationFormEmbedUrl,

      comparisonHeading, comparisonSubheading, comparisonTabs,
      methodologyHeading, methodologySteps,
      calendlyHeading, calendlySubheading,
      faqTabs,
      joinHeadingPart1, joinHeadingAccent, joinHeadingPart2,
      joinSubheading, joinStats, joinFootnote,
      logoCloudHeadingPart1, logoCloudHeadingAccent, logoCloudDescription,
      textContentSections,
      heroPartnerBadges[]{ name, image, width, height },

      // Documents (PDFs)
      documents[]{ _key, label, "fileUrl": file.asset->url },

      // Section visibility toggles
      hideDiscoverSection, hideJoinStatsSection, hideTestimonialBanner,
      hideSecurityBadgeSection, hideTestimonialsSection, hideFaqSection,
      hideCapabilitiesSection, hideCaseStudyCardsSection, hideSolutionCardsSection,
      hideHeroSubheading,

      // Case study cards
      caseStudySectionHeading, caseStudyCards,

      // Testimonials
      testimonialsHeading,

      // Discover CTA
      discoverHeading, discoverPrimaryCtaLabel, discoverPrimaryCtaUrl,
      discoverSecondaryCtaLabel, discoverSecondaryCtaUrl,

      // Testimonial banner
      testimonialBannerHeadingPart1, testimonialBannerHeadingAccent,
      testimonialBannerHeadingPart2, testimonialBannerPrimaryCtaLabel,
      testimonialBannerPrimaryCtaUrl, testimonialBannerSecondaryCtaLabel,
      testimonialBannerSecondaryCtaUrl
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
    heroPartnerBadges[]{ image, alt },
    heroMondayPartnersImage,
    heroCertificationBadge, heroImage,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    logoCloudHeadingPart1, logoCloudHeadingAccent,
    videoEmbedUrl, videoTitle,
    servicesIntroHeadingPart1, servicesIntroHeadingAccent, servicesIntroHeadingPart2,
    servicesIntroImage,
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
    heroPartnerBadges[]{ image, alt },
    heroMondayPartnersImage,
    heroCertificationBadge, heroImage,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    logoCloudHeadingPart1, logoCloudHeadingAccent,
    videoEmbedUrl, videoTitle,
    trainingIntroHeading, trainingIntroSubheading,
    trainingSectionHeading, trainingTabs,
    empowerEyebrow, empowerHeading, empowerBody,
    empowerImage, empowerCtaLabel, empowerCtaUrl,
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
    heroSubheading,
    heroPartnerBadges[]{ image, alt },
    heroMondayPartnersImage,
    heroProductImages[]{ image, alt },
    heroCertificationBadge, heroImage,
    videoEmbedUrl, videoTitle,
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

export async function getMakePartnersPage() {
  return client.fetch(`*[_type == "makePartnersPage"][0]{
    title, seoTitle, seoDescription,
    heroHeadingPart1, heroHeadingAccent, heroSubheading,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroImage,
    logoCloudHeadingPart1, logoCloudHeadingAccent,
    comparisonHeading, comparisonTabs,
    showcaseHeading, showcaseSubheading,
    showcaseCards[]{ heading, body, imageRight, mediaType, image, "videoUrl": video.asset->url },
    calendlyHeading, calendlySubheading,
    testimonialsHeading, testimonialsCtaLabel, testimonialsCtaUrl,
    statCardValue, statCardSubtitle, statCardCtaLabel, statCardCtaUrl,
    joinHeadingPart1, joinHeadingAccent, joinHeadingPart2,
    joinStats, joinCtaLabel, joinCtaUrl,
    testimonialBannerHeadingPart1, testimonialBannerHeadingAccent, testimonialBannerHeadingPart2,
    testimonialBannerPrimaryCtaLabel, testimonialBannerPrimaryCtaUrl,
    testimonialBannerSecondaryCtaLabel, testimonialBannerSecondaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    announcementHeading, announcementBody, announcementImage,
    featureListsHeading, featureListsSubheading, featureListsRightEyebrow, featureListsFooter,
    featureListLeft, featureListRight,
    discoverHeading
  }`)
}

export async function getHomePage() {
  return client.fetch(`*[_type == "homePage"][0]{
    title, seoTitle, seoDescription, contentBlocks[]{..., heroLocalVideoSrc}
  }`)
}
