import { getTeamMembers } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"
import Image from "next/image"
import HeroSection from "@/components/HeroSection"

export const metadata = {
  title: "Meet the Team | Fruition Services",
  description: "Meet the Fruition team — 30+ certified monday.com consultants and implementation specialists worldwide.",
}

interface TeamMember {
  name: string
  role: string
  photo?: {asset: {_ref: string}}
  bio?: string
  linkedinUrl?: string
}

export default async function TeamPage() {
  const members: TeamMember[] = await getTeamMembers()
  return (
    <div>
      <HeroSection heading="Meet the Team" subheading="The people behind 500+ successful monday.com implementations."
        primaryCta={{ label: "Book a Consultation", url: "https://calendly.com/global-calendar-fruitionservices" }} />
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {members.length > 0 ? members.map((m) => (
          <div key={m.name} className="text-center">
            {m.photo && (
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src={urlFor(m.photo).width(128).height(128).url()} alt={m.name} fill className="object-cover" />
              </div>
            )}
            <h3 className="font-semibold text-gray-900">{m.name}</h3>
            <p className="text-sm text-blue-700">{m.role}</p>
          </div>
        )) : <p className="col-span-4 text-gray-500 text-center">Team profiles coming soon.</p>}
      </div>
    </div>
  )
}