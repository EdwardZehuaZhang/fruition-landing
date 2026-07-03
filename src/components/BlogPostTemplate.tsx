import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react"
import { PortableText } from "@portabletext/react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import { authorSlug } from "@/sanity/authorSlug"
import YouTubeEmbed from "@/components/YouTubeEmbed"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImage = any

export interface BlogCategoryRef {
  _id?: string
  title: string
  slug: string
}

export interface BlogPostData {
  title: string
  author?: string
  publishedAt?: string
  coverImage?: SanityImage
  excerpt?: string
  body?: PortableTextBlock[]
  categories?: BlogCategoryRef[]
  videoUrls?: string[]
}

export interface RelatedBlogPost {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  coverImage?: SanityImage
}

interface BlogPostTemplateProps {
  post: BlogPostData
  relatedPosts?: RelatedBlogPost[]
  calendlyUrl?: string
}

const DEFAULT_CALENDLY = "https://calendly.com/global-calendar-fruitionservices"

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function estimateReadingTime(body?: PortableTextBlock[]): string {
  if (!body?.length) return "1 min read"
  let wordCount = 0
  for (const block of body) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children: any[] = (block as any).children || []
    for (const child of children) {
      if (typeof child?.text === "string") {
        wordCount += child.text.split(/\s+/).filter(Boolean).length
      }
    }
  }
  const minutes = Math.max(1, Math.round(wordCount / 225))
  return `${minutes} min read`
}

function authorInitials(name?: string): string {
  if (!name) return "F"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "F"
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

/** Player embed URL for YouTube, Vimeo, or Loom. null if unrecognised. */
function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  const loom = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/)
  if (loom) return `https://www.loom.com/embed/${loom[1]}`
  return null
}

/** Plain text of a portable-text block (joined span text). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blockText(block: any): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = block?.children || []
  return children.map((c) => (typeof c?.text === "string" ? c.text : "")).join("")
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

/** h2/h3 headings from the body, slugified, deduped, for the jump-to TOC. */
function extractHeadings(body?: PortableTextBlock[]): TocEntry[] {
  if (!body?.length) return []
  const seen = new Set<string>()
  const out: TocEntry[] = []
  for (const block of body) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const style = (block as any)?.style
    if (block?._type !== "block" || (style !== "h2" && style !== "h1" && style !== "h3")) continue
    const text = blockText(block).trim()
    if (!text) continue
    const id = slugify(text)
    // Anchors aren't suffix-deduped in the renderer, so skip repeats to keep
    // every TOC link pointing at a real, first-occurrence heading.
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push({ id, text, level: style === "h3" ? 3 : 2 })
  }
  return out
}

/* ------------------------------------------------------------------ */
/*  Portable text components — pixel-matched to Figma article body    */
/* ------------------------------------------------------------------ */
/*  Figma rules:                                                       */
/*    - Montserrat Regular/Bold                                        */
/*    - body: 18px / leading-27px / text-black                         */
/*    - h2 (section): 28px Bold / leading-35px / py-27.5px             */
/*    - h3 (sub): 22px Bold / leading-27px / pt-27.5px                 */
/*    - h4 (inline): 18px Bold / leading-27px / pt-27.5px              */
/*    - between paragraphs: pt-27.5px                                  */
/*    - link color: #604c97                                            */
/*    - image: w-[740px] with figcaption centered, 14px                */
/*    - lists: list-disc with 27px indent                              */
/* ------------------------------------------------------------------ */

const blogPortableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children, value }) => (
      <h2 id={slugify(blockText(value))} className="scroll-mt-[100px] font-montserrat font-bold text-[24px] sm:text-[28px] leading-[31px] sm:leading-[35px] text-ink w-full py-[27.5px]">
        {children}
      </h2>
    ),
    h2: ({ children, value }) => (
      <h2 id={slugify(blockText(value))} className="scroll-mt-[100px] font-montserrat font-bold text-[24px] sm:text-[28px] leading-[31px] sm:leading-[35px] text-ink w-full py-[27.5px]">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={slugify(blockText(value))} className="scroll-mt-[100px] font-montserrat font-bold text-[22px] leading-[27px] text-ink w-full pt-[27.5px] pb-[10px]">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-montserrat font-bold text-[18px] leading-[27px] text-ink w-full pt-[27.5px]">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-montserrat font-normal text-[18px] leading-[27px] text-ink w-full pt-[27.5px] pl-[20px] border-l-[3px] border-brand-contrast italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="font-montserrat font-normal text-[18px] leading-[27px] text-ink w-full pt-[27.5px] first:pt-0">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc w-full pl-[27px] pt-[27.5px] space-y-[8px]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal w-full pl-[27px] pt-[27.5px] space-y-[8px]">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="font-montserrat font-normal text-[18px] leading-[27px] text-ink">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="font-montserrat font-normal text-[18px] leading-[27px] text-ink">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-montserrat font-bold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-contrast underline hover:no-underline"
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => (
      <Link
        href={value?.slug?.current ? `/${value.slug.current}` : "#"}
        className="text-brand-contrast underline hover:no-underline"
      >
        {children}
      </Link>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      const src = urlFor(value).width(1480).url()
      return (
        <figure className="w-full flex flex-col items-start pt-[27.5px] isolate">
          <div className="relative w-full overflow-hidden">
            <Image
              src={src}
              alt={value.alt || ""}
              width={740}
              height={416}
              className="w-full h-auto"
              sizes="(max-width: 924px) 100vw, 740px"
            />
          </div>
          {value.caption && (
            <figcaption className="w-full flex items-center justify-center p-[16px]">
              <span className="font-montserrat font-normal text-[14px] leading-[27px] text-ink text-center">
                {value.caption}
              </span>
            </figcaption>
          )}
        </figure>
      )
    },
    videoEmbed: ({ value }) => {
      const embed = getVideoEmbedUrl(value?.url ?? "")
      if (!embed) return null
      return (
        <figure className="w-full flex flex-col items-start pt-[27.5px]">
          <div className="aspect-video w-full overflow-hidden rounded-card">
            <iframe
              src={embed}
              title={value?.caption || "Video"}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value?.caption && (
            <figcaption className="w-full flex items-center justify-center p-[16px]">
              <span className="font-montserrat font-normal text-[14px] leading-[27px] text-ink text-center">
                {value.caption}
              </span>
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Sub-components (pixel-matched fragments)                           */
/* ------------------------------------------------------------------ */

function AuthorAvatar({ name }: { name?: string }) {
  return (
    <div
      className="shrink-0 size-[32px] rounded-[16px] flex items-center justify-center text-white font-montserrat font-semibold text-[12px] leading-none select-none"
      style={{
        background: "linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-light) 100%)",
      }}
      aria-hidden="true"
    >
      {authorInitials(name)}
    </div>
  )
}

function AuthorMetaRow({
  author,
  publishedAt,
  readingTime,
}: {
  author?: string
  publishedAt?: string
  readingTime: string
}) {
  return (
    <div className="flex items-center w-full">
      {/* Avatar — 32px with 12px right padding */}
      {author ? (
        <Link
          href={`/author/${authorSlug(author)}`}
          aria-label={`More articles by ${author}`}
          className="flex flex-col h-[32px] items-start pr-[12px] w-[44px]"
        >
          <div className="content-stretch flex flex-col items-start overflow-clip rounded-[16px] shrink-0 size-[32px]">
            <AuthorAvatar name={author} />
          </div>
        </Link>
      ) : (
        <div className="flex flex-col h-[32px] items-start pr-[12px] w-[44px]">
          <div className="content-stretch flex flex-col items-start overflow-clip rounded-[16px] shrink-0 size-[32px]">
            <AuthorAvatar name={author} />
          </div>
        </div>
      )}
      {/* Name */}
      {author && (
        <div className="flex flex-col items-start shrink-0">
          <Link
            href={`/author/${authorSlug(author)}`}
            className="font-montserrat font-normal text-[14px] leading-[21px] text-ink whitespace-nowrap hover:text-brand-contrast transition-colors"
          >
            {author}
          </Link>
        </div>
      )}
      {/* Date */}
      {publishedAt && (
        <div className="flex gap-[6px] items-start pl-[6px] shrink-0 font-montserrat font-normal text-[14px] leading-[21px] text-ink whitespace-nowrap">
          <span>·</span>
          <span>{formatDate(publishedAt)}</span>
        </div>
      )}
      {/* Reading time */}
      <div className="flex gap-[6px] items-start pl-[6px] shrink-0 font-montserrat font-normal text-[14px] leading-[21px] text-ink whitespace-nowrap">
        <span>·</span>
        <span>{readingTime}</span>
      </div>
    </div>
  )
}

function ArticleTitle({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-start w-full">
      <h1 className="font-montserrat font-bold text-[28px] leading-[36px] sm:text-[40px] sm:leading-[50px] text-ink w-full">
        {title}
      </h1>
    </div>
  )
}

function CoverFigure({
  image,
  alt,
}: {
  image: SanityImage
  alt: string
}) {
  if (!image?.asset?._ref) return null
  const src = urlFor(image).width(1480).url()
  return (
    <figure className="w-full flex flex-col items-start pt-[27.5px] isolate">
      <div className="relative w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={740}
          height={416}
          priority
          className="w-full h-auto"
          sizes="(max-width: 924px) 100vw, 740px"
        />
      </div>
    </figure>
  )
}

function VideoEmbeds({ urls }: { urls: string[] }) {
  const embeds = urls
    .map((u) => ({ url: u, embed: getYouTubeEmbedUrl(u) }))
    .filter((v): v is { url: string; embed: string } => !!v.embed)
  if (embeds.length === 0) return null
  return (
    <div className="w-full flex flex-col gap-[24px] pt-[27.5px]">
      {embeds.map((v, i) => (
        <div key={i} className="aspect-video w-full overflow-hidden rounded-card">
          <YouTubeEmbed url={v.embed} title={`Video ${i + 1}`} />
        </div>
      ))}
    </div>
  )
}

function TagsRow({ categories }: { categories: BlogCategoryRef[] }) {
  if (!categories?.length) return null
  return (
    <div className="flex flex-wrap items-start gap-x-[12px] gap-y-[10px] w-full">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/consulting-blog/categories/${cat.slug}`}
          className="inline-flex items-start px-[13px] py-[7px] bg-surface border border-[rgba(0,0,0,0.2)] hover:border-brand-contrast transition-colors"
        >
          <span className="font-montserrat font-normal text-[14px] leading-[17px] text-ink">
            {cat.title}
          </span>
        </Link>
      ))}
    </div>
  )
}

function EngagementBar() {
  return (
    <div className="flex flex-col items-start w-full">
      {/* Share icons row — divider top, 66px min-h, pt-24 pb-23 */}
      <div className="relative flex items-center min-h-[66px] pt-[24px] pb-[23px] w-full border-t border-[rgba(0,0,0,0.2)]">
        <div className="flex gap-[30px] items-center">
          {/* Facebook */}
          <button
            aria-label="Share on Facebook"
            className="size-[19px] flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.83 6.08V4.66c0-.69.46-.86.78-.86h1.98V1.02L11.85 1c-3.02 0-3.71 2.27-3.71 3.72v1.36H6.39v2.97h1.78v7.95h3.43V9.05h2.54l.12-1.17.19-1.8h-2.62Z"
                fill="var(--ink)"
              />
            </svg>
          </button>
          {/* LinkedIn */}
          <button
            aria-label="Share on LinkedIn"
            className="size-[19px] flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.3 6.43H1.22v9.92H4.3V6.43ZM2.76 1.08c-1.06 0-1.76.7-1.76 1.6 0 .89.68 1.6 1.72 1.6h.02c1.08 0 1.76-.71 1.76-1.6-.02-.9-.68-1.6-1.74-1.6ZM12.31 6.21c-1.63 0-2.36.9-2.77 1.53V6.43H6.46c.04.87 0 9.92 0 9.92h3.08v-5.54c0-.28.02-.55.1-.75.22-.55.73-1.13 1.59-1.13 1.12 0 1.57.85 1.57 2.1v5.32H15.9v-5.68c0-2.85-1.52-4.17-3.55-4.17l-.04-.29Z"
                fill="var(--ink)"
              />
            </svg>
          </button>
          {/* Link */}
          <button
            aria-label="Copy link"
            className="size-[19px] flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 11.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1M11 7.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1"
                stroke="var(--ink)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Send */}
          <button
            aria-label="Share"
            className="size-[19px] flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 2 9.5 9.5M17 2l-5 15-2.5-7.5L2 7l15-5Z"
                stroke="var(--ink)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Like row — divider top, pt-19 */}
      <div className="relative flex items-center justify-end pt-[19px] w-full border-t border-[rgba(0,0,0,0.2)]">
        <button
          aria-label="Like post"
          className="flex items-center justify-center size-[19px] hover:opacity-70 transition-opacity"
        >
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.5 16.5s-6-3.63-6-8.25A3.75 3.75 0 0 1 9.5 5.25 3.75 3.75 0 0 1 15.5 8.25c0 4.62-6 8.25-6 8.25Z"
              stroke="#E84A43"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

/** Quick-read "On this page" jump-to list, generated from the body headings. */
function ArticleToc({ entries }: { entries: TocEntry[] }) {
  if (entries.length < 3) return null
  return (
    <nav
      aria-label="On this page"
      className="w-full rounded-[16px] p-[24px] sm:p-[28px]"
      style={{ background: "linear-gradient(180deg, var(--surface-tint) 0%, var(--surface) 100%)", border: "1px solid var(--line-tint)" }}
    >
      <p className="font-montserrat font-semibold uppercase" style={{ color: "var(--brand)", fontSize: 12, letterSpacing: "0.16em" }}>
        On this page
      </p>
      <ul className="mt-[14px] flex flex-col" style={{ gap: 8, listStyle: "none", padding: 0 }}>
        {entries.map((e) => (
          <li key={e.id} style={{ paddingLeft: e.level === 3 ? 16 : 0 }}>
            <a
              href={`#${e.id}`}
              className="font-montserrat hover:underline"
              style={{ color: e.level === 3 ? "var(--ink-soft)" : "var(--ink-heading)", fontSize: e.level === 3 ? 14 : 15, fontWeight: e.level === 3 ? 400 : 600 }}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Bottom-of-article conversion CTA. */
function InlineAuditCta({ calendlyUrl }: { calendlyUrl: string }) {
  return (
    <aside
      className="relative w-full overflow-hidden rounded-[20px] p-[32px] sm:p-[40px]"
      style={{ background: "linear-gradient(135deg, var(--navy-700) 0%, var(--navy-900) 100%)" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{ top: -120, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(128,21,232,0.4) 0%, rgba(128,21,232,0) 70%)" }}
      />
      <div className="relative flex flex-col gap-[18px] sm:flex-row sm:items-center sm:justify-between">
        <div style={{ maxWidth: 540 }}>
          <h2 className="font-montserrat font-bold" style={{ color: "var(--white)", fontSize: 22, lineHeight: "30px", textWrap: "balance" }}>
            Scaling this workflow across 50+ users?
          </h2>
          <p className="font-montserrat" style={{ color: "rgba(255,255,255,0.78)", fontSize: 15, lineHeight: "24px", marginTop: 8 }}>
            Book a complimentary 30-minute process audit with a Fruition consultant and we will map the build for your team.
          </p>
        </div>
        <Link
          href={calendlyUrl}
          className="inline-flex flex-none items-center justify-center font-montserrat font-semibold"
          style={{ height: 50, padding: "0 26px", borderRadius: 999, background: "linear-gradient(to right, var(--purple-primary), var(--purple-light))", color: "var(--white)", fontSize: 15 }}
        >
          Book a 30-Min System Audit
        </Link>
      </div>
    </aside>
  )
}

function RelatedPostCard({ post }: { post: RelatedBlogPost }) {
  const imgSrc = post.coverImage?.asset?._ref
    ? urlFor(post.coverImage).width(580).height(324).url()
    : null
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group bg-surface relative flex-1 min-w-0 max-w-[290.67px] self-stretch border border-[rgba(232,230,230,0.75)] hover:border-brand-contrast transition-colors overflow-hidden"
    >
      <div className="flex flex-col items-start h-full">
        {/* Image — 162px tall, full card width */}
        <div className="relative w-full h-[162.36px] overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={post.title}
              fill
              sizes="290px"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-[var(--purple-primary)] to-[var(--purple-light)]" />
          )}
        </div>
        {/* Body */}
        <div className="flex flex-col items-start flex-1 w-full pt-[24px] px-[24px] pb-[24px]">
          <div className="flex flex-col items-start w-full overflow-hidden">
            <p className="font-montserrat font-bold text-[18px] leading-[normal] text-ink w-full line-clamp-2 group-hover:text-brand-contrast transition-colors">
              {post.title}
            </p>
          </div>
          {/* Footer — divider top, pt-16, h-34 */}
          <div className="mt-auto w-full pt-[16px] flex items-start justify-between h-[34px] border-t border-[rgba(0,0,0,0.2)]">
            <div className="flex items-center h-full">
              <div className="flex items-center gap-[6px]">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 2C5.5 2 2.17 4.44 1 6c1.17 1.56 4.5 4 8.5 4s7.33-2.44 8.5-4c-1.17-1.56-4.5-4-8.5-4Zm0 6.67A2.67 2.67 0 1 1 9.5 3.33a2.67 2.67 0 0 1 0 5.34Z"
                    fill="var(--ink)"
                  />
                </svg>
                <span className="font-montserrat font-normal text-[12px] leading-[18px] text-ink">
                  0
                </span>
              </div>
            </div>
            <div className="flex items-center h-full">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.5 16.5s-6-3.63-6-8.25A3.75 3.75 0 0 1 9.5 5.25 3.75 3.75 0 0 1 15.5 8.25c0 4.62-6 8.25-6 8.25Z"
                  stroke="#E84A43"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function RelatedPostsSection({ posts }: { posts: RelatedBlogPost[] }) {
  if (!posts?.length) return null
  return (
    <section className="flex flex-col items-start gap-[20px] w-full">
      {/* Header */}
      <header className="flex items-start justify-between w-full h-[27px]">
        <div className="flex flex-col items-start self-stretch">
          <h2 className="font-montserrat font-normal text-[18px] leading-[27px] text-ink whitespace-nowrap">
            Recent Posts
          </h2>
        </div>
        <Link
          href="/consulting-blog"
          className="flex flex-col items-start self-stretch font-montserrat font-normal text-[14px] leading-[21px] text-ink whitespace-nowrap hover:text-brand-contrast transition-colors"
        >
          See All
        </Link>
      </header>
      {/* Cards row */}
      <div className="flex gap-[34px] items-start w-full h-[313.5px]">
        {posts.slice(0, 2).map((p) => (
          <RelatedPostCard key={p._id} post={p} />
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main template                                                      */
/* ------------------------------------------------------------------ */

export default function BlogPostTemplate({
  post,
  relatedPosts = [],
  calendlyUrl = DEFAULT_CALENDLY,
}: BlogPostTemplateProps) {
  const readingTime = estimateReadingTime(post.body)
  const headings = extractHeadings(post.body)

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.author ? { author: { "@type": "Person", name: post.author } } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    publisher: { "@type": "Organization", name: "Fruition" },
  }

  return (
    <div className="bg-surface w-full font-montserrat">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <div className="mx-auto w-full max-w-[1470px] flex items-start justify-center px-[24px] sm:px-[48px] lg:px-[80px] xl:px-[273px] py-[48px] lg:py-[80px]">
        <div className="flex flex-col gap-[40px] items-center justify-center w-full max-w-[924px]">
          {/* Author meta */}
          <AuthorMetaRow
            author={post.author}
            publishedAt={post.publishedAt}
            readingTime={readingTime}
          />

          {/* Title */}
          <ArticleTitle title={post.title} />

          {/* Quick-read jump-to (auto-generated from headings) */}
          {headings.length >= 3 && (
            <div className="w-full">
              <ArticleToc entries={headings} />
            </div>
          )}

          {/* Body */}
          <div className="flex flex-col items-start pb-[0.5px] w-full">
            {/* Cover image as first figure inside body */}
            {post.coverImage && (
              <CoverFigure image={post.coverImage} alt={post.title} />
            )}

            {/* Portable text */}
            {post.body && (
              <PortableText
                value={post.body}
                components={blogPortableTextComponents}
              />
            )}

            {/* Video embeds */}
            {post.videoUrls && post.videoUrls.length > 0 && (
              <VideoEmbeds urls={post.videoUrls} />
            )}
          </div>

          {/* Bottom-of-article conversion CTA */}
          <InlineAuditCta calendlyUrl={calendlyUrl} />

          {/* Tags (from categories) */}
          {post.categories && post.categories.length > 0 && (
            <TagsRow categories={post.categories} />
          )}

          {/* Engagement bar */}
          <EngagementBar />

          {/* Related posts */}
          <RelatedPostsSection posts={relatedPosts} />
        </div>
      </div>
    </div>
  )
}
