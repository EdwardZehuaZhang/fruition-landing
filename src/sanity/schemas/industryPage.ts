export default {
  name: 'industryPage',
  title: 'Industry Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'text' },
    { name: 'heroHeading', title: 'Hero Heading', type: 'string' },
    { name: 'heroSubheading', title: 'Hero Subheading', type: 'text' },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'heroLocalVideoSrc', title: 'Hero Local Video Path (e.g. /videos/construction-hero.mp4)', type: 'string' },
    { name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string' },
    { name: 'primaryCtaUrl', title: 'Primary CTA URL', type: 'string' },
    { name: 'secondaryCtaLabel', title: 'Secondary CTA Label', type: 'string' },
    { name: 'secondaryCtaUrl', title: 'Secondary CTA URL', type: 'string' },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'industryName', title: 'Industry Name', type: 'string' },

    // Comparison / tabbed section
    { name: 'comparisonHeading', title: 'Comparison Section Heading', type: 'string' },
    { name: 'comparisonSubheading', title: 'Comparison Section Subheading', type: 'text' },
    {
      name: 'comparisonTabs',
      title: 'Comparison Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'comparisonTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'comparisonItem',
              fields: [
                { name: 'number', title: 'Number', type: 'string' },
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' },
                {
                  name: 'bullets',
                  title: 'Bullets',
                  type: 'array',
                  of: [{
                    type: 'object',
                    name: 'bullet',
                    fields: [
                      { name: 'emoji', title: 'Emoji', type: 'string' },
                      { name: 'text', title: 'Text', type: 'text' },
                    ],
                  }],
                },
              ],
            }],
          },
        ],
      }],
    },

    // Methodology section
    { name: 'methodologyHeading', title: 'Methodology Heading', type: 'string' },
    {
      name: 'methodologySteps',
      title: 'Methodology Steps',
      type: 'array',
      of: [{
        type: 'object',
        name: 'methodologyStep',
        fields: [
          { name: 'number', title: 'Number', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
        ],
      }],
    },

    // Calendly section
    { name: 'calendlyHeading', title: 'Calendly Heading', type: 'string' },
    { name: 'calendlySubheading', title: 'Calendly Subheading', type: 'text' },

    // FAQ section
    {
      name: 'faqTabs',
      title: 'FAQ Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'faqTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'faqPair',
              fields: [
                { name: 'question', title: 'Question', type: 'string' },
                { name: 'answer', title: 'Answer', type: 'text' },
              ],
            }],
          },
        ],
      }],
    },

    // Join 500+ stats section
    { name: 'joinHeadingPart1', title: 'Join Heading Part 1', type: 'string' },
    { name: 'joinHeadingAccent', title: 'Join Heading Accent', type: 'string' },
    { name: 'joinHeadingPart2', title: 'Join Heading Part 2', type: 'string' },
    { name: 'joinSubheading', title: 'Join Subheading', type: 'string' },
    {
      name: 'joinStats',
      title: 'Join Stats',
      type: 'array',
      of: [{
        type: 'object',
        name: 'stat',
        fields: [
          { name: 'value', title: 'Value', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
      }],
    },
    { name: 'joinFootnote', title: 'Join Footnote', type: 'string' },

    // Industry tabs section
    { name: 'industryHeading', title: 'Industry Section Heading', type: 'string' },
    {
      name: 'industryTabs',
      title: 'Industry Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'industryTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          { name: 'title', title: 'Card Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          {
            name: 'benefits',
            title: 'Benefits',
            type: 'array',
            of: [{
              type: 'object',
              name: 'benefit',
              fields: [
                { name: 'emoji', title: 'Emoji', type: 'string' },
                { name: 'text', title: 'Text', type: 'string' },
              ],
            }],
          },
        ],
      }],
    },

    // Capabilities grid
    { name: 'capabilitiesHeading', title: 'Capabilities Heading', type: 'string' },
    {
      name: 'capabilitiesCards',
      title: 'Capabilities Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'capabilityCard',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
        ],
      }],
    },

    // Solution cards (left-right alternating sections)
    {
      name: 'solutionCards',
      title: 'Solution Cards (left-right)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'solutionCard',
        fields: [
          { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
          { name: 'heading', title: 'Heading', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
          { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
          { name: 'ctaUrl', title: 'CTA URL', type: 'string' },
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
        ],
      }],
    },

    // Case study cards
    { name: 'caseStudySectionHeading', title: 'Case Study Section Heading', type: 'string' },
    {
      name: 'caseStudyCards',
      title: 'Case Study Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'caseStudyCard',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          { name: 'personName', title: 'Person Name', type: 'string' },
          { name: 'personRole', title: 'Person Role', type: 'string' },
          { name: 'image', title: 'Image / Logo', type: 'image' },
          { name: 'videoUrl', title: 'Video URL (optional)', type: 'url' },
        ],
      }],
    },

    // Bottom video embed
    { name: 'bottomVideoUrl', title: 'Bottom Video URL', type: 'url' },
    { name: 'bottomVideoTitle', title: 'Bottom Video Title', type: 'string' },

    // Logo cloud overrides
    { name: 'logoCloudHeadingPart1', title: 'Logo Cloud Heading (prefix)', type: 'string' },
    { name: 'logoCloudHeadingAccent', title: 'Logo Cloud Heading (accent)', type: 'string' },

    // Section visibility toggles
    { name: 'hideDiscoverSection', title: 'Hide Discover CTA Section', type: 'boolean', initialValue: false },
    { name: 'hideJoinStatsSection', title: 'Hide Join Stats Section', type: 'boolean', initialValue: false },
    { name: 'hideTestimonialBanner', title: 'Hide Testimonial CTA Banner', type: 'boolean', initialValue: false },
  ],
}
