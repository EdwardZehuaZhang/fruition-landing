/**
 * monday-for-real-estate — replace the manufacturing copy in the first two
 * comparison tabs with real-estate content.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  DO NOT RUN UNTIL VADIM HAS SIGNED OFF ON THE COPY.                      │
 * │  Running this patches the live production dataset.                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * The bug
 * -------
 * `industryPage-monday-for-real-estate` carries manufacturing content in
 * `comparisonTabs[0]` and `comparisonTabs[1]` — evidently copied from
 * `monday-for-manufacturing` when the page was built and never rewritten:
 *
 *   tab 0  label "Why monday.com for Manufacturing?" — renders verbatim as a
 *          tab button on the live real-estate page
 *          items: Process Management / Resource Optimisation / Technology
 *          Integration / Team Collaboration, all describing production
 *          planning, ERP/MES, production lines and OHS compliance
 *   tab 1  "Key Management Features" — production scheduling, work orders,
 *          non-conformance tracking, inventory reorder alerts
 *   tab 2  "How We Can Help" — already genuine real-estate copy, NOT touched
 *          by this script
 *
 * Reported by the SEO Launch Reviewer agent on monday.com item 2819519127
 * (update 129272459, 2026-08-19) and confirmed live on 2026-08-20: the string
 * "Why monday.com for Manufacturing?" is served inside a <button> on
 * https://www.fruitionservices.io/monday-for-real-estate.
 *
 * Claims discipline
 * -----------------
 * Feature descriptions only. No client outcomes, no performance numbers, no
 * tier claims — per docs/voice-guide-fruition.md "CLAIMS (still enforced)".
 * Terminology follows the page's own FAQ copy already live in Sanity
 * (listings, transactions, property information, agents, brokers).
 *
 * Structure is preserved exactly: same `_key`s, same `_type`s, same item
 * numbering, same "emoji Label: sentence" line format as the rest of the site,
 * so the patch is a pure content swap the accordion renders unchanged.
 *
 * Run with:  npx tsx scripts/sanity-migrate/real-estate-comparison-tabs.ts
 */
import { writeClient as client } from "./lib"

const DOC_ID = "industryPage-monday-for-real-estate"

const TAB_0 = {
  _key: "re-tab-0",
  _type: "comparisonTab",
  label: "Why monday.com for Real Estate?",
  items: [
    {
      _key: "re0-1",
      _type: "comparisonItem",
      number: "01",
      title: "Listing & Pipeline Management",
      description:
        "📅 Listing Coordination: Track every property from appraisal through to launch with shared timelines\n" +
        "✅ Lead Capture: Route enquiries from portals, web forms and referrals into one qualified pipeline\n" +
        "📦 Property Information: Keep photos, floor plans, contracts and inspection notes on the listing record",
    },
    {
      _key: "re0-2",
      _type: "comparisonItem",
      number: "02",
      title: "Transaction Coordination",
      description:
        "🗂️ Deal Milestones: Move transactions from offer to settlement with each step and owner visible\n" +
        "🔄 Vendor & Buyer Updates: Manage conveyancers, brokers and building inspectors from one board\n" +
        "✏️ Compliance Records: Keep disclosures, signed documents and key dates auditable in one place",
    },
    {
      _key: "re0-3",
      _type: "comparisonItem",
      number: "03",
      title: "Technology Integration",
      description:
        "✅ System Integration: Connect the CRM, listing portals and accounting tools your agency already runs\n" +
        "📋 Automation Capabilities: Trigger follow-ups, reminders and status changes without manual chasing\n" +
        "📁 Custom Analytics: Report on pipeline value, days on market and conversion by agent or office",
    },
    {
      _key: "re0-4",
      _type: "comparisonItem",
      number: "04",
      title: "Team Collaboration",
      description:
        "⚖️ Intuitive Interface: Enable quick adoption across sales, property management and admin teams\n" +
        "🔧 Real-time Communication: Keep agents, vendors and clients aligned as a deal progresses\n" +
        "📍 Visual Dashboards: Monitor listings, settlements and commissions on customisable displays",
    },
  ],
}

const TAB_1 = {
  _key: "re-tab-1",
  _type: "comparisonTab",
  label: "Key Management Features",
  items: [
    {
      _key: "re1-1",
      _type: "comparisonItem",
      number: "01",
      title: "Listing Management",
      description:
        "📅 Visual listing pipelines with drag-and-drop stage views\n" +
        "🔄 Real-time status tracking from appraisal to settlement\n" +
        "⚡ Automated triggers for inspections, offers and key dates\n" +
        "👩🏽‍💼 Agent workload dashboards with availability at a glance",
    },
    {
      _key: "re1-2",
      _type: "comparisonItem",
      number: "02",
      title: "Transactions & Compliance",
      description:
        "✅ Digital checklists and approval workflows for each transaction\n" +
        "📋 Document tracking with version history and sign-off records\n" +
        "🔔 Deadline alerts for cooling-off, finance and settlement dates",
    },
    {
      _key: "re1-3",
      _type: "comparisonItem",
      number: "03",
      title: "Clients & Leads",
      description:
        "📦 One record per buyer, vendor, tenant or landlord\n" +
        "🚚 Enquiry routing with response-time tracking by agent\n" +
        "📨 Automated nurture sequences for long-lead vendors",
    },
    {
      _key: "re1-4",
      _type: "comparisonItem",
      number: "04",
      title: "Analytics & Reporting",
      description:
        "📊 Real-estate KPI dashboards with live pipeline data\n" +
        "🗂️ Listing performance reports and bottleneck identification\n" +
        "📈 Commission and revenue forecasting by office or team",
    },
  ],
}

async function run() {
  const doc = await client.getDocument(DOC_ID)
  if (!doc) throw new Error(`${DOC_ID} not found`)

  const tabs = (doc.comparisonTabs ?? []) as Array<{ _key?: string }>
  const byKey = new Map(tabs.map((t) => [t._key, t]))
  if (!byKey.has("re-tab-0") || !byKey.has("re-tab-1")) {
    throw new Error("expected comparison tabs re-tab-0 and re-tab-1; aborting rather than guessing")
  }

  // Replace by _key so tab 2 ("How We Can Help") and any tab order stay intact.
  const next = tabs.map((t) =>
    t._key === "re-tab-0" ? TAB_0 : t._key === "re-tab-1" ? TAB_1 : t,
  )

  await client.patch(DOC_ID).set({ comparisonTabs: next }).commit()
  console.log(`patched ${DOC_ID}: comparisonTabs[re-tab-0, re-tab-1] -> real-estate copy`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
