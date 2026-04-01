require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')
const { chromium } = require('playwright')

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function uploadImageFromUrl(url, filename) {
  console.log(`  Uploading image: ${url.substring(0, 80)}...`)
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
    if (!res.ok) { console.log(`  Failed to fetch: ${res.status}`); return null }
    const buffer = Buffer.from(await res.arrayBuffer())
    const asset = await client.assets.upload('image', buffer, { filename })
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  } catch (err) {
    console.log(`  Upload error: ${err.message}`)
    return null
  }
}

async function scrapePartnerBadges(browser) {
  console.log('\n--- Step 2: Scraping partner badge images ---')
  const page = await browser.newPage()
  try {
    await page.goto('https://www.fruitionservices.io/', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await sleep(8000) // Wait for Wix JS to render

    // Scroll down to trigger lazy-loaded images
    await page.evaluate(() => window.scrollTo(0, 1000))
    await sleep(3000)
    await page.evaluate(() => window.scrollTo(0, 0))
    await sleep(2000)

    // Look for partner badge images - typically near top of page
    const badges = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'))
      return imgs
        .filter(img => {
          const alt = (img.alt || '').toLowerCase()
          const src = (img.src || '').toLowerCase()
          return alt.includes('partner') || alt.includes('platinum') || alt.includes('delivery') ||
                 alt.includes('make partner') || src.includes('partner') || src.includes('badge') ||
                 src.includes('platinum')
        })
        .map(img => ({ src: img.src, alt: img.alt || 'Partner Badge' }))
    })

    console.log(`  Found ${badges.length} partner badge images`)

    // If we can't find specific badges, dump all images for debugging
    if (badges.length === 0) {
      const allImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'))
        return imgs.map(img => ({ src: img.src, alt: img.alt || '', width: img.naturalWidth }))
      })
      console.log(`  Total images on page: ${allImages.length}`)
      allImages.slice(0, 30).forEach((img, i) => console.log(`    ${i}: [${img.width}px] ${img.alt} | ${img.src.substring(0, 100)}`))
    }

    const logos = []
    for (let i = 0; i < badges.length; i++) {
      const badge = badges[i]
      const image = await uploadImageFromUrl(badge.src, `partner-badge-${i}.png`)
      if (image) {
        logos.push({
          _key: `badge-${String(i).padStart(2, '0')}`,
          _type: 'object',
          name: badge.alt,
          image,
        })
      }
      await sleep(500)
    }

    return logos
  } finally {
    await page.close()
  }
}

async function scrapeClientLogos(browser) {
  console.log('\n--- Step 3: Scraping client logos ---')
  const page = await browser.newPage()
  try {
    await page.goto('https://www.fruitionservices.io/', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await sleep(8000)

    // Scroll to find client logos section
    await page.evaluate(() => window.scrollTo(0, 2000))
    await sleep(3000)

    // Look for client logos section
    const clientLogos = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'))
      // Filter for what looks like client logos - small images in a grid/carousel
      const logoImgs = imgs.filter(img => {
        const w = img.naturalWidth || img.width
        const h = img.naturalHeight || img.height
        const src = img.src || ''
        // Client logos are typically small, in a strip
        return w > 30 && w < 400 && h > 10 && h < 200 &&
               !src.includes('team') && !src.includes('avatar') &&
               !src.includes('blog') && !src.includes('favicon')
      })

      // Find logos that appear in a cluster (likely a logo strip)
      return logoImgs.map(img => ({
        src: img.src,
        alt: img.alt || 'Client Logo',
        rect: img.getBoundingClientRect().toJSON(),
      }))
    })

    // Group by vertical position to find the logo strip
    const yGroups = {}
    clientLogos.forEach(logo => {
      const yBucket = Math.round(logo.rect.y / 50) * 50
      if (!yGroups[yBucket]) yGroups[yBucket] = []
      yGroups[yBucket].push(logo)
    })

    // Find the largest group (most likely the logo strip)
    let bestGroup = []
    for (const group of Object.values(yGroups)) {
      if (group.length > bestGroup.length) bestGroup = group
    }

    console.log(`  Found ${bestGroup.length} client logos in strip`)

    const logos = []
    for (let i = 0; i < bestGroup.length; i++) {
      const logo = bestGroup[i]
      const image = await uploadImageFromUrl(logo.src, `client-logo-${i}.png`)
      if (image) {
        logos.push({
          _key: `client-${String(i).padStart(2, '0')}`,
          _type: 'object',
          name: logo.alt,
          image,
        })
      }
      await sleep(500)
    }

    return logos
  } finally {
    await page.close()
  }
}

async function run() {
  console.log('=== Homepage Content Migration ===\n')

  // Launch browser for scraping
  const browser = await chromium.launch({ headless: true })

  try {
    // --- Step 1: Patch heroBlock with secondary CTA ---
    console.log('--- Step 1: Patching heroBlock with secondary CTA ---')
    await client
      .patch('homePage')
      .set({
        'contentBlocks[_key=="hero-01"].secondaryCtaLabel': 'Get Started with monday.com',
        'contentBlocks[_key=="hero-01"].secondaryCtaUrl': 'https://monday.com/crm?utm_source=Partner&utm_campaign=fruitionanz&utm_banner=fruition_monday_crm__4',
      })
      .commit()
    console.log('  Done: secondary CTA added to heroBlock')

    // --- Step 2: Partner badges ---
    const partnerLogos = await scrapePartnerBadges(browser)
    if (partnerLogos.length > 0) {
      // Repurpose logos-01 for partner badges
      await client
        .patch('homePage')
        .set({
          'contentBlocks[_key=="logos-01"].heading': 'Trusted Partner',
          'contentBlocks[_key=="logos-01"].logos': partnerLogos,
        })
        .commit()
      console.log(`  Done: ${partnerLogos.length} partner badges uploaded to logos-01`)
    } else {
      console.log('  Warning: No partner badges found, setting heading anyway')
      await client
        .patch('homePage')
        .set({ 'contentBlocks[_key=="logos-01"].heading': 'Trusted Partner' })
        .commit()
    }

    // --- Step 3: Client logos ---
    const clientLogos = await scrapeClientLogos(browser)

    // --- Step 4: Leadership challenges featureListBlock ---
    console.log('\n--- Step 4: Adding leadership challenges featureListBlock ---')
    const challengesBlock = {
      _key: 'challenges-01',
      _type: 'featureListBlock',
      blockType: 'featureListBlock',
      heading: 'Teams Transformed with Proven Efficiency Gains',
      features: [
        { _key: 'ch-01', icon: '01', title: 'Financial Uncertainty', description: 'Improving reporting visibility of business performance to make better decisions and to quickly correct course on strategic initiatives.' },
        { _key: 'ch-02', icon: '02', title: 'AI & Automation', description: 'Team enablement and implementation of AI & Automation technologies to improve workforce efficiency and unlock hidden inefficiencies' },
        { _key: 'ch-03', icon: '03', title: 'Hybrid Work Management', description: 'Optimising productivity and culture across distributed teams while maintaining operational excellence' },
        { _key: 'ch-04', icon: '04', title: 'Talent Retention & Personal Development', description: 'Attracting and keeping key talent in a competitive market while upskilling for future needs' },
        { _key: 'ch-05', icon: '05', title: 'Cybersecurity & Digital Risk', description: 'Protecting against evolving threats while ensuring data privacy and regulatory compliance' },
      ],
    }

    // --- Step 5: Calendly block ---
    console.log('\n--- Step 5: Adding calendlyBlock ---')
    const calendlyBlock = {
      _key: 'calendly-01',
      _type: 'calendlyBlock',
      blockType: 'calendlyBlock',
      heading: 'Schedule A 30-Min Consultation With One of Our monday.com Consultants',
      calendlyUrl: 'https://calendly.com/global-calendar-fruitionservices',
    }

    // --- Step 6: Tab section block ---
    console.log('\n--- Step 6: Adding tabSectionBlock ---')
    const tabSectionBlock = {
      _key: 'tabs-01',
      _type: 'tabSectionBlock',
      blockType: 'tabSectionBlock',
      heading: 'Implement monday.com for any team',
      tabs: [
        {
          _key: 'tab-crm',
          label: 'CRM Sales Process',
          heading: 'Streamline your sales & CRM processes',
          body: 'Have a monday.com partner build a CRM for your business that can still adapt with you as your requirements change. So, instead of spinning your wheels trying to figure it out for six months, you can start inputting data in 2-3 weeks.',
          ctaLabel: 'Show me more',
          ctaUrl: '/monday-crm-consulting',
          features: [
            { _key: 'f-01', icon: '\u{1F4CA}', label: 'Pipeline visualisation' },
            { _key: 'f-02', icon: '\u{1F4C8}', label: 'Sales forecasting' },
            { _key: 'f-03', icon: '\u{26A1}', label: 'Automated lead scoring' },
            { _key: 'f-04', icon: '\u{1F4E7}', label: 'Email integration' },
            { _key: 'f-05', icon: '\u{1F4CB}', label: 'Custom deal stages' },
            { _key: 'f-06', icon: '\u{1F3AF}', label: 'Performance analytics' },
          ],
        },
        {
          _key: 'tab-pm',
          label: 'Project Management',
          heading: 'Manage projects end to end',
          body: 'Coordinate timelines, assign tasks, and track progress all in one place.',
          ctaLabel: 'Show me more',
          ctaUrl: '/monday-consulting-solutions/monday-project-management',
          features: [],
        },
        {
          _key: 'tab-marketing',
          label: 'Marketing & Creative',
          heading: 'Streamline marketing workflows',
          body: 'Plan campaigns, manage creative assets, and track performance.',
          ctaLabel: 'Show me more',
          ctaUrl: '/monday-for-marketing',
          features: [],
        },
        {
          _key: 'tab-hr',
          label: 'HR Operations',
          heading: 'Simplify HR processes',
          body: 'Manage recruitment, onboarding, and employee lifecycle in one place.',
          ctaLabel: 'Show me more',
          ctaUrl: '/monday-consulting-solutions/monday-for-hr',
          features: [],
        },
        {
          _key: 'tab-finance',
          label: 'Finance Workflows',
          heading: 'Optimise finance operations',
          body: 'Streamline budgeting, invoicing, and financial reporting.',
          ctaLabel: 'Show me more',
          ctaUrl: '/monday-consulting-solutions/monday-for-finance',
          features: [],
        },
        {
          _key: 'tab-it',
          label: 'IT Operations',
          heading: 'Manage IT workflows',
          body: 'Track tickets, manage deployments, and streamline IT operations.',
          ctaLabel: 'Show me more',
          ctaUrl: '/monday-consulting-solutions',
          features: [],
        },
        {
          _key: 'tab-service',
          label: 'Customer Service',
          heading: 'Elevate customer service',
          body: 'Manage tickets, track SLAs, and improve customer satisfaction.',
          ctaLabel: 'Show me more',
          ctaUrl: '/monday-consulting-solutions/monday-service',
          features: [],
        },
      ],
    }

    // --- Step 7: Steps featureListBlock ---
    console.log('\n--- Step 7: Adding steps featureListBlock ---')
    const stepsBlock = {
      _key: 'steps-01',
      _type: 'featureListBlock',
      blockType: 'featureListBlock',
      heading: 'Get set up right, the first time. Measure twice, cut once.',
      features: [
        { _key: 'st-01', icon: '01', title: 'Map & Design', description: 'Map out your key business processes.' },
        { _key: 'st-02', icon: '02', title: 'Build & Optimise', description: 'Build custom workflows and automations tailored to your industry.' },
        { _key: 'st-03', icon: '03', title: 'Integration & Automate', description: 'Integrate monday.com with other systems.' },
        { _key: 'st-04', icon: '04', title: 'Train & Change', description: 'Train your team and provide ongoing support.' },
        { _key: 'st-05', icon: '05', title: 'Reporting & Analytics', description: 'Create dashboards displaying the metrics that are important to you.' },
      ],
    }

    // --- Step 8: Industry grid ---
    console.log('\n--- Step 8: Adding industry grid featureListBlock ---')
    const industriesBlock = {
      _key: 'industries-01',
      _type: 'featureListBlock',
      blockType: 'featureListBlock',
      heading: 'A Solution Built With You For You',
      features: [
        { _key: 'ind-01', title: 'Construction', description: '/monday-for-construction' },
        { _key: 'ind-02', title: 'Customer Service', description: '/monday-consulting-solutions/monday-service' },
        { _key: 'ind-03', title: 'Retail', description: '/monday-for-retail' },
        { _key: 'ind-04', title: 'Government', description: '/monday-for-government' },
        { _key: 'ind-05', title: 'Manufacturing', description: '/monday-for-manufacturing' },
        { _key: 'ind-06', title: 'Marketing & Creative', description: '/monday-for-marketing' },
        { _key: 'ind-07', title: 'Professional Services', description: '/monday-for-professional-services' },
        { _key: 'ind-08', title: 'Real Estate', description: '/monday-for-real-estate' },
      ],
    }

    // --- Step 9: Service richTextBlocks ---
    console.log('\n--- Step 9: Adding service richTextBlocks ---')
    function makeRichText(key, heading, body, ctaLabel, ctaUrl) {
      return {
        _key: key,
        _type: 'richTextBlock',
        blockType: 'richTextBlock',
        heading,
        content: [
          {
            _key: `${key}-p1`,
            _type: 'block',
            style: 'normal',
            markDefs: [],
            children: [{ _key: `${key}-c1`, _type: 'span', marks: [], text: body }],
          },
        ],
        ctaLabel,
        ctaUrl,
      }
    }

    const serviceImpl = makeRichText(
      'service-impl-01',
      'Get help setting up or fine-tuning your monday workflows',
      'Have our monday.com consultants design a system to support the way you want your business to run. Already have an account? Let us help you optimise and automate your existing workflows so you\'re more efficient than ever.',
      'Our Implementation Services',
      '/monday-implementation-consultants'
    )

    const serviceTraining = makeRichText(
      'service-training-01',
      'Get the entire team monday.com training',
      'Make sure all of your team members get the onboarding they need to feel comfortable using the platform day in and day out. So, when you actually start using the platform, it becomes your single source of truth.',
      'Our Training Services',
      '/monday-training'
    )

    const serviceIntegration = makeRichText(
      'service-integration-01',
      'Eliminate manual work with automation',
      'Seamlessly integrate Gmail, Outlook, Sharepoint, Teams, accounting software, ChatGPT, and dozens of other tools with the software\'s open API.',
      'See Our Solutions',
      '/monday-consulting-solutions'
    )

    // --- Step 10: Stats block ---
    console.log('\n--- Step 10: Adding statsBlock ---')
    const statsBlock = {
      _key: 'stats-01',
      _type: 'statsBlock',
      blockType: 'statsBlock',
      heading: 'Join 500+ businesses that have leveraged our monday.com expert consultants.',
      stats: [
        { _key: 'stat-01', value: '288%', label: 'ROI' },
        { _key: 'stat-02', value: '15,600', label: 'Hours Saved' },
        { _key: 'stat-03', value: '50%', label: 'Meeting reduction' },
        { _key: 'stat-04', value: '489,794', label: 'Net Value' },
      ],
      footnote: 'The economic impact of',
      ctaLabel: 'Book a Time',
      ctaUrl: 'https://calendly.com/global-calendar-fruitionservices',
    }

    // --- Step 11: Client logos block ---
    const clientLogosBlock = {
      _key: 'client-logos-01',
      _type: 'logoCloudBlock',
      blockType: 'logoCloudBlock',
      heading: 'Clients who have used our monday.com consulting services',
      logos: clientLogos,
    }

    // --- Step 11: Reorder all contentBlocks ---
    console.log('\n--- Step 11: Reordering all contentBlocks ---')

    // Get current document to preserve existing blocks
    const doc = await client.fetch('*[_type == "homePage"][0]')
    const existingBlocks = doc.contentBlocks || []

    // Extract existing blocks by key
    const blockMap = {}
    existingBlocks.forEach(b => { blockMap[b._key] = b })

    // Build the new ordered array
    const newContentBlocks = [
      blockMap['hero-01'],                    // hero
      blockMap['logos-01'],                    // partner badges (already patched)
      clientLogosBlock,                        // client logos (new)
      blockMap['testimonial-01'],
      blockMap['testimonial-02'],
      blockMap['testimonial-03'],
      blockMap['testimonial-04'],
      blockMap['testimonial-05'],
      challengesBlock,                         // new
      calendlyBlock,                           // new
      tabSectionBlock,                         // new
      stepsBlock,                              // new
      industriesBlock,                         // new
      serviceImpl,                             // new
      serviceTraining,                         // new
      serviceIntegration,                      // new
      statsBlock,                              // new
      blockMap['blog-01'],
      blockMap['cta-01'],
    ].filter(Boolean)

    await client
      .patch('homePage')
      .set({ contentBlocks: newContentBlocks })
      .commit()

    console.log(`\n=== Done! ${newContentBlocks.length} content blocks set on homePage ===`)
    console.log('Block order:')
    newContentBlocks.forEach((b, i) => console.log(`  ${i + 1}. ${b._key} (${b._type})`))

  } finally {
    await browser.close()
  }
}

run().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
