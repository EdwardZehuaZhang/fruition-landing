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

export default function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block) => {
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
            return <TestimonialBlockView key={block._key} {...block} />
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
