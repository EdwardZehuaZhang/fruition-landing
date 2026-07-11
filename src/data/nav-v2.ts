/**
 * Site Architecture v2.1 — proposed 5-tab navigation (Phases 1–2).
 *
 * Source: https://fruition-site-architecture.vercel.app/ §04 "Menu Bar Architecture".
 * Every href resolves: either a page that already exists on the live site, or one
 * of the new practice-cluster pages built in this branch (/ai-consulting/*,
 * /atlassian-consulting/*, /hubspot-consulting/*, /integrations/*,
 * /monday-products/*). Every item carries a description so the mega-menu tiles
 * render uniformly.
 *
 * Deliberate deviations from the mockup (no page exists yet):
 *  - AI services "AI-Ready Data Foundations", use cases "Knowledge Retrieval" /
 *    "Document Intelligence" (retrieval is covered by RAG & Knowledge Systems)
 *  - monday "Managed Services" (Implementation Packages shown instead)
 *  - HubSpot "Marketing Hub"
 *  - Resources "Guides", "Videos", "Webinars", "ROI Calculator"
 *  - About "Awards & Recognition"
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
            label: 'AI Consulting Overview',
            href: '/ai-consulting',
            icon: 'list',
            description: 'The full AI practice — services, platforms & use cases',
          },
          {
            label: 'Strategy & Roadmap',
            href: '/ai-strategy-and-execution',
            icon: 'bulb',
            description: 'From use-case discovery to deployed agents',
          },
          {
            label: 'Agent Development',
            href: '/ai-consulting/agent-development',
            icon: 'zap',
            description: 'Autonomous agents built for production, not demos',
          },
          {
            label: 'RAG & Knowledge Systems',
            href: '/ai-consulting/rag-knowledge-systems',
            icon: 'layers',
            description: 'Retrieval systems grounded in your own knowledge',
          },
          {
            label: 'Governance & Compliance',
            href: '/ai-consulting/governance-and-compliance',
            icon: 'shield',
            description: 'AI policy, risk & compliance frameworks',
          },
        ],
      },
      {
        heading: 'AI Platforms',
        items: [
          {
            label: 'Anthropic Claude',
            href: '/partnerships/anthropic-claude-partner',
            icon: 'anthropic',
            description: 'Enterprise Claude deployments & Claude Code',
          },
          {
            label: 'OpenAI ChatGPT',
            href: '/partnerships/openai-chatgpt-partner',
            icon: 'openai',
            description: 'ChatGPT Enterprise, custom GPTs & Assistants',
          },
          {
            label: 'Microsoft Copilot',
            href: '/partnerships/microsoft-copilot-partner',
            icon: 'zap',
            description: 'Copilot rollout across Microsoft 365',
          },
          {
            label: 'Google Gemini & Vertex AI',
            href: '/partnerships/google-gemini-vertex-ai-partner',
            icon: 'sparkle',
            description: 'Gemini models on Google’s AI stack',
          },
          {
            label: 'Google Cloud',
            href: '/partnerships/google-cloud-partner',
            icon: 'globe',
            description: 'AI workloads on Google Cloud',
          },
          {
            label: 'AWS',
            href: '/partnerships/aws-partner',
            icon: 'layers',
            description: 'Bedrock & the AWS AI stack',
          },
          {
            label: 'n8n',
            href: '/partnerships/n8n-integration-partner',
            icon: 'link',
            description: 'Self-hosted workflow automation',
          },
          {
            label: 'Openclaw',
            href: '/partnerships/openclaw-partner',
            icon: 'openclaw',
            description: 'Autonomous AI agents & orchestration',
          },
        ],
      },
      {
        heading: 'Use Cases',
        items: [
          {
            label: 'Marketing Automation',
            href: '/ai-consulting/marketing-automation',
            icon: 'megaphone',
            description: 'AI across content, campaigns & attribution',
          },
          {
            label: 'Sales & Outbound',
            href: '/ai-consulting/sales-outbound',
            icon: 'chart',
            description: 'AI-assisted prospecting & pipeline',
          },
          {
            label: 'Customer Service',
            href: '/ai-consulting/customer-service',
            icon: 'heart',
            description: 'Support automation that keeps CSAT',
          },
          {
            label: 'Operations & Back-office',
            href: '/ai-consulting/operations-back-office',
            icon: 'wrench',
            description: 'Document, finance & ops automation',
          },
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
          {
            label: 'monday Work Management',
            href: '/monday-products/work-management',
            icon: 'list',
            description: 'Projects, portfolios & workflows',
          },
          {
            label: 'monday CRM',
            href: '/monday-products/crm',
            icon: 'chart',
            description: 'Sales pipeline & customer management',
          },
          {
            label: 'monday Dev',
            href: '/monday-products/dev',
            icon: 'layers',
            description: 'Sprints, roadmaps & GitHub integration',
          },
          {
            label: 'monday Service',
            href: '/monday-products/service',
            icon: 'heart',
            description: 'Ticketing, SLAs & service delivery',
          },
          {
            label: 'monday AI',
            href: '/monday-products/ai',
            icon: 'sparkle',
            description: 'AI inside monday.com — bridges to our AI practice',
          },
          {
            label: 'Training & Enablement',
            href: '/monday-training',
            icon: 'graduation',
            description: 'Role-based monday.com training',
          },
          {
            label: 'Implementation Packages',
            href: '/implementation-packages',
            icon: 'package',
            description: 'Fixed-fee packages & pricing',
          },
        ],
      },
      {
        heading: 'Atlassian',
        items: [
          {
            label: 'Jira',
            href: '/atlassian-consulting/jira',
            icon: 'layers',
            description: 'Implementation, optimisation & workflow rescue',
          },
          {
            label: 'Confluence',
            href: '/atlassian-consulting/confluence',
            icon: 'document',
            description: 'Knowledge architecture & governance',
          },
          {
            label: 'Jira Service Management',
            href: '/atlassian-consulting/jira-service-management',
            icon: 'shield',
            description: 'ITSM, service desks & SLA automation',
          },
          {
            label: 'Jira → monday Migration',
            href: '/atlassian-consulting/jira-to-monday-migration',
            icon: 'zap',
            description: 'The structured cross-platform migration playbook',
          },
          {
            label: 'All Atlassian services',
            href: '/atlassian-consulting',
            icon: 'list',
            description: 'The full Atlassian consulting practice',
          },
        ],
      },
      {
        heading: 'HubSpot',
        items: [
          {
            label: 'HubSpot Implementation',
            href: '/hubspot-consulting/implementation',
            icon: 'wrench',
            description: 'CRM & Marketing Hub, implemented right',
          },
          {
            label: 'Breeze AI',
            href: '/hubspot-consulting/breeze-ai',
            icon: 'sparkle',
            description: 'HubSpot’s AI, deployed with governance',
          },
          {
            label: 'monday ↔ HubSpot Integration',
            href: '/hubspot-consulting/monday-hubspot-integration',
            icon: 'link',
            description: 'Two platforms, one pipeline',
          },
          {
            label: 'HubSpot → monday Migration',
            href: '/hubspot-consulting/hubspot-to-monday-migration',
            icon: 'zap',
            description: 'Move CRM without losing history',
          },
          {
            label: 'All HubSpot services',
            href: '/hubspot-consulting',
            icon: 'list',
            description: 'The full HubSpot consulting practice',
          },
        ],
      },
      {
        heading: 'Supporting Tools',
        items: [
          {
            label: 'Aircall',
            href: '/integrations/aircall',
            icon: 'phone',
            description: 'Telephony wired into monday.com',
          },
          {
            label: 'Twilio',
            href: '/integrations/twilio',
            icon: 'zap',
            description: 'SMS & voice workflow automation',
          },
          {
            label: 'Make',
            href: '/integrations/make',
            icon: 'link',
            description: 'Visual automation across your stack',
          },
          {
            label: 'n8n',
            href: '/partnerships/n8n-integration-partner',
            icon: 'link',
            description: 'Self-hosted automation & AI workflows',
          },
          {
            label: 'Zapier',
            href: '/integrations/zapier',
            icon: 'zap',
            description: 'Quick connections between tools',
          },
          {
            label: 'All integrations',
            href: '/integrations',
            icon: 'list',
            description: 'Every supporting tool we implement',
          },
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
          {
            label: 'Solutions Catalog',
            href: '/monday-consulting-solutions/catalog',
            icon: 'list',
            description: 'Browse every prebuilt solution',
          },
          {
            label: 'CRM & Sales',
            href: '/monday-crm-consulting',
            icon: 'chart',
            description: 'Pipeline & sales process solutions',
          },
          {
            label: 'Project Management',
            href: '/monday-consulting-solutions/monday-project-management',
            icon: 'layers',
            description: 'Delivery, portfolios & PMO',
          },
          {
            label: 'Service & Support',
            href: '/monday-consulting-solutions/monday-service',
            icon: 'heart',
            description: 'Service desks & ticketing',
          },
          {
            label: 'Finance & Accounting',
            href: '/monday-consulting-solutions/monday-for-finance',
            icon: 'dollar',
            description: 'Approvals, budgeting & reporting',
          },
          {
            label: 'Product Management',
            href: '/monday-consulting-solutions/monday-product-management',
            icon: 'bulb',
            description: 'Roadmaps & product ops',
          },
          {
            label: 'HR & Recruitment',
            href: '/monday-consulting-solutions/monday-for-hr',
            icon: 'users',
            description: 'Hiring pipelines & onboarding',
          },
        ],
      },
      {
        heading: 'By Industry',
        columns: 2,
        items: [
          {
            label: 'Construction',
            href: '/monday-for-construction',
            icon: 'building',
            description: 'Project & site delivery workflows',
          },
          {
            label: 'Manufacturing',
            href: '/monday-for-manufacturing',
            icon: 'factory',
            description: 'Production planning & operations',
          },
          {
            label: 'Retail',
            href: '/monday-for-retail',
            icon: 'bag',
            description: 'Store ops & merchandising',
          },
          {
            label: 'Professional Services',
            href: '/monday-for-professional-services',
            icon: 'briefcase',
            description: 'Client delivery & resourcing',
          },
          {
            label: 'Government',
            href: '/monday-for-government',
            icon: 'flag',
            description: 'Secure public-sector delivery',
          },
          {
            label: 'Marketing & Creative',
            href: '/monday-for-marketing',
            icon: 'megaphone',
            description: 'Campaigns & creative production',
          },
          {
            label: 'Real Estate',
            href: '/monday-for-real-estate',
            icon: 'home',
            description: 'Listings, deals & property ops',
          },
          {
            label: 'Solar & Renewables',
            href: '/monday-consulting-solutions/solar-crm-solution',
            icon: 'sun',
            description: 'Solar CRM & work management',
          },
          {
            label: 'Installation & Renovation',
            href: '/monday-consulting-solutions/monday-for-cabinetry-renovation',
            icon: 'wrench',
            description: 'Quoting to install handover',
          },
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
          {
            label: 'Blog',
            href: '/consulting-blog',
            icon: 'edit',
            description: '100+ articles on monday.com, AI & automation',
          },
          {
            label: 'Training Centre',
            href: '/monday-training',
            icon: 'graduation',
            description: 'monday.com training & enablement',
          },
          {
            label: 'FAQs',
            href: '/faqs',
            icon: 'question',
            description: 'Direct answers to common questions',
          },
        ],
      },
      {
        heading: 'Proof',
        items: [
          {
            label: 'Case Studies',
            href: '/customer-testimonials',
            icon: 'document',
            description: 'Customer stories & testimonials',
          },
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
          {
            label: 'About Us',
            href: '/about-us',
            icon: 'info',
            description: 'Who we are & how we work',
          },
          {
            label: 'Meet the Team',
            href: '/fruition-team',
            icon: 'users',
            description: 'The consultants behind Fruition',
          },
          {
            label: 'Careers',
            href: '/careers',
            icon: 'briefcase',
            description: 'Open roles at Fruition',
          },
          {
            label: 'Contact Us',
            href: '/contact-us',
            icon: 'phone',
            description: 'Talk to the team',
          },
        ],
      },
      {
        heading: 'Credentials',
        items: [
          {
            label: 'Partners & Certifications',
            href: '/partnerships',
            icon: 'handshake',
            description: 'monday.com Platinum, Atlassian, HubSpot & AI platforms',
          },
        ],
      },
      {
        heading: 'Regions',
        items: [
          {
            label: 'Australia',
            href: '/monday-partner-australia',
            icon: 'globe',
            description: 'Sydney HQ — APAC delivery',
          },
          {
            label: 'United Kingdom',
            href: '/monday-partner-uk',
            icon: 'globe',
            description: 'London delivery centre',
          },
          {
            label: 'United States',
            href: '/monday-partner-us',
            icon: 'globe',
            description: 'New York delivery centre',
          },
          {
            label: 'Singapore',
            href: '/monday-partner-singapore',
            icon: 'globe',
            description: 'APAC delivery',
          },
          {
            label: 'India',
            href: '/monday-partner-india',
            icon: 'globe',
            description: 'APAC delivery',
          },
          {
            label: 'Philippines',
            href: '/monday-partner-philippines',
            icon: 'globe',
            description: 'APAC delivery',
          },
        ],
      },
    ],
  },
]
