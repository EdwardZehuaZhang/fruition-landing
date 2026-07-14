import PracticePageTemplate from '@/components/PracticePageTemplate'
import { PROOF_PAGES } from '@/data/practicePages/proof'
import { practiceMetadata } from '@/data/practicePages/types'

const page = PROOF_PAGES['case-studies']

export const metadata = practiceMetadata(page)

export default function Page() {
  return <PracticePageTemplate page={page} />
}
