export default {
  name: 'caseStudy',
  title: 'Case Study / Testimonial',
  type: 'document',
  fields: [
    /* Two species share this store (2026-07): quote testimonials and the
       filterable case-study cards on /customer-testimonials. `kind`
       discriminates; queries default missing values to "quote". */
    {
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Quote testimonial', value: 'quote' },
          { title: 'Case-study card', value: 'card' },
        ],
        layout: 'radio',
      },
      initialValue: 'quote',
    },
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
      description: 'e.g. "Construction", "Solar & Renewables" — used for grouping/filtering.',
    },
    {
      name: 'platform',
      title: 'Platform / product',
      type: 'string',
      description: 'e.g. "monday CRM", "Jira", "HubSpot" — used for grouping/filtering.',
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
    /* Card-only fields (kind == "card") — the big filterable cards rendered by
       TestimonialFilterGrid. Cards reuse `industry` + `platform` as the two
       filter facets and `pages`/`order` for placement. */
    {
      name: 'title',
      title: 'Card title',
      type: 'string',
      description: 'Headline of the case-study card, e.g. "How Acme scaled field ops on monday CRM".',
      hidden: ({ document }: { document?: { kind?: string } }) => document?.kind !== 'card',
    },
    {
      name: 'image',
      title: 'Card image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ document }: { document?: { kind?: string } }) => document?.kind !== 'card',
    },
    {
      name: 'services',
      title: 'Services description',
      type: 'text',
      hidden: ({ document }: { document?: { kind?: string } }) => document?.kind !== 'card',
    },
    {
      name: 'timeline',
      title: 'Timeline (e.g. "4 weeks")',
      type: 'string',
      hidden: ({ document }: { document?: { kind?: string } }) => document?.kind !== 'card',
    },
    {
      name: 'verifiedSource',
      title: 'Verified source (e.g. "G2 Crowd", "Clutch.co")',
      type: 'string',
      hidden: ({ document }: { document?: { kind?: string } }) => document?.kind !== 'card',
    },
  ],
  preview: {
    select: { kind: 'kind', clientName: 'clientName', title: 'title', quote: 'quote' },
    prepare({ kind, clientName, title, quote }: { kind?: string; clientName?: string; title?: string; quote?: string }) {
      return kind === 'card'
        ? { title: title || 'Untitled card', subtitle: 'Case-study card' }
        : { title: clientName || 'Unnamed client', subtitle: quote ? `“${quote.slice(0, 60)}…”` : 'Quote testimonial' }
    },
  },
}
