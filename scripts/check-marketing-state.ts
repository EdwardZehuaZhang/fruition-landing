import { writeClient } from './sanity-client'

async function main() {
  const teamCount = await writeClient.fetch(`count(*[_type == "teamMember"])`)
  const faqCount = await writeClient.fetch(`count(*[_type == "faqItem"])`)
  const csCount = await writeClient.fetch(`count(*[_type == "caseStudy"])`)
  const blogCount = await writeClient.fetch(`count(*[_type == "blogPost"])`)
  const aboutUs = await writeClient.fetch(
    `*[_type == "page" && slug.current == "about-us"][0]{ _id, title, heroHeading }`,
  )
  const careers = await writeClient.fetch(
    `*[_type == "page" && slug.current == "careers"][0]{ _id, title, heroHeading }`,
  )
  console.log({ teamCount, faqCount, casestudy: csCount, blogCount, aboutUs, careers })
}

main()
