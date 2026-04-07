import { getServicePageBySlug } from "@/sanity/queries"
import ServicePageTemplate from "@/components/ServicePageTemplate"

export async function generateMetadata() {
  const page = await getServicePageBySlug("monday-crm-consulting")
  return {
    title: page?.seoTitle || "monday CRM Consulting | Fruition Services",
    description: page?.seoDescription || "Expert monday CRM consulting and implementation. Build a CRM tailored to your business in 2-3 weeks.",
  }
}

export default async function Page() {
  const page = await getServicePageBySlug("monday-crm-consulting")
  return (
    <ServicePageTemplate
      heroHeading={page?.heroHeading || "monday.com CRM Consulting & monday.com CRM Implementation"}
      heroSubheading={page?.heroSubheading}
      heroPurpleAccent="CRM Consulting"
      primaryCtaLabel={page?.primaryCtaLabel || "🚀 Book a Consultation"}
      primaryCtaUrl={page?.primaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices"}
      secondaryCtaLabel={page?.secondaryCtaLabel}
      secondaryCtaUrl={page?.secondaryCtaUrl}
    />
  )
}
