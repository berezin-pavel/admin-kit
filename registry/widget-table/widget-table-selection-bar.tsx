"use client"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { WidgetTableSelectionAction } from "./widget-table"

export interface WidgetTableSelectionBarProps {
  count: number
  actions?: readonly WidgetTableSelectionAction[]
  selectedLabel: (count: number) => string
  clearLabel: string
  onClear: () => void
}

export function WidgetTableSelectionBar({
  count,
  actions,
  selectedLabel,
  clearLabel,
  onClear,
}: WidgetTableSelectionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-foreground">
        {selectedLabel(count)}
      </span>
      {actions && actions.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1">
          {actions.map((action) => {
            const Icon = action.icon

            return (
              <Button
                key={action.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={action.onSelect}
                className={cn(action.tone === "danger" && "text-destructive")}
              >
                {Icon ? <Icon className="size-4" /> : null}
                {action.label}
              </Button>
            )
          })}
        </div>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={clearLabel}
        onClick={onClear}
      >
        <X />
      </Button>
    </div>
  )
}
