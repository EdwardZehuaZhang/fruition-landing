import { writeClient } from './sanity-client.js'

const CATALOG_LINK = {
  _type: 'navLink',
  label: 'Solutions Catalog',
  href: '/monday-consulting-solutions/catalog',
}

type NavLink = { _key?: string; _type?: string; label?: string; href?: string }
type NavSection = { _key?: string; _type?: string; heading?: string; items?: NavLink[] }
type NavItem = { _key?: string; _type?: string; label?: string; sections?: NavSection[] }

function withKey<T extends object>(obj: T): T & { _key: string } {
  return { ...obj, _key: Math.random().toString(36).slice(2, 12) }
}

async function main() {
  const settings = await writeClient.fetch<{ _id: string; navigation?: NavItem[] }>(
    `*[_type == "siteSettings"][0]{ _id, navigation }`,
  )

  if (!settings) {
    throw new Error('siteSettings document not found')
  }

  const navigation = settings.navigation ?? []

  let targetSection: NavSection | undefined
  let parentLabel: string | undefined
  for (const item of navigation) {
    const found = item.sections?.find(
      (s) => s.heading?.toLowerCase() === 'solutions',
    )
    if (found) {
      targetSection = found
      parentLabel = item.label
      break
    }
  }

  if (!targetSection) {
    console.log(
      'Nav structure:',
      navigation.map((n) => ({
        label: n.label,
        sections: n.sections?.map((s) => s.heading),
      })),
    )
    throw new Error('No nav section with heading "Solutions" found')
  }

  const items = targetSection.items ?? []
  if (items.some((it) => it.href === CATALOG_LINK.href)) {
    console.log('Catalog link already present. No changes.')
    return
  }

  items.unshift(withKey(CATALOG_LINK))
  targetSection.items = items

  await writeClient
    .patch(settings._id)
    .set({ navigation })
    .commit({ autoGenerateArrayKeys: true })

  console.log(
    `Added "${CATALOG_LINK.label}" → ${CATALOG_LINK.href} under "${parentLabel}" → "${targetSection.heading}"`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
