import * as fs from 'fs'
import * as path from 'path'
import { writeClient } from './sanity-client'

const SLUG = 'certified-atlassian-partner'
const TARGET_HEADING = 'Boost adoption and team engagement'

async function main() {
  const filePath = path.join(
    process.cwd(),
    'public/images/atlassian-boost-adoption.gif',
  )
  const buffer = fs.readFileSync(filePath)
  const asset = await writeClient.assets.upload('image', buffer, {
    filename: 'atlassian-boost-adoption.gif',
    contentType: 'image/gif',
  })
  console.log(`Uploaded asset: ${asset._id}`)

  const doc = await writeClient.fetch(
    `*[_type == "partnershipPage" && slug.current == $slug][0]{_id, solutionCards}`,
    { slug: SLUG },
  )
  if (!doc?._id) {
    throw new Error(`Partnership page not found for slug: ${SLUG}`)
  }

  const cards: Array<Record<string, unknown>> = doc.solutionCards || []
  const idx = cards.findIndex(
    (c) => (c?.heading as string | undefined) === TARGET_HEADING,
  )
  if (idx === -1) {
    throw new Error(
      `Card with heading "${TARGET_HEADING}" not found on ${SLUG}`,
    )
  }

  const imageRef = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }

  await writeClient
    .patch(doc._id)
    .set({ [`solutionCards[${idx}].image`]: imageRef })
    .commit()

  console.log(
    `Patched ${doc._id} solutionCards[${idx}].image -> ${asset._id}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
