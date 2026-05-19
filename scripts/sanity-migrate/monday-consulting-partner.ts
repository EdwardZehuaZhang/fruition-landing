/**
 * Sanity migration: monday.com Consulting Partner page
 * (/partnerships/monday-consulting-partner).
 *
 * Rewrites the hero, hero video, comparison tabs heading, and the
 * capabilities "Certified monday.com Partners Delivering Global Excellence"
 * section per the updated brand copy.
 */
import { writeClient, withKeys } from './lib'

const DOC_ID = 'partnershipPage-monday-consulting-partner'
const CALENDLY = 'https://calendly.com/global-calendar-fruitionservices'
const MONDAY_AFFILIATE =
  'https://monday.com/crm?utm_source=Partner&utm_campaign=fruitionanz&utm_banner=fruition_monday_crm__4'

async function main() {
  const patch = {
    title: 'Top monday.com Expert Consultants',
    seoTitle: 'Top monday.com Expert Consultants',
    seoDescription: 'Platinum monday.com Partner in Australia, UK and US',

    // Hero
    heroHeading: 'Top monday.com Expert Consultants',
    heroSubheading: 'Platinum monday.com Partner in Australia, UK and US',
    primaryCtaLabel: '🚀 Book a Consultation',
    primaryCtaUrl: CALENDLY,
    secondaryCtaLabel: '▶️ Get Started with monday.com',
    secondaryCtaUrl: MONDAY_AFFILIATE,

    // Hero video — rendered below the logo cloud by UniversalPageTemplate
    heroVideoUrl: 'https://www.youtube.com/watch?v=7vtrtlfC1Zg',
    heroVideoTitle: 'monday.com overview',

    // Comparison tabs section heading
    comparisonHeading:
      'Streamline Operations & Maximise Efficiency with Our monday.com Consultants',
    comparisonSubheading:
      'We streamline disconnected business processes into integrated, automated workflows that boost team collaboration and drive measurable ROI across your organization. Our expert consultants empower you to adopt workflow automation & AI systems.',

    // "Certified monday.com Partners Delivering Global Excellence" section
    // Rendered via the CapabilitiesGrid with dual CTAs + ✅ feature cards.
    capabilitiesEyebrow: 'Why Choose Fruition for monday.com?',
    capabilitiesHeading: 'Certified monday.com Partners Delivering Global Excellence',
    capabilitiesHeadingAccent: '',
    capabilitiesSubheading:
      'Transform your business operations with Fruition. As trusted monday.com Partners, our certified consultants help organisations worldwide harness the full power of monday.com.',
    capabilitiesTheme: 'light',
    capabilitiesColumns: 2,
    capabilitiesCtaLabel: '🚀 Book a Consultation',
    capabilitiesCtaUrl: CALENDLY,
    capabilitiesCtaSecondaryLabel: '▶️ Get Started with monday.com',
    capabilitiesCtaSecondaryUrl: MONDAY_AFFILIATE,
    capabilitiesCards: withKeys([
      {
        _type: 'capabilityCard',
        emoji: '✅',
        title: 'Certified Monday.com Partner',
        description: '',
      },
      {
        _type: 'capabilityCard',
        emoji: '✅',
        title: 'Global Implementation Expertise',
        description: '',
      },
      {
        _type: 'capabilityCard',
        emoji: '✅',
        title: 'End-to-End Solution Design',
        description: '',
      },
      {
        _type: 'capabilityCard',
        emoji: '✅',
        title: 'Custom Integration Services',
        description: '',
      },
    ]),

    // ---- Hardcoded constants migrated from MondayConsultingPartnerContent.tsx ----

    // Why Choose Fruition for monday.com — simple string list
    whyFruition: [
      'Certified Monday.com Partner',
      'Global Implementation Expertise',
      'End-to-End Solution Design',
      'Custom Integration Services',
    ],

    // Partner testimonials (rendered through TestimonialsGrid)
    partnerTestimonials: withKeys([
      {
        _type: 'partnerTestimonial',
        name: 'Jade Wood',
        role: 'Managing Director, Popology',
        quote:
          "We are now utilising monday.com to its full potential, from lead through design and production teams - everyone knows what stage our projects are in, what's next and what our process is.",
        photo: '/images/solar-testimonial-popology.avif',
      },
      {
        _type: 'partnerTestimonial',
        name: 'Mairhead McKinley',
        role: 'Delivery Manager, Givergy',
        quote:
          'We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information—eliminating the need to email around for updates.',
        photo: '/images/solar-testimonial-givergy.avif',
      },
      {
        _type: 'partnerTestimonial',
        name: 'Brandon-Lee Horridge',
        role: 'Managing Director, BL Air Conditioning',
        quote: 'This system will save hundreds of thousands of dollars a year guaranteed.',
        photo: '',
      },
      {
        _type: 'partnerTestimonial',
        name: 'Ron Amaram',
        role: 'General Manager, Risk 2 Solutions',
        quote:
          "Fruition have been instrumental in moving us to a 'single source of truth' system for managing sales and projects.",
        photo: '',
      },
      {
        _type: 'partnerTestimonial',
        name: 'Lorenzo Tejada-Orrell',
        role: 'Chief Innovation Officer, CLSQ',
        quote:
          'Since implementing monday.com, CLSQ has experienced a significant transformation in operational efficiency.',
        photo: '',
      },
    ]),

    // Implementation services (2x2 grid)
    implementationServices: withKeys([
      {
        _type: 'implementationService',
        emoji: '💼',
        title: 'Business Process Consulting',
        body: 'We help take a snapshot of your current business process and design an automated solution.',
      },
      {
        _type: 'implementationService',
        emoji: '🔄',
        title: 'Implementation Optimisation',
        body: 'We help bring your solution design to fruition from scratch or can optimise your existing workflows within monday.com.',
      },
      {
        _type: 'implementationService',
        emoji: '🔌',
        title: 'Integration & Custom Development',
        body: 'Developer support to build business-critical system integrations & automation with monday.com.',
      },
      {
        _type: 'implementationService',
        emoji: '👥',
        title: 'Training & Managed Services',
        body: 'Basic to advanced 1:1 and team training. We can also lend you one of our resources for long-term and ad-hoc projects!',
      },
    ]),

    // Industry solutions list (left card in the wrap-up section)
    industrySolutions: withKeys([
      { _type: 'industrySolution', emoji: '🛠️', label: 'Construction' },
      { _type: 'industrySolution', emoji: '🏭', label: 'Manufacturing' },
      { _type: 'industrySolution', emoji: '🧰', label: 'Service Industry' },
      { _type: 'industrySolution', emoji: '🎨', label: 'Marketing & Creative' },
      { _type: 'industrySolution', emoji: '💡', label: 'Product Development' },
      { _type: 'industrySolution', emoji: '📊', label: 'Project & Portfolio Management' },
      { _type: 'industrySolution', emoji: '🎯', label: 'Executive Leadership (OKRs)' },
    ]),

    // Countries served (right card in the wrap-up section)
    countries: withKeys([
      { _type: 'country', emoji: '🇦🇺', label: 'Australia' },
      { _type: 'country', emoji: '🇨🇦', label: 'Canada' },
      { _type: 'country', emoji: '🇸🇬', label: 'Singapore' },
      { _type: 'country', emoji: '🇺🇸', label: 'United States (US)' },
      { _type: 'country', emoji: '🇬🇧', label: 'United Kingdom (UK)' },
    ]),

    // Fruition advantage purple banner — numbered list of strings
    fruitionAdvantages: [
      'Expert consultation — understand your unique needs',
      'Custom implementation — tailored solutions that work',
      'Team training — ensure successful adoption',
      'Ongoing support — maximise your investment',
    ],
  }

  console.log('Patching', DOC_ID)
  await writeClient
    .patch(DOC_ID)
    .set(patch)
    .commit()
  console.log('✓ monday-consulting-partner updated')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
