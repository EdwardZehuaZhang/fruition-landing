'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import type { Invoice, LineItem, ConsultantProfile } from '@/types/invoice'
import {
  REGION_ADDRESSES,
  REGIONS,
  CURRENCIES,
  generateMonthOptions,
  monthToBillingPeriod,
  getCurrentYearMonth,
} from '@/types/invoice'
import InvoicePreview from './InvoicePreview'
import ProjectSelector from './ProjectSelector'
import LineItemRow from './LineItemRow'
import ClockifyDropzone from './ClockifyDropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const monthOptions = generateMonthOptions()

interface Props {
  /** Pre-fetched consultant profile from Supabase. */
  profile?: ConsultantProfile | null
  /** Called after successful save. */
  onSave: (invoice: Invoice) => Promise<void>
}

const DEFAULT_PROFILE: ConsultantProfile = {
  consultant_name: 'Edward (Zehua) Zhang',
  consultant_address: '',
  consultant_phone: '',
  consultant_email: '',
  wise_name: '',
  wise_tag: '',
  region: 'APAC',
}

export default function InvoiceForm({ profile, onSave }: Props) {
  const [consultantName, setConsultantName] = useState(
    profile?.consultant_name || DEFAULT_PROFILE.consultant_name
  )
  const [consultantAddress, setConsultantAddress] = useState(
    profile?.consultant_address || ''
  )
  const [consultantPhone, setConsultantPhone] = useState(
    profile?.consultant_phone || ''
  )
  const [consultantEmail, setConsultantEmail] = useState(
    profile?.consultant_email || ''
  )
  const [wiseName, setWiseName] = useState(profile?.wise_name || '')
  const [wiseTag, setWiseTag] = useState(profile?.wise_tag || '')
  const [region, setRegion] = useState(profile?.region || 'APAC')
  const [invoiceNo, setInvoiceNo] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [billingMonth, setBillingMonth] = useState(getCurrentYearMonth())
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [notes, setNotes] = useState('')
  const [selectedProjects, setSelectedProjects] = useState<
    { id: string; name: string; companyName?: string }[]
  >([])
  const [currency, setCurrency] = useState(profile?.region === 'APAC' ? 'SGD' : 'USD')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Update state when profile prop changes
  useEffect(() => {
    if (profile) {
      setConsultantName(profile.consultant_name || DEFAULT_PROFILE.consultant_name)
      setConsultantAddress(profile.consultant_address || '')
      setConsultantPhone(profile.consultant_phone || '')
      setConsultantEmail(profile.consultant_email || '')
      setWiseName(profile.wise_name || '')
      setWiseTag(profile.wise_tag || '')
      setRegion(profile.region || 'APAC')
    }
  }, [profile])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return day + '/' + month + '/' + year
  }

  const buildInvoice = (): Invoice => ({
    invoice_no: invoiceNo,
    invoice_date: formatDate(invoiceDate),
    billing_month: billingMonth,
    billing_period: monthToBillingPeriod(billingMonth),
    consultant_name: consultantName,
    consultant_address: consultantAddress,
    consultant_phone: consultantPhone,
    consultant_email: consultantEmail,
    wise_name: wiseName,
    wise_tag: wiseTag,
    billing_address: REGION_ADDRESSES[region] || '',
    region,
    currency,
    line_items: lineItems,
    notes,
  })

  const addProjectLine = (project: { id: string; name: string; companyName?: string }) => {
    setSelectedProjects([...selectedProjects, project])
    setLineItems([
      ...lineItems,
      {
        projectId: project.id,
        projectName: project.name,
        description: '',
        hours: 0,
        rate: 0,
        total: 0,
      },
    ])
  }

  const addManualLine = () => {
    setLineItems([
      ...lineItems,
      {
        projectId: null,
        projectName: '',
        description: '',
        hours: 0,
        rate: 0,
        total: 0,
      },
    ])
  }

  // A parsed Clockify report replaces the line items outright — re-uploading a
  // corrected export should not stack duplicates on top of the previous run.
  const applyParsedReport = (parsed: LineItem[], parsedMonth: string) => {
    setLineItems(parsed)
    setSelectedProjects([])
    setBillingMonth(parsedMonth)
  }

  const removeLine = (index: number) => {
    const item = lineItems[index]
    if (item.projectId) {
      setSelectedProjects(selectedProjects.filter((p) => p.id !== item.projectId))
    }
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const updateLine = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems]
    if (field === 'projectName' || field === 'description') {
      (updated[index] as unknown as Record<string, unknown>)[field] = value
    } else {
      (updated[index] as unknown as Record<string, unknown>)[field] = Number(value)
    }
    if (field === 'hours' || field === 'rate') {
      updated[index].total = updated[index].hours * updated[index].rate
    }
    setLineItems(updated)
  }

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
      // Show what actually went wrong — a swallowed "Failed to save invoice"
      // hid a missing Supabase table for weeks.
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

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        {/* Clockify upload — the default way in; everything below is editable
            afterwards, and stays usable if you'd rather key an invoice by hand. */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Upload Clockify report
          </label>
          <ClockifyDropzone onParsed={applyParsedReport} />
        </div>

        {/* Consultant & Region */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Consultant Name
            </label>
            <Input
              placeholder="Enter consultant name"
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
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address / Phone / Email */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Consultant Address
            </label>
            <textarea
              placeholder="Enter full address"
              value={consultantAddress}
              onChange={(e) => setConsultantAddress(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Phone</label>
              <Input
                placeholder="+1 234 567 8900"
                value={consultantPhone}
                onChange={(e) => setConsultantPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="consultant@example.com"
                value={consultantEmail}
                onChange={(e) => setConsultantEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Wise */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Wise Account Name
            </label>
            <Input
              placeholder="Account holder name"
              value={wiseName}
              onChange={(e) => setWiseName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Wisetag</label>
            <Input
              placeholder="@wisetag"
              value={wiseTag}
              onChange={(e) => setWiseTag(e.target.value)}
            />
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

        {/* Project Selector */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Add from Clockify
          </label>
          <ProjectSelector
            region={region}
            onSelect={addProjectLine}
            selectedProjects={selectedProjects}
          />
        </div>

        {/* Line Items Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Line Items</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-md border bg-background px-2 py-1 text-xs"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Line Items */}
        <div className="flex flex-col gap-4">
          {lineItems.map((item, idx) => (
            <LineItemRow
              key={idx}
              item={item}
              index={idx}
              currency={currency}
              onChange={updateLine}
              onRemove={removeLine}
            />
          ))}
        </div>

        <Button variant="outline" onClick={addManualLine} type="button">
          <Plus className="mr-2 size-4" />
          Add Manual Line
        </Button>

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
