/**
 * closingCta - copy for the site-wide ClosingCtaSection banner.
 *
 * Resolution mirrors faqItem: a doc tagged with a page key overrides that
 * page's built-in copy. Pages keep their previous copy as a render fallback,
 * so deleting a doc never breaks a page. One doc may cover many pages
 * (e.g. the practice-cluster default spans all 38 practice routes).
 */
export default {
  name: 'closingCta',
  title: 'Closing CTA banner',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Internal title',
      type: 'string',
      description: 'Editor-facing label only (e.g. "Default", "Anthropic partner page").',
    },
    { name: 'eyebrow', title: 'Eyebrow (mono label)', type: 'string' },
    { name: 'heading', title: 'Heading', type: 'string', validation: (r: { required: () => unknown }) => r.required() },
    {
      name: 'headingAccent',
      title: 'Heading accent',
      type: 'string',
      description: 'Exact substring of the heading rendered in the accent colour.',
    },
    { name: 'lead', title: 'Lead paragraph', type: 'text', rows: 2 },
    { name: 'primaryLabel', title: 'Primary CTA label', type: 'string' },
    {
      name: 'primaryUrl',
      title: 'Primary CTA URL',
      type: 'string',
      description: 'Leave empty to use the site-wide Calendly link.',
    },
    { name: 'secondaryLabel', title: 'Secondary CTA label', type: 'string' },
    { name: 'secondaryUrl', title: 'Secondary CTA URL', type: 'string' },
    {
      name: 'pages',
      title: 'Show on pages',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Page keys (route path without leading slash, e.g. "ai-consulting/n8n" or "partnerships/aws-partner"). Same keys as FAQ items.',
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'heading' },
  },
}
