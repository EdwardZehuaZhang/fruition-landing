import { NextResponse } from "next/server"
import { getPortalApiUser, getPortalAdmin } from "@/lib/portalAuth"

export const runtime = "nodejs"

type Ctx = { params: Promise<{ id: string }> }

/** Rename or replace the HTML of one of your design documents. */
export async function PATCH(req: Request, ctx: Ctx) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { id } = await ctx.params

  let body: { title?: string; html?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.title !== undefined) patch.title = body.title.trim() || "Untitled document"
  if (body.html !== undefined) patch.html = body.html

  const admin = getPortalAdmin()
  const { data, error } = await admin
    .from("design_docs")
    .update(patch)
    .eq("id", id)
    .eq("author_id", user.id) // can only edit your own docs
    .select("id")
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 502 })
  if (!data) return NextResponse.json({ error: "Document not found." }, { status: 404 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { id } = await ctx.params

  const admin = getPortalAdmin()
  const { data, error } = await admin
    .from("design_docs")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id)
    .select("id")
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 502 })
  if (!data) return NextResponse.json({ error: "Document not found." }, { status: 404 })
  return NextResponse.json({ ok: true })
}
