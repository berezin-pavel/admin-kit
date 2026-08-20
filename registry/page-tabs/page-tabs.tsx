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
  block?: boolean
  className?: string
}

export interface PageTabsStripProps {
  items: readonly PageTabsItem[]
  value: string
  onValueChange: (value: string) => void
  actions?: ReactNode
  className?: string
}

export function PageTabsStrip({
  items,
  value,
  onValueChange,
  actions,
  className,
}: PageTabsStripProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue)}
      className={cn("flex-1 gap-0", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsStripList items={items} />
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </Tabs>
  )
}

export function PageTabsPanels({
  items,
  value,
  className,
}: {
  items: readonly PageTabsItem[]
  value: string
  className?: string
}) {
  return (
    <Tabs value={value} onValueChange={() => {}} className={cn("gap-4", className)}>
      {items.map((item) => (
        <TabsContent key={item.id} value={item.id}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

function TabsStripList({ items }: { items: readonly PageTabsItem[] }) {
  return (
    <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0 group-data-horizontal/tabs:h-auto">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <TabsTrigger
            key={item.id}
            value={item.id}
            disabled={item.disabled}
            className="h-10 flex-none gap-3 rounded-md border-transparent px-2 text-[0.9375rem] font-medium text-sidebar-foreground shadow-none hover:bg-sidebar-active/50 hover:text-sidebar-active-foreground data-active:bg-sidebar-active data-active:font-semibold data-active:text-sidebar-active-foreground data-active:shadow-none! dark:data-active:border-transparent! dark:data-active:bg-sidebar-active"
          >
            {Icon ? (
              <span className="flex size-6 shrink-0 items-center justify-center">
                <Icon className="size-[1.125rem]" />
              </span>
            ) : null}
            {item.label}
            {item.badge}
          </TabsTrigger>
        )
      })}
    </TabsList>
  )
}

export function PageTabs({
  items,
  value,
  onValueChange,
  actions,
  breadcrumbs,
  blockId,
  block = true,
  className,
}: PageTabsProps) {
  const strip = (
    <>
      {breadcrumbs ? <div className="w-full pb-2">{breadcrumbs}</div> : null}
      <TabsStripList items={items} />
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </>
  )

  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue)}
      className={cn("gap-4", className)}
    >
      {block ? (
        <Block id={blockId ? `${blockId}.tabs` : undefined}>
          <CardContent className="flex flex-wrap items-center justify-between gap-2 py-2">
            {strip}
          </CardContent>
        </Block>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {strip}
        </div>
      )}
      {items.map((item) => (
        <TabsContent key={item.id} value={item.id}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
