// Screens inbound website form submissions so vendor pitches and spam never
// pollute the regional CRM boards. Same OpenRouter setup as claudeClient.ts
// (one account, model swappable via env without touching code).
//
// Fail-open by design: any error, timeout, or unparseable reply classifies as
// "lead" — a junk item in the CRM beats a lost prospect.

export type EnquiryCategory = "lead" | "vendor_pitch" | "spam" | "job_application" | "other"

export interface LeadVerdict {
  category: EnquiryCategory
  reason: string
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const MODEL = process.env.LEAD_CLASSIFIER_MODEL ?? "anthropic/claude-haiku-4.5"
const TIMEOUT_MS = 10_000

const CATEGORIES: ReadonlySet<string> = new Set([
  "lead",
  "vendor_pitch",
  "spam",
  "job_application",
  "other",
])

const SYSTEM_PROMPT = `You screen contact-form submissions for Fruition Services, a monday.com consulting and workflow-automation agency. Classify each submission:

- "lead": a potential CLIENT — anyone who might pay Fruition for consulting, implementation, training, licenses, or automation work. When in doubt, choose "lead".
- "vendor_pitch": someone selling TO Fruition — dev/SEO/marketing/VA/outsourcing services, link building, tools, or "partnerships" where Fruition would be the buyer.
- "spam": fake or malicious submissions — lookalike domains, generated/mismatched names, phishing patterns (e.g. a famous brand "selecting agency partners"), gibberish.
- "job_application": someone seeking employment or freelance work AT Fruition.
- "other": genuine but not a sales opportunity — press, events, existing-client support.

Reply with ONLY a JSON object, no prose: {"category":"...","reason":"<one short sentence>"}`

export interface ClassifyInput {
  name?: string
  email?: string
  company?: string
  source?: string
  fields?: Record<string, string>
}

export async function classifyLead(input: ClassifyInput): Promise<LeadVerdict> {
  const fallback: LeadVerdict = { category: "lead", reason: "Classifier unavailable — defaulted to lead" }
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.warn("[leadClassify] OPENROUTER_API_KEY missing — skipping classification")
    return fallback
  }

  const lines = [`Form: ${input.source ?? "unknown"}`, `Name: ${input.name ?? ""}`, `Email: ${input.email ?? ""}`]
  if (input.company) lines.push(`Company: ${input.company}`)
  for (const [k, v] of Object.entries(input.fields ?? {})) {
    if (v && String(v).trim()) lines.push(`${k}: ${v}`)
  }

  try {
    const r = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://fruitionservices.io",
        "X-Title": "Fruition Lead Classifier",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 150,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: lines.join("\n").slice(0, 6000) },
        ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    const parsed = (await r.json()) as {
      choices?: { message?: { content?: string | null } }[]
      error?: { message?: string }
    }
    if (!r.ok || parsed.error) {
      console.warn(`[leadClassify] OpenRouter failed: ${parsed.error?.message ?? `HTTP ${r.status}`}`)
      return fallback
    }
    const content = (parsed.choices?.[0]?.message?.content ?? "").trim()
    // Models occasionally wrap JSON in code fences despite instructions.
    const json = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
    const verdict = JSON.parse(json) as { category?: string; reason?: string }
    if (!verdict.category || !CATEGORIES.has(verdict.category)) return fallback
    return {
      category: verdict.category as EnquiryCategory,
      reason: (verdict.reason ?? "").slice(0, 255) || "No reason given",
    }
  } catch (err) {
    console.warn("[leadClassify] threw:", err instanceof Error ? err.message : String(err))
    return fallback
  }
}
