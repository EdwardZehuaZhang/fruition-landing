import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'teamsTransformedBlock',
  title: 'Teams Transformed Block',
  type: 'object',
  fields: [
    defineField({
      name: 'blockType',
      title: 'Block Type',
      type: 'string',
      hidden: true,
      initialValue: 'teamsTransformedBlock',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Tab Label', type: 'string' }),
            defineField({ name: 'subheading', title: 'Tab Subheading (optional)', type: 'text' }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'title', title: 'Title', type: 'string' }),
                    defineField({ name: 'description', title: 'Description', type: 'text' }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
  ],
})
