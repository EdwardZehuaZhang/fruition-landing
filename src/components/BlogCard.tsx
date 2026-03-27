import Link from "next/link"
import Image from "next/image"

interface BlogCardProps {
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  author?: string
  coverImage?: {asset: {_ref: string}}
}

export default function BlogCard({ title, slug, excerpt, publishedAt, author, coverImage }: BlogCardProps) {
  const imageUrl = coverImage?.asset?._ref
    ? `https://cdn.sanity.io/images/bt6nb58h/production/${coverImage.asset._ref.replace("image-", "").replace(/-(\w+)$/, ".$1")}?w=600&h=340&fit=crop`
    : null

  return (
    <Link href={`/post/${slug}`} className="group block border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 line-clamp-2">{title}</h3>
        {excerpt && <p className="text-sm text-gray-600 line-clamp-3 mb-3">{excerpt}</p>}
        <p className="text-xs text-gray-400">
          {author && <span>{author} &bull; </span>}
          {publishedAt && new Date(publishedAt).toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric" })}
        </p>
      </div>
    </Link>
  )
}