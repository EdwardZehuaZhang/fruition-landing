import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
  getTeamMembers,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import { mergeTeamMembers } from "@/lib/mergeTeamMembers"
import MondayPartnerSingaporeContent from "./MondayPartnerSingaporeContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "monday-partner-singapore"

export async function generateMetadata() {
  const page = await getLocationPageBySlug(SLUG)
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-partner-singapore" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-partner-singapore",
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
    <MondayPartnerSingaporeContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
      teamMembers={mergeTeamMembers(teamMembers || [], [
        ...(siteSettings?.excludedTeamMemberNames || []),
        // Josh shows only on the Australia partner page; his Sanity regions
        // can't express that (AU and SG share "APAC"), so exclude here.
        "Josh Jebathilak",
      ])}
    />
  )
}
