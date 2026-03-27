import Link from "next/link"
import HeroSection from "@/components/HeroSection"

const partners = [
  { slug: "monday-consulting-partner", title: "monday.com Expert Consultants" },
  { slug: "make-partners", title: "Certified Make Partner" },
  { slug: "n8n-integration-partner", title: "Certified n8n Partner" },
  { slug: "certified-clickup-partner", title: "Certified ClickUp Partner" },
  { slug: "certified-guidde-partner", title: "Certified Guidde Partner" },
  { slug: "certified-hubspot-partner", title: "Certified HubSpot Partner" },
  { slug: "hootsuite-delivery-partner", title: "Hootsuite Delivery Partner" },
  { slug: "aircall-partner", title: "Certified Aircall Partner" },
  { slug: "certified-atlassian-partner", title: "Certified Atlassian Partner" },
]

export const metadata = { title: "Partnerships | Fruition Services" }

export default function PartnershipsPage() {
  return (
    <div>
      <HeroSection
        heading="Our Partnerships"
        subheading="Certified and trusted partnerships with the world's leading work management platforms."
        primaryCta={{ label: "Book a Consultation", url: "https://calendly.com/global-calendar-fruitionservices" }}
      />
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((p) => (
          <Link key={p.slug} href={`/partnerships/${p.slug}`}
            className="p-6 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all">
            <h3 className="text-xl font-semibold text-gray-900">{p.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}