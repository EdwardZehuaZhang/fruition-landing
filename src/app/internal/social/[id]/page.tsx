import { notFound } from "next/navigation"
import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import SocialComposer from "@/components/internal/social/SocialComposer"
import { loadComposer } from "@/lib/social/composition"

export const dynamic = "force-dynamic"

/**
 * Edit a standalone social post. State is the stored composition merged with
 * live Zernio truth, so a channel published or deleted in the Zernio dashboard
 * shows up here without any sync step.
 */
export default async function EditSocialPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requirePortalUser({ next: `/internal/social/${id}` })

  const state = await loadComposer(id).catch(() => null)
  if (!state) notFound()

  return (
    <PortalShell email={user.email} active="social" title={state.composition.title}>
      <SocialComposer initial={state} />
    </PortalShell>
  )
}
