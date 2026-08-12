import { requirePortalUser, getPortalAdmin } from '@/lib/portalAuth'
import PortalShell from '@/components/internal/PortalShell'
import NewInvoiceClient from './NewInvoiceClient'
import type { ConsultantProfile, LineItem } from '@/types/invoice'

export const dynamic = 'force-dynamic'

export default async function NewInvoicePage() {
  const user = await requirePortalUser({ next: '/internal/invoices/new' })

  let profile: ConsultantProfile | null = null
  let defaultRate: number | undefined
  try {
    const admin = getPortalAdmin()
    const { data } = await admin
      .from('fruition_consultant_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    profile = data as ConsultantProfile | null

    // The rate is the same every month, so carry it over from the last invoice
    // rather than making it something to re-enter (or get wrong) each time.
    const { data: last } = await admin
      .from('fruition_invoices')
      .select('line_items')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    const lastRate = (last?.line_items as LineItem[] | undefined)?.[0]?.rate
    if (typeof lastRate === 'number' && lastRate > 0) defaultRate = lastRate
  } catch {
    // No profile or no previous invoice — the form falls back to its default.
  }

  return (
    <PortalShell email={user.email} title="New Invoice">
      <div
        className="rounded-card bg-surface p-6 sm:p-8"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
          Create New Invoice
        </h1>
        <NewInvoiceClient profile={profile} defaultRate={defaultRate} />
      </div>
    </PortalShell>
  )
}
