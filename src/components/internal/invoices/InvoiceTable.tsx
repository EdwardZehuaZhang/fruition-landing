'use client'

import { useState } from 'react'
import { Eye, Download, Trash2, X } from 'lucide-react'
import type { Invoice } from '@/types/invoice'
import InvoicePreview from './InvoicePreview'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface Props {
  invoices: Invoice[]
  loading: boolean
  onDelete: (id: string) => Promise<void>
  onExportPdf: (invoice: Invoice) => void
}

export default function InvoiceTable({ invoices, loading, onDelete, onExportPdf }: Props) {
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setViewOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this invoice? This cannot be undone.')) {
      try {
        await onDelete(id)
      } catch (error) {
        console.error('Delete failed:', error)
        alert('Failed to delete invoice')
      }
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Loading invoices...</p>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">No invoices saved yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first invoice to get started
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Invoice No.</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Consultant</th>
              <th className="px-4 py-3 text-left font-medium">Region</th>
              <th className="px-4 py-3 text-left font-medium">Billing Period</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const total = invoice.line_items.reduce((sum, item) => sum + item.total, 0)
              return (
                <tr
                  key={invoice.id}
                  className="border-b transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{invoice.invoice_no}</td>
                  <td className="px-4 py-3">{invoice.invoice_date}</td>
                  <td className="px-4 py-3">{invoice.consultant_name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{invoice.region}</Badge>
                  </td>
                  <td className="px-4 py-3">{invoice.billing_period}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {invoice.currency || 'USD'} {total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleView(invoice)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onExportPdf(invoice)}
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(invoice.id!)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Invoice {selectedInvoice?.invoice_no}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && <InvoicePreview invoice={selectedInvoice} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedInvoice) onExportPdf(selectedInvoice)
              }}
            >
              <Download className="mr-2 size-4" />
              Export PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
