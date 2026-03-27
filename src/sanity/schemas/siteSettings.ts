export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'calendlyLink', title: 'Calendly Link', type: 'string' },
    { name: 'mondayAffiliateLink', title: 'Monday Affiliate Link', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'footerText', title: 'Footer Text', type: 'text' },
  ],
}
