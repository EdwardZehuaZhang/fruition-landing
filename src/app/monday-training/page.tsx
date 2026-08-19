import {
  getMondayTrainingPage,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import MondayTrainingContent from "./MondayTrainingContent"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const data = await getMondayTrainingPage()
  const title = data?.seoTitle
  const description = data?.seoDescription
  return {
    alternates: { canonical: "/monday-training" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-training",
    }),
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
