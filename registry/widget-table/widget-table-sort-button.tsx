"use client"

import type { ReactNode } from "react"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

import type { WidgetTableSort } from "./widget-table"

export interface WidgetTableSortButtonProps {
  columnId: string
  align?: "left" | "right"
  sort?: WidgetTableSort
  onSortChange: (sort: WidgetTableSort | undefined) => void
  children: ReactNode
}

export function getNextSort(
  columnId: string,
  current: WidgetTableSort | undefined
): WidgetTableSort | undefined {
  if (!current || current.columnId !== columnId) {
    return { columnId, direction: "asc" }
  }
  if (current.direction === "asc") {
    return { columnId, direction: "desc" }
  }
  return undefined
}

export function WidgetTableSortButton({
  columnId,
  align,
  sort,
  onSortChange,
  children,
}: WidgetTableSortButtonProps) {
  const isActive = sort?.columnId === columnId

  return (
    <button
      type="button"
      onClick={() => onSortChange(getNextSort(columnId, sort))}
      className={cn(
        "flex h-10 w-full items-center gap-1 px-2 font-medium whitespace-nowrap text-foreground transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
        align === "right" && "justify-end"
      )}
    >
      {children}
      {isActive && sort ? (
        sort.direction === "asc" ? (
          <ChevronUp className="size-4" aria-hidden="true" />
        ) : (
          <ChevronDown className="size-4" aria-hidden="true" />
        )
      ) : (
        <ChevronsUpDown
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </button>
  )
}
