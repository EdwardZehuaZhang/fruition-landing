import { writeClient } from './sanity-client'

async function main() {
  const doc = await writeClient.fetch(
    `*[_type == "servicePage" && slug.current == "ai-strategy-and-execution"][0]{
      _id, title, "slug": slug.current,
      heroImage,
      comparisonHeading, comparisonSubheading, comparisonTabs,
      methodologyHeading, methodologySteps,
      servicesHeading, servicesHeadingAccent, servicesSubheading, servicesCards,
      hideTestimonialsSection, hideDiscoverSection, hideJoinStatsSection,
      hideTestimonialBanner, hideSecurityBadgeSection,
      calendlyHeading, calendlySubheading,
      faqTabs
    }`,
  )
  console.log(JSON.stringify(doc, null, 2))
}
main().catch((e) => { console.error(e); process.exit(1) })
