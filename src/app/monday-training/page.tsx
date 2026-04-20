import {
  getMondayTrainingPage,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import MondayTrainingContent from "./MondayTrainingContent"

export async function generateMetadata() {
  const data = await getMondayTrainingPage()
  return {
    title: data?.seoTitle,
    description: data?.seoDescription,
  }
}

export default async function Page() {
  const [data, settings, caseStudies, centralFaqs] = await Promise.all([
    getMondayTrainingPage(),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-training"),
  ])

  return (
    <MondayTrainingContent
      data={data}
      carouselLogos={settings?.carouselLogos || []}
      caseStudies={caseStudies || []}
      siteSettings={settings}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
      navbarPartnerBadges={settings?.navbarPartnerBadges || []}
    />
  )
}
