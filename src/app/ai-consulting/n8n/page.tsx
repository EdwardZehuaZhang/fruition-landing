import PracticePageTemplate from '@/components/PracticePageTemplate'
import { PRICING_N8N_PAGES } from '@/data/practicePages/pricingN8n'
import { practiceMetadata } from '@/data/practicePages/types'

const page = PRICING_N8N_PAGES['n8n']

export const metadata = practiceMetadata(page)

export default function Page() {
  return <PracticePageTemplate page={page} />
}
