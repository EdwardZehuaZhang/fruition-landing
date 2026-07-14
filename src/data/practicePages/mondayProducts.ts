import type { PracticePage } from './types'

/**
 * /monday-products cluster — copy ported verbatim from the v2.1 mockups
 * (monday-products.html + work-management / crm / dev / service / ai /
 * enterprise leaves), surname corrected to Jebathilak.
 */

const HUB = { label: 'monday.com', href: '/monday-products' }

export const MONDAY_PRODUCTS_PAGES: Record<string, PracticePage> = {
  hub: {
    path: '/monday-products',
    seoTitle: 'monday.com Platinum Partner | Fruition — Implementation, CRM, Training, AU · UK · US',
    seoDescription:
      'Fruition is a monday.com Platinum Partner serving Australia, the UK, and the US — implementation, migration, training, and managed services across the entire monday product suite.',
    breadcrumb: [HUB],
    eyebrow: '★ monday.com Platinum Partner',
    heading: 'The monday.com partner that’s done it 500+ times',
    lead: 'Fruition is a monday.com Platinum Partner serving Australia, the UK, and the US — implementation, migration, training, and managed services across the entire monday product suite.',
    targetQueries: [
      'monday.com partner Australia',
      'monday.com consultant',
      'monday CRM implementation',
      'monday.com expert UK',
      'monday.com Platinum Partner US',
    ],
    approachEyebrow: 'Why Fruition for monday',
    approachHeading: 'Insider knowledge, outsider honesty.',
    approach: [
      {
        title: 'Ex-monday.com leadership',
        body: 'Founded by staff with six years inside monday.com. We know how the platform is built, roadmapped, and supported — from the inside.',
      },
      {
        title: 'Rethink before rebuild',
        body: 'Most ‘broken’ monday accounts replicated a decade-old spreadsheet. We restructure the data model before we configure a single board.',
      },
      {
        title: 'Full-suite certified',
        body: 'Certified across Work Management, CRM, Dev, and Service — plus the monday AI capabilities reshaping all four.',
      },
    ],
    servicesEyebrow: 'The product suite',
    servicesHeading: 'Every monday product, implemented properly.',
    services: [
      {
        title: 'monday Work Management',
        body: 'Project, portfolio, and resource management builds — from single-team rollouts to enterprise PMO deployments.',
      },
      {
        title: 'monday CRM',
        body: 'Full sales CRM implementation: pipeline design, automation, email integration, and migration from Salesforce, HubSpot, Zoho, or spreadsheets.',
      },
      {
        title: 'monday Dev',
        body: 'Sprint management, roadmaps, and GitHub-integrated development workflows — including Jira migrations.',
      },
      {
        title: 'monday Service',
        body: 'Ticketing, service portals, and ITSM builds with email and telephony channel integration.',
      },
      {
        title: 'monday AI',
        body: 'AI Blocks, Sidekick enablement, agent configuration, and AI Credit governance across your account.',
      },
      {
        title: 'monday Enterprise',
        body: 'Security, permissions architecture, HIPAA compliance setups, and multi-workspace governance for large organisations.',
      },
    ],
    childrenEyebrow: 'monday.com pages',
    childrenHeading: 'Go deeper by product.',
    children: [
      {
        label: 'Work Management',
        description: 'Projects, portfolios, and resource management',
        href: '/monday-products/work-management',
      },
      {
        label: 'monday CRM',
        description: 'Sales pipeline, automation, and CRM migration',
        href: '/monday-products/crm',
      },
      {
        label: 'monday Dev',
        description: 'Sprints, roadmaps, and GitHub workflows',
        href: '/monday-products/dev',
      },
      {
        label: 'monday Service',
        description: 'Ticketing, portals, and ITSM',
        href: '/monday-products/service',
      },
      {
        label: 'monday AI',
        description: 'AI Blocks, Sidekick, agents, and credits — bridged to our AI practice',
        href: '/monday-products/ai',
      },
      {
        label: 'monday Enterprise',
        description: 'Security, permissions, and governance at scale',
        href: '/monday-products/enterprise',
      },
    ],
    faqs: [
      {
        q: 'What does a monday.com partner do?',
        a: 'A monday.com partner provides certified consulting, implementation, training, and support services for the monday.com platform. Fruition is a Platinum Partner — the highest tier — with 500+ implementations across Work Management, CRM, Dev, and Service.',
      },
      {
        q: 'How much does monday.com implementation cost?',
        a: 'Fruition monday.com implementations start at AUD $8,000 for focused single-team builds, with mid-size deployments typically AUD $15,000–$60,000 and enterprise multi-department programs from $80,000. Every phase is fixed-fee and published before work begins.',
      },
      {
        q: 'Can Fruition migrate us to monday.com from another tool?',
        a: 'Yes — migrations from Jira, Asana, Trello, Smartsheet, Wrike, Salesforce, HubSpot, Zoho, and spreadsheet-based systems are core Fruition services, with data mapping, automation rebuilding, and team training included.',
      },
      {
        q: 'Does Fruition provide monday.com training?',
        a: 'Yes. Certified training from admin deep-dives to end-user enablement, delivered remotely or on-site across Australia, the UK, and the US.',
      },
      {
        q: 'How much does monday.com consulting cost with Fruition?',
        a: 'Fruition monday.com engagements start at AUD $8,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver monday.com services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical monday.com engagement take?',
        a: 'Most monday.com engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  'work-management': {
    path: '/monday-products/work-management',
    seoTitle: 'monday Work Management Implementation | Fruition — Projects, Portfolio & Resource Builds',
    seoDescription:
      'Fruition implements monday Work Management for organisations across Australia, the UK, and the US — project workflows, portfolio dashboards, and resource planning built around how your teams really work.',
    breadcrumb: [HUB, { label: 'Work Management', href: '/monday-products/work-management' }],
    eyebrow: 'monday.com · Work Management',
    heading: 'Project management your team will actually use',
    lead: 'Fruition implements monday Work Management for organisations across Australia, the UK, and the US — project workflows, portfolio dashboards, and resource planning built around how your teams really work.',
    approachHeading: 'Adoption is the metric.',
    approach: [
      {
        title: 'Process mapping first',
        body: 'We map how work actually flows before building boards — because a board structure that fights reality gets abandoned by week three.',
      },
      {
        title: 'Automation with intent',
        body: 'Cross-board automation networks, smart notifications, and approval flows — designed to remove work, not create noise.',
      },
      {
        title: 'Dashboards leaders open',
        body: 'Portfolio and executive dashboards built around the decisions leaders actually make, not vanity metrics.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'Work Management capabilities.',
    services: [
      {
        title: 'Project & portfolio builds',
        body: 'Standardised project templates, portfolio rollups, milestone tracking, and dependency management at scale.',
      },
      {
        title: 'Resource management',
        body: 'Capacity planning, workload balancing, and allocation views across teams and projects.',
      },
      {
        title: 'Cross-board automation',
        body: 'The advanced automation networks that separate professional implementations from DIY board collections.',
      },
      {
        title: 'Reporting & dashboards',
        body: 'Executive dashboards, client-facing views, and the Gantt/timeline reporting your PMO needs.',
      },
    ],
    faqs: [
      {
        q: 'Is monday Work Management good for complex projects?',
        a: 'Yes — with proper implementation. monday Work Management handles multi-project portfolios, dependencies, resource management, and Gantt planning well, but complex deployments need deliberate board architecture and automation design, which is where certified partners like Fruition add most value.',
      },
      {
        q: 'How long does a monday Work Management implementation take?',
        a: 'Single-team implementations run 2–4 weeks; department-wide builds 4–8 weeks; enterprise PMO deployments 8–16 weeks with phased rollout and training.',
      },
      {
        q: 'How much does monday Work Management consulting cost with Fruition?',
        a: 'Fruition monday Work Management engagements start at AUD $8,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver monday Work Management services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical monday Work Management engagement take?',
        a: 'Most monday Work Management engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  crm: {
    path: '/monday-products/crm',
    seoTitle: 'monday CRM Implementation Partner | Fruition — Pipeline, Automation & CRM Migration',
    seoDescription:
      'Fruition implements monday CRM for sales teams across Australia, the UK, and the US — pipeline architecture, automation, and migrations from Salesforce, HubSpot, and Zoho that keep your data intact.',
    breadcrumb: [HUB, { label: 'monday CRM', href: '/monday-products/crm' }],
    eyebrow: 'monday.com · CRM',
    heading: 'A CRM your sales team stops fighting',
    lead: 'Fruition implements monday CRM for sales teams across Australia, the UK, and the US — pipeline architecture, automation, and migrations from Salesforce, HubSpot, and Zoho that keep your data intact.',
    targetQueries: [
      'monday CRM implementation',
      'monday CRM partner',
      'migrate Salesforce to monday',
      'monday sales CRM consultant',
    ],
    approachHeading: 'Built around your sales motion.',
    approach: [
      {
        title: 'Pipeline mirrors reality',
        body: 'Deal stages, qualification criteria, and handoffs mapped to how you actually sell — not a template that fights your process.',
      },
      {
        title: 'Automation that sells',
        body: 'Lead routing, follow-up sequences, stall alerts, and renewal reminders — the recipes that separate top-performing CRM builds.',
      },
      {
        title: 'Migration without data loss',
        body: 'Structured migrations from Salesforce, HubSpot, Zoho, and Pipedrive with full history, activity, and attachment preservation.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'monday CRM capabilities.',
    services: [
      {
        title: 'Pipeline & deal management',
        body: 'Custom deal stages, weighted forecasting, quota tracking, and multi-pipeline architectures for complex sales orgs.',
      },
      {
        title: 'Contact & account 360',
        body: 'Connected Contacts, Accounts, and Deals boards with mirror-column architecture giving reps full relationship context.',
      },
      {
        title: 'Sales automation',
        body: 'Lead scoring, assignment routing, sequence triggers, and the notification strategies that surface priority deals.',
      },
      {
        title: 'Integrations',
        body: 'Email sync, Aircall telephony, Xero invoicing, and marketing platform connections — quote-to-cash on one platform.',
      },
    ],
    faqs: [
      {
        q: 'Is monday CRM a good alternative to Salesforce?',
        a: 'For most mid-market teams, yes. monday CRM delivers faster setup (2–3 weeks vs months), lower admin overhead, and stronger usability; Salesforce retains the edge for very complex enterprise requirements. Fruition has migrated teams in both directions and advises honestly per situation.',
      },
      {
        q: 'Can you migrate our HubSpot CRM to monday?',
        a: 'Yes — HubSpot-to-monday CRM migration is a core Fruition service, covering contacts, companies, deals, activity history, and automation rebuilding. See our dedicated migration page for the full methodology.',
      },
      {
        q: 'How much does monday CRM consulting cost with Fruition?',
        a: 'Fruition monday CRM engagements start at AUD $10,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver monday CRM services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical monday CRM engagement take?',
        a: 'Most monday CRM engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  dev: {
    path: '/monday-products/dev',
    seoTitle: 'monday Dev Implementation | Fruition — Sprints, Roadmaps & Jira Migration',
    seoDescription:
      'Fruition implements monday Dev for software teams across Australia, the UK, and the US — sprints, roadmaps, GitHub-integrated workflows, and structured migrations off Jira.',
    breadcrumb: [HUB, { label: 'monday Dev', href: '/monday-products/dev' }],
    eyebrow: 'monday.com · Dev',
    heading: 'Dev workflows without the Jira overhead',
    lead: 'Fruition implements monday Dev for software teams across Australia, the UK, and the US — sprints, roadmaps, GitHub-integrated workflows, and structured migrations off Jira.',
    approachHeading: 'Developer-grade, human-usable.',
    approach: [
      {
        title: 'Agile without ceremony bloat',
        body: 'Sprint boards, backlogs, and burndowns configured to your actual process — Scrum, Kanban, or the hybrid you really run.',
      },
      {
        title: 'GitHub as source of truth',
        body: 'Commit and PR activity syncing to boards automatically, so status updates happen without anyone typing them.',
      },
      {
        title: 'Cross-functional visibility',
        body: 'The reason teams leave Jira: product, marketing, and leadership can finally see dev work without a training course.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'monday Dev capabilities.',
    services: [
      {
        title: 'Sprint management',
        body: 'Backlog grooming, sprint planning, capacity views, and retrospective workflows.',
      },
      {
        title: 'Roadmapping',
        body: 'Product roadmaps connected to delivery boards — strategy and execution in one system.',
      },
      {
        title: 'GitHub integration',
        body: 'Automated branch tracking, PR status sync, and release management across repositories.',
      },
      {
        title: 'Jira migration',
        body: 'Structured migration of projects, issues, history, and workflows — the Givergy playbook, productised.',
      },
    ],
    faqs: [
      {
        q: 'Should we switch from Jira to monday Dev?',
        a: 'If cross-functional visibility, admin overhead, or licence cost are pain points, monday Dev is a strong move; if you depend on deep Jira ecosystem plugins, weigh carefully. Fruition — as both an Atlassian and monday partner — advises honestly and migrates in either direction.',
      },
      {
        q: 'How much does monday Dev consulting cost with Fruition?',
        a: 'Fruition monday Dev engagements start at AUD $10,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver monday Dev services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical monday Dev engagement take?',
        a: 'Most monday Dev engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  service: {
    path: '/monday-products/service',
    seoTitle: 'monday Service Implementation | Fruition — Ticketing, Portals & ITSM Builds',
    seoDescription:
      'Fruition implements monday Service for support and IT teams across Australia, the UK, and the US — ticketing, customer portals, SLA automation, and AI-assisted resolution workflows.',
    breadcrumb: [HUB, { label: 'monday Service', href: '/monday-products/service' }],
    eyebrow: 'monday.com · Service',
    heading: 'Service management that scales past the inbox',
    lead: 'Fruition implements monday Service for support and IT teams across Australia, the UK, and the US — ticketing, customer portals, SLA automation, and AI-assisted resolution workflows.',
    approachHeading: 'Every channel, one queue.',
    approach: [
      {
        title: 'Channel consolidation',
        body: 'Email inboxes, WorkForms, and portal requests unified into one governed ticket board with automatic routing.',
      },
      {
        title: 'SLA automation',
        body: 'Escalation rules, breach alerts, and priority scoring that keep commitments visible before they’re missed.',
      },
      {
        title: 'AI-assisted resolution',
        body: 'monday AI response drafting and classification — connected to our broader AI service practice when you’re ready for full agents.',
      },
    ],
    servicesEyebrow: 'What we build',
    servicesHeading: 'monday Service capabilities.',
    services: [
      {
        title: 'Ticketing systems',
        body: 'Multi-channel intake, smart routing, and status workflows for support, IT, and internal service teams.',
      },
      {
        title: 'Customer portals',
        body: 'Branded self-service portals combining knowledge articles, request forms, and ticket tracking.',
      },
      {
        title: 'ITSM workflows',
        body: 'Incident, asset, and vendor management with Jira and Azure DevOps integrations where dev teams connect.',
      },
      {
        title: 'Telephony integration',
        body: 'Aircall and Twilio-connected voice channels with call logging and ticket creation.',
      },
    ],
    faqs: [
      {
        q: 'Can monday Service replace Zendesk or Freshdesk?',
        a: 'For teams already on monday.com, usually yes — consolidating service onto the platform your teams use daily removes a silo and a licence. Complex contact-centre requirements may still favour dedicated tools; Fruition scopes this honestly during discovery.',
      },
      {
        q: 'How much does monday Service consulting cost with Fruition?',
        a: 'Fruition monday Service engagements start at AUD $10,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver monday Service services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical monday Service engagement take?',
        a: 'Most monday Service engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  ai: {
    path: '/monday-products/ai',
    seoTitle: 'monday AI Consulting | Fruition — AI Blocks, Sidekick, Agents & Credit Governance',
    seoDescription:
      'Fruition is the rare partner certified deep in monday.com and running a full AI consulting practice. We configure monday AI — Blocks, Sidekick, agents, credits — and know exactly when you need more than it.',
    breadcrumb: [HUB, { label: 'monday AI', href: '/monday-products/ai' }],
    eyebrow: '★ Bridge Page · monday.com × AI Consulting',
    heading: 'monday AI, configured by people who do both sides',
    lead: 'Fruition is the rare partner certified deep in monday.com and running a full AI consulting practice. We configure monday AI — Blocks, Sidekick, agents, credits — and know exactly when you need more than it.',
    targetQueries: [
      'monday AI consultant',
      'monday sidekick setup',
      'monday AI credits explained',
      'monday AI blocks automation',
      'monday agents configuration',
    ],
    approachHeading: 'The bridge between two practices.',
    approach: [
      {
        title: 'Native capabilities first',
        body: 'AI Blocks, Sidekick, and monday agents cover more than most teams realise — we configure these before recommending anything external.',
      },
      {
        title: 'Credit governance built in',
        body: 'monday AI Credits (USD $0.01 each, shared pool) need usage monitoring and limits from day one. We set up the governance admins actually need.',
      },
      {
        title: 'Honest escalation path',
        body: 'When a workload outgrows monday AI — heavy RAG, custom agents, cross-platform orchestration — our AI consulting practice takes over without a vendor handoff.',
      },
    ],
    servicesEyebrow: 'What we configure',
    servicesHeading: 'The monday AI surface.',
    services: [
      {
        title: 'AI Blocks in automations',
        body: 'Categorisation, extraction, sentiment, translation, and custom AI actions wired into your automation recipes and columns.',
      },
      {
        title: 'Sidekick enablement',
        body: 'Context-aware assistant rollout with team training on the prompts and patterns that produce real value.',
      },
      {
        title: 'monday agents',
        body: 'Digital worker configuration for reporting, project setup, and workflow execution — with usage governance.',
      },
      {
        title: 'Beyond monday AI',
        body: 'n8n orchestration, custom Claude/Copilot/Gemini agents, and RAG systems connected to your monday data — via our AI consulting practice.',
      },
    ],
    childrenEyebrow: 'Related practice',
    childrenHeading: 'When you need more than monday AI.',
    children: [
      {
        label: 'AI Consulting',
        description: 'Custom agents, RAG systems, and cross-platform orchestration — the full Fruition AI practice',
        href: '/ai-consulting',
      },
    ],
    faqs: [
      {
        q: 'What is monday AI and what does it include?',
        a: 'monday AI is the AI capability layer across monday.com: AI Blocks (modular AI actions in automations and columns), Sidekick (a context-aware assistant), monday agents (digital workers), monday vibe (AI app building), and meeting notetakers — all consuming from a shared AI Credit pool.',
      },
      {
        q: 'How do monday AI Credits work?',
        a: 'AI Credits are monday’s usage currency — roughly USD $0.01 each, consumed whenever AI tasks trigger. Different capabilities consume at different rates: Blocks per action, Sidekick per message over daily limits, agents by task complexity. Admins can monitor and cap usage; Fruition configures this governance as standard.',
      },
      {
        q: 'When do we need more than monday AI?',
        a: 'When workloads need deep retrieval over large document sets, custom multi-step agents, cross-platform orchestration, or model-specific capabilities. Fruition’s AI consulting practice handles that escalation — same team, no vendor handoff.',
      },
      {
        q: 'How much does monday AI consulting cost with Fruition?',
        a: 'Fruition monday AI engagements start at AUD $6,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver monday AI services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical monday AI engagement take?',
        a: 'Most monday AI engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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

  enterprise: {
    path: '/monday-products/enterprise',
    seoTitle: 'monday.com Enterprise Consulting | Fruition — Security, Permissions & Governance',
    seoDescription:
      'Fruition implements monday.com Enterprise for large organisations across Australia, the UK, and the US — permissions architecture, compliance configuration, and the governance that keeps 1,000-seat accounts sane.',
    breadcrumb: [HUB, { label: 'Enterprise', href: '/monday-products/enterprise' }],
    eyebrow: 'monday.com · Enterprise',
    heading: 'Enterprise monday.com without the governance debt',
    lead: 'Fruition implements monday.com Enterprise for large organisations across Australia, the UK, and the US — permissions architecture, compliance configuration, and the governance that keeps 1,000-seat accounts sane.',
    approachHeading: 'Structure before scale.',
    approach: [
      {
        title: 'Permissions as architecture',
        body: 'Workspace, board, item, and column-level permission hierarchies designed before rollout — because retrofitting governance onto 400 live boards is misery.',
      },
      {
        title: 'Compliance-configured',
        body: 'HIPAA BAA setups, audit logging, IP restrictions, and the Panic Button procedures regulated industries require.',
      },
      {
        title: 'Federated administration',
        body: 'Department-level admin models with central guardrails — autonomy where it’s safe, control where it isn’t.',
      },
    ],
    servicesEyebrow: 'What we deliver',
    servicesHeading: 'Enterprise capabilities.',
    services: [
      {
        title: 'Security hardening',
        body: 'SSO/SCIM provisioning, 2FA enforcement, session policies, and IP restrictions configured to your security baseline.',
      },
      {
        title: 'Permissions architecture',
        body: 'The closed/open workspace strategy, guest and non-member models, and column-level protections for sensitive data.',
      },
      {
        title: 'Compliance overlays',
        body: 'HIPAA (with BAA), APRA-aligned configurations, and audit-ready logging for regulated industries.',
      },
      {
        title: 'Governance operating model',
        body: 'Board classification standards, ownership succession, quarterly access reviews, and admin playbooks.',
      },
    ],
    faqs: [
      {
        q: 'Is monday.com HIPAA compliant?',
        a: 'monday.com Enterprise supports HIPAA compliance through a Business Associate Agreement, 256-bit encryption, comprehensive audit logging, and granular permissions. Standard and Pro plans do not — healthcare organisations handling PHI need Enterprise, configured properly. Fruition delivers these configurations.',
      },
      {
        q: 'What does monday.com Enterprise include that Pro doesn’t?',
        a: 'Enterprise adds advanced permissions (item and column level), HIPAA capability, SSO/SCIM, IP restrictions, audit logs, premium support, higher automation limits, and multi-level workspace governance — the features that matter above roughly 100 seats or in regulated industries.',
      },
      {
        q: 'How much does monday Enterprise consulting cost with Fruition?',
        a: 'Fruition monday Enterprise engagements start at AUD $15,000 for a structured initial phase, with fixed-fee pricing published per phase. Mid-scope projects are quoted after a scoping call. We serve Australia (AUD), the UK (GBP), and the US (USD) with local pricing in each region.',
      },
      {
        q: 'Which regions does Fruition deliver monday Enterprise services in?',
        a: 'Fruition delivers from Sydney (headquarters, serving APAC including Singapore and India), London (UK and Europe), and New York (US and Canada). Engagements are delivered remotely as standard, with optional on-site workshops in each region.',
      },
      {
        q: 'How long does a typical monday Enterprise engagement take?',
        a: 'Most monday Enterprise engagements run 4 to 12 weeks from kickoff to delivery depending on scope. Fruition works in fixed phases with defined outcomes, so you always know what is being delivered, by when, and at what cost.',
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
