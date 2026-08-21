import { Fragment, type ReactNode } from "react"
import Link from "next/link"
import { parseInlineMarkdown } from "@/lib/inlineMarkdown"

/**
 * Renders the inline-markdown subset (`**bold**`, `*italic*`, `[text](url)`)
 * that the long-form industry copy in src/data/industrySections.ts is written
 * in, using the same tokenizer the blog tables use. Keeping the copy as plain
 * strings is what lets a whole section be a data literal rather than JSX.
 */
export default function RichText({ text }: { text: string }) {
  return (
    <>
      {parseInlineMarkdown(text).map((run, i) => {
        if (run.href) {
          // Relative hrefs stay in-app; anything absolute opens in a new tab.
          const internal = run.href.startsWith("/") || run.href.startsWith("#")
          const className = "text-brand-dark underline hover:no-underline"
          return internal ? (
            <Link key={i} href={run.href} className={className}>
              {run.text}
            </Link>
          ) : (
            <a
              key={i}
              href={run.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {run.text}
            </a>
          )
        }
        let node: ReactNode = run.text
        if (run.em) node = <em>{node}</em>
        if (run.strong) node = <strong className="font-semibold text-body">{node}</strong>
        return <Fragment key={i}>{node}</Fragment>
      })}
    </>
  )
}
