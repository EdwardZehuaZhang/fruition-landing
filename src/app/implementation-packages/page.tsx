import { getServicePageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export const metadata = { title: "Implementation Packages | Fruition Services" }

export default async function Page() {
  const page = await getServicePageBySlug("implementation-packages")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "Implementation Packages"}
        subheading={page?.heroSubheading || "Structured packages to get your team running on monday.com fast."}
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