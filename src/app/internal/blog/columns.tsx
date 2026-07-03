"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Post {
  id: string
  _id: string
  title: string
  slug: string
  publishedAt?: string
  author?: string
  /** Google Search clicks over the reporting window (from Search Console). */
  clicks?: number
}

const DEFAULT_AUTHOR = "Fruition Editorial"

function formatDate(value?: string): string {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return value
  }
}

/** Absolute URL to the public post, built from the current origin (client-only). */
function postUrl(slug: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  return `${origin}/post/${slug}`
}

function SortHeader({
  label,
  column,
}: {
  label: string
  column: {
    getIsSorted: () => false | "asc" | "desc"
    toggleSorting: (desc?: boolean) => void
  }
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2.5"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown />
    </Button>
  )
}

export const columns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <SortHeader label="Title" column={column} />,
    cell: ({ row }) => (
      <Link
        href={`/post/${row.original.slug}`}
        className="font-semibold text-ink-heading hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "author",
    header: ({ column }) => <SortHeader label="Author" column={column} />,
    cell: ({ row }) => <span>{row.original.author || DEFAULT_AUTHOR}</span>,
    sortingFn: (a, b) =>
      (a.original.author || DEFAULT_AUTHOR).localeCompare(
        b.original.author || DEFAULT_AUTHOR
      ),
  },
  {
    accessorKey: "publishedAt",
    header: ({ column }) => <SortHeader label="Published" column={column} />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.publishedAt)}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    enableSorting: false,
    cell: () => <Badge variant="secondary">Published</Badge>,
  },
  {
    accessorKey: "clicks",
    header: ({ column }) => <SortHeader label="Clicks" column={column} />,
    cell: ({ row }) =>
      typeof row.original.clicks === "number" ? (
        <span className="tabular-nums text-ink-heading">
          {row.original.clicks.toLocaleString()}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    sortUndefined: "last",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const post = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="Open menu" />
            }
          >
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuItem render={<Link href={`/post/${post.slug}`} />}>
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(postUrl(post.slug))}
            >
              Copy link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
