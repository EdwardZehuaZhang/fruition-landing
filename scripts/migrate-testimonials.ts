import { writeClient } from './sanity-client'
import * as fs from 'fs'
import * as path from 'path'

const TESTIMONIALS = [
  {
    clientName: "Jade Wood",
    clientRole: "Managing Director",
    clientCompany: "Popology",
    quote: "We are now utilising monday.com to its full potential, from lead through design and production teams - everyone knows what stage our projects are in, what's next and what our process is.",
    photoFile: "testimonial-jade-wood.jpg",
  },
  {
    clientName: "Mairhead McKinley",
    clientRole: "Delivery Manager",
    clientCompany: "Givergy",
    quote: "We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information—eliminating the need to email around for updates.",
    photoFile: "testimonial-mairhead-mckinley.png",
  },
  {
    clientName: "Brandon-Lee Horridge",
    clientRole: "Managing Director",
    clientCompany: "BL Air Conditioning",
    quote: "This system will save hundreds of thousands of dollars a year guaranteed.",
    photoFile: "testimonial-brandon-lee-horridge.png",
  },
  {
    clientName: "Ron Amaram",
    clientRole: "General Manager",
    clientCompany: "Risk 2 Solutions",
    quote: "Fruition have been instrumental in moving us to a 'single source of truth' system for managing sales and projects.",
    photoFile: "testimonial-ron-amaram.jpg",
  },
  {
    clientName: "Lorenzo Tejada-Orrell",
    clientRole: "Chief Innovation Officer",
    clientCompany: "CLSQ",
    quote: "Since implementing monday.com, CLSQ has experienced a significant transformation in operational efficiency.",
    photoFile: "testimonial-lorenzo-tejada-orrell.png",
  },
  {
    clientName: "Louis Stenmark",
    clientRole: "Co-Founder",
    clientCompany: "Windfall Bio",
    quote: "The Fruition team helped me get the most out of monday.com. They provided me with in depth instruction, custom templates and helped me solve problems unique to our early stage company's needs.",
  },
  {
    clientName: "Luke Reddin",
    clientRole: "Director",
    clientCompany: "Clean Power Australia",
    quote: "Josh and his team were excellent from start to finish on building our monday.com integrations and automations. Very happy with them.",
  },
  {
    clientName: "Brad Cannon",
    clientRole: "Senior Account Executive",
    clientCompany: "monday.com",
    quote: "Having experienced working with Josh directly at monday.com, I'd have no hesitation recommending Josh in any consulting engagement.",
  },
  {
    clientName: "Bianca Genesio",
    clientRole: "Central Manager",
    clientCompany: "G8 Education",
    quote: "Couldn't be more happier. Thank you Josh for your hard work and commitment. Highly recommend!",
  },
  {
    clientName: "Anthony D'Agostino",
    clientRole: "",
    clientCompany: "True Steel Frames",
    quote: "Josh & the Fruition team were great to deal with and very thorough. would highly recommend!",
  },
  {
    clientName: "Jemma Ryan",
    clientRole: "",
    clientCompany: "",
    quote: "What a pleasant and wonderful experience it was to be dealing with Josh and the fruition team. It made it a smooth and easy process for us and our team. They were all very professional and great to speak with. Looking forward to working again with you in the future.",
  },
  {
    clientName: "Teddy Mangion",
    clientRole: "",
    clientCompany: "",
    quote: "Josh and the Fruition team were an absolute pleasure to work with. They were professional, knowledgeable, and made the whole process smooth and straightforward. I would highly recommend them to anyone looking for quality software solutions.",
  },
  {
    clientName: "Anthony Rowson",
    clientRole: "",
    clientCompany: "",
    quote: "We are very Happy Little Campers, and our system is easy to use, portable, flexible and very informative and gives us a great insight to ALL facets of the business and where our communication and marketing efforts are best targeted to maximize our returns for effort. I would highly recommend you have an initial chat with these guys. They know their stuff.",
  },
  {
    clientName: "Kerrie E",
    clientRole: "",
    clientCompany: "",
    quote: "A big thanks to Josh - spent a couple of hours working through ways to get our Event Project Plan on Monday into good shape. We know have a much more user friendly and useful Project Plan and we have made use of a variety of different automations to streamline processes. When our NFP is ready to undertake more complex Monday activities I will definitely be looking to Fruition for support.",
  },
  {
    clientName: "Tedd Long",
    clientRole: "",
    clientCompany: "MCAG Inc.",
    quote: "Zach provided excellent training on Monday.com and he included some great insights on how we can best use the project management features. Thank you!",
  },
]

async function uploadImage(filePath: string): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } } | null> {
  if (!fs.existsSync(filePath)) return null
  const buffer = fs.readFileSync(filePath)
  const asset = await writeClient.assets.upload('image', buffer, {
    filename: path.basename(filePath),
  })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

async function main() {
  // 1. Delete old placeholder case studies
  const existing = await writeClient.fetch('*[_type == "caseStudy"]._id')
  console.log(`Deleting ${existing.length} existing case studies...`)
  for (const id of existing) {
    await writeClient.delete(id)
    console.log(`  Deleted ${id}`)
  }

  // 2. Create new case studies with real data
  console.log(`\nCreating ${TESTIMONIALS.length} new case studies...`)
  for (let i = 0; i < TESTIMONIALS.length; i++) {
    const t = TESTIMONIALS[i]

    let profilePhoto = null
    if (t.photoFile) {
      const filePath = path.join(__dirname, '..', 'public', 'images', t.photoFile)
      console.log(`  Uploading photo: ${t.photoFile}`)
      profilePhoto = await uploadImage(filePath)
    }

    const doc: Record<string, unknown> = {
      _id: `casestudy-${i}`,
      _type: 'caseStudy',
      clientName: t.clientName,
      clientRole: t.clientRole || undefined,
      clientCompany: t.clientCompany || undefined,
      quote: t.quote,
    }
    if (profilePhoto) {
      doc.profilePhoto = profilePhoto
    }

    await writeClient.createOrReplace(doc)
    console.log(`  Created: ${t.clientName}`)
  }

  console.log('\nDone!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
