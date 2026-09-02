/**
 * The post-conversion hand-off, in one place so the forms that redirect and the
 * page that receives them cannot drift apart.
 */

/** Confirmation route every lead form lands on after a successful submit. */
export const THANK_YOU_PATH = "/thank-you"

/** Where /thank-you sends the visitor when its countdown runs out. */
export const THANK_YOU_NEXT_PATH = "/consulting-blog"

/** Seconds /thank-you waits before making that move for them. */
export const THANK_YOU_REDIRECT_SECONDS = 10

/**
 * sessionStorage key carrying the submitting form's own success line across the
 * navigation. Per-page copy ("a UK-based consultant will reach out") stays
 * attached to the form that promised it, without visitor-facing text in the URL.
 */
export const THANK_YOU_MESSAGE_KEY = "fr:lead-success"

/** Stash the form's success line for /thank-you. Storage may be unavailable. */
export function stashThankYouMessage(message?: string) {
  if (!message) return
  try {
    window.sessionStorage.setItem(THANK_YOU_MESSAGE_KEY, message)
  } catch {
    /* private mode — /thank-you falls back to its default line */
  }
}
