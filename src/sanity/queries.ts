import { client } from './client'

export async function getBlogPosts(limit = 12, offset = 0) {
  return client.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc) [$offset...$end] {
      _id, title, slug, publishedAt, author, excerpt, coverImage,
      categories[]->{ _id, title, slug }
    }`,
    { offset, end: offset + limit }
  )
}

export async function getBlogPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      _id, title, slug, publishedAt, author, excerpt, coverImage, body,
      seoTitle, seoDescription, categories[]->{ _id, title, slug }
    }`,
    { slug }
  )
}

export async function getBlogCategories() {
  return client.fetch(
    `*[_type == "blogCategory"] | order(title asc) { _id, title, slug, description }`
  )
}

export async function getSolutionPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "solutionPage" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getPartnershipPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "partnershipPage" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getLocationPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "locationPage" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getIndustryPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "industryPage" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getServicePageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "servicePage" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]`)
}

export async function getTeamMembers() {
  return client.fetch(
    `*[_type == "teamMember"] | order(order asc) { _id, name, role, photo, bio, linkedinUrl, order }`
  )
}

export async function getCaseStudies() {
  return client.fetch(
    `*[_type == "caseStudy"] { _id, clientName, clientRole, clientCompany, quote, logo, linkedinUrl }`
  )
}

export async function getFaqItems() {
  return client.fetch(
    `*[_type == "faqItem"] | order(order asc) { _id, question, answer, order }`
  )
}

export async function getPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]`,
    { slug }
  )
}
