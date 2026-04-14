/**
 * Sanity migration: monday.com Implementation Consultants page.
 *
 * Creates (or overwrites) the `mondayImplementationConsultantsPage` singleton
 * with every field needed by the dedicated page at
 * /monday-implementation-consultants. Content is transcribed from the live
 * fruitionservices.io page and images are either local (/public) or pulled
 * from the live site.
 */
import {
  writeClient,
  uploadLocalImage,
  uploadImageFromUrl,
  withKeys,
  textToPortableText,
} from './lib'

const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'

async function main() {
  console.log('Uploading monday-implementation-consultants assets...')

  // Local badge assets
  const heroCertificationBadge = await uploadLocalImage('/images/badge-certifications.png')
  const securityBadge = await uploadLocalImage('/images/badge-security.png')
  const discoverBadge = heroCertificationBadge
  const joinSectionBadge = await uploadLocalImage('/images/badge-forrester.png')

  // Solution card images scraped from the live site
  const crmSolutionImage = await uploadImageFromUrl(
    'https://static.wixstatic.com/media/d6e205_d983f1a368cf4dbb841d2f85828d4b9c~mv2.png/v1/fill/w_1200,h_762,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/d6e205_d983f1a368cf4dbb841d2f85828d4b9c~mv2.png',
    'mic-solution-crm.png'
  )
  const trainingSolutionImage = await uploadImageFromUrl(
    'https://static.wixstatic.com/media/d6e205_895959f2f91a4233afcea3c00a58789b~mv2.png/v1/crop/x_0,y_0,w_565,h_485/fill/w_980,h_826,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/d6e205_895959f2f91a4233afcea3c00a58789b~mv2.png',
    'mic-solution-training.png'
  )
  const integrationSolutionImage = await uploadImageFromUrl(
    'https://static.wixstatic.com/media/d6e205_d9920f43fb2d44fc95270fdd401e5c08~mv2.png/v1/fill/w_1032,h_782,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/d6e205_d9920f43fb2d44fc95270fdd401e5c08~mv2.png',
    'mic-solution-integration.png'
  )
  const mondayFeaturesImage = await uploadImageFromUrl(
    'https://static.wixstatic.com/media/d6e205_07fb9048b53d4ff5bab71933d818414f~mv2.png/v1/fill/w_1388,h_992,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Group%201261156399.png',
    'mic-solution-features.png'
  )

  const doc = {
    _type: 'mondayImplementationConsultantsPage',
    title: 'monday.com Implementation Consultants',
    seoTitle: 'monday.com Implementation Consultants - Professional Support | Fruition',
    seoDescription:
      'Certified monday.com implementation experts in Australia, UK, & US. Professional consultant support to get set up right without wasting valuable hours. Free consultation available.',

    /* ---------------- Hero ---------------- */
    heroEyebrow: 'monday.com',
    heroHeadingPart1: '',
    heroHeadingAccent: 'Implementation Consultants',
    heroHeadingPart2: '\nCertified monday.com Experts',
    heroSubheading:
      'Get set up the right way, without spending valuable hours figuring it out yourself. Make monday.com work for you and the architecture of your business with a monday.com implementation expert.',
    heroCertificationBadge,
    heroPrimaryCtaLabel: '\ud83d\ude80 Book a Consultation',
    heroPrimaryCtaUrl: CALENDLY,
    heroSecondaryCtaLabel: '\u25b6\ufe0f Get Started with monday.com',
    heroSecondaryCtaUrl: CALENDLY,

    /* ---------------- Logo cloud ---------------- */
    logoCloudHeadingPart1: 'Clients who have used our ',
    logoCloudHeadingAccent: 'monday.com consulting services',

    /* ---------------- Teams Transformed banner ---------------- */
    teamsTransformedHeading: 'Teams Transformed with Proven Efficiency Gains.',
    teamsTransformedBody: textToPortableText(
      'Authorised monday.com, Atlassian and make Consulting, implementation and integration partner consultants across Australia, UK, and US.'
    ),

    /* ---------------- Comparison section ---------------- */
    comparisonSectionHeading: 'DIY implementation vs expert monday.com support',
    comparisonTabs: withKeys([
      {
        _type: 'comparisonTab',
        label: 'DIY vs Using Consultants',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'There are hidden risks that come with DIY implementation..',
            bullets: withKeys([
              {
                _type: 'bullet',
                emoji: '\ud83d\udeab',
                text: "Teams typically resist change when new systems aren't properly introduced",
              },
              {
                _type: 'bullet',
                emoji: '\u26a0\ufe0f',
                text: 'Partial solutions often create more problems than they solve, leading to frustrated teams and wasted resources',
              },
              {
                _type: 'bullet',
                emoji: '\u23f0',
                text: 'A trial-and-error approach costs valuable time and business momentum',
              },
              {
                _type: 'bullet',
                emoji: '\ud83d\udd0d',
                text: 'Missing critical optimisation opportunities that could dramatically improve efficiency',
              },
              {
                _type: 'bullet',
                emoji: '\ud83d\udd73\ufe0f',
                text: 'Limited understanding of integration possibilities can leave significant gaps in workflow automation',
              },
            ]),
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'And clear advantages to a professional approach.',
            bullets: withKeys([
              {
                _type: 'bullet',
                emoji: '\ud83c\udfaf',
                text: 'Expert consultants map your operations precisely against industry benchmarks',
              },
              {
                _type: 'bullet',
                emoji: '\ud83d\udcc8',
                text: 'Systematic five-step process uncovers 40-60% more efficiency opportunities',
              },
              {
                _type: 'bullet',
                emoji: '\u2705',
                text: 'Proven change management framework ensures enthusiastic team adoption',
              },
              {
                _type: 'bullet',
                emoji: '\ud83d\ude80',
                text: 'Solutions designed to scale seamlessly with your business growth',
              },
              {
                _type: 'bullet',
                emoji: '\ud83d\udc8e',
                text: 'Transform business process challenges into competitive advantages from day one',
              },
            ]),
          },
        ]),
      },
      {
        _type: 'comparisonTab',
        label: 'Implementation Support Benefits',
        items: withKeys([
          {
            _type: 'comparisonItem',
            number: '01',
            title: 'Expert monday.com Setup & Configuration',
            description:
              'Skip months of trial and error. Our certified monday.com consultants deliver optimised workflows in weeks, not months.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Professional monday.com Implementation',
            description:
              'Transform your operations with tailored solutions. Our consultants analyse your processes and configure monday.com to match your exact business needs.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Seamless monday.com Integration',
            description:
              'Connect monday.com with your existing tools perfectly. Our implementation experts create unified workflows that boost team efficiency.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Proven Implementation Success',
            description:
              'Ensure successful adoption across your team. Our monday.com consultants turn potential resistance into enthusiastic platform engagement.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'ROI-Driven monday.com Solutions',
            description:
              'Maximise your platform investment. Our certified consultants identify the automations and workflows that deliver the highest returns.',
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
            title: 'Discovery & Strategic Alignment',
            description:
              'We start with a deep discovery session to understand your business, your goals, and the exact workflows you want monday.com to power.',
          },
          {
            _type: 'comparisonItem',
            number: '02',
            title: 'Architecture & Workflow Design',
            description:
              'Our consultants design a scalable monday.com architecture — boards, automations, integrations — mapped to your organisation.',
          },
          {
            _type: 'comparisonItem',
            number: '03',
            title: 'Hands-On Implementation',
            description:
              'We build and configure your workspace, set up automations, connect integrations, and migrate your existing data.',
          },
          {
            _type: 'comparisonItem',
            number: '04',
            title: 'Training & Adoption',
            description:
              'We train your team with tailored onboarding sessions so adoption is fast, enthusiastic, and sustainable.',
          },
          {
            _type: 'comparisonItem',
            number: '05',
            title: 'Ongoing Optimisation',
            description:
              'Post-launch we monitor, iterate, and evolve your monday.com setup as your business grows.',
          },
        ]),
      },
    ]),

    /* ---------------- Methodology ---------------- */
    methodologyHeading:
      'Our expert consultants empower you to adopt workflow automation & AI systems',
    methodologySteps: withKeys([
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
    ]),

    /* ---------------- Solutions section ---------------- */
    solutionsHeadingPart1: 'Create a CRM or project management tool that ',
    solutionsHeadingAccent: 'fits you',
    solutionsHeadingPart2: '.',
    solutionsIntro:
      'Have a monday.com partner build a system designed to support the way you want your business to run.\n\nThat means you start with the "meat and potatoes" of your platform in place. So later, if you need to adapt to new requirements, you can easily piggyback off of the original set-up.',
    solutionCards: withKeys([
      {
        _type: 'solutionCard',
        eyebrow: '\ud83d\udcc8 Our CRM Solutions',
        heading: 'Build a high-level roll-up of all your boards',
        body:
          "Give directors a general overview of the team's progress with calendars, Gantt charts, and dashboards.\n\nSo, even if you have 10+ boards, senior management can see what someone is working on, how projects are doing, and why tasks are delayed\u2013all with just a few clicks.",
        ctaLabel: '\ud83d\udcca Our Project Management Solutions',
        ctaUrl: '/monday-consulting-solutions/monday-project-management',
        image: crmSolutionImage,
      },
      {
        _type: 'solutionCard',
        eyebrow: 'Training & managed services',
        heading: 'Get the entire team monday.com training.',
        body:
          'Make sure all of your team members get the onboarding they need to feel comfortable using the platform day in and day out.\n\nSo, when you actually start using the platform, it becomes your single source of truth.',
        ctaLabel: '\ud83d\udc69\ud83c\udffd\u200d\ud83d\udcbc\ud83d\udc68\ud83c\udffb\u200d\ud83d\udcbc Our Training Services',
        ctaUrl: '/monday-training',
        image: trainingSolutionImage,
      },
      {
        _type: 'solutionCard',
        eyebrow: 'Integration & API development',
        heading: 'Eliminate manual work with automation.',
        body:
          'Seamlessly integrate Gmail, Outlook, Sharepoint, Teams, accounting software, ChatGPT, and dozens of other tools with the software\u2019s open API.',
        ctaLabel: '\u26a1\ufe0f See Our Solutions',
        ctaUrl: '/monday-consulting-solutions',
        image: integrationSolutionImage,
      },
      {
        _type: 'solutionCard',
        eyebrow: 'Implementation expertise',
        heading: 'End-to-end monday.com implementation, done right.',
        body:
          'From first workshop to final rollout, our consultants own the process so you don\u2019t have to. We scope, build, configure, migrate and train \u2014 delivering a platform your team actually uses from day one.',
        ctaLabel: '\ud83d\ude80 Book a Consultation',
        ctaUrl: CALENDLY,
        image: mondayFeaturesImage,
      },
    ]),

    /* ---------------- Testimonials header / stat card ---------------- */
    testimonialsHeading: 'What our customers say about us \ud83d\ude4c',
    testimonialsCtaLabel: '\ud83d\ude80 Start Your Transformation',
    testimonialsCtaUrl: CALENDLY,
    statCardValue: '500+',
    statCardSubtitle: 'have maximised their workflows with our monday.com expert support',
    statCardCtaLabel: 'Read our case studies',
    statCardCtaUrl: '/customer-testimonials',

    /* ---------------- Calendly ---------------- */
    calendlyHeading:
      'Schedule A 30-Min Consultation With One of Our Expert monday.com Consultants',
    calendlyUrl: CALENDLY,

    /* ---------------- FAQ ---------------- */
    faqHeading: 'Frequently asked questions',
    faqTabs: withKeys([
      {
        _type: 'faqTab',
        label: 'monday Work Management',
        items: withKeys([
          {
            _type: 'faqPair',
            question: 'Can monday.com be used for project management?',
            answer:
              "Yes, monday.com is an excellent project management platform that supports both waterfall and agile methodologies. monday.com Work Management provides comprehensive project portfolio management capabilities, allowing teams to efficiently manage portfolios, projects, and tasks in one centralized workspace.\n\nThe platform offers robust project management features including:\n\n\u2022 Portfolio management for strategic oversight across multiple projects\n\u2022 Agile project management with sprint planning and kanban boards\n\u2022 Waterfall project management with Gantt charts and timeline views\n\u2022 Task management with customizable workflows and automation\n\u2022 Resource management and team collaboration tools\n\u2022 Real-time project tracking and progress reporting\n\nWhether you're managing a single project or multiple project portfolios, monday.com's flexible work management platform adapts to your team's specific project management methodology and workflow requirements.",
          },
          {
            _type: 'faqPair',
            question: 'What is monday.com Work Management?',
            answer:
              'monday.com Work Management is a cloud-based platform that helps teams plan, organize, and track their work in one centralized workspace. It offers customizable boards, task automation, and powerful integrations to streamline workflows across any industry.',
          },
          {
            _type: 'faqPair',
            question: 'Is monday.com a PPM tool?',
            answer:
              'Yes, monday.com is a comprehensive Project Portfolio Management (PPM) tool. In October 2024, monday.com launched monday.com Portfolio as part of their Enterprise-level offering, establishing the platform as a robust PPM solution for organizations managing multiple projects and portfolios.\n\nmonday.com Portfolio delivers advanced PPM capabilities including:\n\n\u2022 Master template management for standardized project execution across portfolios\n\u2022 Cross-board dependencies to manage interconnected projects and deliverables\n\u2022 Automated portfolio reporting that eliminates manual project status updates\n\u2022 Real-time portfolio visibility with executive dashboards and KPI tracking\n\u2022 Resource allocation management across multiple projects and teams\n\u2022 Strategic portfolio alignment with business objectives and priorities\n\u2022 Risk management and portfolio performance analytics\n\nThis Enterprise PPM solution transforms how organizations manage project portfolios by automating reporting workflows, maintaining project interdependencies, and providing strategic oversight.',
          },
          {
            _type: 'faqPair',
            question: "Can monday.com Work Management be customized for my team\u2019s needs?",
            answer:
              'Yes! monday.com is fully customizable. You can build boards, workflows, and dashboards tailored to your team\u2019s unique processes, whether you manage projects, sales pipelines, marketing campaigns, or operations.',
          },
          {
            _type: 'faqPair',
            question: 'Does monday.com integrate with other tools?',
            answer:
              'Absolutely. monday.com integrates with popular tools like Slack, Microsoft Teams, Google Workspace, Zoom, HubSpot, Salesforce, and more. These integrations ensure seamless data flow and keep your team connected.',
          },
          {
            _type: 'faqPair',
            question: 'How secure is monday.com Work Management?',
            answer:
              'monday.com uses industry-leading security measures, including SOC 2 Type II compliance, GDPR compliance, data encryption, and role-based permissions. This ensures that your company data remains safe and protected.',
          },
          {
            _type: 'faqPair',
            question: 'What are the five stages of project management?',
            answer:
              'The five stages of project management form the essential project management lifecycle that guides successful project delivery from start to finish:\n\n1. Project Initiation \u2014 Define project scope, objectives and business case with stakeholder identification. Conduct feasibility analysis and establish project charter with initial resource allocation.\n\n2. Project Planning \u2014 Develop comprehensive project management plans, timelines and work breakdown structure. Define project budget, resource requirements and risk management strategies.\n\n3. Project Execution \u2014 Implement project deliverables according to plan while coordinating team activities. Execute project tasks and maintain stakeholder communication throughout delivery.\n\n4. Project Monitoring and Control \u2014 Track project progress against planned objectives, timelines and budget metrics. Implement change management and conduct regular project status reporting.\n\n5. Project Closure \u2014 Complete final project deliverables and obtain stakeholder approval. Conduct project evaluation, document lessons learned and release project resources.',
          },
        ]),
      },
      {
        _type: 'faqTab',
        label: 'monday CRM',
        items: withKeys([
          {
            _type: 'faqPair',
            question: 'Is monday.com a good CRM?',
            answer:
              'Yes. monday CRM is a powerful, fully customisable sales and customer relationship platform used by thousands of businesses. It centralises leads, contacts, deals and customer communication while automating repetitive sales tasks.',
          },
          {
            _type: 'faqPair',
            question: 'How does monday CRM compare to Salesforce or HubSpot?',
            answer:
              'monday CRM is easier to customise and faster to deploy than Salesforce, and offers deeper work management capabilities than HubSpot. It\u2019s ideal for teams that want CRM + project management in one platform.',
          },
          {
            _type: 'faqPair',
            question: 'Can monday CRM integrate with my existing tools?',
            answer:
              'Yes. monday CRM connects with Gmail, Outlook, Slack, Teams, DocuSign, Aircall, HubSpot, Salesforce, Xero and hundreds more via native integrations and a flexible open API.',
          },
          {
            _type: 'faqPair',
            question: 'Do you offer monday CRM implementation support?',
            answer:
              'Absolutely. Our certified monday CRM consultants handle end-to-end implementation \u2014 from sales process mapping to pipeline design, automation, integrations and team training.',
          },
        ]),
      },
      {
        _type: 'faqTab',
        label: 'Expert Consultant Guide',
        items: withKeys([
          {
            _type: 'faqPair',
            question: 'Why hire a monday.com implementation consultant?',
            answer:
              'A certified monday.com consultant saves you months of trial and error. You get expert architecture, proven workflows, and systematic change management so your team actually adopts the platform.',
          },
          {
            _type: 'faqPair',
            question: 'What should I look for in a monday.com partner?',
            answer:
              'Look for an official monday.com Partner with verifiable certifications, experience across multiple industries, a structured implementation methodology, and strong post-launch support.',
          },
          {
            _type: 'faqPair',
            question: 'How long does a monday.com implementation take?',
            answer:
              'Most implementations take 4\u20138 weeks depending on scope. A simple team workspace can go live in 2 weeks; complex multi-department rollouts with integrations and custom automations may take 8\u201312 weeks.',
          },
          {
            _type: 'faqPair',
            question: 'Do you provide training and ongoing support?',
            answer:
              'Yes. Every implementation includes tailored team training and optional ongoing managed services \u2014 so your monday.com investment keeps delivering value as your business grows.',
          },
        ]),
      },
      {
        _type: 'faqTab',
        label: 'General Questions',
        items: withKeys([
          {
            _type: 'faqPair',
            question: 'Where is Fruition Services based?',
            answer:
              'Fruition Services has offices in Sydney, New York and London, with consultants supporting clients across Australia, the UK, the US and Asia-Pacific.',
          },
          {
            _type: 'faqPair',
            question: 'What industries do you work with?',
            answer:
              'We work across construction, manufacturing, retail, professional services, government, marketing, real estate, solar, finance and more. Our certified consultants tailor each implementation to the specifics of your industry.',
          },
          {
            _type: 'faqPair',
            question: 'Do you offer a free consultation?',
            answer:
              'Yes. Book a free 30-minute consultation with one of our certified monday.com experts to discuss your business, your goals and how we can help.',
          },
          {
            _type: 'faqPair',
            question: 'How do I get started?',
            answer:
              'The easiest way is to book a consultation via the form on this page. A certified monday.com consultant will reach out to scope your needs and walk you through the process.',
          },
        ]),
      },
    ]),

    /* ---------------- Discover CTA ---------------- */
    discoverBadge,
    discoverHeading: 'Discover how much monday.com can do for your team.',
    discoverPrimaryCtaLabel: '\ud83d\ude80 Schedule a Consultation',
    discoverPrimaryCtaUrl: CALENDLY,
    discoverSecondaryCtaLabel: '\u25b6\ufe0f Get Started with monday.com',
    discoverSecondaryCtaUrl: CALENDLY,

    /* ---------------- Join 500+ stats ---------------- */
    joinSectionHeadingPart1: 'Join ',
    joinSectionHeadingAccent: '500+ businesses',
    joinSectionHeadingPart2: ' that have leveraged our monday.com implementation experts.',
    joinSectionSubheading: 'The economic impact of',
    joinSectionStats: withKeys([
      { _type: 'stat', value: '288%', label: 'ROI' },
      { _type: 'stat', value: '15,600', label: 'Hours Saved' },
      { _type: 'stat', value: '50%', label: 'Meeting reduction' },
      { _type: 'stat', value: '489,794', label: 'Net Value' },
    ]),
    joinSectionFootnote: 'Data by',
    joinSectionBadge,

    /* ---------------- Security ---------------- */
    securityBadge,
  }

  console.log('Writing mondayImplementationConsultantsPage singleton...')
  await writeClient.createOrReplace({
    _id: 'mondayImplementationConsultantsPage',
    ...doc,
  })
  console.log('\u2713 mondayImplementationConsultantsPage uploaded')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
