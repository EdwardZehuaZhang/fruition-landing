/**
 * Upload the AI Strategy hero.gif into Sanity and patch the servicePage doc.
 */
import * as fs from 'fs'
import * as path from 'path'
import { writeClient } from './sanity-client'

async function main() {
  const pageId = 'servicePage-ai-strategy-and-execution'
  const existing = await writeClient.getDocument(pageId)
  if (!existing) throw new Error(`Document ${pageId} not found`)

  const filePath = path.join(__dirname, '..', 'public', 'images', 'ai-strategy', 'hero.gif')
  const buffer = fs.readFileSync(filePath)
  const asset = await writeClient.assets.upload('image', buffer, {
    filename: 'ai-strategy-hero.gif',
  })
  console.log('Uploaded hero.gif:', asset._id)

  await writeClient
    .patch(pageId)
    .set({
      heroImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    })
    .commit()

  console.log(`\u2705 Patched ${pageId} heroImage`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
