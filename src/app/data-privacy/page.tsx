import { getPageBySlug } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export const metadata = { title: "Data Privacy | Fruition Services" }

export default async function PrivacyPage() {
  const page = await getPageBySlug("data-privacy")
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Data Privacy Policy</h1>
      {page?.body ? <div className="prose prose-lg"><PortableText value={page.body} components={portableTextComponents} /></div>
        : <p className="text-gray-500">Privacy policy coming soon.</p>}
    </div>
  )
}