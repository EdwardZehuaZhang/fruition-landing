// Six industry buckets that map to where Fruition's implementations actually
// concentrate by vertical, independent of product-type categorization.

export interface IndustryEntry {
  icon: string
  title: string
  solutions: string[]
}

export const INDUSTRY_ENTRIES: IndustryEntry[] = [
  {
    icon: "C",
    title: "Construction & Trades",
    solutions: [
      "Commercial PPM",
      "Residential High Volume",
      "Commercial Low Volume",
      "Job Trades Management",
      "Pool Construction",
      "Engineering PPM",
      "Signage & Architectural",
      "Estimating & Budgets",
    ],
  },
  {
    icon: "M",
    title: "Manufacturing & Operations",
    solutions: [
      "Project Build Tracker",
      "ERP Production",
      "Asset Management",
      "Logistics & Fleet",
      "Packaging",
      "Inventory & PO",
    ],
  },
  {
    icon: "S",
    title: "Sales & CRM",
    solutions: [
      "Dream CRM",
      "Account Management",
      "Real Estate Residential",
      "Real Estate Commercial",
      "Financial Services",
      "Wealth Management",
      "Agriculture & Livestock",
      "Retail & Ecommerce",
      "Solar",
    ],
  },
  {
    icon: "P",
    title: "Professional & People Ops",
    solutions: [
      "Fruition PPM",
      "Fruition HR",
      "Recruitment & ATS",
      "Global Marketing Agency",
      "Training & Enablement",
      "Migration Services",
      "AI Agent Enablement",
      "Proposal Automation",
    ],
  },
  {
    icon: "F",
    title: "Field Service & Property",
    solutions: [
      "Customer Service Ticketing",
      "Insurance Claims",
      "Property Management OS",
      "Healthcare Practice",
      "Fleet Dispatch",
    ],
  },
  {
    icon: "I",
    title: "Integrations & Platform",
    solutions: [
      "NetSuite",
      "QuickBooks",
      "Apollo",
      "OpenPhone",
      "Qarma",
      "DocuSign",
      "Make.com",
      "N8N",
    ],
  },
]
