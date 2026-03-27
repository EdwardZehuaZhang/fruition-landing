import HeroSection from "@/components/HeroSection"
import { getSiteSettings } from "@/sanity/queries"

export default async function Home() {
  const settings = await getSiteSettings()
  const calendlyUrl = settings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"

  return (
    <>
      <HeroSection
        heading="Fruition | monday.com Platinum Partners"
        subheading="We help businesses streamline workflows, boost productivity, and get the most out of monday.com. From implementation to training and custom solutions."
        primaryCta={{ label: "Book a Consultation", url: calendlyUrl }}
        secondaryCta={{ label: "Explore Solutions", url: "/monday-consulting-solutions/monday-project-management" }}
      />

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Fruition?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Platinum monday.com Partners",
                desc: "We are certified Platinum Partners with deep expertise across all monday.com products.",
              },
              {
                title: "End-to-End Implementation",
                desc: "From discovery to go-live, we handle every step of your monday.com journey.",
              },
              {
                title: "Global Reach",
                desc: "Serving clients across Australia, UK, USA, Singapore, India and beyond.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-blue-700 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}