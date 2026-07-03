import Link from "next/link"
import { requirePortalUser } from "@/lib/portalAuth"
import { getTeamMembers } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"

export const dynamic = "force-dynamic"

interface Member {
  _id: string
  name?: string
  role?: string
  regions?: string[]
}

export default async function TeamPage() {
  const user = await requirePortalUser({ next: "/internal/team" })
  const team = ((await getTeamMembers().catch(() => [])) as Member[]) ?? []

  return (
    <PortalShell email={user.email} active="team">
      <div className="rounded-card bg-surface p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink-heading">Team</h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              People shown on the public team + partner pages, and selectable as blog authors.
            </p>
          </div>
          <Link
            href="/internal/onboarding"
            className="rounded-pill px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--purple-primary)" }}
          >
            Add member
          </Link>
        </div>

        {team.length === 0 ? (
          <p className="py-6 text-sm text-[var(--color-text-secondary)]">No team members yet.</p>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {team.map((m) => (
              <li key={m._id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(128,21,232,0.10)] text-sm font-semibold text-[var(--purple-primary)]">
                    {(m.name ?? "?").slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-heading">{m.name ?? "Unnamed"}</p>
                    {m.role && (
                      <p className="text-xs text-[var(--color-text-secondary)]">{m.role}</p>
                    )}
                  </div>
                </div>
                {m.regions?.length ? (
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {m.regions.join(", ")}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  )
}
