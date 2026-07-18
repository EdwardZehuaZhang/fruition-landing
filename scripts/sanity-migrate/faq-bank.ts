/**
 * Seed the missing sets of the "Fruition FAQ Bank — Implementation Partner &
 * Agentic Department Pages" (July 2026) as faqItem-bank-* docs, following the
 * convention of the already-seeded sets 1-6 (monday/atlassian/hubspot/clickup/
 * n8n/make).
 *
 * Per the bank's usage rules + Edward's decisions (2026-07-18):
 *  - Questions/answers VERBATIM (createOrReplace so reruns restore verbatim).
 *  - One set per page: the bank set becomes the page's only FAQ tab — other
 *    faqItems are UNTAGGED from the target page (never deleted; they remain
 *    visible on /faqs).
 *  - No verbatim question reuse across pages: migrated duplicates of any bank
 *    question (faqItem-migrated-*) are untagged from their pages.
 *
 * Run with: npx tsx scripts/sanity-migrate/faq-bank.ts
 */
import { writeClient } from './lib'

function toBlocks(text: string) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((para, i) => ({
      _type: 'block',
      _key: `b${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `s${i}`, text: para, marks: [] }],
    }))
}

interface BankSet {
  slug: string
  category: string
  page: string
  items: { q: string; a: string }[]
}

const SETS: BankSet[] = [
  {
    slug: 'claude',
    category: 'Claude FAQs',
    page: 'partnerships/anthropic-claude-partner',
    items: [
      { q: 'What does a Claude implementation partner do?', a: "A Claude partner deploys Anthropic's Claude models into production — enterprise rollouts, Claude Code enablement, custom agents and RAG systems. Fruition implements Claude for organisations across Australia, the UK, the US and Asia, with governance frameworks and evaluation pipelines included from day one." },
      { q: 'What is Claude best suited for compared with other AI models?', a: 'Claude excels at reasoning-heavy work: complex analysis, long-document processing, agentic coding via Claude Code, and safety-sensitive deployments. Fruition works across Anthropic, OpenAI, Microsoft, Google and AWS, and recommends Claude when the workload rewards deep reasoning and reliability — not by default.' },
      { q: 'How much does a Claude implementation cost?', a: 'Fruition Claude engagements start at AUD $18,000 for a focused deployment (enterprise rollout or single production agent), with complex agent and RAG builds typically AUD $35,000–$150,000 per phase. Every phase is fixed-fee with a defined outcome.' },
      { q: 'Can Claude be deployed securely for enterprise data?', a: 'Yes. Claude offers enterprise deployment paths with data-handling commitments, and can run via AWS Bedrock or Google Vertex AI for organisations standardised on those clouds. Fruition designs the deployment architecture, permissions model and governance framework around your compliance requirements.' },
      { q: 'How do we get started with Claude in our business?', a: "Start with a use-case assessment rather than a licence purchase. Fruition's AI Capability Assessment (four weeks, fixed fee) identifies where Claude creates measurable value in your operations, then a first implementation phase ships a production use case with evaluation metrics — typically inside 12 weeks end to end." },
    ],
  },
  {
    slug: 'copilot',
    category: 'Copilot FAQs',
    page: 'partnerships/microsoft-copilot-partner',
    items: [
      { q: 'What does a Microsoft Copilot implementation partner do?', a: 'A Copilot partner plans and delivers M365 Copilot rollouts — data readiness, licensing strategy, adoption programs — and builds custom agents in Copilot Studio. Fruition implements Copilot across Australia, the UK, the US and Asia, with the governance layer most rollouts skip.' },
      { q: 'Why do Microsoft Copilot rollouts fail?', a: "The dominant cause is data readiness: Copilot surfaces whatever permissions allow, so years of over-shared SharePoint and Teams content become instantly discoverable. Fruition's rollout methodology starts with a permissions and data-hygiene audit before a single licence is assigned — the step that decides the outcome." },
      { q: 'How much does a Copilot implementation cost?', a: 'Fruition Copilot engagements start at AUD $15,000 for readiness and pilot deployment, with organisation-wide rollouts including adoption programs typically AUD $25,000–$80,000. Copilot Studio agent builds are scoped separately as fixed-fee phases.' },
      { q: 'What can Copilot Studio agents actually do?', a: 'Copilot Studio agents automate M365-native workflows: HR policy answers grounded in your documents, IT service desk triage, sales-support lookups in Teams, and process automation across the Microsoft stack. Fruition builds these with grounding, guardrails and usage analytics as standard.' },
      { q: 'Is Copilot worth the licence cost?', a: "It depends on data readiness and adoption discipline — licensed-but-unused Copilot is pure cost. Fruition's assessment quantifies value per role before you commit, then the adoption program targets measured usage. Clients typically see clear ROI in document-heavy and meeting-heavy roles first." },
    ],
  },
  {
    slug: 'gemini',
    category: 'Gemini FAQs',
    page: 'partnerships/google-gemini-vertex-ai-partner',
    items: [
      { q: 'What does a Gemini implementation partner do?', a: 'A Gemini partner deploys Gemini for Google Workspace, builds production systems on Vertex AI, and designs multimodal AI workloads. Fruition implements Gemini and Vertex AI for organisations across Australia, the UK, the US and Asia — from Workspace enablement to production agent systems.' },
      { q: 'What is Gemini best suited for?', a: "Gemini leads on multimodal work (documents, images, video, audio in one model), long-context processing, and Google-stack integration — Workspace, BigQuery and Vertex AI. Fruition recommends Gemini when your data and productivity stack live in Google, and other models when they don't." },
      { q: 'How much does a Gemini or Vertex AI implementation cost?', a: 'Fruition Gemini engagements start at AUD $15,000 for Workspace enablement with governance, while Vertex AI production builds — agents, RAG via Vertex AI Search, MLOps — typically run AUD $30,000–$120,000 per phase, fixed-fee with defined outcomes.' },
      { q: 'Gemini for Workspace or Microsoft Copilot — which should we choose?', a: 'Choose by your existing stack: Gemini for Google Workspace organisations, Copilot for Microsoft 365 organisations. Cross-stack deployments rarely justify their friction. Fruition implements both, so the recommendation follows your infrastructure, not a vendor relationship.' },
      { q: 'Can Fruition build production AI on Vertex AI?', a: 'Yes — Vertex AI Agent Builder systems, Vertex AI Search for grounded retrieval, and MLOps pipelines for model lifecycle management. Fruition pairs Vertex builds with its Google Cloud practice covering landing zones, BigQuery and cost governance.' },
    ],
  },
  {
    slug: 'chatgpt',
    category: 'ChatGPT FAQs',
    page: 'partnerships/openai-chatgpt-partner',
    items: [
      { q: 'What does a ChatGPT implementation partner do?', a: 'A ChatGPT partner deploys ChatGPT Enterprise, builds custom GPTs and Assistants API systems, and integrates OpenAI models into your workflows. Fruition implements OpenAI technology for organisations across Australia, the UK, the US and Asia, with governance and evaluation built in.' },
      { q: "What's the difference between ChatGPT Enterprise and the OpenAI API?", a: 'ChatGPT Enterprise is the managed workspace product — admin controls, SSO, no training on your data — best for organisation-wide productivity. The API is for building custom applications and agents. Most Fruition clients need both, deployed under one governance framework.' },
      { q: 'How much does a ChatGPT Enterprise rollout cost?', a: 'Fruition ChatGPT engagements start at AUD $15,000 for enterprise rollout with governance and adoption training. Custom GPT libraries and Assistants API builds are scoped as fixed-fee phases, typically AUD $20,000–$90,000 depending on integration depth.' },
      { q: 'Should we build on OpenAI, Claude, Gemini or Copilot?', a: 'Per workload, not per brand. OpenAI leads on ecosystem breadth and multimodal tooling, Claude on deep reasoning, Gemini on Google-stack multimodal work, Copilot on M365-native productivity. Fruition works across all four, so the platform recommendation follows your use case and infrastructure.' },
      { q: 'How do we stop staff using ChatGPT with sensitive data?', a: "Bans don't work — governed access does. Deploy ChatGPT Enterprise (which doesn't train on your data), publish a usage policy that names approved tools and prohibited inputs, and monitor adoption. Fruition delivers this as a standard governance package with every rollout." },
    ],
  },
  {
    slug: 'agentic-sales',
    category: 'Agentic Sales FAQs',
    page: 'ai-consulting/sales-outbound',
    items: [
      { q: 'What is agentic AI for sales teams?', a: 'Agentic sales AI means autonomous systems that research prospects, personalise outreach, qualify leads and update your CRM without manual triggering. Fruition builds these engines — connected to monday CRM, HubSpot or Salesforce — for sales teams across Australia, the UK, the US and Asia.' },
      { q: 'What can AI sales agents actually do today?', a: 'Reliably: prospect research and enrichment, genuinely personalised first-line outreach, reply classification and routing, meeting prep briefs, and CRM hygiene automation. Not reliably: closing deals or replacing discovery conversations. Fruition builds the proven layer and is honest about the ceiling.' },
      { q: "Do AI outbound systems still work with today's inbox filters?", a: 'Volume-first AI outbound is dying; research-driven systems thrive. Agents that research each prospect before writing — recent news, tech stack, hiring signals — outperform volume approaches by 3–8× on reply rate. Deliverability engineering (domain warmup, volume governance) is half the outcome.' },
      { q: 'How much does an agentic sales system cost?', a: 'Fruition sales AI engagements start at AUD $18,000 for a production outbound or lead-intelligence build, wired into your CRM with full attribution. Larger engines — sourcing, enrichment, personalisation and sequencing — typically run AUD $30,000–$90,000 in fixed-fee phases.' },
      { q: 'Will an AI sales agent damage our brand with bad outreach?', a: 'Ungoverned, yes. Fruition builds approval gates for early sends, brand-voice tuning, suppression rules and reply-sentiment monitoring — so quality is engineered, not hoped for. Every system launches in a supervised mode before autonomous operation.' },
    ],
  },
  {
    slug: 'agentic-marketing',
    category: 'Agentic Marketing FAQs',
    page: 'ai-consulting/marketing-automation',
    items: [
      { q: 'What is agentic AI for marketing teams?', a: 'Agentic marketing AI means autonomous systems handling research, content production, campaign variants and reporting — with editorial gates where brand risk lives. Fruition builds these pipelines connected to HubSpot, monday.com and your MarTech stack across Australia, the UK, the US and Asia.' },
      { q: 'Can AI produce marketing content without hurting our SEO?', a: "Yes — with editorial controls. Google targets low-quality content regardless of how it's made; AI content with editorial gates, original data, expert attribution and genuine utility performs well. Fruition builds the review workflow into the pipeline, and optimises output for AI answer-engine citation as well as rankings." },
      { q: 'What marketing tasks should we automate with agents first?', a: 'Highest-ROI first moves: content repurposing (one asset into many formats), campaign reporting synthesis, lead scoring and routing, and competitor/market monitoring briefs. These pay back in weeks and build the data foundation for more ambitious automation.' },
      { q: 'How much does an agentic marketing system cost?', a: 'Fruition marketing AI engagements start at AUD $18,000 for a production content-operations or lead-intelligence pipeline. Multi-channel campaign orchestration systems typically run AUD $25,000–$70,000, fixed-fee per phase, measured against pipeline contribution rather than activity metrics.' },
      { q: 'How do agentic systems connect to our existing MarTech stack?', a: 'Via your CRM and automation layer: HubSpot (including Breeze AI), monday.com, and n8n or Make middleware for everything else. Fruition is certified across that stack, so agents land inside the tools your team already uses — not in another dashboard nobody opens.' },
    ],
  },
  {
    slug: 'agentic-finance',
    category: 'Agentic Finance FAQs',
    page: 'monday-consulting-solutions/monday-for-finance',
    items: [
      { q: 'What is agentic AI for finance teams?', a: 'Agentic finance AI means autonomous systems for invoice processing, reconciliation, expense handling and reporting — with approval gates and audit trails wherever money moves. Fruition builds these workflows connected to Xero, MYOB, your ERP and monday.com across Australia, the UK, the US and Asia.' },
      { q: 'Which finance processes should we automate first?', a: 'Where volume, rule-clarity and pain intersect: accounts-payable invoice extraction and coding, bank reconciliation exceptions, expense processing, and month-end reporting assembly. These typically reach 80–90% automation with the remainder deliberately routed to humans.' },
      { q: 'Is AI safe to use in financial processes?', a: 'With the right architecture, yes: confidence thresholds route uncertain items to human exception queues, every action is logged for audit, and approval gates sit wherever funds move. Fruition builds these controls in from day one — automation with accountability, not instead of it.' },
      { q: "How much does finance automation cost, and what's the payback?", a: 'Fruition finance AI engagements start at AUD $18,000 for a production process build such as AP automation. Payback is typically measured in months: invoice processing costs drop 60–80% and month-end cycles compress by days. A scoping audit quantifies your specific numbers first.' },
      { q: 'Does this work with Xero and our ERP?', a: 'Yes. Fruition builds finance automation across Xero, MYOB and mid-market ERPs, with monday.com as the workflow and approval layer and n8n or Make as middleware. The ERP stays the system of record; the automation removes the re-keying around it.' },
    ],
  },
  {
    slug: 'agentic-hr',
    category: 'Agentic HR FAQs',
    page: 'monday-consulting-solutions/monday-for-hr',
    items: [
      { q: 'What is agentic AI for HR teams?', a: 'Agentic HR AI means autonomous systems for onboarding orchestration, document collection, policy questions and leave workflows — freeing HR for the human work. Fruition builds these on monday.com HR solutions with governed AI agents, across Australia, the UK, the US and Asia.' },
      { q: 'What HR tasks can AI agents handle reliably?', a: 'Proven ground: onboarding task orchestration, document collection and verification chasing, policy Q&A grounded in your actual handbook, leave and letter workflows, and recruitment coordination (scheduling, candidate comms). Judgment calls — performance, disputes, hiring decisions — stay human by design.' },
      { q: 'Is AI in HR a privacy risk for employee data?', a: 'It is if ungoverned. Fruition deploys HR agents with strict data boundaries: grounding limited to approved policy content, no training on employee data, role-based access, and audit logging. In healthcare and government settings, the same architecture meets HIPAA and public-sector requirements.' },
      { q: 'How much does an agentic HR system cost?', a: 'Fruition HR AI engagements start at AUD $15,000 for a production build such as onboarding orchestration or a policy Q&A agent. Broader people-operations automation typically runs AUD $20,000–$60,000 in fixed-fee phases, sized to headcount and system landscape.' },
      { q: 'Can this integrate with our HRIS?', a: 'Yes. Fruition connects HR automation to Employment Hero, BambooHR, HiBob and similar HRIS platforms, with monday.com carrying the workflow layer and n8n handling the integration plumbing. The HRIS remains the record system; the agents remove the coordination overhead around it.' },
    ],
  },
]

async function main() {
  const bankIds: string[] = []
  const bankQuestions: string[] = []

  /* 1. Seed the 8 sets verbatim */
  for (const set of SETS) {
    for (let i = 0; i < set.items.length; i++) {
      const item = set.items[i]
      const _id = `faqItem-bank-${set.slug}-${i + 1}`
      bankIds.push(_id)
      bankQuestions.push(item.q)
      await writeClient.createOrReplace({
        _id,
        _type: 'faqItem',
        question: item.q,
        answer: toBlocks(item.a),
        category: set.category,
        pages: [set.page],
        categoryOrder: 1,
        order: i + 1,
      })
    }
    console.log(`seeded: ${set.slug} (5 items) → ${set.page}`)
  }

  /* 2. One set per page: untag every OTHER faqItem from the 8 target pages */
  for (const set of SETS) {
    const others: { _id: string; pages: string[] }[] = await writeClient.fetch(
      `*[_type == "faqItem" && $page in pages && !(_id in $ids)]{_id, pages}`,
      { page: set.page, ids: bankIds }
    )
    for (const doc of others) {
      await writeClient.patch(doc._id).set({ pages: (doc.pages || []).filter((p) => p !== set.page) }).commit()
    }
    if (others.length) console.log(`untagged ${others.length} non-bank items from ${set.page}`)
  }

  /* 3. Bank rule "never reuse a question verbatim on two pages": untag
   *    migrated duplicates of ANY bank question (existing sets 1-6 included) */
  const allBankQs: string[] = await writeClient.fetch(
    `*[_type == "faqItem" && string::startsWith(_id, "faqItem-bank-")].question`
  )
  const dupes: { _id: string; question: string; pages: string[] }[] = await writeClient.fetch(
    `*[_type == "faqItem" && string::startsWith(_id, "faqItem-migrated-") && question in $qs && count(pages) > 0]{_id, question, pages}`,
    { qs: allBankQs }
  )
  for (const d of dupes) {
    await writeClient.patch(d._id).set({ pages: [] }).commit()
    console.log(`deduped (untagged from ${JSON.stringify(d.pages)}): "${d.question.slice(0, 60)}"`)
  }

  console.log(`Done. ${bankIds.length} bank items live across ${SETS.length} pages.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
