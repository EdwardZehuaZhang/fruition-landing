import { writeClient } from './sanity-client'

async function main() {
  const page = await writeClient.fetch(
    `*[_type == "solutionPage" && slug.current == "solar-crm-solution"][0]{
      _id,
      title,
      "slug": slug.current,
      heroLocalVideoSrc,
      heroVideoUrl,
      heroImage,
      comparisonHeading,
      comparisonSubheading,
      comparisonTheme,
      comparisonTabs,
      solutionCards,
      capabilitiesHeading,
      capabilitiesCards,
      secondaryCapabilitiesHeading,
      secondaryCapabilitiesCards,
      featureListHeading,
      featureListItems,
      servicesHeading,
      servicesCards
    }`,
  )
  console.log(JSON.stringify(page, null, 2))
}

main().catch((err) => { console.error(err); process.exit(1) })
