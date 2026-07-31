/**
 * One-off: upload the client logo PNGs and append them to
 * siteSettings.carouselLogos.
 *
 *   npx tsx scripts/upload-client-logos.ts <dir> [--dry]
 *
 * Re-running is safe — an entry whose alt text already exists on the document
 * is skipped rather than duplicated.
 */
import { readFileSync, readdirSync } from "node:fs"
import { basename, extname, join } from "node:path"
import { randomUUID } from "node:crypto"

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
const TOKEN = process.env.SANITY_WRITE_TOKEN

if (!PROJECT_ID || !DATASET || !TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET / SANITY_WRITE_TOKEN")
}

const API = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`
const dir = process.argv[2]
const dryRun = process.argv.includes("--dry")
if (!dir) throw new Error("Usage: upload-client-logos.ts <dir> [--dry]")

/**
 * Brands already on the document under generic "Client N" alt text — skipped so
 * the grid doesn't show the same logo twice.
 */
const ALREADY_ON_DOC = [/^CSIRO/i, /^Specsavers/i, /^Queensland_Government/i]

/** Filenames the export left unidentifiable; named by hand. */
const MANUAL_ALT: Record<string, string> = {
  "Aquamonix_Emflux_Logo_Inline_rgb_600px 1.png": "Aquamonix Emflux",
  "Gunn-Agri-Website-logo 1.png": "Gunn Agri",
  "post_Windfall_Bio_593eda90f6 1.png": "Windfall Bio",
  "SLSS_LeftLockUp_CMYK 1.png": "SLSS",
}

/** "Johns_Lyng_Group 1.png" → "Johns Lyng Group". Export-suffix noise removed. */
function altFromFilename(file: string): string {
  if (MANUAL_ALT[file]) return MANUAL_ALT[file]
  return basename(file, extname(file))
    .replace(/\.svg$/i, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\d{3,4}x\d{3,4}\b/gi, "") // "600x400"
    .replace(/\s*\b(CMYK|LeftLockUp|rgb|logo)\b/gi, "")
    .replace(/\b\d+px\b/gi, "")
    .replace(/(\s+\d+)+$/, "") // trailing export counters, e.g. " 1", " 1 1"
    .replace(/\s+/g, " ")
    .trim()
    // Some exports are named only "logo"/"logo_32120" — keep the raw stem so
    // the entry is still findable in Studio and can be renamed by hand.
    || basename(file, extname(file)).replace(/[_-]/g, " ").trim()
}

async function sanity(path: string, init: RequestInit) {
  const r = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(init.headers ?? {}) },
  })
  const body = await r.json()
  if (!r.ok) throw new Error(`${path} → ${r.status} ${JSON.stringify(body).slice(0, 300)}`)
  return body
}

async function main() {
  const files = readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f))
    .filter((f) => !ALREADY_ON_DOC.some((re) => re.test(f)))
    .sort()

  const doc = await sanity(
    `/data/query/${DATASET}?query=${encodeURIComponent('*[_type=="siteSettings"][0]{_id,carouselLogos}')}`,
    { method: "GET" },
  )
  const settings = doc.result
  if (!settings?._id) throw new Error("siteSettings document not found")

  const existing: string[] = (settings.carouselLogos ?? []).map((l: { alt?: string }) => l.alt ?? "")
  const pending = files.filter((f) => !existing.includes(altFromFilename(f)))

  console.log(`${files.length} files, ${existing.length} logos already on the document`)
  console.log(`${pending.length} to upload:`)
  for (const f of pending) console.log(`   ${altFromFilename(f).padEnd(34)} ← ${f}`)
  if (dryRun) return console.log("\n--dry: nothing written")

  const entries = []
  for (const file of pending) {
    const bytes = readFileSync(join(dir, file))
    const ext = extname(file).slice(1).toLowerCase()
    const mime = ext === "svg" ? "image/svg+xml" : ext === "png" ? "image/png" : "image/jpeg"
    const up = await sanity(`/assets/images/${DATASET}?filename=${encodeURIComponent(file)}`, {
      method: "POST",
      headers: { "Content-Type": mime },
      body: new Uint8Array(bytes),
    })
    entries.push({
      _key: randomUUID().replace(/-/g, "").slice(0, 12),
      _type: "clientLogo",
      alt: altFromFilename(file),
      image: { _type: "image", asset: { _type: "reference", _ref: up.document._id } },
    })
    console.log(`  uploaded ${file}`)
  }

  if (!entries.length) return console.log("nothing new to add")

  await sanity(`/data/mutate/${DATASET}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mutations: [
        {
          patch: {
            id: settings._id,
            setIfMissing: { carouselLogos: [] },
            insert: { after: "carouselLogos[-1]", items: entries },
          },
        },
      ],
    }),
  })
  console.log(`\nappended ${entries.length} logos to carouselLogos`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
