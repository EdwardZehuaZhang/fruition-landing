import Link from "next/link"
import HeroSection from "@/components/HeroSection"
import { getAllPartnershipPages } from "@/sanity/queries"

export const metadata = {
  title: "Partnerships | Fruition Services",
  description: "Fruition is a certified partner for monday.com, Make, n8n, ClickUp, HubSpot, Atlassian and more.",
}

export default async function PartnershipsPage() {
  const partners = await getAllPartnershipPages()
  return (
    <div>
      <HeroSection
        heading="Our Partnerships"
        subheading="Certified and trusted partnerships with the world's leading work management platforms."
        primaryCta={{ label: "Book a Consultation", url: "https://calendly.com/global-calendar-fruitionservices" }}
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
