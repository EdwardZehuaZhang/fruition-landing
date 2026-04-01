import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'tabSectionBlock',
  title: 'Tab Section Block',
  type: 'object',
  fields: [
    defineField({
      name: 'blockType',
      title: 'Block Type',
      type: 'string',
      hidden: true,
      initialValue: 'tabSectionBlock',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Tab Label', type: 'string' }),
            defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
            defineField({ name: 'body', title: 'Body Text', type: 'text' }),
            defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
            defineField({ name: 'ctaUrl', title: 'CTA URL', type: 'string' }),
            defineField({
              name: 'features',
              title: 'Feature Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'icon', title: 'Icon/Emoji', type: 'string' }),
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
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
