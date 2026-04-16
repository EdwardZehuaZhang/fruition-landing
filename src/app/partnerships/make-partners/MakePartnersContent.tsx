"use client"

import Link from "next/link"
import {
  LogoCloudMarquee,
  ComparisonTabsSection,
  TestimonialsGrid,
  CalendlySection,
  DiscoverCtaSection,
  JoinStatsSection,
  SecurityBadgeSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"

interface Props {
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
}

const HERO_IMAGE = "/images/make-gold-partner-badge.png"
const SHOWCASE_VIDEO = "/images/make-fruition-services.mp4"
const SHOWCASE_IMAGE_OPS = "/images/make-operations-flow.avif"
const SHOWCASE_IMAGE_FIN = "/images/make-finance-flow.avif"

const FEATURE_TABS = [
  {
    _key: "tab-features",
    label: "make.com Features",
    items: [
      {
        _key: "f1",
        number: "01",
        title: "As a Gold Partner, we leverage make's features to transform your operations:",
        bullets: [
          { _key: "f1-a", emoji: "🔗", text: "Unlimited Integration Possibilities: Connect seamlessly with 1000+ apps and services" },
          { _key: "f1-b", emoji: "⚡", text: "Real-Time Execution: Experience immediate process automation that responds instantly to triggers" },
          { _key: "f1-c", emoji: "🔒", text: "Enterprise-Grade Security: Trust in our SOC 2 Type II certified platform for maximum protection" },
          { _key: "f1-d", emoji: "📈", text: "Scalable Architecture: Effortlessly handle millions of operations as your business grows" },
        ],
      },
      {
        _key: "f2",
        number: "02",
        title: "Streamline operations and eliminate workflow friction:",
        bullets: [
          { _key: "f2-a", emoji: "🤖", text: "Automate repetitive tasks that drain your team's productivity and consume valuable working hours" },
          { _key: "f2-b", emoji: "✋", text: "Reduce manual data entry errors while saving time and improving overall operational accuracy" },
          { _key: "f2-c", emoji: "🎯", text: "Enhance process accuracy with consistent, reliable automation that delivers predictable results every time" },
          { _key: "f2-d", emoji: "🚀", text: "Accelerate workflow execution across all departments to boost team performance and output" },
        ],
      },
      {
        _key: "f3",
        number: "03",
        title: "Improve efficiency and maximise your operational potential:",
        bullets: [
          { _key: "f3-a", emoji: "🔄", text: "Connect disparate systems into one cohesive ecosystem that works harmoniously across platforms" },
          { _key: "f3-b", emoji: "📊", text: "Synchronise data in real-time across all platforms to ensure information consistency and accessibility" },
          { _key: "f3-c", emoji: "🚧", text: "Eliminate process bottlenecks that slow down your business and create operational inefficiencies" },
          { _key: "f3-d", emoji: "📏", text: "Scale operations seamlessly without adding complexity or requiring additional manual oversight" },
        ],
      },
      {
        _key: "f4",
        number: "04",
        title: "Drive innovation and stay ahead of the competition:",
        bullets: [
          { _key: "f4-a", emoji: "🛠️", text: "Create custom automation solutions tailored to your unique business needs and specific requirements" },
          { _key: "f4-b", emoji: "🔧", text: "Implement advanced integrations that unlock new possibilities and enhance your existing systems" },
          { _key: "f4-c", emoji: "🧠", text: "Deploy intelligent workflows that adapt to your business requirements and evolving operational demands" },
          { _key: "f4-d", emoji: "⚙️", text: "Optimise business processes for maximum efficiency, growth, and long-term competitive advantage" },
        ],
      },
    ],
  },
  {
    _key: "tab-why",
    label: "Why Choose Fruition?",
    items: [
      {
        _key: "w1",
        number: "01",
        title: "Our Gold Partner status demonstrates our expertise in:",
        bullets: [
          { _key: "w1-a", emoji: "🔧", text: "Advanced automation capabilities to handle complex business requirements" },
          { _key: "w1-b", emoji: "🎯", text: "Complex multi-step workflow design for sophisticated process automation" },
          { _key: "w1-c", emoji: "🔄", text: "Real-time data synchronisation across all your connected systems" },
          { _key: "w1-d", emoji: "🛡️", text: "Error handling and monitoring systems for reliable operation" },
          { _key: "w1-e", emoji: "🔗", text: "Custom API integration development tailored to your needs" },
        ],
      },
      {
        _key: "w2",
        number: "02",
        title: "Enterprise integration solutions that connect your entire business ecosystem:",
        bullets: [
          { _key: "w2-a", emoji: "📊", text: "Cross-platform data management for seamless information flow" },
          { _key: "w2-b", emoji: "🏢", text: "Legacy system connectivity to modernise existing infrastructure" },
          { _key: "w2-c", emoji: "☁️", text: "Cloud service orchestration for optimal performance" },
          { _key: "w2-d", emoji: "🔒", text: "Secure data transfer protocols ensuring complete protection" },
          { _key: "w2-e", emoji: "⚙️", text: "Scalable architecture design that grows with your business" },
        ],
      },
      {
        _key: "w3",
        number: "03",
        title: "Professional services that guide you from concept to completion:",
        bullets: [
          { _key: "w3-a", emoji: "👨‍💼", text: "Expert implementation guidance throughout your automation journey" },
          { _key: "w3-b", emoji: "🛠️", text: "Custom scenario development aligned with your business goals" },
          { _key: "w3-c", emoji: "🎓", text: "Team training and enablement for long-term success" },
          { _key: "w3-d", emoji: "🤝", text: "Ongoing support and optimisation for continuous improvement" },
          { _key: "w3-e", emoji: "📈", text: "Strategic consulting to maximize your automation ROI" },
        ],
      },
      {
        _key: "w4",
        number: "04",
        title: "Drive Innovation and transform your operational capabilities:",
        bullets: [
          { _key: "w4-a", emoji: "💡", text: "Create custom automation solutions that solve unique challenges" },
          { _key: "w4-b", emoji: "🔧", text: "Implement advanced integrations for enhanced functionality" },
          { _key: "w4-c", emoji: "🧠", text: "Deploy intelligent workflows that adapt to changing needs" },
          { _key: "w4-d", emoji: "⚙️", text: "Optimise business processes for maximum efficiency" },
          { _key: "w4-e", emoji: "🚀", text: "Future-proof your operations with cutting-edge technology" },
        ],
      },
      {
        _key: "w5",
        number: "05",
        title: "Partner-Led Implementation Advantages that ensure your success:",
        bullets: [
          { _key: "w5-a", emoji: "🎯", text: "Expert scenario development from certified make specialists" },
          { _key: "w5-b", emoji: "📋", text: "Best practices implementation based on proven methodologies" },
          { _key: "w5-c", emoji: "⚡", text: "Performance optimisation for maximum speed and reliability" },
          { _key: "w5-d", emoji: "🛟", text: "Comprehensive support throughout implementation and beyond" },
          { _key: "w5-e", emoji: "🔮", text: "Future-proof solutions designed to evolve with your business" },
        ],
      },
    ],
  },
  {
    _key: "tab-help",
    label: "How We Can Help",
    items: [
      {
        _key: "h1",
        number: "01",
        title: "Our certified team will guide you through:",
        bullets: [
          { _key: "h1-a", emoji: "📋", text: "Automation strategy development" },
          { _key: "h1-b", emoji: "🎨", text: "Workflow design and implementation" },
          { _key: "h1-c", emoji: "🔗", text: "System integration and testing" },
          { _key: "h1-d", emoji: "🔧", text: "Ongoing optimisation and support" },
        ],
      },
      {
        _key: "h2",
        number: "02",
        title: "As your dedicated make Gold Partner, we specialise in:",
        bullets: [
          { _key: "h2-a", emoji: "⚙️", text: "Advanced Workflow Design" },
          { _key: "h2-b", emoji: "🔌", text: "System Integration Development" },
          { _key: "h2-c", emoji: "🛠️", text: "Custom Automation Solutions" },
          { _key: "h2-d", emoji: "📈", text: "Enterprise Scaling Support" },
        ],
      },
      {
        _key: "h3",
        number: "03",
        title: "Begin your digital transformation journey:",
        description:
          "Contact Fruition's Make automation experts to begin your digital transformation journey. As a certified Gold Partner, we deliver enterprise-grade automation solutions that drive efficiency and growth. Transform your business operations and bring your workflows to Fruition.",
      },
    ],
  },
]

const SHOWCASE_CARDS: Array<{
  heading: string
  body: string
  media: { type: "video" | "image"; src: string }
  imageRight: boolean
}> = [
  {
    heading: "Keep operations running smoothly",
    body: "Run operations smoothly, even across siloed systems, by connecting your teams and the key project management and data synchronisation tools that your business relies on.",
    media: { type: "video", src: SHOWCASE_VIDEO },
    imageRight: true,
  },
  {
    heading: "Solve finance complexities",
    body: "Integrate multiple apps and systems into one platform and automate time-consuming processes such as quote-to-cash and procure-to-pay.",
    media: { type: "image", src: SHOWCASE_IMAGE_OPS },
    imageRight: false,
  },
  {
    heading: "Scale with intelligent workflows",
    body: "Design intelligent, multi-step workflows that adapt to your business — from sales handoffs to customer onboarding, with real-time data flowing across every tool you use.",
    media: { type: "image", src: SHOWCASE_IMAGE_FIN },
    imageRight: true,
  },
]

function safeBadgeSrc(ref: any): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).url() } catch { return null }
}

export default function MakePartnersContent({
  siteSettings,
  caseStudies = [],
}: Props) {
  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const partnerBadges = siteSettings?.navbarPartnerBadges || []

  const featuredTestimonial =
    caseStudies.find(
      (c) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies[0]

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingLeft: 273, paddingRight: 273, paddingTop: 80, paddingBottom: 80 }}
        >
          {partnerBadges.length > 0 && (
            <div className="flex items-center" style={{ gap: 22 }}>
              {partnerBadges.map((badge, i) => {
                const src = safeBadgeSrc(badge.image)
                if (!src) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={badge._key || `badge-${i}`}
                    src={src}
                    alt={badge.name || "Partner badge"}
                    width={120}
                    height={44}
                    className="h-[44px] w-auto rounded-[5px]"
                    style={{ boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.5)" }}
                  />
                )
              })}
            </div>
          )}

          <h1
            className="text-center font-bold"
            style={{ fontSize: 48, lineHeight: "67.2px", marginTop: 42, maxWidth: 924 }}
          >
            <span className="text-black">Bring Your Workflows to Fruition with </span>
            <span style={{ color: "#8015e8" }}>Make.com Automation</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: "25.2px",
              color: "black",
              marginTop: 31,
              textAlign: "center",
              maxWidth: 859,
              whiteSpace: "pre-line",
            }}
          >
            Transform your business operations with Fruition&rsquo;s certified Make Gold Partner expertise — enterprise-grade automation that connects your tools, scales with your growth, and unlocks new operational potential.
          </p>

          <div className="flex items-center justify-center" style={{ gap: 20, marginTop: 40, width: 680 }}>
            <Link
              href={calendlyUrl}
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 330,
                height: 53,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {"\uD83D\uDE80 Book a Consultation"}
            </Link>
          </div>

          {/* Hero image: Make.com Gold Partner badge composite */}
          <div style={{ marginTop: 40, width: "100%", maxWidth: 1042 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt="Make.com Gold Partner badge with workflow automation visuals"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1="Clients who have used our "
        headingAccent="Make.com automation services"
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Three-tab section */}
      <ComparisonTabsSection
        heading="Transform Your Business with Make Automations"
        tabs={FEATURE_TABS}
      />

      {/* 4. Alternating media + text showcase */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
          <div className="flex flex-col items-center text-center" style={{ marginBottom: 60 }}>
            <h2
              className="font-medium text-black"
              style={{ fontSize: 35, lineHeight: "49px", maxWidth: 900 }}
            >
              Automation you can see, flex, and scale
            </h2>
            <p
              className="text-black"
              style={{ fontSize: 20, marginTop: 12, maxWidth: 760 }}
            >
              Realise your business&rsquo;s full potential with Make&rsquo;s intuitive no-code development platform.
            </p>
          </div>

          <div className="flex flex-col" style={{ gap: 60 }}>
            {SHOWCASE_CARDS.map((card, i) => (
              <div
                key={`showcase-${i}`}
                className="flex items-center"
                style={{
                  gap: 48,
                  flexDirection: card.imageRight ? "row" : "row-reverse",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: "#2b074d",
                      lineHeight: "36px",
                    }}
                  >
                    {card.heading}
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: "25.6px",
                      color: "black",
                      marginTop: 20,
                    }}
                  >
                    {card.body}
                  </p>
                </div>
                <div
                  className="rounded-[24px] overflow-hidden"
                  style={{ flex: 1, aspectRatio: "16 / 10", background: "#f5f3f7" }}
                >
                  {card.media.type === "video" ? (
                    <video
                      src={card.media.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.media.src}
                      alt={card.heading}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Calendly */}
      <CalendlySection
        heading="Book Your Personalised Make Automation Demo"
        subheading="See how our Gold Partner team can map and automate your most time-consuming workflows."
        calendlyUrl={calendlyUrl}
      />

      {/* 6. Testimonials */}
      <TestimonialsGrid caseStudies={caseStudies} />

      {/* 7. Discover CTA */}
      <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />

      {/* 8. Join Stats */}
      <JoinStatsSection
        headingPart1="Join "
        headingAccent="500+ organisations"
        headingPart2=" that have transformed their operations with Make automation expertise"
        stats={[
          { _key: "s1", value: "500+", label: "Successful integrations delivered" },
          { _key: "s2", value: "1000+", label: "Apps connected across client stacks" },
          { _key: "s3", value: "Gold", label: "Certified Make.com Partner" },
        ]}
        ctaLabel={"\uD83D\uDE80 Book a Time"}
        ctaUrl={calendlyUrl}
        siteSettings={siteSettings || undefined}
      />

      {/* 9. Testimonial CTA Banner */}
      <TestimonialCtaBanner
        headingPart1="Join "
        headingAccent="500+ organisations"
        headingPart2=" that have automated their workflows with Fruition's Make expertise"
        primaryCtaUrl={calendlyUrl}
        secondaryCtaUrl={calendlyUrl}
        testimonial={featuredTestimonial}
      />

      {/* 10. Security */}
      <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
    </div>
  )
}
