/**
 * Re-categorise every blogPost using Claude.
 *
 * Why: all 227 posts were bulk-imported with ALL 21 categories attached, so the
 * /consulting-blog category pills can't filter anything (every pill matches every
 * post). This reads each post's title + excerpt + body, asks Claude to pick the
 * 1-4 categories that genuinely fit, and rewrites the post's `categories` array.
 *
 *   # dry run — classify + print, write nothing (default)
 *   npx tsx scripts/sanity-migrate/recategorize-blog-posts.ts
 *
 *   # only the first N posts (handy for a quick review)
 *   npx tsx scripts/sanity-migrate/recategorize-blog-posts.ts --limit 10
 *
 *   # actually write to Sanity
 *   npx tsx scripts/sanity-migrate/recategorize-blog-posts.ts --commit
 *
 * Needs SANITY_WRITE_TOKEN and CLAUDE_API_KEY in .env.local (lib.ts loads them).
 */
import Anthropic from '@anthropic-ai/sdk'
import { writeClient } from './lib'

const COMMIT = process.argv.includes('--commit')
const limitArg = process.argv.indexOf('--limit')
const LIMIT = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : Infinity
const CONCURRENCY = 5
const BODY_CHARS = 2500 // plenty of signal without blowing up token cost

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })

interface Category {
  _id: string
  slug: string
  title: string
  description?: string
}

interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string
  bodyText?: string
}

async function main() {
  const [categories, posts] = await Promise.all([
    writeClient.fetch<Category[]>(
      `*[_type == "blogCategory"]{ _id, "slug": slug.current, title, description } | order(title asc)`
    ),
    writeClient.fetch<Post[]>(
      `*[_type == "blogPost"] | order(publishedAt desc){
        _id, title, "slug": slug.current, excerpt, "bodyText": pt::text(body)
      }`
    ),
  ])

  const slugSet = new Set(categories.map((c) => c.slug))
  const idBySlug = new Map(categories.map((c) => [c.slug, c._id]))
  const targets = posts.slice(0, LIMIT)

  console.log(
    `${posts.length} posts, ${categories.length} categories. ` +
      `Classifying ${targets.length}. Mode: ${COMMIT ? 'COMMIT (writing)' : 'DRY RUN'}\n`
  )

  // Stable taxonomy block — cached across all 227 requests (prefix match).
  const taxonomy = categories
    .map((c) => `- ${c.slug}: ${c.title}${c.description ? ` — ${c.description}` : ''}`)
    .join('\n')

  const system = `You are a precise content classifier for Fruition Services, a monday.com / automation consultancy blog.

Assign each blog post to the categories that GENUINELY describe its core subject. Available categories (slug: meaning):
${taxonomy}

Rules:
- Pick 1 to 4 categories. Fewer is better — only include a category if the post is substantively about it.
- Almost every post mentions monday.com in passing; only apply "monday-com" when monday.com itself is a primary subject, not just a tool referenced once.
- The "fruition-australia" / "fruition-uk" / "fruition-us" categories are for posts specifically about that region/office, not generic posts.
- Order the slugs by relevance, most relevant first.
- Use only slugs from the list above.`

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      slugs: {
        type: 'array',
        items: { type: 'string', enum: categories.map((c) => c.slug) },
      },
    },
    required: ['slugs'],
  }

  const distribution = new Map<string, number>()
  let done = 0

  async function classify(post: Post): Promise<string[]> {
    const body = (post.bodyText || '').slice(0, BODY_CHARS)
    const userText = `Title: ${post.title}\n\nExcerpt: ${post.excerpt || '(none)'}\n\nBody:\n${body}`

    const res = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 200,
      thinking: { type: 'disabled' },
      output_config: { effort: 'low', format: { type: 'json_schema', schema } },
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userText }],
    })

    const textBlock = res.content.find((b) => b.type === 'text')
    const raw = textBlock && 'text' in textBlock ? textBlock.text : '{}'
    let slugs: string[] = []
    try {
      slugs = JSON.parse(raw).slugs ?? []
    } catch {
      console.warn(`  ⚠️  ${post.slug}: could not parse model output: ${raw}`)
    }
    // Defensive: keep only known slugs, dedupe, cap at 4.
    slugs = [...new Set(slugs.filter((s) => slugSet.has(s)))].slice(0, 4)
    if (slugs.length === 0) slugs = ['monday-com'] // never leave a post uncategorised
    return slugs
  }

  async function handle(post: Post) {
    const slugs = await classify(post)
    slugs.forEach((s) => distribution.set(s, (distribution.get(s) ?? 0) + 1))

    if (COMMIT) {
      const refs = slugs.map((s, i) => ({
        _type: 'reference',
        _key: `cat-${i}-${s}`,
        _ref: idBySlug.get(s)!,
      }))
      await writeClient.patch(post._id).set({ categories: refs }).commit({ autoGenerateArrayKeys: false })
    }

    done++
    console.log(`[${done}/${targets.length}] ${post.slug} → ${slugs.join(', ')}`)
  }

  // Simple fixed-size worker pool.
  const queue = [...targets]
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const post = queue.shift()
        if (post) await handle(post)
      }
    })
  )

  console.log('\nCategory distribution:')
  ;[...distribution.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([slug, n]) => console.log(`  ${String(n).padStart(4)}  ${slug}`))

  console.log(
    COMMIT
      ? `\n✅ Wrote categories for ${done} posts.`
      : `\nℹ️  Dry run — nothing written. Re-run with --commit to apply.`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
