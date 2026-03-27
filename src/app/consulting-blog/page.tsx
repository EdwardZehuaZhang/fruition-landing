import { getBlogPosts, getBlogCategories } from "@/sanity/queries"
import BlogCard from "@/components/BlogCard"
import Link from "next/link"

export const metadata = {
  title: "monday.com Blog | Fruition Services",
  description: "Expert insights on monday.com implementation, CRM, automation, and more.",
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getBlogPosts(24, 0), getBlogCategories()])

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Consulting Blog</h1>
      <p className="text-lg text-gray-600 mb-8">Insights, guides, and updates from the Fruition team.</p>

      <div className="flex flex-wrap gap-2 mb-10">
        <Link href="/consulting-blog" className="px-3 py-1 bg-blue-700 text-white rounded-full text-sm">All Posts</Link>
        {categories.map((cat: { slug: { current: string }, title: string }) => (
          <Link key={cat.slug.current} href={`/consulting-blog/categories/${cat.slug.current}`}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-50">
            {cat.title}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Parameters<typeof BlogCard>[0]) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  )
}