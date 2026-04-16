export default {
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string' },
    { name: 'answer', title: 'Answer', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'category',
      title: 'Category (tab label)',
      type: 'string',
      description:
        'Used to group FAQs into tabs on the FAQs page and on per-page FAQ sections. Examples: "monday Work Management", "Retail", "General Questions".',
    },
    {
      name: 'pages',
      title: 'Show on pages',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { value: 'faqs', title: 'FAQs (/faqs)' },
          { value: 'implementation-packages', title: 'Implementation Packages' },
          { value: 'monday-training', title: 'monday Training' },
          { value: 'monday-implementation-consultants', title: 'monday Implementation Consultants' },
          { value: 'monday-consulting-solutions', title: 'monday Consulting Solutions' },
          { value: 'monday-crm-consulting', title: 'monday CRM Consulting' },
          { value: 'monday-for-construction', title: 'monday for Construction' },
          { value: 'monday-for-manufacturing', title: 'monday for Manufacturing' },
          { value: 'monday-for-retail', title: 'monday for Retail' },
          { value: 'monday-for-professional-services', title: 'monday for Professional Services' },
          { value: 'monday-for-government', title: 'monday for Government' },
          { value: 'monday-for-marketing', title: 'monday for Marketing' },
          { value: 'monday-for-real-estate', title: 'monday for Real Estate' },
          { value: 'ai-strategy-and-execution', title: 'AI Strategy & Execution' },
          { value: 'partnerships', title: 'Partnerships' },
          { value: 'partnerships/make-partners', title: 'Make Partners' },
          { value: 'partnerships/n8n-integration-partner', title: 'n8n Integration Partner' },
          { value: 'partnerships/aircall-partner', title: 'Aircall Partner' },
          { value: 'partnerships/certified-atlassian-partner', title: 'Atlassian Partner' },
          { value: 'partnerships/monday-consulting-partner', title: 'monday Consulting Partner' },
        ],
      },
      description:
        'Every page key listed here will show this FAQ in its FAQ section. The /faqs page shows every FAQ regardless of this field.',
    },
    {
      name: 'categoryOrder',
      title: 'Category order',
      type: 'number',
      description: 'Lower numbers show their tab earlier on the tab bar.',
    },
    { name: 'order', title: 'Order within category', type: 'number' },
  ],
  orderings: [
    {
      title: 'Category then order',
      name: 'categoryThenOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'question', subtitle: 'category' },
  },
}
