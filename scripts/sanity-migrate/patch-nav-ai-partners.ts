/**
 * Targeted, idempotent patch of the live siteSettings.navigation array to add
 * the batch-2 AI partner links to the navbar:
 *
 *   "Partnerships & Locations" › Partnerships:
 *     AWS, Google Cloud, Google Gemini & Vertex AI, Microsoft Copilot
 *   "What We Offer" › Services:
 *     AI Capability Assessment
 *
 * Only inserts links whose href is not already present, so it is safe to
 * re-run. Existing items keep their _key; new items get a fresh _key.
 */
import { writeClient } from './lib'

const key = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const PARTNER_LINKS = [
  { _type: 'navLink', label: 'AWS Partner', href: '/partnerships/aws-partner', icon: 'layers', description: 'Bedrock, SageMaker, migration & FinOps' },
  { _type: 'navLink', label: 'Google Cloud Partner', href: '/partnerships/google-cloud-partner', icon: 'globe', description: 'BigQuery, GKE, Vertex AI & landing zones' },
  { _type: 'navLink', label: 'Google Gemini & Vertex AI Partner', href: '/partnerships/google-gemini-vertex-ai-partner', icon: 'sparkle', description: 'Gemini for Workspace & Vertex AI agents' },
  { _type: 'navLink', label: 'Microsoft Copilot Partner', href: '/partnerships/microsoft-copilot-partner', icon: 'zap', description: 'M365 Copilot rollout & Copilot Studio agents' },
]

const SERVICE_LINKS = [
  { _type: 'navLink', label: 'AI Capability Assessment', href: '/ai-capability-assessment', icon: 'chart', description: '4-week AI readiness diagnostic & costed roadmap' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any

function insertAfter(items: Any[], afterHref: string, newLinks: Any[]) {
  const existing = new Set(items.map((i) => i.href))
  const toAdd = newLinks
    .filter((l) => !existing.has(l.href))
    .map((l) => ({ ...l, _key: key() }))
  if (!toAdd.length) return { items, added: 0 }
  const idx = items.findIndex((i) => i.href === afterHref)
  const at = idx === -1 ? items.length : idx + 1
  return { items: [...items.slice(0, at), ...toAdd, ...items.slice(at)], added: toAdd.length }
}

async function main() {
  const settings = await writeClient.fetch<{ _id: string; navigation: Any[] } | null>(
    `*[_type == "siteSettings"][0]{ _id, navigation }`
  )
  if (!settings?._id) throw new Error('siteSettings document not found')

  const nav: Any[] = JSON.parse(JSON.stringify(settings.navigation || []))
  let total = 0

  for (const item of nav) {
    for (const section of item.sections || []) {
      if (section.heading === 'Partnerships') {
        const r = insertAfter(section.items || [], '/partnerships/openclaw-partner', PARTNER_LINKS)
        section.items = r.items
        total += r.added
      }
      if (section.heading === 'Services') {
        const r = insertAfter(section.items || [], '/ai-strategy-and-execution', SERVICE_LINKS)
        section.items = r.items
        total += r.added
      }
    }
  }

  if (total === 0) {
    console.log('Nav already up to date — nothing to insert.')
    return
  }

  await writeClient.patch(settings._id).set({ navigation: nav }).commit()
  console.log(`✓ Inserted ${total} nav link(s) into siteSettings.navigation.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
