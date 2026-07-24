import { notFound } from "next/navigation"
import { requirePortalUser, getPortalAdmin, authorDisplayName } from "@/lib/portalAuth"
import { getBlogCategories, getTeamMembers } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import BlogEditor, {
  type CategoryOption,
  type BlogEditorInitial,
} from "@/components/internal/BlogEditor"
import SocialDraftsPanel from "@/components/internal/SocialDraftsPanel"
import { slugifyTitle } from "@/lib/social/zernio"

export const dynamic = "force-dynamic"

interface DraftRow {
  id: string
  title: string | null
  body_markdown: string | null
  metadata: Record<string, unknown> | null
}

export default async function EditDraftPage({
  params,
}: {
  params: Promise<{ draftId: string }>
}) {
  const { draftId } = await params
  const user = await requirePortalUser({ next: `/internal/blog/${draftId}/edit` })

  // Drafts are a shared team workspace: any signed-in portal user can open any
  // draft by its link. The portal is already domain-locked to
  // @fruitionservices.io (requirePortalUser above), so there's no per-author gate.
  const { data } = await getPortalAdmin()
    .from("portal_drafts")
    .select("id, title, body_markdown, metadata")
    .eq("id", draftId)
    .maybeSingle()

  const draft = data as DraftRow | null
  if (!draft) notFound()

  const [categories, team, currentAuthorName] = await Promise.all([
    getBlogCategories().catch(() => []) as Promise<CategoryOption[]>,
    getTeamMembers().catch(() => []) as Promise<{ name?: string }[]>,
    authorDisplayName(user),
  ])
  const authors = [...new Set(team.map((m) => m.name).filter((n): n is string => Boolean(n)))]
  const meta = (draft.metadata ?? {}) as Record<string, unknown>
  const initial: BlogEditorInitial = {
    draftId: draft.id,
    title: draft.title ?? "",
    body: draft.body_markdown ?? "",
    slug: typeof meta.slug === "string" ? meta.slug : undefined,
    excerpt: typeof meta.excerpt === "string" ? meta.excerpt : undefined,
    industry: typeof meta.industry === "string" ? meta.industry : undefined,
    categoryIds: Array.isArray(meta.categoryIds) ? (meta.categoryIds as string[]) : undefined,
    // Generated drafts store the keyword as target_keyword; editor saves use seoKeyword.
    seoKeyword:
      typeof meta.seoKeyword === "string"
        ? meta.seoKeyword
        : typeof meta.target_keyword === "string"
          ? meta.target_keyword
          : undefined,
    seoTitle: typeof meta.seoTitle === "string" ? meta.seoTitle : undefined,
    seoDescription: typeof meta.seoDescription === "string" ? meta.seoDescription : undefined,
    publishedAt: typeof meta.publishedAt === "string" ? meta.publishedAt : undefined,
    author: typeof meta.author === "string" ? meta.author : undefined,
    metadata: meta,
  }

  const title = draft.title ?? ""
  const socialSlug =
    (typeof meta.slug === "string" && meta.slug) || (title ? slugifyTitle(title) : "")

  return (
    <PortalShell email={user.email} active="new">
      <div className="rounded-card bg-surface p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="mb-6 text-2xl font-semibold text-ink-heading">Edit draft</h1>
        <BlogEditor
          categories={categories}
          authors={authors}
          currentAuthorName={currentAuthorName}
          initial={initial}
        />
      </div>
      {socialSlug && (
        <SocialDraftsPanel
          source={{ slug: socialSlug, draftId: draft.id }}
          blog={{
            title,
            excerpt: initial.excerpt,
            bodyMarkdown: draft.body_markdown ?? undefined,
            industry: initial.industry,
            targetKeyword: initial.seoKeyword,
          }}
        />
      )}
    </PortalShell>
  )
}
