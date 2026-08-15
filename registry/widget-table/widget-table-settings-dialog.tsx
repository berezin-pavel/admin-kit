"use client"

import * as React from "react"
import { Columns3, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Hint } from "@/registry/hint/hint"

import { toggleHiddenColumnId, type WidgetTableColumn } from "./widget-table"

export interface WidgetTableSettingsDialogProps<Row> {
  columns: readonly WidgetTableColumn<Row>[]
  hiddenColumnIds: readonly string[]
  onHiddenColumnIdsChange: (ids: readonly string[]) => void
  settingsLabel: string
  settingsTitle: string
  columnsLabel: string
}

export function WidgetTableSettingsDialog<Row>({
  columns,
  hiddenColumnIds,
  onHiddenColumnIdsChange,
  settingsLabel,
  settingsTitle,
  columnsLabel,
}: WidgetTableSettingsDialogProps<Row>) {
  const [open, setOpen] = React.useState(false)
  const namedColumns = columns.filter((column) => column.title !== "")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Hint
        text={settingsLabel}
        render={
          <DialogTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={settingsLabel}
              >
                <Settings2 />
              </Button>
            }
          />
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{settingsTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-start gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <Columns3 />
              {columnsLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {namedColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={
                    column.alwaysVisible ||
                    !hiddenColumnIds.includes(column.id)
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
