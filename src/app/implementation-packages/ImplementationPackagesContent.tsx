"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { urlFor } from "@/sanity/image"
import TestimonialsGrid from "@/components/sections/TestimonialsGrid"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// Sanity image reference (we take `any`-ish shape because the field is
// just `type: 'image'` on the schema)
type SanityImage = {
  asset?: { _ref?: string; _id?: string } | null
} | null | undefined

interface PackageFeature {
  _key?: string
  emoji?: string
  label?: string
}

interface PackageTier {
  _key?: string
  tabKey?: string
  name?: string
  badge?: string
  description?: string
  supportLabel?: string
  features?: PackageFeature[]
}

interface FeatureCard {
  _key?: string
  emoji?: string
  title?: string
  description?: string
}

interface FaqPair {
  _key?: string
  question?: string
  answer?: string
}

interface FaqTab {
  _key?: string
  label?: string
  items?: FaqPair[]
}

interface MethodologyStep {
  _key?: string
  number?: string
  title?: string
  description?: string
  bullets?: string[]
  extraText?: string
}

export interface ImplementationPackagesData {
  title?: string
  seoTitle?: string
  seoDescription?: string

  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroHeadingPart2?: string
  heroPartnerBadges?: Array<{ _key?: string; image?: SanityImage; alt?: string }>
  heroMondayPartnersImage?: SanityImage
  heroImage?: SanityImage
  heroCertificationBadge?: SanityImage
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string

  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string

  videoEmbedUrl?: string
  videoTitle?: string

  servicesIntroHeadingPart1?: string
  servicesIntroHeadingAccent?: string
  servicesIntroHeadingPart2?: string
  servicesIntroImage?: SanityImage
  featureCards?: FeatureCard[]

  socialProofBannerHtml?: PortableTextBlock[]
  socialProofCtaLabel?: string
  socialProofCtaUrl?: string

  pricingHeading?: string
  packageTiers?: PackageTier[]

  testimonialsHeading?: string
  testimonialsCtaLabel?: string
  testimonialsCtaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string

  calendlyHeading?: string
  calendlyUrl?: string

  faqHeading?: string
  faqTabs?: FaqTab[]

  discoverBadge?: SanityImage
  discoverHeading?: string
  discoverPrimaryCtaLabel?: string
  discoverPrimaryCtaUrl?: string
  discoverSecondaryCtaLabel?: string
  discoverSecondaryCtaUrl?: string

  methodologyHeading?: string
  methodologyHeadingAccent?: string
  methodologySteps?: MethodologyStep[]

  securityBadge?: SanityImage
}

interface CarouselLogo {
  alt?: string
  image?: SanityImage
}

interface CaseStudy {
  _id?: string
  clientName?: string
  clientRole?: string
  clientCompany?: string
  quote?: string
  logo?: SanityImage
  profilePhoto?: SanityImage
  linkedinUrl?: string
}

interface Props {
  data?: ImplementationPackagesData | null
  carouselLogos?: CarouselLogo[]
  caseStudies?: CaseStudy[]
  /**
   * Central faqItem tabs fetched at the page.tsx level. When
   * non-empty, overrides the embedded `data.faqTabs` so FAQ content
   * is managed from the central faqItem document store.
   */
  faqTabs?: FaqTab[]
}

/* ------------------------------------------------------------------ */
/*  Fallback constants (used only if Sanity fields are missing)        */
/* ------------------------------------------------------------------ */

const CALENDLY_URL = "https://calendly.com/global-calendar-fruitionservices"

const FALLBACK_PACKAGE_TIERS: PackageTier[] = [
  {
    tabKey: "Guided",
    name: "Quick Start",
    badge: "7 Day Delivery Timeline / 10 Hours",
    description:
      "Get up and running fast with monday.com. We\u2019ll help you configure templates and train you on best practices for your team\u2019s workflows. Transform monday.com into your centralized hub for project management and collaboration in record time.",
    supportLabel: "Support Included:",
    features: [
      { emoji: "\ud83d\udcc4", label: "Requirements" },
      { emoji: "\ud83d\udcc2", label: "Template Configuration" },
      { emoji: "\ud83d\udc65", label: "Best Practices Training" },
    ],
  },
  {
    tabKey: "Lock-step",
    name: "We Build Together",
    badge: "3 Weeks Delivery Timeline / 20 Hours",
    description:
      "Partner with our monday.com experts in a collaborative, hands-on implementation where we work side-by-side with your team every step of the way. We\u2019ll map your existing processes, design a comprehensive solution architecture, build out your complete workspace with advanced automations and native integrations, and optimize workflows for maximum efficiency.",
    supportLabel: "Quick Start Plus:",
    features: [
      { emoji: "\ud83d\udd27", label: "Process mapping" },
      { emoji: "\ud83e\udd1d", label: "Optimisation" },
      { emoji: "\u2699\ufe0f", label: "Solution design" },
      { emoji: "\ud83d\udd17", label: "Automation & native integration support" },
      { emoji: "\ud83e\uddd1\u200d\ud83d\udcbb", label: "Implementation" },
      { emoji: "\ud83d\udc65", label: "CRM & Work Management training" },
    ],
  },
  {
    tabKey: "Bespoke",
    name: "Solution Delivered by Fruition",
    badge: "4-8 Weeks Delivery Timeline / 20+ Hours",
    description:
      "This is our most comprehensive package designed for complex organizations requiring enterprise-level customization.\n\nWe\u2019ll conduct deep multi-step process mapping across departments, architect scalable solutions for multiple teams and use cases, build fully custom monday.com environments tailored to your unique workflows, and leverage advanced integrations through Make, Zapier, or custom API development to connect your entire tech stack.",
    supportLabel: "Lock-step Plus:",
    features: [
      { emoji: "\ud83d\udcdd", label: "Multi-step process mapping" },
      { emoji: "\ud83d\udd17", label: "Integration (Make, Zapier, & API)" },
      { emoji: "\ud83d\udee0\ufe0f", label: "Multi-team solution design" },
      { emoji: "\ud83e\udd1d", label: "Training/adoption support" },
      { emoji: "\ud83e\uddd1\u200d\ud83d\udcbb", label: "Custom solution build" },
    ],
  },
]

const FALLBACK_CAROUSEL_LOGOS: { src: string; alt: string }[] = [
  { src: "/images/carousel-logo-1.png", alt: "Client" },
  { src: "/images/carousel-logo-2.jpg", alt: "Client" },
  { src: "/images/carousel-logo-3.jpg", alt: "Client" },
  { src: "/images/carousel-logo-4.png", alt: "Client" },
  { src: "/images/carousel-logo-5.jpg", alt: "Client" },
  { src: "/images/carousel-logo-6.jpg", alt: "Client" },
  { src: "/images/carousel-logo-7.jpg", alt: "Client" },
  { src: "/images/carousel-logo-8.png", alt: "Client" },
  { src: "/images/carousel-logo-9.png", alt: "Client" },
  { src: "/images/carousel-logo-10.jpg", alt: "Client" },
  { src: "/images/carousel-logo-11.png", alt: "Client" },
  { src: "/images/carousel-logo-12.jpg", alt: "Client" },
  { src: "/images/carousel-logo-13.png", alt: "Client" },
  { src: "/images/carousel-logo-14.png", alt: "Client" },
]

const FALLBACK_TESTIMONIALS: { name: string; role: string; quote: string; photo?: string }[] = [
  {
    name: "Jade Wood",
    role: "Managing Director, Popology",
    quote:
      "We are now utilising monday.com to its full potential, from lead through design and production teams - everyone knows what stage our projects are in, what's next and what our process is.",
    photo: "/images/testimonial-jade-wood.jpg",
  },
  {
    name: "Mairhead McKinley",
    role: "Delivery Manager, Givergy",
    quote:
      "We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information\u2014eliminating the need to email around for updates.",
    photo: "/images/testimonial-mairhead-mckinley.png",
  },
  {
    name: "Brandon-Lee Horridge",
    role: "Managing Director, BL Air Conditioning",
    quote:
      "This system will save hundreds of thousands of dollars a year guaranteed.",
    photo: "/images/testimonial-brandon-lee-horridge.png",
  },
  {
    name: "Ron Amaram",
    role: "General Manager, Risk 2 Solutions",
    quote:
      "Fruition have been instrumental in moving us to a \u2018single source of truth\u2019 system for managing sales and projects.",
    photo: "/images/testimonial-ron-amaram.jpg",
  },
  {
    name: "Lorenzo Tejada-Orrell",
    role: "Chief Innovation Officer, CLSQ",
    quote:
      "Since implementing monday.com, CLSQ has experienced a significant transformation in operational efficiency.",
    photo: "/images/testimonial-lorenzo-tejada-orrell.png",
  },
  {
    name: "Louis Stenmark",
    role: "Co-Founder, Windfall Bio",
    quote:
      "The Fruition team helped me get the most out of monday.com. They provided me with in depth instruction, custom templates and helped me solve problems unique to our early stage company\u2019s needs.",
  },
  {
    name: "Luke Reddin",
    role: "Director, Clean Power Australia",
    quote:
      "Josh and his team were excellent from start to finish on building our monday.com integrations and automations. Very happy with them.",
  },
  {
    name: "Brad Cannon",
    role: "Senior Account Executive, monday.com",
    quote:
      "Having experienced working with Josh directly at monday.com, I\u2019d have no hesitation recommending Josh in any consulting engagement.",
  },
  {
    name: "Bianca Genesio",
    role: "Central Manager, G8 Education",
    quote:
      "Couldn\u2019t be more happier. Thank you Josh for your hard work and commitment. Highly recommend!",
  },
  {
    name: "Anthony D\u2019Agostino",
    role: "True Steel Frames",
    quote:
      "Josh & the Fruition team were great to deal with and very thorough. would highly recommend!",
  },
  {
    name: "Jemma Ryan",
    role: "",
    quote:
      "What a pleasant and wonderful experience it was to be dealing with Josh and the fruition team. It made it a smooth and easy process for us and our team. They were all very professional and great to speak with. Looking forward to working again with you in the future.",
  },
  {
    name: "Teddy Mangion",
    role: "",
    quote:
      "Josh and the Fruition team were an absolute pleasure to work with. They were professional, knowledgeable, and made the whole process smooth and straightforward. I would highly recommend them to anyone looking for quality software solutions.",
  },
  {
    name: "Anthony Rowson",
    role: "",
    quote:
      "We are very Happy Little Campers, and our system is easy to use, portable, flexible and very informative and gives us a great insight to ALL facets of the business and where our communication and marketing efforts are best targeted to maximize our returns for effort. I would highly recommend you have an initial chat with these guys. They know their stuff.",
  },
  {
    name: "Kerrie E",
    role: "",
    quote:
      "A big thanks to Josh - spent a couple of hours working through ways to get our Event Project Plan on Monday into good shape. We know have a much more user friendly and useful Project Plan and we have made use of a variety of different automations to streamline processes. When our NFP is ready to undertake more complex Monday activities I will definitely be looking to Fruition for support.",
  },
  {
    name: "Tedd Long",
    role: "MCAG Inc.",
    quote:
      "Zach provided excellent training on Monday.com and he included some great insights on how we can best use the project management features. Thank you!",
  },
]

const FALLBACK_FAQ_TABS: FaqTab[] = [
  {
    label: "Professional Services",
    items: [
      {
        question: "Does monday com have a CRM?",
        answer: "Yes, monday has a dedicated CRM product. monday.com CRM is a flexible and highly customizable cloud-based CRM platform intended for businesses of all sizes.",
      },
      {
        question: "Does monday com have task management?",
        answer: "Yes, monday.com has task management. Take a trial of monday work management and discover just how efficiently you can manage your teams\u2019 to-do list.",
      },
      {
        question: "Why is monday.com so successful?",
        answer: "Here are key factors that make monday.com so successful:\n\nOne of Monday.com\u2019s key selling points is its highly customizable nature, allowing users to tailor workflows, add automations, and integrate third-party apps.\n\nExtremely user-friendly, making adoption easy\n\nHighly visual, agile, and, most importantly, scalable\n\nmonday.com can be used to manage anything you want. It\u2019s a veritable Swiss Army knife for managers around the world",
      },
      {
        question: "What exactly does monday.com do?",
        answer: "monday.com is the most versatile project management software you\u2019ll find on the market. You can use the platform to manage all of your projects, and also use it as a CRM, to manage your ad campaigns, track bugs, and manage video production.",
      },
    ],
  },
  {
    label: "monday Work Management",
    items: [
      { question: "Can monday.com be used for project management?", answer: "Yes, monday.com is an excellent project management platform that supports both waterfall and agile methodologies. monday.com Work Management provides comprehensive project portfolio management capabilities, allowing teams to efficiently manage portfolios, projects, and tasks in one centralized workspace." },
      { question: "What is Monday.com Work Management?", answer: "monday.com Work Management is a cloud-based platform that helps teams plan, organize, and track their work in one centralized workspace. It offers customizable boards, task automation, and powerful integrations to streamline workflows across any industry." },
      { question: "Is monday.com a PPM tool?", answer: "Yes, monday.com is a comprehensive Project Portfolio Management (PPM) tool. In October 2024, monday.com launched monday.com Portfolio as part of their Enterprise-level offering, establishing the platform as a robust PPM solution for organizations managing multiple projects and portfolios." },
      { question: "Can Monday.com Work Management be customized for my team\u2019s needs?", answer: "Yes! Monday.com is fully customizable. You can build boards, workflows, and dashboards tailored to your team\u2019s unique processes, whether you manage projects, sales pipelines, marketing campaigns, or operations." },
      { question: "Does Monday.com integrate with other tools?", answer: "Absolutely. Monday.com integrates with popular tools like Slack, Microsoft Teams, Google Workspace, Zoom, HubSpot, Salesforce, and more. These integrations ensure seamless data flow and keep your team connected." },
      { question: "How secure is Monday.com Work Management?", answer: "Monday.com uses industry-leading security measures, including SOC 2 Type II compliance, GDPR compliance, data encryption, and role-based permissions. This ensures that your company data remains safe and protected." },
      { question: "What are the five stages of project management?", answer: "The five stages of project management form the essential project management lifecycle that guides successful project delivery from start to finish: 1. Project Initiation, 2. Project Planning, 3. Project Execution, 4. Project Monitoring and Control, 5. Project Closure." },
    ],
  },
  {
    label: "monday CRM",
    items: [
      { question: "What is monday CRM used for?", answer: "monday CRM allows you to have full control over your sales pipeline, manage your contacts, streamline your post sales processes and sales enablement, all while seeing the big picture at a glance." },
      { question: "Is monday.com a good CRM tool?", answer: "Yes, monday.com can be a great CRM tool, particularly for businesses that value flexibility, customization, and ease of use. Key features that make monday.com a great CRM tool include contact management, pipeline management, automation, and customisation." },
      { question: "Does monday.com CRM provide good value for investment?", answer: "If your priorities include rapid implementation, extensive customization capabilities, and maintaining a unified workspace, then monday CRM delivers excellent value proposition." },
      { question: "Does monday.com offer complimentary CRM functionality?", answer: "While Monday.com provides specialized CRM packages, these aren\u2019t offered at no cost. Nevertheless, their \u2018Free Forever\u2019 option remains accessible through standard work management subscriptions." },
      { question: "What business functions does monday CRM support?", answer: "monday CRM provides comprehensive oversight of your sales funnel, contact database management, streamlined post-purchase workflows, and sales enablement tools, while delivering executive-level visibility across operations." },
      { question: "How does monday.com compare to Salesforce?", answer: "monday.com and Salesforce serve different market segments with distinct capabilities. Salesforce operates as an enterprise-grade CRM solution for large corporations, whereas monday.com excels through its intuitive interface, adaptability, and implementation simplicity, positioning it perfectly for SMBs." },
      { question: "How does monday.com compare to Hubspot?", answer: "Hubspot is a great tool for Marketing teams, but it lacks in CRM and Project Management capabilities. We have also found from our clients who have switched over to monday.com with our services that they saved on technical administration costs with monday.com due to the cost to develop on Hubspot." },
      { question: "How does monday.com compare to Zoho?", answer: "Zoho is a cheaper CRM alternative, making it great for teams who are looking for a basic CRM that they don\u2019t plan on changing as their business evolves. Another key factor that pushed our clients to migrate off of Zoho CRM to monday CRM is due to Zoho\u2019s limited support." },
      { question: "How effective is monday.com as a customer relationship management platform?", answer: "monday.com serves as an excellent CRM solution, especially for organizations prioritizing adaptability, customization capabilities, and user-friendly operation." },
      { question: "What are the benefits of using monday.com as a CRM?", answer: "Key benefits include: Centralized lead and customer data, Automated task and follow-up management, Custom dashboards for real-time performance tracking, Seamless integrations with popular tools like Gmail, Outlook, Slack, and QuickBooks." },
      { question: "Can monday.com integrate with other tools and CRMs?", answer: "Yes, monday.com integrates with email, project management, marketing, and financial tools, including Gmail & Outlook, Slack & Microsoft Teams, HubSpot, Salesforce, Mailchimp, QuickBooks & Xero. Custom integrations via API or Zapier are also available." },
    ],
  },
  {
    label: "Expert Consultant Guide",
    items: [
      { question: "What\u2019s the best monday.com CRM implementation strategy?", answer: "When implementing monday.com CRM, we recommend starting with a carefully planned phased rollout guided by certified monday.com consultants. We typically start by implementing proven sales workflows with powerful automation features, scaling department by department." },
      { question: "How do monday.com Partners handle user adoption?", answer: "The secret to successful user adoption lies in demonstrating immediate wins that matter to your team. We\u2019ve developed change management best practices that ensure smooth transitions, especially when implementing CRM solutions tailored to your existing sales processes." },
      { question: "What monday.com training do Partners recommend?", answer: "Our training approach combines consultant-led CRM sessions with practical, hands-on learning. We provide role-specific coaching and support, ensuring everyone from sales reps to administrators gets exactly what they need." },
      { question: "How do monday.com consultants handle data migration?", answer: "Data migration is a crucial step that requires careful planning and execution. Our Partner team provides expert guidance throughout the CRM data transfer process, using proven templates that ensure data integrity." },
      { question: "What success metrics do monday.com Partners track?", answer: "We focus on meaningful metrics that demonstrate real business impact. This includes monitoring CRM adoption rates, measuring improvements in sales efficiency, and tracking concrete ROI metrics." },
    ],
  },
  {
    label: "General Questions",
    items: [
      { question: "Do big companies use monday.com?", answer: "Yes, many large companies use monday.com for their work management needs. monday.com claims that over 180,000 companies globally use the platform, including well-known brands like Nissan, Elal, and Zippo, Canva, Coca-Cola, Wix, and Uber." },
      { question: "Why is monday.com so popular?", answer: "Monday.com\u2019s popularity stems from its user-friendly interface, visual appeal, and powerful features that cater to various work management needs. It\u2019s known for its flexibility, customizable workflows, and ability to integrate with numerous third-party apps." },
      { question: "What companies use monday.com?", answer: "Given monday\u2019s adaptability, businesses spanning diverse sectors leverage monday.com for project coordination, team collaboration, and numerous operational workflows. Notable clients include RayWhite, Landcom, and Government of Western Australia. According to monday.com, more than 180,000 organizations globally depend on their platform." },
    ],
  },
]

const FALLBACK_METHODOLOGY_STEPS: MethodologyStep[] = [
  {
    number: "01",
    title: "Discovery and Process Analysis \ud83c\udfaf",
    description:
      "The first step in any monday.com implementation package is understanding your current workflows. During the discovery processes phase, we help businesses analyse their:",
    bullets: [
      "Team structures and responsibilities",
      "Existing project management or task-tracking processes",
      "Automation opportunities and reporting needs",
    ],
    extraText:
      "This phase allows you to identify which boards, dashboards, and integrations are essential to streamline operations.",
  },
  {
    number: "02",
    title: "Platform Configuration & Customisation \u2699\ufe0f",
    description:
      "Based on the discovery findings, we configure monday.com to match your workflows. This includes setting up boards, automations, dashboards, and integrations.",
  },
  {
    number: "03",
    title: "Data Migration & Integration \ud83d\udd04",
    description:
      "We handle migrating your existing data and connecting monday.com with your current tech stack \u2014 email, CRM, accounting, project tools, and more.",
  },
  {
    number: "04",
    title: "Training & Onboarding \ud83d\udc65",
    description:
      "Every team member gets hands-on training tailored to their role. We make sure your team is confident using the platform from day one.",
  },
  {
    number: "05",
    title: "Go-Live & Ongoing Support \ud83d\ude80",
    description:
      "We monitor the rollout, gather feedback, and fine-tune the setup. Post-launch support ensures you get maximum value from your investment.",
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function imgSrc(image: SanityImage): string | null {
  if (!image || !image.asset) return null
  try {
    return urlFor(image).url()
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ImplementationPackagesContent({
  data,
  carouselLogos,
  caseStudies,
  faqTabs: faqTabsOverride,
}: Props) {
  // Resolve all fields with fallbacks
  const heroHeadingPart1 = data?.heroHeadingPart1 ?? "monday.com "
  const heroHeadingAccent = data?.heroHeadingAccent ?? "Expert Consulting"
  const heroHeadingPart2 =
    data?.heroHeadingPart2 ?? " & Implementation Packages"
  const heroImageSrc =
    imgSrc(data?.heroImage) ?? "/images/implementation-packages-hero.png"
  const heroCertBadgeSrc =
    imgSrc(data?.heroCertificationBadge) ?? "/images/badge-certifications.png"
  type ResolvedPartnerBadge = { _key: string | undefined; src: string; alt: string }
  const heroPartnerBadges: ResolvedPartnerBadge[] = (data?.heroPartnerBadges ?? [])
    .map((b, i): ResolvedPartnerBadge | null => {
      const src = imgSrc(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Partner badge ${i + 1}` }
    })
    .filter((x): x is ResolvedPartnerBadge => x !== null)
  const heroMondayPartnersImageSrc =
    imgSrc(data?.heroMondayPartnersImage) ?? "/images/monday-partners.avif"
  const heroPrimaryCtaLabel =
    data?.heroPrimaryCtaLabel ?? "\ud83d\ude80 Book a Consultation"
  const heroPrimaryCtaUrl = data?.heroPrimaryCtaUrl ?? CALENDLY_URL
  const heroSecondaryCtaLabel =
    data?.heroSecondaryCtaLabel ?? "\u25b6\ufe0f Get Started with monday.com"
  const heroSecondaryCtaUrl = data?.heroSecondaryCtaUrl ?? CALENDLY_URL

  const logoCloudHeadingPart1 =
    data?.logoCloudHeadingPart1 ?? "Clients who have used our "
  const logoCloudHeadingAccent =
    data?.logoCloudHeadingAccent ?? "monday.com expert consulting services"

  const videoEmbedUrl =
    data?.videoEmbedUrl ?? "https://www.youtube.com/embed/7vtrtlfC1Zg"
  const videoTitle =
    data?.videoTitle ??
    "monday CRM Success Story - Star Aviation | Powered by Fruition"

  const servicesIntroHeadingPart1 = data?.servicesIntroHeadingPart1 ?? "As official "
  const servicesIntroHeadingAccent = data?.servicesIntroHeadingAccent ?? "monday.com Partners"
  const servicesIntroHeadingPart2 = data?.servicesIntroHeadingPart2 ?? ", let us help you get set up right, the first time."
  const servicesIntroImageSrc = imgSrc(data?.servicesIntroImage) ?? "/images/monday-partners.avif"
  const featureCards: FeatureCard[] = data?.featureCards?.length
    ? data.featureCards
    : [
        {
          emoji: "\ud83e\udd1d",
          title: "Flexible Support Options with our monday.com Consultants",
          description:
            "We cater to all support needs. Some of our clients need a quick hand to get started with best practices, others need an end to end solution and adoption plan. Your unique requirements can be achieved with the below three implementation packages.",
        },
        {
          emoji: "\ud83e\uddd1\u200d\ud83d\udcbb",
          title: "Get monday.com Expert Guidance in your time zone",
          description:
            "We cater to all support needs. Some of our clients need a quick hand to get started with best practices, others need an end to end solution and adoption plan. Your unique requirements can be achieved with the below three implementation packages.",
        },
      ]

  const socialProofBannerHtml = data?.socialProofBannerHtml
  const socialProofCtaLabel =
    data?.socialProofCtaLabel ?? "\ud83d\ude80 Schedule a Meeting"
  const socialProofCtaUrl = data?.socialProofCtaUrl ?? CALENDLY_URL

  const pricingHeading = data?.pricingHeading ?? "Pricing Packages"
  const packageTiers: PackageTier[] = data?.packageTiers?.length
    ? data.packageTiers
    : FALLBACK_PACKAGE_TIERS

  const tabKeys = packageTiers.map((t) => t.tabKey ?? "")
  const [activeTab, setActiveTab] = useState<string>(tabKeys[0] ?? "Guided")
  const pkg =
    packageTiers.find((t) => t.tabKey === activeTab) ?? packageTiers[0]

  const testimonialsHeading =
    data?.testimonialsHeading ?? "What our customers say about us \ud83d\ude4c"
  const testimonialsCtaLabel =
    data?.testimonialsCtaLabel ?? "\ud83d\ude80 Start Your Transformation"
  const testimonialsCtaUrl = data?.testimonialsCtaUrl ?? CALENDLY_URL
  const statCardValue = data?.statCardValue ?? "500+"
  const statCardSubtitle =
    data?.statCardSubtitle ??
    "have maximised their workflows with our monday.com expert support"
  const statCardCtaLabel = data?.statCardCtaLabel ?? "Read our case studies"
  const statCardCtaUrl = data?.statCardCtaUrl ?? "/customer-testimonials"

  const calendlyHeading =
    data?.calendlyHeading ??
    "Schedule A 30-Min Consultation With One of Our monday.com Consultants"
  const calendlyUrl = data?.calendlyUrl ?? CALENDLY_URL

  const faqHeading = data?.faqHeading ?? "Frequently asked questions"
  const faqTabs: FaqTab[] = faqTabsOverride?.length
    ? faqTabsOverride
    : data?.faqTabs?.length
      ? data.faqTabs
      : FALLBACK_FAQ_TABS

  const [activeFaqTab, setActiveFaqTab] = useState<string>(
    faqTabs[0]?.label ?? ""
  )
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const activeFaqTabObj =
    faqTabs.find((t) => t.label === activeFaqTab) ?? faqTabs[0]
  const activeFaqItems: FaqPair[] = activeFaqTabObj?.items ?? []

  const discoverBadgeSrc =
    imgSrc(data?.discoverBadge) ?? "/images/badge-certifications.png"
  const discoverHeading =
    data?.discoverHeading ?? "Discover how much monday.com can do for your team."
  const discoverPrimaryCtaLabel =
    data?.discoverPrimaryCtaLabel ?? "\ud83d\ude80 Schedule a Consultation"
  const discoverPrimaryCtaUrl = data?.discoverPrimaryCtaUrl ?? CALENDLY_URL
  const discoverSecondaryCtaLabel =
    data?.discoverSecondaryCtaLabel ??
    "\u25b6\ufe0f Get Started with monday.com"
  const discoverSecondaryCtaUrl = data?.discoverSecondaryCtaUrl ?? CALENDLY_URL

  const methodologyHeading =
    data?.methodologyHeading ?? "monday.com Implementation Methodology:"
  const methodologyHeadingAccent =
    data?.methodologyHeadingAccent ?? "A Step-by-Step Guide"
  const methodologySteps: MethodologyStep[] = data?.methodologySteps?.length
    ? data.methodologySteps
    : FALLBACK_METHODOLOGY_STEPS

  const securityBadgeSrc =
    imgSrc(data?.securityBadge) ?? "/images/badge-security.png"

  /* -------- Logo carousel (from siteSettings.carouselLogos) -------- */
  const resolvedCarouselLogos: { src: string; alt: string }[] =
    carouselLogos && carouselLogos.length > 0
      ? carouselLogos
          .map((l, i) => {
            const src = imgSrc(l.image)
            if (!src) return null
            return { src, alt: l.alt ?? `Client ${i + 1}` }
          })
          .filter((x): x is { src: string; alt: string } => x !== null)
      : FALLBACK_CAROUSEL_LOGOS

  // Duplicate logos for seamless marquee loop
  const duplicatedLogos = [...resolvedCarouselLogos, ...resolvedCarouselLogos]

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
          {heroPartnerBadges.length > 0 && (
            <div className="flex items-center" style={{ gap: 22 }}>
              {heroPartnerBadges.map((badge) => (
                <Image
                  key={badge._key ?? badge.src}
                  src={badge.src}
                  alt={badge.alt}
                  width={120}
                  height={44}
                  className="h-[44px] w-auto rounded-[5px]"
                />
              ))}
            </div>
          )}

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
            <span className="text-black">{heroHeadingPart1}</span>
            <span style={{ color: "#8015e8" }}>{heroHeadingAccent}</span>
            <span className="text-black">{heroHeadingPart2}</span>
          </h1>

          {/* Monday Partners image */}
          {heroMondayPartnersImageSrc && (
            <div style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroMondayPartnersImageSrc}
                alt="Monday.com Partners"
                width={924}
                height={0}
                className="w-full max-w-[924px] h-auto object-contain"
              />
            </div>
          )}

          {/* Certification banner (hidden) */}
          {/* <div style={{ marginTop: 40 }}>
            <img
              src={heroCertBadgeSrc}
              alt="Certifications"
              width={534}
              height={133}
              className="h-[133px] w-[534px] object-contain"
            />
          </div> */}

          {/* Dual CTA */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 20, marginTop: 40, width: 680 }}
          >
            <Link
              href={heroPrimaryCtaUrl}
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
              {heroPrimaryCtaLabel}
            </Link>
            <Link
              href={heroSecondaryCtaUrl}
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 330,
                height: 53,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {heroSecondaryCtaLabel}
            </Link>
          </div>

          {/* Hero image */}
          <div style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageSrc}
              alt="monday.com dashboards — project planning and team OKRs"
              width={1042}
              height={312}
              className="rounded-card object-cover"
              style={{ width: 1042, height: 312 }}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 -- Logo Cloud with Marquee Scroll                  */}
      {/* ============================================================ */}
      <section className="bg-white py-[80px] px-4">
        <div className="flex flex-col gap-[35px] items-center w-full max-w-[1348px] mx-auto">
          {/* Heading */}
          <p className="text-[28px] font-medium leading-[39.2px] text-center">
            <span className="text-black">{logoCloudHeadingPart1}</span>
            <span className="text-[#8015e8]">{logoCloudHeadingAccent}</span>
          </p>

          {/* Horizontal marquee logo strip */}
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
              src={videoEmbedUrl}
              title={videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 -- Services Content (bg-[#f0ecfe])                 */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f0ecfe" }}>
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          {/* 4a: Intro heading */}
          <div
            className="text-center"
            style={{
              fontSize: 40,
              fontWeight: 400,
              lineHeight: "56px",
              maxWidth: 924,
            }}
          >
            <p>
              <span className="text-black">{servicesIntroHeadingPart1}</span>
              <span style={{ color: "#8015e8" }}>{servicesIntroHeadingAccent}</span>
              <span className="text-black">{servicesIntroHeadingPart2}</span>
            </p>
          </div>

          {/* Services intro image */}
          <div style={{ marginTop: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={servicesIntroImageSrc}
              alt="Monday.com Partners"
              width={924}
              height={0}
              className="w-full max-w-[924px] h-auto object-contain"
            />
          </div>

          {/* 4b: Two feature cards */}
          <div
            className="flex justify-center"
            style={{ gap: 28, marginTop: 60, maxWidth: 1200, width: "100%" }}
          >
            {featureCards.map((card, i) => (
              <div
                key={card._key ?? i}
                className="flex-1"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e8e6e6",
                  borderRadius: "var(--radius-card)",
                  padding: 28,
                }}
              >
                <div className="flex items-start" style={{ gap: 29 }}>
                  <span style={{ fontSize: 60 }}>{card.emoji}</span>
                  <h3
                    style={{
                      fontSize: 24,
                      fontWeight: 500,
                      color: "#2b074d",
                    }}
                  >
                    {card.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "22.4px",
                    color: "black",
                    marginTop: 20,
                  }}
                >
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* 4c: Social proof banner */}
          <div
            className="flex items-center"
            style={{
              marginTop: 60,
              background:
                "linear-gradient(98.14deg, rgb(28, 2, 76) 0%, rgb(125, 20, 227) 100.01%)",
              borderRadius: "var(--radius-card)",
              paddingLeft: 27,
              paddingRight: 44,
              paddingTop: 28,
              paddingBottom: 28,
              gap: 24,
              maxWidth: 1200,
              width: "100%",
            }}
          >
            <div
              className="flex-1"
              style={{ fontSize: 20, fontWeight: 500, color: "white" }}
            >
              {socialProofBannerHtml ? (
                <PortableText value={socialProofBannerHtml} />
              ) : (
                <p>
                  Over{" "}
                  <span style={{ color: "#d2acf7" }}>
                    500+ small-medium sized enterprises
                  </span>{" "}
                  choose Fruition&rsquo;s monday.com consultants for our clear
                  communication, timely delivery, and transparency on costs.
                </p>
              )}
            </div>
            <Link
              href={socialProofCtaUrl}
              className="flex shrink-0 items-center justify-center font-bold text-white"
              style={{
                width: 216,
                height: 53,
                border: "1px solid white",
                borderRadius: 100,
                fontSize: 16,
              }}
            >
              {socialProofCtaLabel}
            </Link>
          </div>

          {/* 4d: Pricing Packages */}
          <div
            className="flex flex-col items-center"
            style={{ marginTop: 60 }}
          >
            <h2
              className="text-section-h2 text-center text-black"
            >
              {pricingHeading}
            </h2>

            {/* Tabs */}
            <div
              className="flex items-center"
              style={{ gap: 12, marginTop: 28 }}
            >
              {tabKeys.map((tab) => {
                const isActive = tab === activeTab
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
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
                            background:
                              "linear-gradient(to right, #8015e8, #ba83f0)",
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

            {/* Package card */}
            <div
              style={{
                width: 816,
                backgroundColor: "white",
                border: "1px solid #e8e6e6",
                borderRadius: "var(--radius-card)",
                padding: 28,
                marginTop: 28,
              }}
            >
              {/* Header row */}
              <div
                className="flex items-center"
                style={{ gap: 16 }}
              >
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: "#2b074d",
                    whiteSpace: "nowrap",
                  }}
                >
                  {pkg?.name}
                </h3>
                <span
                  className="flex items-center justify-center shrink-0"
                  style={{
                    border: "1px solid #8015e8",
                    borderRadius: 12,
                    paddingLeft: 25,
                    paddingRight: 25,
                    paddingTop: 6,
                    paddingBottom: 6,
                    color: "#8015e8",
                    fontSize: 16,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {pkg?.badge}
                </span>
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "22.4px",
                  color: "black",
                  marginTop: 24,
                }}
              >
                {pkg?.description?.split("\n").map((line, i) => (
                  <p key={i} style={{ marginTop: i > 0 ? 16 : 0 }}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Support label */}
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  color: "#8015e8",
                  marginTop: 24,
                }}
              >
                {pkg?.supportLabel ?? "Support Included:"}
              </p>

              {/* Features grid */}
              <div
                className="grid grid-cols-3"
                style={{ gap: 24, marginTop: 16 }}
              >
                {(pkg?.features ?? []).map((feat, fi) => (
                  <div
                    key={feat._key ?? `${feat.label}-${fi}`}
                    className="flex items-center"
                    style={{ gap: 12 }}
                  >
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 600,
                        color: "#7a14e1",
                      }}
                    >
                      {feat.emoji}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "black",
                      }}
                    >
                      {feat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 -- Testimonials (shared carousel component)        */}
      {/* ============================================================ */}
      <TestimonialsGrid
        heading={testimonialsHeading}
        ctaLabel={testimonialsCtaLabel}
        ctaUrl={testimonialsCtaUrl}
        statCardValue={statCardValue}
        statCardSubtitle={statCardSubtitle}
        statCardCtaLabel={statCardCtaLabel}
        statCardCtaUrl={statCardCtaUrl}
        caseStudies={caseStudies as import("@/components/sections/types").CaseStudy[]}
      />

      {/* ============================================================ */}
      {/* SECTION 6 -- Calendly Booking                                */}
      {/* ============================================================ */}
      <section className="bg-[#f7f7f7]" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div
          className="mx-auto flex flex-col items-center"
          style={{ maxWidth: 1200 }}
        >
          <h2
            className="text-section-h2 text-center text-black"
            style={{ maxWidth: 800 }}
          >
            {calendlyHeading}
          </h2>
          <div
            className="w-full rounded-card overflow-hidden"
            style={{ marginTop: 40, height: 700 }}
          >
            <iframe
              src={calendlyUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Schedule a consultation"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 -- FAQ                                             */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <div className="mx-auto flex flex-col" style={{ width: 959, gap: 24 }}>
          {/* Heading */}
          <h2 className="text-section-h2" style={{ color: "var(--purple-primary)" }}>
            {faqHeading}
          </h2>

          {/* Tab navigation bar — underline style matching Figma */}
          <div className="flex items-start overflow-auto" style={{ width: 916, height: 52 }}>
            {faqTabs.map((tab) => {
              const label = tab.label ?? ""
              return (
                <button
                  key={tab._key ?? label}
                  onClick={() => {
                    setActiveFaqTab(label)
                    setOpenFaqIndex(0)
                  }}
                  className="h-full shrink-0 relative"
                  style={{
                    paddingTop: 14,
                    paddingBottom: 17,
                    paddingLeft: 27.469,
                    paddingRight: 27.469,
                    borderBottom:
                      activeFaqTab === label
                        ? '3px solid #8e5cbf'
                        : '3px solid transparent',
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      color: activeFaqTab === label ? '#8e5cbf' : 'black',
                      textAlign: 'center',
                    }}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* FAQ items for active tab */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            {activeFaqItems.map((item, i) => (
              <div key={item._key ?? i} style={{ paddingTop: i === 0 ? 20 : 24 }}>
                {/* Question row */}
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
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                    >
                      <path
                        d="M8 12L15 19L22 12"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>

                {/* Answer (expanded) */}
                {openFaqIndex === i && (
                  <div
                    style={{
                      paddingBottom: 16,
                      paddingTop: 31,
                      fontSize: 16,
                      lineHeight: '24px',
                      color: 'black',
                    }}
                  >
                    {item.answer}
                  </div>
                )}

                {/* Bottom border */}
                <div
                  style={{
                    borderBottom: '1px solid #2b074d',
                    marginTop: openFaqIndex === i ? 0 : 36,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8 -- Discover CTA                                    */}
      {/* ============================================================ */}
      <section
        style={{ backgroundColor: "#ece6fc", paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="mx-auto flex flex-col items-center">
          {/* Certifications badge */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={discoverBadgeSrc}
            alt="Certifications"
            width={325}
            height={73}
            className="h-[73px] w-[325px] object-contain"
          />

          {/* Heading */}
          <h2
            className="text-section-h2 text-center text-black"
            style={{ width: 694, marginTop: 28 }}
          >
            {discoverHeading}
          </h2>

          {/* Dual CTA buttons */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 24, marginTop: 32, width: 694 }}
          >
            <Link
              href={discoverPrimaryCtaUrl}
              className="flex flex-1 items-center justify-center font-bold"
              style={{
                height: 63,
                borderRadius: 100,
                backgroundColor: "white",
                color: "#8015e8",
                fontSize: 16,
              }}
            >
              {discoverPrimaryCtaLabel}
            </Link>
            <Link
              href={discoverSecondaryCtaUrl}
              className="flex flex-1 items-center justify-center font-bold text-white"
              style={{
                height: 63,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {discoverSecondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9 -- Implementation Methodology                     */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto flex flex-col items-center" style={{ gap: 40, width: 959 }}>
          {/* Heading */}
          <h2 className="text-section-h2 text-center">
            <span style={{ color: 'black' }}>{methodologyHeading}</span>
            <br />
            <span style={{ color: 'var(--purple-primary)' }}>{methodologyHeadingAccent}</span>
          </h2>

          {/* Steps grid — 2 columns, number above content in each cell */}
          {/* Row 1: steps 01 + 02 */}
          <div className="flex items-start w-full">
            {methodologySteps.slice(0, 2).map((step, si) => (
              <div
                key={step._key ?? step.number ?? si}
                className="flex flex-col items-start shrink-0"
                style={{ width: 417, paddingBottom: 48 }}
              >
                {/* Number */}
                <div style={{ width: 75, minHeight: 86, paddingTop: 6 }}>
                  <p
                    className="font-extralight text-center"
                    style={{ fontSize: 48, color: '#8015e8', lineHeight: 'normal' }}
                  >
                    {step.number}
                  </p>
                </div>
                {/* Content */}
                <div>
                  <p
                    className="font-bold"
                    style={{ fontSize: 14, color: '#2b074d', lineHeight: '22.4px' }}
                  >
                    {step.title}
                  </p>
                  <p style={{ fontSize: 14, color: '#2b074d', lineHeight: '19.6px', marginTop: 4 }}>
                    {step.description}
                  </p>
                  {step.bullets && step.bullets.length > 0 && (
                    <ul
                      className="list-disc"
                      style={{
                        paddingLeft: 18,
                        paddingTop: 20,
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                      }}
                    >
                      {step.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {step.extraText && (
                    <p
                      style={{
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                        marginTop: 20,
                      }}
                    >
                      {step.extraText}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: steps 03 + 04 */}
          <div className="flex items-start w-full">
            {methodologySteps.slice(2, 4).map((step, si) => (
              <div
                key={step._key ?? step.number ?? si}
                className="flex flex-col items-start shrink-0"
                style={{ width: 417, paddingBottom: 48 }}
              >
                <div style={{ width: 75, minHeight: 86, paddingTop: 6 }}>
                  <p
                    className="font-extralight text-center"
                    style={{ fontSize: 48, color: '#8015e8', lineHeight: 'normal' }}
                  >
                    {step.number}
                  </p>
                </div>
                <div>
                  <p
                    className="font-bold"
                    style={{ fontSize: 14, color: '#2b074d', lineHeight: '22.4px' }}
                  >
                    {step.title}
                  </p>
                  <p style={{ fontSize: 14, color: '#2b074d', lineHeight: '19.6px', marginTop: 4 }}>
                    {step.description}
                  </p>
                  {step.bullets && step.bullets.length > 0 && (
                    <ul
                      className="list-disc"
                      style={{
                        paddingLeft: 18,
                        paddingTop: 20,
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                      }}
                    >
                      {step.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {step.extraText && (
                    <p
                      style={{
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                        marginTop: 20,
                      }}
                    >
                      {step.extraText}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: step 05+ (single-row) */}
          <div className="flex items-start w-full">
            {methodologySteps.slice(4).map((step, si) => (
              <div
                key={step._key ?? step.number ?? si}
                className="flex flex-col items-start shrink-0"
                style={{ width: 417, paddingBottom: 48 }}
              >
                <div style={{ width: 75, minHeight: 86, paddingTop: 6 }}>
                  <p
                    className="font-extralight text-center"
                    style={{ fontSize: 48, color: '#8015e8', lineHeight: 'normal' }}
                  >
                    {step.number}
                  </p>
                </div>
                <div>
                  <p
                    className="font-bold"
                    style={{ fontSize: 14, color: '#2b074d', lineHeight: '22.4px' }}
                  >
                    {step.title}
                  </p>
                  <p style={{ fontSize: 14, color: '#2b074d', lineHeight: '19.6px', marginTop: 4 }}>
                    {step.description}
                  </p>
                  {step.bullets && step.bullets.length > 0 && (
                    <ul
                      className="list-disc"
                      style={{
                        paddingLeft: 18,
                        paddingTop: 20,
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                      }}
                    >
                      {step.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {step.extraText && (
                    <p
                      style={{
                        fontSize: 14,
                        color: '#2b074d',
                        lineHeight: '19.6px',
                        marginTop: 20,
                      }}
                    >
                      {step.extraText}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 10 -- Security Badge                                 */}
      {/* ============================================================ */}
      <section className="bg-white" style={{ paddingBottom: 80 }}>
        <div className="mx-auto max-w-[976px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={securityBadgeSrc}
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
