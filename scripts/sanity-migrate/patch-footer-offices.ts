/**
 * Patch siteSettings.offices: update UK/AU map links, add Singapore, India,
 * Philippines (placeholder address + phone).
 *
 * Run with:
 *   npx tsx scripts/sanity-migrate/patch-footer-offices.ts
 */
import { writeClient, withKeys } from './lib'

async function main() {
  const offices = withKeys([
    {
      _type: 'office',
      flag: '\u{1F1E6}\u{1F1FA}',
      city: 'Sydney, Australia',
      label: 'Head Office',
      href: '/monday-partner-australia',
      address: '64 York Street, Sydney NSW 2000 Australia',
      addressUrl: 'https://maps.app.goo.gl/1tHxQSq7Db3Xq4Rk7',
      phone: '+61 483 955 931',
      phoneTel: '+61483955931',
    },
    {
      _type: 'office',
      flag: '\u{1F1FA}\u{1F1F8}',
      city: 'New York, US Office',
      label: 'North America Office',
      href: '/monday-partner-us',
      address: '205 W 37th St, New York, NY 10018, United States',
      addressUrl: 'https://maps.app.goo.gl/4u1KjFHfUgiXGGta9',
      phone: '+1 302 330 2496',
      phoneTel: '+13023302496',
    },
    {
      _type: 'office',
      flag: '\u{1F1EC}\u{1F1E7}',
      city: 'London, UK',
      label: 'EMEA Office',
      href: '/monday-partner-uk',
      address: 'Medius House, 2 Sheraton St, London W1F 8BH, United Kingdom',
      addressUrl: 'https://maps.app.goo.gl/H8gDDCChm9Q5uMDm8',
      phone: '+44 7822 019548',
      phoneTel: '+447822019548',
    },
    {
      _type: 'office',
      flag: '\u{1F1F8}\u{1F1EC}',
      city: 'Singapore',
      label: 'APAC Office',
      href: '#',
      address: 'Address coming soon, Singapore',
      addressUrl: '',
      phone: '+65 0000 0000',
      phoneTel: '+6500000000',
    },
    {
      _type: 'office',
      flag: '\u{1F1EE}\u{1F1F3}',
      city: 'Delhi, India',
      label: 'Awfis Delhi Office',
      href: '/monday-partner-india',
      address: 'Address coming soon, Delhi',
      addressUrl: '',
      phone: '+91 00000 00000',
      phoneTel: '+910000000000',
    },
    {
      _type: 'office',
      flag: '\u{1F1F5}\u{1F1ED}',
      city: 'Philippines',
      label: 'Philippines Office',
      href: '#',
      address: 'Address coming soon, Philippines',
      addressUrl: '',
      phone: '+63 000 000 0000',
      phoneTel: '+630000000000',
    },
  ])

  const id = (await writeClient.fetch<string>(`*[_type == "siteSettings"][0]._id`))
  if (!id) throw new Error('siteSettings doc not found')

  await writeClient.patch(id).set({ offices }).commit()
  console.log(`✓ patched ${id} — ${offices.length} offices`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
