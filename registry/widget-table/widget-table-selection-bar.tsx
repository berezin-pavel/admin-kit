"use client"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Hint } from "@/registry/hint/hint"

import type { WidgetTableSelectionAction } from "./widget-table"

export interface WidgetTableSelectionBarProps {
  count: number
  actions?: readonly WidgetTableSelectionAction[]
  selectedLabel: (count: number) => string
  clearLabel: string
  onClear: () => void
  allPageSelected: boolean
  totalCount?: number
  onSelectAllMatching?: () => void
  selectAllMatchingLabel: (count: number) => string
}

export function WidgetTableSelectionBar({
  count,
  actions,
  selectedLabel,
  clearLabel,
  onClear,
  allPageSelected,
  totalCount,
  onSelectAllMatching,
  selectAllMatchingLabel,
}: WidgetTableSelectionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-foreground">
        {selectedLabel(count)}
      </span>
      {allPageSelected &&
      onSelectAllMatching &&
      totalCount !== undefined &&
      totalCount > count ? (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="[[data-gradient]_&]:text-foreground [[data-gradient]_&]:underline"
          onClick={onSelectAllMatching}
        >
          {selectAllMatchingLabel(totalCount)}
        </Button>
      ) : null}
      {actions && actions.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1">
          {actions.map((action) => {
            const Icon = action.icon

            if (!Icon) {
              return (
                <Button
                  key={action.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={action.onSelect}
                  className={cn(
                    action.tone === "danger" && "text-destructive"
                  )}
                >
                  {action.label}
                </Button>
              )
            }

            return (
              <Hint
                key={action.id}
                text={action.label}
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={action.label}
                    onClick={action.onSelect}
                    className={cn(
                      action.tone === "danger" && "text-destructive"
                    )}
                  >
                    <Icon />
                  </Button>
                }
              />
            )
          })}
        </div>
      ) : null}
      <Hint
        text={clearLabel}
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={clearLabel}
            onClick={onClear}
          >
            <X />
          </Button>
        }
      />
    </div>
  )
}
