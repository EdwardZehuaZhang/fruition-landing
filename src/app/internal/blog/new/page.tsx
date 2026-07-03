import { requirePortalUser } from "@/lib/portalAuth"
import { getBlogCategories } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import BlogEditor, { type CategoryOption } from "@/components/internal/BlogEditor"

export const dynamic = "force-dynamic"

export default async function NewPostPage() {
  const user = await requirePortalUser({ next: "/internal/blog/new" })
  const categories = ((await getBlogCategories().catch(() => [])) as CategoryOption[]) ?? []

  return (
    <PortalShell email={user.email} active="new">
      <div className="rounded-card bg-white p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="mb-6 text-2xl font-semibold text-[#10003a]">New blog post</h1>
        <BlogEditor categories={categories} />
      </div>
    </PortalShell>
  )
}
