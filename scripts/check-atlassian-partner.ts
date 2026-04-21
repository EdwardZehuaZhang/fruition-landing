import { writeClient } from './sanity-client'

const SLUG = 'certified-atlassian-partner'

async function main() {
  const doc = await writeClient.fetch(
    `*[_type == "partnershipPage" && slug.current == $slug][0]{
      _id,
      title,
      comparisonHeading,
      comparisonSubheading,
      comparisonTheme,
      comparisonLayout,
      comparisonTabs
    }`,
    { slug: SLUG },
  )
  console.log(JSON.stringify(doc, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
