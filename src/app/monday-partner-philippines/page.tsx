import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
  getTeamMembers,
  getClosingCtaForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import { mergeTeamMembers } from "@/lib/mergeTeamMembers"
import MondayPartnerPhilippinesContent from "./MondayPartnerPhilippinesContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "monday-partner-philippines"

export async function generateMetadata() {
  const page = await getLocationPageBySlug(SLUG)
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-partner-philippines" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-partner-philippines",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, teamMembers, closingCta] = await Promise.all([
    getLocationPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(SLUG),
    getTeamMembers(),
    getClosingCtaForPage(SLUG),
  ])
  return (
    <MondayPartnerPhilippinesContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
      teamMembers={mergeTeamMembers(teamMembers || [], siteSettings?.excludedTeamMemberNames || [])}
      closingCta={closingCta}
    />
  )
}
