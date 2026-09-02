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

export interface TrafficPoint {
  /** ISO date, YYYY-MM-DD. */
  date: string
  visitors: number
}

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--purple-primary)",
  },
} satisfies ChartConfig

type Range = "7d" | "30d"

/**
 * Site visitor trend. `data` is GA4's daily totals, passed in by the dashboard —
 * this used to render a hardcoded placeholder series, which meant the internal
 * dashboard showed invented traffic numbers to staff.
 */
export function ChartAreaInteractive({ data = [] }: { data?: TrafficPoint[] }) {
  const [range, setRange] = React.useState<Range>("30d")

  const points = React.useMemo(
    () => (range === "7d" ? data.slice(-7) : data.slice(-30)),
    [data, range]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site traffic</CardTitle>
        <CardDescription>
          {data.length > 0
            ? "Daily visitors across the whole site, from GA4."
            : "Not connected — set GOOGLE_SA_KEY_B64 and GA4_PROPERTY_ID."}
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
        {points.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No traffic data yet.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
            <AreaChart data={points} margin={{ left: 12, right: 12 }}>
              <defs>
                <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.1} />
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
                  new Date(`${value}T00:00:00Z`).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(`${String(value)}T00:00:00Z`).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })
                    }
                  />
                }
              />
              <Area
                dataKey="visitors"
                type="monotone"
                stroke="var(--color-visitors)"
                fill="url(#fillVisitors)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
