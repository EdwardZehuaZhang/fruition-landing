/**
 * Add or update a single entry in siteSettings.offices.
 *
 * patch-footer-offices.ts rewrites the whole array, which throws away anything
 * an editor has since changed in the Studio. These per-office patches instead
 * match one existing entry and merge into it, leaving its _key and every field
 * the caller does not name untouched. Re-running is a no-op.
 *
 * Matching is by flag emoji first (one office per country today), falling back
 * to a case-insensitive match on the city string, so a placeholder row seeded
 * as just "India" is found and upgraded rather than duplicated.
 */
import { writeClient } from './lib'

export interface OfficePatch {
  flag: string
  city: string
  label: string
  href: string
  address?: string
  addressUrl?: string
  phone?: string
  phoneTel?: string
}

interface StoredOffice extends Partial<OfficePatch> {
  _key?: string
  _type?: string
}

/** How to find the existing row this patch replaces. */
interface MatchOn {
  /** Any of these city strings, compared case-insensitively. */
  cities: string[]
}

export async function upsertOffice(patch: OfficePatch, matchOn: MatchOn) {
  const id = await writeClient.fetch<string>(`*[_type == "siteSettings"][0]._id`)
  if (!id) throw new Error('siteSettings doc not found')

  const offices =
    (await writeClient.fetch<StoredOffice[] | null>(`*[_id == $id][0].offices`, { id })) ?? []

  const wanted = matchOn.cities.map((c) => c.toLowerCase())
  const index = offices.findIndex((o) => {
    if (o.flag && o.flag === patch.flag) return true
    return !!o.city && wanted.includes(o.city.toLowerCase())
  })

  const next = [...offices]
  if (index === -1) {
    next.push({
      _type: 'office',
      _key: `${patch.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      ...patch,
    })
    console.log(`  + adding ${patch.label}`)
  } else {
    next[index] = { ...next[index], ...patch }
    console.log(`  ✎ updating ${offices[index].city ?? '(unnamed)'} -> ${patch.label}`)
  }

  await writeClient.patch(id).set({ offices: next }).commit()
  console.log(`✓ patched ${id} - ${next.length} offices`)
}
