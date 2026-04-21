import { writeClient } from './sanity-client'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { randomBytes } from 'crypto'

type ImageRef = { _type: 'image'; asset: { _type: 'reference'; _ref: string } }

interface TestimonialSeed {
  key: string
  clientName: string
  clientRole: string
  clientCompany: string
  quote: string
  photoFile?: string
  docId: string
}

const DESKTOP = path.join(os.homedir(), 'Desktop')

// 15 testimonials in display order. Page 1 = first 5, Page 2 = next 5, Page 3 = last 5.
const TESTIMONIALS: TestimonialSeed[] = [
  // ---- Page 1 ----
  {
    key: 'testimonial-01',
    docId: 'casestudy-0',
    clientName: 'Jade Wood',
    clientRole: 'Managing Director',
    clientCompany: 'Popology',
    quote:
      "We are now utilising monday.com to its full potential, from lead through design and production teams - everyone knows what stage our projects are in, what's next and what our process is.",
    photoFile: 'Jade Wood.avif',
  },
  {
    key: 'testimonial-02',
    docId: 'casestudy-1',
    clientName: 'Mairhead McKinley',
    clientRole: 'Delivery Manager',
    clientCompany: 'Givergy',
    quote:
      'We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information—eliminating the need to email around for updates.',
    photoFile: 'Mairhead McKinley.avif',
  },
  {
    key: 'testimonial-03',
    docId: 'casestudy-2',
    clientName: 'Brandon-Lee Horridge',
    clientRole: 'Managing Director',
    clientCompany: 'BL Air Conditioning',
    quote: 'This system will save hundreds of thousands of dollars a year guaranteed.',
    photoFile: 'Brandon-Lee Horridge.avif',
  },
  {
    key: 'testimonial-04',
    docId: 'casestudy-3',
    clientName: 'Ron Amaram',
    clientRole: 'General Manager',
    clientCompany: 'Risk 2 Solutions',
    quote:
      "Fruition have been instrumental in moving us to a 'single source of truth' system for managing sales and projects.",
    photoFile: 'Ron Amaram.avif',
  },
  {
    key: 'testimonial-05',
    docId: 'casestudy-4',
    clientName: 'Lorenzo Tejada-Orrell',
    clientRole: 'Chief Innovation Officer',
    clientCompany: 'CLSQ',
    quote:
      'Since implementing monday.com, CLSQ has experienced a significant transformation in operational efficiency.',
    photoFile: 'Lorenzo Tejada-Orrell.avif',
  },

  // ---- Page 2 ----
  {
    key: 'testimonial-06',
    docId: 'casestudy-5',
    clientName: 'Louis Stenmark',
    clientRole: 'Co-Founder',
    clientCompany: 'Windfall Bio',
    quote:
      "The Fruition team helped me get the most out of monday.com. They provided me with in depth instruction, custom templates and helped me solve problems unique to our early stage company's needs.",
    photoFile: 'Louis Stenmark.avif',
  },
  {
    key: 'testimonial-07',
    docId: 'casestudy-6',
    clientName: 'Luke Reddin',
    clientRole: 'Director',
    clientCompany: 'Clean Power Australia',
    quote:
      'Josh and his team were excellent from start to finish on building our monday.com integrations and automations. Very happy with them.',
    photoFile: 'Luke Reddin.avif',
  },
  {
    key: 'testimonial-08',
    docId: 'casestudy-7',
    clientName: 'Brad Cannon',
    clientRole: 'Senior Account Executive',
    clientCompany: 'monday.com',
    quote:
      "Having experienced working with Josh directly at monday.com, I'd have no hesitation recommending Josh in any consulting engagement.",
    photoFile: 'Brad Cannon.avif',
  },
  {
    key: 'testimonial-09',
    docId: 'casestudy-8',
    clientName: 'Bianca Genesio',
    clientRole: 'Central Manager',
    clientCompany: 'G8 Education',
    quote: "Couldn't be more happier. Thank you Josh for your hard work and commitment. Highly recommend!",
    photoFile: 'Bianca Genesio.avif',
  },
  {
    key: 'testimonial-10',
    docId: 'casestudy-9',
    clientName: "Anthony D'Agostino",
    clientRole: '',
    clientCompany: 'True Steel Frames',
    quote:
      'Josh & the Fruition team were great to deal with and very thorough. would highly recommend!',
    photoFile: "Anthony D'Agostino.avif",
  },

  // ---- Page 3 ----
  {
    key: 'testimonial-11',
    docId: 'casestudy-10',
    clientName: 'Jemma Ryan',
    clientRole: '',
    clientCompany: '',
    quote:
      'What a pleasant and wonderful experience it was to be dealing with Josh and the fruition team. It made it a smooth and easy process for us and our team. They were all very professional and great to speak with. Looking forward to working again with you in the future.',
  },
  {
    key: 'testimonial-12',
    docId: 'casestudy-11',
    clientName: 'Teddy Mangion',
    clientRole: '',
    clientCompany: '',
    quote:
      'Josh and the Fruition team were an absolute pleasure to work with. They were professional, knowledgeable, and made the whole process smooth and straightforward. I would highly recommend them to anyone looking for quality software solutions.',
  },
  {
    key: 'testimonial-13',
    docId: 'casestudy-12',
    clientName: 'Anthony Rowson',
    clientRole: '',
    clientCompany: '',
    quote:
      'We are very Happy Little Campers, and our system is easy to use, portable, flexible and very informative and gives us a great insight to ALL facets of the business and where our communication and marketing efforts are best targeted to maximize our returns for effort. I would highly recommend you have an initial chat with these guys. They know their stuff.',
  },
  {
    key: 'testimonial-14',
    docId: 'casestudy-13',
    clientName: 'Kerrie E',
    clientRole: '',
    clientCompany: '',
    quote:
      'A big thanks to Josh - spent a couple of hours working through ways to get our Event Project Plan on Monday into good shape. We know have a much more user friendly and useful Project Plan and we have made use of a variety of different automations to streamline processes. When our NFP is ready to undertake more complex Monday activities I will definitely be looking to Fruition for support.',
  },
  {
    key: 'testimonial-15',
    docId: 'casestudy-14',
    clientName: 'Tedd Long',
    clientRole: '',
    clientCompany: 'MCAG Inc.',
    quote:
      'Zach provided excellent training on Monday.com and he included some great insights on how we can best use the project management features. Thank you!',
    photoFile: 'Tedd Long.avif',
  },
]

async function uploadImage(filePath: string): Promise<ImageRef | null> {
  if (!fs.existsSync(filePath)) {
    console.warn(`  [skip] file not found: ${filePath}`)
    return null
  }
  const buffer = fs.readFileSync(filePath)
  const asset = await writeClient.assets.upload('image', buffer, {
    filename: path.basename(filePath),
  })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

function genKey(): string {
  return randomBytes(6).toString('hex')
}

async function main() {
  console.log('Uploading photos and building photo map...')
  const photoMap = new Map<string, ImageRef>()
  for (const t of TESTIMONIALS) {
    if (!t.photoFile) continue
    const full = path.join(DESKTOP, t.photoFile)
    console.log(`  Uploading ${t.photoFile}`)
    const ref = await uploadImage(full)
    if (ref) photoMap.set(t.photoFile, ref)
  }

  console.log(`\nUpdating ${TESTIMONIALS.length} caseStudy documents...`)
  for (const t of TESTIMONIALS) {
    const doc: { _id: string; _type: 'caseStudy'; [key: string]: unknown } = {
      _id: t.docId,
      _type: 'caseStudy',
      clientName: t.clientName,
      clientRole: t.clientRole || undefined,
      clientCompany: t.clientCompany || undefined,
      quote: t.quote,
    }
    const photo = t.photoFile ? photoMap.get(t.photoFile) : undefined
    if (photo) doc.profilePhoto = photo
    await writeClient.createOrReplace(doc)
    console.log(`  [ok] ${t.docId} — ${t.clientName}`)
  }

  console.log('\nRewriting homePage.contentBlocks to contain all 15 testimonialBlock entries...')
  const home = await writeClient.fetch<{ _id: string; contentBlocks: Array<{ _key: string; _type: string; [k: string]: unknown }> }>(
    '*[_type == "homePage"][0]{ _id, contentBlocks }'
  )
  if (!home?._id) {
    throw new Error('No homePage document found')
  }

  // Find the range of consecutive existing testimonialBlock entries to replace.
  const firstIdx = home.contentBlocks.findIndex((b) => b._type === 'testimonialBlock')
  if (firstIdx === -1) {
    throw new Error('No testimonialBlock entries found on homePage to replace')
  }
  let lastIdx = firstIdx
  while (
    lastIdx + 1 < home.contentBlocks.length &&
    home.contentBlocks[lastIdx + 1]._type === 'testimonialBlock'
  ) {
    lastIdx++
  }
  console.log(`  Replacing blocks [${firstIdx}..${lastIdx}] (${lastIdx - firstIdx + 1} items)`)

  const newTestimonialBlocks = TESTIMONIALS.map((t) => {
    const block: Record<string, unknown> = {
      _key: t.key + '-' + genKey().slice(0, 4),
      _type: 'testimonialBlock',
      blockType: 'testimonialBlock',
      quote: t.quote,
      authorName: t.clientName,
      authorRole: t.clientRole || undefined,
      company: t.clientCompany || undefined,
    }
    if (t.photoFile) {
      const photo = photoMap.get(t.photoFile)
      if (photo) block.profilePhoto = photo
    }
    return block
  })

  const next = [
    ...home.contentBlocks.slice(0, firstIdx),
    ...newTestimonialBlocks,
    ...home.contentBlocks.slice(lastIdx + 1),
  ]

  await writeClient.patch(home._id).set({ contentBlocks: next }).commit({ autoGenerateArrayKeys: false })
  console.log(`  [ok] homepage contentBlocks updated (${next.length} total blocks)`)

  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
