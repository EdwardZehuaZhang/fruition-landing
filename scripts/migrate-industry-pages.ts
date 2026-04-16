import { writeClient } from './sanity-client'

const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'
const MONDAY_CRM = 'https://monday.com/lang/en-au/crm'

const imageCache = new Map<string, any>()

async function uploadImageFromUrl(url: string, filename: string) {
  if (imageCache.has(url)) return imageCache.get(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || undefined
  const asset = await writeClient.assets.upload('image', buffer, { filename, contentType })
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  imageCache.set(url, ref)
  console.log(`  uploaded ${filename}`)
  return ref
}

function extensionOf(url: string): string {
  const m = url.match(/\.(png|jpe?g|webp|gif|avif|svg)(\?|~|$)/i)
  return m ? `.${m[1].toLowerCase()}` : '.png'
}

type CapabilityCard = { emoji: string; title: string; description: string }
type Bullet = { emoji: string; text: string }
type ComparisonItem = { number: string; title: string; description?: string; bullets?: Bullet[] }
type ComparisonTab = { label: string; items: ComparisonItem[] }
type MethodologyStep = { number: string; title: string; description: string }
type FaqPair = { question: string; answer: string }
type FaqTab = { label: string; items: FaqPair[] }
type Stat = { value: string; label: string }
type SolutionCard = {
  eyebrow?: string
  heading: string
  body: string
  ctaLabel?: string
  ctaUrl?: string
  imageUrl?: string
}

interface IndustryPage {
  slug: string
  title: string
  industryName: string
  heroImageUrl?: string
  heroHeading: string
  heroSubheading: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  seoTitle: string
  seoDescription: string
  capabilitiesHeading?: string
  capabilitiesCards?: CapabilityCard[]
  comparisonHeading?: string
  comparisonSubheading?: string
  comparisonTabs?: ComparisonTab[]
  methodologyHeading?: string
  methodologySteps?: MethodologyStep[]
  solutionCards?: SolutionCard[]
  calendlyHeading?: string
  calendlySubheading?: string
  faqTabs?: FaqTab[]
  joinHeadingPart1?: string
  joinHeadingAccent?: string
  joinHeadingPart2?: string
  joinSubheading?: string
  joinStats?: Stat[]
  joinFootnote?: string
}

// Shared FAQ that appears across most industry pages
const SHARED_FAQ_GENERIC: FaqTab = {
  label: 'monday.com FAQs',
  items: [
    { question: 'Does monday.com have a CRM?', answer: 'Yes — monday.com CRM is a flexible and highly customisable cloud-based CRM platform suitable for businesses of all sizes.' },
    { question: 'Does monday.com have task management?', answer: "Yes. Trial monday Work Management and discover how efficiently you can manage your teams' to-do list, deadlines and dependencies." },
    { question: 'Why is monday.com so successful?', answer: 'Highly customisable workflows and automations, an extremely user-friendly interface, a visual/agile/scalable design, and versatility — projects, CRM, ad campaigns, bug tracking and video production all in one tool.' },
    { question: 'What exactly does monday.com do?', answer: "monday.com is one of the most versatile work platforms on the market. Use it to manage projects, run a CRM, manage ad campaigns, track bugs, and manage video production — all on a single platform." },
  ],
}

const SHARED_FORRESTER_STATS: Stat[] = [
  { value: '288%', label: 'ROI (Forrester)' },
  { value: '15,600', label: 'hours saved' },
  { value: '50%', label: 'meeting reduction' },
  { value: '$489,794', label: 'net value' },
]

const SHARED_AGENCY_STATS: Stat[] = [
  { value: '10+', label: 'years experience' },
  { value: '1,050+', label: 'projects completed' },
  { value: '500+', label: 'satisfied clients' },
]

const pages: IndustryPage[] = [
  // ── Manufacturing ─────────────────────────────────────────────────
  {
    slug: 'monday-for-manufacturing',
    title: 'monday.com for Manufacturing',
    industryName: 'Manufacturing',
    heroImageUrl: 'https://static.wixstatic.com/media/a280a5_65b170f5246d4048961efef01c644720~mv2.png',
    heroHeading: 'monday.com Manufacturing Implementation Partner',
    heroSubheading:
      'Connect shop floor to top floor with a monday.com manufacturing platform that streamlines production planning, quality control, inventory and supplier coordination. Local monday.com manufacturing expertise from Fruition.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com for Manufacturing | Production, Quality & Inventory | Fruition',
    seoDescription:
      'Fruition implements monday.com for manufacturers — production planning, quality control, OEE tracking, supplier coordination and ERP/MES integration.',
    capabilitiesHeading: 'Why manufacturing teams are implementing monday.com',
    capabilitiesCards: [
      { emoji: '📅', title: 'Production Planning', description: 'Streamline manufacturing logistics with efficient scheduling and management tools.' },
      { emoji: '✅', title: 'Quality Control', description: 'Implement robust quality assurance workflows that ensure consistent product excellence.' },
      { emoji: '📦', title: 'Inventory Management', description: 'Track stock levels precisely and automate replenishment to prevent stockouts.' },
      { emoji: '🗂️', title: 'Resource Allocation', description: 'Maximise efficiency with smart resource distribution across production lines.' },
      { emoji: '🚚', title: 'Supplier Coordination', description: 'Manage vendor relationships and track material deliveries and procurement seamlessly.' },
      { emoji: '🦺', title: 'Health & Safety', description: 'Maintain compliance with built-in OHS regulation tracking features.' },
      { emoji: '🔌', title: 'System Integration', description: 'Connect smoothly with your existing ERP and MES software ecosystem.' },
      { emoji: '🤖', title: 'Automation Capabilities', description: 'Reduce manual tasks through intelligent process automation.' },
      { emoji: '📊', title: 'Custom Analytics', description: 'Generate insightful reports with manufacturing-specific metrics.' },
    ],
    comparisonHeading: 'Key manufacturing management features',
    comparisonSubheading: 'A hands-on toolkit for production, quality, supply chain and shop-floor analytics.',
    comparisonTabs: [
      {
        label: 'Production',
        items: [
          { number: '01', title: '📅 Production Management', bullets: [
            { emoji: '📅', text: 'Visual production scheduling with drag-and-drop timeline views' },
            { emoji: '🔄', text: 'Real-time work order tracking and status updates' },
            { emoji: '⚡', text: 'Automated workflow triggers for production milestones' },
            { emoji: '👥', text: 'Capacity planning with resource availability dashboards' },
          ]},
          { number: '02', title: '✅ Quality & Compliance', bullets: [
            { emoji: '✔️', text: 'Digital quality inspection checklists and approval workflows' },
            { emoji: '📋', text: 'Non-conformance tracking with corrective action assignments' },
            { emoji: '🦺', text: 'Safety incident reporting and compliance documentation' },
            { emoji: '📈', text: 'Quality metrics tracking with trend analysis' },
          ]},
          { number: '03', title: '📦 Inventory & Supply Chain', bullets: [
            { emoji: '📦', text: 'Real-time inventory levels with automated reorder alerts' },
            { emoji: '🚚', text: 'Supplier delivery tracking and performance monitoring' },
            { emoji: '🔍', text: 'Material traceability throughout the production process' },
            { emoji: '💰', text: 'Purchase order management with approval workflows' },
          ]},
          { number: '04', title: '📊 Analytics & Reporting', bullets: [
            { emoji: '📊', text: 'Manufacturing KPI dashboards with real-time data' },
            { emoji: '🎯', text: 'OEE tracking with downtime analysis capabilities' },
            { emoji: '📱', text: 'Mobile-friendly reports for shop floor managers' },
          ]},
        ],
      },
      {
        label: 'Project Lifecycle',
        items: [
          { number: '01', title: '📊 Sales & Production Planning', description: 'Centralise RFQs, product specifications and production forecasts in collaborative boards. Track approval cycles, assign engineering reviews and automate notifications to move from quote to production faster.' },
          { number: '02', title: '🧠 Design & Engineering Coordination', description: 'Manage product designs, revisions and change orders with structured workflows. Visual timelines and dependency tracking ensure engineering, procurement and production stay aligned.' },
          { number: '03', title: '🏭 Production & Shop Floor Execution', description: 'Monitor production schedules, track labor hours and manage work orders in real time. Teams update task status from the floor while managers oversee progress through automated dashboards.' },
          { number: '04', title: '✅ Quality Control & Compliance', description: 'Organise inspections, compliance documentation and quality checklists in standardised workflows. Automate alerts for defects, non-conformances and corrective actions to reduce costly rework.' },
          { number: '05', title: '🚚 Delivery & After-Sales Support', description: 'Coordinate shipments, track order fulfillment and manage post-production support. Maintain service logs, warranty tracking and performance history.' },
        ],
      },
    ],
    methodologyHeading: 'Manufacturing technology consultant methodology',
    methodologySteps: [
      { number: '01', title: 'Process Discovery → Business Process Audit', description: 'Map your existing production workflows against manufacturing industry benchmarks, analysing bottlenecks and efficiency gaps that prevent your facility from achieving optimal throughput and scaling operations.' },
      { number: '02', title: 'Technical Architecture → System Integration Scope', description: 'Reveal the hidden potential in your current manufacturing tech stack and identify precise integration points where monday.com transforms fragmented production processes into seamless workflows that connect shop floor to top floor.' },
      { number: '03', title: 'Solution Design → Workflow & Integration Implementation', description: 'Implement the perfect balance between automated production system sophistication and operator adoption, ensuring your solution scales with your manufacturing expertise and production demands.' },
      { number: '04', title: 'Efficiency Impact → ROI Opportunity Analysis', description: 'Quantify potential efficiency gains across your production operations and pinpoint where automation and lean optimisation will deliver the highest return through reduced downtime and increased OEE.' },
      { number: '05', title: 'Change Readiness → Adoption Strategy Planning', description: 'Measure manufacturing team readiness and craft a tailored adoption strategy, turning potential resistance from production staff and supervisors into enthusiastic adoption across all shifts.' },
    ],
    calendlyHeading: 'Schedule a 30-min call with a monday.com manufacturing expert today',
    calendlySubheading:
      'From initial process discovery to full system adoption for your monday.com manufacturing solution, our proven methodology ensures seamless digital transformation that empowers your team and drives sustainable operational efficiency.',
    faqTabs: [
      {
        label: 'Manufacturing FAQs',
        items: [
          { question: 'Can monday.com be used for manufacturing operations?', answer: 'Yes. monday.com handles production scheduling, work-order tracking, quality control, OEE monitoring, inventory and supplier coordination — and it integrates with the ERP/MES tools your factory already runs on.' },
          { question: 'Does monday.com have manufacturing project templates?', answer: 'Yes. The Template Center includes manufacturing templates for production planning, quality, inventory and procurement. Fruition extends these with industry-specific configurations for your operation.' },
          ...SHARED_FAQ_GENERIC.items,
        ],
      },
    ],
    joinHeadingPart1: 'The economic impact of ',
    joinHeadingAccent: 'monday.com in manufacturing',
    joinHeadingPart2: '',
    joinSubheading: 'Independent Forrester research on the platform powering manufacturers worldwide.',
    joinStats: SHARED_FORRESTER_STATS,
    joinFootnote: 'Source: Forrester TEI study of monday.com.',
  },

  // ── Retail ────────────────────────────────────────────────────────
  {
    slug: 'monday-for-retail',
    title: 'monday.com for Retail & eCommerce',
    industryName: 'Retail & eCommerce',
    heroImageUrl: 'https://static.wixstatic.com/media/a280a5_5cd3e84b66ba4d63bc1aceb0091ab5f6~mv2.png',
    heroHeading: 'monday.com for Retail & eCommerce Operations',
    heroSubheading:
      'We understand the critical challenges of managing store operations, supply chain efficiency and delivering consistent customer experiences across every touchpoint. Fruition has helped 500+ retail businesses transform with monday.com.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com for Retail & eCommerce | Multi-Store Operations | Fruition',
    seoDescription:
      'Fruition implements monday.com for retailers and eCommerce operators — inventory, multi-store ops, marketing and POS/Shopify integrations.',
    capabilitiesHeading: 'Why retail leaders choose monday.com',
    capabilitiesCards: [
      { emoji: '🛒', title: 'Faster Time to Market', description: 'Get a comprehensive view of the entire supply chain to spot blockers, manage vendor communications, track inventory and more — on a platform staff actually want to use.' },
      { emoji: '📣', title: 'Boost Awareness & Demand', description: "A bird's-eye view of all marketing campaigns and creative production. Easily oversee budget, ROI goals, spend per channel and more." },
      { emoji: '⚙️', title: 'Improve Operational Efficiency', description: 'Manage every aspect of new store openings, from inventory and hiring to end-to-end franchise lifecycle management.' },
    ],
    comparisonHeading: 'Key retail features built into monday.com',
    comparisonSubheading: 'From shop floor to corporate dashboards — one platform across inventory, sales, staff and marketing.',
    comparisonTabs: [
      {
        label: 'Retail Features',
        items: [
          { number: '01', title: '📦 Inventory & Stock Management', bullets: [
            { emoji: '📦', text: 'Real-time updates on stock levels, SKU details and reorder points' },
            { emoji: '🔔', text: 'Notify your team or trigger purchase orders when inventory runs low' },
            { emoji: '🏷️', text: 'Streamline stock intake and updates' },
          ]},
          { number: '02', title: '🛒 Sales & Order Management', bullets: [
            { emoji: '🛒', text: 'Manage online and in-store sales in one dashboard' },
            { emoji: '⚡', text: 'Update fulfillment stages — Processing → Shipped → Delivered' },
            { emoji: '🌐', text: 'Connect to Shopify, WooCommerce or POS systems to sync sales data' },
          ]},
          { number: '03', title: '📅 Employee Scheduling & Tasks', bullets: [
            { emoji: '📅', text: 'Assign and manage store shifts for staff' },
            { emoji: '📋', text: 'Notify employees about daily priorities, restocking and shift hours' },
            { emoji: '⏱️', text: 'Monitor staff hours and optimise labor allocation' },
          ]},
          { number: '04', title: '🤝 Vendor & Supplier Coordination', bullets: [
            { emoji: '🤝', text: 'Track supplier contacts, contracts and performance' },
            { emoji: '📝', text: 'Trigger notifications or approvals when restocks are needed' },
            { emoji: '💬', text: 'Connect with Slack or email to streamline supplier communication' },
          ]},
          { number: '05', title: '🎯 Marketing & Promotions', bullets: [
            { emoji: '🎯', text: 'Organise seasonal promotions, product launches and in-store events' },
            { emoji: '🖼️', text: 'Manage creative materials and marketing timelines in one place' },
            { emoji: '📊', text: 'Visualise promotion ROI or traffic generated from campaigns' },
          ]},
          { number: '06', title: '🏬 Multi-Store Operations', bullets: [
            { emoji: '🏬', text: 'Compare KPIs like sales, foot traffic and inventory across locations' },
            { emoji: '📋', text: 'Ensure consistent operational processes across all branches' },
            { emoji: '📈', text: 'Generate daily, weekly or monthly performance reports' },
          ]},
          { number: '07', title: '📊 Data Visualization & Reporting', bullets: [
            { emoji: '📊', text: 'Combine sales, inventory, staffing and marketing KPIs in one view' },
            { emoji: '🔍', text: 'Identify best-sellers, underperforming stores and seasonal patterns' },
            { emoji: '📤', text: 'Quickly share performance insights with stakeholders' },
          ]},
          { number: '08', title: '📱 Mobile & On-the-Floor Usability', bullets: [
            { emoji: '📱', text: 'Staff can update inventory or check schedules from the sales floor' },
            { emoji: '🔢', text: 'Speeds up stocktaking and receiving shipments' },
            { emoji: '📲', text: 'Instant alerts for low stock, urgent tasks or schedule changes' },
          ]},
        ],
      },
    ],
    methodologyHeading: "Our consultants' approach for retail",
    methodologySteps: [
      { number: '01', title: 'Store Operations Discovery → Retail Workflow Audit', description: 'We dive into your day-to-day retail operations — inventory, staff scheduling, sales tracking — and compare them against industry best practices to uncover bottlenecks and operational inefficiencies.' },
      { number: '02', title: 'Retail Tech Architecture → System & POS Integration', description: 'Analyse current tools — POS, eCommerce, inventory, staffing — and identify how monday.com can centralise these fragmented systems with automated workflows that connect online and in-store operations.' },
      { number: '03', title: 'Solution Design → Automated Workflow & Integration', description: 'Craft a tailored solution that automates stock alerts, shift notifications and vendor updates — designed to grow with your locations, sales and operations.' },
      { number: '04', title: 'Efficiency Insights → Retail ROI Analysis', description: 'Quantify exactly how much time and effort you save by reducing manual processes — reordering, shifts, promotions — so you see the direct impact on sales, labor efficiency and profitability.' },
      { number: '05', title: 'Change Readiness → Adoption Strategy Planning', description: "Measure your retail organisation's readiness and craft a tailored adoption strategy — turning resistance from store teams and operations managers into enthusiastic adoption across all channels." },
    ],
    solutionCards: [
      {
        eyebrow: 'Case Study',
        heading: 'FARFETCH: monday.com Work OS as the global centralising platform',
        body:
          "FARFETCH connects 1,400+ luxury brands, boutiques and department stores with customers in 190+ countries. Their result with monday.com: 6x ROI, $118,019 saved per month, 3,507 hours saved per month. Tati Yanchologo, Global Senior Planning Manager: 'Monday.com Work OS has become the global centralising platform for our growing organisation.'",
        imageUrl: 'https://static.wixstatic.com/media/00f73d_9ee5486dd7404e8197e4bf4f9da64f7d~mv2.jpg',
      },
      {
        eyebrow: 'Merchandising & Marketing',
        heading: 'Optimise your merchandising and marketing processes',
        body:
          'Customers expect retailers to quickly adapt to their needs. With monday.com, merchandising and marketing teams work together efficiently to promote new products, create awareness and demand, and generate new revenue streams.',
        imageUrl: 'https://static.wixstatic.com/media/a280a5_dfc8bdb7a7e948da8760e71811c3fa03~mv2.png',
      },
    ],
    calendlyHeading: 'Schedule a 30-min call with a monday.com retail expert',
    calendlySubheading:
      'From inventory and POS integration to multi-store dashboards — talk to a Fruition consultant about your retail rollout.',
    faqTabs: [
      {
        label: 'Retail FAQs',
        items: [
          { question: 'How can monday.com help retail businesses manage inventory?', answer: 'monday.com tracks stock levels in real time across multiple locations and automates low-stock alerts. Retail inventory boards visualise stock across stores, prevent stockouts and streamline multi-location operations.' },
          { question: 'Can monday.com integrate with retail POS and eCommerce platforms?', answer: 'Yes. monday.com integrates with Shopify, WooCommerce, Square and other POS systems — syncing sales data, inventory and orders automatically into a centralised retail operations hub.' },
          { question: 'How does monday.com improve team collaboration for retail stores?', answer: 'monday.com gives store managers and staff a shared workspace for tasks, schedules and inventory updates. Instant notifications for low stock, shift changes and daily priorities keep teams aligned.' },
          { question: 'Can monday.com help manage multiple retail locations?', answer: 'Yes. Custom dashboards track sales performance, inventory and staffing needs across all your stores — letting managers standardise workflows and spot trends across the chain.' },
          { question: 'Is monday.com suitable for small retail businesses or only large chains?', answer: 'Both. Smaller stores use simple boards for tasks and inventory; larger retailers integrate POS, automate workflows and manage multi-store operations on the same platform.' },
          { question: 'How can monday.com help with retail promotions and seasonal campaigns?', answer: 'Plan and track seasonal promotions, store events and marketing campaigns. Coordinate marketing materials, assign tasks and measure campaign performance to identify which promotions drive the most sales.' },
          { question: 'Does monday.com automate repetitive retail tasks?', answer: 'Yes. Retail automations handle low-stock alerts, shift reminders, purchase order notifications and task assignments — reducing manual work and keeping critical processes on track.' },
          { question: 'Is monday.com mobile-friendly for retail teams on the floor?', answer: 'Yes. Staff can update inventory, complete checklists and receive instant notifications from the sales floor. Managers can approve tasks and monitor performance on the go.' },
        ],
      },
    ],
    joinHeadingPart1: 'A decade of ',
    joinHeadingAccent: 'retail delivery',
    joinHeadingPart2: '',
    joinSubheading: "Numbers behind Fruition's retail and eCommerce monday.com practice.",
    joinStats: SHARED_AGENCY_STATS,
  },

  // ── Professional Services ─────────────────────────────────────────
  {
    slug: 'monday-for-professional-services',
    title: 'monday.com for Professional Services & Agencies',
    industryName: 'Professional Services & Agencies',
    heroImageUrl: 'https://static.wixstatic.com/media/39b8ef_717b981bbab242959fa2de14ce550020~mv2.png',
    heroHeading: 'monday.com for Professional Services & Agencies',
    heroSubheading:
      'Being a service-based business ourselves, we understand the key challenges of managing resource capacity, profitability and project delivery excellence. Fruition has helped transform 500+ businesses with our monday.com professional services solution.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com for Professional Services & Agencies | Fruition',
    seoDescription:
      'Fruition implements monday.com for professional services and agencies — CRM, quoting, project delivery, time tracking and resource management.',
    capabilitiesHeading: 'Run your services business on one platform',
    capabilitiesCards: [
      { emoji: '🤝', title: 'CRM Sales Process', description: "Transform your agency's pipeline into a revenue-generating engine. Track leads, opportunities and client relationships in one intuitive platform." },
      { emoji: '📨', title: 'Quoting & Ticketing', description: 'Speed up your quote-to-cash cycle with automated quoting and ticketing. Generate professional proposals instantly while managing client requests efficiently.' },
      { emoji: '💰', title: 'Finance Workflows', description: 'Streamline financial operations end to end — from contract generation to payment tracking — turning complex processes into smooth, error-free workflows.' },
      { emoji: '📋', title: 'Project Management', description: "Deliver client projects on time and within budget with monday.com's visual project management tools — complete control over timelines, resources and deliverables." },
      { emoji: '⏱️', title: 'Time & Resources', description: 'Track billable hours, monitor utilisation rates and ensure optimal resource distribution across client projects.' },
      { emoji: '📊', title: 'Analytics & Reports', description: 'Make data-driven decisions with custom dashboards, client reporting, revenue analytics and ROI measurement.' },
    ],
    comparisonHeading: 'Capabilities for every services workflow',
    comparisonSubheading: 'Pick a workflow to see how monday.com handles it for an agency or services firm.',
    comparisonTabs: [
      {
        label: 'CRM & Sales',
        items: [
          { number: '01', title: '📊 Visual pipeline', description: 'Custom deal stages, automated lead scoring and sales forecasting in one view.' },
          { number: '02', title: '📧 Email integration', description: 'Sync conversations to deals; track every touchpoint in the customer record.' },
          { number: '03', title: '🤝 Client relationship tracking', description: 'See the entire history with each client across sales, delivery and finance.' },
        ],
      },
      {
        label: 'Quoting & Tickets',
        items: [
          { number: '01', title: '🤖 Quote automation', description: 'Generate proposals instantly from a template library; route through approval workflows.' },
          { number: '02', title: '⏱️ SLA tracking', description: 'Prioritise tickets and track SLAs with automated escalation triggers.' },
          { number: '03', title: '🔐 Client portal access', description: 'Give clients secure visibility into ticket status and project progress.' },
        ],
      },
      {
        label: 'Project Delivery',
        items: [
          { number: '01', title: '📅 Timeline visualisation', description: 'Gantt views with task dependencies, critical path and project tracking.' },
          { number: '02', title: '⚖️ Resource allocation', description: 'Match the right people to the right projects, balance workloads and forecast capacity.' },
          { number: '03', title: '📁 File sharing & milestones', description: 'Centralise client files, track milestones and collaborate without leaving monday.com.' },
        ],
      },
      {
        label: 'Time & Finance',
        items: [
          { number: '01', title: '⏱️ Time tracking', description: 'Track billable and non-billable hours per project, client and team member.' },
          { number: '02', title: '📈 Profitability analysis', description: 'See real-time project margins; spot scope creep before it eats into profit.' },
          { number: '03', title: '🧾 Invoice generation', description: 'Convert tracked time into invoices and track payments end to end.' },
        ],
      },
    ],
    calendlyHeading: 'Schedule your call with a monday.com services consultant today',
    calendlySubheading:
      'Book a session with our specialists to explore how a tailored professional services solution can streamline workflows, enhance client delivery and optimise resource management. Plus, get a free 4-week extended monday.com trial.',
    faqTabs: [SHARED_FAQ_GENERIC],
    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ services firms',
    joinHeadingPart2: ' running on monday.com with Fruition',
    joinSubheading: 'Numbers behind our services-industry practice.',
    joinStats: SHARED_AGENCY_STATS,
  },

  // ── Government ────────────────────────────────────────────────────
  {
    slug: 'monday-for-government',
    title: 'monday.com for Government',
    industryName: 'Government',
    heroImageUrl: 'https://static.wixstatic.com/media/00f73d_c69361d67fad4b51a818e451d7f96843~mv2.png',
    heroHeading: 'monday.com for Government',
    heroSubheading:
      'Streamline government operations with our monday.com consultants. Empower your agency with modern, secure, flexible project management tools that improve efficiency, collaboration and transparency across the public sector.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com for Government | Public Sector Implementation | Fruition',
    seoDescription:
      'Fruition implements monday.com for government and public sector agencies — case management, compliance, workforce continuity and citizen service delivery.',
    capabilitiesHeading: 'Why the public sector chooses monday.com',
    capabilitiesCards: [
      { emoji: '🚀', title: 'Accelerate Digital Transformation', description: 'Modernise without IT bottlenecks. Tackle budget constraints, workforce shortages and demands for transparency without overloading already-stretched IT teams.' },
      { emoji: '👥', title: 'Workforce Resilience During Transitions', description: 'Centralise processes, workflows and decision protocols. Reduce new employee onboarding from months to weeks — even through the "silver tsunami" of retirements.' },
      { emoji: '📞', title: 'Citizen Service Delivery', description: 'Enhance public responsiveness with automated citizen request tracking, case management workflows, real-time status updates and transparent service portals.' },
      { emoji: '⚖️', title: 'Regulatory Compliance Made Simple', description: 'Automated compliance checkpoints flag missing documentation before audit deadlines. Pre-built templates with built-in approval workflows and audit-ready trails.' },
      { emoji: '💰', title: 'Budget Management & Transparency', description: 'Real-time financial tracking with AI-powered forecasting. Proactive reallocation, transparent expenditure reporting and stakeholder dashboards.' },
      { emoji: '🔒', title: 'Cybersecurity & Data Protection', description: 'Enterprise-grade security: role-based access, end-to-end encryption, automated threat detection, SOC 2 Type II and FedRAMP-aligned controls.' },
    ],
    comparisonHeading: 'Top management features for government agencies',
    comparisonSubheading: 'How monday.com tackles the four toughest problems in modern public-sector operations.',
    comparisonTabs: [
      {
        label: 'Public Sector Features',
        items: [
          { number: '01', title: '🎯 Enhanced Project Management', bullets: [
            { emoji: '🎯', text: 'Centralised dashboard view of all projects, deadlines and dependencies across departments' },
            { emoji: '⚡', text: 'Automated workflow triggers eliminating manual handoffs, reducing delays by 40%' },
            { emoji: '📊', text: 'Real-time progress tracking with visual timelines for stakeholder reporting' },
          ]},
          { number: '02', title: '✅ Regulatory Compliance Made Simple', bullets: [
            { emoji: '✅', text: 'Automated compliance checkpoints flagging missing documentation before audits' },
            { emoji: '📋', text: 'Pre-built templates with built-in approval workflows' },
            { emoji: '🔒', text: 'Audit-ready documentation trails capturing all changes and approvals' },
          ]},
          { number: '03', title: '👥 Workforce Resilience', bullets: [
            { emoji: '📚', text: 'Digital knowledge capture preserving institutional memory in searchable formats' },
            { emoji: '🚀', text: 'Dramatically reduced onboarding time through documented procedures' },
            { emoji: '🔄', text: 'Seamless succession planning with automated workflow transfers' },
          ]},
          { number: '04', title: '📞 Citizen Service Delivery', bullets: [
            { emoji: '📞', text: 'Automated citizen request tracking with real-time status' },
            { emoji: '⏱️', text: 'Improved response times through prioritised case management' },
            { emoji: '🌐', text: 'Public-facing status portals for permit processing transparency' },
          ]},
        ],
      },
      {
        label: 'AI-Powered Operations',
        items: [
          { number: '01', title: '📊 Predictive Analytics', description: 'Identify risks before they impact progress using historical data analysis.' },
          { number: '02', title: '⚡ Resource Optimisation', description: 'AI-driven scheduling prevents bottlenecks and optimises allocation.' },
          { number: '03', title: '🛡️ Compliance Monitoring', description: 'Automated regulatory tracking flags issues before escalation.' },
          { number: '04', title: '🔒 Data Security & Ethical AI', description: 'Encryption protocols, federal cybersecurity standards, transparent algorithms with human oversight, intuitive interface requiring minimal training.' },
        ],
      },
    ],
    methodologyHeading: 'How we deploy monday.com in public sector',
    methodologySteps: [
      { number: '01', title: 'Operational Assessment → Government Workflow Audit', description: 'Review daily agency operations — case management, scheduling, document processing, citizen tracking — against public sector best practices to identify bottlenecks, compliance risks and inefficiencies.' },
      { number: '02', title: 'Technology Landscape → System Integration Scope', description: 'Analyse current government systems (case management tools, ERP, citizen portals) and identify how monday.com serves as the central hub unifying disconnected platforms.' },
      { number: '03', title: 'Solution Design → Automated Workflow Implementation', description: 'Develop customised workflows automating approvals, notifications, document routing and inter-departmental updates, scaled for agency needs while reducing manual workload.' },
      { number: '04', title: 'Performance Insights → Operational Efficiency Analysis', description: 'Measure time, cost and resource savings from workflow automation and centralised operations — visibility into service delivery, staff efficiency and compliance.' },
      { number: '05', title: 'Public Impact → ROI Assessment', description: 'Quantify public impact (faster permits, reduced response times, citizen satisfaction) and demonstrate direct ROI for data-driven leadership decisions.' },
    ],
    calendlyHeading: 'Schedule a 30-min call with a monday.com government expert',
    calendlySubheading:
      'From compliance and case management to citizen service portals — talk to a Fruition consultant about modernising your agency.',
    faqTabs: [SHARED_FAQ_GENERIC],
    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ organisations',
    joinHeadingPart2: ' running on monday.com with Fruition',
    joinSubheading: 'Including public sector agencies modernising their operations.',
    joinStats: SHARED_AGENCY_STATS,
  },

  // ── Marketing ─────────────────────────────────────────────────────
  {
    slug: 'monday-for-marketing',
    title: 'monday.com for Marketing & Creative',
    industryName: 'Marketing & Creative',
    heroImageUrl: 'https://static.wixstatic.com/media/00f73d_f4e943c4451341509d70c44e3c521202~mv2.png',
    heroHeading: 'monday.com Marketing & Creative Implementation Partner',
    heroSubheading:
      'We understand the critical challenges of managing campaign workflows, creative asset production and delivering consistent brand experiences across every channel and touchpoint.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com for Marketing & Creative | Campaigns, Approvals, Assets | Fruition',
    seoDescription:
      'Fruition implements monday.com for marketing and creative teams — campaigns, content calendars, proofing/approval, asset management and ad reporting.',
    capabilitiesHeading: 'Why marketing and creative teams choose monday.com',
    capabilitiesCards: [
      { emoji: '🎯', title: 'From Idea to Delivery', description: 'Set goals and strategy, plan tasks and resources, oversee due dates, deliver on time and within budget — and measure marketing impact.' },
      { emoji: '📣', title: 'Run Efficient Campaigns', description: "Keep stakeholders aligned, ensure budgets stay on track, and maintain full visibility of campaign performance — all from one tool." },
      { emoji: '✅', title: 'Simplify Approval Processes', description: 'Automate key parts of the approval process — eliminating frequent checkups, emails and update meetings — and save time for creative work.' },
    ],
    comparisonHeading: 'Key marketing & creative features',
    comparisonSubheading: 'A toolkit purpose-built for proofing, asset management and campaign execution.',
    comparisonTabs: [
      {
        label: 'Marketing Features',
        items: [
          { number: '01', title: '📝 Proofing and Approval', description: 'Streamline review and approval directly inside monday.com with the PageProof app — any file type.' },
          { number: '02', title: '💬 Annotations and Live Feedback', description: 'Shorten feedback loops with contextual annotations directly on files; communicate via updates and notifications.' },
          { number: '03', title: '📁 File Versioning', description: 'Track files connected to tasks and projects from latest to oldest. Add and delete versions, preview, download and annotate for quick feedback.' },
          { number: '04', title: '📊 Robust Gantt for Campaign Planning', description: 'Plan and monitor marketing work, from campaigns to complex projects, with robust Gantt charts.' },
          { number: '05', title: '⚙️ Marketing Automations', description: 'Automate repetitive marketing work with customisable automations to free time for the work that matters.' },
          { number: '06', title: '🗂️ Asset Management', description: 'Store, organise and share all marketing digital assets in one centralised location.' },
        ],
      },
      {
        label: 'Use Cases & Results',
        items: [
          { number: '01', title: '✅ Proofing & Approval Workflow', description: '22% faster proofing & approval • 15% fewer errors • 49% increase in deliverables.' },
          { number: '02', title: '📣 Multi-Platform Campaign Management', description: '19% reduction in budget overspend • 14% faster launch time • 3x more campaigns launched.' },
          { number: '03', title: '🧠 Why the best use monday.com', description: 'Campaign management, content planning, social media, lead generation, analytics, collaboration, budget tracking, integrations and agile workflows — all on one platform.' },
        ],
      },
    ],
    methodologyHeading: 'Our marketing implementation methodology',
    methodologySteps: [
      { number: '01', title: 'Assess Your Needs', description: 'Identify your marketing goals, list specific requirements, and analyse current workflow challenges.' },
      { number: '02', title: 'Design Your Process', description: 'Create workflows tailored to your marketing tasks, map information flow and define roles and responsibilities.' },
      { number: '03', title: 'Set Up monday.com', description: 'Configure custom workflows, set up automations and permissions, and transfer existing data.' },
      { number: '04', title: 'Train Your Team', description: 'Teach staff how to use monday.com with hands-on practice and user documentation.' },
      { number: '05', title: 'Launch the System', description: 'Roll out monday.com with on-going support during the transition.' },
      { number: '06', title: 'Keep Improving', description: 'Monitor performance, make adjustments and provide ongoing support to optimise marketing operations.' },
    ],
    solutionCards: [
      {
        eyebrow: 'Content Operations',
        heading: 'Streamline content creation',
        body:
          'Streamline and optimise your marketing & creative work management — from idea to delivery — at scale, for maximum efficiency.',
        imageUrl: 'https://static.wixstatic.com/media/39b8ef_9fb25dc4cf5b4e67bde642128c47ac72~mv2.jpg',
      },
      {
        eyebrow: 'Reporting',
        heading: 'Seamless ad reporting',
        body:
          'Connect and report from your ads sources and other essential marketing data — all from monday.com dashboards.',
        imageUrl: 'https://static.wixstatic.com/media/39b8ef_4a79eb72f27045e0a7763e7adbe74606~mv2.jpg',
      },
    ],
    calendlyHeading: 'Schedule a 30-min call with a monday.com marketing expert',
    calendlySubheading:
      'From proofing & approval workflows to campaign dashboards — talk to a Fruition consultant about your marketing setup.',
    faqTabs: [SHARED_FAQ_GENERIC],
    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ marketing teams',
    joinHeadingPart2: ' running on monday.com with Fruition',
    joinSubheading: 'Including agencies, creative teams and in-house marketing departments.',
    joinStats: SHARED_AGENCY_STATS,
  },

  // ── Real Estate ───────────────────────────────────────────────────
  {
    slug: 'monday-for-real-estate',
    title: 'monday.com for Real Estate',
    industryName: 'Real Estate',
    heroImageUrl: 'https://static.wixstatic.com/media/a280a5_0e5ac53b3c354d5e8ffaec74b1a3ae26~mv2.png',
    heroHeading: 'monday.com Consultants for Real Estate',
    heroSubheading:
      'Local monday.com consultants for real estate in Australia, the United States and the United Kingdom. Manage property pipelines, agent coordination and client relationships from one platform.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_CRM,
    seoTitle: 'monday.com for Real Estate | Property, CRM & Transactions | Fruition',
    seoDescription:
      'Fruition implements monday.com for real estate teams — property listings, client CRM, transaction tracking, document storage and commission management.',
    capabilitiesHeading: 'Why monday.com works for real estate',
    capabilitiesCards: [
      { emoji: '🏠', title: 'Property & Listing Management', description: 'Organise property listings, rental applications and maintenance schedules to ensure every project runs smoothly.' },
      { emoji: '🤝', title: 'Client Relationship Management', description: 'Build stronger relationships with buyers and sellers by tracking interactions and personalising client experiences.' },
      { emoji: '💼', title: 'Transaction & Deal Tracking', description: 'Monitor every step of real estate transactions to guarantee timely, accurate and compliant deal completions.' },
      { emoji: '🎯', title: 'Lead Capture & Lead Management', description: 'Capture, organise and nurture leads from multiple sources to boost conversion rates and close deals faster.' },
      { emoji: '📂', title: 'Document Storage & Management', description: 'Store, share and manage contracts, disclosures and property files in one secure, centralised location.' },
      { emoji: '🔗', title: 'Integration & Connectivity Tools', description: 'Enable seamless communication and foster effective teamwork for successful marketing campaign execution.' },
      { emoji: '💰', title: 'Commission & Payment Tracking', description: 'Track commissions, payouts and financial records accurately to keep your sales team motivated and aligned.' },
      { emoji: '📊', title: 'Analytics & Performance Reports', description: 'Generate detailed reports on sales, listings and pipelines to identify trends and measure performance.' },
      { emoji: '📅', title: 'Open House & Showing Schedules', description: 'Plan, schedule and track property showings and open houses with clear visibility for your entire team.' },
    ],
    comparisonHeading: 'Use cases & results from real estate teams',
    comparisonSubheading: 'How monday.com transforms agencies — from boutique brokers to enterprise franchises.',
    comparisonTabs: [
      {
        label: 'Use Cases',
        items: [
          { number: '01', title: '🏆 Ray White case study', description: 'Ray White customised the CRM on top of monday.com Work OS to fit their day-to-day. Result: 1,250–3,000 automations and integrations and a 70% increase in efficiency. — Kyle Dorman, Department Manager – Operations.' },
          { number: '02', title: '✅ Proofing & Approval Workflow', description: '22% faster proofing & approval • 15% fewer errors • 49% increase in deliverables.' },
          { number: '03', title: '📣 Multi-Platform Campaign Management', description: '19% reduction in budget overspend • 14% faster launch time • 3x more campaigns launched.' },
        ],
      },
    ],
    methodologyHeading: 'Our real estate implementation approach',
    methodologySteps: [
      { number: '01', title: 'Needs Assessment', description: 'Assess your real estate needs and goals so we can align monday.com features with your specific requirements.' },
      { number: '02', title: 'Thorough Research', description: 'Compare CRM systems including monday.com — pricing, features, integrations — to confirm fit.' },
      { number: '03', title: 'Seamless Configuration', description: 'Configure custom workflows, automations and permissions so monday.com aligns perfectly with your real estate processes.' },
      { number: '04', title: 'Smooth Data Migration', description: 'Accurately transfer existing customer data so your real estate activities continue without interruption.' },
      { number: '05', title: 'Expert Training', description: 'Equip your team with the knowledge and skills they need to use monday.com effectively.' },
      { number: '06', title: 'System Rollout', description: 'Roll out monday.com to your team with hands-on go-live support.' },
      { number: '07', title: 'Ongoing Monitoring & Evaluation', description: 'Continuously monitor performance and evaluate effectiveness against your real estate goals.' },
    ],
    solutionCards: [
      {
        eyebrow: 'Property Operations',
        heading: 'Manage your real estate agency with one easy-to-use system',
        body:
          'From managing properties to leads to any task in between — optimise day-to-day operations on a single platform.',
        imageUrl: 'https://static.wixstatic.com/media/a280a5_95ac77cb320c40718c1a42f16712476c~mv2.png',
      },
      {
        eyebrow: 'Listings',
        heading: 'Better manage your properties',
        body:
          'Store all your listings in one centralised database. Receive automated reminders and updates to stay informed with day-to-day operations and ensure processes run smoothly.',
        imageUrl: 'https://static.wixstatic.com/media/a280a5_fe221d226ef647e183805d686343afb8~mv2.png',
      },
    ],
    calendlyHeading: 'Schedule a 30-min consultation with a monday.com real estate consultant',
    calendlySubheading:
      'Talk to a Fruition consultant about your property pipeline, agent CRM, transaction tracking and document management.',
    faqTabs: [SHARED_FAQ_GENERIC],
    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ real estate teams',
    joinHeadingPart2: ' running on monday.com with Fruition',
    joinSubheading: 'From boutique brokerages to enterprise franchises.',
    joinStats: SHARED_AGENCY_STATS,
  },
]

function key(slug: string, prefix: string, idx: number, sub?: number) {
  const base = `${prefix}-${slug}-${idx}`
  return sub === undefined ? base : `${base}-${sub}`
}

async function buildDocument(p: IndustryPage) {
  const heroImage = p.heroImageUrl
    ? await uploadImageFromUrl(p.heroImageUrl, `${p.slug}-hero${extensionOf(p.heroImageUrl)}`)
    : undefined

  const solutionCards = p.solutionCards
    ? await Promise.all(
        p.solutionCards.map(async (card, idx) => {
          const image = card.imageUrl
            ? await uploadImageFromUrl(card.imageUrl, `${p.slug}-solution-${idx}${extensionOf(card.imageUrl)}`)
            : undefined
          return {
            _key: key(p.slug, 'sc', idx),
            _type: 'solutionCard',
            eyebrow: card.eyebrow,
            heading: card.heading,
            body: card.body,
            ctaLabel: card.ctaLabel,
            ctaUrl: card.ctaUrl,
            ...(image ? { image } : {}),
          }
        }),
      )
    : undefined

  const capabilitiesCards = p.capabilitiesCards?.map((c, i) => ({
    _key: key(p.slug, 'cap', i),
    _type: 'capabilityCard',
    emoji: c.emoji,
    title: c.title,
    description: c.description,
  }))

  const comparisonTabs = p.comparisonTabs?.map((tab, ti) => ({
    _key: key(p.slug, 'ct', ti),
    _type: 'comparisonTab',
    label: tab.label,
    items: tab.items.map((item, ii) => ({
      _key: key(p.slug, `ct${ti}-i`, ii),
      _type: 'comparisonItem',
      number: item.number,
      title: item.title,
      description: item.description,
      bullets: item.bullets?.map((b, bi) => ({
        _key: key(p.slug, `ct${ti}-i${ii}-b`, bi),
        _type: 'bullet',
        emoji: b.emoji,
        text: b.text,
      })),
    })),
  }))

  const methodologySteps = p.methodologySteps?.map((s, i) => ({
    _key: key(p.slug, 'meth', i),
    _type: 'methodologyStep',
    number: s.number,
    title: s.title,
    description: s.description,
  }))

  const faqTabs = p.faqTabs?.map((tab, ti) => ({
    _key: key(p.slug, 'faq', ti),
    _type: 'faqTab',
    label: tab.label,
    items: tab.items.map((q, qi) => ({
      _key: key(p.slug, `faq${ti}-q`, qi),
      _type: 'faqPair',
      question: q.question,
      answer: q.answer,
    })),
  }))

  const joinStats = p.joinStats?.map((s, i) => ({
    _key: key(p.slug, 'stat', i),
    _type: 'stat',
    value: s.value,
    label: s.label,
  }))

  return {
    _id: `industryPage-${p.slug}`,
    _type: 'industryPage',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    industryName: p.industryName,
    heroHeading: p.heroHeading,
    heroSubheading: p.heroSubheading,
    ...(heroImage ? { heroImage } : {}),
    primaryCtaLabel: p.primaryCtaLabel,
    primaryCtaUrl: p.primaryCtaUrl,
    secondaryCtaLabel: p.secondaryCtaLabel,
    secondaryCtaUrl: p.secondaryCtaUrl,
    capabilitiesHeading: p.capabilitiesHeading,
    capabilitiesCards,
    comparisonHeading: p.comparisonHeading,
    comparisonSubheading: p.comparisonSubheading,
    comparisonTabs,
    methodologyHeading: p.methodologyHeading,
    methodologySteps,
    solutionCards,
    calendlyHeading: p.calendlyHeading,
    calendlySubheading: p.calendlySubheading,
    faqTabs,
    joinHeadingPart1: p.joinHeadingPart1,
    joinHeadingAccent: p.joinHeadingAccent,
    joinHeadingPart2: p.joinHeadingPart2,
    joinSubheading: p.joinSubheading,
    joinStats,
    joinFootnote: p.joinFootnote,
  }
}

async function main() {
  console.log(`Migrating ${pages.length} industry pages...`)
  for (const p of pages) {
    console.log(`\n→ ${p.slug}`)
    const doc = await buildDocument(p)
    await writeClient.createOrReplace(doc)
    console.log(`  ✓ wrote industryPage-${p.slug}`)
  }
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
