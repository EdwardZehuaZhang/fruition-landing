"use server"

import { getBlogPosts } from "@/sanity/queries"

export async function loadMoreBlogPosts(offset: number, limit = 12) {
  return getBlogPosts(limit, offset)
}
