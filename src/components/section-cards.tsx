import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface SectionCardsProps {
  totalVisitors?: string
  pageViews?: string
  conversions?: string
  searchClicks?: string
  /** True once GA4/GSC are connected - flips the caption from a hint to the range. */
  connected?: boolean
  rangeLabel?: string
}

export function SectionCards({
  totalVisitors = "-",
  pageViews = "-",
  conversions = "-",
  searchClicks = "-",
  connected = false,
  rangeLabel = "Last 28 days",
}: SectionCardsProps) {
  const metrics = [
    { label: "Total visitors", value: totalVisitors, source: "GA4" },
    { label: "Page views", value: pageViews, source: "GA4" },
    { label: "Conversions", value: conversions, source: "GA4" },
    { label: "Search clicks", value: searchClicks, source: "Search Console" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label}>
          <CardHeader>
            <CardDescription>{m.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-ink-heading">
              {m.value}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {connected ? `${rangeLabel} · ${m.source}` : `Connect ${m.source} to populate`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
