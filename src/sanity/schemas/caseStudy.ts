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
    /* Central-store fields (2026-07): caseStudy is the single quote-testimonial
       store; the per-page testimonial arrays (industryTestimonials,
       partnerTestimonials, solarTestimonials, inlineTestimonials) are being
       consolidated into these docs. */
    {
      name: 'headline',
      title: 'Quote headline',
      type: 'string',
      description: 'Optional short headline shown above the quote (used by industry-page testimonial cards).',
    },
    {
      name: 'industry',
      title: 'Industry',
      type: 'string',
      description: 'e.g. "Construction", "Solar & Renewables" - used for grouping/filtering.',
    },
    {
      name: 'platform',
      title: 'Platform / product',
      type: 'string',
      description: 'e.g. "monday CRM", "Jira", "HubSpot" - used for grouping/filtering.',
    },
    {
      name: 'pages',
      title: 'Show on pages',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Page keys (route path without leading slash) whose testimonial sections feature this quote. Same keys as FAQ items / closing CTAs.',
    },
    { name: 'order', title: 'Order within a page', type: 'number' },
  ],
}
