import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'mondayTrainingPage',
  title: 'Monday Training Page',
  type: 'document',
  // @ts-expect-error Sanity experimental API (singleton)
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text' }),

    // Hero
    defineField({ name: 'heroHeadingPart1', title: 'Hero Heading (prefix)', type: 'string' }),
    defineField({ name: 'heroHeadingAccent', title: 'Hero Heading (accent)', type: 'string' }),
    defineField({ name: 'heroSubheading', title: 'Hero Subheading', type: 'text' }),
    defineField({ name: 'heroCertificationBadge', title: 'Hero Certification Banner', type: 'image' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroPrimaryCtaLabel', title: 'Hero Primary CTA Label', type: 'string' }),
    defineField({ name: 'heroPrimaryCtaUrl', title: 'Hero Primary CTA URL', type: 'string' }),
    defineField({ name: 'heroSecondaryCtaLabel', title: 'Hero Secondary CTA Label', type: 'string' }),
    defineField({ name: 'heroSecondaryCtaUrl', title: 'Hero Secondary CTA URL', type: 'string' }),

    // Logo Cloud
    defineField({ name: 'logoCloudHeadingPart1', title: 'Logo Cloud Heading (prefix)', type: 'string' }),
    defineField({ name: 'logoCloudHeadingAccent', title: 'Logo Cloud Heading (accent)', type: 'string' }),

    // Video
    defineField({ name: 'videoEmbedUrl', title: 'Video Embed URL', type: 'url' }),
    defineField({ name: 'videoTitle', title: 'Video Title', type: 'string' }),

    // Training Tabs
    defineField({ name: 'trainingSectionHeading', title: 'Training Section Heading', type: 'string' }),
    defineField({
      name: 'trainingTabs',
      title: 'Training Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trainingTab',
          fields: [
            { name: 'label', title: 'Tab Label', type: 'string' },
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'trainingItem',
                  fields: [
                    { name: 'number', title: 'Number', type: 'string' },
                    { name: 'title', title: 'Title', type: 'string' },
                    { name: 'bullets', title: 'Bullets', type: 'array', of: [{ type: 'string' }] },
                  ],
                },
              ],
            },
          ],
        }),
      ],
    }),

    // Training Services
    defineField({ name: 'servicesHeading', title: 'Services Heading', type: 'string' }),
    defineField({
      name: 'trainingServices',
      title: 'Training Services',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trainingService',
          fields: [
            { name: 'emoji', title: 'Emoji', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'subtitle', title: 'Subtitle', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
            { name: 'ctaUrl', title: 'CTA URL', type: 'string' },
          ],
        }),
      ],
    }),

    // Testimonials section
    defineField({ name: 'testimonialsHeading', title: 'Testimonials Heading', type: 'string' }),
    defineField({ name: 'testimonialsCtaLabel', title: 'Testimonials CTA Label', type: 'string' }),
    defineField({ name: 'testimonialsCtaUrl', title: 'Testimonials CTA URL', type: 'string' }),
    defineField({ name: 'statCardValue', title: 'Stat Card Value', type: 'string' }),
    defineField({ name: 'statCardSubtitle', title: 'Stat Card Subtitle', type: 'text' }),
    defineField({ name: 'statCardCtaLabel', title: 'Stat Card CTA Label', type: 'string' }),
    defineField({ name: 'statCardCtaUrl', title: 'Stat Card CTA URL', type: 'string' }),

    // Calendly
    defineField({ name: 'calendlyHeading', title: 'Calendly Heading', type: 'string' }),
    defineField({ name: 'calendlyUrl', title: 'Calendly URL', type: 'url' }),

    // FAQ
    defineField({ name: 'faqHeading', title: 'FAQ Heading', type: 'string' }),
    defineField({
      name: 'faqTabs',
      title: 'FAQ Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqTab',
          fields: [
            { name: 'label', title: 'Tab Label', type: 'string' },
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'faqPair',
                  fields: [
                    { name: 'question', title: 'Question', type: 'string' },
                    { name: 'answer', title: 'Answer', type: 'text' },
                  ],
                },
              ],
            },
          ],
        }),
      ],
    }),

    // Discover CTA section
    defineField({ name: 'discoverBadge', title: 'Discover Badge Image', type: 'image' }),
    defineField({ name: 'discoverHeading', title: 'Discover Heading', type: 'string' }),
    defineField({ name: 'discoverPrimaryCtaLabel', title: 'Discover Primary CTA Label', type: 'string' }),
    defineField({ name: 'discoverPrimaryCtaUrl', title: 'Discover Primary CTA URL', type: 'string' }),
    defineField({ name: 'discoverSecondaryCtaLabel', title: 'Discover Secondary CTA Label', type: 'string' }),
    defineField({ name: 'discoverSecondaryCtaUrl', title: 'Discover Secondary CTA URL', type: 'string' }),

    // Security badge
    defineField({ name: 'securityBadge', title: 'Security Badge Image', type: 'image' }),
  ],
})
