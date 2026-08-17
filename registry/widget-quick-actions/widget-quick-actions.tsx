import type { ComponentType } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
  loading?: boolean
  gradient?: string
  className?: string
}

function gradientSurfaceStyle(gradient?: string) {
  return gradient
    ? {
        backgroundImage: `var(--gradient-${gradient})`,
        color: `var(--gradient-${gradient}-foreground)`,
      }
    : undefined
}

const skeletonActionRowCount = 2

export function WidgetQuickActions({
  title,
  actions,
  columns = 2,
  loading = false,
  gradient,
  className,
}: WidgetQuickActionsProps) {
  return (
    <Card className={className} style={gradientSurfaceStyle(gradient)}>
      {title ? (
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
      ) : null}
      <CardContent aria-busy={loading || undefined}>
        <div
          className={cn(
            "grid gap-2",
            columns === 3 ? "grid-cols-3" : "grid-cols-2"
          )}
        >
          {loading
            ? Array.from(
                { length: columns * skeletonActionRowCount },
                (_, index) => (
                  <Skeleton key={index} className="h-8 w-full rounded-lg" />
                )
              )
            : actions.map((action) => {
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
