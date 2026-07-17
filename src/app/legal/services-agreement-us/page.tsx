import Image from "next/image"
import { buildOgMetadata } from "@/lib/metadata"

const pdfUrl = "/fruition-service-agreement-us.pdf"

export async function generateMetadata() {
  const title = "Service Agreement US | Fruition Services"
  const description =
    "Fruition Services US (North America) service agreement for work order agreements, effective 30/06/2026."
  return {
    title,
    description,
    alternates: { canonical: "/legal/services-agreement-us" },
    ...buildOgMetadata({ title, description, path: "/legal/services-agreement-us" }),
  }
}

export default function ServicesAgreementUsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Legal
      </p>
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-body">
        Service Agreement US
      </h1>
      <p className="mb-8 text-base leading-7 text-muted">
        Current Fruition Services service agreement for United States / North
        America work order agreements. Effective timestamp: 30/06/2026.
      </p>

      <section className="rounded-lg border border-ui bg-surface-subtle p-6 mb-8">
        <h2 className="mb-3 text-xl font-semibold text-body">
          June 2026 Service Agreement
        </h2>
        <div className="flex flex-wrap gap-4">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Open PDF (new tab)
          </a>
          <a
            href={pdfUrl}
            download="Fruition-Service-Agreement-US-June-2026.pdf"
            className="inline-flex items-center justify-center rounded-md border border-ui bg-surface px-5 py-3 text-sm font-semibold text-body transition hover:bg-surface-hover"
          >
            Download PDF
          </a>
        </div>
      </section>

      <section className="rounded-lg border border-ui bg-white">
        <iframe
          src={pdfUrl}
          className="h-[80vh] w-full"
          title="Fruition Services Agreement US June 2026"
        />
      </section>
    </main>
  )
}
