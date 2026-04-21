import { writeClient } from './sanity-client'

const SLUG = 'certified-atlassian-partner'

const HEADING = 'Accelerate Your Enterprise & Maximise Efficiency with Atlassian'
const SUBHEADING =
  'We modernise your business with intelligent Atlassian solutions, streamlined services, and expert migration that deliver measurable ROI across your entire organization.'

const comparisonTabs = [
  {
    _key: 'ct-atlassian-services',
    _type: 'comparisonTab',
    label: 'Atlassian Services',
    items: [
      {
        _key: 'ct-atl-01',
        _type: 'comparisonItem',
        number: '01',
        title: '#1 in ROVO',
        description:
          "As former Atlassian team members, we're on the edge of what customers are doing & we'll help build out ROVO Atlassian AI agents that save you time and have a clear ROI. Get in touch to explore how Rovo brings AI-driven simplicity to your workflows—creating virtual agents for service management, chat support for Jira issues, and automating search across Confluence and Jira.",
      },
      {
        _key: 'ct-atl-02',
        _type: 'comparisonItem',
        number: '02',
        title: 'Service Management',
        description:
          'Transform customer and employee support and elevate your service with intelligent service management solutions. Return on your investment of 277% and eliminate disconnects between development and operations. Jira Service Management offers seamless integration on a unified platform.',
      },
      {
        _key: 'ct-atl-03',
        _type: 'comparisonItem',
        number: '03',
        title: 'Cloud Migration',
        description:
          'Future-proof your Atlassian investment with through secure and optimised expert cloud migration services. Our certified partnership delivers seamless Monday Atlassian integration, Jira Monday connector solutions, and comprehensive API integration with workflow automation for optimised tool connectivity.',
      },
    ],
  },
  {
    _key: 'ct-why-partner',
    _type: 'comparisonTab',
    label: 'Why Partner with Fruition',
    items: [
      {
        _key: 'ct-why-01',
        _type: 'comparisonItem',
        number: '01',
        title: 'Direct Atlassian Expertise',
        description:
          'Our close ties with Atlassian give you direct access to experts for insider advice and best practices.',
      },
      {
        _key: 'ct-why-02',
        _type: 'comparisonItem',
        number: '02',
        title: 'Optimised Licensing for Savings',
        description:
          'Leverage our sales expertise to reduce costs and maximise efficiency.',
      },
      {
        _key: 'ct-why-03',
        _type: 'comparisonItem',
        number: '03',
        title: 'Driving Value Year-Round',
        description:
          'We solve business challenges proactively, not just at renewal time.',
      },
      {
        _key: 'ct-why-04',
        _type: 'comparisonItem',
        number: '04',
        title: 'Proudly Australian Owned',
        description:
          "A refreshing change to an old school way of working, that's our promise.",
      },
    ],
  },
]

async function main() {
  const doc = await writeClient.fetch(
    `*[_type == "partnershipPage" && slug.current == $slug][0]{_id}`,
    { slug: SLUG },
  )
  if (!doc?._id) throw new Error(`Partnership page not found: ${SLUG}`)

  await writeClient
    .patch(doc._id)
    .set({
      comparisonHeading: HEADING,
      comparisonSubheading: SUBHEADING,
      comparisonTheme: 'light',
      comparisonLayout: 'tabs',
      comparisonTabs,
    })
    .commit()

  console.log(`Patched ${doc._id} with new comparison tabs (${comparisonTabs.length} tabs)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
