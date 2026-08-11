"use client"

import * as React from "react"
import type { ComponentType } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Hint } from "@/registry/hint/hint"

export interface RowAction {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
  onSelect: () => void
  tone?: "default" | "danger"
  disabled?: boolean
}

export interface RowActionsProps {
  actions: readonly RowAction[]
  className?: string
}

export function RowActions({
  actions,
  className,
}: RowActionsProps): React.ReactElement {
  return (
    <div className={cn("flex items-center justify-end gap-1", className)}>
      {actions.map((action) => {
        const Icon = action.icon

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
                disabled={action.disabled}
                onClick={action.onSelect}
              >
                <Icon
                  className={cn(action.tone === "danger" && "text-destructive")}
                />
              </Button>
            }
          />
        )
      })}
    </div>
  )
}
