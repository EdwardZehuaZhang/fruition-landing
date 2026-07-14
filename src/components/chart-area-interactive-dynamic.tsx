"use client"

import dynamic from "next/dynamic"

// Load the recharts-backed chart client-side only. The chart renders in the
// browser anyway, and this keeps recharts (~hundreds of KB) out of the
// Cloudflare edge Worker server bundle (10 MiB limit). Used by the internal
// analytics dashboard.
export const ChartAreaInteractive = dynamic(
  () => import("./chart-area-interactive").then((m) => m.ChartAreaInteractive),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-auto h-[250px] w-full animate-pulse rounded-lg bg-black/5" />
    ),
  },
)
