import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { INTERNAL_COOKIE, verifyToken } from "@/lib/internalAuth"
import { createTeamMember, uploadImageAsset } from "@/lib/sanityWriteClient"
import {
  changeColumnValues,
  createItem,
  uploadFileToColumn,
} from "@/lib/mondayClient"

export const runtime = "nodejs"
export const maxDuration = 60

const BOARD_ID = 1879224155
const GROUP_ID = "topics"
const COL_ROLE = "text_mm3bxhyd"
const COL_LINK = "link_mm3bvtmk"
const COL_BIO = "long_text_mm3bdjkb"
const COL_PHOTO = "file_mm0vp797"
const COL_FAV_MOVIE = "text"
const COL_FAV_FRUIT = "text4"
const COL_ANNIV = "date_mm08fwcp"
const COL_REGION = "dropdown_mkxsn7t4"
const COL_STATUS = "color_mkxsehc2"

const REGION_TO_MONDAY_LABEL: Record<string, string> = {
  APAC: "APAC",
  IN: "India",
  UK: "UK",
  US: "US",
}

const ALLOWED_REGIONS = new Set(Object.keys(REGION_TO_MONDAY_LABEL))

const MAX_PHOTO_BYTES = 8 * 1024 * 1024

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "member"
}

export async function POST(req: Request) {
  // Defence-in-depth — proxy.ts already gates this, but re-check.
  const token = (await cookies()).get(INTERNAL_COOKIE)?.value
  if (!verifyToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 })
  }

  const name = String(form.get("name") ?? "").trim()
  const role = String(form.get("role") ?? "").trim()
  const region = String(form.get("region") ?? "").trim()
  const bio = String(form.get("bio") ?? "").trim()
  const linkedinUrl = String(form.get("linkedinUrl") ?? "").trim()
  const emoji = String(form.get("emoji") ?? "").trim()
  const favouriteMovie = String(form.get("favouriteMovie") ?? "").trim()
  const favouriteFruit = String(form.get("favouriteFruit") ?? "").trim()
  const workAnniversary = String(form.get("workAnniversary") ?? "").trim()
  const photo = form.get("photo")

  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 })
  if (!role) return NextResponse.json({ error: "Role is required." }, { status: 400 })
  if (!ALLOWED_REGIONS.has(region)) {
    return NextResponse.json({ error: "Invalid region." }, { status: 400 })
  }
  if (linkedinUrl && !/^https?:\/\//i.test(linkedinUrl)) {
    return NextResponse.json({ error: "LinkedIn URL must start with http(s)://" }, { status: 400 })
  }
  if (workAnniversary && !/^\d{4}-\d{2}-\d{2}$/.test(workAnniversary)) {
    return NextResponse.json({ error: "Anniversary must be YYYY-MM-DD." }, { status: 400 })
  }
  if (!(photo instanceof File)) {
    return NextResponse.json({ error: "Photo is required." }, { status: 400 })
  }
  if (!photo.type.startsWith("image/")) {
    return NextResponse.json({ error: "Photo must be an image." }, { status: 400 })
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return NextResponse.json({ error: "Photo exceeds 8 MB limit." }, { status: 413 })
  }

  const slug = slugify(name)
  const ts = Date.now()
  const warnings: string[] = []
  const photoBytes = Buffer.from(await photo.arrayBuffer())
  const photoMime = photo.type
  const photoFilename = `onboarding-${slug}-${ts}`

  // 1. Sanity asset upload (photo first — needed for the doc reference).
  let assetId: string | undefined
  try {
    assetId = await uploadImageAsset(photoBytes, photoMime, photoFilename)
  } catch (err) {
    warnings.push(
      `Sanity photo upload failed: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  // 2. Sanity teamMember doc.
  let sanityId: string | undefined
  try {
    const docId = `team-onboarding-${ts}-${slug}`
    const r = await createTeamMember({
      docId,
      name,
      role,
      regions: [region],
      bio: bio || undefined,
      emoji: emoji || undefined,
      linkedinUrl: linkedinUrl || undefined,
      photoAssetId: assetId,
      order: 9999,
    })
    sanityId = r.id
  } catch (err) {
    warnings.push(
      `Sanity doc create failed: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  // 3. Monday: create item, set columns, upload photo.
  let mondayItemId: string | undefined
  try {
    mondayItemId = await createItem(BOARD_ID, GROUP_ID, name)
    const cols: Record<string, unknown> = {
      [COL_ROLE]: role,
      [COL_REGION]: { labels: [REGION_TO_MONDAY_LABEL[region]] },
      [COL_STATUS]: { label: "Active" },
    }
    if (linkedinUrl) cols[COL_LINK] = { url: linkedinUrl, text: "LinkedIn" }
    if (bio) cols[COL_BIO] = { text: bio }
    if (favouriteMovie) cols[COL_FAV_MOVIE] = favouriteMovie
    if (favouriteFruit) cols[COL_FAV_FRUIT] = favouriteFruit
    if (workAnniversary) cols[COL_ANNIV] = { date: workAnniversary }
    await changeColumnValues(BOARD_ID, mondayItemId, cols)
  } catch (err) {
    warnings.push(
      `Monday item create/update failed: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  if (mondayItemId) {
    try {
      await uploadFileToColumn(mondayItemId, COL_PHOTO, photoBytes, `${photoFilename}.jpg`, photoMime)
    } catch (err) {
      warnings.push(
        `Monday photo upload failed: ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  if (!sanityId && !mondayItemId) {
    return NextResponse.json(
      { ok: false, error: "Both monday.com and Sanity writes failed.", warnings },
      { status: 502 },
    )
  }

  return NextResponse.json({
    ok: true,
    sanityId,
    mondayItemId,
    warnings: warnings.length ? warnings : undefined,
  })
}
