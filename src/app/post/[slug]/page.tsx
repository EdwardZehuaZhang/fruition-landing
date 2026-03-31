import { getBlogPostBySlug, getBlogPosts } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

interface BlogCategory {
  slug: string
  title: string
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export const revalidate = 3600
export const dynamicParams = true

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <div className="flex gap-2 mb-4 flex-wrap">
        {post.categories?.map((cat: BlogCategory) => (
          <Link key={cat.slug} href={`/consulting-blog/categories/${cat.slug}`}
            className="text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100">
            {cat.title}
          </Link>
        ))}
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-8">
        {post.author && <span>{post.author} &bull; </span>}
        {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" })}
      </p>
      {post.coverImage && (
        <div className="relative w-full h-80 mb-10 rounded-xl overflow-hidden">
          <Image src={urlFor(post.coverImage).width(800).url()} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <div className="prose prose-lg max-w-none">
        {post.body && <PortableText value={post.body} components={portableTextComponents} />}
      </div>

      {post.videoUrls && post.videoUrls.length > 0 && (
        <div className="mt-10 space-y-6">
          {post.videoUrls.map((url: string, i: number) => {
            const embedUrl = getYouTubeEmbedUrl(url)
            if (!embedUrl) return null
            return (
              <div key={i} className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={embedUrl}
                  title={`Video ${i + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-16 p-8 bg-blue-50 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to transform your workflows?</h3>
        <p className="text-gray-600 mb-6">Talk to a Fruition monday.com expert today.</p>
        <a href="https://calendly.com/global-calendar-fruitionservices"
          className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800">
          Book a Free Consultation
        </a>
      </div>
    </article>
  )
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