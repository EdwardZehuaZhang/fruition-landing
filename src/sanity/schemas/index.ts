import siteSettings from './siteSettings'
import blogPost from './blogPost'
import blogCategory from './blogCategory'
import solutionPage from './solutionPage'
import partnershipPage from './partnershipPage'
import locationPage from './locationPage'
import industryPage from './industryPage'
import servicePage from './servicePage'
import teamMember from './teamMember'
import caseStudy from './caseStudy'
import faqItem from './faqItem'
import page from './page'

// Block objects
import heroBlock from './objects/heroBlock'
import richTextBlock from './objects/richTextBlock'
import ctaBlock from './objects/ctaBlock'
import featureListBlock from './objects/featureListBlock'
import testimonialBlock from './objects/testimonialBlock'
import logoCloudBlock from './objects/logoCloudBlock'
import postListBlock from './objects/postListBlock'
import faqBlock from './objects/faqBlock'

// Documents
import homePage from './documents/homePage'

export const schemaTypes = [
  // Existing
  siteSettings,
  blogPost,
  blogCategory,
  solutionPage,
  partnershipPage,
  locationPage,
  industryPage,
  servicePage,
  teamMember,
  caseStudy,
  faqItem,
  page,

  // Block objects
  heroBlock,
  richTextBlock,
  ctaBlock,
  featureListBlock,
  testimonialBlock,
  logoCloudBlock,
  postListBlock,
  faqBlock,

  // Document types
  homePage,
]
