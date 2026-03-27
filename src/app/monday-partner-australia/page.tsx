import { getLocationPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export const metadata = { title: "monday.com Partner Australia | Fruition Services" }

export default async function Page() {
  const page = await getLocationPageBySlug("monday-partner-australia")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "monday.com Consultants Australia"}
        subheading={page?.heroSubheading || "Expert monday.com Platinum Partner across Sydney, Melbourne, Brisbane, Adelaide and Perth."}
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