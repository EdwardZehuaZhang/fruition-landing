"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Site-wide breadcrumb bar, rendered by SiteFrame directly under the navbar so
 * every marketing page — legacy and practice-cluster alike — gets the same
 * trail (§05: breadcrumb schema on every page). Labels derive from the path;
 * LABELS overrides the prettifier where kebab-case can't be prettified into
 * the real page name.
 */

const HIDDEN_PREFIXES = ['/internal', '/studio', '/post', '/api']

/** Parents that exist as real pages — intermediates outside this set render as plain text. */
const LINKABLE_PARENTS = new Set([
  '/ai-consulting',
  '/atlassian-consulting',
  '/hubspot-consulting',
  '/integrations',
  '/monday-products',
  '/monday-consulting-solutions',
  '/partnerships',
  '/consulting-blog',
])

const LABELS: Record<string, string> = {
  'consulting-blog': 'Blog',
  'customer-testimonials': 'Case Studies',
  'fruition-team': 'Meet the Team',
  'monday-consulting-solutions': 'monday.com Solutions',
  'monday-products': 'monday.com Products',
  'rag-knowledge-systems': 'RAG & Knowledge Systems',
  'operations-back-office': 'Operations & Back-office',
  'jira-to-monday-migration': 'Jira → monday Migration',
  'hubspot-to-monday-migration': 'HubSpot → monday Migration',
  'monday-hubspot-integration': 'monday ↔ HubSpot Integration',
  'work-management': 'Work Management',
  'terms-and-conditions': 'Terms & Conditions',
  'monday-for-cabinetry-renovation': 'Installation & Renovation',
  'solar-crm-solution': 'Solar CRM Solution',
}

/** Whole words that need casing the title-case fallback can't produce. */
const WORD_FIXUPS: Record<string, string> = {
  monday: 'monday.com',
  ai: 'AI',
  crm: 'CRM',
  hr: 'HR',
  it: 'IT',
  faqs: 'FAQs',
  rag: 'RAG',
  jira: 'Jira',
  jsm: 'JSM',
  hubspot: 'HubSpot',
  atlassian: 'Atlassian',
  openai: 'OpenAI',
  chatgpt: 'ChatGPT',
  aws: 'AWS',
  n8n: 'n8n',
  clickup: 'ClickUp',
  us: 'US',
  uk: 'UK',
}

const LOWERCASE_WORDS = new Set(['for', 'and', 'to', 'the', 'of', 'with', 'in'])

function labelFor(segment: string): string {
  if (LABELS[segment]) return LABELS[segment]
  return segment
    .split('-')
    .map((word, i) => {
      if (WORD_FIXUPS[word]) {
        // "monday" only means monday.com when it starts the slug (monday-for-…),
        // not mid-slug (jira-to-monday-migration is handled by LABELS anyway)
        if (word === 'monday' && i > 0) return 'monday'
        return WORD_FIXUPS[word]
      }
      if (i > 0 && LOWERCASE_WORDS.has(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export default function Breadcrumbs() {
  const pathname = usePathname()

  if (!pathname || pathname === '/' || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null
  }

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const crumbs = segments.map((segment, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/')
    return {
      label: labelFor(segment),
      href,
      isLast: i === segments.length - 1,
      linkable: i === segments.length - 1 ? false : LINKABLE_PARENTS.has(href),
    }
  })

  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fruitionservices.io'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      ...crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.label,
        item: `${BASE}${c.href}`,
      })),
    ],
  }

  return (
    <div className="bg-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="max-w-[1348px] mx-auto px-4 xl:px-0 pt-5">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <li>
            <Link href="/" className="hover:text-[#8015e8] transition-colors">Home</Link>
          </li>
          {crumbs.map((c) => (
            <li key={c.href} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              {c.isLast ? (
                <span className="text-body font-medium">{c.label}</span>
              ) : c.linkable ? (
                <Link href={c.href} className="hover:text-[#8015e8] transition-colors">{c.label}</Link>
              ) : (
                <span>{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
