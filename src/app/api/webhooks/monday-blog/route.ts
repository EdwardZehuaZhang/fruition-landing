import { NextResponse } from "next/server"
import {
  buildDraftReadyBlocks,
  buildIdeaProposedBlocks,
  buildPublishedBlocks,
} from "@/lib/blogSlackBlocks"
import {
  createDraftDoc,
  createSubfolder,
  wordCount,
} from "@/lib/googleDocs"
import { generateLinkedInPost } from "@/lib/marketaLinkedIn"
import {
  changeColumnValues,
  getItemForWebhook,
  type MondayColumnValue,
  type MondayItemSnapshot,
} from "@/lib/mondayClient"
import { upsertBlogPost } from "@/lib/sanityWriteClient"
import { postSlackText } from "@/lib/slackClient"

export const runtime = "nodejs"
export const maxDuration = 60

const BOARD_ID = 5028637584

// Column IDs (from board 5028637584).
// Stage is a single-select DROPDOWN (limit_select:true). Status cols on this
// board are rollup-wrapped by the Fruition Marketing workspace which blocks
// API reads/writes/webhooks, so dropdown is the only option that works.
const COL_STAGE = "dropdown_mm3jh58b"
const COL_BRIEF = "long_text_mm3grk84"
const COL_TARGET_KW = "text_mm3gzj88"
const COL_INDUSTRY = "dropdown_mm3gb7wm"
const COL_DRAFT_BODY = "long_text_mm3gj0s8"
const COL_EDIT_NOTES = "long_text_mm3g2bp9"
const COL_SANITY_DOC_ID = "text_mm3g4ab9"
const COL_PUBLISHED_URL = "link_mm3gpqq1"
// Added 2026-05-24 for the Marketa auto-docs flow. See
// docs/marketa-auto-docs-plan.md and docs/phase2-handoff.md.
const COL_SLACK_ORIGIN = "long_text_mm3nthd2"
const COL_LINKEDIN_POST = "long_text_mm3nwhjg"
const COL_BLOG_DOC_URL = "link_mm3nw491"
const COL_LINKEDIN_DOC_URL = "link_mm3na3pz"

// Stage values that trigger downstream action. Anything else is ignored.
const STAGE_IDEA_PROPOSED = "Idea proposed"
const STAGE_IDEA_APPROVED = "Idea approved"
const STAGE_DRAFTING = "Drafting"
const STAGE_DRAFT_READY = "Draft ready"
const STAGE_EDITS_REQUESTED = "Edits requested"
const STAGE_APPROVED_PUBLISH = "Approved to publish"
const STAGE_PUBLISHED = "Published"

const SLACK_CHANNEL = "C0B4NFVDJKY" // #fruition-blogs

interface MondayChangeEvent {
  type?: string
  boardId?: number
  pulseId?: number | string
  columnId?: string
  // status payload: { label: { text } }; dropdown payload: { chosenValues: [{ name }] }
  value?: {
    label?: { text?: string } | null
    chosenValues?: Array<{ id?: number; name?: string }> | null
  } | null
  previousValue?: unknown
}

interface MondayWebhookBody {
  challenge?: string
  event?: MondayChangeEvent
}

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

function colText(c: MondayColumnValue | undefined): string | undefined {
  const t = c?.text?.trim()
  return t || undefined
}

function publicUrlFor(slug: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"
  return `${base.replace(/\/+$/, "")}/blog/${slug}`
}

export async function POST(req: Request) {
  let body: MondayWebhookBody
  try {
    body = (await req.json()) as MondayWebhookBody
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  // Subscription handshake.
  if (body.challenge && !body.event) {
    return NextResponse.json({ challenge: body.challenge })
  }

  const expected = process.env.MONDAY_WEBHOOK_SECRET
  if (!expected) {
    console.error("[monday-blog] MONDAY_WEBHOOK_SECRET missing")
    return unauthorized()
  }
  const headerAuth = req.headers.get("authorization")
  const queryAuth = new URL(req.url).searchParams.get("key")
  if (headerAuth !== expected && queryAuth !== expected) {
    return unauthorized()
  }

  const event = body.event
  if (!event || Number(event.boardId) !== BOARD_ID) {
    return NextResponse.json({ ok: true, skipped: "irrelevant board" })
  }
  // monday delivers `update_column_value` for status/dropdown changes regardless
  // of which webhook event type you subscribed with. Accept the variants.
  const isColEvent =
    event.type === "update_column_value" ||
    event.type === "change_column_value" ||
    event.type === "change_specific_column_value"
  if (!isColEvent || event.columnId !== COL_STAGE) {
    return NextResponse.json({
      ok: true,
      skipped: `irrelevant event: type=${event.type} col=${event.columnId}`,
    })
  }

  const newStage =
    event.value?.chosenValues?.[0]?.name?.trim() ?? event.value?.label?.text?.trim()
  const pulseId = event.pulseId != null ? String(event.pulseId) : ""
  if (!pulseId || !newStage) {
    return NextResponse.json({ ok: true, skipped: "missing pulseId or stage" })
  }

  try {
    switch (newStage) {
      case STAGE_IDEA_PROPOSED:
        return await pingHumanInLoop(pulseId, "idea-proposed")
      case STAGE_IDEA_APPROVED:
        return await forwardToMarketa("draft", pulseId)
      case STAGE_DRAFT_READY:
        return await handleDraftReady(pulseId)
      case STAGE_EDITS_REQUESTED:
        return await forwardToMarketa("revise", pulseId)
      case STAGE_APPROVED_PUBLISH:
        return await publishToSanity(pulseId)
      case STAGE_DRAFTING:
      case STAGE_PUBLISHED:
        // Marketa or this route set these — nothing to do.
        return NextResponse.json({ ok: true, skipped: `internal stage: ${newStage}` })
      default:
        return NextResponse.json({ ok: true, skipped: `unhandled stage: ${newStage}` })
    }
  } catch (err) {
    console.error("[monday-blog] processing failed", errMsg(err))
    return NextResponse.json({ ok: false, error: errMsg(err) }, { status: 500 })
  }
}

/**
 * Hand off to n8n. Marketa does the heavy lifting (RAG + Claude + writing back
 * to the monday item via its own API token). This route stays thin.
 */
async function forwardToMarketa(
  action: "draft" | "revise",
  pulseId: string,
): Promise<NextResponse> {
  const url =
    action === "draft"
      ? process.env.N8N_MARKETA_DRAFT_WEBHOOK_URL
      : process.env.N8N_MARKETA_REVISE_WEBHOOK_URL
  if (!url) {
    console.error(`[monday-blog] n8n url missing for action=${action}`)
    return NextResponse.json({ ok: false, error: "n8n url missing" }, { status: 500 })
  }
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, pulseId, boardId: BOARD_ID }),
  })
  if (!r.ok) {
    const text = await r.text().catch(() => "")
    throw new Error(`n8n ${action} responded ${r.status}: ${text.slice(0, 200)}`)
  }
  return NextResponse.json({ ok: true, action, pulseId })
}

async function publishToSanity(pulseId: string): Promise<NextResponse> {
  const snapshot = await getItemForWebhook(pulseId)
  if (!snapshot) {
    return NextResponse.json({ ok: true, skipped: "item not found" })
  }
  const title = snapshot.name?.trim()
  const draftBody = colText(snapshot.columns[COL_DRAFT_BODY])
  if (!title || !draftBody) {
    return NextResponse.json(
      { ok: false, error: "title and draft body required to publish" },
      { status: 400 },
    )
  }

  const existingDocId = colText(snapshot.columns[COL_SANITY_DOC_ID])
  const docId = existingDocId || `blog-monday-${pulseId}`

  const excerpt = colText(snapshot.columns[COL_BRIEF])
  const seoKeyword = colText(snapshot.columns[COL_TARGET_KW])
  const industry = colText(snapshot.columns[COL_INDUSTRY])

  const { id, slug } = await upsertBlogPost({
    docId,
    title,
    body: draftBody,
    excerpt,
    industry: industry?.toLowerCase().replace(/\s+/g, "-"),
    seoTitle: title,
    seoDescription: excerpt,
    mondayItemId: pulseId,
    author: "Marketa / Fruition Editorial",
  })

  const publishedUrl = publicUrlFor(slug)

  // Write back: store sanity id + url, flip Stage to Published.
  await changeColumnValues(BOARD_ID, pulseId, {
    [COL_SANITY_DOC_ID]: id,
    [COL_PUBLISHED_URL]: { url: publishedUrl, text: title },
    [COL_STAGE]: { labels: [STAGE_PUBLISHED] },
  })

  const { fallbackText, blocks } = buildPublishedBlocks({
    pulseId,
    title,
    excerpt,
    industry,
    targetKeyword: seoKeyword,
    publishedUrl,
  })
  await notifySlack({ text: fallbackText, blocks })

  return NextResponse.json({ ok: true, docId: id, slug, publishedUrl })
}

async function notifySlack(args: {
  text: string
  blocks?: Record<string, unknown>[]
}): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN
  if (!token) {
    console.warn("[monday-blog] SLACK_BOT_TOKEN missing, skipping notify")
    return
  }
  try {
    const r = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        text: args.text, // fallback for notifications
        ...(args.blocks ? { blocks: args.blocks } : {}),
      }),
    })
    const body = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (!body.ok) {
      console.warn(
        `[monday-blog] slack chat.postMessage not ok: error=${body.error ?? "unknown"} http=${r.status} text=${args.text.slice(0, 80)}`,
      )
    }
  } catch (err) {
    console.warn("[monday-blog] slack notify threw:", errMsg(err))
  }
}

/**
 * Notify Slack when a stage needs human attention.
 * Routes that need a click in monday: Idea proposed (approve/reject),
 * Draft ready (review). Published handled separately in publishToSanity.
 */
async function pingHumanInLoop(
  pulseId: string,
  kind: "idea-proposed" | "draft-ready",
): Promise<NextResponse> {
  const snapshot = await getItemForWebhook(pulseId)
  const title = snapshot?.name?.trim() || "(untitled)"
  const ctx = extractContext(snapshot)
  const built =
    kind === "idea-proposed"
      ? buildIdeaProposedBlocks({
          pulseId,
          title,
          brief: ctx.brief,
          industry: ctx.industry,
          targetKeyword: ctx.targetKeyword,
        })
      : buildDraftReadyBlocks({
          pulseId,
          title,
          brief: ctx.brief,
          industry: ctx.industry,
          targetKeyword: ctx.targetKeyword,
          draftBody: ctx.draftBody,
        })
  await notifySlack({ text: built.fallbackText, blocks: built.blocks })
  return NextResponse.json({ ok: true, stage: kind, pulseId })
}

function extractContext(snapshot: MondayItemSnapshot | null): {
  brief?: string
  industry?: string
  targetKeyword?: string
  draftBody?: string
} {
  if (!snapshot) return {}
  return {
    brief: colText(snapshot.columns[COL_BRIEF]),
    industry: colText(snapshot.columns[COL_INDUSTRY]),
    targetKeyword: colText(snapshot.columns[COL_TARGET_KW]),
    draftBody: colText(snapshot.columns[COL_DRAFT_BODY]),
  }
}

/**
 * Dispatch for STAGE_DRAFT_READY. Branches based on whether the item came
 * from Slack (slack-blog route stamped COL_SLACK_ORIGIN at creation) or
 * from the regular monday Stage flow.
 *
 * - Slack-origin: run the auto-docs flow (LinkedIn + 2 Google Docs + Slack
 *   thread reply + write back monday columns). Falls back to a Slack thread
 *   error reply if the auto-docs work throws.
 * - Otherwise: existing pingHumanInLoop behavior (Block Kit notification to
 *   #fruition-blogs).
 */
async function handleDraftReady(pulseId: string): Promise<NextResponse> {
  const snapshot = await getItemForWebhook(pulseId)
  const slackOriginRaw = snapshot
    ? colText(snapshot.columns[COL_SLACK_ORIGIN])
    : undefined
  const slackOrigin = parseSlackOrigin(slackOriginRaw)

  if (!slackOrigin) {
    return pingHumanInLoop(pulseId, "draft-ready")
  }

  try {
    return await autoDocsForSlackOrigin(pulseId, snapshot, slackOrigin)
  } catch (err) {
    const detail = errMsg(err)
    console.error("[monday-blog] auto-docs failed", detail)
    // Best-effort thread reply so the requester isn't left hanging.
    await postThreadReply(
      slackOrigin,
      `:warning: Draft is ready for *${snapshot?.name?.trim() || "(untitled)"}*, but the auto-docs step failed: \`${detail.slice(0, 200)}\`. Review the item in monday and ping Edward if it keeps happening.`,
    ).catch((postErr) => {
      console.error("[monday-blog] thread error-reply also failed", errMsg(postErr))
    })
    return NextResponse.json(
      { ok: false, stage: "draft-ready", autoDocs: "failed", error: detail },
      { status: 500 },
    )
  }
}

interface SlackOrigin {
  channel: string
  ts: string
  user?: string | null
  team?: string | null
}

function parseSlackOrigin(raw: string | undefined): SlackOrigin | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<SlackOrigin>
    if (!parsed.channel || !parsed.ts) return null
    return {
      channel: parsed.channel,
      ts: parsed.ts,
      user: parsed.user ?? null,
      team: parsed.team ?? null,
    }
  } catch {
    return null
  }
}

async function postThreadReply(origin: SlackOrigin, text: string): Promise<void> {
  await postSlackText(origin.channel, text, {
    threadTs: origin.ts,
    unfurlLinks: false,
    unfurlMedia: false,
  })
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function todayIsoDate(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

async function autoDocsForSlackOrigin(
  pulseId: string,
  snapshot: MondayItemSnapshot | null,
  origin: SlackOrigin,
): Promise<NextResponse> {
  const folderId = process.env.MARKETA_DRAFTS_FOLDER_ID
  if (!folderId) {
    throw new Error(
      "MARKETA_DRAFTS_FOLDER_ID missing in Vercel env — Phase 2 setup incomplete",
    )
  }
  if (!snapshot) {
    throw new Error(`monday item ${pulseId} not found while building auto-docs`)
  }
  const title = snapshot.name?.trim() || "(untitled blog draft)"
  const ctx = extractContext(snapshot)
  const draftBody = ctx.draftBody?.trim()
  if (!draftBody) {
    throw new Error(`monday item ${pulseId} has no draft body — Marketa write step likely failed`)
  }

  const linkedInBody = await generateLinkedInPost({
    title,
    draft: draftBody,
    industry: ctx.industry,
    targetKeyword: ctx.targetKeyword,
  })

  // Group both docs under a dated subfolder so the parent folder stays scannable.
  const subfolderName = clip(`${todayIsoDate()} ${title}`, 80)
  const subfolderId = await createSubfolder(folderId, subfolderName)

  const blogDocBody = [
    title,
    "",
    `Source brief: ${ctx.brief?.replace(/\n+/g, " ") || "(none)"}`,
    `Industry: ${ctx.industry || "(unset)"}`,
    `Target keyword: ${ctx.targetKeyword || "(unset)"}`,
    `monday item: https://fruitionservices.monday.com/boards/${BOARD_ID}/pulses/${pulseId}`,
    "",
    "AI Checks / Grammarly / Plagiarism — TODO add screenshots before publish.",
    "",
    "---",
    "",
    draftBody,
    "",
    "---",
    "",
    `Word count: ${wordCount(draftBody)}`,
  ].join("\n")

  const linkedInDocBody = [
    `${title} — LinkedIn post`,
    "",
    `monday item: https://fruitionservices.monday.com/boards/${BOARD_ID}/pulses/${pulseId}`,
    "",
    "---",
    "",
    linkedInBody,
    "",
    "---",
    "",
    `Word count: ${wordCount(linkedInBody)}`,
  ].join("\n")

  const blogTitleClip = clip(title, 80)
  const [blogDoc, linkedInDoc] = await Promise.all([
    createDraftDoc({
      folderId: subfolderId,
      title: `${blogTitleClip} — Blog draft`,
      body: blogDocBody,
    }),
    createDraftDoc({
      folderId: subfolderId,
      title: `${blogTitleClip} — LinkedIn post`,
      body: linkedInDocBody,
    }),
  ])

  // Patch monday with the LinkedIn post and both doc URLs.
  await changeColumnValues(BOARD_ID, pulseId, {
    [COL_LINKEDIN_POST]: { text: linkedInBody },
    [COL_BLOG_DOC_URL]: { url: blogDoc.docUrl, text: "Blog draft" },
    [COL_LINKEDIN_DOC_URL]: { url: linkedInDoc.docUrl, text: "LinkedIn post" },
  })

  // Thread reply on the original Slack message.
  const blogWords = wordCount(draftBody)
  const linkedInWords = wordCount(linkedInBody)
  const industryLine = ctx.industry ? `\n:label: ${ctx.industry}` : ""
  const reply = [
    `:memo: Draft ready: *${title}*`,
    `• <${blogDoc.docUrl}|Blog draft (${blogWords} words)>`,
    `• <${linkedInDoc.docUrl}|LinkedIn post (${linkedInWords} words)>`,
  ].join("\n") + industryLine
  await postThreadReply(origin, reply)

  return NextResponse.json({
    ok: true,
    stage: "draft-ready",
    autoDocs: "ok",
    pulseId,
    blogDocUrl: blogDoc.docUrl,
    linkedInDocUrl: linkedInDoc.docUrl,
    blogWords,
    linkedInWords,
  })
}
