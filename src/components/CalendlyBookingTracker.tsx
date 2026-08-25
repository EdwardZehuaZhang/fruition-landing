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

/**
 * `send_to` for the "Calendly Booking" conversion action, as
 * `<conversion ID>/<conversion label>`.
 *
 * Both halves come from Google Ads → Goals → Summary → Calendly Booking →
 * Manage → "Use Google Tag Manager". The label is the opaque string
 * ("NviGCLnUs7YaEO7Zut4D"), *not* the numeric conversion type ID shown on the
 * Details tab — this used to read "AW-71752570/7093414457", which paired the
 * URL's ocid with the type ID and matched nothing on Google's side.
 */
const CALENDLY_BOOKING_CONVERSION = "AW-1003400430/NviGCLnUs7YaEO7Zut4D"

export default function CalendlyBookingTracker() {
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Origin check first — any framed page can post to us.
      if (e.origin !== "https://calendly.com") return
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
