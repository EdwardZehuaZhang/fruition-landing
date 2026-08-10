/**
 * The header every portal page starts with.
 *
 * It exists because the pages had drifted: some titles were `text-2xl`, one was
 * `text-xl`, some used `text-ink-heading` and others `text-foreground`, and the
 * gap between title and content differed per page. In a tool whose whole pitch
 * is systemised work, that inconsistency is the thing you notice first.
 *
 * Content sits directly on the page background — no card wrapper. Wrapping a
 * whole page in a shadowed panel adds a frame around everything without
 * separating anything, and nests a second card whenever the content is itself
 * made of cards.
 */

export default function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  /** One line on what this page is for. Skip it if the title says everything. */
  description?: string
  /** Primary action(s), right-aligned on wide screens, wrapping underneath on narrow. */
  actions?: React.ReactNode
}) {
  return (
    <header className="mb-5 flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-prose text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
