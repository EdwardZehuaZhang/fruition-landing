"use client"

import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  ServicesCardsGrid,
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

const N8N_TABS: ComparisonTab[] = [
  {
    _key: "challenges",
    label: "Top Challenges",
    items: [
      {
        _key: "c1",
        number: "01",
        title: "Productivity & Efficiency",
        description:
          "Without automation tools, your organisation faces slower processing times and increased errors compared to AI-powered competitors. By connecting intelligent AI agents to n8n workflows, you can automate repetitive grunt work and empower employees to focus on strategic, creative initiatives.",
      },
      {
        _key: "c2",
        number: "02",
        title: "Costly Operations",
        description:
          "n8n workflow automation drastically reduces labor costs and operational inefficiencies. Automate complex processes like invoice processing, financial forecasting, and data analysis while reducing manual intervention requirements.",
      },
      {
        _key: "c3",
        number: "03",
        title: "Data Accuracy and Decision Making",
        description:
          "Ensure greater accuracy in your business workflows with n8n's enterprise automation platform. Advanced automations enable efficient data gathering and analysis, minimising risks associated with manual data processing and enabling more informed, data-driven decision-making.",
      },
      {
        _key: "c4",
        number: "04",
        title: "Adaptability and Scalability",
        description:
          "n8n automation systems scale effortlessly to handle growing workloads without requiring significant resource increases. The platform helps organisations adapt to changing business conditions while optimising processes and automating business logic without limitations.",
      },
    ],
  },
  {
    _key: "solutions",
    label: "n8n Solutions",
    items: [
      {
        _key: "s1",
        number: "01",
        title: "Visual Workflow Editor",
        description:
          "n8n uses a drag-and-drop interface to build workflows, making designing complex automation processes intuitive. Seeing your workflows visually enables your users to easily understand and debug their automation processes. You can create workflows with branching, merging, and iteration capabilities.",
      },
      {
        _key: "s2",
        number: "02",
        title: "Extensive Integration Options",
        description:
          "n8n supports over 500 integrations, including popular platforms like HubSpot and ClearBit. n8n offers a wide range of pre-built nodes for connecting to various services and APIs, facilitating seamless data exchange between different platforms. Users can also create custom nodes to extend n8n's functionality and integrate with any service that has an API.",
      },
      {
        _key: "s3",
        number: "03",
        title: "On-Premise Deployment and Security",
        description:
          "On n8n, you have the option to self-host the platform, giving you full control over your data and infrastructure. Self-hosting ensures data privacy and security, which is particularly important if you are in a regulated industry. n8n also provides features like SSO, encrypted credentials store, and role-based access control (RBAC) for enhanced security.",
      },
      {
        _key: "s4",
        number: "04",
        title: "AI-Native Features",
        description:
          "n8n integrates with AI tools, enabling intelligent workflows and advanced automation capabilities.",
      },
    ],
  },
]

const PROVEN_STATS = [
  { emoji: "👤", value: "200k+", body: "users trust n8n to handle their AI automations worldwide" },
  { emoji: "🔌", value: "1,000+", body: "integration opportunities to enhance your operations" },
  { emoji: "⏱️", value: "85%", body: "average time savings on manual tasks and workflows" },
]

type ProvenStat = { emoji?: string; value?: string; body?: string }
function ProvenResultsSection({ stats }: { stats: ProvenStat[] }) {
  return (
    <section className="bg-white px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h2 className="text-center font-bold" style={{ color: "#10003a", fontSize: 36, lineHeight: "44px", marginBottom: 40 }}>
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
  const resolvedProvenStats: ProvenStat[] = (page.provenStats && page.provenStats.length > 0) ? page.provenStats : PROVEN_STATS

  return (
    <div>
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
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Our Comprehensive n8n Services */}
      {page.servicesCards?.length > 0 && (
        <ServicesCardsGrid
          heading={page.servicesHeading || "Our Comprehensive "}
          headingAccent={page.servicesHeadingAccent || "n8n Services"}
          subheading={page.servicesSubheading}
          theme={page.servicesTheme || "dark"}
          cards={page.servicesCards}
        />
      )}

      {/* Calendly under services */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule a 30-min consultation with one of our certified n8n consultants"}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* FAQ */}
      {!page.hideFaqSection && ((faqTabs && faqTabs.length > 0) ? (
        <FaqAccordion heading="Frequently asked questions" tabs={faqTabs} />
      ) : page.faqTabs?.length > 0 ? (
        <FaqAccordion heading="Frequently asked questions" tabs={page.faqTabs} />
      ) : null)}

      {/* Proven Results */}
      <ProvenResultsSection stats={resolvedProvenStats} />

      {/* Two-tab comparison: Top Challenges / n8n Solutions */}
      <ComparisonTabsSection
        heading="Streamline Operations & Maximise Efficiency on monday.com with n8n Solutions"
        subheading="We transform fragmented business processes into cohesive, automated systems that enhance team collaboration and deliver measurable ROI across your entire organisation."
        tabs={N8N_TABS}
        theme="light"
        withPurpleCircle={false}
      />
    </div>
  )
}
