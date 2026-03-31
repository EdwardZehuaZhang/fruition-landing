import { getFaqItems } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export const metadata = {
  title: "FAQs | Fruition Services",
  description: "Frequently asked questions about monday.com implementation, consulting, training and Fruition services.",
}

export default async function FaqsPage() {
  const faqs = await getFaqItems()
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Frequently Asked Questions</h1>
      <div className="space-y-8">
        {faqs.length > 0 ? faqs.map((faq: { question: string; answer: Array<{_type: string; [key: string]: unknown}> }, i: number) => (
          <div key={i} className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
            <div className="prose"><PortableText value={faq.answer} components={portableTextComponents} /></div>
          </div>
        )) : <p className="text-gray-500">FAQs coming soon.</p>}
      </div>
    </div>
  )
}