import PracticePageTemplate from '@/components/PracticePageTemplate'
import { AI_CONSULTING_PAGES } from '@/data/practicePages/aiConsulting'
import { practiceMetadata } from '@/data/practicePages/types'

const page = AI_CONSULTING_PAGES['governance-and-compliance']

export const metadata = practiceMetadata(page)

export default function Page() {
  return <PracticePageTemplate page={page} />
}
