'use client'

import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { parseClockifyPdf, type ParsedProject } from '@/lib/clockifyPdf'

interface Props {
  /** Called with the projects and the billing month read off the report. */
  onParsed: (projects: ParsedProject[], billingMonth: string) => void
}

/**
 * Drop/click target that turns a Clockify Summary PDF into billable projects.
 * Owns its own parse + error state so the surrounding form stays dumb.
 */
export default function ClockifyDropzone({ onParsed }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [summary, setSummary] = useState('')
  const [warning, setWarning] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setParseError('Please upload a PDF file.')
      return
    }
    setParsing(true)
    setParseError('')
    setSummary('')
    setWarning('')
    try {
      const { projects, billingMonth, reportedHours, reportType } =
        await parseClockifyPdf(file)
      if (projects.length === 0) {
        setParseError(
          'No billable projects found in this PDF. Export a Summary or Detailed ' +
            'report from Clockify (Reports → Summary or Detailed → Export → PDF).'
        )
        return
      }

      const hours = projects.reduce((sum, p) => sum + p.hours, 0)
      setSummary(
        `Parsed ${projects.length} project${projects.length === 1 ? '' : 's'}, ` +
          `${hours.toFixed(2)} hours from the ${reportType} report`
      )
      // The report prints its own total; if ours disagrees the sections were
      // read wrong and the invoice would be over- or under-billed.
      if (reportedHours !== null && Math.abs(reportedHours - hours) > 0.02) {
        setWarning(
          `Parsed ${hours.toFixed(2)} hours but the report totals ` +
            `${reportedHours.toFixed(2)}. Check the line items before saving.`
        )
      }
      onParsed(projects, billingMonth)
    } catch (err) {
      console.error('PDF parse error:', err)
      setParseError(
        'Failed to parse PDF: ' + (err instanceof Error ? err.message : 'Unknown error')
      )
    } finally {
      setParsing(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a Clockify Summary report PDF"
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 bg-muted/30'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <Upload
            className={`size-8 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`}
          />
          <p className="font-medium">
            {parsing ? 'Parsing PDF…' : 'Drop Clockify PDF here or click to upload'}
          </p>
          <p className="text-xs text-muted-foreground">
            Clockify Summary or Detailed report (.pdf) — fills the line items below
          </p>
          {summary && (
            <p className="text-xs font-semibold text-green-600">✓ {summary}</p>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          // Allow re-uploading the same file after a failed parse.
          e.target.value = ''
        }}
      />

      {warning && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-sm text-amber-700 dark:text-amber-400">{warning}</p>
        </div>
      )}

      {parseError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{parseError}</p>
        </div>
      )}
    </div>
  )
}
