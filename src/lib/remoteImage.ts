/**
 * Fetch an image that lives somewhere else so it can be re-hosted in Sanity.
 *
 * Two callers need this:
 *   - the blog editor, when an image is pasted or dragged in from another tab
 *     (the clipboard carries a URL, not bytes);
 *   - the publish pipeline, which side-loads any remote `![alt](url)` line so
 *     it becomes a real Sanity `image` block instead of a stray `!` + link
 *     (see sideloadBodyImages in sanityWriteClient.ts).
 *
 * monday.com is a first-class source here: the blog workflow lives on a monday
 * board, and an image dragged out of an item update carries a
 * `…/protected_static/…/resources/<assetId>/…` URL that 403s without a browser
 * session. Those are resolved through the monday API's short-lived
 * `public_url` instead.
 */

import { getAssetPublicUrl } from "@/lib/mondayClient"

export const MAX_REMOTE_IMAGE_BYTES = 8 * 1024 * 1024

export interface RemoteImage {
  bytes: Buffer
  /** Content type as reported by the origin, e.g. `image/png`. */
  mime: string
  /** Slug-safe filename stem, for the Sanity asset name. */
  stem: string
}

/** monday's protected asset URLs: the digits after `/resources/` are the asset id. */
const MONDAY_ASSET_PATH = /\/resources\/(\d+)\//

/**
 * Hosts we refuse to fetch. These routes are behind the portal session, but an
 * authenticated SSRF gadget is still a gadget — keep the loopback/link-local
 * and RFC1918 ranges out of reach.
 */
function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "")
  if (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".local") ||
    h.endsWith(".internal") ||
    h === "metadata.google.internal"
  ) {
    return true
  }
  if (h === "0.0.0.0" || h === "::1" || h === "::") return true
  if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h)) {
    return true
  }
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true
  // Unique-local (fc00::/7) and link-local (fe80::/10) IPv6.
  if (/^f[cd][0-9a-f]{2}:/.test(h) || /^fe[89ab][0-9a-f]:/.test(h)) return true
  return false
}

/** Parse + vet a candidate URL. Returns null for anything we won't fetch. */
export function parseImageUrl(raw: string): URL | null {
  let u: URL
  try {
    u = new URL(raw.trim())
  } catch {
    return null
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null
  if (isBlockedHost(u.hostname)) return null
  return u
}

/**
 * True for a URL already served by our own Sanity CDN — those need no
 * re-hosting, and re-uploading one would orphan a duplicate asset.
 */
export function isSanityImageUrl(raw: string): boolean {
  const u = parseImageUrl(raw)
  return u?.hostname === "cdn.sanity.io" && u.pathname.startsWith("/images/")
}

/** Slug-safe stem from the URL's last path segment, for the Sanity filename. */
function stemFromUrl(u: URL): string {
  const last = decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() ?? "")
  return (
    last
      .replace(/\.[a-z0-9]+$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  )
}

/**
 * Swap a monday protected-asset URL for a signed `public_url`. Anything else
 * (or a monday lookup that fails) comes back unchanged so the caller can still
 * try the original.
 */
async function resolveMondayAsset(u: URL): Promise<URL> {
  if (!/(^|\.)monday\.com$/i.test(u.hostname)) return u
  const assetId = MONDAY_ASSET_PATH.exec(u.pathname)?.[1]
  if (!assetId) return u
  try {
    const publicUrl = await getAssetPublicUrl(assetId)
    const resolved = publicUrl ? parseImageUrl(publicUrl) : null
    return resolved ?? u
  } catch {
    return u
  }
}

/**
 * Download a remote image. Throws with a human-readable reason — callers
 * surface it to the editor, so "image is 12.4 MB" beats a bare status code.
 */
export async function fetchRemoteImage(raw: string): Promise<RemoteImage> {
  const parsed = parseImageUrl(raw)
  if (!parsed) throw new Error("Not a fetchable http(s) image URL.")

  const target = await resolveMondayAsset(parsed)
  const r = await fetch(target.toString(), {
    redirect: "follow",
    headers: {
      // Some CDNs 403 an unknown agent, and Cloudinary varies output on Accept.
      Accept: "image/*,*/*;q=0.8",
      "User-Agent": "FruitionBlogEditor/1.0 (+https://fruitionservices.io)",
    },
  })
  if (!r.ok) throw new Error(`Source returned ${r.status}.`)

  const mime = r.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() ?? ""
  if (mime && !mime.startsWith("image/")) {
    throw new Error(`Source is ${mime}, not an image.`)
  }

  // Trust the header when it's there, but still measure the body — a wrong or
  // missing content-length must not let an unbounded download through.
  const declared = Number(r.headers.get("content-length") ?? "")
  if (Number.isFinite(declared) && declared > MAX_REMOTE_IMAGE_BYTES) {
    throw new Error(`Image is ${(declared / 1024 / 1024).toFixed(1)} MB (8 MB max).`)
  }
  const bytes = Buffer.from(await r.arrayBuffer())
  if (bytes.byteLength === 0) throw new Error("Source returned an empty file.")
  if (bytes.byteLength > MAX_REMOTE_IMAGE_BYTES) {
    throw new Error(`Image is ${(bytes.byteLength / 1024 / 1024).toFixed(1)} MB (8 MB max).`)
  }

  return { bytes, mime: mime || "image/jpeg", stem: stemFromUrl(parsed) }
}
