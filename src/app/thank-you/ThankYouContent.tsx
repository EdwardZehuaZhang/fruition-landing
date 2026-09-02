"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { THANK_YOU_MESSAGE_KEY, THANK_YOU_REDIRECT_SECONDS } from "@/lib/thankYou"

export interface ThankYouPost {
  _id?: string
  title?: string
  slug?: string
  excerpt?: string
  charCount?: number
  categories?: { _id?: string; title?: string; slug?: string }[]
}

interface ThankYouContentProps {
  posts: ThankYouPost[]
  /** Where the countdown lands. */
  nextPath: string
}

/** Total dwell time before the redirect fires. */
const TOTAL_SECONDS = THANK_YOU_REDIRECT_SECONDS

/**
 * Elapsed second each step takes over. The last step is the longest because it
 * is the one carrying the articles — the visitor should have time to pick one
 * before the page moves for them.
 */
const STEP_STARTS = [0, 3, 6]

const DEFAULT_MESSAGE = "Thanks — we'll be in touch within one business day."

const NEXT_STEPS = [
  {
    title: "We route it to the right consultant",
    body: "Your enquiry goes to the practice lead who covers your platform and region — not a shared inbox.",
  },
  {
    title: "You get a reply within one business day",
    body: "A real response from the person who would run the work, with a read on what you have described.",
  },
  {
    title: "We come prepared",
    body: "If we book a call, we arrive having already looked at your stack. No discovery theatre.",
  },
]

export default function ThankYouContent({ posts, nextPath }: ThankYouContentProps) {
  const router = useRouter()
  const [remaining, setRemaining] = useState(TOTAL_SECONDS)
  const [paused, setPaused] = useState(false)
  /** Set once the visitor drives the sequence themselves. */
  const [pickedStep, setPickedStep] = useState<number | null>(null)
  const [message, setMessage] = useState(DEFAULT_MESSAGE)

  const elapsed = TOTAL_SECONDS - remaining
  const autoStep = STEP_STARTS.reduce((acc, start, i) => (elapsed >= start ? i : acc), 0)
  const step = pickedStep ?? autoStep
  const progress = Math.min(1, elapsed / TOTAL_SECONDS)

  // The line the form that sent them here promised, if it left one. Read on
  // mount rather than during render: the server has no session storage, so the
  // default line is what hydrates.
  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.sessionStorage.getItem(THANK_YOU_MESSAGE_KEY)
    } catch {
      /* private mode / storage disabled — the default line is already correct */
    }
    if (!stored) return
    const line = stored
    // Deferred, not synchronous, to keep the effect body free of a setState
    // cascade — and a timeout rather than rAF, because rAF does not run while
    // the tab is in the background and the line would then never appear.
    // Clearing happens inside the callback, not before it: a cancelled effect
    // (Strict Mode double-invokes this in dev) must leave the line in storage
    // for the run that sticks.
    const id = window.setTimeout(() => {
      setMessage(line)
      try {
        window.sessionStorage.removeItem(THANK_YOU_MESSAGE_KEY)
      } catch {
        /* nothing to clean up if storage was unavailable */
      }
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    router.prefetch(nextPath)
  }, [router, nextPath])

  // One timeout per second rather than an interval: pausing and resuming is
  // then just a re-run of this effect, with no drift to reconcile.
  useEffect(() => {
    if (paused) return
    if (remaining <= 0) {
      router.replace(nextPath)
      return
    }
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => window.clearTimeout(id)
  }, [paused, remaining, router, nextPath])

  /** Driving the sequence by hand stops the clock — WCAG 2.2.1. */
  const selectStep = useCallback((i: number) => {
    setPickedStep(i)
    setPaused(true)
  }, [])

  const steps = [
    {
      label: "Received",
      title: "Your request is in",
      body: (
        <>
          <p className="text-body-lead text-muted">{message}</p>
          <p className="mt-4 text-body-sm text-muted">
            Nothing else is needed from you right now. If it is urgent, reply to the
            confirmation email and it will land straight with the consultant.
          </p>
        </>
      ),
    },
    {
      label: "What's next",
      title: "What happens next",
      body: (
        <ol className="flex flex-col gap-5">
          {NEXT_STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span
                aria-hidden
                className="flex size-7 flex-none items-center justify-center rounded-pill bg-brand-soft font-mono text-micro text-brand"
              >
                {i + 1}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-caption text-body">{s.title}</span>
                <span className="text-body-sm text-muted">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      label: "Read next",
      title: "While you wait",
      body:
        posts.length > 0 ? (
          <ul className="flex flex-col divide-y divide-ui border-y border-ui">
            {posts.map((post) => {
              const readTime = post.charCount
                ? Math.max(1, Math.round(post.charCount / 5 / 200))
                : 5
              return (
                <li key={post._id ?? post.slug}>
                  <Link
                    href={`/post/${post.slug}`}
                    className="group flex flex-col gap-1 py-4 transition-colors hover:bg-mist motion-reduce:transition-none"
                  >
                    <span className="text-caption text-body group-hover:text-brand">
                      {post.title}
                    </span>
                    <span className="font-mono text-micro uppercase tracking-[0.08em] text-faint">
                      {post.categories?.[0]?.title
                        ? `${post.categories[0].title} · ${readTime} min read`
                        : `${readTime} min read`}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-body-lead text-muted">
            Our consultants write up the builds they ship — automations, migrations and the
            things that went wrong on the way. Worth a read while you wait.
          </p>
        ),
    },
  ]

  const current = steps[step]

  return (
    <div className="bg-surface">
      <section className="mx-auto w-full max-w-[760px] px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <span
            aria-hidden
            className="flex size-14 items-center justify-center rounded-pill bg-emerald/10 text-emerald"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-7">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="mt-5 font-mono text-micro uppercase tracking-[0.12em] text-brand">
            Request received
          </span>
          <h1 className="mt-3 text-display text-body">Thanks — we have it.</h1>
        </div>

        {/* Step rail. Selecting one takes the sequence off the clock. */}
        <nav aria-label="Confirmation steps" className="mt-10 flex gap-2 md:gap-3">
          {steps.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => selectStep(i)}
              aria-current={i === step ? "step" : undefined}
              className="group flex flex-1 flex-col gap-2 text-left"
            >
              <span
                aria-hidden
                className={`h-[3px] rounded-pill transition-colors motion-reduce:transition-none ${
                  i <= step ? "bg-brand" : "bg-mist group-hover:bg-lilac"
                }`}
              />
              <span
                className={`font-mono text-micro uppercase tracking-[0.08em] transition-colors motion-reduce:transition-none ${
                  i === step ? "text-body" : "text-faint group-hover:text-body"
                }`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-6 rounded-card border border-ui bg-surface-raised p-6 shadow-micro md:p-8">
          <h2 className="text-section-h3 text-body">{current.title}</h2>
          <div className="mt-5">{current.body}</div>
        </div>

        {/* Live region: the step, not the ticking number — a per-second
            announcement would talk over everything else on the page. */}
        <p role="status" className="sr-only">
          Step {step + 1} of {steps.length}: {current.title}
        </p>

        <div className="mt-8 flex flex-col gap-4 rounded-card border border-ui bg-surface-subtle p-5 md:p-6">
          <div className="h-[3px] w-full overflow-hidden rounded-pill bg-mist">
            <div
              aria-hidden
              className="h-full w-full origin-left rounded-pill bg-brand transition-transform duration-1000 ease-linear motion-reduce:transition-none"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-body-sm text-muted">
              {paused ? (
                "Auto-redirect off — take your time."
              ) : (
                <>
                  Taking you to the consulting blog in{" "}
                  <span className="font-mono text-body">{Math.max(0, remaining)}s</span>
                </>
              )}
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Link href={nextPath} className="cta-btn cta-btn-primary">
                Read the blog now
              </Link>
              {!paused && (
                <button
                  type="button"
                  onClick={() => setPaused(true)}
                  className="cta-btn cta-btn-outline"
                >
                  Stay on this page
                </button>
              )}
            </div>
          </div>

          <p className="sr-only">
            This page moves to the consulting blog automatically about ten seconds after it
            loads. Choose &ldquo;Stay on this page&rdquo; to stop that.
          </p>
        </div>
      </section>
    </div>
  )
}
