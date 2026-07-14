import PracticePageTemplate from '@/components/PracticePageTemplate'
import { INDUSTRIES_PAGES } from '@/data/practicePages/industries'
import { practiceMetadata } from '@/data/practicePages/types'

const page = INDUSTRIES_PAGES['financial-services']

export const metadata = practiceMetadata(page)

export default function Page() {
  return <PracticePageTemplate page={page} />
}
