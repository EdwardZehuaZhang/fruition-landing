/**
 * WeWork Philippines office (backlog #16 / Monday #2819325255).
 *
 * Replaces the placeholder Philippines row seeded by
 * patch-footer-offices.ts ("Philippines" / "Philippines Office" / href "#"),
 * which rendered in the footer as a city that linked nowhere.
 *
 * Run with:
 *   npx tsx scripts/sanity-migrate/office-manila.ts
 *
 * Address and phone are deliberately left as they are: the placeholder number
 * is all zeros, which isRealPhone filters out of the footer and the regional
 * phone popup, so nothing false is shown. Fill both in from the Studio (or
 * extend this script) once the WeWork location is confirmed.
 */
import { upsertOffice } from './upsert-office'

upsertOffice(
  {
    flag: '\u{1F1F5}\u{1F1ED}',
    city: 'Manila, Philippines',
    label: 'WeWork Philippines Office',
    href: '/monday-partner-philippines',
  },
  { cities: ['Philippines', 'Manila'] }
).catch((e) => {
  console.error(e)
  process.exit(1)
})
