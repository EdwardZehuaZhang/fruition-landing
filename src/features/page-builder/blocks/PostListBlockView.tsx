import Link from 'next/link'
import { getBlogPosts } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

interface PostListBlockProps {
  heading?: string
  subheading?: string
  limit?: number
}

export default async function PostListBlockView({ heading, subheading, limit = 6 }: PostListBlockProps) {
  const posts = await getBlogPosts(limit, 0)

  if (!posts || posts.length === 0) return null

  return (
    <section className="bg-white py-[80px] px-4">
      <div className="mx-auto max-w-[959px] flex flex-col items-center gap-[24px]">
        {/* Header */}
        <div className="flex flex-col gap-[12px] items-center w-full text-center">
          <h2 className="text-[35px] font-medium text-black leading-[49px]">
            {heading || "Don\u2019t miss our latest pieces"}
          </h2>
          <p className="text-[20px] text-black text-center">
            {subheading || "Grab our latest guides, articles, and case studies to see all the ways monday.com could make your life easier."}
          </p>
        </div>

        {/* Blog cards grid */}
        <div className="flex flex-wrap justify-center gap-[16px] w-full">
          {posts.map((post: {
            _id: string
            title: string
            slug: string
            excerpt?: string
            publishedAt?: string
            coverImage?: { asset: { _ref: string } }
            categories?: { title: string; slug: string }[]
          }) => (
            <Link
              key={post._id}
              href={`/post/${post.slug}`}
              className="group flex flex-col w-[307px] overflow-hidden hover:opacity-90 transition"
            >
              {post.coverImage?.asset && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(post.coverImage).width(307).height(173).url()}
                  alt={post.title}
                  width={307}
                  height={173}
                  className="h-[173px] w-full object-cover"
                />
              )}
              {!post.coverImage?.asset && (
                <div className="h-[173px] w-full bg-gradient-to-br from-[#8015e8] to-[#ba83f0]" />
              )}
              <div className="flex flex-col items-center px-[6px] pt-[28px] pb-[25px] h-[172px]">
                {post.categories && post.categories.length > 0 && (
                  <span className="mb-3 inline-block rounded-sm bg-[#604c97] px-2 py-0.5 text-[14px] font-extralight text-white">
                    {post.categories[0].title}
                  </span>
                )}
                <h3 className="text-[14px] font-semibold text-black text-center line-clamp-3 group-hover:text-[#8015e8] transition-colors">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA button */}
        <Link
          href="/consulting-blog"
          className="flex items-center justify-center h-[53px] w-[275px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
        >
          ✍️ Check Out Our Blog
        </Link>
      </div>
    </section>
  )
}
