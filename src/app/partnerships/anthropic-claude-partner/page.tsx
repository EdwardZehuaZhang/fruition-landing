import { getAiPartnerPageBySlug, getSiteSettings } from "@/sanity/queries"
import AiPartnerTemplate from "@/components/AiPartnerTemplate"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "anthropic-claude-partner"

export async function generateMetadata() {
  const page = await getAiPartnerPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/partnerships/anthropic-claude-partner" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/partnerships/anthropic-claude-partner",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings] = await Promise.all([
    getAiPartnerPageBySlug(SLUG),
    getSiteSettings(),
  ])
  return <AiPartnerTemplate page={page} siteSettings={siteSettings} />
}
