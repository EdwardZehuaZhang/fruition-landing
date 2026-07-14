'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Invoice } from '@/types/invoice'
import InvoiceTable from '@/components/internal/invoices/InvoiceTable'
import { exportInvoiceToPDF } from '@/lib/invoicePdf'

interface Props {
  userId: string
}

export default function InvoiceListClient({ userId: _userId }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/internal/invoices')
      if (res.ok) {
        const data = await res.json()
        setInvoices(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err)
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

  const handleExportPdf = (invoice: Invoice) => {
    exportInvoiceToPDF(invoice)
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
