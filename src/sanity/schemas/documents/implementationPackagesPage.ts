import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'implementationPackagesPage',
  title: 'Implementation Packages Page',
  type: 'document',
  // @ts-expect-error Sanity experimental API (singleton)
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text' }),

    // Hero section
    defineField({ name: 'heroHeadingPart1', title: 'Hero Heading (plain prefix)', type: 'string' }),
    defineField({ name: 'heroHeadingAccent', title: 'Hero Heading (accent middle)', type: 'string' }),
    defineField({ name: 'heroHeadingPart2', title: 'Hero Heading (plain suffix)', type: 'string' }),
    defineField({ name: 'heroCertificationBadge', title: 'Hero Certification Banner', type: 'image' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroPrimaryCtaLabel', title: 'Hero Primary CTA Label', type: 'string' }),
    defineField({ name: 'heroPrimaryCtaUrl', title: 'Hero Primary CTA URL', type: 'string' }),
    defineField({ name: 'heroSecondaryCtaLabel', title: 'Hero Secondary CTA Label', type: 'string' }),
    defineField({ name: 'heroSecondaryCtaUrl', title: 'Hero Secondary CTA URL', type: 'string' }),

    // Logo cloud section
    defineField({
      name: 'logoCloudHeadingPart1',
      title: 'Logo Cloud Heading (plain prefix)',
      type: 'string',
    }),
    defineField({
      name: 'logoCloudHeadingAccent',
      title: 'Logo Cloud Heading (accent)',
      type: 'string',
    }),

    // YouTube video
    defineField({ name: 'videoEmbedUrl', title: 'Video Embed URL', type: 'url' }),
    defineField({ name: 'videoTitle', title: 'Video Title', type: 'string' }),

    // Services content section
    defineField({
      name: 'servicesIntroHeading',
      title: 'Services Intro Heading (Portable Text)',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'featureCards',
      title: 'Feature Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featureCard',
          fields: [
            { name: 'emoji', title: 'Emoji', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'socialProofBannerHtml',
      title: 'Social Proof Banner (Portable Text)',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({ name: 'socialProofCtaLabel', title: 'Social Proof CTA Label', type: 'string' }),
    defineField({ name: 'socialProofCtaUrl', title: 'Social Proof CTA URL', type: 'string' }),

    // Pricing packages
    defineField({ name: 'pricingHeading', title: 'Pricing Heading', type: 'string' }),
    defineField({
      name: 'packageTiers',
      title: 'Package Tiers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'packageTier',
          fields: [
            { name: 'tabKey', title: 'Tab Key (Guided / Lock-step / Bespoke)', type: 'string' },
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'badge', title: 'Badge (timeline)', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            {
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'packageFeature',
                  fields: [
                    { name: 'emoji', title: 'Emoji', type: 'string' },
                    { name: 'label', title: 'Label', type: 'string' },
                  ],
                },
              ],
            },
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

    // Calendly section
    defineField({ name: 'calendlyHeading', title: 'Calendly Heading', type: 'string' }),
    defineField({ name: 'calendlyUrl', title: 'Calendly URL', type: 'url' }),

    // FAQ section
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

    // Methodology section
    defineField({ name: 'methodologyHeading', title: 'Methodology Heading', type: 'string' }),
    defineField({ name: 'methodologyHeadingAccent', title: 'Methodology Heading Accent', type: 'string' }),
    defineField({
      name: 'methodologySteps',
      title: 'Methodology Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'methodologyStep',
          fields: [
            { name: 'number', title: 'Number', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'bullets', title: 'Bullets', type: 'array', of: [{ type: 'string' }] },
            { name: 'extraText', title: 'Extra Text', type: 'text' },
          ],
        }),
      ],
    }),

    // Security badge at bottom
    defineField({ name: 'securityBadge', title: 'Security Badge Image', type: 'image' }),
  ],
})
