import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  // Singleton: only allow update and publish (no create/delete)
  // @ts-expect-error Sanity experimental API
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Blocks',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'richTextBlock' }),
        defineArrayMember({ type: 'ctaBlock' }),
        defineArrayMember({ type: 'featureListBlock' }),
        defineArrayMember({ type: 'testimonialBlock' }),
        defineArrayMember({ type: 'logoCloudBlock' }),
        defineArrayMember({ type: 'postListBlock' }),
        defineArrayMember({ type: 'faqBlock' }),
        defineArrayMember({ type: 'statsBlock' }),
        defineArrayMember({ type: 'calendlyBlock' }),
        defineArrayMember({ type: 'tabSectionBlock' }),
      ],
    }),
  ],
})
