import { urlFor } from "@/sanity/image"
import type { SanityImageRef } from "./types"

interface SecurityBadgeSectionProps {
  badge?: SanityImageRef
}

export default function SecurityBadgeSection({ badge }: SecurityBadgeSectionProps) {
  const src = badge?.asset?._ref ? (() => { try { return urlFor(badge).width(976).height(94).url() } catch { return null } })() : null
  if (!src) return null

  return (
    <section className="bg-white" style={{ paddingBottom: 80 }}>
      <div className="mx-auto max-w-[976px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Security certifications" width={976} height={94} className="w-full h-auto" />
      </div>
    </section>
  )
}
