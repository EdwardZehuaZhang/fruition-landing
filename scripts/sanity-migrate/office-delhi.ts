/**
 * Awfis Delhi office (backlog #15 / Monday #2819325148).
 *
 * Replaces the placeholder India row seeded by patch-footer-offices.ts
 * ("India" / "India Office" / href "#"), which rendered in the footer as a
 * city that linked nowhere.
 *
 * Run with:
 *   npx tsx scripts/sanity-migrate/office-delhi.ts
 *
 * Address and phone are deliberately left as they are: the placeholder number
 * is all zeros, which isRealPhone filters out of the footer and the regional
 * phone popup, so nothing false is shown. Fill both in from the Studio (or
 * extend this script) once the Awfis suite details are confirmed.
 */
import { upsertOffice } from './upsert-office'

upsertOffice(
  {
    flag: '\u{1F1EE}\u{1F1F3}',
    city: 'Delhi, India',
    label: 'Awfis Delhi Office',
    href: '/monday-partner-india',
  },
  { cities: ['India', 'Delhi', 'New Delhi', 'Bengaluru', 'Bangalore'] }
).catch((e) => {
  console.error(e)
  process.exit(1)
})
