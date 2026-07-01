import { createHmac, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import {
  ayrshareFullySucceeded,
  isAyrshareConfigured,
  publishToAyrshare,
  summarizeAyrshareResult,
  type SocialChannel,
} from "@/lib/marketa/ayrshare"
import { getVariant, updateVariantStatus } from "@/lib/marketa/socialStore"
import {
  CHANNEL_LABEL,
  SOCIAL_ACTION_APPROVE,
  SOCIAL_ACTION_EDIT,
  SOCIAL_ACTION_SKIP,
  decodeButtonValue,
  resolveChannelInBlocks,
} from "@/lib/marketa/socialSlackBlocks"

export const runtime = "nodejs"
export const maxDuration = 60

/**
 * Slack interactivity endpoint for the social-publishing approval loop.
 *
 * Slack POSTs here (application/x-www-form-urlencoded, a single `payload`
 * field) whenever a button in the approval card is clicked. We verify the
 * signature, then on Approve we publish that one channel via Ayrshare, update
 * the Supabase row + the Slack card. Edit opens monday (URL button) so we just
 * ack; Skip marks the channel skipped.
 *
 * Configure the Slack app: Interactivity & Shortcuts → Request URL →
 * https://<site>/api/webhooks/slack-interactivity (see runbook).
 */

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

function verifySlackSignature(req: Request, rawBody: string): boolean {
  const signingSecret = process.env.SLACK_SIGNING_SECRET
  if (!signingSecret) {
    console.error("[slack-interactivity] SLACK_SIGNING_SECRET missing")
    return false
  }
  const timestamp = req.headers.get("x-slack-request-timestamp")
  const slackSignature = req.headers.get("x-slack-signature")
  if (!timestamp || !slackSignature) return false
  const requestTime = Number(timestamp)
  if (!Number.isFinite(requestTime)) return false
  if (Math.abs(Date.now() / 1000 - requestTime) > 60 * 5) return false
  const base = `v0:${timestamp}:${rawBody}`
  const computed = `v0=${createHmac("sha256", signingSecret).update(base).digest("hex")}`
  const a = Buffer.from(computed)
  const b = Buffer.from(slackSignature)
  return a.length === b.length && timingSafeEqual(a, b)
}

interface SlackInteractionPayload {
  type?: string
  user?: { id?: string; name?: string }
  channel?: { id?: string }
  message?: { ts?: string; blocks?: Record<string, unknown>[] }
  actions?: Array<{ action_id?: string; value?: string }>
}

/** chat.update via bot token — swaps the one channel's row to a status line. */
async function updateSlackMessage(
  channel: string,
  ts: string,
  blocks: Record<string, unknown>[],
  fallbackText: string,
): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN
  if (!token) return
  try {
    const r = await fetch("https://slack.com/api/chat.update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ channel, ts, blocks, text: fallbackText }),
    })
    const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (!j.ok) console.warn(`[slack-interactivity] chat.update not ok: ${j.error ?? "unknown"}`)
  } catch (err) {
    console.warn("[slack-interactivity] chat.update threw", errMsg(err))
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text()
  if (!verifySlackSignature(req, rawBody)) return unauthorized()

  // Body is `payload=<url-encoded JSON>`.
  const params = new URLSearchParams(rawBody)
  const payloadRaw = params.get("payload")
  if (!payloadRaw) return NextResponse.json({ ok: true, skipped: "no payload" })

  let payload: SlackInteractionPayload
  try {
    payload = JSON.parse(payloadRaw) as SlackInteractionPayload
  } catch {
    return NextResponse.json({ error: "invalid payload json" }, { status: 400 })
  }

  if (payload.type !== "block_actions") {
    return NextResponse.json({ ok: true, skipped: `type ${payload.type}` })
  }

  const action = payload.actions?.[0]
  const actionId = action?.action_id
  const decoded = action?.value ? decodeButtonValue(action.value) : null

  // Edit is a URL button (opens monday) — nothing to do server-side.
  if (actionId === SOCIAL_ACTION_EDIT) {
    return NextResponse.json({ ok: true, action: "edit" })
  }
  if (!decoded) {
    return NextResponse.json({ ok: true, skipped: "undecodable button value" })
  }

  const { pulseId, channel } = decoded
  const slackChannel = payload.channel?.id
  const ts = payload.message?.ts
  const blocks = payload.message?.blocks
  const clicker = payload.user?.name || payload.user?.id || "someone"

  try {
    if (actionId === SOCIAL_ACTION_SKIP) {
      await updateVariantStatus(pulseId, channel, { status: "skipped" })
      await maybeUpdateCard(
        slackChannel,
        ts,
        blocks,
        pulseId,
        channel,
        `:no_entry_sign: *${CHANNEL_LABEL[channel]}* skipped by ${clicker}`,
      )
      return NextResponse.json({ ok: true, action: "skip", channel })
    }

    if (actionId === SOCIAL_ACTION_APPROVE) {
      return await handleApprove({ pulseId, channel, slackChannel, ts, blocks, clicker })
    }

    return NextResponse.json({ ok: true, skipped: `unhandled action ${actionId}` })
  } catch (err) {
    const detail = errMsg(err)
    console.error("[slack-interactivity] handler failed", detail)
    await maybeUpdateCard(
      slackChannel,
      ts,
      blocks,
      pulseId,
      channel,
      `:warning: *${CHANNEL_LABEL[channel]}* failed: \`${detail.slice(0, 160)}\``,
    )
    // 200 so Slack doesn't retry-storm; the card already shows the error.
    return NextResponse.json({ ok: false, error: detail })
  }
}

async function handleApprove(args: {
  pulseId: string
  channel: SocialChannel
  slackChannel?: string
  ts?: string
  blocks?: Record<string, unknown>[]
  clicker: string
}): Promise<NextResponse> {
  const { pulseId, channel, slackChannel, ts, blocks, clicker } = args

  if (!isAyrshareConfigured()) {
    await maybeUpdateCard(
      slackChannel,
      ts,
      blocks,
      pulseId,
      channel,
      `:lock: *${CHANNEL_LABEL[channel]}* not published — AYRSHARE_API_KEY not set yet. Add it in Vercel env, then re-run the stage.`,
    )
    return NextResponse.json({ ok: false, error: "ayrshare not configured" })
  }

  const variant = await getVariant(pulseId, channel)
  if (!variant) {
    await maybeUpdateCard(
      slackChannel,
      ts,
      blocks,
      pulseId,
      channel,
      `:warning: *${CHANNEL_LABEL[channel]}* variant not found (regenerate from monday).`,
    )
    return NextResponse.json({ ok: false, error: "variant not found" })
  }
  // Idempotency: don't double-publish a channel already shipped.
  if (variant.status === "published") {
    await maybeUpdateCard(
      slackChannel,
      ts,
      blocks,
      pulseId,
      channel,
      `:white_check_mark: *${CHANNEL_LABEL[channel]}* already published.`,
    )
    return NextResponse.json({ ok: true, skipped: "already published" })
  }

  await updateVariantStatus(pulseId, channel, { status: "approved" })

  const result = await publishToAyrshare({
    post: variant.post_text,
    channels: [channel],
    mediaUrls: variant.media_urls?.length ? variant.media_urls : undefined,
    youTubeTitle: variant.title ?? undefined,
    pinterestTitle: variant.title ?? undefined,
    pinterestLink: variant.blog_url ?? undefined,
    idempotencyKey: `${pulseId}:${channel}`,
    notes: `monday ${pulseId} · ${channel}`,
  })

  const summary = summarizeAyrshareResult(result)
  const ok = ayrshareFullySucceeded(result)
  const postUrl = result.postIds?.find((p) => p.status !== "error")?.postUrl

  await updateVariantStatus(pulseId, channel, {
    status: ok ? "published" : "error",
    ayrsharePostId: result.id,
    resultSummary: summary,
  })

  const statusLine = ok
    ? `:white_check_mark: *${CHANNEL_LABEL[channel]}* published by ${clicker}${postUrl ? ` · <${postUrl}|view>` : ""}`
    : `:warning: *${CHANNEL_LABEL[channel]}* — ${summary}`
  await maybeUpdateCard(slackChannel, ts, blocks, pulseId, channel, statusLine)

  return NextResponse.json({ ok, action: "approve", channel, summary, ayrshareId: result.id })
}

async function maybeUpdateCard(
  slackChannel: string | undefined,
  ts: string | undefined,
  blocks: Record<string, unknown>[] | undefined,
  pulseId: string,
  channel: SocialChannel,
  statusText: string,
): Promise<void> {
  if (!slackChannel || !ts || !blocks) return
  const next = resolveChannelInBlocks(blocks, pulseId, channel, statusText)
  await updateSlackMessage(slackChannel, ts, next, statusText)
}
