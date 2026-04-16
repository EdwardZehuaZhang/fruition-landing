export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'emoji', title: 'Emoji', type: 'string' },
    { name: 'photo', title: 'Photo', type: 'image' },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'linkedinUrl', title: 'LinkedIn URL', type: 'string' },
    {
      name: 'regions',
      title: 'Regions',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Australia 🇦🇺', value: 'AU' },
          { title: 'United Kingdom 🇬🇧', value: 'UK' },
          { title: 'United States 🇺🇸', value: 'US' },
        ],
      },
    },
    { name: 'order', title: 'Order', type: 'number' },
  ],
}
