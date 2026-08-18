"use client"

import type { ComponentType, ReactNode } from "react"

import { CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Block } from "@/registry/admin-appearance/block"

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
  breadcrumbs?: ReactNode
  blockId?: string
  className?: string
}

export function PageTabs({
  items,
  value,
  onValueChange,
  actions,
  breadcrumbs,
  blockId,
  className,
}: PageTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue)}
      className={cn("gap-4", className)}
    >
      <Block id={blockId ? `${blockId}.tabs` : undefined}>
        <CardContent className="flex flex-wrap items-center justify-between gap-2 py-2">
          {breadcrumbs ? <div className="w-full pb-2">{breadcrumbs}</div> : null}
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0 group-data-horizontal/tabs:h-auto">
            {items.map((item) => {
              const Icon = item.icon

              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  disabled={item.disabled}
                  className="h-10 flex-none gap-3 rounded-md border-transparent px-2 text-[0.9375rem] font-medium text-sidebar-foreground shadow-none hover:bg-sidebar-active/50 hover:text-sidebar-active-foreground data-active:bg-sidebar-active data-active:font-semibold data-active:text-sidebar-active-foreground data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-sidebar-active"
                >
                  {Icon ? (
                    <span className="flex size-6 shrink-0 items-center justify-center">
                      <Icon className="size-[1.125rem]" />
                    </span>
                  ) : null}
                  {item.label}
                  {item.badge != null ? <span>{item.badge}</span> : null}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : null}
        </CardContent>
      </Block>
      {items.map((item) => (
        <TabsContent key={item.id} value={item.id}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
