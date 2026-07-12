import type { Metadata } from "next"

const serviceAgreementUrl =
  "https://docs.google.com/document/d/1oWTCDeckG94TYOKJAU2UaCM86HEfpZNn0ffvOhxi2oY/edit?tab=t.0"

export const metadata: Metadata = {
  title: "Service Agreement AU | Fruition Services",
  description:
    "Fruition Services Australia service agreement for work order agreements, effective 30/06/2026.",
  alternates: {
    canonical: "/legal/services-agreement-au",
  },
}

export default function ServicesAgreementAuPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Legal
      </p>
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-body">
        Service Agreement AU
      </h1>
      <p className="mb-8 text-base leading-7 text-muted">
        Current Fruition Services service agreement for Australian work order
        agreements. Effective timestamp: 30/06/2026.
      </p>

      <section className="rounded-lg border border-ui bg-surface-subtle p-6">
        <h2 className="mb-3 text-xl font-semibold text-body">
          June 2026 Service Agreement
        </h2>
        <p className="mb-6 text-sm leading-6 text-muted">
          View the current Service Agreement for Australian work order
          agreements.
        </p>
        <a
          href={serviceAgreementUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Open Service Agreement
        </a>
      </section>
    </main>
  )
}
