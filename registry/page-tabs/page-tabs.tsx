"use client"

import type { ComponentType, ReactNode } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export interface PageTabsItem {
  id: string
  label: string
  icon?: ComponentType<{ className?: string }>
  badge?: ReactNode
  disabled?: boolean
  content: ReactNode
}

export interface PageTabsProps {
  items: readonly PageTabsItem[]
  value: string
  onValueChange: (value: string) => void
  actions?: ReactNode
  className?: string
}

export function PageTabs({
  items,
  value,
  onValueChange,
  actions,
  className,
}: PageTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue)}
      className={cn("gap-4", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 overflow-x-auto">
          <TabsList className="gap-1 bg-transparent p-0 group-data-horizontal/tabs:h-auto">
            {items.map((item) => {
              const Icon = item.icon

              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  disabled={item.disabled}
                  className="h-9 gap-2 rounded-md px-3 font-normal text-sidebar-foreground hover:bg-sidebar-accent/50 data-active:bg-sidebar-active data-active:text-sidebar-active-foreground data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-sidebar-active"
                >
                  {Icon ? (
                    <Icon data-icon="inline-start" className="size-4" />
                  ) : null}
                  {item.label}
                  {item.badge != null ? (
                    <span data-icon="inline-end">{item.badge}</span>
                  ) : null}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {items.map((item) => (
        <TabsContent key={item.id} value={item.id}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
