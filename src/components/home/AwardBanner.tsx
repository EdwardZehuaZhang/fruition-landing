import Link from "next/link"
import { Trophy } from "lucide-react"

/**
 * Announcement strip above the site nav. Rendered in the root layout, so it
 * appears on every marketing page - retire it by removing that one usage.
 */
export default function AwardBanner() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 bg-surface-dark px-6 py-2.75 text-center text-[13.5px] font-medium text-white">
      <Trophy size={16} strokeWidth={2} className="hidden flex-none text-amber sm:block" aria-hidden />
      <span>
        Winner - Rising Star Award
        {/* The summit detail is the first thing to go when space is tight. */}
        <span className="hidden sm:inline">
          <span className="mx-2 opacity-55">·</span>
          monday.com Partner Summit 2026, Prague
        </span>
      </span>
      <Link href="/certifications-and-awards" className="font-semibold text-brand-light hover:text-white">
        Read the announcement →
      </Link>
    </div>
  )
}
