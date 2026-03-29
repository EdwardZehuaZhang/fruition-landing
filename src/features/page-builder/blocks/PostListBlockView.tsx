import Link from 'next/link'
import { getBlogPosts } from '@/sanity/queries'

interface PostListBlockProps {
  heading?: string
  limit?: number
}

export default async function PostListBlockView({ heading, limit = 3 }: PostListBlockProps) {
  const posts = await getBlogPosts(limit, 0)

  return (
    <section>
      {heading && <h2>{heading}</h2>}
      {posts && posts.length > 0 ? (
        <ul>
          {posts.map((post: { _id: string; title: string; slug: string }) => (
            <li key={post._id}>
              <Link href={`/post/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts yet.</p>
      )}
    </section>
  )
}
