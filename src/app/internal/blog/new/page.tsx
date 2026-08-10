import { requirePortalUser, authorDisplayName } from "@/lib/portalAuth"
import { getBlogCategories, getTeamMembers } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import BlogEditor, { type CategoryOption } from "@/components/internal/BlogEditor"

export const dynamic = "force-dynamic"

export default async function NewPostPage() {
  const user = await requirePortalUser({ next: "/internal/blog/new" })
  const [categories, team, currentAuthorName] = await Promise.all([
    getBlogCategories().catch(() => []) as Promise<CategoryOption[]>,
    getTeamMembers().catch(() => []) as Promise<{ name?: string }[]>,
    authorDisplayName(user),
  ])
  const authors = [...new Set(team.map((m) => m.name).filter((n): n is string => Boolean(n)))]

  return (
    <PortalShell email={user.email} active="new">
      <div>
        <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground">New blog post</h1>
        <BlogEditor categories={categories} authors={authors} currentAuthorName={currentAuthorName} />
      </div>
    </PortalShell>
  )
}
