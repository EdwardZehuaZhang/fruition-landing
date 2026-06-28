import { getAiPartnerPageBySlug, getSiteSettings } from "@/sanity/queries"
import AiPartnerTemplate from "@/components/AiPartnerTemplate"

const SLUG = "google-gemini-vertex-ai-partner"

export async function generateMetadata() {
  const page = await getAiPartnerPageBySlug(SLUG)
  return {
    title: page?.seoTitle || page?.title || SLUG,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings] = await Promise.all([
    getAiPartnerPageBySlug(SLUG),
    getSiteSettings(),
  ])
  return <AiPartnerTemplate page={page} siteSettings={siteSettings} />
}
