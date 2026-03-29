import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonialBlock',
  title: 'Testimonial Block',
  type: 'object',
  fields: [
    defineField({
      name: 'blockType',
      title: 'Block Type',
      type: 'string',
      hidden: true,
      initialValue: 'testimonialBlock',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
  ],
})
