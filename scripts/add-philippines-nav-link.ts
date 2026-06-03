/**
 * Append the Philippines regional link to the existing "Locations" nav
 * section (beside Australia / UK / US / Singapore / India) without
 * rewriting the whole navigation array (which would regenerate keys and
 * invalidate patch-nav-icons.mjs). Idempotent: reuses the _key if the link
 * already exists.
 *
 *   npx tsx scripts/add-philippines-nav-link.ts
 */
import { writeClient } from './sanity-migrate/lib'

const NEW_LINK = {
  _type: 'navLink',
  label: 'monday.com Partner Philippines',
  href: '/monday-partner-philippines',
  icon: 'flag',
  description: 'monday.com partner in the Philippines',
}

type NavLink = { _key?: string; href?: string }
type NavSection = { _key?: string; heading?: string; items?: NavLink[] }
type NavItem = { _key?: string; label?: string; sections?: NavSection[] }

function withKey<T extends object>(obj: T): T & { _key: string } {
  return { ...obj, _key: Math.random().toString(36).slice(2, 12) }
}

async function main() {
  const settings = await writeClient.fetch<{ _id: string; navigation?: NavItem[] }>(
    `*[_type == "siteSettings"][0]{ _id, navigation }`,
  )
  if (!settings) throw new Error('siteSettings document not found')

  const navigation = settings.navigation ?? []
  let target: NavSection | undefined
  let parentLabel: string | undefined
  for (const item of navigation) {
    const found = item.sections?.find((s) => s.heading?.toLowerCase() === 'locations')
    if (found) {
      target = found
      parentLabel = item.label
      break
    }
  }
  if (!target) {
    console.log('Nav structure:', navigation.map((n) => ({ label: n.label, sections: n.sections?.map((s) => s.heading) })))
    throw new Error('No nav section with heading "Locations" found')
  }

  const items = target.items ?? []
  const existing = items.find((it) => it.href === NEW_LINK.href)
  const link = existing?._key ? { ...NEW_LINK, _key: existing._key } : withKey(NEW_LINK)

  // Replace if present, otherwise append at the bottom of the Locations column.
  const rest = items.filter((it) => it.href !== NEW_LINK.href)
  target.items = [...rest, link]

  await writeClient
    .patch(settings._id)
    .set({ navigation })
    .commit({ autoGenerateArrayKeys: true })

  console.log(`✅ ${existing ? 'updated' : 'added'} "${NEW_LINK.label}" in "${parentLabel}" → "${target.heading}" (${NEW_LINK.href})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
