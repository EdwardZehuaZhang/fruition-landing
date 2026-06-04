"use client"

import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"
import { Rocket, Play } from "lucide-react"

export type CtaVariant =
  | "outline"
  | "primary"
  | "onDarkOutline"
  | "onDarkPrimary"

interface CtaButtonProps {
  href: string
  label?: string
  children?: ReactNode
  variant?: CtaVariant
  icon?: ReactNode
  className?: string
  style?: CSSProperties
}

const ROCKET = <Rocket size={18} aria-hidden />
const PLAY = <Play size={18} aria-hidden />

const VARIANT_CLASS: Record<CtaVariant, string> = {
  outline: "cta-btn-outline",
  primary: "cta-btn-primary",
  onDarkOutline: "cta-btn-on-dark-outline",
  onDarkPrimary: "cta-btn-on-dark-primary",
}

function inferIcon(text: string, variant: CtaVariant): ReactNode {
  const lower = text.toLowerCase()
  if (/\b(book|consult|schedul|contact|talk|chat|call)/i.test(lower)) return ROCKET
  if (/\b(start|get started|monday|demo|watch|try|launch|begin)/i.test(lower)) return PLAY
  return variant === "outline" || variant === "onDarkOutline" ? ROCKET : PLAY
}

const LEADING_EMOJI_RE =
  /^[\s]*(?:(?:\p{Extended_Pictographic}|[☀-➿])(?:️|‍|\p{Extended_Pictographic})*)+\s*/u

function stripLeadingEmoji(text: string): string {
  return text.replace(LEADING_EMOJI_RE, "")
}

export default function CtaButton({
  href,
  label,
  children,
  variant = "primary",
  icon,
  className = "",
  style,
}: CtaButtonProps) {
  const rawText =
    typeof label === "string"
      ? label
      : typeof children === "string"
        ? children
        : ""

  const cleanText = stripLeadingEmoji(rawText)
  const emoji = icon ?? inferIcon(cleanText || rawText, variant)

  const content = cleanText || (typeof children !== "string" ? children : null)

  return (
    <Link
      href={href}
      className={`cta-btn ${VARIANT_CLASS[variant]} ${className}`.trim()}
      style={style}
    >
      <span className="cta-btn-icon" aria-hidden="true">
        {emoji}
      </span>
      <span className="cta-btn-label">{content}</span>
    </Link>
  )
}
