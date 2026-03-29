import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'postListBlock',
  title: 'Post List Block',
  type: 'object',
  fields: [
    defineField({
      name: 'blockType',
      title: 'Block Type',
      type: 'string',
      hidden: true,
      initialValue: 'postListBlock',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'limit',
      title: 'Limit',
      type: 'number',
      initialValue: 3,
    }),
  ],
})
