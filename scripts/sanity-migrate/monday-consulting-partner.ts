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
