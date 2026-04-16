export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'text' },
    { name: 'heroEyebrow', title: 'Hero Eyebrow (small label above heading, e.g. "Careers")', type: 'string' },
    { name: 'heroHeading', title: 'Hero Heading', type: 'string' },
    { name: 'heroSubheading', title: 'Hero Subheading', type: 'text' },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
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
    { name: 'heroVideoUrl', title: 'Hero Video URL (YouTube, shown below logo cloud)', type: 'url' },
    { name: 'heroVideoTitle', title: 'Hero Video Title', type: 'string' },
    { name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string' },
    { name: 'primaryCtaUrl', title: 'Primary CTA URL', type: 'string' },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },

    // Capabilities / Benefits grid (e.g. "Why Join Fruition")
    { name: 'capabilitiesEyebrow', title: 'Capabilities Eyebrow (e.g. "BENEFITS")', type: 'string' },
    { name: 'capabilitiesCtaLabel', title: 'Capabilities CTA Label', type: 'string' },
    { name: 'capabilitiesCtaUrl', title: 'Capabilities CTA URL', type: 'string' },

    // Secondary capabilities grid (e.g. careers "What We're Looking For")
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

    // Remote team / global offices section (e.g. careers page "Work From Anywhere")
    { name: 'remoteTeamEyebrow', title: 'Remote Team Eyebrow (e.g. "🌍 FULLY REMOTE")', type: 'string' },
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

    // Application form embed (e.g. monday.com WorkForms)
    { name: 'applicationFormHeading', title: 'Application Form Heading', type: 'string' },
    { name: 'applicationFormEmbedUrl', title: 'Application Form Embed URL (forms.monday.com/...)', type: 'url' },

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

    // Logo cloud overrides
    { name: 'logoCloudHeadingPart1', title: 'Logo Cloud Heading (prefix)', type: 'string' },
    { name: 'logoCloudHeadingAccent', title: 'Logo Cloud Heading (accent)', type: 'string' },

    // Long-form text content sections (e.g. About Us scalability narrative)
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

    {
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'About', value: 'about' },
          { title: 'Careers', value: 'careers' },
          { title: 'Blog Listing', value: 'blog-listing' },
          { title: 'Thank You', value: 'thank-you' },
          { title: 'Terms', value: 'terms' },
          { title: 'Privacy', value: 'privacy' },
        ],
      },
    },
  ],
}
