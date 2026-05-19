/**
 * Populate Sanity fields for the monday-crm-consulting servicePage doc
 * so the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — re-running patches the existing doc; fields already set are
 * preserved (we use setIfMissing for everything).
 *
 * Note: file is suffixed `-content` because `scripts/migrate-crm-page.ts`
 * already exists.
 *
 *   pnpm tsx scripts/sanity-migrate/monday-crm-consulting-content.ts
 */
import { writeClient, withKeys } from './lib'

const SLUG = 'monday-crm-consulting'
const TYPE = 'servicePage'

// Bottom Capabilities Grid — previously hardcoded as CRM_CAPABILITY_CARDS +
// inline JSX in MondayCrmConsultingContent.tsx.
const CAPABILITY_CARDS = [
  {
    _type: 'capabilityCard',
    title: 'Forms, Emails & Leads',
    emoji: '📋',
    description:
      'As official monday.com Partners, Fruition offers professional CRM data migration and integration solutions to help businesses better manage and streamline their customer data.',
  },
  {
    _type: 'capabilityCard',
    title: 'Opportunity, Contracts & Tender',
    emoji: '🎯',
    description:
      'Our monday.com CRM consulting team provides fully customisable opportunity, contracts, and tender management solutions that streamline business processes for companies of all sizes.',
  },
  {
    _type: 'capabilityCard',
    title: 'PM & Client Onboarding',
    emoji: '📁',
    description:
      'Once your deal closes, our monday.com CRM implementation specialists seamlessly integrate comprehensive project management and client delivery systems for optimal results.',
  },
  {
    _type: 'capabilityCard',
    title: 'Dashboards & Reporting',
    emoji: '📊',
    description:
      'We deliver advanced monday.com CRM consulting solutions featuring dynamic dashboards, comprehensive reporting, and powerful analytics to drive informed business decisions.',
  },
  {
    _type: 'capabilityCard',
    title: 'Marketing & Finance',
    emoji: '💰',
    description:
      'Our monday.com CRM implementation services provide tailored marketing and finance automation solutions designed to maximise efficiency, reduce costs, and accelerate business growth.',
  },
  {
    _type: 'capabilityCard',
    title: 'Data Migration & Integration',
    emoji: '🔗',
    description:
      'We offer professional monday.com CRM consulting for seamless data migration, system optimisation, and integration solutions that streamline your customer relationship management.',
  },
]

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    .setIfMissing({
      // Hero video — previously hardcoded FALLBACK_VIDEO_EMBED.
      heroVideoUrl: 'https://www.youtube.com/watch?v=7vtrtlfC1Zg',
      heroVideoTitle: 'monday.com CRM Consulting',

      // Capabilities section — previously hardcoded inline JSX block.
      // NOTE: original inline JSX rendered "monday CRM" (purple) +
      // "Management Capabilities" (black). CapabilitiesGrid only supports
      // {heading}{accent} order (accent trailing in purple), so the
      // purple-first / black-second split cannot be reproduced exactly with
      // the current component. We seed the full text as one heading.
      capabilitiesHeading: 'monday CRM Management Capabilities',
      capabilitiesCards: withKeys(CAPABILITY_CARDS),

      // Bottom video — previously inlined inside the hardcoded capabilities
      // JSX block as <YouTubeEmbed videoId="EPxa_uYJy3w" />.
      bottomVideoUrl: 'https://www.youtube.com/watch?v=EPxa_uYJy3w',
      bottomVideoTitle: 'monday CRM overview',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
