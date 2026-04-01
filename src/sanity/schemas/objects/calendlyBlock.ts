import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'calendlyBlock',
  title: 'Calendly Block',
  type: 'object',
  fields: [
    defineField({
      name: 'blockType',
      title: 'Block Type',
      type: 'string',
      hidden: true,
      initialValue: 'calendlyBlock',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
    defineField({ name: 'calendlyUrl', title: 'Calendly URL', type: 'string' }),
  ],
})
