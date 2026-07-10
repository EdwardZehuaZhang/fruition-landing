import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import DesignGenerator from "@/components/internal/DesignGenerator"

export const dynamic = "force-dynamic"

export default async function NewDesignPage() {
  const user = await requirePortalUser({ next: "/internal/design/new" })
  return (
    <PortalShell email={user.email} title="New design document">
      <DesignGenerator />
    </PortalShell>
  )
}
