import type { ComponentType } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface QuickAction {
  id: string
  label: string
  icon?: ComponentType<{ className?: string }>
  onSelect: () => void
}

export interface WidgetQuickActionsProps {
  title?: string
  actions: readonly QuickAction[]
  columns?: 2 | 3
  className?: string
}

export function WidgetQuickActions({
  title,
  actions,
  columns = 2,
  className,
}: WidgetQuickActionsProps) {
  return (
    <Card className={className}>
      {title ? (
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
      ) : null}
      <CardContent>
        <div
          className={cn(
            "grid gap-2",
            columns === 3 ? "grid-cols-3" : "grid-cols-2"
          )}
        >
          {actions.map((action) => {
            const Icon = action.icon

            return (
              <Button
                key={action.id}
                type="button"
                variant="outline"
                className="w-full min-w-0 justify-start"
                onClick={action.onSelect}
              >
                {Icon ? <Icon className="shrink-0" /> : null}
                <span className="truncate">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
