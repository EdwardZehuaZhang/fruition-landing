import { writeClient } from './sanity-client'

const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'
const MONDAY_AFFILIATE = 'https://monday.com/crm?utm_source=Partner&utm_campaign=fruitionanz&utm_banner=fruition_monday_crm__4'

let keyCounter = 0
function k(prefix: string) { return `${prefix}-${++keyCounter}` }

// ──────────────────────────────────────────────────────────────────
// 1. monday-product-management  (solutionPage)
// ──────────────────────────────────────────────────────────────────
async function migrateProductManagement() {
  const docId = 'solutionPage-monday-product-management'
  const doc = {
    _id: docId,
    _type: 'solutionPage',
    title: 'monday.com for Product Management',
    slug: { _type: 'slug', current: 'monday-product-management' },
    seoTitle: 'monday.com for Product Management | Expert Consultants | Fruition',
    seoDescription: 'Transform your product management with monday.com expert consultants. Streamline development workflows, manage product roadmaps, and accelerate time-to-market.',
    heroHeading: 'Transform Your Product Management with monday.com Expert Consultants',
    heroSubheading: 'Product teams worldwide are discovering why monday.com has become the leading product management platform for streamlining development workflows, managing product roadmaps, and accelerating time-to-market.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_AFFILIATE,

    capabilitiesHeading: 'Why Product Teams Choose monday.com for ',
    capabilitiesHeadingAccent: 'Product Management',
    capabilitiesSubheading: "monday.com's product roadmap software capabilities transform how teams plan, track, and execute product strategies. Unlike traditional product management tools, monday.com provides:",
    capabilitiesCards: [
      { _key: k('pm-cap'), _type: 'capabilityCard', emoji: '🗺️', title: 'Visual Product Roadmaps', description: 'Aligning stakeholders and communicate product vision.' },
      { _key: k('pm-cap'), _type: 'capabilityCard', emoji: '🏁', title: 'Milestone Tracking', description: 'Milestone tracking with automated progress updates and notifications.' },
      { _key: k('pm-cap'), _type: 'capabilityCard', emoji: '🤝', title: 'Cross-functional Collaboration', description: 'Enhancing communication between product, engineering, and marketing teams.' },
      { _key: k('pm-cap'), _type: 'capabilityCard', emoji: '📊', title: 'Real-time Reporting', description: 'Real-time reporting and updates regarding product development progress and bottlenecks.' },
    ],

    comparisonHeading: 'monday.com Product Management Capabilities',
    comparisonTabs: [
      {
        _key: k('pm-ct'), _type: 'comparisonTab', label: 'Epic & Feature Management',
        items: [
          { _key: k('pm-ci'), _type: 'comparisonItem', number: '01', title: 'Epic & Feature Management', description: "monday.com's hierarchical board structure enables sophisticated product planning. Teams can break down product initiatives into manageable components.", bullets: [
            { _key: k('pm-b'), _type: 'bullet', emoji: '🎯', text: 'High-level epics linked to strategic objectives' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '🗺️', text: 'User story mapping with acceptance criteria' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '📋', text: 'Feature specifications with detailed requirements' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '🔗', text: 'Dependency tracking across multiple product areas' },
          ]},
          { _key: k('pm-ci'), _type: 'comparisonItem', number: '02', title: 'Roadmap Visualisation', description: "The platform's timeline and Gantt chart views provide powerful roadmap visualisation.", bullets: [
            { _key: k('pm-b'), _type: 'bullet', emoji: '🏁', text: 'Multi-quarter product planning with milestone markers' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '💬', text: 'Stakeholder communication through automated roadmap updates' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '⚖️', text: 'Resource allocation and capacity planning' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '🔮', text: 'Scenario planning for different product launch timelines' },
          ]},
          { _key: k('pm-ci'), _type: 'comparisonItem', number: '03', title: 'Agile Approach', description: 'Monday.com seamlessly supports agile methodologies with:', bullets: [
            { _key: k('pm-b'), _type: 'bullet', emoji: '📅', text: 'Sprint planning and backlog management' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '🔄', text: 'Daily standup automation and progress reports' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '📊', text: 'Burndown charts and velocity tracking' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '🔍', text: 'Retrospective planning and action item tracking' },
          ]},
          { _key: k('pm-ci'), _type: 'comparisonItem', number: '04', title: 'Feature Request Management', description: 'Centralize and prioritize feature requests with:', bullets: [
            { _key: k('pm-b'), _type: 'bullet', emoji: '📥', text: 'Customer feedback integration from multiple channels' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '🗳️', text: 'Stakeholder voting and prioritisation' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '📊', text: 'Impact vs. effort scoring matrices' },
            { _key: k('pm-b'), _type: 'bullet', emoji: '🚀', text: 'Automated feature request routing to product teams' },
          ]},
        ],
      },
      {
        _key: k('pm-ct'), _type: 'comparisonTab', label: 'Our Approach',
        items: [
          { _key: k('pm-ci'), _type: 'comparisonItem', number: '01', title: 'Product Strategy & Vision Setting', description: 'Define product goals and key performance indicators. Create stakeholder alignment through shared monday.com dashboards. Establish product metrics and success criteria.' },
          { _key: k('pm-ci'), _type: 'comparisonItem', number: '02', title: 'Product Backlog Management', description: 'Manage sprint planning and backlog grooming. Prioritise features using monday.com\'s ranking and scoring capabilities. Track user stories and acceptance criteria.' },
          { _key: k('pm-ci'), _type: 'comparisonItem', number: '03', title: 'Cross-Team Coordination', description: 'Integrate development, design, and marketing workflows. Ensure consistent communication across all product stakeholders. Automate handoffs between teams.' },
        ],
      },
    ],

    methodologyHeading: 'How to Manage Products with monday.com: A Strategic Approach',
    methodologySteps: [
      { _key: k('pm-ms'), _type: 'methodologyStep', number: '01', title: 'Product Strategy & Vision Setting', description: 'Define product goals and key performance indicators. Create stakeholder alignment through shared monday.com dashboards. Establish product metrics and success criteria.' },
      { _key: k('pm-ms'), _type: 'methodologyStep', number: '02', title: 'Product Backlog Management', description: 'Manage sprint planning and backlog grooming. Prioritise features using monday.com\'s ranking and scoring capabilities. Track user stories and acceptance criteria.' },
      { _key: k('pm-ms'), _type: 'methodologyStep', number: '03', title: 'Cross-Team Coordination', description: 'Integrate development, design, and marketing workflows. Ensure consistent communication across all product stakeholders. Automate handoffs between teams.' },
    ],

    calendlyHeading: 'Schedule A 30-Min Consultation',
    calendlySubheading: 'Ready to transform your product management process?\n\nOur certified monday.com consultants offer complimentary consultations to help you assess your current product management challenges, design custom monday.com workflows, develop an implementation roadmap and identify integration opportunities with existing tools.',

    faqTabs: [
      {
        _key: k('pm-faq'), _type: 'faqTab', label: 'Product Management FAQs',
        items: [
          { _key: k('pm-fq'), _type: 'faqPair', question: 'What are the 5 C\'s of product management?', answer: 'The 5 C\'s of product management are a framework used to guide product managers in their decision-making processes and strategic planning. They are Customers, Competition, Company, Collaborators, Context.' },
          { _key: k('pm-fq'), _type: 'faqPair', question: 'What software is used for product management?', answer: '1. monday.com/Jira- for stories, tasks etc\n\n2. Figma/Figjam/Miro (much preferred vs figjam) - for wireframing, research presentations on competitors, mockups\n\n3. Google Docs - all other documentation\n\n4. Data.ai - competitor research on metrics in mobile games space\n\n5. ChatGPT premium (less as of late, seems worse with outputs) - proofing, research, generating dod but I always write first passes and do editing on outputs\n\n6. Amplitude / Tableau / DeltaDNA / Google Analytics - analytics visualizations and dashboards' },
          { _key: k('pm-fq'), _type: 'faqPair', question: 'The 7 stages of new product development', answer: '1. Generating ideas\n\n2. Screening ideas\n\n3. Creating a product strategy\n\n4. Building a product roadmap\n\n5. Prototyping\n\n6. Testing\n\n7. Product launch' },
          { _key: k('pm-fq'), _type: 'faqPair', question: 'Why do teams switch from ProductPlan to monday.com?', answer: 'ProductPlan users frequently migrate to Monday.com for several compelling reasons:\n\nEnhanced Collaboration: While ProductPlan focuses primarily on roadmap visualization, Monday.com provides end-to-end product workflow management, enabling seamless collaboration between product managers, developers, designers, and stakeholders.\n\nCost Efficiency: Monday.com\'s pricing structure often provides better value for growing product teams, especially when replacing multiple tools with a single platform.\n\nCustomization Flexibility: Unlike ProductPlan\'s rigid roadmap templates, Monday.com\'s customizable boards adapt to any product methodology, from Scrum to Kanban to hybrid approaches.\n\nIntegration Ecosystem: Monday.com\'s extensive integration library connects with development tools, customer feedback platforms, and analytics systems that product teams already use.' },
          { _key: k('pm-fq'), _type: 'faqPair', question: 'Why do teams switch from Roadmunk to monday.com?', answer: 'Product teams considering alternatives to Roadmunk find Monday.com offers superior:\n\nReal-time Collaboration: Monday.com\'s collaborative features enable instant updates and team communication, while Roadmunk\'s collaboration feels more static.\n\nWorkflow Automation: Automated status updates, notifications, and task assignments reduce manual work that typically consumes product managers\' time.\n\nScalability: Monday.com grows with organizations, supporting everything from startup product teams to enterprise-level product portfolios.\n\nData-Driven Decisions: Advanced reporting and analytics provide insights into product performance that inform strategic decisions.' },
          { _key: k('pm-fq'), _type: 'faqPair', question: 'Why are teams switching from Agile to monday.com?', answer: 'Many product teams are transitioning from traditional agile project management tools to Monday.com\'s comprehensive product management platform. Here\'s why this shift is accelerating:\n\nBeyond Basic Sprint Management: Traditional agile tools like Jira focus primarily on development task tracking, while Monday.com provides end-to-end product lifecycle management from ideation to launch and beyond.\n\nVisual Product Planning: Unlike text-heavy agile tools, Monday.com\'s visual interface makes product roadmaps and sprint progress immediately comprehensible to all stakeholders, not just technical teams.\n\nCross-Functional Integration: Agile tools typically serve development teams in isolation. Monday.com breaks down silos by connecting product, marketing, sales, and customer success teams in unified workflows.\n\nStakeholder Communication: Traditional agile reporting requires interpretation for business stakeholders. Monday.com\'s dashboards and automation provide clear, real-time visibility that executives and clients can understand without translation.\n\nReduced Tool Sprawl: Teams using separate tools for roadmapping, sprint planning, bug tracking, and stakeholder communication find Monday.com consolidates these functions, reducing complexity and improving data consistency.\n\nModern User Experience: Legacy agile tools often feel dated and complex. Monday.com\'s intuitive interface reduces training time and increases team adoption rates across all departments.' },
        ],
      },
    ],

    industryHeading: 'Industry-Specific Product Management Solutions',
    industryTabs: [
      {
        _key: k('pm-ind'), _type: 'industryTab', label: 'SaaS Product Management', title: 'SaaS Product Management', description: "SaaS companies leverage Monday.com's product management capabilities for:",
        benefits: [
          { _key: k('pm-ib'), _type: 'benefit', emoji: '🏃‍♂️', text: 'Feature Development Tracking — manage development sprints across multiple product areas' },
          { _key: k('pm-ib'), _type: 'benefit', emoji: '📈', text: 'Product-Market Fit Analysis — collect and analyse customer usage data and track product metrics' },
          { _key: k('pm-ib'), _type: 'benefit', emoji: '🚀', text: 'SaaS Product Launch Coordination — orchestrate cross-functional product launches and beta testing' },
        ],
      },
      {
        _key: k('pm-ind'), _type: 'industryTab', label: 'Manufacturing', title: 'Manufacturing Product Management', description: 'Manufacturing companies use Monday.com to streamline complex product development processes:',
        benefits: [
          { _key: k('pm-ib'), _type: 'benefit', emoji: '📐', text: 'New Product Development (NPD) — manage product design, engineering workflows and regulatory compliance' },
          { _key: k('pm-ib'), _type: 'benefit', emoji: '🔗', text: 'Quality Management Integration — link product specifications with quality control and CAPA processes' },
          { _key: k('pm-ib'), _type: 'benefit', emoji: '📋', text: 'Supply Chain Coordination — manage bill of materials (BOM), component sourcing and demand forecasting' },
        ],
      },
      {
        _key: k('pm-ind'), _type: 'industryTab', label: 'Retail', title: 'Retail Product Management', description: 'Retail organisations leverage monday.com for comprehensive product lifecycle management:',
        benefits: [
          { _key: k('pm-ib'), _type: 'benefit', emoji: '🛍️', text: 'Merchandise Planning and Buying — plan seasonal product collections, track performance and manage vendors' },
          { _key: k('pm-ib'), _type: 'benefit', emoji: '📋', text: 'Private Label Product Development — manage product specifications, sample approvals and production timelines' },
          { _key: k('pm-ib'), _type: 'benefit', emoji: '🔄', text: 'Omnichannel Product Management — synchronise product information and inventory across all sales channels' },
        ],
      },
    ],

    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ organisations',
    joinHeadingPart2: ' that have maximised their workflows with our monday.com expert support',
    joinStats: [
      { _key: k('pm-st'), _type: 'stat', value: '500+', label: 'clients globally' },
      { _key: k('pm-st'), _type: 'stat', value: '10+', label: 'years experience' },
      { _key: k('pm-st'), _type: 'stat', value: '1,050+', label: 'projects completed' },
    ],
  }

  await writeClient.createOrReplace(doc)
  console.log('✓ monday-product-management')
}

// ──────────────────────────────────────────────────────────────────
// 2. monday-for-hr  (solutionPage)
// ──────────────────────────────────────────────────────────────────
async function migrateHR() {
  const docId = 'solutionPage-monday-for-hr'
  const doc = {
    _id: docId,
    _type: 'solutionPage',
    title: 'monday.com for HR Operations',
    slug: { _type: 'slug', current: 'monday-for-hr' },
    seoTitle: 'monday.com for HR Operations | From Hire to Retire | Fruition',
    seoDescription: 'Transform fragmented HR processes into seamless, automated workflows. Expert monday.com HR solutions for talent management, employee experience, and strategic workforce outcomes.',
    heroHeading: 'monday.com for HR Operations',
    heroSubheading: 'From Hire to Retire - monday.com Expert Employee Lifecycle Solutions',
    primaryCtaLabel: '🚀 Book a Free Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_AFFILIATE,

    capabilitiesHeading: 'Streamline HR Operations with a ',
    capabilitiesHeadingAccent: 'monday.com Expert',
    capabilitiesSubheading: 'We transform fragmented HR processes into seamless, automated workflows that enhance cross-functional collaboration and deliver quantifiable value to your people operations.',
    capabilitiesCards: [
      { _key: k('hr-cap'), _type: 'capabilityCard', emoji: '👥', title: 'Streamlined Talent Management', description: 'Track entire employee lifecycle through customised boards - from recruitment pipelines and automated interview scheduling to onboarding journeys, skills development, and retention metrics. Integrate performance reviews and career development plans in one visible platform.' },
      { _key: k('hr-cap'), _type: 'capabilityCard', emoji: '💚', title: 'Employee Experience & Wellbeing', description: 'Monitor workplace satisfaction through automated pulse surveys, manage flexible work arrangements, and track wellbeing initiatives. Create dashboards for workload distribution, time-off management, and anonymous feedback collection, ensuring no team member gets overwhelmed.' },
      { _key: k('hr-cap'), _type: 'capabilityCard', emoji: '⚙️', title: 'Strategic HR Operations', description: 'Transform compliance, budget tracking, and resource allocation with automated reminders for certifications, policy reviews, and training deadlines. Create approval workflows for expenses and monitor ROI of HR initiatives through integrated financial dashboards.' },
      { _key: k('hr-cap'), _type: 'capabilityCard', emoji: '📊', title: 'Data-Driven Decision Making', description: 'Leverage real-time analytics dashboards to track key HR metrics across recruitment, retention, engagement, and DEI initiatives. Consolidate data from various HR systems to identify trends and make informed decisions about workforce planning and program effectiveness.' },
      { _key: k('hr-cap'), _type: 'capabilityCard', emoji: '📢', title: 'Change Management & Communication', description: 'Design structured project boards for organisational changes, breaking initiatives into clear phases with stakeholder mapping and progress tracking. Create centralised communication hubs for policies, announcements, and feedback collection, ensuring transparency across hybrid teams.' },
    ],

    comparisonHeading: 'HR Challenges & Solutions',
    comparisonTabs: [
      {
        _key: k('hr-ct'), _type: 'comparisonTab', label: 'HR Team Challenges',
        items: [
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '01', title: 'HR Technology & Employee Experience Management', description: 'Hybrid workforce management requires strategic HRIS integration and digital workplace solutions that support remote work policies, employee engagement platforms, and inclusive team dynamics while ensuring compliance and equitable experiences across all work arrangements and employment classifications.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '02', title: 'HR Digital Transformation & Training Solutions', description: 'Successful workforce digitisation depends on comprehensive change management consulting, employee training programs, and learning management systems (LMS) that include skills gap analysis, personalised development pathways, and continuous learning support to maintain productivity during technology adoption and organisational change.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '03', title: 'Employee Wellbeing Programs & HR Automation', description: 'Work-life balance initiatives improve through intelligent HR process automation, employee self-service portals, and streamlined administrative workflows that reduce burnout, support mental health programs, and enable focus on strategic talent management while enhancing employee satisfaction and retention rates.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '04', title: 'Talent Development & Performance Management', description: 'Professional growth strategies emphasise leadership development programs, performance optimisation training, and succession planning initiatives that build analytical capabilities, empower employees to drive continuous improvement, and prepare high-potential talent for career advancement opportunities.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '05', title: 'Organisational Culture & Internal Communications', description: 'Team collaboration strengthens through unified HR communication platforms, employee feedback systems, and transparent performance management tools that build organisational trust, facilitate knowledge management, support diversity and inclusion initiatives, and maintain strong company culture across distributed teams and remote work environments.' },
        ],
      },
      {
        _key: k('hr-ct'), _type: 'comparisonTab', label: 'How We Can Help',
        items: [
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '01', title: 'HR Process Assessment → Workforce Operations Audit', description: 'We comprehensively map your existing HR workflows and talent management processes against industry best practices, analysing bottlenecks in recruitment, onboarding, performance management, and employee lifecycle stages that prevent your organisation from scaling effectively and maintaining competitive talent acquisition.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '02', title: 'HRIS Evaluation → HR Technology Integration Analysis', description: 'Our technical assessment uncovers optimisation opportunities within your current HR technology stack, identifying precise automation solutions and system integrations that transform disconnected HR processes into unified employee experience platforms while ensuring data security and compliance requirements.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '03', title: 'HR Solution Design → Workflow Automation Implementation', description: 'Through comprehensive HR systems analysis, we implement the optimal balance between sophisticated automation capabilities and user-friendly interfaces, ensuring your HRIS solution scales with organisational growth while supporting employee self-service, manager effectiveness, and HR team productivity.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '04', title: 'Productivity Impact → HR ROI Measurement Analysis', description: 'By quantifying potential efficiency gains across talent acquisition, employee engagement, performance management, and administrative processes, we identify where HR automation and workforce optimisation deliver measurable returns on investment through reduced time-to-hire, improved retention rates, and enhanced employee satisfaction scores.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '05', title: 'Change Management → HR Adoption Strategy Development', description: 'Our proven organisational change framework assesses workforce readiness for new HR technologies and develops tailored employee training programs, communication strategies, and support systems that transform potential resistance into enthusiastic adoption of new people management processes and digital workplace tools.' },
        ],
      },
      {
        _key: k('hr-ct'), _type: 'comparisonTab', label: 'Our Approach',
        items: [
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '01', title: 'Needs Assessment 🎯', description: 'Assess your HR needs and goals to understand what you want to achieve with an HRIS. By clearly understanding your requirements, we can align the system\'s features with your specific needs.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '02', title: 'Thorough Research 🔍', description: 'Conduct comprehensive research to compare different HRIS options. Consider factors like pricing, features, and integrations, ensuring that the chosen system is the ideal fit for your HR needs.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '03', title: 'Seamless Configuration ⚙️', description: 'Once the HRIS is selected, configure the system to match your unique requirements. Set up custom workflows, automations, and permissions to ensure the HRIS aligns perfectly with your HR processes.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '04', title: 'System Rollout 🚀', description: 'Once configured and trained, it\'s time to roll out the HRIS to your team.' },
          { _key: k('hr-ci'), _type: 'comparisonItem', number: '05', title: 'Post-Construction Support 📈', description: 'Maintain client relationships with warranty tracking and maintenance scheduling. Historical project data improves future estimates and business processes.' },
        ],
      },
    ],

    featureListHeading: 'Why monday.com is the perfect fit for ',
    featureListHeadingAccent: 'People and Culture Teams',
    featureListTheme: 'dark',
    featureListColumns: 2,
    featureListItems: [
      { _key: k('hr-fl'), _type: 'featureItem', number: '01', title: 'Streamlined Employee Onboarding', description: 'Create customised workflows to ensure a smooth transition for new hires, track tasks, and monitor progress.' },
      { _key: k('hr-fl'), _type: 'featureItem', number: '02', title: 'HR Document Management', description: 'Securely store, access, and share important HR information.' },
      { _key: k('hr-fl'), _type: 'featureItem', number: '03', title: 'Vacation and Leave Tracking', description: 'Keep track of employee vacations, leaves, and time off effortlessly.' },
      { _key: k('hr-fl'), _type: 'featureItem', number: '04', title: 'Performance Management', description: 'Set objectives, monitor progress, and facilitate constructive conversations to support employee growth and development.' },
      { _key: k('hr-fl'), _type: 'featureItem', number: '05', title: 'Employee Database', description: 'Consolidate all employee information in one place.' },
      { _key: k('hr-fl'), _type: 'featureItem', number: '06', title: 'Training and Development', description: 'Manage employee training programs and professional development initiatives.' },
      { _key: k('hr-fl'), _type: 'featureItem', number: '07', title: 'Employee Surveys and Feedback', description: 'Utilise custom forms and surveys to collect valuable insights and improve the employee experience.' },
      { _key: k('hr-fl'), _type: 'featureItem', number: '08', title: 'Employee Recognition and Rewards', description: 'Create a culture of appreciation and recognition within your organisation.' },
      { _key: k('hr-fl'), _type: 'featureItem', number: '09', title: 'Compliance and Policy Management', description: 'Stay organised, track policy updates, and ensure adherence to regulations.' },
      { _key: k('hr-fl'), _type: 'featureItem', number: '10', title: 'Integration Power', description: 'Seamlessly integrate your HR tools and software to sync data and streamline HR processes.' },
    ],

    calendlyHeading: 'Schedule A 30-Min Session with One of Our monday.com Consultants',
    calendlySubheading: 'Ready to transform your HR process?\n\nOur certified Monday.com consultants offer complimentary consultations to help you assess your current challenges, design custom monday.com workflows, develop an implementation roadmap and identify integration opportunities with existing tools.',

    faqTabs: [
      {
        _key: k('hr-faq'), _type: 'faqTab', label: 'General HR Questions',
        items: [
          { _key: k('hr-fq'), _type: 'faqPair', question: 'Can Monday.com be used for HR?', answer: 'Absolutely. With monday.com, enable HR professionals to easily manage the entire hiring process, manage job applications and store contact information from candidates, and send out employee surveys and record answers automatically.' },
          { _key: k('hr-fq'), _type: 'faqPair', question: 'Does Monday.com do payroll?', answer: "Yes. Check out monday.com's check stub template here. A good check stub template helps ensure that your team members don't receive paychecks with errors, in addition to enabling you to keep an accurate and transparent payment record and a simple and cost-efficient payroll process." },
          { _key: k('hr-fq'), _type: 'faqPair', question: 'Does Monday com do resource management?', answer: 'Yes. monday.com can do resource management. Keep in mind, the right tools can make or break your ability to manage resources efficiently. Platforms like monday work management help you streamline planning, scheduling, and allocation, giving you real-time insights into resource availability and usage.' },
        ],
      },
    ],

    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ organisations',
    joinHeadingPart2: ' that have maximised their workflows with our monday.com expert support',
    joinStats: [
      { _key: k('hr-st'), _type: 'stat', value: '500+', label: 'clients globally' },
      { _key: k('hr-st'), _type: 'stat', value: '10+', label: 'years experience' },
      { _key: k('hr-st'), _type: 'stat', value: '1,050+', label: 'projects completed' },
    ],
  }

  await writeClient.createOrReplace(doc)
  console.log('✓ monday-for-hr')
}

// ──────────────────────────────────────────────────────────────────
// 3. solar-crm-solution  (solutionPage)
// ──────────────────────────────────────────────────────────────────
async function migrateSolarCRM() {
  const docId = 'solutionPage-solar-crm-solution'
  const doc = {
    _id: docId,
    _type: 'solutionPage',
    title: 'Solar CRM & Work Management Solution',
    slug: { _type: 'slug', current: 'solar-crm-solution' },
    seoTitle: 'Solar CRM & Work Management Solution | monday.com | Fruition',
    seoDescription: 'A solar-specific monday CRM & WM solution. Achieve operational excellence in your solar installation business with a sustainable competitive advantage.',
    heroHeading: 'A Solar-Specific monday CRM & WM Solution',
    heroSubheading: 'We believe achieving operational excellence in your solar installation business gives you a sustainable competitive advantage.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_AFFILIATE,

    capabilitiesHeading: 'Facing these ',
    capabilitiesHeadingAccent: 'challenges?',
    capabilitiesCards: [
      { _key: k('sol-cap'), _type: 'capabilityCard', emoji: '🔌', title: 'Disconnected Systems', description: 'Connect all of your workflows and departments in one Work OS, give team members visibility into the data they need to see, and streamline communication across your entire organisation with monday.com.' },
      { _key: k('sol-cap'), _type: 'capabilityCard', emoji: '👁️', title: 'Project Visibility Gaps', description: "Manage your team members' permission levels and broaden or restrict their visibility into projects." },
      { _key: k('sol-cap'), _type: 'capabilityCard', emoji: '📦', title: 'Inventory Management', description: 'Use the chart view and the dashboard widget for a streamlined view of the inventory management information you need most — like items requested from different manufacturers, how many products are on order, stock quantities and deficiencies — all at a glance.' },
      { _key: k('sol-cap'), _type: 'capabilityCard', emoji: '📞', title: 'Customer Communication Breakdowns', description: 'Break down silos between teams with shared workspaces and communication tools built right into your CRM, ensuring everyone stays aligned.' },
      { _key: k('sol-cap'), _type: 'capabilityCard', emoji: '📈', title: 'Difficulty Scaling', description: 'When you set up the right workflows and boards, monday allows you to easily scale as headcounts grow. monday.com is an end-to-end solution that centralises your tech stack, making it easy to integrate various tools and maintain an up-to-date view of your solar operations.' },
      { _key: k('sol-cap'), _type: 'capabilityCard', emoji: '🔧', title: 'Maintenance Responsibilities', description: 'monday features like automations and integrations enable you to keep maintenance to a minimum. Say goodbye to constant spreadsheet clean-ups and hello to monday doing most of the work for you.' },
    ],

    featureListHeading: 'Key ',
    featureListHeadingAccent: 'Features',
    featureListTheme: 'dark',
    featureListColumns: 2,
    featureListItems: [
      { _key: k('sol-fl'), _type: 'featureItem', number: '01', title: 'Sales Acceleration', description: 'Streamlined CPQ process with real-time inventory visibility and automated proposal generation.' },
      { _key: k('sol-fl'), _type: 'featureItem', number: '02', title: 'Operational Efficiency', description: 'Automated project board creation from accepted proposals with standardised installation workflows.' },
      { _key: k('sol-fl'), _type: 'featureItem', number: '03', title: 'Resource Optimisation', description: 'Integrated inventory management with supplier connections and automated reordering.' },
      { _key: k('sol-fl'), _type: 'featureItem', number: '04', title: 'Portfolio Management', description: 'Real-time visibility across all projects with performance tracking and resource allocation tools.' },
      { _key: k('sol-fl'), _type: 'featureItem', number: '05', title: 'Customer Lifecycle', description: 'Complete customer journey management from lead acquisition through installation and scheduled maintenance.' },
    ],

    solutionCards: [
      { _key: k('sol-sc'), _type: 'solutionCard', eyebrow: 'FASTER INVOICING', heading: 'Standardized CPQ process & accelerated quote-to-cash cycle', body: 'Invoice faster with integrations and automations. Track and manage all of your customers\' invoices in one place.' },
      { _key: k('sol-sc'), _type: 'solutionCard', eyebrow: 'PORTFOLIO MANAGEMENT', heading: 'Installation & Maintenance Portfolios', body: 'The portfolio solution is the place for portfolio and project managers to collaborate and execute with confidence, all while having the ability to easily report on their success across the organization.' },
      { _key: k('sol-sc'), _type: 'solutionCard', eyebrow: 'INVENTORY TRACKING', heading: 'Inventory App', body: 'The Inventory App integration allows you to enable real-time tracking of panels, inverters, batteries and other components and link inventory directly to quotes.' },
      { _key: k('sol-sc'), _type: 'solutionCard', eyebrow: 'FINANCIAL FORECASTING', heading: 'Sales Dashboards', body: 'Forecast revenue for your active deals and break down the forecast by month and by region. Sales dashboards allow you to pull data from multiple boards and see all of the data at a high level in one place.' },
    ],

    comparisonHeading: 'Before vs After',
    comparisonTabs: [
      {
        _key: k('sol-ct'), _type: 'comparisonTab', label: 'Before',
        items: [
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '❌', title: 'No inventory visibility', description: 'Sales team creates quotes with no visibility into inventory' },
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '❌', title: 'Manual re-entry', description: 'Info manually re-entered between sales and operations' },
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '❌', title: 'Siloed project data', description: 'Project data siloed within departments' },
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '❌', title: 'Limited visibility', description: 'Limited visibility into project status for management' },
        ],
      },
      {
        _key: k('sol-ct'), _type: 'comparisonTab', label: 'After',
        items: [
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '✅', title: 'Unified flow', description: 'Unified flow from lead through installation and maintenance' },
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '✅', title: 'Real-time visibility', description: 'Real-time visibility across all project phases' },
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '✅', title: 'Standardised templates', description: 'Standardised templates ensuring consistent quality' },
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '✅', title: 'Centralised data', description: 'Centralised data for strategic decision-making' },
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '✅', title: 'Automated handoffs', description: 'Automated handoffs between teams' },
        ],
      },
      {
        _key: k('sol-ct'), _type: 'comparisonTab', label: 'Results',
        items: [
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '50%', title: 'Reduction in repetitive admin tasks', description: '50% reduction in repetitive admin tasks' },
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '60%', title: 'Quicker quote-to-cash', description: '60% quicker quote-to-cash' },
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '30%', title: 'Increase in on-time delivery', description: '30% increase in on-time delivery' },
          { _key: k('sol-ci'), _type: 'comparisonItem', number: '20%', title: 'Reduction in carrying costs', description: '20% reduction in carrying costs' },
        ],
      },
    ],

    servicesHeading: 'Our ',
    servicesHeadingAccent: 'Services',
    servicesTheme: 'dark',
    servicesCards: [
      { _key: k('sol-svc'), _type: 'serviceCard', emoji: '🎨', title: 'Solution Design and Implementation', description: 'Custom monday.com solution design tailored to your solar business workflows.' },
      { _key: k('sol-svc'), _type: 'serviceCard', emoji: '⚙️', title: 'Workflow Customisation and Template Configuration', description: 'Pre-built and customised templates for solar installation and maintenance processes.' },
      { _key: k('sol-svc'), _type: 'serviceCard', emoji: '🔌', title: 'Integration with Third-Party Applications', description: 'Connect monday.com with your existing tools and systems for seamless data flow.' },
      { _key: k('sol-svc'), _type: 'serviceCard', emoji: '👥', title: 'User Training and Adoption Support', description: 'Comprehensive training to ensure your team gets the most out of monday.com.' },
    ],

    calendlyHeading: 'Schedule Your Personalised Demo with A monday.com Expert',
    calendlySubheading: 'Book a time with one of our monday consultants to see how monday CRM can be tailored to your specific business needs and start your 4-week extended trial.',

    joinHeadingPart1: 'We bring ',
    joinHeadingAccent: 'real returns on investment.',
    joinHeadingPart2: '',
    joinSubheading: 'Join 300+ organisations that have implemented with us.',
    joinStats: [
      { _key: k('sol-st'), _type: 'stat', value: '300+', label: 'businesses worldwide' },
      { _key: k('sol-st'), _type: 'stat', value: '50%', label: 'reduction in admin tasks' },
      { _key: k('sol-st'), _type: 'stat', value: '60%', label: 'quicker quote-to-cash' },
    ],
  }

  await writeClient.createOrReplace(doc)
  console.log('✓ solar-crm-solution')
}

// ──────────────────────────────────────────────────────────────────
// 4. monday-for-cabinetry-renovation  (solutionPage)
// ──────────────────────────────────────────────────────────────────
async function migrateCabinetry() {
  const docId = 'solutionPage-monday-for-cabinetry-renovation'
  const doc = {
    _id: docId,
    _type: 'solutionPage',
    title: 'monday.com for Installation & Renovation',
    slug: { _type: 'slug', current: 'monday-for-cabinetry-renovation' },
    seoTitle: 'monday.com for Cabinetry Renovation & Installation | Fruition',
    seoDescription: 'From initial measurements to final installation, monday.com gives cabinetry installation and remodeling companies the tools to mitigate project chaos and deliver exceptional client experiences.',
    heroHeading: 'monday.com Solution for Cabinetry Renovation',
    heroSubheading: 'From initial measurements to final installation, monday.com gives cabinetry installation and remodeling companies the tools to mitigate project chaos and deliver exceptional client experiences.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: 'https://calendly.com/zach-fruition/30-minute-consultation-experts?back=1',
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_AFFILIATE,

    capabilitiesHeading: 'Facing these ',
    capabilitiesHeadingAccent: 'challenges?',
    capabilitiesCards: [
      { _key: k('cab-cap'), _type: 'capabilityCard', emoji: '⏰', title: 'Project Scheduling Delays', description: "Use monday.com's timeline & calendar views with automations to keep schedules aligned and notify teams instantly of changes." },
      { _key: k('cab-cap'), _type: 'capabilityCard', emoji: '📞', title: 'Communication Gaps', description: 'Centralize communication, share project updates, and integrate email or Slack so all stakeholders stay in sync.' },
      { _key: k('cab-cap'), _type: 'capabilityCard', emoji: '🔄', title: 'Scope Creep', description: 'Track changes in real time with status updates, approval workflows, and cost-tracking dashboards to stay in control.' },
      { _key: k('cab-cap'), _type: 'capabilityCard', emoji: '💸', title: 'Profit Leakage', description: 'Use time-tracking, budget dashboards, and reporting to monitor profitability in real time.' },
      { _key: k('cab-cap'), _type: 'capabilityCard', emoji: '📦', title: 'Inventory Management', description: 'Manage inventory levels, link suppliers, and set low-stock alerts with connected boards and automations.' },
      { _key: k('cab-cap'), _type: 'capabilityCard', emoji: '🔍', title: 'Quality Control Issues', description: 'Build quality checklists, assign accountability, and automate approvals to catch issues before they escalate.' },
    ],

    featureListHeading: 'Key ',
    featureListHeadingAccent: 'Features',
    featureListTheme: 'dark',
    featureListColumns: 2,
    featureListItems: [
      { _key: k('cab-fl'), _type: 'featureItem', number: '01', title: 'Project Scheduling', description: 'Visual timelines and automated task assignments keep cabinetry projects on track from design through final installation.' },
      { _key: k('cab-fl'), _type: 'featureItem', number: '02', title: 'Inventory Management', description: 'Real-time material tracking with low-stock alerts and supplier coordination prevents costly shortages or delays.' },
      { _key: k('cab-fl'), _type: 'featureItem', number: '03', title: 'Client Communication', description: 'Centralized approvals, automated updates, and shared dashboards simplify collaboration and reduce miscommunication.' },
      { _key: k('cab-fl'), _type: 'featureItem', number: '04', title: 'Cost & Profitability Tracking', description: 'Budget dashboards, time-tracking, and change order management ensure projects stay profitable and on budget.' },
      { _key: k('cab-fl'), _type: 'featureItem', number: '05', title: 'Quality Control', description: 'Standardized checklists, inspection workflows, and escalation automations improve project consistency and client satisfaction.' },
    ],

    solutionCards: [
      { _key: k('cab-sc'), _type: 'solutionCard', eyebrow: 'PROJECT SCHEDULING', heading: 'Plan installations with timelines and automations.', body: 'monday.com helps cabinetry renovation companies align delivery dates, installer schedules, and client expectations with visual Gantt and calendar views to keep projects on track.' },
      { _key: k('cab-sc'), _type: 'solutionCard', eyebrow: 'INVENTORY TRACKING', heading: 'Track materials and supplies with real-time visibility.', body: 'From cabinets to hardware, monday.com centralizes inventory management, automates reorder alerts, and connects supplier data to prevent stock shortages and project delays.' },
      { _key: k('cab-sc'), _type: 'solutionCard', eyebrow: 'CLIENT COMMUNICATION', heading: 'Centralize approvals and updates for every project.', body: 'Designers, installers, and clients stay aligned in one platform. Share project updates, collect approvals, and streamline communication to reduce errors and rework.' },
      { _key: k('cab-sc'), _type: 'solutionCard', eyebrow: 'CHANGE ORDER MANAGEMENT', heading: 'Control scope changes and avoid costly overruns.', body: 'Track client requests, approvals, and updated costs in real time. monday.com makes change orders transparent and easy to manage, reducing disputes and delays.' },
    ],

    comparisonHeading: 'Before vs After',
    comparisonTabs: [
      {
        _key: k('cab-ct'), _type: 'comparisonTab', label: 'Before',
        items: [
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '❌', title: 'No inventory link', description: 'Cabinet quotes created with no link to inventory' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '❌', title: 'Manual re-entry', description: 'Job details manually re-entered between sales, design, and installation teams' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '❌', title: 'Siloed data', description: 'Project data siloed across spreadsheets, emails, and paper files' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '❌', title: 'Limited visibility', description: 'Limited visibility into project timelines and delays' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '❌', title: 'Miscommunication', description: 'Frequent miscommunication during handoffs between design, fabrication, and installers' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '❌', title: 'Admin overload', description: 'Overwhelming admin time spent tracking orders, invoices, and schedules' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '❌', title: 'Slow revenue', description: 'Long quote-to-cash cycles slowing revenue' },
        ],
      },
      {
        _key: k('cab-ct'), _type: 'comparisonTab', label: 'After',
        items: [
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '✅', title: 'Unified workflow', description: 'Unified workflow from client inquiry to final installation' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '✅', title: 'Real-time visibility', description: 'Real-time visibility across design, fabrication, and installation phases' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '✅', title: 'Standardized templates', description: 'Standardized templates ensuring consistent project delivery and quality control' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '✅', title: 'Centralized dashboards', description: 'Centralized dashboards for accurate scheduling and proactive decision-making' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '✅', title: 'Automated handoffs', description: 'Automated task assignments and seamless handoffs between departments' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '✅', title: '50% less admin', description: '50% reduction in admin work and faster project turnaround times' },
          { _key: k('cab-ci'), _type: 'comparisonItem', number: '✅', title: '60% faster cash', description: '60% quicker quote-to-cash with connected workflows' },
        ],
      },
    ],

    servicesHeading: 'Our ',
    servicesHeadingAccent: 'Services',
    servicesTheme: 'dark',
    servicesCards: [
      { _key: k('cab-svc'), _type: 'serviceCard', emoji: '🎨', title: 'Solution Design and Implementation', description: 'Custom monday.com solution design tailored to your cabinetry renovation workflows.' },
      { _key: k('cab-svc'), _type: 'serviceCard', emoji: '⚙️', title: 'Workflow Customisation and Template Configuration', description: 'Pre-built and customised templates for cabinetry installation and renovation processes.' },
      { _key: k('cab-svc'), _type: 'serviceCard', emoji: '🔌', title: 'Integration with Third-Party Applications', description: 'Connect monday.com with your existing tools and systems for seamless data flow.' },
      { _key: k('cab-svc'), _type: 'serviceCard', emoji: '👥', title: 'User Training and Adoption Support', description: 'Comprehensive training to ensure your team gets the most out of monday.com.' },
    ],

    calendlyHeading: 'Schedule Your Personalised Demo with A monday.com Expert',
    calendlySubheading: 'Book a time with one of our certified monday.com consultants to see how monday.com can be customized for your cabinetry renovation and installation business and start your free 4-week extended trial.',

    joinHeadingPart1: 'We bring ',
    joinHeadingAccent: 'real returns on investment.',
    joinHeadingPart2: '',
    joinSubheading: 'Join 500+ organisations that have implemented with us.',
    joinStats: [
      { _key: k('cab-st'), _type: 'stat', value: '500+', label: 'organisations' },
      { _key: k('cab-st'), _type: 'stat', value: '50%', label: 'reduction in admin work' },
      { _key: k('cab-st'), _type: 'stat', value: '60%', label: 'quicker quote-to-cash' },
    ],
  }

  await writeClient.createOrReplace(doc)
  console.log('✓ monday-for-cabinetry-renovation')
}

// ──────────────────────────────────────────────────────────────────
// 5. ai-strategy-and-execution  (servicePage)
// ──────────────────────────────────────────────────────────────────
async function migrateAI() {
  const docId = 'servicePage-ai-strategy-and-execution'
  const doc = {
    _id: docId,
    _type: 'servicePage',
    title: 'AI Strategy & Execution',
    slug: { _type: 'slug', current: 'ai-strategy-and-execution' },
    seoTitle: 'AI Strategy & Execution | AI Partners & Consultants | Fruition',
    seoDescription: 'Transform your business with AI strategy that drives ROI. We help build effective AI strategies, implement intelligent automation, and achieve measurable ROI through proven frameworks.',
    heroHeading: 'AI Partners & Consultants',
    heroSubheading: 'Transform Your Business with AI Strategy That Drives ROI.\n\nWe help build effective AI strategies, implement intelligent automation, and achieve measurable ROI through proven frameworks and expert consulting for your business. So you can go from curious about AI, to fully operationalised AI adoption at enterprise scale.',
    primaryCtaLabel: '🚀 Book a Meeting',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '📑 See Our Process',
    secondaryCtaUrl: '/ai-strategy-and-execution',

    capabilitiesHeading: 'Is it time to change your ',
    capabilitiesHeadingAccent: 'AI strategy?',
    capabilitiesCards: [
      { _key: k('ai-cap'), _type: 'capabilityCard', emoji: '😶‍🌫️', title: 'No Clear Digital Direction', description: 'Organisations with no clear digital transformation direction and AI strategy will lead to conflicting approaches and team members using different tools without coordination.' },
      { _key: k('ai-cap'), _type: 'capabilityCard', emoji: '🗂️', title: 'Lots of Data, Not Enough Insight', description: 'Your organisation data from customer interactions, operational metrics, market intelligence, performance dashboards—it\'s everywhere. Yet somehow, your team still struggles to make confident, data-driven decisions.' },
      { _key: k('ai-cap'), _type: 'capabilityCard', emoji: '🔥', title: "You're Scaling Fast—and Processes Are Starting to Break", description: "Congratulations—your business is growing faster than you ever imagined. New customers, expanding teams, increased revenue. But your team is working harder than ever but feeling less effective each day, and manual processes have hit their breaking point." },
      { _key: k('ai-cap'), _type: 'capabilityCard', emoji: '👥', title: 'Increasing Headcount when You Should be Amplifying Your Team', description: "You're solving capacity problems by adding headcount rather than exploring how AI could shave hours off of your existing team's workload and make them more productive." },
    ],

    comparisonHeading: 'Challenges & Solutions',
    comparisonSubheading: 'We transform fragmented business processes into cohesive, automated systems that enhance team collaboration and deliver measurable ROI across your entire organisation.',
    comparisonTabs: [
      {
        _key: k('ai-ct'), _type: 'comparisonTab', label: 'Top Team Challenges',
        items: [
          { _key: k('ai-ci'), _type: 'comparisonItem', number: '01', title: 'Leadership Alignment and Vision Issues', description: 'Business adoption of AI faces several operational headwinds, with aligning leadership being one of the most challenging. Leaders need new skills to navigate the AI-driven workplace revolution, including learning how to lead teams in which AI agents and humans collaborate.' },
          { _key: k('ai-ci'), _type: 'comparisonItem', number: '02', title: 'Skill Gaps and Training Challenges', description: 'Only half of frontline employees are using AI tools, indicating significant adoption gaps at the operational level. Teams commonly struggle with siloed expertise and skill gaps when it comes to AI, with projects often getting stuck in the proof-of-concept stage or developed in isolation, disconnected from real business needs.' },
          { _key: k('ai-ci'), _type: 'comparisonItem', number: '03', title: 'Employee Resistance and Fear', description: 'One of the most common obstacles to adopting Gen AI tools is the anxiety among employees. The fear that Gen AI might replace their jobs or change the nature of their work can lead to resistance.' },
          { _key: k('ai-ci'), _type: 'comparisonItem', number: '04', title: 'Communication and Expectation Misalignment', description: "Only 45% of employees and executives are seeing eye-to-eye regarding AI implementation, revealing significant communication gaps between leadership and staff. Organisations struggle with unrealistic expectations and a lack of clear vision, making it difficult for teams to understand AI's actual capabilities and limitations." },
        ],
      },
      {
        _key: k('ai-ct'), _type: 'comparisonTab', label: 'How We Can Help',
        items: [
          { _key: k('ai-ci'), _type: 'comparisonItem', number: '01', title: 'Process Discovery → Business Process Audit', description: 'We thoroughly examine your current operational flows compared to industry standards, uncovering workflow constraints and performance deficiencies that restrict your team\'s expansion capabilities.' },
          { _key: k('ai-ci'), _type: 'comparisonItem', number: '02', title: 'Technical Architecture → System Integration Scope', description: 'Our detailed technical evaluation exposes hidden value within your current technology environment, determining specific automation blueprint strategies to demonstrate how monday.com can turn isolated procedures into fluid operational systems.' },
          { _key: k('ai-ci'), _type: 'comparisonItem', number: '03', title: 'Solution design → Workflow and Integration Implementation', description: "Through detailed solution architecture evaluation, we establish the optimal equilibrium between advanced automated capabilities and team acceptance, guaranteeing your platform scales alongside your organisation's expertise." },
          { _key: k('ai-ci'), _type: 'comparisonItem', number: '04', title: 'Efficiency Impact → ROI Opportunity Analysis', description: 'In measuring prospective productivity improvements throughout your business operations, we identify precisely where process enhancement and streamlining will generate maximum financial returns on your technology investment.' },
          { _key: k('ai-ci'), _type: 'comparisonItem', number: '05', title: 'Change Readiness → Adoption Strategy Planning', description: 'Our validated transformation assessment methodology evaluates institutional readiness and develops customised implementation approaches, converting potential pushback into enthusiastic system adoption.' },
        ],
      },
    ],

    servicesHeading: 'Our Comprehensive ',
    servicesHeadingAccent: 'AI Services',
    servicesTheme: 'dark',
    servicesCards: [
      { _key: k('ai-svc'), _type: 'serviceCard', emoji: '💡', title: 'AI Opportunity Identification', description: 'Map existing processes against industry benchmarks, define AI automation goals, analyse operational bottlenecks, and identify high-ROI AI automation opportunities that remove scaling barriers.', bullets: [
        { _key: k('ai-svb'), _type: 'bullet', text: 'Comprehensive process audit' },
        { _key: k('ai-svb'), _type: 'bullet', text: 'Automation opportunity assessment' },
        { _key: k('ai-svb'), _type: 'bullet', text: 'ROI projections and timelines' },
        { _key: k('ai-svb'), _type: 'bullet', text: 'Custom integration planning' },
      ]},
      { _key: k('ai-svc'), _type: 'serviceCard', emoji: '🎨', title: 'Workflow Design & Testing', description: 'Develop sophisticated workflows with automated testing and validation. We balance automation sophistication with user adoption to ensure maximum business value.', bullets: [
        { _key: k('ai-svb'), _type: 'bullet', text: 'User-centered design methodology' },
        { _key: k('ai-svb'), _type: 'bullet', text: 'Comprehensive testing protocols' },
        { _key: k('ai-svb'), _type: 'bullet', text: 'Performance optimization' },
        { _key: k('ai-svb'), _type: 'bullet', text: 'Error handling and recovery' },
      ]},
      { _key: k('ai-svc'), _type: 'serviceCard', emoji: '👥', title: 'Team Training & Knowledge Transfer', description: 'Transfer complete technical knowledge, deliver comprehensive documentation, and conduct hands-on team workshops. We develop tailored adoption strategies that transform potential resistance into enthusiastic system adoption.' },
      { _key: k('ai-svc'), _type: 'serviceCard', emoji: '📈', title: 'Continuous Improvement', description: 'Refine workflows based on KPIs, implement performance enhancements, and add new automation use cases as your business evolves, ensuring your digital solution remains relevant and secure over the years.' },
    ],

    calendlyHeading: 'Schedule Your Personalised Demo',
    calendlySubheading: 'Book a time with our AI consultants to explore how AI strategy and automation can transform your business operations.',

    faqTabs: [
      {
        _key: k('ai-faq'), _type: 'faqTab', label: 'AI Strategy FAQs',
        items: [
          { _key: k('ai-fq'), _type: 'faqPair', question: 'What is AI strategy consulting?', answer: 'AI strategy consulting helps organizations develop implementation plans for artificial intelligence. Consultants assess current capabilities, identify high-value AI opportunities, create implementation roadmaps, and ensure proper data infrastructure.' },
          { _key: k('ai-fq'), _type: 'faqPair', question: 'How to build your AI strategy?', answer: 'Building an AI strategy starts with identifying specific business problems AI can solve, assessing current data quality and infrastructure, and defining clear success metrics.' },
          { _key: k('ai-fq'), _type: 'faqPair', question: 'How can AI transform your business?', answer: 'AI transforms businesses through enabling faster processes, data-driven strategies, proactive customer service, new business models, and comprehensive threat detection across cybersecurity, financial, and operational domains.' },
          { _key: k('ai-fq'), _type: 'faqPair', question: 'How useful is AI for small businesses?', answer: 'AI levels the playing field for small businesses by providing enterprise-grade capabilities through affordable SaaS solutions. Benefits include cost-effective operations, faster implementation due to organizational agility, enhanced customer relationship management, and automated marketing.' },
          { _key: k('ai-fq'), _type: 'faqPair', question: 'What is the best AI for business?', answer: 'The best AI depends on specific business needs. Popular options include Zendesk AI for customer service, Tableau for analytics, HubSpot for marketing, Microsoft 365 Copilot for productivity, and DocuSign AI for document processing. Success comes from starting with one well-defined use case that solves clear business problems, then gradually expanding AI capabilities based on results and experience.' },
        ],
      },
    ],

    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ organisations',
    joinHeadingPart2: ' that have maximised their workflows with our expert support',
    joinStats: [
      { _key: k('ai-st'), _type: 'stat', value: '500+', label: 'clients globally' },
      { _key: k('ai-st'), _type: 'stat', value: '10+', label: 'years experience' },
      { _key: k('ai-st'), _type: 'stat', value: '1,050+', label: 'projects completed' },
    ],
  }

  await writeClient.createOrReplace(doc)
  console.log('✓ ai-strategy-and-execution')
}

// ──────────────────────────────────────────────────────────────────
// 6. monday-consulting-partner  (partnershipPage)
// ──────────────────────────────────────────────────────────────────
async function migrateConsultingPartner() {
  const docId = 'partnershipPage-monday-consulting-partner'
  const doc = {
    _id: docId,
    _type: 'partnershipPage',
    title: 'monday.com Expert Consultants',
    slug: { _type: 'slug', current: 'monday-consulting-partner' },
    partnerName: 'monday.com',
    seoTitle: 'monday.com Consulting Platinum Partner in Australia, UK and US | Fruition',
    seoDescription: 'Streamline operations & maximise efficiency with our monday.com consultants. As Platinum monday.com Partners, our certified consultants help organisations worldwide harness the full power of monday.com.',
    heroHeading: 'monday.com Expert Consultants - Platinum monday.com Partner in Australia, UK and US',
    heroSubheading: 'Streamline Operations & Maximise Efficiency with Our monday.com Consultants\n\nWe streamline disconnected business processes into integrated, automated workflows that boost team collaboration and drive measurable ROI across your organization. Our expert consultants empower you to adopt workflow automation & AI systems.',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_AFFILIATE,

    comparisonHeading: 'Leadership & Team Challenges',
    comparisonSubheading: 'Our expert consultants empower you to adopt workflow automation & AI systems.',
    comparisonTabs: [
      {
        _key: k('mcp-ct'), _type: 'comparisonTab', label: 'Top Leadership Challenges',
        items: [
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '01', title: 'Market Volatility & Real-Time Visibility', description: 'Market volatility and uncertainty demand real-time project visibility and reporting capabilities that enable quick pivots in strategy and resource allocation, helping organisations make data-driven decisions to maintain competitive advantage and adapt to changing conditions.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '02', title: 'AI & Automation Implementation', description: 'AI and automation in project management requires careful implementation to boost team efficiency while managing change resistance, focusing on streamlined workflows, automated routine tasks, and AI-powered insights for better decision making.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '03', title: 'Hybrid Work Models', description: 'Hybrid work models challenge project leaders to balance in-office and remote team dynamics, requiring robust digital collaboration tools, clear communication protocols, and standardised processes to maintain productivity across distributed teams.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '04', title: 'Talent Retention', description: 'Talent retention in project management hinges on creating engaging work environments with clear growth paths, balanced workloads, and opportunities for skill development, while ensuring knowledge transfer and team cohesion amid turnover.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '05', title: 'Cybersecurity & Digital Risk', description: 'Cybersecurity and digital risk management must be integrated into project workflows through secure access controls, compliant data handling, and protected collaboration tools, without compromising team efficiency or communication effectiveness.' },
        ],
      },
      {
        _key: k('mcp-ct'), _type: 'comparisonTab', label: 'Top Team Challenges',
        items: [
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '01', title: 'Hybrid Collaboration', description: 'Adopting the right tools to maintain effective teamwork, communication, and workload capacity.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '02', title: 'Digital Adaptation', description: 'Get expert training support to rapidly learn new tools and technologies while maintaining productivity.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '03', title: 'Work-Life Integration', description: 'Giving team members time back with an automated system that cuts out manual work.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '04', title: 'Personal Development', description: 'Develop team members to learn how to optimise processes with better systems.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '05', title: 'Team Cohesion', description: 'Unify the team with communication and work management systems.' },
        ],
      },
      {
        _key: k('mcp-ct'), _type: 'comparisonTab', label: 'Our Approach',
        items: [
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '01', title: 'Process Discovery → Business Process Audit', description: 'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '02', title: 'Technical Architecture → System Integration Scope', description: 'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '03', title: 'Solution Design → Implementation', description: 'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '04', title: 'Efficiency Impact → ROI Opportunity Analysis', description: 'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.' },
          { _key: k('mcp-ci'), _type: 'comparisonItem', number: '05', title: 'Change Readiness → Adoption & Training Strategies', description: 'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.' },
        ],
      },
    ],

    servicesHeading: 'Our monday.com Expert ',
    servicesHeadingAccent: 'Implementation Services',
    servicesTheme: 'dark',
    servicesCards: [
      { _key: k('mcp-svc'), _type: 'serviceCard', emoji: '💼', title: 'Business Process Consulting', description: 'We help take a snapshot of your current business process and design an automated solution.' },
      { _key: k('mcp-svc'), _type: 'serviceCard', emoji: '🔄', title: 'Implementation Optimisation', description: 'We help bring your solution design to fruition from scratch or can optimise your existing workflows within monday.com.' },
      { _key: k('mcp-svc'), _type: 'serviceCard', emoji: '🔌', title: 'Integration & Custom Development', description: 'Developer support to build business-critical system integrations & automation with monday.com.' },
      { _key: k('mcp-svc'), _type: 'serviceCard', emoji: '👥', title: 'Training & Managed Services', description: 'Basic to advanced 1:1 and team training. We can also lend you one of our resources for long-term and ad-hoc projects!' },
    ],

    capabilitiesHeading: 'monday CRM ',
    capabilitiesHeadingAccent: 'Consulting Expertise',
    capabilitiesSubheading: 'Streamline your customer relationships with custom CRM implementations tailored to your business needs.',
    capabilitiesCards: [
      { _key: k('mcp-cap'), _type: 'capabilityCard', emoji: '🛠️', title: 'Construction', description: 'monday.com CRM solutions for construction businesses.' },
      { _key: k('mcp-cap'), _type: 'capabilityCard', emoji: '🏭', title: 'Manufacturing', description: 'monday.com CRM solutions for manufacturing companies.' },
      { _key: k('mcp-cap'), _type: 'capabilityCard', emoji: '🧰', title: 'Service Industry', description: 'monday.com CRM solutions for service industry.' },
      { _key: k('mcp-cap'), _type: 'capabilityCard', emoji: '🎨', title: 'Marketing & Creative', description: 'monday.com CRM solutions for marketing and creative teams.' },
      { _key: k('mcp-cap'), _type: 'capabilityCard', emoji: '💡', title: 'Product Development', description: 'monday.com CRM solutions for product development teams.' },
      { _key: k('mcp-cap'), _type: 'capabilityCard', emoji: '📊', title: 'Project & Portfolio Management', description: 'monday.com solutions for project and portfolio management.' },
      { _key: k('mcp-cap'), _type: 'capabilityCard', emoji: '🎯', title: 'Executive Leadership (OKRs)', description: 'monday.com solutions for OKR tracking and executive leadership.' },
    ],

    calendlyHeading: 'Schedule Your Personalised Demo With monday.com Expert Consultant',
    calendlySubheading: 'Schedule a demo with our monday.com consultants to discover how monday.com can be customised for your business, and get a free 4-week extended trial to experience its full potential.',

    faqTabs: [
      {
        _key: k('mcp-faq'), _type: 'faqTab', label: 'Professional Services',
        items: [
          { _key: k('mcp-fq'), _type: 'faqPair', question: 'Does monday com have a CRM?', answer: 'Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes.' },
          { _key: k('mcp-fq'), _type: 'faqPair', question: 'Does monday com have task management?', answer: 'Yes, monday.com has task management. Take a trial of monday work management and discover just how efficiently you can manage your teams\' to-do list.' },
          { _key: k('mcp-fq'), _type: 'faqPair', question: 'Why is monday.com so successful?', answer: "Here are key factors that make monday.com so successful:\n1. One of Monday.com's key selling points is its highly customizable nature, allowing users to tailor workflows, add automations, and integrate third-party apps.\n2. Extremely use-friendly, making adoption easy\n3. Highly visual, agile, and, most importantly, scalable\n4. monday.com can be used to manage anything you want. It's a veritable Swiss Army knife for managers around the world." },
          { _key: k('mcp-fq'), _type: 'faqPair', question: 'What exactly does monday.com do?', answer: 'monday.com is the most versatile project management software you\'ll find on the market. You can use the platform to manage all of your projects, and also use it as a CRM, to manage your ad campaigns, track bugs, and manage video production.' },
        ],
      },
    ],

    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ organisations',
    joinHeadingPart2: ' that have maximised their workflows with our monday.com expert support',
    joinStats: [
      { _key: k('mcp-st'), _type: 'stat', value: '500+', label: 'clients globally' },
      { _key: k('mcp-st'), _type: 'stat', value: '10+', label: 'years experience' },
      { _key: k('mcp-st'), _type: 'stat', value: '1,050+', label: 'projects completed' },
    ],
  }

  await writeClient.createOrReplace(doc)
  console.log('✓ monday-consulting-partner')
}

// ──────────────────────────────────────────────────────────────────
// Run all
// ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('Migrating 6 pages to Sanity...\n')
  await migrateProductManagement()
  await migrateHR()
  await migrateSolarCRM()
  await migrateCabinetry()
  await migrateAI()
  await migrateConsultingPartner()
  console.log('\n✅ All 6 pages migrated successfully.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
