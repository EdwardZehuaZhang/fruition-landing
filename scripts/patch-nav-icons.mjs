import { createClient } from 'next-sanity'
import { config } from 'dotenv'

config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const updates = {
  // What We Offer / Services
  '0-pulikm': { icon: 'package', description: 'Done-for-you monday.com setup tiers' },
  '1-en9gm8': { icon: 'graduation', description: 'Hands-on training for teams and admins' },
  '2-33n4y6': { icon: 'users', description: 'Certified consultants to guide your rollout' },
  '3-3d106x': { icon: 'chart', description: 'Build a sales pipeline that closes deals' },

  // What We Offer / Solutions
  '740l3szc6x': { icon: 'list', description: 'Browse every prebuilt monday.com solution' },
  '0-cfo9g4': { icon: 'layers', description: 'Plan, track, and deliver projects on time' },
  '1-ui1jrb': { icon: 'briefcase', description: 'Streamline ticketing and customer support' },
  '2-yofcjw': { icon: 'dollar', description: 'Manage budgets, AP, and AR in one place' },
  '3-cnrjam': { icon: 'bulb', description: 'Roadmaps, releases, and feedback loops' },
  '4-n0nxht': { icon: 'heart', description: 'Hire, onboard, and retain top talent' },
  '5-x8csd3': { icon: 'sun', description: 'Win solar deals and run installs end to end' },
  '6-h34nsm': { icon: 'wrench', description: 'Coordinate trades, jobs, and sites' },
  '7-tn1mdv': { icon: 'sparkle', description: 'Embed AI into operations for real ROI' },

  // Partnerships
  '0-k29zi5': { icon: 'handshake', description: 'Top-tier monday.com Platinum Partner' },
  '1-b983re': { icon: 'zap', description: 'Automate workflows across hundreds of apps' },
  '2-v1dubb': { icon: 'link', description: 'Build self-hosted automation pipelines' },
  '3-u1mzqc': { icon: 'list', description: 'Implement ClickUp for any team' },
  '4-vb4x4w': { icon: 'video', description: 'AI-generated video documentation' },
  '5-n0mcy8': { icon: 'chart', description: 'CRM, marketing, and service hubs' },
  '6-4w0wrx': { icon: 'megaphone', description: 'Scale social media management' },
  '7-alauil': { icon: 'phone', description: 'Cloud phone system for sales and support' },
  '8-bkbz0f': { icon: 'layers', description: 'Jira, Confluence, and developer tools' },

  // Locations
  '0-4u8t57': { icon: 'flag', description: 'monday.com partner in Sydney' },
  '1-egxfh2': { icon: 'flag', description: 'monday.com partner in London' },
  '2-3d1y7o': { icon: 'flag', description: 'monday.com partner across the US' },
  '3-bsdkju': { icon: 'flag', description: 'monday.com partner in Singapore' },
  '4-q5nx20': { icon: 'flag', description: 'monday.com partner in India' },

  // Industries
  '0-rf0re8': { icon: 'building', description: 'Run jobsites, RFIs, and submittals' },
  '1-yeqjj6': { icon: 'factory', description: 'Track production, MRP, and quality' },
  '2-dck94t': { icon: 'bag', description: 'Manage stores, inventory, and ops' },
  '3-ac82o2': { icon: 'briefcase', description: 'Bill projects and utilize consultants' },
  '4-8c505m': { icon: 'shield', description: 'Compliant workflows for public sector' },
  '5-z69yuy': { icon: 'megaphone', description: 'Campaigns, briefs, and creative reviews' },
  '6-o65v83': { icon: 'home', description: 'Track listings, leases, and deals' },

  // About
  '0-fqfn2w': { icon: 'info', description: 'Our mission, story, and values' },
  '1-hewmfp': { icon: 'briefcase', description: 'Open roles across our offices' },
  '2-1hhmm0': { icon: 'users', description: 'The consultants behind your success' },
  '3-zbuw0o': { icon: 'question', description: 'Answers to common questions' },
  '4-0x3odn': { icon: 'document', description: 'Customer wins and outcomes' },
  '5-ba33x8': { icon: 'edit', description: 'Insights from our consulting team' },
}

const tx = client.transaction()
let patches = 0
const doc = await client.fetch('*[_type == "siteSettings"][0]{_id, navigation}')

const navItems = doc.navigation || []
for (let i = 0; i < navItems.length; i++) {
  const item = navItems[i]
  for (let s = 0; s < (item.sections?.length || 0); s++) {
    const section = item.sections[s]
    for (let l = 0; l < (section.items?.length || 0); l++) {
      const link = section.items[l]
      const upd = updates[link._key]
      if (!upd) continue
      const path = `navigation[_key=="${item._key}"].sections[_key=="${section._key}"].items[_key=="${link._key}"]`
      tx.patch(doc._id, (p) =>
        p.set({
          [`${path}.icon`]: upd.icon,
          [`${path}.description`]: upd.description,
        })
      )
      patches++
    }
  }
}

console.log(`Patching ${patches} nav links...`)
const res = await tx.commit()
console.log('Done:', res.results?.length || 0, 'mutations')
