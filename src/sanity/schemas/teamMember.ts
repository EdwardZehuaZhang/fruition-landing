export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'photo', title: 'Photo', type: 'image' },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'linkedinUrl', title: 'LinkedIn URL', type: 'string' },
    { name: 'order', title: 'Order', type: 'number' },
  ],
}
