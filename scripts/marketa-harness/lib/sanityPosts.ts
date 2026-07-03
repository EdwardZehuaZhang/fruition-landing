/**
 * Fetch real, published blog posts from Sanity to use as eval ground truth.
 * The eval harness regenerates a draft from each post's title/brief, then
 * scores the generated draft against the real post.
 */

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DS = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const API = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

export interface RealPost {
  id: string
  title: string
  seoTitle?: string
  seoDescription?: string
  excerpt?: string
  industry?: string
  targetKeyword?: string
  mondayItemId?: string
  bodyText: string
}

// Minimal PortableText -> plain text. Good enough for reference comparison.
function ptToText(body: unknown): string {
  if (!Array.isArray(body)) return ""
  return body
    .map((block) => {
      const b = block as { _type?: string; children?: Array<{ text?: string }> }
      if (b._type !== "block" || !Array.isArray(b.children)) return ""
      return b.children.map((c) => c.text || "").join("")
    })
    .filter(Boolean)
    .join("\n\n")
}

async function groq<T>(query: string, params: Record<string, string> = {}): Promise<T> {
  if (!PID) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID missing")
  const url = new URL(`https://${PID}.api.sanity.io/v${API}/data/query/${DS}`)
  url.searchParams.set("query", query)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v))
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error(`sanity ${r.status}: ${(await r.text()).slice(0, 200)}`)
  return (await r.json()).result as T
}

const POST_PROJECTION = `{
  "id": _id, title, seoTitle, seoDescription, excerpt,
  "industry": industry, "mondayItemId": mondayItemId, body
}`

type RawPost = Omit<RealPost, "bodyText" | "targetKeyword"> & { body?: unknown }

function shape(p: RawPost): RealPost {
  return {
    id: p.id,
    title: p.title,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    excerpt: p.excerpt,
    industry: p.industry,
    mondayItemId: p.mondayItemId,
    targetKeyword: undefined,
    bodyText: ptToText(p.body),
  }
}

/** Most recent N published posts. */
export async function fetchRecentPosts(n = 3): Promise<RealPost[]> {
  const q = `*[_type=="blogPost" && defined(title)] | order(publishedAt desc) [0...${n}] ${POST_PROJECTION}`
  const raw = (await groq<RawPost[]>(q)) || []
  return raw.map(shape)
}

/** Posts whose title contains a substring (case-insensitive). */
export async function fetchPostsByTitle(needle: string): Promise<RealPost[]> {
  const q = `*[_type=="blogPost" && title match $needle] ${POST_PROJECTION}`
  const raw = (await groq<RawPost[]>(q, { needle: `*${needle}*` })) || []
  return raw.map(shape)
}

/** A post by its monday item id. */
export async function fetchPostByItemId(itemId: string): Promise<RealPost | null> {
  const q = `*[_type=="blogPost" && mondayItemId==$itemId][0] ${POST_PROJECTION}`
  const raw = await groq<RawPost | null>(q, { itemId })
  return raw ? shape(raw) : null
}

export interface InternalLink {
  title: string
  url: string
}

const SITE_BASE = process.env.MARKETA_SITE_BASE || "https://www.fruitionservices.io"

/**
 * Menu of REAL published internal URLs the model is allowed to link to.
 * blogPost slug -> /post/<slug> (see src/components/BlogCard.tsx). Handing the
 * model a fixed menu and forbidding invented slugs is what makes internal links
 * resolve to real pages instead of hallucinated ones.
 */
export async function fetchInternalLinkMenu(limit = 40): Promise<InternalLink[]> {
  const q = `*[_type=="blogPost" && defined(slug.current)] | order(publishedAt desc) [0...${limit}]{title, "slug": slug.current}`
  const rows = (await groq<Array<{ title: string; slug: string }>>(q)) || []
  return rows
    .filter((r) => r.title && r.slug)
    .map((r) => ({ title: r.title, url: `${SITE_BASE}/post/${r.slug}` }))
}

/**
 * The brief that seeds generation. We deliberately use the TOPIC/keyword, not
 * the polished SEO title, so the harness tests whether the pipeline can reframe
 * a raw topic the way the real writer does.
 */
export function briefFor(post: RealPost): {
  topicTitle: string
  brief: string
  targetKeyword: string
  industry: string
} {
  const topicTitle = post.title.split(/[:?]/)[0].trim() // strip the SEO suffix
  return {
    topicTitle,
    brief: post.excerpt || `Write a definitive guide on: ${topicTitle}.`,
    targetKeyword: post.targetKeyword || topicTitle.toLowerCase(),
    industry: post.industry || "general",
  }
}
