import type { CapabilityBlock, IndustryPoint, SpecPanel } from '@/components/sections/types'

/**
 * Long-form copy for the industry landing pages, lifted from the Fruition blog
 * archive by the content team (Aug 2026 handover) and re-cut for the page.
 *
 * The FAQ half of that handover already lives in Sanity as `faqItem` docs /
 * page `faqTabs`; only the sections marked "Use as H2" are here, because they
 * needed section designs that did not exist yet.
 *
 * Every string may carry the inline-markdown subset `<RichText>` renders —
 * `**bold**` and `[text](/relative/path)`. Blog links are the current slugs,
 * not the Wix-era ones the source documents were written against.
 */

export interface CapabilityBlocksContent {
  eyebrow: string
  heading: string
  headingAccent: string
  lead?: string
  columns?: 2 | 3
  blocks: CapabilityBlock[]
}

export interface BenefitLedgerContent {
  eyebrow: string
  heading: string
  headingAccent: string
  intro?: string
  items: IndustryPoint[]
  footnote?: string
}

export interface TemplateSpecContent {
  eyebrow: string
  heading: string
  headingAccent: string
  lead?: string
  panels: SpecPanel[]
}

export interface IndustrySections {
  capabilityBlocks?: CapabilityBlocksContent
  benefitLedger?: BenefitLedgerContent
  templateSpec?: TemplateSpecContent
}

const CONSTRUCTION: IndustrySections = {
  capabilityBlocks: {
    eyebrow: '// Site-to-office',
    heading: '3 ways monday.com for construction bridges the',
    headingAccent: 'site-to-office gap',
    lead: 'Capturing on-site data, generating safety reports and raising RFIs is the easy part. Getting them to the office while there is still time to act is where projects are won or lost.',
    columns: 3,
    blocks: [
      {
        number: '01',
        title: 'Real-time updates: instant team collaboration',
        lead: 'Automatic reminders for upcoming deadlines, and real-time progress updates the moment they are logged — whether by a site crew member in the field or a construction PMO in the office.',
        points: [
          {
            label: 'Automatic deadline reminders',
            text: 'No critical milestone is missed, regardless of location.',
          },
          {
            label: 'Mobile app access',
            text: 'Technicians and on-site workers stay connected with HQ in real time.',
          },
          {
            label: 'Instant progress updates',
            text: 'Visible to both office and field teams the moment they are entered.',
          },
          {
            label: 'Comment and feedback',
            text: 'Threads attach directly to specific tasks and RFIs, which keeps everyone in the loop and eliminates email trails.',
          },
        ],
      },
      {
        number: '02',
        title: 'Centralised document hub: one source of truth',
        lead: 'monday.com stores RFIs, images, inspection forms, project assets and more in a secure, searchable location. At the office or in the field, teams reach the latest file version.',
        points: [
          {
            text: 'Integrations with Dropbox, Outlook and Google Drive bring existing file workflows into monday WorkOS.',
          },
          { text: 'Mobile file access from any device across active construction sites.' },
          { text: 'Centralised storage for all construction documents, assets and drawings.' },
          { text: 'Real-time document collaboration, so everyone works from the current version.' },
          { text: 'Native documentation features like monday WorkDocs and WorkForms.' },
        ],
      },
      {
        number: '03',
        title: 'Automation bridges: removing manual handoffs',
        lead: 'The handoffs between site and office are where days disappear. These are the ones monday.com for construction automates away.',
        points: [
          { text: 'Progress reports are delivered to the relevant team members without manual compilation.' },
          {
            text: 'Notifications go out when deadlines approach, tasks are completed or budget thresholds are breached.',
          },
          { text: 'Invoice processing and payment tracking keep financial workflows on schedule.' },
          { text: 'Safety reports are generated once a completed inspection checklist triggers them.' },
        ],
      },
    ],
  },
  benefitLedger: {
    eyebrow: '// monday CRM for construction',
    heading: 'Benefits of using monday CRM for',
    headingAccent: 'construction',
    intro:
      'Construction software has always struggled with competition, cost management, complexity and regulatory compliance. monday CRM [aims to solve these](/post/monday-crm-construction) by being adaptive, flexible, customisable and full of unique features.\n\nThe result is better operational efficiency and higher customer satisfaction. Take a look at the key benefits — read: profitability — this platform offers.',
    items: [
      { text: 'Enables personalised, tailored client interactions and follow-ups.' },
      { text: 'Ensures you can track client histories, access communication logs and determine preferences.' },
      { text: 'Facilitates seamless communication between team members, clients and subcontractors.' },
      { text: 'Delivers real-time updates through document sharing and collaborative features.' },
      { text: 'Keeps you aligned with clients in one platform thanks to centralised data storage.' },
      {
        text: '[Visualises your business performance](/post/data-visualisation-on-monday-com) across insights, project profitability, sales pipeline and workforce productivity.',
      },
      {
        text: 'Excels at lead and client management by tracking interactions and post-construction relationships.',
      },
      { text: 'Pushes updates through automation triggers, reminders and to-do lists for a better information flow.' },
      { text: 'Organises your sales pipeline through tracking, budgeting, allocating and monitoring.' },
    ],
    footnote:
      'monday CRM for construction scales with your business, adapting as your needs change. Lead management, customisation, detailed project tracking, workflow automation and [third-party integrations](/post/monday-com-crm-integrations) are all part of the platform.',
  },
}

const REAL_ESTATE: IndustrySections = {
  benefitLedger: {
    eyebrow: '// Real estate CRM',
    heading: 'Why choose monday CRM for',
    headingAccent: 'real estate?',
    intro:
      'Real estate companies benefit from monday CRM because of its property management capabilities, its user-friendly interface, and custom features that improve client satisfaction and streamline communication.',
    items: [
      {
        text: 'Delivers personalised service by building strong client relationships with email ticketing and sequencing.',
      },
      {
        text: 'Creates boards that track lease agreements, maintenance tasks and listings for seamless property management.',
      },
      {
        text: 'Keeps real estate transactions on track through data visualisation on the monday CRM dashboard.',
      },
      {
        text: 'Centralises real estate documents in a secure database for easy access, management and collaboration.',
      },
      { text: 'Captures and manages leads in real time through integrations with popular real estate tools.' },
      {
        text: "Visualises real estate metrics, manages property showings and surfaces reporting insight through monday.com's customisable dashboards.",
      },
    ],
  },
  templateSpec: {
    eyebrow: '// Template anatomy',
    heading: 'What you can do on the monday.com',
    headingAccent: 'real estate CRM template',
    lead: 'The template ships configured. These are the parts your team will actually touch in week one.',
    panels: [
      {
        title: 'Column types',
        lead: 'The board mirrors how your agency already tracks a deal, without a developer.',
        bullets: [
          'Drag and drop 30+ columns to customise workflows.',
          'Add status columns and due dates to keep everything in context.',
        ],
        chipsLabel: 'Customise the board with',
        chips: ['People', 'Status', 'Location', 'Numbers', 'Files', 'Email'],
      },
      {
        title: 'Views',
        lead: 'The same records, six ways. Switching view never rebuilds the board underneath.',
        chipsLabel: 'Available views',
        chips: ['Kanban', 'Timeline', 'Map', 'Gantt', 'Workload', 'Calendar'],
        note: 'For the monday.com real estate CRM template, teams love the Chart, Timeline and Map views.',
      },
      {
        title: 'Automations and integrations',
        groups: [
          {
            label: 'monday automations help real estate businesses:',
            bullets: [
              'Automatically send reminder emails when due dates arrive.',
              "Receive real-time notifications when a task's status changes.",
            ],
          },
          {
            label: 'monday.com integrations help property management by:',
            bullets: [
              'Letting you keep working with your existing real estate tools.',
              'Syncing due dates with Google Calendar.',
              'Sharing Dropbox files with your team instantly.',
            ],
          },
        ],
        note: 'Realtors on monday real estate CRM most often connect Gmail, Slack, Excel and OneDrive.',
      },
    ],
  },
}

const PROFESSIONAL_SERVICES: IndustrySections = {
  capabilityBlocks: {
    eyebrow: '// Professional services',
    heading: 'What you can do with monday CRM for',
    headingAccent: 'professional services',
    lead: 'Six things a services business gets out of monday CRM once it is configured around how the firm actually delivers work.',
    columns: 3,
    blocks: [
      {
        number: '01',
        title: 'Customisation and flexibility',
        lead: 'Customise monday CRM to your service business. With board templates and dashboards, you can:',
        points: [
          { text: 'Dispatch and schedule jobs.' },
          { text: 'Fulfil purchase orders for the services you offer.' },
          { text: 'Manage payments and billing information.' },
          { text: 'Run automations that generate leads.' },
          { text: 'Create, share and store documents.' },
        ],
      },
      {
        number: '02',
        title: 'Great visualisation',
        lead: '[Data visualisation on monday.com](/post/data-visualisation-on-monday-com) has always been its USP. With monday CRM you can:',
        points: [
          { text: 'Visualise jobs, pipelines, updates and tasks.' },
          { text: 'Use Kanban, Timeline, Map, Gantt Chart and Calendar views.' },
        ],
        note: 'Chart view shows job status — completed, stuck or started — across a specific month, date or time.',
      },
      {
        number: '03',
        title: 'Intuitive interface',
        lead: "monday CRM is an intuitive platform that needs no developer assistance. If it does feel complicated, Fruition's consultants help you:",
        points: [
          { text: 'Create workflows with drag-and-drop functions.' },
          { text: 'Customise visual boards and build them from pre-made templates.' },
          { text: 'Run change management across the team.' },
        ],
      },
      {
        number: '04',
        title: 'Dashboards on monday CRM',
        lead: 'Shifting to monday CRM puts every important number on a single custom dashboard. It helps you:',
        points: [
          { text: 'Increase visibility into jobs and team performance.' },
          { text: 'See payment status across all projects.' },
          { text: 'Run reports on a high-level view of every business operation.' },
          { text: 'Use the numbers widget to check budget summaries and employee hours.' },
        ],
      },
      {
        number: '05',
        title: 'Automations',
        lead: '[Automations on monday.com](/post/monday-com-automations) build smart workflows that lift productivity. In a service business they:',
        points: [
          { text: 'Automate the repetitive processes that slow you down.' },
          { text: 'Free the team to focus on retaining and engaging customers.' },
          { text: 'Send alerts and reminders to employees about project updates.' },
          { text: 'Notify users when a job is complete.' },
          { text: 'Send personalised emails to clients and leads.' },
        ],
      },
      {
        number: '06',
        title: 'monday Sales CRM integrations',
        lead: 'The platform comes with [200+ integrations](/post/monday-com-crm-integrations), though only a handful genuinely move the needle for a services firm. Connect your account with:',
        points: [
          { text: 'Google Calendar' },
          { text: 'Slack' },
          { text: 'Salesforce' },
          { text: 'Gmail' },
          { text: 'Zapier' },
        ],
        note: 'Fruition sets these up without data loss and writes the custom automation recipes that streamline your sales pipeline.',
      },
    ],
  },
}

const MANUFACTURING: IndustrySections = {
  benefitLedger: {
    eyebrow: '// monday CRM for manufacturing',
    heading: 'The benefits of monday CRM for',
    headingAccent: 'manufacturing',
    intro:
      'What changes when sales, production and service data stop living in separate systems.',
    items: [
      {
        label: 'Sales performance',
        text: 'Centralises customer interactions and information in one repository, making it easier to identify customers, close deals, retain leads and upsell.',
      },
      {
        label: 'Supply chain visibility',
        text: 'Surfaces inventory management, operations, distribution chains and order processing, so you can manage production chains and raw material supply.',
      },
      {
        label: 'Customer satisfaction',
        text: 'A 360-degree view of customer interactions shows you their preferences, which improves service, loyalty and engagement.',
      },
      {
        label: 'Sales productivity',
        text: 'Automates repetitive tasks — data entry, reporting, follow-ups — so the team can focus on high-value activities.',
      },
      {
        label: 'Operational efficiency',
        text: 'Better data, lead and pipeline management means less duplication, clearer pipeline visibility, cross-functional collaboration and access to the right customer data.',
      },
      {
        label: 'Quality issue tracking',
        text: 'Tracks quality issues so you can address production bottlenecks efficiently and cut defective products out of inventory.',
      },
    ],
    footnote:
      'It also predicts demand from past metrics, reports and analytics — so you can see what sales and marketing look like next quarter for inventory management and production planning.',
  },
}

/** Keyed by page slug, matching the route segment and the Sanity page key. */
export const INDUSTRY_SECTIONS: Record<string, IndustrySections> = {
  'monday-for-construction': CONSTRUCTION,
  'monday-for-real-estate': REAL_ESTATE,
  'monday-for-professional-services': PROFESSIONAL_SERVICES,
  'monday-for-manufacturing': MANUFACTURING,
}

/** Empty object for pages with no long-form sections, so callers can destructure. */
export function getIndustrySections(slug?: string): IndustrySections {
  return (slug && INDUSTRY_SECTIONS[slug]) || {}
}
