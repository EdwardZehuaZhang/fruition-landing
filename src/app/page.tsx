import BlockRenderer from '@/features/page-builder/BlockRenderer'
import { getHomePage, getSiteSettings } from '@/features/content/loaders'

export default async function Home() {
  const homePage = await getHomePage()

  if (homePage?.contentBlocks?.length) {
    return (
      <main>
        <BlockRenderer blocks={homePage.contentBlocks} />
      </main>
    )
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
