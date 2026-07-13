import Link from 'next/link'
import {
  DISCOVERY_CALL_URL,
  GEO_REGIONS,
  PRACTICE_LEADER,
  type PracticePage,
} from '@/data/practicePages/types'

/**
 * Shared renderer for the Site Architecture v2.1 practice clusters
 * (/atlassian-consulting, /hubspot-consulting, /ai-consulting, /integrations,
 * /monday-products). Sections mirror Josh's approved mockups: hero, numbered
 * approach, services, child pages, geographic coverage, practice leader,
 * FAQ (with FAQPage JSON-LD), closing CTA. The breadcrumb bar and its
 * BreadcrumbList JSON-LD render site-wide via SiteFrame > Breadcrumbs.
 */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8015e8] mb-3">
      {children}
    </p>
  )
}

function CtaButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${compact ? '' : 'mt-8'}`}>
      <a
        href={DISCOVERY_CALL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8015e8] to-[#ba83f0] hover:bg-[#579bfc] hover:bg-none text-white px-7 py-3 rounded-full text-sm font-semibold transition-colors shadow-md"
      >
        Book a discovery call →
      </a>
      {!compact && (
        <a
          href="#faq"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-[#8015e8] ring-1 ring-[#d9bff5] hover:ring-[#8015e8] transition-colors"
        >
          Common questions
        </a>
      )}
    </div>
  )
}

export default function PracticePageTemplate({ page }: { page: PracticePage }) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return (
    // <div>, not <main> — SiteFrame already wraps marketing pages in <main>
    <div className="bg-surface text-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="border-b border-ui">
        {/* Breadcrumb trail renders site-wide via SiteFrame > Breadcrumbs */}
        <div className="max-w-[1148px] mx-auto px-4 pt-10 pb-16">
          <span className="inline-flex items-center rounded-full bg-[#f5edfd] text-[#8015e8] text-xs font-semibold px-3 py-1 mb-5">
            {page.eyebrow}
          </span>
          <h1 className="text-4xl md:text-[52px] md:leading-[1.1] font-bold max-w-[820px]">
            {page.heading}
            <span className="text-[#8015e8]">.</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-[680px] leading-relaxed">{page.lead}</p>
          <CtaButtons />
        </div>
      </section>

      {/* Approach */}
      <section className="border-b border-ui">
        <div className="max-w-[1148px] mx-auto px-4 py-16">
          <Eyebrow>{page.approachEyebrow ?? 'Our approach'}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">{page.approachHeading}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {page.approach.map((a, i) => (
              <div key={a.title} className="rounded-xl ring-1 ring-ui bg-surface-raised p-6">
                <div className="text-sm font-semibold text-[#8015e8] mb-3">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-b border-ui bg-surface-subtle">
        <div className="max-w-[1148px] mx-auto px-4 py-16">
          <Eyebrow>{page.servicesEyebrow ?? 'Services'}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">{page.servicesHeading}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {page.services.map((s) => (
              <div key={s.title} className="rounded-xl ring-1 ring-ui bg-surface-raised p-6">
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Child pages */}
      {page.children && page.children.length > 0 && (
        <section className="border-b border-ui">
          <div className="max-w-[1148px] mx-auto px-4 py-16">
            <Eyebrow>{page.childrenEyebrow ?? 'Explore'}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold mb-10">
              {page.childrenHeading ?? 'Go deeper.'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {page.children.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group rounded-xl ring-1 ring-ui bg-surface-raised p-6 flex items-start justify-between gap-4 hover:ring-[#8015e8] transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-[#8015e8] transition-colors">
                      {c.label}
                    </h3>
                    {c.description && (
                      <p className="text-sm text-muted leading-relaxed">{c.description}</p>
                    )}
                  </div>
                  <span aria-hidden className="text-[#8015e8] text-xl shrink-0 mt-0.5">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Geographic coverage */}
      <section className="border-b border-ui">
        <div className="max-w-[1148px] mx-auto px-4 py-16">
          <Eyebrow>Geographic coverage</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            Delivered locally across three regions.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {GEO_REGIONS.map((g) => (
              <div key={g.region} className="rounded-xl ring-1 ring-ui bg-surface-raised p-6">
                <div className="text-2xl mb-3" aria-hidden>{g.flag}</div>
                <h3 className="text-lg font-semibold">{g.region}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8015e8] mt-1 mb-3">
                  {g.cities}
                </p>
                <p className="text-sm text-muted leading-relaxed">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice leader */}
      <section className="border-b border-ui bg-surface-subtle">
        <div className="max-w-[1148px] mx-auto px-4 py-16">
          <Eyebrow>Who leads it</Eyebrow>
          <div className="grid md:grid-cols-[1fr_1.6fr] gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">{PRACTICE_LEADER.heading}</h2>
            </div>
            <div>
              <p className="text-base font-semibold">
                {PRACTICE_LEADER.name}
                <span className="text-muted font-normal"> · {PRACTICE_LEADER.title}</span>
              </p>
              <p className="mt-3 text-sm text-muted leading-relaxed">{PRACTICE_LEADER.bio}</p>
              <p className="mt-4 text-base font-medium text-body">{PRACTICE_LEADER.pull}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {PRACTICE_LEADER.badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center rounded-full ring-1 ring-ui bg-surface-raised text-xs font-medium px-3 py-1"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b border-ui">
        <div className="max-w-[1148px] mx-auto px-4 py-16">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            Common questions, answered directly.
          </h2>
          <div className="max-w-[820px] divide-y divide-ui rounded-xl ring-1 ring-ui bg-surface-raised">
            {page.faqs.map((f) => (
              <details key={f.q} className="group px-6 py-4">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-base font-semibold">
                  {f.q}
                  <span
                    aria-hidden
                    className="text-[#8015e8] transition-transform group-open:rotate-45 shrink-0 text-xl leading-none mt-0.5"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section>
        <div className="max-w-[1148px] mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to talk?</h2>
          <p className="mt-4 text-muted max-w-[520px] mx-auto">
            Book a 30-minute discovery call. We&apos;ll give you a frank read on scope, fit, and cost.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaButtons compact />
          </div>
        </div>
      </section>
    </div>
  )
}
