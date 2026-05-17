import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  CaseStudyCardsSection,
  SolutionCardsSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"

const PARTNER_IMAGE_SRC = "/monday-marketing-partner.avif"

const WHY_TABS = [
  {
    _key: "why-tab-0",
    label: "Why monday.com for Marketing & Creative?",
    items: [
      {
        _key: "wt0-1",
        number: "01",
        title: "Streamline Your Process from Idea to Delivery",
        description:
          "🎯 Set goals and strategy\n📋 Plan project goals, tasks, and resources\n⏰ Oversee due dates, assign tasks, and more\n🚀 Deliver on time and within budget\n📊 Measure marketing impact",
      },
      {
        _key: "wt0-2",
        number: "02",
        title: "Run Efficient Campaigns",
        description:
          "🤝 Keep every stakeholder aligned on campaign progress\n💰 Ensure all campaigns are on budget and on time\n👁️ Maintain full visibility of campaign performance metrics\n🔍 Get a clear overview of every stage of the campaign process\n🔗 Connect and report from your ads sources and other essential marketing data",
      },
      {
        _key: "wt0-3",
        number: "03",
        title: "Simplify Approval Processes",
        description:
          "⚡ Automate key parts of the approval process\n🔄 Keep the entire team up to date\n✂️ Eliminate the need for frequent checkups, emails, and update meetings\n⏳ Save valuable time, so you can focus on the creative work itself",
      },
    ],
  },
  {
    _key: "why-tab-1",
    label: "Marketing & Creative Features",
    items: [
      {
        _key: "wt1-1",
        number: "01",
        title: "📝 Proofing and Approval",
        description:
          "Streamline the content review and approval process directly inside monday.com with the PageProof app, no matter the file type.",
      },
      {
        _key: "wt1-2",
        number: "02",
        title: "💬 Annotations and Live Feedback",
        description:
          "Shorten feedback loops with contextual annotations directly on your files, and communicate with stakeholders with updates and notifications.",
      },
      {
        _key: "wt1-3",
        number: "03",
        title: "📁 File Versioning",
        description:
          "Stay updated on the latest version. Track files connected to tasks and projects from latest to oldest. Add and delete versions, preview, download, and add annotations directly on file for quick feedback.",
      },
      {
        _key: "wt1-4",
        number: "04",
        title: "📊 Robust Gantt for Campaign Planning",
        description:
          "Plan and monitor marketing work, from campaigns to complex projects, with robust Gantt charts.",
      },
      {
        _key: "wt1-5",
        number: "05",
        title: "⚙️ Marketing Automations",
        description:
          "Automate repetitive marketing work with customisable automations to improve efficiency, allowing teams to free up time to focus on the work that matters.",
      },
      {
        _key: "wt1-6",
        number: "06",
        title: "🗂️ Asset Management",
        description:
          "Store, organize, and share all marketing digital assets in one centralised location.",
      },
    ],
  },
  {
    _key: "why-tab-2",
    label: "How We Can Help",
    items: [
      {
        _key: "wt2-1",
        number: "01",
        title: "Assess Your Needs",
        description:
          "🎯 Identify your marketing goals\n📝 List your specific requirements\n🔍 Analyse current workflow challenges",
      },
      {
        _key: "wt2-2",
        number: "02",
        title: "Design Your Process",
        description:
          "⚙️ Create workflows tailored to your marketing tasks\n🗺️ Map out how information will flow in the system\n📋 Define roles and responsibilities",
      },
      {
        _key: "wt2-3",
        number: "03",
        title: "Set Up monday.com",
        description:
          "🔧 Configure custom workflows\n🤖 Set up automations and permissions\n📤 Transfer existing data (if any)",
      },
      {
        _key: "wt2-4",
        number: "04",
        title: "Train Your Team",
        description:
          "🎓 Teach staff how to use monday.com\n🖐️ Provide hands-on practice sessions\n📚 Create user documentation and guides",
      },
      {
        _key: "wt2-5",
        number: "05",
        title: "Launch the System",
        description:
          "📊 Roll out monday.com to your organisation\n💬 Offer on-going support during the transition\n🎉 Celebrate successful implementation milestones",
      },
      {
        _key: "wt2-6",
        number: "06",
        title: "Keep Improving",
        description:
          "👁️ Monitor how well monday.com is working\n🔄 Make adjustments as needed\n🤝 Get ongoing support to optimise your marketing operations.",
      },
    ],
  },
]

const WHY_BEST_CARDS = [
  { _key: "wb-0", emoji: "📋", title: "Campaign Management", description: "Keep all your marketing campaigns organised and on track with centralised project visibility." },
  { _key: "wb-1", emoji: "✏️", title: "Content Planning & Creation", description: "A centralised space to brainstorm ideas, plan content calendars, and collaborate seamlessly on content creation." },
  { _key: "wb-2", emoji: "📱", title: "Social Media Management", description: "Schedule posts, track engagement metrics, and monitor social media campaigns across all platforms." },
  { _key: "wb-3", emoji: "🎯", title: "Lead Generation & Tracking", description: "Create custom forms and integrate them with your website to ensure smooth lead generation processes." },
  { _key: "wb-4", emoji: "📊", title: "Analytics & Reporting", description: "Gain valuable insights into your marketing performance with comprehensive data tracking and visualisation." },
  { _key: "wb-5", emoji: "🤝", title: "Collaboration & Communication", description: "Enable seamless communication and foster effective teamwork for successful marketing campaign execution." },
  { _key: "wb-6", emoji: "💰", title: "Budget Tracking", description: "Track expenses, monitor costs, and maintain financial visibility to maximise your return on investment." },
  { _key: "wb-7", emoji: "🔗", title: "Integration Power", description: "Sync data, automate workflows, and streamline marketing operations by connecting all your essential tools." },
  { _key: "wb-8", emoji: "⚡", title: "Agile Marketing Workflows", description: "Adapt quickly to changing market trends and customer needs with flexible, agile marketing workflows." },
]

const MARKETING_CASE_STUDY_CARDS = [
  {
    _key: "mcs-0",
    title: "Proofing & Approval Workflow",
    description:
      "Reviewing and approving work shouldn't slow you down. With this use case, promote better teamwork by managing and tracking all proofs in one place. Results: 22% faster proofing & approval time · 15% fewer errors · 49% increase in deliverables.",
    videoUrl: "https://www.youtube.com/watch?v=Nw-0h8OkO1A",
  },
  {
    _key: "mcs-1",
    title: "Multi-Platform Campaign Management",
    description:
      "Managing campaigns on multiple platforms causes critical delays. With this use case, launch, manage, and track all marketing campaigns in one place. Results: 19% reduction in budget overspend · 14% faster launch time · 3× more campaigns launched.",
    videoUrl: "https://www.youtube.com/watch?v=RXI2hNxZAIQ",
  },
]

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-marketing")
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getIndustryPageBySlug("monday-for-marketing"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-marketing"),
  ])

  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"

  const faqTabs = groupFaqsIntoTabs(centralFaqs)
  const effectiveFaqTabs = faqTabs.length > 0 ? faqTabs : page.faqTabs || []

  const featuredTestimonial =
    caseStudies?.find(
      (c: { clientCompany?: string; clientName?: string }) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies?.[0]

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        headingPart1={page.heroHeading || page.title || ""}
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        partnerImageSrc={PARTNER_IMAGE_SRC}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
      />

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || ""}
        headingAccent={page.logoCloudHeadingAccent ?? ""}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Three-tab "Why monday.com for Marketing & Creative?" */}
      <ComparisonTabsSection
        heading="Why monday.com for Marketing & Creative?"
        tabs={(page.comparisonTabs && page.comparisonTabs.length > 0) ? page.comparisonTabs : WHY_TABS}
        theme="light"
        layout="tabs"
        withPurpleCircle={false}
      />

      {/* 4. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 5. FAQ */}
      {effectiveFaqTabs.length > 0 && <FaqAccordion tabs={effectiveFaqTabs} />}

      {/* 6. Marketing Case Studies (with video) */}
      <CaseStudyCardsSection
        heading="Marketing Case Studies"
        cards={(page.marketingCaseStudyCards && page.marketingCaseStudyCards.length > 0) ? page.marketingCaseStudyCards : MARKETING_CASE_STUDY_CARDS}
      />

      {/* 7. Streamline content creation */}
      {page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 8. Full-width video + Why the best use monday.com — single unified section */}
      <section style={{ backgroundColor: "#f7f5ff", paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
          {page.bottomVideoUrl && (
            <div
              className="w-full rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9", marginBottom: 64 }}
            >
              <YouTubeEmbed
                url={page.bottomVideoUrl}
                title={page.bottomVideoTitle || "monday.com for Marketing"}
              />
            </div>
          )}
          <h2
            className="text-section-h2 text-center"
            style={{ color: "#000000", marginBottom: 48 }}
          >
            Why the best use monday.com to manage their Marketing &amp; Creative teams
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
            {((page.whyBestCards && page.whyBestCards.length > 0) ? page.whyBestCards : WHY_BEST_CARDS).map((card: { _key?: string; emoji?: string; title?: string; description?: string }) => (
              <div
                key={card._key}
                className="bg-white rounded-card border border-[#e8e6e6]"
                style={{ padding: 28 }}
              >
                <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 12 }}>{card.emoji}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 8 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: "22px", color: "#4a4a4a" }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Join 500+ CTA + testimonial */}
      <TestimonialCtaBanner
        headingPart1="Join "
        headingAccent="500+ organisations"
        headingPart2=" that have maximised their workflows with our monday.com expert support"
        primaryCtaLabel="🚀 Start Your Transformation"
        primaryCtaUrl={calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
        testimonial={featuredTestimonial}
        testimonials={caseStudies}
      />
    </div>
  )
}
