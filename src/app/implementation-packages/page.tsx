import {
  getImplementationPackagesPage,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import ImplementationPackagesContent from "./ImplementationPackagesContent"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const data = await getImplementationPackagesPage()
  const title = data?.seoTitle
  const description = data?.seoDescription
  return {
    alternates: { canonical: "/implementation-packages" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/implementation-packages",
    }),
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
