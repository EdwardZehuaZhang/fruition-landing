import Link from "next/link"
import { requirePortalUser, getPortalAdmin } from "@/lib/portalAuth"
import { getBlogPosts } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"

export const dynamic = "force-dynamic"

interface DraftRow {
  id: string
  title: string | null
  updated_at: string
}
interface PostRow {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  author?: string
}

function fmt(d?: string): string {
  if (!d) return ""
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return d
  }
}

export default async function DashboardPage() {
  const user = await requirePortalUser({ next: "/internal" })

  let drafts: DraftRow[] = []
  try {
    const { data } = await getPortalAdmin()
      .from("portal_drafts")
      .select("id, title, updated_at")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(25)
    drafts = (data as DraftRow[] | null) ?? []
  } catch {
    // Portal DB not reachable — show an empty drafts state rather than 500.
  }

  const posts = ((await getBlogPosts(8, 0).catch(() => [])) as PostRow[]) ?? []

  return (
    <PortalShell email={user.email} active="dashboard">
      <div className="rounded-card bg-white p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[#10003a]">
              Welcome{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Write and publish blog posts. No Sanity account needed.
            </p>
          </div>
          <Link
            href="/internal/blog/new"
            className="rounded-pill px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--purple-primary)" }}
          >
            New blog post
          </Link>
        </div>

        <Section title="Your drafts">
          {drafts.length === 0 ? (
            <Empty>No drafts yet. Start a new post and hit “Save draft”.</Empty>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {drafts.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm font-medium text-[#10003a]">
                    {d.title || "Untitled draft"}
                  </span>
                  <span className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                    <span>edited {fmt(d.updated_at)}</span>
                    <Link
                      href={`/internal/blog/${d.id}/edit`}
                      className="font-medium text-[var(--purple-primary)]"
                    >
                      Edit →
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Recent published posts">
          {posts.length === 0 ? (
            <Empty>No published posts found.</Empty>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {posts.map((p) => (
                <li key={p._id} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm font-medium text-[#10003a]">{p.title}</span>
                  <span className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                    <span>
                      {p.author ? `${p.author} · ` : ""}
                      {fmt(p.publishedAt)}
                    </span>
                    <a
                      href={`/post/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[var(--purple-primary)]"
                    >
                      View →
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </PortalShell>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--purple-primary)]">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="rounded-chip px-4 py-6 text-center text-sm text-[var(--color-text-secondary)]"
      style={{ backgroundColor: "var(--light-section-bg)" }}
    >
      {children}
    </p>
  )
}
