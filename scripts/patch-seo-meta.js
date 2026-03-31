const fs = require("fs")
const path = require("path")

const appDir = "D:/Coding-Files/GitHub/fruition-landing/src/app"

// Pages backed by a Sanity document - convert to dynamic generateMetadata
const dynamicPages = [
  // [filePath, fetchFn, slug, fallbackTitle, fallbackDesc]
  ["ai-strategy-and-execution/page.tsx", "getServicePageBySlug", "ai-strategy-and-execution",
    "AI Strategy & Execution | Fruition Services",
    "Leverage AI and automation to transform your business operations with Fruition's expert consultants."],
  ["implementation-packages/page.tsx", "getServicePageBySlug", "implementation-packages",
    "Implementation Packages | Fruition Services",
    "Structured monday.com implementation packages to get your team running fast. Certified Fruition consultants."],
  ["monday-crm-consulting/page.tsx", "getServicePageBySlug", "monday-crm-consulting",
    "monday CRM Consulting | Fruition Services",
    "Expert monday CRM consulting and implementation. Build a CRM tailored to your business in 2-3 weeks."],
  ["monday-implementation-consultants/page.tsx", "getServicePageBySlug", "monday-implementation-consultants",
    "monday.com Implementation Consultants | Fruition Services",
    "Certified monday.com implementation consultants helping 500+ businesses streamline their workflows."],
  ["monday-training/page.tsx", "getServicePageBySlug", "monday-training",
    "monday.com Training | Fruition Services",
    "Official monday.com training for your entire team. Get certified and confident on the platform."],
  ["monday-for-construction/page.tsx", "getIndustryPageBySlug", "monday-for-construction",
    "monday.com for Construction | Fruition Services",
    "monday.com implementation for construction companies. Manage projects, sites and subcontractors."],
  ["monday-for-government/page.tsx", "getIndustryPageBySlug", "monday-for-government",
    "monday.com for Government | Fruition Services",
    "monday.com solutions for government and public sector organisations."],
  ["monday-for-manufacturing/page.tsx", "getIndustryPageBySlug", "monday-for-manufacturing",
    "monday.com for Manufacturing | Fruition Services",
    "Streamline manufacturing operations with monday.com. Production tracking, quality control and more."],
  ["monday-for-marketing/page.tsx", "getIndustryPageBySlug", "monday-for-marketing",
    "monday.com for Marketing & Creative | Fruition Services",
    "monday.com for marketing and creative teams. Manage campaigns, assets and creative workflows."],
  ["monday-for-professional-services/page.tsx", "getIndustryPageBySlug", "monday-for-professional-services",
    "monday.com for Professional Services | Fruition Services",
    "monday.com for professional services and agencies. Manage clients, projects and billing in one place."],
  ["monday-for-real-estate/page.tsx", "getIndustryPageBySlug", "monday-for-real-estate",
    "monday.com for Real Estate | Fruition Services",
    "monday.com solutions for real estate companies. Manage listings, deals and client relationships."],
  ["monday-for-retail/page.tsx", "getIndustryPageBySlug", "monday-for-retail",
    "monday.com for Retail | Fruition Services",
    "monday.com for retail and eCommerce operations. Inventory, fulfilment and team coordination."],
  ["monday-partner-australia/page.tsx", "getLocationPageBySlug", "monday-partner-australia",
    "monday.com Partner Australia | Fruition Services",
    "Fruition is a Platinum monday.com partner in Australia. Expert consultants across Sydney, Melbourne, Brisbane, Adelaide and Perth."],
  ["monday-partner-india/page.tsx", "getLocationPageBySlug", "monday-partner-india",
    "monday.com Partner India | Fruition Services",
    "Certified monday.com consulting partner in India. Expert implementation and training across major cities."],
  ["monday-partner-singapore/page.tsx", "getLocationPageBySlug", "monday-partner-singapore",
    "monday.com Partner Singapore | Fruition Services",
    "Certified monday.com consulting partner in Singapore. Expert implementation and support for local businesses."],
  ["monday-partner-uk/page.tsx", "getLocationPageBySlug", "monday-partner-uk",
    "monday.com Partner UK | Fruition Services",
    "Fruition is a certified monday.com partner in the UK. Expert consultants across London and the United Kingdom."],
  ["monday-partner-us/page.tsx", "getLocationPageBySlug", "monday-partner-us",
    "monday.com Partner US | Fruition Services",
    "Fruition is a certified monday.com partner in the United States. Expert consultants across New York and beyond."],
  ["about-us/page.tsx", "getPageBySlug", "about-us",
    "About Us | Fruition Services",
    "Fruition is a Platinum monday.com consulting partner with 500+ implementations across Australia, UK and US."],
  ["careers/page.tsx", "getPageBySlug", "careers",
    "Careers | Fruition Services",
    "Join the Fruition team. We are looking for talented people to help businesses transform the way they work."],
  ["data-privacy/page.tsx", "getPageBySlug", "data-privacy",
    "Data Privacy Policy | Fruition Services",
    "Fruition Services data privacy policy. How we collect, use and protect your personal information."],
  ["terms-and-conditions/page.tsx", "getPageBySlug", "terms-and-conditions",
    "Terms and Conditions | Fruition Services",
    "Fruition Services terms and conditions governing use of our services and website."],
]

// Static pages - just add description to existing metadata
const staticPages = [
  ["consulting-blog/page.tsx",
    "monday.com Blog | Fruition Services",
    "Expert insights on monday.com implementation, CRM, automation and integrations from certified Fruition consultants."],
  ["faqs/page.tsx",
    "FAQs | Fruition Services",
    "Frequently asked questions about monday.com implementation, consulting, training and Fruition services."],
  ["fruition-team/page.tsx",
    "Meet the Team | Fruition Services",
    "Meet the Fruition team — 30+ certified monday.com consultants and implementation specialists worldwide."],
  ["customer-testimonials/page.tsx",
    "Case Studies | Fruition Services",
    "Real results from 500+ businesses. See how Fruition transformed operations with monday.com."],
  ["monday-consulting-solutions/page.tsx",
    "monday.com Solutions | Fruition Services",
    "Purpose-built monday.com solutions for every team. Project management, CRM, HR, Finance and more."],
  ["partnerships/page.tsx",
    "Partnerships | Fruition Services",
    "Fruition is a certified partner for monday.com, Make, n8n, ClickUp, HubSpot, Atlassian and more."],
]

let patched = 0

for (const [file, fetchFn, slug, fallbackTitle, fallbackDesc] of dynamicPages) {
  const filePath = path.join(appDir, file)
  let content = fs.readFileSync(filePath, "utf8")
  
  // Skip if already has generateMetadata
  if (content.includes("export async function generateMetadata")) { console.log(`Skip (already dynamic): ${file}`); continue }
  
  // Remove static metadata export
  content = content.replace(/^export const metadata = \{[^}]*\}(\s*\n)/m, "")
  
  // Add generateMetadata before export default
  const metaFn = `export async function generateMetadata() {
  const page = await ${fetchFn}("${slug}")
  return {
    title: page?.seoTitle || "${fallbackTitle}",
    description: page?.seoDescription || "${fallbackDesc}",
  }
}

`
  content = content.replace(/^export default /m, metaFn + "export default ")
  
  fs.writeFileSync(filePath, content, "utf8")
  console.log(`Patched: ${file}`)
  patched++
}

for (const [file, title, desc] of staticPages) {
  const filePath = path.join(appDir, file)
  let content = fs.readFileSync(filePath, "utf8")
  
  // Replace single-field metadata with title+description
  content = content.replace(
    /export const metadata = \{[^}]*\}/,
    `export const metadata = {\n  title: "${title}",\n  description: "${desc}",\n}`
  )
  
  fs.writeFileSync(filePath, content, "utf8")
  console.log(`Updated static: ${file}`)
  patched++
}

console.log(`\nTotal: ${patched} files updated`)