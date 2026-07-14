'use client'

import { useRouter } from 'next/navigation'
import { Download, ArrowLeft } from 'lucide-react'
import type { Invoice } from '@/types/invoice'
import InvoicePreview from '@/components/internal/invoices/InvoicePreview'
import { Button } from '@/components/ui/button'
import { exportInvoiceToPDF } from '@/lib/invoicePdf'
import Link from 'next/link'

interface Props {
  invoice: Invoice
}

export default function InvoiceDetailClient({ invoice }: Props) {
  const router = useRouter()

  const handleExport = () => {
    exportInvoiceToPDF(invoice)
  }

  return (
    <div
      className="rounded-card bg-surface p-6 sm:p-8"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" render={<Link href="/internal/invoices" />}>
          <ArrowLeft className="mr-2 size-4" />
          Back to Invoices
        </Button>
        <Button onClick={handleExport}>
          <Download className="mr-2 size-4" />
          Export PDF
        </Button>
      </div>
      <div className="mx-auto max-w-[900px]">
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  )
}
