export default {
  name: 'caseStudy',
  title: 'Case Study / Testimonial',
  type: 'document',
  fields: [
    { name: 'clientName', title: 'Client Name', type: 'string' },
    { name: 'clientRole', title: 'Client Role', type: 'string' },
    { name: 'clientCompany', title: 'Client Company', type: 'string' },
    { name: 'quote', title: 'Quote', type: 'text' },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'profilePhoto', title: 'Profile Photo', type: 'image', options: { hotspot: true } },
    { name: 'linkedinUrl', title: 'LinkedIn URL', type: 'string' },
  ],
}
