import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faqBlock',
  title: 'FAQ Block',
  type: 'object',
  fields: [
    defineField({
      name: 'blockType',
      title: 'Block Type',
      type: 'string',
      hidden: true,
      initialValue: 'faqBlock',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text' }),
          ],
        },
      ],
    }),
  ],
})
