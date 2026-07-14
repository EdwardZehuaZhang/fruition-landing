import type { PracticePage } from './types'

/**
 * Proof cluster — the /case-studies hub and /certifications-and-awards page.
 * Copy ported verbatim from the v2.1 mockups (resources/case-studies.html +
 * partners.html). The mockups credited "Josh Roszler"; the leader bio is a
 * shared constant (PRACTICE_LEADER) already corrected to Jebathilak, so no
 * ported field here names him.
 *
 * Both mockups render two card blocks — a numbered block (→ approach) and a
 * non-link spec block (→ services); neither wraps its cards in links. The
 * case-studies hub keeps them unlinked (its Featured stories already render as
 * the numbered approach section). The certifications page adds a curated
 * `children` directory linking each credential to its real /partnerships/*
 * page, as the brief requires — Twilio and Zapier are omitted (no route yet).
 */

export const PROOF_PAGES: Record<string, PracticePage> = {
  'case-studies': {
    path: '/case-studies',
    seoTitle: 'Client Case Studies | Fruition — Real Implementations, Real Results',
    seoDescription:
      'Client stories from 500+ implementations — what the situation was, what we built, and what changed. Including the numbers most consultancies leave out.',
    breadcrumb: [{ label: 'Case Studies', href: '/case-studies' }],
    eyebrow: 'Resources · Case Studies',
    heading: 'Results with the working shown',
    lead: 'Client stories from 500+ implementations — what the situation was, what we built, and what changed. Including the numbers most consultancies leave out.',
    targetQueries: [
      'monday.com case studies',
      'AI implementation case study',
      'Jira migration case study',
      'client results',
    ],
    approachEyebrow: 'Featured',
    approachHeading: 'Recent client stories.',
    approach: [
      {
        title: 'Givergy — Jira to monday Dev',
        body: 'Global fundraising-technology company migrated from Jira/BitBucket silos to monday Dev with GitHub integration — unified visibility across development, QA, and management.',
      },
      {
        title: 'Construction — variation recovery',
        body: 'Mid-size builder implemented variation capture-to-invoice workflows; previously-leaked variations now tracked and billed systematically.',
      },
      {
        title: 'Financial services — governed research AI',
        body: 'Advisory firm deployed citation-backed research synthesis under an APRA-aligned governance framework.',
      },
    ],
    servicesEyebrow: 'Browse by practice',
    servicesHeading: 'Case study categories.',
    services: [
      {
        title: 'AI implementations',
        body: 'Capability assessments, agent deployments, and RAG systems with adoption and ROI detail.',
      },
      {
        title: 'monday.com builds',
        body: 'CRM, work management, and enterprise implementations across industries.',
      },
      {
        title: 'Migrations',
        body: 'Jira→monday, HubSpot→monday, and spreadsheet-exodus stories with data-integrity detail.',
      },
      {
        title: 'Integration projects',
        body: 'Cross-platform architectures: monday↔HubSpot, Aircall telephony, and n8n automation networks.',
      },
    ],
    faqs: [
      {
        q: 'Can Fruition provide references for similar projects?',
        a: 'Yes — reference calls with comparable clients are arranged during scoping for qualified engagements, matched by industry and project type where possible.',
      },
      {
        q: 'How much does consulting consulting cost with Fruition?',
        a: 'Fruition consulting engagements start at AUD $15,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver consulting services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical consulting engagement take?',
        a: 'Most consulting engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
      },
      {
        q: 'Why choose Fruition over a Big-4 consulting firm?',
        a: 'Fruition is practitioner-led: the person who scopes your engagement is the person who delivers it. We publish fixed fees, hold 500+ implementations of delivery history, and are certified partners across monday.com (Platinum), Atlassian, HubSpot, and the major AI platforms — so recommendations are cross-platform and honest.',
      },
      {
        q: 'Can Fruition deliver this remotely?',
        a: 'Yes. All Fruition services are delivered remotely as standard across Australia, the UK, and the US, with optional on-site workshop weeks in Sydney, London, and New York.',
      },
    ],
  },

  'certifications-and-awards': {
    path: '/certifications-and-awards',
    seoTitle:
      'Partners & Certifications | Fruition — monday.com Platinum, Atlassian, HubSpot, AI Platforms',
    seoDescription:
      'Fruition holds formal partnerships across monday.com (Platinum), Atlassian, and HubSpot, and delivers daily across every major AI platform. Multiple partnerships keep our advice honest.',
    breadcrumb: [{ label: 'Certifications & Awards', href: '/certifications-and-awards' }],
    eyebrow: 'Partners & Certifications',
    heading: 'Certified where it counts. Independent where it matters',
    lead: 'Fruition holds formal partnerships across monday.com (Platinum), Atlassian, and HubSpot, and delivers daily across every major AI platform. Multiple partnerships keep our advice honest.',
    targetQueries: [
      'monday.com Platinum Partner',
      'Atlassian partner',
      'HubSpot partner',
      'AI platform partner',
      'Fruition certifications',
    ],
    approachEyebrow: 'Why it matters',
    approachHeading: 'Partnerships as proof, not marketing.',
    approach: [
      {
        title: 'Platinum means audited',
        body: 'monday.com Platinum status requires sustained delivery volume, certified staff, and client satisfaction scores. It’s re-earned every year.',
      },
      {
        title: 'Multi-partner by design',
        body: 'Holding partnerships across competing vendors means no single vendor owns our recommendation. Your best-fit platform wins, not our margins.',
      },
      {
        title: 'Certified humans, not logos',
        body: 'Every certification is held by named consultants on active delivery — not parked in a compliance folder.',
      },
    ],
    servicesEyebrow: 'Current partnerships',
    servicesHeading: 'The credential list.',
    services: [
      {
        title: 'monday.com — Platinum Partner',
        body: 'Highest partner tier. 500+ implementations. Rising Star Award 2026 (Prague Partner Summit). Certified across CRM, Work Management, Dev, and Service.',
      },
      {
        title: 'Atlassian',
        body: 'Consulting and implementation across Jira, Confluence, and Jira Service Management — including cross-platform migration practice.',
      },
      {
        title: 'HubSpot',
        body: 'Implementation and integration partner covering Marketing Hub, Sales Hub, and Breeze AI enablement.',
      },
      {
        title: 'AI platforms',
        body: 'Active delivery across Anthropic Claude, OpenAI, Microsoft Copilot, Google Gemini and Vertex AI, Google Cloud, AWS Bedrock, and n8n.',
      },
      {
        title: 'Supporting ecosystem',
        body: 'Aircall, Twilio, Make, and Zapier integration expertise connecting telephony and automation into your platforms.',
      },
    ],
    childrenEyebrow: 'Partner directory',
    childrenHeading: 'Explore each partnership.',
    children: [
      {
        label: 'monday.com — Platinum Partner',
        description: 'Highest partner tier — 500+ implementations, Rising Star 2026.',
        href: '/partnerships/monday-consulting-partner',
      },
      {
        label: 'Atlassian',
        description: 'Jira, Confluence, and Jira Service Management delivery.',
        href: '/partnerships/certified-atlassian-partner',
      },
      {
        label: 'HubSpot',
        description: 'Marketing Hub, Sales Hub, and Breeze AI enablement.',
        href: '/partnerships/certified-hubspot-partner',
      },
      {
        label: 'Anthropic Claude',
        description: 'Claude deployments and agentic systems.',
        href: '/partnerships/anthropic-claude-partner',
      },
      {
        label: 'OpenAI',
        description: 'ChatGPT and OpenAI platform delivery.',
        href: '/partnerships/openai-chatgpt-partner',
      },
      {
        label: 'Microsoft Copilot',
        description: 'Copilot rollout and enablement.',
        href: '/partnerships/microsoft-copilot-partner',
      },
      {
        label: 'Google Gemini & Vertex AI',
        description: 'Gemini and Vertex AI builds.',
        href: '/partnerships/google-gemini-vertex-ai-partner',
      },
      {
        label: 'Google Cloud',
        description: 'Cloud infrastructure for AI workloads.',
        href: '/partnerships/google-cloud-partner',
      },
      {
        label: 'AWS',
        description: 'Bedrock and AWS AI delivery.',
        href: '/partnerships/aws-partner',
      },
      {
        label: 'n8n',
        description: 'Automation networks and workflow orchestration.',
        href: '/partnerships/n8n-integration-partner',
      },
      {
        label: 'Aircall',
        description: 'Telephony integration into your platforms.',
        href: '/partnerships/aircall-partner',
      },
      {
        label: 'Make',
        description: 'No-code automation across your stack.',
        href: '/partnerships/make-partners',
      },
    ],
    faqs: [
      {
        q: 'What does monday.com Platinum Partner status mean?',
        a: 'Platinum is monday.com’s highest partner tier, requiring sustained implementation volume, certified consultants, and verified client satisfaction. Fruition holds Platinum status with 500+ implementations delivered.',
      },
      {
        q: 'Does being a partner bias Fruition’s recommendations?',
        a: 'The opposite — Fruition deliberately holds partnerships across competing vendors (monday.com and Atlassian, HubSpot and monday CRM) so no single vendor relationship dictates advice. We recommend per workload.',
      },
      {
        q: 'How much does consulting consulting cost with Fruition?',
        a: 'Fruition consulting engagements start at AUD $15,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver consulting services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical consulting engagement take?',
        a: 'Most consulting engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
      },
      {
        q: 'Why choose Fruition over a Big-4 consulting firm?',
        a: 'Fruition is practitioner-led: the person who scopes your engagement is the person who delivers it. We publish fixed fees, hold 500+ implementations of delivery history, and are certified partners across monday.com (Platinum), Atlassian, HubSpot, and the major AI platforms — so recommendations are cross-platform and honest.',
      },
      {
        q: 'Can Fruition deliver this remotely?',
        a: 'Yes. All Fruition services are delivered remotely as standard across Australia, the UK, and the US, with optional on-site workshop weeks in Sydney, London, and New York.',
      },
    ],
  },
}
