/**
 * One-off: correct the operator surname on AI-partner pages.
 * "Josh Roszler" (fabricated) -> "Josh Jebathilak" (correct MD).
 *
 * Surgical patch: only touches operatorName + any operatorBody paragraph
 * containing the wrong surname. Everything else on the doc is untouched.
 *
 * Dry-run:  tsx scripts/sanity-migrate/fix-operator-surname.ts
 * Apply:    tsx scripts/sanity-migrate/fix-operator-surname.ts --apply
 */
import { writeClient } from './lib'

const WRONG = 'Roszler'
const RIGHT = 'Jebathilak'
const APPLY = process.argv.includes('--apply')

const SLUGS = [
  'anthropic-claude-partner',
  'openai-chatgpt-partner',
  'openclaw-partner',
  'aws-partner',
  'google-cloud-partner',
  'google-gemini-vertex-ai-partner',
  'microsoft-copilot-partner',
  'ai-capability-assessment',
]

interface Doc {
  _id: string
  slug?: { current?: string }
  operatorName?: string
  operatorBody?: string[]
}

async function main() {
  console.log(APPLY ? '🟢 APPLY mode\n' : '🔎 DRY-RUN (pass --apply to write)\n')

  const docs = await writeClient.fetch<Doc[]>(
    `*[_type == "aiPartnerPage" && slug.current in $slugs]{
      _id, slug, operatorName, operatorBody
    }`,
    { slugs: SLUGS }
  )

  const found = new Set(docs.map((d) => d.slug?.current))
  for (const s of SLUGS) {
    if (!found.has(s)) console.warn(`  ⚠️  no Sanity doc for slug "${s}"`)
  }

  let changed = 0
  for (const doc of docs) {
    const slug = doc.slug?.current
    const patch: Record<string, unknown> = {}

    if (doc.operatorName?.includes(WRONG)) {
      patch.operatorName = doc.operatorName.split(WRONG).join(RIGHT)
    }
    if (Array.isArray(doc.operatorBody) && doc.operatorBody.some((p) => p?.includes(WRONG))) {
      patch.operatorBody = doc.operatorBody.map((p) =>
        p?.includes(WRONG) ? p.split(WRONG).join(RIGHT) : p
      )
    }

    if (Object.keys(patch).length === 0) {
      console.log(`  ·  ${slug}: nothing to change`)
      continue
    }

    changed++
    console.log(`  ✎ ${slug}:`)
    if (patch.operatorName) console.log(`      operatorName -> ${patch.operatorName as string}`)
    if (patch.operatorBody) console.log(`      operatorBody[0] -> ${(patch.operatorBody as string[])[0]}`)

    if (APPLY) {
      await writeClient.patch(doc._id).set(patch).commit()
      console.log(`      ✔ patched`)
    }
  }

  console.log(`\n${APPLY ? 'Patched' : 'Would patch'} ${changed} document(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
