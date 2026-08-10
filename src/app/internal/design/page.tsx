import Link from "next/link"
import { Palette } from "lucide-react"
import { requirePortalUser, getPortalAdmin } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import PageHeader from "@/components/internal/PageHeader"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

interface DocRow {
  id: string
  title: string
  source_filename: string | null
  updated_at: string
}

export default async function DesignIndexPage() {
  const user = await requirePortalUser({ next: "/internal/design" })
  const admin = getPortalAdmin()
  const { data } = await admin
    .from("design_docs")
    .select("id, title, source_filename, updated_at")
    .eq("author_id", user.id)
    .order("updated_at", { ascending: false })
  const docs = (data ?? []) as DocRow[]

  return (
    <PortalShell email={user.email} title="Design documents">
      <>
        <PageHeader
          title="Design documents"
          description="PDFs redesigned in the Fruition document style. Only you can see your documents."
          actions={<Button render={<Link href="/internal/design/new" />}>New document</Button>}
        />

        {docs.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-2 rounded-card border border-dashed border-[var(--color-border)] p-10 text-center">
            <Palette className="size-6 text-[var(--purple-primary)]" />
            <p className="text-sm text-muted-foreground">
              No documents yet. Upload a PDF to create your first Fruition-branded document.
            </p>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-[var(--color-border)]">
            {docs.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/internal/design/${doc.id}`}
                  className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-[var(--light-section-bg,#ecf1fc)]/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-heading">{doc.title}</p>
                    {doc.source_filename && (
                      <p className="truncate text-xs text-muted-foreground">
                        From {doc.source_filename}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(doc.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </>
    </PortalShell>
  )
}
