import { getPageBySlug } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"
import HeroSection from "@/components/HeroSection"

export const metadata = { title: "About Us | Fruition Services" }

export default async function AboutPage() {
  const page = await getPageBySlug("about-us")
  return (
    <div>
      <HeroSection heading="About Fruition" subheading="500+ clients globally trust Fruition for monday.com implementation, consulting, and training."
        primaryCta={{ label: "Book a Consultation", url: "https://calendly.com/global-calendar-fruitionservices" }} />
      {page?.body && <div className="max-w-4xl mx-auto px-4 py-16 prose prose-lg"><PortableText value={page.body} components={portableTextComponents} /></div>}
    </div>
  )
}