import { writeClient } from './sanity-client'
import * as fs from 'fs'
import * as path from 'path'

async function uploadImage(filePath: string) {
  const buffer = fs.readFileSync(filePath)
  const asset = await writeClient.assets.upload('image', buffer, {
    filename: path.basename(filePath),
  })
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: asset._id } }
}

async function main() {
  const pageId = 'solutionPage-monday-project-management'
  const imgDir = path.join(__dirname, '..', 'public', 'images')

  // Upload solution images
  console.log('Uploading solution images...')
  const img1 = await uploadImage(path.join(imgDir, 'pm-solution-1.gif'))
  console.log('  1/3')
  const img2 = await uploadImage(path.join(imgDir, 'pm-solution-2.avif'))
  console.log('  2/3')
  const img3 = await uploadImage(path.join(imgDir, 'pm-solution-3.avif'))
  console.log('  3/3')

  const solutionCards = [
    {
      _key: 'sol-1',
      _type: 'solutionCard',
      heading: 'The project management solution for your biggest challenges',
      body: 'monday.com is the all-in-one project management platform that helps teams plan, track, and deliver projects with clarity. It gives you everything you need to manage tasks, timelines, and resources\u2014so every project stays on time and on budget.',
      image: img1,
    },
    {
      _key: 'sol-2',
      _type: 'solutionCard',
      heading: 'Resource management done right',
      body: 'Balance workloads and manage resources effectively with monday.com. Use workload views to prevent burnout, allocate tasks strategically, and ensure every team member is working at optimal capacity to keep projects on schedule.',
      image: img2,
    },
    {
      _key: 'sol-3',
      _type: 'solutionCard',
      heading: 'Clarity at Every Stage',
      body: 'Gain complete visibility into your projects with monday.com\u2019s project management dashboards. Track progress, monitor KPIs, and generate real-time reports across multiple projects, so stakeholders always have clarity and teams stay aligned.',
      image: img3,
    },
  ]

  const capabilitiesCards = [
    { _key: 'cap-1', _type: 'capabilityCard', emoji: '\uD83D\uDCC5', title: 'Gantt, Calendar, & Milestone Views', description: 'Plan projects with clarity using Gantt charts, calendars, and milestones to visualise deadlines, track dependencies, and keep every project phase on schedule.' },
    { _key: 'cap-2', _type: 'capabilityCard', emoji: '\uD83D\uDC64', title: 'Task Assignment & Dependencies', description: 'Assign tasks with clear ownership, priorities, and dependencies so teams stay accountable, balanced, and focused on delivering project results without delays.' },
    { _key: 'cap-3', _type: 'capabilityCard', emoji: '\uD83D\uDCAC', title: 'Team Collaboration & File Sharing', description: 'Centralise team communication with updates, file sharing, and real-time notifications to keep everyone aligned, reduce silos, and boost project collaboration.' },
    { _key: 'cap-4', _type: 'capabilityCard', emoji: '\uD83E\uDD16', title: 'Automation & Workflow Management', description: 'Automate repetitive work with rules for deadlines, reminders, and recurring tasks to save time, minimise errors, and keep projects moving efficiently forward.' },
    { _key: 'cap-5', _type: 'capabilityCard', emoji: '\uD83D\uDCCA', title: 'Dashboards & Project Reporting', description: 'Monitor KPIs, progress, and portfolio metrics in real-time dashboards, giving stakeholders visibility into project performance and alignment with key goals.' },
    { _key: 'cap-6', _type: 'capabilityCard', emoji: '\u2696\uFE0F', title: 'Resource Tracking & Time Logs', description: 'Track workloads, time logs, and capacity planning to distribute resources effectively, prevent burnout, and keep projects running smoothly across teams.' },
  ]

  const caseStudyCards = [
    {
      _key: 'cs-1',
      _type: 'caseStudyCard',
      title: 'Oscar Case Study',
      description: '"monday.com Work OS saves us about USD 50k in staff hours. For us, the benefits of moving to monday.com are massive."',
      personName: 'Stefanus Muller',
      personRole: 'General Director, CTO Product and Program Office, Oscar',
      videoUrl: 'https://www.youtube.com/watch?v=Y2AoOdaMM_0',
    },
    {
      _key: 'cs-2',
      _type: 'caseStudyCard',
      title: 'Flight Centre Case Study',
      description: '"It is now SO easy to see where projects are and what\u2019s our workload, process, and it\u2019s given back to us weeks, in our velocity and in our delivery"',
      personName: 'Andrew Currey',
      personRole: 'CTO Corporate ANZ, Flight Centre',
      videoUrl: 'https://www.youtube.com/watch?v=qrQ_x6BO8KQ',
    },
  ]

  await writeClient.patch(pageId).set({
    capabilitiesCards,
    solutionCards,
    caseStudyCards,
  }).commit()

  console.log('Updated PM page: solution cards with images, capabilities with correct icons, case studies with videos')
}

main().catch((err) => { console.error(err); process.exit(1) })
