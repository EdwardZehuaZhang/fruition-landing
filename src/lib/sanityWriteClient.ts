/**
 * Sanity write helpers used by /api/internal/onboarding.
 * Kept separate from src/sanity/client.ts so the read-only client can
 * stay `useCdn: true`.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

function getToken(): string {
  const t = process.env.SANITY_WRITE_TOKEN
  if (!t) throw new Error("SANITY_WRITE_TOKEN missing")
  return t
}

function base(): string {
  if (!PROJECT_ID || !DATASET) throw new Error("Sanity project id / dataset missing")
  return `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`
}

export async function uploadImageAsset(
  bytes: ArrayBuffer | Uint8Array,
  mime: string,
  filename: string,
): Promise<string> {
  const ext = (mime.split("/")[1] ?? "jpg").split(";")[0]
  const url = `${base()}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}.${ext}`
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": mime,
      Authorization: `Bearer ${getToken()}`,
    },
    body: u8 as unknown as BodyInit,
  })
  if (!r.ok) throw new Error(`sanity asset upload ${r.status} ${await r.text()}`)
  const j = (await r.json()) as { document?: { _id?: string } }
  const id = j.document?._id
  if (!id) throw new Error("sanity asset upload returned no _id")
  return id
}

export interface CreateTeamMemberInput {
  docId: string
  name: string
  role: string
  regions: string[]
  bio?: string
  emoji?: string
  linkedinUrl?: string
  photoAssetId?: string
  order?: number
}

function buildTeamMemberDoc(input: CreateTeamMemberInput): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    _id: input.docId,
    _type: "teamMember",
    name: input.name,
    role: input.role,
    regions: input.regions,
    order: input.order ?? 9999,
  }
  if (input.bio) doc.bio = input.bio
  if (input.emoji) doc.emoji = input.emoji
  if (input.linkedinUrl) doc.linkedinUrl = input.linkedinUrl
  if (input.photoAssetId) {
    doc.photo = { _type: "image", asset: { _type: "reference", _ref: input.photoAssetId } }
  }
  return doc
}

async function mutate(mutations: unknown[]): Promise<void> {
  const r = await fetch(`${base()}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ mutations }),
  })
  if (!r.ok) throw new Error(`sanity mutate ${r.status} ${await r.text()}`)
}

export async function createTeamMember(input: CreateTeamMemberInput): Promise<{ id: string }> {
  await mutate([{ create: buildTeamMemberDoc(input) }])
  return { id: input.docId }
}

export async function upsertTeamMember(input: CreateTeamMemberInput): Promise<{ id: string }> {
  await mutate([{ createOrReplace: buildTeamMemberDoc(input) }])
  return { id: input.docId }
}

export interface UpsertBlogPostInput {
  /** Stable doc id, e.g. `blog-monday-<pulseId>`. Allows re-publish to update in place. */
  docId: string
  title: string
  /** Plaintext or simple-markdown body. Headings (# / ##) + paragraphs supported. */
  body: string
  slug?: string
  excerpt?: string
  industry?: string
  author?: string
  seoTitle?: string
  seoDescription?: string
  coverImageAssetId?: string
  mondayItemId?: string
  publishedAt?: string
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
}

interface PortableTextSpan {
  _type: "span"
  _key: string
  text: string
  marks: string[]
}

interface PortableTextBlock {
  _type: "block"
  _key: string
  style: string
  markDefs: unknown[]
  children: PortableTextSpan[]
}

let keyCounter = 0
function nextKey(): string {
  keyCounter += 1
  return `k${Date.now().toString(36)}${keyCounter.toString(36)}`
}

/**
 * Cheap markdown → Portable Text conversion. Handles `# h1`, `## h2`,
 * `### h3`, blank-line paragraph splits. Bold/italic deferred — body
 * comes from Marketa already plain-prosed.
 */
function bodyToPortableText(body: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = []
  const paragraphs = body.replace(/\r\n/g, "\n").split(/\n{2,}/)
  for (const raw of paragraphs) {
    const text = raw.trim()
    if (!text) continue
    let style = "normal"
    let content = text
    if (text.startsWith("### ")) {
      style = "h3"
      content = text.slice(4)
    } else if (text.startsWith("## ")) {
      style = "h2"
      content = text.slice(3)
    } else if (text.startsWith("# ")) {
      style = "h1"
      content = text.slice(2)
    }
    blocks.push({
      _type: "block",
      _key: nextKey(),
      style,
      markDefs: [],
      children: [{ _type: "span", _key: nextKey(), text: content, marks: [] }],
    })
  }
  return blocks
}

function buildBlogPostDoc(input: UpsertBlogPostInput): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    _id: input.docId,
    _type: "blogPost",
    title: input.title,
    slug: { _type: "slug", current: input.slug || slugify(input.title) },
    body: bodyToPortableText(input.body),
    publishedAt: input.publishedAt ?? new Date().toISOString(),
    author: input.author ?? "Fruition Editorial",
  }
  if (input.excerpt) doc.excerpt = input.excerpt
  if (input.industry) doc.industry = input.industry
  if (input.seoTitle) doc.seoTitle = input.seoTitle
  if (input.seoDescription) doc.seoDescription = input.seoDescription
  if (input.mondayItemId) doc.mondayItemId = input.mondayItemId
  if (input.coverImageAssetId) {
    doc.coverImage = {
      _type: "image",
      asset: { _type: "reference", _ref: input.coverImageAssetId },
    }
  }
  return doc
}

export async function upsertBlogPost(
  input: UpsertBlogPostInput,
): Promise<{ id: string; slug: string }> {
  const doc = buildBlogPostDoc(input)
  await mutate([{ createOrReplace: doc }])
  const slug = (doc.slug as { current: string }).current
  return { id: input.docId, slug }
}
