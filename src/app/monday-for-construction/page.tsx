import { getIndustryPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export const metadata = { title: "monday.com for Construction | Fruition Services" }

export default async function Page() {
  const page = await getIndustryPageBySlug("monday-for-construction")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "monday.com for Construction"}
        subheading={page?.heroSubheading || "monday.com solutions for construction companies."}
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