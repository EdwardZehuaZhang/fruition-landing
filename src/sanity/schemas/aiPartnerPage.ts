/**
 * AI Partner Page — bespoke, brand-styled partner landing pages
 * (Anthropic Claude, OpenAI ChatGPT, Openclaw). These reproduce the
 * hand-designed HTML layouts (hero side panel, capabilities, showcase
 * cards, process, cases, comparison table, geo, operator panel, FAQ)
 * reskinned to the Fruition theme with a per-brand accent colour.
 *
 * Rendered by src/components/AiPartnerTemplate.tsx via named routes
 * under /partnerships/<slug>. Kept separate from `partnershipPage`
 * (which is built around the fixed UniversalPageTemplate sections).
 */
const bullet = {
  type: 'object',
  name: 'aiBullet',
  fields: [{ name: 'text', title: 'Text', type: 'string' }],
}

export default {
  name: 'aiPartnerPage',
  title: 'AI Partner Page',
  type: 'document',
  fields: [
    // ── Meta ──────────────────────────────────────────────────────
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'text' },

    // ── Brand ─────────────────────────────────────────────────────
    { name: 'brandName', title: 'Brand Name', type: 'string' },
    { name: 'partnerTag', title: 'Partner Tag (nav pill)', type: 'string' },
    { name: 'accentColor', title: 'Accent Colour (hex)', type: 'string' },
    { name: 'accentColorDeep', title: 'Accent Colour — Deep (hex)', type: 'string' },
    { name: 'accentColorSoft', title: 'Accent Colour — Soft (rgba/hex)', type: 'string' },
    {
      name: 'serifAccent',
      title: 'Use serif (Fraunces) for accent headings',
      type: 'boolean',
      initialValue: false,
    },

    // ── Hero ──────────────────────────────────────────────────────
    { name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string' },
    { name: 'heroHeading', title: 'Hero Heading', type: 'string' },
    { name: 'heroHeadingAccent', title: 'Hero Heading — Accent words', type: 'string' },
    { name: 'heroHeadingStrike', title: 'Hero Heading — Struck word (optional)', type: 'string' },
    { name: 'heroLead', title: 'Hero Lead', type: 'text' },
    { name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string' },
    { name: 'primaryCtaUrl', title: 'Primary CTA URL', type: 'string' },
    { name: 'secondaryCtaLabel', title: 'Secondary CTA Label', type: 'string' },
    { name: 'secondaryCtaUrl', title: 'Secondary CTA URL', type: 'string' },
    {
      name: 'heroSidePanelType',
      title: 'Hero Side Panel Type',
      type: 'string',
      options: {
        list: [
          { title: 'Terminal log', value: 'log' },
          { title: 'Code snippet', value: 'code' },
          { title: 'Regions list', value: 'regions' },
          { title: 'None', value: 'none' },
        ],
      },
      initialValue: 'none',
    },
    { name: 'heroSidePanelTitle', title: 'Hero Side Panel Title', type: 'string' },
    {
      name: 'heroLogLines',
      title: 'Hero — Terminal Log Lines',
      type: 'array',
      of: [{
        type: 'object',
        name: 'logLine',
        fields: [
          { name: 'ts', title: 'Timestamp', type: 'string' },
          { name: 'tag', title: 'Tag', type: 'string' },
          {
            name: 'tagKind', title: 'Tag Kind', type: 'string',
            options: { list: ['info', 'act', 'warn', 'done'] },
          },
          { name: 'msg', title: 'Message', type: 'string' },
        ],
      }],
    },
    {
      name: 'heroCodeLines',
      title: 'Hero — Code Snippet Lines',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'heroRegions',
      title: 'Hero — Regions List',
      type: 'array',
      of: [{
        type: 'object',
        name: 'heroRegion',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'value', title: 'Sub-label', type: 'string' },
        ],
      }],
    },

    // ── Strip (marquee or stats) ──────────────────────────────────
    {
      name: 'stripType',
      title: 'Strip Type',
      type: 'string',
      options: { list: [{ title: 'Marquee', value: 'marquee' }, { title: 'Stats', value: 'stats' }, { title: 'None', value: 'none' }] },
      initialValue: 'none',
    },
    { name: 'marqueeItems', title: 'Marquee Items', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{
        type: 'object',
        name: 'aiStat',
        fields: [
          { name: 'value', title: 'Value', type: 'string' },
          { name: 'unit', title: 'Unit', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
      }],
    },

    // ── Capabilities ──────────────────────────────────────────────
    { name: 'capEyebrow', title: 'Capabilities Eyebrow', type: 'string' },
    { name: 'capHeading', title: 'Capabilities Heading', type: 'string' },
    { name: 'capHeadingAccent', title: 'Capabilities Heading — Accent', type: 'string' },
    { name: 'capLead', title: 'Capabilities Lead', type: 'text' },
    {
      name: 'capabilities',
      title: 'Capabilities',
      type: 'array',
      of: [{
        type: 'object',
        name: 'capability',
        fields: [
          { name: 'num', title: 'Number/Label', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
          { name: 'bullets', title: 'Bullets', type: 'array', of: [bullet] },
        ],
      }],
    },

    // ── Showcase (agents / GPTs) ──────────────────────────────────
    { name: 'showcaseEyebrow', title: 'Showcase Eyebrow', type: 'string' },
    { name: 'showcaseHeading', title: 'Showcase Heading', type: 'string' },
    { name: 'showcaseHeadingAccent', title: 'Showcase Heading — Accent', type: 'string' },
    { name: 'showcaseLead', title: 'Showcase Lead', type: 'text' },
    {
      name: 'showcaseCards',
      title: 'Showcase Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'showcaseCard',
        fields: [
          { name: 'icon', title: 'Icon text (e.g. MK)', type: 'string' },
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'role', title: 'Role / Subtitle', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
          {
            name: 'meta',
            title: 'Meta items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'showcaseMeta',
              fields: [
                { name: 'value', title: 'Value', type: 'string' },
                { name: 'label', title: 'Label', type: 'string' },
              ],
            }],
          },
        ],
      }],
    },

    // ── Process ───────────────────────────────────────────────────
    { name: 'processEyebrow', title: 'Process Eyebrow', type: 'string' },
    { name: 'processHeading', title: 'Process Heading', type: 'string' },
    { name: 'processHeadingAccent', title: 'Process Heading — Accent', type: 'string' },
    { name: 'processLead', title: 'Process Lead', type: 'text' },
    {
      name: 'process',
      title: 'Process Steps',
      type: 'array',
      of: [{
        type: 'object',
        name: 'processStep',
        fields: [
          { name: 'tag', title: 'Step Tag/Number', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
          { name: 'duration', title: 'Duration', type: 'string' },
        ],
      }],
    },

    // ── Cases ─────────────────────────────────────────────────────
    { name: 'casesEyebrow', title: 'Cases Eyebrow', type: 'string' },
    { name: 'casesHeading', title: 'Cases Heading', type: 'string' },
    { name: 'casesHeadingAccent', title: 'Cases Heading — Accent', type: 'string' },
    {
      name: 'cases',
      title: 'Case Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'caseCard',
        fields: [
          { name: 'industry', title: 'Industry', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
          { name: 'metric', title: 'Metric', type: 'string' },
          { name: 'metricLabel', title: 'Metric Label', type: 'string' },
        ],
      }],
    },

    // ── Comparison ────────────────────────────────────────────────
    { name: 'compareEyebrow', title: 'Comparison Eyebrow', type: 'string' },
    { name: 'compareHeading', title: 'Comparison Heading', type: 'string' },
    { name: 'compareHeadingAccent', title: 'Comparison Heading — Accent', type: 'string' },
    { name: 'compareLead', title: 'Comparison Lead', type: 'text' },
    { name: 'compareColLabel', title: 'Comparison — Row label column header', type: 'string' },
    { name: 'compareColA', title: 'Comparison — Column A header (accent)', type: 'string' },
    { name: 'compareColB', title: 'Comparison — Column B header', type: 'string' },
    {
      name: 'compareRows',
      title: 'Comparison Rows',
      type: 'array',
      of: [{
        type: 'object',
        name: 'compareRow',
        fields: [
          { name: 'label', title: 'Row Label', type: 'string' },
          { name: 'colA', title: 'Column A', type: 'text' },
          { name: 'colB', title: 'Column B', type: 'text' },
        ],
      }],
    },

    // ── Geo ───────────────────────────────────────────────────────
    { name: 'geoEyebrow', title: 'Geo Eyebrow', type: 'string' },
    { name: 'geoHeading', title: 'Geo Heading', type: 'string' },
    { name: 'geoHeadingAccent', title: 'Geo Heading — Accent', type: 'string' },
    { name: 'geoLead', title: 'Geo Lead', type: 'text' },
    {
      name: 'geo',
      title: 'Geo Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'geoCard',
        fields: [
          { name: 'region', title: 'Region', type: 'string' },
          { name: 'city', title: 'City / Heading', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
          { name: 'addr', title: 'Address', type: 'text' },
        ],
      }],
    },

    // ── Operator ──────────────────────────────────────────────────
    { name: 'operatorEyebrow', title: 'Operator Eyebrow', type: 'string' },
    { name: 'operatorHeading', title: 'Operator Heading', type: 'string' },
    { name: 'operatorHeadingAccent', title: 'Operator Heading — Accent', type: 'string' },
    { name: 'operatorName', title: 'Operator Name', type: 'string' },
    { name: 'operatorRole', title: 'Operator Role', type: 'string' },
    { name: 'operatorBody', title: 'Operator Body (paragraphs)', type: 'array', of: [{ type: 'text' }] },
    {
      name: 'operatorPanel',
      title: 'Operator Panel rows (key/value)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'operatorRow',
        fields: [
          { name: 'k', title: 'Key', type: 'string' },
          { name: 'v', title: 'Value', type: 'string' },
          { name: 'accent', title: 'Accent value', type: 'boolean' },
        ],
      }],
    },
    { name: 'operatorCreds', title: 'Operator Credentials', type: 'array', of: [{ type: 'string' }] },

    // ── FAQ ───────────────────────────────────────────────────────
    { name: 'faqEyebrow', title: 'FAQ Eyebrow', type: 'string' },
    { name: 'faqHeading', title: 'FAQ Heading', type: 'string' },
    { name: 'faqHeadingAccent', title: 'FAQ Heading — Accent', type: 'string' },
    {
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [{
        type: 'object',
        name: 'aiFaq',
        fields: [
          { name: 'question', title: 'Question', type: 'string' },
          { name: 'answer', title: 'Answer', type: 'text' },
        ],
      }],
    },

    // ── Final CTA ─────────────────────────────────────────────────
    { name: 'ctaEyebrow', title: 'Final CTA Eyebrow', type: 'string' },
    { name: 'ctaHeading', title: 'Final CTA Heading', type: 'string' },
    { name: 'ctaHeadingAccent', title: 'Final CTA Heading — Accent', type: 'string' },
    { name: 'ctaBody', title: 'Final CTA Body', type: 'text' },
    { name: 'ctaLabel', title: 'Final CTA Button Label', type: 'string' },
    { name: 'ctaUrl', title: 'Final CTA Button URL', type: 'string' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'brandName' },
  },
}
