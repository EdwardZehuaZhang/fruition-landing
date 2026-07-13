import { NextResponse } from "next/server"
import { getPortalApiUser, getPortalAdmin } from "@/lib/portalAuth"

export const runtime = "nodejs"

/**
 * Save (create or update) an editorial draft in the portal_drafts table.
 * Drafts are a shared team workspace — any signed-in portal user can edit any
 * draft (the portal is domain-locked to @fruitionservices.io). Publishing is a
 * separate step (POST /api/internal/blog), which writes to Sanity.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let body: {
    id?: string
    title?: string
    body_markdown?: string
    metadata?: Record<string, unknown>
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const admin = getPortalAdmin()
  const payload = {
    title: body.title ?? null,
    body_markdown: body.body_markdown ?? null,
    metadata: body.metadata ?? {},
    updated_at: new Date().toISOString(),
  }

  if (body.id) {
    // Shared workspace: any signed-in portal user can update any draft. Don't
    // reassign author_id on save — preserve the original creator.
    const { data, error } = await admin
      .from("portal_drafts")
      .update(payload)
      .eq("id", body.id)
      .select("id")
      .maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 502 })
    if (!data) return NextResponse.json({ error: "Draft not found." }, { status: 404 })
    return NextResponse.json({ ok: true, id: data.id })
  }

  const { data, error } = await admin
    .from("portal_drafts")
    .insert({ ...payload, author_id: user.id })
    .select("id")
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 502 })
  return NextResponse.json({ ok: true, id: data.id })
}
