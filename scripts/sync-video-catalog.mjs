/**
 * Regenerates src/lib/videoCatalog.generated.ts.
 *
 * Why: <YouTubeEmbed /> is a click-to-load facade, so Googlebot never sees an
 * <iframe> — the only way our embedded videos are discoverable is the
 * VideoObject JSON-LD the component emits. Google *requires* `uploadDate` on
 * that markup; without it Search Console reports `Missing field "uploadDate"`
 * and the video is not eligible for video results. Video URLs come from Sanity
 * (page docs + blog bodies), which carries no upload date, so we resolve the
 * real one from YouTube once and check the result into the repo.
 *
 * Run after adding a video to any page:  node scripts/sync-video-catalog.mjs
 * (Reads Sanity over the public API — no token needed. Hits youtube.com once
 * per video, so it is a manual step, never part of the build.)
 */
import { writeFileSync } from "node:fs"

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "bt6nb58h"
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
const OUT = "src/lib/videoCatalog.generated.ts"

// Video ids hardcoded in components rather than authored in Sanity. Sanity
// discovery cannot see these, so list them here.
const EXTRA_IDS = ["7vtrtlfC1Zg"]

const YT_ID = /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{8,})/g
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

async function discoverIds() {
  // Every published doc, serialised — video urls live in a dozen different
  // fields (heroVideoUrl, bottomVideoUrl, portable-text body blocks, …), so we
  // regex the whole document rather than enumerate them.
  const query = encodeURIComponent('*[!(_id in path("drafts.**"))]')
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
  const { result } = await res.json()
  const ids = new Set(EXTRA_IDS)
  for (const doc of result) {
    for (const [, id] of JSON.stringify(doc).matchAll(YT_ID)) ids.add(id)
  }
  return [...ids].sort()
}

function isoDuration(seconds) {
  if (!seconds) return undefined
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`
}

// YouTube descriptions trail off into link dumps, chapter timestamps,
// affiliate disclaimers and "subscribe!" boilerplate — none of which belongs
// in our structured data, and third-party tutorial channels put their own
// business email and competing-product plugs in there. Keep the opening prose
// and cut at the first promotional marker.
const BOILERPLATE = new RegExp(
  [
    "for business inquir",
    "disclaimer",
    "affiliate",
    "commission",
    "subscribe",
    "connect with us",
    "follow us",
    "join our",
    "sign up",
    "check ?out",
    "watch this",
    "read more",
    "find more info",
    "get (your|a) free",
    "[\\w.+-]+@[\\w-]+\\.[\\w.]+", // email address
    "\\b\\d{1,2}:\\d{2}\\b", // chapter timestamp
    "\\p{Extended_Pictographic}", // emoji — always decoration or a CTA
  ].join("|"),
  "iu"
)

function cleanDescription(raw) {
  if (!raw) return undefined
  let text = raw
    .replace(/(?:https?:\/\/|\bwww\.)\S+/g, "")
    .replace(/\s+/g, " ")
    .trim()
  const promo = text.search(BOILERPLATE)
  if (promo >= 0) text = text.slice(0, promo)
  // Keep at most the first two sentences — beyond that it is rarely on-topic.
  // The lookahead keeps "monday.com" from reading as a sentence boundary.
  const sentences = text.split(/(?<=[.!?])\s+(?=["'\u201c(]?[A-Z])/)
  if (sentences.length > 1) {
    // A CTA sentence ("Get your free trial HERE:") is never the description.
    const prose = sentences.map((x) => x.trim()).filter((x) => !x.endsWith(":"))
    if (prose.length) text = prose.slice(0, 2).join(" ")
  }
  // Drop a trailing "…as you can see here:" style fragment left behind by a
  // stripped URL, then any dangling punctuation.
  text = text.replace(/[^.!?]*:\s*$/, "").replace(/[\s\-\u2013\u2014:,]+$/, "").trim()
  // Whatever survives must still read as a sentence, not a fragment.
  if (text.length < 40) return undefined
  if (text.length <= 300) return text
  const head = text.slice(0, 300)
  const stop = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "))
  return (stop > 120 ? head.slice(0, stop + 1) : head.slice(0, head.lastIndexOf(" ")) + "\u2026").trim()
}

function unescapeJson(s) {
  try {
    return JSON.parse(`"${s}"`)
  } catch {
    return s
  }
}

async function fetchMeta(id) {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { "user-agent": UA } })
  if (!res.ok) return { id, error: `HTTP ${res.status}` }
  const html = await res.text()
  const uploadDate = html.match(/"uploadDate":"([^"]+)"/)?.[1]
  if (!uploadDate) return { id, error: "no uploadDate (private, removed or age-gated?)" }
  const seconds = Number(html.match(/"lengthSeconds":"(\d+)"/)?.[1] || 0)
  const name = unescapeJson(html.match(/"title":"((?:[^"\\]|\\.){3,300})","lengthSeconds"/)?.[1] || "").trim()
  const description = unescapeJson(html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/)?.[1] || "")
  const channel = unescapeJson(html.match(/"ownerChannelName":"((?:[^"\\]|\\.)*)"/)?.[1] || "")
  if (!name) return { id, error: "no title" }
  return {
    id,
    name,
    description: cleanDescription(description),
    uploadDate,
    duration: isoDuration(seconds),
    channel,
  }
}

function serialise(entries) {
  const body = entries
    .map((e) => {
      const lines = [`    name: ${JSON.stringify(e.name)},`]
      if (e.description) lines.push(`    description: ${JSON.stringify(e.description)},`)
      lines.push(`    uploadDate: ${JSON.stringify(e.uploadDate)},`)
      if (e.duration) lines.push(`    duration: ${JSON.stringify(e.duration)},`)
      const key = /^[A-Za-z_$][\w$]*$/.test(e.id) ? e.id : JSON.stringify(e.id)
      return `  // ${e.channel}\n  ${key}: {\n${lines.join("\n")}\n  },`
    })
    .join("\n")
  return `// GENERATED FILE — do not edit by hand.
// Run \`node scripts/sync-video-catalog.mjs\` to regenerate after adding a
// video to a Sanity page or blog post.
//
// Real YouTube metadata for every video embedded on the site. \`uploadDate\` is
// what Google requires before a VideoObject makes a video eligible for video
// results; the rest enriches the markup. See src/lib/videoObject.ts.

import type { VideoCatalogEntry } from "./videoObject"

export const GENERATED_VIDEO_CATALOG: Record<string, VideoCatalogEntry> = {
${body}
}
`
}

const ids = await discoverIds()
console.log(`Discovered ${ids.length} video ids`)
const entries = []
const failures = []
for (const id of ids) {
  const meta = await fetchMeta(id)
  if (meta.error) {
    failures.push(meta)
    console.log(`  ✗ ${id}  ${meta.error}`)
  } else {
    entries.push(meta)
    console.log(`  ✓ ${id}  ${meta.uploadDate.slice(0, 10)}  ${meta.name.slice(0, 60)}`)
  }
}
writeFileSync(OUT, serialise(entries))
console.log(`\nWrote ${entries.length} entries to ${OUT}`)
if (failures.length) {
  console.log(
    `${failures.length} unresolved — these emit no VideoObject at all (better than invalid markup):`
  )
  for (const f of failures) console.log(`  ${f.id}: ${f.error}`)
}
