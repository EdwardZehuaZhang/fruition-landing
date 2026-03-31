require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@sanity/client")

const client = createClient({
  projectId: "bt6nb58h", dataset: "production",
  apiVersion: "2024-01-01", token: process.env.SANITY_WRITE_TOKEN, useCdn: false,
})

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Extract YouTube video ID and return a clean embed URL
function parseVideoUrl(src) {
  if (!src) return null
  // youtube.com/embed/VIDEO_ID
  const embedMatch = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) return `https://www.youtube.com/watch?v=${embedMatch[1]}`
  // youtu.be/VIDEO_ID
  const shortMatch = src.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return `https://www.youtube.com/watch?v=${shortMatch[1]}`
  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = src.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return `https://www.youtube.com/watch?v=${watchMatch[1]}`
  return null
}

async function run() {
  // Get all blog posts - check which ones already have videoUrls
  const posts = await client.fetch('*[_type == "blogPost"]{ _id, "slug": slug.current, videoUrls }')
  console.log(`Total posts: ${posts.length}`)

  let migrated = 0, skipped = 0, noVideo = 0, errors = 0

  for (const post of posts) {
    if (post.videoUrls && post.videoUrls.length > 0) { skipped++; continue }

    const url = `https://www.fruitionservices.io/post/${post.slug}`
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36" },
        signal: AbortSignal.timeout(15000)
      })
      if (!res.ok) throw new Error("HTTP " + res.status)
      const html = await res.text()

      // Extract all YouTube iframes and video src attributes
      const videoUrls = []
      const iframeSrcs = [...html.matchAll(/iframe[^>]+src=["']([^"']+)["']/gi)].map(m => m[1])
      for (const src of iframeSrcs) {
        const parsed = parseVideoUrl(src)
        if (parsed && !videoUrls.includes(parsed)) videoUrls.push(parsed)
      }
      // Also check for YouTube URLs in data-src (lazy loaded iframes)
      const dataSrcs = [...html.matchAll(/data-src=["']([^"']*youtube[^"']*)["']/gi)].map(m => m[1])
      for (const src of dataSrcs) {
        const parsed = parseVideoUrl(src)
        if (parsed && !videoUrls.includes(parsed)) videoUrls.push(parsed)
      }

      if (videoUrls.length > 0) {
        await client.patch(post._id).set({ videoUrls }).commit()
        console.log(`[+] ${post.slug} -> ${videoUrls.length} video(s): ${videoUrls.join(", ")}`)
        migrated++
      } else {
        noVideo++
      }
    } catch (err) {
      console.error(`[!] ${post.slug}: ${err.message}`)
      errors++
    }
    await sleep(200)
  }

  console.log(`\nPhase 4: ${migrated} posts with videos patched, ${skipped} already had data, ${noVideo} no videos found, ${errors} errors`)
}

run().catch(e => { console.error(e.stack); process.exit(1) })