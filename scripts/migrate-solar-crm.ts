import { writeClient } from './sanity-client'
import * as fs from 'fs'
import * as path from 'path'

async function uploadImage(filePath: string, filename: string) {
  const buffer = fs.readFileSync(filePath)
  const asset = await writeClient.assets.upload('image', buffer, { filename })
  return asset._id
}

async function main() {
  const pageId = 'solutionPage-solar-crm-solution'
  const existing = await writeClient.getDocument(pageId)
  if (!existing) throw new Error(`Document ${pageId} not found`)

  const imageDir = path.join(__dirname, '..', 'public', 'images', 'solar-crm')
  console.log('Uploading 4 avif images to Sanity...')
  const [invoiceId, portfolioId, inventoryId, salesId] = await Promise.all([
    uploadImage(path.join(imageDir, 'invoice-board.avif'), 'solar-crm-invoice-board.avif'),
    uploadImage(path.join(imageDir, 'portfolio-board.avif'), 'solar-crm-portfolio-board.avif'),
    uploadImage(path.join(imageDir, 'inventory-overview.avif'), 'solar-crm-inventory-overview.avif'),
    uploadImage(path.join(imageDir, 'sales-dashboard.avif'), 'solar-crm-sales-dashboard.avif'),
  ])
  console.log('Uploaded images:', { invoiceId, portfolioId, inventoryId, salesId })

  const imageByEyebrow: Record<string, string> = {
    'FASTER INVOICING': invoiceId,
    'PORTFOLIO MANAGEMENT': portfolioId,
    'INVENTORY TRACKING': inventoryId,
    'FINANCIAL FORECASTING': salesId,
  }

  const existingSolutionCards = (existing.solutionCards as Array<Record<string, unknown>>) || []
  const solutionCards = existingSolutionCards.map((card) => {
    const eyebrow = typeof card.eyebrow === 'string' ? card.eyebrow : ''
    const assetId = imageByEyebrow[eyebrow]
    if (!assetId) return card
    return {
      ...card,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      },
    }
  })

  // Move existing capabilitiesCards (the 6 "Facing these challenges?" cards)
  // from capabilitiesCards (renders late) to secondaryCapabilitiesCards (renders
  // before the key features section).
  const challengeCards = (existing.capabilitiesCards as Array<Record<string, unknown>>) || []

  console.log('Patching page...')
  await writeClient
    .patch(pageId)
    .set({
      heroLocalVideoSrc: '/videos/solar-crm-hero.mp4',

      secondaryCapabilitiesEyebrow: existing.capabilitiesEyebrow || null,
      secondaryCapabilitiesHeading: 'Facing these ',
      secondaryCapabilitiesHeadingAccent: 'challenges?',
      secondaryCapabilitiesSubheading: existing.capabilitiesSubheading || null,
      secondaryCapabilitiesCards: challengeCards,
      secondaryCapabilitiesColumns: 3,

      solutionCards,

      comparisonLayout: 'sideBySide',
    })
    .unset([
      'capabilitiesCards',
      'capabilitiesHeading',
      'capabilitiesHeadingAccent',
      'capabilitiesEyebrow',
      'capabilitiesSubheading',
    ])
    .commit()

  console.log(`✅ Patched ${pageId}:`)
  console.log('  - heroLocalVideoSrc → /videos/solar-crm-hero.mp4')
  console.log('  - Moved 6 challenge cards to secondaryCapabilitiesCards ("Facing these challenges?")')
  console.log('  - Added 4 images to solutionCards')
  console.log('  - Set comparisonLayout = sideBySide')
}

main().catch((err) => { console.error(err); process.exit(1) })
