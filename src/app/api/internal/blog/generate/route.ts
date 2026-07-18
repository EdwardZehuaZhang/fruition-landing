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

// Minimal fallback style rules, used ONLY if the Sanity voice guide can't be
// fetched. The real style contract is the `voiceGuide` document in Sanity
// (edited by the content team; fetched fresh per run below) — it encodes the
// full Fruition post template (meta description, Q&A snippet opener, cited
// stats, internal links, How-Fruition-Helps proof block, FAQs, Sources).
const FALLBACK_STYLE = `You are a senior content writer for Fruition, a monday.com Platinum Partner.
Conversational Q&A tone: question-style H2s answered directly in the first sentence. Hemingway grade 6-9, sentences under 20 words, paragraphs 2-3 sentences. Bullet lists with bold lead-ins. Bold the target keyword on first uses. Only verifiable facts — never invent statistics, prices, or features. End with "## FAQs" (3 Q&As) then "## Sources" (official pages only).
Banned: leverage, synergise, best-in-class, unlock potential, game-changer, revolutionise, delve, "in today's fast-paced world", "let's dive in". British spelling. Output ONLY clean markdown.`

const HARNESS_PROMPT = `You are Marketa, Fruition's blog writer. Follow the Fruition voice-and-template guide below EXACTLY — both the required post structure and the writing style. Use your web search capability to verify every external statistic, price, and date before stating it; if you cannot verify a fact, leave it out. Prefer the retrieved Fruition sources (when provided) for Fruition-specific facts and internal links. Output only the finished blog post in clean markdown.`

// Sanity voice guide — fetched per run (cached in-isolate for 1h) so the
// content team can tune style without a code deploy. Same GROQ the original
// make.com draft scenario used.
let cachedGuide: { text: string; at: number } | null = null
async function fetchVoiceGuide(): Promise<string | null> {
  if (cachedGuide && Date.now() - cachedGuide.at < 3_600_000) return cachedGuide.text
  try {
    const r = await fetch(
      "https://bt6nb58h.api.sanity.io/v2024-01-01/data/query/production?query=" +
        encodeURIComponent('*[_type=="voiceGuide"][0].body'),
      { signal: AbortSignal.timeout(10_000) },
    )
    if (!r.ok) return null
    const j = (await r.json()) as { result?: string }
    if (!j.result || j.result.length < 200) return null
    cachedGuide = { text: j.result, at: Date.now() }
    return j.result
  } catch {
    return null
  }
}

/**
 * RAG retrieval from the Marketa brain (Supabase content_chunks): embed the
 * topic with the SAME model/dimensions the ingest pipeline uses, then call the
 * match_content_chunks RPC. Best-effort — returns null when the brain is
 * unreachable so generation proceeds ungrounded rather than failing.
 */
async function fetchBrainChunks(
  query: string,
  industry: string,
): Promise<{ text: string; count: number } | null> {
  const gKey = process.env.GEMINI_API_KEY
  const bUrl = process.env.MARKETA_SUPABASE_URL
  const bKey = process.env.MARKETA_SUPABASE_SERVICE_ROLE_KEY
  if (!gKey || !bUrl || !bKey) return null
  try {
    const er = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent`,
      {
        method: "POST",
        headers: { "x-goog-api-key": gKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text: query }] },
          taskType: "RETRIEVAL_QUERY",
          outputDimensionality: 768,
        }),
        signal: AbortSignal.timeout(15_000),
      },
    )
    if (!er.ok) return null
    const ed = (await er.json()) as { embedding?: { values?: number[] } }
    const vec = ed.embedding?.values
    if (!vec?.length) return null

    const rr = await fetch(`${bUrl.replace(/\/+$/, "")}/rest/v1/rpc/match_content_chunks`, {
      method: "POST",
      headers: {
        apikey: bKey,
        Authorization: `Bearer ${bKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query_embedding: vec,
        match_count: 8,
        // NO industry filter: verified 2026-07-18 that zero of the corpus's
        // chunks carry metadata.industry, so any non-null/non-'general' value
        // makes the RPC return 0 rows. Cosine similarity on the topic query
        // already narrows retrieval topically.
        filter_industry: null,
      }),
      signal: AbortSignal.timeout(15_000),
    })
    if (!rr.ok) return null
    const rows = (await rr.json()) as Array<{ source_id?: string; body?: string }>
    if (!rows?.length) return null
    const text = rows
      .map((c, i) => `--- Source ${i + 1} (id: ${c.source_id ?? "unknown"}) ---\n${c.body ?? ""}`)
      .join("\n\n")
    return { text, count: rows.length }
  } catch {
    return null
  }
}

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

  // Grounding: the Sanity voice guide (style + template contract) and RAG
  // chunks from the Marketa brain (past Fruition content → accurate internal
  // facts + internal-link targets). Both best-effort in parallel.
  const [voiceGuide, brainChunks] = await Promise.all([
    fetchVoiceGuide(),
    fetchBrainChunks(`${topic} - ${keyword} - ${industry}`, industry),
  ])
  const systemPrompt = `${HARNESS_PROMPT}\n\nVOICE GUIDE:\n${voiceGuide ?? FALLBACK_STYLE}`

  const briefBlock = pulseId && body.brief?.trim() ? `\n\nBrief / context from the requester:\n${body.brief.trim()}` : ""
  const chunksBlock = brainChunks
    ? `\n\nRetrieved Fruition sources — prefer these for Fruition-specific facts, and use them to pick real internal links (cite as [Source N] while drafting is NOT needed; weave links naturally):\n${brainChunks.text}`
    : ""
  const userPrompt = `Write a 1200-1600 word blog post. Topic seed: "${topic}".
Primary keyword: "${keyword}". Industry/audience: ${industry} teams evaluating or already using monday.com.
Follow the voice guide's post template exactly (meta description line, reframed H1, Q&A snippet opener, question H2s, How Fruition Helps, CTA, FAQs, Sources). Write the COMPLETE post — it is unusable if it stops before the FAQs and Sources sections. Verify external facts with web search before including them.${briefBlock}${chunksBlock}`

  const MODELS = (process.env.MARKETA_BLOG_MODELS || "anthropic/claude-sonnet-5,openai/gpt-4o,google/gemini-2.5-pro")
    .split(",").map((s) => s.trim()).filter(Boolean)
  let bodyMarkdown = ""
  let genErr = ""
  let usedWebSearch = false

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
        // Reasoning models (claude-sonnet-5) count thinking tokens INSIDE
        // max_tokens on OpenRouter — 4000 left only ~700 for the article and
        // truncated posts mid-sentence. 12000 fits thinking + a 2000-word post.
        max_tokens: 12000,
        temperature: 0.7,
        // OpenRouter web-search plugin: grounds the completion with live
        // results so stats/prices/dates can actually be verified, per the
        // voice guide's "verify every external fact" rule.
        plugins: [{ id: "web", max_results: 5 }],
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    })
    if (orResp.ok) {
      const orData = (await orResp.json()) as { choices?: Array<{ message?: { content?: string } }> }
      bodyMarkdown = orData.choices?.[0]?.message?.content || ""
      if (bodyMarkdown) {
        usedWebSearch = true
        console.log(`[blog/generate] generated with ${model} (web plugin)`)
      }
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
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: "user", parts: [{ text: userPrompt }] }],
              // Google Search grounding — Gemini's native web search, so the
              // fallback path can verify external facts too.
              tools: [{ google_search: {} }],
              generationConfig: { maxOutputTokens: 10000, temperature: 0.7 },
            }),
          },
        )
        if (gr.ok) {
          const gd = (await gr.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
          bodyMarkdown = (gd.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("")
          if (bodyMarkdown) {
            usedWebSearch = true
            console.log(`[blog/generate] generated with ${gModel} (Gemini direct + search grounding)`)
          }
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
  // change to "Draft ready"). No direct Slack/docs here.
  if (pulseId) {
    // Portal copy FIRST — this is what the /internal/blog/monday/[pulseId]
    // bridge resolves against (else it 404s) and what auto-docs reads for the
    // full untruncated body. The brain blog_drafts write below is legacy
    // best-effort (its creds may not be live on the Worker).
    try {
      const portalAdmin = getPortalAdmin()
      const { error: pdErr } = await portalAdmin.from("portal_drafts").insert({
        title: topic,
        body_markdown: bodyMarkdown,
        metadata: {
          status: "drafted",
          industry,
          target_keyword: keyword,
          monday_item_id: pulseId,
          source: "slack-intake",
          generated_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      if (pdErr) console.error("[blog/generate] portal draft insert failed (non-fatal):", pdErr.message)
    } catch (portalErr) {
      console.error("[blog/generate] portal draft insert failed (non-fatal):", portalErr)
    }
    try {
      await saveFullDraft(pulseId, bodyMarkdown)
    } catch (saveErr) {
      console.error("[blog/generate] blog_drafts upsert failed (non-fatal):", saveErr)
    }
    await changeColumnValues(MONDAY_BOARD_ID, pulseId, {
      [COL_DRAFT_BODY]: { text: bodyMarkdown },
      [COL_TARGET_KW]: keyword,
      [COL_STAGE]: { labels: ["Draft ready"] },
    })
    return NextResponse.json({
      ok: true,
      pulseId,
      stage: "Draft ready",
      words: wordCount(bodyMarkdown),
      grounding: { voiceGuide: Boolean(voiceGuide), brainChunks: brainChunks?.count ?? 0, webSearch: usedWebSearch },
    })
  }

  // Excerpt: prefer the template's Meta-Description line (a 140-160 char
  // benefit promise); fall back to the first non-heading paragraph.
  const metaMatch = bodyMarkdown.match(/^\s*Meta-Description:\s*(.+)$/im)
  const paragraphs = bodyMarkdown.split("\n\n").filter(p => p.trim() && !p.startsWith("#") && !/^\s*Meta-Description:/i.test(p))
  const excerpt = metaMatch?.[1]?.trim().slice(0, 250) || paragraphs[0]?.slice(0, 250) || topic

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
      // Template-style output already carries its own reframed H1 (and a
      // Meta-Description line); only prepend a title when the body lacks one.
      const blogDocBody = /^#\s/m.test(bodyMarkdown)
        ? bodyMarkdown.trim()
        : [`# ${topic}`, "", bodyMarkdown.trim()].join("\n")
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
    grounding: { voiceGuide: Boolean(voiceGuide), brainChunks: brainChunks?.count ?? 0, webSearch: usedWebSearch },
  })
}

// GET - trigger daily generation
export async function GET(req: Request) {
  return POST(req)
}
