/**
 * Google Drive + Docs wrapper for the Marketa auto-docs flow.
 *
 * Authenticates with a service account whose JSON key is provided
 * base64-encoded in `GOOGLE_SERVICE_ACCOUNT_JSON_B64`. The SA must be added
 * as Editor on the Drive folder `MARKETA_DRAFTS_FOLDER_ID`.
 *
 * See docs/marketa-auto-docs-plan.md (Phase 3a). Setup steps for the env
 * vars live in docs/phase2-handoff.md.
 */
import { docs_v1, drive_v3, google } from "googleapis"
import { JWT } from "google-auth-library"

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents",
]

let cachedClient: JWT | null = null

function getAuthClient(): JWT {
  if (cachedClient) return cachedClient
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64
  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON_B64 missing")
  }
  let parsed: { client_email?: string; private_key?: string }
  try {
    const json = Buffer.from(raw, "base64").toString("utf8")
    parsed = JSON.parse(json)
  } catch (err) {
    throw new Error(
      `GOOGLE_SERVICE_ACCOUNT_JSON_B64 is not valid base64-encoded JSON: ${
        err instanceof Error ? err.message : String(err)
      }`,
    )
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON_B64 missing client_email or private_key",
    )
  }
  cachedClient = new JWT({
    email: parsed.client_email,
    key: parsed.private_key,
    scopes: SCOPES,
  })
  return cachedClient
}

function getDocs(): docs_v1.Docs {
  return google.docs({ version: "v1", auth: getAuthClient() })
}

function getDrive(): drive_v3.Drive {
  return google.drive({ version: "v3", auth: getAuthClient() })
}

export interface CreatedDoc {
  docId: string
  docUrl: string
}

export interface CreateDocInput {
  folderId: string
  title: string
  body: string
}

/**
 * Create a new Google Doc with the given title and body, parented in the
 * given Drive folder. Returns the doc id and a public-style edit URL.
 *
 * The body is inserted as a single batchUpdate. Newlines are preserved.
 * Markdown is NOT rendered — the doc is plain text with the markdown
 * source intact so a human reviewer can convert/format as needed.
 */
export async function createDraftDoc({
  folderId,
  title,
  body,
}: CreateDocInput): Promise<CreatedDoc> {
  if (!folderId) throw new Error("createDraftDoc: folderId required")
  if (!title) throw new Error("createDraftDoc: title required")

  const drive = getDrive()
  const docs = getDocs()

  // Create the file directly in the target folder. Using Drive's files.create
  // (not Docs' documents.create) so we can set `parents` in one call instead
  // of creating then moving.
  const created = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId],
    },
    fields: "id",
    supportsAllDrives: true,
  })
  const docId = created.data.id
  if (!docId) {
    throw new Error("Drive files.create returned no id")
  }

  if (body && body.trim()) {
    // Insert all body text at index 1 (after the doc's implicit start segment).
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: body,
            },
          },
        ],
      },
    })
  }

  return {
    docId,
    docUrl: `https://docs.google.com/document/d/${docId}/edit`,
  }
}

/**
 * Create a subfolder inside the given parent folder. Returns the new folder id.
 * Used to group each blog request's docs under a dated subfolder so the
 * top-level "Marketa - Auto Drafts" folder stays scannable.
 */
export async function createSubfolder(
  parentId: string,
  name: string,
): Promise<string> {
  if (!parentId) throw new Error("createSubfolder: parentId required")
  if (!name) throw new Error("createSubfolder: name required")
  const drive = getDrive()
  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
    supportsAllDrives: true,
  })
  const id = created.data.id
  if (!id) throw new Error("Drive files.create (folder) returned no id")
  return id
}

/** Cheap word counter for body text. Splits on whitespace, drops empties. */
export function wordCount(text: string): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}
