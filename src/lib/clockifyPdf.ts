/**
 * Clockify Summary report (PDF) → billable projects.
 *
 * Browser-only: pdfjs-dist is dynamically imported so it never lands in the
 * Cloudflare Worker bundle. The worker script is served from public/ (copied
 * there by scripts/copy-pdf-worker.mjs) — pdfjs v4+ hard-fails without a real
 * worker URL, and a static asset avoids every bundler edge case.
 *
 * A Summary report has three sections, all of which use the same
 * `<label>  <H:MM>  <percent>` shape, which is why order matters here:
 *
 *   Project              one row per project — THIS is what we bill
 *   Description          the same time sliced by task, flat across projects
 *   Project / Description  the same time again, grouped project → tasks
 *
 * Reading rows indiscriminately triple-counts the month. We take the hours
 * from `Project` and the descriptions from `Project / Description`.
 */
import { getCurrentYearMonth } from '@/types/invoice'

/** Served from public/pdf.worker.min.mjs — kept in lockstep by postinstall. */
const WORKER_SRC = '/pdf.worker.min.mjs'

/** A project row: hours only. The rate lives on the invoice, not the line. */
export interface ParsedProject {
  name: string
  description: string
  hours: number
}

export interface ParsedClockifyReport {
  projects: ParsedProject[]
  /** YYYY-MM taken from the report's date range, the filename, or today. */
  billingMonth: string
  /** `Total:` as printed on the report — lets the caller sanity-check the sum. */
  reportedHours: number | null
}

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

function hoursFromDuration(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return Math.round((h + m / 60) * 100) / 100
}

/**
 * Clockify labels each project `<project> - <client>`. When the client is named
 * after the project that reads as "Foo - Foo" on the invoice, so collapse the
 * exact duplicate. Genuinely different clients are left intact.
 */
function cleanProjectName(raw: string): string {
  const parts = raw.split(' - ')
  if (parts.length === 2 && parts[0].trim() === parts[1].trim()) {
    return parts[0].trim()
  }
  return raw.trim()
}

type Section = 'none' | 'projects' | 'descriptions' | 'byProject'

/** `<label>  <H:MM>  <percent>` — the summary sections. */
const ROW_WITH_PERCENT = /^(.+?)\s{2,}(\d+:\d{2})\s+[\d.]+\s*%$/
/** `<label>  <H:MM>` — the project→task breakdown. */
const ROW_WITH_DURATION = /^(.+?)\s{2,}(\d+:\d{2})$/

function detectSection(line: string): Section | null {
  if (/^Project\s*\/\s*Description\b/i.test(line)) return 'byProject'
  if (/^Project(\s{2,}Duration)?$/i.test(line)) return 'projects'
  if (/^Description(\s{2,}Duration)?$/i.test(line)) return 'descriptions'
  return null
}

function parseClockifyLines(lines: string[]): ParsedProject[] {
  const order: string[] = []
  const byRawName = new Map<string, { name: string; hours: number; tasks: string[] }>()
  let section: Section = 'none'
  let current: { name: string; hours: number; tasks: string[] } | null = null

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    const next = detectSection(line)
    if (next) {
      section = next
      current = null
      continue
    }

    if (section === 'projects') {
      const m = line.match(ROW_WITH_PERCENT)
      if (!m) continue
      const rawName = m[1].trim()
      if (/^(Project|Duration|Total)$/i.test(rawName)) continue
      if (!byRawName.has(rawName)) {
        order.push(rawName)
        byRawName.set(rawName, {
          name: cleanProjectName(rawName),
          hours: hoursFromDuration(m[2]),
          tasks: [],
        })
      }
      continue
    }

    if (section === 'byProject') {
      const m = line.match(ROW_WITH_DURATION)
      if (m) {
        const label = m[1].trim()
        // Project headers and task rows share a shape; the project names we
        // already collected are what tells them apart.
        const project = byRawName.get(label)
        if (project) {
          current = project
          continue
        }
        if (current && !/^(Project|Duration|Total)$/i.test(label)) {
          current.tasks.push(label)
        }
        continue
      }
      // No duration: a wrapped continuation of the task above it.
      if (current && current.tasks.length > 0 && !/^Fruition\s+\d+$/.test(line)) {
        current.tasks[current.tasks.length - 1] += ' ' + line
      }
      continue
    }
    // 'descriptions' and 'none' carry no billable rows of their own.
  }

  return order
    .map((rawName) => byRawName.get(rawName)!)
    .filter((p) => p.hours > 0)
    .map((p) => ({
      name: p.name,
      description: p.tasks.join('\n'),
      hours: p.hours,
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

function extractReportedHours(lines: string[]): number | null {
  for (const line of lines) {
    const m = line.trim().match(/^Total:\s+(\d+:\d{2})$/i)
    if (m) return hoursFromDuration(m[1])
  }
  return null
}

/**
 * Parses a Clockify Summary report. Throws if the file isn't a readable PDF;
 * returns an empty `projects` array if it parses but holds no billable rows.
 */
export async function parseClockifyPdf(file: File): Promise<ParsedClockifyReport> {
  const lines = await extractPdfLines(file)
  return {
    projects: parseClockifyLines(lines),
    billingMonth: extractBillingMonth(lines, file.name),
    reportedHours: extractReportedHours(lines),
  }
}
