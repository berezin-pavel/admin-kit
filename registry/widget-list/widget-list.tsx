import type { ComponentType, ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StateEmpty } from "@/registry/state-empty/state-empty"

export interface WidgetListItem {
  id: string
  title: string
  description?: string
  meta?: ReactNode
  icon?: ComponentType<{ className?: string }>
}

export interface WidgetListProps {
  title: string
  items: readonly WidgetListItem[]
  empty?: ReactNode
  emptyTitle?: string
  loading?: boolean
  className?: string
}

const skeletonItemCount = 3

export function WidgetList({
  title,
  items,
  empty,
  emptyTitle = "No data",
  loading = false,
  className,
}: WidgetListProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent aria-busy={loading || undefined}>
        {loading ? (
          <ul className="flex flex-col divide-y divide-border">
            {Array.from({ length: skeletonItemCount }, (_, index) => (
              <li
                key={index}
                className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-3"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3.5 w-48" />
                </div>
              </li>
            ))}
          </ul>
        ) : items.length === 0 ? (
          (empty ?? <StateEmpty title={emptyTitle} />)
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {items.map((item) => {
              const Icon = item.icon

              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-3"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {Icon ? (
                      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    ) : null}
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.description ? (
                        <span className="text-sm text-muted-foreground">
                          {item.description}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {item.meta ? (
                    <div className="shrink-0 pl-7 text-sm text-muted-foreground sm:pl-0 sm:text-right">
                      {item.meta}
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
