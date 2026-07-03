import { requirePortalUser } from "@/lib/portalAuth"
import { getBlogCategories, getTeamMembers } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import BlogEditor, { type CategoryOption } from "@/components/internal/BlogEditor"

export const dynamic = "force-dynamic"

export default async function NewPostPage() {
  const user = await requirePortalUser({ next: "/internal/blog/new" })
  const [categories, team] = await Promise.all([
    getBlogCategories().catch(() => []) as Promise<CategoryOption[]>,
    getTeamMembers().catch(() => []) as Promise<{ name?: string }[]>,
  ])
  const authors = [...new Set(team.map((m) => m.name).filter((n): n is string => Boolean(n)))]

  return (
    <PortalShell email={user.email} active="new">
      <div className="rounded-card bg-surface p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="mb-6 text-2xl font-semibold text-ink-heading">New blog post</h1>
        <BlogEditor categories={categories} authors={authors} />
      </div>
    </PortalShell>
  )
}
