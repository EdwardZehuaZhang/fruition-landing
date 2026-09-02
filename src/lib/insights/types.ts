/**
 * Shared shape for every insights tab.
 *
 * The UI is deliberately generic: one panel renders whatever metrics and ranked
 * sections it is handed, so a new tab (ads, email, …) is a data function rather
 * than another dashboard.
 *
 * The layout follows the convention every open-source analytics dashboard has
 * converged on — Plausible, Umami, PostHog all do this — a row of clickable
 * metric tiles carrying a delta against the previous period, one shared
 * time-series chart showing whichever tile is selected, then ranked lists with
 * an in-row proportional bar.
 */

export interface SeriesPoint {
  /** ISO date, YYYY-MM-DD. */
  date: string
  value: number
}

export type MetricFormat = "number" | "percent" | "decimal"

export interface InsightMetric {
  key: string
  label: string
  value: number
  /** Same metric over the immediately preceding window; null when unavailable. */
  previous: number | null
  format: MetricFormat
  /** Where the number comes from, shown under the tile. */
  caption?: string
  /** Daily values for the current window. Empty means "no chart for this one". */
  series: SeriesPoint[]
  /** True when a fall in this metric is the good outcome (e.g. search position). */
  lowerIsBetter?: boolean
}

export interface RankedItem {
  label: string
  sublabel?: string
  href?: string
  value: number
  /** Rendered to the right of the bar, e.g. "4.2% engagement". */
  secondary?: string
}

export interface RankedSection {
  title: string
  /** Unit for the primary value, e.g. "views". */
  unit: string
  items: RankedItem[]
  /** Shown when items is empty. */
  emptyLabel?: string
}

export interface InsightsView {
  metrics: InsightMetric[]
  sections: RankedSection[]
  /** Caveats worth stating in the UI rather than hiding (data lag, caps, setup). */
  notes: string[]
  /** False when the upstream source is not configured or unreachable. */
  available: boolean
  /** Explains what to do when `available` is false. */
  unavailableReason?: string
}
