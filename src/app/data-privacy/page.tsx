import { getPageBySlug } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"

export async function generateMetadata() {
  const page = await getPageBySlug("data-privacy")
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function PrivacyPage() {
  const page = await getPageBySlug("data-privacy")

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {page.heroHeading && (
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {page.heroHeading}
        </h1>
      )}
      {page.body && (
        <div className="prose prose-lg prose-gray max-w-none">
          <PortableText value={page.body} />
        </div>
      )}
    </div>
  )
}
