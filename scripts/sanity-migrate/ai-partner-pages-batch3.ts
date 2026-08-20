/**
 * Sanity migration: AI / cloud / automation partner pages — batch 3.
 *
 *   /partnerships/microsoft-azure-partner
 *   /partnerships/supabase-partner
 *   /partnerships/langgraph-partner
 *   /partnerships/clay-partner
 *   /partnerships/elevenlabs-partner
 *   /partnerships/vapi-partner
 *
 * Written for the Partnerships nav rework (Aug 2026): the mega-menu gained a
 * "Cloud Services" column and an "Automation, Agents & Tools" column, and these
 * six pages are the targets those new links point at.
 *
 * Mapped onto the aiPartnerPage schema (rendered by AiPartnerTemplate).
 * Re-running overwrites (createOrReplace by fixed _id).
 *
 * NOTE ON CLAIMS: these pages describe delivery capability ("consulting and
 * implementation partner" — we implement the product) and deliberately carry
 * NO invented client case studies and NO invented outcome statistics. Batch 1
 * and 2 pages use a `stats` strip with per-platform metrics; these use the
 * `marquee` strip instead (same pattern as the Openclaw page in batch 1). If a
 * formal partner tier or certification is signed for any of these vendors,
 * upgrade `partnerTag`, `operatorPanel.status` and `operatorCreds` then.
 */
import { writeClient, withKeys } from './lib'

const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'
const CONTACT = 'mailto:hello@fruitionservices.io'

const bullets = (arr: string[]) =>
  withKeys(arr.map((text) => ({ _type: 'aiBullet', text })))

// Real offices — same copy as the batch 2 pages.
const geoCards = (platform: string) =>
  withKeys([
    {
      _type: 'geoCard',
      region: 'AU · SG · IN — Asia Pacific',
      city: 'Sydney HQ',
      body: `Sydney HQ serving Australia, New Zealand, Singapore, and India. ${platform} delivery under APRA CPS 234 and Australian Privacy Principles-aligned governance.`,
      addr: '12/64 York Street, Sydney NSW 2000\nABN 12 667 454 006',
    },
    {
      _type: 'geoCard',
      region: 'GB — United Kingdom',
      city: 'London',
      body: `UK delivery for FCA-regulated firms, NHS Trusts, and FTSE 100. ${platform} work carries UK GDPR and EU AI Act governance overlays.`,
      addr: 'London delivery centre\nUK GDPR aligned · FCA-aware',
    },
    {
      _type: 'geoCard',
      region: 'US — North America',
      city: 'New York',
      body: `US delivery for Fortune 1000 with HIPAA, SOC 2, and state-specific (CCPA, CPRA) governance overlays applied to ${platform} deployments.`,
      addr: 'New York delivery centre\nSOC 2 / HIPAA aware · FedRAMP-aware',
    },
  ])

const operatorPanel = (status: string) =>
  withKeys([
    { _type: 'operatorRow', k: 'prior', v: 'monday.com · 6y' },
    { _type: 'operatorRow', k: 'based', v: 'Sydney · AU' },
    { _type: 'operatorRow', k: 'entities', v: 'AU · UK · US' },
    { _type: 'operatorRow', k: 'status', v: status, accent: true },
  ])

const CREDS = ['monday.com Platinum', 'Rising Star 2026', 'Atlassian Platinum', '500+ implementations']

// ─────────────────────────────────────────────────────────────────────────
// 1. Microsoft Azure
// ─────────────────────────────────────────────────────────────────────────
const azure = {
  _id: 'aiPartnerPage-microsoft-azure-partner',
  _type: 'aiPartnerPage',
  title: 'Microsoft Azure Consulting & Implementation Partner',
  slug: { _type: 'slug', current: 'microsoft-azure-partner' },
  seoTitle: 'Microsoft Azure Consulting & Implementation | APAC, UK & US | Fruition',
  seoDescription:
    'Azure consulting and implementation across APAC, UK, and US. Landing zones, Entra ID, AKS, Azure OpenAI and AI Foundry, Microsoft Fabric, Defender for Cloud, and FinOps — delivered by engineers.',

  brandName: 'Microsoft Azure',
  partnerTag: 'Azure Implementation',
  accentColor: '#0F6CBD',
  accentColorDeep: '#0A4C86',
  accentColorSoft: 'rgba(15,108,189,0.10)',
  serifAccent: false,

  heroEyebrow: 'Microsoft Azure · Consulting & Implementation',
  heroHeading: 'Azure, built on foundations that hold.',
  heroHeadingAccent: 'foundations that hold.',
  heroLead:
    'Fruition Services designs Azure landing zones, migrates workloads, hardens identity, and ships production Azure OpenAI and AI Foundry workloads across APAC, UK, and US. The same team already runs your Microsoft 365 Copilot rollout.',
  primaryCtaLabel: 'Book an Azure scoping call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'Our capabilities',
  secondaryCtaUrl: '#capabilities',
  heroSidePanelType: 'regions',
  heroSidePanelTitle: 'Regions Served',
  heroRegions: withKeys([
    { _type: 'heroRegion', label: 'Australia', value: 'Australia East · Southeast' },
    { _type: 'heroRegion', label: 'Singapore', value: 'Southeast Asia' },
    { _type: 'heroRegion', label: 'India', value: 'Engineering pod' },
    { _type: 'heroRegion', label: 'United Kingdom', value: 'UK South · UK West' },
    { _type: 'heroRegion', label: 'United States', value: 'East US · West US 3' },
  ]),

  stripType: 'marquee',
  marqueeItems: [
    'LANDING ZONES',
    'ENTRA ID',
    'AZURE OPENAI',
    'AI FOUNDRY',
    'MICROSOFT FABRIC',
    'AKS',
    'DEFENDER FOR CLOUD',
    'FINOPS',
    'APAC · UK · US',
  ],

  capEyebrow: 'Capabilities',
  capHeading: 'Azure engineering from subscription design to production AI.',
  capHeadingAccent: 'production AI.',
  capLead:
    'Six capability areas, delivered as standalone engagements or as the building blocks of an enterprise Azure programme.',
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 — Foundation',
      title: 'Landing zone & governance',
      body: 'Management group hierarchy, subscription topology, Azure Policy, RBAC, networking and logging — built to the Cloud Adoption Framework and deployed as infrastructure-as-code.',
      bullets: bullets(['Cloud Adoption Framework landing zones', 'Azure Policy & management groups', 'Bicep / Terraform delivery']),
    },
    {
      _type: 'capability', num: '02 — Identity',
      title: 'Microsoft Entra ID',
      body: 'Tenant design, conditional access, privileged identity management, app registrations and workload identity. The layer that decides whether everything above it is safe.',
      bullets: bullets(['Conditional access & PIM', 'Workload identity federation', 'B2B / B2C tenant design']),
    },
    {
      _type: 'capability', num: '03 — Generative AI',
      title: 'Azure OpenAI & AI Foundry',
      body: 'Production GPT workloads inside your own tenant — private endpoints, content filters, quota and region planning, evaluation harnesses, and agent deployment on AI Foundry.',
      bullets: bullets(['Azure OpenAI in-tenant deployment', 'AI Foundry agents & evaluations', 'Private endpoints & content filtering']),
    },
    {
      _type: 'capability', num: '04 — Data',
      title: 'Microsoft Fabric & Azure data',
      body: 'Lakehouse and warehouse builds on Microsoft Fabric, Azure Databricks, Synapse and Azure SQL, with Purview governance and Power BI semantic models on top.',
      bullets: bullets(['Fabric lakehouse & OneLake', 'Purview catalogue & lineage', 'Power BI semantic models']),
    },
    {
      _type: 'capability', num: '05 — Migration',
      title: 'Migration & modernisation',
      body: 'Wave-based migration from on-premise, VMware, or another cloud. Azure Migrate assessment, App Service and AKS replatforming, and database migration with measured cutover gates.',
      bullets: bullets(['Azure Migrate assessment', 'AKS & App Service replatforming', 'Azure Database Migration Service']),
    },
    {
      _type: 'capability', num: '06 — Security & cost',
      title: 'Defender for Cloud & FinOps',
      body: 'Posture management with Defender for Cloud and Sentinel, plus reservations, savings plans, rightsizing and chargeback reporting through Microsoft Cost Management.',
      bullets: bullets(['Defender for Cloud & Sentinel', 'Reservations & savings plans', 'Chargeback & showback reporting']),
    },
  ]),

  processEyebrow: 'How we deliver',
  processHeading: 'Five stages from assessment to steady state.',
  processHeadingAccent: 'steady state.',
  processLead:
    'Aligned to the Microsoft Cloud Adoption Framework. Each stage has defined exit criteria, so you know when to move on.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / assess', title: 'Assess', body: 'Workload inventory, dependency mapping, Azure Migrate assessment, licensing and TCO analysis.', duration: 'Stage 01' },
    { _type: 'processStep', tag: '02 / foundation', title: 'Foundation', body: 'Landing zone, Entra ID design, networking, policy and security baselines deployed as code.', duration: 'Stage 02' },
    { _type: 'processStep', tag: '03 / migrate', title: 'Migrate', body: 'Wave-based workload migration with rehost, replatform or refactor chosen per workload.', duration: 'Stage 03' },
    { _type: 'processStep', tag: '04 / build', title: 'Build', body: 'Fabric data platform, Azure OpenAI workloads, AI Foundry agents, and the integrations around them.', duration: 'Stage 04' },
    { _type: 'processStep', tag: '05 / operate', title: 'Operate', body: 'Monitoring, security operations, FinOps and cost governance. Handover or ongoing managed service.', duration: 'Stage 05' },
  ]),

  compareEyebrow: 'Comparison',
  compareHeading: 'Fruition vs a Big-4 Azure practice.',
  compareHeadingAccent: 'Fruition',
  compareColLabel: 'Capability',
  compareColA: 'Fruition',
  compareColB: 'Big-4 / large SI',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Hands-on engineering', colA: 'Yes — in-house', colB: 'Often subcontracted' },
    { _type: 'compareRow', label: 'Fixed-fee phases', colA: 'Yes — published', colB: 'Retainer / T&M' },
    { _type: 'compareRow', label: 'Multi-cloud honesty', colA: 'Yes — AWS & GCP too', colB: 'Variable' },
    { _type: 'compareRow', label: 'Copilot + Azure in one team', colA: 'Yes', colB: 'Usually separate practices' },
    { _type: 'compareRow', label: 'Time to first working build', colA: 'Weeks', colB: 'Quarters' },
    { _type: 'compareRow', label: 'APAC + UK + US local teams', colA: 'Yes', colB: 'Yes' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Local Azure delivery in three regions.',
  geoHeadingAccent: 'three regions.',
  geoLead: 'Compliance, data residency, and Azure regions aligned to where your workloads need to run.',
  geo: geoCards('Azure'),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'Cloud engineering led by practitioners.',
  operatorHeadingAccent: 'practitioners.',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director, leads enterprise cloud engagements personally. Six years at monday.com before founding Fruition, and 500+ implementations across the major cloud and AI platforms since.',
    'Our Microsoft practice runs Azure and Microsoft 365 Copilot as one team, because the failure modes of a Copilot rollout usually live in the Azure and Entra ID layer underneath it.',
  ],
  operatorPanel: operatorPanel('Azure implementation'),
  operatorCreds: CREDS,

  faqEyebrow: 'FAQ',
  faqHeading: 'Azure questions, answered.',
  faqHeadingAccent: 'answered.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What does an Azure implementation partner actually do?', answer: 'We plan, build, migrate and operate workloads on Microsoft Azure. In practice that means landing zone and subscription design, Microsoft Entra ID and conditional access, migration of applications and databases, data platforms on Microsoft Fabric, Azure OpenAI and AI Foundry workloads, security posture with Defender for Cloud, and ongoing cost governance. Fruition delivers this across APAC, UK, and US.' },
    { _type: 'aiFaq', question: 'What is an Azure landing zone and why does it matter?', answer: 'A landing zone is the foundation everything else sits on: management group hierarchy, subscription topology, networking, identity, policy guardrails, and logging. Getting it wrong is the single most common cause of expensive Azure rework 12 to 18 months in, because policy and network decisions are hard to reverse once hundreds of resources depend on them. We deploy landing zones as infrastructure-as-code so they are reviewable and repeatable.' },
    { _type: 'aiFaq', question: 'How long does an Azure migration take?', answer: 'A single workload rehost typically takes 6 to 12 weeks including testing and cutover. A data platform build on Microsoft Fabric usually runs 3 to 6 months. A full enterprise migration of many workloads runs 12 to 24 months and is delivered in waves so value lands continuously rather than at the end.' },
    { _type: 'aiFaq', question: 'Should we use Azure OpenAI or the OpenAI API directly?', answer: 'Azure OpenAI runs the models inside your own Azure tenant, which gives you private networking, regional data residency, Entra ID authentication, and enterprise agreement billing. The direct OpenAI API typically gets new models and features first. Regulated organisations usually choose Azure OpenAI; teams optimising for the newest capability often choose the direct API. We are partners on both sides and will tell you which fits the workload.' },
    { _type: 'aiFaq', question: 'Can you run Azure and Microsoft 365 Copilot together?', answer: 'Yes, and we recommend it. Copilot readiness depends on Entra ID hygiene, SharePoint permissions, sensitivity labels and data governance — all of which live in the Microsoft cloud platform layer. Running both in one team removes the handoff where most Copilot rollouts stall.' },
    { _type: 'aiFaq', question: 'Do you work in regulated industries on Azure?', answer: 'Yes. Azure holds SOC 1/2/3, ISO 27001, HIPAA, PCI DSS, IRAP and FedRAMP certifications, with data residency in Australia East, UK South and US regions among others. We deliver with APRA CPS 234 governance overlays in Australia, FCA and UK GDPR overlays in the UK, and HIPAA and SOC 2 overlays in the US.' },
    { _type: 'aiFaq', question: 'Can you reduce our existing Azure bill?', answer: 'Usually, yes. The recurring wins are reservations and savings plans on steady-state compute, rightsizing over-provisioned VMs and SQL tiers, removing orphaned disks and idle resources, moving cold data to cheaper storage tiers, and putting chargeback reporting in front of the teams that create the spend. We run this as a fixed-scope engagement or as ongoing governance.' },
    { _type: 'aiFaq', question: 'What does an Azure engagement cost?', answer: 'Engagements start at AUD $35,000 for a landing zone foundation or a scoped cloud strategy. Migrations, data platforms and AI builds typically range from AUD $80,000 to $400,000 depending on scope. Enterprise programmes are priced phase by phase with a fixed fee per phase, so you can stop between phases.' },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Ready to build Azure properly?',
  ctaHeadingAccent: 'properly?',
  ctaBody:
    "Book a 30-minute scoping call. We'll size your landing zone, migration, or Azure AI build and give you a costed roadmap.",
  ctaLabel: 'Book Azure scoping call →',
  ctaUrl: CONTACT,
}

// ─────────────────────────────────────────────────────────────────────────
// 2. Supabase
// ─────────────────────────────────────────────────────────────────────────
const supabase = {
  _id: 'aiPartnerPage-supabase-partner',
  _type: 'aiPartnerPage',
  title: 'Supabase Consulting & Implementation Partner',
  slug: { _type: 'slug', current: 'supabase-partner' },
  seoTitle: 'Supabase Consulting & Implementation | APAC, UK & US | Fruition',
  seoDescription:
    'Supabase consulting and implementation across APAC, UK, and US. Postgres schema design, row level security, Auth, Edge Functions, Realtime, and pgvector retrieval for AI applications.',

  brandName: 'Supabase',
  partnerTag: 'Supabase Implementation',
  accentColor: '#0C7B54',
  accentColorDeep: '#08573B',
  accentColorSoft: 'rgba(12,123,84,0.10)',
  serifAccent: false,

  heroEyebrow: 'Supabase · Consulting & Implementation',
  heroHeading: "It's Postgres. Treat it like Postgres.",
  heroHeadingAccent: 'Treat it like Postgres.',
  heroLead:
    'Fruition Services builds production applications on Supabase — schema and row level security designed properly, Auth wired to your identity provider, Edge Functions for the work that must not run in the browser, and pgvector for retrieval that actually grounds your AI.',
  primaryCtaLabel: 'Book a Supabase scoping call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'Our capabilities',
  secondaryCtaUrl: '#capabilities',
  heroSidePanelType: 'code',
  heroSidePanelTitle: 'row level security, done once',
  heroCodeLines: [
    '-- tenant isolation enforced in the database,',
    '-- not in whichever client happens to call it',
    '',
    'alter table invoices enable row level security;',
    '',
    'create policy "tenant reads own invoices"',
    '  on invoices for select',
    '  using (org_id = auth.jwt() ->> \'org_id\');',
    '',
    'create index on documents',
    '  using hnsw (embedding vector_cosine_ops);',
    '',
    '-- one source of truth · every client obeys it',
  ],

  stripType: 'marquee',
  marqueeItems: [
    'POSTGRES',
    'ROW LEVEL SECURITY',
    'SUPABASE AUTH',
    'EDGE FUNCTIONS',
    'REALTIME',
    'PGVECTOR',
    'STORAGE',
    'APAC · UK · US',
  ],

  capEyebrow: 'Capabilities',
  capHeading: 'Supabase from schema design to production operations.',
  capHeadingAccent: 'production operations.',
  capLead:
    'Supabase gets teams to a working app fast. Keeping it correct at scale is a different skill — that is the part we do.',
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 — Data model',
      title: 'Postgres schema & migrations',
      body: 'Normalised schema design, constraints and indexes that match your real query patterns, and a migration workflow that survives more than one engineer.',
      bullets: bullets(['Schema & index design', 'Declarative migrations in CI', 'Query plan review']),
    },
    {
      _type: 'capability', num: '02 — Security',
      title: 'Row level security',
      body: 'Multi-tenant isolation enforced in the database rather than in application code, with policies tested as part of the build instead of trusted by convention.',
      bullets: bullets(['Tenant isolation policies', 'Service-role boundary design', 'Policy test coverage']),
    },
    {
      _type: 'capability', num: '03 — Identity',
      title: 'Auth & SSO',
      body: 'Supabase Auth wired to Google, Microsoft Entra ID, or SAML SSO, with custom claims, invitation flows, and session handling that behaves on server-rendered frameworks.',
      bullets: bullets(['SAML & OIDC single sign-on', 'Custom JWT claims', 'Server-side session handling']),
    },
    {
      _type: 'capability', num: '04 — Backend logic',
      title: 'Edge Functions & webhooks',
      body: 'Deno Edge Functions for payments, third-party API calls, scheduled jobs and webhook receivers — the logic that must never live in a browser bundle.',
      bullets: bullets(['Edge Functions & cron', 'Webhook receivers & queues', 'Secrets & service-role handling']),
    },
    {
      _type: 'capability', num: '05 — AI retrieval',
      title: 'pgvector & RAG',
      body: 'Embeddings stored next to your relational data, HNSW indexes tuned for recall and latency, and hybrid search that combines vector similarity with ordinary SQL filters.',
      bullets: bullets(['pgvector & HNSW tuning', 'Hybrid semantic + keyword search', 'Chunking & ingestion pipelines']),
    },
    {
      _type: 'capability', num: '06 — Operations',
      title: 'Scale, backups & observability',
      body: 'Connection pooling, read replicas, point-in-time recovery, branching for safe schema changes, and monitoring so you find the slow query before your users do.',
      bullets: bullets(['Pooling & read replicas', 'PITR & restore drills', 'Slow-query monitoring']),
    },
  ]),

  processEyebrow: 'How we deliver',
  processHeading: 'Four stages from schema to steady state.',
  processHeadingAccent: 'steady state.',
  processLead:
    'Short stages with working software at the end of each. Most Supabase engagements reach production inside a quarter.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / model', title: 'Model', body: 'Domain modelling, schema design, tenancy strategy and the RLS policy shape that follows from it.', duration: 'Stage 01' },
    { _type: 'processStep', tag: '02 / build', title: 'Build', body: 'Migrations, policies, Auth wiring, Edge Functions and the application layer that consumes them.', duration: 'Stage 02' },
    { _type: 'processStep', tag: '03 / harden', title: 'Harden', body: 'Policy tests, load testing, index and query plan review, backup and restore drills.', duration: 'Stage 03' },
    { _type: 'processStep', tag: '04 / operate', title: 'Operate', body: 'Monitoring, cost review, schema change process. Handover to your team or ongoing support.', duration: 'Stage 04' },
  ]),

  compareEyebrow: 'Comparison',
  compareHeading: 'Supabase vs a hand-rolled backend.',
  compareHeadingAccent: 'Supabase',
  compareColLabel: 'Concern',
  compareColA: 'Supabase',
  compareColB: 'Custom backend',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Time to first working API', colA: 'Days', colB: 'Weeks' },
    { _type: 'compareRow', label: 'Auth, storage, realtime', colA: 'Included', colB: 'Build or integrate each' },
    { _type: 'compareRow', label: 'Authorisation model', colA: 'In the database (RLS)', colB: 'In application code' },
    { _type: 'compareRow', label: 'Vector search', colA: 'pgvector, same database', colB: 'Separate vector store to sync' },
    { _type: 'compareRow', label: 'Lock-in', colA: 'Standard Postgres — portable', colB: 'Whatever you built' },
    { _type: 'compareRow', label: 'Where the risk sits', colA: 'Policy design', colB: 'Everything you wrote' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Local delivery in three regions.',
  geoHeadingAccent: 'three regions.',
  geoLead: 'Project residency and Postgres region selection aligned to where your data is allowed to live.',
  geo: geoCards('Supabase'),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'Application engineering led by practitioners.',
  operatorHeadingAccent: 'practitioners.',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director, leads platform and application engagements personally. Six years at monday.com before founding Fruition, and 500+ implementations since.',
    'We run Supabase in our own production systems, which is the honest reason we are opinionated about row level security and migration discipline.',
  ],
  operatorPanel: operatorPanel('Supabase implementation'),
  operatorCreds: CREDS,

  faqEyebrow: 'FAQ',
  faqHeading: 'Supabase questions, answered.',
  faqHeadingAccent: 'answered.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'Is Supabase production-ready for enterprise workloads?', answer: 'Yes, with the caveat that it is Postgres and rewards being treated as such. The platform gives you a managed Postgres instance with Auth, Storage, Realtime and Edge Functions around it. What determines whether it holds at scale is schema and index design, a correct row level security model, connection pooling, and a migration process. Those are engineering decisions, not platform limitations.' },
    { _type: 'aiFaq', question: 'What is row level security and why do you insist on it?', answer: 'Row level security is a Postgres feature that filters rows according to policies attached to the table, so a user can only ever read or write rows they are entitled to. It matters on Supabase because clients can talk to the database directly. If authorisation lives only in your application code, any client that bypasses that code bypasses your security. Putting the rules in the database means every path obeys them.' },
    { _type: 'aiFaq', question: 'Can Supabase handle AI retrieval and RAG?', answer: 'Yes, through the pgvector extension. Embeddings live in the same database as your relational data, which means a single query can combine vector similarity with ordinary SQL filters — tenant, date range, document status. That removes the sync problem you get when a separate vector store drifts from the system of record. We tune HNSW index parameters for the recall and latency your use case actually needs.' },
    { _type: 'aiFaq', question: 'How does Supabase compare to Firebase?', answer: 'Firebase is document-oriented and proprietary. Supabase is relational Postgres, so you get SQL, joins, constraints, transactions and a portable database you can move elsewhere. Firebase has a more mature mobile SDK story and offline sync. For applications with relational data, reporting requirements, or an existing SQL skill base, Supabase is usually the better fit.' },
    { _type: 'aiFaq', question: 'Can we self-host, or migrate off later?', answer: 'Yes to both. Supabase is open source and can be self-hosted, and because the database is standard Postgres you can dump and restore it into any Postgres host. The platform-specific pieces are Auth, Storage and Edge Functions, which are the parts to plan for if portability is a hard requirement. We design with that boundary explicit.' },
    { _type: 'aiFaq', question: 'Do you work with existing Supabase projects?', answer: 'Often. Typical engagements are a security review of an RLS model that grew organically, a performance engagement on queries that got slow as data grew, a migration from a prototype schema to one that holds, or adding SSO and enterprise auth to an app that started with email and password.' },
    { _type: 'aiFaq', question: 'Where is our data stored?', answer: 'You choose the project region at creation. Supabase offers regions including Sydney (ap-southeast-2), Singapore, London (eu-west-2) and several US regions, which lets us match Australian, UK and US data residency requirements. Region cannot be changed in place afterwards, so we settle it during design rather than after launch.' },
    { _type: 'aiFaq', question: 'What does a Supabase engagement cost?', answer: 'A schema and security review starts at AUD $12,000. A production application build typically runs AUD $60,000 to $250,000 depending on scope. Ongoing support and platform operations are available as a monthly retainer. Supabase platform fees are billed by Supabase directly and are separate from our fees.' },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Ready to build on Supabase properly?',
  ctaHeadingAccent: 'properly?',
  ctaBody:
    "Book a 30-minute scoping call. We'll review your schema, your security model, or your build plan and tell you what we'd change.",
  ctaLabel: 'Book Supabase scoping call →',
  ctaUrl: CONTACT,
}

// ─────────────────────────────────────────────────────────────────────────
// 3. LangGraph
// ─────────────────────────────────────────────────────────────────────────
const langgraph = {
  _id: 'aiPartnerPage-langgraph-partner',
  _type: 'aiPartnerPage',
  title: 'LangGraph Consulting & Implementation Partner',
  slug: { _type: 'slug', current: 'langgraph-partner' },
  seoTitle: 'LangGraph Consulting & Agent Implementation | APAC, UK & US | Fruition',
  seoDescription:
    'LangGraph consulting and implementation across APAC, UK, and US. Stateful agent graphs, checkpointing, human-in-the-loop approval gates, multi-agent supervision, and LangSmith evaluation.',

  brandName: 'LangGraph',
  partnerTag: 'LangGraph Implementation',
  accentColor: '#17706B',
  accentColorDeep: '#0F4F4B',
  accentColorSoft: 'rgba(23,112,107,0.10)',
  serifAccent: false,

  heroEyebrow: 'LangGraph · Agent Orchestration',
  heroHeading: 'Agents that can be paused, inspected and resumed.',
  heroHeadingAccent: 'paused, inspected and resumed.',
  heroLead:
    'A prompt loop is a demo. LangGraph gives an agent explicit state, durable checkpoints, and approval gates a human can stand behind — which is the difference between something you show a board and something you let touch production.',
  primaryCtaLabel: 'Book an agent scoping call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'Our capabilities',
  secondaryCtaUrl: '#capabilities',
  heroSidePanelType: 'log',
  heroSidePanelTitle: 'run · invoice-approval-graph',
  heroLogLines: withKeys([
    { _type: 'logLine', ts: '09:41:02', tag: '[NODE]', tagKind: 'info', msg: 'ingest → parsed 14 line items from supplier PDF' },
    { _type: 'logLine', ts: '09:41:04', tag: '[ACT ]', tagKind: 'act', msg: '→ tools.erp.match_purchase_order(po_id)' },
    { _type: 'logLine', ts: '09:41:07', tag: '[NODE]', tagKind: 'info', msg: 'reconcile → 13 matched · 1 variance $4,180' },
    { _type: 'logLine', ts: '09:41:07', tag: '[CKPT]', tagKind: 'info', msg: 'checkpoint written · thread_id=inv-88213' },
    { _type: 'logLine', ts: '09:41:08', tag: '[GATE]', tagKind: 'warn', msg: 'interrupt → variance over threshold · awaiting approver' },
    { _type: 'logLine', ts: '10:06:33', tag: '[NODE]', tagKind: 'info', msg: 'resumed from checkpoint · approved by finance.ap' },
    { _type: 'logLine', ts: '10:06:35', tag: '[ACT ]', tagKind: 'act', msg: '→ tools.erp.post_invoice(batch)' },
    { _type: 'logLine', ts: '10:06:38', tag: '[DONE]', tagKind: 'done', msg: 'graph complete · 9 nodes · 1 human gate' },
  ]),

  stripType: 'marquee',
  marqueeItems: [
    'STATEFUL GRAPHS',
    'CHECKPOINTING',
    'HUMAN-IN-THE-LOOP',
    'MULTI-AGENT SUPERVISION',
    'TOOL CALLING',
    'LANGSMITH EVALS',
    'DURABLE EXECUTION',
    'APAC · UK · US',
  ],

  capEyebrow: 'Capabilities',
  capHeading: 'Agent systems designed as graphs, not as prompt chains.',
  capHeadingAccent: 'not as prompt chains.',
  capLead:
    'Six capability areas covering the whole life of an agent — from the first state diagram to the evaluation suite that tells you when a model change broke it.',
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 — Design',
      title: 'Graph & state design',
      body: 'The design step most teams skip. Nodes, edges, conditional routing and an explicit state schema, so the agent has a shape you can reason about and review.',
      bullets: bullets(['State schema & reducers', 'Conditional routing & branching', 'Failure and retry paths']),
    },
    {
      _type: 'capability', num: '02 — Durability',
      title: 'Checkpointing & resumption',
      body: 'Persistent checkpointers so a run survives a crash, a deploy, or a two-hour wait for a human. Threads that can be replayed, forked, and audited after the fact.',
      bullets: bullets(['Postgres checkpointer', 'Thread replay & time travel', 'Long-running and cron-triggered runs']),
    },
    {
      _type: 'capability', num: '03 — Control',
      title: 'Human-in-the-loop gates',
      body: 'Interrupts placed where the business actually needs a decision — value thresholds, irreversible actions, low-confidence extraction — with approval routed to Slack, monday.com or your own tooling.',
      bullets: bullets(['Interrupt & resume flows', 'Approval routing to Slack / monday.com', 'Edit-state-before-resume']),
    },
    {
      _type: 'capability', num: '04 — Scale',
      title: 'Multi-agent architecture',
      body: 'Supervisor and swarm patterns, subgraphs with their own state, and handoff rules — used when one agent with thirty tools has stopped being reliable.',
      bullets: bullets(['Supervisor & handoff patterns', 'Subgraphs with scoped state', 'Tool partitioning strategy']),
    },
    {
      _type: 'capability', num: '05 — Evidence',
      title: 'LangSmith tracing & evals',
      body: 'Every run traced, datasets built from real traffic, and regression evaluations that run before a prompt or model change ships — not after someone complains.',
      bullets: bullets(['Trace-level observability', 'Eval datasets from production traffic', 'Regression gates in CI']),
    },
    {
      _type: 'capability', num: '06 — Deployment',
      title: 'Production deployment',
      body: 'Deployment on LangGraph Platform or self-hosted on your own cloud, with streaming, authentication, rate limiting, cost controls and the integration surface around the graph.',
      bullets: bullets(['LangGraph Platform or self-hosted', 'Streaming & token cost controls', 'Auth, rate limits, and integrations']),
    },
  ]),

  processEyebrow: 'How we deliver',
  processHeading: 'Four stages from state diagram to production graph.',
  processHeadingAccent: 'production graph.',
  processLead:
    'We start by drawing the graph on a whiteboard with the people who own the process. If it cannot be drawn, it is not ready to be automated.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / map', title: 'Map', body: 'Process mapping with the business owners. Decision points, exceptions, and where a human must stay in the loop.', duration: 'Stage 01' },
    { _type: 'processStep', tag: '02 / build', title: 'Build', body: 'Graph implementation, tool integrations, state schema, checkpointing and interrupt gates.', duration: 'Stage 02' },
    { _type: 'processStep', tag: '03 / evaluate', title: 'Evaluate', body: 'Eval datasets from real cases, accuracy and cost measurement, adversarial and edge-case testing.', duration: 'Stage 03' },
    { _type: 'processStep', tag: '04 / operate', title: 'Operate', body: 'Production deployment, tracing, cost monitoring, and a regression suite that gates every change.', duration: 'Stage 04' },
  ]),

  compareEyebrow: 'Comparison',
  compareHeading: 'LangGraph vs a prompt-chain agent.',
  compareHeadingAccent: 'LangGraph',
  compareColLabel: 'Concern',
  compareColA: 'LangGraph',
  compareColB: 'Prompt chain / loop',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'State', colA: 'Explicit and typed', colB: 'Implicit in the transcript' },
    { _type: 'compareRow', label: 'Crash mid-run', colA: 'Resume from checkpoint', colB: 'Start over' },
    { _type: 'compareRow', label: 'Human approval', colA: 'Interrupt and resume', colB: 'Bolted on, if at all' },
    { _type: 'compareRow', label: 'Auditability', colA: 'Per-node trace', colB: 'One long transcript' },
    { _type: 'compareRow', label: 'Multi-agent', colA: 'Subgraphs and supervisors', colB: 'Nested prompt spaghetti' },
    { _type: 'compareRow', label: 'Regression testing', colA: 'Eval suite in CI', colB: 'Manual spot checks' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Agent delivery in three regions.',
  geoHeadingAccent: 'three regions.',
  geoLead: 'Model region, data residency and approval governance aligned to the jurisdiction the process runs in.',
  geo: geoCards('LangGraph'),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'Agent engineering led by practitioners.',
  operatorHeadingAccent: 'practitioners.',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director, leads agent engagements personally. Six years at monday.com before founding Fruition, and 500+ implementations across the major AI and work platforms since.',
    'We run LangGraph agents inside our own operations, including content and reporting pipelines with human approval gates. The design opinions on this page came out of running them, not reading about them.',
  ],
  operatorPanel: operatorPanel('LangGraph implementation'),
  operatorCreds: CREDS,

  faqEyebrow: 'FAQ',
  faqHeading: 'LangGraph questions, answered.',
  faqHeadingAccent: 'answered.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What is LangGraph?', answer: 'LangGraph is an open-source framework from the LangChain team for building agent systems as graphs. You define nodes (steps), edges (routing between them), and a shared state object the nodes read and write. Because state and control flow are explicit, a run can be checkpointed, paused for human approval, resumed, replayed and audited — which is what separates a production agent from a demo loop.' },
    { _type: 'aiFaq', question: 'How is LangGraph different from LangChain?', answer: 'LangChain is a broad library of model, tool and retrieval abstractions. LangGraph is a narrower framework specifically for orchestrating stateful, multi-step agent workflows. They are complementary — LangGraph graphs commonly call LangChain components inside nodes — but you can use either without the other.' },
    { _type: 'aiFaq', question: 'Do we need LangGraph, or is a simple loop enough?', answer: 'If the task is one model call with a couple of tools and no consequences when it goes wrong, a simple loop is fine and we will say so. LangGraph earns its place when the workflow has branching, must survive restarts, needs a human decision partway through, spans multiple agents, or touches systems where a wrong action is expensive to undo.' },
    { _type: 'aiFaq', question: 'How does human-in-the-loop approval work?', answer: 'You place an interrupt at a node. The graph checkpoints its state and stops. Your application surfaces the pending decision wherever your approvers already work — Slack, monday.com, email, or an internal tool — and when someone approves, edits, or rejects, the graph resumes from the checkpoint with that input applied. The waiting period can be minutes or days.' },
    { _type: 'aiFaq', question: 'Which language models does it work with?', answer: 'LangGraph is model-agnostic. We commonly build on Anthropic Claude, OpenAI, Google Gemini, and models hosted on Azure OpenAI or Amazon Bedrock, and mixed graphs are normal — a cheaper model for classification nodes and a stronger one for reasoning nodes. We are partners across those platforms, so the recommendation is per workload rather than per vendor.' },
    { _type: 'aiFaq', question: 'How do you know the agent still works after a change?', answer: 'Evaluation datasets built from real cases, run through LangSmith on every prompt, model or graph change, scoring accuracy, cost and latency against the previous baseline. The suite runs in CI as a gate. Without it, a model upgrade is an unmonitored production change.' },
    { _type: 'aiFaq', question: 'Can it be self-hosted in our own cloud?', answer: 'Yes. LangGraph is open source and can run in your own infrastructure, with checkpoints in your own Postgres, in your chosen region. LangGraph Platform is available as a managed option when you would rather not operate it. We deploy either way and will be plain about the operational cost of each.' },
    { _type: 'aiFaq', question: 'What does an agent engagement cost?', answer: 'A scoped agent build typically runs AUD $45,000 to $180,000 depending on the number of integrations and the depth of evaluation required. Discovery and process mapping can be bought separately from AUD $12,000 if you want to size the work before committing to the build.' },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Ready to put an agent into production?',
  ctaHeadingAccent: 'into production?',
  ctaBody:
    "Book a 30-minute scoping call. We'll map the process, mark the decision points, and tell you whether an agent is the right answer.",
  ctaLabel: 'Book agent scoping call →',
  ctaUrl: CONTACT,
}

// ─────────────────────────────────────────────────────────────────────────
// 4. Clay
// ─────────────────────────────────────────────────────────────────────────
const clay = {
  _id: 'aiPartnerPage-clay-partner',
  _type: 'aiPartnerPage',
  title: 'Clay Consulting & Implementation Partner',
  slug: { _type: 'slug', current: 'clay-partner' },
  seoTitle: 'Clay Consulting & GTM Data Implementation | APAC, UK & US | Fruition',
  seoDescription:
    'Clay consulting and implementation across APAC, UK, and US. Waterfall enrichment, Claygent research, signal-based outbound, and clean writeback into monday.com, HubSpot or Salesforce.',

  brandName: 'Clay',
  partnerTag: 'Clay Implementation',
  accentColor: '#B4501B',
  accentColorDeep: '#8A3C13',
  accentColorSoft: 'rgba(180,80,27,0.10)',
  serifAccent: false,

  heroEyebrow: 'Clay · GTM Data & Outbound',
  heroHeading: 'Enrichment is the easy part. Deciding what it means is the work.',
  heroHeadingAccent: 'Deciding what it means is the work.',
  heroLead:
    'Fruition Services builds Clay workspaces that do more than fill columns — waterfall enrichment tuned for coverage against cost, Claygent research that answers qualification questions, and writeback your CRM can trust.',
  primaryCtaLabel: 'Book a Clay scoping call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'Our capabilities',
  secondaryCtaUrl: '#capabilities',
  heroSidePanelType: 'log',
  heroSidePanelTitle: 'table · inbound-lead-qualification',
  heroLogLines: withKeys([
    { _type: 'logLine', ts: 'step 1', tag: '[SRC ]', tagKind: 'info', msg: 'website form submission → 214 new rows this week' },
    { _type: 'logLine', ts: 'step 2', tag: '[ENR ]', tagKind: 'act', msg: 'waterfall: work email → provider 1 · 2 · 3 · stop on hit' },
    { _type: 'logLine', ts: 'step 3', tag: '[ENR ]', tagKind: 'act', msg: 'firmographics → headcount, industry, tech stack' },
    { _type: 'logLine', ts: 'step 4', tag: '[AI  ]', tagKind: 'act', msg: 'claygent: "do they run monday.com or Jira?" → sourced' },
    { _type: 'logLine', ts: 'step 5', tag: '[GATE]', tagKind: 'warn', msg: 'score < 60 → nurture · own-domain rows excluded' },
    { _type: 'logLine', ts: 'step 6', tag: '[OUT ]', tagKind: 'act', msg: 'writeback → monday.com CRM · dedupe on domain' },
    { _type: 'logLine', ts: 'step 7', tag: '[DONE]', tagKind: 'done', msg: '188 enriched · 41 routed to sequence · 0 duplicates' },
  ]),

  stripType: 'marquee',
  marqueeItems: [
    'WATERFALL ENRICHMENT',
    'CLAYGENT RESEARCH',
    'SIGNAL-BASED OUTBOUND',
    'CRM WRITEBACK',
    'DEDUPLICATION',
    'CREDIT EFFICIENCY',
    'APAC · UK · US',
  ],

  capEyebrow: 'Capabilities',
  capHeading: 'Clay workspaces built to survive contact with a real pipeline.',
  capHeadingAccent: 'a real pipeline.',
  capLead:
    'Clay is a spreadsheet with an API budget attached. Six capability areas covering the difference between a clever table and a system your revenue team relies on.',
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 — Sourcing',
      title: 'List building & inbound capture',
      body: 'Target account and contact sourcing from Clay-native providers, imported lists, and live sources — website forms, visitor identification, and event data piped in over HTTP.',
      bullets: bullets(['ICP-driven account sourcing', 'HTTP API and webhook inputs', 'Website visitor identification feeds']),
    },
    {
      _type: 'capability', num: '02 — Enrichment',
      title: 'Waterfall enrichment',
      body: 'Provider sequences ordered by hit rate and cost per credit, so you stop paying three vendors for the same email. Coverage measured, not assumed.',
      bullets: bullets(['Provider sequencing by cost and hit rate', 'Coverage and spend reporting', 'Fallback logic for thin records']),
    },
    {
      _type: 'capability', num: '03 — Research',
      title: 'Claygent qualification',
      body: 'AI research agents that answer the specific questions your reps would otherwise open ten tabs for — tech stack, hiring signals, funding, regulatory posture — with a cited source per answer.',
      bullets: bullets(['Prompted research with cited sources', 'Tech-stack and hiring signal detection', 'Structured output for scoring']),
    },
    {
      _type: 'capability', num: '04 — Scoring',
      title: 'Scoring & routing',
      body: 'A scoring model your sales leadership actually agrees with, exclusion rules that keep competitors, own-domain traffic and existing customers out, and routing to the right owner.',
      bullets: bullets(['Fit and intent scoring', 'Exclusion and suppression lists', 'Owner and territory routing']),
    },
    {
      _type: 'capability', num: '05 — Integration',
      title: 'CRM & sequencer writeback',
      body: 'Clean writeback into monday.com CRM, HubSpot or Salesforce, plus enrolment into SmartLead, Instantly or your sequencer — with deduplication and field mapping that holds.',
      bullets: bullets(['monday.com / HubSpot / Salesforce writeback', 'Sequencer enrolment with field contracts', 'Domain-level deduplication']),
    },
    {
      _type: 'capability', num: '06 — Economics',
      title: 'Credit & cost control',
      body: 'Credit consumption monitored per table and per provider, expensive enrichments gated behind qualification, and a monthly view of cost per qualified account.',
      bullets: bullets(['Per-table credit monitoring', 'Gated expensive enrichments', 'Cost per qualified account reporting']),
    },
  ]),

  processEyebrow: 'How we deliver',
  processHeading: 'Four stages from ICP to a running pipeline.',
  processHeadingAccent: 'a running pipeline.',
  processLead:
    'We start with the definition of a good account. Everything downstream is only as good as that answer.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / define', title: 'Define', body: 'ICP definition, qualification criteria, exclusion rules, and the fields your CRM actually needs.', duration: 'Stage 01' },
    { _type: 'processStep', tag: '02 / build', title: 'Build', body: 'Tables, waterfall enrichment, Claygent prompts, scoring model and writeback integrations.', duration: 'Stage 02' },
    { _type: 'processStep', tag: '03 / validate', title: 'Validate', body: 'Sample verification against real records, coverage and accuracy measurement, credit cost review.', duration: 'Stage 03' },
    { _type: 'processStep', tag: '04 / operate', title: 'Operate', body: 'Scheduled runs, monitoring, monthly tuning of providers, prompts and scoring thresholds.', duration: 'Stage 04' },
  ]),

  compareEyebrow: 'Comparison',
  compareHeading: 'Clay vs a single data vendor.',
  compareHeadingAccent: 'Clay',
  compareColLabel: 'Concern',
  compareColA: 'Clay',
  compareColB: 'Single enrichment vendor',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Coverage', colA: 'Waterfall across many providers', colB: 'Whatever one vendor has' },
    { _type: 'compareRow', label: 'Cost control', colA: 'Stop on first hit', colB: 'Flat seat or record pricing' },
    { _type: 'compareRow', label: 'Custom qualification', colA: 'AI research per question', colB: 'Fixed fields only' },
    { _type: 'compareRow', label: 'Workflow logic', colA: 'In-platform', colB: 'Elsewhere, usually a spreadsheet' },
    { _type: 'compareRow', label: 'Who maintains it', colA: 'Needs an owner', colB: 'Vendor maintains the data' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'GTM data delivery in three regions.',
  geoHeadingAccent: 'three regions.',
  geoLead: 'Consent, suppression and outreach rules aligned to the jurisdiction you are prospecting into.',
  geo: geoCards('Clay'),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'Revenue operations led by practitioners.',
  operatorHeadingAccent: 'practitioners.',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director, leads revenue operations engagements personally. Six years at monday.com before founding Fruition, and 500+ implementations since.',
    'We run our own inbound and outbound pipeline on this stack — enrichment into monday.com CRM, scoring, and sequenced follow-up. The failure modes on this page are ones we have hit ourselves.',
  ],
  operatorPanel: operatorPanel('Clay implementation'),
  operatorCreds: CREDS,

  faqEyebrow: 'FAQ',
  faqHeading: 'Clay questions, answered.',
  faqHeadingAccent: 'answered.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What is Clay?', answer: 'Clay is a go-to-market data platform. It looks like a spreadsheet, but each column can call an enrichment provider, an AI research agent, or your own API. Teams use it to build target lists, enrich accounts and contacts, qualify them automatically, and push the results into a CRM or an outbound sequencer.' },
    { _type: 'aiFaq', question: 'What is waterfall enrichment and why does it matter?', answer: 'Waterfall enrichment queries data providers in sequence and stops at the first useful result, instead of paying every provider for every record. It matters for two reasons: coverage improves because different providers are strong on different segments and geographies, and cost falls because you are not buying the same email three times. The order is the thing worth tuning, and it should be tuned against your own data rather than a generic template.' },
    { _type: 'aiFaq', question: 'What is Claygent?', answer: 'Claygent is Clay’s AI research agent. You give it a question in plain language — "what work management tool does this company use?", "have they posted engineering roles in the last 90 days?" — and it researches across the web and returns a structured answer with sources. It is most valuable for qualification criteria no data vendor sells as a field.' },
    { _type: 'aiFaq', question: 'Does Clay replace our CRM?', answer: 'No, and treating it as one is the most common mistake we clean up. Clay is the enrichment and qualification layer in front of your CRM. Your CRM stays the system of record. We build the writeback so records land clean and deduplicated in monday.com CRM, HubSpot or Salesforce, and so a rep never has to work in two places.' },
    { _type: 'aiFaq', question: 'How do you keep credit costs under control?', answer: 'Order the waterfall so the cheapest provider with a decent hit rate runs first. Gate expensive enrichments and AI research behind a qualification step so they only run on accounts that already scored. Monitor credit consumption per table and per provider. Report on cost per qualified account rather than cost per row, because that is the number that tells you whether the system is working.' },
    { _type: 'aiFaq', question: 'Is this compliant with GDPR and Australian privacy law?', answer: 'B2B prospecting is lawful in most jurisdictions but the rules differ, and they bind you rather than the tooling. We build suppression and consent handling into the workspace: exclusion lists, jurisdiction-aware outreach rules, unsubscribe honouring across systems, and source recording on enriched fields. We are not your legal advisers, so where your risk appetite is uncertain we will say so and recommend you check.' },
    { _type: 'aiFaq', question: 'Can Clay connect to monday.com?', answer: 'Yes — through Clay’s HTTP API column and monday.com’s API, which is how we normally build it because it gives full control over column mapping and deduplication. As a monday.com Platinum Partner we build the monday side too, so the board structure and the enrichment are designed together rather than bolted to each other.' },
    { _type: 'aiFaq', question: 'What does a Clay engagement cost?', answer: 'A workspace build typically runs AUD $18,000 to $60,000 depending on the number of tables, integrations and scoring complexity. Ongoing optimisation is available as a monthly retainer. Clay platform and credit costs are billed by Clay directly and are separate from our fees.' },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Ready to make your pipeline data trustworthy?',
  ctaHeadingAccent: 'trustworthy?',
  ctaBody:
    "Book a 30-minute scoping call. We'll look at your ICP, your current enrichment spend, and where the leaks are.",
  ctaLabel: 'Book Clay scoping call →',
  ctaUrl: CONTACT,
}

// ─────────────────────────────────────────────────────────────────────────
// 5. ElevenLabs
// ─────────────────────────────────────────────────────────────────────────
const elevenlabs = {
  _id: 'aiPartnerPage-elevenlabs-partner',
  _type: 'aiPartnerPage',
  title: 'ElevenLabs Consulting & Implementation Partner',
  slug: { _type: 'slug', current: 'elevenlabs-partner' },
  seoTitle: 'ElevenLabs Consulting & Voice AI Implementation | APAC, UK & US | Fruition',
  seoDescription:
    'ElevenLabs consulting and implementation across APAC, UK, and US. Text to speech, voice cloning with consent, multilingual dubbing, speech to text, and conversational voice agents.',

  brandName: 'ElevenLabs',
  partnerTag: 'ElevenLabs Implementation',
  // ElevenLabs' own brand is monochrome; a near-black accent made the hero
  // heading highlight invisible against body text, so this is a restrained
  // indigo that still reads as a highlight.
  accentColor: '#4338CA',
  accentColorDeep: '#312E81',
  accentColorSoft: 'rgba(67,56,202,0.10)',
  serifAccent: false,

  heroEyebrow: 'ElevenLabs · Voice AI',
  heroHeading: 'Synthetic voice that survives being heard twice.',
  heroHeadingAccent: 'being heard twice.',
  heroLead:
    'Fruition Services implements ElevenLabs for enterprises — product and IVR voice, multilingual dubbing, transcription at volume, and conversational agents. With the consent, disclosure and brand-governance layer that keeps a cloned voice defensible.',
  primaryCtaLabel: 'Book a voice AI scoping call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'Our capabilities',
  secondaryCtaUrl: '#capabilities',
  heroSidePanelType: 'code',
  heroSidePanelTitle: 'streamed speech, one brand voice',
  heroCodeLines: [
    '// one approved voice id, governed centrally',
    'import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";',
    '',
    'const audio = await client.textToSpeech.stream(',
    '  process.env.BRAND_VOICE_ID, {',
    '    text: script,',
    '    modelId: "eleven_multilingual_v2",',
    '    outputFormat: "mp3_44100_128",',
    '  }',
    ');',
    '',
    '// consent on file · disclosure in the footer',
    '// 29 languages · same voice in all of them',
  ],

  stripType: 'marquee',
  marqueeItems: [
    'TEXT TO SPEECH',
    'VOICE CLONING',
    'MULTILINGUAL DUBBING',
    'SPEECH TO TEXT',
    'CONVERSATIONAL AGENTS',
    'CONSENT & DISCLOSURE',
    'APAC · UK · US',
  ],

  capEyebrow: 'Capabilities',
  capHeading: 'Voice AI from first sample to governed production use.',
  capHeadingAccent: 'governed production use.',
  capLead:
    'Six capability areas. The technical ones are the fast part — the governance is what makes a legal team sign it off.',
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 — Speech',
      title: 'Text to speech at product quality',
      body: 'Model and voice selection, pronunciation dictionaries for product and place names, latency tuning for streaming, and output formats that suit web, telephony and broadcast.',
      bullets: bullets(['Model & voice selection', 'Pronunciation dictionaries', 'Streaming latency tuning']),
    },
    {
      _type: 'capability', num: '02 — Brand voice',
      title: 'Voice cloning & consent',
      body: 'Professional and instant voice clones, with recorded consent, usage scope, revocation process and audit trail — because a cloned executive voice is a legal artefact, not just an asset.',
      bullets: bullets(['Professional voice clone setup', 'Recorded consent & usage scope', 'Revocation and audit trail']),
    },
    {
      _type: 'capability', num: '03 — Languages',
      title: 'Dubbing & localisation',
      body: 'Multilingual dubbing pipelines that keep one recognisable voice across languages, with human review gates before anything customer-facing ships.',
      bullets: bullets(['Multilingual dubbing pipelines', 'Voice consistency across languages', 'Human review before release']),
    },
    {
      _type: 'capability', num: '04 — Transcription',
      title: 'Speech to text at volume',
      body: 'Batch and streaming transcription with speaker diarisation, feeding search, compliance review, meeting intelligence and analytics rather than sitting in a folder.',
      bullets: bullets(['Batch & streaming transcription', 'Speaker diarisation', 'Downstream search & analytics']),
    },
    {
      _type: 'capability', num: '05 — Conversation',
      title: 'Conversational voice agents',
      body: 'Agents that answer, qualify and route calls — connected to your CRM and knowledge base, with escalation to a human that does not lose the context.',
      bullets: bullets(['Knowledge-grounded voice agents', 'CRM & calendar integration', 'Warm escalation to humans']),
    },
    {
      _type: 'capability', num: '06 — Governance',
      title: 'Disclosure & risk controls',
      body: 'Disclosure wording, watermarking and provenance, restricted voice access, and an internal policy on who may generate speech as whom — reviewed against EU AI Act transparency duties.',
      bullets: bullets(['AI disclosure wording', 'Restricted voice access', 'EU AI Act transparency alignment']),
    },
  ]),

  processEyebrow: 'How we deliver',
  processHeading: 'Four stages from voice selection to production.',
  processHeadingAccent: 'production.',
  processLead:
    'Voice projects fail on governance far more often than on audio quality. We front-load the part that stalls.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / define', title: 'Define', body: 'Use case, voice identity, language scope, consent and disclosure requirements per jurisdiction.', duration: 'Stage 01' },
    { _type: 'processStep', tag: '02 / build', title: 'Build', body: 'Voice setup or cloning, pronunciation dictionaries, API integration, and the review workflow around it.', duration: 'Stage 02' },
    { _type: 'processStep', tag: '03 / validate', title: 'Validate', body: 'Listening tests with real scripts, latency and cost measurement, accessibility and legal review.', duration: 'Stage 03' },
    { _type: 'processStep', tag: '04 / operate', title: 'Operate', body: 'Production rollout, usage monitoring, voice access control, and periodic quality review.', duration: 'Stage 04' },
  ]),

  compareEyebrow: 'Comparison',
  compareHeading: 'Synthetic voice vs a studio booking.',
  compareHeadingAccent: 'Synthetic voice',
  compareColLabel: 'Concern',
  compareColA: 'ElevenLabs',
  compareColB: 'Studio recording',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Turnaround on a copy change', colA: 'Minutes', colB: 'Days to re-book' },
    { _type: 'compareRow', label: 'Cost per language', colA: 'Marginal', colB: 'A new talent and session each' },
    { _type: 'compareRow', label: 'Dynamic or personalised content', colA: 'Yes — generated per request', colB: 'Not practical' },
    { _type: 'compareRow', label: 'Emotional range on long-form', colA: 'Good, improving', colB: 'Still the benchmark' },
    { _type: 'compareRow', label: 'Consent & disclosure burden', colA: 'Real — must be managed', colB: 'Handled by contract' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Voice AI delivery in three regions.',
  geoHeadingAccent: 'three regions.',
  geoLead: 'Disclosure duties, biometric consent and recording law differ by jurisdiction. We build to the strictest one in scope.',
  geo: geoCards('ElevenLabs'),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'Voice AI led by practitioners.',
  operatorHeadingAccent: 'practitioners.',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director, leads AI engagements personally. Six years at monday.com before founding Fruition, and 500+ implementations across the major AI platforms since.',
    'Voice is the AI capability where the governance work is most disproportionate to the build. We scope both together, because a cloned voice without a consent record is a liability with good audio quality.',
  ],
  operatorPanel: operatorPanel('ElevenLabs implementation'),
  operatorCreds: CREDS,

  faqEyebrow: 'FAQ',
  faqHeading: 'ElevenLabs questions, answered.',
  faqHeadingAccent: 'answered.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What is ElevenLabs used for in an enterprise?', answer: 'The common enterprise uses are product and in-app narration, IVR and phone system voice, training and e-learning audio, marketing and video voiceover, multilingual dubbing of existing content, transcription of calls and meetings, and conversational voice agents that answer or make calls.' },
    { _type: 'aiFaq', question: 'Is voice cloning legal?', answer: 'Cloning a voice you have documented consent to use is lawful in the jurisdictions we operate in. Cloning someone else’s voice without consent is not, and in several jurisdictions a voice is treated as biometric or personal data with its own duties. We build with recorded consent, a defined usage scope, a revocation path and an audit trail, and we advise disclosure where synthetic speech could be mistaken for a real person. We are not your legal advisers — for novel uses, have counsel review the scope.' },
    { _type: 'aiFaq', question: 'How many languages are supported?', answer: 'ElevenLabs multilingual models cover 29 languages and more in newer models, including English, Mandarin, Hindi, Spanish, French, German, Japanese and Arabic. The commercially useful property is that a single cloned voice can speak across those languages, so a brand keeps one recognisable voice rather than a different talent per market.' },
    { _type: 'aiFaq', question: 'Can it handle real-time conversation?', answer: 'Yes. Streaming synthesis is fast enough for interactive use, and ElevenLabs offers a conversational agent product that combines speech recognition, a language model and speech synthesis. For telephony-heavy deployments we often pair it with a dedicated voice orchestration platform such as Vapi, depending on how much call control and telephony integration you need.' },
    { _type: 'aiFaq', question: 'How good is the quality really?', answer: 'For short-form, informational and conversational content it is generally indistinguishable from a competent human recording to most listeners. For long-form emotional narration — audiobooks, dramatic performance — a skilled human still outperforms it. We will tell you which category your content falls into rather than overselling the second one.' },
    { _type: 'aiFaq', question: 'Where is the audio processed, and is our text retained?', answer: 'ElevenLabs processes through its own infrastructure. Enterprise agreements cover data handling, retention and zero-retention options. Where you have strict residency requirements we cover them during scoping, and if the requirement cannot be met we will say so rather than working around it.' },
    { _type: 'aiFaq', question: 'Can it read our product names correctly?', answer: 'Yes, with pronunciation dictionaries. Product names, brand names, acronyms, place names and personal names are exactly where default pronunciation embarrasses you, so building the dictionary is a standard part of our setup rather than an afterthought.' },
    { _type: 'aiFaq', question: 'What does a voice AI engagement cost?', answer: 'A scoped implementation typically runs AUD $15,000 to $75,000 depending on integration depth, language count and the governance work required. Conversational voice agent builds are usually scoped alongside a telephony platform and priced together. ElevenLabs subscription and usage costs are billed by ElevenLabs directly.' },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Ready to give your product a voice?',
  ctaHeadingAccent: 'a voice?',
  ctaBody:
    "Book a 30-minute scoping call. We'll cover the use case, the languages, and the consent and disclosure work it implies.",
  ctaLabel: 'Book voice AI scoping call →',
  ctaUrl: CONTACT,
}

// ─────────────────────────────────────────────────────────────────────────
// 6. Vapi
// ─────────────────────────────────────────────────────────────────────────
const vapi = {
  _id: 'aiPartnerPage-vapi-partner',
  _type: 'aiPartnerPage',
  title: 'Vapi Consulting & Voice Agent Implementation Partner',
  slug: { _type: 'slug', current: 'vapi-partner' },
  seoTitle: 'Vapi Consulting & Voice Agent Implementation | APAC, UK & US | Fruition',
  seoDescription:
    'Vapi consulting and implementation across APAC, UK, and US. Inbound and outbound voice agents, telephony and SIP integration, tool calling into your CRM, and warm transfer to humans.',

  brandName: 'Vapi',
  partnerTag: 'Vapi Implementation',
  accentColor: '#0B7F6E',
  accentColorDeep: '#08574B',
  accentColorSoft: 'rgba(11,127,110,0.10)',
  serifAccent: false,

  heroEyebrow: 'Vapi · Voice Agents',
  heroHeading: 'Phone calls your team no longer has to answer.',
  heroHeadingAccent: 'no longer has to answer.',
  heroLead:
    'Fruition Services builds production voice agents on Vapi — answering inbound, qualifying and booking, calling out on a schedule, and handing to a human with the context already carried across. Connected to your CRM, not to a demo script.',
  primaryCtaLabel: 'Book a voice agent scoping call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'Our capabilities',
  secondaryCtaUrl: '#capabilities',
  heroSidePanelType: 'log',
  heroSidePanelTitle: 'call · inbound-reception-agent',
  heroLogLines: withKeys([
    { _type: 'logLine', ts: '00:00', tag: '[CALL]', tagKind: 'info', msg: 'inbound +61 2 •••• 4417 → agent answered in 0.4s' },
    { _type: 'logLine', ts: '00:06', tag: '[STT ]', tagKind: 'info', msg: '"hi, I want to reschedule Thursday\'s site visit"' },
    { _type: 'logLine', ts: '00:08', tag: '[TOOL]', tagKind: 'act', msg: '→ crm.lookup_contact(caller_number)' },
    { _type: 'logLine', ts: '00:09', tag: '[TOOL]', tagKind: 'act', msg: '→ calendar.find_slots(owner, next_10_days)' },
    { _type: 'logLine', ts: '00:14', tag: '[TTS ]', tagKind: 'info', msg: 'offered Tue 9:30 or Wed 14:00 · caller took Wed' },
    { _type: 'logLine', ts: '00:22', tag: '[TOOL]', tagKind: 'act', msg: '→ calendar.reschedule() · crm.log_activity()' },
    { _type: 'logLine', ts: '00:31', tag: '[GATE]', tagKind: 'warn', msg: 'pricing question detected → warm transfer to sales' },
    { _type: 'logLine', ts: '00:34', tag: '[DONE]', tagKind: 'done', msg: 'transferred with summary · 34s handled autonomously' },
  ]),

  stripType: 'marquee',
  marqueeItems: [
    'INBOUND AGENTS',
    'OUTBOUND CAMPAIGNS',
    'TELEPHONY & SIP',
    'TOOL CALLING',
    'WARM TRANSFER',
    'CALL ANALYSIS',
    'APAC · UK · US',
  ],

  capEyebrow: 'Capabilities',
  capHeading: 'Voice agents that do the work, not just the talking.',
  capHeadingAccent: 'not just the talking.',
  capLead:
    'A voice agent is only useful if it can act — look a customer up, move a booking, log the outcome. Six capability areas covering the whole call path.',
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 — Design',
      title: 'Conversation design',
      body: 'Scope, persona, and the boundaries of what the agent may say and do. Interruption handling, silence handling, and a defined path for every question it should not answer.',
      bullets: bullets(['Scope & escalation boundaries', 'Barge-in and silence handling', 'Out-of-scope deflection paths']),
    },
    {
      _type: 'capability', num: '02 — Stack',
      title: 'Model & voice selection',
      body: 'Choosing the transcription model, language model and voice for the accents, vocabulary and latency your calls actually involve, then tuning until it stops sounding like a robot reading.',
      bullets: bullets(['STT model tuning for accents', 'LLM selection and prompt design', 'Voice selection & latency budget']),
    },
    {
      _type: 'capability', num: '03 — Telephony',
      title: 'Numbers, SIP & routing',
      body: 'Phone numbers, SIP trunk integration with your existing PBX or contact centre, call routing, recording, and compliant consent announcements per jurisdiction.',
      bullets: bullets(['SIP trunk & PBX integration', 'Number provisioning & routing', 'Recording consent announcements']),
    },
    {
      _type: 'capability', num: '04 — Actions',
      title: 'Tool calling into your systems',
      body: 'The part that makes it worth doing — CRM lookups, calendar booking, order status, ticket creation, and writeback into monday.com, HubSpot or Salesforce during the call.',
      bullets: bullets(['CRM lookup & writeback', 'Calendar booking & rescheduling', 'Ticket and order system actions']),
    },
    {
      _type: 'capability', num: '05 — Handover',
      title: 'Escalation to humans',
      body: 'Warm transfer with a spoken summary to the receiving agent, plus rules for when to escalate: emotion, repetition, high value, or anything the agent is not permitted to decide.',
      bullets: bullets(['Warm transfer with context summary', 'Emotion & repetition triggers', 'After-hours and overflow routing']),
    },
    {
      _type: 'capability', num: '06 — Evidence',
      title: 'Analysis & quality control',
      body: 'Structured outputs from every call, transcripts searchable alongside the CRM record, success-rate measurement, and a review loop that improves the prompt on real failures.',
      bullets: bullets(['Structured call outcomes', 'Transcript search & QA sampling', 'Prompt tuning from failed calls']),
    },
  ]),

  processEyebrow: 'How we deliver',
  processHeading: 'Four stages from call flow to live number.',
  processHeadingAccent: 'live number.',
  processLead:
    'Voice is unforgiving — a customer hears every flaw immediately. We test against real recordings before a single live call is taken.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / map', title: 'Map', body: 'Call taxonomy from real recordings, containment targets, escalation rules, and compliance requirements.', duration: 'Stage 01' },
    { _type: 'processStep', tag: '02 / build', title: 'Build', body: 'Agent configuration, tool integrations, telephony setup, and transfer paths into your existing team.', duration: 'Stage 02' },
    { _type: 'processStep', tag: '03 / pilot', title: 'Pilot', body: 'Limited live traffic with QA review on every call, tuning prompts, voice and thresholds against outcomes.', duration: 'Stage 03' },
    { _type: 'processStep', tag: '04 / scale', title: 'Scale', body: 'Traffic increase, monitoring, cost per handled call reporting, and ongoing prompt and tool maintenance.', duration: 'Stage 04' },
  ]),

  compareEyebrow: 'Comparison',
  compareHeading: 'Vapi vs a traditional IVR.',
  compareHeadingAccent: 'Vapi',
  compareColLabel: 'Concern',
  compareColA: 'Vapi voice agent',
  compareColB: 'Traditional IVR',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Caller experience', colA: 'Natural speech', colB: 'Press 1 for…' },
    { _type: 'compareRow', label: 'Handles unexpected phrasing', colA: 'Yes', colB: 'No' },
    { _type: 'compareRow', label: 'Acts on live system data', colA: 'Yes — tool calls', colB: 'Limited lookups' },
    { _type: 'compareRow', label: 'Changing the flow', colA: 'Prompt and tool edit', colB: 'Vendor change request' },
    { _type: 'compareRow', label: 'Behaviour is deterministic', colA: 'No — needs QA and guardrails', colB: 'Yes' },
    { _type: 'compareRow', label: 'Cost per handled call', colA: 'Usage-based, typically lower', colB: 'Licence plus agent time' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Voice agent delivery in three regions.',
  geoHeadingAccent: 'three regions.',
  geoLead: 'Call recording consent, disclosure and outbound calling rules differ sharply by jurisdiction. We build to the local rule, not a generic one.',
  geo: geoCards('Vapi'),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'Voice agent delivery led by practitioners.',
  operatorHeadingAccent: 'practitioners.',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director, leads AI and automation engagements personally. Six years at monday.com before founding Fruition, and 500+ implementations since.',
    'Voice agents live or die on the integration layer. Our advantage is that the same team builds the monday.com, HubSpot and Salesforce systems the agent has to reach into during the call.',
  ],
  operatorPanel: operatorPanel('Vapi implementation'),
  operatorCreds: CREDS,

  faqEyebrow: 'FAQ',
  faqHeading: 'Vapi questions, answered.',
  faqHeadingAccent: 'answered.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What is Vapi?', answer: 'Vapi is a platform for building voice AI agents that make and take phone calls. It orchestrates the three pieces a voice agent needs — speech to text, a language model, and text to speech — and handles the telephony, turn-taking, interruptions and tool calling around them, so you configure an agent rather than assembling the pipeline yourself.' },
    { _type: 'aiFaq', question: 'What can a voice agent actually handle?', answer: 'The realistic set today is appointment booking and rescheduling, inbound qualification and routing, order and delivery status, simple account queries, appointment reminders and confirmations, and after-hours reception. Complex complaints, emotionally charged calls and anything requiring judgement should be routed to a human, and we design the escalation rules to make sure they are.' },
    { _type: 'aiFaq', question: 'Will callers know they are talking to an AI?', answer: 'They should, and in a growing number of jurisdictions they must. We build disclosure into the opening of the call. In practice callers care far less about the disclosure than about whether the agent can actually resolve the thing they called about, which is why the integration work matters more than the voice.' },
    { _type: 'aiFaq', question: 'Can it connect to our existing phone system?', answer: 'Yes. Vapi supports SIP trunk integration alongside provisioned numbers, so an agent can sit in front of an existing PBX or contact centre and handle overflow, after-hours or a specific queue rather than replacing your telephony. That is usually the lowest-risk way to start.' },
    { _type: 'aiFaq', question: 'How does it integrate with our CRM?', answer: 'Through tool calls made during the conversation. The agent can look a caller up by number, read their record, book or move an appointment, log the call outcome, and create a task or ticket — while still on the call. We build these integrations into monday.com CRM, HubSpot and Salesforce as a standard part of the engagement.' },
    { _type: 'aiFaq', question: 'What about latency — does it feel like a real conversation?', answer: 'Response latency is typically under a second end to end with a well-chosen stack, which is within the range that feels conversational. It is sensitive to model and voice selection and to how much work your tool calls do, so we set a latency budget during design and test against it rather than discovering the problem in the pilot.' },
    { _type: 'aiFaq', question: 'Is outbound calling with an AI agent allowed?', answer: 'It depends on jurisdiction and on the nature of the call. Rules covering automated calling, consent, do-not-call registers and recording differ between Australia, the UK and the US, and reminders or service calls to existing customers are treated very differently from cold sales calls. We build consent checks, suppression lists and disclosure into the flow, and where the legal position is unclear we will tell you to check with counsel rather than guessing.' },
    { _type: 'aiFaq', question: 'What does a voice agent engagement cost?', answer: 'A single inbound agent with CRM and calendar integration typically runs AUD $25,000 to $90,000 depending on integration depth and compliance requirements. Multi-agent or contact-centre-scale deployments are scoped in phases. Vapi platform, telephony and model usage costs are billed by the respective providers and are separate from our fees.' },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Ready to stop answering the same call?',
  ctaHeadingAccent: 'the same call?',
  ctaBody:
    "Book a 30-minute scoping call. We'll look at your call volume, what is repeatable, and what a pilot would need to prove.",
  ctaLabel: 'Book voice agent scoping call →',
  ctaUrl: CONTACT,
}

async function main() {
  const docs = [azure, supabase, langgraph, clay, elevenlabs, vapi]
  for (const doc of docs) {
    console.log('Writing', doc._id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await writeClient.createOrReplace(doc as any)
    console.log('✓', doc.slug.current)
  }
  console.log(`Done — ${docs.length} partner pages (batch 3).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
