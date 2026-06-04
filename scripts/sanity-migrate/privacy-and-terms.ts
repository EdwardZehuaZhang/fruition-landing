/**
 * Seed the Data Privacy Policy body and the Terms & Conditions PDF documents.
 *
 *   npx tsx scripts/sanity-migrate/privacy-and-terms.ts
 *
 * - data-privacy        → full Privacy Policy portable text (headings + bullets)
 * - terms-and-conditions → two PDF documents (Terms & Conditions, Service Agreement),
 *                          body cleared so the page is just the two PDF tiles.
 */
import * as fs from 'fs'
import * as path from 'path'
import { writeClient } from './lib'

let keyN = 0
const k = () => `b${keyN++}`

type Block = Record<string, unknown>

function block(style: string, text: string, listItem?: string): Block {
  return {
    _type: 'block',
    _key: k(),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  }
}

const p = (t: string) => block('normal', t)
const h2 = (t: string) => block('h2', t)
const h3 = (t: string) => block('h3', t)
const li = (t: string) => block('normal', t, 'bullet')
const bullets = (...items: string[]) => items.map(li)

const privacyBody: Block[] = [
  p('Last Updated: December 8, 2024'),

  h2('Introduction'),
  p(
    'This Privacy Policy describes how Fruition Services Pty Ltd (together with its affiliated companies – "Fruition Services", "we", "our" or "us") collects, stores, uses and discloses personal data. We are committed to protecting and respecting your privacy and ensuring we comply with all applicable privacy laws including the Australian Privacy Act 1988 (Cth) and the European General Data Protection Regulation (GDPR) where applicable.'
  ),

  h2('Scope of This Policy'),
  p('This policy covers the following categories of personal data:'),

  h3('1. Customer Data'),
  p(
    'Personal data that we collect, process, and manage on behalf of our business customers ("Customers") when they use:'
  ),
  ...bullets(
    'Our monday.com implementation services',
    'Our custom automation solutions',
    'Our business process consulting services',
    'Our integration and development services',
    'Our training and support services'
  ),
  p(
    'We process such Customer Data strictly on behalf of and under the instruction of the respective Customer as a "data processor", in accordance with our Data Processing Agreement (DPA).'
  ),

  h3('2. User Data'),
  p('Personal data concerning:'),
  ...bullets(
    "Customer's internal contacts",
    'Account administrators',
    'Authorized users of our services',
    'Support contacts',
    'Billing contacts',
    'Technical contacts'
  ),

  h3('3. Prospect Data'),
  p('Data relating to:'),
  ...bullets(
    'Website visitors (www.fruitionservices.io)',
    'Event participants',
    'Marketing communications recipients',
    'Sales prospects',
    'Newsletter subscribers',
    'Webinar attendees'
  ),

  h2('Data Collection & Processing'),

  h3('1. Information We Collect Directly'),
  p('When you interact with our services, we collect:'),

  h3('Account Information'),
  ...bullets(
    'Full name',
    'Business email address',
    'Phone number',
    'Job title and department',
    'Company name and details',
    'Account preferences',
    'Login credentials',
    'Profile pictures (optional)'
  ),

  h3('Business Information'),
  ...bullets(
    'Billing address',
    'Payment information',
    'Tax information',
    'Contract details',
    'Service preferences',
    'Business requirements'
  ),

  h3('Communication Data'),
  ...bullets(
    'Support requests',
    'Feedback and testimonials',
    'Survey responses',
    'Meeting notes',
    'Training attendance records',
    'Service usage feedback'
  ),

  h3('2. Information We Collect Automatically'),
  p('Through your use of our services:'),

  h3('Technical Data'),
  ...bullets(
    'IP addresses and approximate location',
    'Device identifiers',
    'Browser type and version',
    'Operating system information',
    'Time zone setting',
    'Browser plug-in types and versions',
    'Screen resolution',
    'Platform type',
    'System activity logs'
  ),

  h3('Usage Data'),
  ...bullets(
    'Features accessed',
    'Actions performed',
    'Time spent on various services',
    'Navigation patterns',
    'Service performance data',
    'Error logs',
    'Training completion data'
  ),

  h3('Integration Data'),
  ...bullets(
    'API usage statistics',
    'Integration configurations',
    'Workflow automation data',
    'Custom field mappings',
    'Third-party connection status'
  ),

  h2('Use of Personal Data'),

  h3('1. Service Delivery'),
  p('We use personal data to:'),
  ...bullets(
    'Implement and configure monday.com instances',
    'Develop custom automations',
    'Provide technical support',
    'Deliver training services',
    'Maintain service security',
    'Monitor service performance',
    'Optimize user experience',
    'Process payments',
    'Manage customer relationships'
  ),

  h3('2. Service Improvement'),
  p('We analyze data to:'),
  ...bullets(
    'Enhance our services',
    'Develop new features',
    'Improve user experience',
    'Optimize workflows',
    'Identify usage patterns',
    'Debug technical issues',
    'Measure service performance',
    'Create aggregated analytics'
  ),

  h3('3. Communications'),
  p('We use contact information to:'),
  ...bullets(
    'Send service updates',
    'Provide technical notifications',
    'Share educational content',
    'Distribute newsletters',
    'Announce new features',
    'Invite to events',
    'Conduct surveys',
    'Respond to inquiries'
  ),

  h2('Data Sharing and Disclosure'),

  h3('1. Service Providers'),
  p('We share data with trusted service providers for:'),
  ...bullets(
    'Cloud hosting (AWS, Azure)',
    'Email services',
    'Payment processing',
    'Analytics',
    'Customer support',
    'Project management',
    'Communication tools',
    'Training platforms'
  ),

  h3('2. Technology Partners'),
  p('We share necessary data with:'),
  ...bullets(
    'monday.com (as certified partners)',
    'Integration platforms',
    'Automation tools',
    'Development environments',
    'Training platforms'
  ),

  h3('3. Legal Requirements'),
  p('We may disclose data:'),
  ...bullets(
    'In response to legal requests',
    'To protect our rights',
    'To prevent fraud',
    'To ensure security',
    'For auditing purposes',
    'During corporate transactions'
  ),

  h2('Data Security'),

  h3('Technical Measures'),
  p('We implement:'),
  ...bullets(
    'Encryption at rest and in transit',
    'Secure access controls',
    'Intrusion detection',
    'Firewall protection',
    'Regular backups',
    'Security monitoring',
    'Vulnerability scanning'
  ),

  h3('Organizational Measures'),
  p('We maintain:'),
  ...bullets(
    'Information security policies',
    'Access control procedures',
    'Employee training programs',
    'Incident response plans',
    'Data handling guidelines',
    'Security certifications',
    'Regular compliance audits',
    'Vendor assessment processes'
  ),

  h2('Data Retention'),
  p('We retain personal data for:'),
  ...bullets(
    'Active accounts: Duration of service plus 30 days',
    'Inactive accounts: Up to 12 months',
    'Financial records: 7 years (legal requirement)',
    'Marketing data: Until opt-out',
    'Support records: 2 years',
    'Security logs: 12 months'
  ),

  h2('Your Privacy Rights'),

  h3('Access Rights'),
  p('You can request:'),
  ...bullets(
    'Confirmation of data processing',
    'Access to personal data',
    'Data processing details',
    'Data sharing information',
    'Data retention periods'
  ),

  h3('Control Rights'),
  p('You can request:'),
  ...bullets(
    'Data correction',
    'Data deletion',
    'Processing restrictions',
    'Data portability',
    'Marketing opt-out',
    'Processing objections'
  ),

  h3('Exercise Your Rights'),
  p('To exercise these rights:'),
  ...bullets(
    'Email: contact@fruitionservices.io',
    'Form: Available on our website',
    'Mail: C/O Gpc Financial Management 423 Linen Hall, 162 - 168 Regent Street, London, United Kingdom, W1B 5TE'
  ),
  p('Response time: Within 30 days'),

  h2('International Data Transfers'),
  p('We may transfer data internationally:'),
  ...bullets(
    'Within the Fruition Services group',
    'To service providers',
    'To technology partners',
    'To monday.com'
  ),
  p('All international transfers are protected by:'),
  ...bullets(
    'Standard Contractual Clauses',
    'Data Processing Agreements',
    'Privacy Shield certifications',
    'Adequate safeguards'
  ),

  h2('Cookies and Tracking'),
  p('We use:'),
  ...bullets(
    'Essential cookies',
    'Analytics cookies',
    'Performance cookies',
    'Marketing cookies'
  ),

  h2('Changes to This Policy'),
  p('We may update this policy:'),
  ...bullets(
    'To reflect service changes',
    'For legal compliance',
    'To improve clarity',
    'To add new features'
  ),
  p('We will notify you of material changes via:'),
  ...bullets('Email notification', 'Website notice', 'Service announcement'),

  h2('Contact Information'),
  p('For privacy matters:'),
  ...bullets(
    'Privacy Officer: Josh Jebathilak',
    'Email: admin@fruitionservices.io'
  ),
  p('For general inquiries:'),
  ...bullets(
    'Support: contact@fruitionservices.io',
    'Sales: contact@fruitionservices.io',
    'Website: www.fruitionservices.io'
  ),

  h2('Governing Law'),
  p(
    'This policy is governed by Australian law and applicable international privacy regulations where relevant.'
  ),
]

const PUBLIC = path.resolve(__dirname, '..', '..', 'public')

async function uploadPdf(publicName: string, filename: string) {
  const abs = path.resolve(PUBLIC, publicName)
  const buffer = fs.readFileSync(abs)
  console.log(`  ↑ uploading ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`)
  const asset = await writeClient.assets.upload('file', buffer, { filename })
  return { _type: 'reference' as const, _ref: asset._id }
}

async function run() {
  // 1. Data Privacy body
  console.log('Patching data-privacy body…')
  await writeClient
    .patch('page-data-privacy')
    .set({ body: privacyBody })
    .commit()
  console.log(`  ✓ data-privacy body set (${privacyBody.length} blocks)`)

  // 2. Terms & Conditions — two PDF documents, body cleared
  console.log('Uploading Terms & Conditions PDFs…')
  const termsRef = await uploadPdf(
    'fruition-terms-conditions.pdf',
    'Fruition-Terms-and-Conditions.pdf'
  )
  const agreementRef = await uploadPdf(
    'fruition-service-agreement.pdf',
    'Fruition-Service-Agreement.pdf'
  )

  await writeClient
    .patch('page-terms-and-conditions')
    .set({
      body: [],
      documents: [
        {
          _key: 'doc-terms',
          label: 'Terms & Conditions',
          file: { _type: 'file', asset: termsRef },
        },
        {
          _key: 'doc-agreement',
          label: 'Service Agreement',
          file: { _type: 'file', asset: agreementRef },
        },
      ],
    })
    .commit()
  console.log('  ✓ terms-and-conditions documents set (2 PDFs)')
  console.log('Done.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
