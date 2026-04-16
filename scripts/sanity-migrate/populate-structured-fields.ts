/**
 * Populate structured section fields on ALL existing page documents.
 *
 * Patches: comparisonTabs, comparisonHeading, comparisonSubheading,
 *          methodologyHeading, methodologySteps, faqTabs,
 *          calendlyHeading, calendlySubheading, joinStats, logoCloud fields.
 *
 * Run:  npx tsx scripts/sanity-migrate/populate-structured-fields.ts
 */
import { writeClient, withKeys } from './lib'

/* ------------------------------------------------------------------ */
/*  Shared data reused across pages                                    */
/* ------------------------------------------------------------------ */

const STANDARD_METHODOLOGY_HEADING =
  'Our expert consultants empower you to adopt workflow automation & AI systems'

const STANDARD_METHODOLOGY = withKeys([
  {
    _type: 'methodologyStep',
    number: '01',
    title: 'Process Discovery \u2192 Business Process Audit',
    description:
      'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
  },
  {
    _type: 'methodologyStep',
    number: '02',
    title: 'Technical Architecture \u2192 System Integration Scope',
    description:
      'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
  },
  {
    _type: 'methodologyStep',
    number: '03',
    title: 'Solution Design \u2192 Implementation',
    description:
      'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.',
  },
  {
    _type: 'methodologyStep',
    number: '04',
    title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
    description:
      'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
  },
  {
    _type: 'methodologyStep',
    number: '05',
    title: 'Change Readiness \u2192 Adoption & Training Strategies',
    description:
      'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.',
  },
])

const STANDARD_JOIN_STATS = {
  joinHeadingPart1: 'Join ',
  joinHeadingAccent: '500+ businesses',
  joinHeadingPart2: ' that have leveraged our monday.com expert consultants.',
  joinSubheading: 'The economic impact of',
  joinStats: withKeys([
    { _type: 'stat', value: '288%', label: 'ROI' },
    { _type: 'stat', value: '15,600', label: 'Hours Saved' },
    { _type: 'stat', value: '50%', label: 'Meeting reduction' },
    { _type: 'stat', value: '489,794', label: 'Net Value' },
  ]),
  joinFootnote: 'Data by',
}

const STANDARD_LOGO_CLOUD = {
  logoCloudHeadingPart1: 'Clients who have used our ',
  logoCloudHeadingAccent: 'monday.com consulting services',
}

/* ---- Shared FAQ tabs (reused on many pages) ---- */

const FAQ_PROFESSIONAL_SERVICES = {
  _type: 'faqTab',
  label: 'Professional Services',
  items: withKeys([
    {
      _type: 'faqItem',
      question: 'Does monday com have a CRM?',
      answer:
        'Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes.',
    },
    {
      _type: 'faqItem',
      question: 'Does monday com have task management?',
      answer:
        'Yes, monday.com has task management. Take a trial of monday work management and discover just how efficiently you can manage your teams\' to-do list.',
    },
  ]),
}

const FAQ_MONDAY_WORK_MANAGEMENT = {
  _type: 'faqTab',
  label: 'monday Work Management',
  items: withKeys([
    {
      _type: 'faqItem',
      question: 'Why is monday.com so successful?',
      answer:
        'Here are key factors that make monday.com so successful: One of Monday.com\'s key selling points is its highly customizable nature, allowing users to tailor workflows, add automations, and integrate third-party apps. Extremely user-friendly, making adoption easy. Highly visual, agile, and, most importantly, scalable. monday.com can be used to manage anything you want. It\'s a veritable Swiss Army knife for managers around the world.',
    },
    {
      _type: 'faqItem',
      question: 'What exactly does monday.com do?',
      answer:
        'monday.com is the most versatile project management software you\'ll find on the market. You can use the platform to manage all of your projects, and also use it as a CRM, to manage your ad campaigns, track bugs, and manage video production.',
    },
  ]),
}

const FAQ_GENERAL_QUESTIONS = {
  _type: 'faqTab',
  label: 'General Questions',
  items: withKeys([
    {
      _type: 'faqItem',
      question: 'Why is monday.com so successful?',
      answer:
        'Here are key factors that make monday.com so successful: One of Monday.com\'s key selling points is its highly customizable nature, allowing users to tailor workflows, add automations, and integrate third-party apps. Extremely user-friendly, making adoption easy. Highly visual, agile, and, most importantly, scalable.',
    },
    {
      _type: 'faqItem',
      question: 'What exactly does monday.com do?',
      answer:
        'monday.com is the most versatile project management software you\'ll find on the market. You can use the platform to manage all of your projects, and also use it as a CRM, to manage your ad campaigns, track bugs, and manage video production.',
    },
  ]),
}

const FAQ_MONDAY_CRM = {
  _type: 'faqTab',
  label: 'monday CRM',
  items: withKeys([
    {
      _type: 'faqItem',
      question: 'Does monday com have a CRM?',
      answer:
        'Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes.',
    },
  ]),
}

const FAQ_MONDAY_SERVICE = {
  _type: 'faqTab',
  label: 'monday Service',
  items: withKeys([
    {
      _type: 'faqItem',
      question: 'Does monday com have task management?',
      answer:
        'Yes, monday.com has task management. Take a trial of monday work management and discover just how efficiently you can manage your teams\' to-do list.',
    },
  ]),
}

const FAQ_EXPERT_CONSULTANT_GUIDE = {
  _type: 'faqTab',
  label: 'Expert Consultant Guide',
  items: withKeys([
    {
      _type: 'faqItem',
      question: 'Why is monday.com so successful?',
      answer:
        'Here are key factors that make monday.com so successful: One of Monday.com\'s key selling points is its highly customizable nature, allowing users to tailor workflows, add automations, and integrate third-party apps. Extremely user-friendly, making adoption easy. Highly visual, agile, and, most importantly, scalable.',
    },
    {
      _type: 'faqItem',
      question: 'What exactly does monday.com do?',
      answer:
        'monday.com is the most versatile project management software you\'ll find on the market. You can use the platform to manage all of your projects, and also use it as a CRM, to manage your ad campaigns, track bugs, and manage video production.',
    },
  ]),
}

/* ------------------------------------------------------------------ */
/*  Page-specific data                                                 */
/* ------------------------------------------------------------------ */

const PAGE_DATA: Record<string, Record<string, unknown>> = {
  /* =================================================================
   * INDUSTRY PAGES
   * ================================================================= */

  'monday-for-construction': {
    comparisonHeading: 'Why monday.com for Construction?',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Why Construction Leaders Choose monday.com',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Pre-construction CRM & Estimating',
            description:
              'Streamline lead management, contact tracking, and tender bids in one centralised platform. Our monday.com consultants help you build efficient pre-construction workflows that increase win rates and improve project planning.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Advanced Project Management',
            description:
              'Take control of your construction projects with powerful scheduling tools, resource allocation, and progress tracking. monday.com\'s construction and subcontract management features ensure projects stay on track and within budget.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Mobile-First Construction Management',
            description:
              'Keep your on-site teams connected with real-time access to project details, documents, and checklists through the monday.com mobile app. Enable seamless collaboration between office and field teams.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Key Construction Management Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Finance Control & Integration',
            description:
              'Seamless integration with popular accounting software. Real-time budget tracking and cost management. Automated invoice processing and payment tracking. Custom financial reporting dashboards.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Document & Drawing Management',
            description:
              'Centralised storage for all construction documents. Version control for drawings and specifications. Collaborative annotation tools. Mobile access to all project files.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Safety & Compliance',
            description:
              'Digital safety inspection checklists. Incident reporting and tracking. Compliance documentation management. Automated safety report generation.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Resource & Equipment Management',
            description:
              'Optimise resource allocation across projects. Track equipment maintenance schedules. Monitor asset utilization and location. Manage subcontractor relationships effectively.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Bidding & Pre-Construction',
            description:
              'Centralise bid documents and RFPs in collaborative workspaces. Track deadlines, assign team members to proposals, and maintain databases of past bids with automated notifications.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Planning & Design',
            description:
              'Transform schedules into visual timelines with dependencies and critical path tracking. Coordinate stakeholders with shared boards that automatically update on design changes and milestone achievements.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Execution & Construction',
            description:
              'Monitor progress, track labor hours, and manage deliveries through mobile dashboards. Field teams update tasks and upload photos while managers maintain oversight through automated progress and budget reports.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Handover & Closeout',
            description:
              'Organise punch lists, warranties, and inspections in structured workflows. Track outstanding items and coordinate final walkthroughs with automated reminders for efficient project closeout.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Post-Construction Support',
            description:
              'Maintain client relationships with warranty tracking and maintenance scheduling. Historical project data improves future estimates and business processes.',
          },
        ]),
      },
    ]),
    methodologyHeading: STANDARD_METHODOLOGY_HEADING,
    methodologySteps: STANDARD_METHODOLOGY,
    calendlyHeading: 'Schedule a 30-minute call with one of our monday.com consultants today',
    calendlySubheading:
      'From initial process discovery to full system adoption for your monday.com construction solution, our proven methodology ensures seamless digital transformation that empowers your team and drives sustainable operational efficiency.',
    faqTabs: withKeys([
      {
        _type: 'faqTab',
        label: 'Construction',
        items: withKeys([
          {
            _type: 'faqItem',
            question: 'Can Monday com be used for construction projects?',
            answer:
              'Absolutely! No matter the size of your build or project, construction project management requires a lot of coordination, usually best handled with construction project management software like monday.com \u2014 which can serve you on-the-go with a simple to use but sophisticated mobile app.',
          },
          {
            _type: 'faqItem',
            question: 'Does Monday com have project templates?',
            answer:
              'Yes. There are a number of monday.com project templates for construction project management in the Template Center. They allow you to: Keep your construction projects on track and manage budget, timelines, ownership, and view project progress. Stay on top of your teammates\' workloads and deliverables, and keep all stakeholders, and clients in the loop to make sure that each construction project and task is scheduled and completed on time.',
          },
        ]),
      },
      FAQ_PROFESSIONAL_SERVICES,
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_GENERAL_QUESTIONS,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  'monday-for-manufacturing': {
    comparisonHeading: 'Why monday.com for Manufacturing?',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Why Manufacturing Teams are Implementing monday.com',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Process Management',
            description:
              'Production Planning: Streamline manufacturing logistics with efficient scheduling and management tools. Quality Control: Implement robust quality assurance workflows that ensure consistent product excellence. Inventory Management: Track stock levels precisely and automate replenishment to prevent stockouts.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Resource Optimization',
            description:
              'Resource Allocation: Maximise efficiency with smart resource distribution across production lines. Supplier Coordination: Manage vendor relationships and track material deliveries and procurement seamlessly. Health & Safety: Maintain compliance with built-in OHS regulation tracking features.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Technology Integration',
            description:
              'System Integration: Connect smoothly with your existing ERP and MES software ecosystem. Automation Capabilities: Reduce manual tasks through intelligent process automation. Custom Analytics: Generate insightful reports with manufacturing-specific metrics.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Team Collaboration',
            description:
              'Intuitive Interface: Enable quick team adoption through monday.com\'s user-friendly design. Real-time Communication: Keep all stakeholders and vendors connected and informed throughout production cycles. Visual Dashboards: Monitor key performance indicators through customizable visual displays.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Key Management Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Production Management',
            description:
              'Visual production scheduling with drag-and-drop timeline views. Real-time work order tracking and status updates. Automated workflow triggers for production milestones. Capacity planning with resource availability dashboards.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Quality & Compliance',
            description:
              'Digital quality inspection checklists and approval workflows. Non-conformance tracking with corrective action assignments. Safety incident reporting and compliance documentation. Quality metrics tracking with trend analysis.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Inventory & Supply Chain',
            description:
              'Real-time inventory levels with automated reorder alerts. Supplier delivery tracking and performance monitoring. Material traceability throughout the production process. Purchase order management with approval workflows.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Analytics & Reporting',
            description:
              'Manufacturing KPI dashboards with real-time data. Production efficiency reports and bottleneck identification. OEE tracking with downtime analysis capabilities. Mobile-friendly reports for shop floor managers.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Sales & Production Planning',
            description:
              'Centralise RFQs, product specifications, and production forecasts in collaborative boards. Track approval cycles, assign engineering reviews, and automate notifications to move from quote to production faster.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Design & Engineering Coordination',
            description:
              'Manage product designs, revisions, and change orders with structured workflows. Visual timelines and dependency tracking ensure engineering, procurement, and production stay aligned.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Production & Shop Floor Execution',
            description:
              'Monitor production schedules, track labor hours, and manage work orders in real time. Teams update task status from the floor while managers oversee progress through automated dashboards and performance reports.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Quality Control & Compliance',
            description:
              'Organise inspections, compliance documentation, and quality checklists in standardised workflows. Automate alerts for defects, non-conformances, and corrective actions to reduce costly rework.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Delivery & After-Sales Support',
            description:
              'Coordinate shipments, track order fulfillment, and manage post-production support. Maintain service logs, warranty tracking, and performance history to improve customer satisfaction and future production planning.',
          },
        ]),
      },
    ]),
    methodologyHeading:
      'Our Manufacturing Technology Consultants Empower You to Adopt Workflow Automation & AI Systems',
    methodologySteps: withKeys([
      {
        _type: 'methodologyStep',
        number: '01',
        title: 'Process Discovery \u2192 Business Process Audit',
        description:
          'We meticulously map your existing production workflows against manufacturing industry benchmarks, analysing bottlenecks and efficiency gaps that prevent your facility from achieving optimal throughput and scaling operations.',
      },
      {
        _type: 'methodologyStep',
        number: '02',
        title: 'Technical Architecture \u2192 System Integration Scope',
        description:
          'Our technical assessment reveals the hidden potential in your current manufacturing tech stack, identifying precise integration points where monday.com can transform fragmented production processes into seamless, automated workflows that connect shop floor to top floor.',
      },
      {
        _type: 'methodologyStep',
        number: '03',
        title: 'Solution Design \u2192 Workflow and Integration Implementation',
        description:
          'Through in-depth manufacturing solution design analysis, we implement the perfect balance between automated production system sophistication and operator adoption, ensuring your solution scales with your manufacturing expertise and production demands.',
      },
      {
        _type: 'methodologyStep',
        number: '04',
        title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
        description:
          'By quantifying potential efficiency gains across your production operations, we pinpoint exactly where automation and lean optimisation will deliver the highest return on your manufacturing investment through reduced downtime and increased OEE.',
      },
      {
        _type: 'methodologyStep',
        number: '05',
        title: 'Change Readiness \u2192 Adoption Strategy Planning',
        description:
          'Our proven change impact framework measures manufacturing team readiness and crafts a tailored adoption strategy, turning potential resistance from production staff and supervisors into enthusiastic system adoption across all shifts.',
      },
    ]),
    calendlyHeading: 'Schedule a 30 minute call with a monday.com expert today',
    calendlySubheading:
      'From initial process discovery to full system adoption for your monday.com manufacturing solution for project management, our proven methodology ensures seamless digital transformation that empowers your team and drives sustainable operational efficiency.',
    faqTabs: withKeys([
      {
        _type: 'faqTab',
        label: 'Construction',
        items: withKeys([
          {
            _type: 'faqItem',
            question: 'Can Monday com be used for construction projects?',
            answer:
              'Absolutely! No matter the size of your build or project, construction project management requires a lot of coordination, usually best handled with construction project management software like monday.com \u2014 which can serve you on-the-go with a simple to use but sophisticated mobile app.',
          },
          {
            _type: 'faqItem',
            question: 'Does Monday com have project templates?',
            answer:
              'Yes. There are a number of monday.com project templates for construction project management in the Template Center.',
          },
        ]),
      },
      {
        _type: 'faqTab',
        label: 'Manufacturing',
        items: withKeys([
          {
            _type: 'faqItem',
            question: 'Can monday.com be used for manufacturing?',
            answer:
              'Yes! monday.com is an excellent platform for manufacturing teams to manage production workflows, inventory, quality control, and team coordination all in one centralised system.',
          },
        ]),
      },
      FAQ_PROFESSIONAL_SERVICES,
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_GENERAL_QUESTIONS,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  'monday-for-retail': {
    comparisonHeading: 'Why monday.com for Retail?',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Why Retail Leaders Choose monday.com',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Achieve faster time to market by streamlining your product portfolio',
            description:
              'Get a comprehensive view of the entire supply chain to spot blockers, manage vendor communications, track inventory, and more with a platform that\'s easy for staff to use.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Boost awareness and demand by optimising your marketing processes',
            description:
              'Get a bird\'s-eye view of all marketing campaigns and creative production, and easily oversee budget, ROI goals, spend per channel, and more.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Improve operational efficiency for better retail performance',
            description:
              'Manage every aspect of new store openings, from inventory and hiring to end-to-end franchise lifecycle management.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Retail Management Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Inventory & Stock Management',
            description:
              'Keep real-time updates on stock levels, SKU details, and reorder points. Notify your team or trigger purchase orders when inventory is running low. Streamline stock intake and updates.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Sales & Order Management',
            description:
              'Manage online and in-store sales in one dashboard. Update order fulfillment stages. Connect to Shopify, WooCommerce, or POS systems to sync sales data.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Employee Scheduling & Task Management',
            description:
              'Assign and manage store shifts for staff. Notify employees about daily priorities, restocking tasks, or shift hours. Monitor staff hours and optimise labor allocation.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Vendor & Supplier Coordination',
            description:
              'Track supplier contacts, contracts, and performance. Trigger notifications or approvals when restocks are needed. Connect with Slack or email to streamline supplier communication.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Marketing & Promotions Management',
            description:
              'Organise seasonal promotions, product launches, and in-store events. Manage creative materials and marketing timelines in one place. Visualise promotion ROI or traffic generated from campaigns.',
          },
          {
            _type: 'comparisonItem',
            number: '06',
            title: 'Multi-Store Operations',
            description:
              'Compare KPIs like sales, foot traffic, and inventory across locations. Ensure consistent operational processes across all branches. Generate daily, weekly, or monthly performance reports.',
          },
          {
            _type: 'comparisonItem',
            number: '07',
            title: 'Data Visualization & Reporting',
            description:
              'Combine sales, inventory, staffing, and marketing KPIs in one view. Identify best-seller products, underperforming stores, and seasonal patterns. Quickly share performance insights with stakeholders.',
          },
          {
            _type: 'comparisonItem',
            number: '08',
            title: 'Mobile & On-the-Floor Usability',
            description:
              'Staff can update inventory or check schedules from the sales floor. Speeds up stocktaking and receiving shipments. Instant alerts for low stock, urgent tasks, or schedule changes.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Store Operations Discovery \u2192 Retail Workflow Audit',
            description:
              'We dive into your day-to-day retail operations\u2014inventory management, staff scheduling, sales tracking\u2014and compare them against proven industry best practices.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Retail Tech Architecture \u2192 System & POS Integration Scope',
            description:
              'We analyse your current tools, from POS systems and eCommerce platforms to inventory and staffing apps. Our goal is to identify how Monday.com can centralise these fragmented systems.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Solution Design \u2192 Automated Workflow & Integration Implementation',
            description:
              'We craft a tailored solution that automates repetitive tasks like stock alerts, shift notifications, and vendor updates\u2014while keeping it simple for your team to adopt.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Efficiency Insights \u2192 Retail ROI Analysis',
            description:
              'We quantify exactly how much time and effort you\'ll save by reducing manual processes\u2014such as reordering stock, managing shifts, or coordinating promotions.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Change Readiness \u2192 Adoption Strategy Planning',
            description:
              'Our proven change impact framework measures your retail organisation\'s readiness and crafts a tailored adoption strategy, turning potential resistance from store teams into enthusiastic system adoption across all channels.',
          },
        ]),
      },
    ]),
    methodologyHeading:
      'Our monday.com Consultants Will Help You Manage All of Your Retail Operations in One Place',
    methodologySteps: withKeys([
      {
        _type: 'methodologyStep',
        number: '01',
        title: 'Store Operations Discovery \u2192 Retail Workflow Audit',
        description:
          'We dive into your day-to-day retail operations\u2014inventory management, staff scheduling, sales tracking\u2014and compare them against proven industry best practices. This helps us uncover bottlenecks, stock management gaps, and operational inefficiencies that may be slowing down growth.',
      },
      {
        _type: 'methodologyStep',
        number: '02',
        title: 'Retail Tech Architecture \u2192 System & POS Integration Scope',
        description:
          'We analyse your current tools, from POS systems and eCommerce platforms to inventory and staffing apps. Our goal is to identify how Monday.com can centralise these fragmented systems, creating automated workflows that connect online and in-store operations seamlessly.',
      },
      {
        _type: 'methodologyStep',
        number: '03',
        title: 'Solution Design \u2192 Automated Workflow & Integration Implementation',
        description:
          'We craft a tailored solution that automates repetitive tasks like stock alerts, shift notifications, and vendor updates\u2014while keeping it simple for your team to adopt. Every workflow is designed to grow with your business as your locations, sales, and operations expand.',
      },
      {
        _type: 'methodologyStep',
        number: '04',
        title: 'Efficiency Insights \u2192 Retail ROI Analysis',
        description:
          'We quantify exactly how much time and effort you\'ll save by reducing manual processes\u2014such as reordering stock, managing shifts, or coordinating promotions\u2014so you can see the direct impact of automation on sales, labor efficiency, and profitability.',
      },
      {
        _type: 'methodologyStep',
        number: '05',
        title: 'Change Readiness \u2192 Adoption Strategy Planning',
        description:
          'Our proven change impact framework measures your retail organisation\'s readiness and crafts a tailored adoption strategy, turning potential resistance from store teams, merchandisers, and operations managers into enthusiastic system adoption across all channels.',
      },
    ]),
    calendlyHeading: 'Schedule A 30-Min Call with a monday.com Expert',
    calendlySubheading: '',
    faqTabs: withKeys([
      {
        _type: 'faqTab',
        label: 'Retail',
        items: withKeys([
          {
            _type: 'faqItem',
            question: 'How can monday.com help retail businesses manage inventory?',
            answer:
              'monday.com helps retail businesses manage inventory in real time by tracking stock levels across multiple locations and automating low-stock alerts. With retail inventory management boards, you can easily visualize stock across stores, prevent stockouts, and streamline multi-location retail operations.',
          },
          {
            _type: 'faqItem',
            question: 'Can monday.com integrate with retail POS and eCommerce platforms?',
            answer:
              'Yes! Monday.com integrates with retail POS systems and eCommerce platforms like Shopify, WooCommerce, and Square, allowing you to sync sales data, inventory, and orders automatically.',
          },
          {
            _type: 'faqItem',
            question: 'How does monday.com improve team collaboration for retail stores?',
            answer:
              'monday.com boosts retail team collaboration by giving store managers and staff a shared workspace to manage store tasks, schedules, and inventory updates.',
          },
          {
            _type: 'faqItem',
            question: 'Can monday.com help manage multiple retail locations?',
            answer:
              'Absolutely! monday.com makes multi-location retail management easy with custom dashboards that track sales performance, inventory levels, and staffing needs across all your stores.',
          },
          {
            _type: 'faqItem',
            question: 'Is monday.com suitable for small retail businesses or only large chains?',
            answer:
              'monday.com is flexible enough for small retail businesses and large retail chains alike.',
          },
          {
            _type: 'faqItem',
            question: 'Does monday.com automate repetitive retail tasks?',
            answer:
              'Yes. monday.com retail automations handle repetitive tasks like low-stock alerts, shift reminders, purchase order notifications, and task assignments.',
          },
          {
            _type: 'faqItem',
            question: 'Is monday.com mobile-friendly for retail teams on the floor?',
            answer:
              'Yes! With the monday.com mobile app, retail staff can update inventory, complete store checklists, and receive instant notifications directly from the sales floor.',
          },
        ]),
      },
      FAQ_PROFESSIONAL_SERVICES,
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_MONDAY_SERVICE,
      FAQ_GENERAL_QUESTIONS,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  'monday-for-professional-services': {
    comparisonHeading: 'monday.com for Professional Services & Agencies',
    comparisonSubheading:
      'Being a service based business ourselves we understand the key challenges of managing resource capacity, profitability and project delivery excellence.',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'CRM Sales Process',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'CRM Sales Process for Professional Services Businesses',
            description:
              'Transform your agency\'s pipeline into a revenue-generating engine with monday.com\'s CRM. Track leads, opportunities, and client relationships in one intuitive platform. Customisable workflows match your unique sales process, while automation eliminates manual data entry.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Quoting & Ticketing',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Quoting & Ticketing',
            description:
              'Speed up your quote-to-cash cycle with automated quoting and ticketing. Generate professional proposals instantly while managing client requests efficiently.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Finance Workflows',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Finance Workflows',
            description:
              'Streamline your agency\'s financial operations with end-to-end automation. From contract generation to payment tracking, monday.com transforms complex financial processes into smooth, error-free workflows.',
          },
        ]),
      },
    ]),
    methodologyHeading: STANDARD_METHODOLOGY_HEADING,
    methodologySteps: STANDARD_METHODOLOGY,
    calendlyHeading: 'Schedule Your Call with a monday.com Consultant Today!',
    calendlySubheading:
      'Book a session with our monday.com specialists to explore how a tailored professional services project management solution can streamline your workflows, enhance client delivery, and optimise resource management. Plus, get a free 4-week extended monday.com trial to experience the full potential.',
    faqTabs: withKeys([
      FAQ_PROFESSIONAL_SERVICES,
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_GENERAL_QUESTIONS,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  'monday-for-government': {
    comparisonHeading: 'Why monday.com for the Public Sector?',
    comparisonSubheading:
      'Empower your agency with modern, secure, and flexible project management tools that improve efficiency, collaboration, and transparency across the public sector.',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Why the Public Sector Chooses monday.com',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Accelerate Digital Transformation Without IT Bottlenecks',
            description:
              'Modern government faces unprecedented challenges: budget constraints, workforce shortages, and increasing demands for transparency and efficiency. IT teams are under immense pressure to support outdated systems with limited budgets, time, and talent, making traditional modernisation approaches unsustainable.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Workforce Resilience During Transitions',
            description:
              'With the "silver tsunami" of government retirements, agencies lose decades of institutional knowledge. monday.com captures critical processes, workflows, and decision-making protocols in a centralised system, ensuring continuity when experienced staff retire.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Citizen Service Delivery Enhancement',
            description:
              'Improve public service responsiveness with automated citizen request tracking, case management workflows, and real-time status updates. Citizens gain transparency into permit processing, service requests, and project timelines.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Top Management Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Enhanced Project Management',
            description:
              'Centralised dashboard view of all projects, deadlines, and dependencies across departments. Automated workflow triggers that eliminate manual handoffs and reduce project delays by 40%. Real-time progress tracking with visual timelines for stakeholder reporting and accountability.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Regulatory Compliance Made Simple',
            description:
              'Automated compliance checkpoints that flag missing documentation before audit deadlines. Pre-built templates for project management containing built-in approval workflows. Audit-ready documentation trails that automatically capture all changes and approvals.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Workforce Resilience During Transitions',
            description:
              'Digital knowledge capture that preserves decades of institutional memory in searchable formats. Dramatically reduced onboarding time for new hires through comprehensive documented procedures. Seamless succession planning with automated workflow transfers and process documentation.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Citizen Service Delivery Enhancement',
            description:
              'Automated citizen request tracking with real-time status updates and estimated completion times. Improved response times through prioritised case management and automated routing systems. Public-facing status portals giving citizens transparency into permit processing and service requests.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Operational Assessment \u2192 Government Workflow Audit',
            description:
              'We start by reviewing your agency\'s daily operations\u2014from case management and staff scheduling to document processing and citizen service tracking. We compare these workflows against public sector best practices to identify bottlenecks, compliance risks, and inefficiencies.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Technology Landscape \u2192 System & Platform Integration Scope',
            description:
              'We analyse your current government systems\u2014including case management tools, ERP systems, and citizen-facing portals. Our goal is to identify how monday.com can serve as a central hub to unify these disconnected platforms.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Solution Design \u2192 Automated Workflow & Integration Implementation',
            description:
              'We develop customised workflows that automate repetitive administrative tasks such as approvals, notifications, document routing, and inter-departmental updates. Every solution is built to scale with your agency\'s needs.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Performance Insights \u2192 Operational Efficiency Analysis',
            description:
              'We measure the time, cost, and resource savings your agency can achieve by automating workflows and centralising operations.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Performance Insights \u2192 Public Impact & ROI Assessment',
            description:
              'Beyond internal efficiency, we help you quantify the public impact\u2014from faster permit approvals to reduced response times and improved citizen satisfaction.',
          },
        ]),
      },
    ]),
    methodologyHeading: STANDARD_METHODOLOGY_HEADING,
    methodologySteps: withKeys([
      {
        _type: 'methodologyStep',
        number: '01',
        title: 'Operational Assessment \u2192 Government Workflow Audit',
        description:
          'We start by reviewing your agency\'s daily operations\u2014from case management and staff scheduling to document processing and citizen service tracking. We compare these workflows against public sector best practices to identify bottlenecks, compliance risks, and inefficiencies that may be slowing service delivery or program outcomes.',
      },
      {
        _type: 'methodologyStep',
        number: '02',
        title: 'Technology Landscape \u2192 System & Platform Integration Scope',
        description:
          'We analyse your current government systems\u2014including case management tools, ERP systems, and citizen-facing portals. Our goal is to identify how monday.com can serve as a central hub to unify these disconnected platforms, creating streamlined, automated workflows across departments and programs.',
      },
      {
        _type: 'methodologyStep',
        number: '03',
        title: 'Solution Design \u2192 Automated Workflow & Integration Implementation',
        description:
          'We develop customised workflows that automate repetitive administrative tasks such as approvals, notifications, document routing, and inter-departmental updates. Every solution is built to scale with your agency\'s needs, ensuring seamless adoption while reducing manual workload for government staff.',
      },
      {
        _type: 'methodologyStep',
        number: '04',
        title: 'Performance Insights \u2192 Operational Efficiency Analysis',
        description:
          'We measure the time, cost, and resource savings your agency can achieve by automating workflows and centralising operations. This analysis provides clear visibility into how process improvements enhance service delivery, staff efficiency, and compliance.',
      },
      {
        _type: 'methodologyStep',
        number: '05',
        title: 'Performance Insights \u2192 Public Impact & ROI Assessment',
        description:
          'Beyond internal efficiency, we help you quantify the public impact\u2014from faster permit approvals to reduced response times and improved citizen satisfaction. By showing the direct ROI of modernisation initiatives, leadership can make data-driven decisions to further optimise resources and services.',
      },
    ]),
    calendlyHeading: 'Schedule A 30-Min Call with a monday.com Expert',
    calendlySubheading: '',
    faqTabs: withKeys([
      FAQ_PROFESSIONAL_SERVICES,
      {
        _type: 'faqTab',
        label: 'Public Sector',
        items: withKeys([
          {
            _type: 'faqItem',
            question: 'Can monday.com be used for government project management?',
            answer:
              'Yes, monday.com provides enterprise-grade security features and compliance capabilities suitable for public sector use, including SOC 2 Type II compliance and role-based access controls.',
          },
        ]),
      },
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_MONDAY_SERVICE,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  'monday-for-marketing': {
    comparisonHeading: 'Why monday.com for Marketing & Creative?',
    comparisonSubheading:
      'Having worked extensively with marketing and creative teams, we understand the critical challenges of managing campaign workflows, creative asset production, and delivering consistent brand experiences across all channels and touchpoints.',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Why monday for marketing and creative work?',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Streamline Your Process from Idea to Delivery',
            description:
              'Set goals and strategy. Plan project goals, tasks, and resources. Oversee due dates, assign tasks, and more. Deliver on time and within budget. Measure marketing impact.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Run Efficient Campaigns',
            description:
              'Keep every stakeholder aligned on campaign progress. Ensure all campaigns are on budget and on time. Maintain full visibility of campaign performance metrics.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Simplify Approval Processes',
            description:
              'Automate key parts of the approval process. Keep the entire team up to date. Eliminate the need for frequent checkups, emails, and update meetings. Save valuable time, so you can focus on the creative work itself.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Marketing & Creative Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Proofing and approval',
            description:
              'Streamline the content review and approval process directly inside monday.com with the PageProof app, no matter the file type.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Annotations and Live Feedback',
            description:
              'Shorten feedback loops with contextual annotations directly on your files, and communicate with stakeholders with updates and notifications.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'File Versioning',
            description:
              'Stay updated on the latest version. Track files connected to tasks and projects from latest to oldest. Add and delete versions, preview, download, and add annotations directly on file for quick feedback.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Robust Gantt for Campaign Planning',
            description:
              'Plan and monitor marketing work, from campaigns to complex projects, with robust Gantt charts.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Marketing Automations',
            description:
              'Automate repetitive marketing work with customisable automations to improve efficiency, allowing teams to free up time to focus on the work that matters.',
          },
          {
            _type: 'comparisonItem',
            number: '06',
            title: 'Asset Management',
            description:
              'Store, organize, and share all marketing digital assets in one centralised location.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Assess Your Needs',
            description:
              'Identify your marketing goals. List your specific requirements. Analyse current workflow challenges.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Design Your Process',
            description:
              'Create workflows tailored to your marketing tasks. Map out how information will flow in the system. Define roles and responsibilities.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Set Up monday.com',
            description:
              'Configure custom workflows. Set up automations and permissions. Transfer existing data (if any).',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Train Your Team',
            description:
              'Teach staff how to use Monday.com. Provide hands-on practice sessions. Create user documentation and guides.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Launch the System',
            description:
              'Roll out monday.com to your organisation. Offer on-going support during the transition. Celebrate successful implementation milestones.',
          },
          {
            _type: 'comparisonItem',
            number: '06',
            title: 'Keep Improving',
            description:
              'Monitor how well monday.com is working. Make adjustments as needed. Get ongoing support to optimise your marketing operations.',
          },
        ]),
      },
    ]),
    methodologyHeading:
      'Our monday.com Consultants Will Design Your Marketing Workflows and Automate Grunt Work',
    methodologySteps: withKeys([
      {
        _type: 'methodologyStep',
        number: '01',
        title: 'Assess Your Needs',
        description:
          'Identify your marketing goals. List your specific requirements. Analyse current workflow challenges.',
      },
      {
        _type: 'methodologyStep',
        number: '02',
        title: 'Design Your Process',
        description:
          'Create workflows tailored to your marketing tasks. Map out how information will flow in the system. Define roles and responsibilities.',
      },
      {
        _type: 'methodologyStep',
        number: '03',
        title: 'Set Up monday.com',
        description:
          'Configure custom workflows. Set up automations and permissions. Transfer existing data (if any).',
      },
      {
        _type: 'methodologyStep',
        number: '04',
        title: 'Train Your Team',
        description:
          'Teach staff how to use Monday.com. Provide hands-on practice sessions. Create user documentation and guides.',
      },
      {
        _type: 'methodologyStep',
        number: '05',
        title: 'Launch the System',
        description:
          'Roll out monday.com to your organisation. Offer on-going support during the transition. Celebrate successful implementation milestones.',
      },
    ]),
    calendlyHeading: 'Schedule A 30-Min Call with a monday.com Expert',
    calendlySubheading: '',
    faqTabs: withKeys([
      FAQ_PROFESSIONAL_SERVICES,
      {
        _type: 'faqTab',
        label: 'Marketing & Creative',
        items: withKeys([
          {
            _type: 'faqItem',
            question: 'Is monday.com good for marketing?',
            answer:
              'Absolutely! monday work management for marketing is the ideal choice for marketing and creative teams and leadership \u2014 at any size company, from marketing agencies and small businesses to enterprises.',
          },
          {
            _type: 'faqItem',
            question: 'Does monday.com have a marketing calendar?',
            answer:
              'Yes, monday.com has a marketing calendar. You can find a marketing calendar template in the Template Center. And that\'s not all! You can create any kind of calendar and organize it within monday.com.',
          },
        ]),
      },
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_MONDAY_SERVICE,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  'monday-for-real-estate': {
    comparisonHeading: 'Why monday.com for Real Estate?',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Why Real Estate Teams Choose monday.com',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Process Management',
            description:
              'Production Planning: Streamline manufacturing logistics with efficient scheduling and management tools. Quality Control: Implement robust quality assurance workflows that ensure consistent product excellence. Inventory Management: Track stock levels precisely and automate replenishment to prevent stockouts.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Resource Optimisation',
            description:
              'Resource Allocation: Maximise efficiency with smart resource distribution across production lines. Supplier Coordination: Manage vendor relationships and track material deliveries and procurement seamlessly. Health & Safety: Maintain compliance with built-in OHS regulation tracking features.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Technology Integration',
            description:
              'System Integration: Connect smoothly with your existing ERP and MES software ecosystem. Automation Capabilities: Reduce manual tasks through intelligent process automation. Custom Analytics: Generate insightful reports with manufacturing-specific metrics.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Team Collaboration',
            description:
              'Intuitive Interface: Enable quick team adoption through monday.com\'s user-friendly design. Real-time Communication: Keep all stakeholders and vendors connected and informed throughout production cycles. Visual Dashboards: Monitor key performance indicators through customizable visual displays.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Key Management Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Production Management',
            description:
              'Visual production scheduling with drag-and-drop timeline views. Real-time work order tracking and status updates. Automated workflow triggers for production milestones. Capacity planning with resource availability dashboards.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Quality & Compliance',
            description:
              'Digital quality inspection checklists and approval workflows. Non-conformance tracking with corrective action assignments. Safety incident reporting and compliance documentation. Quality metrics tracking with trend analysis.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Inventory & Supply Chain',
            description:
              'Real-time inventory levels with automated reorder alerts. Supplier delivery tracking and performance monitoring. Material traceability throughout the production process. Purchase order management with approval workflows.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Analytics & Reporting',
            description:
              'Manufacturing KPI dashboards with real-time data. Production efficiency reports and bottleneck identification. OEE tracking with downtime analysis capabilities. Mobile-friendly reports for shop floor managers.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Needs Assessment',
            description:
              'Assess your real estate needs and goals to understand what you want to achieve with a CRM system. By clearly understanding your requirements, we can align monday.com\'s features with your specific needs.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Thorough Research',
            description:
              'Conduct comprehensive research to compare different CRM systems, including monday.com. Consider factors like pricing, features, and integrations, ensuring that monday.com is the ideal fit for your real estate needs.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Seamless Configuration',
            description:
              'Once monday.com is selected, configure the system to match your unique requirements. Set up custom workflows, automations, and permissions to ensure monday.com aligns perfectly with your real estate processes.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Smooth Data Migration',
            description:
              'If you have existing customer data, your valuable data must be accurately transferred, ensuring a seamless continuity of your real estate activities.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Expert Training',
            description:
              'It is important to provide training to your team, equipping them with the knowledge and skills they need to use monday.com effectively.',
          },
          {
            _type: 'comparisonItem',
            number: '06',
            title: 'System Rollout',
            description:
              'Once configured and trained, it\'s time to roll out monday.com to your team.',
          },
          {
            _type: 'comparisonItem',
            number: '07',
            title: 'Ongoing Monitoring and Evaluation',
            description:
              'Remember to continuously monitor its performance and evaluate its effectiveness in meeting your real estate goals.',
          },
        ]),
      },
    ]),
    methodologyHeading:
      'Our expert consultants will help you optimise your real estate management systems',
    methodologySteps: withKeys([
      {
        _type: 'methodologyStep',
        number: '01',
        title: 'Needs Assessment',
        description:
          'Assess your real estate needs and goals to understand what you want to achieve with a CRM system. By clearly understanding your requirements, we can align monday.com\'s features with your specific needs.',
      },
      {
        _type: 'methodologyStep',
        number: '02',
        title: 'Thorough Research',
        description:
          'Conduct comprehensive research to compare different CRM systems, including monday.com. Consider factors like pricing, features, and integrations, ensuring that monday.com is the ideal fit for your real estate needs.',
      },
      {
        _type: 'methodologyStep',
        number: '03',
        title: 'Seamless Configuration',
        description:
          'Once monday.com is selected, configure the system to match your unique requirements. Set up custom workflows, automations, and permissions to ensure monday.com aligns perfectly with your real estate processes.',
      },
      {
        _type: 'methodologyStep',
        number: '04',
        title: 'Smooth Data Migration',
        description:
          'If you have existing customer data, your valuable data must be accurately transferred, ensuring a seamless continuity of your real estate activities.',
      },
      {
        _type: 'methodologyStep',
        number: '05',
        title: 'Expert Training',
        description:
          'It is important to provide training to your team, equipping them with the knowledge and skills they need to use monday.com effectively.',
      },
    ]),
    calendlyHeading: 'Schedule A 30-Min Consultation With One of Our monday.com Consultants',
    calendlySubheading: '',
    faqTabs: withKeys([
      FAQ_PROFESSIONAL_SERVICES,
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_GENERAL_QUESTIONS,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  /* =================================================================
   * LOCATION PAGES
   * ================================================================= */

  'monday-partner-australia': {
    comparisonHeading: 'Teams Transformed with Proven Efficiency Gains.',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Top Leadership Challenges',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Hybrid Work Compliance',
            description:
              'Integrate remote and office workflows while meeting Fair Work Act requirements and maintaining team coordination across Australian locations.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Digital Training Excellence',
            description:
              'Accelerate technology adoption with expert-led programmes that minimise productivity disruptions for Australian teams.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Work-Life Balance Automation',
            description:
              'Automate routine tasks to support Australian workplace wellness standards and enable focus on strategic work.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Process Optimisation Skills',
            description:
              'Empower teams to identify inefficiencies and implement improvements that boost individual and organisational performance.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Cross-Timezone Collaboration',
            description:
              'Maintain team cohesion and transparency across Australia\'s diverse geographic regions through unified platforms.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'monday.com Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Save Time with Automations',
            description:
              'Automated workflows on monday.com function as your dedicated process manager, continuously operating behind the scenes to guarantee that your initiatives progress seamlessly and productively.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Centralised Documentation',
            description:
              'You can create rich documents directly within monday and embed real-time project information from any of your boards within those docs.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Visualise with Dashboards and Charts',
            description:
              'Turn project data into visually engaging and easily digestible information. This not only simplifies data analysis but also improves decision-making by presenting data in a more clear and actionable format.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Flexible Organisation',
            description:
              'Organise projects using Agile or traditional methodologies popular across Melbourne, Sydney, and regional business hubs.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Integrate with other tools',
            description:
              'Keep all your data in monday.com and integrate with Xero, MYOB and Aircall to increase team alignment and improve business organisation. Avoid juggling disconnected apps and make sure nothing falls between the cracks.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Process Discovery \u2192 Business Process Audit',
            description:
              'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Technical Architecture \u2192 System Integration Scope',
            description:
              'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Solution Design \u2192 Implementation',
            description:
              'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
            description:
              'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Change Readiness \u2192 Adoption & Training Strategies',
            description:
              'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.',
          },
        ]),
      },
    ]),
    methodologyHeading: STANDARD_METHODOLOGY_HEADING,
    methodologySteps: STANDARD_METHODOLOGY,
    calendlyHeading: 'Book A 30-Min Consultation With A monday.com Expert',
    calendlySubheading:
      'Schedule a personalised monday.com demo with our certified monday.com consultants to discover how the platform can be customised for your specific business needs.',
    faqTabs: withKeys([
      FAQ_PROFESSIONAL_SERVICES,
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_EXPERT_CONSULTANT_GUIDE,
      FAQ_GENERAL_QUESTIONS,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  'monday-partner-uk': {
    comparisonHeading: 'Teams Transformed with Proven Efficiency Gains.',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Top Leadership Challenges',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Hybrid Working Rights Compliance',
            description:
              'Navigate UK Employment Rights Act and hybrid working legislation with strategic technology solutions. Seamlessly integrate remote and office workflows while ensuring compliance with statutory flexible working rights across London, Manchester, Birmingham, and regional UK offices.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Digital Skills Training for UK Teams',
            description:
              'Accelerate digital transformation with comprehensive training programmes for UK businesses. Our local experts minimise productivity disruptions while ensuring teams master new technologies, supporting your digital strategy objectives.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Work-Life Balance & Right to Disconnect',
            description:
              'Enhance work-life integration through intelligent automation supporting UK workplace wellness regulations. Automate routine administrative tasks, enabling focus on high-value work while maintaining healthy boundaries.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Professional Development & Upskilling',
            description:
              'Empower UK teams with process optimisation skills that drive continuous improvement. Support the government\'s Lifetime Skills Guarantee by enabling staff to identify inefficiencies and implement enhanced systems.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Cross-Regional Team Cohesion',
            description:
              'Strengthen collaboration across England, Scotland, Wales, and Northern Ireland through unified communication platforms, maintaining transparency regardless of location.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'monday.com Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Save Time with Automations',
            description:
              'Automated workflows on monday.com function as your dedicated process manager, continuously operating behind the scenes to guarantee that your initiatives progress seamlessly and productively.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Document Management & Data Sovereignty',
            description:
              'Create comprehensive business documents with real-time project data integration. Maintain UK data residency requirements and support Companies House filing obligations with organised digital documentation.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Business Intelligence Dashboards',
            description:
              'Transform operational data into insights that support strategic decision-making for UK businesses. Present KPIs aligned with UK GAAP accounting standards and regulatory reporting requirements.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Agile Project Organisation',
            description:
              'Organise projects using methodologies popular across UK tech hubs including London\'s Silicon Roundabout, Manchester\'s digital corridor, and Edinburgh\'s fintech sector.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'UK Software Integration',
            description:
              'Integrate seamlessly with popular UK business tools including Sage and Xero. Connect with UK accounting software to maintain centralised workflows that support your business operations.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Process Discovery \u2192 Business Process Audit',
            description:
              'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Technical Architecture \u2192 System Integration Scope',
            description:
              'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Solution Design \u2192 Implementation',
            description:
              'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
            description:
              'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Change Readiness \u2192 Adoption & Training Strategies',
            description:
              'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.',
          },
        ]),
      },
    ]),
    methodologyHeading: STANDARD_METHODOLOGY_HEADING,
    methodologySteps: STANDARD_METHODOLOGY,
    calendlyHeading: 'Book A 30-Min Consultation with A monday.com Expert',
    calendlySubheading:
      'Schedule a personalised monday.com demo with our certified monday.com consultants to discover how the platform can be customised for your specific business needs. Experience the full potential of monday.com with our exclusive 4-week extended free trial, giving you ample time to explore advanced features and see measurable results.',
    faqTabs: withKeys([
      FAQ_PROFESSIONAL_SERVICES,
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_EXPERT_CONSULTANT_GUIDE,
      FAQ_GENERAL_QUESTIONS,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  'monday-partner-us': {
    comparisonHeading: 'Teams Transformed with Proven Efficiency Gains.',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Top Leadership Challenges',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Remote Work & Hybrid Compliance',
            description:
              'Navigate evolving US remote work legislation and state-specific employment laws with strategic technology solutions. Seamlessly integrate remote and office workflows while ensuring compliance with FLSA requirements, state labor laws, and emerging hybrid work regulations across all 50 states.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Digital Transformation Training for US Teams',
            description:
              'Accelerate digital adoption with comprehensive training programs designed for American businesses. Our US-based experts minimize productivity disruptions while ensuring teams master new technologies and maintain a competitive advantage in global markets.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Work-Life Balance & Employee Wellness',
            description:
              'Enhance work-life integration through intelligent automation that supports US workplace wellness initiatives and emerging "right to disconnect" discussions. Automate routine administrative tasks, enabling focus on high-value strategic work.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Professional Development & Skills Training',
            description:
              'Empower US teams with process optimization skills that drive continuous improvement. Support workforce development initiatives by enabling employees to identify operational inefficiencies and implement enhanced systems that boost productivity and career advancement.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Cross-Timezone Team Collaboration',
            description:
              'Strengthen collaboration across US time zones from Pacific to Eastern, including remote teams in Hawaii and Alaska. Maintain transparency and foster strong connections regardless of location, from Silicon Valley to New York City.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'monday.com Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Save Time with Automations',
            description:
              'Automated workflows on monday.com function as your dedicated process manager, continuously operating behind the scenes to guarantee that your initiatives progress seamlessly and productively.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Centralized Document Management',
            description:
              'Create comprehensive business documents with real-time project data integration from any board in your monday.com workspace.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Business Intelligence & Analytics',
            description:
              'Transform operational data into actionable insights that support strategic decision-making. Present KPIs aligned with your accounting standards and reporting requirements.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Agile Project Organization',
            description:
              'Organize projects using methodologies popular across US innovation hubs including Silicon Valley, Austin\'s tech corridor, Boston\'s biotech sector, and New York\'s fintech industry.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'US Software Integration',
            description:
              'Integrate seamlessly with popular American business tools including QuickBooks US, Salesforce, Microsoft 365, and enterprise CRM systems.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Process Discovery \u2192 Business Process Audit',
            description:
              'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Technical Architecture \u2192 System Integration Scope',
            description:
              'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Solution Design \u2192 Implementation',
            description:
              'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
            description:
              'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Change Readiness \u2192 Adoption & Training Strategies',
            description:
              'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.',
          },
        ]),
      },
    ]),
    methodologyHeading: STANDARD_METHODOLOGY_HEADING,
    methodologySteps: STANDARD_METHODOLOGY,
    calendlyHeading: 'Book A 30-Min Consultation With A monday.com Expert',
    calendlySubheading:
      'Schedule a personalized monday.com demonstration with our certified monday.com implementation consultants to discover how the platform can be tailored to your unique business requirements. Unlock monday.com\'s complete potential with our exclusive 4-week extended free trial period, providing comprehensive time to explore advanced workflow features and achieve measurable productivity results.',
    faqTabs: withKeys([
      FAQ_PROFESSIONAL_SERVICES,
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_EXPERT_CONSULTANT_GUIDE,
      FAQ_GENERAL_QUESTIONS,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  'monday-partner-singapore': {
    comparisonHeading: 'Teams Transformed with Proven Efficiency Gains.',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Top Leadership Challenges',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Hybrid Work & ASEAN Compliance',
            description:
              'Navigate diverse Southeast Asian employment regulations and hybrid work policies across Singapore, Malaysia, Thailand, Indonesia, Philippines, and Vietnam. Seamlessly integrate remote and office workflows while ensuring compliance with local labor laws and data localisation requirements.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Digital Transformation Training for ASEAN Teams',
            description:
              'Accelerate digital adoption with comprehensive training programs designed for Southeast Asian businesses. Our regional experts minimise productivity disruptions while ensuring teams master new technologies, while maintaining a competitive advantage in the workplace.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Work-Life Balance & Regional Wellness',
            description:
              'Enhance work-life integration through intelligent automation that supports Southeast Asian workplace wellness standards and cultural expectations. Automate routine administrative tasks, enabling focus on high-value strategic work while respecting regional work-life balance traditions.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Professional Development & Skills Enhancement',
            description:
              'Empower ASEAN teams with process optimisation skills that drive continuous improvement. Support regional upskilling initiatives by enabling employees to identify operational inefficiencies and implement enhanced systems that boost productivity across diverse cultural contexts.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Multi-Country Team Coordination',
            description:
              'Strengthen collaboration across ASEAN time zones and diverse cultural backgrounds from Singapore to Manila to Bangkok. Maintain transparency and foster strong connections regardless of location, supporting seamless operations across Southeast Asian markets.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'monday.com Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Save Time with Automations',
            description:
              'Automated workflows on monday.com function as your dedicated process manager, continuously operating behind the scenes to guarantee that your initiatives progress seamlessly and productively.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Centralised Documentation',
            description:
              'You can create rich documents directly within monday and embed real-time project information from any of your boards within those docs.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Business Intelligence for ASEAN Markets',
            description:
              'Transform operational data into actionable insights for Southeast Asian businesses. Present KPIs aligned with local accounting standards (Singapore FRS, Malaysian MFRS, Thai TFRS) and regional reporting requirements.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Agile Project Organisation',
            description:
              'Organise projects using methodologies popular across ASEAN innovation hubs including Singapore\'s fintech sector, Kuala Lumpur\'s digital economy, Bangkok\'s startup ecosystem, and Jakarta\'s e-commerce corridor.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Integrate with Other Tools',
            description:
              'Consolidate all your information within monday to boost team synchronisation and enhance organisational efficiency. Eliminate switching between isolated applications and ensure nothing gets overlooked.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Process Discovery \u2192 Business Process Audit',
            description:
              'Our SEA-based certified consultants meticulously map existing workflows against Southeast Asian industry benchmarks. Analyse operational bottlenecks specific to ASEAN regulatory requirements and competitive pressures in Asia-Pacific markets.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Technical Architecture \u2192 System Integration Scope',
            description:
              'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Solution Design \u2192 Implementation',
            description:
              'Implement balanced automation systems optimised for Southeast Asian business practices and multicultural user adoption. Our solutions scale with your team\'s expertise while respecting diverse regional workplace cultures and communication styles.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
            description:
              'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Change Readiness \u2192 Adoption & Training Strategies',
            description:
              'Our proven framework measures organisational readiness within diverse ASEAN workplace cultures. Craft adoption strategies that work across different cultural contexts, transforming resistance into enthusiastic system adoption while respecting local business practices.',
          },
        ]),
      },
    ]),
    methodologyHeading: STANDARD_METHODOLOGY_HEADING,
    methodologySteps: withKeys([
      {
        _type: 'methodologyStep',
        number: '01',
        title: 'Process Discovery \u2192 Business Process Audit',
        description:
          'Our SEA-based certified consultants meticulously map existing workflows against Southeast Asian industry benchmarks. Analyse operational bottlenecks specific to ASEAN regulatory requirements and competitive pressures in Asia-Pacific markets.',
      },
      {
        _type: 'methodologyStep',
        number: '02',
        title: 'Technical Architecture \u2192 System Integration Scope',
        description:
          'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
      },
      {
        _type: 'methodologyStep',
        number: '03',
        title: 'Solution Design \u2192 Implementation',
        description:
          'Implement balanced automation systems optimised for Southeast Asian business practices and multicultural user adoption. Our solutions scale with your team\'s expertise while respecting diverse regional workplace cultures and communication styles.',
      },
      {
        _type: 'methodologyStep',
        number: '04',
        title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
        description:
          'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
      },
      {
        _type: 'methodologyStep',
        number: '05',
        title: 'Change Readiness \u2192 Adoption & Training Strategies',
        description:
          'Our proven framework measures organisational readiness within diverse ASEAN workplace cultures. Craft adoption strategies that work across different cultural contexts, transforming resistance into enthusiastic system adoption while respecting local business practices.',
      },
    ]),
    calendlyHeading: 'Schedule a 30 minute Call With One of Our monday.com Consultants Today',
    calendlySubheading:
      'From initial process discovery to full system adoption, our proven methodology ensures seamless digital transformation that empowers your team and drives sustainable operational efficiency.',
    faqTabs: withKeys([
      FAQ_PROFESSIONAL_SERVICES,
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_EXPERT_CONSULTANT_GUIDE,
      FAQ_GENERAL_QUESTIONS,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  'monday-partner-india': {
    comparisonHeading: 'Teams Transformed with Proven Efficiency Gains.',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Top Leadership Challenges',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Financial Uncertainty',
            description:
              'Improving reporting visibility of business performance to make better decisions and to quickly correct course on strategic initiatives.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'AI & Automation',
            description:
              'Team enablement and implementation of AI & Automation technologies to improve workforce efficiency and unlock hidden inefficiencies.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Hybrid Work Management',
            description:
              'Optimising productivity and culture across distributed teams while maintaining operational excellence.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Talent Retention & Personal Development',
            description:
              'Attracting and keeping key talent in a competitive market while upskilling for future needs.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Cybersecurity & Digital Risk',
            description:
              'Protecting against evolving threats while ensuring data privacy and regulatory compliance.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'monday.com Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Save Time with Automations',
            description:
              'Automated workflows on monday.com function as your dedicated process manager, continuously operating behind the scenes to guarantee that your initiatives progress seamlessly and productively.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Centralised Documentation',
            description:
              'You can create rich documents directly within monday and embed real-time project information from any of your boards within those docs.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Visualise with Dashboards and Charts',
            description:
              'Turn project data into visually engaging and easily digestible information. This not only simplifies data analysis but also improves decision-making by presenting data in a more clear and actionable format.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Flexible Organisation',
            description:
              'Organise projects using Agile or traditional methodologies popular across Melbourne, Sydney, and regional business hubs.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Integrate with other tools',
            description:
              'Keep all your data in monday.com and integrate with Xero, MYOB and Aircall to increase team alignment and improve business organisation. Avoid juggling disconnected apps and make sure nothing falls between the cracks.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Process Discovery \u2192 Business Process Audit',
            description:
              'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Technical Architecture \u2192 System Integration Scope',
            description:
              'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Solution Design \u2192 Implementation',
            description:
              'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
            description:
              'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Change Readiness \u2192 Adoption & Training Strategies',
            description:
              'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.',
          },
        ]),
      },
    ]),
    methodologyHeading: STANDARD_METHODOLOGY_HEADING,
    methodologySteps: STANDARD_METHODOLOGY,
    calendlyHeading: 'Schedule A 30-Min Consultation With One of Our monday.com Implementation Consultants',
    calendlySubheading: '',
    faqTabs: withKeys([
      FAQ_PROFESSIONAL_SERVICES,
      FAQ_MONDAY_WORK_MANAGEMENT,
      FAQ_MONDAY_CRM,
      FAQ_EXPERT_CONSULTANT_GUIDE,
      FAQ_GENERAL_QUESTIONS,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  /* =================================================================
   * SERVICE PAGE
   * ================================================================= */

  'monday-crm-consulting': {
    comparisonHeading: 'Implement monday CRM for any team',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Why monday.com for Your CRM Needs',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Customized to Your Sales Cycle',
            description:
              'Easily tailor your CRM to work for you, without any development help. Edit deal stages and add as many columns as you\'d like. Manage multiple pipelines at once. Gain insights through advanced reporting. Set up automated workflows that trigger based on your unique deal progression.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Maximize Engagement with Every Contact',
            description:
              'Centralise customer data for a holistic view. Efficiently reach contacts at every stage of your pipeline with the right message. Personalised sequences, mass emailing & tracking, and AI email writing. Keep record of your contact and account information, log activities, and send emails \u2014 all from one place.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Pre-Sales to Post-Sales All in One Place',
            description:
              'Customisable CRM workflows and dashboards. User-friendly interface for quick adoption. Robust CRM integrations with popular tools. Scalable CRM solution for growing businesses. Secure and reliable cloud-based CRM infrastructure.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'monday.com CRM Features',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Lead Management Solutions',
            description:
              'Add leads with item creation forms to improve efficiency. Collect leads from any source. Centralise and qualify every lead in one place. Automatically score leads based on custom criteria.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Deal Management',
            description:
              'Customise your pipeline without the need for a developer. Drag and drop deals between stages. Automate manual work. Easily track all contact interactions.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Post-Sales Management',
            description:
              'Manage your post-sale activities in one place. Stay on top of client projects. Collection tracking. Monitor customer satisfaction and retention metrics.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Sales Operations',
            description:
              'Plan and fast-track your sales hiring process. Equip your sales team with the tools and resources they need to close more deals. Track sales performance and team productivity metrics. Optimise sales processes through data-driven insights.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Our Approach',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Process Discovery \u2192 Business Process Audit',
            description:
              'Our certified monday.com consultants meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Technical Architecture \u2192 System Integration Scope',
            description:
              'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Solution design \u2192 Workflow and Integration Implementation',
            description:
              'Through in-depth solution design analysis, we implement the perfect balance between automated system sophistication and user adoption, ensuring your solution is scalable and grows with your team\'s expertise.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
            description:
              'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Change Readiness \u2192 Adoption Strategy Planning',
            description:
              'Our proven change impact framework measures organisational readiness and crafts a tailored adoption strategy, turning potential resistance into enthusiastic system adoption.',
          },
        ]),
      },
    ]),
    methodologyHeading: STANDARD_METHODOLOGY_HEADING,
    methodologySteps: withKeys([
      {
        _type: 'methodologyStep',
        number: '01',
        title: 'Process Discovery \u2192 Business Process Audit',
        description:
          'Our certified monday.com consultants meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
      },
      {
        _type: 'methodologyStep',
        number: '02',
        title: 'Technical Architecture \u2192 System Integration Scope',
        description:
          'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
      },
      {
        _type: 'methodologyStep',
        number: '03',
        title: 'Solution design \u2192 Workflow and Integration Implementation',
        description:
          'Through in-depth solution design analysis, we implement the perfect balance between automated system sophistication and user adoption, ensuring your solution is scalable and grows with your team\'s expertise.',
      },
      {
        _type: 'methodologyStep',
        number: '04',
        title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
        description:
          'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
      },
      {
        _type: 'methodologyStep',
        number: '05',
        title: 'Change Readiness \u2192 Adoption Strategy Planning',
        description:
          'Our proven change impact framework measures organisational readiness and crafts a tailored adoption strategy, turning potential resistance into enthusiastic system adoption.',
      },
    ]),
    calendlyHeading: 'Schedule A 30-Min Consultation With One of Our monday.com CRM Consulting Experts',
    calendlySubheading:
      'Schedule a demo with our monday.com implementation consultants to discover how monday.com can be customised for your business, and get a free 4-week extended trial to experience its full potential.',
    faqTabs: withKeys([
      {
        _type: 'faqTab',
        label: 'monday CRM',
        items: withKeys([
          {
            _type: 'faqItem',
            question: 'What is monday CRM used for?',
            answer:
              'monday CRM allows you to have full control over your sales pipeline, manage your contacts, streamline your post sales processes and sales enablement, all while seeing the big picture at a glance.',
          },
          {
            _type: 'faqItem',
            question: 'Is monday.com a good CRM tool?',
            answer:
              'Yes, monday.com can be a great CRM tool, particularly for businesses that value flexibility, customization, and ease of use. Key features that make monday.com a great CRM tool include contact management, pipeline management, automation, and customisation.',
          },
          {
            _type: 'faqItem',
            question: 'Does monday.com CRM provide good value for investment?',
            answer:
              'If your priorities include rapid implementation, extensive customization capabilities, and maintaining a unified workspace, then monday CRM delivers excellent value proposition.',
          },
          {
            _type: 'faqItem',
            question: 'How does monday.com compare to Salesforce?',
            answer:
              'monday.com and Salesforce serve different market segments with distinct capabilities. Salesforce operates as an enterprise-grade CRM solution ideally designed for large corporations with sophisticated needs, whereas monday.com excels through its intuitive interface, adaptability, and implementation simplicity, positioning it perfectly for SMBs requiring powerful yet expandable solutions.',
          },
          {
            _type: 'faqItem',
            question: 'How does monday.com compare to Hubspot?',
            answer:
              'Hubspot is a great tool for Marketing teams, but it lacks in CRM and Project Management capabilities. We have also found from our clients who have switched over to monday.com with our services that they saved on technical administration costs with monday.com due to the cost to develop on Hubspot.',
          },
          {
            _type: 'faqItem',
            question: 'How does monday.com compare to Zoho?',
            answer:
              'Zoho is a cheaper CRM alternative, making it great for teams who are looking for a basic CRM that they don\'t plan on changing as their business evolves. Another key factor that pushed our clients to migrate off of Zoho CRM to monday CRM is due to Zoho\'s limited support.',
          },
          {
            _type: 'faqItem',
            question: 'Can monday.com integrate with other tools and CRMs?',
            answer:
              'Yes, monday.com integrates with email, project management, marketing, and financial tools, including Gmail & Outlook, Slack & Microsoft Teams, HubSpot, Salesforce, Mailchimp, QuickBooks & Xero. Custom integrations via API or Zapier are also available for unique workflows.',
          },
        ]),
      },
      FAQ_EXPERT_CONSULTANT_GUIDE,
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  /* =================================================================
   * GENERIC PAGES
   * ================================================================= */

  'about-us': {
    comparisonHeading: '500+ Teams Transformed. Proven Efficiency Gains.',
    comparisonSubheading: '',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'Top Leadership Challenges',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Market volatility and uncertainty',
            description:
              'demand real-time project visibility and reporting capabilities that enable quick pivots in strategy and resource allocation, helping organisations make data-driven decisions to maintain competitive advantage and adapt to changing conditions.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'AI and automation in project management',
            description:
              'requires careful implementation to boost team efficiency while managing change resistance, focusing on streamlined workflows, automated routine tasks, and AI-powered insights for better decision making.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Hybrid work models challenge project leaders',
            description:
              'to balance in-office and remote team dynamics, requiring robust digital collaboration tools, clear communication protocols, and standardised processes to maintain productivity across distributed teams.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Talent retention in project management',
            description:
              'hinges on creating engaging work environments with clear growth paths, balanced workloads, and opportunities for skill development, while ensuring knowledge transfer and team cohesion amid turnover.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Cybersecurity and digital risk management',
            description:
              'must be integrated into project workflows through secure access controls, compliant data handling, and protected collaboration tools, without compromising team efficiency or communication effectiveness.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Top Team Challenges',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Hybrid collaboration',
            description:
              'demands strategic tool selection that seamlessly integrates remote and in-office workflows, ensuring clear communication channels, balanced workload distribution, and effective team coordination across all work environments.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Digital adaptation success',
            description:
              'relies on comprehensive training programs that quickly bring teams up to speed on new technologies while minimising productivity dips, supported by expert guidance and practical learning approaches.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Work-life integration improves',
            description:
              'through intelligent automation of routine tasks, freeing team members from manual processes and allowing them to focus on high-value work while maintaining better personal boundaries.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Personal development',
            description:
              'focuses on empowering team members with process optimisation skills, enabling them to identify inefficiencies and implement improved systems that enhance both individual and team performance.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Team cohesion strengthens',
            description:
              'through unified communication and work management platforms that create transparency, foster collaboration, and maintain strong team connections regardless of physical location.',
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'How We Can Help',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Process Discovery \u2192 Business Process Audit',
            description:
              'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Technical Architecture \u2192 System Integration Scope',
            description:
              'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Solution Design \u2192 Implementation',
            description:
              'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
            description:
              'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Change Readiness \u2192 Adoption & Training Strategies',
            description:
              'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.',
          },
        ]),
      },
    ]),
    methodologyHeading: STANDARD_METHODOLOGY_HEADING,
    methodologySteps: STANDARD_METHODOLOGY,
    calendlyHeading: 'Schedule A 30-Min Consultation With One of Our monday.com Consultants',
    calendlySubheading:
      'Fruition\'s monday.com Automations Drive Scalability and Cost Savings. As a Platinum monday.com partner, Fruition builds automated business solutions that integrate seamlessly into existing systems to help companies work faster, smarter, and more affordably.',
    faqTabs: withKeys([]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },

  careers: {
    // Hero — eyebrow "Careers" above the big heading "Build Solutions That Matter"
    heroEyebrow: 'Careers',
    heroHeading: 'Build Solutions That Matter',
    heroSubheading:
      'At Fruition, we design solutions that simplify, scale and transform the way teams operate. As a Platinum monday.com partner, we tailor workflows, automations and integrations that turn software into a growth engine.',
    primaryCtaLabel: '\uD83D\uDE80 Join Us',
    primaryCtaUrl: '#application-form',
    // Explicitly no hero video on careers
    heroVideoUrl: null,
    heroVideoTitle: null,

    // Benefits grid — "Why Join Fruition"
    capabilitiesEyebrow: 'BENEFITS',
    capabilitiesHeading: 'Why Join ',
    capabilitiesHeadingAccent: 'Fruition',
    capabilitiesSubheading: '',
    capabilitiesTheme: 'light',
    capabilitiesColumns: 2,
    capabilitiesCards: withKeys([
      {
        _type: 'capabilityCard',
        emoji: '\uD83D\uDCA1',
        title: 'Work That Makes an Impact',
        description:
          "Every solution you build directly transforms how our clients operate. You'll see the real-world impact of your work in faster processes, happier teams, and measurable ROI.",
      },
      {
        _type: 'capabilityCard',
        emoji: '\uD83D\uDCC8',
        title: 'Flexibility & Growth',
        description:
          "Join a team that values smart work, not just hard work. We're building something special, and there's room to grow your career as we scale.",
      },
      {
        _type: 'capabilityCard',
        emoji: '\uD83C\uDFAF',
        title: 'Upskill and Learn',
        description:
          "Work alongside expert consultants who are passionate about automation, workflow optimization, and user adoption. You'll continuously sharpen your skills on cutting-edge platforms while solving diverse business challenges.",
      },
      {
        _type: 'capabilityCard',
        emoji: '\uD83E\uDD1D',
        title: 'Client-Focused Culture',
        description:
          "We measure success by our clients' success. You'll be empowered to deliver solutions that truly serve their needs—not just check boxes. You'll have the autonomy to recommend the right solutions, the support to implement them seamlessly, and the satisfaction of seeing clients achieve faster time to value and meaningful ROI on their software investment.",
      },
    ]),

    // Secondary capabilities — "What We're Looking For" (3 parallel columns)
    secondaryCapabilitiesEyebrow: '',
    secondaryCapabilitiesHeading: "What We're Looking For",
    secondaryCapabilitiesHeadingAccent: '',
    secondaryCapabilitiesSubheading:
      "If you're passionate about helping businesses work better, we want to hear from you.",
    secondaryCapabilitiesColumns: 3,
    secondaryCapabilitiesCtaLabel: '\uD83D\uDE80 Join Us',
    secondaryCapabilitiesCtaUrl: '#application-form',
    secondaryCapabilitiesCards: withKeys([
      {
        _type: 'secondaryCapabilityCard',
        title: 'Problem-Solvers with a Consultant Mindset',
        description: '',
        bullets: withKeys([
          { _type: 'bullet', emoji: '\uD83E\uDDE9', text: 'Translate complex business needs into elegant automated workflows' },
          { _type: 'bullet', emoji: '\uD83D\uDD0D', text: 'Conduct thorough process audits to identify optimization opportunities' },
          { _type: 'bullet', emoji: '\u2753', text: 'Ask the right questions to uncover root causes, not just symptoms' },
        ]),
      },
      {
        _type: 'secondaryCapabilityCard',
        title: 'Technical Experts with a Human Touch',
        description: '',
        bullets: withKeys([
          { _type: 'bullet', emoji: '\uD83D\uDD17', text: 'Build seamless integrations that eliminate manual work' },
          { _type: 'bullet', emoji: '\uD83D\uDEE0\uFE0F', text: 'Design custom workflows that teams actually want to use' },
          { _type: 'bullet', emoji: '\u26A1', text: "Leverage monday.com's flexibility to deliver scalable, cost-effective solutions" },
        ]),
      },
      {
        _type: 'secondaryCapabilityCard',
        title: 'Growth-Minded Professionals Who Love Learning',
        description: '',
        bullets: withKeys([
          { _type: 'bullet', emoji: '\uD83D\uDCDA', text: 'Stay ahead of monday.com feature releases and best practices' },
          { _type: 'bullet', emoji: '\uD83E\uDDE0', text: 'Experiment with new automation ideas to unlock efficiencies' },
          { _type: 'bullet', emoji: '\uD83C\uDF0D', text: 'Share knowledge with teams, empowering them to innovate and adapt' },
        ]),
      },
    ]),

    // Remote team / global offices
    remoteTeamEyebrow: '\uD83C\uDF0D FULLY REMOTE',
    remoteTeamHeading: 'Work From Anywhere. ',
    remoteTeamHeadingAccent: 'Our Team Is Global.',
    remoteTeamSubheading:
      'Fruition is a 100% remote company. Our consultants, developers, and strategists collaborate across five countries — meaning you can work from home, a café, or wherever you do your best thinking.',
    officeLocations: withKeys([
      {
        _type: 'officeLocation',
        flag: '\uD83C\uDDE6\uD83C\uDDFA',
        city: 'Sydney',
        region: 'Head Office',
        address: '64 York Street\nNSW 2000, Australia',
      },
      {
        _type: 'officeLocation',
        flag: '\uD83C\uDDFA\uD83C\uDDF8',
        city: 'New York',
        region: 'North America',
        address: '205 W 37th St\nNew York, NY 10018',
      },
      {
        _type: 'officeLocation',
        flag: '\uD83C\uDDEC\uD83C\uDDE7',
        city: 'London',
        region: 'EMEA',
        address: 'Medius House, 2 Sheraton St\nLondon W1F 8BH',
      },
      {
        _type: 'officeLocation',
        flag: '\uD83C\uDDF8\uD83C\uDDEC',
        city: 'Singapore',
        region: 'South-East Asia',
        address: 'Serving clients\nacross the region',
      },
      {
        _type: 'officeLocation',
        flag: '\uD83C\uDDEE\uD83C\uDDF3',
        city: 'India',
        region: 'South Asia',
        address: 'Serving clients\nacross the region',
      },
    ]),
    remoteFeatures: withKeys([
      { _type: 'remoteFeature', emoji: '\uD83C\uDFE0', label: 'Work from home (or anywhere)' },
      { _type: 'remoteFeature', emoji: '\u23F0', label: 'Flexible hours' },
      { _type: 'remoteFeature', emoji: '\u2708\uFE0F', label: 'No relocation required' },
      { _type: 'remoteFeature', emoji: '\uD83C\uDF10', label: 'Global team collaboration' },
      { _type: 'remoteFeature', emoji: '\uD83D\uDCC5', label: 'Async-friendly culture' },
    ]),
    remoteTeamCtaLabel: '\uD83D\uDE80 Join Our Remote Team',
    remoteTeamCtaUrl: '#application-form',

    // Application form — monday.com WorkForms embed
    applicationFormHeading: 'APPLICATION FORM',
    applicationFormEmbedUrl: 'https://forms.monday.com/forms/embed/REPLACE_WITH_FORM_ID?r=use1',

    // Clear old tabs/methodology that previously occupied this slot
    comparisonHeading: '',
    comparisonSubheading: '',
    comparisonTabs: withKeys([]),
    methodologyHeading: '',
    methodologySteps: withKeys([]),
    calendlyHeading: '',
    calendlySubheading: '',
    faqTabs: withKeys([
      {
        _type: 'faqTab',
        label: 'Careers FAQ',
        items: withKeys([
          {
            _type: 'faqItem',
            question: 'How long does a monday.com implementation take?',
            answer:
              'The timeline for a monday.com implementation depends on the complexity of your workflows and integrations. A standard setup can take 2\u20134 weeks, while enterprise-level implementations with advanced automations, dashboards, and system integrations may take 6\u201312 weeks.',
          },
          {
            _type: 'faqItem',
            question: 'What does a monday.com implementation consultant do?',
            answer:
              'A monday.com consultant helps businesses translate processes into scalable workflows. They design custom automations, build integrations with third-party systems, set up dashboards, train teams, and ensure user adoption so your investment delivers measurable ROI.',
          },
          {
            _type: 'faqItem',
            question: 'What is included in a monday.com implementation package?',
            answer:
              'Typical packages include workflow design, automation setup, system integrations (like CRM, ERP, or HR tools), user training, change management planning, and post-launch optimization.',
          },
          {
            _type: 'faqItem',
            question: 'Why hire a monday.com implementation partner?',
            answer:
              'A certified monday.com partner ensures faster setup, fewer errors, and customized workflows tailored to your industry. They bring expertise in process mapping, automation, and adoption strategies\u2014saving you time and improving ROI.',
          },
          {
            _type: 'faqItem',
            question: 'How do I become a monday.com consultant or certified expert?',
            answer:
              'To become a certified monday.com consultant, you must complete monday.com\'s certification programs, demonstrate hands-on experience building workflows and automations, and often work with a certified partner to gain implementation expertise.',
          },
          {
            _type: 'faqItem',
            question: 'What industries benefit most from monday.com consulting services?',
            answer:
              'Industries like construction, manufacturing, professional services, marketing, government, and retail benefit from tailored monday.com implementations, as consultants optimize workflows to reduce inefficiencies, automate tasks, and centralize project management.',
          },
        ]),
      },
    ]),
    ...STANDARD_JOIN_STATS,
    ...STANDARD_LOGO_CLOUD,
  },
}

/* ------------------------------------------------------------------ */
/*  Main migration runner                                              */
/* ------------------------------------------------------------------ */

async function main() {
  const slugs = Object.keys(PAGE_DATA)
  console.log(`\nPopulating structured fields for ${slugs.length} pages...\n`)

  let patched = 0
  let skipped = 0

  for (const slug of slugs) {
    const data = PAGE_DATA[slug]

    // Find document by slug across all page types
    const doc = await writeClient.fetch<{ _id: string; _type: string } | null>(
      `*[slug.current == $slug && _type in ["industryPage","locationPage","partnershipPage","solutionPage","servicePage","page"]][0]{_id, _type}`,
      { slug },
    )

    if (!doc?._id) {
      console.log(`  [SKIP] No document found for slug: ${slug}`)
      skipped++
      continue
    }

    console.log(`  Patching ${slug} (${doc._type} ${doc._id})...`)
    try {
      await writeClient.patch(doc._id).set(data).commit()
      console.log(`  [OK] ${slug}`)
      patched++
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  [ERR] ${slug}: ${msg}`)
      skipped++
    }
  }

  console.log(`\nDone. Patched: ${patched}, Skipped: ${skipped}\n`)

  // ---- Verification: fetch 3 sample pages and print key fields ----
  console.log('=== Verification ===\n')
  const sampleSlugs = ['monday-for-construction', 'monday-partner-australia', 'monday-crm-consulting']
  for (const s of sampleSlugs) {
    const result = await writeClient.fetch(
      `*[slug.current == $slug && _type in ["industryPage","locationPage","partnershipPage","solutionPage","servicePage","page"]][0]{
        _id,
        _type,
        "slug": slug.current,
        comparisonHeading,
        "tabCount": count(comparisonTabs),
        "tabLabels": comparisonTabs[].label,
        methodologyHeading,
        "stepCount": count(methodologySteps),
        calendlyHeading,
        "faqTabCount": count(faqTabs),
        joinHeadingAccent,
        "statCount": count(joinStats),
        logoCloudHeadingAccent
      }`,
      { slug: s },
    )
    console.log(`\n--- ${s} ---`)
    console.log(JSON.stringify(result, null, 2))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
