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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Billing Period</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const total = invoice.line_items.reduce((sum, item) => sum + item.total, 0)
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoice_no}</TableCell>
                  <TableCell>{invoice.invoice_date}</TableCell>
                  <TableCell>{invoice.consultant_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{invoice.region}</Badge>
                  </TableCell>
                  <TableCell>{invoice.billing_period}</TableCell>
                  <TableCell className="text-right font-medium">
                    {invoice.currency || 'USD'} {total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="View invoice"
                        onClick={() => handleView(invoice)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Export PDF"
                        onClick={() => onExportPdf(invoice)}
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete invoice"
                        onClick={() => handleDelete(invoice.id!)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
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
