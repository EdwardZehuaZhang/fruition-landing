'use client'

import { useRouter } from 'next/navigation'
import type { Invoice, ConsultantProfile } from '@/types/invoice'
import ClockifyImportDialog from '@/components/internal/invoices/ClockifyImportDialog'

interface Props {
  profile: ConsultantProfile | null
}

export default function ClockifyImportClient({ profile }: Props) {
  const router = useRouter()
  const handleSave = async (invoice: Invoice) => {
    const res = await fetch('/api/internal/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(data.error || 'Failed to save invoice')
    }

    router.push('/internal/invoices')
    router.refresh()
  }

  return <ClockifyImportDialog profile={profile} onSave={handleSave} />
}
