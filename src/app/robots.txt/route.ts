// Serves robots.txt from the app so we control the Content-Signal line.
// Cloudflare's managed robots.txt (Security > Settings > "block training in
// robots.txt") must stay OFF for this zone, or Cloudflare will prepend its own
// conflicting Content-Signal block (its managed content is fixed at
// ai-train=no with no ai-input signal and cannot be customized).
//
// Per the 2026-07 technical audit (Vadim, ai-train=yes approved by Josh):
// search=yes, ai-train=yes, ai-input=yes, use=reference.

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fruitionservices.io'

const CONTENT_SIGNAL = 'search=yes, ai-train=yes, ai-input=yes, use=reference'

// Deliberately NOT disallowed:
// - /consulting-blog/{tags,hashtags,search}/ — Wix-era URLs with a stale
//   "noindex" classification in Search Console. They 404 on this site, but
//   Google can only discover that if it is allowed to recrawl them.
// - /consulting-blog/categories/ — noindexed via page metadata; a robots
//   block would stop Google from ever seeing that tag.
// - /faqs?category=... — consolidated onto /faqs via its canonical URL.
// /s/ are short links that redirect to pages Google already has — indexing
// them would only create duplicates of the destinations.
const DISALLOW = ['/internal/', '/studio/', '/s/']

const POLICY_PREAMBLE = `# As a condition of accessing this website, you agree to abide by the following
# content signals:

# (a)  If a Content-Signal = yes, you may collect content for the corresponding
#      use.
# (b)  If a Content-Signal = no, you may not collect content for the
#      corresponding use.
# (c)  If the website operator does not include a Content-Signal for a
#      corresponding use, the website operator neither grants nor restricts
#      permission via Content-Signal with respect to the corresponding use.

# The content signals and their meanings are:

# search:   building a search index and providing search results (e.g., returning
#           hyperlinks and short excerpts from your website's contents). Search does not
#           include providing AI-generated search summaries.
# ai-input: inputting content into one or more AI models (e.g., retrieval
#           augmented generation, grounding, or other real-time taking of content for
#           generative AI search answers).
# ai-train: training or fine-tuning AI models.
# use:      how AI systems may consume the content (immediate, reference, or full).

# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS ARE EXPRESS RESERVATIONS OF
# RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT
# AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET.`

export const dynamic = 'force-static'

export function GET(): Response {
  const body = [
    POLICY_PREAMBLE,
    [
      'User-agent: *',
      `Content-Signal: ${CONTENT_SIGNAL}`,
      'Allow: /',
      ...DISALLOW.map((path) => `Disallow: ${path}`),
    ].join('\n'),
    `Host: ${BASE}\nSitemap: ${BASE}/sitemap.xml`,
  ].join('\n\n')

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
