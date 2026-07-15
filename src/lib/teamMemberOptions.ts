/**
 * Option lists for teamMember fields, shared by the portal team form and its
 * API route. Mirror src/sanity/schemas/teamMember.ts — update both together.
 */

export const REGION_OPTIONS = [
  { value: "APAC", label: "APAC 🌏" },
  { value: "SG", label: "Singapore 🇸🇬" },
  { value: "IN", label: "India 🇮🇳" },
  { value: "PH", label: "Philippines 🇵🇭" },
  { value: "UK", label: "United Kingdom 🇬🇧" },
  { value: "US", label: "United States 🇺🇸" },
  { value: "AU", label: "Australia 🇦🇺 (legacy)" },
] as const

export const CERTIFICATION_OPTIONS = [
  "Certified Core Consultant",
  "Advanced Workflow Builder",
  "CRM Specialist",
  "Make.com Certified",
  "n8n Specialist",
  "Solutions Architect",
] as const

export const ALLOWED_REGIONS = new Set(REGION_OPTIONS.map((r) => r.value as string))
export const ALLOWED_CERTIFICATIONS = new Set(CERTIFICATION_OPTIONS as readonly string[])
