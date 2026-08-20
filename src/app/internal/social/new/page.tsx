import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import SocialComposer from "@/components/internal/social/SocialComposer"
import { buildComposerState } from "@/lib/social/composition"

export const dynamic = "force-dynamic"

/**
 * Write a social post from scratch, for any combination of channels — the
 * standalone counterpart to the blog's Social tab.
 *
 * Nothing is written anywhere until the first save: the composer starts from an
 * unsaved composition and claims its URL once it has an id.
 */
export default async function NewSocialPostPage() {
  const user = await requirePortalUser({ next: "/internal/social/new" })

  // An empty composition still needs the channel list, account connection state
  // and per-platform limits, which all come from the same builder.
  const state = await buildComposerState({
    id: "",
    title: "",
    mediaUrls: [],
    shortenLinks: true,
    platforms: {},
    postIds: [],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  return (
    <PortalShell email={user.email} active="social" title="New social post">
      <SocialComposer initial={state} />
    </PortalShell>
  )
}
