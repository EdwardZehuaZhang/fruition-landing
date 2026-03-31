import { getCaseStudies } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"

export const metadata = {
  title: "Case Studies | Fruition Services",
  description: "Real results from 500+ businesses. See how Fruition transformed operations with monday.com.",
}

export default async function TestimonialsPage() {
  const cases = await getCaseStudies()
  return (
    <div>
      <HeroSection heading="Case Studies" subheading="Real results from real businesses. See how Fruition has transformed operations for 500+ clients."
        primaryCta={{ label: "Book a Consultation", url: "https://calendly.com/global-calendar-fruitionservices" }} />
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {cases.length > 0 ? cases.map((c: { clientName: string; clientRole?: string; clientCompany?: string; quote: string }) => (
          <div key={c.clientName} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <blockquote className="text-gray-700 italic mb-6">"{c.quote}"</blockquote>
            <p className="font-semibold text-gray-900">{c.clientName}</p>
            {c.clientRole && <p className="text-sm text-gray-500">{c.clientRole}{c.clientCompany ? `, ${c.clientCompany}` : ""}</p>}
          </div>
        )) : <p className="col-span-2 text-gray-500 text-center">Case studies coming soon.</p>}
      </div>
    </div>
  )
}