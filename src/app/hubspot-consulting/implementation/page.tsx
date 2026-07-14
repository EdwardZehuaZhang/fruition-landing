import PracticePageTemplate from '@/components/PracticePageTemplate'
import { HUBSPOT_PAGES } from '@/data/practicePages/hubspot'
import { practiceMetadata } from '@/data/practicePages/types'

const page = HUBSPOT_PAGES['implementation']

export const metadata = practiceMetadata(page)

export default function Page() {
  return <PracticePageTemplate page={page} />
}
