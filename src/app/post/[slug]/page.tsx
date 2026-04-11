import { getBlogPostBySlug, getBlogPosts, getRelatedBlogPosts } from "@/sanity/queries"
import BlogPostTemplate from "@/components/BlogPostTemplate"
import { notFound } from "next/navigation"

export const revalidate = 3600
export const dynamicParams = true

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, relatedPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getRelatedBlogPosts(slug, 2),
  ])
  if (!post) notFound()

  return <BlogPostTemplate post={post} relatedPosts={relatedPosts} />
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(50, 0)
  return posts
    .filter((p: { slug?: string }) => typeof p.slug === "string" && p.slug.length > 0)
    .map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  }
}
