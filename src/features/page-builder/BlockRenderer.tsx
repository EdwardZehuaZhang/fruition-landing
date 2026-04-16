import Link from 'next/link'
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
import TeamsTransformedSection from './blocks/TeamsTransformedSection'
import { urlFor } from '@/sanity/image'
import type { SiteSettings } from './types'

interface Logo {
  _key?: string
  name?: string
  image?: { asset: { _ref: string } }
}

interface LogoCloudBlockProps {
  heading?: string
  logos?: Logo[]
}

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

/* Hardcoded YouTube video section — matches Figma "Video" section */
function VideoSection() {
  return (
    <section className="bg-white py-[80px] px-[10px]">
      <div className="mx-auto flex flex-col items-center justify-center">
        <div className="w-full max-w-[979px] aspect-video">
          <iframe
            src="https://www.youtube.com/embed/7vtrtlfC1Zg"
            title="monday CRM Success Story - Star Aviation | Powered by Fruition"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}

export default function BlockRenderer({
  blocks,
  siteSettings,
}: {
  blocks: ContentBlock[]
  siteSettings?: SiteSettings
}) {
  if (!blocks || blocks.length === 0) return null

  // Security badge — Sanity first, hardcoded fallback
  const securityBadgeSrc = siteSettings?.badgeSecurity?.asset
    ? urlFor(siteSettings.badgeSecurity).width(976).height(94).url()
    : '/images/badge-security.png'

  // Filter out blocks that don't exist in the Figma design
  const filtered = blocks.filter((b) => {
    // Filter out the standalone "500+" callout CTA — not in the Figma design
    if (b._key === 'callout-500-01' || (b.heading as string) === '500+') return false
    // Filter out the "Teams Transformed" section and its companion CTA
    const heading = (b.heading as string) ?? ''
    if (heading.includes('Teams Transformed') || heading.includes('Efficiency Gains')) return false
    if (b._type === 'ctaBlock' && (b.ctaLabel as string)?.includes('Book a Consultation') && (b.secondaryCtaLabel as string)?.includes('Get Started with monday')) return false

    // Some imported homepage content includes a raw Wix navigation dump under Services.
    // Hide that corrupted block until the CMS content is cleaned.
    if (b._type === 'richTextBlock' && heading.trim().toLowerCase() === 'services') {
      const content = (b.content as Array<{ children?: Array<{ text?: string }> }> | undefined) ?? []
      const text = content
        .map((block) => (block.children ?? []).map((child) => child.text ?? '').join(' '))
        .join(' ')
        .toLowerCase()

      if (text.includes('skip to main content') || text.includes('static.wixstatic.com')) return false
    }

    return true
  })

  const grouped = groupConsecutiveTestimonials(filtered)

  return (
    <>
      {grouped.map((item, idx) => {
        // Testimonial grid section
        if (Array.isArray(item)) {
          return (
            <div key={`testimonials-${idx}`}>
              <section className="bg-white py-[80px] px-4">
                <div className="mx-auto max-w-[1343px]">
                  {/* Header row: heading + CTA side by side */}
                  <div className="flex items-center justify-center gap-[89px] mb-[58px] w-full">
                    <h2 className="text-[48px] text-black leading-[67.2px] w-[919px] shrink-0">
                      What our customers say about us 🙌
                    </h2>
                    <Link
                      href="/customer-testimonials"
                      className="shrink-0 flex items-center justify-center h-[53px] w-[330px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
                    >
                      🚀 Start Your Transformation
                    </Link>
                  </div>

                  {/* Cards grid: stat card + testimonials in flex-wrap */}
                  <div className="flex flex-wrap gap-x-[16px] gap-y-[18px]">
                    {/* Stat card — same width as testimonial cards */}
                    <div className="relative w-full max-w-[437px] bg-[#10003a] rounded-card shadow-card flex flex-col px-[38px]">
                      <div className="pt-[23px] pb-[30px]">
                        <p className="font-semibold text-[40px] text-[#ba83f0] leading-[60px]">500+</p>
                        <p className="font-light text-[24px] text-white leading-[36px]">
                          have maximised their<br />
                          workflows with our<br />
                          monday.com expert support
                        </p>
                      </div>
                      <div className="pb-[30px]">
                        <Link
                          href="/customer-testimonials"
                          className="inline-flex items-center justify-center rounded-[100px] border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                        >
                          Read our case studies
                        </Link>
                      </div>
                    </div>

                    {item.map((block) => (
                      <TestimonialBlockView
                        key={block._key}
                        quote={block.quote as string}
                        authorName={block.authorName as string}
                        authorRole={block.authorRole as string}
                        company={block.company as string}
                      />
                    ))}
                  </div>
                </div>
              </section>
              <TeamsTransformedSection />
            </div>
          )
        }

        const block = item

        switch (block._type) {
          case 'heroBlock':
            return <HeroBlockView key={block._key} {...block} siteSettings={siteSettings} />
          case 'richTextBlock':
            return <RichTextBlockView key={block._key} {...block} />
          case 'ctaBlock':
            return <CtaBlockView key={block._key} {...block} siteSettings={siteSettings} />
          case 'featureListBlock':
            return <FeatureListBlockView key={block._key} {...block} siteSettings={siteSettings} />
          case 'testimonialBlock':
            return (
              <section key={block._key} className="bg-white py-4 px-4">
                <div className="mx-auto max-w-[1343px]">
                  <TestimonialBlockView
                    quote={block.quote as string}
                    authorName={block.authorName as string}
                    authorRole={block.authorRole as string}
                    company={block.company as string}
                  />
                </div>
              </section>
            )
          case 'logoCloudBlock':
            // Skip the "Trusted Partner" block — it doesn't exist in the Figma design
            if ((block.heading as string)?.toLowerCase().includes('trusted partner')) return null
            // Render logo cloud + video embed below it
            return (
              <div key={block._key}>
                <LogoCloudBlockView
                  heading={block.heading as string}
                  logos={block.logos as LogoCloudBlockProps['logos']}
                />
                <VideoSection />
              </div>
            )
          case 'postListBlock':
            // Blog section + security badge below it (matching Figma order)
            return (
              <div key={block._key}>
                <PostListBlockView
                  heading={block.heading as string}
                  subheading={block.subheading as string}
                  limit={block.limit as number}
                />
                <section className="bg-white pb-[80px] px-4">
                  <div className="mx-auto max-w-[976px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={securityBadgeSrc} alt="Security Partners" width={976} height={94} className="w-full h-auto" />
                  </div>
                </section>
              </div>
            )
          case 'faqBlock':
            return <FaqBlockView key={block._key} {...block} />
          case 'statsBlock':
            return <StatsBlockView key={block._key} {...block} siteSettings={siteSettings} />
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
