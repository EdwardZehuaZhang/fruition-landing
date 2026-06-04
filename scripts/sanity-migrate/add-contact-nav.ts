/**
 * Add a "Contact Us" link under the "About" menu in siteSettings.navigation.
 *
 * Navigation is Sanity-driven with no code fallback, so the nav entry must be
 * written to the CMS. Idempotent — skips if a /contact-us link already exists.
 *
 *   SANITY_WRITE_TOKEN=… npx tsx scripts/sanity-migrate/add-contact-nav.ts
 */
import { writeClient } from "./lib"

const HREF = "/contact-us"

interface NavLink {
  _key?: string
  label?: string
  href?: string
  description?: string
  icon?: string
}
interface NavSection {
  _key?: string
  heading?: string
  columns?: number
  items?: NavLink[]
}
interface NavItem {
  _key?: string
  label?: string
  sections?: NavSection[]
}
interface SettingsDoc {
  _id: string
  navigation?: NavItem[]
}

function key(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

async function main() {
  if (!process.env.SANITY_WRITE_TOKEN) throw new Error("SANITY_WRITE_TOKEN not set")

  const doc = await writeClient.fetch<SettingsDoc | null>(
    `*[_type == "siteSettings"][0]{ _id, navigation }`,
  )
  if (!doc?._id) throw new Error("No siteSettings document found")

  const navigation: NavItem[] = doc.navigation ?? []
  const about = navigation.find((n) => (n.label ?? "").trim().toLowerCase() === "about")
  if (!about) {
    throw new Error(
      `No "About" nav item found. Existing labels: ${navigation.map((n) => n.label).join(", ")}`,
    )
  }

  // Idempotency — bail if a contact link already exists anywhere under About.
  const existing = (about.sections ?? []).flatMap((s) => s.items ?? [])
  if (existing.some((l) => (l.href ?? "").replace(/\/$/, "") === HREF)) {
    console.log("✓ Contact Us link already present under About — nothing to do.")
    return
  }

  about.sections = about.sections ?? []

  // Prefer a "company / about / get in touch" section; else the first; else create one.
  let section = about.sections.find((s) =>
    /company|about|location|get in touch|contact/i.test(s.heading ?? ""),
  )
  if (!section) section = about.sections[0]
  if (!section) {
    section = { _key: key("sec"), heading: "Get in touch", items: [] }
    about.sections.push(section)
  }
  section.items = section.items ?? []

  // Reuse an icon key already used by a sibling link, if any (keeps visual parity).
  const siblingIcon = section.items.find((l) => l.icon)?.icon

  const link: NavLink = {
    _key: key("link"),
    label: "Contact Us",
    href: HREF,
    description: "Talk to our team",
    ...(siblingIcon ? { icon: siblingIcon } : {}),
  }
  section.items.push(link)

  console.log("Before → after (About menu):")
  console.log(
    JSON.stringify(
      about.sections.map((s) => ({ heading: s.heading, items: (s.items ?? []).map((l) => l.label) })),
      null,
      2,
    ),
  )

  await writeClient.patch(doc._id).set({ navigation }).commit()
  console.log(`\n✓ Added "Contact Us" → ${HREF} under "About" › "${section.heading ?? "(first section)"}"`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
