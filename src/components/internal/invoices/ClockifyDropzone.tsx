'use client'

import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { parseClockifyPdf } from '@/lib/clockifyPdf'
import type { LineItem } from '@/types/invoice'

interface Props {
  /** Called with the parsed rows and the billing month read off the report. */
  onParsed: (lineItems: LineItem[], billingMonth: string) => void
}

/**
 * Drop/click target that turns a Clockify Summary PDF into invoice line items.
 * Owns its own parse + error state so the surrounding form stays dumb.
 */
export default function ClockifyDropzone({ onParsed }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [parsedCount, setParsedCount] = useState<number | null>(null)

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setParseError('Please upload a PDF file.')
      return
    }
    setParsing(true)
    setParseError('')
    setParsedCount(null)
    try {
      const { lineItems, billingMonth } = await parseClockifyPdf(file)
      if (lineItems.length === 0) {
        setParseError(
          'No billable projects found in this PDF. Make sure it is a Clockify Summary report.'
        )
        return
      }
      setParsedCount(lineItems.length)
      onParsed(lineItems, billingMonth)
    } catch (err) {
      console.error('PDF parse error:', err)
      setParseError(
        'Failed to parse PDF: ' + (err instanceof Error ? err.message : 'Unknown error')
      )
    } finally {
      setParsing(false)
    }
  }

  const [dragOver, setDragOver] = useState(false)

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
            Clockify Summary report (.pdf) — fills the line items below
          </p>
          {parsedCount !== null && (
            <p className="text-xs font-semibold text-green-600">
              ✓ Parsed {parsedCount} billable project{parsedCount === 1 ? '' : 's'}
            </p>
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

      {parseError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{parseError}</p>
        </div>
      )}
    </div>
  )
}
