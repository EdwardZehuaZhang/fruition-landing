import { NextResponse } from "next/server"

export const runtime = "nodejs"

/**
 * Internal Slack admin utility — lets ops list and delete the bot's own
 * messages (e.g. pipeline test posts) without needing the bot token locally.
 * Gated by INTERNAL_API_KEY like /api/internal/blog/generate.
 *
 * POST { action: "list", channel, limit? }
 * POST { action: "delete", channel, ts: string[] }
 */
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || ""
const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN || ""

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || ""
  const apiKey = auth.replace(/^Bearer\s+/i, "")
  if (!INTERNAL_API_KEY || apiKey !== INTERNAL_API_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  if (!SLACK_TOKEN) {
    return NextResponse.json({ error: "SLACK_BOT_TOKEN missing" }, { status: 500 })
  }

  let body: { action?: string; channel?: string; ts?: string[]; limit?: number } = {}
  try { body = await req.json() } catch {}
  const channel = body.channel
  if (!channel) return NextResponse.json({ error: "channel required" }, { status: 400 })

  if (body.action === "list") {
    const r = await fetch(
      `https://slack.com/api/conversations.history?channel=${encodeURIComponent(channel)}&limit=${body.limit ?? 30}`,
      { headers: { Authorization: `Bearer ${SLACK_TOKEN}` } },
    )
    const d = (await r.json()) as {
      ok: boolean
      error?: string
      messages?: Array<{ ts: string; text?: string; bot_id?: string; user?: string }>
    }
    if (!d.ok) return NextResponse.json({ error: d.error }, { status: 502 })
    return NextResponse.json({
      ok: true,
      messages: (d.messages ?? []).map((m) => ({
        ts: m.ts,
        bot: Boolean(m.bot_id),
        text: (m.text ?? "").slice(0, 140),
      })),
    })
  }

  if (body.action === "delete") {
    const results: Array<{ ts: string; ok: boolean; error?: string }> = []
    for (const ts of body.ts ?? []) {
      const r = await fetch("https://slack.com/api/chat.delete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SLACK_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channel, ts }),
      })
      const d = (await r.json()) as { ok: boolean; error?: string }
      results.push({ ts, ok: d.ok, error: d.error })
    }
    return NextResponse.json({ ok: true, results })
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 })
}
