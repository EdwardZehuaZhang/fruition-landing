/**
 * Sanity → Marketa brain ingest webhook.
 *
 * Sanity fires this on publish / unpublish / delete of indexable content
 * (GROQ filter configured in the Sanity webhook UI — see docs/marketa.md §6).
 * The route verifies the request, then upserts or removes that document's
 * chunks in the Supabase brain.
 *
 * Auth: Sanity signed-webhook HMAC (header `sanity-webhook-signature`) OR a
 * shared `?key=` query secret, either compared against SANITY_WEBHOOK_SECRET.
 *
 * Processing is inline (not deferred) so a failure returns non-2xx and Sanity
 * retries. Embedding one document is well within the function timeout.
 */
import { createHmac, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { ingestDocById, removeDoc } from "@/lib/marketa/sanityIngest"

export const runtime = "nodejs"
export const maxDuration = 60

interface SanityWebhookBody {
  _id?: string
  _type?: string
  _rev?: string
  // Present depending on how the webhook projection / trigger is configured.
  _deleted?: boolean
  operation?: string
  transition?: string
}

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

/**
 * Verify Sanity's signed-webhook header:
 *   sanity-webhook-signature: t=<unix>,v1=<base64url(HMAC-SHA256(secret, `${t}.${body}`))>
 */
function verifySignature(header: string, rawBody: string, secret: string): boolean {
  const t = header.match(/(?:^|,)\s*t=([^,]+)/)?.[1]?.trim()
  const v1 = header.match(/(?:^|,)\s*v1=([^,]+)/)?.[1]?.trim()
  if (!t || !v1) return false
  // Reject stale timestamps (> 5 min skew) to blunt replay.
  const ts = Number(t)
  if (Number.isFinite(ts) && Math.abs(Date.now() / 1000 - ts) > 60 * 5) return false
  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("base64url")
  return safeEqual(expected, v1)
}

function authorize(req: Request, rawBody: string): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    console.error("[sanity-ingest] SANITY_WEBHOOK_SECRET missing")
    return false
  }
  const sig = req.headers.get("sanity-webhook-signature")
  if (sig && verifySignature(sig, rawBody, secret)) return true
  const queryKey = new URL(req.url).searchParams.get("key")
  if (queryKey && safeEqual(queryKey, secret)) return true
  return false
}

export async function POST(req: Request) {
  const rawBody = await req.text()
  if (!authorize(req, rawBody)) return unauthorized()

  let body: SanityWebhookBody
  try {
    body = JSON.parse(rawBody) as SanityWebhookBody
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const id = body._id
  if (!id) {
    return NextResponse.json({ ok: true, skipped: "no _id in payload" })
  }

  const isDelete =
    body._deleted === true ||
    body.operation === "delete" ||
    body.transition === "disappear"

  try {
    const result = isDelete ? await removeDoc(id) : await ingestDocById(id)
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[sanity-ingest] failed", message)
    // Non-2xx so Sanity retries the delivery.
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
