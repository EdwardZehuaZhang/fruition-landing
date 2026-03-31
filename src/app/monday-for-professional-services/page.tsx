import { getIndustryPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-professional-services")
  return {
    title: page?.seoTitle || "monday.com for Professional Services | Fruition Services",
    description: page?.seoDescription || "monday.com for professional services and agencies. Manage clients, projects and billing in one place.",
  }
}

export default async function Page() {
  const page = await getIndustryPageBySlug("monday-for-professional-services")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "monday.com for Professional Services"}
        subheading={page?.heroSubheading || "monday.com for professional services firms."}
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