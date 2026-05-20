import "dotenv/config"
import express from "express"
import type { Request, Response } from "express"
import { spawn } from "node:child_process"
import path from "node:path"

const PORT = Number(process.env.MARKETA_HARNESS_PORT || 4242)
const HARNESS_DIR = __dirname

interface MarketaWebhookBody {
  action?: "draft" | "revise"
  pulseId?: string | number
  boardId?: number
}

const app = express()
app.use(express.json({ limit: "5mb" }))

app.get("/health", (_req, res) => {
  res.json({ ok: true, harness: "marketa", port: PORT })
})

function runScript(script: "draft.ts" | "revise.ts", pulseId: string): void {
  const file = path.join(HARNESS_DIR, script)
  const child = spawn("npx", ["tsx", file, pulseId], {
    cwd: path.resolve(HARNESS_DIR, "../.."),
    env: process.env,
    stdio: "inherit",
  })
  child.on("exit", (code) => {
    console.log(`[harness-server] ${script} pulse=${pulseId} exit=${code}`)
  })
}

app.post("/webhook/marketa-draft", (req: Request, res: Response) => {
  const body = req.body as MarketaWebhookBody
  const pulseId = body.pulseId != null ? String(body.pulseId) : ""
  if (!pulseId) return res.status(400).json({ error: "missing pulseId" })
  console.log(`[harness-server] queued draft pulse=${pulseId}`)
  runScript("draft.ts", pulseId)
  res.json({ ok: true, action: "draft", pulseId, async: true })
})

app.post("/webhook/marketa-revise", (req: Request, res: Response) => {
  const body = req.body as MarketaWebhookBody
  const pulseId = body.pulseId != null ? String(body.pulseId) : ""
  if (!pulseId) return res.status(400).json({ error: "missing pulseId" })
  console.log(`[harness-server] queued revise pulse=${pulseId}`)
  runScript("revise.ts", pulseId)
  res.json({ ok: true, action: "revise", pulseId, async: true })
})

app.listen(PORT, () => {
  console.log(`[harness-server] listening on http://localhost:${PORT}`)
  console.log(`[harness-server] endpoints:`)
  console.log(`  POST /webhook/marketa-draft   { pulseId }`)
  console.log(`  POST /webhook/marketa-revise  { pulseId }`)
  console.log(`  GET  /health`)
  console.log(`[harness-server] expose via ngrok:`)
  console.log(`  ngrok http ${PORT}`)
  console.log(`  then set N8N_MARKETA_DRAFT_WEBHOOK_URL=https://<ngrok>/webhook/marketa-draft`)
  console.log(`  and  N8N_MARKETA_REVISE_WEBHOOK_URL=https://<ngrok>/webhook/marketa-revise`)
})
