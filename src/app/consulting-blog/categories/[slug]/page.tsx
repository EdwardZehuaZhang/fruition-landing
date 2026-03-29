import { getBlogPosts, getBlogCategories } from "@/sanity/queries"
import BlogCard from "@/components/BlogCard"

interface BlogCategoryRef { slug: string }

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts = await getBlogPosts(300, 0)
  const filtered = posts.filter((p: { categories?: BlogCategoryRef[] }) =>
    p.categories?.some((c) => c.slug === slug)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize">{slug.replace(/-/g, " ")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post: Parameters<typeof BlogCard>[0]) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const categories = await getBlogCategories()
  return categories
    .filter((c: { slug?: string }) => typeof c.slug === 'string' && c.slug.length > 0)
    .map((c: { slug: string }) => ({ slug: c.slug }))
}
