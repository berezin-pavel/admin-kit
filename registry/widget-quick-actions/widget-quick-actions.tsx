import type { ComponentType, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Block } from "@/registry/admin-appearance/block"
import type { GradientId } from "@/registry/admin-appearance/appearance-palette"

export interface QuickAction {
  id: string
  label: string
  icon?: ComponentType<{ className?: string }>
  onSelect: () => void
}

export type WidgetQuickActionsHeading = "regular" | "large"

export interface WidgetQuickActionsProps {
  title?: string
  actions: readonly QuickAction[]
  columns?: 2 | 3
  heading?: WidgetQuickActionsHeading
  summary?: ReactNode
  loading?: boolean
  gradient?: GradientId
  blockId?: string
  className?: string
}

const headingClassName: Record<WidgetQuickActionsHeading, string> = {
  regular: "text-[0.84375rem] font-semibold text-foreground",
  large: "text-[1.15rem] font-semibold text-foreground",
}

const skeletonActionRowCount = 2

export function WidgetQuickActions({
  title,
  actions,
  columns = 2,
  heading = "regular",
  summary,
  loading = false,
  gradient,
  blockId,
  className,
}: WidgetQuickActionsProps) {
  return (
    <Block id={blockId} gradient={gradient} headings className={className}>
      {title || summary ? (
        <CardHeader
          className={
            summary ? "flex flex-wrap items-center justify-between gap-4" : undefined
          }
        >
          {title ? (
            <CardTitle className={headingClassName[heading]}>{title}</CardTitle>
          ) : null}
          {summary ? (
            <span className="text-sm text-muted-foreground">{summary}</span>
          ) : null}
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
    </Block>
  )
}
