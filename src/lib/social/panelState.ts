/**
 * Shared state shape for the portal's social drafts panel, plus the
 * server-side builder that assembles it from Zernio + Sanity.
 *
 * The panel (SocialDraftsPanel.tsx) imports the TYPES only; the builder is
 * used by the /api/internal/blog/social routes.
 */

import {
  PLATFORMS,
  findSocialPosts,
  type PlatformKey,
  type SocialSource,
  type ZernioPost,
} from "@/lib/social/zernio"
import { getBlogPostBySlug } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"
import { getPortalAdmin } from "@/lib/portalAuth"

export interface PanelPost {
  id: string
  content: string
  /** Pinterest pin title / Reddit post title. */
  title?: string
  /** Image currently attached to the Zernio draft. */
  mediaUrl?: string
  /** Reddit target subreddit (without r/). */
  subreddit?: string
  status: string
  platformUrl?: string
  error?: string
}

export interface PanelPlatform {
  key: PlatformKey
  label: string
  limit: number
  needsMedia: boolean
  supportsMedia: boolean
  /** Account handle/name shown under the label. */
  account: string
  connected: boolean
  post?: PanelPost
}

export interface PanelState {
  /** Live blog URL when the post is published in Sanity. */
  blogUrl?: string
  coverImageUrl?: string
  /** Blog images (cover first, then body images) selectable as post media. */
  availableImages: string[]
  dashboardUrl: string
  platforms: PanelPlatform[]
}

const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.fruitionservices.io").replace(/\/+$/, "")
const DASHBOARD_URL = process.env.ZERNIO_DASHBOARD_URL || "https://zernio.com/dashboard"

interface ZernioAccount {
  _id: string
  platform: string
  displayName?: string
  username?: string
  isActive?: boolean
  enabled?: boolean
}

async function listAccounts(): Promise<ZernioAccount[]> {
  const key = process.env.ZERNIO_API_KEY
  if (!key) return []
  const res = await fetch("https://zernio.com/api/v1/accounts", {
    headers: { Authorization: `Bearer ${key}` },
  })
  if (!res.ok) return []
  const data = (await res.json()) as { accounts?: ZernioAccount[] }
  return data.accounts ?? []
}

function panelPost(post: ZernioPost | undefined): PanelPost | undefined {
  if (!post) return undefined
  const entry = post.platforms?.[0]
  const psd = (entry?.platformSpecificData ?? {}) as Record<string, unknown>
  return {
    id: post._id,
    content: post.content ?? "",
    title: typeof psd.title === "string" ? psd.title : undefined,
    mediaUrl: post.mediaItems?.find((m) => m.type === "image")?.url,
    subreddit: typeof psd.subreddit === "string" ? psd.subreddit : undefined,
    status: entry?.status === "failed" ? "failed" : post.status,
    platformUrl: entry?.platformPostUrl,
    error: entry?.error,
  }
}

function imageUrlOf(source: unknown): string | undefined {
  try {
    return urlFor(source).width(1600).fit("max").url()
  } catch {
    return undefined
  }
}

export interface BlogFacts {
  blogUrl?: string
  coverImageUrl?: string
  /** Cover first, then body images, deduped. */
  images: string[]
}

/** Live URL + all usable images (cover + portable-text body images) from Sanity. */
export async function publishedBlogFacts(slug: string): Promise<BlogFacts> {
  if (!slug) return { images: [] }
  try {
    const post = (await getBlogPostBySlug(slug)) as {
      slug?: string
      coverImage?: unknown
      body?: unknown
    } | null
    if (!post?.slug) return { images: [] }

    const images: string[] = []
    const coverImageUrl = post.coverImage ? imageUrlOf(post.coverImage) : undefined
    if (coverImageUrl) images.push(coverImageUrl)
    if (Array.isArray(post.body)) {
      for (const block of post.body) {
        if ((block as { _type?: string })?._type !== "image") continue
        const url = imageUrlOf(block)
        if (url && !images.includes(url)) images.push(url)
      }
    }
    return { blogUrl: `${SITE_BASE}/post/${post.slug}`, coverImageUrl, images }
  } catch {
    return { images: [] }
  }
}

/** Markdown image URLs from a portal draft's body (drafts have no Sanity doc). */
export async function draftBodyImages(draftId: string | undefined): Promise<string[]> {
  if (!draftId) return []
  try {
    const { data } = await getPortalAdmin()
      .from("portal_drafts")
      .select("body_markdown")
      .eq("id", draftId)
      .maybeSingle()
    const md = (data as { body_markdown?: string } | null)?.body_markdown ?? ""
    const urls: string[] = []
    for (const m of md.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)/g)) {
      if (!urls.includes(m[1])) urls.push(m[1])
    }
    return urls
  } catch {
    return []
  }
}

/** Assemble the full panel state for a blog (draft or published). */
export async function buildPanelState(source: SocialSource): Promise<PanelState> {
  const [accounts, posts, blog, mdImages] = await Promise.all([
    listAccounts(),
    findSocialPosts(source).catch(() => ({}) as Partial<Record<PlatformKey, ZernioPost>>),
    publishedBlogFacts(source.slug),
    draftBodyImages(source.draftId),
  ])
  const accountById = new Map(accounts.map((a) => [a._id, a]))
  const availableImages = [...blog.images, ...mdImages.filter((u) => !blog.images.includes(u))]

  return {
    blogUrl: blog.blogUrl,
    coverImageUrl: blog.coverImageUrl,
    availableImages,
    dashboardUrl: DASHBOARD_URL,
    platforms: PLATFORMS.map((spec) => {
      const account = accountById.get(spec.accountId)
      return {
        key: spec.key,
        label: spec.label,
        limit: spec.limit,
        needsMedia: spec.needsMedia,
        supportsMedia: spec.supportsMedia,
        account: account?.username || account?.displayName || spec.label,
        connected: Boolean(account && account.isActive !== false && account.enabled !== false),
        post: panelPost(posts[spec.key]),
      }
    }),
  }
}
