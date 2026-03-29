interface FaqItem {
  _key?: string
  question?: string
  answer?: string
}

interface FaqBlockProps {
  heading?: string
  items?: FaqItem[]
}

export default function FaqBlockView({ heading, items }: FaqBlockProps) {
  return (
    <section>
      {heading && <h2>{heading}</h2>}
      {items && (
        <dl>
          {items.map((item, i) => (
            <div key={item._key ?? i}>
              {item.question && <dt><strong>{item.question}</strong></dt>}
              {item.answer && <dd>{item.answer}</dd>}
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
