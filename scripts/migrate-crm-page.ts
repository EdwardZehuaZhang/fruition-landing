import { writeClient } from './sanity-client'
import * as fs from 'fs'
import * as path from 'path'

const FAQ_TABS = [
  {
    _key: 'tab-crm',
    _type: 'faqTab',
    label: 'monday CRM',
    items: [
      { _key: 'crm-1', _type: 'faqPair', question: 'What is monday CRM used for?', answer: 'monday CRM allows you to have full control over your sales pipeline, manage your contacts, streamline your post sales processes and sales enablement, all while seeing the big picture at a glance. With monday CRM, you can manage all aspects of your sales cycle and customer data in one central place. Fitted with multiple unique features created just for CRM teams, monday CRM can be used to fit all of your teams\u2019 needs.' },
      { _key: 'crm-2', _type: 'faqPair', question: 'Is monday.com a good CRM tool?', answer: 'Yes, monday.com can be a great CRM tool, particularly for businesses that value flexibility, customization, and ease of use. Key features that make monday.com a great CRM tool include contact management, pipeline management, automation, and customisation.' },
      { _key: 'crm-3', _type: 'faqPair', question: 'Does monday.com CRM provide good value for investment?', answer: 'If your priorities include rapid implementation, extensive customization capabilities, and maintaining a unified workspace, then monday CRM delivers excellent value proposition.\n\nDo enterprise-level organizations implement monday.com? Absolutely, numerous Fortune 500 companies utilize monday.com for their operational management requirements. monday.com reports that over 180,000 businesses internationally rely on their platform, including recognized brands like Nissan, Elal, Zippo, Canva, Coca-Cola, Wix, and Uber.' },
      { _key: 'crm-4', _type: 'faqPair', question: 'Does monday.com offer complimentary CRM functionality?', answer: 'While Monday.com provides specialized CRM packages, these aren\u2019t offered at no cost. Nevertheless, their \u2018Free Forever\u2019 option remains accessible through standard work management subscriptions.' },
      { _key: 'crm-5', _type: 'faqPair', question: 'What business functions does monday CRM support?', answer: 'monday CRM provides comprehensive oversight of your sales funnel, contact database management, streamlined post-purchase workflows, and sales enablement tools, while delivering executive-level visibility across operations. Through monday CRM, you can coordinate every element of your sales process and customer information within a single unified platform. Equipped with specialized features designed specifically for sales teams, monday CRM adapts to meet all your department\u2019s operational requirements.' },
      { _key: 'crm-6', _type: 'faqPair', question: 'How does monday.com compare to Salesforce?', answer: 'monday.com and Salesforce serve different market segments with distinct capabilities. Although both platforms provide project management and CRM functionality, they address unique business requirements with separate strengths. Salesforce operates as an enterprise-grade CRM solution ideally designed for large corporations with sophisticated needs, whereas monday.com excels through its intuitive interface, adaptability, and implementation simplicity, positioning it perfectly for SMBs requiring powerful yet expandable solutions.' },
      { _key: 'crm-7', _type: 'faqPair', question: 'How does monday.com compare to Hubspot?', answer: 'Hubspot is a great tool for Marketing teams, but it lacks in CRM and Project Management capabilities. We have also found from our clients who have switched over to monday.com with our services that they saved on technical administration costs with monday.com due to the cost to develop on Hubspot.' },
      { _key: 'crm-8', _type: 'faqPair', question: 'How does monday.com compare to Zoho?', answer: 'Zoho is a cheaper CRM alternative, making it great for teams who are looking for a basic CRM that they don\u2019t plan on changing as their business evolves.\n\nAnother key factor that pushed our clients to migrate off of Zoho CRM to monday CRM is due to Zoho\u2019s limited support. Zoho also asks you to pay 20-25% in addition to licenses for support, whereas with monday.com, you can manage the entire system and make changes with some training. monday.com vendor support is available 24/7 and completely free.' },
      { _key: 'crm-9', _type: 'faqPair', question: 'How effective is monday.com as a customer relationship management platform?', answer: 'monday.com serves as an excellent CRM solution, especially for organizations prioritizing adaptability, customization capabilities, and user-friendly operation. Essential capabilities that establish monday.com as an outstanding CRM platform include contact database management, sales pipeline oversight, workflow automation, and extensive personalization options.\n\nWhat drives monday.com\u2019s widespread adoption? Monday.com\u2019s market success results from its accessible interface design, visual attractiveness, and robust functionality addressing diverse operational management requirements. The platform gains recognition for its adaptability, configurable workflow systems, and seamless integration capabilities with multiple external applications. Additionally, monday.com features an aesthetically pleasing, intuitive architecture that facilitates team collaboration and project oversight.' },
      { _key: 'crm-10', _type: 'faqPair', question: 'What are the benefits of using monday.com as a CRM?', answer: 'Key benefits include:\n\nCentralized lead and customer data\n\nAutomated task and follow-up management\n\nCustom dashboards for real-time performance tracking\n\nSeamless integrations with popular tools like Gmail, Outlook, Slack, and QuickBooks' },
      { _key: 'crm-11', _type: 'faqPair', question: 'Can monday.com integrate with other tools and CRMs?', answer: 'Yes, monday.com integrates with email, project management, marketing, and financial tools, including:\n\nGmail & Outlook\n\nSlack & Microsoft Teams\n\nHubSpot, Salesforce, Mailchimp\n\nQuickBooks & Xero\n\nCustom integrations via API or Zapier are also available for unique workflows.' },
    ],
  },
  {
    _key: 'tab-ecg',
    _type: 'faqTab',
    label: 'Expert Consultant Guide',
    items: [
      { _key: 'ecg-1', _type: 'faqPair', question: 'What\u2019s the best monday.com CRM implementation strategy?', answer: 'When implementing monday.com CRM, we recommend starting with a carefully planned phased rollout guided by certified monday.com consultants.\n\nOur experience shows that successful implementations begin by customizing your CRM setup to match your unique sales processes.\n\nWe typically start by implementing proven sales workflows with powerful automation features, which transforms your entire sales process. The key is scaling the implementation department by department, ensuring each team is comfortable before moving forward.' },
      { _key: 'ecg-2', _type: 'faqPair', question: 'How do monday.com Partners handle user adoption?', answer: 'The secret to successful user adoption lies in demonstrating immediate wins that matter to your team. As monday.com consultants, we focus on showing tangible improvements in daily workflows.\n\nWe\u2019ve developed change management best practices that ensure smooth transitions, especially when implementing CRM solutions tailored to your existing sales processes.\n\nOur expert-led training programs drive adoption naturally, and we continuously monitor success metrics to adjust our approach as needed.' },
      { _key: 'ecg-3', _type: 'faqPair', question: 'What monday.com training do Partners recommend?', answer: 'Our training approach combines consultant-led CRM sessions with practical, hands-on learning. We\u2019ve found that custom implementation guides, created specifically for your organization, work best.\n\nWe provide role-specific coaching and support, ensuring everyone from sales reps to administrators gets exactly what they need.\n\nRegular check-in sessions with your dedicated implementation consultant help reinforce learning, and you\u2019ll have full access to our comprehensive Partner knowledge base and resources.' },
      { _key: 'ecg-4', _type: 'faqPair', question: 'How do monday.com consultants handle data migration?', answer: 'Data migration is a crucial step that requires careful planning and execution. Our Partner team provides expert guidance throughout the CRM data transfer process, using proven templates that ensure data integrity.\n\nWe develop strategic implementation plans that minimize disruption while maximizing efficiency. Our approach includes creating custom workflows that match your sales process, with thorough quality checks at every step to ensure accuracy.' },
      { _key: 'ecg-5', _type: 'faqPair', question: 'What success metrics do monday.com Partners track?', answer: 'We focus on meaningful metrics that demonstrate real business impact. This includes monitoring CRM adoption rates with detailed Partner guidance, measuring improvements in sales efficiency, and tracking concrete ROI metrics.\n\nOur consultants regularly assess CRM performance and collect customer success stories, helping you understand the tangible benefits of your monday.com implementation. We\u2019ve found that tracking these metrics helps organizations optimize their usage and maximize their return on investment.' },
    ],
  },
]

async function main() {
  // Upload CRM hero image
  const filePath = path.join(__dirname, '..', 'public', 'images', 'crm-hero.avif')
  const buffer = fs.readFileSync(filePath)
  const asset = await writeClient.assets.upload('image', buffer, { filename: 'crm-hero.avif' })
  console.log('Uploaded CRM hero image')

  const pageId = 'servicePage-monday-crm-consulting'

  await writeClient.patch(pageId).set({
    heroSubheading: 'Unlock the full potential of monday.com CRM with our monday.com expert setup and support.',
    heroImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    },
    primaryCtaLabel: '\uD83D\uDE80 Book a Consultation',
    secondaryCtaLabel: '\u25B6\uFE0F Get Started with monday.com',
    faqTabs: FAQ_TABS,
  }).commit()

  console.log('Updated CRM page: hero subheading, hero image, CTAs, FAQ tabs (2 tabs, 16 questions)')
}

main().catch((err) => { console.error(err); process.exit(1) })
