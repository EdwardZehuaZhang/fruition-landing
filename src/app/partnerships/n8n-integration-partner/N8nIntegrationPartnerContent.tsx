"use client"

import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  ServicesCardsGrid,
  CroSections,
  StickyCtaBar,
  WorkflowConnector,
} from "@/components/sections"
import type {
  CaseStudy,
  SiteSettingsData,
  FaqTab,
  ComparisonTab,
} from "@/components/sections/types"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

type ProvenStat = { emoji?: string; value?: string; body?: string }

function ProvenResultsSection({ stats }: { stats: ProvenStat[] }) {
  if (!stats || stats.length === 0) return null
  return (
    <section className="bg-surface px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "var(--text-body)", fontSize: 36, lineHeight: "44px", marginBottom: 40 }}>
          Proven <span style={{ color: "#8015e8" }}>n8n Automation</span> Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {stats.map((s, i) => (
            <div
              key={s.value || i}
              className="text-center"
              style={{
                padding: 32,
                borderRadius: 18,
                background: "linear-gradient(180deg, #f6efff 0%, #ebd9ff 100%)",
                border: "1px solid rgba(128,21,232,0.10)",
                boxShadow: "0 12px 28px -22px rgba(64,12,140,0.18)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                className="flex items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  background: "white",
                  fontSize: 26,
                  boxShadow: "0 4px 14px -8px rgba(64,12,140,0.25)",
                }}
              >
                {s.emoji}
              </span>
              <p className="font-bold" style={{ color: "#8015e8", fontSize: 40, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: "#444", fontSize: 14, lineHeight: "22px", maxWidth: 220 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function N8nIntegrationPartnerContent({
  page,
  siteSettings,
  faqTabs,
}: Props) {
  if (!page) return null
  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const provenStats: ProvenStat[] = page.provenStats ?? []
  const comparisonTabs: ComparisonTab[] = page.comparisonTabs ?? []
  const resolvedFaqTabs: FaqTab[] =
    (faqTabs && faqTabs.length > 0 ? faqTabs : page.faqTabs) ?? []

  return (
    <div>
      <StickyCtaBar mobileLabel="Book a call" label={page.croSections?.stickyCtaLabel} href={page.croSections?.stickyCtaUrl || calendlyUrl} />
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
      />

      {/* Logo cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Tech stack connector — apps orchestrated through n8n into monday.com */}
      <WorkflowConnector
        eyebrow="Tech stack connector"
        heading="Orchestrate your entire stack through one Work OS"
        subheading="We route data across your existing apps with custom n8n workflows, syncing everything into monday.com in real time."
        theme="dark"
        steps={[
          { glyph: "🗂️", label: "CRM & ERP", sublabel: "Leads, orders, invoices" },
          { glyph: "💬", label: "Slack & Email", sublabel: "Alerts & approvals" },
          { glyph: "⚙️", label: "n8n", sublabel: "Webhooks · JSON transforms · branching" },
          { glyph: "📊", label: "monday.com", sublabel: "Single source of truth", tone: "hub" },
        ]}
        footnote="Cloud or self-hosted. n8n charges per full workflow execution, not per step."
      />

      {/* Our Comprehensive n8n Services */}
      {page.servicesCards?.length > 0 && (
        <ServicesCardsGrid
          heading={page.servicesHeading}
          headingAccent={page.servicesHeadingAccent}
          subheading={page.servicesSubheading}
          theme={page.servicesTheme || "dark"}
          cards={page.servicesCards}
        />
      )}

      {/* CRO action items */}
      <CroSections
        data={page.croSections}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
      />

      {/* Calendly under services */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* FAQ */}
      {!page.hideFaqSection && resolvedFaqTabs.length > 0 && (
        <FaqAccordion heading={page.faqHeading} tabs={resolvedFaqTabs} />
      )}

      {/* Proven Results */}
      <ProvenResultsSection stats={provenStats} />

      {/* Two-tab comparison: Top Challenges / n8n Solutions */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        subheading={page.comparisonSubheading}
        tabs={comparisonTabs}
        theme="light"
        withPurpleCircle={false}
      />
    </div>
  )
}
