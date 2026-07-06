import { getPageBySlug } from "@/sanity/queries"
import { GOVERNING_DOCS } from "./documents"

export async function generateMetadata() {
  const page = await getPageBySlug("terms-and-conditions")
  return {
    alternates: { canonical: "/terms-and-conditions" },
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

interface SanityDoc {
  _key?: string
  fileUrl?: string
}

export default async function TermsPage() {
  const page = await getPageBySlug("terms-and-conditions")

  const sanityDocs: SanityDoc[] = page?.documents || []

  // Render the governing docs in a fixed order with clean, on-domain URLs.
  // Each tile links to /terms-and-conditions/<slug> (see ./[file]/route.ts),
  // and we skip any doc whose backing Sanity file is missing.
  const docs = GOVERNING_DOCS.filter((doc) =>
    sanityDocs.some((s) => s._key === doc.key && s.fileUrl)
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {page?.heroHeading && (
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          {page?.heroHeading}
        </h1>
      )}

      <p className="mb-12 text-gray-600">
        Download our governing documents below.
      </p>

      {docs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {docs.map((doc) => {
            return (
              <a
                key={doc.slug}
                href={`/terms-and-conditions/${doc.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 p-8 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-16 w-16 text-red-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                  <text
                    x="12"
                    y="17.5"
                    textAnchor="middle"
                    fill="currentColor"
                    stroke="none"
                    fontSize="5"
                    fontWeight="bold"
                  >
                    PDF
                  </text>
                </svg>
                <span className="text-center text-sm font-medium text-gray-700">
                  {doc.label}
                </span>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
