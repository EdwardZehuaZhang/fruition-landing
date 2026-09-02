/**
 * WebMCP (W3C draft) tool attributes.
 *
 * The draft lets a page advertise its in-page tools to a browser-resident AI
 * agent by tagging the action form itself, so the declaration survives into the
 * server-rendered HTML instead of living only in client JS. Chrome and the
 * ChatGPT desktop browser read these; so do agent-readiness scanners.
 *
 * React passes unknown all-lowercase attributes straight through to the DOM,
 * so the only thing missing is the type. Declared here rather than cast at each
 * call site, and kept lowercase deliberately: the attribute names are literal.
 *
 * Only genuine visitor-facing action forms carry them. Internal/admin forms
 * (the /internal portal login and onboarding) are not tools for public agents.
 */
import "react"

declare module "react" {
  // T is unused here but has to match React's own signature to merge.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    /** Tool name an agent sees, e.g. "contact_fruition". */
    toolname?: string
    /** What the tool does and when to use it. */
    tooldescription?: string
  }
}
