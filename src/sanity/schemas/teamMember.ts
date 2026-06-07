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
    {
      name: 'certifications',
      title: 'Certifications (badges shown under the bio)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Certified Core Consultant', value: 'Certified Core Consultant' },
          { title: 'Advanced Workflow Builder', value: 'Advanced Workflow Builder' },
          { title: 'CRM Specialist', value: 'CRM Specialist' },
          { title: 'Make.com Certified', value: 'Make.com Certified' },
          { title: 'n8n Specialist', value: 'n8n Specialist' },
          { title: 'Solutions Architect', value: 'Solutions Architect' },
        ],
      },
    },
    { name: 'linkedinUrl', title: 'LinkedIn URL', type: 'string' },
    {
      name: 'regions',
      title: 'Regions',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'APAC 🌏', value: 'APAC' },
          { title: 'Singapore 🇸🇬', value: 'SG' },
          { title: 'India 🇮🇳', value: 'IN' },
          { title: 'Philippines 🇵🇭', value: 'PH' },
          { title: 'United Kingdom 🇬🇧', value: 'UK' },
          { title: 'United States 🇺🇸', value: 'US' },
          { title: 'Australia 🇦🇺 (legacy)', value: 'AU' },
        ],
      },
    },
    { name: 'order', title: 'Order', type: 'number' },
  ],
}
