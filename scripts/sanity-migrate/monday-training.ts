/**
 * Migrate the hardcoded /monday-training page to the `mondayTrainingPage`
 * Sanity singleton.
 *
 * Run with:
 *   npx tsx scripts/sanity-migrate/monday-training.ts
 */
import { writeClient, uploadLocalImage, withKeys } from './lib'

const CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'

async function main() {
  console.log('— Uploading monday-training images…')

  // No dedicated monday-training hero image exists in /public/images,
  // so fall back to the implementation-packages hero as a placeholder.
  const heroImage = await uploadLocalImage('/images/implementation-packages-hero.png')
  const heroCertificationBadge = await uploadLocalImage('/images/badge-certifications.png')
  const securityBadge = await uploadLocalImage('/images/badge-security.png')
  const discoverBadge = heroCertificationBadge

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
          title: 'Boards & Views',
          bullets: [
            'Kanban, Gantt, Timeline, Calendar, and Chart views',
            'Custom columns for any data type',
            'Grouping and filtering for clarity',
          ],
        },
        {
          _type: 'trainingItem',
          number: '02',
          title: 'Automations & Integrations',
          bullets: [
            'No-code automation recipes',
            'Connect with 200+ tools like Slack, Gmail, and Jira',
            'Custom API integrations for advanced workflows',
          ],
        },
        {
          _type: 'trainingItem',
          number: '03',
          title: 'Dashboards & Reporting',
          bullets: [
            'Real-time dashboards across multiple boards',
            'Custom widgets for KPIs and metrics',
            'Export and share reports with stakeholders',
          ],
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
          title: 'Customised Training Programs',
          bullets: [
            'Role-specific training tailored to your team',
            'Hands-on workshops with real board configurations',
            'Train-the-trainer programs for internal champions',
          ],
        },
        {
          _type: 'trainingItem',
          number: '02',
          title: 'Ongoing Support & Coaching',
          bullets: [
            'Post-training support to reinforce learning',
            'Regular check-ins to track adoption progress',
            'Advanced training sessions as your team grows',
          ],
        },
        {
          _type: 'trainingItem',
          number: '03',
          title: 'Documentation & Resources',
          bullets: [
            'Guidde video documentation of your workflows',
            'Custom training materials and quick-reference guides',
            'Access to our knowledge base and best practices',
          ],
        },
      ]),
    },
  ])

  const trainingServices = withKeys([
    {
      _type: 'trainingService',
      emoji: '\u2699\ufe0f',
      title: 'Customization',
      subtitle: 'See how to adapt your boards to your team\u2019s needs',
      description:
        'Get the monday.com training you need to set up your CRM or project management tool exactly how you want it. Or get help tidying it up if you\u2019ve already built out your boards.\n\nAfter all, the platform should support the way you want your business to run.',
    },
    {
      _type: 'trainingService',
      emoji: '\ud83d\udc41\ufe0f',
      title: 'Bird\u2019s-Eye View',
      subtitle: 'Build a high-level roll-up of all your boards',
      description:
        'Get help connecting all of your individual boards into one high-level board. So, you can give senior management a general overview of the entire team\u2019s progress.\n\nThey can check the project health, see what each team member is working on, and check on roadblocks\u2014all in a few clicks.',
    },
    {
      _type: 'trainingService',
      emoji: '\ud83d\udd17',
      title: 'IT Support',
      subtitle: 'Integrate your email and all external tools',
      description:
        'With our monday.com training, you\u2019ll get help integrating Gmail, Outlook, Sharepoint, Teams, accounting software, ChatGPT, and dozens of other tools with our open API, so you truly have a single source of truth.',
    },
    {
      _type: 'trainingService',
      emoji: '\ud83d\udcc4',
      title: 'Handover Documentation',
      subtitle: 'Guidde Documentation',
      description:
        'As Guidde certified partners, we leverage Guidde to create monday.com video documentation and training material.\n\nPost training, you\u2019ll get access to personalized video tutorials and written guides for handover documentation.',
      ctaLabel: '\ud83d\udcc4 Learn More About Guidde',
      ctaUrl: '/certified-guidde-partner',
    },
  ])

  const faqTabs = withKeys([
    {
      _type: 'faqTab',
      label: 'Training',
      items: withKeys([
        {
          _type: 'faqPair',
          question: 'Does monday.com have a training program?',
          answer:
            'Yes \u2014 monday.com does have training programs, and they\u2019re offered in a few different formats depending on your needs:\n\nMonday Academy (Free) \u2014 Online learning platform with self-paced video courses and certifications. Covers everything from beginner basics to advanced automations and integrations. Includes role-specific paths (e.g., project managers, admins).\n\nLive Webinars (Free & Paid Options) \u2014 Monday.com regularly hosts webinars with live Q&A. Topics include \u201cGetting Started,\u201d \u201cAutomations Deep Dive,\u201d and best practices for workflows.\n\nCustomer Success Programs (For Teams & Enterprises) \u2014 Dedicated onboarding and tailored training sessions provided for paying customers, especially on Pro and Enterprise plans. These are personalized to your company\u2019s workflows and often led by a Monday.com consultant.\n\nMonday.com Partners & Consultants (Paid) \u2014 Certified partners around the world offer private training, implementation support, and advanced setup. Useful if you need deep customization, third-party integrations, or in-person training.\n\nHelp Center & Community (Free) \u2014 Step-by-step guides, templates, video tutorials, and an active user forum for ongoing learning.',
        },
        {
          _type: 'faqPair',
          question: 'Is monday.com Academy free?',
          answer:
            'Yes, monday.com Academy is completely free. It offers self-paced online courses, certifications, and learning paths for users at every level \u2014 from beginners to advanced administrators. You can earn official monday.com certifications to demonstrate your expertise.',
        },
        {
          _type: 'faqPair',
          question: 'How long does monday.com training take?',
          answer:
            'Training duration depends on the scope and complexity. A basic onboarding session typically takes 2\u20134 hours. Our comprehensive training programs run over 1\u20132 weeks, covering everything from board setup to advanced automations and integrations, tailored to your team\u2019s specific workflows.',
        },
        {
          _type: 'faqPair',
          question: 'Can training be customised for our team?',
          answer:
            'Absolutely. Our training programs are fully customised to your organisation\u2019s workflows, industry, and team structure. We work with you to identify key use cases and build training around the specific boards, automations, and integrations your team will use every day.',
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

  const doc = {
    _type: 'mondayTrainingPage',
    title: 'Monday Training',
    seoTitle: 'monday.com Training | Fruition Services',
    seoDescription:
      'Official monday.com training for your entire team. Get certified and confident on the platform.',

    // Hero
    heroHeadingPart1: 'Get your team official monday.com ',
    heroHeadingAccent: 'workflow training',
    heroSubheading:
      'Expert Workflow Training delivered by a certified monday partner.\nOur training and adoption programs helps you onboard and adopt monday.com up to 10x faster.',
    heroImage,
    heroCertificationBadge,
    heroPrimaryCtaLabel: '\ud83d\ude80 Book a Consultation',
    heroPrimaryCtaUrl: CALENDLY_URL,
    heroSecondaryCtaLabel: '\u25b6\ufe0f Get Started with monday.com',
    heroSecondaryCtaUrl: CALENDLY_URL,

    // Logo cloud
    logoCloudHeadingPart1: 'Clients who have used our ',
    logoCloudHeadingAccent: 'monday.com expert consulting services',

    // Video
    videoEmbedUrl: 'https://www.youtube.com/embed/7vtrtlfC1Zg',
    videoTitle: 'monday CRM Success Story - Star Aviation | Powered by Fruition',

    // Training tabs
    trainingSectionHeading:
      'Our consultants help drive adoption and ensure long term success with monday.com',
    trainingTabs,

    // Training services
    servicesHeading: '\ud83d\udc69\ud83c\udffd\u200d\ud83d\udcbc\ud83d\udc68\ud83c\udffb\u200d\ud83d\udcbc Our Training Services',
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
    calendlyHeading:
      'Schedule A 30-Min Consultation With One of Our monday.com Consultants',
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
