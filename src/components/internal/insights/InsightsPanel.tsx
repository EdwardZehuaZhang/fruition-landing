"use client"

import { useState, type ReactNode } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingDown, TrendingUp } from "lucide-react"
import type { InsightMetric, InsightsView } from "@/lib/insights/types"
import RankedList from "./RankedList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const nf = new Intl.NumberFormat()

function formatValue(metric: InsightMetric): string {
  if (metric.format === "percent") return `${metric.value.toFixed(1)}%`
  if (metric.format === "decimal") return metric.value.toFixed(1)
  return nf.format(Math.round(metric.value))
}

/** Percentage change, or null when there is no usable baseline. */
function delta(metric: InsightMetric): number | null {
  if (metric.previous == null) return null
  if (metric.previous === 0) return metric.value === 0 ? 0 : null
  return ((metric.value - metric.previous) / metric.previous) * 100
}

function DeltaChip({ metric }: { metric: InsightMetric }) {
  const change = delta(metric)
  if (change == null) {
    return <span className="text-xs text-muted-foreground">no prior period</span>
  }
  const rising = change > 0
  // Colour by whether the movement is good, not by its direction: a falling
  // search position is an improvement.
  const good = metric.lowerIsBetter ? !rising : rising
  const flat = Math.abs(change) < 0.05
  const Icon = rising ? TrendingUp : TrendingDown

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        flat ? "text-muted-foreground" : good ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {flat ? null : <Icon className="size-3.5" aria-hidden />}
      {flat ? "no change" : `${rising ? "+" : ""}${change.toFixed(0)}%`}
      <span className="font-normal text-muted-foreground">vs prev</span>
    </span>
  )
}

function formatDay(date: string): string {
  try {
    return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    })
  } catch {
    return date
  }
}

/**
 * The shared insights surface: a row of clickable metric tiles, one chart
 * showing whichever tile is selected, then ranked breakdowns.
 *
 * Modelled on the layout Plausible, Umami and PostHog have all converged on.
 * Selecting the charted series from the tiles keeps one chart on the page
 * instead of a wall of small ones, which is what makes those dashboards
 * readable.
 */
export default function InsightsPanel({
  view,
  rangeLabel,
  children,
}: {
  view: InsightsView
  rangeLabel: string
  children?: ReactNode
}) {
  const chartable = view.metrics.filter((m) => m.series.length > 0)
  const [selectedKey, setSelectedKey] = useState(chartable[0]?.key ?? "")
  const selected = chartable.find((m) => m.key === selectedKey) ?? chartable[0]

  if (!view.available) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">
            {view.unavailableReason ?? "This data source is not available."}
          </p>
        </CardContent>
      </Card>
    )
  }

  const chartConfig: ChartConfig = {
    value: { label: selected?.label ?? "Value", color: "var(--chart-1)" },
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
        {view.metrics.map((metric) => {
          const active = metric.key === selected?.key
          const selectable = metric.series.length > 0
          return (
            <button
              key={metric.key}
              type="button"
              aria-pressed={active}
              disabled={!selectable}
              onClick={() => setSelectedKey(metric.key)}
              className={`rounded-card border p-4 text-left transition ${
                active ? "border-primary bg-primary/5" : "border-ui bg-surface"
              } ${selectable ? "cursor-pointer hover:border-primary/60" : "cursor-default"}`}
            >
              <span className="block text-xs font-medium text-muted-foreground">{metric.label}</span>
              <span className="mt-1 block text-2xl font-semibold tabular-nums text-ink-heading">
                {formatValue(metric)}
              </span>
              <span className="mt-1 block">
                <DeltaChip metric={metric} />
              </span>
              {metric.caption ? (
                <span className="mt-1 block text-xs text-muted-foreground">{metric.caption}</span>
              ) : null}
            </button>
          )
        })}
      </div>

      {selected && selected.series.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-ink-heading">
              {selected.label} · {rangeLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <AreaChart data={selected.series} margin={{ left: 4, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="insightsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={formatDay}
                />
                <YAxis tickLine={false} axisLine={false} width={40} tickMargin={4} />
                <ChartTooltip
                  content={<ChartTooltipContent labelFormatter={(l) => formatDay(String(l))} />}
                />
                <Area
                  dataKey="value"
                  type="monotone"
                  stroke="var(--color-value)"
                  fill="url(#insightsFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}

      {view.notes.length > 0 ? (
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            {view.notes.map((note) => (
              <p key={note} className="text-sm text-muted-foreground">
                {note}
              </p>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {children}

      {view.sections.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {view.sections.map((section) => (
            <Card key={section.title}>
              <CardContent className="py-4">
                <RankedList section={section} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
