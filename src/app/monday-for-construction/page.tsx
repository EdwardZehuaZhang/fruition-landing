import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"
import ConstructionExtras from "./ConstructionExtras"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-construction")
  return {
    title:
      page?.seoTitle || "monday.com for Construction | Fruition Services",
    description:
      page?.seoDescription ||
      "monday.com implementation for construction companies. Manage projects, sites and subcontractors.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getIndustryPageBySlug("monday-for-construction"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-construction"),
  ])
  return (
    <UniversalPageTemplate
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
      heroVideoSrc="/videos/construction-hero.mp4"
      afterFaq={<ConstructionExtras />}
    />
  )
}
