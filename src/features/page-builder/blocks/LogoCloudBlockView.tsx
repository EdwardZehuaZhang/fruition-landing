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
  return (
    <section>
      {heading && <h2>{heading}</h2>}
      {logos && (
        <ul>
          {logos.map((logo, i) => (
            <li key={logo._key ?? i}>
              {logo.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(logo.image).width(120).url()}
                  alt={logo.name ?? ''}
                  width={120}
                />
              )}
              {logo.name && <span>{logo.name}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
