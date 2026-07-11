import PracticePageTemplate from '@/components/PracticePageTemplate'
import { INTEGRATIONS_PAGES } from '@/data/practicePages/integrations'
import { practiceMetadata } from '@/data/practicePages/types'

const page = INTEGRATIONS_PAGES['twilio']

export const metadata = practiceMetadata(page)

export default function Page() {
  return <PracticePageTemplate page={page} />
}
