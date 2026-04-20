import {
  getImplementationPackagesPage,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import ImplementationPackagesContent from "./ImplementationPackagesContent"

export async function generateMetadata() {
  const data = await getImplementationPackagesPage()
  return {
    title: data?.seoTitle,
    description: data?.seoDescription,
  }
}

export default async function Page() {
  const [data, settings, caseStudies, centralFaqs] = await Promise.all([
    getImplementationPackagesPage(),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("implementation-packages"),
  ])
  return (
    <ImplementationPackagesContent
      data={data}
      carouselLogos={settings?.carouselLogos || []}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
      navbarPartnerBadges={settings?.navbarPartnerBadges || []}
    />
  )
}
