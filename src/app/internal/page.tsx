import Link from "next/link"
import { requirePortalUser, getPortalAdmin } from "@/lib/portalAuth"
import { getGa4Overview, getGscClicksByPage } from "@/lib/googleAnalytics"
import PortalShell from "@/components/internal/PortalShell"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const dynamic = "force-dynamic"

interface DraftRow {
  id: string
  title: string | null
  updated_at: string
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

  // Analytics (null until the Google service-account secret is set).
  const [ga4, gsc] = await Promise.all([
    getGa4Overview(28).catch(() => null),
    getGscClicksByPage(28).catch(() => null),
  ])
  const nf = (n: number) => n.toLocaleString()

  return (
    <PortalShell email={user.email} active="dashboard">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-heading">
            Welcome{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Write and publish blog posts. No Sanity account needed.
          </p>
        </div>
        <Button
          render={<Link href="/internal/blog/new" />}
          className="bg-[var(--purple-primary)] text-white hover:bg-[var(--purple-primary)]/90"
        >
          New blog post
        </Button>
      </div>

      <SectionCards
        connected={Boolean(ga4)}
        totalVisitors={ga4 ? nf(ga4.totalUsers) : undefined}
        pageViews={ga4 ? nf(ga4.pageViews) : undefined}
        conversions={ga4 ? nf(ga4.conversions) : undefined}
        searchClicks={gsc ? nf(gsc.totalClicks) : undefined}
      />

      <div className="px-1">
        <ChartAreaInteractive />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent drafts</CardTitle>
          <CardDescription>Your latest unpublished posts.</CardDescription>
        </CardHeader>
        <CardContent>
          {drafts.length === 0 ? (
            <p
              className="rounded-chip px-4 py-6 text-center text-sm text-[var(--color-text-secondary)]"
              style={{ backgroundColor: "var(--light-section-bg)" }}
            >
              No drafts yet. Start a new post and hit “Save draft”.
            </p>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {drafts.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm font-medium text-ink-heading">
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
        </CardContent>
      </Card>
    </PortalShell>
  )
}
