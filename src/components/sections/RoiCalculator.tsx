"use client"

import { useId, useMemo, useState } from "react"
import type { RoiCalcConfig } from "./types"

interface RoiCalculatorProps {
  config?: RoiCalcConfig
}

/**
 * Interactive ROI / time-saved calculator. Two sliders (team size, hours/week
 * lost to manual updates) drive a live estimate of weekly/yearly hours and
 * dollars reclaimed by automation. Drives dwell time + personalized proof of
 * value (per PDF). Kept to 2 inputs to avoid fatigue.
 */
export default function RoiCalculator({ config = {} }: RoiCalculatorProps) {
  const {
    heading = "Calculate your savings",
    subheading = "Estimate the time and money automation reclaims for your team.",
    defaultTeamSize = 10,
    defaultHoursPerWeek = 6,
    hourlyRate = 45,
    reclaimRate = 0.7,
    currencySymbol = "$",
  } = config

  const [teamSize, setTeamSize] = useState(defaultTeamSize)
  const [hoursPerWeek, setHoursPerWeek] = useState(defaultHoursPerWeek)
  const uid = useId()

  const { weeklyHours, yearlyHours, yearlyDollars } = useMemo(() => {
    const reclaimedWeekly = teamSize * hoursPerWeek * reclaimRate
    const reclaimedYearly = reclaimedWeekly * 52
    return {
      weeklyHours: Math.round(reclaimedWeekly),
      yearlyHours: Math.round(reclaimedYearly),
      yearlyDollars: Math.round(reclaimedYearly * hourlyRate),
    }
  }, [teamSize, hoursPerWeek, reclaimRate, hourlyRate])

  const fmt = (n: number) => n.toLocaleString("en-US")

  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "#f0ecfe" }}>
      <style>{`
        .roi-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: #e2d8f7;
          outline: none;
          cursor: pointer;
        }
        .roi-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #8015e8;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(128,21,232,0.45);
          cursor: pointer;
        }
        .roi-range::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #8015e8;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(128,21,232,0.45);
          cursor: pointer;
        }
        .roi-range::-moz-range-track { height: 8px; border-radius: 999px; background: #e2d8f7; }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: 920 }}>
        <div className="text-center" style={{ marginBottom: 36 }}>
          <h2 className="text-section-h2 text-black">{heading}</h2>
          {subheading && (
            <p style={{ color: "#686b82", fontSize: 17, lineHeight: "26px", marginTop: 12 }}>{subheading}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-stretch">
          {/* Inputs */}
          <div
            className="rounded-card bg-white flex flex-col justify-center h-full"
            style={{ padding: 36, border: "1px solid #ece7fb", boxShadow: "0 18px 36px -24px rgba(64,12,140,0.2)" }}
          >
            <Slider
              id={`${uid}-team`}
              label="Team size"
              value={teamSize}
              min={1}
              max={250}
              suffix={teamSize === 1 ? "person" : "people"}
              onChange={setTeamSize}
            />
            <div style={{ height: 36 }} />
            <Slider
              id={`${uid}-hours`}
              label="Hours/week each person loses to manual updates"
              value={hoursPerWeek}
              min={1}
              max={40}
              suffix={hoursPerWeek === 1 ? "hour" : "hours"}
              onChange={setHoursPerWeek}
            />
          </div>

          {/* Outputs */}
          <div
            className="rounded-card flex flex-col justify-center h-full"
            style={{
              padding: 36,
              background: "linear-gradient(-38deg, rgb(128,21,232) 0%, rgb(16,0,58) 100%)",
              color: "#fff",
            }}
          >
            <Result big value={`${fmt(yearlyHours)} hrs`} label="reclaimed per year" />
            <div style={{ height: 20 }} />
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <Result value={`${fmt(weeklyHours)} hrs`} label="per week" />
              <Result value={`${currencySymbol}${fmt(yearlyDollars)}`} label="saved per year" />
            </div>
            <p style={{ fontSize: 12, lineHeight: "18px", color: "rgba(255,255,255,0.6)", marginTop: 22 }}>
              Estimate assumes automation reclaims ~{Math.round(reclaimRate * 100)}% of manual hours at a{" "}
              {currencySymbol}
              {hourlyRate}/hr fully-loaded cost.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  suffix: string
  onChange: (n: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4" style={{ marginBottom: 14 }}>
        <label htmlFor={id} className="font-medium" style={{ fontSize: 17, lineHeight: "24px", color: "#10003a", maxWidth: "65%" }}>
          {label}
        </label>
        <span className="font-bold shrink-0" style={{ fontSize: 28, lineHeight: "30px", color: "#8015e8" }}>
          {value} <span style={{ fontSize: 15, fontWeight: 500, color: "#686b82" }}>{suffix}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roi-range"
      />
    </div>
  )
}

function Result({ value, label, big = false }: { value: string; label: string; big?: boolean }) {
  return (
    <div>
      <div className="font-bold" style={{ fontSize: big ? "clamp(28px, 8vw, 44px)" : "clamp(20px, 5vw, 26px)", lineHeight: 1.1, wordBreak: "break-word" }}>
        {value}
      </div>
      <div style={{ fontSize: 13, lineHeight: "18px", color: "rgba(255,255,255,0.72)", marginTop: 4 }}>{label}</div>
    </div>
  )
}
