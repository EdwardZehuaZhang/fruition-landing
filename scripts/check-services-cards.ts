import { writeClient } from './sanity-client'

async function main() {
  const docs = await writeClient.fetch(
    `*[(_type in ["servicePage","solutionPage","industryPage","partnershipPage","locationPage"]) && defined(servicesCards) && length(servicesCards) > 0]{
      _type, _id, "slug": slug.current, servicesHeading
    }`,
  )
  console.log(JSON.stringify(docs, null, 2))
}
main().catch((e) => { console.error(e); process.exit(1) })
