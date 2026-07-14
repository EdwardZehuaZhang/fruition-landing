import PracticePageTemplate from '@/components/PracticePageTemplate'
import { MONDAY_PRODUCTS_PAGES } from '@/data/practicePages/mondayProducts'
import { practiceMetadata } from '@/data/practicePages/types'

const page = MONDAY_PRODUCTS_PAGES['service']

export const metadata = practiceMetadata(page)

export default function Page() {
  return <PracticePageTemplate page={page} />
}
