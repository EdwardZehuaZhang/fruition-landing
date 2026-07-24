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

export interface PanelPost {
  id: string
  content: string
  /** Pinterest pin title / Reddit post title. */
  title?: string
  status: string
  platformUrl?: string
  error?: string
}

export interface PanelPlatform {
  key: PlatformKey
  label: string
  limit: number
  needsMedia: boolean
  /** Account handle/name shown under the label. */
  account: string
  connected: boolean
  post?: PanelPost
}

export interface PanelState {
  /** Live blog URL when the post is published in Sanity. */
  blogUrl?: string
  coverImageUrl?: string
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
  const title = typeof psd.title === "string" ? psd.title : undefined
  return {
    id: post._id,
    content: post.content ?? "",
    title,
    status: entry?.status === "failed" ? "failed" : post.status,
    platformUrl: entry?.platformPostUrl,
    error: entry?.error,
  }
}

/** Resolve published-blog facts (live URL + cover image) from Sanity. */
export async function publishedBlogFacts(
  slug: string,
): Promise<{ blogUrl?: string; coverImageUrl?: string }> {
  if (!slug) return {}
  try {
    const post = (await getBlogPostBySlug(slug)) as { slug?: string; coverImage?: unknown } | null
    if (!post?.slug) return {}
    let coverImageUrl: string | undefined
    if (post.coverImage) {
      try {
        coverImageUrl = urlFor(post.coverImage).width(1600).fit("max").url()
      } catch {
        coverImageUrl = undefined
      }
    }
    return { blogUrl: `${SITE_BASE}/post/${post.slug}`, coverImageUrl }
  } catch {
    return {}
  }
}

/** Assemble the full panel state for a blog (draft or published). */
export async function buildPanelState(source: SocialSource): Promise<PanelState> {
  const [accounts, posts, blog] = await Promise.all([
    listAccounts(),
    findSocialPosts(source).catch(() => ({}) as Partial<Record<PlatformKey, ZernioPost>>),
    publishedBlogFacts(source.slug),
  ])
  const accountById = new Map(accounts.map((a) => [a._id, a]))

  return {
    ...blog,
    dashboardUrl: DASHBOARD_URL,
    platforms: PLATFORMS.map((spec) => {
      const account = accountById.get(spec.accountId)
      return {
        key: spec.key,
        label: spec.label,
        limit: spec.limit,
        needsMedia: spec.needsMedia,
        account: account?.username || account?.displayName || spec.label,
        connected: Boolean(account && account.isActive !== false && account.enabled !== false),
        post: panelPost(posts[spec.key]),
      }
    }),
  }
}
