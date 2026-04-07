import { getServicePageBySlug } from "@/sanity/queries"
import ServicePageTemplate from "@/components/ServicePageTemplate"

export async function generateMetadata() {
  const page = await getServicePageBySlug("monday-implementation-consultants")
  return {
    title: page?.seoTitle || "monday.com Implementation Consultants | Fruition Services",
    description: page?.seoDescription || "Certified monday.com implementation consultants helping 500+ businesses streamline their workflows.",
  }
}

export default async function Page() {
  const page = await getServicePageBySlug("monday-implementation-consultants")
  return (
    <ServicePageTemplate
      heroHeading={page?.heroHeading || "monday.com Implementation Consultants\nCertified monday.com Experts"}
      heroSubheading={page?.heroSubheading || "Make monday.com work for you and the architecture of your business with a monday.com implementation expert."}
      heroPurpleAccent="Implementation Consultants"
      primaryCtaLabel={page?.primaryCtaLabel || "🚀 Book a Consultation"}
      primaryCtaUrl={page?.primaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices"}
      secondaryCtaLabel={page?.secondaryCtaLabel}
      secondaryCtaUrl={page?.secondaryCtaUrl}
    />
  )
}
