// Advisor chat flow + scoring inputs lifted from the 2026 Solutions Atlas mock.
// Solution-key references that were typos in the mock are corrected here to
// match the actual keys in solutions.ts (e.g. "recruit" → "ats", "pm-os" →
// "property-os") so recommendations land on real cards.

export interface AdvisorStep {
  key: "industry" | "goal" | "current" | "size" | "integrations" | "timeline"
  bot: string
  chips: [string, string][]
  multi?: boolean
  allowText?: boolean
}

export const STEPS: AdvisorStep[] = [
  {
    key: "industry",
    bot: "Hi, I am the Fruition Solutions Advisor. To start, which industry best describes your business?",
    chips: [
      ["construction", "Construction"],
      ["real-estate", "Real Estate"],
      ["manufacturing", "Manufacturing"],
      ["financial", "Financial Services"],
      ["healthcare", "Healthcare"],
      ["agency", "Agency / Marketing"],
      ["field-service", "Field Service"],
      ["people-ops", "People Ops / HR"],
      ["retail", "Retail / Commerce"],
      ["logistics", "Logistics / Fleet"],
      ["nonprofit", "Nonprofit"],
      ["energy", "Energy / Solar"],
      ["platform", "Services / Platform"],
      ["other", "Something else"],
    ],
  },
  {
    key: "goal",
    bot: "What are you trying to run inside monday.com? A sentence or two is plenty.",
    chips: [
      ["ppm-commercial", "Commercial construction projects"],
      ["ppm-resi", "Residential home-builds"],
      ["trades-goal", "Subcontractor trades and crews"],
      ["sales-pipeline", "A sales pipeline / CRM"],
      ["services-pmo", "Services or agency PMO"],
      ["recruiting", "Recruiting / candidate pipeline"],
      ["tickets", "Customer service tickets"],
      ["factory", "Shop floor / manufacturing"],
      ["other-goal", "Something else"],
    ],
    allowText: true,
  },
  {
    key: "current",
    bot: "What are you using today?",
    chips: [
      ["on-monday", "Already on monday.com, want to expand"],
      ["salesforce", "Salesforce"],
      ["hubspot", "HubSpot"],
      ["procore", "Procore"],
      ["spreadsheets", "Spreadsheets"],
      ["another", "Another tool"],
      ["greenfield", "Greenfield, nothing in place"],
    ],
  },
  {
    key: "size",
    bot: "How big is the team that will use this?",
    chips: [
      ["xs", "Under 10"],
      ["s", "10 to 30"],
      ["m", "30 to 100"],
      ["l", "100 plus"],
    ],
  },
  {
    key: "integrations",
    bot: "Any must-have integrations? Pick as many as apply, or type your own.",
    chips: [
      ["quickbooks", "QuickBooks"],
      ["netsuite", "NetSuite"],
      ["xero", "Xero"],
      ["salesforce-i", "Salesforce"],
      ["hubspot-i", "HubSpot"],
      ["docusign", "DocuSign"],
      ["stripe", "Stripe"],
      ["slack", "Slack"],
      ["outlook", "Outlook / Gmail"],
      ["procore-i", "Procore"],
      ["gdrive", "Google Drive / Box"],
      ["none", "None for now"],
    ],
    multi: true,
    allowText: true,
  },
  {
    key: "timeline",
    bot: "Last one. What is your timeline?",
    chips: [
      ["explore", "Exploring, 90-day horizon"],
      ["scoping", "Actively scoping, 30 to 60 days"],
      ["ready", "Ready to start this month"],
    ],
  },
]

export const INDUSTRY_MAP: Record<string, string | null> = {
  construction: "construction",
  "real-estate": "real-estate",
  manufacturing: "manufacturing",
  financial: "financial",
  healthcare: "healthcare",
  agency: "agency",
  "field-service": "field-service",
  "people-ops": "people-ops",
  retail: "retail",
  logistics: "logistics",
  nonprofit: "nonprofit",
  energy: "energy",
  platform: "platform",
  other: null,
}

export const GOAL_MAP: Record<string, string[]> = {
  "ppm-commercial": ["c-commercial-ppm", "c-commercial-lv", "trades"],
  "ppm-resi": ["c-residential-hv", "pool-construction"],
  "trades-goal": ["trades"],
  "sales-pipeline": ["dream-crm"],
  "services-pmo": ["ppm-general", "eng-ppm", "agency"],
  recruiting: ["ats", "hr"],
  tickets: ["cs-ticketing"],
  factory: ["mfg-build-tracker", "erp-production"],
}

// Regex-keyed keywords mapped to solution keys. Keys cross-checked against
// solutions.ts; mock typos (recruit→ats, pm-os→property-os, ins-claims→claims,
// agency-ops→agency, asset-mgmt→assets, fin-modelling→estimating) corrected.
export const GOAL_KEYWORDS: [RegExp, string[]][] = [
  [/commercial.*(construction|contractor|gc|build)/i, ["c-commercial-ppm", "c-commercial-lv"]],
  [/(residential|home ?build|home-?build|production home|spec home)/i, ["c-residential-hv"]],
  [/(subcontract|trades|crew|dispatch|punch)/i, ["trades"]],
  [/(pool)/i, ["pool-construction"]],
  [/(real ?estate|realtor|broker|mls|listing)/i, ["re-resi", "re-comm"]],
  [/(commercial real estate|commercial broker|cre|loi|lease)/i, ["re-comm"]],
  [/(property manage|landlord|tenant|rent roll)/i, ["property-os"]],
  [/(sales|pipeline|crm|lead|deal|opportunit)/i, ["dream-crm"]],
  [/(recruit|candidat|ats|applicant)/i, ["ats"]],
  [/(hr|employee|onboard|pto|performance)/i, ["hr"]],
  [/(ticket|help.?desk|support queue|sla|csat)/i, ["cs-ticketing"]],
  [/(manufactur|shop floor|bom|work order|eto|job shop|factory)/i, ["mfg-build-tracker", "erp-production"]],
  [/(wealth|rIA|advisor|household)/i, ["wealth-crm", "fs-crm"]],
  [/(insurance|claim|adjust)/i, ["claims"]],
  [/(solar|pv)/i, ["solar-crm"]],
  [/(nonprofit|donor|grant)/i, ["nonprofit"]],
  [/(healthcare|patient|clinic|medical|referral)/i, ["healthcare"]],
  [/(fleet|logistic|delivery|driver|dispatch)/i, ["fleet"]],
  [/(retail|ecommerce|e-commerce|store|sku)/i, ["retail-crm"]],
  [/(agency|campaign|creative|retainer)/i, ["agency"]],
  [/(signage|architect)/i, ["signage"]],
  [/(agricult|livestock|farm|ranch)/i, ["ag-crm"]],
  [/(project manage|ppm|portfolio)/i, ["ppm-general"]],
  [/(estimat|quoting|model)/i, ["estimating"]],
  [/(asset|equipment register)/i, ["assets"]],
  [/(account management|renewal|expansion|qbr)/i, ["sales-am"]],
  [/(proposal|sow|scope of work)/i, ["proposal-auto"]],
  [/(ai agent|automat|ai )/i, ["ai-agents"]],
]

export interface AdvisorAnswers {
  industry: string | null
  goal: string | string[] | null
  current: string | null
  size: string | null
  integrations: string[] | null
  timeline: string | null
}

export const EMPTY_ANSWERS: AdvisorAnswers = {
  industry: null,
  goal: null,
  current: null,
  size: null,
  integrations: null,
  timeline: null,
}
