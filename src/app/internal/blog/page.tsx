import Link from "next/link"
import { requirePortalUser } from "@/lib/portalAuth"
import { getBlogPosts } from "@/sanity/queries"
import { getGscClicksByPage } from "@/lib/googleAnalytics"
import PortalShell from "@/components/internal/PortalShell"
import { Button } from "@/components/ui/button"
import { columns, type Post } from "./columns"
import { DataTable } from "./data-table"

export const dynamic = "force-dynamic"

interface RawPost {
  _id: string
  title?: string
  slug?: string
  publishedAt?: string
  author?: string
}

export default async function BlogIndexPage() {
  const user = await requirePortalUser({ next: "/internal/blog" })
  const [raw, gsc] = await Promise.all([
    getBlogPosts(100, 0).catch(() => []) as Promise<RawPost[]>,
    getGscClicksByPage(28).catch(() => null),
  ])
  const posts: Post[] = (raw ?? []).map((p) => ({
    id: p._id,
    _id: p._id,
    title: p.title ?? "Untitled",
    slug: p.slug ?? "",
    publishedAt: p.publishedAt,
    author: p.author,
    clicks: gsc?.byPath.get(`/post/${p.slug ?? ""}`),
  }))

  return (
    <PortalShell email={user.email} active="new" title="Blog posts">
      <div
        className="rounded-card bg-surface p-6 sm:p-8"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink-heading">Blog posts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {posts.length} published {posts.length === 1 ? "post" : "posts"}. The Clicks column
              populates from Google Analytics once connected.
            </p>
          </div>
          <Button render={<Link href="/internal/blog/new" />}>New post</Button>
        </div>
        <DataTable columns={columns} data={posts} />
      </div>
    </PortalShell>
  )
}
