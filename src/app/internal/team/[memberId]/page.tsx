import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { requirePortalUser } from "@/lib/portalAuth"
import { getTeamMemberById } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import { Button } from "@/components/ui/button"
import TeamMemberForm, { type TeamMemberDetail } from "./TeamMemberForm"

export const dynamic = "force-dynamic"

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ memberId: string }>
}) {
  const { memberId: raw } = await params
  const memberId = decodeURIComponent(raw)
  const user = await requirePortalUser({ next: `/internal/team/${raw}` })

  const member = (await getTeamMemberById(memberId).catch(() => null)) as
    | (TeamMemberDetail & { _id: string })
    | null
  if (!member?._id) notFound()

  return (
    <PortalShell email={user.email} active="team" title={member.name ?? "Team member"}>
      <div>
        <Button variant="ghost" size="sm" render={<Link href="/internal/team" />}>
          <ArrowLeft className="size-4" />
          Back to team
        </Button>
      </div>
      <div className="rounded-card bg-surface p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="text-2xl font-semibold text-ink-heading">{member.name ?? "Team member"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes publish straight to the public team and partner pages.
        </p>
        <div className="mt-6">
          <TeamMemberForm member={member} />
        </div>
      </div>
    </PortalShell>
  )
}
