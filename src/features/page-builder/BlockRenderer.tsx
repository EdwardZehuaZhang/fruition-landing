import HeroBlockView from './blocks/HeroBlockView'
import RichTextBlockView from './blocks/RichTextBlockView'
import CtaBlockView from './blocks/CtaBlockView'
import FeatureListBlockView from './blocks/FeatureListBlockView'
import TestimonialBlockView from './blocks/TestimonialBlockView'
import LogoCloudBlockView from './blocks/LogoCloudBlockView'
import PostListBlockView from './blocks/PostListBlockView'
import FaqBlockView from './blocks/FaqBlockView'
import StatsBlockView from './blocks/StatsBlockView'
import CalendlyBlockView from './blocks/CalendlyBlockView'
import TabSectionBlockView from './blocks/TabSectionBlockView'

interface ContentBlock {
  _key: string
  _type: string
  [key: string]: unknown
}

function groupConsecutiveTestimonials(blocks: ContentBlock[]): Array<ContentBlock | ContentBlock[]> {
  const result: Array<ContentBlock | ContentBlock[]> = []
  let i = 0
  while (i < blocks.length) {
    if (blocks[i]._type === 'testimonialBlock') {
      const group: ContentBlock[] = []
      while (i < blocks.length && blocks[i]._type === 'testimonialBlock') {
        group.push(blocks[i])
        i++
      }
      result.push(group)
    } else {
      result.push(blocks[i])
      i++
    }
  }
  return result
}

export default function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) return null

  const grouped = groupConsecutiveTestimonials(blocks)

  return (
    <>
      {grouped.map((item, idx) => {
        // Testimonial grid section
        if (Array.isArray(item)) {
          return (
            <section key={`testimonials-${idx}`} className="bg-gray-50 py-16 px-4">
              <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {item.map((block) => (
                    <TestimonialBlockView key={block._key} {...block} />
                  ))}
                </div>
              </div>
            </section>
          )
        }

        const block = item

        switch (block._type) {
          case 'heroBlock':
            return <HeroBlockView key={block._key} {...block} />
          case 'richTextBlock':
            return <RichTextBlockView key={block._key} {...block} />
          case 'ctaBlock':
            return <CtaBlockView key={block._key} {...block} />
          case 'featureListBlock':
            return <FeatureListBlockView key={block._key} {...block} />
          case 'testimonialBlock':
            return (
              <section key={block._key} className="bg-gray-50 py-4 px-4">
                <div className="mx-auto max-w-6xl">
                  <TestimonialBlockView {...block} />
                </div>
              </section>
            )
          case 'logoCloudBlock':
            return <LogoCloudBlockView key={block._key} {...block} />
          case 'postListBlock':
            return <PostListBlockView key={block._key} {...block} />
          case 'faqBlock':
            return <FaqBlockView key={block._key} {...block} />
          case 'statsBlock':
            return <StatsBlockView key={block._key} {...block} />
          case 'calendlyBlock':
            return <CalendlyBlockView key={block._key} {...block} />
          case 'tabSectionBlock':
            return <TabSectionBlockView key={block._key} {...block} />
          default:
            return (
              <div key={block._key}>
                <p>Unknown block type: {block._type}</p>
              </div>
            )
        }
      })}
    </>
  )
}
