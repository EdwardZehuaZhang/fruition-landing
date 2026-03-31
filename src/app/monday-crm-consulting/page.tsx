import { getServicePageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

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
    <div>
      <HeroSection
        heading={page?.heroHeading || "monday CRM Consulting"}
        subheading={page?.heroSubheading || "Get the most out of monday CRM with expert guidance."}
        heroImage={page?.heroImage}
        primaryCta={{ label: "Book a Consultation", url: "https://calendly.com/global-calendar-fruitionservices" }}
      />
      {page?.body && (
        <div className="max-w-4xl mx-auto px-4 py-16 prose prose-lg">
          <PortableText value={page.body} components={portableTextComponents} />
        </div>
      )}
    </div>
  )
}