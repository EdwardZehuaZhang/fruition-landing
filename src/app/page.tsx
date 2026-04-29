import type { Metadata } from 'next'
import BlockRenderer from '@/features/page-builder/BlockRenderer'
import { getHomePage, getSiteSettings } from '@/features/content/loaders'

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage()
  return {
    title: homePage?.seoTitle,
    description: homePage?.seoDescription,
  }
}

export default async function Home() {
  const [homePage, settings] = await Promise.all([getHomePage(), getSiteSettings()])

  if (homePage?.contentBlocks?.length) {
    return <BlockRenderer blocks={homePage.contentBlocks} siteSettings={settings} />
  }

  return null
}
