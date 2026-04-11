import { getPageBySlug } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"
import HeroSection from "@/components/HeroSection"

export async function generateMetadata() {
  const page = await getPageBySlug("careers")
  return {
    title: page?.seoTitle || "Careers | Fruition Services",
    description: page?.seoDescription || "Join the Fruition team. We are looking for talented people to help businesses transform the way they work.",
  }
}

export default async function CareersPage() {
  const page = await getPageBySlug("careers")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "Join the Fruition Team"}
        subheading={page?.heroSubheading || "Help businesses transform the way they work. We are always looking for talented people."}
        heroImage={page?.heroImage}
        primaryCta={{
          label: page?.primaryCtaLabel || "View Open Roles",
          url: page?.primaryCtaUrl || "mailto:careers@fruitionservices.io",
        }}
      />
      {page?.body && (
        <div className="max-w-4xl mx-auto px-4 py-16 prose prose-lg">
          <PortableText value={page.body} components={portableTextComponents} />
        </div>
      )}
    </div>
  )
}
