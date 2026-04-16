import Link from "next/link"
import HeroSection from "@/components/HeroSection"
import { getAllPartnershipPages, getPageBySlug } from "@/sanity/queries"

export async function generateMetadata() {
  const page = await getPageBySlug("partnerships")
  return {
    title: page?.seoTitle || "Partnerships | Fruition Services",
    description: page?.seoDescription || "Fruition is a certified partner for monday.com, Make, n8n, ClickUp, HubSpot, Atlassian and more.",
  }
}

export default async function PartnershipsPage() {
  const [partners, page] = await Promise.all([
    getAllPartnershipPages(),
    getPageBySlug("partnerships"),
  ])

  const heading = page?.heroHeading || "Our Partnerships"
  const subheading = page?.heroSubheading || "Certified and trusted partnerships with the world's leading work management platforms."
  const ctaLabel = page?.primaryCtaLabel || "Book a Consultation"
  const ctaUrl = page?.primaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices"

  return (
    <div>
      <HeroSection
        heading={heading}
        subheading={subheading}
        primaryCta={{ label: ctaLabel, url: ctaUrl }}
      />
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((p: { slug: string; title: string; heroSubheading?: string }) => (
          <Link
            key={p.slug}
            href={`/partnerships/${p.slug}`}
            className="p-6 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{p.title}</h3>
            {p.heroSubheading && <p className="text-gray-600 text-sm">{p.heroSubheading}</p>}
          </Link>
        ))}
      </div>
    </div>
  )
}
