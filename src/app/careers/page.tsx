import Link from "next/link"
import { getSiteSettings, getCaseStudies } from "@/sanity/queries"
import {
  LogoCloudMarquee,
  CapabilitiesGrid,
  RemoteTeamSection,
  FaqAccordion,
  ApplicationFormSection,
  TestimonialsGrid,
  TestimonialCtaBanner,
  PartnerEcosystemSection,
} from "@/components/sections"
import type { Partner } from "@/components/sections/PartnerEcosystemSection"
import type { CaseStudy } from "@/components/sections/types"

export const metadata = {
  title: "Careers | Fruition Services",
  description:
    "Join Fruition — a Platinum monday.com partner building workflow, automation and integration solutions. 100% remote across 5 countries.",
}

/* --------------------------------------------------------------------- */
/*  Content (scraped verbatim from fruitionservices.io/careers)          */
/* --------------------------------------------------------------------- */

const BENEFITS = [
  {
    _key: "b1",
    emoji: "\uD83D\uDCA1",
    title: "Work That Makes an Impact",
    description:
      "Every solution you build directly transforms how our clients operate. You'll see the real-world impact of your work in faster processes, happier teams, and measurable ROI.",
  },
  {
    _key: "b2",
    emoji: "\uD83D\uDCC8",
    title: "Flexibility & Growth",
    description:
      "Join a team that values smart work, not just hard work. We're building something special, and there's room to grow your career as we scale.",
  },
  {
    _key: "b3",
    emoji: "\uD83C\uDFAF",
    title: "Upskill and Learn",
    description:
      "Work alongside expert consultants who are passionate about automation, workflow optimization, and user adoption. You'll continuously sharpen your skills on cutting-edge platforms while solving diverse business challenges.",
  },
  {
    _key: "b4",
    emoji: "\uD83E\uDD1D",
    title: "Client-Focused Culture",
    description:
      "We measure success by our clients' success. You'll be empowered to deliver solutions that truly serve their needs — not just check boxes. You'll have the autonomy to recommend the right solutions, the support to implement them seamlessly, and the satisfaction of seeing clients achieve faster time to value and meaningful ROI on their software investment.",
  },
]

const LOOKING_FOR = [
  {
    _key: "w1",
    title: "Problem-Solvers with a Consultant Mindset",
    description: "",
    bullets: [
      { _key: "w1a", emoji: "\uD83E\uDDE9", text: "Translate complex business needs into elegant automated workflows" },
      { _key: "w1b", emoji: "\uD83D\uDD0D", text: "Conduct thorough process audits to identify optimization opportunities" },
      { _key: "w1c", emoji: "\u2753", text: "Ask the right questions to uncover root causes, not just symptoms" },
    ],
  },
  {
    _key: "w2",
    title: "Technical Experts with a Human Touch",
    description: "",
    bullets: [
      { _key: "w2a", emoji: "\uD83D\uDD17", text: "Build seamless integrations that eliminate manual work" },
      { _key: "w2b", emoji: "\uD83D\uDEE0\uFE0F", text: "Design custom workflows that teams actually want to use" },
      { _key: "w2c", emoji: "\u26A1", text: "Leverage monday.com's flexibility to deliver scalable, cost-effective solutions" },
    ],
  },
  {
    _key: "w3",
    title: "Growth-Minded Professionals Who Love Learning",
    description: "",
    bullets: [
      { _key: "w3a", emoji: "\uD83D\uDCDA", text: "Stay ahead of monday.com feature releases and best practices" },
      { _key: "w3b", emoji: "\uD83E\uDDE0", text: "Experiment with new automation ideas to unlock efficiencies" },
      { _key: "w3c", emoji: "\uD83C\uDF0D", text: "Share knowledge with teams, empowering them to innovate and adapt" },
    ],
  },
]

const OFFICES = [
  { _key: "o1", flag: "\uD83C\uDDE6\uD83C\uDDFA", city: "Sydney", region: "Head Office", address: "64 York Street\nNSW 2000, Australia" },
  { _key: "o2", flag: "\uD83C\uDDFA\uD83C\uDDF8", city: "New York", region: "North America", address: "205 W 37th St\nNew York, NY 10018" },
  { _key: "o3", flag: "\uD83C\uDDEC\uD83C\uDDE7", city: "London", region: "EMEA", address: "Medius House, 2 Sheraton St\nLondon W1F 8BH" },
  { _key: "o4", flag: "\uD83C\uDDF8\uD83C\uDDEC", city: "Singapore", region: "South-East Asia", address: "Serving clients\nacross the region" },
  { _key: "o5", flag: "\uD83C\uDDEE\uD83C\uDDF3", city: "India", region: "South Asia", address: "Serving clients\nacross the region" },
]

const REMOTE_FEATURES = [
  { _key: "r1", emoji: "\uD83C\uDFE0", label: "Work from home (or anywhere)" },
  { _key: "r2", emoji: "\u23F0", label: "Flexible hours" },
  { _key: "r3", emoji: "\u2708\uFE0F", label: "No relocation required" },
  { _key: "r4", emoji: "\uD83C\uDF10", label: "Global team collaboration" },
  { _key: "r5", emoji: "\uD83D\uDCC5", label: "Async-friendly culture" },
]

const FAQ_TABS = [
  {
    _key: "careersFaq",
    label: "Careers FAQ",
    items: [
      {
        _key: "q1",
        question: "How long does a monday.com implementation take?",
        answer:
          "The timeline for a monday.com implementation depends on the complexity of your workflows and integrations. A standard setup can take 2–4 weeks, while enterprise-level implementations with advanced automations, dashboards, and system integrations may take 6–12 weeks. Working with our certified monday.com consultants can help you streamline the process and go live faster.",
      },
      {
        _key: "q2",
        question: "What does a monday.com implementation consultant do?",
        answer:
          "A monday.com consultant helps businesses translate processes into scalable workflows. They design custom automations, build integrations with third-party systems, set up dashboards, train teams, and ensure user adoption so your investment delivers measurable ROI. Our consultants specialize in tailoring monday.com to your business needs so you can get the most from the platform.",
      },
      {
        _key: "q3",
        question: "What is included in a monday.com implementation package?",
        answer:
          "Typical packages include workflow design, automation setup, system integrations (like CRM, ERP, or HR tools), user training, change management planning, and post-launch optimization. We offer consulting packages designed to fit businesses of all sizes, ensuring you only pay for the level of support you need.",
      },
      {
        _key: "q4",
        question: "Why hire a monday.com implementation partner?",
        answer:
          "A certified monday.com partner ensures faster setup, fewer errors, and customized workflows tailored to your industry. They bring expertise in process mapping, automation, and adoption strategies — saving you time and improving ROI. Partnering with our team means you'll have experts guiding you every step of the way.",
      },
      {
        _key: "q5",
        question: "How do I become a monday.com consultant or certified expert?",
        answer:
          "To become a certified monday.com consultant, you must complete monday.com's certification programs, demonstrate hands-on experience building workflows and automations, and often work with a certified partner to gain implementation expertise. If you're not looking to get certified yourself, our consultants can do the heavy lifting for you so your team can focus on execution.",
      },
      {
        _key: "q6",
        question: "What industries benefit most from monday.com consulting services?",
        answer:
          "Industries like construction, manufacturing, professional services, marketing, government, and retail benefit from tailored monday.com implementations, as consultants optimize workflows to reduce inefficiencies, automate tasks, and centralize project management. We've helped 500+ businesses across these industries achieve measurable results with custom monday.com solutions.",
      },
    ],
  },
]

/* --------------------------------------------------------------------- */
/*  Inline partner wordmarks (no external assets)                        */
/* --------------------------------------------------------------------- */

const PARTNERS: Partner[] = [
  {
    _key: "monday",
    name: "monday.com",
    tier: "Platinum Partner",
    description: "Work OS platform for workflow automation and project management.",
    tint: "#FFF2E6",
    wordmark: (
      <span style={{ fontSize: 20, fontWeight: 700, color: "#111", letterSpacing: "-0.02em" }}>
        <span style={{ color: "#FF3D57" }}>m</span>
        <span style={{ color: "#FFCB00" }}>o</span>
        <span style={{ color: "#00C875" }}>n</span>
        <span style={{ color: "#579BFC" }}>d</span>
        <span style={{ color: "#A25DDC" }}>a</span>
        <span style={{ color: "#FF7575" }}>y</span>
        <span style={{ color: "#111" }}>.com</span>
      </span>
    ),
  },
  {
    _key: "atlassian",
    name: "Atlassian",
    tier: "Gold Solution Partner",
    description: "Jira, Confluence and enterprise collaboration tooling.",
    tint: "#E9F2FF",
    wordmark: (
      <span style={{ fontSize: 18, fontWeight: 700, color: "#0052CC", letterSpacing: "-0.02em" }}>
        ATLASSIAN
      </span>
    ),
  },
  {
    _key: "make",
    name: "Make",
    tier: "Certified Partner",
    description: "Visual integration platform for connecting apps and automating workflows.",
    tint: "#F4E8FF",
    wordmark: (
      <span style={{ fontSize: 20, fontWeight: 700, color: "#6D00CC", letterSpacing: "-0.02em" }}>
        Make.
      </span>
    ),
  },
  {
    _key: "n8n",
    name: "n8n",
    tier: "Implementation Partner",
    description: "Open-source workflow automation for engineering teams.",
    tint: "#FFEEF0",
    wordmark: (
      <span style={{ fontSize: 22, fontWeight: 800, color: "#EA4B71", letterSpacing: "-0.04em" }}>
        n8n
      </span>
    ),
  },
  {
    _key: "aircall",
    name: "Aircall",
    tier: "Solutions Partner",
    description: "Cloud phone system and voice integration for modern teams.",
    tint: "#E7F6F1",
    wordmark: (
      <span style={{ fontSize: 18, fontWeight: 700, color: "#0D7B5C", letterSpacing: "-0.02em" }}>
        Aircall
      </span>
    ),
  },
  {
    _key: "hootsuite",
    name: "Hootsuite",
    tier: "Solutions Partner",
    description: "Social media management platform for brand and marketing teams.",
    tint: "#FEEFEF",
    wordmark: (
      <span style={{ fontSize: 18, fontWeight: 700, color: "#143059", letterSpacing: "-0.02em" }}>
        <span style={{ color: "#E6332A" }}>◎</span>&nbsp;Hootsuite
      </span>
    ),
  },
  {
    _key: "hubspot",
    name: "HubSpot",
    tier: "Solutions Partner",
    description: "CRM, marketing, sales and service platform for growing businesses.",
    tint: "#FFF1EC",
    wordmark: (
      <span style={{ fontSize: 18, fontWeight: 700, color: "#FF7A59", letterSpacing: "-0.02em" }}>
        HubSpot
      </span>
    ),
  },
]

/* --------------------------------------------------------------------- */
/*  Page                                                                  */
/* --------------------------------------------------------------------- */

export default async function CareersPage() {
  const [siteSettings, caseStudies] = await Promise.all([
    getSiteSettings(),
    getCaseStudies(),
  ])

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const studies: CaseStudy[] = caseStudies || []
  const featuredTestimonial =
    studies.find(
      (c) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || studies[0]

  return (
    <div>
      {/* -------------------------------------------------------------- */}
      {/*  1. Hero — custom layout with chip, headline, CTAs + stat row  */}
      {/* -------------------------------------------------------------- */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center px-4"
          style={{ maxWidth: 1200, paddingTop: 96, paddingBottom: 64 }}
        >
          <div
            className="inline-flex items-center rounded-full"
            style={{
              backgroundColor: "#f4ecff",
              color: "var(--purple-primary)",
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              border: "1px solid #e4d6fb",
            }}
          >
            <span aria-hidden style={{ marginRight: 8 }}>🚀</span> Careers
          </div>

          <h1
            className="text-display text-center"
            style={{ marginTop: 24, maxWidth: 900 }}
          >
            <span className="text-black">Build Solutions That </span>
            <span style={{ color: "var(--purple-primary)" }}>Matter</span>
          </h1>

          <p
            className="text-body-lead text-center"
            style={{
              marginTop: 24,
              maxWidth: 820,
              color: "#4a4a4a",
              lineHeight: 1.6,
            }}
          >
            At Fruition, we design solutions that simplify, scale and transform the
            way teams operate. As a Platinum monday.com partner, we specialize in
            tailoring workflows, automations, and integrations that turn software
            into a growth engine.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center"
            style={{ gap: 16, marginTop: 40 }}
          >
            <Link
              href="#application-form"
              className="flex items-center justify-center font-bold"
              style={{
                minWidth: 240,
                height: 53,
                padding: "0 32px",
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                color: "white",
                fontSize: 16,
              }}
            >
              🚀 Join Us
            </Link>
            <Link
              href="#remote"
              className="flex items-center justify-center font-bold"
              style={{
                minWidth: 240,
                height: 53,
                padding: "0 32px",
                borderRadius: 100,
                border: "1px solid #8015e8",
                backgroundColor: "white",
                color: "#8015e8",
                fontSize: 16,
              }}
            >
              See Where We Work
            </Link>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{
              marginTop: 56,
              gap: 16,
              width: "100%",
              maxWidth: 920,
            }}
          >
            {[
              { value: "500+", label: "Clients transformed" },
              { value: "5", label: "Countries" },
              { value: "7", label: "SaaS partnerships" },
              { value: "100%", label: "Remote team" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-card border border-[#ece7fb] bg-white text-center"
                style={{ padding: 20, boxShadow: "var(--shadow-whisper)" }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "var(--purple-primary)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "#4a4a4a",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Client logo marquee */}
      <LogoCloudMarquee
        headingPart1="Trusted by 500+ companies worldwide to "
        headingAccent="transform how they work"
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Benefits — "Why Join Fruition" */}
      <CapabilitiesGrid
        eyebrow="BENEFITS"
        heading="Why Join "
        headingAccent="Fruition"
        subheading="Four reasons our consultants, developers and strategists choose to build their careers at Fruition."
        theme="light"
        columns={2}
        cards={BENEFITS}
      />

      {/* 4. Partner Ecosystem — 7 SaaS platforms */}
      <PartnerEcosystemSection
        eyebrow="PARTNER ECOSYSTEM"
        heading="Built on a platform of "
        headingAccent="trusted partners"
        subheading="We partner with 7 industry-leading SaaS platforms to deliver best-in-class solutions tailored to our clients' needs."
        partners={PARTNERS}
      />

      {/* 5. What We're Looking For */}
      <CapabilitiesGrid
        heading="What We're "
        headingAccent="Looking For"
        subheading="If you're passionate about helping businesses work better, we want to hear from you."
        theme="light"
        columns={3}
        cards={LOOKING_FOR}
        ctaLabel="🚀 Join Us"
        ctaUrl="#application-form"
      />

      {/* 6. Remote Team / Global Offices */}
      <div id="remote">
        <RemoteTeamSection
          eyebrow="🌍 FULLY REMOTE"
          heading="Work From Anywhere. "
          headingAccent="Our Team Is Global."
          subheading="Fruition is a 100% remote company. Our consultants, developers, and strategists collaborate across five countries — meaning you can work from home, a café, or wherever you do your best thinking."
          offices={OFFICES}
          features={REMOTE_FEATURES}
          ctaLabel="🚀 Join Our Remote Team"
          ctaUrl="#application-form"
        />
      </div>

      {/* 7. FAQ */}
      <FaqAccordion tabs={FAQ_TABS} />

      {/* 8. Application form embed */}
      <div id="application-form">
        <ApplicationFormSection
          heading="Apply Now"
          embedUrl="https://forms.monday.com/forms/embed/a8f0bd1f2cc95cec5fb0dfb32726b8c4?r=use1"
        />
      </div>

      {/* 9. Testimonials — social proof after the ask */}
      <TestimonialsGrid
        heading="What it's like to work with us 🙌"
        caseStudies={studies}
      />

      {/* 10. Bottom CTA banner */}
      <TestimonialCtaBanner
        headingPart1="Join the team behind "
        headingAccent="500+ successful"
        headingPart2=" monday.com transformations."
        primaryCtaLabel="🚀 Apply Now"
        primaryCtaUrl="#application-form"
        secondaryCtaLabel="Book a Call"
        secondaryCtaUrl={calendlyUrl}
        testimonial={featuredTestimonial}
      />
    </div>
  )
}
