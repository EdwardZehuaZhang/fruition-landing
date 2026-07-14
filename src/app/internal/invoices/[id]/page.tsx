import { requirePortalUser, getPortalAdmin } from '@/lib/portalAuth'
import PortalShell from '@/components/internal/PortalShell'
import InvoiceDetailClient from './InvoiceDetailClient'
import type { Invoice } from '@/types/invoice'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function InvoiceDetailPage({ params }: Props) {
  const user = await requirePortalUser({ next: '/internal/invoices' })
  const { id } = await params

  const admin = getPortalAdmin()
  const { data, error } = await admin
    .from('fruition_invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    notFound()
  }

  const invoice = data as unknown as Invoice

  return (
    <PortalShell email={user.email} title={`Invoice ${invoice.invoice_no}`}>
      <InvoiceDetailClient invoice={invoice} />
    </PortalShell>
  )
}
