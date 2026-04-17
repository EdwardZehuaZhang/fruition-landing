import { client } from '../../src/sanity/client'

const PAGES_TO_UPDATE = [
  'monday-for-manufacturing',
  'monday-for-retail',
  'monday-for-professional-services',
  'monday-for-marketing',
  'monday-for-real-estate',
]

async function hideSections() {
  console.log('Starting migration to hide sections on specified pages...')

  for (const slug of PAGES_TO_UPDATE) {
    try {
      // Fetch the page
      const page = await client.fetch(
        `*[_type == "industryPage" && slug.current == $slug][0]`,
        { slug }
      )

      if (!page) {
        console.log(`❌ Page not found: ${slug}`)
        continue
      }

      // Update the page with section visibility toggles
      const updated = await client
        .patch(page._id)
        .set({
          hideDiscoverSection: true,
          hideJoinStatsSection: true,
          hideTestimonialBanner: true,
        })
        .commit()

      console.log(`✅ Updated: ${slug}`)
      console.log(`   - hideDiscoverSection: true`)
      console.log(`   - hideJoinStatsSection: true`)
      console.log(`   - hideTestimonialBanner: true`)
    } catch (error) {
      console.error(`❌ Error updating ${slug}:`, error)
    }
  }

  console.log('\nMigration complete!')
}

hideSections()
