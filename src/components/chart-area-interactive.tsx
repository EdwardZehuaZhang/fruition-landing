"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ~30 days of placeholder traffic data. Replace with Google Analytics later.
const CHART_DATA: { date: string; visitors: number; returning: number }[] = [
  { date: "2026-06-04", visitors: 312, returning: 118 },
  { date: "2026-06-05", visitors: 284, returning: 102 },
  { date: "2026-06-06", visitors: 201, returning: 88 },
  { date: "2026-06-07", visitors: 176, returning: 74 },
  { date: "2026-06-08", visitors: 298, returning: 121 },
  { date: "2026-06-09", visitors: 356, returning: 140 },
  { date: "2026-06-10", visitors: 388, returning: 152 },
  { date: "2026-06-11", visitors: 342, returning: 133 },
  { date: "2026-06-12", visitors: 401, returning: 168 },
  { date: "2026-06-13", visitors: 254, returning: 96 },
  { date: "2026-06-14", visitors: 231, returning: 90 },
  { date: "2026-06-15", visitors: 412, returning: 175 },
  { date: "2026-06-16", visitors: 445, returning: 190 },
  { date: "2026-06-17", visitors: 398, returning: 161 },
  { date: "2026-06-18", visitors: 372, returning: 149 },
  { date: "2026-06-19", visitors: 421, returning: 178 },
  { date: "2026-06-20", visitors: 268, returning: 104 },
  { date: "2026-06-21", visitors: 243, returning: 95 },
  { date: "2026-06-22", visitors: 456, returning: 198 },
  { date: "2026-06-23", visitors: 489, returning: 210 },
  { date: "2026-06-24", visitors: 434, returning: 182 },
  { date: "2026-06-25", visitors: 467, returning: 201 },
  { date: "2026-06-26", visitors: 502, returning: 223 },
  { date: "2026-06-27", visitors: 331, returning: 129 },
  { date: "2026-06-28", visitors: 289, returning: 112 },
  { date: "2026-06-29", visitors: 512, returning: 228 },
  { date: "2026-06-30", visitors: 534, returning: 241 },
  { date: "2026-07-01", visitors: 498, returning: 214 },
  { date: "2026-07-02", visitors: 521, returning: 232 },
  { date: "2026-07-03", visitors: 547, returning: 249 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--purple-primary)",
  },
  returning: {
    label: "Returning",
    color: "var(--color-chart-2, #a855f7)",
  },
} satisfies ChartConfig

type Range = "7d" | "30d"

export function ChartAreaInteractive() {
  const [range, setRange] = React.useState<Range>("30d")

  const data = React.useMemo(
    () => (range === "7d" ? CHART_DATA.slice(-7) : CHART_DATA),
    [range]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site traffic</CardTitle>
        <CardDescription>
          Placeholder visitor trend — wires to Google Analytics later.
        </CardDescription>
        <CardAction>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={range === "7d" ? "default" : "outline"}
              onClick={() => setRange("7d")}
            >
              7d
            </Button>
            <Button
              size="sm"
              variant={range === "30d" ? "default" : "outline"}
              onClick={() => setRange("30d")}
            >
              30d
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillReturning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-returning)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-returning)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value: string) =>
                new Date(value).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value as string).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="returning"
              type="natural"
              fill="url(#fillReturning)"
              stroke="var(--color-returning)"
              stackId="a"
            />
            <Area
              dataKey="visitors"
              type="natural"
              fill="url(#fillVisitors)"
              stroke="var(--color-visitors)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
