export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'text' },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'About', value: 'about' },
          { title: 'Careers', value: 'careers' },
          { title: 'Blog Listing', value: 'blog-listing' },
          { title: 'Thank You', value: 'thank-you' },
          { title: 'Terms', value: 'terms' },
          { title: 'Privacy', value: 'privacy' },
        ],
      },
    },
  ],
}
