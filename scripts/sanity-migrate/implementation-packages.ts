/**
 * Migrate the hardcoded Implementation Packages page into the Sanity
 * `implementationPackagesPage` singleton.
 *
 * Run with:
 *   npx tsx scripts/sanity-migrate/implementation-packages.ts
 */
import {
  writeClient,
  uploadLocalImage,
  withKeys,
  textToPortableText,
} from './lib'

const CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'

async function main() {
  console.log('Uploading implementation-packages images...')
  const heroImage = await uploadLocalImage('/images/implementation-packages-hero.png')
  const heroCertificationBadge = await uploadLocalImage('/images/badge-certifications.png')
  // lib caches by absolute path, so this returns the same ref as above.
  const discoverBadge = await uploadLocalImage('/images/badge-certifications.png')
  const securityBadge = await uploadLocalImage('/images/badge-security.png')

  const doc = {
    _type: 'implementationPackagesPage',
    title: 'Implementation Packages',
    seoTitle: 'monday.com Expert Consulting & Implementation Packages | Fruition Services',
    seoDescription:
      'Structured monday.com implementation packages to get your team running fast. Certified Fruition consultants for Guided, Lock-step, and Bespoke rollouts.',

    // Hero
    heroHeadingPart1: 'monday.com ',
    heroHeadingAccent: 'Expert Consulting',
    heroHeadingPart2: ' & Implementation Packages',
    heroImage,
    heroCertificationBadge,
    heroPrimaryCtaLabel: '\uD83D\uDE80 Book a Consultation',
    heroPrimaryCtaUrl: CALENDLY_URL,
    heroSecondaryCtaLabel: '\u25B6\uFE0F Get Started with monday.com',
    heroSecondaryCtaUrl: CALENDLY_URL,

    // Logo cloud
    logoCloudHeadingPart1: 'Clients who have used our ',
    logoCloudHeadingAccent: 'monday.com expert consulting services',

    // Video
    videoEmbedUrl: 'https://www.youtube.com/embed/7vtrtlfC1Zg',
    videoTitle: 'monday CRM Success Story - Star Aviation | Powered by Fruition',

    // Services intro
    servicesIntroHeading: textToPortableText(
      'As official monday.com Partners, let us help you get set up right, the first time.'
    ),
    featureCards: withKeys([
      {
        _type: 'featureCard',
        emoji: '\uD83E\uDD1D',
        title: 'Flexible Support Options with our monday.com Consultants',
        description:
          'We cater to all support needs. Some of our clients need a quick hand to get started with best practices, others need an end to end solution and adoption plan. Your unique requirements can be achieved with the below three implementation packages.',
      },
      {
        _type: 'featureCard',
        emoji: '\uD83E\uDDD1\u200D\uD83D\uDCBB',
        title: 'Get monday.com Expert Guidance in your time zone',
        description:
          'We cater to all support needs. Some of our clients need a quick hand to get started with best practices, others need an end to end solution and adoption plan. Your unique requirements can be achieved with the below three implementation packages.',
      },
    ]),

    socialProofBannerHtml: textToPortableText(
      "Over 500+ small-medium sized enterprises choose Fruition's monday.com consultants for our clear communication, timely delivery, and transparency on costs."
    ),
    socialProofCtaLabel: '\uD83D\uDE80 Schedule a Meeting',
    socialProofCtaUrl: CALENDLY_URL,

    // Pricing
    pricingHeading: 'Pricing Packages',
    packageTiers: withKeys([
      {
        _type: 'packageTier',
        tabKey: 'Guided',
        name: 'Quick Start',
        badge: '7 Day Delivery Timeline / 10 Hours',
        description:
          "Get up and running fast with monday.com. We\u2019ll help you configure templates and train you on best practices for your team\u2019s workflows. Transform monday.com into your centralized hub for project management and collaboration in record time.",
        features: withKeys([
          { _type: 'packageFeature', emoji: '\uD83D\uDCC4', label: 'Requirements' },
          { _type: 'packageFeature', emoji: '\uD83D\uDCC2', label: 'Template Configuration' },
          { _type: 'packageFeature', emoji: '\uD83D\uDC65', label: 'Best Practices Training' },
        ]),
      },
      {
        _type: 'packageTier',
        tabKey: 'Lock-step',
        name: 'Growth',
        badge: '14 Day Delivery Timeline / 20 Hours',
        description:
          "Ideal for teams that need deeper customization and hands-on guidance. We\u2019ll work alongside your team to design workflows, automate processes, and ensure full adoption across departments.",
        features: withKeys([
          { _type: 'packageFeature', emoji: '\uD83D\uDCC4', label: 'Requirements' },
          { _type: 'packageFeature', emoji: '\uD83D\uDCC2', label: 'Template Configuration' },
          { _type: 'packageFeature', emoji: '\uD83D\uDC65', label: 'Best Practices Training' },
          { _type: 'packageFeature', emoji: '\u2699\uFE0F', label: 'Workflow Automation' },
          { _type: 'packageFeature', emoji: '\uD83D\uDCCA', label: 'Dashboard Setup' },
        ]),
      },
      {
        _type: 'packageTier',
        tabKey: 'Bespoke',
        name: 'Enterprise',
        badge: 'Custom Delivery Timeline / 40+ Hours',
        description:
          'A fully tailored implementation for complex organizations. From integrations to change management, our consultants embed with your team to deliver a comprehensive monday.com rollout.',
        features: withKeys([
          { _type: 'packageFeature', emoji: '\uD83D\uDCC4', label: 'Requirements' },
          { _type: 'packageFeature', emoji: '\uD83D\uDCC2', label: 'Template Configuration' },
          { _type: 'packageFeature', emoji: '\uD83D\uDC65', label: 'Best Practices Training' },
          { _type: 'packageFeature', emoji: '\u2699\uFE0F', label: 'Workflow Automation' },
          { _type: 'packageFeature', emoji: '\uD83D\uDCCA', label: 'Dashboard Setup' },
          { _type: 'packageFeature', emoji: '\uD83D\uDD17', label: 'Integrations' },
        ]),
      },
    ]),

    // Testimonials
    testimonialsHeading: 'What our customers say about us \uD83D\uDE4C',
    testimonialsCtaLabel: '\uD83D\uDE80 Start Your Transformation',
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
    faqTabs: withKeys([
      {
        _type: 'faqTab',
        label: 'Professional Services',
        items: withKeys([
          {
            _type: 'faqPair',
            question: 'Does monday com have a CRM?',
            answer:
              'Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes.',
          },
          {
            _type: 'faqPair',
            question: 'Does monday com have task management?',
            answer:
              'Yes, monday.com excels at task management. It provides boards, timelines, Gantt charts, and Kanban views to help teams organize and track tasks efficiently.',
          },
          {
            _type: 'faqPair',
            question: 'Why is monday.com so successful?',
            answer:
              'monday.com is successful because of its intuitive interface, powerful automations, flexible customization, and seamless integrations with hundreds of tools businesses already use.',
          },
          {
            _type: 'faqPair',
            question: 'What exactly does monday.com do?',
            answer:
              'monday.com is a Work OS that powers teams to run projects, workflows, and everyday work. It centralizes all your work, processes, tools, and files into one platform.',
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
        ]),
      },
      {
        _type: 'faqTab',
        label: 'Expert Consultant Guide',
        items: withKeys([
          {
            _type: 'faqPair',
            question: 'What does a monday.com consultant do?',
            answer:
              'A monday.com consultant helps businesses plan, implement, and optimize their monday.com setup. They bring best practices, technical expertise, and industry knowledge to ensure maximum ROI.',
          },
        ]),
      },
      {
        _type: 'faqTab',
        label: 'General Questions',
        items: withKeys([
          {
            _type: 'faqPair',
            question: 'How much does monday.com cost?',
            answer:
              'monday.com pricing varies by plan and team size. Contact us for a consultation to determine the best plan for your organization.',
          },
        ]),
      },
    ]),

    // Discover CTA
    discoverBadge,
    discoverHeading: 'Discover how much monday.com can do for your team.',
    discoverPrimaryCtaLabel: '\uD83D\uDE80 Schedule a Consultation',
    discoverPrimaryCtaUrl: CALENDLY_URL,
    discoverSecondaryCtaLabel: '\u25B6\uFE0F Get Started with monday.com',
    discoverSecondaryCtaUrl: CALENDLY_URL,

    // Methodology
    methodologyHeading: 'monday.com Implementation Methodology:',
    methodologyHeadingAccent: 'A Step-by-Step Guide',
    methodologySteps: withKeys([
      {
        _type: 'methodologyStep',
        number: '01',
        title: 'Discovery and Process Analysis \uD83C\uDFAF',
        description:
          'The first step in any monday.com implementation package is understanding your current workflows. During the discovery processes phase, we help businesses analyse their:',
        bullets: [
          'Team structures and responsibilities',
          'Existing project management or task-tracking processes',
          'Automation opportunities and reporting needs',
        ],
        extraText:
          'This phase allows you to identify which boards, dashboards, and integrations are essential to streamline operations.',
      },
      {
        _type: 'methodologyStep',
        number: '02',
        title: 'Platform Configuration & Customisation \u2699\uFE0F',
        description:
          'Based on the discovery findings, we configure monday.com to match your workflows. This includes setting up boards, automations, dashboards, and integrations.',
      },
      {
        _type: 'methodologyStep',
        number: '03',
        title: 'Data Migration & Integration \uD83D\uDD04',
        description:
          'We handle migrating your existing data and connecting monday.com with your current tech stack \u2014 email, CRM, accounting, project tools, and more.',
      },
      {
        _type: 'methodologyStep',
        number: '04',
        title: 'Training & Onboarding \uD83D\uDC65',
        description:
          'Every team member gets hands-on training tailored to their role. We make sure your team is confident using the platform from day one.',
      },
      {
        _type: 'methodologyStep',
        number: '05',
        title: 'Go-Live & Ongoing Support \uD83D\uDE80',
        description:
          'We monitor the rollout, gather feedback, and fine-tune the setup. Post-launch support ensures you get maximum value from your investment.',
      },
    ]),

    securityBadge,
  }

  // Singleton: fixed _id so re-running overwrites.
  await writeClient.createOrReplace({
    _id: 'implementationPackagesPage',
    ...doc,
  })
  console.log('\u2713 implementationPackagesPage uploaded')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
