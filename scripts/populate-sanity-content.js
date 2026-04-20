/**
 * Populate Sanity Studio with content that was previously hardcoded in the codebase.
 * Run: node scripts/populate-sanity-content.js
 */
const { createClient } = require("@sanity/client");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
  projectId: "bt6nb58h",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function patchDoc(type, slug, fields) {
  const doc = await client.fetch(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type, slug }
  );
  if (!doc) {
    console.log(`  SKIP: ${type}/${slug} not found`);
    return;
  }
  await client.patch(doc._id).set(fields).commit();
  console.log(`  OK: ${type}/${slug}`);
}

async function patchSingleton(type, fields) {
  const doc = await client.fetch(`*[_type == $type][0]{ _id }`, { type });
  if (!doc) {
    console.log(`  SKIP: ${type} singleton not found`);
    return;
  }
  await client.patch(doc._id).set(fields).commit();
  console.log(`  OK: ${type}`);
}

async function run() {
  console.log("=== Populating Industry Pages ===\n");

  // ── Construction ──
  console.log("Construction:");
  await patchDoc("industryPage", "monday-for-construction", {
    logoCloudHeadingPart1:
      "With monday.com CRM and Work Management as your Construction software, your teams will experience simplified and streamlined communication with mobile access and improved automated workflow efficiency.",
    logoCloudHeadingAccent: "",
    primaryCtaLabel: "\u{1F680} Book a Consultation",
    secondaryCtaLabel: "\u25B6\uFE0F Get Started with monday.com",
    heroLocalVideoSrc: "/videos/construction-hero.mp4",
    hideDiscoverSection: true,
    hideJoinStatsSection: true,
    hideTestimonialBanner: true,
    hideSecurityBadgeSection: true,
    // Lifecycle items (from ConstructionExtras)
    featureListHeading: "The Construction ",
    featureListHeadingAccent: "Project Lifecycle",
    featureListTheme: "dark",
    featureListColumns: 2,
    featureListItems: [
      { _key: "lc01", number: "01", title: "Bidding & Pre-Construction \u{1F3AF}", description: "Centralise bid documents and RFPs in collaborative workspaces. Track deadlines, assign team members to proposals, and maintain databases of past bids with automated notifications." },
      { _key: "lc02", number: "02", title: "Planning & Design \u{1F4CB}", description: "Transform schedules into visual timelines with dependencies and critical path tracking. Coordinate stakeholders with shared boards that automatically update on design changes and milestone achievements." },
      { _key: "lc03", number: "03", title: "Execution & Construction \u{1F3D7}\uFE0F", description: "Monitor progress, track labor hours, and manage deliveries through mobile dashboards. Field teams update tasks and upload photos while managers maintain oversight through automated progress and budget reports." },
      { _key: "lc04", number: "04", title: "Handover & Closeout \u{1F4C1}", description: "Organise punch lists, warranties, and inspections in structured workflows. Track outstanding items and coordinate final walkthroughs with automated reminders for efficient project closeout." },
      { _key: "lc05", number: "05", title: "Post-Construction Support \u{1F527}", description: "Maintain client relationships with warranty tracking and maintenance scheduling. Historical project data improves future estimates and business processes." },
    ],
    // Case studies (from ConstructionExtras)
    caseStudyCards: [
      { _key: "cs1", title: "HOLT CAT", description: "monday.com has given us the visibility we need to get everyone on the same page and keep track of all the moving parts.", personName: "Jason Doan", personRole: "VP of Heavy Rental & Sales, HOLT CAT" },
      { _key: "cs2", title: "Falkbuilt", description: "The monday.com mobile app gives our technicians instant access to installation schedules, material lists, and quality checklists right on-site.", personName: "Allie Swindlehurst", personRole: "Operations Manager, Falkbuilt" },
    ],
  });

  // ── Government ──
  console.log("Government:");
  await patchDoc("industryPage", "monday-for-government", {
    heroEyebrow: "monday.com Implementation Partner",
    heroHeading: "monday.com for Government",
    heroSubheading: "Streamline Government Operations with our monday.com Consultants",
    heroBody: "Empower your agency with modern, secure, and flexible project management tools that improve efficiency, collaboration, and transparency across the public sector.",
    primaryCtaLabel: "Book a Consultation",
    secondaryCtaLabel: "Get Started with monday.com",
    hideDiscoverSection: true,
    hideJoinStatsSection: true,
    hideTestimonialBanner: true,
    hideSecurityBadgeSection: true,
  });

  // ── Marketing ──
  console.log("Marketing:");
  await patchDoc("industryPage", "monday-for-marketing", {
    logoCloudHeadingPart1:
      "Having worked extensively with marketing and creative teams, we understand the critical challenges of managing campaign workflows, creative asset production, and delivering consistent brand experiences across all channels and touchpoints.",
    logoCloudHeadingAccent: "",
    logoCloudDescription:
      "We have helped transform 500+ businesses with monday.com. From lead to project delivered and everything between, our monday.com consultants have you covered.",
    primaryCtaLabel: "\u{1F680} Book a Consultation",
    secondaryCtaLabel: "\u25B6\uFE0F Get Started with monday.com",
    hideHeroSubheading: true,
    hideDiscoverSection: true,
    hideJoinStatsSection: true,
    hideTestimonialBanner: true,
    hideSecurityBadgeSection: true,
    bottomVideoUrl: "https://www.youtube.com/embed/R0bR8jn-n4Q",
    bottomVideoTitle: "monday.com for Marketing",
  });

  // ── Professional Services ──
  console.log("Professional Services:");
  await patchDoc("industryPage", "monday-for-professional-services", {
    logoCloudHeadingPart1:
      "Being a service based business ourselves we understand the key challenges of managing resource capacity, profitability and project delivery excellence.",
    logoCloudHeadingAccent: "",
    logoCloudDescription:
      "We have helped transform 500+ businesses with our monday.com professional services solution. From lead to project delivered and everything between, our monday.com consultants have you covered.",
    primaryCtaLabel: "\u{1F680} Book a Consultation",
    secondaryCtaLabel: "\u25B6\uFE0F Get Started with monday.com",
    hideDiscoverSection: true,
    hideJoinStatsSection: true,
    hideTestimonialBanner: true,
    hideSecurityBadgeSection: true,
    bottomVideoUrl: "https://www.youtube.com/embed/iFCDAsz3gGc",
    bottomVideoTitle: "monday.com for Professional Services",
  });

  // ── Real Estate ──
  console.log("Real Estate:");
  await patchDoc("industryPage", "monday-for-real-estate", {
    logoCloudHeadingPart1:
      "Having worked extensively with real estate businesses, we understand the critical challenges of managing property portfolios, client relationships, and delivering consistent service across all touchpoints.",
    logoCloudHeadingAccent: "",
    primaryCtaLabel: "\u{1F680} Book a Consultation",
    secondaryCtaLabel: "\u25B6\uFE0F Get Started with monday.com",
    comparisonHeading: "Local monday.com consultants for Real Estate in Australia, United States, and United Kingdom",
    hideHeroSubheading: true,
    hideDiscoverSection: true,
    hideJoinStatsSection: true,
    hideTestimonialBanner: true,
    hideSecurityBadgeSection: true,
  });

  // ── Retail ──
  console.log("Retail:");
  await patchDoc("industryPage", "monday-for-retail", {
    logoCloudHeadingPart1:
      "Having worked extensively with retail businesses, we understand the critical challenges of managing store operations, supply chain efficiency, and delivering consistent customer experiences across all touchpoints.",
    logoCloudHeadingAccent: "",
    primaryCtaLabel: "\u{1F680} Book a Consultation",
    secondaryCtaLabel: "\u25B6\uFE0F Get Started with monday.com",
    hideHeroSubheading: true,
    hideDiscoverSection: true,
    hideJoinStatsSection: true,
    hideTestimonialBanner: true,
    hideSecurityBadgeSection: true,
  });

  // ── Manufacturing ──
  console.log("Manufacturing:");
  await patchDoc("industryPage", "monday-for-manufacturing", {
    hideDiscoverSection: true,
    hideJoinStatsSection: true,
    hideTestimonialBanner: true,
    hideSecurityBadgeSection: true,
  });

  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Populating Page Docs ===\n");

  // ── Customer Testimonials ──
  console.log("Customer Testimonials:");
  await patchDoc("page", "customer-testimonials", {
    seoTitle: "Case Studies | Fruition Services",
    seoDescription: "Real results from 500+ businesses. See how Fruition transformed operations with monday.com.",
    heroHeading: "Case Studies",
    heroSubheading: "A big part of our operation is ensuring we set up our clients for success through our specialized monday.com and AI expertise.",
    heroBody: "Become part of the growing community of companies across all industries that have optimised their workflows and boosted team performance with our proven guidance.",
    primaryCtaLabel: "\u{1F680} Get Started",
    primaryCtaUrl: "#case-studies",
    secondaryCtaLabel: "\u{1F4D1} Learn More",
    secondaryCtaUrl: "#case-studies",
    logoCloudHeadingPart1: "Clients who have used our ",
    logoCloudHeadingAccent: "monday.com expert consultants",
    calendlyHeading: "Schedule Your Personalised Demo With A monday.com Expert",
    calendlySubheading: "Schedule a demo with our monday.com implementation consultants to discover how monday.com can be customised for your business, and get a free 4-week extended trial to experience its full potential.",
    discoverHeading: "Discover how much monday.com can do for your team.",
    discoverPrimaryCtaLabel: "Schedule a Consultation",
    discoverSecondaryCtaLabel: "Get Started with monday.com",
  });

  // ── Careers ──
  console.log("Careers:");
  await patchDoc("page", "careers", {
    seoTitle: "Careers | Fruition Services",
    seoDescription: "Join Fruition \u2014 a Platinum monday.com partner building workflow, automation and integration solutions. 100% remote across 5 countries.",
    heroEyebrow: "Careers",
    heroHeading: "Build Solutions That Matter",
    heroSubheading: "At Fruition, we design solutions that simplify, scale and transform the way teams operate. As a Platinum monday.com partner, we specialize in tailoring workflows, automations, and integrations that turn software into a growth engine.",
    primaryCtaLabel: "\u{1F680} Join Us",
    primaryCtaUrl: "#application-form",
    secondaryCtaLabel: "See Where We Work",
    secondaryCtaUrl: "#remote",
    logoCloudHeadingPart1: "Trusted by 500+ companies worldwide to ",
    logoCloudHeadingAccent: "transform how they work",
    capabilitiesEyebrow: "BENEFITS",
    capabilitiesHeading: "Why Join ",
    capabilitiesHeadingAccent: "Fruition",
    capabilitiesSubheading: "Four reasons our consultants, developers and strategists choose to build their careers at Fruition.",
    partnerEcosystemEyebrow: "PARTNER ECOSYSTEM",
    partnerEcosystemHeading: "Built on a platform of ",
    partnerEcosystemHeadingAccent: "trusted partners",
    partnerEcosystemSubheading: "We partner with 7 industry-leading SaaS platforms to deliver best-in-class solutions tailored to our clients\u2019 needs.",
    secondaryCapabilitiesHeading: "What We're ",
    secondaryCapabilitiesHeadingAccent: "Looking For",
    secondaryCapabilitiesSubheading: "If you\u2019re passionate about helping businesses work better, we want to hear from you.",
    secondaryCapabilitiesCtaLabel: "\u{1F680} Join Us",
    secondaryCapabilitiesCtaUrl: "#application-form",
    secondaryCapabilitiesColumns: 3,
    secondaryCapabilitiesCards: [
      {
        _key: "ps",
        title: "Problem-Solvers with a Consultant Mindset",
        bullets: [
          { _key: "ps1", emoji: "\u{1F527}", text: "Translate complex business needs into elegant automated workflows" },
          { _key: "ps2", emoji: "\u{1F50D}", text: "Conduct thorough process audits to identify optimization opportunities" },
          { _key: "ps3", emoji: "\u2753", text: "Ask the right questions to uncover root causes, not just symptoms" },
        ],
      },
      {
        _key: "te",
        title: "Technical Experts with a Human Touch",
        bullets: [
          { _key: "te1", emoji: "\u2699\uFE0F", text: "Build seamless integrations that eliminate manual work" },
          { _key: "te2", emoji: "\u{1F3A8}", text: "Design custom workflows that teams actually want to use" },
          { _key: "te3", emoji: "\u{1F4CA}", text: "Leverage monday.com\u2019s flexibility to deliver scalable, cost-effective solutions" },
        ],
      },
      {
        _key: "gm",
        title: "Growth-Minded Professionals Who Love Learning",
        bullets: [
          { _key: "gm1", emoji: "\u{1F4C8}", text: "Stay ahead of monday.com feature releases and best practices" },
          { _key: "gm2", emoji: "\u{1F9EA}", text: "Experiment with new automation ideas to unlock efficiencies" },
          { _key: "gm3", emoji: "\u{1F331}", text: "Share knowledge with teams, empowering them to innovate and adapt" },
        ],
      },
    ],
    remoteTeamEyebrow: "\u{1F30D} FULLY REMOTE",
    remoteTeamHeading: "Work From Anywhere. ",
    remoteTeamHeadingAccent: "Our Team Is Global.",
    remoteTeamSubheading: "Fruition is a 100% remote company. Our consultants, developers, and strategists collaborate across five countries \u2014 meaning you can work from home, a caf\u00E9, or wherever you do your best thinking.",
    officeLocations: [
      { _key: "syd", flag: "\u{1F1E6}\u{1F1FA}", city: "Sydney", region: "Head Office", address: "64 York Street\nNSW 2000, Australia" },
      { _key: "nyc", flag: "\u{1F1FA}\u{1F1F8}", city: "New York", region: "North America", address: "205 W 37th St\nNew York, NY 10018" },
      { _key: "ldn", flag: "\u{1F1EC}\u{1F1E7}", city: "London", region: "EMEA", address: "Medius House, 2 Sheraton St\nLondon W1F 8BH" },
      { _key: "sgp", flag: "\u{1F1F8}\u{1F1EC}", city: "Singapore", region: "South-East Asia", address: "Serving clients\nacross the region" },
      { _key: "ind", flag: "\u{1F1EE}\u{1F1F3}", city: "India", region: "South Asia", address: "Serving clients\nacross the region" },
    ],
    remoteFeatures: [
      { _key: "rf1", emoji: "\u{1F3E0}", label: "Work from home (or anywhere)" },
      { _key: "rf2", emoji: "\u23F0", label: "Flexible hours" },
      { _key: "rf3", emoji: "\u{1F680}", label: "No relocation required" },
      { _key: "rf4", emoji: "\u{1F310}", label: "Global team collaboration" },
      { _key: "rf5", emoji: "\u{1F4C5}", label: "Async-friendly culture" },
    ],
    remoteTeamCtaLabel: "\u{1F680} Join Our Remote Team",
    remoteTeamCtaUrl: "#application-form",
    applicationFormHeading: "Apply Now",
    applicationFormEmbedUrl: "https://forms.monday.com/forms/embed/f607650db2b9c18ef8235817de24958a?r=apse2",
  });

  // ── Data Privacy ──
  console.log("Data Privacy:");
  await patchDoc("page", "data-privacy", {
    seoTitle: "Data Privacy Policy | Fruition Services",
    seoDescription: "Fruition Services data privacy policy. How we collect, use and protect your personal information.",
    heroHeading: "Data Privacy Policy",
  });

  // ── Terms and Conditions ──
  console.log("Terms and Conditions:");
  await patchDoc("page", "terms-and-conditions", {
    seoTitle: "Terms and Conditions | Fruition Services",
    seoDescription: "Fruition Services terms and conditions governing use of our services and website.",
    heroHeading: "Terms and Conditions",
  });

  // ── FAQs ──
  console.log("FAQs:");
  await patchDoc("page", "faqs", {
    seoTitle: "FAQs | Fruition Services",
    seoDescription: "Frequently asked questions about monday.com implementation, consulting, training and Fruition services.",
    heroEyebrow: "Help Center",
    primaryCtaLabel: "Book a consultation",
  });

  // ── Consulting Blog ──
  console.log("Consulting Blog:");
  await patchDoc("page", "consulting-blog", {
    seoTitle: "monday.com Blog | Fruition Services",
    seoDescription: "Expert insights on monday.com implementation, CRM, automation and integrations from certified Fruition consultants.",
    heroHeading: "Consulting Blog",
    heroSubheading: "Insights, guides, and updates from the Fruition team.",
  });

  // ── Fruition Team ──
  console.log("Fruition Team:");
  await patchDoc("page", "fruition-team", {
    seoTitle: "Meet The Fruition Team | Fruition Services",
    seoDescription: "Meet the Fruition team \u2014 certified consultants in monday.com, Atlassian, Make, n8n, and Hootsuite, across Australia, the UK, and the US.",
    heroHeading: "Meet The Fruition Team",
  });

  // ── About Us ──
  console.log("About Us:");
  await patchDoc("page", "about-us", {
    seoTitle: "About Us | Fruition Services",
    seoDescription: "Fruition is a Platinum monday.com consulting partner with 500+ implementations across Australia, UK and US.",
    hideFaqSection: true,
    hideTestimonialsSection: true,
    hideDiscoverSection: true,
    hideJoinStatsSection: true,
    hideTestimonialBanner: true,
    hideSecurityBadgeSection: true,
  });

  // ── Partnerships listing ──
  console.log("Partnerships:");
  await patchDoc("page", "partnerships", {
    seoTitle: "Partnerships | Fruition Services",
    seoDescription: "Fruition is a certified partner for monday.com, Make, n8n, ClickUp, HubSpot, Atlassian and more.",
    heroHeading: "Our Partnerships",
    heroSubheading: "Certified and trusted partnerships with the world's leading work management platforms.",
    primaryCtaLabel: "Book a Consultation",
  });

  // ── Monday Consulting Solutions listing ──
  console.log("Monday Consulting Solutions:");
  await patchDoc("page", "monday-consulting-solutions", {
    seoTitle: "monday.com Solutions | Fruition Services",
    seoDescription: "Purpose-built monday.com solutions for every team. Project management, CRM, HR, Finance and more.",
    heroHeading: "monday.com Solutions",
    heroSubheading: "Purpose-built solutions for every team. Powered by monday.com, configured by Fruition.",
    primaryCtaLabel: "Book a Consultation",
  });

  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Populating Site Settings ===\n");

  console.log("Site Settings:");
  await patchSingleton("siteSettings", {
    contactEmail: "contact@fruitionservices.io",
  });

  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Done! ===");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
