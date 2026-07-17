import type { Metadata } from 'next'
import BlockRenderer from '@/features/page-builder/BlockRenderer'
import { getHomePage, getSiteSettings } from '@/features/content/loaders'
import { buildOgMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage()
  const title = homePage?.seoTitle ?? "Fruition | monday.com Platinum Partners | monday CRM Experts"
  const description = homePage?.seoDescription ?? "monday.com Partner certified — Fruition is an expert in Monday implementation and integration."
  return {
    alternates: { canonical: '/' },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/",
    }),
  }
}

export default async function Home() {
  const [homePage, settings] = await Promise.all([getHomePage(), getSiteSettings()])

  if (homePage?.contentBlocks?.length) {
    return <BlockRenderer blocks={homePage.contentBlocks} siteSettings={settings} />
  }

  return null
}
