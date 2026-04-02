import { urlFor } from '@/sanity/image'

interface Logo {
  _key?: string
  name?: string
  image?: { asset: { _ref: string } }
}

interface LogoCloudBlockProps {
  heading?: string
  logos?: Logo[]
}

export default function LogoCloudBlockView({ heading, logos }: LogoCloudBlockProps) {
  if (!logos || logos.length === 0) return null

  return (
    <section className="bg-white py-10 px-4">
      <div className="mx-auto max-w-6xl">
        {heading && (
          <h2 className="mb-6 text-center text-xl font-semibold text-gray-700">{heading}</h2>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {logos.map((logo, i) => (
            <div key={logo._key ?? i} className="flex items-center">
              {logo.image?.asset ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(logo.image).height(48).url()}
                  alt={logo.name ?? ''}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                logo.name && (
                  <span className="text-sm font-medium text-gray-500">{logo.name}</span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
