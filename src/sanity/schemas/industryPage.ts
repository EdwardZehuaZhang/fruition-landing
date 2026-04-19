export default {
  name: 'industryPage',
  title: 'Industry Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'text' },
    { name: 'industryName', title: 'Industry Name', type: 'string' },

    // Hero section
    { name: 'heroEyebrow', title: 'Hero Eyebrow (small label above heading)', type: 'string' },
    { name: 'heroHeading', title: 'Hero Heading', type: 'string' },
    { name: 'heroSubheading', title: 'Hero Subheading', type: 'text' },
    { name: 'heroBody', title: 'Hero Body Text (paragraph below subheading)', type: 'text' },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'heroLocalVideoSrc', title: 'Hero Local Video Path (e.g. /videos/construction-hero.mp4)', type: 'string' },
    { name: 'heroVideoUrl', title: 'Hero Video URL (YouTube, shown below logo cloud)', type: 'url' },
    { name: 'heroVideoTitle', title: 'Hero Video Title', type: 'string' },
    {
      name: 'heroPartnerBadges',
      title: 'Hero Partner Badges (overrides global badges in hero)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'partnerBadge',
        fields: [
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'image', title: 'Image', type: 'image' },
          { name: 'width', title: 'Width', type: 'number' },
          { name: 'height', title: 'Height', type: 'number' },
        ],
      }],
    },
    {
      name: 'heroStats',
      title: 'Hero Stats Row',
      type: 'array',
      of: [{
        type: 'object',
        name: 'heroStat',
        fields: [
          { name: 'value', title: 'Value (e.g. "500+")', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
      }],
    },
    { name: 'hideHeroSubheading', title: 'Hide Hero Subheading', type: 'boolean', initialValue: false },

    // CTA buttons
    { name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string' },
    { name: 'primaryCtaUrl', title: 'Primary CTA URL', type: 'string' },
    { name: 'secondaryCtaLabel', title: 'Secondary CTA Label', type: 'string' },
    { name: 'secondaryCtaUrl', title: 'Secondary CTA URL', type: 'string' },

    // Body content
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },

    // Logo cloud overrides
    { name: 'logoCloudHeadingPart1', title: 'Logo Cloud Heading (prefix)', type: 'string' },
    { name: 'logoCloudHeadingAccent', title: 'Logo Cloud Heading (accent)', type: 'string' },
    { name: 'logoCloudDescription', title: 'Logo Cloud Description (below heading)', type: 'text' },

    // Comparison / tabbed section
    { name: 'comparisonHeading', title: 'Comparison Section Heading', type: 'string' },
    { name: 'comparisonSubheading', title: 'Comparison Section Subheading', type: 'text' },
    {
      name: 'comparisonTheme',
      title: 'Comparison Section Theme',
      type: 'string',
      options: { list: [{ title: 'Light', value: 'light' }, { title: 'Dark', value: 'dark' }] },
    },
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

    // Capabilities grid
    { name: 'capabilitiesEyebrow', title: 'Capabilities Eyebrow', type: 'string' },
    { name: 'capabilitiesHeading', title: 'Capabilities Heading', type: 'string' },
    { name: 'capabilitiesHeadingAccent', title: 'Capabilities Heading Accent', type: 'string' },
    { name: 'capabilitiesSubheading', title: 'Capabilities Subheading', type: 'text' },
    {
      name: 'capabilitiesTheme',
      title: 'Capabilities Theme',
      type: 'string',
      options: { list: [{ title: 'Light', value: 'light' }, { title: 'Dark', value: 'dark' }] },
    },
    {
      name: 'capabilitiesColumns',
      title: 'Capabilities Columns',
      type: 'number',
      options: { list: [2, 3] },
    },
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
    { name: 'capabilitiesCtaLabel', title: 'Capabilities CTA Label', type: 'string' },
    { name: 'capabilitiesCtaUrl', title: 'Capabilities CTA URL', type: 'string' },

    // Secondary capabilities grid
    { name: 'secondaryCapabilitiesEyebrow', title: 'Secondary Capabilities Eyebrow', type: 'string' },
    { name: 'secondaryCapabilitiesHeading', title: 'Secondary Capabilities Heading', type: 'string' },
    { name: 'secondaryCapabilitiesHeadingAccent', title: 'Secondary Capabilities Heading Accent', type: 'string' },
    { name: 'secondaryCapabilitiesSubheading', title: 'Secondary Capabilities Subheading', type: 'text' },
    {
      name: 'secondaryCapabilitiesCards',
      title: 'Secondary Capabilities Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'secondaryCapabilityCard',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
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
    {
      name: 'secondaryCapabilitiesColumns',
      title: 'Secondary Capabilities Columns',
      type: 'number',
      options: { list: [2, 3] },
    },
    { name: 'secondaryCapabilitiesCtaLabel', title: 'Secondary Capabilities CTA Label', type: 'string' },
    { name: 'secondaryCapabilitiesCtaUrl', title: 'Secondary Capabilities CTA URL', type: 'string' },

    // Remote team / global offices section
    { name: 'remoteTeamEyebrow', title: 'Remote Team Eyebrow', type: 'string' },
    { name: 'remoteTeamHeading', title: 'Remote Team Heading', type: 'string' },
    { name: 'remoteTeamHeadingAccent', title: 'Remote Team Heading Accent', type: 'string' },
    { name: 'remoteTeamSubheading', title: 'Remote Team Subheading', type: 'text' },
    {
      name: 'officeLocations',
      title: 'Office Locations',
      type: 'array',
      of: [{
        type: 'object',
        name: 'officeLocation',
        fields: [
          { name: 'flag', title: 'Flag Emoji', type: 'string' },
          { name: 'city', title: 'City', type: 'string' },
          { name: 'region', title: 'Region / Label', type: 'string' },
          { name: 'address', title: 'Address', type: 'text' },
        ],
      }],
    },
    {
      name: 'remoteFeatures',
      title: 'Remote Feature Chips',
      type: 'array',
      of: [{
        type: 'object',
        name: 'remoteFeature',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
      }],
    },
    { name: 'remoteTeamCtaLabel', title: 'Remote Team CTA Label', type: 'string' },
    { name: 'remoteTeamCtaUrl', title: 'Remote Team CTA URL', type: 'string' },

    // Feature Number List
    { name: 'featureListHeading', title: 'Feature List Heading', type: 'string' },
    { name: 'featureListHeadingAccent', title: 'Feature List Heading Accent', type: 'string' },
    { name: 'featureListSubheading', title: 'Feature List Subheading', type: 'text' },
    {
      name: 'featureListTheme',
      title: 'Feature List Theme',
      type: 'string',
      options: { list: [{ title: 'Light', value: 'light' }, { title: 'Dark', value: 'dark' }] },
    },
    {
      name: 'featureListColumns',
      title: 'Feature List Columns',
      type: 'number',
      options: { list: [2, 3] },
    },
    {
      name: 'featureListItems',
      title: 'Feature List Items',
      type: 'array',
      of: [{
        type: 'object',
        name: 'featureListItem',
        fields: [
          { name: 'number', title: 'Number', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          { name: 'emoji', title: 'Emoji', type: 'string' },
        ],
      }],
    },

    // Services Cards Grid
    { name: 'servicesHeading', title: 'Services Heading', type: 'string' },
    { name: 'servicesHeadingAccent', title: 'Services Heading Accent', type: 'string' },
    { name: 'servicesSubheading', title: 'Services Subheading', type: 'text' },
    {
      name: 'servicesTheme',
      title: 'Services Theme',
      type: 'string',
      options: { list: [{ title: 'Light', value: 'light' }, { title: 'Dark', value: 'dark' }] },
    },
    {
      name: 'servicesCards',
      title: 'Services Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'serviceCard',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
        ],
      }],
    },

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

    // Long-form text content sections
    {
      name: 'textContentSections',
      title: 'Text Content Sections',
      type: 'array',
      of: [{
        type: 'object',
        name: 'textContentSection',
        fields: [
          { name: 'heading', title: 'Heading', type: 'string' },
          { name: 'headingAccent', title: 'Heading Accent (purple)', type: 'string' },
          { name: 'body', title: 'Body (use blank lines for paragraphs)', type: 'text', rows: 12 },
          {
            name: 'theme',
            title: 'Background',
            type: 'string',
            options: { list: [{ title: 'White', value: 'light' }, { title: 'Tint', value: 'tint' }] },
          },
        ],
      }],
    },

    // Application form embed
    { name: 'applicationFormHeading', title: 'Application Form Heading', type: 'string' },
    { name: 'applicationFormEmbedUrl', title: 'Application Form Embed URL', type: 'url' },

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

    // Section visibility toggles
    { name: 'hideDiscoverSection', title: 'Hide Discover CTA Section', type: 'boolean', initialValue: false },
    { name: 'hideJoinStatsSection', title: 'Hide Join Stats Section', type: 'boolean', initialValue: false },
    { name: 'hideTestimonialBanner', title: 'Hide Testimonial CTA Banner', type: 'boolean', initialValue: false },
    { name: 'hideSecurityBadgeSection', title: 'Hide Security Badge Section', type: 'boolean', initialValue: false },
    { name: 'hideTestimonialsSection', title: 'Hide Testimonials Grid', type: 'boolean', initialValue: false },
    { name: 'hideFaqSection', title: 'Hide FAQ Section', type: 'boolean', initialValue: false },
    { name: 'hideCapabilitiesSection', title: 'Hide Capabilities Section', type: 'boolean', initialValue: false },
    { name: 'hideCaseStudyCardsSection', title: 'Hide Case Study Cards', type: 'boolean', initialValue: false },
    { name: 'hideSolutionCardsSection', title: 'Hide Solution Cards', type: 'boolean', initialValue: false },
  ],
}
