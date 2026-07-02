import { notFound } from "next/navigation"
import { requirePortalUser, getPortalAdmin } from "@/lib/portalAuth"
import { getBlogCategories } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import BlogEditor, {
  type CategoryOption,
  type BlogEditorInitial,
} from "@/components/internal/BlogEditor"

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

  const { data } = await getPortalAdmin()
    .from("portal_drafts")
    .select("id, title, body_markdown, metadata")
    .eq("id", draftId)
    .eq("author_id", user.id)
    .maybeSingle()

  const draft = data as DraftRow | null
  if (!draft) notFound()

  const categories = ((await getBlogCategories().catch(() => [])) as CategoryOption[]) ?? []
  const meta = (draft.metadata ?? {}) as Record<string, unknown>
  const initial: BlogEditorInitial = {
    draftId: draft.id,
    title: draft.title ?? "",
    body: draft.body_markdown ?? "",
    slug: typeof meta.slug === "string" ? meta.slug : undefined,
    excerpt: typeof meta.excerpt === "string" ? meta.excerpt : undefined,
    industry: typeof meta.industry === "string" ? meta.industry : undefined,
    categoryIds: Array.isArray(meta.categoryIds) ? (meta.categoryIds as string[]) : undefined,
    seoTitle: typeof meta.seoTitle === "string" ? meta.seoTitle : undefined,
    seoDescription: typeof meta.seoDescription === "string" ? meta.seoDescription : undefined,
    publishedAt: typeof meta.publishedAt === "string" ? meta.publishedAt : undefined,
  }

  return (
    <PortalShell email={user.email} active="new">
      <div className="rounded-card bg-white p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="mb-6 text-2xl font-semibold text-[#10003a]">Edit draft</h1>
        <BlogEditor categories={categories} initial={initial} />
      </div>
    </PortalShell>
  )
}
