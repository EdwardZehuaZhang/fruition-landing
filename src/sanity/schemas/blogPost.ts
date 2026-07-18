export default {
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r: any) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "publishedAt", title: "Published At", type: "datetime" },
    { name: "author", title: "Author", type: "string" },
    { name: "coverImage", title: "Cover Image", type: "image" },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogCategory" }] }],
    },
    { name: "excerpt", title: "Excerpt", type: "text" },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          fields: [
            { name: "alt", title: "Alt Text", type: "string" },
            { name: "caption", title: "Caption", type: "string" },
          ],
        },
        {
          type: "object",
          name: "videoEmbed",
          title: "Video",
          fields: [
            {
              name: "url",
              title: "Video URL (YouTube, Vimeo, Twitch, or Loom)",
              type: "url",
              validation: (r: any) => r.required(),
            },
            { name: "caption", title: "Caption", type: "string" },
          ],
          preview: {
            select: { url: "url", caption: "caption" },
            prepare({ url, caption }: { url?: string; caption?: string }) {
              return { title: caption || "Video", subtitle: url }
            },
          },
        },
        {
          type: "object",
          name: "table",
          title: "Table",
          fields: [
            {
              name: "rows",
              title: "Rows",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "tableRow",
                  title: "Row",
                  fields: [
                    { name: "cells", title: "Cells", type: "array", of: [{ type: "string" }] },
                  ],
                  preview: {
                    select: { cells: "cells" },
                    prepare({ cells }: { cells?: string[] }) {
                      return { title: (cells ?? []).join(" | ") || "Row" }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { rows: "rows" },
            prepare({ rows }: { rows?: unknown[] }) {
              return { title: "Table", subtitle: `${rows?.length ?? 0} rows` }
            },
          },
        },
      ],
    },
    {
      name: "videoUrls",
      title: "Video URLs",
      type: "array",
      description: "YouTube or other video embed URLs found in the original post",
      of: [{ type: "url" }],
    },
    {
      name: "seoKeyword",
      title: "SEO Keyword",
      type: "string",
      description: "Primary keyword this post targets",
    },
    { name: "seoTitle", title: "SEO Title", type: "string" },
    { name: "seoDescription", title: "SEO Description", type: "text" },
    {
      name: "industry",
      title: "Industry",
      type: "string",
      options: {
        list: [
          { title: "AI", value: "ai" },
          { title: "Construction", value: "construction" },
          { title: "HR", value: "hr" },
          { title: "Real Estate", value: "real-estate" },
          { title: "Marketing", value: "marketing" },
          { title: "SaaS", value: "saas" },
          { title: "Professional Services", value: "professional-services" },
          { title: "Manufacturing", value: "manufacturing" },
          { title: "Product", value: "product" },
        ],
      },
    },
    {
      name: "mondayItemId",
      title: "monday.com Item ID",
      type: "string",
      description: "Round-trip link to the Blogs board item that produced this post",
      readOnly: true,
    },
  ],
}