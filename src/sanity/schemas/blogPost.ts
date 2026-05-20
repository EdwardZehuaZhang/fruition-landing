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
      ],
    },
    {
      name: "videoUrls",
      title: "Video URLs",
      type: "array",
      description: "YouTube or other video embed URLs found in the original post",
      of: [{ type: "url" }],
    },
    { name: "seoTitle", title: "SEO Title", type: "string" },
    { name: "seoDescription", title: "SEO Description", type: "text" },
    {
      name: "industry",
      title: "Industry",
      type: "string",
      options: {
        list: [
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