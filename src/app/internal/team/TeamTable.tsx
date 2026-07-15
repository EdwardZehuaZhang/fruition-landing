"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { ExternalLink, Pencil, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable, SortHeader, type DataTableFacet } from "@/components/internal/DataTable"
import { REGION_OPTIONS } from "@/lib/teamMemberOptions"

export interface TeamRow {
  _id: string
  name: string
  role: string | null
  regions: string[]
  certifications: string[]
  linkedinUrl: string | null
  order: number | null
}

export default function TeamTable({ rows }: { rows: TeamRow[] }) {
  const router = useRouter()

  const columns = React.useMemo<ColumnDef<TeamRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortHeader label="Name" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(128,21,232,0.10)] text-sm font-semibold text-[var(--purple-primary)]">
              {row.original.name.slice(0, 1).toUpperCase()}
            </div>
            <span className="font-medium text-ink-heading">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => <SortHeader label="Role" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.role || "—"}</span>
        ),
      },
      {
        accessorKey: "regions",
        header: "Regions",
        enableSorting: false,
        filterFn: "arrIncludes",
        cell: ({ row }) =>
          row.original.regions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row.original.regions.map((r) => (
                <Badge key={r} variant="outline">
                  {r}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: "certifications",
        header: "Certifications",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.certifications.length > 0
              ? `${row.original.certifications.length} badge${row.original.certifications.length === 1 ? "" : "s"}`
              : "—"}
          </span>
        ),
      },
      {
        // undefined (not null) so sortUndefined places members without an order last
        accessorFn: (row) => row.order ?? undefined,
        id: "order",
        header: ({ column }) => <SortHeader label="Order" column={column} />,
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">{row.original.order ?? "—"}</span>
        ),
        sortUndefined: "last",
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            {row.original.linkedinUrl && (
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="LinkedIn"
                render={
                  <a href={row.original.linkedinUrl} target="_blank" rel="noopener noreferrer" />
                }
              >
                <ExternalLink className="size-4" />
              </Button>
            )}
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Edit"
              render={<Link href={`/internal/team/${encodeURIComponent(row.original._id)}`} />}
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const facets: DataTableFacet[] = [
    {
      columnId: "regions",
      title: "Region",
      options: REGION_OPTIONS.map((r) => ({ label: r.label, value: r.value })),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={rows}
      searchColumn="name"
      searchPlaceholder="Search members…"
      facets={facets}
      initialSorting={[{ id: "order", desc: false }]}
      onRowClick={(row) => router.push(`/internal/team/${encodeURIComponent(row._id)}`)}
      emptyTitle="No team members yet"
      emptyDescription="Add people to show them on the public team pages."
      emptyIcon={<Users />}
    />
  )
}
