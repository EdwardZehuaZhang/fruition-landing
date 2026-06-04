"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import BlogCard from "@/components/BlogCard"
import { loadMoreBlogPosts } from "@/app/consulting-blog/actions"

interface BlogCategoryRef {
  _id?: string
  title?: string
  slug: string
}

type BlogPost = Parameters<typeof BlogCard>[0] & {
  _id?: string
  categories?: BlogCategoryRef[]
}

interface BlogFilterableListProps {
  initialPosts: BlogPost[]
  categories: { slug: string; title: string }[]
  pageSize?: number
}

export default function BlogFilterableList({
  initialPosts,
  categories,
  pageSize = 12,
}: BlogFilterableListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [activeSlug, setActiveSlug] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadingRef = useRef(false)

  const fetchNext = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)
    try {
      const next = (await loadMoreBlogPosts(posts.length, pageSize)) as BlogPost[]
      if (!next || next.length === 0) {
        setHasMore(false)
        return
      }
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p._id ?? p.slug))
        const merged = [...prev]
        for (const post of next) {
          const key = post._id ?? post.slug
          if (!seen.has(key)) {
            seen.add(key)
            merged.push(post)
          }
        }
        return merged
      })
      if (next.length < pageSize) setHasMore(false)
    } catch (err) {
      console.error("Failed to load more blog posts", err)
      setHasMore(false)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [hasMore, pageSize, posts.length])

  const filtered = useMemo(() => {
    if (activeSlug === "all") return posts
    return posts.filter((p) => p.categories?.some((c) => c.slug === activeSlug))
  }, [posts, activeSlug])

  // Infinite scroll for "All".
  useEffect(() => {
    if (activeSlug !== "all") return
    const el = sentinelRef.current
    if (!el || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) fetchNext()
      },
      { rootMargin: "600px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNext, hasMore, activeSlug])

  // When a category is selected, eagerly load remaining pages so the filter
  // sees the full set (posts are paginated server-side across all categories).
  useEffect(() => {
    if (activeSlug === "all" || !hasMore || loading) return
    fetchNext()
  }, [activeSlug, hasMore, loading, fetchNext])

  const pillBase = "px-3 py-1 rounded-full text-sm transition-colors"

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setActiveSlug("all")}
          className={`${pillBase} ${
            activeSlug === "all"
              ? "bg-blue-700 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-50"
          }`}
        >
          All Posts
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setActiveSlug(cat.slug)}
            className={`${pillBase} ${
              activeSlug === cat.slug
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post) => (
          <BlogCard key={post._id ?? post.slug} {...post} />
        ))}
      </div>

      {activeSlug !== "all" && filtered.length === 0 && !loading && (
        <p className="text-center text-sm text-gray-400 py-12">
          No posts in this category yet.
        </p>
      )}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-12">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
              Loading more posts…
            </div>
          ) : (
            <span className="h-px w-full" aria-hidden />
          )}
        </div>
      )}

      {!hasMore && activeSlug === "all" && posts.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-12">
          You&apos;ve reached the end.
        </p>
      )}
    </>
  )
}
