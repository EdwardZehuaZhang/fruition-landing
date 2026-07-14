'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Invoice, ConsultantProfile } from '@/types/invoice'
import ClockifyImportDialog from '@/components/internal/invoices/ClockifyImportDialog'

interface Props {
  profile: ConsultantProfile | null
}

export default function ClockifyImportClient({ profile }: Props) {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleSave = async (invoice: Invoice) => {
    setError('')
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

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      <ClockifyImportDialog profile={profile} onSave={handleSave} />
    </div>
  )
}
