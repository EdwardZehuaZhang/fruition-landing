/**
 * Thin wrapper around the monday.com GraphQL API for the
 * /api/internal/onboarding route. Mirrors the helpers in
 * scripts/sync-sanity-to-monday.mjs but typed and tree-shakeable.
 */

const MONDAY_GQL = "https://api.monday.com/v2"
const MONDAY_FILE = "https://api.monday.com/v2/file"

function getToken(): string {
  const t = process.env.MONDAY_API_TOKEN
  if (!t) throw new Error("MONDAY_API_TOKEN missing")
  return t
}

async function gql<T = unknown>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const r = await fetch(MONDAY_GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken(),
      "API-Version": "2024-01",
    },
    body: JSON.stringify({ query, variables }),
  })
  const j = (await r.json()) as { data?: T; errors?: unknown }
  if (j.errors) throw new Error(`monday gql ${JSON.stringify(j.errors)}`)
  if (!j.data) throw new Error("monday gql returned no data")
  return j.data
}

export async function createItem(boardId: number, groupId: string, name: string): Promise<string> {
  const data = await gql<{ create_item: { id: string } }>(
    `mutation ($board: ID!, $group: String!, $name: String!) {
      create_item(board_id: $board, group_id: $group, item_name: $name) { id }
    }`,
    { board: String(boardId), group: groupId, name },
  )
  return data.create_item.id
}

export async function changeColumnValues(
  boardId: number,
  itemId: string,
  values: Record<string, unknown>,
): Promise<void> {
  if (Object.keys(values).length === 0) return
  await gql(
    `mutation ($board: ID!, $item: ID!, $vals: JSON!) {
      change_multiple_column_values(board_id: $board, item_id: $item, column_values: $vals) { id }
    }`,
    { board: String(boardId), item: String(itemId), vals: JSON.stringify(values) },
  )
}

export async function uploadFileToColumn(
  itemId: string,
  columnId: string,
  bytes: ArrayBuffer | Uint8Array,
  filename: string,
  mime: string,
): Promise<void> {
  const part = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  const blob = new Blob([part as unknown as BlobPart], { type: mime })
  const fd = new FormData()
  fd.append(
    "query",
    `mutation ($file: File!) { add_file_to_column (item_id: ${itemId}, column_id: "${columnId}", file: $file) { id } }`,
  )
  fd.append("variables", JSON.stringify({ file: null }))
  fd.append("map", JSON.stringify({ image: ["variables.file"] }))
  fd.append("image", blob, filename)
  const r = await fetch(MONDAY_FILE, {
    method: "POST",
    headers: { Authorization: getToken(), "API-Version": "2024-01" },
    body: fd,
  })
  const text = await r.text()
  if (!r.ok || text.includes('"errors"')) {
    throw new Error(`monday file upload failed: ${text.slice(0, 300)}`)
  }
}
