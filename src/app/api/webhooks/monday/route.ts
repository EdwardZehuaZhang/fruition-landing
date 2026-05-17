import { NextResponse } from "next/server"
import {
  downloadAsset,
  getItemForWebhook,
  type MondayColumnValue,
} from "@/lib/mondayClient"
import { upsertTeamMember, uploadImageAsset } from "@/lib/sanityWriteClient"

export const runtime = "nodejs"
export const maxDuration = 60

const BOARD_ID = 1879224155

// Mirrors src/app/api/internal/onboarding/route.ts for the same board.
const COL_ROLE = "text_mm3bxhyd"
const COL_LINK = "link_mm3bvtmk"
const COL_BIO = "long_text_mm3bdjkb"
const COL_PHOTO = "file_mm0vp797"
const COL_REGION = "dropdown_mkxsn7t4"

const MONDAY_TO_SANITY_REGION: Record<string, string> = {
  APAC: "APAC",
  UK: "UK",
  US: "US",
  India: "IN",
}

interface MondayWebhookBody {
  challenge?: string
  event?: {
    type?: string
    boardId?: number
    pulseId?: number | string
  }
}

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function POST(req: Request) {
  let body: MondayWebhookBody
  try {
    body = (await req.json()) as MondayWebhookBody
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  // Initial subscription handshake: monday POSTs { challenge } and expects it echoed.
  if (body.challenge && !body.event) {
    return NextResponse.json({ challenge: body.challenge })
  }

  const expected = process.env.MONDAY_WEBHOOK_SECRET
  if (!expected) {
    console.error("[monday-webhook] MONDAY_WEBHOOK_SECRET missing")
    return unauthorized()
  }
  if (req.headers.get("authorization") !== expected) {
    return unauthorized()
  }

  const event = body.event
  if (!event || event.type !== "create_pulse" || Number(event.boardId) !== BOARD_ID) {
    return NextResponse.json({ ok: true, skipped: "irrelevant event" })
  }
  const pulseId = event.pulseId != null ? String(event.pulseId) : ""
  if (!pulseId) {
    return NextResponse.json({ ok: true, skipped: "missing pulseId" })
  }

  try {
    const snapshot = await getItemForWebhook(pulseId)
    if (!snapshot) {
      console.warn(`[monday-webhook] item ${pulseId} not found`)
      return NextResponse.json({ ok: true, skipped: "item not found" })
    }
    const name = snapshot.name?.trim()
    if (!name) {
      return NextResponse.json({ ok: true, skipped: "no name" })
    }

    const role = colText(snapshot.columns[COL_ROLE]) ?? ""
    const bio = colText(snapshot.columns[COL_BIO]) ?? undefined
    const linkedinUrl = colLinkUrl(snapshot.columns[COL_LINK])
    const regions = mapRegions(snapshot.columns[COL_REGION])

    let photoAssetId: string | undefined
    const photoUrl = snapshot.columns[COL_PHOTO]?.files?.[0]?.url
    if (photoUrl) {
      try {
        const { bytes, mime } = await downloadAsset(photoUrl)
        photoAssetId = await uploadImageAsset(bytes, mime, `monday-${pulseId}`)
      } catch (err) {
        console.warn(`[monday-webhook] photo upload failed: ${errMsg(err)}`)
      }
    }

    await upsertTeamMember({
      docId: `team-monday-${pulseId}`,
      name,
      role,
      regions,
      bio,
      linkedinUrl,
      photoAssetId,
      order: 9999,
    })

    return NextResponse.json({ ok: true, pulseId })
  } catch (err) {
    console.error(`[monday-webhook] processing failed: ${errMsg(err)}`)
    // Swallow errors with 200 so monday doesn't retry indefinitely on bad inputs.
    return NextResponse.json({ ok: false, error: errMsg(err) })
  }
}

function colText(c: MondayColumnValue | undefined): string | undefined {
  const t = c?.text?.trim()
  return t || undefined
}

function colLinkUrl(c: MondayColumnValue | undefined): string | undefined {
  if (!c) return undefined
  if (c.url) return c.url
  // LinkValue raw value JSON is `{ "url": "...", "text": "..." }`.
  if (c.value) {
    try {
      const parsed = JSON.parse(c.value) as { url?: string }
      if (parsed.url) return parsed.url
    } catch {}
  }
  return colText(c)
}

function mapRegions(c: MondayColumnValue | undefined): string[] {
  if (!c?.values) return []
  const mapped: string[] = []
  for (const v of c.values) {
    const m = MONDAY_TO_SANITY_REGION[v.label]
    if (m && !mapped.includes(m)) mapped.push(m)
  }
  return mapped
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}
