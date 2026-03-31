require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'bt6nb58h', dataset: 'production',
  apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false,
})

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchOgImage(url) {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) })
    if (!res.ok) return null
    const html = await res.text()
    const match = html.match(/<meta\s+property=["'']og:image["'']\s+content=["'']([^"'']+)["'']/i)
    return match ? match[1] : null
  } catch (err) {
    console.log(`  Fetch error: ${err.message}`)
    return null
  }
}

async function run() {
  const posts = await client.fetch('*[_type == "blogPost"]{ _id, title, "slug": slug.current, coverImage }')
  console.log(`Total posts: ${posts.length}`)
  
  let migrated = 0, skipped = 0, errors = 0

  for (let i = 0; i < posts.length; i++) {  // TEST: first 10 posts only
    const post = posts[i]
    if (post.coverImage && post.coverImage.asset) {
      skipped++
      continue
    }
    
    console.log(`[${i+1}] ${post.title.substring(0,50)}`)
    
    const urls = [
      `https://www.fruitionservices.io/post/${post.slug}`,
      `https://www.fruitionservices.io/consulting-blog/${post.slug}`
    ]
    
    let imageUrl = null
    for (const url of urls) {
      imageUrl = await fetchOgImage(url)
      if (imageUrl) {
        console.log(`  Found: ${url}`)
        break
      }
      await sleep(800)
    }
    
    if (!imageUrl) {
      console.log('  No og:image')
      errors++
      continue
    }
    
    console.log(`  Image: ${imageUrl.substring(0,70)}`)
    
    try {
      const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) })
      if (!imgRes.ok) throw new Error('Image fetch failed: ' + imgRes.status)
      const buffer = Buffer.from(await imgRes.arrayBuffer())
      console.log(`  Downloaded: ${buffer.length} bytes`)
      await sleep(500)
      
      const asset = await client.assets.upload('image', buffer, {
        filename: post.slug.substring(0,100) + '.jpg',
        contentType: 'image/jpeg'
      })
      console.log(`  Uploaded asset: ${asset._id}`)
      await sleep(500)
      
      await client.patch(post._id).set({
        coverImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      }).commit()
      
      migrated++
      console.log('  ✓ Done')
      await sleep(800)
    } catch (err) {
      console.error(`  ERROR: ${err.message}`)
      errors++
    }
  }
  
  console.log(`\nTest run: ${migrated} migrated, ${skipped} skipped, ${errors} errors`)
}

run().catch(e => { console.error(e.stack); process.exit(1) })
