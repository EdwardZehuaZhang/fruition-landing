import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
  getTeamMembers,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import { mergeTeamMembers } from "@/lib/mergeTeamMembers"
import MondayPartnerUsContent from "./MondayPartnerUsContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "monday-partner-us"

export async function generateMetadata() {
  const page = await getLocationPageBySlug(SLUG)
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-partner-us" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-partner-us",
    }),
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
    <MondayPartnerUsContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
      teamMembers={mergeTeamMembers(teamMembers || [], siteSettings?.excludedTeamMemberNames || [])}
    />
  )
}
