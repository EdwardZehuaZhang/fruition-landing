import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
  getTeamMembers,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import { mergeTeamMembers } from "@/lib/mergeTeamMembers"
import MondayPartnerSingaporeContent from "./MondayPartnerSingaporeContent"

const SLUG = "monday-partner-singapore"

export async function generateMetadata() {
  const page = await getLocationPageBySlug(SLUG)
  return {
    alternates: { canonical: "/monday-partner-singapore" },
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
    <MondayPartnerSingaporeContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
      teamMembers={mergeTeamMembers(teamMembers || [], siteSettings?.excludedTeamMemberNames || [])}
    />
  )
}
