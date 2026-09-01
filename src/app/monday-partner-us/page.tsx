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
  const [page, siteSettings, caseStudies, centralFaqs, teamMembers, closingCta] = await Promise.all([
    getLocationPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(SLUG),
    getTeamMembers(),
    getClosingCtaForPage(SLUG),
  ])
  return (
    <MondayPartnerUsContent
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
      closingCta={closingCta}
    />
  )
}
