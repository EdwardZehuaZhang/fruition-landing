import { defineType, defineField, defineArrayMember } from 'sanity'

// Reusable comparison-tab item definition (same shape used by servicePage)
const comparisonTabField = {
  type: 'object',
  name: 'makeComparisonTab',
  fields: [
    { name: 'label', title: 'Tab Label', type: 'string' },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{
        type: 'object',
        name: 'makeComparisonItem',
        fields: [
          { name: 'number', title: 'Number', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          {
            name: 'bullets',
            title: 'Bullets (emoji + text)',
            type: 'array',
            of: [{
              type: 'object',
              name: 'makeBullet',
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
}

export default defineType({
  name: 'makePartnersPage',
  title: 'Make Partners Page',
  type: 'document',
  // @ts-expect-error Sanity experimental API (singleton)
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text' }),

    // Hero
    defineField({ name: 'heroHeadingPart1', title: 'Hero Heading (plain prefix)', type: 'string' }),
    defineField({ name: 'heroHeadingAccent', title: 'Hero Heading (accent / purple)', type: 'string' }),
    defineField({ name: 'heroSubheading', title: 'Hero Subheading', type: 'text' }),
    defineField({ name: 'heroPrimaryCtaLabel', title: 'Hero CTA Label', type: 'string' }),
    defineField({ name: 'heroPrimaryCtaUrl', title: 'Hero CTA URL (leave blank to use Calendly)', type: 'string' }),
    defineField({ name: 'heroImage', title: 'Hero Image (e.g. Make Gold Partner badge composite)', type: 'image', options: { hotspot: true } }),

    // Logo cloud
    defineField({ name: 'logoCloudHeadingPart1', title: 'Logo Cloud Heading (prefix)', type: 'string' }),
    defineField({ name: 'logoCloudHeadingAccent', title: 'Logo Cloud Heading (accent)', type: 'string' }),

    // Feature / comparison tabs
    defineField({ name: 'comparisonHeading', title: 'Feature Tabs Section Heading', type: 'string' }),
    defineField({
      name: 'comparisonTabs',
      title: 'Feature Tabs',
      type: 'array',
      of: [defineArrayMember(comparisonTabField)],
    }),

    // Showcase cards (alternating image/video + text)
    defineField({ name: 'showcaseHeading', title: 'Showcase Section Heading', type: 'string' }),
    defineField({ name: 'showcaseSubheading', title: 'Showcase Section Subheading', type: 'text' }),
    defineField({
      name: 'showcaseCards',
      title: 'Showcase Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'showcaseCard',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string' },
            { name: 'body', title: 'Body', type: 'text' },
            { name: 'imageRight', title: 'Media on the right?', type: 'boolean' },
            {
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: { list: [{ title: 'Image', value: 'image' }, { title: 'Video', value: 'video' }] },
            },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'video', title: 'Video File', type: 'file', options: { accept: 'video/*' } },
          ],
        }),
      ],
    }),

    // Calendly
    defineField({ name: 'calendlyHeading', title: 'Calendly Section Heading', type: 'string' }),
    defineField({ name: 'calendlySubheading', title: 'Calendly Section Subheading', type: 'text' }),

    // Testimonials section
    defineField({ name: 'testimonialsHeading', title: 'Testimonials Heading', type: 'string' }),
    defineField({ name: 'testimonialsCtaLabel', title: 'Testimonials CTA Label', type: 'string' }),
    defineField({ name: 'testimonialsCtaUrl', title: 'Testimonials CTA URL', type: 'string' }),
    defineField({ name: 'statCardValue', title: 'Stat Card Value', type: 'string' }),
    defineField({ name: 'statCardSubtitle', title: 'Stat Card Subtitle', type: 'text' }),
    defineField({ name: 'statCardCtaLabel', title: 'Stat Card CTA Label', type: 'string' }),
    defineField({ name: 'statCardCtaUrl', title: 'Stat Card CTA URL', type: 'string' }),

    // Join Stats section
    defineField({ name: 'joinHeadingPart1', title: 'Join Section Heading (prefix)', type: 'string' }),
    defineField({ name: 'joinHeadingAccent', title: 'Join Section Heading (accent)', type: 'string' }),
    defineField({ name: 'joinHeadingPart2', title: 'Join Section Heading (suffix)', type: 'string' }),
    defineField({
      name: 'joinStats',
      title: 'Join Section Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'joinStat',
          fields: [
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' },
          ],
        }),
      ],
    }),
    defineField({ name: 'joinCtaLabel', title: 'Join Section CTA Label', type: 'string' }),
    defineField({ name: 'joinCtaUrl', title: 'Join Section CTA URL (leave blank to use Calendly)', type: 'string' }),

    // Testimonial CTA Banner
    defineField({ name: 'testimonialBannerHeadingPart1', title: 'Testimonial Banner Heading (prefix)', type: 'string' }),
    defineField({ name: 'testimonialBannerHeadingAccent', title: 'Testimonial Banner Heading (accent)', type: 'string' }),
    defineField({ name: 'testimonialBannerHeadingPart2', title: 'Testimonial Banner Heading (suffix)', type: 'string' }),
    defineField({ name: 'testimonialBannerPrimaryCtaLabel', title: 'Testimonial Banner Primary CTA Label', type: 'string' }),
    defineField({ name: 'testimonialBannerPrimaryCtaUrl', title: 'Testimonial Banner Primary CTA URL', type: 'string' }),
    defineField({ name: 'testimonialBannerSecondaryCtaLabel', title: 'Testimonial Banner Secondary CTA Label', type: 'string' }),
    defineField({ name: 'testimonialBannerSecondaryCtaUrl', title: 'Testimonial Banner Secondary CTA URL', type: 'string' }),

    // Hero secondary CTA
    defineField({ name: 'heroSecondaryCtaLabel', title: 'Hero Secondary CTA Label', type: 'string' }),
    defineField({ name: 'heroSecondaryCtaUrl', title: 'Hero Secondary CTA URL', type: 'string' }),

    // Partnership announcement
    defineField({ name: 'announcementHeading', title: 'Announcement Heading', type: 'text' }),
    defineField({ name: 'announcementBody', title: 'Announcement Body', type: 'text' }),
    defineField({ name: 'announcementImage', title: 'Announcement Image', type: 'image', options: { hotspot: true } }),

    // Feature lists section (dark)
    defineField({ name: 'featureListsHeading', title: 'Feature Lists Section Heading', type: 'string' }),
    defineField({ name: 'featureListsSubheading', title: 'Feature Lists Section Subheading', type: 'text' }),
    defineField({ name: 'featureListsRightEyebrow', title: 'Feature Lists Right Column Eyebrow', type: 'string' }),
    defineField({ name: 'featureListsFooter', title: 'Feature Lists Footer Paragraph', type: 'text' }),
    defineField({
      name: 'featureListLeft',
      title: 'Feature List Left Column',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'text', title: 'Text', type: 'string' },
        ],
      })],
    }),
    defineField({
      name: 'featureListRight',
      title: 'Feature List Right Column',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'text', title: 'Text', type: 'string' },
        ],
      })],
    }),

    // Discover CTA
    defineField({ name: 'discoverHeading', title: 'Discover Section Heading', type: 'string' }),
  ],
})
