import Link from "next/link"
import { requirePortalUser, getPortalAdmin } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

interface DraftRow {
  id: string
  title: string | null
  body_markdown: string | null
  metadata: Record<string, unknown> | null
  updated_at: string
  author_id: string | null
}

function statusBadge(status: string) {
  switch (status) {
    case "drafted":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Draft</Badge>
    case "edited":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Edited</Badge>
    case "published":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Published</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default async function BlogIndexPage() {
  const user = await requirePortalUser({ next: "/internal/blog" })
  const admin = getPortalAdmin()

  // Fetch ALL drafts (not just the user's) for the editorial dashboard
  const { data: drafts, error } = await admin
    .from("portal_drafts")
    .select("id, title, body_markdown, metadata, updated_at, author_id")
    .order("updated_at", { ascending: false })
    .limit(50)

  const items = (drafts ?? []) as DraftRow[]

  return (
    <PortalShell email={user.email} active="blog" title="Blog drafts">
      <div
        className="rounded-card bg-surface p-6 sm:p-8"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-ink-heading">Blog drafts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {items.length} draft{items.length !== 1 ? "s" : ""}. Generated daily at 9am SGT from the Marketa pipeline.
            </p>
          </div>
          <Button render={<Link href="/internal/blog/new" />}>New draft</Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">No drafts yet</p>
            <p className="text-sm">Drafts appear here when the daily Marketa pipeline runs at 9am SGT.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Title</th>
                  <th className="pb-3 pr-4 font-medium hidden md:table-cell">Industry</th>
                  <th className="pb-3 pr-4 font-medium hidden md:table-cell">Docs</th>
                  <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Updated</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((draft) => {
                  const meta = (draft.metadata ?? {}) as Record<string, unknown>
                  const status = (meta.status as string) || "drafted"
                  const industry = (meta.industry as string) || "-"
                  const googleDocUrl = meta.google_doc_url as string | null
                  const linkedinDocUrl = meta.linkedin_doc_url as string | null
                  const linkedinCopy = meta.linkedin_copy as string | null
                  const excerpt = (meta.excerpt as string) || ""
                  const title = draft.title || "Untitled"
                  const updated = draft.updated_at 
                    ? new Date(draft.updated_at).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })
                    : "-"

                  return (
                    <tr key={draft.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">{statusBadge(status)}</td>
                      <td className="py-3 pr-4 max-w-xs">
                        <div className="font-medium text-ink-heading truncate">{title}</div>
                        {excerpt && (
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{excerpt}</div>
                        )}
                      </td>
                      <td className="py-3 pr-4 hidden md:table-cell text-muted-foreground">{industry}</td>
                      <td className="py-3 pr-4 hidden md:table-cell">
                        <div className="flex gap-2 flex-wrap">
                          {googleDocUrl ? (
                            <a href={googleDocUrl} target="_blank" rel="noopener" className="text-primary hover:underline text-xs">
                              Blog Doc
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground/50">-</span>
                          )}
                          {linkedinDocUrl ? (
                            <a href={linkedinDocUrl} target="_blank" rel="noopener" className="text-primary hover:underline text-xs">
                              LinkedIn Doc
                            </a>
                          ) : linkedinCopy ? (
                            <span className="text-xs text-green-600">Copy ready</span>
                          ) : (
                            <span className="text-xs text-muted-foreground/50">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 hidden lg:table-cell text-muted-foreground text-xs">{updated}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" render={<Link href={`/internal/blog/${draft.id}/edit`} />}>
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalShell>
  )
}
