/**
 * Standalone monday helper for the Marketa harness. Mirrors
 * src/lib/mondayClient but avoids the Next.js import graph so tsx
 * scripts run without bundling.
 */

const MONDAY_GQL = "https://api.monday.com/v2"

function getToken(): string {
  const t = process.env.MONDAY_API_TOKEN
  if (!t) throw new Error("MONDAY_API_TOKEN missing in env")
  return t
}

async function gql<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
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

export const BOARD_ID = 5028637584
export const GROUP_TOPICS = "topics"

export const COL = {
  STAGE: "color_mm3gj287",
  TIER: "color_mm3gpz9w",
  BRIEF: "long_text_mm3grk84",
  TARGET_KW: "text_mm3gzj88",
  INDUSTRY: "dropdown_mm3gb7wm",
  DRAFT_BODY: "long_text_mm3gj0s8",
  EDIT_NOTES: "long_text_mm3g2bp9",
  SANITY_DOC_ID: "text_mm3g4ab9",
  PUBLISHED_URL: "link_mm3gpqq1",
} as const

export interface MondayColumnValue {
  id: string
  type: string
  text: string | null
  value: string | null
}

export interface MondayItemSnapshot {
  id: string
  name: string
  columns: Record<string, MondayColumnValue>
}

export async function createIdea(opts: {
  title: string
  brief: string
  targetKeyword: string
  industry: string
}): Promise<string> {
  const colVals: Record<string, unknown> = {
    [COL.BRIEF]: { text: opts.brief },
    [COL.TARGET_KW]: opts.targetKeyword,
    [COL.INDUSTRY]: { labels: [opts.industry] },
    [COL.STAGE]: { label: "Idea proposed" },
    [COL.TIER]: { label: "Explicit" },
  }
  const data = await gql<{ create_item: { id: string } }>(
    `mutation ($board: ID!, $group: String!, $name: String!, $vals: JSON!) {
      create_item(board_id: $board, group_id: $group, item_name: $name, column_values: $vals) { id }
    }`,
    {
      board: String(BOARD_ID),
      group: GROUP_TOPICS,
      name: opts.title,
      vals: JSON.stringify(colVals),
    },
  )
  return data.create_item.id
}

export async function getItem(itemId: string): Promise<MondayItemSnapshot | null> {
  const data = await gql<{
    items: Array<{
      id: string
      name: string
      column_values: Array<{ id: string; type: string; text: string | null; value: string | null }>
    }>
  }>(
    `query ($id: [ID!]!) {
      items(ids: $id) {
        id name
        column_values { id type text value }
      }
    }`,
    { id: [String(itemId)] },
  )
  const item = data.items?.[0]
  if (!item) return null
  const columns: Record<string, MondayColumnValue> = {}
  for (const c of item.column_values) {
    columns[c.id] = c
  }
  return { id: item.id, name: item.name, columns }
}

export async function patchItem(
  itemId: string,
  values: Record<string, unknown>,
): Promise<void> {
  if (Object.keys(values).length === 0) return
  await gql(
    `mutation ($board: ID!, $item: ID!, $vals: JSON!) {
      change_multiple_column_values(board_id: $board, item_id: $item, column_values: $vals) { id }
    }`,
    { board: String(BOARD_ID), item: String(itemId), vals: JSON.stringify(values) },
  )
}

export async function recentBlogTitles(): Promise<string[]> {
  const data = await gql<{
    boards: Array<{
      items_page: { items: Array<{ name: string; column_values: Array<{ id: string; text: string | null }> }> }
    }>
  }>(
    `query {
      boards(ids: [${BOARD_ID}]) {
        items_page(limit: 100) {
          items {
            name
            column_values(ids: ["${COL.STAGE}"]) { id text }
          }
        }
      }
    }`,
  )
  const items = data.boards[0]?.items_page.items ?? []
  return items
    .filter((it) => it.column_values.find((c) => c.id === COL.STAGE)?.text === "Published")
    .map((it) => it.name)
}
