import "dotenv/config"
import { VOICE_GUIDE_STUB } from "./marketa-harness/lib/voice-guide"

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
const TOKEN = process.env.SANITY_WRITE_TOKEN

async function main() {
  if (!PROJECT_ID || !DATASET || !TOKEN) {
    throw new Error("missing Sanity env (NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN)")
  }
  const doc = {
    _id: "voice-guide-fruition",
    _type: "voiceGuide",
    title: "Fruition Voice Guide",
    body: VOICE_GUIDE_STUB,
    version: "v0.1-stub",
    updatedAt: new Date().toISOString(),
  }
  const r = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
    },
  )
  if (!r.ok) throw new Error(`sanity ${r.status} ${await r.text()}`)
  const json = await r.json()
  console.log("✓ seeded voice-guide-fruition")
  console.log(JSON.stringify(json, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
