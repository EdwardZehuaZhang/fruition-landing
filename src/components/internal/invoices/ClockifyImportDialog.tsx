'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  REGION_ADDRESSES,
  REGIONS,
  CURRENCIES,
  generateMonthOptions,
  monthToBillingPeriod,
  getCurrentYearMonth,
} from '@/types/invoice'
import type { Invoice, LineItem, ConsultantProfile } from '@/types/invoice'
import InvoicePreview from './InvoicePreview'
import ClockifyDropzone from './ClockifyDropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const monthOptions = generateMonthOptions()

interface Props {
  profile?: ConsultantProfile | null
  onSave: (invoice: Invoice) => Promise<void>
}

export default function ClockifyImportDialog({ profile, onSave }: Props) {
  const [consultantName, setConsultantName] = useState(
    profile?.consultant_name || 'Edward (Zehua) Zhang'
  )
  const [region, setRegion] = useState(profile?.region || 'APAC')
  const [invoiceNo, setInvoiceNo] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [billingMonth, setBillingMonth] = useState(getCurrentYearMonth())
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [notes, setNotes] = useState('')
  const [currency, setCurrency] = useState(
    profile?.region === 'APAC' ? 'SGD' : 'USD'
  )
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const applyParsedReport = (parsed: LineItem[], parsedMonth: string) => {
    setLineItems(parsed)
    setBillingMonth(parsedMonth)
  }

  const updateLine =(index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems]
    if (field === 'projectName' || field === 'description') {
      (updated[index] as unknown as Record<string, unknown>)[field] = value
    } else {
      (updated[index] as unknown as Record<string, unknown>)[field] = Number(value)
    }
    if (field === 'hours' || field === 'rate') {
      updated[index].total =
        Math.round(updated[index].hours * updated[index].rate * 100) / 100
    }
    setLineItems(updated)
  }

  const removeLine = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const addManualLine = () => {
    setLineItems([
      ...lineItems,
      { projectId: null, projectName: '', description: '', hours: 0, rate: 40, total: 0 },
    ])
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-')
    return d + '/' + m + '/' + y
  }

  const buildInvoice = (): Invoice => ({
    invoice_no: invoiceNo,
    invoice_date: formatDate(invoiceDate),
    billing_month: billingMonth,
    billing_period: monthToBillingPeriod(billingMonth),
    consultant_name: consultantName,
    consultant_address: profile?.consultant_address || '',
    consultant_phone: profile?.consultant_phone || '',
    consultant_email: profile?.consultant_email || '',
    wise_name: profile?.wise_name || '',
    wise_tag: profile?.wise_tag || '',
    billing_address: REGION_ADDRESSES[region] || '',
    region,
    currency,
    line_items: lineItems,
    notes,
  })

  const handleSave = async () => {
    if (!consultantName || !region || lineItems.length === 0) {
      setSaveError('Fill in consultant, region, and at least one line item.')
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      await onSave(buildInvoice())
    } catch (error) {
      console.error('Save failed:', error)
      setSaveError(
        error instanceof Error ? error.message : 'Failed to save invoice.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = async () => {
    if (!consultantName || !region || lineItems.length === 0) {
      alert('Please fill in all required fields')
      return
    }
    // Lazy-load pdfmake client-side only — keeps it out of the edge Worker bundle.
    const { exportInvoiceToPDF } = await import('@/lib/invoicePdf')
    await exportInvoiceToPDF(buildInvoice())
  }

  const invoice = buildInvoice()
  const totalHours = lineItems.reduce((s, i) => s + (parseFloat(String(i.hours)) || 0), 0)
  const totalAmount = lineItems.reduce((s, i) => s + (i.total || 0), 0)

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold">Import from Clockify PDF</h2>
          <p className="text-sm text-muted-foreground">
            Upload a Clockify Summary report PDF to auto-fill line items
          </p>
        </div>

        <ClockifyDropzone onParsed={applyParsedReport} />

        {/* Consultant & Region */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Consultant Name
            </label>
            <Input
              value={consultantName}
              onChange={(e) => setConsultantName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Invoice meta */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Invoice No.
            </label>
            <Input
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Invoice Date
            </label>
            <Input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </div>
        </div>

        {/* Billing Month */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Billing Month
          </label>
          <select
            value={billingMonth}
            onChange={(e) => setBillingMonth(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Period: {monthToBillingPeriod(billingMonth)}
          </p>
        </div>

        {/* Line Items Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">
            Line Items {lineItems.length > 0 && `(${lineItems.length})`}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-md border bg-background px-2 py-1 text-xs"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Line Items */}
        <div className="flex flex-col gap-4">
          {lineItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border bg-muted/30 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <Input
                  placeholder="Project Name"
                  value={item.projectName}
                  onChange={(e) => updateLine(idx, 'projectName', e.target.value)}
                  className="font-medium"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeLine(idx)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
              <textarea
                placeholder="Sub-task descriptions..."
                value={item.description}
                onChange={(e) => updateLine(idx, 'description', e.target.value)}
                className="mb-3 w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
                rows={2}
              />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Hours
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.hours || ''}
                    onChange={(e) =>
                      updateLine(idx, 'hours', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Rate ({currency})
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.rate || ''}
                    onChange={(e) =>
                      updateLine(idx, 'rate', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Total
                  </label>
                  <Input value={item.total.toFixed(2)} readOnly className="bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addManualLine} type="button">
          <Plus className="mr-2 size-4" />
          Add Manual Line
        </Button>

        {/* Totals */}
        {lineItems.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              Total Hours: <strong>{totalHours.toFixed(2)}</strong>
            </p>
            <p className="text-sm font-bold text-purple-600">
              TOTAL {currency}: {totalAmount.toFixed(2)}
            </p>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Notes (optional)
          </label>
          <textarea
            placeholder="Additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
            rows={3}
          />
        </div>

        {saveError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{saveError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Invoice'}
          </Button>
          <Button variant="outline" onClick={handleExportPDF} type="button">
            Export to PDF
          </Button>
        </div>
      </div>

      <div className="hidden lg:block">
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  )
}
