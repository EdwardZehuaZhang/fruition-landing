import type { Metadata } from "next"
import { buildOgMetadata } from "@/lib/metadata"
import AiBlueprintClient from "./AiBlueprintClient"

const TITLE = "Free AI Readiness Blueprint | 12-Question Self-Assessment | Fruition"
const DESCRIPTION =
  "Answer 12 questions and get an instant AI & work-platform blueprint: readiness scores across 8 dimensions, a recommended stack, a phased build plan and an indicative investment. Free, no obligation."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ai-readiness-blueprint" },
  ...buildOgMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/ai-readiness-blueprint",
  }),
}

export default function Page() {
  return <AiBlueprintClient />
}
