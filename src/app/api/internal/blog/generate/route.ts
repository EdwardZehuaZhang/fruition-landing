import { NextResponse } from "next/server"
import { getPortalAdmin } from "@/lib/portalAuth"
import { buildDailyDraftBlocks } from "@/lib/marketa/blogSlackBlocks"
import { createDraftDoc, createSubfolder, wordCount } from "@/lib/googleDocs"
import { generateLinkedInPost } from "@/lib/marketa/marketaLinkedIn"
import { createSocialDraft } from "@/lib/marketa/zernio"
import { createItem, changeColumnValues } from "@/lib/mondayClient"
import { saveFullDraft } from "@/lib/marketa/brain"
import { postSlackMessage } from "@/lib/slackClient"

export const runtime = "nodejs"
export const maxDuration = 120

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || process.env.N8N_API_KEY || ""
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || ""
const GEMINI_KEY = process.env.GEMINI_API_KEY || ""
// #fruition-blogs. Overridable so the channel can move without a code change.
const SLACK_BLOG_CHANNEL_ID = process.env.SLACK_BLOG_CHANNEL_ID || "C0B4NFVDJKY"

// Website Blogs board (same one the Slack-intake flow uses). Column ids match
// src/app/api/webhooks/slack-blog/route.ts.
const MONDAY_BOARD_ID = 5028637584
const MONDAY_GROUP_TOPICS = "topics"
const COL_STAGE = "dropdown_mm3jh58b"
const COL_BRIEF = "long_text_mm3grk84"
const COL_TARGET_KW = "text_mm3gzj88"
const COL_INDUSTRY = "dropdown_mm3gb7wm"
const COL_DRAFT_BODY = "long_text_mm3gj0s8"
const COL_BLOG_DOC_URL = "link_mm3nw491"
const COL_LINKEDIN_DOC_URL = "link_mm3na3pz"

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

  // Two modes:
  //  - Daily mode (no pulseId): rotating/custom topic → portal draft + docs +
  //    monday item + Zernio + Slack. `notify:false` suppresses the side effects.
  //  - monday mode (pulseId set, forwarded by the make.com draft scenario from
  //    the slack-blog intake): generate for the EXISTING monday item, save the
  //    full draft to blog_drafts, patch the item to "Draft ready" — the
  //    monday-blog webhook then runs auto-docs + the threaded Slack reply.
  let body: {
    topic?: string
    notify?: boolean
    pulseId?: string
    title?: string
    brief?: string
    target_keyword?: string
    industry?: string
  } = {}
  try { body = await req.json() } catch {}
  const notify = body.notify !== false
  const pulseId = body.pulseId ? String(body.pulseId) : null

  const { topic, industry, keyword } = pulseId
    ? {
        topic: (body.title || "").trim() || "(untitled blog draft)",
        industry: body.industry?.trim() || extractIndustry(body.title || ""),
        keyword: body.target_keyword?.trim() || (body.title || "").slice(0, 60),
      }
    : body.topic
      ? { topic: body.topic, industry: extractIndustry(body.topic), keyword: body.topic.split(":")[0] || body.topic.slice(0, 60) }
      : getDailyTopic()

  if (!OPENROUTER_KEY) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 })
  }

  // Generate the blog via OpenRouter, trying models in order until one works.
  // The Worker's egress region is geo-blocked for Anthropic models ("This model
  // is not available in your region", 403 — from BOTH OpenRouter and Anthropic
  // direct), and the CF colo (hence egress region) varies per request, so the
  // Anthropic model is unreliable here. We keep Claude first for quality and
  // fall back to a globally-available model so generation never hard-fails.
  console.log(`Generating blog: "${topic}"${pulseId ? ` (monday item ${pulseId})` : ""}`)
  const briefBlock = pulseId && body.brief?.trim() ? `\n\nBrief / context from the requester:\n${body.brief.trim()}` : ""
  const userPrompt = `Write a 1000-1200 word blog post: "${topic}". Focus on practical, actionable advice for ${industry} teams. Use H2 headings. Output clean markdown.${briefBlock}`
  const MODELS = (process.env.MARKETA_BLOG_MODELS || "anthropic/claude-sonnet-5,openai/gpt-4o,google/gemini-2.5-pro")
    .split(",").map((s) => s.trim()).filter(Boolean)
  let bodyMarkdown = ""
  let genErr = ""

  for (const model of MODELS) {
    if (bodyMarkdown) break
    const orResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 3000,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    })
    if (orResp.ok) {
      const orData = (await orResp.json()) as { choices?: Array<{ message?: { content?: string } }> }
      bodyMarkdown = orData.choices?.[0]?.message?.content || ""
      if (bodyMarkdown) console.log(`[blog/generate] generated with ${model}`)
    } else {
      genErr = `${genErr}[${model} ${orResp.status}] ${(await orResp.text()).slice(0, 150)} `
      console.error(`[blog/generate] ${model} failed:`, genErr)
    }
  }

  // Final fallback: Google Gemini DIRECT. OpenRouter (and Anthropic direct) geo-
  // block the Worker's egress region for ALL models; Google's Generative
  // Language API is globally available, so this is the reliable path.
  if (!bodyMarkdown && GEMINI_KEY) {
    for (const gModel of (process.env.MARKETA_BLOG_MODELS_GEMINI || "gemini-flash-latest,gemini-2.0-flash,gemini-2.5-flash,gemini-pro-latest").split(",").map((s) => s.trim()).filter(Boolean)) {
      if (bodyMarkdown) break
      try {
        const gr = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [{ role: "user", parts: [{ text: userPrompt }] }],
              generationConfig: { maxOutputTokens: 4000, temperature: 0.7 },
            }),
          },
        )
        if (gr.ok) {
          const gd = (await gr.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
          bodyMarkdown = (gd.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("")
          if (bodyMarkdown) console.log(`[blog/generate] generated with ${gModel} (Gemini direct)`)
        } else {
          genErr = `${genErr}[gemini ${gModel} ${gr.status}] ${(await gr.text()).slice(0, 150)} `
          console.error(`[blog/generate] Gemini ${gModel} failed:`, genErr)
        }
      } catch (e) {
        genErr = `${genErr}gemini threw: ${e instanceof Error ? e.message : String(e)} `
      }
    }
  }

  if (!bodyMarkdown) {
    return NextResponse.json({ error: "blog generation failed", detail: genErr.slice(0, 1400) }, { status: 502 })
  }

  // monday mode: attach the draft to the existing item and hand off to the
  // monday-blog webhook (auto-docs + threaded Slack reply fire on the stage
  // change to "Draft ready"). No portal draft, no direct Slack/docs here.
  if (pulseId) {
    try {
      await saveFullDraft(pulseId, bodyMarkdown)
    } catch (saveErr) {
      // Non-fatal: auto-docs falls back to the (truncated) monday column.
      console.error("[blog/generate] blog_drafts upsert failed (non-fatal):", saveErr)
    }
    await changeColumnValues(MONDAY_BOARD_ID, pulseId, {
      [COL_DRAFT_BODY]: { text: bodyMarkdown },
      [COL_STAGE]: { labels: ["Draft ready"] },
    })
    return NextResponse.json({ ok: true, pulseId, stage: "Draft ready", words: wordCount(bodyMarkdown) })
  }

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

  const draftId = draft.id
  const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.fruitionservices.io").replace(/\/+$/, "")
  const internalUrl = `${siteBase}/internal/blog/${draftId}/edit`

  // Everything below is best-effort. The draft is already saved, so a failure
  // in Google Docs / LinkedIn / Slack must never turn a successful generation
  // into a 5xx — each side effect logs and degrades on its own.
  let googleDocUrl: string | null = null
  let linkedinDocUrl: string | null = null
  let linkedinCopy: string | null = null

  const folderId = process.env.MARKETA_DRAFTS_FOLDER_ID
  if (notify && folderId) {
    // LinkedIn generation is independent — a failure here still leaves the blog doc.
    try {
      linkedinCopy = await generateLinkedInPost({ title: topic, draft: bodyMarkdown, industry, targetKeyword: keyword })
    } catch (liErr) {
      console.error("[blog/generate] LinkedIn generation failed (non-fatal):", liErr)
    }
    try {
      const dateStamp = new Date().toISOString().slice(0, 10)
      const subfolderId = await createSubfolder(folderId, `${dateStamp} ${topic}`.slice(0, 80))
      const titleClip = topic.slice(0, 80)
      const blogDocBody = [`# ${topic}`, "", bodyMarkdown.trim()].join("\n")
      const [blogDoc, linkedInDoc] = await Promise.all([
        createDraftDoc({ folderId: subfolderId, title: `${titleClip} — Blog draft`, body: blogDocBody }),
        linkedinCopy
          ? createDraftDoc({ folderId: subfolderId, title: `${titleClip} — LinkedIn post`, body: `${topic} — LinkedIn post\n\n${linkedinCopy}` })
          : Promise.resolve(null),
      ])
      googleDocUrl = blogDoc.docUrl
      linkedinDocUrl = linkedInDoc?.docUrl ?? null
    } catch (docErr) {
      console.error("[blog/generate] Google Docs creation failed (non-fatal):", docErr)
    }
  } else if (notify) {
    console.warn("[blog/generate] MARKETA_DRAFTS_FOLDER_ID missing — Slack post will omit doc buttons")
  }

  // Persist doc URLs + LinkedIn copy onto the draft so the portal dashboard
  // shows the same links as the Slack message.
  if (googleDocUrl || linkedinDocUrl || linkedinCopy) {
    const { error: updErr } = await admin
      .from("portal_drafts")
      .update({
        metadata: { ...metadata, google_doc_url: googleDocUrl, linkedin_doc_url: linkedinDocUrl, linkedin_copy: linkedinCopy },
        updated_at: new Date().toISOString(),
      })
      .eq("id", draftId)
    if (updErr) console.error("[blog/generate] metadata update failed (non-fatal):", updErr.message)
  }

  // Create a monday item on the Website Blogs board so the draft is visible in
  // the same pipeline as Slack-intake topics. Stage "Drafting" deliberately —
  // NOT "Draft ready" — so the monday-blog webhook's auto-docs path can't fire
  // a second docs+Slack run for this item. Best-effort like everything below.
  let mondayItemUrl: string | null = null
  let mondayItemId: string | null = null
  if (notify) {
    try {
      mondayItemId = await createItem(MONDAY_BOARD_ID, MONDAY_GROUP_TOPICS, topic)
      await changeColumnValues(
        MONDAY_BOARD_ID,
        mondayItemId,
        {
          [COL_STAGE]: { labels: ["Drafting"] },
          [COL_BRIEF]: { text: excerpt },
          [COL_TARGET_KW]: keyword,
          [COL_INDUSTRY]: { labels: [industry] },
          [COL_DRAFT_BODY]: { text: bodyMarkdown },
          ...(googleDocUrl ? { [COL_BLOG_DOC_URL]: { url: googleDocUrl, text: "Blog draft (Google Doc)" } } : {}),
          ...(linkedinDocUrl ? { [COL_LINKEDIN_DOC_URL]: { url: linkedinDocUrl, text: "LinkedIn post (Google Doc)" } } : {}),
        },
        { createLabelsIfMissing: true },
      )
      mondayItemUrl = `https://fruitionservices.monday.com/boards/${MONDAY_BOARD_ID}/pulses/${mondayItemId}`
    } catch (mondayErr) {
      console.error("[blog/generate] monday item creation failed (non-fatal):", mondayErr)
    }
  }

  // Create a Zernio DRAFT social post (X + Google Business) for human review.
  // Dormant unless ZERNIO_API_KEY is set; best-effort — never break the pipeline.
  let socialUrl: string | null = null
  if (notify) {
    try {
      const social = await createSocialDraft({ title: topic, excerpt })
      socialUrl = social?.reviewUrl ?? null
    } catch (socialErr) {
      console.error("[blog/generate] Zernio draft failed (non-fatal):", socialErr)
    }
  }

  // Post the Slack notification with working buttons (portal link always;
  // doc / social buttons only when their URLs exist; monday links to the board).
  if (notify) {
    try {
      const built = buildDailyDraftBlocks({
        title: topic,
        excerpt,
        industry,
        targetKeyword: keyword,
        words: wordCount(bodyMarkdown),
        portalUrl: internalUrl,
        blogDocUrl: googleDocUrl,
        linkedInDocUrl: linkedinDocUrl,
        socialUrl,
        mondayUrl: mondayItemUrl,
      })
      await postSlackMessage(SLACK_BLOG_CHANNEL_ID, built.blocks, built.fallbackText, { unfurlLinks: false, unfurlMedia: false })
    } catch (slackErr) {
      console.error("[blog/generate] Slack post failed (non-fatal):", slackErr)
    }
  }

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
    mondayItemId,
    mondayItemUrl,
    socialUrl,
  })
}

// GET - trigger daily generation
export async function GET(req: Request) {
  return POST(req)
}
