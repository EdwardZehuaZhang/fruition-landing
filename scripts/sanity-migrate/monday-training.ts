/**
 * Migrate the /monday-training page to the `mondayTrainingPage` Sanity
 * singleton — using the REAL live-site content scraped from
 * https://www.fruitionservices.io/monday-training.
 *
 * Run with:
 *   npx tsx scripts/sanity-migrate/monday-training.ts
 */
import { writeClient, uploadLocalImage, uploadImageFromUrl, withKeys } from './lib'

const CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'

/* ------------------------------------------------------------------ */
/*  Live-site training service card images                            */
/*                                                                     */
/*  Verified by position-scanning /tmp/mt-live.html:                   */
/*    - a280a5_6a9c1ee…  → "Customization"          (~pos 1467k)      */
/*    - a280a5_65b39cb…  → "Bird's-Eye View"        (~pos 1523k)      */
/*    - a280a5_bb02811…  → "IT Support"             (~pos 1528k)      */
/*    - a280a5_a8a55c8…  → "Handover Documentation" (~pos 1529k)      */
/*                                                                     */
/*  Use the higher-res 2x variants for better display quality.         */
/* ------------------------------------------------------------------ */
const SERVICE_IMAGE_URLS = {
  customization:
    'https://static.wixstatic.com/media/a280a5_6a9c1eefc2ed4edfaad09c694e4d2f32~mv2.png/v1/fill/w_719,h_515,al_c,lg_1,q_90,enc_avif,quality_auto/a280a5_6a9c1eefc2ed4edfaad09c694e4d2f32~mv2.png',
  birdsEyeView:
    'https://static.wixstatic.com/media/a280a5_65b39cb99e8c4321b2ae0d30227908bb~mv2.png/v1/fill/w_720,h_470,al_c,lg_1,q_85,enc_avif,quality_auto/a280a5_65b39cb99e8c4321b2ae0d30227908bb~mv2.png',
  itSupport:
    'https://static.wixstatic.com/media/a280a5_bb028114bd854804a2c09202dd27a289~mv2.png/v1/fill/w_719,h_544,al_c,lg_1,q_90,enc_avif,quality_auto/a280a5_bb028114bd854804a2c09202dd27a289~mv2.png',
  handover:
    'https://static.wixstatic.com/media/a280a5_a8a55c82b1014616a8ab624d92b2bc50~mv2.png/v1/fill/w_560,h_716,al_c,lg_1,q_90,enc_avif,quality_auto/a280a5_a8a55c82b1014616a8ab624d92b2bc50~mv2.png',
} as const

async function main() {
  console.log('— Uploading monday-training images…')

  // Hero image intentionally omitted — live page has no hero picture.
  const heroCertificationBadge = await uploadLocalImage('/images/badge-certifications.png')
  const securityBadge = await uploadLocalImage('/images/badge-security.png')
  const discoverBadge = heroCertificationBadge
  const joinSectionBadge = await uploadLocalImage('/images/badge-forrester.png')

  console.log('— Downloading training service card images from live site…')
  const customizationImage = await uploadImageFromUrl(
    SERVICE_IMAGE_URLS.customization,
    'training-service-customization.png'
  )
  const birdsEyeViewImage = await uploadImageFromUrl(
    SERVICE_IMAGE_URLS.birdsEyeView,
    'training-service-birds-eye-view.png'
  )
  const itSupportImage = await uploadImageFromUrl(
    SERVICE_IMAGE_URLS.itSupport,
    'training-service-it-support.png'
  )
  const handoverImage = await uploadImageFromUrl(
    SERVICE_IMAGE_URLS.handover,
    'training-service-handover-documentation.png'
  )

  /* ---------------------------------------------------------------- */
  /*  Training tabs — with the correct tab content from the live site */
  /* ---------------------------------------------------------------- */
  const trainingTabs = withKeys([
    {
      _type: 'trainingTab',
      label: 'Why Get monday Training',
      items: withKeys([
        {
          _type: 'trainingItem',
          number: '01',
          title: 'Greater Return on Investment',
          bullets: [
            'Employees make full use of software capabilities',
            'Enhanced productivity',
            'Reduce time taken to complete tasks',
            'Improved efficiency, innovation, and competitive advantage',
          ],
        },
        {
          _type: 'trainingItem',
          number: '02',
          title: 'Drive Adoption and Retention',
          bullets: [
            'Keep your team accountable',
            'Encourage adoption of the platform',
            'Provide employees with learning and development opportunities',
            'Improve team morale',
          ],
        },
        {
          _type: 'trainingItem',
          number: '03',
          title: 'Reduce Costs Attributed to Errors',
          bullets: [
            'Well-trained employees make fewer mistakes, reducing the costs associated with errors and rework.',
            'Ensure higher quality work and output',
            'Maximize the effectiveness of monday.com',
          ],
        },
      ]),
    },
    {
      _type: 'trainingTab',
      label: 'monday.com Features',
      items: withKeys([
        {
          _type: 'trainingItem',
          number: '01',
          title: 'Connect goals with the work being done',
          description:
            '- improve cross-functional collaboration with one workspace that brings teams and departments together to achieve shared goals. Set and track company-level goals and objectives and ensure that the projects being done around them contribute to their success.',
        },
        {
          _type: 'trainingItem',
          number: '02',
          title: 'Execute with speed and precision',
          description:
            '- standardise and automate workflows, while assigning clear ownership for efficient execution and faster delivery. Free your team from the repetitive manual tasks and endless email threads, so they can focus on goals and create real impact.',
        },
        {
          _type: 'trainingItem',
          number: '03',
          title: 'Take the guesswork out of decision-making',
          description:
            '- with all business units and data connected in one workspace, get real-time insights, from potential risks to work progress, to make accurate decisions. Identify risks before they happen. Understand your project health with Gantt and key milestones to mitigate risks and bottlenecks, and take action to increase project efficiency.',
        },
      ]),
    },
    {
      _type: 'trainingTab',
      label: 'How We Can Help',
      items: withKeys([
        {
          _type: 'trainingItem',
          number: '01',
          title: 'Process Discovery \u2192 Business Process Audit',
          description:
            'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
        },
        {
          _type: 'trainingItem',
          number: '02',
          title: 'Technical Architecture \u2192 System Integration Scope',
          description:
            'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
        },
        {
          _type: 'trainingItem',
          number: '03',
          title: 'Solution Design \u2192 Implementation',
          description:
            'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.',
        },
        {
          _type: 'trainingItem',
          number: '04',
          title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
          description:
            'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
        },
        {
          _type: 'trainingItem',
          number: '05',
          title: 'Change Readiness \u2192 Adoption & Training Strategies',
          description:
            'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.',
        },
      ]),
    },
  ])

  /* ---------------------------------------------------------------- */
  /*  Training services — 4 cards with images                         */
  /* ---------------------------------------------------------------- */
  const trainingServices = withKeys([
    {
      _type: 'trainingService',
      emoji: '\u2699\ufe0f',
      title: 'Customization',
      subtitle: "See how to adapt your boards to your team's needs",
      description:
        "Get the monday.com training you need to set up your CRM or project management tool exactly how you want it. Or get help tidying it up if you've already built out your boards.\n\nAfter all, the platform should support the way you want your business to run.",
      image: customizationImage,
    },
    {
      _type: 'trainingService',
      emoji: '\ud83d\udc41\ufe0f',
      title: "Bird's-Eye View",
      subtitle: 'Build a high-level roll-up of all your boards',
      description:
        "Get help connecting all of your individual boards into one high-level board. So, you can give senior management a general overview of the entire team's progress.\n\nThey can check the project health, see what each team member is working on, and check on roadblocks\u2013all in a few clicks.",
      image: birdsEyeViewImage,
    },
    {
      _type: 'trainingService',
      emoji: '\ud83d\udd17',
      title: 'IT Support',
      subtitle: 'Integrate your email and all external tools',
      description:
        "With our monday.com training, you'll get help integrating Gmail, Outlook, Sharepoint, Teams, accounting software, ChatGPT, and dozens of other tools with our open API, so you truly have a single source of truth.",
      image: itSupportImage,
    },
    {
      _type: 'trainingService',
      emoji: '\ud83d\udcc4',
      title: 'Handover Documentation',
      subtitle: 'Guidde Documentation',
      description:
        "As Guidde certified partners, we leverage Guidde to create monday.com video documentation and training material.\n\nPost training, you'll get access to personalized video tutorials and written guides for handover documentation.",
      image: handoverImage,
      ctaLabel: '\ud83d\udcc4 Learn More About Guidde',
      ctaUrl: '/partnerships/certified-guidde-partner',
    },
  ])

  /* ---------------------------------------------------------------- */
  /*  FAQ — real live-site content for the Training tab               */
  /* ---------------------------------------------------------------- */
  const trainingFaqAnswer = [
    'Yes \u2014 monday.com does have training programs, and they\u2019re offered in a few different formats depending on your needs:',
    '',
    'Monday Academy (Free)',
    'Online learning platform with self-paced video courses and certifications.',
    'Covers everything from beginner basics to advanced automations and integrations.',
    'Includes role-specific paths (e.g., project managers, admins).',
    '',
    'Live Webinars (Free & Paid Options)',
    'Monday.com regularly hosts webinars with live Q&A.',
    'Topics include \u201cGetting Started,\u201d \u201cAutomations Deep Dive,\u201d and best practices for workflows.',
    '',
    'Customer Success Programs (For Teams & Enterprises)',
    'Dedicated onboarding and tailored training sessions provided for paying customers, especially on Pro and Enterprise plans.',
    'These are personalized to your company\u2019s workflows and often led by a Monday.com consultant.',
    '',
    'Monday.com Partners & Consultants (Paid)',
    'Certified partners around the world offer private training, implementation support, and advanced setup.',
    'Useful if you need deep customization, third-party integrations, or in-person training.',
    '',
    'Help Center & Community (Free)',
    'Step-by-step guides, templates, video tutorials, and an active user forum for ongoing learning.',
  ].join('\n')

  const faqTabs = withKeys([
    {
      _type: 'faqTab',
      label: 'Training',
      items: withKeys([
        {
          _type: 'faqPair',
          question: 'Does monday.com have a training program?',
          answer: trainingFaqAnswer,
        },
        {
          _type: 'faqPair',
          question: 'Is monday.com Academy free?',
          answer: 'Yes, monday Academy is completely free to all monday.com users.',
        },
        {
          _type: 'faqPair',
          question: 'How long does it take to get trained on Monday.com?',
          answer:
            'Basic training can take a few hours. Becoming fully proficient with advanced automations and integrations may take a few weeks, depending on your use case.',
        },
        {
          _type: 'faqPair',
          question: 'Is training available for individuals as well as teams?',
          answer:
            'Yes. Training can be tailored for individuals, small teams, or company-wide onboarding.',
        },
        {
          _type: 'faqPair',
          question: 'Does monday.com integrate with other tools we already use?',
          answer:
            'Yes. It integrates with tools like Slack, Microsoft Teams, Gmail, Google Drive, Zoom, HubSpot, and more.',
        },
        {
          _type: 'faqPair',
          question: 'Is the training hands-on?',
          answer:
            'Most training sessions are interactive, with live demos and exercises so participants can practice in real time.',
        },
      ]),
    },
    {
      _type: 'faqTab',
      label: 'monday Work Management',
      items: withKeys([
        {
          _type: 'faqPair',
          question: 'What is monday Work Management?',
          answer:
            'monday Work Management is a product built on the monday.com platform specifically designed for project and portfolio management, resource planning, and team collaboration.',
        },
        {
          _type: 'faqPair',
          question: 'How does monday.com help with project management?',
          answer:
            'monday.com provides boards, timelines, Gantt charts, Kanban views, and dashboards to help teams plan, track, and deliver projects on time. Automations reduce manual work while integrations connect your existing tools.',
        },
      ]),
    },
    {
      _type: 'faqTab',
      label: 'monday CRM',
      items: withKeys([
        {
          _type: 'faqPair',
          question: 'How does monday CRM compare to other CRMs?',
          answer:
            'monday CRM offers unmatched flexibility and customization compared to traditional CRMs. It adapts to your sales process rather than forcing you into rigid workflows.',
        },
        {
          _type: 'faqPair',
          question: 'Can monday CRM integrate with our existing tools?',
          answer:
            'Yes, monday CRM integrates with Gmail, Outlook, HubSpot, Salesforce, and hundreds of other tools. Our consultants can help set up custom integrations via the API for any tools not natively supported.',
        },
      ]),
    },
    {
      _type: 'faqTab',
      label: 'monday Service',
      items: withKeys([
        {
          _type: 'faqPair',
          question: 'What is monday Service?',
          answer:
            'monday Service is monday.com\u2019s dedicated service management product, designed for IT and service teams to manage tickets, requests, and service delivery workflows in one centralised platform.',
        },
        {
          _type: 'faqPair',
          question: 'How can monday Service improve our support operations?',
          answer:
            'monday Service provides automated ticket routing, SLA tracking, knowledge base integration, and real-time dashboards so your team can resolve issues faster and maintain service quality standards.',
        },
      ]),
    },
  ])

  /* ---------------------------------------------------------------- */
  /*  Join 500+ stats section                                         */
  /* ---------------------------------------------------------------- */
  const joinSectionStats = withKeys([
    { _type: 'stat', value: '288%', label: 'ROI' },
    { _type: 'stat', value: '15,600', label: 'Hours Saved' },
    { _type: 'stat', value: '50%', label: 'Meeting reduction' },
    { _type: 'stat', value: '489,794', label: 'Net Value' },
  ])

  /* ---------------------------------------------------------------- */
  /*  Final document                                                  */
  /* ---------------------------------------------------------------- */
  const doc = {
    _type: 'mondayTrainingPage',
    title: 'Monday Training',
    seoTitle: 'monday.com Training | Fruition Services',
    seoDescription:
      'Official monday.com training for your entire team. Get certified and confident on the platform.',

    // Hero — SINGLE CTA, no hero image
    heroHeadingPart1: 'Get your team official monday.com ',
    heroHeadingAccent: 'workflow training',
    heroSubheading:
      'Expert Workflow Training delivered by a certified monday partner.\nOur training and adoption programs helps you onboard and and adopt monday.com up to 10x faster.',
    heroImage: undefined,
    heroCertificationBadge,
    heroPrimaryCtaLabel: '\ud83d\ude80 Book a monday.com training consultation',
    heroPrimaryCtaUrl: CALENDLY_URL,
    heroSecondaryCtaLabel: undefined,
    heroSecondaryCtaUrl: undefined,

    // Logo cloud — corrected accent text
    logoCloudHeadingPart1: 'Clients who have used our ',
    logoCloudHeadingAccent: 'monday.com consulting services',

    // Training section intro (new fields)
    trainingIntroHeading:
      'Our consultants help drive adoption and ensure long term success with monday.com',
    trainingIntroSubheading:
      'We transform fragmented business processes into cohesive, automated systems that enhance team collaboration and deliver measurable ROI across your entire organisation.',

    // Training tabs
    trainingSectionHeading:
      'Our expert consultants empower you to adopt workflow automation & AI systems',
    trainingTabs,

    // Empower section (new fields)
    empowerEyebrow: 'monday.com Training Australia',
    empowerHeading: 'Empower with monday.com training',
    empowerBody:
      'Make sure all key stakeholders get the onboarding they need to feel comfortable using and building on the platform day in and day out.\n\nSo no one is so overwhelmed they decide not to touch it\u2013or worse, revert to a combination of spreadsheets.',

    // Training services
    servicesHeading:
      '\ud83d\udc69\ud83c\udffd\u200d\ud83d\udcbc\ud83d\udc68\ud83c\udffb\u200d\ud83d\udcbc Our Training Services',
    trainingServices,

    // Testimonials section
    testimonialsHeading: 'What our customers say about us \ud83d\ude4c',
    testimonialsCtaLabel: '\ud83d\ude80 Start Your Transformation',
    testimonialsCtaUrl: CALENDLY_URL,
    statCardValue: '500+',
    statCardSubtitle:
      'have maximised their workflows with our monday.com expert support',
    statCardCtaLabel: 'Read our case studies',
    statCardCtaUrl: '/customer-testimonials',

    // Calendly
    calendlyHeading: 'Book a 30-minute monday.com training consultation',
    calendlySubheading:
      'Our certified monday.com consultants offer complimentary consultations to help you assess your team\u2019s current challenges, design custom workflow training sessions, build a step-by-step learning roadmap, and highlight best practices to maximise adoption and efficiency.',
    calendlyUrl: CALENDLY_URL,

    // FAQ
    faqHeading: 'Frequently asked questions',
    faqTabs,

    // Discover CTA
    discoverBadge,
    discoverHeading: 'Discover how much monday.com can do for your team.',
    discoverPrimaryCtaLabel: '\ud83d\ude80 Schedule a Consultation',
    discoverPrimaryCtaUrl: CALENDLY_URL,
    discoverSecondaryCtaLabel: '\u25b6\ufe0f Get Started with monday.com',
    discoverSecondaryCtaUrl: CALENDLY_URL,

    // Join 500+ businesses (new section)
    joinSectionHeadingPart1: 'Join ',
    joinSectionHeadingAccent: '500+ businesses',
    joinSectionHeadingPart2:
      ' that have leveraged our monday.com expert consultants.',
    joinSectionSubheading: 'The economic impact of',
    joinSectionStats,
    joinSectionFootnote: 'Data by',
    joinSectionBadge,

    // Security badge
    securityBadge,
  }

  console.log('— Writing mondayTrainingPage singleton…')
  await writeClient.createOrReplace({ _id: 'mondayTrainingPage', ...doc })
  console.log('\u2713 mondayTrainingPage uploaded')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
