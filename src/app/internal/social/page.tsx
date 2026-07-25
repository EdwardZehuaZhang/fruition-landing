import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import SocialDashboard from "@/components/internal/SocialDashboard"

export const dynamic = "force-dynamic"

/**
 * Everything published (or drafted) through Zernio across all channels, with
 * search + platform/status filters. Posts made outside Zernio don't appear —
 * the API only manages posts it created.
 */
export default async function SocialPostsPage() {
  const user = await requirePortalUser({ next: "/internal/social" })
  return (
    <PortalShell email={user.email} active="social">
      <SocialDashboard />
    </PortalShell>
  )
}
