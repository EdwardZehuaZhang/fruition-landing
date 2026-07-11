/**
 * Site Architecture v2.1 — proposed 5-tab navigation (Phase 1).
 *
 * Source: https://fruition-site-architecture.vercel.app/ §04 "Menu Bar Architecture",
 * mapped onto URLs that exist on the site TODAY so the nav can ship before any
 * content backfill (zero new 404s). New-hub links (/ai-consulting/,
 * /atlassian-consulting/, /hubspot-consulting/, /integrations/) swap in as those
 * pages are built in Phase 2.
 *
 * Consumed by:
 *  - scripts/seed-nav-v2.ts   → writes this structure to Sanity siteSettings.navigation
 *  - src/app/layout.tsx       → local preview when NAV_V2_PREVIEW=1 (no Sanity write)
 */

export interface NavV2Link {
  label: string
  href: string
  description?: string
  icon?: string
  featured?: boolean
}

export interface NavV2Section {
  heading: string
  columns?: number
  highlight?: boolean
  badge?: string
  items: NavV2Link[]
}

export interface NavV2Item {
  label: string
  layout?: 'stacked' | 'columns'
  sections: NavV2Section[]
}

export const NAV_V2: NavV2Item[] = [
  {
    label: 'AI Consulting',
    layout: 'columns',
    sections: [
      {
        heading: 'Services',
        items: [
          {
            label: 'AI Capability Assessment',
            href: '/ai-capability-assessment',
            icon: 'sparkle',
            description: 'Fixed-fee assessment — your AI roadmap in weeks, not months',
            featured: true,
          },
          {
            label: 'AI Strategy & Execution',
            href: '/ai-strategy-and-execution',
            icon: 'bulb',
            description: 'From use-case discovery to deployed agents',
          },
        ],
      },
      {
        heading: 'AI Platform Partners',
        columns: 2,
        items: [
          { label: 'Anthropic Claude', href: '/partnerships/anthropic-claude-partner', icon: 'anthropic' },
          { label: 'OpenAI ChatGPT', href: '/partnerships/openai-chatgpt-partner', icon: 'openai' },
          { label: 'Microsoft Copilot', href: '/partnerships/microsoft-copilot-partner', icon: 'zap' },
          { label: 'Google Gemini & Vertex AI', href: '/partnerships/google-gemini-vertex-ai-partner', icon: 'sparkle' },
          { label: 'Google Cloud', href: '/partnerships/google-cloud-partner', icon: 'globe' },
          { label: 'AWS', href: '/partnerships/aws-partner', icon: 'layers' },
          { label: 'n8n', href: '/partnerships/n8n-integration-partner', icon: 'link' },
          { label: 'Openclaw', href: '/partnerships/openclaw-partner', icon: 'openclaw' },
        ],
      },
    ],
  },
  {
    label: 'Platforms',
    layout: 'columns',
    sections: [
      {
        heading: 'monday.com',
        highlight: true,
        badge: 'Platinum Partner',
        items: [
          {
            label: 'Implementation',
            href: '/monday-implementation-consultants',
            icon: 'wrench',
            description: '500+ implementations delivered',
            featured: true,
          },
          { label: 'monday CRM Consulting', href: '/monday-crm-consulting', icon: 'chart' },
          { label: 'Implementation Packages', href: '/implementation-packages', icon: 'package' },
          { label: 'Training & Enablement', href: '/monday-training', icon: 'graduation' },
          { label: 'Solutions Catalog', href: '/monday-consulting-solutions/catalog', icon: 'list' },
          { label: 'Partner Credentials', href: '/partnerships/monday-consulting-partner', icon: 'handshake' },
        ],
      },
      {
        heading: 'Atlassian',
        items: [
          {
            label: 'Certified Atlassian Partner',
            href: '/partnerships/certified-atlassian-partner',
            icon: 'shield',
            description: 'Jira, Confluence & JSM consulting',
          },
        ],
      },
      {
        heading: 'HubSpot',
        items: [
          {
            label: 'Certified HubSpot Partner',
            href: '/partnerships/certified-hubspot-partner',
            icon: 'megaphone',
            description: 'CRM & Marketing Hub implementation',
          },
        ],
      },
      {
        heading: 'Supporting Tools',
        items: [
          { label: 'Aircall', href: '/partnerships/aircall-partner', icon: 'phone' },
          { label: 'Make', href: '/partnerships/make-partners', icon: 'zap' },
          { label: 'n8n', href: '/partnerships/n8n-integration-partner', icon: 'link' },
          { label: 'ClickUp', href: '/partnerships/certified-clickup-partner', icon: 'layers' },
          { label: 'Hootsuite', href: '/partnerships/hootsuite-delivery-partner', icon: 'megaphone' },
          { label: 'Guidde', href: '/partnerships/certified-guidde-partner', icon: 'video' },
          { label: 'All partnerships', href: '/partnerships', icon: 'handshake' },
        ],
      },
    ],
  },
  {
    label: 'Solutions',
    layout: 'columns',
    sections: [
      {
        heading: 'By Department',
        items: [
          { label: 'Solutions Catalog', href: '/monday-consulting-solutions/catalog', icon: 'list' },
          { label: 'CRM & Sales', href: '/monday-crm-consulting', icon: 'chart' },
          { label: 'Project Management', href: '/monday-consulting-solutions/monday-project-management', icon: 'layers' },
          { label: 'Service & Support', href: '/monday-consulting-solutions/monday-service', icon: 'heart' },
          { label: 'Finance & Accounting', href: '/monday-consulting-solutions/monday-for-finance', icon: 'dollar' },
          { label: 'Product Management', href: '/monday-consulting-solutions/monday-product-management', icon: 'bulb' },
          { label: 'HR & Recruitment', href: '/monday-consulting-solutions/monday-for-hr', icon: 'users' },
        ],
      },
      {
        heading: 'By Industry',
        columns: 2,
        items: [
          { label: 'Construction', href: '/monday-for-construction', icon: 'building' },
          { label: 'Manufacturing', href: '/monday-for-manufacturing', icon: 'factory' },
          { label: 'Retail', href: '/monday-for-retail', icon: 'bag' },
          { label: 'Professional Services', href: '/monday-for-professional-services', icon: 'briefcase' },
          { label: 'Government', href: '/monday-for-government', icon: 'flag' },
          { label: 'Marketing & Creative', href: '/monday-for-marketing', icon: 'megaphone' },
          { label: 'Real Estate', href: '/monday-for-real-estate', icon: 'home' },
          { label: 'Solar & Renewables', href: '/monday-consulting-solutions/solar-crm-solution', icon: 'sun' },
          { label: 'Installation & Renovation', href: '/monday-consulting-solutions/monday-for-cabinetry-renovation', icon: 'wrench' },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    layout: 'columns',
    sections: [
      {
        heading: 'Learn',
        items: [
          { label: 'Blog', href: '/consulting-blog', icon: 'edit', description: '100+ articles on monday.com, AI & automation' },
          { label: 'Training Centre', href: '/monday-training', icon: 'graduation' },
          { label: 'FAQs', href: '/faqs', icon: 'question' },
        ],
      },
      {
        heading: 'Proof',
        items: [
          { label: 'Case Studies', href: '/customer-testimonials', icon: 'document', description: 'Customer stories & testimonials' },
        ],
      },
    ],
  },
  {
    label: 'About',
    layout: 'columns',
    sections: [
      {
        heading: 'Company',
        items: [
          { label: 'About Us', href: '/about-us', icon: 'info' },
          { label: 'Meet the Team', href: '/fruition-team', icon: 'users' },
          { label: 'Careers', href: '/careers', icon: 'briefcase' },
          { label: 'Contact Us', href: '/contact-us', icon: 'phone' },
        ],
      },
      {
        heading: 'Credentials',
        items: [
          {
            label: 'Partners & Certifications',
            href: '/partnerships',
            icon: 'handshake',
            description: 'monday.com Platinum, Atlassian, HubSpot, AI platforms',
          },
        ],
      },
      {
        heading: 'Regions',
        items: [
          { label: 'Australia', href: '/monday-partner-australia', icon: 'globe' },
          { label: 'United Kingdom', href: '/monday-partner-uk', icon: 'globe' },
          { label: 'United States', href: '/monday-partner-us', icon: 'globe' },
          { label: 'Singapore', href: '/monday-partner-singapore', icon: 'globe' },
          { label: 'India', href: '/monday-partner-india', icon: 'globe' },
          { label: 'Philippines', href: '/monday-partner-philippines', icon: 'globe' },
        ],
      },
    ],
  },
]
