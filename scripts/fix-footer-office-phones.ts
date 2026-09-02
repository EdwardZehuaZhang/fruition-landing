/**
 * Footer office phone cleanup (siteSettings.offices):
 *   - Singapore: placeholder "+65 0000 0000" → real "+65 8410 6368"
 *   - India: remove the all-zero placeholder number entirely
 *     (the office stays listed in Our Locations, just without a phone line)
 *   - Philippines: placeholder "+63 000 000 0000" → real "+63 947 230 4274"
 *
 * The Footer component also hides any number containing a 6+ zero run as a
 * code-level guard, so nothing fake renders even before this runs.
 *
 *   npx tsx scripts/fix-footer-office-phones.ts           # dry run
 *   npx tsx scripts/fix-footer-office-phones.ts --apply   # backup + write (LIVE immediately)
 *   npx tsx scripts/fix-footer-office-phones.ts --restore <backup.json>
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'

const BACKUP_DIR = path.join(__dirname, 'nav-backups')

type Office = { _key: string; city?: string; phone?: string; phoneTel?: string }

const CHANGES: Record<string, { phone?: string; phoneTel?: string } | 'remove-phone'> = {
  Singapore: { phone: '+65 8410 6368', phoneTel: '+6584106368' },
  India: 'remove-phone',
  Philippines: { phone: '+63 947 230 4274', phoneTel: '+639472304274' },
}

async function restore(file: string) {
  const offices = JSON.parse(fs.readFileSync(file, 'utf8'))
  const settings = await writeClient.fetch<{ _id: string }>(`*[_type == "siteSettings"][0]{ _id }`)
  if (!settings) throw new Error('siteSettings document not found')
  await writeClient.patch(settings._id).set({ offices }).commit()
  console.log(`Restored offices from ${file}`)
}

async function main() {
  const args = process.argv.slice(2)
  const restoreIdx = args.indexOf('--restore')
  if (restoreIdx !== -1) {
    const file = args[restoreIdx + 1]
    if (!file) throw new Error('Usage: --restore <backup.json>')
    return restore(file)
  }

  const settings = await writeClient.fetch<{ _id: string; offices?: Office[] }>(
    `*[_type == "siteSettings"][0]{ _id, offices }`,
  )
  if (!settings?.offices) throw new Error('siteSettings.offices not found')

  const updated = settings.offices.map((o) => {
    const changeKey = Object.keys(CHANGES).find((k) => o.city?.includes(k))
    if (!changeKey) return o
    const change = CHANGES[changeKey]
    if (change === 'remove-phone') {
      console.log(`${o.city}: remove phone (was ${JSON.stringify(o.phone)})`)
      const { phone: _p, phoneTel: _t, ...rest } = o
      return rest
    }
    console.log(`${o.city}: ${JSON.stringify(o.phone)} → ${JSON.stringify(change.phone)}`)
    return { ...o, ...change }
  })

  if (!args.includes('--apply')) {
    console.log('\nDry run — nothing written. Re-run with --apply to update Sanity (production dataset, live immediately).')
    return
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const backupFile = path.join(BACKUP_DIR, `offices-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(backupFile, JSON.stringify(settings.offices, null, 2))
  console.log(`\nBacked up current offices → ${backupFile}`)

  await writeClient.patch(settings._id).set({ offices: updated }).commit()
  console.log('Office phones updated. ✔')
  console.log(`Rollback: npx tsx scripts/fix-footer-office-phones.ts --restore ${path.relative(process.cwd(), backupFile)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
