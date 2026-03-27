import { getPageBySlug } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"
import HeroSection from "@/components/HeroSection"

export const metadata = { title: "Careers | Fruition Services" }

export default async function CareersPage() {
  const page = await getPageBySlug("careers")
  return (
    <div>
      <HeroSection heading="Join the Fruition Team" subheading="Help businesses transform the way they work. We are always looking for talented people."
        primaryCta={{ label: "View Open Roles", url: "mailto:careers@fruitionservices.io" }} />
      {page?.body && <div className="max-w-4xl mx-auto px-4 py-16 prose prose-lg"><PortableText value={page.body} components={portableTextComponents} /></div>}
    </div>
  )
}