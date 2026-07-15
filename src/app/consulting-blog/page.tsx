import { getBlogPosts, getBlogCategories, getPageBySlug } from "@/sanity/queries"
import { buildOgMetadata } from "@/lib/metadata"
import BlogFilterableList from "@/components/BlogFilterableList"

interface BlogCategory {
  slug: string
  title: string
}

const INITIAL_PAGE_SIZE = 12

export async function generateMetadata() {
  const page = await getPageBySlug("consulting-blog")
  const title = page?.seoTitle ?? "Consulting Blog — Fruition"
  const description = page?.seoDescription ?? "Expert insights on monday.com, AI consulting, Atlassian, HubSpot, and workflow automation."
  return buildOgMetadata({
    title,
    description,
    path: "/consulting-blog",
  })
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
        <h1 className="text-4xl font-bold text-body mb-4">{page.heroHeading}</h1>
      )}
      {page?.heroSubheading && (
        <p className="text-lg text-muted mb-8">{page.heroSubheading}</p>
      )}

      <BlogFilterableList
        initialPosts={posts}
        categories={categories as BlogCategory[]}
        pageSize={INITIAL_PAGE_SIZE}
      />
    </div>
  )
}
