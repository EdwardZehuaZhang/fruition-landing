import { Rocket, Play } from "lucide-react"

/*
 * CtaLabel — renders a CMS-authored CTA label cleanly.
 *
 * Many CMS labels carry a leading decorative emoji (e.g. "🚀 Book a Meeting",
 * "▶️ Get Started", "📈 Our Solutions"). These render inconsistently across
 * mobile OSes. We strip the leading emoji and, when one was present, replace it
 * with a crisp lucide icon (Rocket for booking/contact intents, Play otherwise),
 * matching the icon treatment used elsewhere on the site. Clean labels are left
 * untouched (no icon added).
 */

const LEADING_EMOJI_RE =
  /^[\s]*(?:(?:\p{Extended_Pictographic}|[☀-➿])(?:️|‍|\p{Extended_Pictographic}|\p{Emoji_Modifier})*)+\s*/u

function stripLeadingEmoji(text: string): string {
  return text.replace(LEADING_EMOJI_RE, "")
}

function inferIcon(text: string) {
  if (/\b(book|consult|schedul|contact|talk|chat|call|meeting)/i.test(text))
    return <Rocket size={16} aria-hidden />
  return <Play size={16} aria-hidden />
}

export default function CtaLabel({ label }: { label?: string }) {
  const raw = label ?? ""
  const clean = stripLeadingEmoji(raw)
  const hadEmoji = clean !== raw

  if (!hadEmoji) return <>{raw}</>

  return (
    <span className="inline-flex items-center gap-2">
      {inferIcon(clean)}
      {clean}
    </span>
  )
}
