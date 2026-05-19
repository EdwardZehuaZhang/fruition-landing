/**
 * Seed the remaining Sanity fields on `mondayImplementationConsultantsPage`
 * that the frontend was still falling back to hardcoded constants for.
 *
 * Uses `setIfMissing` everywhere so fields already populated in Studio are
 * preserved. Re-runnable safely.
 *
 *   pnpm tsx scripts/sanity-migrate/monday-implementation-consultants-content.ts
 */
import { writeClient, uploadLocalImage, withKeys } from './lib'

const DOC_ID = 'mondayImplementationConsultantsPage'
const TYPE = 'mondayImplementationConsultantsPage'

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type][0]{ _id }`,
    { type: TYPE },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc found`)

  console.log('Uploading fallback images...')
  const heroImage = await uploadLocalImage('/images/hero-monday-dashboards.avif')
  const heroMondayPartnersImage = await uploadLocalImage('/images/monday-partners.avif')
  const productCrm = await uploadLocalImage('/images/monday-crm-logo.avif')
  const productWm = await uploadLocalImage('/images/monday-wm-logo.avif')
  const productSvc = await uploadLocalImage('/images/monday-svc-logo.avif')
  const productDev = await uploadLocalImage('/images/monday-dev-logo.avif')

  const heroProductImages = withKeys([
    { _type: 'productImage', image: productCrm, alt: 'monday CRM' },
    { _type: 'productImage', image: productWm, alt: 'monday work management' },
    { _type: 'productImage', image: productSvc, alt: 'monday service' },
    { _type: 'productImage', image: productDev, alt: 'monday dev' },
  ])

  console.log(`Patching ${TYPE}:${existing._id}...`)
  await writeClient
    .patch(existing._id)
    .setIfMissing({
      heroImage,
      heroMondayPartnersImage,
      heroProductImages,
      videoEmbedUrl: 'https://www.youtube.com/embed/7vtrtlfC1Zg',
      videoTitle: 'monday.com Implementation Consultants',
      calendlySubheading:
        'Speak with one of our certified monday.com implementation experts to map out the right setup for your team.',
    })
    .commit()

  console.log(`✓ patched ${DOC_ID}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
