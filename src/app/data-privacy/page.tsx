import { getPageBySlug } from "@/sanity/queries"
import PolicyContent from "@/components/PolicyContent"
import VisitorTrackingDisclosure from "@/components/VisitorTrackingDisclosure"

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
        <h1 className="text-4xl font-bold tracking-tight text-ink mb-10">
          {page.heroHeading}
        </h1>
      )}
      {page.body && <PolicyContent value={page.body} />}
      <VisitorTrackingDisclosure />
    </div>
  )
}
