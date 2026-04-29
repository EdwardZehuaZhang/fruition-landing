/**
 * Patch siteSettings with the new label/heading fields that previously lived
 * as hardcoded strings in Footer/Navbar.
 *
 *   npx tsx scripts/sanity-migrate/populate-site-settings-labels.ts
 */
import { writeClient, withKeys } from './lib'

async function main() {
  const id = 'siteSettings'
  const existing = await writeClient.fetch<{ _id?: string }>(
    `*[_type == "siteSettings"][0]{ _id }`
  )
  const docId = existing?._id || id

  const patch: Record<string, unknown> = {
    navbarCtaLabel: 'Book a Time',
    footerCtaLabel: 'Book a Meeting',
    footerPartnerExpertiseHeading: 'Partner Expertise',
    footerServicesHeading: 'Services',
    footerDepartmentSolutionsHeading: 'Department Solutions',
    footerIndustrySolutionsHeading: 'Industry Solutions',
    footerOurLocationsHeading: 'Our Locations',
    footerCopyrightText: '© 2025 Fruition Services. All rights reserved.',
    footerLegalLinks: withKeys([
      { label: 'Data Privacy', href: '/data-privacy' },
      { label: 'Terms and Conditions', href: '/terms-and-conditions' },
    ]),
  }

  // Only set calendlyLink if not already set
  const current = await writeClient.fetch<{ calendlyLink?: string }>(
    `*[_id == $id][0]{ calendlyLink }`,
    { id: docId }
  )
  if (!current?.calendlyLink) {
    patch.calendlyLink = 'https://calendly.com/global-calendar-fruitionservices'
  }

  console.log(`Patching siteSettings (${docId})…`)
  await writeClient.patch(docId).set(patch).commit()
  console.log('✓ siteSettings labels populated')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
