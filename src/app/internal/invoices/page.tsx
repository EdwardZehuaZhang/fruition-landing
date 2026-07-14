import Link from 'next/link'
import { requirePortalUser } from '@/lib/portalAuth'
import PortalShell from '@/components/internal/PortalShell'
import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'
import InvoiceListClient from './InvoiceListClient'

export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
  const user = await requirePortalUser({ next: '/internal/invoices' })

  return (
    <PortalShell email={user.email} title="Invoices">
      <div
        className="rounded-card bg-surface p-6 sm:p-8"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink-heading">Invoices</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your invoices. Data is stored securely in Supabase.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" render={<Link href="/internal/invoices/import" />}>
              <Upload className="mr-2 size-4" />
              Import Clockify
            </Button>
            <Button render={<Link href="/internal/invoices/new" />}>
              <Plus className="mr-2 size-4" />
              New Invoice
            </Button>
          </div>
        </div>
        <InvoiceListClient userId={user.id} />
      </div>
    </PortalShell>
  )
}
