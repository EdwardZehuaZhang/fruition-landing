import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react"
import { PortableText } from "@portabletext/react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"

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
}

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
    h1: ({ children }) => (
      <h2 className="font-montserrat font-bold text-[28px] leading-[35px] text-black w-full py-[27.5px]">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h2 className="font-montserrat font-bold text-[28px] leading-[35px] text-black w-full py-[27.5px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-montserrat font-bold text-[22px] leading-[27px] text-black w-full pt-[27.5px] pb-[10px]">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-montserrat font-bold text-[18px] leading-[27px] text-black w-full pt-[27.5px]">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-montserrat font-normal text-[18px] leading-[27px] text-black w-full pt-[27.5px] pl-[20px] border-l-[3px] border-[#604c97] italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="font-montserrat font-normal text-[18px] leading-[27px] text-black w-full pt-[27.5px] first:pt-0">
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
      <li className="font-montserrat font-normal text-[18px] leading-[27px] text-black">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="font-montserrat font-normal text-[18px] leading-[27px] text-black">
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
        className="text-[#604c97] underline hover:no-underline"
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => (
      <Link
        href={value?.slug?.current ? `/${value.slug.current}` : "#"}
        className="text-[#604c97] underline hover:no-underline"
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
              <span className="font-montserrat font-normal text-[14px] leading-[27px] text-black text-center">
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
        background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)",
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
      <div className="flex flex-col h-[32px] items-start pr-[12px] w-[44px]">
        <div className="content-stretch flex flex-col items-start overflow-clip rounded-[16px] shrink-0 size-[32px]">
          <AuthorAvatar name={author} />
        </div>
      </div>
      {/* Name */}
      {author && (
        <div className="flex flex-col items-start shrink-0">
          <p className="font-montserrat font-normal text-[14px] leading-[21px] text-black whitespace-nowrap">
            {author}
          </p>
        </div>
      )}
      {/* Date */}
      {publishedAt && (
        <div className="flex gap-[6px] items-start pl-[6px] shrink-0 font-montserrat font-normal text-[14px] leading-[21px] text-black whitespace-nowrap">
          <span>·</span>
          <span>{formatDate(publishedAt)}</span>
        </div>
      )}
      {/* Reading time */}
      <div className="flex gap-[6px] items-start pl-[6px] shrink-0 font-montserrat font-normal text-[14px] leading-[21px] text-black whitespace-nowrap">
        <span>·</span>
        <span>{readingTime}</span>
      </div>
    </div>
  )
}

function ArticleTitle({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-start w-full">
      <h1 className="font-montserrat font-bold text-[40px] leading-[50px] text-black w-full">
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
        <div key={i} className="aspect-video w-full overflow-hidden">
          <iframe
            src={v.embed}
            title={`Video ${i + 1}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
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
          className="inline-flex items-start px-[13px] py-[7px] bg-white border border-[rgba(0,0,0,0.2)] hover:border-[#604c97] transition-colors"
        >
          <span className="font-montserrat font-normal text-[14px] leading-[17px] text-black">
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
                fill="black"
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
                fill="black"
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
                stroke="black"
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
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Views + like row — divider top, pt-19 */}
      <div className="relative flex items-center justify-between pt-[19px] w-full border-t border-[rgba(0,0,0,0.2)]">
        <div className="h-[21px]">
          <p className="font-montserrat font-normal text-[14px] leading-[21px] text-black whitespace-nowrap">
            0 views
          </p>
        </div>
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

function RelatedPostCard({ post }: { post: RelatedBlogPost }) {
  const imgSrc = post.coverImage?.asset?._ref
    ? urlFor(post.coverImage).width(580).height(324).url()
    : null
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group bg-white relative flex-1 min-w-0 max-w-[290.67px] self-stretch border border-[rgba(232,230,230,0.75)] hover:border-[#604c97] transition-colors overflow-hidden"
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
            <div className="size-full bg-gradient-to-br from-[#8015e8] to-[#ba83f0]" />
          )}
        </div>
        {/* Body */}
        <div className="flex flex-col items-start flex-1 w-full pt-[24px] px-[24px] pb-[24px]">
          <div className="flex flex-col items-start w-full overflow-hidden">
            <p className="font-montserrat font-bold text-[18px] leading-[normal] text-black w-full line-clamp-2 group-hover:text-[#604c97] transition-colors">
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
                    fill="black"
                  />
                </svg>
                <span className="font-montserrat font-normal text-[12px] leading-[18px] text-black">
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
          <h2 className="font-montserrat font-normal text-[18px] leading-[27px] text-black whitespace-nowrap">
            Recent Posts
          </h2>
        </div>
        <Link
          href="/consulting-blog"
          className="flex flex-col items-start self-stretch font-montserrat font-normal text-[14px] leading-[21px] text-black whitespace-nowrap hover:text-[#604c97] transition-colors"
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
}: BlogPostTemplateProps) {
  const readingTime = estimateReadingTime(post.body)

  return (
    <div className="bg-white w-full font-montserrat">
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
