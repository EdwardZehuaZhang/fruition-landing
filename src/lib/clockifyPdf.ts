/**
 * Clockify Summary report (PDF) → invoice line items.
 *
 * Browser-only: pdfjs-dist is dynamically imported so it never lands in the
 * Cloudflare Worker bundle. The worker script is served from public/ (copied
 * there by scripts/copy-pdf-worker.mjs) — pdfjs v4+ hard-fails without a real
 * worker URL, and a static asset avoids every bundler edge case.
 *
 * Shared by the New Invoice form and the standalone Clockify import page.
 */
import type { LineItem } from '@/types/invoice'
import { getCurrentYearMonth } from '@/types/invoice'

/** Served from public/pdf.worker.min.mjs — kept in lockstep by postinstall. */
const WORKER_SRC = '/pdf.worker.min.mjs'

/** Rate applied to freshly-parsed rows; editable per line afterwards. */
export const DEFAULT_PARSED_RATE = 40

async function extractPdfLines(file: File): Promise<string[]> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const allLines: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // Rebuild visual lines: group text items by their y position, then read
    // each row left-to-right. Two spaces stand in for the column gap.
    const itemsByY: Record<number, { x: number; str: string }[]> = {}
    for (const item of content.items) {
      if (!('str' in item) || !item.str.trim()) continue
      const transform = (item as unknown as { transform: number[] }).transform
      const y = Math.round(transform?.[5] ?? 0)
      if (!itemsByY[y]) itemsByY[y] = []
      itemsByY[y].push({ x: transform?.[4] ?? 0, str: item.str })
    }

    const sortedYs = Object.keys(itemsByY)
      .map(Number)
      .sort((a, b) => b - a)
    for (const y of sortedYs) {
      const items = itemsByY[y].sort((a, b) => a.x - b.x)
      allLines.push(items.map((it) => it.str).join('  '))
    }
  }

  return allLines
}

function parseClockifyLines(lines: string[], rate: number): LineItem[] {
  const projects: { name: string; hours: number; subTasks: string[] }[] = []
  let currentProject: { name: string; hours: number; subTasks: string[] } | null = null
  let inDetailSection = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    if (/^Project\s*\/\s*Description/i.test(line)) {
      inDetailSection = true
      currentProject = null
      continue
    }

    if (inDetailSection) {
      const existingProject = projects.find((p) => line.startsWith(p.name))
      if (existingProject) {
        currentProject = existingProject
        continue
      }
      if (currentProject) {
        const subMatch = line.match(/^(.+?)\s{2,}(\d+:\d+)\s*$/)
        if (subMatch) {
          const subName = subMatch[1].trim()
          if (
            subName &&
            subName !== currentProject.name &&
            subName !== 'Total' &&
            subName !== 'Project' &&
            subName !== 'Duration'
          ) {
            currentProject.subTasks.push(subName)
          }
        }
      }
      continue
    }

    const projectMatch = line.match(/^(.+?)\s{2,}(\d+:\d+)\s+[\d.]+\s*%/)
    if (projectMatch) {
      const name = projectMatch[1].trim()
      if (name === 'Project' || name === 'Duration' || name === 'Total') continue
      const timeParts = projectMatch[2].split(':').map(Number)
      const hours = timeParts[0] + timeParts[1] / 60
      currentProject = { name, hours: Math.round(hours * 100) / 100, subTasks: [] }
      projects.push(currentProject)
    }
  }

  return projects.map((p) => ({
    projectId: null,
    projectName: p.name,
    description: p.subTasks.join(', '),
    hours: p.hours,
    rate,
    total: Math.round(p.hours * rate * 100) / 100,
  }))
}

function extractBillingMonth(lines: string[], filename?: string): string {
  const fullText = lines.join(' ')
  const dateRangeMatch = fullText.match(
    /(\d{2})\/(\d{2})\/(\d{4})\s*[-–]\s*\d{2}\/\d{2}\/\d{4}/
  )
  if (dateRangeMatch) {
    return dateRangeMatch[3] + '-' + dateRangeMatch[2]
  }
  if (filename) {
    const fnMatch = filename.match(/(\d{4})[-_](\d{2})/)
    if (fnMatch) return fnMatch[1] + '-' + fnMatch[2]
  }
  return getCurrentYearMonth()
}

export interface ParsedClockifyReport {
  lineItems: LineItem[]
  /** YYYY-MM taken from the report's date range, the filename, or today. */
  billingMonth: string
}

/**
 * Parses a Clockify Summary report. Throws if the file isn't a readable PDF;
 * returns an empty `lineItems` array if it parses but holds no billable rows.
 */
export async function parseClockifyPdf(
  file: File,
  rate: number = DEFAULT_PARSED_RATE
): Promise<ParsedClockifyReport> {
  const lines = await extractPdfLines(file)
  return {
    lineItems: parseClockifyLines(lines, rate),
    billingMonth: extractBillingMonth(lines, file.name),
  }
}
