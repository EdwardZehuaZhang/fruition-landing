import * as fs from 'fs'
import * as path from 'path'
import { writeClient } from './sanity-client'

const DOC_ID = 'makePartnersPage'

async function main() {
  const filePath = path.join(
    process.cwd(),
    'public/images/make-partners-hero.png',
  )
  const buffer = fs.readFileSync(filePath)
  const asset = await writeClient.assets.upload('image', buffer, {
    filename: 'make-partners-hero.png',
    contentType: 'image/png',
  })
  console.log(`Uploaded asset: ${asset._id}`)

  const heroImage = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }

  const existing = await writeClient.fetch(
    `*[_type == "makePartnersPage"][0]{_id}`,
  )

  if (existing?._id) {
    await writeClient.patch(existing._id).set({ heroImage }).commit()
    console.log(`Patched ${existing._id}.heroImage -> ${asset._id}`)
  } else {
    const created = await writeClient.createOrReplace({
      _id: DOC_ID,
      _type: 'makePartnersPage',
      heroImage,
    })
    console.log(`Created ${created._id} with heroImage -> ${asset._id}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
