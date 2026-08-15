"use client"

import { useEffect } from "react"

/**
 * CalendlyBookingTracker — listens for Calendly's postMessage events and
 * fires a Google Ads conversion when a booking is scheduled.
 *
 * Calendly's inline/embed widget dispatches `calendly.event_scheduled`
 * via `window.postMessage` after a visitor successfully books a meeting.
 * This component mounts once (site-wide in the root layout) so it catches
 * bookings from every page.
 */

const CALENDLY_BOOKING_CONVERSION = "AW-71752570/7093414457"

export default function CalendlyBookingTracker() {
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Calendly dispatches structured postMessage events; filter to
      // the ones we care about.
      if (
        !e.data ||
        typeof e.data !== "object" ||
        e.data.event !== "calendly.event_scheduled"
      ) {
        return
      }

      // Fire the Google Ads conversion.
      if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
        ;(window as any).gtag("event", "conversion", {
          send_to: CALENDLY_BOOKING_CONVERSION,
        })
      }
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  // This component renders nothing — it only wires the event listener.
  return null
}
