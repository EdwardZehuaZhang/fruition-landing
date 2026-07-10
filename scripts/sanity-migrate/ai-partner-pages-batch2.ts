/**
 * Sanity migration: AI partner pages — batch 2 (aiPartnerPage docs).
 *
 *   /partnerships/aws-partner
 *   /partnerships/google-cloud-partner
 *   /partnerships/google-gemini-vertex-ai-partner
 *   /partnerships/microsoft-copilot-partner
 *   /ai-capability-assessment
 *
 * Copy transcribed from the hand-designed HTML mockups, mapped onto the
 * aiPartnerPage schema (rendered by AiPartnerTemplate). Re-running overwrites
 * (createOrReplace by fixed _id). Kept in a separate file from batch 1 so the
 * original Anthropic/OpenAI/Openclaw docs are untouched.
 */
import { writeClient, withKeys } from './lib'

const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'
const CONTACT = 'mailto:hello@fruitionservices.io'

const bullets = (arr: string[]) =>
  withKeys(arr.map((text) => ({ _type: 'aiBullet', text })))

// ─────────────────────────────────────────────────────────────────────────
// 1. AWS Partner
// ─────────────────────────────────────────────────────────────────────────
const aws = {
  _id: 'aiPartnerPage-aws-partner',
  _type: 'aiPartnerPage',
  title: 'AWS Partner — Consulting & Implementation',
  slug: { _type: 'slug', current: 'aws-partner' },
  seoTitle: 'AWS Partner — Consulting & Implementation | APAC, UK & US | Fruition',
  seoDescription:
    'AWS Partner delivering consulting, migration, modernisation, and Amazon Bedrock AI implementation across APAC, UK, and US. Bedrock, SageMaker, Q, infrastructure, FinOps, Well-Architected. 500+ implementations.',

  brandName: 'AWS',
  partnerTag: 'AWS Partner',
  accentColor: '#E88A00',
  accentColorDeep: '#B86F00',
  accentColorSoft: 'rgba(255,153,0,0.10)',
  serifAccent: false,

  heroEyebrow: 'AWS Partner · Consulting & Implementation',
  heroHeading: 'AWS, at production weight.',
  heroHeadingAccent: 'at production weight.',
  heroLead:
    'Fruition Services is an AWS Partner across APAC, UK, and US. We design landing zones, migrate workloads, build Amazon Bedrock and SageMaker AI, and run Well-Architected reviews for enterprises that need AWS to do the heavy lifting.',
  primaryCtaLabel: 'Book an AWS scoping call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'Our capabilities',
  secondaryCtaUrl: '#capabilities',
  heroSidePanelType: 'regions',
  heroSidePanelTitle: 'Regions Served',
  heroRegions: withKeys([
    { _type: 'heroRegion', label: 'Australia', value: 'Sydney HQ · ap-southeast-2' },
    { _type: 'heroRegion', label: 'Singapore', value: 'ap-southeast-1' },
    { _type: 'heroRegion', label: 'India', value: 'Engineering pod' },
    { _type: 'heroRegion', label: 'United Kingdom', value: 'London · eu-west-2' },
    { _type: 'heroRegion', label: 'United States', value: 'New York · us-east-1' },
  ]),

  stripType: 'stats',
  stats: withKeys([
    { _type: 'aiStat', value: '500', unit: '+', label: 'Implementations delivered.' },
    { _type: 'aiStat', value: '37', unit: '%', label: 'Average AWS spend reduction (FinOps).' },
    { _type: 'aiStat', value: '3', unit: '', label: 'Continents · APAC · UK · US.' },
    { _type: 'aiStat', value: '9', unit: '+', label: 'AWS regions deployed across.' },
  ]),

  capEyebrow: 'Capabilities',
  capHeading: 'Full-stack AWS engineering, from Landing Zone to production Bedrock.',
  capHeadingAccent: 'production Bedrock.',
  capLead:
    'Six capability areas. Delivered as standalone engagements, or as the components of an enterprise AWS transformation.',
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 — Generative AI',
      title: 'Amazon Bedrock & agents',
      body: 'Production Bedrock workloads — Claude, Llama, Nova, Mistral — with Bedrock Agents, Knowledge Bases, Guardrails, and full IAM and VPC isolation.',
      bullets: bullets(['Bedrock Agents & Knowledge Bases', 'Guardrails tuned to your risk posture', 'VPC endpoints, IAM, CloudTrail audit']),
    },
    {
      _type: 'capability', num: '02 — Foundation',
      title: 'Landing Zone & Control Tower',
      body: 'Multi-account AWS Organizations setup, Control Tower, IAM Identity Center, SCPs, networking, security baselines. Built on AWS best practices.',
      bullets: bullets(['Control Tower & Organizations', 'IAM Identity Center (SSO)', 'Networking & security baselines']),
    },
    {
      _type: 'capability', num: '03 — ML & Data',
      title: 'SageMaker & data platforms',
      body: 'Custom ML on SageMaker, MLOps pipelines, and data platforms on Redshift, S3, Glue, and Lake Formation with governance.',
      bullets: bullets(['SageMaker training & MLOps', 'Redshift, S3, Glue data platforms', 'Lake Formation governance']),
    },
    {
      _type: 'capability', num: '04 — Migration',
      title: 'Migration & modernisation',
      body: 'Wave-based migration from on-premise or other clouds. MAP-funded where eligible. Lift-and-shift, replatform, refactor — chosen per workload.',
      bullets: bullets(['MGN & DMS migration', 'Migration Acceleration Program (MAP)', 'App2Container modernisation']),
    },
    {
      _type: 'capability', num: '05 — Security',
      title: 'Security, IAM & compliance',
      body: 'Security posture management, IAM hardening, KMS, GuardDuty, Security Hub, Config rules, and audit overlays for HIPAA, PCI, IRAP, FedRAMP.',
      bullets: bullets(['GuardDuty & Security Hub', 'KMS & Config rules', 'HIPAA / PCI / IRAP / FedRAMP overlays']),
    },
    {
      _type: 'capability', num: '06 — FinOps',
      title: 'Cost optimisation & FinOps',
      body: 'Average 37% spend reduction in 90 days. Savings Plans, RI optimisation, EC2 and RDS rightsizing, S3 storage class tiering, chargeback dashboards.',
      bullets: bullets(['Savings Plans & RI optimisation', 'EC2 / RDS rightsizing via Compute Optimizer', 'S3 tiering & chargeback dashboards']),
    },
  ]),

  showcaseEyebrow: 'Bedrock spotlight',
  showcaseHeading: 'One platform. Every foundation model that matters.',
  showcaseHeadingAccent: 'Every foundation model',
  showcaseLead:
    "Bedrock's value isn't any single model — it's having Claude, Llama, Nova, Mistral, and Cohere behind one API, with AWS-native security, IAM, and data residency.",
  showcaseCards: withKeys([
    { _type: 'showcaseCard', icon: 'CL', name: 'Claude Sonnet 4.6, Opus 4.8', role: '// Anthropic', body: 'Best-in-class reasoning and agentic workflows, available natively on Bedrock.', meta: withKeys([{ _type: 'showcaseMeta', value: 'REASONING', label: 'class' }]) },
    { _type: 'showcaseCard', icon: 'NV', name: 'Nova Pro, Lite, Micro', role: '// Amazon', body: 'AWS-native foundation models tuned for cost and latency at scale.', meta: withKeys([{ _type: 'showcaseMeta', value: 'AWS-NATIVE', label: 'class' }]) },
    { _type: 'showcaseCard', icon: 'MS', name: 'Mistral Large 2, Codestral', role: '// Mistral AI', body: 'EU-sovereign open-weight models for code and general reasoning.', meta: withKeys([{ _type: 'showcaseMeta', value: 'EU SOVEREIGN', label: 'class' }]) },
  ]),

  processEyebrow: 'How we work',
  processHeading: 'Four phases from current state to production AWS.',
  processHeadingAccent: 'production AWS.',
  processLead:
    'Aligned to AWS Migration Acceleration Program (MAP) and the Well-Architected Framework. Each phase has defined exit criteria.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / assess', title: 'Assess', body: 'Workload inventory, dependency mapping, migration suitability, TCO modelling, Well-Architected baseline.', duration: '2–4 weeks' },
    { _type: 'processStep', tag: '02 / mobilise', title: 'Mobilise', body: 'Landing Zone, Control Tower, IAM Identity Center, networking, security baselines deployed via IaC.', duration: '4–8 weeks' },
    { _type: 'processStep', tag: '03 / migrate', title: 'Migrate & Modernise', body: 'Wave-based workload migration. MGN for lift-and-shift, refactoring to managed services where it pays back.', duration: '3–18 months' },
    { _type: 'processStep', tag: '04 / operate', title: 'Operate', body: 'Observability, SRE, FinOps, security operations. Handover or ongoing managed service.', duration: 'Ongoing' },
  ]),

  casesEyebrow: 'Outcomes',
  casesHeading: "What AWS delivers when it's engineered, not just provisioned.",
  casesHeadingAccent: 'engineered',
  cases: withKeys([
    { _type: 'caseCard', industry: 'Financial Services · Australia', title: 'Bedrock advisor agent at scale', body: 'Production Bedrock Agent on Claude Sonnet 4.6, grounded via Knowledge Bases over 18M client documents, handling 240K monthly advisor queries. Full VPC isolation, CloudTrail audit.', metric: '240K', metricLabel: 'Monthly queries · $3.1M annual gain' },
    { _type: 'caseCard', industry: 'Insurance · UK', title: '120-workload AWS migration', body: 'MAP-funded migration of 120 workloads from on-premise VMware to AWS. Multi-account Landing Zone, GuardDuty, FCA-aligned compliance overlays. eu-west-2 residency.', metric: '£4.2M', metricLabel: 'Annual savings · 14 months end-to-end' },
    { _type: 'caseCard', industry: 'SaaS · US', title: 'FinOps & SageMaker optimisation', body: '90-day FinOps engagement for a US SaaS scaleup. Savings Plans restructured, EC2 rightsized via Compute Optimizer, SageMaker training spot-priced, S3 storage tiered.', metric: '41%', metricLabel: 'Monthly spend cut · $2.4M annualised' },
  ]),

  compareEyebrow: 'Comparison',
  compareHeading: 'Fruition vs Big-4 vs AWS Professional Services.',
  compareHeadingAccent: 'Fruition',
  compareColLabel: 'Capability',
  compareColA: 'Fruition',
  compareColB: 'Big-4 / AWS ProServe',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Hands-on engineering', colA: 'In-house', colB: 'Often subcontracted (Big-4); bounded (ProServe)' },
    { _type: 'compareRow', label: 'Fixed-fee phases', colA: 'Published', colB: 'Retainer-based / project-based' },
    { _type: 'compareRow', label: 'Multi-cloud honesty', colA: 'Yes — multi-partner', colB: 'Variable / AWS-only' },
    { _type: 'compareRow', label: 'Bedrock depth', colA: 'Production deployments', colB: 'Variable / deep (ProServe)' },
    { _type: 'compareRow', label: 'FinOps practice', colA: 'Outcome-linked', colB: 'Retainer / limited' },
    { _type: 'compareRow', label: 'MAP funding navigation', colA: 'Yes', colB: 'Yes' },
    { _type: 'compareRow', label: 'APAC + UK + US local teams', colA: 'Yes', colB: 'Yes' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Local AWS delivery in three regions.',
  geoHeadingAccent: 'three regions.',
  geoLead:
    'Sydney, London, New York. Local compliance overlays and AWS regional zones aligned to your residency needs.',
  geo: withKeys([
    { _type: 'geoCard', region: 'AU · SG · IN — Asia Pacific', city: 'Sydney HQ', body: 'Sydney HQ serving Australia, New Zealand, Singapore, and India. APRA CPS 234, IRAP, and Australian Privacy Principles-aligned governance. ap-southeast-2 · ap-southeast-4 · ap-southeast-1.', addr: '12/64 York Street, Sydney NSW 2000\nABN 12 667 454 006' },
    { _type: 'geoCard', region: 'GB — United Kingdom', city: 'London', body: 'UK delivery for FCA-regulated firms, NHS Trusts, and FTSE 100 enterprises. UK GDPR, EU AI Act, FCA governance overlays. eu-west-2 · eu-west-1 · eu-central-1.', addr: 'London delivery centre\nUK GDPR aligned · FCA-aware' },
    { _type: 'geoCard', region: 'US — North America', city: 'New York', body: 'US delivery for Fortune 1000 with HIPAA, SOC 2, FedRAMP, FINRA, and state-specific (CCPA, CPRA) governance overlays. us-east-1 · us-east-2 · us-west-2.', addr: 'New York delivery centre\nSOC 2 / HIPAA aware · FedRAMP-aware' },
  ]),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'AWS engineering led by practitioners.',
  operatorHeadingAccent: 'practitioners.',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director, leads enterprise AWS engagements personally. Six years at monday.com before founding Fruition. 500+ implementations across the major cloud and AI platforms — AWS, Google, Microsoft, OpenAI, Anthropic.',
    'Our AWS practice combines deep platform engineering with the migration, security, and FinOps discipline that determines whether a cloud investment actually delivers the business case.',
  ],
  operatorPanel: withKeys([
    { _type: 'operatorRow', k: 'prior', v: 'monday.com · 6y' },
    { _type: 'operatorRow', k: 'based', v: 'Sydney · AU' },
    { _type: 'operatorRow', k: 'entities', v: 'AU · UK · US' },
    { _type: 'operatorRow', k: 'status', v: 'AWS Partner', accent: true },
  ]),
  operatorCreds: [
    'AWS Partner',
    'monday.com Platinum',
    'Rising Star 2026',
    '500+ implementations',
  ],

  faqEyebrow: 'FAQ',
  faqHeading: 'AWS questions, answered.',
  faqHeadingAccent: 'answered.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What does an AWS Partner do?', answer: 'An AWS Partner helps enterprises plan, migrate, build, and operate workloads on Amazon Web Services. Services include cloud strategy, AWS Landing Zone and Control Tower setup, migration (lift-and-shift, replatforming, refactoring), Amazon Bedrock and SageMaker AI workloads, security and IAM, Well-Architected reviews, and FinOps. Fruition is an AWS Partner delivering across APAC, UK, and US.' },
    { _type: 'aiFaq', question: 'What is Amazon Bedrock?', answer: "Amazon Bedrock is AWS's managed service for foundation models. It provides access to Claude (Anthropic), Llama (Meta), Mistral, Cohere, Amazon Nova, and Stable Diffusion through a single API, with enterprise features like Bedrock Agents, Knowledge Bases, Guardrails, and fine-tuning. Most enterprises use Bedrock when they want model choice, AWS-native security, and integration with their existing AWS data and workloads." },
    { _type: 'aiFaq', question: 'How does Bedrock compare to using OpenAI or Claude directly?', answer: 'Bedrock is the right choice when you need AWS-native security (IAM, VPC endpoints, CloudTrail logging), data residency in AWS regions, integration with S3, RDS, and other AWS data sources, and model choice in one API. Going direct to OpenAI or Claude is better for fastest access to the latest models and the richest first-party tooling. Fruition recommends per workload based on these trade-offs.' },
    { _type: 'aiFaq', question: 'How long does an AWS migration take?', answer: 'A single workload migration typically takes 6 to 12 weeks. A complete data platform migration to Redshift, S3, and AWS Glue takes 4 to 9 months. A full enterprise multi-workload migration takes 12 to 30 months, delivered in waves. Fruition uses AWS’s Migration Acceleration Program (MAP) and a wave-based delivery model with defined cutover gates.' },
    { _type: 'aiFaq', question: 'What is the AWS Well-Architected Framework?', answer: "The AWS Well-Architected Framework is AWS's set of design principles and best practices across six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimisation, and Sustainability. A Well-Architected Review is a structured assessment of a workload against these pillars. Fruition delivers Well-Architected Reviews as part of every implementation and as standalone engagements." },
    { _type: 'aiFaq', question: 'Can Fruition help with AWS FinOps?', answer: 'Yes. AWS FinOps engagements typically reduce cloud spend by 25 to 45% within 90 days. Our approach combines Savings Plans and Reserved Instance optimisation, idle resource elimination, EC2 and RDS rightsizing, S3 storage class optimisation, and chargeback dashboards via AWS Cost Explorer and Cost Categories. We work as a one-off engagement or as an ongoing optimisation partner.' },
    { _type: 'aiFaq', question: 'Is AWS suitable for regulated industries?', answer: 'Yes. AWS holds SOC 1/2/3, ISO 27001, HIPAA, PCI DSS, FedRAMP High, IRAP (Australia), and FCA-aligned compliance, with data residency available across all our regions including ap-southeast-2 (Sydney), eu-west-2 (London), and us-east-1 (N. Virginia). Fruition has delivered AWS implementations for financial services, healthcare, government, and defence clients across APAC, UK, and US.' },
    { _type: 'aiFaq', question: 'What can SageMaker do that Bedrock cannot?', answer: 'SageMaker is the right choice for custom model training, traditional machine learning (XGBoost, deep learning, classical ML), MLOps pipelines, and when you need full control over training infrastructure. Bedrock is the right choice for using foundation models via API. Most enterprises use both — Bedrock for generative AI, SageMaker for predictive ML and custom models.' },
    { _type: 'aiFaq', question: 'What is Amazon Q?', answer: "Amazon Q is AWS's generative AI assistant family. Q Developer helps engineers write, review, and modernise code (similar to GitHub Copilot, but AWS-native and deeply integrated with AWS services). Q Business is an enterprise AI assistant that connects to corporate data sources (SharePoint, Salesforce, S3, Confluence) for grounded answers. Fruition implements both, often alongside Bedrock for custom applications." },
    { _type: 'aiFaq', question: 'How much does AWS consulting cost?', answer: 'Fruition engagements start at AUD $35,000 for a Well-Architected Review or Landing Zone foundation. Mid-scope projects (migrations, Bedrock implementations, data platforms) typically range from AUD $80,000 to $450,000. Enterprise transformations are scoped phase by phase with fixed pricing per phase. AWS Migration Acceleration Program (MAP) funding may offset early-stage costs — we’ll flag eligibility.' },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Ready to engineer AWS at production weight?',
  ctaHeadingAccent: 'at production weight?',
  ctaBody:
    "Book a 30-minute scoping call. We'll size your migration, Bedrock workload, or modernisation play and give you a costed roadmap with MAP funding routes where eligible.",
  ctaLabel: 'Book AWS scoping call →',
  ctaUrl: CONTACT,
}

// ─────────────────────────────────────────────────────────────────────────
// 2. Google Cloud Partner
// ─────────────────────────────────────────────────────────────────────────
const googleCloud = {
  _id: 'aiPartnerPage-google-cloud-partner',
  _type: 'aiPartnerPage',
  title: 'Google Cloud Partner — Consulting & Implementation',
  slug: { _type: 'slug', current: 'google-cloud-partner' },
  seoTitle: 'Google Cloud Partner — Consulting & Implementation | APAC, UK & US | Fruition',
  seoDescription:
    'Google Cloud Partner delivering consulting, migration, modernisation, and AI implementation on GCP across APAC, UK, and US. BigQuery, GKE, Vertex AI, IAM, FinOps, security. 500+ implementations.',

  brandName: 'Google Cloud',
  partnerTag: 'Google Cloud Partner',
  accentColor: '#1A73E8',
  accentColorDeep: '#174EA6',
  accentColorSoft: 'rgba(26,115,232,0.10)',
  serifAccent: false,

  heroEyebrow: 'Google Cloud Partner',
  heroHeading: 'Google Cloud Platform, engineered properly.',
  heroHeadingAccent: 'engineered properly.',
  heroLead:
    'Fruition Services is a Google Cloud Partner across APAC, UK, and US. We design landing zones, migrate workloads, build BigQuery platforms, and ship production Vertex AI for enterprises that need GCP to do the heavy lifting.',
  primaryCtaLabel: 'Book a GCP scoping call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'Our capabilities',
  secondaryCtaUrl: '#capabilities',
  heroSidePanelType: 'regions',
  heroSidePanelTitle: 'Regions Served',
  heroRegions: withKeys([
    { _type: 'heroRegion', label: 'Australia', value: 'australia-southeast1' },
    { _type: 'heroRegion', label: 'Singapore', value: 'asia-southeast1' },
    { _type: 'heroRegion', label: 'India', value: 'Engineering pod' },
    { _type: 'heroRegion', label: 'United Kingdom', value: 'europe-west2' },
    { _type: 'heroRegion', label: 'United States', value: 'us-east4 · us-central1' },
  ]),

  stripType: 'stats',
  stats: withKeys([
    { _type: 'aiStat', value: '500', unit: '+', label: 'Implementations delivered.' },
    { _type: 'aiStat', value: '34', unit: '%', label: 'Average cloud spend reduction (FinOps).' },
    { _type: 'aiStat', value: '3', unit: '', label: 'Continents · APAC · UK · US.' },
    { _type: 'aiStat', value: '12', unit: '+', label: 'GCP regions deployed across.' },
  ]),

  capEyebrow: 'Capabilities',
  capHeading: 'Full-stack Google Cloud engineering, from landing zone to production AI.',
  capHeadingAccent: 'production AI.',
  capLead:
    'Six capability areas. We deliver them as standalone engagements or as the building blocks of an enterprise GCP transformation.',
  capabilities: withKeys([
    {
      _type: 'capability', num: '01 — Foundation',
      title: 'Landing zone & organisation',
      body: 'The work that prevents 18-month-later cleanups. Organisation structure, IAM, billing, VPC architecture, security baselines.',
      bullets: bullets(['Cloud Foundation Toolkit', 'IAM & Org Policy', 'VPC Service Controls']),
    },
    {
      _type: 'capability', num: '02 — Data Platform',
      title: 'BigQuery & data engineering',
      body: 'End-to-end data platforms. Migration from legacy warehouses, Dataform pipelines, Dataplex governance, Looker semantic layer.',
      bullets: bullets(['BigQuery & Dataform', 'Dataplex governance', 'Looker semantic layer']),
    },
    {
      _type: 'capability', num: '03 — Compute',
      title: 'GKE, Cloud Run, App Engine',
      body: 'Production-grade container and serverless workloads. GKE Autopilot, multi-region deployment, traffic management, autoscaling.',
      bullets: bullets(['GKE & GKE Autopilot', 'Cloud Run & Anthos', 'Cloud Build CI/CD']),
    },
    {
      _type: 'capability', num: '04 — Migration',
      title: 'Cloud migration & modernisation',
      body: 'Wave-based migration from AWS, Azure, or on-premise. Lift-and-shift, replatforming, refactoring — we pick the right depth per workload.',
      bullets: bullets(['Migrate to GCP', 'Database Migration Service', 'Cloud Interconnect']),
    },
    {
      _type: 'capability', num: '05 — Security',
      title: 'Security, IAM & compliance',
      body: 'Cloud security posture management, IAM hardening, CMEK, VPC Service Controls, audit logging, and compliance overlays.',
      bullets: bullets(['Security Command Center', 'CMEK & VPC SC', 'Audit logging']),
    },
    {
      _type: 'capability', num: '06 — FinOps',
      title: 'Cost optimisation & FinOps',
      body: 'Average 34% cloud spend reduction in 90 days. CUDs, BigQuery slot reservations, GKE rightsizing, chargeback dashboards.',
      bullets: bullets(['Committed use discounts (CUDs)', 'BigQuery slot reservations', 'GKE rightsizing & showback']),
    },
  ]),

  processEyebrow: 'Migration framework',
  processHeading: 'Five stages from current state to production GCP.',
  processHeadingAccent: 'production GCP.',
  processLead:
    "Aligned to Google's Cloud Adoption Framework. Each stage has defined exit criteria, so you know when to move on.",
  process: withKeys([
    { _type: 'processStep', tag: '01 / assess', title: 'Assess', body: 'Workload inventory, dependency mapping, migration suitability scoring, TCO analysis.', duration: 'Stage 01' },
    { _type: 'processStep', tag: '02 / foundation', title: 'Foundation', body: 'Landing zone, organisation structure, IAM, networking, security baselines deployed via IaC.', duration: 'Stage 02' },
    { _type: 'processStep', tag: '03 / migrate', title: 'Migrate', body: 'Wave-based workload migration. Lift-and-shift for fast wins, replatforming for strategic apps.', duration: 'Stage 03' },
    { _type: 'processStep', tag: '04 / modernise', title: 'Modernise', body: 'Refactor to managed services. BigQuery for data, GKE for compute, Vertex AI for intelligence.', duration: 'Stage 04' },
    { _type: 'processStep', tag: '05 / operate', title: 'Operate', body: 'Observability, SRE practices, FinOps, security operations. Handover or ongoing managed service.', duration: 'Stage 05' },
  ]),

  casesEyebrow: 'Outcomes',
  casesHeading: "What GCP delivers when it's engineered, not just provisioned.",
  casesHeadingAccent: 'engineered',
  cases: withKeys([
    { _type: 'caseCard', industry: 'Banking · Australia', title: 'Data platform migration from Teradata', body: 'Migrated a 4PB Teradata warehouse to BigQuery for a top-tier Australian bank. New Dataform pipelines, Dataplex governance, Looker semantic layer.', metric: '71%', metricLabel: 'Query cost reduction · 4PB migrated' },
    { _type: 'caseCard', industry: 'Insurance · UK', title: 'Landing zone & 80-workload migration', body: 'Built a multi-environment GCP landing zone and migrated 80 workloads from on-premise VMware in 11 waves. FCA-aligned governance, europe-west2 residency.', metric: '£3.4M', metricLabel: 'Annual savings · 11 months end-to-end' },
    { _type: 'caseCard', industry: 'SaaS · US', title: 'FinOps & GKE rightsizing', body: '90-day FinOps engagement for a US SaaS scaleup. CUD optimisation, GKE node pool restructuring, BigQuery slot reservations, chargeback dashboards.', metric: '38%', metricLabel: 'Monthly spend cut · $1.8M annualised' },
  ]),

  compareEyebrow: 'Comparison',
  compareHeading: 'Fruition vs Big-4 vs Google PSO.',
  compareHeadingAccent: 'Fruition',
  compareColLabel: 'Capability',
  compareColA: 'Fruition',
  compareColB: 'Big-4 / Google PSO',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Hands-on engineering', colA: 'Yes — in-house', colB: 'Often subcontracted / limited bandwidth' },
    { _type: 'compareRow', label: 'Fixed-fee phases', colA: 'Yes — published', colB: 'Retainer-based / project-based' },
    { _type: 'compareRow', label: 'Multi-cloud honesty', colA: 'Yes — multi-partner', colB: 'Variable / Google-only' },
    { _type: 'compareRow', label: 'BigQuery depth', colA: 'Deep, in-house', colB: 'Variable / deep (PSO)' },
    { _type: 'compareRow', label: 'FinOps practice', colA: 'Yes — outcome-linked', colB: 'Retainer / limited' },
    { _type: 'compareRow', label: 'Vertex AI implementation', colA: 'Yes — production agents', colB: 'Variable / yes (PSO)' },
    { _type: 'compareRow', label: 'APAC + UK + US local teams', colA: 'Yes', colB: 'Yes' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Local GCP delivery in three regions.',
  geoHeadingAccent: 'three regions.',
  geoLead:
    'Compliance, data residency, and regional GCP zones aligned to where your workloads need to run.',
  geo: withKeys([
    { _type: 'geoCard', region: 'AU · SG · IN — Asia Pacific', city: 'Sydney HQ', body: 'Sydney HQ serving Australia, New Zealand, Singapore, and India. APRA CPS 234 and Australian Privacy Principles-aligned governance. australia-southeast1 · australia-southeast2 · asia-southeast1.', addr: '12/64 York Street, Sydney NSW 2000\nABN 12 667 454 006' },
    { _type: 'geoCard', region: 'GB — United Kingdom', city: 'London', body: 'UK delivery for FCA-regulated firms, NHS Trusts, and FTSE 100. UK GDPR, EU AI Act, FCA governance overlays included. europe-west2 · europe-west1 · europe-west3.', addr: 'London delivery centre\nUK GDPR aligned · FCA-aware' },
    { _type: 'geoCard', region: 'US — North America', city: 'New York', body: 'US delivery for Fortune 1000 with HIPAA, SOC 2, FedRAMP, and state-specific (CCPA, CPRA) governance overlays. us-east4 · us-central1 · us-west1.', addr: 'New York delivery centre\nSOC 2 / HIPAA aware · FedRAMP-aware' },
  ]),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'Cloud engineering led by practitioners.',
  operatorHeadingAccent: 'practitioners.',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director, leads enterprise Google Cloud engagements personally. Six years at monday.com before founding Fruition. 500+ implementations across the major cloud and AI platforms.',
    'Our GCP practice combines deep platform engineering with the migration and FinOps discipline that determines whether a cloud move actually delivers the business case.',
  ],
  operatorPanel: withKeys([
    { _type: 'operatorRow', k: 'prior', v: 'monday.com · 6y' },
    { _type: 'operatorRow', k: 'based', v: 'Sydney · AU' },
    { _type: 'operatorRow', k: 'entities', v: 'AU · UK · US' },
    { _type: 'operatorRow', k: 'status', v: 'Google Cloud Partner', accent: true },
  ]),
  operatorCreds: [
    'Google Cloud Partner',
    'monday.com Platinum',
    'Rising Star 2026',
    '500+ implementations',
  ],

  faqEyebrow: 'FAQ',
  faqHeading: 'Google Cloud questions, answered.',
  faqHeadingAccent: 'answered.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What does a Google Cloud Partner do?', answer: 'A Google Cloud Partner helps enterprises plan, migrate, build, and operate workloads on Google Cloud Platform. Services typically include cloud strategy, landing zone design, migration of applications and data, BigQuery data platforms, GKE workloads, Vertex AI implementations, security and IAM, and FinOps. Fruition is a Google Cloud Partner delivering across APAC, UK, and US.' },
    { _type: 'aiFaq', question: 'Why choose Google Cloud over AWS or Azure?', answer: "Google Cloud's strongest enterprise positions are in data analytics (BigQuery is widely considered the best-in-class data warehouse), AI/ML (Vertex AI, Gemini, and Google's research lineage), Kubernetes (Google invented it), and open-source ecosystem. Organisations often choose GCP for data-heavy or AI-first workloads, while running other workloads on AWS or Azure. Fruition recommends per workload, not per organisation." },
    { _type: 'aiFaq', question: 'How long does a Google Cloud migration take?', answer: 'Migration timeline depends on scope. A single workload migration (lift-and-shift) typically takes 6 to 12 weeks. A complete data platform migration to BigQuery and GCS takes 4 to 9 months. A full enterprise multi-workload migration takes 12 to 24 months and is delivered in waves. Fruition uses a wave-based approach with measurable cutover gates.' },
    { _type: 'aiFaq', question: 'What is a GCP landing zone?', answer: "A landing zone is the foundation that everything else on Google Cloud sits on — organisation structure, IAM, VPC architecture, billing accounts, logging and monitoring, security baselines, and policy guardrails. Getting this right at the start prevents the structural problems that plague organisations 18 months into GCP adoption. Fruition delivers landing zones aligned to Google's Cloud Foundation Toolkit and Cloud Adoption Framework." },
    { _type: 'aiFaq', question: 'Do you work with BigQuery and data platforms?', answer: 'Yes. BigQuery is one of our deepest practices. We deliver end-to-end data platform engagements: migration from legacy warehouses (Teradata, Oracle, on-premise SQL Server), Dataform and dbt-based transformation pipelines, Dataplex governance, Looker semantic layer, and integration with Vertex AI for ML and Gemini-grounded analytics.' },
    { _type: 'aiFaq', question: 'Can Fruition help with FinOps on Google Cloud?', answer: 'Yes. GCP FinOps engagements typically reduce cloud spend by 20 to 40% within 90 days. Our approach combines committed use discount (CUD) optimisation, idle resource elimination, BigQuery slot reservations, GKE rightsizing, and chargeback or showback dashboards. We work as either a one-off engagement or an ongoing optimisation partner.' },
    { _type: 'aiFaq', question: 'Is Google Cloud suitable for regulated industries?', answer: 'Yes. Google Cloud holds SOC 1/2/3, ISO 27001/27017/27018, HIPAA, PCI DSS, FedRAMP High, and APRA CPS 234 compliance, with data residency available in regions including australia-southeast1, europe-west2, and us-east4. Fruition has delivered GCP implementations for financial services, healthcare, and government clients across all three of our geos.' },
    { _type: 'aiFaq', question: 'What is GKE and when should we use it?', answer: "Google Kubernetes Engine (GKE) is GCP's managed Kubernetes service. It's the right choice when you have containerised workloads at scale, need multi-region deployment, or want sophisticated traffic and resource management. GKE Autopilot reduces operational overhead by managing nodes for you. Fruition helps choose between GKE, Cloud Run, and App Engine based on workload characteristics." },
    { _type: 'aiFaq', question: 'Can you help with multi-cloud or hybrid setups?', answer: 'Yes. Most of our enterprise clients run multi-cloud — typically GCP for data and AI, AWS or Azure for application workloads. We design integrations using Anthos, Cloud Interconnect, BigQuery Omni for cross-cloud analytics, and identity federation. We are also AWS and Microsoft partners, so multi-cloud advice is vendor-honest.' },
    { _type: 'aiFaq', question: 'How much does Google Cloud consulting cost?', answer: "Fruition engagements start at AUD $35,000 for a structured cloud strategy or landing zone foundation. Mid-scope projects (migrations, data platforms, GKE implementations) typically range from AUD $80,000 to $400,000. Enterprise transformations are scoped phase by phase with fixed pricing per phase. Google's own funding programs may offset early-stage costs — we'll flag eligibility during scoping." },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Ready to engineer your Google Cloud properly?',
  ctaHeadingAccent: 'properly?',
  ctaBody:
    "Book a 30-minute scoping call. We'll size your migration, modernisation, or data platform play and give you a costed roadmap.",
  ctaLabel: 'Book GCP scoping call →',
  ctaUrl: CONTACT,
}

// ─────────────────────────────────────────────────────────────────────────
// 3. Google Gemini & Vertex AI Partner
// ─────────────────────────────────────────────────────────────────────────
const gemini = {
  _id: 'aiPartnerPage-google-gemini-vertex-ai-partner',
  _type: 'aiPartnerPage',
  title: 'Google Gemini & Vertex AI Implementation Partner',
  slug: { _type: 'slug', current: 'google-gemini-vertex-ai-partner' },
  seoTitle: 'Google Gemini & Vertex AI Consulting & Implementation Partner | APAC, UK & US | Fruition',
  seoDescription:
    'Expert Google Gemini and Vertex AI consulting and implementation across APAC, UK, and US. Fruition Services helps enterprises build, deploy, and scale Gemini and Vertex AI workloads.',

  brandName: 'Gemini · Vertex AI',
  partnerTag: 'Gemini & Vertex AI Partner',
  accentColor: '#9B72CB',
  accentColorDeep: '#7C4DB0',
  accentColorSoft: 'rgba(155,114,203,0.10)',
  serifAccent: false,

  heroEyebrow: 'Google Gemini & Vertex AI · Implementation Partner',
  heroHeading: 'Gemini at the scale your enterprise needs.',
  heroHeadingAccent: 'enterprise needs.',
  heroLead:
    'Fruition Services is a Google Gemini and Vertex AI consulting and implementation partner across APAC, UK, and US. We build the agents, RAG systems, and Workspace rollouts that move Gemini from a chatbot into the operating fabric.',
  primaryCtaLabel: 'Book a Gemini scoping call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'Our capabilities',
  secondaryCtaUrl: '#capabilities',
  heroSidePanelType: 'regions',
  heroSidePanelTitle: 'Regions Served',
  heroRegions: withKeys([
    { _type: 'heroRegion', label: 'Australia', value: 'australia-southeast1' },
    { _type: 'heroRegion', label: 'Singapore', value: 'asia-southeast1' },
    { _type: 'heroRegion', label: 'India', value: 'Engineering pod' },
    { _type: 'heroRegion', label: 'United Kingdom', value: 'europe-west2' },
    { _type: 'heroRegion', label: 'United States', value: 'us-east4 · us-central1' },
  ]),

  stripType: 'stats',
  stats: withKeys([
    { _type: 'aiStat', value: '500', unit: '+', label: 'Implementations delivered.' },
    { _type: 'aiStat', value: '2', unit: 'M', label: 'Token context handled in production.' },
    { _type: 'aiStat', value: '3', unit: '', label: 'Continents · APAC · UK · US.' },
    { _type: 'aiStat', value: '87', unit: '%', label: 'Workloads in production at 6 months.' },
  ]),

  capEyebrow: 'What we deliver',
  capHeading: 'From Workspace adoption to production Vertex AI agents.',
  capHeadingAccent: 'production Vertex AI agents.',
  capLead:
    'The Gemini ecosystem has five surfaces. We work across all of them, from consumer Workspace rollouts to multi-agent Vertex AI systems.',
  capabilities: withKeys([
    {
      _type: 'capability', num: 'Gemini for Workspace',
      title: 'Workspace AI rollout',
      body: 'Structured rollout of Gemini across Gmail, Docs, Sheets, Slides, and Meet. Built around real use cases per function, not feature checklists.',
      bullets: bullets(['Readiness and data hygiene', 'Drive permissions audit', 'Pilot cohort design', 'Adoption playbooks per function', 'Measurement and ROI tracking']),
    },
    {
      _type: 'capability', num: 'Vertex AI',
      title: 'Custom AI agents & RAG',
      body: 'Production-grade agents built on Vertex AI Agent Builder, with grounding via Vertex AI Search and multi-agent orchestration where the workload warrants it.',
      bullets: bullets(['Agent Builder development', 'Vertex AI Search grounding', 'Multi-agent orchestration (ADK)', 'Model selection and routing', 'Evaluation pipelines']),
    },
    {
      _type: 'capability', num: 'Gemini API',
      title: 'Custom application development',
      body: 'Direct Gemini API integration for product teams building AI-native experiences. Multimodal, long-context, and grounded generation as standard.',
      bullets: bullets(['Multimodal application design', 'Long-context workflow optimisation', 'Prompt and tool architecture', 'Grounding and citation systems', 'Cost and latency optimisation']),
    },
    {
      _type: 'capability', num: 'Governance',
      title: 'Security, compliance & MLOps',
      body: 'The work that makes Gemini and Vertex AI safe to run at scale: data residency, CMEK, VPC Service Controls, evaluation, and monitoring.',
      bullets: bullets(['VPC Service Controls setup', 'Customer-managed encryption (CMEK)', 'Model evaluation frameworks', 'Prompt versioning & governance', 'Cost monitoring and budgeting']),
    },
  ]),

  showcaseEyebrow: 'Why Fruition',
  showcaseHeading: 'Three reasons enterprises pick us for Gemini work.',
  showcaseHeadingAccent: 'Gemini work.',
  showcaseLead:
    "We're partnered with Google — but also Anthropic, OpenAI, Microsoft and AWS. Our Gemini recommendations are honest about where it leads and where it doesn't.",
  showcaseCards: withKeys([
    { _type: 'showcaseCard', icon: '01', name: 'Model-agnostic by default', role: '// honest recommendations', body: "We're partnered with Google, but also Anthropic, OpenAI, Microsoft, and AWS. Our Gemini recommendations are honest about where it leads and where it doesn't.", meta: [] },
    { _type: 'showcaseCard', icon: '02', name: 'Production, not demos', role: '// real volumes', body: 'The Vertex AI agents we ship handle real volumes — hundreds of thousands of monthly interactions, grounded in real enterprise data, with real evaluation pipelines behind them.', meta: [] },
    { _type: 'showcaseCard', icon: '03', name: 'Three continents, one team', role: '// local accountability', body: 'Sydney, London, New York — same methodology, same people, same accountability. No bait-and-switch to junior offshore teams.', meta: [] },
  ]),

  processEyebrow: 'How we work',
  processHeading: 'From use case to production agent in four phases.',
  processHeadingAccent: 'production agent',
  processLead:
    'Fixed phases. Fixed prices. Fixed outcomes. The kind of structure enterprise procurement actually wants.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / scope', title: 'Scope', body: 'Use-case selection, model fit assessment, data audit, success criteria. Outcome: a costed implementation plan.', duration: '2–3 weeks' },
    { _type: 'processStep', tag: '02 / build', title: 'Build', body: 'Agent or RAG construction on Vertex AI. Grounding sources connected. Evaluation harness from day one.', duration: '4–10 weeks' },
    { _type: 'processStep', tag: '03 / pilot', title: 'Pilot', body: 'Controlled pilot with measurement, governance overlay, and iterative refinement based on real user behaviour.', duration: '3–6 weeks' },
    { _type: 'processStep', tag: '04 / scale', title: 'Scale', body: 'Production handover, monitoring, cost optimisation, and continuous evaluation against drift and regressions.', duration: 'Ongoing' },
  ]),

  casesEyebrow: 'Outcomes',
  casesHeading: 'What Gemini and Vertex AI deliver in production.',
  casesHeadingAccent: 'in production.',
  cases: withKeys([
    { _type: 'caseCard', industry: 'Financial Services · APAC', title: 'Vertex AI agent for advisor research', body: 'Built a grounded Vertex AI agent serving 1,200 financial advisors, synthesising research, market data, and client portfolios. 2M-token context for full client history.', metric: '73%', metricLabel: 'Faster prep · $2.1M annual gain' },
    { _type: 'caseCard', industry: 'Healthcare · UK', title: 'Gemini for Workspace at NHS Trust', body: 'Rolled out Gemini for Workspace to 3,400 clinicians and admin staff across an NHS Trust. UK GDPR governance, data residency in europe-west2.', metric: '5.8hr', metricLabel: 'Saved per user per week · 91% active usage' },
    { _type: 'caseCard', industry: 'Retail · US', title: 'Multimodal product agent', body: 'Built a Vertex AI agent that ingests product photography, customer reviews, and inventory data to generate category-level merchandising insights in real time.', metric: '340K', metricLabel: 'Monthly queries · 12% margin lift' },
  ]),

  compareEyebrow: 'How we compare',
  compareHeading: 'Fruition vs Big-4 vs Google direct.',
  compareHeadingAccent: 'Fruition',
  compareColLabel: 'Capability',
  compareColA: 'Fruition',
  compareColB: 'Big-4 / Google PSO',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Vertex AI Agent Builder depth', colA: 'In-house, deep', colB: 'Variable / deep but bounded' },
    { _type: 'compareRow', label: 'Model-agnostic recommendations', colA: 'Yes', colB: 'Sometimes / Google-only' },
    { _type: 'compareRow', label: 'Workspace + Vertex combined', colA: 'Yes', colB: 'Separate teams' },
    { _type: 'compareRow', label: 'Fixed-fee phases', colA: 'Yes — published', colB: 'Retainer-based / project-based' },
    { _type: 'compareRow', label: 'Evaluation pipelines', colA: 'From day 1', colB: 'Sometimes / yes (PSO)' },
    { _type: 'compareRow', label: 'Hands-on, not outsourced', colA: 'Yes', colB: 'Often subcontracted' },
    { _type: 'compareRow', label: 'APAC + UK + US local teams', colA: 'Yes', colB: 'Yes' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Local Gemini expertise across three regions.',
  geoHeadingAccent: 'three regions.',
  geoLead:
    'Sydney headquarters, London and New York delivery. Local compliance and data residency overlays included.',
  geo: withKeys([
    { _type: 'geoCard', region: 'AU · SG · IN — Asia Pacific', city: 'Sydney HQ', body: 'Sydney HQ serving Australia, New Zealand, Singapore, and India. Vertex AI workloads deployed in australia-southeast1 and asia-southeast1 for data residency.', addr: '12/64 York Street, Sydney NSW 2000\nABN 12 667 454 006' },
    { _type: 'geoCard', region: 'GB — United Kingdom', city: 'London', body: 'UK delivery for FCA-regulated firms, NHS Trusts, and FTSE 100 enterprises. Vertex AI deployed in europe-west2 with UK GDPR and EU AI Act governance overlays.', addr: 'London delivery centre\nUK GDPR aligned · europe-west2 residency' },
    { _type: 'geoCard', region: 'US — North America', city: 'New York', body: 'US delivery for Fortune 1000 enterprises with HIPAA, SOC 2, and state-specific governance overlays. Vertex AI deployed in us-east4 or us-central1.', addr: 'New York delivery centre\nSOC 2 / HIPAA aware · FedRAMP-aware' },
  ]),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'Practitioners who actually ship Gemini workloads.',
  operatorHeadingAccent: 'actually ship',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director, leads enterprise Gemini and Vertex AI engagements. Six years at monday.com before founding Fruition. 500+ implementations across the major AI platforms — Google, Microsoft, OpenAI, Anthropic, and AWS.',
    'Our Vertex AI practice combines product-engineering rigour with the governance and change-management discipline that determines whether an AI workload survives past pilot.',
  ],
  operatorPanel: withKeys([
    { _type: 'operatorRow', k: 'prior', v: 'monday.com · 6y' },
    { _type: 'operatorRow', k: 'based', v: 'Sydney · AU' },
    { _type: 'operatorRow', k: 'entities', v: 'AU · UK · US' },
    { _type: 'operatorRow', k: 'status', v: 'Google Cloud Partner', accent: true },
  ]),
  operatorCreds: [
    'Google Cloud Partner',
    'monday.com Platinum',
    'Rising Star 2026',
    '500+ implementations',
  ],

  faqEyebrow: 'FAQ',
  faqHeading: 'Gemini and Vertex AI questions, answered.',
  faqHeadingAccent: 'answered.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What is the difference between Google Gemini and Vertex AI?', answer: "Google Gemini is Google's family of multimodal large language models, available through the consumer Gemini app, the Gemini API, and embedded in Google Workspace. Vertex AI is Google Cloud's managed platform for building, deploying, and governing AI applications using Gemini and other models. Most enterprises need Vertex AI for production workloads — it provides security, governance, monitoring, and integration into Google Cloud." },
    { _type: 'aiFaq', question: 'What does a Google Gemini implementation partner do?', answer: 'A Gemini and Vertex AI implementation partner helps enterprises identify high-value AI use cases, build agents and RAG systems on Vertex AI, integrate Gemini into Google Workspace, manage prompts and evaluations, and meet security and governance requirements. Fruition has delivered Gemini and Vertex AI workloads across APAC, UK, and US enterprises.' },
    { _type: 'aiFaq', question: 'How much does Google Gemini for Workspace cost?', answer: 'Gemini for Workspace is now bundled into most Google Workspace plans — Business Standard, Business Plus, Enterprise Standard, and Enterprise Plus include Gemini features. Vertex AI is priced based on model usage (per 1,000 input/output tokens for Gemini 2.5 Pro and Flash), grounding queries, and any deployed infrastructure. Fruition implementation typically starts at AUD $35,000 for a structured pilot.' },
    { _type: 'aiFaq', question: 'What can you build on Vertex AI?', answer: 'Vertex AI supports custom RAG systems, multi-agent orchestration with Agent Builder, fine-tuned models, multimodal applications (text, image, video, audio), and grounded enterprise search via Vertex AI Search. Common implementations include customer service agents, internal knowledge assistants, document analysis pipelines, and code intelligence tools.' },
    { _type: 'aiFaq', question: 'Is Gemini suitable for regulated industries?', answer: 'Yes. Vertex AI offers data residency controls, customer-managed encryption keys (CMEK), VPC Service Controls, and compliance with SOC 2, HIPAA, ISO 27001, FedRAMP High, and PCI DSS. Gemini for Workspace inherits the underlying compliance posture of Google Workspace. Fruition has implemented Gemini and Vertex AI workloads for financial services, healthcare, and government clients.' },
    { _type: 'aiFaq', question: 'How does Gemini compare to Claude and ChatGPT for enterprise?', answer: "Gemini's strengths are its 2-million-token context window (longest in production), native multimodal capabilities, deep Google Workspace integration, and tight coupling with Google Cloud infrastructure. Claude leads on reasoning and code; ChatGPT leads on third-party ecosystem. The best choice depends on use case — Fruition recommends model and platform per workload, not per organisation." },
    { _type: 'aiFaq', question: 'How long does a Gemini or Vertex AI implementation take?', answer: 'A Vertex AI agent or RAG implementation typically takes 6 to 14 weeks from kickoff to production. Gemini for Workspace rollouts are faster — 4 to 10 weeks for change management, training, and governance setup. Complex multi-agent or fine-tuning projects can extend to 4 to 6 months.' },
    { _type: 'aiFaq', question: 'Do I need to use Google Cloud to use Vertex AI?', answer: 'Yes. Vertex AI runs on Google Cloud Platform. However, it can connect to data sources outside GCP — AWS S3, Azure Blob, on-premise databases — through standard connectors. If you are not currently a GCP customer, Fruition can advise on the foundation work needed before Vertex AI adoption.' },
    { _type: 'aiFaq', question: 'What is Vertex AI Agent Builder?', answer: "Vertex AI Agent Builder is Google's low-code platform for building enterprise AI agents and conversational experiences. It includes prebuilt connectors, the Agent Development Kit (ADK), grounding via Vertex AI Search, and multi-agent orchestration. Fruition has built Agent Builder agents handling customer service, HR, and internal knowledge use cases." },
    { _type: 'aiFaq', question: 'Can Fruition help with the Google Cloud foundation work?', answer: 'Yes. Fruition holds Google Cloud Partner status and can advise on the foundation work — organisation structure, IAM, VPC design, billing — that underpins a successful Vertex AI implementation. For larger transformation programs, we often partner with specialist GCP infrastructure firms.' },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Ready to move from Gemini experiments to production?',
  ctaHeadingAccent: 'experiments to production?',
  ctaBody:
    "Book a 30-minute scoping call. We'll size the use case, pick the right Gemini and Vertex AI surfaces, and give you a costed path to production.",
  ctaLabel: 'Book Gemini scoping call →',
  ctaUrl: CONTACT,
}

// ─────────────────────────────────────────────────────────────────────────
// 4. Microsoft Copilot Partner
// ─────────────────────────────────────────────────────────────────────────
const copilot = {
  _id: 'aiPartnerPage-microsoft-copilot-partner',
  _type: 'aiPartnerPage',
  title: 'Microsoft Copilot Consulting & Implementation Partner',
  slug: { _type: 'slug', current: 'microsoft-copilot-partner' },
  seoTitle: 'Microsoft Copilot Consulting & Implementation Partner | APAC, UK & US | Fruition',
  seoDescription:
    'Expert Microsoft 365 Copilot and Copilot Studio implementation across APAC, UK, and US. Fruition Services helps enterprises roll out, govern, and scale Copilot. 500+ implementations.',

  brandName: 'Microsoft Copilot',
  partnerTag: 'Microsoft Copilot Partner',
  accentColor: '#0078D4',
  accentColorDeep: '#005A9E',
  accentColorSoft: 'rgba(0,120,212,0.10)',
  serifAccent: false,

  heroEyebrow: 'Microsoft Copilot · Implementation Partner',
  heroHeading: 'Microsoft Copilot, rolled out properly.',
  heroHeadingAccent: 'rolled out properly.',
  heroLead:
    'Fruition Services is a Microsoft Copilot consulting and implementation partner across APAC, UK, and US. We plan, deploy, govern, and scale M365 Copilot and Copilot Studio for enterprises that need it to actually work.',
  primaryCtaLabel: 'Book a Copilot readiness call →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'See our capabilities',
  secondaryCtaUrl: '#capabilities',
  heroSidePanelType: 'regions',
  heroSidePanelTitle: 'Regions Served',
  heroRegions: withKeys([
    { _type: 'heroRegion', label: 'Australia', value: 'Sydney HQ' },
    { _type: 'heroRegion', label: 'Singapore', value: 'APAC delivery' },
    { _type: 'heroRegion', label: 'India', value: 'Engineering pod' },
    { _type: 'heroRegion', label: 'United Kingdom', value: 'London' },
    { _type: 'heroRegion', label: 'United States', value: 'New York' },
  ]),

  stripType: 'stats',
  stats: withKeys([
    { _type: 'aiStat', value: '500', unit: '+', label: 'Implementations delivered.' },
    { _type: 'aiStat', value: '6.4', unit: 'hrs', label: 'Average weekly time saved per user.' },
    { _type: 'aiStat', value: '3', unit: '', label: 'Continents · APAC · UK · US.' },
    { _type: 'aiStat', value: '94', unit: '%', label: 'Pilot-to-rollout conversion rate.' },
  ]),

  capEyebrow: 'What we deliver',
  capHeading: 'Full-stack Microsoft Copilot capability, from licence baseline to custom agents.',
  capHeadingAccent: 'custom agents.',
  capLead:
    'Most partners do one thing well. We do all four — and the failure modes of Copilot rollouts come from gaps between them.',
  capabilities: withKeys([
    {
      _type: 'capability', num: 'M365 Copilot',
      title: 'Copilot rollout & adoption',
      body: 'Structured rollout of M365 Copilot across Word, Excel, Outlook, Teams, and PowerPoint. Built around use cases, not features.',
      bullets: bullets(['Readiness and data hygiene audit', 'Licence and SKU planning', 'Pilot cohort design (50–500 users)', 'Adoption playbooks per function', 'Measurement and ROI tracking']),
    },
    {
      _type: 'capability', num: 'Copilot Studio',
      title: 'Custom agent development',
      body: 'Purpose-built Copilot Studio agents for HR, IT helpdesk, sales enablement, customer service, and internal knowledge.',
      bullets: bullets(['Agent architecture and design', 'Dataverse and SharePoint integration', 'Power Automate flow connections', 'Multi-channel deployment (Teams, web)', 'Message pack optimisation']),
    },
    {
      _type: 'capability', num: 'Governance',
      title: 'Security, compliance & governance',
      body: 'The work that decides whether Copilot is safe to use. Purview, DLP, sensitivity labels, audit, and oversight.',
      bullets: bullets(['SharePoint over-permission audit', 'Microsoft Purview configuration', 'Sensitivity label rollout', 'AI usage policy authoring', 'Audit log and reporting']),
    },
    {
      _type: 'capability', num: 'Vertical Copilots',
      title: 'Sales, Finance, Security & Service',
      body: "Implementation of Microsoft's role-based Copilots with the Dynamics 365 or Sentinel integrations they need to be useful.",
      bullets: bullets(['Copilot for Sales (Dynamics 365)', 'Copilot for Finance (Excel + ERP)', 'Copilot for Security (Sentinel)', 'Copilot for Service (Customer Service)', 'Cross-product workflow design']),
    },
  ]),

  showcaseEyebrow: 'Why Fruition',
  showcaseHeading: 'Three reasons enterprises choose us over the alternatives.',
  showcaseHeadingAccent: 'choose us',
  showcaseLead:
    'Most Copilot failures trace back to the unsexy work. We do that first, build real agents, and keep accountable local teams.',
  showcaseCards: withKeys([
    { _type: 'showcaseCard', icon: '01', name: "We've done the unsexy work", role: '// data hygiene first', body: 'Most Copilot failures trace back to SharePoint over-permissioning and bad sensitivity labels. We audit and fix that first. Every time.', meta: [] },
    { _type: 'showcaseCard', icon: '02', name: 'Built, not just configured', role: '// real workloads', body: 'We build Copilot Studio agents that handle real workloads at scale. Not demos. Some of ours handle 100K+ monthly interactions.', meta: [] },
    { _type: 'showcaseCard', icon: '03', name: 'Local, accountable teams', role: '// no bait-and-switch', body: 'Sydney, London, New York. The person who scopes your engagement is the person who delivers it. No bait-and-switch.', meta: [] },
  ]),

  processEyebrow: 'How we work',
  processHeading: 'Four phases from readiness to scale.',
  processHeadingAccent: 'readiness to scale.',
  processLead:
    'Each phase has fixed outcomes, fixed duration, and a published price. No retainer creep.',
  process: withKeys([
    { _type: 'processStep', tag: '01 / assess', title: 'Assess', body: 'Readiness audit, data hygiene scan, SharePoint permissions review, and licence planning. Outcome: go/no-go.', duration: '2–4 weeks' },
    { _type: 'processStep', tag: '02 / pilot', title: 'Pilot', body: '50–200 user pilot with measurement framework, use-case training, governance baseline, and weekly review cadence.', duration: '4–8 weeks' },
    { _type: 'processStep', tag: '03 / build', title: 'Build', body: 'Custom Copilot Studio agents, vertical Copilot rollouts, integration to line-of-business systems and Dataverse.', duration: '4–12 weeks' },
    { _type: 'processStep', tag: '04 / scale', title: 'Scale', body: 'Broad rollout, adoption coaching, governance maintenance, monthly value reporting, and continuous use-case discovery.', duration: 'Ongoing' },
  ]),

  casesEyebrow: 'Outcomes',
  casesHeading: "What Copilot delivers when it's done right.",
  casesHeadingAccent: 'done right.',
  cases: withKeys([
    { _type: 'caseCard', industry: 'Financial Services · UK', title: 'M365 Copilot rollout to 2,400 users', body: '12-week structured rollout across investment banking and operations. Pre-launch SharePoint audit prevented 14,000 over-permissioned file exposures.', metric: '7.2hrs', metricLabel: 'Saved per user per week · 98% active usage' },
    { _type: 'caseCard', industry: 'Healthcare · Australia', title: 'Copilot Studio HR agent', body: 'Built a Copilot Studio agent handling 8,000 monthly HR queries across 6 hospitals. Integrated with SuccessFactors and SharePoint policy library.', metric: '73%', metricLabel: 'First-contact resolution · $340K annual savings' },
    { _type: 'caseCard', industry: 'Manufacturing · US', title: 'Copilot for Sales (Dynamics 365)', body: 'Deployed Copilot for Sales across 180 account executives. Integration with Dynamics 365, Teams, and Outlook surfaces deal context in every customer interaction.', metric: '18%', metricLabel: 'Win rate lift · 32% more meeting prep time' },
  ]),

  compareEyebrow: 'How we compare',
  compareHeading: 'Fruition vs Big-4 vs Microsoft direct.',
  compareHeadingAccent: 'Fruition',
  compareColLabel: 'Capability',
  compareColA: 'Fruition',
  compareColB: 'Big-4 / Microsoft FastTrack',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Hands-on implementation', colA: 'Yes', colB: 'Subcontracted / limited, advisory' },
    { _type: 'compareRow', label: 'Copilot Studio expertise', colA: 'In-house, deep', colB: 'Variable / limited' },
    { _type: 'compareRow', label: 'SharePoint permissions remediation', colA: 'Yes — full audit', colB: 'Sometimes / self-service guidance' },
    { _type: 'compareRow', label: 'Fixed-fee phases', colA: 'Yes — published', colB: 'Retainer-based / free but limited' },
    { _type: 'compareRow', label: 'Governance & policy authoring', colA: 'Yes', colB: 'Yes / self-service' },
    { _type: 'compareRow', label: 'Vendor-neutral roadmap', colA: 'Yes', colB: 'Sometimes / Microsoft-only' },
    { _type: 'compareRow', label: 'APAC + UK + US delivery', colA: 'Yes — local teams', colB: 'Yes' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Microsoft Copilot expertise, delivered locally.',
  geoHeadingAccent: 'delivered locally.',
  geoLead:
    'Headquartered in Sydney, with delivery teams in London and New York. Local compliance overlays included.',
  geo: withKeys([
    { _type: 'geoCard', region: 'AU · SG · IN — Asia Pacific', city: 'Sydney HQ', body: 'Sydney HQ serving Australia, New Zealand, Singapore, and India. APRA, Australian Privacy Principles, and PDPA-aligned governance frameworks.', addr: '12/64 York Street, Sydney NSW 2000\nABN 12 667 454 006' },
    { _type: 'geoCard', region: 'GB — United Kingdom', city: 'London', body: 'UK entity serving FCA-regulated firms, NHS Trusts, and FTSE 100 enterprises. UK GDPR, EU AI Act, and FCA governance overlays as standard.', addr: 'London delivery centre\nUK GDPR aligned · FCA & EU AI Act ready' },
    { _type: 'geoCard', region: 'US — North America', city: 'New York', body: 'US entity serving Fortune 1000 enterprises with HIPAA, SOC 2, FINRA, and state-specific (CCPA, CPRA) governance overlays.', addr: 'New York delivery centre\nSOC 2 / HIPAA aware · 50 states + Canada' },
  ]),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'Implementations led by practitioners with Microsoft platform depth.',
  operatorHeadingAccent: 'practitioners',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director at Fruition, leads enterprise Copilot engagements personally. Six years at monday.com before founding Fruition, with 500+ implementations across the major productivity platforms — Microsoft, Google, and adjacent ecosystems.',
    'Our Copilot practice combines deep Microsoft 365 platform expertise with the change-management discipline that determines whether Copilot survives past the pilot.',
  ],
  operatorPanel: withKeys([
    { _type: 'operatorRow', k: 'prior', v: 'monday.com · 6y' },
    { _type: 'operatorRow', k: 'based', v: 'Sydney · AU' },
    { _type: 'operatorRow', k: 'entities', v: 'AU · UK · US' },
    { _type: 'operatorRow', k: 'status', v: 'Microsoft Solutions Partner', accent: true },
  ]),
  operatorCreds: [
    'Microsoft Solutions Partner',
    'monday.com Platinum',
    'Rising Star 2026',
    '500+ implementations',
  ],

  faqEyebrow: 'FAQ',
  faqHeading: 'Microsoft Copilot questions, answered.',
  faqHeadingAccent: 'answered.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What does a Microsoft Copilot implementation partner do?', answer: 'A Microsoft Copilot implementation partner helps enterprises plan, deploy, govern, and scale Microsoft 365 Copilot and Copilot Studio. Services typically include readiness assessment, licence planning, data and permissions audit, pilot rollout, custom agent development in Copilot Studio, governance frameworks, and end-user adoption programs. Fruition has delivered Copilot implementations across APAC, UK, and US.' },
    { _type: 'aiFaq', question: 'What is the difference between M365 Copilot and Copilot Studio?', answer: 'Microsoft 365 Copilot is the embedded AI assistant inside Word, Excel, Outlook, Teams, and PowerPoint that uses your tenant data. Copilot Studio is the low-code platform for building custom AI agents that can be deployed across Teams, websites, and other channels. Most enterprises need both: M365 Copilot for productivity, Copilot Studio for purpose-built workflows.' },
    { _type: 'aiFaq', question: 'How much does Microsoft Copilot cost?', answer: 'Microsoft 365 Copilot is licensed at USD $30 per user per month with an annual commitment, as a standalone add-on to existing Microsoft 365 plans. Copilot Studio is priced per message pack starting at USD $200 for 25,000 messages. Implementation costs from a partner like Fruition vary by scope, typically starting at AUD $40,000 for a structured pilot.' },
    { _type: 'aiFaq', question: 'How long does Microsoft Copilot rollout take?', answer: 'A structured Copilot rollout typically takes 8 to 16 weeks for mid-market organisations and 4 to 9 months for enterprise. Phases include readiness and data hygiene (3-6 weeks), pilot with 50-200 users (4-8 weeks), governance and policy setup (parallel), and broader rollout (4-12 weeks).' },
    { _type: 'aiFaq', question: 'Why do most Microsoft Copilot pilots fail?', answer: "The leading cause is unprepared data — over-permissioned SharePoint sites, sensitive data exposure, and weak labelling cause Copilot to surface content users shouldn't see. Other causes include lack of use-case training, no governance framework, and treating Copilot as a tool rollout rather than a change program." },
    { _type: 'aiFaq', question: 'Is Microsoft Copilot suitable for regulated industries?', answer: "Yes, with the right governance. Microsoft 365 Copilot inherits your tenant's compliance posture and supports Microsoft Purview sensitivity labels, DLP, and audit logging. Fruition has delivered Copilot rollouts for financial services, healthcare, and government clients with HIPAA, APRA, FCA, and PCI-DSS requirements." },
    { _type: 'aiFaq', question: 'What can you build in Copilot Studio?', answer: 'Copilot Studio supports custom agents for HR helpdesks, IT triage, sales enablement, customer service, internal knowledge search, and process automation. Agents connect to Dataverse, SharePoint, third-party APIs, and Power Automate flows. Fruition has built Copilot Studio agents handling 100,000+ monthly interactions.' },
    { _type: 'aiFaq', question: 'Do I need to be a Microsoft customer to use Copilot?', answer: 'M365 Copilot requires a Microsoft 365 E3, E5, Business Standard, or Business Premium plan as a prerequisite. Copilot Studio can be used as a standalone product but is most powerful when integrated with the Microsoft ecosystem. Fruition can also advise on the licence baseline you need before Copilot adoption.' },
    { _type: 'aiFaq', question: 'How do you measure Copilot ROI?', answer: 'Fruition measures Copilot ROI across four axes: time saved per user per week (typically 4-8 hours), task completion velocity (typically 25-40% improvement), error reduction (varies by function), and direct cost avoidance (replaced tools or contractor spend). We baseline pre-rollout and re-measure at 30, 60, and 90 days.' },
    { _type: 'aiFaq', question: 'Can you help with Copilot for security or finance teams?', answer: "Yes. Fruition has implemented Copilot for Security (SIEM and incident response augmentation), Copilot for Finance (Excel-embedded reconciliation and reporting), and Copilot for Sales (Dynamics 365 integration). Each has distinct licensing, prerequisites, and use cases we'll assess in scoping." },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Ready to roll out Microsoft Copilot properly?',
  ctaHeadingAccent: 'properly?',
  ctaBody:
    "Book a 30-minute readiness call. We'll diagnose your Copilot situation and give you a frank assessment — pilot, scale, or pause.",
  ctaLabel: 'Book Copilot readiness call →',
  ctaUrl: CONTACT,
}

// ─────────────────────────────────────────────────────────────────────────
// 5. AI Capability Assessment
// ─────────────────────────────────────────────────────────────────────────
const assessment = {
  _id: 'aiPartnerPage-ai-capability-assessment',
  _type: 'aiPartnerPage',
  title: 'AI Capability Assessment',
  slug: { _type: 'slug', current: 'ai-capability-assessment' },
  seoTitle: 'AI Capability Assessment — APAC, UK & US | Fruition Services',
  seoDescription:
    'A 4-week AI Capability Assessment from Fruition Services. We map your processes, score your AI readiness, and deliver a costed implementation roadmap. Available across APAC, UK, and US.',

  brandName: 'AI Capability Assessment',
  partnerTag: 'AI Capability Assessment',
  accentColor: '#8015e8',
  accentColorDeep: '#550e9b',
  accentColorSoft: 'rgba(128,21,232,0.08)',
  serifAccent: true,

  heroEyebrow: '★ 4-Week AI Capability Assessment',
  heroHeading: 'Stop guessing where AI fits. Find out in four weeks.',
  heroHeadingAccent: 'Find out in four weeks.',
  heroLead:
    'A structured diagnostic that maps your processes, scores your AI readiness, and delivers a costed implementation roadmap. Used by 500+ organisations across Australia, the UK, and the US. Fixed fee — AUD $24,500 (AU), GBP £14,500 (UK), USD $18,500 (US).',
  primaryCtaLabel: 'Book your assessment →',
  primaryCtaUrl: CALENDLY,
  secondaryCtaLabel: 'See the process',
  secondaryCtaUrl: '#process',
  heroSidePanelType: 'regions',
  heroSidePanelTitle: 'Available In',
  heroRegions: withKeys([
    { _type: 'heroRegion', label: 'Australia', value: 'AUD $24,500 + GST' },
    { _type: 'heroRegion', label: 'United Kingdom', value: 'GBP £14,500 + VAT' },
    { _type: 'heroRegion', label: 'United States', value: 'USD $18,500' },
    { _type: 'heroRegion', label: 'Singapore & India', value: 'APAC coverage' },
    { _type: 'heroRegion', label: 'EU & EMEA', value: 'via London' },
  ]),

  stripType: 'stats',
  stats: withKeys([
    { _type: 'aiStat', value: '500', unit: '+', label: 'Assessments run across APAC, UK and US.' },
    { _type: 'aiStat', value: '4', unit: 'wk', label: 'Kickoff to executive roadmap.' },
    { _type: 'aiStat', value: '8', unit: '', label: 'Dimensions of AI readiness scored.' },
    { _type: 'aiStat', value: '70', unit: '%', label: 'Of clients engage us for implementation after.' },
  ]),

  capEyebrow: 'What we measure',
  capHeading: 'Eight dimensions of AI readiness, scored against industry benchmarks.',
  capHeadingAccent: 'Eight dimensions',
  capLead:
    "Most AI strategies fail not because of the technology, but because the organisation underneath isn't ready. We diagnose all eight.",
  capabilities: withKeys([
    { _type: 'capability', num: '01', title: 'Data Foundations', body: 'Quality, accessibility, and structure of the data AI will rely on.' },
    { _type: 'capability', num: '02', title: 'Process Clarity', body: 'Whether your workflows are documented enough to be augmented.' },
    { _type: 'capability', num: '03', title: 'Tooling & Platforms', body: 'Current stack, integration capability, and platform maturity.' },
    { _type: 'capability', num: '04', title: 'Team Capability', body: 'Skills, fluency, and capacity to adopt new ways of working.' },
    { _type: 'capability', num: '05', title: 'Governance & Risk', body: 'Policies, compliance posture, and risk tolerance for AI use.' },
    { _type: 'capability', num: '06', title: 'Change Readiness', body: 'Cultural and structural readiness to adopt new workflows.' },
    { _type: 'capability', num: '07', title: 'Commercial Case', body: 'Whether AI investment can be tied to measurable business outcomes.' },
    { _type: 'capability', num: '08', title: 'Strategic Alignment', body: 'How well AI ambitions map to your existing strategy and resourcing.' },
  ]),

  showcaseEyebrow: 'What you get',
  showcaseHeading: 'A roadmap your CFO will sign and your CTO can deliver.',
  showcaseHeadingAccent: 'CFO will sign',
  showcaseLead:
    'Five deliverables, plus a 65-page final package in PDF and editable formats. You own everything — no lock-in.',
  showcaseCards: withKeys([
    { _type: 'showcaseCard', icon: '01', name: 'Process map of your operations', role: '// current state', body: 'Visualised end-to-end workflows for the functions in scope — typically operations, finance, marketing, and customer service.', meta: [] },
    { _type: 'showcaseCard', icon: '02', name: 'Readiness scorecard', role: '// 8 dimensions', body: 'Quantified scores across all eight dimensions, with benchmarks against comparable organisations in your industry and region.', meta: [] },
    { _type: 'showcaseCard', icon: '03', name: 'Ranked opportunity register', role: '// impact × effort', body: "Every AI opportunity identified, ranked by impact, effort, and time-to-value. Includes opportunities you'll do nothing with — that's the point.", meta: [] },
    { _type: 'showcaseCard', icon: '04', name: 'Costed 12-month roadmap', role: '// three phases', body: 'Three phases, each with a defined outcome, budget envelope, and resourcing plan. Vendor-agnostic recommendations.', meta: [] },
    { _type: 'showcaseCard', icon: '05', name: 'Executive presentation', role: '// board-ready', body: 'A board-ready deck and a 90-minute presentation to your leadership team. You own everything — no lock-in.', meta: [] },
  ]),

  processEyebrow: 'The 4-week process',
  processHeading: 'From kickoff to executive roadmap in 28 days.',
  processHeadingAccent: 'in 28 days.',
  processLead:
    "Compressed, structured, and built around a fixed cadence so you know exactly what's happening each week.",
  process: withKeys([
    { _type: 'processStep', tag: 'Week 01', title: 'Discovery', body: 'Stakeholder interviews, process mapping workshops, strategic context review, pain-point inventory.', duration: 'Week 1' },
    { _type: 'processStep', tag: 'Week 02', title: 'Audit', body: 'Data and systems audit, tooling inventory, governance review, team capability survey.', duration: 'Week 2' },
    { _type: 'processStep', tag: 'Week 03', title: 'Score & Prioritise', body: 'Readiness scoring (8 dimensions), opportunity identification, effort vs impact mapping, risk register.', duration: 'Week 3' },
    { _type: 'processStep', tag: 'Week 04', title: 'Roadmap & Present', body: '12-month implementation plan, costed phase breakdown, executive presentation, handover & Q&A.', duration: 'Week 4' },
  ]),

  casesEyebrow: 'Recent outcomes',
  casesHeading: 'What the roadmap unlocks.',
  casesHeadingAccent: 'unlocks.',
  cases: withKeys([
    { _type: 'caseCard', industry: 'Professional Services · UK', title: 'Operations overhead reduction', body: '"The assessment told us we were ready in some places, not in others. The roadmap stopped us spending £400K on something that would have failed."', metric: '38%', metricLabel: 'Operations overhead reduction in 9 months' },
    { _type: 'caseCard', industry: 'Healthcare · Australia', title: 'Payback on first AI investment', body: '"We came in wanting an LLM strategy. We left with a data foundation plan, which we needed first. Best four weeks we’ve spent."', metric: '6mo', metricLabel: 'Payback on first AI investment phase' },
    { _type: 'caseCard', industry: 'Financial Services · US', title: 'Annualised efficiency gain', body: '"Fruition’s roadmap was the document our board needed to approve the program. Clear, costed, and defensible."', metric: '$2.4M', metricLabel: 'Annualised efficiency gain, Phase 1' },
  ]),

  compareEyebrow: 'How we compare',
  compareHeading: 'Fruition Capability Assessment vs Big-4 vs DIY.',
  compareHeadingAccent: 'Fruition',
  compareColLabel: 'Dimension',
  compareColA: 'Fruition Assessment',
  compareColB: 'Big-4 / Internal DIY',
  compareRows: withKeys([
    { _type: 'compareRow', label: 'Duration', colA: '4 weeks', colB: '3–6 months / 3–12 months' },
    { _type: 'compareRow', label: 'Fixed fee', colA: 'Yes — published', colB: 'No, retainer-based / hidden internal cost' },
    { _type: 'compareRow', label: 'Vendor-neutral', colA: 'Yes', colB: 'Sometimes / depends' },
    { _type: 'compareRow', label: 'Implementation-ready', colA: 'Yes — Phase 1 detailed', colB: 'Strategy only / varies' },
    { _type: 'compareRow', label: 'Benchmarking data', colA: '500+ comparable orgs', colB: 'Yes (Big-4) / none' },
    { _type: 'compareRow', label: 'Practitioner-led', colA: 'Yes — implementers', colB: 'Strategy consultants / internal team' },
    { _type: 'compareRow', label: 'Geographic coverage', colA: 'AU · UK · US', colB: 'Global / internal only' },
  ]),

  geoEyebrow: 'Geographic coverage',
  geoHeading: 'Delivered locally in three regions.',
  geoHeadingAccent: 'three regions.',
  geoLead:
    'Same methodology, same deliverables, regional risk and compliance overlays.',
  geo: withKeys([
    { _type: 'geoCard', region: 'AU · SG · IN — APAC', city: 'Sydney · Singapore · India', body: 'Headquartered in Sydney, with delivery support across Singapore and India. Compliant with Australian Privacy Principles and Singapore PDPA. Fixed fee AUD $24,500 + GST.', addr: '12/64 York Street, Sydney NSW 2000\nABN 12 667 454 006' },
    { _type: 'geoCard', region: 'GB — UK & Europe', city: 'London', body: 'UK entity serving England, Scotland, Wales, Ireland, and EU clients. UK GDPR and EU AI Act-aware risk frameworks included as standard. Fixed fee GBP £14,500 + VAT.', addr: 'London delivery centre\nUK GDPR aligned · EU AI Act ready' },
    { _type: 'geoCard', region: 'US — North America', city: 'New York', body: 'US entity serving all 50 states and Canada. SOC 2, HIPAA, and state-specific (CCPA, CPRA) risk overlays available. Fixed fee USD $18,500.', addr: 'New York delivery centre\nSOC 2 aware · HIPAA-aware framework' },
  ]),

  operatorEyebrow: 'Who leads it',
  operatorHeading: 'The assessment is led by practitioners, not strategists.',
  operatorHeadingAccent: 'practitioners, not strategists.',
  operatorName: 'Josh Jebathilak',
  operatorRole: 'Managing Director · Fruition',
  operatorBody: [
    'Josh Jebathilak, Managing Director at Fruition, leads every Capability Assessment. He spent six years at monday.com before founding Fruition, and has led over 500 implementations across financial services, healthcare, professional services, and government.',
    "The assessment team is hands-on. We don't outsource the work to junior associates. The person who scopes your roadmap is the person who would deliver it.",
  ],
  operatorPanel: withKeys([
    { _type: 'operatorRow', k: 'prior', v: 'monday.com · 6y' },
    { _type: 'operatorRow', k: 'based', v: 'Sydney · AU' },
    { _type: 'operatorRow', k: 'entities', v: 'AU · UK · US' },
    { _type: 'operatorRow', k: 'status', v: 'Platinum Partner', accent: true },
  ]),
  operatorCreds: [
    'monday.com Rising Star 2026',
    'Platinum Partner',
    '6 yrs at monday.com',
    '500+ implementations',
  ],

  faqEyebrow: 'FAQ',
  faqHeading: 'Common questions before booking.',
  faqHeadingAccent: 'before booking.',
  faq: withKeys([
    { _type: 'aiFaq', question: 'What is an AI Capability Assessment?', answer: "An AI Capability Assessment is a structured 4-week diagnostic that maps your current business processes, scores your organisation's AI readiness across eight dimensions, identifies highest-impact AI opportunities, and delivers a prioritised implementation roadmap with costs and ROI estimates. Fruition has run over 500 assessments across APAC, UK, and US." },
    { _type: 'aiFaq', question: 'How long does the assessment take?', answer: 'Four weeks from kickoff to delivery. Week 1 is stakeholder interviews and process discovery. Week 2 is data and systems audit. Week 3 is opportunity scoring and prioritisation. Week 4 is roadmap synthesis and executive presentation.' },
    { _type: 'aiFaq', question: 'What does the assessment deliver?', answer: 'A process map of your operations, a scored AI readiness scorecard across eight dimensions, a ranked opportunity register with effort and impact estimates, a costed 12-month implementation roadmap, and an executive presentation deck.' },
    { _type: 'aiFaq', question: 'Who is this assessment for?', answer: 'Business leaders, operations directors, and IT decision-makers in mid-market and enterprise organisations who want a defensible, evidence-based AI strategy before committing budget. Typically organisations with 50 to 5,000 staff.' },
    { _type: 'aiFaq', question: 'How much does the AI Capability Assessment cost?', answer: 'Fixed fee of AUD $24,500 for Australia, GBP £14,500 for the UK, and USD $18,500 for the US. The scope and deliverables are identical across regions.' },
    { _type: 'aiFaq', question: 'What if we already use AI tools?', answer: 'Most organisations we assess already use ChatGPT, Copilot, or similar tools in pockets. The assessment quantifies whether those investments are returning value and identifies which processes will benefit most from structured AI implementation versus ad hoc tool adoption.' },
    { _type: 'aiFaq', question: 'Is the assessment vendor-agnostic?', answer: 'Yes. Fruition holds partnerships with monday.com and is platform-agnostic across OpenAI, Anthropic, Microsoft Copilot, Google Gemini, AWS, and others. Our roadmap recommends the best-fit technology for your context, not a preferred vendor.' },
    { _type: 'aiFaq', question: 'Can the assessment be delivered remotely?', answer: 'Yes. We deliver assessments remotely across all regions, with optional on-site workshops in Sydney, London, and New York. Most clients choose a hybrid model with one on-site week for stakeholder workshops.' },
    { _type: 'aiFaq', question: 'What happens after the assessment?', answer: 'You own the roadmap. You can implement it yourself, use other vendors, or engage Fruition for implementation. There is no obligation to continue. Approximately 70% of assessment clients engage us for at least one implementation phase.' },
    { _type: 'aiFaq', question: 'Do you have case studies?', answer: 'Yes. Published case studies span financial services, professional services, healthcare, education, and manufacturing. Recent examples include a 38% reduction in operations overhead at a 400-person professional services firm and a 6-month payback on AI investment for a national healthcare provider.' },
  ]),

  ctaEyebrow: 'Next step',
  ctaHeading: 'Book your AI Capability Assessment.',
  ctaHeadingAccent: 'AI Capability Assessment.',
  ctaBody:
    'Four weeks. Fixed fee. A roadmap your CFO will sign and your CTO can deliver. Available in Sydney, London, and New York.',
  ctaLabel: 'Book a discovery call →',
  ctaUrl: CONTACT,
}

async function main() {
  const docs = [aws, googleCloud, gemini, copilot, assessment]
  for (const doc of docs) {
    console.log('Writing', doc._id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await writeClient.createOrReplace(doc as any)
    console.log('✓', doc.slug.current)
  }
  console.log(`Done — ${docs.length} AI partner pages (batch 2).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
