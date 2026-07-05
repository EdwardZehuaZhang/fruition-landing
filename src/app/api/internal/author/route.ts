import { NextResponse } from "next/server"
import { getPortalApiUser, getPortalAdmin } from "@/lib/portalAuth"
import { getTeamMembers } from "@/sanity/queries"

export const runtime = "nodejs"

/**
 * Link the signed-in Google login to a Sanity team member (the "person
 * database"). Writes the chosen member's id + name onto the caller's `authors`
 * row, so their blog byline becomes that person's name everywhere.
 *
 * Auth: portal session, domain-locked. Writes go through the service-role
 * client (getPortalAdmin) so they bypass RLS — a user still only ever edits
 * their OWN row (we filter by user.id).
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let body: { sanityTeamMemberId?: string | null }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const memberId = (body.sanityTeamMemberId ?? "").toString().trim()

  // Resolve the member name (used as the byline). Empty id clears the link.
  let memberName: string | null = null
  if (memberId) {
    const team = (await getTeamMembers().catch(() => [])) as { _id: string; name?: string }[]
    const member = team.find((m) => m._id === memberId)
    if (!member) {
      return NextResponse.json({ error: "Unknown team member." }, { status: 400 })
    }
    memberName = member.name?.trim() || null
  }

  const admin = getPortalAdmin()
  const patch = {
    sanity_team_member_id: memberId || null,
    byline: memberName,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await admin
    .from("authors")
    .update(patch)
    .eq("supabase_user_id", user.id)
    .select("supabase_user_id")
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 502 })

  // No row yet (login-time ensure didn't run) — create a complete one.
  if (!data) {
    const displayName =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      user.email?.split("@")[0] ||
      "Fruition Editorial"
    const { error: insErr } = await admin.from("authors").insert({
      supabase_user_id: user.id,
      email: user.email,
      display_name: displayName,
      ...patch,
    })
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 502 })
  }

  return NextResponse.json({ ok: true, byline: memberName })
}
