import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const doc = await client.fetch(`*[_type=="industryPage" && slug.current=="monday-for-retail"][0]{
  _id, _rev, title, slug,
  heroImage,
  "fields": {
    "capabilitiesHeading": capabilitiesHeading,
    "capabilitiesCards": count(capabilitiesCards),
    "comparisonHeading": comparisonHeading,
    "comparisonTabs": count(comparisonTabs),
    "methodologyHeading": methodologyHeading,
    "methodologySteps": count(methodologySteps),
    "solutionCards": count(solutionCards),
    "caseStudyCards": count(caseStudyCards),
    "calendlyHeading": calendlyHeading,
    "faqTabs": count(faqTabs),
    "joinStats": count(joinStats),
    "joinHeadingPart1": joinHeadingPart1,
    "joinHeadingAccent": joinHeadingAccent,
    "joinHeadingPart2": joinHeadingPart2,
    "hideFaqSection": hideFaqSection,
    "hideJoinStatsSection": hideJoinStatsSection,
    "hideTestimonialBanner": hideTestimonialBanner,
    "hideDiscoverSection": hideDiscoverSection,
    "hideCapabilitiesSection": hideCapabilitiesSection,
    "hideCaseStudyCardsSection": hideCaseStudyCardsSection,
    "hideSolutionCardsSection": hideSolutionCardsSection
  }
}`)
console.log(JSON.stringify(doc, null, 2))
