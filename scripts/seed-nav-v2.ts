/**
 * Replace siteSettings.navigation with the six-tab reorganisation nav
 * (Services · Partnerships · Industries · Insights · About · Contact).
 *
 * The structure lives in src/data/nav-v2.ts — every href maps to a page that
 * exists (existing routes + the practice/industry/proof/pricing pages).
 *
 *   npx tsx scripts/seed-nav-v2.ts                # dry run: prints the new tree
 *   npx tsx scripts/seed-nav-v2.ts --check-urls   # dry run + HEAD-checks every href on the live site
 *   npx tsx scripts/seed-nav-v2.ts --apply        # backs up the current nav, then writes to Sanity
 *
 * DEPLOY ORDER: the nav links to the new practice-cluster pages, so merge and
 * deploy this branch BEFORE running --apply. Run --check-urls first — it fails
 * while any nav target still 404s on the live site, which is the guard against
 * applying the nav too early.
 *
 * Rollback: npx tsx scripts/seed-nav-v2.ts --restore scripts/nav-backups/<file>.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'
import { NAV_V2 } from '../src/data/nav-v2'

const LIVE_ORIGIN = 'https://www.fruitionservices.io'
const BACKUP_DIR = path.join(__dirname, 'nav-backups')

function withKey<T extends object>(obj: T): T & { _key: string } {
  return { ...obj, _key: Math.random().toString(36).slice(2, 12) }
}

function toSanityNav() {
  return NAV_V2.map((item) =>
    withKey({
      _type: 'navItem',
      label: item.label,
      ...(item.href ? { href: item.href } : {}),
      ...(item.layout ? { layout: item.layout } : {}),
      sections: (item.sections ?? []).map((section) =>
        withKey({
          _type: 'navSection',
          heading: section.heading,
          ...(section.columns ? { columns: section.columns } : {}),
          ...(section.logo ? { logo: section.logo } : {}),
          ...(section.highlight ? { highlight: true } : {}),
          ...(section.badge ? { badge: section.badge } : {}),
          items: section.items.map((link) =>
            withKey({
              _type: 'navLink',
              label: link.label,
              href: link.href,
              ...(link.description ? { description: link.description } : {}),
              ...(link.icon ? { icon: link.icon } : {}),
              ...(link.featured ? { featured: true } : {}),
            }),
          ),
        }),
      ),
    }),
  )
}

function printTree() {
  for (const item of NAV_V2) {
    if (item.href && !item.sections?.length) {
      console.log(`\n${item.label}  → ${item.href}  (direct link)`)
      continue
    }
    console.log(`\n${item.label}  [${item.layout ?? 'stacked'}]`)
    for (const s of item.sections ?? []) {
      const flags = [s.highlight && 'highlight', s.badge && `badge:"${s.badge}"`, s.columns && `cols:${s.columns}`]
        .filter(Boolean)
        .join(' · ')
      console.log(`  ${s.heading}${flags ? `  (${flags})` : ''}`)
      for (const l of s.items) console.log(`    ${l.featured ? '★ ' : ''}${l.label} -> ${l.href}`)
    }
  }
}

async function checkUrls() {
  const hrefs = [
    ...new Set([
      ...NAV_V2.flatMap((i) => (i.href ? [i.href] : [])),
      ...NAV_V2.flatMap((i) => (i.sections ?? []).flatMap((s) => s.items.map((l) => l.href))),
    ]),
  ]
  console.log(`\nChecking ${hrefs.length} unique hrefs against ${LIVE_ORIGIN} …`)
  let failures = 0
  for (const href of hrefs) {
    const res = await fetch(`${LIVE_ORIGIN}${href}`, { method: 'HEAD', redirect: 'manual' })
    const ok = res.status >= 200 && res.status < 400
    if (!ok) failures++
    console.log(`  ${ok ? 'OK ' : 'FAIL'} ${res.status}  ${href}`)
  }
  if (failures) throw new Error(`${failures} nav href(s) do not resolve on the live site — fix before applying.`)
  console.log('All nav hrefs resolve. ✔')
}

async function restore(file: string) {
  const navigation = JSON.parse(fs.readFileSync(file, 'utf8'))
  const settings = await writeClient.fetch<{ _id: string }>(`*[_type == "siteSettings"][0]{ _id }`)
  if (!settings) throw new Error('siteSettings document not found')
  await writeClient.patch(settings._id).set({ navigation }).commit()
  console.log(`Restored navigation from ${file}`)
}

async function main() {
  const args = process.argv.slice(2)
  const restoreIdx = args.indexOf('--restore')
  if (restoreIdx !== -1) {
    const file = args[restoreIdx + 1]
    if (!file) throw new Error('Usage: --restore <backup.json>')
    return restore(file)
  }

  printTree()
  if (args.includes('--check-urls')) await checkUrls()

  if (!args.includes('--apply')) {
    console.log('\nDry run — nothing written. Re-run with --apply to update Sanity (production dataset, live immediately).')
    return
  }

  const settings = await writeClient.fetch<{ _id: string; navigation?: unknown }>(
    `*[_type == "siteSettings"][0]{ _id, navigation }`,
  )
  if (!settings) throw new Error('siteSettings document not found')

  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const backupFile = path.join(BACKUP_DIR, `nav-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(backupFile, JSON.stringify(settings.navigation ?? [], null, 2))
  console.log(`\nBacked up current navigation → ${backupFile}`)

  await writeClient.patch(settings._id).set({ navigation: toSanityNav() }).commit()
  console.log('Navigation replaced with Site Architecture v2.1 five-tab nav. ✔')
  console.log(`Rollback: npx tsx scripts/seed-nav-v2.ts --restore ${path.relative(process.cwd(), backupFile)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
