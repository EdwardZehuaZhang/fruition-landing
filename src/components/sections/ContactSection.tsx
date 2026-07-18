"use client"

import { useState } from "react"
import WorldMap, { type MapOffice } from "./WorldMap"

export interface ContactOffice extends MapOffice {
  flag?: string
  phone?: string
  phoneTel?: string
  label?: string
}

interface ContactSectionProps {
  offices: ContactOffice[]
  /** Where the form is sent + the "Sales" channel. */
  salesEmail: string
  /** Support channel email. */
  supportEmail: string
  /** Display phone + tel: target. */
  phone?: string
  phoneTel?: string
}

const SERVICE_OPTIONS = [
  "monday.com implementation",
  "Workflow automation",
  "Integrations",
  "Training & enablement",
  "Strategy & consulting",
  "Other",
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Canonical shared field style — .form-field in globals.css (DESIGN.md Inputs) */
const inputClass = "form-field"

export default function ContactSection({
  offices,
  salesEmail,
  supportEmail,
  phone,
  phoneTel,
}: ContactSectionProps) {
  return (
    <>
      <ContactHero offices={offices} salesEmail={salesEmail} supportEmail={supportEmail} phone={phone} phoneTel={phoneTel} />
      <OfficeBand offices={offices} />
      <ContactForm salesEmail={salesEmail} />
    </>
  )
}

/* ── Hero: headline, world map, three contact channels ─────────────────── */

function ContactHero({ offices, salesEmail, supportEmail, phone, phoneTel }: ContactSectionProps) {
  const telHref = phoneTel || (phone ? phone.replace(/[^\d+]/g, "") : "")
  // The CMS often uses one shared inbox — don't show the same address twice.
  const sameInbox = salesEmail.toLowerCase() === supportEmail.toLowerCase()
  return (
    <section className="bg-surface px-4">
      <div className="mx-auto flex flex-col items-center max-w-[1100px] pt-26 pb-6">
        <span className="inline-flex items-center rounded-full bg-brand-soft text-brand border border-brand/30 font-mono text-xs font-semibold uppercase tracking-[0.14em] px-4 py-2">
          Contact us
        </span>

        <h1 className="text-center mt-6 max-w-[860px] text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-body text-balance">
          We&rsquo;d love to hear from you
        </h1>

        <p className="text-center text-body-lead mt-5 max-w-[600px] text-muted text-pretty">
          Reach the team directly, or find the office nearest you. We answer every message within one business day.
        </p>
      </div>

      {/* World map */}
      <div className="mx-auto px-4 max-w-[1100px] pt-3 pb-4">
        <WorldMap offices={offices} />
      </div>

      {/* Channels */}
      <div className="mx-auto px-4 max-w-[1000px] pt-6 pb-22">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 text-center">
          {sameInbox ? (
            <Channel
              title="Email"
              blurb="Sales, support, or a general question."
              value={salesEmail}
              href={`mailto:${salesEmail}`}
            />
          ) : (
            <>
              <Channel
                title="Sales"
                blurb="New project or partnership? Start here."
                value={salesEmail}
                href={`mailto:${salesEmail}`}
              />
              <Channel
                title="Support"
                blurb="Existing client needing a hand."
                value={supportEmail}
                href={`mailto:${supportEmail}`}
              />
            </>
          )}
          <Channel
            title="Phone"
            blurb="Monday to Friday, business hours AEST."
            value={phone || "—"}
            href={telHref ? `tel:${telHref}` : undefined}
          />
          <Channel
            title="LinkedIn"
            blurb="Follow along and connect with the team."
            value="linkedin.com/company/fruition-services"
            href="https://www.linkedin.com/company/fruition-services"
          />
        </div>
      </div>
    </section>
  )
}

function Channel({ title, blurb, value, href }: { title: string; blurb: string; value: string; href?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <h2 className="text-[17px] font-semibold text-body">{title}</h2>
      <p className="text-sm text-muted leading-5 max-w-[240px]">{blurb}</p>
      {href ? (
        <a
          href={href}
          className="text-[15px] font-semibold text-brand mt-0.5 [word-break:break-word]"
        >
          {value}
        </a>
      ) : (
        <span className="text-[15px] font-semibold text-muted mt-0.5">{value}</span>
      )}
    </div>
  )
}

/* ── Office band: full-bleed purple, addresses ─────────────────────────── */

function OfficeBand({ offices }: { offices: ContactOffice[] }) {
  return (
    <section className="py-24 bg-[linear-gradient(135deg,var(--color-surface-dark)_0%,var(--color-surface-dark-2)_55%,var(--color-brand-dark)_100%)]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 lg:flex-row lg:items-start lg:gap-16">
        {/* Heading column */}
        <div className="max-w-[360px] min-w-0 lg:flex-none">
          <p className="text-brand-light text-base font-semibold leading-6">
            Our locations
          </p>
          <h2 className="text-section-h2 text-white mt-3 text-balance">
            Visit our offices
          </h2>
          <p className="text-white/[0.72] text-xl leading-[30px] mt-5">
            Local teams across {offices.length} cities, working in your timezone.
          </p>
        </div>

        {/* Office list */}
        <div className="flex flex-1 flex-wrap gap-8 lg:gap-x-16 lg:gap-y-8">
          {offices.map((o, i) => (
            <div key={`${o.city}-${i}`} className="min-w-[240px] max-w-[320px] flex-[1_0_0]">
              <div className="flex items-center gap-2">
                {o.flag && <span className="text-lg leading-none">{o.flag}</span>}
                <span className="text-lg font-semibold text-white leading-7">{o.city}</span>
              </div>
              {o.address &&
                (o.addressUrl ? (
                  <a
                    href={o.addressUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-base leading-6 text-white/[0.72] mt-1"
                  >
                    {o.address}
                  </a>
                ) : (
                  <p className="text-base leading-6 text-white/[0.72] mt-1">
                    {o.address}
                  </p>
                ))}
              {o.phone && (
                <a
                  href={`tel:${o.phoneTel || o.phone.replace(/[^\d+]/g, "")}`}
                  className="block text-base text-white/[0.72] mt-1"
                >
                  {o.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

/* ── Contact form ──────────────────────────────────────────────────────── */

function ContactForm({ salesEmail }: { salesEmail: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [error, setError] = useState("")
  const [service, setService] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      firstName: String(fd.get("firstName") ?? "").trim(),
      lastName: String(fd.get("lastName") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      service,
      website: String(fd.get("website") ?? ""), // honeypot
    }

    const errs: Record<string, boolean> = {}
    if (!payload.firstName) errs.firstName = true
    if (!EMAIL_RE.test(payload.email)) errs.email = true
    if (!payload.message) errs.message = true
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      setStatus("error")
      setError("Please fill in your name, a valid email, and a message.")
      return
    }

    setStatus("sending")
    setError("")
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (r.ok && body.ok) {
        setStatus("done")
      } else {
        setStatus("error")
        setError(body.error || "Something went wrong. Please try again.")
      }
    } catch {
      setStatus("error")
      setError("Network error. Please try again.")
    }
  }

  return (
    <section className="bg-surface px-4 pt-20 pb-24">
      <div className="mx-auto grid bg-surface-raised dark:shadow-none dark:border dark:border-ui max-w-[1100px] gap-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[24px] border border-[#ece7fb] shadow-[0_30px_70px_-50px_rgba(64,12,140,0.4)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: form */}
          <div className="p-[clamp(28px,4vw,48px)]">
            <h2 className="text-section-h3 text-body">
              Tell us what you&rsquo;re building
            </h2>
            <p className="text-muted text-[15px] leading-[22px] mt-2.5 mb-[26px]">
              A specialist reads every message and replies within one business day.
            </p>

            {status === "done" ? (
              <div
                className="rounded-card bg-[#f5fbf6] border border-[#d6ecd9] p-[22px] text-[#1e7a40] text-base leading-6"
                role="status"
              >
                Thanks for reaching out. Your message is on its way to {salesEmail} and we&rsquo;ll be in touch within one business day.
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field name="firstName" label="First name" required invalid={fieldErrors.firstName} />
                  <Field name="lastName" label="Last name" />
                </div>
                <Field name="email" label="Email" type="email" required invalid={fieldErrors.email} />
                <Field name="phone" label="Phone (optional)" type="tel" />

                <fieldset className="border-0 p-0 m-0">
                  <legend className="text-[13px] text-body font-semibold mb-2">
                    What can we help with?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_OPTIONS.map((opt) => {
                      const selected = service === opt
                      return (
                        <label
                          key={opt}
                          className="inline-flex items-center px-3.5 py-2 rounded-full text-[13.5px] font-medium cursor-pointer transition-colors"
                          style={{
                            border: `1px solid ${selected ? "var(--purple-primary)" : "var(--border-ui)"}`,
                            background: selected ? "var(--purple-soft)" : "var(--surface-raised)",
                            color: selected ? "var(--purple-dark)" : "var(--text-body)",
                          }}
                        >
                          <input
                            type="radio"
                            name="service"
                            value={opt}
                            checked={selected}
                            onChange={() => setService(opt)}
                            className="absolute opacity-0 w-px h-px"
                          />
                          {opt}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <TextArea name="message" label="Message" required invalid={fieldErrors.message} />

                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />

                {status === "error" && (
                  <p role="alert" className="text-[#c0392b] text-sm">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="cta-btn cta-btn-primary self-start mt-1"
                  style={{ opacity: status === "sending" ? 0.7 : 1 }}
                >
                  <span className="cta-btn-label">{status === "sending" ? "Sending…" : "Send message"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: brand panel */}
          <aside className="relative overflow-hidden text-white p-[clamp(28px,4vw,48px)] bg-[linear-gradient(150deg,var(--color-brand-dark)_0%,var(--color-brand)_60%,var(--color-brand-light)_100%)]">
            <div
              aria-hidden="true"
              className="absolute w-[360px] h-[360px] right-[-120px] top-[-120px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22),rgba(255,255,255,0))]"
            />
            <div className="relative">
              <h3 className="text-[22px] font-semibold leading-[1.3]">What happens next</h3>
              <ol className="mt-[22px] flex flex-col gap-5 list-none p-0">
                {[
                  ["We read your message", "A real person on the team, not a queue."],
                  ["You hear back within a day", "We reply with next steps or a few clarifying questions."],
                  ["We map out the work together", "A short call if it helps, scoped to what you need."],
                ].map(([title, body], i) => (
                  <li key={i} className="flex gap-3.5">
                    <span className="shrink-0 w-[30px] h-[30px] rounded-full bg-white/[0.16] grid place-items-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-[15.5px]">{title}</div>
                      <div className="text-sm leading-5 text-white/80 mt-0.5">{body}</div>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-9 pt-6 border-t border-white/[0.18]">
                <div className="text-[13px] text-white/70">Prefer email?</div>
                <a href={`mailto:${salesEmail}`} className="text-base font-semibold text-white">
                  {salesEmail}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

    </section>
  )
}

function FieldLabel({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-[13px] text-body font-semibold">{label}</span>}
      {children}
    </label>
  )
}

function Field({
  name,
  label,
  type = "text",
  required,
  invalid,
}: {
  name: string
  label?: string
  type?: string
  required?: boolean
  invalid?: boolean
}) {
  return (
    <FieldLabel label={label}>
      <input
        name={name}
        type={type}
        required={required}
        aria-invalid={invalid || undefined}
        className={inputClass}
      />
    </FieldLabel>
  )
}

function TextArea({ name, label, required, invalid }: { name: string; label?: string; required?: boolean; invalid?: boolean }) {
  return (
    <FieldLabel label={label}>
      <textarea
        name={name}
        required={required}
        rows={4}
        aria-invalid={invalid || undefined}
        className={`${inputClass} resize-y`}
      />
    </FieldLabel>
  )
}
