export interface MethodPhase {
  number: string
  title: string
  description: string
}

export const METHOD_PHASES: MethodPhase[] = [
  {
    number: "Phase 01",
    title: "Discovery",
    description:
      "Stakeholder interviews, current-state map, and solution fit from our catalog.",
  },
  {
    number: "Phase 02",
    title: "Design",
    description:
      "Board architecture, column taxonomy, automations, and integration shape locked in writing.",
  },
  {
    number: "Phase 03",
    title: "Build",
    description:
      "Configure boards, dashboards, forms, docs, and connectors against the signed design.",
  },
  {
    number: "Phase 04",
    title: "Enablement",
    description:
      "Role-based training, runbooks, and admin certification so the system sticks after go-live.",
  },
  {
    number: "Phase 05",
    title: "Hypercare",
    description:
      "30-to-90 day adoption monitoring, tuning, and a clean hand-off to support or managed services.",
  },
]
