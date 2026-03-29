import { writeClient } from './sanity-client.js'
import { fetchPage, extractHero, extractSeoDescription, extractTitle, extractBodyText, sleep } from './scrape.js'
import { textToPortableText } from './helpers.js'

const BASE_URL = 'https://www.fruitionservices.io'

interface PageConfig {
  url: string
  slug: string
  country?: string
  industryName?: string
}

async function scrapePage(url: string) {
  try {
    const root = await fetchPage(url)
    const { heading, subheading } = extractHero(root)
    const seoTitle = extractTitle(root)
    const seoDescription = extractSeoDescription(root)
    const bodyTexts = extractBodyText(root)
    return { heading, subheading, seoTitle, seoDescription, body: textToPortableText(bodyTexts) }
  } catch (err) {
    console.error(`  FAILED to scrape ${url}:`, (err as Error).message)
    return null
  }
}

async function importSolutionPages() {
  const pages: PageConfig[] = [
    { url: '/monday-consulting-solutions/monday-project-management', slug: 'monday-project-management' },
    { url: '/monday-consulting-solutions/monday-service', slug: 'monday-service' },
    { url: '/monday-consulting-solutions/monday-for-finance', slug: 'monday-for-finance' },
    { url: '/monday-consulting-solutions/monday-product-management', slug: 'monday-product-management' },
    { url: '/monday-consulting-solutions/monday-for-hr', slug: 'monday-for-hr' },
    { url: '/monday-consulting-solutions/solar-crm-solution', slug: 'solar-crm-solution' },
    { url: '/monday-consulting-solutions/monday-for-cabinetry-renovation', slug: 'monday-for-cabinetry-renovation' },
  ]

  console.log(`\nImporting ${pages.length} solution pages...`)
  for (const p of pages) {
    console.log(`  Scraping ${BASE_URL}${p.url}`)
    const data = await scrapePage(BASE_URL + p.url)
    await sleep(1000)
    if (!data) continue

    const doc = {
      _type: 'solutionPage',
      _id: `solutionPage-${p.slug}`,
      title: data.heading || p.slug,
      slug: { _type: 'slug', current: p.slug },
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      heroHeading: data.heading,
      heroSubheading: data.subheading,
      primaryCtaLabel: 'Book a Consultation',
      primaryCtaUrl: 'https://calendly.com/global-calendar-fruitionservices',
      body: data.body,
    }

    await writeClient.createOrReplace(doc)
    console.log(`  Created solutionPage: ${p.slug}`)
    await sleep(500)
  }
}

async function importPartnershipPages() {
  const pages: PageConfig[] = [
    { url: '/partnerships/monday-consulting-partner', slug: 'monday-consulting-partner' },
    { url: '/partnerships/make-partners', slug: 'make-partners' },
    { url: '/partnerships/n8n-integration-partner', slug: 'n8n-integration-partner' },
    { url: '/partnerships/certified-clickup-partner', slug: 'certified-clickup-partner' },
    { url: '/partnerships/certified-guidde-partner', slug: 'certified-guidde-partner' },
    { url: '/partnerships/certified-hubspot-partner', slug: 'certified-hubspot-partner' },
    { url: '/partnerships/hootsuite-delivery-partner', slug: 'hootsuite-delivery-partner' },
    { url: '/partnerships/aircall-partner', slug: 'aircall-partner' },
    { url: '/partnerships/certified-atlassian-partner', slug: 'certified-atlassian-partner' },
  ]

  console.log(`\nImporting ${pages.length} partnership pages...`)
  for (const p of pages) {
    console.log(`  Scraping ${BASE_URL}${p.url}`)
    const data = await scrapePage(BASE_URL + p.url)
    await sleep(1000)
    if (!data) continue

    const doc = {
      _type: 'partnershipPage',
      _id: `partnershipPage-${p.slug}`,
      title: data.heading || p.slug,
      slug: { _type: 'slug', current: p.slug },
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      heroHeading: data.heading,
      heroSubheading: data.subheading,
      primaryCtaLabel: 'Book a Consultation',
      primaryCtaUrl: 'https://calendly.com/global-calendar-fruitionservices',
      body: data.body,
    }

    await writeClient.createOrReplace(doc)
    console.log(`  Created partnershipPage: ${p.slug}`)
    await sleep(500)
  }
}

async function importLocationPages() {
  const pages: Array<PageConfig & { country: string }> = [
    { url: '/monday-partner-australia', slug: 'monday-partner-australia', country: 'Australia' },
    { url: '/monday-partner-uk', slug: 'monday-partner-uk', country: 'UK' },
    { url: '/monday-partner-us', slug: 'monday-partner-us', country: 'US' },
    { url: '/monday-partner-singapore', slug: 'monday-partner-singapore', country: 'Singapore' },
    { url: '/monday-partner-india', slug: 'monday-partner-india', country: 'India' },
  ]

  console.log(`\nImporting ${pages.length} location pages...`)
  for (const p of pages) {
    console.log(`  Scraping ${BASE_URL}${p.url}`)
    const data = await scrapePage(BASE_URL + p.url)
    await sleep(1000)
    if (!data) continue

    const doc = {
      _type: 'locationPage',
      _id: `locationPage-${p.slug}`,
      title: data.heading || p.slug,
      slug: { _type: 'slug', current: p.slug },
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      heroHeading: data.heading,
      heroSubheading: data.subheading,
      primaryCtaLabel: 'Book a Consultation',
      primaryCtaUrl: 'https://calendly.com/global-calendar-fruitionservices',
      country: p.country,
      body: data.body,
    }

    await writeClient.createOrReplace(doc)
    console.log(`  Created locationPage: ${p.slug}`)
    await sleep(500)
  }
}

async function importIndustryPages() {
  const pages: Array<PageConfig & { industryName: string }> = [
    { url: '/monday-for-construction', slug: 'monday-for-construction', industryName: 'Construction' },
    { url: '/monday-for-manufacturing', slug: 'monday-for-manufacturing', industryName: 'Manufacturing' },
    { url: '/monday-for-retail', slug: 'monday-for-retail', industryName: 'Retail' },
    { url: '/monday-for-professional-services', slug: 'monday-for-professional-services', industryName: 'Professional Services' },
    { url: '/monday-for-government', slug: 'monday-for-government', industryName: 'Government' },
    { url: '/monday-for-marketing', slug: 'monday-for-marketing', industryName: 'Marketing' },
    { url: '/monday-for-real-estate', slug: 'monday-for-real-estate', industryName: 'Real Estate' },
  ]

  console.log(`\nImporting ${pages.length} industry pages...`)
  for (const p of pages) {
    console.log(`  Scraping ${BASE_URL}${p.url}`)
    const data = await scrapePage(BASE_URL + p.url)
    await sleep(1000)
    if (!data) continue

    const doc = {
      _type: 'industryPage',
      _id: `industryPage-${p.slug}`,
      title: data.heading || p.slug,
      slug: { _type: 'slug', current: p.slug },
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      heroHeading: data.heading,
      heroSubheading: data.subheading,
      primaryCtaLabel: 'Book a Consultation',
      primaryCtaUrl: 'https://calendly.com/global-calendar-fruitionservices',
      industryName: p.industryName,
      body: data.body,
    }

    await writeClient.createOrReplace(doc)
    console.log(`  Created industryPage: ${p.slug}`)
    await sleep(500)
  }
}

async function importServicePages() {
  const pages: PageConfig[] = [
    { url: '/implementation-packages', slug: 'implementation-packages' },
    { url: '/monday-training', slug: 'monday-training' },
    { url: '/monday-implementation-consultants', slug: 'monday-implementation-consultants' },
    { url: '/monday-crm-consulting', slug: 'monday-crm-consulting' },
    { url: '/ai-strategy-and-execution', slug: 'ai-strategy-and-execution' },
  ]

  console.log(`\nImporting ${pages.length} service pages...`)
  for (const p of pages) {
    console.log(`  Scraping ${BASE_URL}${p.url}`)
    const data = await scrapePage(BASE_URL + p.url)
    await sleep(1000)
    if (!data) continue

    const doc = {
      _type: 'servicePage',
      _id: `servicePage-${p.slug}`,
      title: data.heading || p.slug,
      slug: { _type: 'slug', current: p.slug },
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      heroHeading: data.heading,
      heroSubheading: data.subheading,
      primaryCtaLabel: 'Book a Consultation',
      primaryCtaUrl: 'https://calendly.com/global-calendar-fruitionservices',
      body: data.body,
    }

    await writeClient.createOrReplace(doc)
    console.log(`  Created servicePage: ${p.slug}`)
    await sleep(500)
  }
}

async function main() {
  console.log('Starting static page import...')
  const start = Date.now()

  await importSolutionPages()
  await importPartnershipPages()
  await importLocationPages()
  await importIndustryPages()
  await importServicePages()

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\nDone! Static pages import complete in ${elapsed}s`)
}

main().catch(console.error)
