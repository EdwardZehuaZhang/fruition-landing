import { getLocationPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export const metadata = { title: "monday.com Partner Uk | Fruition Services" }

export default async function Page() {
  const page = await getLocationPageBySlug("monday-partner-uk")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "monday.com Consultants UK"}
        subheading={page?.heroSubheading || "Expert monday.com consulting and implementation across the United Kingdom."}
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