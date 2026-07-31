import { Clock, Globe, SquareCheckBig, Trophy } from "lucide-react"
import Reveal from "./Reveal"
import { STATS, type StatCard } from "./data"

const ICONS: Record<StatCard["icon"], typeof Clock> = {
  check: SquareCheckBig,
  globe: Globe,
  clock: Clock,
  trophy: Trophy,
}

/** Four proof-point tiles: scale, footprint, speed to Platinum, and the award. */
export default function ByTheNumbers() {
  return (
    <section className="bg-surface pt-16 pb-10 md:pt-20 lg:pt-23">
      <div className="mx-auto max-w-[1348px] px-5 md:px-8">
        <Reveal className="max-w-[720px]">
          <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">
            By the numbers
          </p>
          <h2 className="text-section-h2 mt-3.5 text-foreground lg:text-[38px]" style={{ textWrap: "pretty" }}>
            Platinum tier, earned in under two years.
          </h2>
        </Reveal>

        <Reveal className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-11 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = ICONS[stat.icon]
            return (
              <div
                key={stat.label}
                className="ui-hover-card flex flex-col gap-5 rounded-card border border-lilac bg-surface-raised px-8 pt-8 pb-8 shadow-whisper"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-chip bg-tint">
                  <Icon size={22} className="text-brand" aria-hidden strokeWidth={2} />
                </span>
                <div>
                  <div className="text-[40px] leading-none font-semibold tracking-[-0.025em] text-brand lg:text-[46px]">
                    {stat.value}
                  </div>
                  <div className="text-body-sm mt-2.5 text-muted">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
