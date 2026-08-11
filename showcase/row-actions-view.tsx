"use client"

import { useState } from "react"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { notify } from "@/registry/admin-toaster/admin-toaster"
import { RowActions, type RowAction } from "@/registry/row-actions/row-actions"

interface DemoRow {
  id: string
  title: string
  meta: string
}

const initialRows: readonly DemoRow[] = [
  { id: "1043", title: "Order #1043", meta: "Bennett A. · $4,200" },
  { id: "1042", title: "Order #1042", meta: "Peters S. · $1,750" },
]

export function RowActionsListView() {
  const [rows, setRows] = useState(initialRows)

  return (
    <div className="flex flex-col gap-2">
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No rows left</p>
      ) : null}
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2"
        >
          <div>
            <p className="text-sm font-medium">{row.title}</p>
            <p className="text-xs text-muted-foreground">{row.meta}</p>
          </div>
          <RowActions
            actions={[
              {
                id: "view",
                label: "View",
                icon: Eye,
                onSelect: () => notify.info(`Opened ${row.title}`),
              },
              {
                id: "edit",
                label: "Edit",
                icon: Pencil,
                onSelect: () => notify.info("Coming soon"),
              },
              {
                id: "delete",
                label: "Delete",
                icon: Trash2,
                tone: "danger",
                onSelect: () => {
                  setRows((previous) =>
                    previous.filter((item) => item.id !== row.id)
                  )
                  notify.danger(`${row.title} deleted`)
                },
              },
            ]}
          />
        </div>
      ))}
    </div>
  )
}

export function RowActionsDisabledView() {
  const actions: readonly RowAction[] = [
    {
      id: "view",
      label: "View",
      icon: Eye,
      onSelect: () => notify.info("View"),
    },
    {
      id: "edit",
      label: "Editing is unavailable without permission",
      icon: Pencil,
      onSelect: () => notify.info("Coming soon"),
      disabled: true,
    },
    {
      id: "delete",
      label: "Deleting is unavailable without permission",
      icon: Trash2,
      tone: "danger",
      onSelect: () => notify.danger("Deleted"),
      disabled: true,
    },
  ]

  return <RowActions actions={actions} />
}
