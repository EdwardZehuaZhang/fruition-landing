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

const DEFAULT_MESSAGE = "We'll be in touch within one business day."

/** Step 2, as the dashed ledger rows used for data elsewhere on the site. */
const HANDLING = [
  { label: "Who", value: "The consultant who covers your platform and region." },
  { label: "When", value: "Within one business day, Monday to Friday." },
  { label: "First question", value: "What you run now, and what isn't working." },
]

const MONO_LABEL = "font-mono text-micro uppercase tracking-[0.14em]"

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
      title: "What we have",
      body: (
        <div className="flex flex-col gap-4">
          <p className="text-body text-muted">{message}</p>
          <p className="text-body-sm text-muted">
            There is nothing else to do right now. If it is urgent, reply to the confirmation
            email and it goes straight to the consultant rather than back through the queue.
          </p>
        </div>
      ),
    },
    {
      label: "Who picks it up",
      title: "How it gets handled",
      body: (
        <dl className="flex flex-col">
          {HANDLING.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 border-b border-dashed border-ui py-3 md:flex-row md:items-baseline md:gap-6"
            >
              <dt className={`${MONO_LABEL} text-faint md:w-[140px] md:flex-none`}>{row.label}</dt>
              <dd className="text-body-sm text-body">{row.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      label: "Read next",
      title: posts.length > 0 ? "Recent writing" : "Where we are sending you",
      body:
        posts.length > 0 ? (
          <ul className="flex flex-col">
            {posts.map((post) => {
              const readTime = post.charCount
                ? Math.max(1, Math.round(post.charCount / 5 / 200))
                : 5
              return (
                <li key={post._id ?? post.slug} className="border-b border-dashed border-ui">
                  <Link
                    href={`/post/${post.slug}`}
                    className="flex flex-col gap-1 py-3 md:flex-row md:items-baseline md:justify-between md:gap-6"
                  >
                    <span className="text-body-sm text-body hover:text-brand">{post.title}</span>
                    <span className={`${MONO_LABEL} text-faint md:flex-none`}>
                      {readTime} min
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-body text-muted">
            Our consultants write up the builds they ship: the migrations, the automations, and
            the parts that went wrong on the way.
          </p>
        ),
    },
  ]

  const current = steps[step]

  return (
    <div className="bg-surface">
      <section className="mx-auto w-full max-w-[720px] px-4 py-14 md:py-20">
        <p className={`${MONO_LABEL} text-brand`}>{"// request received"}</p>
        <h1 className="mt-4 text-section-h2 text-body">Thanks, we have your request.</h1>

        {/* Step selector: mono annotations on a hairline, not a progress widget.
            Picking one takes the sequence off the clock. */}
        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-2 border-t border-ui pt-4">
          {steps.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => selectStep(i)}
              aria-current={i === step ? "step" : undefined}
              className={`${MONO_LABEL} transition-colors motion-reduce:transition-none ${
                i === step ? "text-body" : "text-faint hover:text-body"
              }`}
            >
              <span className={i === step ? "text-brand" : undefined}>
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-7">
          <h2 className="text-card-title text-body">{current.title}</h2>
          <div className="mt-4">{current.body}</div>
        </div>

        {/* Live region: the step, not the ticking number — a per-second
            announcement would talk over everything else on the page. */}
        <p role="status" className="sr-only">
          Step {step + 1} of {steps.length}: {current.title}
        </p>

        {/* The countdown reads as an annotation on a hairline: the rule itself
            fills as the clock runs, so there is one progress signal, not three. */}
        <div className="mt-12">
          <div className="h-px w-full bg-ui">
            <div
              aria-hidden
              className="h-px w-full origin-left bg-brand transition-transform duration-1000 ease-linear motion-reduce:transition-none"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className={`${MONO_LABEL} text-muted`}>
              {paused
                ? "countdown stopped"
                : `opening the blog in ${String(Math.max(0, remaining)).padStart(2, "0")}s`}
            </p>
            <div className="flex items-center gap-5">
              <Link href={nextPath} className="cta-btn cta-btn-outline">
                Read the blog now
              </Link>
              {!paused && (
                <button
                  type="button"
                  onClick={() => setPaused(true)}
                  className="text-body-sm text-muted underline underline-offset-4 hover:text-body"
                >
                  Stay on this page
                </button>
              )}
            </div>
          </div>
          <p className="sr-only">
            This page opens the consulting blog automatically about ten seconds after it loads.
            Choose &ldquo;Stay on this page&rdquo; to stop that.
          </p>
        </div>
      </section>
    </div>
  )
}
