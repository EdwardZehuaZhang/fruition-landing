"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import BlogCard from "@/components/BlogCard"
import { loadMoreBlogPosts } from "@/app/consulting-blog/actions"

type BlogPost = Parameters<typeof BlogCard>[0] & { _id?: string }

interface BlogInfiniteListProps {
  initialPosts: BlogPost[]
  pageSize?: number
}

export default function BlogInfiniteList({
  initialPosts,
  pageSize = 12,
}: BlogInfiniteListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
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

  useEffect(() => {
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
  }, [fetchNext, hasMore])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post._id ?? post.slug} {...post} />
        ))}
      </div>

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

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-12">
          You&apos;ve reached the end.
        </p>
      )}
    </>
  )
}
