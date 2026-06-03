import MethodologySection from "./MethodologySection"
import TrustBadgeRow from "./TrustBadgeRow"
import DualCtaRow from "./DualCtaRow"
import BeforeAfterSection from "./BeforeAfterSection"
import StatMetricBanner from "./StatMetricBanner"
import MicroCaseStudyBox from "./MicroCaseStudyBox"
import SymptomsChecklist from "./SymptomsChecklist"
import RoiCalculator from "./RoiCalculator"
import LeadForm, { type LeadFormField } from "./LeadForm"
import type {
  TrustBadge,
  BeforeAfterRow,
  MicroCaseStudy,
  ChecklistItem,
  RoiCalcConfig,
  StatMetric,
  MethodologyStep,
} from "./types"

/** Shape of `page.croSections` from Sanity (all optional). */
export interface CroSectionsData {
  trustBadges?: TrustBadge[]
  trustBadgesTheme?: "light" | "dark"
  dualCtaSecondaryLabel?: string
  dualCtaSecondaryUrl?: string
  stickyCtaLabel?: string
  stickyCtaUrl?: string
  beforeAfter?: {
    heading?: string
    beforeLabel?: string
    afterLabel?: string
    rows?: BeforeAfterRow[]
  }
  threeStep?: { heading?: string; steps?: MethodologyStep[] }
  statBanner?: { statement?: string; theme?: "light" | "dark"; metrics?: StatMetric[] }
  microCaseStudies?: { heading?: string; cases?: MicroCaseStudy[] }
  symptomsChecklist?: { heading?: string; subheading?: string; items?: ChecklistItem[] }
  roiCalc?: (RoiCalcConfig & { enabled?: boolean }) | undefined
  leadForm?: {
    enabled?: boolean
    heading?: string
    subheading?: string
    source?: string
    submitLabel?: string
    successMessage?: string
    fields?: LeadFormField[]
  }
}

interface CroSectionsProps {
  data?: CroSectionsData | null
  /** Primary CTA target for the dual-CTA secondary pairing (optional) */
  primaryCtaLabel?: string
  primaryCtaUrl?: string
}

/**
 * Renders the CRO action-item sections for a page from `page.croSections`.
 * Every sub-section is independent — only populated ones render — so a page
 * opts in per element via Sanity. Order is fixed and sensible; place this once
 * in a Content component (typically just after the hero).
 *
 * NOTE: the floating StickyCtaBar is rendered separately by pages (it is
 * position:fixed and belongs at the component root, not inline here).
 */
export default function CroSections({ data, primaryCtaLabel, primaryCtaUrl }: CroSectionsProps) {
  if (!data) return null

  const badges = data.trustBadges ?? []
  const hasDualCta = !!(data.dualCtaSecondaryLabel && data.dualCtaSecondaryUrl)
  const beforeAfterRows = data.beforeAfter?.rows ?? []
  const steps = data.threeStep?.steps ?? []
  const checklistItems = data.symptomsChecklist?.items ?? []
  const roiEnabled = !!data.roiCalc?.enabled
  const caseStudies = data.microCaseStudies?.cases ?? []
  const hasStatBanner = !!(data.statBanner?.statement || (data.statBanner?.metrics?.length ?? 0) > 0)
  const leadFormEnabled = !!data.leadForm?.enabled

  return (
    <>
      {badges.length > 0 && (
        <TrustBadgeRow badges={badges} theme={data.trustBadgesTheme ?? "light"} />
      )}

      {hasDualCta && (
        <section className="bg-white px-4" style={{ paddingTop: 8, paddingBottom: 40 }}>
          <div className="mx-auto flex justify-center" style={{ maxWidth: 1100 }}>
            <DualCtaRow
              primaryLabel={primaryCtaLabel}
              primaryHref={primaryCtaUrl}
              secondaryLabel={data.dualCtaSecondaryLabel}
              secondaryHref={data.dualCtaSecondaryUrl}
            />
          </div>
        </section>
      )}

      {beforeAfterRows.length > 0 && (
        <BeforeAfterSection
          heading={data.beforeAfter?.heading}
          beforeLabel={data.beforeAfter?.beforeLabel}
          afterLabel={data.beforeAfter?.afterLabel}
          rows={beforeAfterRows}
        />
      )}

      {steps.length > 0 && <MethodologySection heading={data.threeStep?.heading} steps={steps} />}

      {checklistItems.length > 0 && (
        <SymptomsChecklist
          heading={data.symptomsChecklist?.heading}
          subheading={data.symptomsChecklist?.subheading}
          items={checklistItems}
        />
      )}

      {roiEnabled && <RoiCalculator config={data.roiCalc} />}

      {caseStudies.length > 0 && (
        <MicroCaseStudyBox heading={data.microCaseStudies?.heading} cases={caseStudies} />
      )}

      {hasStatBanner && (
        <StatMetricBanner
          statement={data.statBanner?.statement}
          metrics={data.statBanner?.metrics}
          theme={data.statBanner?.theme ?? "dark"}
        />
      )}

      {leadFormEnabled && (
        <LeadForm
          heading={data.leadForm?.heading}
          subheading={data.leadForm?.subheading}
          source={data.leadForm?.source}
          submitLabel={data.leadForm?.submitLabel}
          successMessage={data.leadForm?.successMessage}
          fields={data.leadForm?.fields}
        />
      )}
    </>
  )
}
