import PracticePageTemplate from '@/components/PracticePageTemplate'
import { ATLASSIAN_PAGES } from '@/data/practicePages/atlassian'
import { practiceMetadata } from '@/data/practicePages/types'

const page = ATLASSIAN_PAGES['jira-service-management']

export const metadata = practiceMetadata(page)

export default function Page() {
  return <PracticePageTemplate page={page} />
}
