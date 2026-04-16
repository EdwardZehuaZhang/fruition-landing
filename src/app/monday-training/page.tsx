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
    title: data?.seoTitle || "monday.com Training | Fruition Services",
    description:
      data?.seoDescription ||
      "Official monday.com training for your entire team. Get certified and confident on the platform.",
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
    />
  )
}
