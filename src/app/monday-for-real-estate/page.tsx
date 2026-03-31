import { getIndustryPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-real-estate")
  return {
    title: page?.seoTitle || "monday.com for Real Estate | Fruition Services",
    description: page?.seoDescription || "monday.com solutions for real estate companies. Manage listings, deals and client relationships.",
  }
}

export default async function Page() {
  const page = await getIndustryPageBySlug("monday-for-real-estate")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "monday.com for Real Estate"}
        subheading={page?.heroSubheading || "monday.com solutions for real estate companies."}
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