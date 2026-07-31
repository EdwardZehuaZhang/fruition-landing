"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
// The server can't know the preference; assume motion is fine and let the
// client correct it on hydration.
const getServerSnapshot = () => false

/** Live `prefers-reduced-motion` preference, safe to read during render. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
