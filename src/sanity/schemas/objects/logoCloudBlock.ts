import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'logoCloudBlock',
  title: 'Logo Cloud Block',
  type: 'object',
  fields: [
    defineField({
      name: 'blockType',
      title: 'Block Type',
      type: 'string',
      hidden: true,
      initialValue: 'logoCloudBlock',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'image', title: 'Image', type: 'image' }),
          ],
        },
      ],
    }),
  ],
})
