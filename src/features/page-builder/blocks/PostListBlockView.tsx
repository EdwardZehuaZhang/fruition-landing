import Link from 'next/link'
import { getBlogPosts } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

interface PostListBlockProps {
  heading?: string
  limit?: number
}

export default async function PostListBlockView({ heading, limit = 6 }: PostListBlockProps) {
  const posts = await getBlogPosts(limit, 0)

  if (!posts || posts.length === 0) return null

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="mx-auto max-w-6xl">
        {heading && (
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              className="group flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              {post.coverImage?.asset && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(post.coverImage).width(600).height(300).url()}
                  alt={post.title}
                  width={600}
                  height={300}
                  className="h-44 w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-6">
                {post.categories && post.categories.length > 0 && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-600">
                    {post.categories[0].title}
                  </p>
                )}
                <h3 className="mb-2 text-base font-bold text-gray-900 group-hover:text-purple-700 line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-auto text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/consulting-blog"
            className="inline-block rounded-full border border-purple-600 px-8 py-3 font-semibold text-purple-600 transition hover:bg-purple-600 hover:text-white"
          >
            Check Out Our Blog
          </Link>
        </div>
      </div>
    </section>
  )
}
