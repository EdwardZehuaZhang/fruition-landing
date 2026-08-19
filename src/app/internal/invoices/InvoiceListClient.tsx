'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Invoice } from '@/types/invoice'
import InvoiceTable from '@/components/internal/invoices/InvoiceTable'

interface Props {
  userId: string
}

export default function InvoiceListClient({ userId: _userId }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/internal/invoices')
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Server returned ${res.status}`)
      }
      const data = await res.json()
      setInvoices(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch invoices:', err)
      setError(err instanceof Error ? err.message : 'Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/internal/invoices/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete')
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
  }

  const handleExportPdf = async (invoice: Invoice) => {
    // Lazy-load pdfmake client-side only — keeps it out of the edge Worker bundle.
    const { exportInvoiceToPDF } = await import('@/lib/invoicePdf')
    await exportInvoiceToPDF(invoice)
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Could not load invoices ({error}). Try refreshing — if it persists, the
          invoices table may be missing in Supabase.
        </p>
      </div>
    )
  }

  return (
    <InvoiceTable
      invoices={invoices}
      loading={loading}
      onDelete={handleDelete}
      onExportPdf={handleExportPdf}
    />
  )
}
