/**
 * Fix visible copy duplication on two industry pages (live bug, pre-dates the
 * v2.1 branch): logoCloudHeadingPart1 was seeded with a full intro paragraph
 * that already renders elsewhere on the page —
 *
 *   monday-for-construction          duplicate of the hardcoded intro strip
 *                                    (MondayForConstructionContent.tsx)
 *   monday-for-professional-services near-duplicate of the hero lead
 *
 * Clearing the field removes the second copy; LogoCloudMarquee renders the
 * logo marquee (plus logoCloudDescription where set) without it.
 *
 *   npx tsx scripts/fix-duplicate-logo-cloud-headings.ts           # dry run
 *   npx tsx scripts/fix-duplicate-logo-cloud-headings.ts --apply   # backup + write (LIVE immediately)
 *   npx tsx scripts/fix-duplicate-logo-cloud-headings.ts --restore <backup.json>
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'

const SLUGS = ['monday-for-construction', 'monday-for-professional-services']
const BACKUP_DIR = path.join(__dirname, 'nav-backups')

type Doc = { _id: string; slug: string; logoCloudHeadingPart1?: string | null }

async function fetchDocs(): Promise<Doc[]> {
  return writeClient.fetch(
    `*[_type == "industryPage" && slug.current in $slugs]{ _id, "slug": slug.current, logoCloudHeadingPart1 }`,
    { slugs: SLUGS },
  )
}

async function restore(file: string) {
  const backup: Doc[] = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const doc of backup) {
    await writeClient.patch(doc._id).set({ logoCloudHeadingPart1: doc.logoCloudHeadingPart1 ?? '' }).commit()
    console.log(`Restored logoCloudHeadingPart1 on ${doc.slug}`)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const restoreIdx = args.indexOf('--restore')
  if (restoreIdx !== -1) {
    const file = args[restoreIdx + 1]
    if (!file) throw new Error('Usage: --restore <backup.json>')
    return restore(file)
  }

  const docs = await fetchDocs()
  for (const d of docs) {
    console.log(`\n${d.slug}`)
    console.log(`  current heading: ${JSON.stringify(d.logoCloudHeadingPart1)?.slice(0, 120)}…`)
    console.log('  after --apply:  ""  (duplicate paragraph removed; marquee keeps logos + description)')
  }

  if (!args.includes('--apply')) {
    console.log('\nDry run — nothing written. Re-run with --apply to fix (production dataset, live immediately).')
    return
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const backupFile = path.join(
    BACKUP_DIR,
    `logo-cloud-headings-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  )
  fs.writeFileSync(backupFile, JSON.stringify(docs, null, 2))
  console.log(`\nBacked up current values → ${backupFile}`)

  for (const d of docs) {
    await writeClient.patch(d._id).set({ logoCloudHeadingPart1: '' }).commit()
    console.log(`Cleared logoCloudHeadingPart1 on ${d.slug} ✔`)
  }
  console.log(`Rollback: npx tsx scripts/fix-duplicate-logo-cloud-headings.ts --restore ${path.relative(process.cwd(), backupFile)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
