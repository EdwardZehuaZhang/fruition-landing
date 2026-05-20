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

export interface MondayItemMatch {
  id: string
  name: string
  columns: Record<string, MondayColumnValue>
}

export async function findItemByColumnValue(
  boardId: number,
  columnId: string,
  value: string,
): Promise<MondayItemMatch | null> {
  const data = await gql<{
    items_page_by_column_values: {
      items: Array<{
        id: string
        name: string
        column_values: Array<{ id: string; type: string; text: string | null; value: string | null }>
      }>
    }
  }>(
    `query ($board: ID!, $columns: [ItemsPageByColumnValuesQuery!]!) {
      items_page_by_column_values(board_id: $board, columns: $columns, limit: 1) {
        items {
          id
          name
          column_values { id type text value }
        }
      }
    }`,
    {
      board: String(boardId),
      columns: [{ column_id: columnId, column_values: [value] }],
    },
  )
  const hit = data.items_page_by_column_values.items?.[0]
  if (!hit) return null
  const columns: Record<string, MondayColumnValue> = {}
  for (const c of hit.column_values) {
    columns[c.id] = { id: c.id, type: c.type, text: c.text ?? null, value: c.value ?? null }
  }
  return { id: hit.id, name: hit.name, columns }
}

export async function createColumn(
  boardId: number,
  title: string,
  columnType: string,
  defaults?: Record<string, unknown>,
): Promise<string> {
  const data = await gql<{ create_column: { id: string } }>(
    `mutation ($board: ID!, $title: String!, $type: ColumnType!, $defaults: JSON) {
      create_column(board_id: $board, title: $title, column_type: $type, defaults: $defaults) { id }
    }`,
    {
      board: String(boardId),
      title,
      type: columnType,
      defaults: defaults ? JSON.stringify(defaults) : null,
    },
  )
  return data.create_column.id
}

export async function listBoardColumns(
  boardId: number,
): Promise<Array<{ id: string; title: string; type: string }>> {
  const data = await gql<{ boards: Array<{ columns: Array<{ id: string; title: string; type: string }> }> }>(
    `query ($board: [ID!]!) {
      boards(ids: $board) { columns { id title type } }
    }`,
    { board: [String(boardId)] },
  )
  return data.boards?.[0]?.columns ?? []
}

export interface MondayColumnValue {
  id: string
  type: string
  text: string | null
  value: string | null
}

export interface MondayAsset {
  id: string
  url: string
  publicUrl: string | null
  name: string | null
}

export interface MondayItemSnapshot {
  name: string
  columns: Record<string, MondayColumnValue>
  assets: MondayAsset[]
}

export async function getItemForWebhook(itemId: string): Promise<MondayItemSnapshot | null> {
  const data = await gql<{
    items: Array<{
      name: string
      assets: Array<{ id: string; url: string; public_url: string | null; name: string | null }> | null
      column_values: Array<{
        id: string
        type: string
        text: string | null
        value: string | null
      }>
    }>
  }>(
    `query ($id: [ID!]!) {
      items(ids: $id) {
        name
        assets { id url public_url name }
        column_values { id type text value }
      }
    }`,
    { id: [String(itemId)] },
  )
  const item = data.items?.[0]
  if (!item) return null
  const columns: Record<string, MondayColumnValue> = {}
  for (const c of item.column_values) {
    columns[c.id] = { id: c.id, type: c.type, text: c.text ?? null, value: c.value ?? null }
  }
  const assets: MondayAsset[] = (item.assets ?? []).map((a) => ({
    id: a.id,
    url: a.url,
    publicUrl: a.public_url ?? null,
    name: a.name,
  }))
  return { name: item.name, columns, assets }
}

export async function downloadAsset(
  url: string,
  opts: { authenticated?: boolean } = {},
): Promise<{ bytes: Buffer; mime: string }> {
  // `public_url` is a short-lived signed URL — do not send Authorization
  // (some signed URLs reject mixed auth). The standard `url` requires the
  // monday API token.
  const headers = opts.authenticated ? { Authorization: getToken() } : undefined
  const r = await fetch(url, headers ? { headers } : undefined)
  if (!r.ok) throw new Error(`monday asset download ${r.status} ${await r.text().catch(() => "")}`)
  const mime = r.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg"
  const ab = await r.arrayBuffer()
  return { bytes: Buffer.from(ab), mime }
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
