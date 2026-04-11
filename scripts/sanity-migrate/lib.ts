/**
 * Shared helpers for Sanity content migration scripts.
 *
 * Usage from any migration script:
 *
 *   import { writeClient, uploadLocalImage, upsertSingleton, upsertDocBySlug } from './lib'
 */
import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bt6nb58h',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_WRITE_TOKEN) {
  console.warn('⚠️  SANITY_WRITE_TOKEN not set — writes will fail')
}

const PROJECT_ROOT = path.resolve(__dirname, '..', '..')
const PUBLIC_DIR = path.resolve(PROJECT_ROOT, 'public')

interface UploadCacheEntry {
  assetId: string
  ref: { _type: 'image'; asset: { _type: 'reference'; _ref: string } }
}
const uploadCache = new Map<string, UploadCacheEntry>()

/**
 * Upload a local image (path relative to /public, e.g. `/images/foo.png`).
 * Returns a ref object suitable for assigning to an image field:
 *   { _type: 'image', asset: { _type: 'reference', _ref: 'image-xxx' } }
 *
 * Caches by absolute path so the same file uploaded twice in one run reuses
 * the first upload.
 */
export async function uploadLocalImage(publicPath: string) {
  const relative = publicPath.startsWith('/') ? publicPath.slice(1) : publicPath
  const absolute = path.resolve(PUBLIC_DIR, relative)

  if (uploadCache.has(absolute)) {
    return uploadCache.get(absolute)!.ref
  }

  if (!fs.existsSync(absolute)) {
    throw new Error(`Image not found: ${absolute}`)
  }

  const filename = path.basename(absolute)
  const buffer = fs.readFileSync(absolute)
  console.log(`  ↑ uploading ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`)
  const asset = await writeClient.assets.upload('image', buffer, { filename })

  const ref = {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: asset._id },
  }
  uploadCache.set(absolute, { assetId: asset._id, ref })
  return ref
}

/**
 * Upload an image from a URL. Downloads into memory then uploads to Sanity.
 */
export async function uploadImageFromUrl(url: string, filename?: string) {
  if (uploadCache.has(url)) return uploadCache.get(url)!.ref
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const name = filename || url.split('/').pop()!.split('?')[0]
  console.log(`  ↑ uploading ${name} from URL (${(buffer.length / 1024).toFixed(0)} KB)`)
  const asset = await writeClient.assets.upload('image', buffer, { filename: name })
  const ref = {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: asset._id },
  }
  uploadCache.set(url, { assetId: asset._id, ref })
  return ref
}

/**
 * Upsert a singleton document — uses a fixed `_id` so re-running overwrites
 * instead of creating duplicates. Standard convention: id === type name.
 */
export async function upsertSingleton(type: string, data: Record<string, unknown>) {
  const id = type // e.g. "implementationPackagesPage"
  return writeClient.createOrReplace({ _id: id, _type: type, ...data })
}

/**
 * Upsert a document keyed by `slug.current`. Finds an existing doc by slug
 * and patches it, or creates a new one. Caller passes the slug separately
 * from the data (data should already include the slug field if it applies).
 */
export async function upsertDocBySlug(
  type: string,
  slug: string,
  data: Record<string, unknown>
) {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{_id}`,
    { type, slug }
  )

  const doc = {
    _type: type,
    slug: { _type: 'slug', current: slug },
    ...data,
  }

  if (existing?._id) {
    console.log(`  ✎ patching ${type}:${slug}`)
    return writeClient.createOrReplace({ _id: existing._id, ...doc })
  }
  console.log(`  + creating ${type}:${slug}`)
  return writeClient.create(doc)
}

/**
 * Convenience helper: turn a plain text into Sanity Portable Text blocks.
 * Splits on double newlines for paragraphs, single newlines become soft breaks.
 */
export function textToPortableText(text: string) {
  return text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0)
    .map((paragraph) => ({
      _type: 'block',
      _key: Math.random().toString(36).slice(2),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).slice(2),
          text: paragraph.trim(),
          marks: [],
        },
      ],
    }))
}

/** Add stable _key fields to every element of an object array (required by Sanity). */
export function withKeys<T extends Record<string, unknown>>(items: T[]): (T & { _key: string })[] {
  return items.map((item, i) => ({
    ...item,
    _key: `${i}-${Math.random().toString(36).slice(2, 8)}`,
  }))
}
