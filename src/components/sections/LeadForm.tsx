"use client"

import { useState } from "react"

export interface LeadFormField {
  /** Stored/displayed label, e.g. "What is your primary bottleneck?" */
  label?: string
  /** Input kind */
  type?: "text" | "textarea" | "select"
  /** Options for select fields */
  options?: string[]
  required?: boolean
}

interface LeadFormProps {
  heading?: string
  subheading?: string
  /** Identifies which page/form the lead came from (sent as `source`) */
  source?: string
  /** Extra qualifying questions beyond name/email/company */
  fields?: LeadFormField[]
  submitLabel?: string
  successMessage?: string
}

/**
 * Low-friction intake/discovery form. Posts to /api/leads (Slack + monday).
 * Name + email + company are always present; `fields` add page-specific
 * qualifying questions. Includes a hidden honeypot for spam.
 */
export default function LeadForm({
  heading = "Tell us about your workflow",
  subheading,
  source,
  fields = [],
  submitLabel = "Request a free workflow audit",
  successMessage = "Thanks — we'll be in touch within one business day.",
}: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [error, setError] = useState<string>("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setError("")
    const fd = new FormData(e.currentTarget)
    const extra: Record<string, string> = {}
    for (const f of fields) {
      if (!f.label) continue
      const v = String(fd.get(f.label) ?? "").trim()
      if (v) extra[f.label] = v
    }
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      website: String(fd.get("website") ?? ""), // honeypot
      source,
      fields: extra,
    }
    try {
      const r = await fetch("/api/leads", {
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
    <section className="bg-surface px-4" style={{ paddingTop: 72, paddingBottom: 72 }}>
      <div
        className="mx-auto rounded-card"
        style={{ maxWidth: 620, padding: 32, border: "1px solid var(--line-tint)", boxShadow: "0 24px 48px -32px rgba(64,12,140,0.28)" }}
      >
        <h2 className="text-section-h2 text-ink" style={{ marginBottom: subheading ? 12 : 24 }}>
          {heading}
        </h2>
        {subheading && (
          <p style={{ color: "var(--ink-muted)", fontSize: 15, lineHeight: "22px", marginBottom: 22 }}>{subheading}</p>
        )}

        {status === "done" ? (
          <div
            className="rounded-card"
            style={{ background: "var(--success-surface)", border: "1px solid var(--success)", padding: 20, color: "var(--success-strong)", fontSize: 16 }}
          >
            {successMessage}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col" style={{ gap: 16 }}>
            <Field name="name" label="Full name" required />
            <Field name="email" label="Work email" type="email" required />
            <Field name="company" label="Company" />
            {fields.map((f, i) =>
              f.type === "textarea" ? (
                <TextArea key={i} name={f.label || `field-${i}`} label={f.label} required={f.required} />
              ) : f.type === "select" ? (
                <Select key={i} name={f.label || `field-${i}`} label={f.label} options={f.options} required={f.required} />
              ) : (
                <Field key={i} name={f.label || `field-${i}`} label={f.label} required={f.required} />
              ),
            )}

            {/* Honeypot — hidden from users */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            {status === "error" && (
              <p role="alert" style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="cta-btn cta-btn-primary"
              style={{ alignSelf: "flex-start", opacity: status === "sending" ? 0.7 : 1 }}
            >
              <span className="cta-btn-label">{status === "sending" ? "Sending…" : submitLabel}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line-tint)",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 15,
  color: "var(--ink-heading)",
  background: "var(--surface)",
}

function Labeled({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col" style={{ gap: 6 }}>
      {label && <span style={{ fontSize: 13, color: "var(--ink-heading)", fontWeight: 600 }}>{label}</span>}
      {children}
    </label>
  )
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string
  label?: string
  type?: string
  required?: boolean
}) {
  return (
    <Labeled label={label}>
      <input name={name} type={type} required={required} style={inputStyle} />
    </Labeled>
  )
}

function TextArea({ name, label, required }: { name: string; label?: string; required?: boolean }) {
  return (
    <Labeled label={label}>
      <textarea name={name} required={required} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
    </Labeled>
  )
}

function Select({
  name,
  label,
  options = [],
  required,
}: {
  name: string
  label?: string
  options?: string[]
  required?: boolean
}) {
  return (
    <Labeled label={label}>
      <select name={name} required={required} defaultValue="" style={inputStyle}>
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Labeled>
  )
}
