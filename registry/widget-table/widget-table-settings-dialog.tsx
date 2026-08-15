"use client"

import * as React from "react"
import { Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
  const id = React.useId()
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
        <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
          <legend className="px-0 text-sm font-medium text-foreground">
            {columnsLabel}
          </legend>
          <div className="flex flex-col gap-2">
            {namedColumns.map((column) => {
              const checkboxId = `${id}-${column.id}`

              return (
                <div key={column.id} className="flex items-center gap-2">
                  <Checkbox
                    id={checkboxId}
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
                  />
                  <Label htmlFor={checkboxId}>{column.title}</Label>
                </div>
              )
            })}
          </div>
        </fieldset>
      </DialogContent>
    </Dialog>
  )
}
