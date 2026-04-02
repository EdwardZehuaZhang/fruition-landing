import Link from 'next/link'

interface Feature {
  _key?: string
  icon?: string
  title?: string
  description?: string
}

interface FeatureListBlockProps {
  _key?: string
  heading?: string
  subheading?: string
  features?: Feature[]
}

export default function FeatureListBlockView({ _key, heading, subheading, features }: FeatureListBlockProps) {
  // Industry tile grid (industries-01) — description holds the URL
  const isIndustryGrid = features?.some(f => f.description?.startsWith('/'))

  if (isIndustryGrid) {
    return (
      <section className="bg-white py-16 px-4">
        <div className="mx-auto max-w-6xl">
          {heading && (
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">{heading}</h2>
          )}
          {subheading && (
            <p className="mb-10 text-center text-gray-500 max-w-2xl mx-auto">{subheading}</p>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {features?.map((f, i) => (
              <Link
                key={f._key ?? i}
                href={f.description ?? '#'}
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-5 text-center text-sm font-semibold text-gray-800 shadow-sm transition hover:border-purple-400 hover:text-purple-700"
              >
                {f.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Numbered steps block (steps-01)
  const isStepsBlock = features?.some(f => /^\d+$/.test(f.icon ?? ''))

  if (isStepsBlock) {
    return (
      <section className="bg-gray-50 py-16 px-4">
        <div className="mx-auto max-w-4xl">
          {heading && (
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">{heading}</h2>
          )}
          <div className="flex flex-col gap-6">
            {features?.map((f, i) => (
              <div key={f._key ?? i} className="flex items-start gap-5 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-700">
                  {f.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{f.title}</p>
                  {f.description && <p className="mt-1 text-sm text-gray-600">{f.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Generic feature list (challenges, etc.)
  return (
    <section className="bg-white py-16 px-4">
      <div className="mx-auto max-w-5xl">
        {heading && (
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">{heading}</h2>
        )}
        {subheading && (
          <p className="mb-10 text-center text-gray-500 max-w-2xl mx-auto">{subheading}</p>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features?.map((f, i) => (
            <div
              key={f._key ?? i}
              className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-6"
            >
              {f.icon && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                  {f.icon}
                </span>
              )}
              <div>
                <p className="font-semibold text-gray-900">{f.title}</p>
                {f.description && (
                  <p className="mt-1 text-sm text-gray-600">{f.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
