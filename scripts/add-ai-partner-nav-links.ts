/**
 * Append the 3 AI-partner links to the existing "Partnerships" nav section
 * without rewriting the whole navigation array (which would regenerate keys
 * and invalidate patch-nav-icons.mjs). Idempotent: skips links already present.
 *
 *   npx tsx scripts/add-ai-partner-nav-links.ts
 */
import { writeClient } from './sanity-migrate/lib'

const NEW_LINKS = [
  { _type: 'navLink', label: 'Anthropic Claude Partner', href: '/partnerships/anthropic-claude-partner', icon: 'anthropic', description: 'Enterprise Claude deployments & Claude Code' },
  { _type: 'navLink', label: 'OpenAI ChatGPT Partner', href: '/partnerships/openai-chatgpt-partner', icon: 'openai', description: 'ChatGPT Enterprise, custom GPTs & Assistants API' },
  { _type: 'navLink', label: 'Openclaw Partner', href: '/partnerships/openclaw-partner', icon: 'openclaw', description: 'Autonomous AI agents & multi-agent orchestration' },
]

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
    const found = item.sections?.find((s) => s.heading?.toLowerCase() === 'partnerships')
    if (found) {
      target = found
      parentLabel = item.label
      break
    }
  }
  if (!target) {
    console.log('Nav structure:', navigation.map((n) => ({ label: n.label, sections: n.sections?.map((s) => s.heading) })))
    throw new Error('No nav section with heading "Partnerships" found')
  }

  const items = target.items ?? []
  const aiHrefs = new Set(NEW_LINKS.map((l) => l.href))

  // Keep non-AI partners (DoiT + rest) in place, drop any existing AI links.
  const rest = items.filter((it) => !aiHrefs.has(it.href ?? ""))

  // Re-create AI links, reusing existing _key when present to avoid churn.
  const existingByHref = new Map(items.filter((it) => aiHrefs.has(it.href ?? "")).map((it) => [it.href, it]))
  const aiItems = NEW_LINKS.map((l) => {
    const prev = existingByHref.get(l.href)
    return prev?._key ? { ...l, _key: prev._key } : withKey(l)
  })

  // Append so the AI partners surface at the bottom of the Partnerships column.
  target.items = [...rest, ...aiItems]

  await writeClient
    .patch(settings._id)
    .set({ navigation })
    .commit({ autoGenerateArrayKeys: true })

  console.log(`Ordered ${aiItems.length} AI link(s) at bottom of "${parentLabel}" → "${target.heading}":`)
  aiItems.forEach((l) => console.log(`  • ${l.label} → ${l.href}`))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
