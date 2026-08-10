import Link from "next/link"
import { requirePortalUser, getAuthorProfile } from "@/lib/portalAuth"
import { getTeamMembers } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import PageHeader from "@/components/internal/PageHeader"
import AuthorIdentityCard from "@/components/internal/AuthorIdentityCard"
import { Button } from "@/components/ui/button"
import TeamTable, { type TeamRow } from "./TeamTable"

export const dynamic = "force-dynamic"

interface Member {
  _id: string
  name?: string
  role?: string
  regions?: string[]
  certifications?: string[]
  linkedinUrl?: string
  order?: number
}

export default async function TeamPage() {
  const user = await requirePortalUser({ next: "/internal/team" })
  const [team, profile] = await Promise.all([
    getTeamMembers().catch(() => []) as Promise<Member[]>,
    getAuthorProfile(user.id),
  ])
  const memberOptions = team
    .filter((m): m is Member & { name: string } => Boolean(m.name))
    .map((m) => ({ _id: m._id, name: m.name }))

  const rows: TeamRow[] = team.map((m) => ({
    _id: m._id,
    name: m.name ?? "Unnamed",
    role: m.role ?? null,
    regions: m.regions ?? [],
    certifications: m.certifications ?? [],
    linkedinUrl: m.linkedinUrl ?? null,
    order: typeof m.order === "number" ? m.order : null,
  }))

  return (
    <PortalShell email={user.email} active="team">
      <AuthorIdentityCard
        email={user.email}
        members={memberOptions}
        currentMemberId={profile?.sanity_team_member_id}
        currentByline={profile?.byline}
      />
      <>
        <PageHeader
          title="Team"
          description="People shown on the public team and partner pages, and selectable as blog authors. Click a member to edit their details."
          actions={<Button render={<Link href="/internal/onboarding" />}>Add member</Button>}
        />

        <TeamTable rows={rows} />
      </>
    </PortalShell>
  )
}
