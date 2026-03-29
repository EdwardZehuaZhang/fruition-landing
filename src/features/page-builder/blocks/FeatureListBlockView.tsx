interface Feature {
  _key?: string
  icon?: string
  title?: string
  description?: string
}

interface FeatureListBlockProps {
  heading?: string
  features?: Feature[]
}

export default function FeatureListBlockView({ heading, features }: FeatureListBlockProps) {
  return (
    <section>
      {heading && <h2>{heading}</h2>}
      {features && (
        <ul>
          {features.map((f, i) => (
            <li key={f._key ?? i}>
              {f.icon && <span>{f.icon}</span>}
              {f.title && <strong>{f.title}</strong>}
              {f.description && <span> — {f.description}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
