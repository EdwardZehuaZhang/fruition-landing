#!/usr/bin/env node
/**
 * One-time subscribe a monday webhook for the Fruition Team board
 * so monday.com Form submissions trigger /api/webhooks/monday.
 *
 * Usage:
 *   node scripts/subscribe-monday-webhook.mjs <public-url>
 *
 * Example:
 *   node scripts/subscribe-monday-webhook.mjs https://www.fruitionservices.com/api/webhooks/monday
 *
 * Requires env (read from .env.local):
 *   MONDAY_API_TOKEN      — monday API v2 personal token
 *   MONDAY_WEBHOOK_SECRET — shared secret echoed in the Authorization header
 *
 * Prints the created webhook id. To tear down later:
 *   gql `mutation { delete_webhook(id: <id>) { id } }`
 */

import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const MONDAY_TOKEN = process.env.MONDAY_API_TOKEN
const SECRET = process.env.MONDAY_WEBHOOK_SECRET
if (!MONDAY_TOKEN || !SECRET) {
  console.error("Missing MONDAY_API_TOKEN or MONDAY_WEBHOOK_SECRET.")
  process.exit(1)
}

const url = process.argv[2]
if (!url || !/^https?:\/\//i.test(url)) {
  console.error("Usage: node scripts/subscribe-monday-webhook.mjs <public-url>")
  process.exit(1)
}

const BOARD_ID = 1879224155
const MONDAY_GQL = "https://api.monday.com/v2"

const query = `
  mutation ($board: ID!, $url: String!, $config: JSON!) {
    create_webhook(
      board_id: $board,
      url: $url,
      event: create_pulse,
      config: $config
    ) { id board_id }
  }
`

const variables = {
  board: String(BOARD_ID),
  url,
  config: JSON.stringify({ authorization: SECRET }),
}

const r = await fetch(MONDAY_GQL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: MONDAY_TOKEN,
    "API-Version": "2024-01",
  },
  body: JSON.stringify({ query, variables }),
})
const j = await r.json()
if (j.errors) {
  console.error("monday gql errors:", JSON.stringify(j.errors, null, 2))
  process.exit(1)
}
const created = j.data?.create_webhook
if (!created) {
  console.error("no webhook returned:", JSON.stringify(j, null, 2))
  process.exit(1)
}
console.log(`Subscribed monday webhook id=${created.id} board=${created.board_id} → ${url}`)
