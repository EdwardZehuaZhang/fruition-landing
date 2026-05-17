/**
 * Sanity write helpers used by /api/internal/onboarding.
 * Kept separate from src/sanity/client.ts so the read-only client can
 * stay `useCdn: true`.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

function getToken(): string {
  const t = process.env.SANITY_WRITE_TOKEN
  if (!t) throw new Error("SANITY_WRITE_TOKEN missing")
  return t
}

function base(): string {
  if (!PROJECT_ID || !DATASET) throw new Error("Sanity project id / dataset missing")
  return `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`
}

export async function uploadImageAsset(
  bytes: ArrayBuffer | Uint8Array,
  mime: string,
  filename: string,
): Promise<string> {
  const ext = (mime.split("/")[1] ?? "jpg").split(";")[0]
  const url = `${base()}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}.${ext}`
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": mime,
      Authorization: `Bearer ${getToken()}`,
    },
    body: u8 as unknown as BodyInit,
  })
  if (!r.ok) throw new Error(`sanity asset upload ${r.status} ${await r.text()}`)
  const j = (await r.json()) as { document?: { _id?: string } }
  const id = j.document?._id
  if (!id) throw new Error("sanity asset upload returned no _id")
  return id
}

export interface CreateTeamMemberInput {
  docId: string
  name: string
  role: string
  regions: string[]
  bio?: string
  emoji?: string
  linkedinUrl?: string
  photoAssetId?: string
  order?: number
}

function buildTeamMemberDoc(input: CreateTeamMemberInput): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    _id: input.docId,
    _type: "teamMember",
    name: input.name,
    role: input.role,
    regions: input.regions,
    order: input.order ?? 9999,
  }
  if (input.bio) doc.bio = input.bio
  if (input.emoji) doc.emoji = input.emoji
  if (input.linkedinUrl) doc.linkedinUrl = input.linkedinUrl
  if (input.photoAssetId) {
    doc.photo = { _type: "image", asset: { _type: "reference", _ref: input.photoAssetId } }
  }
  return doc
}

async function mutate(mutations: unknown[]): Promise<void> {
  const r = await fetch(`${base()}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ mutations }),
  })
  if (!r.ok) throw new Error(`sanity mutate ${r.status} ${await r.text()}`)
}

export async function createTeamMember(input: CreateTeamMemberInput): Promise<{ id: string }> {
  await mutate([{ create: buildTeamMemberDoc(input) }])
  return { id: input.docId }
}

export async function upsertTeamMember(input: CreateTeamMemberInput): Promise<{ id: string }> {
  await mutate([{ createOrReplace: buildTeamMemberDoc(input) }])
  return { id: input.docId }
}
