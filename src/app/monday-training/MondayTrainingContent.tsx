"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CAROUSEL_LOGOS = [
  { src: "/images/carousel-logo-1.png", alt: "Client 1" },
  { src: "/images/carousel-logo-2.png", alt: "Client 2" },
  { src: "/images/carousel-logo-3.png", alt: "Client 3" },
  { src: "/images/carousel-logo-4.png", alt: "Client 4" },
  { src: "/images/carousel-logo-5.png", alt: "Client 5" },
  { src: "/images/carousel-logo-6.png", alt: "Client 6" },
  { src: "/images/carousel-logo-7.png", alt: "Client 7" },
  { src: "/images/carousel-logo-8.png", alt: "Client 8" },
  { src: "/images/carousel-logo-9.png", alt: "Client 9" },
  { src: "/images/carousel-logo-10.png", alt: "Client 10" },
  { src: "/images/carousel-logo-11.png", alt: "Client 11" },
]

const TESTIMONIALS = [
  {
    name: "Jade Wood",
    role: "Managing Director, Popology",
    quote:
      "We are now utilising monday.com to its full potential, from lead through design and production teams - everyone knows what stage our projects are in, what's next and what our process is.",
  },
  {
    name: "Mairhead McKinley",
    role: "Delivery Manager, Givergy",
    quote:
      "We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information\u2014eliminating the need to email around for updates.",
  },
  {
    name: "Brandon-Lee Horridge",
    role: "Managing Director, BL Air Conditioning",
    quote:
      "This system will save hundreds of thousands of dollars a year guaranteed.",
  },
  {
    name: "Ron Amaram",
    role: "General Manager, Risk 2 Solutions",
    quote:
      "Fruition have been instrumental in moving us to a \u2018single source of truth\u2019 system for managing sales and projects.",
  },
  {
    name: "Lorenzo Tejada-Orrell",
    role: "Chief Innovation Officer, CLSQ",
    quote:
      "Since implementing monday.com, CLSQ has experienced a significant transformation in operational efficiency.",
  },
]

const TRAINING_TABS = [
  'Why Get monday Training',
  'monday.com Features',
  'How We Can Help',
] as const

type TrainingTab = typeof TRAINING_TABS[number]

const TRAINING_TAB_ITEMS: Record<TrainingTab, { number: string; title: string; bullets: string[] }[]> = {
  'Why Get monday Training': [
    {
      number: '01',
      title: 'Greater Return on Investment',
      bullets: [
        'Employees make full use of software capabilities',
        'Enhanced productivity',
        'Reduce time taken to complete tasks',
        'Improved efficiency, innovation, and competitive advantage',
      ],
    },
    {
      number: '02',
      title: 'Drive Adoption and Retention',
      bullets: [
        'Keep your team accountable',
        'Encourage adoption of the platform',
        'Provide employees with learning and development opportunities',
        'Improve team morale',
      ],
    },
    {
      number: '03',
      title: 'Reduce Costs Attributed to Errors',
      bullets: [
        'Well-trained employees make fewer mistakes, reducing the costs associated with errors and rework.',
        'Ensure higher quality work and output',
        'Maximize the effectiveness of monday.com',
      ],
    },
  ],
  'monday.com Features': [
    {
      number: '01',
      title: 'Boards & Views',
      bullets: [
        'Kanban, Gantt, Timeline, Calendar, and Chart views',
        'Custom columns for any data type',
        'Grouping and filtering for clarity',
      ],
    },
    {
      number: '02',
      title: 'Automations & Integrations',
      bullets: [
        'No-code automation recipes',
        'Connect with 200+ tools like Slack, Gmail, and Jira',
        'Custom API integrations for advanced workflows',
      ],
    },
    {
      number: '03',
      title: 'Dashboards & Reporting',
      bullets: [
        'Real-time dashboards across multiple boards',
        'Custom widgets for KPIs and metrics',
        'Export and share reports with stakeholders',
      ],
    },
  ],
  'How We Can Help': [
    {
      number: '01',
      title: 'Customised Training Programs',
      bullets: [
        'Role-specific training tailored to your team',
        'Hands-on workshops with real board configurations',
        'Train-the-trainer programs for internal champions',
      ],
    },
    {
      number: '02',
      title: 'Ongoing Support & Coaching',
      bullets: [
        'Post-training support to reinforce learning',
        'Regular check-ins to track adoption progress',
        'Advanced training sessions as your team grows',
      ],
    },
    {
      number: '03',
      title: 'Documentation & Resources',
      bullets: [
        'Guidde video documentation of your workflows',
        'Custom training materials and quick-reference guides',
        'Access to our knowledge base and best practices',
      ],
    },
  ],
}

const TRAINING_SERVICES = [
  {
    emoji: '\u2699\ufe0f',
    title: 'Customization',
    subtitle: 'See how to adapt your boards to your team\u2019s needs',
    description: 'Get the monday.com training you need to set up your CRM or project management tool exactly how you want it. Or get help tidying it up if you\u2019ve already built out your boards.\n\nAfter all, the platform should support the way you want your business to run.',
  },
  {
    emoji: '\ud83d\udc41\ufe0f',
    title: 'Bird\u2019s-Eye View',
    subtitle: 'Build a high-level roll-up of all your boards',
    description: 'Get help connecting all of your individual boards into one high-level board. So, you can give senior management a general overview of the entire team\u2019s progress.\n\nThey can check the project health, see what each team member is working on, and check on roadblocks\u2014all in a few clicks.',
  },
  {
    emoji: '\ud83d\udd17',
    title: 'IT Support',
    subtitle: 'Integrate your email and all external tools',
    description: 'With our monday.com training, you\u2019ll get help integrating Gmail, Outlook, Sharepoint, Teams, accounting software, ChatGPT, and dozens of other tools with our open API, so you truly have a single source of truth.',
  },
  {
    emoji: '\ud83d\udcc4',
    title: 'Handover Documentation',
    subtitle: 'Guidde Documentation',
    description: 'As Guidde certified partners, we leverage Guidde to create monday.com video documentation and training material.\n\nPost training, you\u2019ll get access to personalized video tutorials and written guides for handover documentation.',
    ctaLabel: '\ud83d\udcc4 Learn More About Guidde',
    ctaUrl: '/certified-guidde-partner',
  },
]

const FAQ_TABS = [
  'Training',
  'monday Work Management',
  'monday CRM',
  'monday Service',
] as const

type FaqTab = typeof FAQ_TABS[number]

const FAQ_ITEMS: Record<FaqTab, { question: string; answer: string }[]> = {
  'Training': [
    {
      question: 'Does monday.com have a training program?',
      answer: 'Yes \u2014 monday.com does have training programs, and they\u2019re offered in a few different formats depending on your needs:\n\nMonday Academy (Free) \u2014 Online learning platform with self-paced video courses and certifications. Covers everything from beginner basics to advanced automations and integrations. Includes role-specific paths (e.g., project managers, admins).\n\nLive Webinars (Free & Paid Options) \u2014 Monday.com regularly hosts webinars with live Q&A. Topics include \u201cGetting Started,\u201d \u201cAutomations Deep Dive,\u201d and best practices for workflows.\n\nCustomer Success Programs (For Teams & Enterprises) \u2014 Dedicated onboarding and tailored training sessions provided for paying customers, especially on Pro and Enterprise plans. These are personalized to your company\u2019s workflows and often led by a Monday.com consultant.\n\nMonday.com Partners & Consultants (Paid) \u2014 Certified partners around the world offer private training, implementation support, and advanced setup. Useful if you need deep customization, third-party integrations, or in-person training.\n\nHelp Center & Community (Free) \u2014 Step-by-step guides, templates, video tutorials, and an active user forum for ongoing learning.',
    },
    {
      question: 'Is monday.com Academy free?',
      answer: 'Yes, monday.com Academy is completely free. It offers self-paced online courses, certifications, and learning paths for users at every level \u2014 from beginners to advanced administrators. You can earn official monday.com certifications to demonstrate your expertise.',
    },
    {
      question: 'How long does monday.com training take?',
      answer: 'Training duration depends on the scope and complexity. A basic onboarding session typically takes 2\u20134 hours. Our comprehensive training programs run over 1\u20132 weeks, covering everything from board setup to advanced automations and integrations, tailored to your team\u2019s specific workflows.',
    },
    {
      question: 'Can training be customised for our team?',
      answer: 'Absolutely. Our training programs are fully customised to your organisation\u2019s workflows, industry, and team structure. We work with you to identify key use cases and build training around the specific boards, automations, and integrations your team will use every day.',
    },
  ],
  'monday Work Management': [
    {
      question: 'What is monday Work Management?',
      answer: 'monday Work Management is a product built on the monday.com platform specifically designed for project and portfolio management, resource planning, and team collaboration.',
    },
    {
      question: 'How does monday.com help with project management?',
      answer: 'monday.com provides boards, timelines, Gantt charts, Kanban views, and dashboards to help teams plan, track, and deliver projects on time. Automations reduce manual work while integrations connect your existing tools.',
    },
  ],
  'monday CRM': [
    {
      question: 'How does monday CRM compare to other CRMs?',
      answer: 'monday CRM offers unmatched flexibility and customization compared to traditional CRMs. It adapts to your sales process rather than forcing you into rigid workflows.',
    },
    {
      question: 'Can monday CRM integrate with our existing tools?',
      answer: 'Yes, monday CRM integrates with Gmail, Outlook, HubSpot, Salesforce, and hundreds of other tools. Our consultants can help set up custom integrations via the API for any tools not natively supported.',
    },
  ],
  'monday Service': [
    {
      question: 'What is monday Service?',
      answer: 'monday Service is monday.com\u2019s dedicated service management product, designed for IT and service teams to manage tickets, requests, and service delivery workflows in one centralised platform.',
    },
    {
      question: 'How can monday Service improve our support operations?',
      answer: 'monday Service provides automated ticket routing, SLA tracking, knowledge base integration, and real-time dashboards so your team can resolve issues faster and maintain service quality standards.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface MondayTrainingContentProps {
  heroHeading?: string
  heroSubheading?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MondayTrainingContent({
  heroHeading,
  heroSubheading,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
}: MondayTrainingContentProps) {
  const [activeTrainingTab, setActiveTrainingTab] = useState<TrainingTab>('Why Get monday Training')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [activeFaqTab, setActiveFaqTab] = useState<FaqTab>('Training')

  const duplicatedLogos = [...CAROUSEL_LOGOS, ...CAROUSEL_LOGOS]

  const heading = heroHeading || "Get your team official monday.com workflow training"
  const subheading = heroSubheading || "Expert Workflow Training delivered by a certified monday partner.\nOur training and adoption programs helps you onboard and adopt monday.com up to 10x faster."

  return (
    <div>
      {/* ============================================================ */}
      {/* SECTION 1 -- Hero                                            */}
      {/* ============================================================ */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingLeft: 273, paddingRight: 273, paddingTop: 80, paddingBottom: 80 }}
        >
          {/* Partner badges */}
          <div className="flex items-center" style={{ gap: 22 }}>
            {[
              { src: "/images/partner-platinum.png", alt: "monday.com Platinum Partner" },
              { src: "/images/partner-advanced-delivery.png", alt: "Advanced Delivery Partner" },
              { src: "/images/partner-make.png", alt: "Make Partner" },
            ].map((badge) => (
              <Image
                key={badge.src}
                src={badge.src}
                alt={badge.alt}
                width={120}
                height={44}
                className="h-[44px] w-auto rounded-[5px]"
                style={{ boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.5)" }}
              />
            ))}
          </div>

          {/* Heading */}
          <h1
            className="text-center font-bold"
            style={{
              fontSize: 48,
              lineHeight: "67.2px",
              marginTop: 42,
              maxWidth: 924,
            }}
          >
            <span className="text-black">Get your team official monday.com </span>
            <span style={{ color: "#8015e8" }}>workflow training</span>
          </h1>

          {/* Subheading */}
          <p style={{ fontSize: 18, lineHeight: '25.2px', color: 'black', marginTop: 31, textAlign: 'center', maxWidth: 859 }}>
            {subheading}
          </p>

          {/* Certification banner */}
          <div style={{ marginTop: 40 }}>
            <Image
              src="/images/badge-certifications.png"
              alt="Certifications"
              width={534}
              height={133}
              className="h-[133px] w-[534px] object-contain"
            />
          </div>

          {/* Dual CTA */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 20, marginTop: 40, width: 680 }}
          >
            <Link
              href={primaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices"}
              className="flex items-center justify-center font-bold"
              style={{
                width: 330,
                height: 53,
                borderRadius: 100,
                border: "1px solid #8015e8",
                backgroundColor: "white",
                color: "#8015e8",
                fontSize: 16,
              }}
            >
              {primaryCtaLabel || "\ud83d\ude80 Book a Consultation"}
            </Link>
            <Link
              href={secondaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices"}
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 330,
                height: 53,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {secondaryCtaLabel || "\u25b6\ufe0f Get Started with monday.com"}
            </Link>
          </div>

          {/* Hero image placeholder */}
          <div
            className="rounded-[24px]"
            style={{
              width: 1042,
              height: 312,
              backgroundColor: "#d9d9d9",
              marginTop: 40,
            }}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 -- Logo Cloud with Marquee Scroll                  */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-4">
        <div className="flex flex-col gap-[35px] items-center w-full max-w-[1348px] mx-auto">
          <p className="text-[28px] font-medium leading-[39.2px] text-center">
            <span className="text-black">Clients who have used our </span>
            <span className="text-[#8015e8]">monday.com expert consulting services</span>
          </p>
          <div className="w-full overflow-visible">
            <div
              className="flex items-center gap-[65px] animate-marquee"
              style={{ width: "max-content" }}
            >
              {duplicatedLogos.map((logo, i) => (
                <div
                  key={`logo-${i}`}
                  className="flex items-center justify-center shrink-0 h-[65px] overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    height={65}
                    className="h-full w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 -- YouTube Video Embed                             */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-[10px]">
        <div className="mx-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-[979px] aspect-video">
            <iframe
              src="https://www.youtube.com/embed/7vtrtlfC1Zg"
              title="monday CRM Success Story - Star Aviation | Powered by Fruition"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 -- Training Intro + Tabbed Content                 */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f0ecfe" }}>
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          {/* Intro heading */}
          <p
            className="text-center"
            style={{
              fontSize: 40,
              fontWeight: 400,
              lineHeight: "56px",
              maxWidth: 924,
            }}
          >
            <span className="text-black">Our consultants help </span>
            <span style={{ color: "#8015e8" }}>drive adoption</span>
            <span className="text-black"> and ensure long term success with monday.com</span>
          </p>

          <p
            className="text-center"
            style={{
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "22.4px",
              color: "black",
              marginTop: 20,
              maxWidth: 924,
            }}
          >
            We transform fragmented business processes into cohesive, automated systems that enhance team collaboration and deliver measurable ROI across your entire organisation.
          </p>

          {/* Training Tabs */}
          <div
            className="flex items-center"
            style={{ gap: 12, marginTop: 40 }}
          >
            {TRAINING_TABS.map((tab) => {
              const isActive = tab === activeTrainingTab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTrainingTab(tab)}
                  className="flex items-center justify-center font-bold"
                  style={{
                    height: 39,
                    paddingLeft: 28,
                    paddingRight: 28,
                    borderRadius: 99,
                    fontSize: 16,
                    cursor: "pointer",
                    ...(isActive
                      ? {
                          background: "linear-gradient(to right, #8015e8, #ba83f0)",
                          color: "white",
                          boxShadow: "0px 2px 8px rgba(128,21,232,0.35)",
                        }
                      : {
                          backgroundColor: "white",
                          border: "1px solid #e8e6e6",
                          color: "black",
                        }),
                  }}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* Tab content card */}
          <div
            style={{
              width: 816,
              backgroundColor: "white",
              border: "1px solid #e8e6e6",
              borderRadius: 24,
              padding: 28,
              marginTop: 28,
            }}
          >
            {TRAINING_TAB_ITEMS[activeTrainingTab].map((item) => (
              <div key={item.number} className="flex items-start" style={{ gap: 20, marginBottom: 28 }}>
                {/* Number */}
                <p className="font-extralight shrink-0" style={{ fontSize: 48, color: '#8015e8', lineHeight: 'normal', width: 60, textAlign: 'center' }}>
                  {item.number}
                </p>
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <p className="font-bold" style={{ fontSize: 16, color: '#2b074d', lineHeight: '22.4px' }}>
                    {item.title}
                  </p>
                  <ul className="list-disc" style={{ paddingLeft: 18, marginTop: 8, fontSize: 14, color: '#2b074d', lineHeight: '22.4px' }}>
                    {item.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 -- monday.com Training Australia (two-column)      */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex items-start" style={{ maxWidth: 1200, gap: 60 }}>
          {/* Left: Text */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#8015e8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              monday.com Training Australia
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 600, color: 'black', lineHeight: '44.8px', marginTop: 12 }}>
              Empower with <span style={{ color: '#8015e8' }}>monday.com training</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: '24px', color: 'black', marginTop: 20 }}>
              Make sure all key stakeholders get the onboarding they need to feel comfortable using and building on the platform day in and day out.
            </p>
            <p style={{ fontSize: 16, lineHeight: '24px', color: 'black', marginTop: 16 }}>
              So no one is so overwhelmed they decide not to touch it&ndash;or worse, revert to a combination of spreadsheets.
            </p>
            <Link
              href="https://calendly.com/global-calendar-fruitionservices"
              className="inline-flex items-center justify-center font-bold text-white"
              style={{
                height: 53,
                paddingLeft: 32,
                paddingRight: 32,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
                marginTop: 32,
              }}
            >
              {"\ud83d\ude80"} Book a Training Session
            </Link>
          </div>

          {/* Right: Image */}
          <div style={{ flex: 1 }}>
            <Image
              src="/images/service-monday-users.png"
              alt="monday.com users training"
              width={540}
              height={380}
              className="rounded-[24px] object-cover w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 -- Our Training Services                           */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f0ecfe", paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <h2 className="text-center" style={{ fontSize: 35, fontWeight: 500, color: 'black' }}>
            {"\ud83d\udc69\ud83c\udffd\u200d\ud83d\udcbc\ud83d\udc68\ud83c\udffb\u200d\ud83d\udcbc"} Our Training Services
          </h2>

          <div className="grid grid-cols-2" style={{ gap: 28, marginTop: 40 }}>
            {TRAINING_SERVICES.map((service) => (
              <div
                key={service.title}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e8e6e6",
                  borderRadius: 24,
                  padding: 28,
                }}
              >
                <div className="flex items-start" style={{ gap: 16 }}>
                  <span style={{ fontSize: 40 }}>{service.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: '#2b074d' }}>
                      {service.title}
                    </h3>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#8015e8', marginTop: 4 }}>
                      {service.subtitle}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: '22.4px', color: 'black', marginTop: 16, whiteSpace: 'pre-line' }}>
                  {service.description}
                </p>
                {service.ctaLabel && (
                  <Link
                    href={service.ctaUrl || '#'}
                    className="inline-flex items-center font-semibold"
                    style={{ fontSize: 14, color: '#8015e8', marginTop: 16 }}
                  >
                    {service.ctaLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 -- 500+ CTA Banner                                 */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <div
            className="flex items-center"
            style={{
              background: "linear-gradient(98.14deg, rgb(28, 2, 76) 0%, rgb(125, 20, 227) 100.01%)",
              borderRadius: 24,
              paddingLeft: 27,
              paddingRight: 44,
              paddingTop: 28,
              paddingBottom: 28,
              gap: 24,
            }}
          >
            <p className="flex-1" style={{ fontSize: 20, fontWeight: 500, color: "white" }}>
              Join{" "}
              <span style={{ color: "#d2acf7" }}>500+ businesses</span>
              {" "}that have leveraged our monday.com expert consultants.
            </p>
            <Link
              href="https://calendly.com/global-calendar-fruitionservices"
              className="flex shrink-0 items-center justify-center font-bold text-white"
              style={{
                width: 216,
                height: 53,
                border: "1px solid white",
                borderRadius: 100,
                fontSize: 16,
              }}
            >
              {"\ud83d\ude80"} Schedule a Meeting
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8 -- Testimonials                                    */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-4">
        <div className="mx-auto max-w-[1343px]">
          <div className="flex items-center justify-center gap-[89px] mb-[58px] w-full">
            <h2 className="text-[48px] text-black leading-[67.2px] w-[919px] shrink-0">
              What our customers say about us {"\ud83d\ude4c"}
            </h2>
            <Link
              href="https://calendly.com/global-calendar-fruitionservices"
              className="shrink-0 flex items-center justify-center h-[53px] w-[330px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
            >
              {"\ud83d\ude80"} Start Your Transformation
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-[16px] gap-y-[18px]">
            {/* Stat card */}
            <div className="relative w-full max-w-[437px] bg-[#10003a] rounded-[24px] shadow-[0px_1px_17px_0px_rgba(0,0,0,0.2)] flex flex-col px-[38px]">
              <div className="pt-[23px] pb-[30px]">
                <p className="font-semibold text-[40px] text-[#ba83f0] leading-[60px]">500+</p>
                <p className="font-light text-[24px] text-white leading-[36px]">
                  have maximised their<br />workflows with our<br />monday.com expert support
                </p>
              </div>
              <div className="pb-[30px]">
                <Link
                  href="/customer-testimonials"
                  className="inline-flex items-center justify-center rounded-[100px] border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Read our case studies
                </Link>
              </div>
            </div>
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="relative flex flex-col bg-white rounded-[24px] border border-[#e8e6e6] w-full max-w-[437px] min-h-[300px]"
              >
                <div className="flex items-start justify-between px-[38px] pt-[29px] pb-[18px]">
                  <div>
                    <p className="font-semibold text-[20px] text-[#2b074d] leading-[30px]">{t.name}</p>
                    <p className="font-light text-[14px] text-[#595959] leading-[21px]">{t.role}</p>
                  </div>
                  <div className="w-[57px] h-[53px] rounded-full bg-[#e8e6e6] shrink-0 ml-4" />
                </div>
                <div className="px-[38px] flex-1">
                  <p className="text-[15px] text-black leading-[22.5px]">{t.quote}</p>
                </div>
                <div className="flex gap-[2px] px-[38px] pb-[35px] pt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-[23px] h-[21px]" viewBox="0 0 23 21" fill="#8015E8">
                      <path d="M11.5 0L14.09 7.36H22.06L15.49 11.92L18.08 19.28L11.5 14.72L4.92 19.28L7.51 11.92L0.94 7.36H8.91L11.5 0Z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9 -- Calendly Booking                                */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1200 }}>
          <h2
            className="text-center"
            style={{ fontSize: 35, fontWeight: 500, color: "black", maxWidth: 800 }}
          >
            Schedule A 30-Min Consultation With One of Our monday.com Consultants
          </h2>
          <div
            className="w-full"
            style={{ marginTop: 40, borderRadius: 24, overflow: "hidden", height: 700 }}
          >
            <iframe
              src="https://calendly.com/global-calendar-fruitionservices"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Schedule a consultation"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 10 -- FAQ                                            */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <div className="mx-auto flex flex-col" style={{ width: 959, gap: 24 }}>
          <h2 className="font-bold" style={{ fontSize: 32, lineHeight: '38.4px', color: '#8015e8' }}>
            Frequently asked questions
          </h2>

          {/* Tab navigation bar */}
          <div className="flex items-start overflow-auto" style={{ width: 916, height: 52 }}>
            {FAQ_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveFaqTab(tab); setOpenFaqIndex(0) }}
                className="h-full shrink-0 relative"
                style={{
                  paddingTop: 14,
                  paddingBottom: 17,
                  paddingLeft: 27.469,
                  paddingRight: 27.469,
                  borderBottom: activeFaqTab === tab ? '3px solid #8e5cbf' : '3px solid transparent',
                }}
              >
                <span style={{ fontSize: 16, color: activeFaqTab === tab ? '#8e5cbf' : 'black', textAlign: 'center' }}>
                  {tab}
                </span>
              </button>
            ))}
          </div>

          {/* FAQ items for active tab */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            {FAQ_ITEMS[activeFaqTab].map((item, i) => (
              <div key={i} style={{ paddingTop: i === 0 ? 20 : 24 }}>
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex items-center justify-between text-left"
                  style={{ height: 30 }}
                >
                  <span style={{ fontSize: 20, lineHeight: '24px', color: 'black' }}>
                    {item.question}
                  </span>
                  <div className="shrink-0" style={{ width: 30, height: 30 }}>
                    <svg
                      className={`transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`}
                      width="30" height="30" viewBox="0 0 30 30" fill="none"
                    >
                      <path d="M8 12L15 19L22 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
                {openFaqIndex === i && (
                  <div style={{ paddingBottom: 16, paddingTop: 31, fontSize: 16, lineHeight: '24px', color: 'black', whiteSpace: 'pre-line' }}>
                    {item.answer}
                  </div>
                )}
                <div style={{ borderBottom: '1px solid #2b074d', marginTop: openFaqIndex === i ? 0 : 36 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 11 -- Discover CTA                                   */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#ece6fc", paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex flex-col items-center">
          <Image
            src="/images/badge-certifications.png"
            alt="Certifications"
            width={325}
            height={73}
            className="h-[73px] w-[325px] object-contain"
          />
          <h2
            className="text-center font-medium"
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: 35,
              color: "black",
              width: 694,
              marginTop: 28,
            }}
          >
            Discover how much monday.com can do for your team.
          </h2>
          <div
            className="flex items-center justify-center"
            style={{ gap: 24, marginTop: 32, width: 694 }}
          >
            <Link
              href="https://calendly.com/global-calendar-fruitionservices"
              className="flex flex-1 items-center justify-center font-bold"
              style={{
                height: 63,
                borderRadius: 100,
                backgroundColor: "white",
                color: "#8015e8",
                fontSize: 16,
              }}
            >
              {"\ud83d\ude80"} Schedule a Consultation
            </Link>
            <Link
              href="https://calendly.com/global-calendar-fruitionservices"
              className="flex flex-1 items-center justify-center font-bold text-white"
              style={{
                height: 63,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {"\u25b6\ufe0f"} Get Started with monday.com
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 12 -- Security Badge                                 */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingBottom: 80 }}>
        <div className="mx-auto max-w-[976px]">
          <Image
            src="/images/badge-security.png"
            alt="Security certifications"
            width={976}
            height={94}
            className="w-full h-auto"
          />
        </div>
      </section>
    </div>
  )
}
