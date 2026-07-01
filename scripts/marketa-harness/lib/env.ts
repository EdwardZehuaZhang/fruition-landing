/**
 * Load env from .env.local (this repo has no plain .env, so `dotenv/config`
 * loads nothing). Import this FIRST in any harness entrypoint, before modules
 * that read process.env at load time (sanityPosts, draftPrompt).
 */
import { config } from "dotenv"
import { existsSync } from "node:fs"

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) config({ path: file, override: false })
}
