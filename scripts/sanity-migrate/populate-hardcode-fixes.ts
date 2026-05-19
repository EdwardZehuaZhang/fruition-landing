/**
 * Populate Sanity fields that replaced hardcoded TSX values during the
 * security-compliance hardcode-removal pass.
 *
 * Idempotent — uses setIfMissing so editor changes in Studio are preserved.
 *
 *   npx tsx scripts/sanity-migrate/populate-hardcode-fixes.ts
 */
import { writeClient, withKeys, uploadLocalImage } from './lib'

async function getDocId(type: string, slug: string): Promise<string> {
  const doc = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{_id}`,
    { type, slug },
  )
  if (!doc?._id) throw new Error(`No ${type} with slug=${slug}`)
  return doc._id
}

async function patchMarketing() {
  const id = await getDocId('industryPage', 'monday-for-marketing')
  await writeClient
    .patch(id)
    .setIfMissing({
      whyBestHeading:
        'Why the best use monday.com to manage their Marketing & Creative teams',
    })
    .commit()
  console.log('✅ monday-for-marketing — whyBestHeading set')
}

async function patchProfessionalServices() {
  const id = await getDocId('industryPage', 'monday-for-professional-services')
  await writeClient
    .patch(id)
    .setIfMissing({
      workflowTabsHeading: 'Capabilities for every services workflow',
      testimonialBannerPrimaryCtaLabel: '🚀 Start Your Transformation',
    })
    .commit()
  console.log(
    '✅ monday-for-professional-services — workflowTabsHeading + testimonialBannerPrimaryCtaLabel set',
  )
}

async function patchRealEstate() {
  const id = await getDocId('industryPage', 'monday-for-real-estate')

  // Upload hero image so heroImage field is populated (was hardcoded /real-estate-hero.png)
  let heroImageRef: ReturnType<typeof uploadLocalImage> extends Promise<infer R> ? R : never
  try {
    heroImageRef = await uploadLocalImage('/real-estate-hero.png')
  } catch (e) {
    console.warn('⚠️  hero image upload failed:', (e as Error).message)
    heroImageRef = undefined as unknown as typeof heroImageRef
  }

  const caseStudyStats = withKeys([
    { value: '1,250-3,000', label: 'automations and integrations' },
    { value: '70%', label: 'increase in efficiency' },
  ])

  const patch = writeClient.patch(id).setIfMissing({
    whyBestHeading:
      'Why the best use monday.com to manage their Real Estate operations',
    caseStudyBlockHeading: 'Real Estate Case Studies',
    caseStudyVideoUrl: 'https://www.youtube.com/watch?v=TX4kk4OlQfY',
    caseStudyVideoTitle: 'Ray White customer story',
    caseStudyStats,
    caseStudyQuote:
      'We were able to customise the CRM on top of the monday.com Work OS to fit the needs of our day-to-day activities.',
    caseStudyQuoteAuthor: 'Kyle Dorman | Department Manager – Operations, Ray White',
    caseStudyCtaLabel: '🚀 Book a Consultation',
    bottomVideoTitle: 'monday.com for Real Estate',
    ...(heroImageRef ? { heroImage: heroImageRef } : {}),
  })

  await patch.commit()
  console.log('✅ monday-for-real-estate — caseStudy* + heroImage + whyBestHeading set')
}

async function main() {
  await patchMarketing()
  await patchProfessionalServices()
  await patchRealEstate()
  console.log('🎉 done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
