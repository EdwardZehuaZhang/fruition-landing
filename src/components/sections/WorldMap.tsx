"use client"

import { useState } from "react"
import DottedMap from "dotted-map/without-countries"
import worldMapData from "./worldMapData"

/**
 * Dotted world map with glowing pins at each Fruition office.
 *
 * The dot grid is pre-computed (see worldMapData.ts, generated with
 * `getMapJSON`) so the heavy country geometry never ships to the browser -
 * we only import the lightweight `dotted-map/without-countries` runtime here.
 * Pins are projected through the same map instance (`getPin`) so they land
 * exactly on the grid, then positioned as a percentage of the SVG viewBox.
 */

export interface MapOffice {
  city: string
  country?: string
  address?: string
  addressUrl?: string
  flag?: string
}

// City → [lat, lng]. Matched against office.city (case-insensitive). Extra
// aliases cover how a city might be labelled in the CMS (e.g. "Sweden").
const CITY_COORDS: Record<string, [number, number]> = {
  melbourne: [-37.81, 144.96],
  sydney: [-33.87, 151.21],
  "byron bay": [-28.64, 153.61],
  london: [51.51, -0.13],
  "san francisco": [37.77, -122.42],
  stockholm: [59.33, 18.07],
  sweden: [59.33, 18.07],
  // Aliases for other office labels that may be configured in the CMS.
  "new york": [40.71, -74.01],
  singapore: [1.35, 103.82],
  bengaluru: [12.97, 77.59],
  bangalore: [12.97, 77.59],
  india: [19.08, 72.88], // Mumbai - used when the office is labelled just "India"
  philippines: [14.6, 120.98], // Manila
  manila: [14.6, 120.98],
}

const map = new DottedMap({ map: JSON.parse(worldMapData) })
const MAP_W: number = map.image.width
const MAP_H: number = map.image.height

// The dot grid spans the FULL globe (the whole MAP_H). We never crop it -
// cropping the viewBox slices the continents at the edges, which reads as the
// map being "cut off". Instead we show the entire grid and add empty breathing
// room above and below by letterboxing the SVG inside a taller box (BOX_H),
// then offset the pins by PAD_Y to land in that same padded frame.
const PAD_Y = 4
const BOX_H = MAP_H + PAD_Y * 2

const BG_SVG: string = map.getSVG({
  radius: 0.32,
  color: "#d3cdec",
  shape: "circle",
  backgroundColor: "transparent",
})

interface PlacedPin {
  office: MapOffice
  left: number // percent
  top: number // percent
}

function placePins(offices: MapOffice[]): PlacedPin[] {
  const placed: PlacedPin[] = []
  for (const office of offices) {
    // CMS city values often carry a country suffix ("Sydney, Australia",
    // "New York, US Office") - match on the segment before the first comma,
    // falling back to the whole string.
    const raw = (office.city || "").trim().toLowerCase()
    const coords = CITY_COORDS[raw.split(",")[0].trim()] || CITY_COORDS[raw]
    if (!coords) continue
    const pin = map.getPin({ lat: coords[0], lng: coords[1] })
    if (!pin) continue
    placed.push({
      office,
      left: (pin.x / MAP_W) * 100,
      // Position relative to the padded box: the SVG is letterboxed by PAD_Y
      // units top and bottom, so offset the pin into that same frame.
      top: ((pin.y + PAD_Y) / BOX_H) * 100,
    })
  }
  return placed
}

export default function WorldMap({ offices }: { offices: MapOffice[] }) {
  const pins = placePins(offices)
  const [active, setActive] = useState<number | null>(null)

  return (
    <div
      className="mx-auto w-full max-w-[1120px] relative"
      aria-label="Map of Fruition office locations"
      role="group"
    >
      <div className="relative w-full" style={{ aspectRatio: `${MAP_W} / ${BOX_H}` }}>
        {/* Dot grid - letterboxed vertically inside the taller box so the
            continents keep PAD_Y of empty space above and below. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          dangerouslySetInnerHTML={{
            __html: BG_SVG.replace(
              /<svg [^>]*?>/,
              `<svg width="100%" height="100%" viewBox="0 0 ${MAP_W} ${MAP_H}" preserveAspectRatio="xMidYMid meet">`,
            ),
          }}
        />

        {/* Pins */}
        {pins.map((pin, i) => {
          const isActive = active === i
          return (
            <div
              key={`${pin.office.city}-${i}`}
              style={{
                position: "absolute",
                left: `${pin.left}%`,
                top: `${pin.top}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isActive ? 3 : 2,
              }}
            >
              <button
                type="button"
                className="fr-map-pin"
                aria-label={`${pin.office.city}${pin.office.country ? `, ${pin.office.country}` : ""}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
                onFocus={() => setActive(i)}
                onBlur={() => setActive((cur) => (cur === i ? null : cur))}
              >
                <span className="fr-map-pin-outer" aria-hidden="true" />
                <span className="fr-map-pin-mid" aria-hidden="true" />
                <span className="fr-map-pin-dot" aria-hidden="true" />
              </button>

              {isActive && (
                <div
                  role="tooltip"
                  className="fr-map-tooltip"
                  style={
                    pin.left < 22
                      ? { left: 0, right: "auto", transform: "none", alignItems: "flex-start", textAlign: "left" }
                      : pin.left > 78
                        ? { left: "auto", right: 0, transform: "none", alignItems: "flex-end", textAlign: "right" }
                        : undefined
                  }
                >
                  {pin.office.flag && (
                    <span className="fr-map-flag" aria-hidden="true">{pin.office.flag}</span>
                  )}
                  <div className="font-semibold text-[13px] leading-[18px] text-body">
                    {pin.office.city}
                    {pin.office.country ? `, ${pin.office.country}` : ""}
                  </div>
                  {pin.office.address && (
                    <div className="text-xs leading-[18px] text-muted mt-1">
                      {pin.office.address}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        .fr-map-pin {
          position: relative;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          border-radius: 9999px;
        }
        .fr-map-pin:focus-visible { outline: 2px solid var(--purple-primary); outline-offset: 3px; }
        .fr-map-pin-outer,
        .fr-map-pin-mid,
        .fr-map-pin-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 9999px;
          background: var(--purple-primary);
          transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1), height 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fr-map-pin-outer { width: 40px; height: 40px; opacity: 0.1; }
        .fr-map-pin-mid { width: 24px; height: 24px; opacity: 0.2; }
        .fr-map-pin-dot { width: 8px; height: 8px; }
        .fr-map-pin:hover .fr-map-pin-outer,
        .fr-map-pin:focus-visible .fr-map-pin-outer { width: 48px; height: 48px; }
        .fr-map-pin:hover .fr-map-pin-mid,
        .fr-map-pin:focus-visible .fr-map-pin-mid { width: 28px; height: 28px; }
        .fr-map-flag {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          overflow: hidden;
          display: grid;
          place-items: center;
          font-size: 18px;
          line-height: 1;
        }
        .fr-map-tooltip {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          width: max-content;
          max-width: min(220px, 80vw);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: var(--surface-raised);
          border: 1px solid var(--border-ui);
          border-radius: 8px;
          padding: 12px 16px;
          box-shadow:
            0 12px 16px -4px rgba(0, 0, 0, 0.08),
            0 4px 6px -2px rgba(0, 0, 0, 0.03),
            0 2px 2px -1px rgba(0, 0, 0, 0.04);
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .fr-map-pin-outer,
          .fr-map-pin-mid,
          .fr-map-pin-dot { transition: none; }
        }
      `}</style>
    </div>
  )
}
