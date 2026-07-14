import { requirePortalUser, getPortalAdmin } from '@/lib/portalAuth'
import PortalShell from '@/components/internal/PortalShell'
import NewInvoiceClient from './NewInvoiceClient'
import type { ConsultantProfile } from '@/types/invoice'

export const dynamic = 'force-dynamic'

export default async function NewInvoicePage() {
  const user = await requirePortalUser({ next: '/internal/invoices/new' })

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
    // Profile not found — will use defaults
  }

  return (
    <PortalShell email={user.email} title="New Invoice">
      <div
        className="rounded-card bg-surface p-6 sm:p-8"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <h1 className="mb-6 text-2xl font-semibold text-ink-heading">
          Create New Invoice
        </h1>
        <NewInvoiceClient profile={profile} />
      </div>
    </PortalShell>
  )
}
