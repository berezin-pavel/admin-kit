import type { ComponentType, ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  className?: string
}

export function WidgetList({
  title,
  items,
  empty,
  className,
}: WidgetListProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          (empty ?? <StateEmpty title="No data" />)
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {items.map((item) => {
              const Icon = item.icon

              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  {Icon ? (
                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  ) : null}
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium">{item.title}</span>
                    {item.description ? (
                      <span className="text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    ) : null}
                  </div>
                  {item.meta ? (
                    <div className="shrink-0 text-sm text-muted-foreground">
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
