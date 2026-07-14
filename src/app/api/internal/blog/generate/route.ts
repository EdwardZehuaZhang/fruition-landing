import { NextResponse } from "next/server"
import { getPortalAdmin } from "@/lib/portalAuth"

export const runtime = "nodejs"
export const maxDuration = 120

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || process.env.N8N_API_KEY || ""
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || ""

const TOPICS = [
  "monday.com workflow automation best practices for professional services firms",
  "How construction companies use monday.com to track project milestones and budgets",
  "monday.com CRM vs traditional CRMs: what B2B teams actually need in 2026",
  "Reducing manufacturing downtime with real-time production dashboards in monday.com",
  "monday.com for marketing teams: campaign tracking and content calendar automation",
  "How finance teams automate month-end close processes with monday.com integrations",
  "monday.com for real estate: managing property listings and client pipelines",
  "The hidden cost of manual data entry: why professional services firms automate with monday.com",
  "How SaaS companies use monday.com boards to manage product launches",
  "monday.com AI features: practical applications for operations teams",
]

// Rotate through topics daily
function getDailyTopic(): { topic: string; industry: string; keyword: string } {
  const dayOfYear = Math.floor((Date.now() - new Date(2026, 0, 1).getTime()) / 86400000)
  const idx = dayOfYear % TOPICS.length
  const topic = TOPICS[idx]
  const industry = extractIndustry(topic)
  const keyword = topic.split(":")[0] || topic.slice(0, 60)
  return { topic, industry, keyword }
}

function extractIndustry(topic: string): string {
  const lower = topic.toLowerCase()
  if (lower.includes("construction")) return "Construction"
  if (lower.includes("manufacturing")) return "Manufacturing"
  if (lower.includes("marketing")) return "Marketing"
  if (lower.includes("finance") || lower.includes("accounting")) return "Finance"
  if (lower.includes("real estate")) return "Real Estate"
  if (lower.includes("saas")) return "SaaS"
  if (lower.includes("professional services")) return "Professional Services"
  if (lower.includes("hr")) return "HR"
  return "Professional Services"
}

const SYSTEM_PROMPT = `You are a B2B content writer for Fruition, a monday.com Platinum Partner.
Write authoritative, practical blog posts that answer industry questions — not product pitches.
Follow the 80/20 industry/product editorial rule. 
Use short paragraphs (2-4 sentences). Use H2 headings for sections.
Banned words: leverage, synergise, best-in-class, unlock potential, drive results, game-changer, revolutionize, cutting-edge, delve, dive deep.
End with a "## Key takeaway" section.
Output ONLY clean markdown. No JSON wrapper, no preamble.`

export async function POST(req: Request) {
  // Auth check
  const auth = req.headers.get("authorization") || ""
  const apiKey = auth.replace("Bearer ", "")
  if (apiKey !== INTERNAL_API_KEY && !INTERNAL_API_KEY) {
    // Allow if INTERNAL_API_KEY not set (dev mode)
    console.warn("No INTERNAL_API_KEY set — allowing unauthenticated access")
  } else if (INTERNAL_API_KEY && apiKey !== INTERNAL_API_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  // Allow custom topic override
  let body: { topic?: string } = {}
  try { body = await req.json() } catch {}

  const { topic, industry, keyword } = body.topic 
    ? { topic: body.topic, industry: extractIndustry(body.topic), keyword: body.topic.split(":")[0] || body.topic.slice(0, 60) }
    : getDailyTopic()

  if (!OPENROUTER_KEY) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 })
  }

  // Generate blog via OpenRouter
  console.log(`Generating blog: "${topic}"`)
  const orResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-6",
      max_tokens: 3000,
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Write a 1000-1200 word blog post: "${topic}". Focus on practical, actionable advice for ${industry} teams. Use H2 headings. Output clean markdown.` }
      ]
    }),
  })

  if (!orResp.ok) {
    const err = await orResp.text()
    console.error("OpenRouter error:", err)
    return NextResponse.json({ error: "OpenRouter generation failed", detail: err.slice(0, 500) }, { status: 502 })
  }

  const orData = await orResp.json() as { choices: Array<{ message: { content: string } }> }
  const bodyMarkdown = orData.choices?.[0]?.message?.content || ""

  // Extract excerpt (first non-heading paragraph)
  const paragraphs = bodyMarkdown.split("\n\n").filter(p => p.trim() && !p.startsWith("#"))
  const excerpt = paragraphs[0]?.slice(0, 250) || topic

  // Save draft to portal_drafts
  const admin = getPortalAdmin()
  const metadata = {
    status: "drafted",
    industry,
    target_keyword: keyword,
    excerpt,
    google_doc_url: null,
    linkedin_copy: null,
    linkedin_doc_url: null,
    generated_at: new Date().toISOString(),
  }

  const { data: draft, error } = await admin
    .from("portal_drafts")
    .insert({
      title: topic,
      body_markdown: bodyMarkdown,
      metadata,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single()

  if (error) {
    console.error("Supabase insert error:", error)
    return NextResponse.json({ error: "Failed to save draft", detail: error.message }, { status: 502 })
  }

  // Build response with links
  const draftId = draft.id
  const internalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.fruitionservices.io"}/internal/blog/${draftId}/edit`
  const googleDocUrl = null // Requires GCP setup
  const linkedinDocUrl = null // Requires GCP setup

  return NextResponse.json({
    ok: true,
    draftId,
    title: topic,
    excerpt,
    industry,
    keyword,
    internalUrl,
    googleDocUrl,
    linkedinDocUrl,
  })
}

// GET - trigger daily generation
export async function GET(req: Request) {
  return POST(req)
}
