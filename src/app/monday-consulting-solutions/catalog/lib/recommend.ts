import { SOLUTIONS, type Solution } from "../data/solutions"
import {
  GOAL_KEYWORDS,
  GOAL_MAP,
  INDUSTRY_MAP,
  STEPS,
  type AdvisorAnswers,
} from "../data/advisor-config"

export type PickKind = "primary" | "adjacent" | "service"

export interface Pick {
  sol: Solution
  kind: PickKind
}

function score(sol: Solution, ans: AdvisorAnswers): number {
  let s = 0
  const ind = ans.industry ? INDUSTRY_MAP[ans.industry] : null
  if (ind && (sol.industries || []).includes(ind as Solution["industries"][number])) s += 5
  if (typeof ans.goal === "string" && GOAL_MAP[ans.goal]?.includes(sol.key)) s += 4
  if (typeof ans.goal === "string" && !GOAL_MAP[ans.goal]) {
    for (const [rx, keys] of GOAL_KEYWORDS) {
      if (rx.test(ans.goal) && keys.includes(sol.key)) {
        s += 4
        break
      }
    }
  }
  if (sol.enriched) s += 1
  return s
}

export function recommend(ans: AdvisorAnswers): Pick[] {
  const ranked = SOLUTIONS.map((sol) => ({ sol, s: score(sol, ans) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)

  const picks: Pick[] = []
  const pushed = new Set<string>()
  function add(key: string, kind: PickKind) {
    if (pushed.has(key)) return
    const sol = SOLUTIONS.find((s) => s.key === key)
    if (!sol) return
    picks.push({ sol, kind })
    pushed.add(key)
  }

  ranked.slice(0, 2).forEach((r) => add(r.sol.key, picks.length === 0 ? "primary" : "adjacent"))

  if (ans.industry === "construction" && picks.length && !pushed.has("dream-crm")) {
    add("dream-crm", "adjacent")
  }
  const primaryType = picks[0]?.sol.productType
  if (primaryType === "crm" && ranked.length > 1) {
    const wmOption = ranked.find((r) => r.sol.productType === "wm" && !pushed.has(r.sol.key))
    if (wmOption) add(wmOption.sol.key, "adjacent")
  }

  const current = ans.current
  const needsMigration =
    current && ["salesforce", "hubspot", "procore", "spreadsheets", "another"].includes(current)
  if (needsMigration && !pushed.has("migration") && picks.length < 4) add("migration", "service")
  if ((current === "greenfield" || current === null) && !pushed.has("training") && picks.length < 4) {
    add("training", "service")
  }

  const ints = Array.isArray(ans.integrations)
    ? ans.integrations.filter((x) => x && x.toLowerCase() !== "none for now")
    : []
  if (ints.length && !pushed.has("integrations") && picks.length < 4) add("integrations", "service")

  return picks.slice(0, 4)
}

export function summarize(ans: AdvisorAnswers): string {
  const bits: string[] = []
  const indName = STEPS[0].chips.find((c) => c[0] === ans.industry)?.[1]
  if (indName && ans.industry !== "other") bits.push(`You are in **${indName}**`)
  if (typeof ans.goal === "string" && ans.goal) {
    const goalChip = STEPS[1].chips.find((c) => c[0] === ans.goal)
    const goalStr = goalChip ? goalChip[1] : ans.goal
    bits.push(`focused on **${goalStr}**`)
  }
  if (ans.current) {
    const cur = STEPS[2].chips.find((c) => c[0] === ans.current)?.[1]
    if (cur) bits.push(`currently ${cur.toLowerCase()}`)
  }
  if (ans.size) {
    const sz = STEPS[3].chips.find((c) => c[0] === ans.size)?.[1]
    if (sz) bits.push(`team size **${sz}**`)
  }
  if (Array.isArray(ans.integrations) && ans.integrations.length) {
    const clean = ans.integrations.filter((x) => x.toLowerCase() !== "none for now")
    if (clean.length) bits.push(`integrations: ${clean.join(", ")}`)
  }
  if (ans.timeline) {
    const tl = STEPS[5].chips.find((c) => c[0] === ans.timeline)?.[1]
    if (tl) bits.push(`timeline: ${tl.toLowerCase()}`)
  }
  return bits.length ? bits.join(". ") + "." : "Based on what you shared:"
}

export function reasonFor(sol: Solution, kind: PickKind, ans: AdvisorAnswers): string {
  const indName = STEPS[0].chips.find((c) => c[0] === ans.industry)?.[1]
  if (kind === "primary") {
    return `Direct fit for your ${indName ? indName.toLowerCase() + " " : ""}workflow.`
  }
  if (kind === "adjacent") {
    return "Strong adjacent layer. Most of our clients bundle this with the primary build."
  }
  if (kind === "service") {
    if (sol.key === "migration")
      return "You are moving off another tool. This is our data-migration service."
    if (sol.key === "training")
      return "You are new to monday.com. This is our user-training and enablement service."
    if (sol.key === "integrations")
      return "You listed required integrations. This is the connector suite that delivers them."
  }
  return "Recommended based on your inputs."
}
