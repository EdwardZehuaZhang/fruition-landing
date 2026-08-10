import { requirePortalUser, getPortalAdmin } from '@/lib/portalAuth'
import PortalShell from '@/components/internal/PortalShell'
import ClockifyImportClient from './ClockifyImportClient'
import type { ConsultantProfile } from '@/types/invoice'

export const dynamic = 'force-dynamic'

export default async function ClockifyImportPage() {
  const user = await requirePortalUser({ next: '/internal/invoices/import' })

  let profile: ConsultantProfile | null = null
  try {
    const admin = getPortalAdmin()
    const { data } = await admin
      .from('fruition_consultant_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    profile = data as ConsultantProfile | null
  } catch {
    // Use defaults
  }

  return (
    <PortalShell email={user.email} title="Import from Clockify">
      <div
        className="rounded-card bg-surface p-6 sm:p-8"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
          Import Invoice from Clockify
        </h1>
        <ClockifyImportClient profile={profile} />
      </div>
    </PortalShell>
  )
}
