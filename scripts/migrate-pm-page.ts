import { writeClient } from './sanity-client'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  const pageId = 'solutionPage-monday-project-management'

  // Upload PM hero image
  const filePath = path.join(__dirname, '..', 'public', 'images', 'pm-hero.avif')
  const buffer = fs.readFileSync(filePath)
  const asset = await writeClient.assets.upload('image', buffer, { filename: 'pm-hero.avif' })
  console.log('Uploaded PM hero image')

  const comparisonTabs = [
    {
      _key: 'tab-why',
      _type: 'comparisonTab',
      label: 'Why monday.com for Project Management',
      items: [
        {
          _key: 'why-1', _type: 'comparisonItem', number: '01', title: 'Flexibility & Customisation',
          bullets: [
            { _key: 'b1', _type: 'bullet', emoji: '\uD83C\uDFA8', text: 'Adaptable to any workflow \u2014 from simple to complex processes' },
            { _key: 'b2', _type: 'bullet', emoji: '\uD83E\uDDE9', text: 'Customisable columns, statuses, and views' },
            { _key: 'b3', _type: 'bullet', emoji: '\u26A1', text: 'Beginner-friendly, drag-and-drop interface' },
          ],
        },
        {
          _key: 'why-2', _type: 'comparisonItem', number: '02', title: 'All-in-One Platform',
          bullets: [
            { _key: 'b1', _type: 'bullet', emoji: '\uD83D\uDCCB', text: 'Task management, collaboration, reporting, and automations all in one place' },
            { _key: 'b2', _type: 'bullet', emoji: '\uD83D\uDD17', text: 'No need to switch between multiple apps' },
            { _key: 'b3', _type: 'bullet', emoji: '\uD83D\uDC65', text: 'Fits individuals, small teams, and enterprises' },
          ],
        },
        {
          _key: 'why-3', _type: 'comparisonItem', number: '03', title: 'Visual & Transparent',
          bullets: [
            { _key: 'b1', _type: 'bullet', emoji: '\uD83D\uDCCA', text: 'Gantt, Kanban, Calendar, Workload, and Dashboard views' },
            { _key: 'b2', _type: 'bullet', emoji: '\uD83D\uDCC8', text: 'High-level dashboards for executives and stakeholders' },
            { _key: 'b3', _type: 'bullet', emoji: '\uD83D\uDCAC', text: 'Real-time updates for clarity, accountability, and progress tracking' },
          ],
        },
        {
          _key: 'why-4', _type: 'comparisonItem', number: '04', title: 'Automation & Integrations',
          bullets: [
            { _key: 'b1', _type: 'bullet', emoji: '\uD83E\uDD16', text: 'Automate repetitive actions like reminders or status changes' },
            { _key: 'b2', _type: 'bullet', emoji: '\u23F1', text: 'Save time and reduce manual work' },
            { _key: 'b3', _type: 'bullet', emoji: '\uD83D\uDCA1', text: 'No coding required' },
          ],
        },
      ],
    },
    {
      _key: 'tab-features',
      _type: 'comparisonTab',
      label: 'monday.com PM Features',
      items: [
        {
          _key: 'feat-1', _type: 'comparisonItem', number: '01', title: '\uD83D\uDDC2 Project Planning & Organisation',
          description: 'Boards & Workspaces \u2013 Create boards for projects, departments, or workflows\n\nCustom Columns \u2013 Track statuses, owners, due dates, priorities, numbers, and more\n\nTemplates \u2013 Pre-built project management templates (Agile, Marketing, IT, CRM, etc.)',
        },
        {
          _key: 'feat-2', _type: 'comparisonItem', number: '02', title: '\uD83D\uDCCA Visualisation & Tracking',
          description: 'Views \u2013 Switch between different project views: Kanban, Gantt (timeline), Calendar, Table (spreadsheet-style)\n\nWorkload (resource management)\n\nDashboards \u2013 Consolidate project data into high-level reports across multiple boards\n\nProgress Tracking \u2013 Monitor completion percentages, milestones, and bottlenecks',
        },
        {
          _key: 'feat-3', _type: 'comparisonItem', number: '03', title: '\uD83D\uDD04 Collaboration',
          description: 'Updates & Comments \u2013 Communicate directly on items and tag teammates\n\nFile Sharing \u2013 Upload files to tasks and keep everything in one place\n\nNotifications \u2013 Automated alerts to keep everyone on track\n\nGuest Access \u2013 Shareable boards for external clients or partners',
        },
        {
          _key: 'feat-4', _type: 'comparisonItem', number: '04', title: '\u26A1 Automation & Efficiency',
          description: 'Automations \u2013 Rules like "When status changes to Done, move item to Completed group."\n\nDependencies \u2013 Set task dependencies to avoid scheduling conflicts\n\nRecurring Tasks \u2013 Automate repetitive work',
        },
        {
          _key: 'feat-5', _type: 'comparisonItem', number: '05', title: '\u2705 Task & Resource Management',
          description: 'Workload View \u2013 See who\u2019s over/under capacity\n\nTime Tracking \u2013 Log time per task (built-in column)\n\nSubitems \u2013 Break down large tasks into smaller actionable steps\n\nPrioritization \u2013 Use status/priority columns to focus on what matters most',
        },
      ],
    },
    {
      _key: 'tab-approach',
      _type: 'comparisonTab',
      label: 'Our Approach',
      items: [
        {
          _key: 'app-1', _type: 'comparisonItem', number: '01', title: 'Process Discovery \u2192 Business Process Audit',
          description: 'Our certified monday.com consultants meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
        },
        {
          _key: 'app-2', _type: 'comparisonItem', number: '02', title: 'Technical Architecture \u2192 System Integration Scope',
          description: 'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
        },
        {
          _key: 'app-3', _type: 'comparisonItem', number: '03', title: 'Solution design \u2192 Workflow and Integration Implementation',
          description: 'Through in-depth solution design analysis, we implement the perfect balance between automated system sophistication and user adoption, ensuring your solution is scalable and grows with your team\u2019s expertise.',
        },
        {
          _key: 'app-4', _type: 'comparisonItem', number: '04', title: 'Efficiency Impact \u2192 ROI Opportunity Analysis',
          description: 'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
        },
        {
          _key: 'app-5', _type: 'comparisonItem', number: '05', title: 'Change Readiness \u2192 Adoption Strategy Planning',
          description: 'Our proven change impact framework measures organisational readiness and crafts a tailored adoption strategy, turning potential resistance into enthusiastic system adoption.',
        },
      ],
    },
  ]

  await writeClient.patch(pageId).set({
    heroHeading: 'monday.com Project Management Consulting & Implementation',
    heroSubheading: 'Realise the full potential of monday.com for project management with our monday.com consultants\u2019 expert setup and PM implementation support.',
    heroImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    },
    primaryCtaLabel: '\uD83D\uDE80 Book a Consultation',
    primaryCtaUrl: 'https://calendly.com/global-calendar-fruitionservices',
    secondaryCtaLabel: '\u25B6\uFE0F Get Started with monday.com',
    secondaryCtaUrl: 'https://calendly.com/global-calendar-fruitionservices',
    comparisonHeading: 'Why choose monday.com for your project management needs?',
    comparisonTabs,
    calendlyHeading: 'Schedule A 30-Min Consultation With One of Our Expert monday.com Consultants',
  }).commit()

  console.log('Updated PM page with hero, comparison tabs (3 tabs), and calendly heading')
}

main().catch((err) => { console.error(err); process.exit(1) })
