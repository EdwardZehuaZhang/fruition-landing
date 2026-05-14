import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
  getTeamMembers,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import { mergeTeamMembers } from "@/lib/mergeTeamMembers"
import MondayPartnerAustraliaContent from "./MondayPartnerAustraliaContent"

const SLUG = "monday-partner-australia"

export async function generateMetadata() {
  const page = await getLocationPageBySlug(SLUG)
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, teamMembers] = await Promise.all([
    getLocationPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(SLUG),
    getTeamMembers(),
  ])
  return (
    <MondayPartnerAustraliaContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
      teamMembers={mergeTeamMembers(teamMembers || [])}
    />
  )
}
