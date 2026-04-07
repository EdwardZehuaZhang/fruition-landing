import type { Metadata } from 'next'
import BlockRenderer from '@/features/page-builder/BlockRenderer'
import { getHomePage, getSiteSettings } from '@/features/content/loaders'

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage()
  return {
    title: homePage?.seoTitle ?? 'Fruition | monday.com Platinum Partners | monday CRM Experts',
    description: homePage?.seoDescription ?? 'Fruition is a Platinum monday.com consulting partner with over 500+ implementations completed within the Private & Public sectors across Australia, US and the UK.',
  }
}

export default async function Home() {
  const homePage = await getHomePage()

  if (homePage?.contentBlocks?.length) {
    return <BlockRenderer blocks={homePage.contentBlocks} />
  }

  // Fallback: no homePage document in Sanity yet
  const settings = await getSiteSettings()

  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">
        {settings?.siteName ?? 'Fruition Services'}
      </h1>
      <p className="mb-2">
        Content for this page can be managed in{' '}
        <a href="/studio" className="underline">Sanity Studio</a>.
      </p>
      {settings?.phone && (
        <p className="mb-2">Phone: {settings.phone}</p>
      )}
      {settings?.calendlyLink && (
        <p className="mb-2">
          <a href={settings.calendlyLink} className="underline">
            Book a consultation
          </a>
        </p>
      )}
      <p className="mt-8 text-sm text-gray-500">
        Create a &ldquo;Home Page&rdquo; document in the Studio and add content blocks to replace this fallback.
      </p>
    </main>
  )
}
