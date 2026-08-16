"use client"

import { Columns3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Hint } from "@/registry/hint/hint"

import { toggleHiddenColumnId, type WidgetTableColumn } from "./widget-table"

export interface WidgetTableColumnsMenuProps<Row> {
  columns: readonly WidgetTableColumn<Row>[]
  hiddenColumnIds: readonly string[]
  onHiddenColumnIdsChange: (ids: readonly string[]) => void
  label: string
}

export function WidgetTableColumnsMenu<Row>({
  columns,
  hiddenColumnIds,
  onHiddenColumnIdsChange,
  label,
}: WidgetTableColumnsMenuProps<Row>) {
  const namedColumns = columns.filter((column) => column.title !== "")

  return (
    <DropdownMenu>
      <Hint
        text={label}
        render={
          <DropdownMenuTrigger
            aria-label={label}
            render={
              <Button type="button" variant="outline" size="icon">
                <Columns3 />
              </Button>
            }
          />
        }
      />
      <DropdownMenuContent align="end">
        {namedColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={
              column.alwaysVisible || !hiddenColumnIds.includes(column.id)
            }
            disabled={column.alwaysVisible}
            onCheckedChange={() =>
              onHiddenColumnIdsChange(
                toggleHiddenColumnId(hiddenColumnIds, column.id)
              )
            }
          >
            {column.title}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
