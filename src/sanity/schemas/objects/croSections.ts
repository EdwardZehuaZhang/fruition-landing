import { defineType, defineField } from 'sanity'

/**
 * CRO action-item sections (from the "CRO landing page" audit). One optional
 * object embedded on a marketing page; every sub-section is optional and only
 * renders when populated. Shared across all page types so rollout is "add the
 * croSections field + populate", with no per-page schema work.
 */
export default defineType({
  name: 'croSections',
  title: 'CRO Sections',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    // Trust / credential badges
    defineField({
      name: 'trustBadges',
      title: 'Trust Badges',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'detail', title: 'Detail', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'detail' } },
        },
      ],
    }),
    defineField({
      name: 'trustBadgesTheme',
      title: 'Trust Badges Theme',
      type: 'string',
      options: { list: ['light', 'dark'] },
      initialValue: 'light',
    }),

    // Dual CTA (secondary button; primary usually already on the page)
    defineField({ name: 'dualCtaSecondaryLabel', title: 'Secondary CTA Label', type: 'string' }),
    defineField({ name: 'dualCtaSecondaryUrl', title: 'Secondary CTA URL', type: 'string' }),

    // Sticky floating CTA
    defineField({ name: 'stickyCtaLabel', title: 'Sticky CTA Label', type: 'string' }),
    defineField({ name: 'stickyCtaUrl', title: 'Sticky CTA URL', type: 'string' }),
    defineField({ name: 'stickyCtaMobileLabel', title: 'Sticky CTA Mobile Label', description: 'Shorter label for small screens. Falls back to Sticky CTA Label when empty.', type: 'string' }),

    // Before / After
    defineField({
      name: 'beforeAfter',
      title: 'Before / After',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'beforeLabel', title: 'Before Label', type: 'string', initialValue: 'Before' }),
        defineField({ name: 'afterLabel', title: 'After Label', type: 'string', initialValue: 'After' }),
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'before', title: 'Before', type: 'text' }),
                defineField({ name: 'after', title: 'After', type: 'text' }),
              ],
              preview: { select: { title: 'before', subtitle: 'after' } },
            },
          ],
        }),
      ],
    }),

    // 3-step framework
    defineField({
      name: 'threeStep',
      title: '3-Step Framework',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'number', title: 'Number', type: 'string' }),
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'description', title: 'Description', type: 'text' }),
              ],
              preview: { select: { title: 'title', subtitle: 'number' } },
            },
          ],
        }),
      ],
    }),

    // Stat / metric pull-out banner
    defineField({
      name: 'statBanner',
      title: 'Stat Banner',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'statement', title: 'Statement', type: 'text' }),
        defineField({
          name: 'theme',
          title: 'Theme',
          type: 'string',
          options: { list: ['light', 'dark'] },
          initialValue: 'dark',
        }),
        defineField({
          name: 'metrics',
          title: 'Metrics',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'value', title: 'Value', type: 'string' }),
                defineField({ name: 'text', title: 'Text', type: 'string' }),
              ],
              preview: { select: { title: 'value', subtitle: 'text' } },
            },
          ],
        }),
      ],
    }),

    // Micro case studies
    defineField({
      name: 'microCaseStudies',
      title: 'Micro Case Studies',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'cases',
          title: 'Cases',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'challenge', title: 'Challenge', type: 'text' }),
                defineField({ name: 'solution', title: 'Solution', type: 'text' }),
                defineField({ name: 'impact', title: 'Impact', type: 'text' }),
                defineField({ name: 'metric', title: 'Metric', type: 'string' }),
                defineField({ name: 'metricLabel', title: 'Metric Label', type: 'string' }),
              ],
              preview: { select: { title: 'metric', subtitle: 'impact' } },
            },
          ],
        }),
      ],
    }),

    // Symptoms checklist
    defineField({
      name: 'symptomsChecklist',
      title: 'Symptoms Checklist',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [defineField({ name: 'text', title: 'Text', type: 'string' })],
              preview: { select: { title: 'text' } },
            },
          ],
        }),
      ],
    }),

    // ROI calculator config
    defineField({
      name: 'roiCalc',
      title: 'ROI Calculator',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: false }),
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
        defineField({ name: 'defaultTeamSize', title: 'Default Team Size', type: 'number' }),
        defineField({ name: 'defaultHoursPerWeek', title: 'Default Hours/Week', type: 'number' }),
        defineField({ name: 'hourlyRate', title: 'Hourly Rate ($)', type: 'number' }),
        defineField({ name: 'reclaimRate', title: 'Reclaim Rate (0–1)', type: 'number' }),
        defineField({ name: 'currencySymbol', title: 'Currency Symbol', type: 'string', initialValue: '$' }),
      ],
    }),

    // Lead / intake form
    defineField({
      name: 'leadForm',
      title: 'Lead Form',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: false }),
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
        defineField({ name: 'source', title: 'Source (internal id)', type: 'string' }),
        defineField({ name: 'submitLabel', title: 'Submit Button Label', type: 'string' }),
        defineField({ name: 'successMessage', title: 'Success Message', type: 'text' }),
        defineField({
          name: 'fields',
          title: 'Extra Fields',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({
                  name: 'type',
                  title: 'Type',
                  type: 'string',
                  options: { list: ['text', 'textarea', 'select'] },
                  initialValue: 'text',
                }),
                defineField({ name: 'options', title: 'Options (for select)', type: 'array', of: [{ type: 'string' }] }),
                defineField({ name: 'required', title: 'Required', type: 'boolean', initialValue: false }),
              ],
              preview: { select: { title: 'label', subtitle: 'type' } },
            },
          ],
        }),
      ],
    }),
  ],
})
