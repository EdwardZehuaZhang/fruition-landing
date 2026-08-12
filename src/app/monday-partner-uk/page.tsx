import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
  getTeamMembers,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import { mergeTeamMembers } from "@/lib/mergeTeamMembers"
import { addMondayUtm, UK_PARTNER_CAMPAIGN } from "@/lib/mondayUtm"
import MondayPartnerUkContent from "./MondayPartnerUkContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "monday-partner-uk"

export async function generateMetadata() {
  const page = await getLocationPageBySlug(SLUG)
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-partner-uk" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-partner-uk",
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
  // Any CTA an editor points at monday.com - hero secondary, sticky bar, CRO
  // blocks, feature blocks, team grid - is tagged for partner attribution.
  return (
    <MondayPartnerUkContent
      page={addMondayUtm(page, UK_PARTNER_CAMPAIGN)}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
      teamMembers={mergeTeamMembers(teamMembers || [], siteSettings?.excludedTeamMemberNames || [])}
    />
  )
}
