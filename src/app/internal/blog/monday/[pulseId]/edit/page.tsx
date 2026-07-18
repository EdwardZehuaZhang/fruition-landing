import { redirect, notFound } from "next/navigation"
import { requirePortalUser, getPortalAdmin } from "@/lib/portalAuth"
import { getFullDraft } from "@/lib/marketaDrafts"

export const dynamic = "force-dynamic"

export default async function MondayDraftEditPage({
  params,
}: {
  params: Promise<{ pulseId: string }>
}) {
  const { pulseId } = await params
  const user = await requirePortalUser({ next: `/internal/blog/monday/${pulseId}/edit` })

  const admin = getPortalAdmin()
  const { data: existing } = await admin
    .from("portal_drafts")
    .select("id")
    .eq("metadata->>monday_item_id", pulseId)
    .maybeSingle()

  if (existing) {
    redirect(`/internal/blog/${existing.id}/edit`)
  }

  const draftBody = await getFullDraft(pulseId)
  if (!draftBody) notFound()

  const titleMatch = draftBody.match(/^# (.+)$/m)
  const title = titleMatch?.[1]?.trim() ?? "Untitled draft"

  const { data: created, error } = await admin
    .from("portal_drafts")
    .insert({
      title,
      body_markdown: draftBody,
      author_id: user.id,
      metadata: { monday_item_id: pulseId, source: "marketa-pipeline" },
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single()

  if (error || !created) {
    console.error("[monday-edit] failed to create portal_drafts row:", error?.message)
    notFound()
  }

  redirect(`/internal/blog/${created.id}/edit`)
}
