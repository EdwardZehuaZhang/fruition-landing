"use client"

import { FeatureNumberList } from "@/components/sections"

const LIFECYCLE_ITEMS = [
  {
    _key: "01",
    number: "01",
    title: "Bidding & Pre-Construction \u{1F3AF}",
    description:
      "Centralise bid documents and RFPs in collaborative workspaces. Track deadlines, assign team members to proposals, and maintain databases of past bids with automated notifications.",
  },
  {
    _key: "02",
    number: "02",
    title: "Planning & Design \u{1F4CB}",
    description:
      "Transform schedules into visual timelines with dependencies and critical path tracking. Coordinate stakeholders with shared boards that automatically update on design changes and milestone achievements.",
  },
  {
    _key: "03",
    number: "03",
    title: "Execution & Construction \u{1F3D7}\uFE0F",
    description:
      "Monitor progress, track labor hours, and manage deliveries through mobile dashboards. Field teams update tasks and upload photos while managers maintain oversight through automated progress and budget reports.",
  },
  {
    _key: "04",
    number: "04",
    title: "Handover & Closeout \u{1F4C1}",
    description:
      "Organise punch lists, warranties, and inspections in structured workflows. Track outstanding items and coordinate final walkthroughs with automated reminders for efficient project closeout.",
  },
  {
    _key: "05",
    number: "05",
    title: "Post-Construction Support \u{1F527}",
    description:
      "Maintain client relationships with warranty tracking and maintenance scheduling. Historical project data improves future estimates and business processes.",
  },
]

function TestimonialCard({
  title,
  quote,
  author,
  imageSrc,
  imageAlt,
}: {
  title: string
  quote: string
  author: string
  imageSrc: string
  imageAlt: string
}) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-card bg-white"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full object-cover"
        style={{ height: 280 }}
      />
      <div style={{ padding: 32 }}>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#111",
            marginBottom: 16,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: "#333",
            marginBottom: 24,
            fontStyle: "italic",
          }}
        >
          &ldquo;{quote}&rdquo;
        </p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--purple-primary)",
          }}
        >
          {author}
        </p>
      </div>
    </div>
  )
}

export default function ConstructionExtras() {
  return (
    <>
      <FeatureNumberList
        heading="Support Each Stage of Your Project Life Cycle with a "
        headingAccent="monday.com Expert"
        theme="light"
        columns={3}
        items={LIFECYCLE_ITEMS}
      />

      <section
        style={{
          backgroundColor: "#ffffff",
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="mx-auto px-4" style={{ maxWidth: 1100 }}>
          <h2
            className="text-section-h2 text-center"
            style={{ color: "#000", marginBottom: 48 }}
          >
            Construction <span style={{ color: "var(--purple-primary)" }}>Testimonials</span>
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 32 }}
          >
            <TestimonialCard
              title="HOLT CAT Case Study"
              quote="monday.com has given us the visibility we need to get everyone on the same page and keep track of all the moving parts."
              author="Jason Doan | VP of Heavy Rental & Sales, HOLT CAT"
              imageSrc="/images/construction-testimonial-1.avif"
              imageAlt="Fruition monday.com consulting solution for construction — HOLT CAT"
            />
            <TestimonialCard
              title="Falkbuilt Case Study"
              quote="The monday.com mobile app gives our technicians on raw construction sites instant access to the project information they need and makes connecting with the team at HQ easy."
              author="Allie Swindlehurst | Operations Manager, Falkbuilt"
              imageSrc="/images/construction-testimonial-2.avif"
              imageAlt="Fruition monday.com consulting solution for construction — Falkbuilt"
            />
          </div>
        </div>
      </section>
    </>
  )
}
