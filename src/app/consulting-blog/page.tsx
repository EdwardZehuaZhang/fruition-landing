import { getBlogPosts, getBlogCategories, getPageBySlug } from "@/sanity/queries"
import BlogInfiniteList from "@/components/BlogInfiniteList"
import Link from "next/link"

interface BlogCategory {
  slug: string
  title: string
}

const INITIAL_PAGE_SIZE = 12

export async function generateMetadata() {
  const page = await getPageBySlug("consulting-blog")
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function BlogPage() {
  const [posts, categories, page] = await Promise.all([
    getBlogPosts(INITIAL_PAGE_SIZE, 0),
    getBlogCategories(),
    getPageBySlug("consulting-blog"),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {page?.heroHeading && (
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.heroHeading}</h1>
      )}
      {page?.heroSubheading && (
        <p className="text-lg text-gray-600 mb-8">{page.heroSubheading}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-10">
        <Link href="/consulting-blog" className="px-3 py-1 bg-blue-700 text-white rounded-full text-sm">All Posts</Link>
        {categories.map((cat: BlogCategory) => (
          <Link key={cat.slug} href={`/consulting-blog/categories/${cat.slug}`}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-50">
            {cat.title}
          </Link>
        ))}
      </div>

      <BlogInfiniteList initialPosts={posts} pageSize={INITIAL_PAGE_SIZE} />
    </div>
  )
}
